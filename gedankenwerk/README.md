# Gedankenwerk

Gesicherte Teile des Gedankenwerk-Pakets (Faceless-Erklärvideos mit Remotion). Die Klänge liegen separat in [`../sounds/`](../sounds/) (`klaenge/`, `katalog.json`, `LIZENZ.txt`); im Original-Paket ist das der Ordner `klaenge/` im Paketordner.

## Aufbau (wie im Paket)

| Pfad | Inhalt |
|---|---|
| `REGELBUCH.md` | Regeln für jedes Video (8 Takte, Hook, Belege, Bild, Cover, Caption, Prüfung) |
| `BAUKASTEN.md` | Kurzreferenz: Wortanker, Zeit-Helfer, Komponenten, Layout, Geräusche |
| `looks/` | Fertige Looks für `werkzeug/look.py`: `neutral`, `nacht`, `papier`, `pop` |
| `videos/` | Ablage der fertigen Videos (`<Datum>-<Thema>/`) |
| `stimmen/klon/` | 8 Referenzstimmen (WAV, 24 kHz) + `stimmen.json` |
| `hilfe/` | Anleitungsvideos (Mac, Windows, Verbessern) + `Kapitel.txt` |
| `schriften/` | Webfonts (woff2): Instrument Sans, Bricolage Grotesque, JetBrains Mono (SIL OFL); Ablageort im Paket unbekannt |
| `vorlage/` | Remotion-Projekt: `package.json`, `tsconfig.json`, `remotion.config.ts` |
| `vorlage/src/basis/` | `lib.tsx`, `theme.ts`, `schriften.ts`, `Cover.tsx`, `Probe.tsx` |
| `vorlage/src/videos/` | `register.ts`; `_vorlage/` = Platzhalter `Video.tsx`/`Cover.tsx` für `neu.py` (Ordnername geschätzt) |
| `vorlage/src/katalog.json` / `.js` | Baustein-Katalog (62 Einträge, Stufe „starter“) |
| `vorlage/src/bausteine/hintergedanke/` | Cover (`CoverNeu`, `Thumbs*`), Figuren, Illustrationen (`icons_h*`), `nachspann` |
| `vorlage/src/bausteine/hintergedanke/bausteine/` | `LikeTeilen`, `FolgenKarte`, `teile` |
| `vorlage/src/bausteine/bibliothek/hintergruende/` | `papiere`, `buehnen`, `welten` |
| `vorlage/src/bausteine/vorschau/` | Vorschau-Clips und -Bilder zu den Katalog-Einträgen (61 von 62) |

## Was noch fehlt

| Datei | gebraucht von |
|---|---|
| `theme.json` (Paketordner) | `vorlage/src/basis/theme.ts` – Farben, Schrift, Kanal, Stimme, Cover, Abspann, Geräusche |
| `werkzeug/*.py` | `vertonen.py`, `pausen.py`, `neu.py`, `render.py`, `pruefe.py`, `cover.py`, `look.py`, `probe.py`, `suche.py`, `klang.py`, `stimme_einrichten.py` |
| `vorlage/src/bausteine/bibliothek/_basis.ts` | die drei Hintergrund-Dateien |
| `vorlage/src/bausteine/bibliothek/mitmach/fragen.tsx`, `aufrufe.tsx` | die 15 Mitmach-Bausteine im Katalog |
| `vorlage/src/bausteine/vorschau/hg-cover-zwei-karten.png` | Katalog-Vorschau |
| `CLAUDE.md` | wird im Regelbuch erwähnt |
