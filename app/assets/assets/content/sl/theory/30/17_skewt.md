**Diagram Skew-T log-p** je standardni prikaz **sondaže**: navpičnega profila temperature, rosišča in vetra, ki ga izmeri radiosonda (balon z instrumenti) ali izračuna numerični model. Za jadralnega pilota je najboljše orodje za napoved termike, baze oblakov in neviht.

```slika
src: img/skewt.png
opis: Diagram Skew-T s ponazoritveno sondažo termičnega dne: termika do baze kumulusov na okoli 1,9 km, vrh oblakov pod inverzijo na okoli 3,3 km
```

## Osi in črte

| Element | Kako izgleda | Pomen |
|---|---|---|
| **izobare** | vodoravne črte | tlak v hPa; navzgor pada logaritemsko, zato je navpična os skoraj sorazmerna z višino |
| **izoterme** | ravne črte, **nagnjene v desno** (od tod ime »skew«) | enaka temperatura; nagib razmakne krivulje in olajša branje |
| **suhe adiabate** | ukrivljene črte, nagnjene v levo | pot nenasičenega zraka pri dviganju (1 °C/100 m) |
| **nasičene adiabate** | črtkane ukrivljene črte | pot nasičenega zraka v oblaku (okoli 0,5–0,7 °C/100 m, z višino se bližajo suhim) |
| **razmerje mešanosti** | pikčaste črte z oznakami g/kg | količina vodne pare v gramih na kilogram suhega zraka |

Na sondaži sta dve izmerjeni krivulji:

- **temperatura okolice** (rdeča, desno),
- **rosišče okolice** (zelena, levo).

Kjer sta krivulji **blizu skupaj**, je zrak skoraj nasičen (oblaki, megla); kjer sta **daleč narazen**, je zrak suh.

Ob desnem robu so pogosto narisane **vetrne puščice** s smerjo in hitrostjo vetra na posameznih višinah.

## Dviganje delca

Napoved temelji na zamišljenem **delcu zraka**, ki ga dvignemo od tal:

1. Od temperature pri tleh (ali od napovedane najvišje dnevne temperature) gremo navzgor po **suhi adiabati**.
2. Od rosišča pri tleh gremo navzgor po črti **razmerja mešanosti**.
3. Kjer se črti sekata, je delec nasičen: to je **kondenzacijski nivo**, pri termiki **baza kumulusov**.
4. Nad bazo gremo navzgor po **nasičeni adiabati**.
5. Delec se dviga, dokler je **toplejši od okolice** (rumena črta desno od rdeče). Kjer postane hladnejši, se dviganje ustavi: tam je **vrh termike** oziroma **vrh oblaka**.

## Kaj se da napovedati

| Kaj | Kako odčitaš |
|---|---|
| **baza kumulusov** | kondenzacijski nivo delca; približno 125 m × (T − Td) nad tlemi |
| **vrh termike** | kjer delec po suhi adiabati doseže temperaturo okolice (pri suhi termiki) |
| **vrh kumulusov** | kjer delec po nasičeni adiabati doseže temperaturo okolice |
| **inverzija** | odsek, kjer rdeča črta gre v desno (temperatura z višino narašča); ustavi termiko in oblake |
| **stabilnost** | rdeča črta strmejša od suhe adiabate (nagnjena bolj v desno) = stabilno; vzporedna = nevtralno; bolj nagnjena v levo = labilno |
| **jakost termike** | čim večja je razlika med delcem in okolico in čim globlja je plast, tem močnejša termika |
| **začetek termike** | temperatura pri tleh, pri kateri delec po suhi adiabati preide jutranjo talno inverzijo |
| **kumulusi ali modra termika** | če delec doseže rosišče pod vrhom termike, nastanejo kumulusi; če ga ne, je termika suha |
| **prerazvoj, plohe, nevihte** | če je delec nad bazo še veliko toplejši od okolice do velikih višin, nastanejo kumulonimbusi |
| **ničta izoterma** | višina, kjer rdeča črta preseka 0 °C (meja zaledenitve, snega) |
| **plasti oblakov** | višine, kjer se rdeča in zelena črta skoraj dotikata |
| **megla in nizki oblaki** | majhna razlika T − Td pri tleh, talna inverzija |
| **tropopavza** | kjer temperatura neha padati; zgornja meja Cb |

### Labilnost in energija

Površina med delcem in okolico, kjer je delec **toplejši**, predstavlja energijo, ki je na voljo za dviganje (**CAPE**). Majhna površina pod nizko inverzijo pomeni šibko, a varno termiko. Velika površina, ki sega do 8–12 km, pomeni nevarnost močnih neviht, toče in nevihtnih pišev.

Površina, kjer je delec **hladnejši** od okolice pod nivojem proste konvekcije (na primer pod inverzijo), je **zaviranje** (CIN). Če je dovolj veliko, se nevihte ne razvijejo, četudi je CAPE velik, dokler ga ne prebije močnejše segrevanje, fronta ali dvig ob gorah.

## Branje primera na sliki

- Pri tleh je 27 °C in rosišče 14 °C. Razlika 13 °C pomeni bazo okoli 1600 m nad tlemi (na sliki okoli 805 hPa, 1,9 km nadmorske višine).
- Med tlemi in bazo je okolica skoraj vzporedna s suho adiabato: **dobra termika** do baze.
- Nad bazo je ozračje rahlo labilno, kumulusi rastejo do **inverzije na okoli 680 hPa** (3,3 km), kjer se delec ustavi. Kumulusi so zmerno visoki, plohe niso verjetne.
- Nad inverzijo je zrak zelo suh (zelena črta daleč levo): nad oblaki ni plasti, ki bi zasenčile sonce.
- Če bi se čez dan ogrelo bolj ali bi bil zrak vlažnejši in bi delec prebil inverzijo, bi se kumulusi razvili v plohe in nevihte.

To je tipičen dober jadralni dan: baza okoli 1,6 km nad tlemi, dobra termika, kumulusi brez prerazvoja.

## Kje dobiš sondaže

- Izmerjene sondaže (radiosonde) objavljajo meteorološke službe, za Slovenijo tudi **ARSO**. Merijo se le nekajkrat na dan, zato pokažejo stanje ob izpustu balona.
- **Napovedane sondaže** iz numeričnih modelov so na voljo za vsako uro in vsako točko. Jadralne napovedi termike temeljijo prav na njih.
- Napovedana sondaža je toliko dobra, kot je napoved temperature in vlage pri tleh. Primerjaj jo z dejanskim stanjem zjutraj (temperatura, rosišče, oblaki) in jo popravi.
