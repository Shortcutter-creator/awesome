# Baukasten: so baust du eine Szene

Kurzreferenz für Claude, bevor du die Platzhalter („HIER“) in `vorlage/src/videos/<slug>/Video.tsx` ersetzt. Alles hier gibt es in jeder Paketstufe. Weitere Bausteine deiner Stufe findest du mit `python werkzeug/suche.py <Stichwort>` (fertige Import-Zeile und Vorschau: `--id <id>`); den Katalog nie ganz lesen.

## 1 · Daten aus der Aufnahme (`woerter.json`)
`vertonen.py` schreibt, `neu.py` importiert sie als `V` (Typ `Voice`):
```ts
V.words   // [{ w: "Wort,", s: 1.23, e: 1.61, z: 0 }]  s/e = Start/Ende in Sekunden, z = Skriptzeile
V.zeilen  // [{ s, e, text }]  eine je Skriptzeile
V.dauer   // Länge der Aufnahme in Sekunden
```
Zeiten nie fest eintippen, immer über Wortanker:
```ts
const aPreis = at(WD, "Preis");              // erstes „Preis“
const aDas   = at(WD, "das", { ab: 12 });    // erstes „das“ ab Sekunde 12 (sicherer bei kleinen Wörtern)
const eKasse = endOf(WD, "Kasse");           // Ende des Wortes
```
Ein Anker, den es nicht gibt, bricht den Render mit einer klaren Meldung ab. Zahlen im Skript (`{5|fünf}`) stehen in `V.words` in ihrer Anzeige-Form („5“, Anker also `at(WD, "5")`); `V.zeilen[].text` enthält noch die Rohform mit Klammern.

## 2 · Zeit-Helfer (alles in Sekunden, `t = useCurrentFrame() / FPS`)
| Helfer | macht | typisch |
|---|---|---|
| `pop(t, a)` | Feder 0 → 1 ab `a`, mit leichtem Überschwingen | Karte poppt herein: `transform: scale(${0.85 + 0.15 * p})` |
| `ease(t, a, b)` | 0 → 1 weich zwischen `a` und `b` | Verschieben, Zoomen, Einblenden |
| `lin(t, a, b)` | 0 → 1 gleichmäßig | Fortschritt, Uhrzeiger |
| `life(t, a, b)` | rein bei `a`, raus bei `b` | alles, was wieder verschwinden soll |
| `countUp(t, a, b, ziel)` | zählt von 0 auf `ziel` | mit `de(...)` als deutsche Zahl anzeigen; Jahreszahlen nie zählen |
| `mech(t, rein, raus)` | 0 → 1 → 0 für den Mechanik-Teil | an `<Stage x={…}>` und `dark={x > 0.5}` geben |

## 3 · Komponenten aus `basis/lib`
| Komponente | Props | wofür |
|---|---|---|
| `Stage` | `x` (Mechanik 0..1) | Bühne jedes Videos (Hintergrund, Raster) |
| `Header` | `t, a, thema, x` | Kopfzeile mit Kanalname und Thema |
| `Captions` | `t, chunks, dark` | Wort-Untertitel (`chunks = makeChunks(WD)`) |
| `Card` | `style, dark` | Fläche mit Rand und Schatten; Position über `style` (`left/top/width/height`) |
| `Chip` | `text, bg, fg, border, size` | Etikett in Versalien; Schrift wird bei zu wenig Kontrast automatisch hell/dunkel |
| `SourceCard` | `t, a, b, meta, text, dark, top` | Quellenkarte, Pflicht im Takt „Beleg“ (`meta = "Quelle · Jahr"`) |
| `Bar` | `t, a, b, wert (0..1), farbe, w, h` | Balken, der sich füllt |
| `Stamp` | `t, a, text, x, y, size, rot, farbe` | Stempel für die Pointe (1–3 Wörter) |
| `Wechsel` | `t, a` | sichtbarer Übergang in den Mechanik-Teil (nur bei Look mit `mechanik_wechsel.art` ≠ keiner) |
| `EndCard` | `t, a, top` | Abschluss mit Kanalname aus `theme.json` |

Farben nur aus `C`: `C.paper` (Hintergrund), `C.paper2` (Fläche), `C.ink` (Text), `C.muted`, `C.accent`, `C.yellow` (Markierung), `C.green`, `C.red`, im dunklen Teil `C.glow`, `C.darkText`. Schriften: `HEAD` (Titel), `MONO` (Etiketten, Zahlen-Einheiten).

## 4 · Layout: groß und mittig
Zonen wie im Regelbuch (Bühne und Layout): Kopfzeile y ≈ 190 · **Inhalt y 260–1300** · Untertitel-Pille y ≈ 1360 · Ränder ≥ 90 px · rechts 230 px keine Schrift · Mitte x = 540.
- **Render-Tempo:** Jede Szene nur in ihrem Zeitfenster erzeugen: `{t > a - 1 && t < b + 1 ? <Szene t={t} /> : null}` statt alle Szenen in jedem Bild aufzubauen und unsichtbar zu schalten. Schwere Bausteine (Iso-Welten, 3D, viele Figuren) kosten sonst in *jedem* Bild Rechenzeit – auf Windows-Laptops der Unterschied zwischen 3 und 10 Minuten Render.
- **Ein Hauptelement je Szene**, mindestens zwei Drittel der Bildbreite (≥ 720 px) und mittig im Inhaltsbereich (Mitte etwa y 780). Kleinteile (Chips, Etiketten) nur dazu, nie statt.
- `Card` ist absolut positioniert: Lage und Größe über `style` (`left/right/top/height` oder `left/top/width/height`). Breit = `left: 90, right: 90`. `SourceCard` sitzt standardmäßig bei `top: 270`, `left/right: 120`; mit `top` verschieben.
- Diagramme und Zeichnungen groß anlegen (ganze Inhaltsbreite) und Schrift darin ≥ 24 px bei 390 px Handybreite (also ≥ 66 px im 1080er-Bild für Achsen, ≥ 58 px für Chips).

## 5 · Muster, die nachweislich gut aussehen
Aus der Starter-Vorschau „Ein Satz, drei Pakete“ (nur Starter-Bausteine):

**Zahlenkarte, die hochzählt**
```tsx
const p = pop(t, a160);
<Card style={{ left: 80, top: 330, width: 400, height: 300, opacity: Math.min(1, p * 1.5), transform: `scale(${0.85 + 0.15 * p})`,
               display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
  <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 170, lineHeight: 1, color: C.accent }}>{de(Math.round(countUp(t, a160, a160 + 0.7, 160)))}</div>
  <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 30, letterSpacing: 5, color: C.muted }}>KM/H</div>
</Card>
```
**Vergleichszeile mit Etikett, Balken und Zahl**
```tsx
<Card style={{ left: 90, right: 90, top: 660, height: 210, transform: `translateY(${(1 - p) * 40}px)` }}>
  <div style={{ position: "absolute", left: 36, top: 24 }}><Chip text="bei 130 km/h" bg={C.muted} size={26} /></div>
  <div style={{ position: "absolute", left: 36, top: 112 }}><Bar t={t} a={a} b={a + 0.9} wert={19 / 23} farbe={C.accent} w={520} h={52} /></div>
</Card>
```
**Figur (Kategorie Figuren) – immer in ein `svg` der Bildgröße setzen**
```tsx
import { FigDenker } from "../../bausteine/hintergedanke/Figur92";
<svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
  <FigDenker x={540} y={1250} s={1.5} kinn={ease(t, aZeit - 0.2, aZeit + 0.5)} atem={Math.sin(t * 3)} />
</svg>
```
`x/y` = Fußpunkt, `s` = Größe, `blick` −1..1, `greif` 0..1, `atem` (Sinus), bei `FigDenker` zusätzlich `kinn` 0..1. `FigGestalt`, `FigBeast`, `FigHost` haben dieselben Props.

**Szenenwechsel: Altes geht, Neues kommt groß** (zählt als großer Bildwechsel)
```tsx
const raus = ease(t, aNeu - 0.25, aNeu + 0.05);          // alte Szene schiebt nach oben weg
<div style={{ position: "absolute", inset: 0, opacity: 1 - raus, transform: `translateY(${-160 * raus}px)` }}>…alte Szene…</div>
{t >= aNeu - 0.05 ? <div style={{ position: "absolute", inset: 0, transform: `scale(${0.9 + 0.1 * pop(t, aNeu)})` }}>…neue Szene, wieder groß und mittig…</div> : null}
```
Eine Szene nur kurz verkleinern, um Platz für ein zweites Element daneben zu machen, und nie unter 0,8: Kleine Inhalte oben links sehen auf dem Handy nach leerem Bild aus.
**Kein leeres Bild beim Übergang:** Die neue Szene beginnt, bevor die alte ganz weg ist (0,1–0,2 s überlappen, wie oben: `raus` endet 0,05 s nach `aNeu`, die neue Szene startet 0,05 s davor). Auf dem Kontaktbogen (`pruefung/bogen.jpg`) darf kein Bild nur Hintergrund und Untertitel zeigen.
**Mitmachen** (Kategorie Mitmach): `<FolgenKarte start={a} tapAt={a + 0.9} ende={a + 2.4} />` · `<LikeTeilen likeAt={a} teilenAt={a + 1.6} empfaenger="Freundin" />`.

## 6 · Damit `pruefe.py` „Bild-Beats“ und „Ruhe“ bestätigt
Die Messung vergleicht aufeinanderfolgende, verkleinerte Bilder. Als Ereignis zählt, was grob **ein Achtel des Bildes oder mehr** verändert: eine große Karte poppt herein, eine Szene wechselt, ein Balken wächst über die halbe Breite, das Hauptobjekt bewegt sich deutlich. Kleine Bewegungen (eine Rasterzelle färbt sich, ein Chip zuckt, ein Wort wechselt) zählen kaum.
- Erlaubt und wirksam ist laut Regelbuch eine **kurze Kamerafahrt (0,3–0,4 s) auf ein Schlüsselwort**: das Hauptelement 6–10 % heranzoomen oder seitlich nachführen. Nicht als Dauerbewegung.
- Etwa **jede Sekunde ein sichtbares Ereignis auf ein gesprochenes Wort**: eine Karte poppt herein, eine Zahl springt auf, ein Balken wächst über die halbe Breite, ein Stempel knallt, eine Figur tritt auf.
- **Zahlen-Szenen**: nicht alles auf einmal zeigen. Werte nacheinander auf ihre Wörter legen, alte Karten mit `life(t, a, b)` gehen lassen, die Szene beim Themenwechsel verkleinern oder verschieben (Muster oben).
- Nach 3–4 Sekunden ohne neues Element: neues Element auf das nächste Schlüsselwort legen statt Effekte ohne Inhalt (kein Wackeln, kein Dauer-Zoom).

## 7 · Vor dem ersten Video
Steht in `theme.json` noch `"name": "Dein Kanal"` / `"handle": "@dein.kanal"`, frag den Nutzer einmal nach Kanalname und Handle (oder schlag `/look` vor). Sonst steht „Dein Kanal“ in Kopfzeile und Abspann.

## 8 · Bausteine mit `bib-` am Anfang (je nach Stufe)
Ihre Import-Zeile zeigt `python werkzeug/suche.py --id <id>`. Sie folgen alle denselben Regeln:
- **Animierte Bausteine** bekommen `t` (aktuelle Sekunde) und `a` (Start), oft `b` (dann gehen sie wieder raus). Ohne weitere Props sitzen sie groß und mittig (x 540, y ≈ 800–900); `x`/`y` = Mitte, `s` = Größe, `dunkel` = Fassung für den dunklen Teil. Texte und Zahlen sind Props mit Beispiel-Standard – immer eigene Werte einsetzen.
- **Illustrationen** (`bib-ill-…`, z. B. `KaffeeToGo`, `Geldautomat`): `size` (Breite in px), `glow` = leuchtende Fassung für den dunklen Teil. Groß anlegen (`size` 500–800).
- **Hintergründe** (`Hg…`) füllen das ganze Bild und kommen zuerst ins JSX, alles andere darüber. `HgVignette` und `HgFilmkorn` sind Überlagerungen und kommen zuletzt.
- **Übergänge** (`bib-uebergaenge-…`): Überlagerung über das ganze Bild, bei `a + dauer / 2` ist es voll bedeckt – genau dort die Szene wechseln. Am einfachsten über die Hülle `Szenenwechsel` (`vorher`, `nachher`, `uebergang`), die schaltet selbst um. Farben als `#rrggbb` übergeben.
- **Effekte** wie Regen, Schnee, Blasen laufen ab `a` endlos – mit `b` beenden.
- **Figuren** (`Fig…`): `x`/`y` = Fußpunkt, `s` = Größe (Standard ≈ 900 px hoch). `FigMenge` zeigt „x von y“ (`anzahl`, `markiert`).
- Ein Baustein je Szene als Hauptelement reicht (Abschnitt 4). Marker, Symbole und Effekte sind Beiwerk zu einem Hauptelement, nicht statt.

## 8b · Iso-Welt einsetzen (Rezept)
Iso-Bausteine (`suche.py --bausteine Iso`) sind Objekte für eine kleine 3D-Insel. Gerüst, das funktioniert (Zeiten in Bildern):
```tsx
import { IsoInsel, STADT_PALETTE, isoKarte, isoKontext, isoWelt, supermarkt } from "../../bausteine/twelveframes/bausteine/iso";
const WELT = isoWelt({ karte: isoKarte(["bb", "aa"]), palette: STADT_PALETTE, zeitplan: { einfall: { start: 0, tempo: 4 } },
  objekte: [supermarkt({ x0: 0.1, y0: 0.1, x1: 1.9, y1: 0.75, t0: 6 })], tw: 400, mx: 540, my: 640 });
const Markt: React.FC<{ t: number; a: number }> = ({ t, a }) => {
  const W = isoKontext(WELT, Math.max(0, Math.round((t - a) * FPS)), { id: `markt${Math.round(a)}` });
  return <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}><IsoInsel W={W} /></svg>;
};
```
`isoKarte` = Bodenraster (Buchstaben = Kacheltypen), `tw` = Kachelbreite in px (größer = näher), `mx/my` = Bildmitte der Insel. Mehrere Objekte, Straßen, Figuren und Wege: `MusterIsoStadtLand.tsx` und die Vorschauen (`suche.py --id <id>`). Die Insel füllt das Bild, wenn `tw` groß genug ist (≥ 380); eine kleine Insel mit viel Leerraum wirkt verloren. Für „Weg durch den Laden“ eignet sich eine Draufsicht/Insel mit einer animierten Linie (Pfeilkette) vom Eingang nach hinten.

## 9 · Geräusche (`klaenge.json` → `werkzeug/klang.py`)
Jedes Video bekommt eine Klangspur: Stimme + leises Musikbett + Geräusche aus `klaenge/` (über 250 Klänge, alle frei nutzbar, suchen mit `python werkzeug/suche.py --klaenge <Stichwort>`, Überblick `--uebersicht`; den Katalog nie ganz lesen). Ohne Geräusche wirkt ein Video leer; das war die größte Kritik von Testern. Du schreibst nur die Liste `videos/<ordner>/klaenge.json`, `render.py` mischt automatisch. Zum Vorhören ohne Render: `python werkzeug/klang.py videos/<ordner>` (→ `ton-vorschau.wav`), Zeitleiste: `--liste`. Aufbau und alle Felder: Kopf von `werkzeug/klang.py`. Ein vollständiges Beispiel mit 105 Klängen: `beispiele/tempo-160-130/klaenge.json` (Pro/Studio).

**Grundsatz: Jedes Bild-Ereignis bekommt den Klang, der zu ihm passt – nicht ein Klang für alles.** Geh die Szene Ereignis für Ereignis durch (was erscheint, bewegt sich, wechselt, schlägt ein?) und wähl je Ereignis aus der passenden Gruppe. Ein gutes Video nutzt 20–50 verschiedene Klänge.

| Bild-Ereignis | Gruppe | erprobte Klänge |
|---|---|---|
| Hook, erstes großes Bild | Einschlag & Hit | `pro_impact/short`, `whoosh_big/thump_deep` |
| Szenenwechsel, Kamerafahrt | Whoosh & Wischer | `whoosh_big/swell`, `whoosh_fast/tight`, `whoosh_fast/whip`, `whoosh_big/thump_airy`, `whoosh_big/deep`, `reverse_swell/short` – jeder Wechsel ein anderer |
| Zahl erscheint | Töne & Glocken (gestimmt) | `mallet/marimba` mit `"ton"`: größere Zahl = höherer Ton (40 → C4, 50 → D4, 80 → F4, 130 → C5) |
| Karte, Chip, Label poppt rein | Pop & Erscheinen | `pro_pop_in/round`, `pro_pop_in/deep`, `ui_pop/soft`, `pro_pop/double`, `pro_pop/thup` |
| Kleine UI-Bewegung, Nadel, Pfeil | Zip & Bewegung, Klick & Tick | `pro_zip/up`, `pro_zip/down`, `pro_zip/arc`, `toggle/latch`, `click/thock` |
| Viele Dinge nacheinander (Punkte, Balken, Stimmen) | Klick & Tick, Tastatur | Kaskade: `pro_hover_tick/soft` je Element (Abstand wie im Bild, abwechselnd `pan` ±0,5) oder `pro_typing_run/blip` |
| Countdown, Spannung vor der Auflösung | Riser & Spannung | `riser/tension` (Spitze auf die Auflösung), je Zahl `click/thock` + `mallet/glock` mit steigendem Ton |
| Etwas steigt, wächst, beschleunigt | Riser & Spannung | `riser/air`, `riser/rush`, `riser/snatch` |
| Etwas fällt, bremst, enttäuscht | Fall & Bass | `downlifter/tape`, `downlifter/air_fall`, `pro_sub_drop/quick` |
| Ergebnis, Ziel erreicht, richtig | Töne & Glocken | `pro_notify/ding_1822` … `ding_2296` (je Ergebnis ein anderer, gern aufsteigend), `mallet/up4` |
| Stempel FALSCH, Fehler | Einschlag + Glitch | `cut_hit/punch` + `glitch/hit` |
| Stempel GELÖST, Pointe | Einschlag + Töne + Glanz | `cut_hit/punch` + `mallet/flourish` + `logo_sting/soft_bloom` |
| Aufprall, Crash | Einschlag + Bass + Glitch | `impact/punch` (`"laenge": 1.8`) + `pro_sub_drop/low` + `glitch/crush` |
| Begriff, Zitat, Quellenkarte | Kamera, Tippen | `shutter/quick`, `knock/desk`, `notify/mid_wood` |
| Abspann: Folgen-Karte, Klick, „Gefolgt“ | Pop, Klick, Töne | `pro_pop_in/round`, `pro_click/soft`, `pro_notify/ding_2167` |

**Regeln** (aus earshots Messung an Profi-Filmen und Gedankenwerk-Tests):
- **Stimme vorne.** Pegel ergeben sich aus der Gruppe (Standard in `klang.py`); Einschläge sind die lautesten Effekte, Ticks und Tastatur die leisesten. Nichts über −11 dBFS. Musikbett leise (`theme.json → geraeusche.bett_lautstaerke`, Standard 0,19), ab dem ersten Wort, blendet am Ende aus.
- **Anker wie im Video-Code.** `"wort"` + `"n"` oder `"ab"` zählt genau wie `at(WD, wort, n)` / `at(WD, wort, { ab })` in deiner `Video.tsx` (Groß/klein und Satzzeichen egal) – übernimm die Anker 1:1 von dort. Liegt ein Ereignis nicht genau auf dem Wort (Stempel landet ~0,12 s nach seinem Anker, ein Knopfdruck hat seine Spitze in der Mitte der Bewegung), den Versatz aus deinem Code ablesen und als `"versatz"` eintragen. Bausteine aus Hintergedanke enthalten oft `<Ton at=… f=…>`-Marker (im Paket stumm): Genau dort hatte das Original einen Klang – gute Cue-Stellen. Danach immer `--liste` gegen die Szene prüfen.
- **Synchron.** Der lauteste Moment des Klangs liegt auf dem Ereignis (`"ausrichtung": "spitze"`, Standard). Für Klänge, die *beginnen* sollen (Kaskaden, Riser mit Start auf einem Wort, Tastatur-Läufe) `"ausrichtung": "start"`. Zeit über `"wort"` statt Sekunden: Dann bleibt alles synchron, auch wenn neu vertont wird.
- **Tonhöhe.** `"ton"` ist ein absoluter Notenname; der Klang wird von seinem eigenen Grundton (`katalog.json → ton`) dorthin verschoben. Bleib höchstens eine Oktave davon entfernt (sonst klingt er künstlich), z. B. `mallet/glock` (Grundton Eb6) mit C6–G6, `mallet/marimba` (G4) mit C4–C5. Für sehr hohe Klänge (Ticks um F9) und Kaskaden `"halbtoene"` (+/−) statt `"ton"`. Zahlen: monotone Zuordnung, größer = höher.
- **Szenenwechsel genau am Schnitt:** `whoosh_fast/*` (z. B. `whip`, `tight`) sitzen hörbar auf dem Schnitt; die weichen `whoosh_big/*` eignen sich für Kamerafahrten und Übergänge über mehrere Bilder – bei einem harten Schnitt zusätzlich einen kurzen Klick oder Pop auf den Schnitt legen.
- **Rätsel-Videos:** Die Denkpause zum Mitraten bleibt still oder bekommt höchstens einen leisen Riser (`riser/tension`, −24 dBFS) hinein; die Auflösung selbst nicht vertonen. Kaskaden (Ziffern, Summenzeilen) dort sparsam.
- **Abwechslung.** Nie derselbe Whoosh auf jeden Wechsel. Kurze Klänge haben 3 Varianten, die `klang.py` von selbst abwechselt; gestimmte Klänge über `"ton"` variieren.
- **Bewegung im Raum.** Was sich bewegt (Whoosh, Zip, Riser), abwechselnd leicht links/rechts (`"pan": ±0,5`); Einschläge und Bass mittig.
- **Nicht jede Mikro-Bewegung.** Etwa 1–2 deutliche Klänge pro Sekunde; Kaskaden zählen als einer. Stille vor einem großen Moment ist Teil des Klangs.
- **Größe passt zum Objekt.** Groß = tiefer, länger, breiter (Einschlag, `whoosh_big`); klein = höher, kürzer (Pop, Tick).
- Der Nutzer kann Geräusche in `theme.json → geraeusche.an` ausschalten; dann keine `klaenge.json` anlegen.
