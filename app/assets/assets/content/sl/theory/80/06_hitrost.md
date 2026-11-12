## Delovanje

```slika
src: img/foto_asi_real.jpg
opis: Merilnik hitrosti jadralnega letala (skala v vozlih): začne se levo spodaj, gre v smeri urinega kazalca in se nad 100 kt zavije proti sredini; zelen in rumen lok, rdeča črta in rumen trikotnik. Vir: gliding.world (BGA)
```

Merilnik hitrosti **meri skupni tlak in ga primerja s statičnim tlakom**. V ohišju je doza, v katero priteka skupni tlak iz Pitotove cevi, okoli nje pa je statični tlak. Doza se razteza sorazmerno z **razliko med skupnim in statičnim tlakom** (dinamični tlak). To potrebuje za določitev **IAS**.

Skala je umerjena po standardni atmosferi na morski gladini. Jadralni merilniki kažejo v km/h, motorni pogosto v vozlih (kt).

## Vrste hitrosti

| Hitrost | Pomen |
|---|---|
| **IAS** (indicirana) | kar kaže instrument |
| CAS (kalibrirana) | IAS, popravljena za napako položaja in instrumenta (tabela v priročniku) |
| EAS (ekvivalentna) | CAS, popravljena za stisljivost (pomembno šele pri velikih hitrostih) |
| **TAS** (prava) | hitrost glede na zrak, popravljena za gostoto |
| GS (potna) | hitrost glede na tla, TAS z vetrom |

Z višino in temperaturo (manjša gostota) je **TAS večja od IAS**, približno **2 % na 1000 ft** (okoli 6 % na 1000 m). Na 3000 m leti jadralno letalo pri IAS 100 km/h s TAS okoli 117 km/h.

Vse omejitve in hitrost porušitve vzgona so podane v IAS, ker je od IAS odvisen vzgon. Z manjšo gostoto zraka se poveča TAS pri hitrosti porušitve vzgona, IAS pa ostane enaka. Zato končni prilet na **vroč poletni dan** izvedeš z **nespremenjeno indicirano hitrostjo (IAS)**; hitrost glede na tla bo večja.

Pri jadralnih letalih z velikimi višinami (val) se $V_{NE}$ z višino **zmanjša** (zaradi flatra je pomembna TAS). Tabelo najdeš v priročniku in na plošči v kabini.

## Barvne oznake

Barvne oznake na merilniku hitrosti so **omejitve letala**, prenesene na številčnico, da jih pilot vidi med letom brez branja priročnika. Vse veljajo za IAS.

### Jadralno letalo (CS-22)

```slika
src: img/hitrost.png
opis: Barvne oznake na merilniku hitrosti jadralnega letala (ponazoritev, vrednosti niso za konkretno letalo)
```

| Oznaka | Od – do | Pomen |
|---|---|---|
| **bel lok** (če ima letalo zakrilca) | od $V_{S0}$ do $V_{FE}$ | območje, v katerem smeš uporabljati zakrilca v pristajalnem položaju |
| **zelen lok** | od $1{,}1\,V_{S1}$ do $V_{RA}$ | **normalno območje**: letiš v turbulenci in s polnimi odkloni krmil (do manevrske hitrosti) |
| **rumen lok** | od $V_{RA}$ do $V_{NE}$ | **opozorilno območje**: letenje **samo v mirnem zraku brez sunkov**, krmila odklanjaš le malo (priročniki pogosto dovolijo pri $V_{NE}$ največ tretjino hoda) |
| **rdeča črta** | $V_{NE}$ | hitrost, **ki se je ne sme prekoračiti, ne glede na okoliščine** (flater, preobremenitev) |
| **rumen trikotnik** | ena hitrost | **najmanjša priporočena priletna hitrost** pri največji masi brez vodnega balasta |
| modra črta (motorna jadralna letala) | $V_Y$ | hitrost najboljšega vzpenjanja z motorjem |

$V_{S1}$ je hitrost porušitve vzgona pri največji masi, $V_{S0}$ v pristajalni konfiguraciji, $V_{FE}$ največja hitrost z izvlečenimi zakrilci, $V_{RA}$ pa največja hitrost v **močni turbulenci** (rough air).

### Motorno letalo (CS-23)

| Oznaka | Od – do |
|---|---|
| bel lok | $V_{S0}$ do $V_{FE}$ (zakrilca) |
| zelen lok | $V_{S1}$ do $V_{NO}$ (največja potovalna hitrost za normalno uporabo) |
| rumen lok | $V_{NO}$ do $V_{NE}$ (samo v mirnem zraku) |
| rdeča črta | $V_{NE}$ |

### Hitrosti, ki niso označene na instrumentu

Na tablici v kabini in v priročniku so še:

- **$V_A$**: manevrska hitrost (polni odkloni krmil),
- **$V_T$**: največja hitrost v **aerovleki**,
- **$V_W$**: največja hitrost pri **vzletu z vitlom**,
- največja hitrost za izvlek podvozja in zavor (pri nekaterih letalih),
- tabela zmanjšanja $V_{NE}$ z višino.

Podatke o največji dovoljeni hitrosti najdeš **v letalnem priročniku, na plošči z instrumenti in na merilniku hitrosti**.
