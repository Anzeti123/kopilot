## Trije severi

| Sever | Kaj je |
|---|---|
| pravi sever (TN) | smer proti geografskemu severnemu tečaju |
| magnetni sever (MN) | smer, v katero kaže kompas brez vpliva letala |
| **kompasni sever** (CN) | **smer, v katero kaže magnetni kompas zaradi magnetnih polj Zemlje in zrakoplova** |

- **Variacija** (VAR) je kot med pravim in magnetnim severom, oziroma **med magnetnim in pravim kurzom**. Je vzhodna (E) ali zahodna (W).
- **Izogona** je črta na karti, ki povezuje točke z **enako variacijo**.
- **Deviacija** (DEV) je **kot med kompasnim in magnetnim severom**, ki ga povzroči letalo.

```slika
src: img/foto_meridians.jpg
opis: Magnetni poldnevnik (rdeče) poteka drugače kot geografski poldnevniki; kot med njima je variacija. Ilustracija: Sch, Wikimedia Commons, CC BY-SA 3.0
```

Variacija se s časom počasi spreminja. Zato včasih **spremenijo oznako steze** (na primer z »06« na »07«), ker se je **spremenila magnetna variacija**.

## Kurz in smer

| Izraz | Pomen |
|---|---|
| **pravi kurz** (TC) | **kot med pravim severom in linijo kurza** (želena pot po karti) |
| **magnetni kurz** (MC) | **kot med magnetnim severom in linijo kurza** |
| **kot popravka zaradi vetra** (WCA) | **kot med pravim kurzom in pravo smerjo** |
| prava smer (TH) | smer, kamor kaže nos letala, glede na pravi sever |
| magnetna smer (MH), kompasna smer (CH) | ista smer glede na magnetni oziroma kompasni sever |

## Pretvorbe

```enacba
\text{TH} = \text{TC} + \text{WCA}, \quad \text{MH} = \text{TH} - \text{VAR}_E, \quad \text{CH} = \text{MH} - \text{DEV}_E
```

Vzhodno variacijo ali deviacijo **odšteješ**, zahodno **prišteješ** (»vzhod najmanj, zahod največ«). Enako velja za kurz: $\text{MC} = \text{TC} - \text{VAR}_E$.

Primeri:

- TC **245°**, VAR **7° W**: MC = 245 + 7 = **252°**.
- TC 179°, WCA −12°, VAR 4° E: MH = 179 − 12 − 4 = **163°**, MC = 179 − 4 = **175°**.
- WCA −12°, TH 125°, MC 139°, DEV 2° E: TC = 125 + 12 = **137°**, VAR = 137 − 139 = −2° (2° W), MH = 125 + 2 = **127°**, CH = 127 − 2 = **125°**.
- TC 183°, WCA +11°, MH 198°, CH 200°: TH = **194°**, VAR = 194 − 198 = −4° = **4° W**, DEV = 198 − 200 = **−2°**.
