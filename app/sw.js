// Service worker za Kopilot (PWA). Ustvari ga tools/build_pwa.py –
// tega dokumenta ne urejaj v build/web, ampak v tools/pwa_sw_template.js.
//
// Delovanje:
// - Ob namestitvi shrani vse datoteke te različice v predpomnilnik
//   (aplikacija nato deluje brez interneta). Datoteke, ki se od prejšnje
//   različice niso spremenile, prepiše iz starega predpomnilnika, zato
//   posodobitev prenese samo spremembe.
// - Shrani tudi knjižnice Firebase z www.gstatic.com, ki jih aplikacija
//   naloži ob zagonu; brez njih se brez povezave ne bi odprla.
// - Vse zahteve postreže iz predpomnilnika svoje različice, zato se stara in
//   nova koda nikoli ne pomešata.
// - Nova različica se namesti v ozadju in počaka. Aktivira se, ko uporabnik
//   pritisne »Osveži« ali ko so vsa okna aplikacije zaprta.

const VERSION = "e20eda2832c7";
const CACHE = 'kopilot-' + VERSION;
// [{ u: pot ali polni URL, h: zgoščena vsebina }]
const FILES = [
  {
    "u": ".last_build_id",
    "h": "8863db679a0d1da7"
  },
  {
    "u": "assets/AssetManifest.bin",
    "h": "cc9725b44324a7b0"
  },
  {
    "u": "assets/AssetManifest.bin.json",
    "h": "70ebb916b72cd2ce"
  },
  {
    "u": "assets/FontManifest.json",
    "h": "f95a00d96eb1518f"
  },
  {
    "u": "assets/NOTICES",
    "h": "0b4ae62768ef49fd"
  },
  {
    "u": "assets/assets/branding/logo_symbol.png",
    "h": "e353323298f42e05"
  },
  {
    "u": "assets/assets/content/sl/manual/aerotow_launch.png",
    "h": "9e42cc52de759766"
  },
  {
    "u": "assets/assets/content/sl/manual/aircraft.json",
    "h": "9009f69c9aed65d8"
  },
  {
    "u": "assets/assets/content/sl/manual/airfields.json",
    "h": "9c78c7f470cb6c70"
  },
  {
    "u": "assets/assets/content/sl/manual/checklists.json",
    "h": "7af89f334c102e65"
  },
  {
    "u": "assets/assets/content/sl/manual/circuit_route.png",
    "h": "61c26f216b75c467"
  },
  {
    "u": "assets/assets/content/sl/manual/glossary.json",
    "h": "0b6503de3cf9427b"
  },
  {
    "u": "assets/assets/content/sl/manual/mnemonics.json",
    "h": "ef546c9f50c82199"
  },
  {
    "u": "assets/assets/content/sl/manual/preflight_route.png",
    "h": "624db8b9f479ec90"
  },
  {
    "u": "assets/assets/content/sl/manual/procedures.json",
    "h": "224653c87cc479f7"
  },
  {
    "u": "assets/assets/content/sl/manual/radio_conversations.json",
    "h": "435758351ddb7a37"
  },
  {
    "u": "assets/assets/content/sl/manual/signals.json",
    "h": "8a96fa84101812e1"
  },
  {
    "u": "assets/assets/content/sl/manual/signals_aerotow.png",
    "h": "87a8052517e11fe4"
  },
  {
    "u": "assets/assets/content/sl/manual/signals_winch.png",
    "h": "720c1662870406ca"
  },
  {
    "u": "assets/assets/content/sl/manual/spin_recovery.png",
    "h": "6b7ec609093a287a"
  },
  {
    "u": "assets/assets/content/sl/manual/winch_launch.png",
    "h": "9c9972c8d0427a12"
  },
  {
    "u": "assets/assets/content/sl/questions/10_air_law.json",
    "h": "a9dac707a0734f57"
  },
  {
    "u": "assets/assets/content/sl/questions/20_human_performance.json",
    "h": "9223b672acb188e5"
  },
  {
    "u": "assets/assets/content/sl/questions/30_meteorology.json",
    "h": "fd37b128c6cae937"
  },
  {
    "u": "assets/assets/content/sl/questions/40_communication.json",
    "h": "0faa1d8038ef2a80"
  },
  {
    "u": "assets/assets/content/sl/questions/51_principles_of_flight_aeroplane.json",
    "h": "474c145c8adfb344"
  },
  {
    "u": "assets/assets/content/sl/questions/60_operational_procedures.json",
    "h": "661e3838dc911031"
  },
  {
    "u": "assets/assets/content/sl/questions/70_flight_performance_and_planning.json",
    "h": "cbc0d4c95fa8d1c7"
  },
  {
    "u": "assets/assets/content/sl/questions/80_aircraft_general_knowledge.json",
    "h": "3bc701d7f83c90ad"
  },
  {
    "u": "assets/assets/content/sl/questions/90_navigation.json",
    "h": "050a86af9bf14abc"
  },
  {
    "u": "assets/assets/content/sl/questions/images/E10-200511-00254_alw-020.png",
    "h": "8bbaf547ed905bc9"
  },
  {
    "u": "assets/assets/content/sl/questions/images/E10-200511-00256_alw-010.png",
    "h": "94212a708b9a0c51"
  },
  {
    "u": "assets/assets/content/sl/questions/images/E10-200511-00259_alw-011.png",
    "h": "7b41279ff3d8f940"
  },
  {
    "u": "assets/assets/content/sl/questions/images/E20-200511-00093_hpl-002.png",
    "h": "32baf83baf46c8c5"
  },
  {
    "u": "assets/assets/content/sl/questions/images/E20-200511-00096_hpl-002.png",
    "h": "32baf83baf46c8c5"
  },
  {
    "u": "assets/assets/content/sl/questions/images/E30-200511-00080_met-001.png",
    "h": "e0e21be81c197295"
  },
  {
    "u": "assets/assets/content/sl/questions/images/E30-200511-00081_met-002.png",
    "h": "6bc744652273c65d"
  },
  {
    "u": "assets/assets/content/sl/questions/images/E30-200511-00083_met-004.png",
    "h": "a16accef572b7196"
  },
  {
    "u": "assets/assets/content/sl/questions/images/E30-200511-00101_met-005.png",
    "h": "efb62b5d18395dd8"
  },
  {
    "u": "assets/assets/content/sl/questions/images/E30-200511-00102_met-005.png",
    "h": "efb62b5d18395dd8"
  },
  {
    "u": "assets/assets/content/sl/questions/images/E30-200511-00103_met-005.png",
    "h": "efb62b5d18395dd8"
  },
  {
    "u": "assets/assets/content/sl/questions/images/E51-200511-00020_pfa-010.png",
    "h": "34b111d288a213f9"
  },
  {
    "u": "assets/assets/content/sl/questions/images/E51-200511-00031_pfa-009.png",
    "h": "fbee72fd1be339d7"
  },
  {
    "u": "assets/assets/content/sl/questions/images/E51-200511-00041_pfa-003.png",
    "h": "c4710547e48d30d1"
  },
  {
    "u": "assets/assets/content/sl/questions/images/E51-200511-00098_pfa-006.png",
    "h": "7ea1d4b068f0b3c2"
  },
  {
    "u": "assets/assets/content/sl/questions/images/E70-200511-00066_pfp-052e.png",
    "h": "ab71654a1ac1713d"
  },
  {
    "u": "assets/assets/content/sl/questions/images/E70-200511-00074_pfp-004.png",
    "h": "cfef8277e79e7115"
  },
  {
    "u": "assets/assets/content/sl/questions/images/E70-200511-00170_pfp-024.png",
    "h": "8b89847590953df2"
  },
  {
    "u": "assets/assets/content/sl/questions/images/E70-200511-00240_pfp-061.png",
    "h": "73a415d849492092"
  },
  {
    "u": "assets/assets/content/sl/questions/images/E70-200511-00245_pfp-063.png",
    "h": "1d3b0051b27fb172"
  },
  {
    "u": "assets/assets/content/sl/questions/images/E90-210519-00015_ec-90-001-v1.png",
    "h": "7b695153d7d28b10"
  },
  {
    "u": "assets/assets/content/sl/questions/index.json",
    "h": "c5fe9c77b158911e"
  },
  {
    "u": "assets/assets/fonts/PlusJakartaSans-Bold.ttf",
    "h": "5f5342ef76862b5b"
  },
  {
    "u": "assets/assets/fonts/PlusJakartaSans-ExtraBold.ttf",
    "h": "7d60d21b5dec501c"
  },
  {
    "u": "assets/assets/fonts/PlusJakartaSans-Medium.ttf",
    "h": "c77bab757d7402ec"
  },
  {
    "u": "assets/assets/fonts/PlusJakartaSans-Regular.ttf",
    "h": "bd6276d4060e3b1e"
  },
  {
    "u": "assets/assets/fonts/PlusJakartaSans-SemiBold.ttf",
    "h": "65dbcedb6596a41c"
  },
  {
    "u": "assets/fonts/MaterialIcons-Regular.otf",
    "h": "b5253cf435c22bde"
  },
  {
    "u": "assets/fonts/fallback/Roboto-Regular.ttf",
    "h": "79e851404657dac2"
  },
  {
    "u": "assets/packages/cupertino_icons/assets/CupertinoIcons.ttf",
    "h": "3d90c370aa4cf00d"
  },
  {
    "u": "assets/shaders/ink_sparkle.frag",
    "h": "2dca5ab93d4ec29e"
  },
  {
    "u": "assets/shaders/stretch_effect.frag",
    "h": "ab412f07a5b9b50b"
  },
  {
    "u": "canvaskit/canvaskit.js",
    "h": "bb559f6080c7d312"
  },
  {
    "u": "canvaskit/canvaskit.wasm",
    "h": "fbed517a43e82452"
  },
  {
    "u": "canvaskit/chromium/canvaskit.js",
    "h": "6018b12bd8ed37e6"
  },
  {
    "u": "canvaskit/chromium/canvaskit.wasm",
    "h": "ae8ff1d858140f7b"
  },
  {
    "u": "canvaskit/webparagraph/canvaskit.js",
    "h": "3110e3e4d9b7b565"
  },
  {
    "u": "canvaskit/webparagraph/canvaskit.wasm",
    "h": "0ce1b05082efdc85"
  },
  {
    "u": "canvaskit/wimp.js",
    "h": "8fd8a47480c6eb0a"
  },
  {
    "u": "canvaskit/wimp.wasm",
    "h": "e924eaafd801d41e"
  },
  {
    "u": "favicon.png",
    "h": "62394905acb5a667"
  },
  {
    "u": "flutter.js",
    "h": "2beb1ce6b159c715"
  },
  {
    "u": "flutter_bootstrap.js",
    "h": "8331b29e43692975"
  },
  {
    "u": "icons/Icon-192.png",
    "h": "98ec81d630ef2757"
  },
  {
    "u": "icons/Icon-512.png",
    "h": "ab3606ace9e2165c"
  },
  {
    "u": "icons/Icon-maskable-192.png",
    "h": "4402ff69365bf552"
  },
  {
    "u": "icons/Icon-maskable-512.png",
    "h": "c0286e88fd74d3ed"
  },
  {
    "u": "index.html",
    "h": "ab17e046a0d9ee99"
  },
  {
    "u": "main.dart.js",
    "h": "6c7d7b36a5a83d14"
  },
  {
    "u": "manifest.json",
    "h": "d82d4055d1053794"
  },
  {
    "u": "version.json",
    "h": "6d6f0fbc0b4275ee"
  },
  {
    "u": "https://www.gstatic.com/firebasejs/13.1.0/firebase-app.js",
    "h": "13.1.0"
  },
  {
    "u": "https://www.gstatic.com/firebasejs/13.1.0/firebase-auth.js",
    "h": "13.1.0"
  },
  {
    "u": "https://www.gstatic.com/firebasejs/13.1.0/firebase-firestore-pipelines.js",
    "h": "13.1.0"
  }
];
const HASHES = '__hashes__';

function external(url) {
  return /^https?:\/\//.test(url);
}

/// Prejšnji predpomnilnik s seznamom zgoščenih vrednosti (če obstaja).
async function previousCache() {
  for (const key of await caches.keys()) {
    if (!key.startsWith('kopilot-') || key === CACHE) continue;
    const cache = await caches.open(key);
    const res = await cache.match(HASHES);
    if (res) return { cache, hashes: await res.json() };
  }
  return { cache: null, hashes: {} };
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE);
      const old = await previousCache();
      await Promise.all(
        FILES.map(async (f) => {
          if (old.cache && old.hashes[f.u] === f.h) {
            const hit = await old.cache.match(f.u);
            if (hit) return cache.put(f.u, hit);
          }
          // cache: 'reload' obide predpomnilnik HTTP, da res dobimo novo različico.
          const req = new Request(f.u, {
            cache: 'reload',
            mode: external(f.u) ? 'cors' : 'same-origin',
          });
          const res = await fetch(req);
          if (!res.ok) throw new Error('Prenos ni uspel: ' + f.u);
          return cache.put(f.u, res);
        }),
      );
      const hashes = {};
      for (const f of FILES) hashes[f.u] = f.h;
      await cache.put(HASHES, new Response(JSON.stringify(hashes)));
    })(),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((k) => k.startsWith('kopilot-') && k !== CACHE)
            .map((k) => caches.delete(k)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // Knjižnice Firebase: iz predpomnilnika, sicer z omrežja.
  if (url.origin !== self.location.origin) {
    if (url.hostname === 'www.gstatic.com' && url.pathname.startsWith('/firebasejs/')) {
      event.respondWith(
        caches.open(CACHE).then((cache) =>
          cache.match(req.url).then((hit) => hit || fetch(req)),
        ),
      );
    }
    return;
  }

  const scope = new URL(self.registration.scope).pathname;
  let path = url.pathname.startsWith(scope)
    ? url.pathname.slice(scope.length)
    : url.pathname;
  if (req.mode === 'navigate' || path === '') path = 'index.html';

  event.respondWith(
    caches.open(CACHE).then((cache) =>
      cache.match(path).then((hit) => hit || fetch(req)),
    ),
  );
});
