## Vektorji

Navigacijski trikotnik sestavljajo trije vektorji:

- **zračni vektor**: prava smer (TH) in prava hitrost (TAS), gibanje letala skozi zrak,
- **vektor vetra**: smer, **iz katere** piha veter, in njegova hitrost,
- **talni vektor**: pot nad tlemi (TC, TR) in **potna hitrost (GS)**.

## Kot popravka zaradi vetra in potna hitrost

Če je $\theta$ kot med smerjo vetra in kurzom, $V_w$ hitrost vetra:

```enacba
\sin \text{WCA} = \frac{V_w \sin\theta}{\text{TAS}}, \qquad \text{GS} = \text{TAS}\cos\text{WCA} - V_w\cos\theta
```

Nos letala obrneš **proti vetru**: veter z desne pomeni WCA v desno (+), z leve v levo (−).

Primeri:

- TC 040°, TAS 180 kt, veter 350°/30 kt: WCA = **7° levo** (−7°), GS = **159 kt**.
- TC 220°, TAS 220 kt, veter 270°/50 kt: GS = **185 kt**.
- TC 255°, TAS 100 kt, veter 200°/10 kt: WCA ≈ −5°, prava smer **250°**.
- TC 120°, TAS 120 kt, veter 150°/12 kt: WCA = **3° v desno**.
- TC 165°, TAS 90 kt, veter 130°/20 kt: prava smer **158°**.
- TC 270°, TAS 100 kt, veter 090°/25 kt (čisti hrbtni veter): GS = **125 kt**.

```interaktivno
id: trikotnik-vetra
```

Isto izračunaš z navigacijskim računalom E6B ali z orodjem Trikotnik vetra v aplikaciji.

```slika
src: img/foto_e6b.jpg
opis: Navigacijsko računalo E6B: logaritemsko drsno računalo za čas, hitrost, razdaljo, gorivo in pretvorbe enot. Foto: Wikimedia Commons, javna last
```

## Čas in razdalja

```enacba
t = \frac{s}{\text{GS}}, \qquad s = \text{GS} \cdot t
```

| Podatki | Rezultat |
|---|---|
| 100 km v 56 min | GS = 100 / 0,933 h = **107 km/h** |
| 236 NM pri GS 134 kt | t = **1 h 46 min** |
| 100 NM pri GS 107 kt, ETD 0933 | t = 56 min, **ETA 1029** |
| 210 NM, TAS 130 kt, čelni veter 15 kt, ETD 0915 | GS 115 kt, t = 1 h 50 min, **ETA 1105** |
| 75 NM, TAS 105 kt, čelni veter 12 kt, ETD 1242 | GS 93 kt, t = 48 min, **ETA 1330** |
| 100 NM, TAS 100 kt, hrbtni veter 25 kt | GS 125 kt, t = **48 min** |
| 185 NM, TAS 120 kt, hrbtni veter 35 kt | GS 155 kt, t = **1 h 12 min** |
| TAS 180 kt, čelni veter 25 kt, 2 h 25 min | GS 155 kt, s = **375 NM** |
