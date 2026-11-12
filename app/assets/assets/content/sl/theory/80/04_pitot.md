## Tlaki

- **Statični tlak** je tlak **nemotenega zračnega toka**. Deluje v vse smeri in z višino pada.
- **Dinamični tlak** je neposredno odvisen od **gostote zraka in kvadrata hitrosti**: $q = \tfrac{1}{2}\rho v^2$.
- **Skupni tlak** (zajezni tlak) je vsota obeh. Izmeri ga cev, ki je obrnjena proti toku in v kateri se zrak ustavi.

## Pitot-statični sistem

```slika
src: img/pitot.png
opis: Pitot-statični sistem in instrumenti
```

**Pitot-statični sistem** potrebujemo za **merjenje skupnega in statičnega tlaka**.

- **Pitotova cev** zaznava **skupni tlak**. Nanjo je priključen samo **merilnik hitrosti**. Pri jadralnih letalih je navadno v nosu ali na smerniku.
- **Statične odprtine** na boku trupa zaznavajo statični tlak. Nanje so priključeni **višinomer, variometer in merilnik hitrosti**. Odprtini sta navadno na obeh straneh trupa in povezani, da bočni zdrs ne popači meritve.
- **Sonda za kompenzacijo skupne energije** (TE sonda) je posebna cev, običajno na smerniku, za variometer (glej Variometer).

```slika
src: img/foto_pitot.jpg
opis: Pitotova cev. Foto: RM Bulseco from Davao City, Philippines, Wikimedia Commons, CC BY 2.0
```

```slika
src: img/foto_static.jpg
opis: Statični odprtini na boku trupa, označeni z rdečim obročem. Foto: SempreVolando, Wikimedia Commons, CC BY 3.0
```

## Napake sistema

- **Napaka položaja**: okoli trupa tok ni povsem neoviran, zato statična odprtina zazna malo drugačen tlak. Popravek je v tabeli v letalnem priročniku (IAS → CAS).
- **Bočni zdrs**: tok na eno stran trupa se spremeni, kazanje se popači.
- **Voda** v vodih (dež, pranje letala) povzroči zatikanje in skoke kazalcev. Zato imajo sistemi **izločevalnike vode**.

| Okvara | Posledica |
|---|---|
| **zamašena Pitotova cev** | napačen samo merilnik hitrosti: če je zamašena tudi odprtina za izpust, deluje kot višinomer (pri vzpenjanju kaže vse večjo hitrost) |
| **zamašeni vodi statičnega tlaka** | **merilnik hitrosti, višinomer in variometer kažejo narobe hkrati**: višinomer obstane, variometer kaže nič, merilnik hitrosti pri spuščanju kaže preveč, pri vzpenjanju premalo |

Motorna letala imajo pogosto **ogrevano Pitotovo cev** (proti ledu) in **nadomestni statični vir** v kabini.

Pred vsakim letom preveri, da so Pitotova cev in statične odprtine **čiste, brez umazanije, mrčesa in ledu**, in odstrani pokrovčke. V cevi nikoli ne pihaš: tlak lahko uniči instrumente.
