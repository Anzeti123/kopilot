Q-kode so mednarodne tričrkovne okrajšave. Za smeri med letalom in postajo na tleh se uporabljajo štiri:

| Koda | Pomen |
|---|---|
| QDM | magnetna smer **do** postaje |
| QDR | magnetna smer **od** postaje |
| QUJ | prava smer **do** postaje |
| QTE | prava smer **od** postaje |

Smeri **do** postaje in **od** nje se razlikujeta za 180°. Pravo in magnetno smer loči **magnetni odklon** (variacija) $V$, ki je vzhodni (E) ali zahodni (W):

```enacba
\text{QDR} = \text{QTE} - V, \qquad \text{QDM} = \text{QDR} \pm 180^\circ
```

$V$ je pozitiven, ko je odklon vzhodni: vzhodni odklon odšteješ, zahodnega prišteješ.

```interaktivno
id: q-kode
```

## Iskanje smeri

Postaja z radijskim goniometrom (VDF) izmeri, iz katere smeri prihaja tvoja oddaja. Ko zaprosiš za **QDM**, ti pove magnetni kurz, s katerim brez vetra letiš do postaje. Taka sporočila imajo prednost pred običajnimi.
