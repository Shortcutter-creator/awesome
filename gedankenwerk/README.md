# Gedankenwerk

Gesichertes Gedankenwerk-Paket (Faceless-Erklärvideos mit Remotion). Die Ordner folgen den Pfaden, die die Werkzeuge selbst verwenden (`werkzeug/gemeinsam.py`: `PAKET` = dieser Ordner).

## Aufbau

| Pfad | Inhalt |
|---|---|
| `regelbuch/REGELBUCH.md` | Regeln für jedes Video (8 Takte, Hook, Belege, Bild, Cover, Caption, Prüfung) |
| `regelbuch/BAUKASTEN.md` | Kurzreferenz: Wortanker, Zeit-Helfer, Komponenten, Layout, Geräusche |
| `werkzeug/` | Python-Werkzeuge: `check`, `look`, `probe`, `stimme_einrichten`, `stimmen`, `vertonen`, `lokal`, `pausen`, `neu`, `render`, `klang`, `pruefe`, `cover`, `suche`, `gemeinsam` + `requirements.txt` |
| `looks/` | Fertige Looks: `neutral`, `nacht`, `papier`, `pop` |
| `klaenge/` | 493 von 519 Klangdateien, Pfade wie in `klaenge/katalog.json` (Varianten als `name~2.wav`, `name~3.wav`) + `LIZENZ.txt` |
| `klaenge-anhoeren.html` | Anhör-Seite für alle Klänge und Stimmproben (im Browser öffnen) |
| `bausteine/` | Baustein-Katalog (`katalog.json`/`.js`, 62 Einträge) + `vorschau/` (61 von 62 Vorschauen) |
| `stimmen/klon/` | 8 Referenzstimmen (WAV) + `stimmen.json`; `proben/` = Hörproben (MP3) |
| `vorlage/` | Remotion-Projekt (`package.json`, `tsconfig.json`, `remotion.config.ts`) |
| `vorlage/src/basis/` | `lib.tsx`, `theme.ts`, `schriften.ts`, `Cover.tsx`, `Probe.tsx` |
| `vorlage/src/bausteine/` | Code der Bausteine: `hintergedanke/` (Cover, Figuren, Illustrationen, Nachspann, `bausteine/`), `bibliothek/hintergruende/` |
| `vorlage/vorlagen/` | `Video.tsx` + `Cover.tsx`, die `neu.py` für jedes neue Video kopiert |
| `videos/` | Ablage der fertigen Videos |
| `hilfe/` | Anleitungsvideos (Mac, Windows, Verbessern) + `Kapitel.txt` |
| `schriften/` | Webfonts (woff2, SIL OFL); Ablageort im Paket unbekannt |

## Geprüft

- `python werkzeug/suche.py --uebersicht` findet beide Kataloge (62 Bausteine, 253 Klänge); `--id <id>` zeigt Quelldatei und Props.
- `python werkzeug/look.py` listet die 4 Looks.
- Jede vorhandene Klangdatei liegt dort, wo `klang.py` sie sucht.
- Alle Imports zwischen den Bausteinen lösen sich auf.
- `python werkzeug/check.py` läuft; meldet noch: `theme.json` fehlt, `npm install` in `vorlage/`, lokale Stimme nicht eingerichtet.

## Was noch fehlt

| Datei | gebraucht von |
|---|---|
| `theme.json` | allen Werkzeugen und `vorlage/src/basis/theme.ts` (Kanal, Farben, Schrift, Stimme, Untertitel, Abspann, Cover, Format, Geräusche) |
| `vorlage/src/bausteine/bibliothek/_basis.ts` | den drei Hintergrund-Dateien |
| `vorlage/src/bausteine/bibliothek/mitmach/fragen.tsx`, `aufrufe.tsx` | den 15 Mitmach-Bausteinen |
| 26 Klangdateien | `pro_pop/*` (bloop, boop, chirp, double, thup, tink je 1–3), `pro_riser/` (air_gate, chop, nblips, roll), `glitch/hit` 1–3, `glitch/mid~3` |
| `bausteine/vorschau/hg-cover-zwei-karten.png` | Katalog-Vorschau |
| `CLAUDE.md`, Skills („einrichten“, „video“, „look“) | werden in Regelbuch und Werkzeugen erwähnt |
| `.env.example` | nur für ElevenLabs (optional) |
