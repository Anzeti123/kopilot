## Stopnja obremenitve

**Stopnja obremenitve** $n = L/W$ pove, kolikokrat je vzgon večji od teže. V vodoravnem letu je $n = 1$.

Stopnja obremenitve se poveča:

- v **zavoju** ($n = 1/\cos\varphi$),
- pri **izvleku** iz strmoglavega leta ali pri izvleku iz porušitve vzgona,
- pri **sunku vetra navzgor**, ki nenadoma poveča vpadni kot,
- pri akrobatskih likih.

V koordiniranem zavoju je **n večja od 1** in **$V_S$ večja kot pri premočrtnem vodoravnem letu**.

## Obremenitev krila in sunki

**Obremenitev krila** je **masa, deljena s površino krila**. Obremenitev zaradi sunka je večja pri večji hitrosti, manjši obremenitvi krila in večji vitkosti. V turbulenci zato leti počasneje, a ne pod najmanjšo dovoljeno hitrostjo.

## Omejitve hitrosti

| Oznaka | Pomen |
|---|---|
| $V_{NE}$ | hitrost, ki se **ne sme nikoli prekoračiti** (rdeča črta) |
| $V_A$ | manevrska hitrost: nad njo ni dovoljen poln odklon krmil |
| $V_{RA}$ | največja hitrost v turbulentnem zraku |

**Letenje nad $V_{NE}$** lahko povzroči **drhtenje (flater)** krmil in kril ter **mehanske poškodbe kril**, ki lahko razbijejo letalo v nekaj sekundah.

## Diagram obremenitev (V-n)

```slika
src: img/vn.png
opis: Diagram obremenitev: dovoljena stopnja obremenitve v odvisnosti od hitrosti (ponazoritev za jadralno letalo kategorije Utility)
```

- Leva meja je **porušitev vzgona**: pri dani hitrosti krilo ne more ustvariti večjega vzgona, zato večja obremenitev ni mogoča.
- Zgornja in spodnja meja sta **mejni obremenitvi** strukture (za jadralna letala kategorije Utility +5,3 in −2,65).
- Desna meja je $V_{NE}$.

**Manevrska hitrost** $V_A$ je presečišče krivulje porušitve z zgornjo mejo:

```enacba
V_A = V_S \sqrt{n_{max}}
```

Pod $V_A$ se krilo poruši, preden doseže največjo dovoljeno obremenitev, zato polni odkloni krmil ne poškodujejo strukture. Nad $V_A$ lahko sunkovit poln odklon preseže dovoljeno obremenitev. Pri $V_S$ = 70 km/h in $n_{max}$ = 5,3 je $V_A$ okoli 160 km/h.

Obremenitev zaradi sunka se poveča premosorazmerno s hitrostjo: sunek navpično 10 m/s pri dvakratni hitrosti povzroči dvakratno spremembo obremenitve. Zato ima vsako letalo tudi **hitrost za močno turbulenco** $V_{RA}$.
