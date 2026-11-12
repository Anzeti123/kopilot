**Koordiniran zavoj** je zavoj brez drsenja in zanašanja: vzdolžna os letala ves čas sledi tirnici leta, zrak pa priteka naravnost od spredaj. Nitka na kabini je na sredini, kroglica v libeli prav tako.

## Zakaj se letalo obrne

Telo, ki se giblje po krožnici, potrebuje silo proti središču kroga – **centripetalno silo**. Letalo je dobi tako, da se nagne. Vzgon je vedno pravokoten na krila, zato se nagne skupaj z letalom in ga lahko razstavimo na dve komponenti:

- **navpično**, $L\cos\varphi$, ki nosi težo letala,
- **vodoravno**, $L\sin\varphi$, ki je centripetalna sila in letalo obrača.

Letalo torej obrača nagnjen vzgon, ne smerno krmilo. Smerno krmilo zavoj samo **usklajuje**. Ob vstopu v nagib ustvari spuščeno krilce na krilu, ki se dviga, več upora in potegne nos v nasprotno smer od zavoja (angl. *adverse yaw*). To odpravimo s sočasnim pritiskom na pedal v smeri zavoja. Pri jadralnih letalih z dolgimi krili je ta učinek zelo izrazit.

```slika
src: img/sile_v_zavoju.png
opis: Sile v koordiniranem zavoju z nagibom 30°
```

V sistemu, ki se vrti skupaj z letalom (tako zavoj občuti pilot), isto opišemo s **centrifugalno silo**, ki deluje navzven: vzgon tedaj uravnoveša vsoto teže in centrifugalne sile. Oba opisa sta enakovredna; na izpitu se pojavljata oba.

## Stopnja obremenitve

Navpična komponenta mora še vedno nositi celotno težo, $L\cos\varphi = W$. Zato mora biti vzgon v zavoju **večji** kot v premočrtnem letu. Razmerje med vzgonom in težo je stopnja obremenitve:

```enacba
n = \frac{L}{W} = \frac{1}{\cos\varphi}
```

Večji vzgon pilot doseže z večjim napadnim kotom (palico povleče k sebi). S tem se letalo približa kritičnemu napadnemu kotu, zato je **hitrost porušitve vzgona v zavoju večja**:

```enacba
V_{S,\,\text{zavoj}} = V_S\sqrt{n} = \frac{V_S}{\sqrt{\cos\varphi}}
```

| Nagib φ | n | Vs v zavoju |
|---|---|---|
| 0° | 1,00 | enaka |
| 30° | 1,15 | +7 % |
| 45° | 1,41 | +19 % |
| 60° | 2,00 | +41 % |

```opomba
Strm zavoj pri majhni hitrosti blizu tal (na primer zadnji zavoj pred pristankom) je ena najpogostejših okoliščin za porušitev vzgona in vrij. Strm zavoj začni z **dodatno hitrostjo**.
```

## Polmer in čas kroga

Vodoravna komponenta vzgona je centripetalna sila, navpična nosi težo:

```enacba
L\sin\varphi = \frac{m v^2}{r}, \qquad L\cos\varphi = m g
```

Ko enačbi delimo, se vzgon in masa pokrajšata. Polmer je odvisen samo od hitrosti in nagiba, čas polnega kroga pa od polmera in hitrosti:

```enacba
r = \frac{v^2}{g\tan\varphi}, \qquad T = \frac{2\pi r}{v}
```

Večji nagib in manjša hitrost dasta ožji krog. Pri 90 km/h je polmer pri nagibu 30° približno 110 m (krog traja okoli 28 s), pri nagibu 45° pa le še okoli 64 m (16 s). Zato jadralci v ozkih termikah krožijo z večjim nagibom.

```interaktivno
id: nagib
```

## Drsenje in zanašanje

Če zavoj ni usklajen, letalo leti malo postrani:

- **Drsenje**: premalo smernega krmila za dani nagib. Letalo drsi proti notranjosti zavoja, kroglica je na **notranji** strani.
- **Zanašanje**: preveč smernega krmila. Rep zanaša navzven, kroglica je na **zunanji** strani.

Popravek s kroglico: **stopi na kroglico** – pritisni pedal na tisti strani, kamor je odklonjena. Z nitko je obratno: pritisni pedal na nasprotni strani od tiste, kamor kaže prosti konec nitke.

```opomba
Zanašanje je nevarnejše od drsenja. Notranje krilo je v zanašanju počasnejše in na večjem napadnem kotu, zato se lahko vzgon na njem poruši prvi – letalo preide v vrij v smeri zavoja. Nosu nikoli ne potiskaj okoli zavoja s smernim krmilom.
```
