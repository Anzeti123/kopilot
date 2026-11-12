## Viri vremenskih podatkov

| Vir | Kaj pokaže |
|---|---|
| **satelitski posnetek** | **pregled pokritosti z oblaki in linij front** |
| **radarska slika** | **območja s padavinami** in njihovo jakost |
| **prizemna vremenska karta** | **tlačna polja** (izmerjen tlak na MSL, izobare), **središča ciklonov in fronte** |
| nižinska karta pomembnih vremenskih pojavov (**LLSWC**) | fronte, oblaki, vidnost, zaledenitev, turbulenca pod FL 100; **ne vsebuje radarskih slik** |
| METAR | trenutno vreme na letališču |
| TAF | napoved za letališče |
| **ATIS** | vreme in **operativne informacije** za letališče (**steza v uporabi, prehodni nivo**), ki jih METAR nima |
| **SIGMET** | opozorilo na nevarne pojave (nevihte, huda turbulenca, huda zaledenitev, gorski valovi) za **FIR/UIR** |

Med letom dobiš vreme in operativne informacije o namembnem letališču iz **ATIS**.

```slika
src: img/foto_satellite.jpg
opis: Satelitski posnetek: vidni so oblačni sistemi in snežna odeja. Foto: NOAA, Wikimedia Commons, javna last
```

## Kje dobiš vremenske podatke

- **Agencija RS za okolje (ARSO)**: letalske napovedi in opozorila, radarska in satelitska slika, sondaže, napoved za jadralce v sezoni.
- **AIS Slovenije** (Kontrola zračnega prometa Slovenije): METAR, TAF, SIGMET, NOTAM, predpoletni bilten.
- Spletne napovedi termike in vetra (numerični modeli): koristne za načrtovanje, vendar so le izračun modela. Preveri jih z uradnimi napovedmi in z opazovanjem neba.

Pred vsakim letom preglej vsaj: splošno vremensko situacijo, napoved za območje leta (vključno z vetrom na višinah), METAR in TAF letališč na poti, SIGMET in radarsko sliko za plohe.

## METAR in TAF

| Oznaka | Pomen |
|---|---|
| 22015KT | veter iz 220° s hitrostjo 15 kt |
| 9999 | vidnost 10 km ali več |
| -RA / RA / **+RA** | šibek / zmeren / **močan dež** |
| **SHRA** | **(zmerne) dežne plohe** |
| TS / TSRA | nevihta / nevihta z dežjem |
| FG / BR / HZ | megla / meglica / suha motnost |
| FEW / SCT / BKN / OVC | 1–2 / 3–4 / 5–7 / 8 osmin oblačnosti |
| CB / TCU | kumulonimbus / stolpičasti kumulus |
| CAVOK | vidnost 10 km ali več, ni oblakov pod 5000 ft, ni CB in TCU, ni pomembnega vremena |
| Q1018 | QNH 1018 hPa |
| 18/09 | temperatura 18 °C, rosišče 9 °C |

Primer: `LJLJ 121250Z 22008KT 9999 SCT045 24/12 Q1016 NOSIG`: Ljubljana, 12. dan ob 12:50 UTC, veter 220°/8 kt, vidnost nad 10 km, razpršeni oblaki na 4500 ft, 24 °C, rosišče 12 °C, QNH 1016, brez pomembnih sprememb.

## Primer TAF

`TAF LJLJ 120500Z 1206/1306 24008KT 9999 FEW040 PROB30 TEMPO 1213/1218 TSRA BKN030CB BECMG 1220/1222 VRB03KT`

| Del | Pomen |
|---|---|
| 120500Z | izdano 12. dan ob 05:00 UTC |
| 1206/1306 | velja od 12. ob 06:00 do 13. ob 06:00 UTC |
| 24008KT 9999 FEW040 | veter 240°/8 kt, vidnost nad 10 km, nekaj oblakov na 4000 ft |
| PROB30 TEMPO 1213/1218 TSRA BKN030CB | 30 % verjetnost občasnih neviht z dežjem med 13. in 18. uro, kumulonimbusi na 3000 ft |
| BECMG 1220/1222 VRB03KT | med 20. in 22. uro postopoma spremenljiv veter 3 kt |

Oznake sprememb: **BECMG** (postopna sprememba), **TEMPO** (občasno, manj kot polovico obdobja), **PROB30/40** (verjetnost 30 ali 40 %), **FM** (od tega časa naprej).

## SIGMET in AIRMET

- **SIGMET** opozarja na pojave, nevarne za vsa letala: vgrajene ali linijske nevihte, hudo turbulenco, hudo zaledenitev, močne gorske valove, vulkanski pepel. Velja za FIR, navadno do 4 ure.
- **AIRMET** opozarja na pojave, nevarne predvsem za letala na nizkih višinah: zmerno zaledenitev in turbulenco, osamljene nevihte, zaprte gore, nizke oblake in zmanjšano vidnost.
- **GAMET** je območna napoved za lete na nizkih višinah (pod FL 100) v besedilni obliki.
