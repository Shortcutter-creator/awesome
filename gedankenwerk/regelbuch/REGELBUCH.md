# REGELBUCH – Faceless-Erklärvideo (Gedankenwerk)

Dieses Regelbuch liest du (Claude), bevor du das erste Video einer Sitzung baust. Es sagt, wie ein Video aufgebaut ist und warum. Der Nutzer sagt `/video <Thema>`, du lieferst ein fertiges Hochformat-Video.

Die Regeln stammen aus vielen echten Folgen eines Erklärkanals: Jede Regel steht da, weil ein Video ohne sie schlechter lief oder beim Prüfen auffiel. Wo ein "Warum" dabeisteht, ist es Erfahrung, kein Naturgesetz. Zahlen ohne Quelle gibt es hier nicht.

**Vorrang:** Was der Nutzer in dieser Sitzung ausdrücklich sagt, geht diesem Regelbuch vor. Der Look (Farben, Schrift, Stimme, Abspann, Cover-Stil) kommt immer aus `theme.json`, nie aus einzelnen Videos.

## Format auf einen Blick

| Eigenschaft | Wert |
|---|---|
| Format | 1080 × 1920, 30 fps, Hochformat |
| Länge | 60–80 s (Ziel ~70 s) |
| Ton | Stimme vorne, darunter passende Geräusche je Bild-Ereignis + leises Musikbett (BAUKASTEN § 9) |
| Untertitel | Eingebrannt, Wort für Wort, 2–4 Wörter sichtbar |
| Animation | Remotion, flaches 2D |
| Ergebnis | `videos/<JJJJ-MM-TT>-<slug>/` mit `skript.txt`, `quellen.md`, `caption.txt`, `video.mp4`, `cover.jpg` |

Werkzeuge (alle relativ zum Paketordner):

```
(Ordner videos/<JJJJ-MM-TT>-<slug>/ mit skript.txt und quellen.md legst du selbst an)
python werkzeug/vertonen.py <ordner>   Stimme + Wortzeiten aus skript.txt (nennt vorher die Zeichenzahl)
python werkzeug/pausen.py <ordner>     kürzt zu lange Stille, Wortzeiten wandern mit
python werkzeug/neu.py <ordner>        legt Video.tsx + Cover.tsx unter vorlage/src/videos/<id>/ an
python werkzeug/render.py <ordner>     rendert video.mp4
python werkzeug/pruefe.py <ordner>     Prüfbilder und Messwerte
python werkzeug/cover.py <ordner>      rendert cover.jpg + Feed-/Raster-Prüfbilder
python werkzeug/look.py [name]         fertigen Look übernehmen (neutral, nacht, papier, pop)
python werkzeug/probe.py               Probebild im aktuellen Look
```

Windows: `py` statt `python`, falls nötig.

---

## 0 · Kurzfassung: die 12 wichtigsten Regeln

1. **Nur Belegtes.** Jede Zahl, jedes Jahr, jedes Zitat steht vorher mit Quelle in `quellen.md`. Nichts erfinden, auch nichts "ungefähr".
2. **Hook in den ersten 3 Sekunden.** Stimme ab Frame 0, erster Satz fertig nach höchstens 3,5 s (besser 3 s; `pruefe.py` misst es). Er behauptet oder fragt etwas, das dem Bauchgefühl widerspricht, und lässt die Auflösung offen.
3. **Erstes Bild: ein großes Objekt in Bewegung.** Kein Formular, keine Tabelle, keine Texttafel, keine Kopfzeile in den ersten Sekunden.
4. **Acht Takte, immer in dieser Reihenfolge:** Hook · Beleg · Wende · Mechanik · Übertrag · Regel · Pointe · Abgang.
5. **Kurze Sätze:** 10–13 Wörter, im Erklärteil auch kürzer. Sprechtempo ~4,5 Silben pro Sekunde. Mehr Inhalt statt schneller sprechen.
6. **Ein neues Objekt pro Satz.** Dazwischen ändern sich nur Dinge, die schon da sind. Nichts flackert, pulsiert oder wackelt als Dekoration.
7. **Jedes Element landet auf seinem Wort** (±0,2 s). Zahlen zählen hoch und stoppen auf dem gesprochenen Wert.
8. **Bühne nie leer, Ruhe nie über 4 s.** Etwa jede Sekunde ändert sich sichtbar etwas, echte Ereignisse auf Wörtern, kein Messwert-Trick.
9. **Bild zentral auf x = 540.** Nichts Lesbares im rechten Randstreifen (230 px) und nicht unter y 1360 (Untertitel-Zone).
10. **Schlussbild = Hook-Bild**, jetzt mit der Erkenntnis. Das Anfangsobjekt kehrt an dieselbe Stelle in derselben Größe zurück.
11. **Abgang warm und kurz:** erst Teilen-Satz mit konkretem Empfänger (wenn passend), dann eine persönliche Folgen-Einladung. Abspann 5–8 s, ein Element zur Zeit.
12. **Prüfen vor "fertig":** Kontaktbogen, Hook-Bild, Lesetest in 390 px, einmal stumm, einmal nur hören, höchstens 5 Runden. Cover im Feed-Test bei 280 px lesbar.

---

## 1 · Themenwahl und Hook-Typen

### Themen, die tragen

- **Alltagsdinge, die der Zuschauer selbst erlebt**, schlagen ferne Kuriositäten. Fragen wie "Mache ich das falsch?" ziehen mehr als Technik-Besonderheiten, die mit dem eigenen Alltag nichts zu tun haben. Beobachtung aus mehreren Folgen: Auto- und Alltagsthemen liefen deutlich besser als Exotisches.
- **Marken und Dinge, die der Zuschauer täglich sieht** (Supermarkt, Bahn, Smartphone, Verpackung, Straßenverkehr) geben dem Hook sofort einen Anker. Eine bekannte Marke allein reicht aber nicht, der Satz muss etwas Überraschendes behaupten.
- **Verkaufbare Verblüffung:** Das Thema braucht einen Satz, der dem Bauchgefühl widerspricht ("Das geht nicht", "Mit Absicht", "Gleiches Produkt, anderer Preis").
- **Belegbar:** Gibt es keine Primärquelle für den Kern, nimm ein anderes Thema.
- **Quiz nur, wenn die Antwort wirklich überrascht.** Eine Frage, deren Antwort egal ist, nicht stellen.

### Die Hook-Typen

Wähle einen Typ pro Video und variiere ihn von Folge zu Folge.

| Typ | Muster | Beispiel (neutral) |
|---|---|---|
| Umkehrung (Standard) | "X ist nicht dazu da, was du denkst. Es soll Y." | "Die Treppe im Möbelhaus ist kein Weg. Sie ist eine Falle." |
| Paradox | "Jedes X war früher Y. Mit Absicht." | "Jede Supermarkt-Kasse hat Süßigkeiten. Mit Absicht auf Kinderhöhe." |
| Gleiches, anderes | "Gleiches X. Anderes Y. Z gewann." | "Gleiche Nudeln. Anderes Etikett. Das teurere verkaufte sich besser." |
| Statistik | Eine Zahl, die verblüfft, mit Quelle. | "Die meisten sehen einen Ball fliegen, der nie geworfen wurde." (nur mit Studie) |
| Was wäre wenn | Zeigt, was ohne den Trick passieren würde. | "Was passiert, wenn der Bremsweg doppelt so lang ist?" |
| Frage im Wortlaut | Eine Frage, die viele Leute haben, wörtlich. | "Warum ist die Zapfsäule immer links?" |
| Mitten im Satz | Beginnt mitten in der Handlung. | "... und dann schneidet er das Seil mit einer Axt durch." |
| Erlaubnis | Nimmt dem Zuschauer eine Last ab (vor dem Bau belegen). | "Du musst das nicht vorher waschen." |

### Regeln für jeden Hook

- Erster Satz fertig nach **höchstens 3,5 s**, besser 3 s. Wer länger braucht, verliert die Leute. Ein Satz mit über 7 s Länge blieb in der Auswertung klar unter den schnellen Hooks.
- Die Hook-Zeile hat **höchstens 6 Wörter**, wenn sie zusätzlich im Bild steht, und steht ab dem ersten Bild.
- **Satz 2 sagt die These.** Kein "könnte", kein "vielleicht". Muster: "X kannst du nicht kaufen. Es soll dir Y verkaufen."
- **Kein Datum, keine Nachrichtentafel** in den ersten 5 s. Der Anlass gehört höchstens auf eine Quellenkarte später.
- **Die Auflösung fehlt im Hook.** Der Satz stellt eine Frage, ohne dass er ein Fragezeichen braucht.
- **Was-wäre-wenn groß in die ersten Sekunden:** Wenn es eine Gefahr oder einen Fehlschlag gibt, zeige ihn als Nahaufnahme (stilisiert, Comic statt Gore). Das macht den Hook sichtbar.
- Jeder Satz muss für die Spracherkennung eindeutig sein. Wird ein Wort falsch erkannt, versteht es auch ein Teil der Zuschauer falsch. Dann den Satz umbauen oder die Aussprache-Schreibung anpassen.

**Signatur-Zeile (Idee):** Lege mit dem Nutzer eine wiederkehrende Zeile für seinen Kanal fest, z. B. im Abgang oder an der Wende. Wer zwei Folgen gesehen hat, erkennt die dritte nach zwei Sekunden. Sie steht in `theme.json` → `kanal.signatur` (leer = keine), nie als Pflichtsatz vom Paket vorgegeben.

---

## 2 · Recherche und Belege

**Nur Belegtes ins Video.** Das ist die wichtigste Regel des Pakets.

### Ablauf

1. Thema in einem Satz fassen. Kern-These formulieren.
2. Quellen suchen (Studie, Unternehmensangabe, Behörde, Fachartikel). **Primärquelle vor Zweitbericht.**
3. Jede Zahl, jedes Jahr, jede Namensnennung, jedes Zitat in `quellen.md` eintragen:

```
## Beleg 1
Aussage im Video: "Rund 19 Prozent der Karten wurden eingelöst."
Zahl/Jahr: 19 %, 2012
Quelle: <Autor/Institution>, <Titel>, <Jahr>, <Link>
Wörtlich in der Quelle: "<Zitat oder Zahl, original>"
Umrechnung: (z. B. Dollar → Euro, Rechenweg)
```

4. **Die Quelle trägt die Formulierung.** Sagt die Studie "die meisten", sagt das Video nicht "fast alle". Sagt sie "in einem Test", sagt das Video nicht "immer". Das gilt für Skript, Bild, Stempel und Cover.
5. **Zitate einzeln suchen.** Ein Zitat, das nur in Zweitquellen auftaucht oder gar nicht, fliegt raus. Ebenso Werte wie "etwa eine Sekunde", wenn sie nirgends stehen.
6. **Zuschreibungen einzeln prüfen:** "Das lernt man in der Fahrschule", "das sagt der Hersteller" sind eigene Behauptungen. Entweder belegen oder minimal ehrlich umformulieren ("eine alte Regel", "oft").
7. **Echte Geschichte vor der Pointe:** Eine belegte reale Geschichte (wer, wann, was passierte) gibt dem Video Charakter. Nicht vorsorglich weglassen, auch wenn sie heikel wirkt. Neutral erzählen, nur Belegtes, keine Wertung.
8. **Rechnest du selbst, sag es.** Eigene Rechnungen im Bild als "eigene Rechnung" beschriften, Rechenweg in `quellen.md`. Gibt es einen Algorithmus oder ein Modell, rechne es wirklich (statt zu animieren), und brich den Bau ab, wenn das Ergebnis nicht zum Skript passt.
9. **Preise in Euro.** Dollar-Quellen als "umgerechnet rund … Euro" sagen, Originalwert in `quellen.md`.
10. **Karten und Daten:** Bei Landkarten, Stadtplänen und Ähnlichem echte Daten mit ihrer Lizenz verwenden. Quellenhinweis im Bild, wenn die Lizenz es verlangt.

### Was fehlt, wird gesagt

Lässt sich ein Teil nicht belegen, sag es dem Nutzer: "Dafür finde ich keine Quelle, ich lasse es weg." Nie eine Zahl "glaubwürdig" auffüllen.

### Quellenkarte im Bild

Zu jeder Studie und jeder Zahl gehört im Bild eine kleine Quellenkarte: eine Zeile in Mono-Schrift (Autor oder Medium · Jahr) über der fett gesetzten Aussage. Dunkle Szenen brauchen hinter der Karte eine deckende Fläche, sonst scheint der Hintergrund durch.

---

## 3 · Skript-Formel: 8 Takte

Jedes Skript folgt derselben Abfolge. Die Wiederholung ist gewollt, sie macht den Kanal wiedererkennbar. Gesamtlänge 60–80 s. Rechne am Ende nach gemessener Dauer, nicht nach Wortzahl.

`skript.txt`: eine Zeile je Satzgruppe, Zahlen als `{Anzeige|Sprechform}` (siehe Abschnitt 4).

| # | Takt | Zeitfenster | Inhalt |
|---|---|---|---|
| 1 | Hook | 0–3 s | Behauptung oder Frage, Auflösung fehlt |
| 2 | Beleg | 3–12 s | Wer, wann, welche Zahl |
| 3 | Wende | ca. 9–20 s | Ankündigung "Jetzt schauen wir hinein" |
| 4 | Mechanik | ca. 15–40 s | Warum es wirkt |
| 5 | Übertrag | ca. 40–50 s | Drei Alltagsbeispiele |
| 6 | Regel | danach | Handlungsanweisung an den Zuschauer |
| 7 | Pointe | 1 Satz | Merksatz zum Mitnehmen |
| 8 | Abgang | 5–8 s | Teilen-Satz, Folgen-Einladung |

Die Zeitfenster sind Richtwerte für ein ~70-s-Video. Bei kürzeren oder längeren Videos verschieben sie sich proportional; der Hook bleibt bei 0–3 s und die Wende liegt vor der Hälfte.

### 1 · Hook (0–3 s)
Siehe Abschnitt 1. Ein bis zwei kurze Sätze.
> "Der Kassenbon ist nicht für dich. Er ist ein Messgerät."

### 2 · Beleg (3–12 s)
Wer, wann, welche Zahl. Autor oder Institution, Jahr, ein konkreter Messwert. Dazu erscheint eine Quellenkarte.
> "Im Jahr <Jahr> hat <Institution> <Zahl> Kassenbons ausgewertet. Auf <Anteil> stand <Befund>."
(Platzhalter nur zur Form. Jede echte Angabe braucht eine Quelle in `quellen.md`.)

### 3 · Wende
Ein kurzer, wiederkehrender Satz, der den Perspektivwechsel ankündigt. Er steht zwischen Sekunde 9 und 20.
> "Schauen wir genauer hin."
Bei `mechanik_wechsel.art` ungleich "keiner" markiert er auch den Wechsel der Bildwelt (Abschnitt 5). Der Satz selbst ist frei wählbar; sobald der Nutzer eine Signatur-Zeile hat, nimmst du sie.

### 4 · Mechanik
Warum es wirkt. Kurze Sätze (4–7 Wörter), Gegensätze in Paaren. Kein Fachwort ohne Bild dazu.
> "Eine runde Zahl wirkt gewählt. Eine krumme wirkt berechnet."
Nach der Mechanik folgt, wenn es passt, **eine Sache ändern** (Abschnitt 6).

### 5 · Übertrag
Drei Alltagsbeispiele als Dreiklang. Mindestens zwei mit Euro-Preis und zum Nachmachen. Keine Luxusbilder ohne Zahl.
> "Darum gibt dir der Autohändler den Schlüssel. Darum darfst du dich aufs Bett legen. Darum will dich der Laden in der Kabine."
Mit Preisen: "Das klappt auch mit kleinem Budget: Friseur, 35 Euro neben dem 400-Euro-Paket."

### 6 · Regel
Handlungsanweisung an den Zuschauer, aus Verkäufer- oder Käufersicht.
> "Wenn du also irgendwas verkaufst: Stell etwas Teureres daneben."
> "Wenn du das nächste Mal einkaufst: Schau zuerst auf den Preis pro Kilo."

### 7 · Pointe
Ein einziger Merksatz. **Danach kein nachgeschobener Fragment-Satz** ("Für vier Minuten." war "fehl am Platz"). Einmal stark setzen, dann direkt in den Abgang.
> "Wer festhält, hat nicht gewählt. Er hängt nur fest."

### 8 · Abgang
Siehe Abschnitt 7.

### Echte Geschichte und Mitraten
Wenn das Thema eine belegte Geschichte hat, kommt sie vor die Pointe (Takt 6/7). Wenn es sich eignet, baut Takt 4 eine Mitrate-Pause ein (Abschnitt 6).

### Länge
- **Ziel ~70 s, 60–80 s erlaubt.** Warum: Erfahrung aus den Folgen: Bis Sekunde 90 springen zu viele Zuschauer ab. Skript danach bemessen, nicht strecken.
- Ist die Sprechzeit zu kurz, füge **ein bis zwei belegte Sätze** hinzu (Detail, Zahl, Beispiel), statt langsamer zu sprechen oder einen Nachspann zu dehnen.
- Ist sie zu lang, streiche ganze Sätze im Skript, nicht die Pausen. Nachträgliches Kürzen ohne Neuvertonung geht an den leisesten Stellen, aber Wortzeiten müssen mitwandern (Abschnitt 5, Anker).
- Deutsch braucht rund 15 % mehr Silben als Englisch. Beim Nachbau eines englischen Vorbilds das Skript straffen, nicht das Tempo hochziehen.

### Rätsel-Folgen (Sonderfall)
- Kurzes Rätsel: Frage + Optionen in einem Satz, Countdown 3-2-1 direkt in der Pause nach der Frage (~1,6 s Stille), von "Test" bis Auflösung höchstens ~10 s. Längeres Raten verliert Zuschauer.
- Eine verlockende falsche Antwort einbauen, genau eine richtige Lösung. Die Eindeutigkeit im Code prüfen (Prüfblock bricht den Render ab, wenn die Zählung nicht stimmt).
- Kein Hinweis über Farben: UI-Akzente nie in einer Lösungsfarbe, Hervorhebungen gruppenweise auf das gesprochene Wort, jede Option gleich oft.
- Regeln, auf denen die Pointe beruht, im entscheidenden Moment noch einmal klein einblenden.

---

## 4 · Sprache und Tempo

### Sätze
- **10–13 Wörter je Satz** im Durchschnitt, Mechanik-Sätze 4–7 Wörter. Lange Sätze sind schwer zu verfolgen, kurze Gegensatzpaare bleiben hängen.
- Komposita auflösen ("der Preis vorne" statt "Vorderseitenpreis"). Kein Fachwort ohne Bild.
- Aktiv, direkt, "du". Keine Floskeln ("Heute möchte ich dir zeigen", "Stell dir vor", "Kennst du das?").
- Keine Bitten im Hook oder mitten in der Erklärung.
- Kein "könnte", "vielleicht" in der These.
- **Jeder Satz versteht sich allein.** Kein "das", "es", "dort" ohne klaren Bezug; im Zweifel das Wort wiederholen. Tester verstanden "Frag dich, ob das auf deinem Zettel stand" nicht (gemeint: ob die Süßigkeit auf dem Einkaufszettel stand).

### Tempo
- **~4,5 Silben pro Sekunde reine Sprechzeit.** Warum: Videos mit "manche viel zu schnell gesprochen" wurden beanstandet; das Vorbild liegt bei 4,3–5,0.
- `theme.json → stimme.tempo` hängt von der Stimme ab:
  - **ElevenLabs:** 1,0 bis 1,1. Nie bremsen, höchstens 10 % schneller; gebremste ElevenLabs-Sprache klingt künstlich.
  - **Lokale Stimmen (Piper, Qwen):** 0,8 bis 1,25. Ziel **~5,0 Silben/s**, zügig wirkt hier lebendiger (gebremst auf 4,5 fanden Tester die lokalen Stimmen zu langsam und nervig). `vertonen.py` bremst erst über 5,6 und beschleunigt unter 4,3; `pruefe.py` meldet außerhalb 4,3–5,6. Geschmack des Nutzers geht vor.
- **Mehr Inhalt statt langsamer sprechen, wenn Länge fehlt.** Das Tempo stellt die Sprechgeschwindigkeit ein, nicht die Videolänge; fehlt Länge, kommen belegte Sätze dazu.
- Das Tempo wird an der echten Stimme gemessen, nicht übernommen. Jede Stimme spricht anders; kommt `pruefe.py` über die Grenze (ElevenLabs 5,2, lokal 5,6), den Vorschlag von `vertonen.py` übernehmen (bei ElevenLabs stattdessen Sätze kürzen) und neu vertonen.
- Einen Satz nachträglich auf unter 3 s zu bringen geht über einen leicht erhöhten Tempofaktor nur für diesen Satz (bis 10 %). Der Rest bleibt natürlich.

### Zahlen: `{Anzeige|Sprechform}`
Im Skript steht jede Zahl, die im Bild als Ziffer erscheint, in geschweiften Klammern: links, was im Untertitel und Bild steht, rechts, wie es gesprochen wird.

```
Im Jahr {2012|zweitausendzwölf} kosteten sie {1.499 €|eintausendvierhundertneunundneunzig Euro}.
Nur {19 %|neunzehn Prozent} lösten ein.
```

Regeln:
- **Satzzeichen gehört in beide Teile**, wenn es direkt hinter der Zahl steht: `{130?|hundertdreißig?}`, `{19 %.|neunzehn Prozent.}`. Sonst wird es ein eigenes Untertitel-Wort.
- Zahlen im Sprechtext ausgeschrieben, im Bild als Ziffern.
- Deutsche Schreibweise: 1.549 €, 4,5 Sekunden.
- Jahreszahlen im Bild nur **einblenden**, nie hochzählen (sonst blitzt kurz ein falsches Jahr).
- Lange Jahreszahlen ("zweitausendzweiundzwanzig") setzt die Spracherkennung gern ins Folgewort. Prüfe die Wortzeiten dort besonders.

### Pausen
`pausen.py` läuft **nach jedem Vertonen** und kürzt jede hörbare Stille auf eine einheitliche Länge: Satzende am längsten, Komma und Doppelpunkt kürzer, im Satz am kürzesten. Warum: Zu viele "komische Pausen" ließen die Stimme unnatürlich klingen. Die Wortzeiten wandern mit; danach rendern. Bewusste Stille (Mitraten, Abschnitt 6) markierst du schon im Skript mit `[pause 1.6]` am Zeilenende: `vertonen.py` fügt sie ein, `pausen.py` lässt sie stehen.

### Vertonen
- Vor dem Vertonen **einmal fragen** (CLAUDE.md): Die Stimme kostet Guthaben des Nutzers. Skript und Quellen kurz zeigen, auf ein Ja warten.
- Eine Stimme für den ganzen Kanal, damit sie zur Marke wird (`theme.json → stimme`).
- Wortzeiten prüfen: alle steigen, jedes Wort hat `e > s`. Die Spracherkennung setzt Wortanfänge nach Pausen manchmal 0,1–0,3 s zu früh. Korrigiere nach dem Pegel, aber nur an der echten Stille vor dem Wort; kurze Verschlusslaute in Wörtern ("fliegt|direkt") täuschen sonst einen Wortanfang vor.
- Einen Satz zu streichen geht ohne Neuvertonung: aus der Audiodatei schneiden, Wortzeiten verschieben. Anker nur relativ zu Nachbarwörtern, nie feste Sekunden.

---

## 5 · Bildregeln und Motion

### Bühne und Layout

| Zone | Wert |
|---|---|
| Kopfzeile (Kanalname, klein) | y ≈ 190, erst ab ca. 4–5 s |
| Inhalt | y 260–1300 |
| Untertitel-Pille | y ≈ 1360 (nichts Wichtiges darunter oder dahinter) |
| Seitenrand | ≥ 90 px |
| Rechter Streifen | 230 px nur für Bild, **keine Schrift** und keine Zahlen |
| Zentrum | **x = 540** |

- **Bild zentral.** Szene, Karten, Titel, Diagramme sitzen auf x = 540. Die Regel "rechts keine Schrift" heißt nicht, die ganze Komposition nach links zu schieben (Fehler, der mehrfach beanstandet wurde). Bei breiten Elementen schmaler bauen.
- **Geteiltes Bild** (Vorher/Nachher): beide Hälften zeigen, die zweite gedimmt und auf ihrem Wort aufhellen, sonst wirkt es nicht zentral.
- **Kein Text, der überläuft oder abgeschnitten ist.**
- **Lesetest-Mindestgrößen** (bei 390 px Breite gerendert): Chips und kleine Labels ≥ 21 px, Beschriftungen von Schichten und Achsen ≥ 24 px, Zahlen und Titel deutlich größer. Was darunter liegt, wird größer oder weggelassen.
- **Flaches 2D**, keine 3D-Pflicht. Dünne Kontur, wenige Füllfarben aus `theme.json`. Aufwendiges 3D nur auf ausdrücklichen Wunsch des Nutzers: es kostet viel mehr Aufwand, und flach war in der Praxis oft sogar besser.
- **Keine Markenlogos zeichnen.** Markennamen als Text sind erlaubt.
- Figuren und Illustrationen aus `bausteine/`. Gemeinsame Bausteine nicht ändern; Neues gehört in den Ordner des Videos.

### Hook-Bild
- Ein **großes Objekt, bildfüllend, in Bewegung** (Auto fährt, Lampe pendelt, Zahl rollt). Es tut etwas Unerwartetes.
- Keine Screens, Formulare, Tabellen oder Textwände als erstes Bild.
- Keine Kopfzeile in den ersten Sekunden. Nur Objekt und Untertitel-Pille.
- Die Kamera darf im Hook mit dem Objekt fahren; danach steht sie still, Bewegung kommt von den Elementen.

### Pacing
- **Ein neues Objekt pro Satz.** Dazwischen ändern sich nur vorhandene Dinge: Zahl zählt, Winkel dreht, Chip erscheint. Warum: Zuschauer-Feedback "am Anfang so viel passiert, ich bin gar nicht klargekommen".
- **Taktgeber ist das gesprochene Wort.** Jedes neue Element erscheint auf dem Wort, das es benennt (±0,2 s).
- **Etwa jede Sekunde eine sichtbare Änderung**, rund 0,85–1 Bildereignis pro Sekunde. Im hellen Teil **nie über 4 s ohne Änderung**, auch nicht in Ruhephasen.
- **Bühne nie leer.** Ab dem ersten Bild einer neuen Szene ist etwas los (Autos fahren schon, Ortschip mit Stecknadel), nicht erst auf das Zahlwort warten. Zähler beim ersten Laut des Zahlworts schon stehend, linear, ohne Ausrollen.
- **Kein Flackern, Pulsieren, Wackeln als Deko.** Auch nicht, damit `pruefe.py` anschlägt (siehe Abschnitt 10).
- **Echte Ereignisse statt Takt:** Was "Bewegung" erzeugt, ist ein Ereignis auf einem Wort: eine Karte hellt auf, eine Zahl fällt, die Kamera fährt kurz (0,3–0,4 s) auf den Gegenstand, eine Kante leuchtet auf. Das zählt, nicht ein Blitz im Takt.
- **Szenenwechsel genau einer** (Hell → Erklärwelt → Hell, siehe unten), sonst bleibt die Bühne, Elemente bauen sich auf und ab. Harte Schnitte kommen praktisch nicht vor.
- **Überblendungen in 2D** höchstens 0,25 s und mit Bewegung, sonst entstehen Doppelbelichtungen. Ein Kulissen-Wischer oder eine Kamera-Klappung ist besser als Überblenden.
- Übergänge im 0,15–0,2-s-Raster ansehen: Der 1-Bild-pro-Sekunde-Bogen zeigt Geisterbilder und leere Bildschirme nicht.

### Bewegungsvokabular (Bausteine)

| Baustein | Wirkung |
|---|---|
| Karte legt sich auf | Weiße Karte mit Kontur und hartem Schatten, gleitet von unten ein |
| Zahl zählt hoch | Preise, Prozent laufen von 0 und landen auf dem gesprochenen Wert |
| Chip plopp | Kleine Pille erscheint mit leichtem Überschwinger |
| Balken füllt sich | Fortschritt oder Skala, rot ↔ grün |
| Vorher/Nachher | Zwei Spalten, rechts kommt das Neue |
| Quellenkarte | Mono-Zeile (Quelle · Jahr) über fetter Aussage |
| Durchstreichen/X | Rotes X über einer falschen Annahme |
| Stempel | Nur, wenn er zur Folge passt (siehe Abschnitt 7) |
| Humor-Detail | 3–5 kleine Comic-Blasen je Video, ~1 s, nie über den Untertiteln |

### Mechanik-Wechsel (`mechanik_wechsel.art`)
Der Erklärteil (Takt 4) wird sichtbar abgesetzt, damit der Zuschauer merkt: Jetzt schauen wir hinter die Dinge. Die Idee dahinter ist ein **sichtbarer Perspektivwechsel**: dieselben Objekte, andere Sicht. Das Paket bietet drei Einstellungen in `theme.json`:

- **`keiner`** (Standard): Die Bühne bleibt gleich. Der Wechsel zeigt sich nur durch die Wende-Zeile und dass die Objekte jetzt ihre Innenseite, ihre Zahlen oder ihre Funktion zeigen.
- **`dunkel`**: Die Szene wechselt für den Erklärteil auf `dunkel_hintergrund`, Elemente in der Leuchtfassung (`dunkel_akzent`), z. B. gestrichelte Umrisse oder eine Blaupause. Genau eine dunkle Phase: ein Streifen läuft über das Bild hinein, einer wieder heraus.
- **`rahmen`**: Ein dicker Rahmen in der Akzentfarbe legt sich um das Bild und bleibt, solange der Erklärteil läuft.

Regeln für `dunkel`:
- Dunkle Szene braucht echte Ereignisse auf Wörtern, sonst misst `pruefe.py` sie als Ruhe. Kleine Leuchtobjekte und dünne Linien auf dunklem Grund werden kaum als Bewegung gezählt. Hilfreich: ein kurzer Kamerawechsel auf das Detail, eine Leuchtkante, die auf dem Wort aufblitzt.
- Beim Zurück ins Helle der Satz nach der Mechanik als Auslöser ("Das gleiche Prinzip steckt in ...").
- Auf Papier bleiben Geräteschichten hell, dunkle Flächen nur im Erklär-Modus.
- Keine Bildruck-/Flacker-Tricks für die Messung.

### Anker im Code: `at()` und `endOf()`
Alle Zeiten im Video hängen an Wortzeiten, nie an festen Sekunden.

```
at(WD, "Wort", n)     Startzeit des n-ten Vorkommens von "Wort"
endOf(WD, "Wort", n)  Endzeit
at(WD, "Wort", ab)    erstes Vorkommen nach einer Zeit (Sekunden)
```

Fallen:
- `at()` ignoriert Groß/klein. "Würdest" trifft "Wie würdest du". **Jedes Wort zählen, auch klein geschriebene** ("die", "der", "das", "aber", "über", "wenn").
- Das gilt auch für Wörter, die einmalig wirken. Ein Großwort, das klein früher vorkommt, mit `ab` absichern.
- **Mehrfachwörter:** "Das" steckt schon in "Schauen wir das", "Wer", "für", "der" kommen mehrfach vor. Das richtige Vorkommen zählen oder `ab` nutzen.
- Der Anker wirft einen Fehler, wenn das Wort fehlt. Dann die Wortliste prüfen, nie per Wortanfang matchen.
- Zahlen im Anker wie im Skript-Anzeigetext angeben ("1.549", "2009").
- Nach `{1984|…}.` legt die Vertonung den Punkt manchmal als eigenes Wort "." an: in der Wortliste von Hand ans Jahr hängen.
- Wird ein Satz gekürzt, alle Anker neu prüfen. Ein falscher Anker lässt eine ganze Szene still fehlen oder zu früh erscheinen. Prüfe die Kontaktbögen auf "Text steht schon im Bild, obwohl der Satz noch nicht gesprochen wurde".

### Untertitel
- Wort-Untertitel in einer Pille bei y ≈ 1360, **2–4 Wörter**, aktives Wort in `untertitel.aktiv` hervorgehoben (Karaoke-Prinzip).
- Fette Schrift, gute Kontrastfarbe auf der Pille.
- **Untertitel laufen bis zum letzten Wort.** Nicht ab der Folgen-Einladung ausblenden.
- Die meisten schauen zuerst ohne Ton: Untertitel immer einbrennen.
- Im Kontaktbogen darf die Pille nie verdeckt sein.

### Schrift und Farben
- Zahlen und Titel in `schrift.titel`, schwer, groß. Preise und Prozente sind das größte Element im Bild.
- Labels, Chips, Kopfzeile in `schrift.mono`, Versalien, gesperrt.
- Farben nur aus `theme.json` (`akzent`, `positiv`, `negativ`, `markierung`). Rot/Grün nicht zufällig vergeben: Sie bedeuten falsch/richtig, schlecht/gut.
- UI-Texte in Geräten müssen zueinander passen (Eingabefeld und Vorschlagsleiste zeigen denselben Stand). Bei Geräte-UIs jede Szene auf Logik prüfen.

### Physik und Modelle
- Wo eine Bewegung durch ein Gesetz bestimmt ist (Wurf, Stau, Bruch), rechne sie, statt Keyframes zu setzen. Parameter erst im Skript durchprobieren (Zahlen ausgeben), dann bauen.
- Bei Bewegungen, die in Echtzeit zu schnell sind, zeige sie über eine Nahaufnahme oder Zeitlupe.
- Flugbahnen gegen die Bühnenbreite prüfen: Zu weite Abstände lassen Objekte senkrecht fallen.
- Kleine Mathe-Prüfblöcke im Code (Zählung stimmt, Lösung eindeutig) brechen den Render ab, bevor ein falsches Video entsteht.

### Karten und Länder
Nimm echte Umrisse und Größen aus Geodaten. Weit weg ein Globus, nah dran eine flache Karte, ohne die Aufblähung nahe der Pole. Wenn sich ein Karten-Pfad pro Bild ändert, jedes Bild neu aufbauen (`key={frame}`), sonst bleiben im langen Render Schlieren stehen. Prüfe am echten Render, nicht am Standbild.

---

## 6 · Werkzeuge im Skript

### Mitraten (3-2-1)
Wenn eine Frage vor der Auflösung steht ("Was passiert jetzt?"): Entscheidungspause mit einem 3-2-1-Countdown, Stille ~1,6 s (im Skript `[pause 1.6]` hinter die Frage-Zeile), dann Auflösung. Es hält Zuschauer im Video, weil sie selbst tippen. Nur wenn die Antwort wirklich überrascht. Danach die Karte der richtigen Antwort auf ihrem Wort wachsen lassen.

### Eine Sache ändern
Nach der Mechanik ändert **genau eine Größe** ihren Wert, und das Bild zeigt, was daraus folgt ("Und wenn der Laptop gerade stünde?"). 1–2 Sätze im Skript, kein eigener Takt. Alle übrigen Elemente bleiben stehen, nur die geänderte Größe und ihre Folge bewegen sich. Im Code: ein Profil mit zwei, drei Zahlen trägt die ganze Welt; "ändern" heißt eine Zahl ändern.

### Metapher nur, wenn sie genauer ist
Ein Vergleich ("wie ein Magnet", "wie ein Köder") kommt nur ins Skript, wenn er die Sache genauer erklärt als das echte Ding. Sonst zeige und benenne das echte Objekt: den echten Preis, die echte Studie, den echten Laptop. Dann erkennt der Zuschauer jedes Bild im Alltag wieder.

### Mechanik-Wechsel
Siehe Abschnitt 5. Entscheide mit dem Nutzer, ob sein Kanal einen sichtbaren Wechsel braucht (`dunkel`, `rahmen`) oder bei `keiner` bleibt.

### Echte Geschichte
Siehe Abschnitt 2 und 3: vor die Pointe, im echten Licht (ohne Effekt-Look), mit Quellenkarte (Zitat übersetzt, Medium, Datum).

### Wiederverwendbare Bausteine
Nutze Bausteine aus `bausteine/` statt zu zeichnen: Karten, Chips, Zähler, Balken, Quellenkarte, Untertitel, Abspann-Elemente, Figuren. Was fehlt, baust du im Ordner des Videos (`vorlage/src/videos/<slug>/`), nie in den Bausteinen selbst.

---

## 7 · Abgang und Abspann

### Reihenfolge
1. **Pointe** (ein Satz, Abschnitt 3).
2. **Teilen-Satz** (wenn passend, ~2 s).
3. **Folgen-Einladung** in eigenen Worten, warm und persönlich.
4. **Schlussbild** = Hook-Bild.

Gesamter Abspann **5–8 s** (`abspann.dauer_max_s`). Warum: Wer bis zum Ende schaut, ist nicht von ein paar Sekunden mehr abgeneigt, und ein einladender Schluss wirkt besser als ein knapper Befehl. Aber nie lang.

### Teilen-Satz
- Nur im Abgang, **nie im Hook oder mitten in der Erklärung**. Gesprochen ein Satz, höchstens ~2 s.
- **Mit konkretem Empfänger**, der zur Folge passt: "Schick das jemandem, der immer 160 fährt." · "Schick's dem, der sich für schlau hält." Nie "Teil das mit allen". Kein Druck ("bevor es gelöscht wird").
- Nicht in jeder Folge. Er passt, wenn die Folge jemanden ertappt oder ein Rätsel ist. Bei reinen Erklärfolgen bleibt es bei der Folgen-Einladung.
- Der Standardsatz steht in `theme.json → abspann.teilen_satz`; passe den Empfänger an das Thema an.

### Folgen-Einladung
- Warm und persönlich, in eigenen Worten: "Und wenn dir so etwas gefällt, folg mir gerne. Hier erkläre ich dir jeden Tag, was hinter den Dingen steckt, die du täglich benutzt."
- Der Standardsatz steht in `theme.json → abspann.folgen_satz`.
- Auch als Wette oder Mutprobe möglich ("Schaffst du es nicht, musst du mir folgen") – wenn es zum Thema passt.
- Nicht zwei Bitten gleichzeitig. Teilen und Folgen dürfen in einem Satz stehen, mehr als dieser eine Satz kommt nicht dazu.

### Abspann im Bild
- **Streng nacheinander, nie zwei Elemente zugleich**: erst Folgen (Profilkarte, Tipp, "Gefolgt ✓"), dann Like, dann Teilen. Je Element ein Auslöser auf dem passenden Wort.
- **Ruhig.** Kein Konfetti, keine Hand mit Finger, keine Herzen, kein Bildruck. Überlappende Bausteine wurden als "überstimulierend" empfunden.
- Gib den Elementen Zeit: erst die gelungene Animation sitzen lassen (die Welle löst sich auf, der Wert steht ~2 s), dann die Profilkarte; die Szene läuft darunter weiter.
- Die Kommentarfrage wandert in die **Caption**, wenn im Video zum Teilen aufgefordert wird. Im Bild stehen höchstens zwei Bitten, stumm über dem Schlussbild.
- **Untertitel laufen bis zum Schluss.**
- **Letzter Frame = Hook-Bild.**
- Bei Rätseln und Standbild-Schluss: das letzte Bild zeigt alles, was man zum Pausieren und Knobeln braucht.

### Schlussbild = Hook-Bild, durchschaut
Bei der Pointe kehrt das Hook-Objekt in seine Anfangslage zurück: an dieselbe Stelle, in derselben Größe. Jetzt trägt es die Erkenntnis aus der Mechanik (Winkelbogen, Preiskarte, Markierung, Pfeile). Nur das Bild schließt den Kreis, die Stimme endet normal (kein gesprochener Loop). Warum: Wer am Ende das Anfangsbild wiedersieht, schaut eher noch einmal, und jede Wiederholung zählt.

### Stempel nur, wenn er passt
Ein Stempel (ein kurzes Wort, das zu deinem Kanal passt) ist optional. Er passt zu klassischen Kaufpsychologie- oder Alltags-Fällen und wirkt bei Geschichten, Nachbauten und neuen Stilen aufgezwungen. Wenn er nicht passt, trägt die Erkenntnis das Bild selbst und die Signatur-Zeile den Schluss. Das Paket schreibt keinen Stempel vor.

---

## 8 · Cover

Das Cover entscheidet im Feed, ob jemand das Video öffnet. Es ist Pflicht, `werkzeug/cover.py` rendert es. Der Stil kommt aus `theme.json → cover.stil`; der Nutzer darf pro Video wechseln. Zeige bei Unsicherheit mehrere Konzepte nebeneinander und lass den Nutzer wählen.

### Grundregeln
- **Flach 2D**, nicht 3D. Wenige große Formen.
- **Höchstens 3 Wörter** Text. Textlastige Cover wurden verworfen.
- **Sofort verständlich schlägt raffiniert.** Ein nüchterner Vergleich schlug emotionalere Entwürfe.
- **Nah und voll:** Das Hauptobjekt füllt das Bild, notfalls angeschnitten. Lieber der Moment **kurz vor** dem Ereignis als das Ergebnis: auf einen Blick lesbar und hält die Neugier offen.
- **Cover sagt nur, was die Quelle trägt.** Sagt die Studie "die meisten", sagt das Cover nicht "fast jeder".
- **Das Cover darf die Hook-Zahl zeigen**, nicht aber die Pointe. Die Auflösung bleibt verborgen.
- **Humor aus dem Video** aufs Cover holen (ein kleines Detail, eine Comic-Blase).
- **Ein Blickfänger, der zeigt:** Pfeil + Kringel um das entscheidende Detail, oder ein Stempel/Label mit dem Hauptwort (Bausteine „Hervorheben & Pfeile“, „Symbole & Stempel“). Frage und Pfeil gehören zusammen: Die Frage fragt nach dem, worauf der Pfeil zeigt („Nur Zufall?“ + Pfeil auf die Süßigkeit im Regal). Ein Cover nur aus Text und Objekt wirkte auf Tester nichtssagend.
- **Bei Rätseln** das Cover wählen, das das Rätsel selbst zeigt oder zum genauen Hinsehen auffordert.
- Prüfe Cover-Wörter auf versteckte Hinweise ("den Dieb" verrät das Geschlecht).

### Die drei Stile

**`frage`**: Eine direkte Frage groß auf dunklem Grund plus Hauptobjekt.
- Frage in 2–3 Zeilen, sehr groß, dunkelfarbener Grund (`dunkel_hintergrund`), helle Schrift.
- Darunter oder daneben das Hauptobjekt der Folge.
- Beispiel: "WIE VIEL ZEIT SPART RASEN?" mit einem Auto.

**`vergleich`**: Zwei Karten nebeneinander.
- Links ein Wert in `negativ` oder neutral, rechts in `positiv`, große Zahlen, ein Symbol fürs Thema.
- Zwei Farben (grün/rot), nüchtern. Ein einziges Symbol.
- Beispiel: "130 km/h → 23 MIN" gegen "160 km/h → 19 MIN", Frage darüber.
- Der Vergleich ist die sicherste Wahl, wenn das Thema zwei Zahlen hat.

**`nah`**: Das Hauptobjekt füllt das Bild.
- Höchstens 3 Wörter, gern ein Humor-Detail aus dem Video (Comic-Blasen, ein Gesicht, eine kleine Szene).
- Beispiel: Autos füllen das Bild, du mittendrin in Orange, Fluch-Blasen drumherum, Text "WER WAR DAS?".
- Passt, wenn das Video einen Moment hat, der selbst erzählt.

### Schrift auf dem Cover
- **Wortabstand sichtbar lassen:** `wordSpacing ≈ 0,22 × Schriftgröße`. Enge Laufweite schluckt die Leerzeichen, und "SPART RASEN" sieht aus wie ein Wort.
- **Kontur nach Helligkeit:** Helle Schriftfarben (Luminanz > 0,5, z. B. Gelb, Grün, Weiß) bekommen eine **schwarze** Kontur. Dunkle (Rot) bleiben weiß umrandet. **Heller Text und helle Stempel nie weiß umranden.**
- Stempel auf hellem Papier bekommen einen schwarzen Rand.
- Kein Logo auf dem Cover. Markennamen als Text sind erlaubt.

### Safe-Zone
- Das Profilraster zeigt nur den **3:4-Ausschnitt aus der Mitte: y 240–1680**. Schlagzeile, Stempel und Zahlen liegen zwischen y 270 und 1640. Sonst werden sie im Raster abgeschnitten.
- Objekte enden oberhalb y ≈ 1400, sonst verdecken sie die Frage.
- Die Ecke oben rechts bleibt frei (Symbol der Plattform).

### Feed-Test
**Alle Cover nebeneinander auf 280 px Breite verkleinern.** Die Schlagzeile muss noch lesbar sein, das Hauptobjekt noch erkennbar. Ist es das nicht, mach die Schrift größer oder den Text kürzer.

### Cover im Video
Das Cover gehört zur Bildwelt des Videos: gleiche Figur, gleiche Farben, gleiche Schrift aus `theme.json`. Es kann aus derselben Szene mit fester Zeit und eigener Kamera entstehen. Speichere `cover.png` und `cover.jpg` im Videoordner.

---

## 9 · Caption

`caption.txt` im Videoordner. Der Hook steckt schon im Video; die Caption ist **kein zweiter Hook**. Sie liefert Kontext, genau eine Bitte und die Suchwörter.

### Bauplan
1. **Zeile 1–2:** Kontext, der den Hook ergänzt. Nur die ersten **125 Zeichen** sind ohne "mehr" sichtbar. Dort steht kein Gruß, kein Hashtag, kein Emoji am Anfang.
2. **Suchwörter im Text:** 2–3 Begriffe, unter denen man das Video finden soll, als **normale Wörter im Satz** ("Zapfpistole", "Noise Cancelling", "Tempolimit"). Die Suche liest den Text; ein Hashtag allein reicht nicht.
3. **Pointe als streitbare Aussage** über die Sache, wenn sie sich eignet (zieht Kommentare). Keine Fragen, die eine eigene Branche voraussetzen.
4. **Genau eine Bitte:** Kommentar, Speichern oder Folgen. Zwei Bitten wirken wie keine. Bittet das Video ums Teilen, fragt die Caption nach einem Kommentar; beides zusammen kommt nicht in die Caption.
5. **Letzte Zeile: 4–5 Hashtags.** Dein Kanal-Hashtag immer dabei (aus `theme.json`), dazu Thema und Nische.
6. **Kein Link** in der Caption (nicht klickbar).

### Beispiel (Form)
```
Der Kassenbon verrät, wie dein Einkauf berechnet wird. Beim Wiegen, bei der Aktion und beim Pfand steckt ein System dahinter.

Was meinst du: Fair oder Absicht? Schreib's in die Kommentare.

#deinkanal #einkaufen #preise #alltag #verbraucher
```

### Kommentare
In der ersten Stunde antworten. Fragen und Inhaltliches zuerst; auf Lob reichen Like und wenige Worte; Lärm und Hass bleiben unbeantwortet. Kritik: erst den wahren Teil zugeben, dann bei der Sache bleiben, nie löschen. Eine Frage, die viele haben, wird die nächste Folge. Das ist die Aufgabe des Nutzers, nicht deine.

---

## 10 · Prüfung

**Kein Video gilt als fertig, bevor `pruefe.py` gelaufen ist und du die Prüfbilder selbst angesehen hast.** Vorher einmal alles selbst benutzen, nicht nur auf fehlerfreies Schreiben vertrauen.

### Ablauf
1. Typprüfung des Projekts (`vorlage`) ohne Fehler.
2. `python werkzeug/render.py <ordner>`.
3. `python werkzeug/pruefe.py <ordner>`: Messwerte plus Bilder. Alle Punkte OK anstreben.
4. Bilder ansehen (Read-Tool), in dieser Reihenfolge:

| Prüfung | Datei | Frage |
|---|---|---|
| **Kontaktbogen** | `pruefung/bogen.jpg` (1 Bild/s) | Jede Sekunde anders? Nichts überlappt oder abgeschnitten? Mitte bei x = 540? Untertitel nie verdeckt? |
| **Hook-Bild** | `pruefung/hook.jpg` (0–3 s) | Objekt groß und in Bewegung? Keine Kopfzeile? Kein Screen? |
| **Lesetest 390 px** | `pruefung/390/blatt_*.jpg` | Jede Zeile, Zahl und jeder Stempel in Handybreite lesbar? |
| **Stumm-Test** | Video ohne Ton | Versteht man die Folge nur über Bild und Untertitel? |
| **Ton-Test** | Nur die Stimme | Trägt die Stimme allein? Wirkt Tempo natürlich? Keine Pausen, die komisch klingen? |
| **Cover** | `cover.jpg` | Safe-Zone y 240–1680, Feed-Test 280 px |
| **Schlussbild** | Letzter Frame | Gleich dem Hook-Bild, jetzt durchschaut? |

5. Korrigieren, neu rendern, wiederholen. **Höchstens 5 Runden.** Dann bewusst ablehnen oder dem Nutzer die Restschwäche nennen.

### Was `pruefe.py` misst
Länge, erster Satz fertig ≤ 3 s, Stimme ab Frame 0, Silben pro Sekunde, Bild-Beats pro Sekunde, längste Ruhe, Lautheit (Ziel `format.lautheit_lufs`, −14 LUFS), Wort-Anker, Vorkommen der acht Takte.

### Keine Messwert-Tricks
**Verboten:** periodisches Aufleuchten, Flackern, Stroboskop-Effekte, Pulsieren nur, damit der Detektor anschlägt. Der Detektor misst Frame-Differenzen, er bewertet nicht die Qualität. Gibt es eine Ruhephase, mach sie durch ein **echtes Ereignis auf einem Wort** lebendiger (Kamerafahrt, Aufhellen einer Karte, ein Objekt, das etwas tut). Wenn das nicht möglich ist, verfehle den Messpunkt knapp. Im dunklen Erklärteil darf die Messung mehr Ruhe zeigen, wenn dort sichtbar etwas arbeitet; die Sichtprüfung entscheidet.

Bekannte Messeffekte:
- Dunkle Szenen mit weicher Kamera und dünnen Linien ergeben wenige Bild-Beats.
- Eine durchgehende Kamera ohne Schnitte lässt den Detektor wenig zählen; kurze Fahrten (0,3–0,4 s) auf Wörtern helfen.
- Ein Standbild in `bogen.jpg` zeigt keine Doppelbelichtung zwischen zwei Sekunden: siehe das 0,15–0,2-s-Raster oben.

### Abschlussbericht an den Nutzer (kurz)
Pfad der `video.mp4`, Länge, Ergebnis von `pruefe.py` (alle Zeilen), was du in der Sichtprüfung korrigiert hast, offene Schwächen, vorgeschlagener Caption-Text. Keine Technik-Details, die der Nutzer nicht braucht.

---

## 11 · Häufige Fehler

| Fehler | Folge | Statt dessen |
|---|---|---|
| Hook mit Datum, Nachrichtentafel oder Formular | Zuschauer springen ab | Großes Objekt in Bewegung, These in Satz 2 |
| Erster Satz länger als 3 s | Schwacher Start | Kürzen, nötigenfalls leicht beschleunigen (≤ 10 %) |
| "Könnte", "vielleicht" in der These | Schwache Behauptung | "Es soll dir Y verkaufen." |
| Zu viele neue Objekte pro Satz | "Ich bin nicht klargekommen" | Ein neues Objekt pro Satz, Rest verändert Bestehendes |
| Flackern, Pulsieren, Wackeln als Deko | Unruhe, Messwert-Trick | Echte Ereignisse auf Wörtern |
| Bild nach links geschoben wegen des rechten Randstreifens | "Nicht zentral" | Zentrum x = 540, nur Schrift raus aus dem Streifen |
| Untertitel enden vor dem letzten Wort | Zuschauer verlieren Text | Untertitel bis zum letzten Wort |
| Anker trifft das falsche Wort (Groß/klein, Mehrfachwort) | Szene erscheint 40 s zu früh | Jedes Vorkommen zählen, `ab` nutzen |
| Satzzeichen steht nur außerhalb der Klammer | Eigenes Untertitel-Wort "." | Satzzeichen in beide Teile |
| Zahlen im Sprechtext als Ziffern | Falsche Aussprache | Sprechform ausgeschrieben |
| Dollar im Video bei deutschem Publikum | Zahl ohne Gefühl | In Euro, Original in `quellen.md` |
| Langsamer sprechen für mehr Länge | Klingt gebremst | Zwei belegte Sätze hinzufügen |
| Bitten im Hook oder mitten in der Erklärung | Nervt | Nur im Abgang, ein Satz |
| Teilen-Satz ohne konkreten Empfänger | Wirkt leer | "Schick das jemandem, der …" |
| Abspann mit überlappenden Elementen, Konfetti | "Überstimulierend" | Streng nacheinander, ruhig |
| Pointe, danach noch ein Fragment-Satz | "Fehl am Platz" | Pointe stark setzen, dann Abgang |
| Stempel erzwungen | Wirkt aufgesetzt | Weglassen, wenn er nicht passt |
| Cover mit viel Text oder kleiner Szene | Im Feed nicht lesbar | ≤ 3 Wörter, nah und voll, Feed-Test 280 px |
| Cover-Text außerhalb der Safe-Zone | Im Profilraster abgeschnitten | y 270–1640 |
| Cover sagt mehr als die Quelle | Falsche Behauptung | Formulierung der Quelle |
| Cover mit weißer Kontur auf hellem Text | Schlecht lesbar | Schwarze Kontur bei hellen Farben |
| Rätsel mit Farb-Hinweis auf die Lösung | Unfair | Alle Optionen gleich behandeln |
| Rätsel zu lang, zu viel Erklärung | Zuschauer gehen | Frage + Optionen in einem Satz, 3-2-1 |
| Kein Beleg für Zitat oder Zahl | Nicht veröffentlichbar | Streichen oder ehrlich umformulieren |
| Karte mit falscher Form oder erfundener "Kreuzung" | Fehler fällt sofort auf | Echte Daten, Elemente aus eigener Liste |
| Scheinbar harmlose Luxusbeispiele ohne Zahl im Übertrag | Nicht nachvollziehbar | Zwei bis drei Alltagsbetriebe mit Euro-Preis |
| Zu lange Videos (über 90 s) | Abbruch | Ziel ~70 s |
| Viele Prüfrunden auf Perfektion | Zeitverlust | Höchstens 5, Rest ehrlich nennen |
| Bausteine oder Vorlage verändert | Bricht andere Videos | Neues im Ordner des Videos |

---

## Schluss

Wenn du unsicher bist: Rückfrage in einem Satz, nicht raten. Wenn der Nutzer etwas Neues vorgibt ("mach diesmal 3D", "lass den Abspann weg"), gilt seine Anweisung für dieses Video. Wiederholt sich etwas, schlage vor, es in `theme.json` festzuhalten.
