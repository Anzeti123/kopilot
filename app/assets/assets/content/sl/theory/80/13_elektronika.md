Sodobno jadralno letalo ima poleg klasičnih instrumentov še vrsto elektronskih naprav. Večina je med seboj povezana: GNSS sprejemnik, FLARM, variometer in navigacijski računalnik si izmenjujejo podatke.

## Navigacijski računalnik

Navigacijski računalnik združuje več instrumentov in kart v eno napravo. Lahko je samostojna naprava, vgrajena v instrumentno ploščo (pogosto z velikim barvnim zaslonom in ločenim upravljanjem na palici), ali aplikacija na telefonu oziroma tablici, ki dobiva podatke iz GNSS in FLARM.

```slika
src: img/foto_navpanel.jpg
opis: Instrumentna plošča jadralnega letala z velikim zaslonom navigacijskega računalnika na sredini. Foto: Jmcc150, Wikimedia Commons, CC BY-SA 4.0
```

Tipične funkcije:

| Funkcija | Kaj naredi |
|---|---|
| **premikajoča se karta** | položaj, teren, letališča, **zračni prostori** z opozorilom pred vstopom |
| **naloga** | obratne točke, sektorji, razdalja, čas, povprečna hitrost |
| **končni dolet** | potrebna višina do cilja ali naslednje točke glede na polaro, veter, MC, balast in umazanijo kril |
| **elektronski variometer** | zvočni variometer s kompenzacijo skupne energije, netto, povprečje, zahtevana hitrost (speed to fly) |
| **veter** | izračun vetra iz zanašanja med kroženjem ali iz razlike med smerjo in potjo |
| **termični asistent** | pokaže, na kateri strani kroga je dviganje močnejše |
| **prikaz prometa** | letala s FLARM in ADS-B na radarju okoli letala |
| **logger** | zapis leta v datoteko IGC za značke in tekmovanja |
| **izbira polj** | dosegljiva letališča in polja za izvenletališki pristanek |

Računalnik potrebuje pravilne vhodne podatke: **polaro** letala, **maso** in **balast**, **MC** in nastavitev **umazanije** kril (bugs). Napačni podatki dajo napačen končni dolet. Pred letom preveri, da je zbirka zračnih prostorov veljavna, in vnesi QNH.

## Logger

Logger zapisuje položaj iz GNSS, **barometrično višino** in čas v rednih presledkih v datoteko **IGC**. Za priznanje značk, rekordov in tekmovanj mora biti logger **odobren** (IGC) in datoteka digitalno podpisana. Pogosto je vgrajen v FLARM ali navigacijski računalnik.

## FLARM

**FLARM** (izpeljanka iz »flight alarm«) je sistem za opozarjanje na trk, razvit v Švici leta 2004 za jadralna letala. Danes je v evropskih jadralnih letalih skoraj obvezen, uporabljajo ga tudi motorna letala in helikopterji.

```slika
src: img/foto_flarm2.jpg
opis: Naprava FLARM z anteno na armaturni plošči jadralnega letala; svetleče diode kažejo smer prometa. Foto: Rouvix, Wikimedia Commons, javna last
```

**Kako deluje**:

1. Naprava iz **GNSS** določi svoj položaj, hitrost in smer ter iz zadnjih premikov **predvidi pot** za naslednjih nekaj deset sekund (pri kroženju predvidi krog).
2. Ta podatek vsako sekundo **oddaja po radiu** v pasu za naprave kratkega dosega (v Evropi okoli 868 MHz). Doseg je nekaj kilometrov.
3. Sprejema podatke drugih naprav FLARM in izračuna, ali se predvideni poti v bližnji prihodnosti sekata.
4. Če grozi trk, opozori z zvokom in na zaslonu pokaže **smer** (kot urni kazalec) in **višinsko razliko**. Opozorilo se stopnjuje, ko se čas do trka krajša.

**Dodatno**:

- opozarja na **ovire** (žičnice, daljnovode, antene) iz vgrajene zbirke podatkov,
- novejše naprave (**PowerFLARM**) sprejemajo tudi signale **transponderjev** in **ADS-B**: pri ADS-B poznajo položaj drugega letala, pri transponderju v načinu C ali S pa le približno razdaljo in višino, ne smeri,
- signale FLARM sprejemajo tudi zemeljske postaje (na primer omrežje OGN), zato je let mogoče spremljati na spletu,
- nekatere naprave oddajajo tudi po novem standardu **ADS-L**, ki ga je za elektronsko vidnost lahkih zrakoplovov določila EASA.

**Omejitve**:

- vidi samo letala z združljivo napravo; motornih letal brez FLARM ali ADS-B ne zazna,
- antena mora imeti dober pogled na vse strani (slaba namestitev zmanjša doseg),
- opozorilo pride kasno: je zadnja varovalka, ne nadomestilo za gledanje ven.

## Transponder

**Transponder** omogoča, da letalo vidi **sekundarni radar** kontrole zračnega prometa. Radar oddaja vprašanje (**interogacija**) na **1030 MHz**, transponder odgovori na **1090 MHz**.

| Način | Odgovor |
|---|---|
| **A** | štirimestna **koda** (squawk); števke od 0 do 7, skupaj 4096 kod |
| **C** | koda in **tlačna višina** (iz kodirnika višine, v korakih po 100 ft, vedno glede na 1013,25 hPa) |
| **S** | koda, tlačna višina, **24-bitni naslov letala** (ICAO), oznaka letala; radar lahko vpraša vsako letalo posebej |

**Stikalo transponderja**:

| Položaj | Pomen |
|---|---|
| OFF | izklopljen |
| SBY (standby) | ogret, a ne odgovarja; na tleh pred vzletom |
| ON | odgovarja samo s kodo (način A) |
| **ALT** | odgovarja s kodo in višino (način C ali S): **normalni položaj med letom** |
| **IDENT** | tipka, ki za nekaj sekund označi tvoje letalo na radarskem zaslonu; pritisneš jo **le na zahtevo** kontrole (»squawk ident«) |

**Kode**:

| Koda | Pomen |
|---|---|
| **7000** | let VFR, brez posebne kode (v Evropi) |
| **7500** | nezakonito vmešavanje (ugrabitev) |
| **7600** | izguba radijske zveze |
| **7700** | nevarnost, sila |
| druga koda | dodeli jo kontrola |

Pri spreminjanju kode se izogibaj prehodu skozi kode v sili (na primer pri spremembi na 7200 ne zavrti skozi 7500 ali 7700) in med spreminjanjem po možnosti preklopi na SBY.

Jadralna letala transponder potrebujejo predvsem v **območjih obvezne rabe transponderja** (TMZ) in v kontroliranem prostoru. Ker porabi več električne energije kot drugi instrumenti, potrebujejo zmogljiv akumulator.

## ADS-B

**ADS-B** (avtomatsko odvisno nadzorovanje z oddajanjem) je sistem, pri katerem letalo **samo oddaja** svoj položaj iz GNSS, višino, hitrost, smer in oznako, navadno dvakrat na sekundo, brez vprašanja radarja.

- »**Avtomatsko**«: oddaja brez posredovanja pilota.
- »**Odvisno**«: položaj je odvisen od letalovega GNSS.
- »**Z oddajanjem**«: sprejme ga lahko vsak (kontrola, druga letala, zemeljske postaje).

| | Pomen |
|---|---|
| **ADS-B Out** | letalo oddaja svoj položaj; v Evropi najpogosteje kot del transponderja Mode S na 1090 MHz (»razširjeni squitter«, 1090ES) |
| **ADS-B In** | sprejemnik prikaže promet okoli letala (na primer v PowerFLARM ali navigacijskem računalniku) |

V Evropi je ADS-B Out obvezen za velika letala; za lahka letala in jadralna letala ni obvezen, je pa priporočljiv, ker letalo postane vidno drugim sprejemnikom. Pri uporabi ADS-B mora biti GNSS vir dovolj natančen in pravilno povezan s transponderjem.

## Primerjava

| Sistem | Kdo oddaja | Kaj drugi vidijo | Kdo ga vidi |
|---|---|---|---|
| transponder A/C/S | letalo odgovarja na radar | koda, višina (S tudi identiteta) | kontrola; PowerFLARM približno |
| ADS-B | letalo samo oddaja | natančen položaj, višina, hitrost | kontrola, letala z ADS-B In |
| FLARM | letalo samo oddaja | položaj, predvidena pot | letala s FLARM, zemeljske postaje |
