## Delovanje

```slika
src: img/foto_alt.jpg
opis: Višinomer s tremi kazalci in oknom za nastavitev tlaka. Foto: User:CambridgeBayWeather, Wikimedia Commons, javna last
```

Višinomer je aneroidni barometer. **Merjenje višine temelji na spremembi statičnega tlaka**: v ohišju so **evakuirane doze** (brez zraka), ki se pri padcu tlaka raztezajo in pri porastu krčijo. Mehanizem z vzvodi in zobniki gibanje doz prenese na kazalce. Skala je umerjena po standardni atmosferi (ISA).

Višinomer ima lahko en, dva ali tri kazalce (stotice, tisočice in deset tisočice) ali bobenček s številkami. Jadralni višinomeri so pogosto metrski.

## Pomožna barometrska skala

```slika
src: img/visinomer.png
opis: Metrski višinomer: okence s pomožno skalo (nastavljeno 1013 hPa), gumb za nastavitev in kazalca, ki kažeta 1350 m
```

Višinomer meri tlak, višino pa izračuna glede na **referenčni tlak**, pri katerem pokaže nič. Ta tlak nastaviš na **pomožni barometrski skali** (Kollsmanovo okence): majhno okence na številčnici, v katerem je vidna skala v hektopaskalih (hPa, pri starejših ameriških instrumentih v palcih živega srebra, inHg).

**Kako nastaviš**: z **gumbom** ob strani višinomera vrtiš skalo v okencu. Hkrati se premikata tudi kazalca:

- ko **nastavljeni tlak povečaš**, višinomer pokaže **več** (okoli 8 m oziroma 27–30 ft za vsak hPa),
- ko ga **zmanjšaš**, pokaže **manj**.

Sprememba s 1000 na 1010 hPa poveča kazanje za okoli 80 m.

**Kaj nastaviš**:

| V okence nastaviš | Kdaj | Višinomer kaže |
|---|---|---|
| **QFE** letališča | šolski krog, lokalno letenje | **0 na tleh**, v zraku višino nad letališčem |
| **QNH** | prelet, letenje po karti, zračni prostor | **nadmorsko višino letališča na tleh**, v zraku nadmorsko višino |
| **1013,25 hPa** (standard) | nad prehodno nadmorsko višino, nivoji leta | tlačno višino, nivo leta |

V praksi: na tleh pred vzletom z gumbom zasučeš kazalca na **nič** (če letiš s QFE) ali na **nadmorsko višino letališča** (QNH). Vrednost v okencu je takrat QFE ali QNH. Če se nastavljeni QNH in uradni QNH (iz ATIS ali od kontrole) razlikujeta za več kot nekaj hPa, je višinomer morda v okvari.

Med letom QNH sproti posodabljaš: kontrola ali FIS ga sporočita, na preletu se spreminja s tlačnim poljem. Pri nekaterih jadralnih višinomerih je pomožna skala omejena (na primer 950–1050 hPa); na visokem letališču QFE morda ne gre nastaviti, zato tam letiš s QNH.

**QFE** je zračni tlak na referenčni točki letališča, **običajno na pragu steze**.

Nastavitev preveriš in prilagodiš **pred vsakim letom in med preletom** (nov QNH na poti). Jadralni piloti v šolskem krogu pogosto letijo s QFE (nič na tleh), na preletu pa s QNH, ker so na karti nadmorske višine.

## Višine

| Izraz | Pomen |
|---|---|
| indicirana višina | kar kaže višinomer |
| **prava višina** | **absolutna višina nad srednjim morskim nivojem s popravkom za nestandardno temperaturo** |
| relativna višina | višina nad točko na tleh (letališče, teren) |
| **tlačna višina** | višina pri nastavitvi 1013,25 hPa; **nivo leta je tlačna višina** |
| gostotna višina | tlačna višina, popravljena za temperaturo; pove, kako »visoko« se letalo počuti |

**Višina iz GNSS** (v loggerju ali FLARM) je geometrična višina nad elipsoidom ali geoidom in se od barometrične razlikuje za več deset metrov. Za razdvajanje od drugega prometa in za zračni prostor vedno velja barometrična višina.

## Napake

- **Napačna nastavitev**: 1 hPa ustreza okoli **8 m** (28 ft). Sprememba s **1000 na 1010 hPa** poveča kazanje za okoli **80 m**. Če nastaviš **tlak, višji od dejanskega**, je **odčitek prevelik**: si **bližje tlem**, kot misliš.
- **Sprememba tlaka med letom**: ko letiš iz visokega tlaka v nizkega brez nove nastavitve, višinomer kaže preveč.
- **Temperatura**: v zraku, **hladnejšem od ISA**, je **indicirana višina večja od prave**. Pri temperaturi, enaki ISA, in pravilnem QNH je indicirana višina enaka pravi.
- **Histereza**: doze se ne odzovejo takoj; napaka po hitri spremembi višine. Vpliva na **višinomer**.
- **Napaka položaja** statične odprtine in zamašen statični sistem (višinomer obstane).

Pravilo: »iz toplega v hladno ali iz visokega v nizko, pazi spodaj«.

```interaktivno
id: visinomer
```
