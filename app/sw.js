// Service worker za Kopilot (PWA). Ustvari ga tools/build_pwa.py –
// tega dokumenta ne urejaj v build/web, ampak v tools/pwa_sw_template.js.
//
// Delovanje:
// - Ob namestitvi shrani vse datoteke te različice v predpomnilnik
//   (aplikacija nato deluje brez interneta). Datoteke, ki se od prejšnje
//   različice niso spremenile, prepiše iz starega predpomnilnika, zato
//   posodobitev prenese samo spremembe.
// - Shrani tudi knjižnice Firebase z www.gstatic.com, ki jih aplikacija
//   naloži ob zagonu; brez njih se brez povezave ne bi odprla.
// - Vse zahteve postreže iz predpomnilnika svoje različice, zato se stara in
//   nova koda nikoli ne pomešata.
// - Datoteke z oznako l (CanvasKit, 3D pogled, slike teorije, licence) se ne
//   prenesejo ob namestitvi, ampak ob prvi uporabi. Stran po zagonu sporoči,
//   katere datoteke je naložila (CACHE_URLS), da se uporabljena različica
//   CanvasKit shrani, čeprav je prvi zagon tekel še brez service workerja.
//   Ob novi različici se take datoteke prenesejo znova le, če jih je ta
//   brskalnik že uporabljal in so se spremenile.
// - Nova različica se namesti v ozadju in počaka. Aktivira se, ko uporabnik
//   pritisne »Osveži« ali ko so vsa okna aplikacije zaprta.

const VERSION = "3dd15e148172";
const CACHE = 'kopilot-' + VERSION;
// [{ u: pot ali polni URL, h: zgoščena vsebina }]
const FILES = [
  {
    "u": ".last_build_id",
    "h": "582235e6be3cb382"
  },
  {
    "u": "assets/AssetManifest.bin",
    "h": "dec80eb8f9f0ddd9"
  },
  {
    "u": "assets/AssetManifest.bin.json",
    "h": "d876a1b5c3e4b920"
  },
  {
    "u": "assets/assets/branding/logo_symbol.png",
    "h": "e353323298f42e05"
  },
  {
    "u": "assets/assets/content/sl/manual/aerotow_launch.png",
    "h": "9e42cc52de759766"
  },
  {
    "u": "assets/assets/content/sl/manual/aircraft.json",
    "h": "29025ae228ad9149"
  },
  {
    "u": "assets/assets/content/sl/manual/airfields.json",
    "h": "900e662f232116b0"
  },
  {
    "u": "assets/assets/content/sl/manual/checklists.json",
    "h": "bb9b19906ca0bb56"
  },
  {
    "u": "assets/assets/content/sl/manual/circuit_route.png",
    "h": "61c26f216b75c467"
  },
  {
    "u": "assets/assets/content/sl/manual/glossary.json",
    "h": "bc3abeeecadb3468"
  },
  {
    "u": "assets/assets/content/sl/manual/mnemonics.json",
    "h": "901436acc883c97c"
  },
  {
    "u": "assets/assets/content/sl/manual/preflight_route.png",
    "h": "624db8b9f479ec90"
  },
  {
    "u": "assets/assets/content/sl/manual/procedures.json",
    "h": "148f85ec1b0c2a8f"
  },
  {
    "u": "assets/assets/content/sl/manual/radio_conversations.json",
    "h": "3d092fa0e25f5c80"
  },
  {
    "u": "assets/assets/content/sl/manual/signals.json",
    "h": "8a96fa84101812e1"
  },
  {
    "u": "assets/assets/content/sl/manual/signals_aerotow.png",
    "h": "87a8052517e11fe4"
  },
  {
    "u": "assets/assets/content/sl/manual/signals_winch.png",
    "h": "720c1662870406ca"
  },
  {
    "u": "assets/assets/content/sl/manual/spin_recovery.png",
    "h": "6b7ec609093a287a"
  },
  {
    "u": "assets/assets/content/sl/manual/winch_launch.png",
    "h": "9c9972c8d0427a12"
  },
  {
    "u": "assets/assets/content/sl/questions/10_air_law.json",
    "h": "2332f972054ae8c0"
  },
  {
    "u": "assets/assets/content/sl/questions/20_human_performance.json",
    "h": "e7ddfb07ffb44923"
  },
  {
    "u": "assets/assets/content/sl/questions/30_meteorology.json",
    "h": "e510c08088390e96"
  },
  {
    "u": "assets/assets/content/sl/questions/40_communication.json",
    "h": "c86df1c2bb0d7258"
  },
  {
    "u": "assets/assets/content/sl/questions/51_principles_of_flight_aeroplane.json",
    "h": "ab6fa4dc70e4313d"
  },
  {
    "u": "assets/assets/content/sl/questions/60_operational_procedures.json",
    "h": "1faac67afae07d24"
  },
  {
    "u": "assets/assets/content/sl/questions/70_flight_performance_and_planning.json",
    "h": "8d8165820e2d04ce"
  },
  {
    "u": "assets/assets/content/sl/questions/80_aircraft_general_knowledge.json",
    "h": "4ea358e31b33bd57"
  },
  {
    "u": "assets/assets/content/sl/questions/90_navigation.json",
    "h": "1564f860d9e8184d"
  },
  {
    "u": "assets/assets/content/sl/questions/images/E10-200511-00254_alw-020.png",
    "h": "8bbaf547ed905bc9"
  },
  {
    "u": "assets/assets/content/sl/questions/images/E10-200511-00256_alw-010.png",
    "h": "94212a708b9a0c51"
  },
  {
    "u": "assets/assets/content/sl/questions/images/E10-200511-00259_alw-011.png",
    "h": "7b41279ff3d8f940"
  },
  {
    "u": "assets/assets/content/sl/questions/images/E20-200511-00093_hpl-002.png",
    "h": "32baf83baf46c8c5"
  },
  {
    "u": "assets/assets/content/sl/questions/images/E20-200511-00096_hpl-002.png",
    "h": "32baf83baf46c8c5"
  },
  {
    "u": "assets/assets/content/sl/questions/images/E30-200511-00080_met-001.png",
    "h": "e0e21be81c197295"
  },
  {
    "u": "assets/assets/content/sl/questions/images/E30-200511-00081_met-002.png",
    "h": "6bc744652273c65d"
  },
  {
    "u": "assets/assets/content/sl/questions/images/E30-200511-00083_met-004.png",
    "h": "a16accef572b7196"
  },
  {
    "u": "assets/assets/content/sl/questions/images/E30-200511-00101_met-005.png",
    "h": "efb62b5d18395dd8"
  },
  {
    "u": "assets/assets/content/sl/questions/images/E30-200511-00102_met-005.png",
    "h": "efb62b5d18395dd8"
  },
  {
    "u": "assets/assets/content/sl/questions/images/E30-200511-00103_met-005.png",
    "h": "efb62b5d18395dd8"
  },
  {
    "u": "assets/assets/content/sl/questions/images/E51-200511-00020_pfa-010.png",
    "h": "34b111d288a213f9"
  },
  {
    "u": "assets/assets/content/sl/questions/images/E51-200511-00031_pfa-009.png",
    "h": "fbee72fd1be339d7"
  },
  {
    "u": "assets/assets/content/sl/questions/images/E51-200511-00041_pfa-003.png",
    "h": "c4710547e48d30d1"
  },
  {
    "u": "assets/assets/content/sl/questions/images/E51-200511-00098_pfa-006.png",
    "h": "7ea1d4b068f0b3c2"
  },
  {
    "u": "assets/assets/content/sl/questions/images/E70-200511-00066_pfp-052e.png",
    "h": "ab71654a1ac1713d"
  },
  {
    "u": "assets/assets/content/sl/questions/images/E70-200511-00074_pfp-004.png",
    "h": "cfef8277e79e7115"
  },
  {
    "u": "assets/assets/content/sl/questions/images/E70-200511-00170_pfp-024.png",
    "h": "8b89847590953df2"
  },
  {
    "u": "assets/assets/content/sl/questions/images/E70-200511-00240_pfp-061.png",
    "h": "73a415d849492092"
  },
  {
    "u": "assets/assets/content/sl/questions/images/E70-200511-00245_pfp-063.png",
    "h": "1d3b0051b27fb172"
  },
  {
    "u": "assets/assets/content/sl/questions/images/E90-210519-00015_ec-90-001-v1.png",
    "h": "7b695153d7d28b10"
  },
  {
    "u": "assets/assets/content/sl/questions/index.json",
    "h": "c5fe9c77b158911e"
  },
  {
    "u": "assets/assets/content/sl/theory/10/01_pravo.md",
    "h": "f10f9078f1aece17"
  },
  {
    "u": "assets/assets/content/sl/theory/10/02_plovnost.md",
    "h": "e2df387047101e62"
  },
  {
    "u": "assets/assets/content/sl/theory/10/03_licence.md",
    "h": "d38bba33e949f1ba"
  },
  {
    "u": "assets/assets/content/sl/theory/10/04_pravila.md",
    "h": "5fd085a245ffb0ff"
  },
  {
    "u": "assets/assets/content/sl/theory/10/05_vmc.md",
    "h": "f50c1ba469f454a1"
  },
  {
    "u": "assets/assets/content/sl/theory/10/06_prestrezanje.md",
    "h": "116fd083a0727304"
  },
  {
    "u": "assets/assets/content/sl/theory/10/07_zracni_prostor.md",
    "h": "ebcb46fd724edc12"
  },
  {
    "u": "assets/assets/content/sl/theory/10/08_ais.md",
    "h": "279cb88db24c997c"
  },
  {
    "u": "assets/assets/content/sl/theory/10/09_letalisca.md",
    "h": "a8ddbf2171d4a027"
  },
  {
    "u": "assets/assets/content/sl/theory/10/10_signali.md",
    "h": "9ae12db9cf306ab7"
  },
  {
    "u": "assets/assets/content/sl/theory/10/11_sar.md",
    "h": "f872b3727be521e8"
  },
  {
    "u": "assets/assets/content/sl/theory/10/12_nesrece.md",
    "h": "9de9e753e5db143a"
  },
  {
    "u": "assets/assets/content/sl/theory/10/img/foto_beacon.jpg",
    "h": "4a38e1ea9285cb4a",
    "l": 1
  },
  {
    "u": "assets/assets/content/sl/theory/10/img/foto_signalsquare.jpg",
    "h": "954dea83f75fb18d",
    "l": 1
  },
  {
    "u": "assets/assets/content/sl/theory/10/img/foto_taxiwaysign.jpg",
    "h": "3df74f9a92714cd8",
    "l": 1
  },
  {
    "u": "assets/assets/content/sl/theory/10/img/foto_windsock.jpg",
    "h": "d1a207fd08e15dee",
    "l": 1
  },
  {
    "u": "assets/assets/content/sl/theory/10/img/talni_signali.png",
    "h": "db223f7cecc859dd",
    "l": 1
  },
  {
    "u": "assets/assets/content/sl/theory/20/01_cloveski_faktor.md",
    "h": "cc9436979e867b8a"
  },
  {
    "u": "assets/assets/content/sl/theory/20/02_atmosfera.md",
    "h": "7d363547641fa96f"
  },
  {
    "u": "assets/assets/content/sl/theory/20/03_hipoksija.md",
    "h": "d347f735da316941"
  },
  {
    "u": "assets/assets/content/sl/theory/20/04_telo.md",
    "h": "e3efea5b87042055"
  },
  {
    "u": "assets/assets/content/sl/theory/20/05_vid.md",
    "h": "52fc69d09fcc1f55"
  },
  {
    "u": "assets/assets/content/sl/theory/20/06_ravnotezje.md",
    "h": "d82b1f9627fc3332"
  },
  {
    "u": "assets/assets/content/sl/theory/20/07_iluzije.md",
    "h": "ac53017e4bdf4a0b"
  },
  {
    "u": "assets/assets/content/sl/theory/20/08_pospeski.md",
    "h": "397fb61f20bf0f14"
  },
  {
    "u": "assets/assets/content/sl/theory/20/09_spomin.md",
    "h": "7d417991f81789b4"
  },
  {
    "u": "assets/assets/content/sl/theory/20/10_napake.md",
    "h": "0049aaba7b7cf857"
  },
  {
    "u": "assets/assets/content/sl/theory/20/11_odlocanje.md",
    "h": "8a916d42eea102d8"
  },
  {
    "u": "assets/assets/content/sl/theory/20/12_stres.md",
    "h": "1096e6492b8515e0"
  },
  {
    "u": "assets/assets/content/sl/theory/20/13_okolje.md",
    "h": "d4db2c680f6b0e72"
  },
  {
    "u": "assets/assets/content/sl/theory/20/img/foto_ear.jpg",
    "h": "036b00a50b849b72",
    "l": 1
  },
  {
    "u": "assets/assets/content/sl/theory/20/img/foto_eye.jpg",
    "h": "b393a13e2ea6ce4d",
    "l": 1
  },
  {
    "u": "assets/assets/content/sl/theory/20/img/foto_swiss.jpg",
    "h": "b95f35219d53fa1c",
    "l": 1
  },
  {
    "u": "assets/assets/content/sl/theory/20/img/stres.png",
    "h": "7669def9ff660eee",
    "l": 1
  },
  {
    "u": "assets/assets/content/sl/theory/30/01_atmosfera.md",
    "h": "afef7bcd3a2498a4"
  },
  {
    "u": "assets/assets/content/sl/theory/30/02_temperatura.md",
    "h": "5d631eb688f319ec"
  },
  {
    "u": "assets/assets/content/sl/theory/30/03_tlak_isa.md",
    "h": "74fa2dba2a6b36ac"
  },
  {
    "u": "assets/assets/content/sl/theory/30/04_veter.md",
    "h": "2747af8a7d6776f2"
  },
  {
    "u": "assets/assets/content/sl/theory/30/05_vlaga.md",
    "h": "2147690b04f1a4c4"
  },
  {
    "u": "assets/assets/content/sl/theory/30/06_oblaki.md",
    "h": "1202ff11f662524d"
  },
  {
    "u": "assets/assets/content/sl/theory/30/07_megla.md",
    "h": "46d9190c1bf5ff7d"
  },
  {
    "u": "assets/assets/content/sl/theory/30/08_zracne_mase.md",
    "h": "277421f32666bcef"
  },
  {
    "u": "assets/assets/content/sl/theory/30/09_fronte.md",
    "h": "ecd81090fa20cae3"
  },
  {
    "u": "assets/assets/content/sl/theory/30/10_tlacni_sistemi.md",
    "h": "73a8aaae5b77d0a2"
  },
  {
    "u": "assets/assets/content/sl/theory/30/11_fen.md",
    "h": "077d0dac80817e5f"
  },
  {
    "u": "assets/assets/content/sl/theory/30/12_zaledenitev.md",
    "h": "9dc38e026980b42f"
  },
  {
    "u": "assets/assets/content/sl/theory/30/13_turbulenca.md",
    "h": "171b0fe1aef9bd21"
  },
  {
    "u": "assets/assets/content/sl/theory/30/14_nevihte.md",
    "h": "63ba927539ce9309"
  },
  {
    "u": "assets/assets/content/sl/theory/30/15_informacije.md",
    "h": "9f4af8b58714dfa0"
  },
  {
    "u": "assets/assets/content/sl/theory/30/16_termika.md",
    "h": "1325906e41f9dfb5"
  },
  {
    "u": "assets/assets/content/sl/theory/30/17_skewt.md",
    "h": "fcc8e2a622d0c1b4"
  },
  {
    "u": "assets/assets/content/sl/theory/30/img/fen.png",
    "h": "14c33e7e3941cfae",
    "l": 1
  },
  {
    "u": "assets/assets/content/sl/theory/30/img/foto_ac.jpg",
    "h": "ff67025c8835a09f",
    "l": 1
  },
  {
    "u": "assets/assets/content/sl/theory/30/img/foto_advfog.jpg",
    "h": "fedd26d31ed1dfed",
    "l": 1
  },
  {
    "u": "assets/assets/content/sl/theory/30/img/foto_as.jpg",
    "h": "a3be8d75a42d59ba",
    "l": 1
  },
  {
    "u": "assets/assets/content/sl/theory/30/img/foto_cb.jpg",
    "h": "b8051f74649b920b",
    "l": 1
  },
  {
    "u": "assets/assets/content/sl/theory/30/img/foto_cc.jpg",
    "h": "11b82e41f62afcb8",
    "l": 1
  },
  {
    "u": "assets/assets/content/sl/theory/30/img/foto_ci.jpg",
    "h": "83cd4f8627a9cb0d",
    "l": 1
  },
  {
    "u": "assets/assets/content/sl/theory/30/img/foto_cs.jpg",
    "h": "d75232d7614876f2",
    "l": 1
  },
  {
    "u": "assets/assets/content/sl/theory/30/img/foto_cu.jpg",
    "h": "5b8cae55c6bf2f82",
    "l": 1
  },
  {
    "u": "assets/assets/content/sl/theory/30/img/foto_gust.jpg",
    "h": "b0bf1cea1c884c34",
    "l": 1
  },
  {
    "u": "assets/assets/content/sl/theory/30/img/foto_hail.jpg",
    "h": "87ab24e632df2215",
    "l": 1
  },
  {
    "u": "assets/assets/content/sl/theory/30/img/foto_haze.jpg",
    "h": "c560071663911fb3",
    "l": 1
  },
  {
    "u": "assets/assets/content/sl/theory/30/img/foto_len.jpg",
    "h": "462288e8f28b973d",
    "l": 1
  },
  {
    "u": "assets/assets/content/sl/theory/30/img/foto_lightning.jpg",
    "h": "deeac34420d95069",
    "l": 1
  },
  {
    "u": "assets/assets/content/sl/theory/30/img/foto_mammatus.jpg",
    "h": "7e4582b12c1f4ebc",
    "l": 1
  },
  {
    "u": "assets/assets/content/sl/theory/30/img/foto_ns.jpg",
    "h": "07372caf6bf84f4e",
    "l": 1
  },
  {
    "u": "assets/assets/content/sl/theory/30/img/foto_radfog.jpg",
    "h": "f55b3673c2044554",
    "l": 1
  },
  {
    "u": "assets/assets/content/sl/theory/30/img/foto_satellite.jpg",
    "h": "7d01161f8031e604",
    "l": 1
  },
  {
    "u": "assets/assets/content/sl/theory/30/img/foto_sc.jpg",
    "h": "090e25d9d0d21aee",
    "l": 1
  },
  {
    "u": "assets/assets/content/sl/theory/30/img/foto_st.jpg",
    "h": "c5a23d42f30b1e00",
    "l": 1
  },
  {
    "u": "assets/assets/content/sl/theory/30/img/foto_thermal.jpg",
    "h": "dd8df88799b3fad3",
    "l": 1
  },
  {
    "u": "assets/assets/content/sl/theory/30/img/fronte.png",
    "h": "98aaa55db5a6d61f",
    "l": 1
  },
  {
    "u": "assets/assets/content/sl/theory/30/img/oblaki.png",
    "h": "05ff268fa0178f4d",
    "l": 1
  },
  {
    "u": "assets/assets/content/sl/theory/30/img/plasti.png",
    "h": "77984172091451f4",
    "l": 1
  },
  {
    "u": "assets/assets/content/sl/theory/30/img/skewt.png",
    "h": "c3fca9dfb2af1d91",
    "l": 1
  },
  {
    "u": "assets/assets/content/sl/theory/30/img/termika.png",
    "h": "9fcb41cdc9596bce",
    "l": 1
  },
  {
    "u": "assets/assets/content/sl/theory/40/01_valovanje.md",
    "h": "4e3814f887560d60"
  },
  {
    "u": "assets/assets/content/sl/theory/40/02_obmocja.md",
    "h": "619e49bb8a419255"
  },
  {
    "u": "assets/assets/content/sl/theory/40/03_sirjenje.md",
    "h": "174288f5ef2ae02c"
  },
  {
    "u": "assets/assets/content/sl/theory/40/04_vhf_kanali.md",
    "h": "a4545746a0dc21fb"
  },
  {
    "u": "assets/assets/content/sl/theory/40/05_postaja.md",
    "h": "5abb64c7fc659598"
  },
  {
    "u": "assets/assets/content/sl/theory/40/06_abeceda.md",
    "h": "541fb54c38c15189"
  },
  {
    "u": "assets/assets/content/sl/theory/40/07_stevila.md",
    "h": "0d01b7c08487ea37"
  },
  {
    "u": "assets/assets/content/sl/theory/40/08_zveza.md",
    "h": "073dd2d06eaa606d"
  },
  {
    "u": "assets/assets/content/sl/theory/40/09_izrazi.md",
    "h": "7627776073287bf0"
  },
  {
    "u": "assets/assets/content/sl/theory/40/10_ponovitev.md",
    "h": "b2a4cfdcc499c043"
  },
  {
    "u": "assets/assets/content/sl/theory/40/11_nujni.md",
    "h": "4fb4cafa6bb0f884"
  },
  {
    "u": "assets/assets/content/sl/theory/40/12_transponder.md",
    "h": "ac8de8a79fef48c8"
  },
  {
    "u": "assets/assets/content/sl/theory/40/13_prestrezanje.md",
    "h": "022a5a377fbbd622"
  },
  {
    "u": "assets/assets/content/sl/theory/40/14_q_kode.md",
    "h": "2a1d00b1a0689681"
  },
  {
    "u": "assets/assets/content/sl/theory/40/15_frekvence.md",
    "h": "139a03737d523704"
  },
  {
    "u": "assets/assets/content/sl/theory/40/16_kratice.md",
    "h": "636bd73ec5cfb61a"
  },
  {
    "u": "assets/assets/content/sl/theory/40/17_vreme.md",
    "h": "497b7526920ce85e"
  },
  {
    "u": "assets/assets/content/sl/theory/40/img/foto_antenna.jpg",
    "h": "a915d11eb474a410",
    "l": 1
  },
  {
    "u": "assets/assets/content/sl/theory/40/img/foto_headset.jpg",
    "h": "6242c696be03a413",
    "l": 1
  },
  {
    "u": "assets/assets/content/sl/theory/40/img/foto_transponder.jpg",
    "h": "cb777e531e0faa60",
    "l": 1
  },
  {
    "u": "assets/assets/content/sl/theory/40/img/kanali.png",
    "h": "78cc60f3fc56cc92",
    "l": 1
  },
  {
    "u": "assets/assets/content/sl/theory/40/img/sirjenje.png",
    "h": "259405d98ad0fdf3",
    "l": 1
  },
  {
    "u": "assets/assets/content/sl/theory/40/img/val.png",
    "h": "b890cd07d937f194",
    "l": 1
  },
  {
    "u": "assets/assets/content/sl/theory/51/01_tlak.md",
    "h": "bd22d59c96b4c255"
  },
  {
    "u": "assets/assets/content/sl/theory/51/02_profil.md",
    "h": "74dc83d97fa1c0bf"
  },
  {
    "u": "assets/assets/content/sl/theory/51/03_mejna_plast.md",
    "h": "c96a3e9fc0c78aef"
  },
  {
    "u": "assets/assets/content/sl/theory/51/04_vzgon.md",
    "h": "e0e1ae073e949e71"
  },
  {
    "u": "assets/assets/content/sl/theory/51/05_upor.md",
    "h": "ee2983e19fa6d668"
  },
  {
    "u": "assets/assets/content/sl/theory/51/06_porusitev.md",
    "h": "65902c878a14a6be"
  },
  {
    "u": "assets/assets/content/sl/theory/51/07_vrij.md",
    "h": "2bf1ea28d73caa31"
  },
  {
    "u": "assets/assets/content/sl/theory/51/08_krmila.md",
    "h": "e313186944bbb58b"
  },
  {
    "u": "assets/assets/content/sl/theory/51/09_stabilnost.md",
    "h": "bcf4746ddb4b3044"
  },
  {
    "u": "assets/assets/content/sl/theory/51/10_obremenitve.md",
    "h": "8ccee91e3aa8e14c"
  },
  {
    "u": "assets/assets/content/sl/theory/51/11_drsni_let.md",
    "h": "f056fe675e5df9f8"
  },
  {
    "u": "assets/assets/content/sl/theory/51/img/cl_alfa.png",
    "h": "e6ad0dedd02890ed",
    "l": 1
  },
  {
    "u": "assets/assets/content/sl/theory/51/img/foto_condensation.jpg",
    "h": "f767629abde3762b",
    "l": 1
  },
  {
    "u": "assets/assets/content/sl/theory/51/img/foto_vortex2.jpg",
    "h": "9ed7af28178e1438",
    "l": 1
  },
  {
    "u": "assets/assets/content/sl/theory/51/img/foto_winglet.jpg",
    "h": "9c29597bad40fbd8",
    "l": 1
  },
  {
    "u": "assets/assets/content/sl/theory/51/img/mejna_plast.png",
    "h": "3f489283314f4c07",
    "l": 1
  },
  {
    "u": "assets/assets/content/sl/theory/51/img/osi.png",
    "h": "cd6ae82ab5e40de1",
    "l": 1
  },
  {
    "u": "assets/assets/content/sl/theory/51/img/profil.png",
    "h": "edf9887879d78b8e",
    "l": 1
  },
  {
    "u": "assets/assets/content/sl/theory/51/img/sile_v_zavoju.png",
    "h": "4900abcf22a51e95",
    "l": 1
  },
  {
    "u": "assets/assets/content/sl/theory/51/img/upor.png",
    "h": "cc3e4e9500e2a469",
    "l": 1
  },
  {
    "u": "assets/assets/content/sl/theory/51/img/vn.png",
    "h": "ac59611e4c3709de",
    "l": 1
  },
  {
    "u": "assets/assets/content/sl/theory/51/koordiniran_zavoj.md",
    "h": "b5ad5625363e381d"
  },
  {
    "u": "assets/assets/content/sl/theory/60/01_priprava.md",
    "h": "79812a5c7818806f"
  },
  {
    "u": "assets/assets/content/sl/theory/60/02_vitel.md",
    "h": "cb4a604066bc8b20"
  },
  {
    "u": "assets/assets/content/sl/theory/60/03_aerovlek.md",
    "h": "da89e441b5518e80"
  },
  {
    "u": "assets/assets/content/sl/theory/60/04_jadranje.md",
    "h": "19c06f13ab9cd9aa"
  },
  {
    "u": "assets/assets/content/sl/theory/60/05_pristanek.md",
    "h": "91d677b55286fbf6"
  },
  {
    "u": "assets/assets/content/sl/theory/60/06_izven.md",
    "h": "73342d9ba00d3102"
  },
  {
    "u": "assets/assets/content/sl/theory/60/07_nenormalno.md",
    "h": "f496a6519bb2f3f2"
  },
  {
    "u": "assets/assets/content/sl/theory/60/img/foto_aerotow.jpg",
    "h": "b797427fd6274586",
    "l": 1
  },
  {
    "u": "assets/assets/content/sl/theory/60/img/foto_ridge.jpg",
    "h": "7974b14cf7740db0",
    "l": 1
  },
  {
    "u": "assets/assets/content/sl/theory/60/img/foto_trailer.jpg",
    "h": "5c6fdc5c74f19d74",
    "l": 1
  },
  {
    "u": "assets/assets/content/sl/theory/60/img/foto_winchlaunch.jpg",
    "h": "41f8e0003057d4f1",
    "l": 1
  },
  {
    "u": "assets/assets/content/sl/theory/60/img/krog.png",
    "h": "11c1f871cc467b5a",
    "l": 1
  },
  {
    "u": "assets/assets/content/sl/theory/60/img/vitel.png",
    "h": "c8fb44e7319d55ec",
    "l": 1
  },
  {
    "u": "assets/assets/content/sl/theory/70/01_masa.md",
    "h": "06741f03dbb6c8ef"
  },
  {
    "u": "assets/assets/content/sl/theory/70/02_zmogljivosti.md",
    "h": "3434463b00998c52"
  },
  {
    "u": "assets/assets/content/sl/theory/70/03_nacrtovanje.md",
    "h": "100ee9d2e47d0bbd"
  },
  {
    "u": "assets/assets/content/sl/theory/70/04_prelet.md",
    "h": "73ad4cf843a94df1"
  },
  {
    "u": "assets/assets/content/sl/theory/70/img/simboli.png",
    "h": "9089818986361d55",
    "l": 1
  },
  {
    "u": "assets/assets/content/sl/theory/80/01_konstrukcija.md",
    "h": "ea57e7e80bd67e12"
  },
  {
    "u": "assets/assets/content/sl/theory/80/02_plovnost.md",
    "h": "f1bd6ea9bc0ae71d"
  },
  {
    "u": "assets/assets/content/sl/theory/80/03_krmila.md",
    "h": "ddeebb4fd44018e7"
  },
  {
    "u": "assets/assets/content/sl/theory/80/04_pitot.md",
    "h": "276f095f23bf1a32"
  },
  {
    "u": "assets/assets/content/sl/theory/80/05_visinomer.md",
    "h": "2603d1df1718479d"
  },
  {
    "u": "assets/assets/content/sl/theory/80/06_hitrost.md",
    "h": "6a02f08e780e5f18"
  },
  {
    "u": "assets/assets/content/sl/theory/80/07_variometer.md",
    "h": "5ea3dc58115ded2f"
  },
  {
    "u": "assets/assets/content/sl/theory/80/08_kompas.md",
    "h": "84ca40a38a1ac96a"
  },
  {
    "u": "assets/assets/content/sl/theory/80/09_motor.md",
    "h": "9c0ecc09dba0e3ba"
  },
  {
    "u": "assets/assets/content/sl/theory/80/10_ziroskopi.md",
    "h": "fed5dcc890da257e"
  },
  {
    "u": "assets/assets/content/sl/theory/80/11_avionika.md",
    "h": "3f8c4b4b973e2bb3"
  },
  {
    "u": "assets/assets/content/sl/theory/80/12_nitka_gmeter.md",
    "h": "2bfe9d0e18f89924"
  },
  {
    "u": "assets/assets/content/sl/theory/80/13_elektronika.md",
    "h": "959cce6eda09557d"
  },
  {
    "u": "assets/assets/content/sl/theory/80/img/foto_alt.jpg",
    "h": "5709205754eb61de",
    "l": 1
  },
  {
    "u": "assets/assets/content/sl/theory/80/img/foto_asi_real.jpg",
    "h": "c5792fa9bd602582",
    "l": 1
  },
  {
    "u": "assets/assets/content/sl/theory/80/img/foto_ask21.jpg",
    "h": "19b66f9be8691a12",
    "l": 1
  },
  {
    "u": "assets/assets/content/sl/theory/80/img/foto_brake.jpg",
    "h": "1c4f834ec201d84d",
    "l": 1
  },
  {
    "u": "assets/assets/content/sl/theory/80/img/foto_compass.jpg",
    "h": "922d84f14d3b9f84",
    "l": 1
  },
  {
    "u": "assets/assets/content/sl/theory/80/img/foto_efis.jpg",
    "h": "1cdc83c79ce78f39",
    "l": 1
  },
  {
    "u": "assets/assets/content/sl/theory/80/img/foto_engine.jpg",
    "h": "1bfae17db988e92e",
    "l": 1
  },
  {
    "u": "assets/assets/content/sl/theory/80/img/foto_flarm2.jpg",
    "h": "36fc5a61a8f0d817",
    "l": 1
  },
  {
    "u": "assets/assets/content/sl/theory/80/img/foto_gear.jpg",
    "h": "b6b5e8cc1f2c5aa3",
    "l": 1
  },
  {
    "u": "assets/assets/content/sl/theory/80/img/foto_hook.jpg",
    "h": "d2e05759f7d56e94",
    "l": 1
  },
  {
    "u": "assets/assets/content/sl/theory/80/img/foto_levers.jpg",
    "h": "ae8aa31d8981f0ea",
    "l": 1
  },
  {
    "u": "assets/assets/content/sl/theory/80/img/foto_navpanel.jpg",
    "h": "0ba2bdfbf7dbef41",
    "l": 1
  },
  {
    "u": "assets/assets/content/sl/theory/80/img/foto_panel.jpg",
    "h": "f6a8b0a1d667d45c",
    "l": 1
  },
  {
    "u": "assets/assets/content/sl/theory/80/img/foto_pitot.jpg",
    "h": "3ffcacd7e26c36a8",
    "l": 1
  },
  {
    "u": "assets/assets/content/sl/theory/80/img/foto_ribs.jpg",
    "h": "45edb3273a4e2e82",
    "l": 1
  },
  {
    "u": "assets/assets/content/sl/theory/80/img/foto_semimono.jpg",
    "h": "0a45b8e58a5c48e2",
    "l": 1
  },
  {
    "u": "assets/assets/content/sl/theory/80/img/foto_sixpack.jpg",
    "h": "0e8d5f28d603e1e0",
    "l": 1
  },
  {
    "u": "assets/assets/content/sl/theory/80/img/foto_static.jpg",
    "h": "c537733790097903",
    "l": 1
  },
  {
    "u": "assets/assets/content/sl/theory/80/img/foto_tail.jpg",
    "h": "0e23416c179fadd0",
    "l": 1
  },
  {
    "u": "assets/assets/content/sl/theory/80/img/foto_tmg.jpg",
    "h": "5275a24e14152af1",
    "l": 1
  },
  {
    "u": "assets/assets/content/sl/theory/80/img/foto_trim.jpg",
    "h": "cd7463a582224a51",
    "l": 1
  },
  {
    "u": "assets/assets/content/sl/theory/80/img/foto_vario.jpg",
    "h": "82b9063d4a3d2d4a",
    "l": 1
  },
  {
    "u": "assets/assets/content/sl/theory/80/img/foto_vario_te.jpg",
    "h": "e5a3097840b6c3bb",
    "l": 1
  },
  {
    "u": "assets/assets/content/sl/theory/80/img/gmeter.png",
    "h": "5a560162b36f677f",
    "l": 1
  },
  {
    "u": "assets/assets/content/sl/theory/80/img/hitrost.png",
    "h": "680f05ecfbd5e3f1",
    "l": 1
  },
  {
    "u": "assets/assets/content/sl/theory/80/img/krilo.png",
    "h": "1de7ba7ec757293c",
    "l": 1
  },
  {
    "u": "assets/assets/content/sl/theory/80/img/nitka.png",
    "h": "4c04562a8bd9cfc0",
    "l": 1
  },
  {
    "u": "assets/assets/content/sl/theory/80/img/pitot.png",
    "h": "72974b132995fb9c",
    "l": 1
  },
  {
    "u": "assets/assets/content/sl/theory/80/img/visinomer.png",
    "h": "3ae3f34fac6bf412",
    "l": 1
  },
  {
    "u": "assets/assets/content/sl/theory/90/01_zemlja.md",
    "h": "f1fb53486571e7a8"
  },
  {
    "u": "assets/assets/content/sl/theory/90/02_cas.md",
    "h": "373858d51362687e"
  },
  {
    "u": "assets/assets/content/sl/theory/90/03_smeri.md",
    "h": "0d3c3735c175b3c1"
  },
  {
    "u": "assets/assets/content/sl/theory/90/04_karte.md",
    "h": "0214ac5fb3615282"
  },
  {
    "u": "assets/assets/content/sl/theory/90/05_veter.md",
    "h": "20d995f169b321b9"
  },
  {
    "u": "assets/assets/content/sl/theory/90/06_med_letom.md",
    "h": "1d47208cf55d8faa"
  },
  {
    "u": "assets/assets/content/sl/theory/90/07_gnss.md",
    "h": "1ac23e60d9f23fdd"
  },
  {
    "u": "assets/assets/content/sl/theory/90/08_radionavigacija.md",
    "h": "92002bc033448f07"
  },
  {
    "u": "assets/assets/content/sl/theory/90/09_priprava.md",
    "h": "5422d127d468de52"
  },
  {
    "u": "assets/assets/content/sl/theory/90/img/foto_e6b.jpg",
    "h": "7182291096d9fe8c",
    "l": 1
  },
  {
    "u": "assets/assets/content/sl/theory/90/img/foto_lambert.jpg",
    "h": "320145110e27bc88",
    "l": 1
  },
  {
    "u": "assets/assets/content/sl/theory/90/img/foto_mercator.jpg",
    "h": "7f76cbdf06d634d1",
    "l": 1
  },
  {
    "u": "assets/assets/content/sl/theory/90/img/foto_meridians.jpg",
    "h": "3eab0c2889aa75dc",
    "l": 1
  },
  {
    "u": "assets/assets/content/sl/theory/index.json",
    "h": "85ad7f200df44fd6"
  },
  {
    "u": "assets/assets/fonts/KopilotSymbols-Bold.ttf",
    "h": "24b52214b1f2e9a3"
  },
  {
    "u": "assets/assets/fonts/KopilotSymbols.ttf",
    "h": "93364bfac950e585"
  },
  {
    "u": "assets/assets/fonts/PlusJakartaSans-Bold.ttf",
    "h": "5f5342ef76862b5b"
  },
  {
    "u": "assets/assets/fonts/PlusJakartaSans-ExtraBold.ttf",
    "h": "7d60d21b5dec501c"
  },
  {
    "u": "assets/assets/fonts/PlusJakartaSans-Medium.ttf",
    "h": "c77bab757d7402ec"
  },
  {
    "u": "assets/assets/fonts/PlusJakartaSans-Regular.ttf",
    "h": "bd6276d4060e3b1e"
  },
  {
    "u": "assets/assets/fonts/PlusJakartaSans-SemiBold.ttf",
    "h": "65dbcedb6596a41c"
  },
  {
    "u": "assets/assets/geoid/egm96.bin",
    "h": "2ba441f3fe1aa146"
  },
  {
    "u": "assets/assets/map3d/igc3d.js",
    "h": "25744ece43fbf6cd",
    "l": 1
  },
  {
    "u": "assets/assets/map3d/index.html",
    "h": "46f7fd7b849af786",
    "l": 1
  },
  {
    "u": "assets/assets/map3d/maplibre-gl.css",
    "h": "576b085fdd9487a6",
    "l": 1
  },
  {
    "u": "assets/assets/map3d/maplibre-gl.js",
    "h": "d01ffd5aefe5fb27",
    "l": 1
  },
  {
    "u": "assets/FontManifest.json",
    "h": "f0cb0930d958f024"
  },
  {
    "u": "assets/fonts/fallback/Roboto-Regular.ttf",
    "h": "79e851404657dac2"
  },
  {
    "u": "assets/fonts/MaterialIcons-Regular.otf",
    "h": "e8d61dba4010eebf"
  },
  {
    "u": "assets/NOTICES",
    "h": "f667b5133a6d3f7d",
    "l": 1
  },
  {
    "u": "assets/packages/cupertino_icons/assets/CupertinoIcons.ttf",
    "h": "3d90c370aa4cf00d"
  },
  {
    "u": "assets/packages/flutter_map/lib/assets/flutter_map_logo.png",
    "h": "6051ae42fb505931"
  },
  {
    "u": "assets/packages/flutter_math_fork/lib/katex_fonts/fonts/KaTeX_AMS-Regular.ttf",
    "h": "85f9f2224f9d3049"
  },
  {
    "u": "assets/packages/flutter_math_fork/lib/katex_fonts/fonts/KaTeX_Caligraphic-Bold.ttf",
    "h": "ed6f3b5e041d1692"
  },
  {
    "u": "assets/packages/flutter_math_fork/lib/katex_fonts/fonts/KaTeX_Caligraphic-Regular.ttf",
    "h": "0ea93868466abdda"
  },
  {
    "u": "assets/packages/flutter_math_fork/lib/katex_fonts/fonts/KaTeX_Fraktur-Bold.ttf",
    "h": "1c74228270fff6b6"
  },
  {
    "u": "assets/packages/flutter_math_fork/lib/katex_fonts/fonts/KaTeX_Fraktur-Regular.ttf",
    "h": "7fb43e3bc460c918"
  },
  {
    "u": "assets/packages/flutter_math_fork/lib/katex_fonts/fonts/KaTeX_Main-Bold.ttf",
    "h": "afba779276abb90d"
  },
  {
    "u": "assets/packages/flutter_math_fork/lib/katex_fonts/fonts/KaTeX_Main-BoldItalic.ttf",
    "h": "8f7ded0679aabf07"
  },
  {
    "u": "assets/packages/flutter_math_fork/lib/katex_fonts/fonts/KaTeX_Main-Italic.ttf",
    "h": "5d1f693d3abbfe38"
  },
  {
    "u": "assets/packages/flutter_math_fork/lib/katex_fonts/fonts/KaTeX_Main-Regular.ttf",
    "h": "334f933a72d058b6"
  },
  {
    "u": "assets/packages/flutter_math_fork/lib/katex_fonts/fonts/KaTeX_Math-BoldItalic.ttf",
    "h": "30a340e7be0633c4"
  },
  {
    "u": "assets/packages/flutter_math_fork/lib/katex_fonts/fonts/KaTeX_Math-Italic.ttf",
    "h": "d8864703a46f8f84"
  },
  {
    "u": "assets/packages/flutter_math_fork/lib/katex_fonts/fonts/KaTeX_SansSerif-Bold.ttf",
    "h": "2e16724cc4634531"
  },
  {
    "u": "assets/packages/flutter_math_fork/lib/katex_fonts/fonts/KaTeX_SansSerif-Italic.ttf",
    "h": "181f761261a61c2a"
  },
  {
    "u": "assets/packages/flutter_math_fork/lib/katex_fonts/fonts/KaTeX_SansSerif-Regular.ttf",
    "h": "b43cecc782fea7c1"
  },
  {
    "u": "assets/packages/flutter_math_fork/lib/katex_fonts/fonts/KaTeX_Script-Regular.ttf",
    "h": "076ecacccedc9537"
  },
  {
    "u": "assets/packages/flutter_math_fork/lib/katex_fonts/fonts/KaTeX_Size1-Regular.ttf",
    "h": "55d56f5a9989b750"
  },
  {
    "u": "assets/packages/flutter_math_fork/lib/katex_fonts/fonts/KaTeX_Size2-Regular.ttf",
    "h": "7a9f51ca341ba936"
  },
  {
    "u": "assets/packages/flutter_math_fork/lib/katex_fonts/fonts/KaTeX_Size3-Regular.ttf",
    "h": "82af052b616478aa"
  },
  {
    "u": "assets/packages/flutter_math_fork/lib/katex_fonts/fonts/KaTeX_Size4-Regular.ttf",
    "h": "bb58709dd6babc88"
  },
  {
    "u": "assets/packages/flutter_math_fork/lib/katex_fonts/fonts/KaTeX_Typewriter-Regular.ttf",
    "h": "ef8bbd91d323fef1"
  },
  {
    "u": "assets/shaders/ink_sparkle.frag",
    "h": "2dca5ab93d4ec29e"
  },
  {
    "u": "assets/shaders/stretch_effect.frag",
    "h": "ab412f07a5b9b50b"
  },
  {
    "u": "canvaskit/canvaskit.js",
    "h": "bb559f6080c7d312",
    "l": 1
  },
  {
    "u": "canvaskit/canvaskit.wasm",
    "h": "fbed517a43e82452",
    "l": 1
  },
  {
    "u": "canvaskit/chromium/canvaskit.js",
    "h": "6018b12bd8ed37e6",
    "l": 1
  },
  {
    "u": "canvaskit/chromium/canvaskit.wasm",
    "h": "ae8ff1d858140f7b",
    "l": 1
  },
  {
    "u": "canvaskit/webparagraph/canvaskit.js",
    "h": "3110e3e4d9b7b565",
    "l": 1
  },
  {
    "u": "canvaskit/webparagraph/canvaskit.wasm",
    "h": "0ce1b05082efdc85",
    "l": 1
  },
  {
    "u": "canvaskit/wimp.js",
    "h": "8fd8a47480c6eb0a",
    "l": 1
  },
  {
    "u": "canvaskit/wimp.wasm",
    "h": "e924eaafd801d41e",
    "l": 1
  },
  {
    "u": "favicon.png",
    "h": "62394905acb5a667"
  },
  {
    "u": "flutter.js",
    "h": "2beb1ce6b159c715"
  },
  {
    "u": "flutter_bootstrap.js",
    "h": "57044a03dc8ce81c"
  },
  {
    "u": "icons/Icon-192.png",
    "h": "98ec81d630ef2757"
  },
  {
    "u": "icons/Icon-512.png",
    "h": "ab3606ace9e2165c"
  },
  {
    "u": "icons/Icon-maskable-192.png",
    "h": "4402ff69365bf552"
  },
  {
    "u": "icons/Icon-maskable-512.png",
    "h": "c0286e88fd74d3ed"
  },
  {
    "u": "index.html",
    "h": "a092d71317bc8ae8"
  },
  {
    "u": "main.dart.js",
    "h": "f934addc7baedec3"
  },
  {
    "u": "manifest.json",
    "h": "c49bec27365e0fa2"
  },
  {
    "u": "version.json",
    "h": "e892f2b3149f2d5e"
  },
  {
    "u": "https://www.gstatic.com/firebasejs/13.1.0/firebase-app.js",
    "h": "13.1.0"
  },
  {
    "u": "https://www.gstatic.com/firebasejs/13.1.0/firebase-auth.js",
    "h": "13.1.0"
  },
  {
    "u": "https://www.gstatic.com/firebasejs/13.1.0/firebase-firestore-pipelines.js",
    "h": "13.1.0"
  }
];
const HASHES = '__hashes__';
// Datoteke, ki se shranijo ob prvi uporabi: pot → zgoščena vsebina.
const LAZY = new Map(FILES.filter((f) => f.l).map((f) => [f.u, f.h]));

function external(url) {
  return /^https?:\/\//.test(url);
}

/// Prejšnji predpomnilnik s seznamom zgoščenih vrednosti (če obstaja).
async function previousCache() {
  for (const key of await caches.keys()) {
    if (!key.startsWith('kopilot-') || key === CACHE) continue;
    const cache = await caches.open(key);
    const res = await cache.match(HASHES);
    if (res) return { cache, hashes: await res.json() };
  }
  return { cache: null, hashes: {} };
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE);
      const old = await previousCache();
      await Promise.all(
        FILES.map(async (f) => {
          const oldHit = old.cache ? await old.cache.match(f.u) : undefined;
          if (oldHit && old.hashes[f.u] === f.h) return cache.put(f.u, oldHit);
          // Datoteka ob prvi uporabi: prenesemo jo le, če jo je ta brskalnik že
          // uporabljal (sicer bi nova različica brez interneta ne imela CanvasKit).
          if (f.l && !oldHit) return;
          // cache: 'reload' obide predpomnilnik HTTP, da res dobimo novo različico.
          const req = new Request(f.u, {
            cache: 'reload',
            mode: external(f.u) ? 'cors' : 'same-origin',
          });
          const res = await fetch(req);
          if (!res.ok) throw new Error('Prenos ni uspel: ' + f.u);
          return cache.put(f.u, res);
        }),
      );
      const hashes = {};
      for (const f of FILES) hashes[f.u] = f.h;
      await cache.put(HASHES, new Response(JSON.stringify(hashes)));
    })(),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((k) => k.startsWith('kopilot-') && k !== CACHE)
            .map((k) => caches.delete(k)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

/// Shrani datoteko ob prvi uporabi v predpomnilnik te različice.
async function cacheLazy(cache, path, res) {
  if (res && res.ok && LAZY.has(path)) await cache.put(path, res.clone());
  return res;
}

/// Pot datoteke glede na mapo aplikacije ali null, če ni z istega izvora.
function appPath(href) {
  const url = new URL(href, self.location.href);
  if (url.origin !== self.location.origin) return null;
  const scope = new URL(self.registration.scope).pathname;
  return url.pathname.startsWith(scope) ? url.pathname.slice(scope.length) : null;
}

self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
  // Stran sporoči naložene datoteke; manjkajoče datoteke ob prvi uporabi shranimo.
  if (event.data && event.data.type === 'CACHE_URLS') {
    event.waitUntil(
      caches.open(CACHE).then((cache) =>
        Promise.all(
          event.data.urls.map(async (href) => {
            const path = appPath(href);
            if (!path || !LAZY.has(path) || (await cache.match(path))) return;
            try {
              await cacheLazy(cache, path, await fetch(path));
            } catch (_) {
              // Brez interneta: poskusimo ob naslednjem zagonu.
            }
          }),
        ),
      ),
    );
  }
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // Knjižnice Firebase: iz predpomnilnika, sicer z omrežja.
  if (url.origin !== self.location.origin) {
    if (url.hostname === 'www.gstatic.com' && url.pathname.startsWith('/firebasejs/')) {
      event.respondWith(
        caches.open(CACHE).then((cache) =>
          cache.match(req.url).then((hit) => hit || fetch(req)),
        ),
      );
    }
    return;
  }

  const scope = new URL(self.registration.scope).pathname;
  let path = url.pathname.startsWith(scope)
    ? url.pathname.slice(scope.length)
    : url.pathname;
  if (path === '') path = 'index.html';

  // Datoteka iz predpomnilnika, tudi ob navigaciji (npr. iframe 3D pogleda).
  // Navigacija na naslov, ki ni datoteka aplikacije, dobi aplikacijo.
  event.respondWith(
    caches.open(CACHE).then(async (cache) => {
      const hit = await cache.match(path);
      if (hit) return hit;
      if (req.mode === 'navigate') {
        const shell = await cache.match('index.html');
        if (shell) return shell;
      }
      if (LAZY.has(path)) return cacheLazy(cache, path, await fetch(req));
      return fetch(req);
    }),
  );
});
