## Statični, dinamični in skupni tlak

- **Statični tlak** je tlak mirujočega zraka. **Deluje v vse smeri** enako.
- **Dinamični tlak** je tlak zaradi gibanja zraka: $q = \tfrac{1}{2}\rho v^2$. Raste s kvadratom hitrosti.
- **Skupni tlak** je vsota obeh.

## Bernoullijeva enačba

Za neviskozne nestisljive pline velja:

```enacba
\text{skupni tlak} = \text{dinamični tlak} + \text{statični tlak} = \text{konst.}
```

Kjer se zrak pospeši (na primer v zožitvi cevi, **Venturijevi cevi**, ali nad zgornjo stranjo krila), dinamični tlak naraste, **statični tlak pa pade**. To je osnova za nastanek vzgona in za merjenje hitrosti s Pitotovo cevjo.

## Sila na telo v zračnem toku

**Telo poljubne oblike** v zračnem toku povzroča vsaj **upor**. Pravilno oblikovano krilo povzroča še vzgon. **Skupna aerodinamična sila** je vektorska vsota **vzgona** (pravokotno na smer toka) in **upora** (vzporedno s tokom).

## Kako nastane vzgon

Vzgon lahko razložimo na dva enakovredna načina:

- **Po Bernoulliju**: nad ukrivljeno zgornjo stranjo krila se zrak pospeši, statični tlak pade; pod krilom je tlak višji. Razlika tlakov, pomnožena s površino, je sila vzgona.
- **Po Newtonu**: krilo odklanja zrak navzdol (**odklon toka**, downwash). Po tretjem Newtonovem zakonu zrak potiska krilo navzgor.

Oba opisa veljata hkrati: tlačna razlika in odklon toka sta dve plati istega pojava. Pogosta, a **napačna** razlaga je, da mora zrak nad krilom priti do zadnjega roba hkrati z zrakom pod krilom. Zrak nad krilom je v resnici še hitrejši in pride do zadnjega roba prej.

```slika
src: img/foto_condensation.jpg
opis: Nad krilom lovca se je zaradi nizkega tlaka vlaga v zraku kondenzirala v oblak: vidno območje podtlaka na zgornji strani. Foto: Bill Abbott, Wikimedia Commons, CC BY-SA 2.0
```

## Viskoznost in Reynoldsovo število

Zrak je **viskozen** (lepljiv): ob površini se ustavi, nad njo pa se hitrost postopno povečuje (mejna plast). **Reynoldsovo število** pove razmerje med vztrajnostnimi in viskoznimi silami:

```enacba
Re = \frac{v \cdot l}{\nu}
```

kjer je $l$ globina profila in $\nu$ kinematična viskoznost zraka. Jadralna letala letijo pri razmeroma majhnem Re (okoli 1–3 milijone), zato imajo posebne profile, ki ohranijo dolg laminarni tok.
