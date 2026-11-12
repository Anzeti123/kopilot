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

const VERSION = "e58fc32f11c2";
const CACHE = 'kopilot-' + VERSION;
// [{ u: pot ali polni URL, h: zgoščena vsebina }]
const FILES = [
  {
    "u": ".last_build_id",
    "h": "5697689f32de81db"
  },
  {
    "u": "assets/AssetManifest.bin",
    "h": "ea444fdcefcb8ce0"
  },
  {
    "u": "assets/AssetManifest.bin.json",
    "h": "deded86714c070f7"
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
    "h": "9009f69c9aed65d8"
  },
  {
    "u": "assets/assets/content/sl/manual/airfields.json",
    "h": "9c78c7f470cb6c70"
  },
  {
    "u": "assets/assets/content/sl/manual/checklists.json",
    "h": "7af89f334c102e65"
  },
  {
    "u": "assets/assets/content/sl/manual/circuit_route.png",
    "h": "61c26f216b75c467"
  },
  {
    "u": "assets/assets/content/sl/manual/glossary.json",
    "h": "0b6503de3cf9427b"
  },
  {
    "u": "assets/assets/content/sl/manual/mnemonics.json",
    "h": "ef546c9f50c82199"
  },
  {
    "u": "assets/assets/content/sl/manual/preflight_route.png",
    "h": "624db8b9f479ec90"
  },
  {
    "u": "assets/assets/content/sl/manual/procedures.json",
    "h": "224653c87cc479f7"
  },
  {
    "u": "assets/assets/content/sl/manual/radio_conversations.json",
    "h": "435758351ddb7a37"
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
    "h": "a9dac707a0734f57"
  },
  {
    "u": "assets/assets/content/sl/questions/20_human_performance.json",
    "h": "9223b672acb188e5"
  },
  {
    "u": "assets/assets/content/sl/questions/30_meteorology.json",
    "h": "fd37b128c6cae937"
  },
  {
    "u": "assets/assets/content/sl/questions/40_communication.json",
    "h": "0faa1d8038ef2a80"
  },
  {
    "u": "assets/assets/content/sl/questions/51_principles_of_flight_aeroplane.json",
    "h": "474c145c8adfb344"
  },
  {
    "u": "assets/assets/content/sl/questions/60_operational_procedures.json",
    "h": "661e3838dc911031"
  },
  {
    "u": "assets/assets/content/sl/questions/70_flight_performance_and_planning.json",
    "h": "cbc0d4c95fa8d1c7"
  },
  {
    "u": "assets/assets/content/sl/questions/80_aircraft_general_knowledge.json",
    "h": "3bc701d7f83c90ad"
  },
  {
    "u": "assets/assets/content/sl/questions/90_navigation.json",
    "h": "050a86af9bf14abc"
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
    "h": "76f7d56d5ad1c257"
  },
  {
    "u": "assets/assets/content/sl/theory/10/02_plovnost.md",
    "h": "7d77655ebd8ff97e"
  },
  {
    "u": "assets/assets/content/sl/theory/10/03_licence.md",
    "h": "90cdb807523806c9"
  },
  {
    "u": "assets/assets/content/sl/theory/10/04_pravila.md",
    "h": "062bf3655d6216f8"
  },
  {
    "u": "assets/assets/content/sl/theory/10/05_vmc.md",
    "h": "92ef058f0dabc5c1"
  },
  {
    "u": "assets/assets/content/sl/theory/10/06_prestrezanje.md",
    "h": "6282263eae179f25"
  },
  {
    "u": "assets/assets/content/sl/theory/10/07_zracni_prostor.md",
    "h": "68c87fee1f582c17"
  },
  {
    "u": "assets/assets/content/sl/theory/10/08_ais.md",
    "h": "62d568a9d9ccc404"
  },
  {
    "u": "assets/assets/content/sl/theory/10/09_letalisca.md",
    "h": "e55b26763feacb5b"
  },
  {
    "u": "assets/assets/content/sl/theory/10/10_signali.md",
    "h": "f936d089d1119a8a"
  },
  {
    "u": "assets/assets/content/sl/theory/10/11_sar.md",
    "h": "0e9746407fff4808"
  },
  {
    "u": "assets/assets/content/sl/theory/10/12_nesrece.md",
    "h": "b581ae0cb9db76d1"
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
    "h": "9a60ab756d03cfce"
  },
  {
    "u": "assets/assets/content/sl/theory/20/02_atmosfera.md",
    "h": "93c49ead38e6bf8e"
  },
  {
    "u": "assets/assets/content/sl/theory/20/03_hipoksija.md",
    "h": "9802c611bca4f7b9"
  },
  {
    "u": "assets/assets/content/sl/theory/20/04_telo.md",
    "h": "34907ab9ac89c0e4"
  },
  {
    "u": "assets/assets/content/sl/theory/20/05_vid.md",
    "h": "98fb171a769a826d"
  },
  {
    "u": "assets/assets/content/sl/theory/20/06_ravnotezje.md",
    "h": "d76180a44ffb3197"
  },
  {
    "u": "assets/assets/content/sl/theory/20/07_iluzije.md",
    "h": "90c08b167eeda9c2"
  },
  {
    "u": "assets/assets/content/sl/theory/20/08_pospeski.md",
    "h": "8885e6b8a59f448b"
  },
  {
    "u": "assets/assets/content/sl/theory/20/09_spomin.md",
    "h": "c7df16f98f57a11b"
  },
  {
    "u": "assets/assets/content/sl/theory/20/10_napake.md",
    "h": "cdf6149393c67fe9"
  },
  {
    "u": "assets/assets/content/sl/theory/20/11_odlocanje.md",
    "h": "ed1f92628e31c39a"
  },
  {
    "u": "assets/assets/content/sl/theory/20/12_stres.md",
    "h": "b129c91ce2b1f954"
  },
  {
    "u": "assets/assets/content/sl/theory/20/13_okolje.md",
    "h": "2125f32eb139b95e"
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
    "h": "ace284dc181d42a2"
  },
  {
    "u": "assets/assets/content/sl/theory/30/02_temperatura.md",
    "h": "dd923de482a298f2"
  },
  {
    "u": "assets/assets/content/sl/theory/30/03_tlak_isa.md",
    "h": "096c517be46deaea"
  },
  {
    "u": "assets/assets/content/sl/theory/30/04_veter.md",
    "h": "6bda08c63d0efda7"
  },
  {
    "u": "assets/assets/content/sl/theory/30/05_vlaga.md",
    "h": "e576931a0ed0848d"
  },
  {
    "u": "assets/assets/content/sl/theory/30/06_oblaki.md",
    "h": "16aad37fe7595fd9"
  },
  {
    "u": "assets/assets/content/sl/theory/30/07_megla.md",
    "h": "9c12df65e4bfdc58"
  },
  {
    "u": "assets/assets/content/sl/theory/30/08_zracne_mase.md",
    "h": "2c6ee2113cef386c"
  },
  {
    "u": "assets/assets/content/sl/theory/30/09_fronte.md",
    "h": "3387b4040a67cdbb"
  },
  {
    "u": "assets/assets/content/sl/theory/30/10_tlacni_sistemi.md",
    "h": "0be6a62560b02d03"
  },
  {
    "u": "assets/assets/content/sl/theory/30/11_fen.md",
    "h": "f102546b4e4ff236"
  },
  {
    "u": "assets/assets/content/sl/theory/30/12_zaledenitev.md",
    "h": "9ff177c5f2ed2c46"
  },
  {
    "u": "assets/assets/content/sl/theory/30/13_turbulenca.md",
    "h": "de1c106349b4d271"
  },
  {
    "u": "assets/assets/content/sl/theory/30/14_nevihte.md",
    "h": "e304dac33b3cc3d9"
  },
  {
    "u": "assets/assets/content/sl/theory/30/15_informacije.md",
    "h": "44d69902240ebfaf"
  },
  {
    "u": "assets/assets/content/sl/theory/30/16_termika.md",
    "h": "8d66dd9e74207809"
  },
  {
    "u": "assets/assets/content/sl/theory/30/17_skewt.md",
    "h": "867ce8402f2a9b86"
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
    "h": "0a58a5923bd77d2f"
  },
  {
    "u": "assets/assets/content/sl/theory/40/02_obmocja.md",
    "h": "631f0cf2e0399f86"
  },
  {
    "u": "assets/assets/content/sl/theory/40/03_sirjenje.md",
    "h": "5396f6f16c550c74"
  },
  {
    "u": "assets/assets/content/sl/theory/40/04_vhf_kanali.md",
    "h": "3e541c3c80ebdea8"
  },
  {
    "u": "assets/assets/content/sl/theory/40/05_postaja.md",
    "h": "8b6d615bb9338647"
  },
  {
    "u": "assets/assets/content/sl/theory/40/06_abeceda.md",
    "h": "7088d21424ffdca0"
  },
  {
    "u": "assets/assets/content/sl/theory/40/07_stevila.md",
    "h": "270542c5034a34d2"
  },
  {
    "u": "assets/assets/content/sl/theory/40/08_zveza.md",
    "h": "41448bad03bbbca4"
  },
  {
    "u": "assets/assets/content/sl/theory/40/09_izrazi.md",
    "h": "e986527612f3bad1"
  },
  {
    "u": "assets/assets/content/sl/theory/40/10_ponovitev.md",
    "h": "22ffff03baa27f7f"
  },
  {
    "u": "assets/assets/content/sl/theory/40/11_nujni.md",
    "h": "b425bfb625d47b1b"
  },
  {
    "u": "assets/assets/content/sl/theory/40/12_transponder.md",
    "h": "934ce06b36dc3199"
  },
  {
    "u": "assets/assets/content/sl/theory/40/13_prestrezanje.md",
    "h": "8e65ce39d30676e2"
  },
  {
    "u": "assets/assets/content/sl/theory/40/14_q_kode.md",
    "h": "3b4f5dff8dd0bdf0"
  },
  {
    "u": "assets/assets/content/sl/theory/40/15_frekvence.md",
    "h": "9b650ff6dd088d78"
  },
  {
    "u": "assets/assets/content/sl/theory/40/16_kratice.md",
    "h": "83476c123f1a3370"
  },
  {
    "u": "assets/assets/content/sl/theory/40/17_vreme.md",
    "h": "09911d1eb98f449d"
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
    "h": "b9b8161b7ab0d26a"
  },
  {
    "u": "assets/assets/content/sl/theory/51/02_profil.md",
    "h": "34aed439cb42ad16"
  },
  {
    "u": "assets/assets/content/sl/theory/51/03_mejna_plast.md",
    "h": "7cc7b65130a5cf3f"
  },
  {
    "u": "assets/assets/content/sl/theory/51/04_vzgon.md",
    "h": "c35763874422d872"
  },
  {
    "u": "assets/assets/content/sl/theory/51/05_upor.md",
    "h": "34d2b4449a97fec1"
  },
  {
    "u": "assets/assets/content/sl/theory/51/06_porusitev.md",
    "h": "5ef415282f5ec873"
  },
  {
    "u": "assets/assets/content/sl/theory/51/07_vrij.md",
    "h": "8717257dd23289f2"
  },
  {
    "u": "assets/assets/content/sl/theory/51/08_krmila.md",
    "h": "e5c3f42624e01d80"
  },
  {
    "u": "assets/assets/content/sl/theory/51/09_stabilnost.md",
    "h": "1034706d3e666b79"
  },
  {
    "u": "assets/assets/content/sl/theory/51/10_obremenitve.md",
    "h": "e8bdf3e7cdc7f26a"
  },
  {
    "u": "assets/assets/content/sl/theory/51/11_drsni_let.md",
    "h": "4d6623b7102d54fa"
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
    "h": "d5b188ae00591fd5"
  },
  {
    "u": "assets/assets/content/sl/theory/60/01_priprava.md",
    "h": "628b37f7ea16cb3d"
  },
  {
    "u": "assets/assets/content/sl/theory/60/02_vitel.md",
    "h": "c576a1f5305a26ba"
  },
  {
    "u": "assets/assets/content/sl/theory/60/03_aerovlek.md",
    "h": "28f78e670f9261da"
  },
  {
    "u": "assets/assets/content/sl/theory/60/04_jadranje.md",
    "h": "15b353d9dbcac4c1"
  },
  {
    "u": "assets/assets/content/sl/theory/60/05_pristanek.md",
    "h": "994e89efba662a05"
  },
  {
    "u": "assets/assets/content/sl/theory/60/06_izven.md",
    "h": "98d7d3d156e3aca1"
  },
  {
    "u": "assets/assets/content/sl/theory/60/07_nenormalno.md",
    "h": "1044a86e8582a57e"
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
    "h": "f2e05fe1e4d54339"
  },
  {
    "u": "assets/assets/content/sl/theory/70/02_zmogljivosti.md",
    "h": "09166eb98bb4c654"
  },
  {
    "u": "assets/assets/content/sl/theory/70/03_nacrtovanje.md",
    "h": "8f3e89de2c5da9a8"
  },
  {
    "u": "assets/assets/content/sl/theory/70/04_prelet.md",
    "h": "75ee83699475e585"
  },
  {
    "u": "assets/assets/content/sl/theory/70/img/simboli.png",
    "h": "9089818986361d55",
    "l": 1
  },
  {
    "u": "assets/assets/content/sl/theory/80/01_konstrukcija.md",
    "h": "3911db463bbadabe"
  },
  {
    "u": "assets/assets/content/sl/theory/80/02_plovnost.md",
    "h": "d993cb8c9c235e8e"
  },
  {
    "u": "assets/assets/content/sl/theory/80/03_krmila.md",
    "h": "6d69ec93fd422fc2"
  },
  {
    "u": "assets/assets/content/sl/theory/80/04_pitot.md",
    "h": "f32738b54c35dc99"
  },
  {
    "u": "assets/assets/content/sl/theory/80/05_visinomer.md",
    "h": "9afdbc7d04e2c1fe"
  },
  {
    "u": "assets/assets/content/sl/theory/80/06_hitrost.md",
    "h": "9aa7c8c86b33fbc5"
  },
  {
    "u": "assets/assets/content/sl/theory/80/07_variometer.md",
    "h": "c114fe3d7d08a709"
  },
  {
    "u": "assets/assets/content/sl/theory/80/08_kompas.md",
    "h": "e95b69ef45da035b"
  },
  {
    "u": "assets/assets/content/sl/theory/80/09_motor.md",
    "h": "5f672f067d082a9f"
  },
  {
    "u": "assets/assets/content/sl/theory/80/10_ziroskopi.md",
    "h": "70cf00fbea729357"
  },
  {
    "u": "assets/assets/content/sl/theory/80/11_avionika.md",
    "h": "b4df34d5be04abd1"
  },
  {
    "u": "assets/assets/content/sl/theory/80/img/foto_alt.jpg",
    "h": "5709205754eb61de",
    "l": 1
  },
  {
    "u": "assets/assets/content/sl/theory/80/img/foto_asi.jpg",
    "h": "bb08ccf5a31411cc",
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
    "u": "assets/assets/content/sl/theory/80/img/foto_engine.jpg",
    "h": "1bfae17db988e92e",
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
    "u": "assets/assets/content/sl/theory/80/img/krilo.png",
    "h": "1de7ba7ec757293c",
    "l": 1
  },
  {
    "u": "assets/assets/content/sl/theory/80/img/pitot.png",
    "h": "72974b132995fb9c",
    "l": 1
  },
  {
    "u": "assets/assets/content/sl/theory/90/01_zemlja.md",
    "h": "af73905835c766ab"
  },
  {
    "u": "assets/assets/content/sl/theory/90/02_cas.md",
    "h": "293c2966a3a40fad"
  },
  {
    "u": "assets/assets/content/sl/theory/90/03_smeri.md",
    "h": "95a11a9d09b687c7"
  },
  {
    "u": "assets/assets/content/sl/theory/90/04_karte.md",
    "h": "43becbab240391b6"
  },
  {
    "u": "assets/assets/content/sl/theory/90/05_veter.md",
    "h": "38c8ec695f6ffaf9"
  },
  {
    "u": "assets/assets/content/sl/theory/90/06_med_letom.md",
    "h": "ef16aae5428b7613"
  },
  {
    "u": "assets/assets/content/sl/theory/90/07_gnss.md",
    "h": "3a4c3ae6b8bfca92"
  },
  {
    "u": "assets/assets/content/sl/theory/90/08_radionavigacija.md",
    "h": "96f08c68a563d462"
  },
  {
    "u": "assets/assets/content/sl/theory/90/09_priprava.md",
    "h": "4af8b30c0618e8ba"
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
    "h": "d2c93392bc71cacb"
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
    "h": "28efe451df699996",
    "l": 1
  },
  {
    "u": "assets/assets/map3d/index.html",
    "h": "40f3b706470b8d65",
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
    "h": "a901d3ac3ecce0dd"
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
    "h": "b6fe47d17d7dd4bf"
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
    "h": "b3655264d6eb9677"
  },
  {
    "u": "main.dart.js",
    "h": "6a6590b0686ab6be"
  },
  {
    "u": "manifest.json",
    "h": "d82d4055d1053794"
  },
  {
    "u": "version.json",
    "h": "096225fd43be3f10"
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
