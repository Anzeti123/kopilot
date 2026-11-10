/*
 * Kopilot: 3D pogled leta IGC. Teče v iframe (Flutter splet) ali WebView (Android, iOS).
 *
 * Flutter → stran:  window.kp.cmd({cmd: ...})  (WebView: runJavaScript; splet: postMessage {kpToMap: ...})
 *   {cmd: 'flight', pts: [[lon, lat, višina], ...]}   sled od vzleta do pristanka (višina v m nad morjem)
 *   {cmd: 'pos', p: [lon, lat, višina, kurz, nagib, naklon]}  položaj in lega letala (stopinje)
 *   {cmd: 'follow', on: true|false}                   kamera sledi letalu
 *   {cmd: 'curtain', on: true|false}                  zavesa od sledi do tal
 *   {cmd: 'fit'}                                      pokaži cel let
 * stran → Flutter:  {event: 'ready'} | {event: 'error', message}
 *   (WebView: kanal KopilotMap; splet: parent.postMessage {kpFromMap: ...})
 *
 * Relief: Mapterhorn (terrarium). Podlaga: Esri World Imagery (brez ključa, z navedbo vira).
 * Sled je narisana v lastnem sloju WebGL na zapisani višini, z »zaveso« do tal; teren jo zakrije,
 * kjer je za goro.
 */
(function () {
  'use strict';

  function send(msg) {
    try {
      if (window.KopilotMap && window.KopilotMap.postMessage) window.KopilotMap.postMessage(JSON.stringify(msg));
      else if (window.parent && window.parent !== window) window.parent.postMessage({ kpFromMap: msg }, '*');
    } catch (e) { /* ni prejemnika */ }
  }
  window.addEventListener('error', function (e) { send({ event: 'log', message: String(e.message || e) }); });

  if (!window.maplibregl) { send({ event: 'error', message: 'maplibre' }); return; }

  var EXAGGERATION = 1;

  var map;
  try {
  map = new maplibregl.Map({
    container: 'map',
    center: [14.8, 46.1], zoom: 7, maxPitch: 80, attributionControl: false,
    locale: { 'NavigationControl.ZoomIn': 'Približaj', 'NavigationControl.ZoomOut': 'Oddalji',
              'NavigationControl.ResetBearing': 'Proti severu' },
    style: {
      version: 8,
      sources: {
        sat: { type: 'raster', tileSize: 256, maxzoom: 18,
               tiles: ['https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'],
               attribution: 'Posnetki © <a href="https://www.esri.com/" target="_blank">Esri</a>, Maxar, Earthstar Geographics' },
        dem: { type: 'raster-dem', tiles: ['https://tiles.mapterhorn.com/{z}/{x}/{y}.webp'], tileSize: 512, maxzoom: 14,
               encoding: 'terrarium', attribution: '<a href="https://mapterhorn.com/attribution" target="_blank">© Mapterhorn</a>' }
      },
      layers: [
        { id: 'bg', type: 'background', paint: { 'background-color': '#cfdbe3' } },
        { id: 'sat', type: 'raster', source: 'sat', paint: { 'raster-fade-duration': 150 } }
      ]
    }
  });
  } catch (e) {
    // Najpogosteje ni WebGL.
    send({ event: 'error', message: String(e && e.message || e) });
    return;
  }
  map.addControl(new maplibregl.AttributionControl({ compact: true }), 'bottom-right');
  map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), 'top-right');
  map.addControl(new maplibregl.ScaleControl({ unit: 'metric' }), 'bottom-left');

  // ---------- podatki leta ----------
  var flight = null;   // {x, y, alt: Float64Array, colors: Float32Array, bounds}
  var plane = null;    // [lon, lat, alt]
  var follow = false;
  var curtain = true;  // zavesa od sledi do tal
  var shift = 0;       // poravnava višine s terenom na vzletu (GPS nad elipsoidom, QNH ...)
  var shiftDone = false;
  var origin = null;   // MercatorCoordinate prve točke (sidrišče za natančnost float32)
  var mpu = 1;         // mercatorske enote na meter
  var dirty = true;

  function hsv(h, s, v) {
    var f = function (n) { var k = (n + h / 60) % 6; return v - v * s * Math.max(0, Math.min(k, 4 - k, 1)); };
    return [f(5), f(3), f(1)];
  }
  // Ista lestvica kot 2D zemljevid: modra (nizko) → rdeča (visoko).
  function altColor(a, lo, hi) {
    var t = hi > lo ? Math.min(1, Math.max(0, (a - lo) / (hi - lo))) : 0;
    return hsv(240 * (1 - t), 0.85, 0.9);
  }

  function setFlight(pts) {
    if (!pts || pts.length < 2) return;
    origin = maplibregl.MercatorCoordinate.fromLngLat([pts[0][0], pts[0][1]], 0);
    mpu = maplibregl.MercatorCoordinate.fromLngLat([pts[0][0], pts[0][1]], 1).z;
    var n = pts.length, x = new Float64Array(n), y = new Float64Array(n), alt = new Float64Array(n);
    var lo = Infinity, hi = -Infinity, w = 180, e = -180, s = 90, nn = -90;
    for (var i = 0; i < n; i++) {
      var m = maplibregl.MercatorCoordinate.fromLngLat([pts[i][0], pts[i][1]], 0);
      x[i] = m.x - origin.x; y[i] = m.y - origin.y; alt[i] = pts[i][2];
      lo = Math.min(lo, alt[i]); hi = Math.max(hi, alt[i]);
      w = Math.min(w, pts[i][0]); e = Math.max(e, pts[i][0]); s = Math.min(s, pts[i][1]); nn = Math.max(nn, pts[i][1]);
    }
    var colors = new Float32Array(n * 3);
    for (var j = 0; j < n; j++) { var c = altColor(alt[j], lo, hi); colors[j * 3] = c[0]; colors[j * 3 + 1] = c[1]; colors[j * 3 + 2] = c[2]; }
    flight = { x: x, y: y, alt: alt, colors: colors, bounds: [[w, s], [e, nn]], start: pts[0] };
    shift = 0; shiftDone = false; dirty = true;
    fit(0);
  }

  function fit(duration) {
    if (!flight) return;
    var cam = map.cameraForBounds(flight.bounds, { padding: 40 });
    if (!cam) return;
    map.easeTo({ center: cam.center, zoom: Math.max(1, cam.zoom - 0.3), pitch: 55, bearing: 0, duration: duration });
  }

  // Ko je relief vzleta naložen: zapisana višina na tleh naj se ujema s terenom (do 150 m razlike).
  function alignToTerrain() {
    if (shiftDone || !flight || !map.terrain) return;
    var rel = map.queryTerrainElevation(flight.start);
    if (rel === null || rel === undefined) return;
    var ground = (rel + map.transform.elevation) / EXAGGERATION;
    var d = ground - flight.start[2];
    shift = Math.abs(d) < 150 ? d : 0;
    shiftDone = true;
    map.triggerRepaint();
  }

  // ---------- sloj WebGL ----------
  function compile(gl, vs, fs) {
    function sh(type, src) {
      var s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
      return s;
    }
    var p = gl.createProgram();
    gl.attachShader(p, sh(gl.VERTEX_SHADER, vs)); gl.attachShader(p, sh(gl.FRAGMENT_SHADER, fs)); gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p));
    return p;
  }

  // Zavesa: trikotniki od morske gladine do sledi (teren zakrije del pod tlemi).
  var CURTAIN_VS =
    'uniform mat4 u_matrix; attribute vec3 a_pos; attribute vec4 a_color; varying vec4 v_color;' +
    'void main() { gl_Position = u_matrix * vec4(a_pos, 1.0); v_color = a_color; }';
  var COLOR_FS = 'precision mediump float; varying vec4 v_color; void main() { gl_FragColor = vec4(v_color.rgb * v_color.a, v_color.a); }';

  // Črta z debelino v pikslih: vsak odsek je pravokotnik, razširjen pravokotno na smer na zaslonu.
  var LINE_VS =
    'uniform mat4 u_matrix; uniform vec2 u_half; uniform float u_width;' +
    'attribute vec3 a_a; attribute vec3 a_b; attribute vec2 a_ts; attribute vec4 a_color; varying vec4 v_color;' +
    'void main() {' +
    '  vec4 ca = u_matrix * vec4(a_a, 1.0); vec4 cb = u_matrix * vec4(a_b, 1.0);' +
    '  if (ca.w <= 0.0 || cb.w <= 0.0) { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); return; }' +
    '  vec2 sa = ca.xy / ca.w * u_half; vec2 sb = cb.xy / cb.w * u_half; vec2 d = sb - sa; float l = length(d);' +
    '  vec2 n = l > 0.0001 ? vec2(-d.y, d.x) / l : vec2(0.0, 1.0);' +
    '  vec4 c = a_ts.x < 0.5 ? ca : cb;' +
    '  c.xy += n * a_ts.y * u_width / u_half * c.w;' +
    '  gl_Position = c; v_color = a_color; }';

  // ---------- model jadralnega letala ----------
  // Lokalne koordinate v metrih: x desno (krilo), y naprej, z gor. Razpon 15 m, dolžina 7,5 m.
  var GLIDER = (function () {
    var W = [0.97, 0.97, 0.96], C = [0.16, 0.22, 0.32], R = [0.86, 0.16, 0.12], tris = [];
    function tri(a, b, c, col) { tris.push([a, b, c, col]); }
    function quad(a, b, c, d, col) { tri(a, b, c, col); tri(a, c, d, col); }
    // trup: prerezi [y, polovična širina, spodaj, zgoraj]
    var sec = [[3.4, 0.02, 0.02, 0.06], [2.6, 0.28, -0.2, 0.3], [1.2, 0.33, -0.3, 0.58], [0.2, 0.3, -0.28, 0.45],
               [-1.2, 0.2, -0.18, 0.25], [-3.0, 0.09, -0.06, 0.12], [-4.1, 0.06, -0.03, 0.1]];
    function ring(q) { var m = (q[2] + q[3]) / 2; return [[0, q[0], q[3]], [q[1], q[0], m], [0, q[0], q[2]], [-q[1], q[0], m]]; }
    for (var i = 0; i < sec.length - 1; i++) {
      var r1 = ring(sec[i]), r2 = ring(sec[i + 1]);
      for (var k = 0; k < 4; k++) {
        var k2 = (k + 1) % 4, canopy = (k === 0 || k === 3) && i >= 1 && i <= 2;
        quad(r1[k], r1[k2], r2[k2], r2[k], canopy ? C : W);
      }
    }
    // krilo z rahlim V (3°): vpetje pri x = 0,3, konica pri 7,5, zadnjih 0,6 m rdečih
    function wing(x) {
      var t = (Math.abs(x) - 0.3) / 7.2;
      return { le: 0.35 - 0.3 * t, te: -0.45 + 0.15 * t, z: 0.15 + Math.abs(x) * 0.052 };
    }
    function panel(x0, x1, col) {
      var a = wing(x0), b = wing(x1);
      quad([x0, a.le, a.z + 0.07], [x1, b.le, b.z + 0.05], [x1, b.te, b.z], [x0, a.te, a.z], col);
      quad([x0, a.le, a.z - 0.01], [x0, a.te, a.z - 0.01], [x1, b.te, b.z - 0.01], [x1, b.le, b.z - 0.01], col);
    }
    [1, -1].forEach(function (sd) { panel(0.3 * sd, 6.9 * sd, W); panel(6.9 * sd, 7.5 * sd, R); });
    // višinski stabilizator (T-rep) in smerni stabilizator
    quad([-1.5, -3.75, 1.25], [1.5, -3.75, 1.25], [1.5, -4.05, 1.25], [-1.5, -4.05, 1.25], W);
    quad([-1.5, -3.75, 1.22], [-1.5, -4.05, 1.22], [1.5, -4.05, 1.22], [1.5, -3.75, 1.22], W);
    quad([0, -3.0, 0.1], [0, -3.55, 1.25], [0, -4.15, 1.25], [0, -4.1, 0.05], W);
    return tris;
  })();

  // Model je vedno vsaj ~60 px širok, sicer bi bil pri pregledu celega leta neviden.
  function gliderScale(lat) {
    var metersPerPx = 40075016.686 * Math.cos(lat * Math.PI / 180) / (512 * Math.pow(2, map.getZoom()));
    return Math.max(1, 60 * metersPerPx / 15);
  }

  // Oglišča modela v prostoru sloja: (x, y v mercatorskih enotah od sidrišča, z v metrih) + barva.
  function gliderVertices(p, px, py, pz) {
    var h = (p[3] || 0) * Math.PI / 180, r = (p[4] || 0) * Math.PI / 180, q = (p[5] || 0) * Math.PI / 180;
    var S = gliderScale(p[1]), ch = Math.cos(h), sh = Math.sin(h), cr = Math.cos(r), sr = Math.sin(r), cq = Math.cos(q), sq = Math.sin(q);
    var L = [-0.42, 0.5, 0.76]; // svetloba s severozahoda, od zgoraj
    function world(v) {
      // nagib okoli vzdolžne osi (desno krilo navzdol = +), naklon (nos gor = +), nato kurz
      var x1 = v[0] * cr + v[2] * sr, z1 = v[2] * cr - v[0] * sr, y1 = v[1];
      var y2 = y1 * cq - z1 * sq, z2 = z1 * cq + y1 * sq;
      return [x1 * ch + y2 * sh, -x1 * sh + y2 * ch, z2]; // vzhod, sever, gor
    }
    var out = new Float32Array(GLIDER.length * 3 * 7), o = 0;
    GLIDER.forEach(function (t) {
      var a = world(t[0]), b = world(t[1]), c = world(t[2]);
      var ux = b[0] - a[0], uy = b[1] - a[1], uz = b[2] - a[2], vx = c[0] - a[0], vy = c[1] - a[1], vz = c[2] - a[2];
      var nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx, nl = Math.sqrt(nx * nx + ny * ny + nz * nz) || 1;
      var light = 0.45 + 0.55 * Math.abs((nx * L[0] + ny * L[1] + nz * L[2]) / nl);
      [a, b, c].forEach(function (w) {
        out[o++] = px + w[0] * S * mpu; out[o++] = py - w[1] * S * mpu; out[o++] = pz + w[2] * S;
        out[o++] = t[3][0] * light; out[o++] = t[3][1] * light; out[o++] = t[3][2] * light; out[o++] = 1;
      });
    });
    return out;
  }
  var layer = {
    id: 'flight', type: 'custom', renderingMode: '3d',
    onAdd: function (m, gl) {
      this.curtain = compile(gl, CURTAIN_VS, COLOR_FS);
      this.line = compile(gl, LINE_VS, COLOR_FS);
      this.bufCurtain = gl.createBuffer(); this.bufLine = gl.createBuffer();
      this.bufPole = gl.createBuffer(); this.bufGlider = gl.createBuffer();
    },
    build: function (gl) {
      var f = flight, n = f.x.length;
      // zavesa: 6 oglišč na odsek, (x, y, z, r, g, b, a)
      var cv = new Float32Array((n - 1) * 6 * 7), k = 0;
      // črta: 6 oglišč na odsek, (ax, ay, az, bx, by, bz, t, side, r, g, b, a)
      var lv = new Float32Array((n - 1) * 6 * 12), q = 0;
      function cvx(i, top) {
        cv[k++] = f.x[i]; cv[k++] = f.y[i]; cv[k++] = top ? f.alt[i] : -500;
        cv[k++] = f.colors[i * 3]; cv[k++] = f.colors[i * 3 + 1]; cv[k++] = f.colors[i * 3 + 2]; cv[k++] = top ? 0.45 : 0.12;
      }
      function lvx(a, b, t, side, ci) {
        lv[q++] = f.x[a]; lv[q++] = f.y[a]; lv[q++] = f.alt[a];
        lv[q++] = f.x[b]; lv[q++] = f.y[b]; lv[q++] = f.alt[b];
        lv[q++] = t; lv[q++] = side;
        lv[q++] = f.colors[ci * 3]; lv[q++] = f.colors[ci * 3 + 1]; lv[q++] = f.colors[ci * 3 + 2]; lv[q++] = 1;
      }
      for (var i = 0; i < n - 1; i++) {
        var j = i + 1;
        cvx(i, false); cvx(i, true); cvx(j, true);
        cvx(i, false); cvx(j, true); cvx(j, false);
        lvx(i, j, 0, -1, i); lvx(i, j, 0, 1, i); lvx(i, j, 1, 1, j);
        lvx(i, j, 0, -1, i); lvx(i, j, 1, 1, j); lvx(i, j, 1, -1, j);
      }
      gl.bindBuffer(gl.ARRAY_BUFFER, this.bufCurtain); gl.bufferData(gl.ARRAY_BUFFER, cv, gl.STATIC_DRAW);
      gl.bindBuffer(gl.ARRAY_BUFFER, this.bufLine); gl.bufferData(gl.ARRAY_BUFFER, lv, gl.STATIC_DRAW);
      this.count = (n - 1) * 6;
      dirty = false;
    },
    render: function (gl, matrix) {
      if (!flight) return;
      if (dirty) this.build(gl);
      // Sidrišče in višina: matrika MapLibre (4.x) ne upošteva višine središča kamere nad
      // terenom (maplibre-gl-js #3797), zato jo odštejemo sami.
      var zOff = (shift * EXAGGERATION - map.transform.elevation) * mpu;
      var m = mul(matrix, [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, mpu * EXAGGERATION, 0, origin.x, origin.y, zOff, 1]);
      var u = new Float32Array(m);
      var half = [gl.drawingBufferWidth / 2, gl.drawingBufferHeight / 2];
      var dpr = window.devicePixelRatio || 1;

      gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      gl.depthMask(false);

      // zavesa
      if (curtain) {
      gl.useProgram(this.curtain);
      gl.uniformMatrix4fv(gl.getUniformLocation(this.curtain, 'u_matrix'), false, u);
      bind(gl, this.curtain, this.bufCurtain, 28, [['a_pos', 3, 0], ['a_color', 4, 12]]);
      gl.drawArrays(gl.TRIANGLES, 0, this.count);
      unbind(gl, this.curtain, ['a_pos', 'a_color']);
      }

      // sled
      gl.useProgram(this.line);
      gl.uniformMatrix4fv(gl.getUniformLocation(this.line, 'u_matrix'), false, u);
      gl.uniform2fv(gl.getUniformLocation(this.line, 'u_half'), half);
      gl.uniform1f(gl.getUniformLocation(this.line, 'u_width'), (curtain ? 1.6 : 2.2) * dpr);
      bind(gl, this.line, this.bufLine, 48, [['a_a', 3, 0], ['a_b', 3, 12], ['a_ts', 2, 24], ['a_color', 4, 32]]);
      gl.drawArrays(gl.TRIANGLES, 0, this.count);

      if (plane) {
        // navpična črta od tal do letala
        var mc = maplibregl.MercatorCoordinate.fromLngLat([plane[0], plane[1]], 0);
        var px = mc.x - origin.x, py = mc.y - origin.y, pz = plane[2];
        var pole = new Float32Array([
          px, py, -500, px, py, pz, 0, -1, 0.07, 0.12, 0.2, 1,
          px, py, -500, px, py, pz, 0, 1, 0.07, 0.12, 0.2, 1,
          px, py, -500, px, py, pz, 1, 1, 0.07, 0.12, 0.2, 1,
          px, py, -500, px, py, pz, 0, -1, 0.07, 0.12, 0.2, 1,
          px, py, -500, px, py, pz, 1, 1, 0.07, 0.12, 0.2, 1,
          px, py, -500, px, py, pz, 1, -1, 0.07, 0.12, 0.2, 1]);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.bufPole); gl.bufferData(gl.ARRAY_BUFFER, pole, gl.DYNAMIC_DRAW);
        gl.uniform1f(gl.getUniformLocation(this.line, 'u_width'), 1.0 * dpr);
        bind(gl, this.line, this.bufPole, 48, [['a_a', 3, 0], ['a_b', 3, 12], ['a_ts', 2, 24], ['a_color', 4, 32]]);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        unbind(gl, this.line, ['a_a', 'a_b', 'a_ts', 'a_color']);

        // jadralno letalo: model iz trikotnikov po kurzu, nagibu in naklonu
        gl.depthMask(true);
        gl.useProgram(this.curtain);
        gl.uniformMatrix4fv(gl.getUniformLocation(this.curtain, 'u_matrix'), false, u);
        var gv = gliderVertices(plane, px, py, pz);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.bufGlider); gl.bufferData(gl.ARRAY_BUFFER, gv, gl.DYNAMIC_DRAW);
        bind(gl, this.curtain, this.bufGlider, 28, [['a_pos', 3, 0], ['a_color', 4, 12]]);
        gl.drawArrays(gl.TRIANGLES, 0, gv.length / 7);
        unbind(gl, this.curtain, ['a_pos', 'a_color']);
      } else {
        unbind(gl, this.line, ['a_a', 'a_b', 'a_ts', 'a_color']);
      }
      gl.depthMask(true);
    }
  };

  function bind(gl, prog, buf, stride, attrs) {
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    attrs.forEach(function (a) {
      var loc = gl.getAttribLocation(prog, a[0]);
      if (loc < 0) return;
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, a[1], gl.FLOAT, false, stride, a[2]);
    });
  }
  function unbind(gl, prog, names) {
    names.forEach(function (n) { var loc = gl.getAttribLocation(prog, n); if (loc >= 0) gl.disableVertexAttribArray(loc); });
  }
  // Množenje matrik 4 × 4 po stolpcih (v dvojni natančnosti).
  function mul(a, b) {
    var o = new Array(16);
    for (var c = 0; c < 4; c++) for (var r = 0; r < 4; r++) {
      var s = 0; for (var k = 0; k < 4; k++) s += a[k * 4 + r] * b[c * 4 + k];
      o[c * 4 + r] = s;
    }
    return o;
  }

  // ---------- ukazi ----------
  var ready = false, queue = [];
  function cmd(c) {
    if (!c) return;
    if (typeof c === 'string') { try { c = JSON.parse(c); } catch (e) { return; } }
    if (!ready) { queue.push(c); return; }
    switch (c.cmd) {
      case 'flight': setFlight(c.pts); break;
      case 'pos':
        plane = c.p;
        if (follow && plane) map.jumpTo({ center: [plane[0], plane[1]] });
        map.triggerRepaint();
        break;
      case 'follow':
        follow = !!c.on;
        if (follow && plane) map.easeTo({ center: [plane[0], plane[1]], zoom: Math.max(map.getZoom(), 12), duration: 600 });
        break;
      case 'fit': fit(600); break;
      case 'curtain': curtain = !!c.on; map.triggerRepaint(); break;
    }
  }
  window.kp = { cmd: cmd };
  window.addEventListener('message', function (e) {
    if (e.source === window.parent && e.data && e.data.kpToMap) cmd(e.data.kpToMap);
  });

  map.on('load', function () {
    map.setTerrain({ source: 'dem', exaggeration: EXAGGERATION });
    try { map.setSky({ 'sky-color': '#9ec5e8', 'horizon-color': '#dfeaf2', 'sky-horizon-blend': 0.5 }); } catch (e) { /* starejši MapLibre */ }
    map.addLayer(layer);
    ready = true;
    var q = queue; queue = [];
    q.forEach(cmd);
    send({ event: 'ready' });
  });
  map.on('idle', alignToTerrain);
  window.__kpMap = map; // za razhroščevanje
})();
