# Gedankenwerk

Gesicherte Teile des Gedankenwerk-Pakets. Die Klänge liegen separat in [`../sounds/`](../sounds/) (mit `katalog.json` und `LIZENZ.txt`).

| Ordner | Inhalt |
|---|---|
| `vorlage/` | Remotion-Vorlage: `package.json`, `tsconfig.json`, `remotion.config.ts`, `src/` (Root, basis/, videos/) |
| `kanal/illustrationen/` | Icons der Folgen (`icons_h02` … `icons_h100s`), Figuren |
| `kanal/cover/` | Cover-System und Thumbnails |
| `kanal/bausteine/` | LikeTeilen, FolgenKarte, Nachspann, teile |
| `kanal/hintergruende/` | Hintergründe (welten, papiere, buehnen) |
| `stimmen/klon/` | 8 Referenzstimmen (WAV, 24 kHz) + `stimmen.json` |
| `hilfe/` | Anleitungsvideos (Mac, Windows, Verbessern) + `Kapitel.txt` |
| `schriften/` | Webfonts (woff2): Instrument Sans 400, Bricolage Grotesque 800 (latin + latin-ext), JetBrains Mono 500 – SIL Open Font License |
| `bibliothek/hintergruende/` | 15 Vorschau-Clips der Hintergründe (304×540, 5 s): blaupause, filmkorn, himmel, karo, korkwand, kreidetafel, liniert, nachthimmel, papier, punktraster, schreibtisch, spotlight, streifen, verlauf, vignette |
| `bibliothek/mitmach/` | 15 Vorschau-Clips der Mitmach-Bausteine (304×540, 5 s): bewertung, community-frage, enthuellung, folgen, kommentar, quiz, rate-countdown, schaetz, speichern, stopp-rate, teil2, teilen, umfrage, waehle-ab, wahr-falsch |
| `bibliothek/hg/` | 11 Vorschau-Clips (Original-Präfix `hg-`): balken, buehne, chips, du-kopf, endkarte, fig-denker, fig-gestalt, fig-showmaster, fig-spielleiter, folgen-karte, like-teilen |
| `bilder/cover/` | Beispiel-Cover: stau (#100s), hut-raetsel (#90), mikrowelle (#33), einkaufswagen (#15), ball-fliegt-hoch (Stil A), wo-ist-der-ball (Stil B), gehirn-luegt (Stil C) |
| `bilder/elemente/` | Element-Vorschauen: kringel-pfeil, logo, preisschild, riss-fenster, stempel-denkst-du, titel-gross |

## Hinweise

- Die Ordner unter `vorlage/` folgen den Imports im Code. Die Ordner unter `kanal/` sind geschätzt:
  der Code importiert z. B. `../../basis/lib` und `../_basis`, die genaue Ablage im Originalprojekt ist unbekannt.
- Es fehlen Dateien, die der Code braucht: `theme.json` (wird von `vorlage/src/basis/theme.ts` als `../../../theme.json` geladen),
  `_basis.ts` (für `kanal/hintergruende/`) und `werkzeug/*.py`.
- `vorlage/src/videos/_vorlage/` enthält die Platzhalter-Dateien (`__THEMA__`), die `werkzeug/neu.py` für jedes neue Video kopiert; der Ordnername ist geschätzt.
