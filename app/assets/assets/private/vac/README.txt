Karte letališč iz AIP Slovenija (VFR karte, šolski krog, cone).

AIP je avtorsko zaščiten (GEN 0.1, točka 5): reprodukcija in distribucija
brez dovoljenja Slovenia Control nista dovoljeni. Zato so karte samo v
lokalni gradnji (flutter run, APK za lastno uporabo) in niso v gitu.
tools/build_site.py jih med gradnjo javne strani umakne in preveri, da
v dist/ ni nobene.

Vsebina mape (ustvari se iz izvorni_pdf/eksploatacija/letalisca/):
  charts.json       ID letališča -> seznam kart (src, title, source)
  <icao>_<n>.png    karte, upodobljene iz PDF pri 170 dpi
