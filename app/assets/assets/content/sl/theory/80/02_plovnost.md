## Obremenitve strukture

**Stopnja obremenitve** $n$ je **razmerje med vzgonom in težo**. V vodoravnem letu je $n = 1$, v zavoju z nagibom 60° je $n = 2$, pri sunku vetra ali izvleku lahko hitro preseže 4.

Struktura je preračunana na dve vrsti obremenitve:

| Obremenitev | Pomen |
|---|---|
| **mejna** (limit load) | največja obremenitev, ki jo letalo sme doživeti v uporabi; po njej ne sme ostati trajna deformacija |
| **porušna** (ultimate load) | mejna obremenitev, pomnožena z **varnostnim faktorjem 1,5**; struktura jo mora zdržati vsaj 3 sekunde, nato se lahko poruši |

Jadralna letala kategorije **Utility** po certifikacijskih predpisih CS-22 morajo zdržati mejno obremenitev najmanj **+5,3 in −2,65** pri manevrski hitrosti. Akrobatska jadralna letala imajo višje meje (navadno +7 in −5). Dejanske meje so v letalnem priročniku.

- **Struktura se lahko poškoduje**, če **prekoračiš manevrirno hitrost v močnih sunkih** vetra ali s polnimi odkloni krmil.
- Pri hitrosti nad **$V_{NE}$** grozi **flater**: krmilna površina ali krilo začne nihati vse močneje, dokler se ne zlomi. Flater lahko v nekaj sekundah uniči letalo.
- Ponavljajoče se obremenitve povzročajo **utrujanje** materiala. Zato ima vsako letalo omejeno življenjsko dobo (ure leta ali število vzletov), ki jo proizvajalec lahko podaljša s pregledi.

## Plovnost in vzdrževanje

Zrakoplov **ni več ploven**, če so **poškodovani deli, ki nosijo obremenitve** (nosilci, pritrdišča kril in repa, krmilni sistem), ali če ni opravljeno predpisano vzdrževanje.

Vzdrževanje jadralnih letal ureja **Part-ML**. Lastnik vodi **program vzdrževanja**, vse delo pa se vpiše v knjigo letala.

| Pregled | Kdaj | Kdo |
|---|---|---|
| **predpoletni (dnevni) pregled** | pred prvim letom dneva in po montaži | pilot |
| periodični (letni) pregled | po programu vzdrževanja, navadno enkrat letno ali po urah | pooblaščeni mehanik |
| pregled plovnosti (ARC) | enkrat letno | pooblaščeno osebje |

Vrste vzdrževanja:

- **po času ali številu ciklov**: del se zamenja ali pregleda po določenem številu ur ali let, ne glede na stanje,
- **po stanju**: del se pregleduje in zamenja, ko kaže znake obrabe,
- **s spremljanjem stanja**: podatki o okvarah se zbirajo in analizirajo.

## Poškodbe kompozitov

Kompozitne poškodbe so pogosto **skrite**: po udarcu je površina videti nepoškodovana, spodaj pa so plasti ločene (**delaminacija**). Sumljivo mesto preveriš s **trkanjem** (kovanec): zdrav laminat zveni jasno, ločen pa votlo. Razpoke v laku (gelcoatu) niso nujno strukturna poškodba, vendar jih mora pregledati mehanik. Po trdem pristanku, ground loopu ali udarcu krila v tla letalo pregleda mehanik, preden spet leti.

## Vodni balast

Vodni balast v krilih poveča maso. Najmanjša hitrost se poveča s kvadratnim korenom razmerja mas:

```enacba
\frac{V_{S,2}}{V_{S,1}} = \sqrt{\frac{m_2}{m_1}}
```

Če balast poveča maso za **40 %**, se najmanjša hitrost poveča za $\sqrt{1{,}4} \approx 1{,}18$, torej za **18 %**.

- Voda je v krilnih rezervoarjih ali vrečah, izpuščaš jo skozi ventile na spodnji strani krila.
- Nekatera letala imajo tudi **repni balast**, s katerim masno središče premakneš nazaj in zmanjšaš upor repa.
- Z vodnim balastom mora jadralno letalo **ostati v temperaturah nad lediščem**. Zmrznjena voda lahko poškoduje krilo in je ni mogoče izpustiti.
- Balast izpustiš pred pristankom (manjša pristajalna hitrost in obremenitev), pred izvenletališkim pristankom in pred vstopom v hladen zrak.
- Pri izpuščanju morata oba rezervoarja iztekati enakomerno, sicer je eno krilo težje.
