## Vizualna navigacija

**Vizualna navigacija** je **orientiranje po objektih na tleh** med vizualnim letenjem. Karto obrneš v smer leta, da se ujema s terenom, in primerjaš karto s tlemi (od karte k terenu).

Za orientiranje so najprimernejši dolgi in izraziti objekti: **reke, železniške proge, avtoceste**, jezera, večja mesta in značilni vrhovi. Majhne ceste in gozdovi so med seboj podobni.

## Pravilo 1 : 60

**Bočni zamik 1 NM po 60 NM ustreza kotu 1°.** Kot odstopanja v stopinjah je zato:

```enacba
\alpha \approx \frac{\text{zamik} \cdot 60}{\text{razdalja}}
```

Za let naravnost do cilja popraviš smer za vsoto dveh kotov: kota odstopanja od načrtovane poti in kota, ki zapre zamik do cilja.

- Pot 120 NM, po **55 NM 7 NM desno**: 7·60/55 ≈ 8° in 7·60/65 ≈ 6°, skupaj okoli **14° levo**.
- Pot 90 NM proti 090°, po **45 NM 4,5 NM severno**: 6° + 6° = **12° v desno**.

## Nov predviden čas prihoda

Iz časa med dvema znanima točkama izračunaš dejansko GS in z njo nov ETA do naslednje točke. Spremembe vetra pomenijo izgubo ali pridobitev časa (in pri motornem letalu goriva).

## Prava višina

Višinomer z nastavitvijo QNH kaže pravo višino le v standardni atmosferi. Popravek je okoli **4 % na vsakih 10 °C** odstopanja od ISA (4 ft na 1000 ft na °C):

```enacba
\text{prava višina} \approx h_{\text{QNH}} \cdot \left(1 + 0{,}004 \cdot \Delta T_{\text{ISA}}\right)
```

| Podatki | ISA na tej višini | Prava višina |
|---|---|---|
| FL 75, OAT −9 °C, višina QNH 6500 ft | 0 °C, ΔT = −9 °C | 6500 − 234 ≈ **6250 ft** |
| PA 7000 ft, OAT +11 °C, višina QNH 6500 ft | +1 °C, ΔT = +10 °C | 6500 + 260 ≈ **6750 ft** |
| PA 7000 ft, OAT +21 °C, višina QNH 6500 ft | +1 °C, ΔT = +20 °C | 6500 + 520 ≈ **7000 ft** |
