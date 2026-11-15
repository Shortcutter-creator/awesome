window.GEDANKENWERK = {
 "stufe": "starter",
 "assets": [
  {
   "id": "hg-cover-papier-roentgen",
   "name": "Cover: Papier/Röntgen-Diagonale",
   "was": "Ur-Layout: Hauptobjekt halb auf Papier, halb geröntgt (diagonaler Scan-Schnitt), Frage oben, Pointe unten. Datensatz je Video in FOLGEN.",
   "kategorie": "Cover-Raster",
   "stufe": "starter",
   "tags": [
    "cover",
    "thumbnail",
    "röntgen"
   ],
   "import": "import { Thumb } from \"../../bausteine/hintergedanke/Thumbs\";\nimport { FOLGEN } from \"../../bausteine/hintergedanke/Thumbs\";",
   "vorschau": "bausteine/vorschau/hg-cover-papier-roentgen.png"
  },
  {
   "id": "hg-cover-bold-hell",
   "name": "Cover: Bold hell",
   "was": "EIN Riesen-Wort + Objekt (halb geröntgt) + roter Stempel, max. 3–4 Wörter, Auflösung bleibt zu. Vorlage Thumbs28–33.",
   "kategorie": "Cover-Raster",
   "stufe": "starter",
   "tags": [
    "cover",
    "thumbnail",
    "bold"
   ],
   "import": "import { T33 } from \"../../bausteine/hintergedanke/Thumbs33\";",
   "vorschau": "bausteine/vorschau/hg-cover-bold-hell.png"
  },
  {
   "id": "hg-cover-widerspruch",
   "name": "Cover Stil A: Widerspruch",
   "was": "Glaubenssatz riesig im Blocksatz auf Gelb, darunter automatisch der Stempel „DENKST DU.“, Objekt unten. Datengetrieben: Cover f={stil:'A',…}.",
   "kategorie": "Cover-Raster",
   "stufe": "starter",
   "tags": [
    "cover",
    "thumbnail",
    "stil-a"
   ],
   "import": "import { Cover } from \"../../bausteine/hintergedanke/CoverNeu\";\nimport { CoverNachId } from \"../../bausteine/hintergedanke/CoverNeu\";\nimport { FOLGEN_NEU } from \"../../bausteine/hintergedanke/CoverNeu\";",
   "vorschau": "bausteine/vorschau/hg-cover-widerspruch.png"
  },
  {
   "id": "hg-cover-reaktion",
   "name": "Cover Stil B: Reaktion",
   "was": "Frage in 2 Zeilen (Schlüsselwort rot) + DuKopf mit Schock + Rätsel-Objekt mit Kringel und Pfeil. Datengetrieben: Cover f={stil:'B',…}.",
   "kategorie": "Cover-Raster",
   "stufe": "starter",
   "tags": [
    "cover",
    "thumbnail",
    "stil-b"
   ],
   "import": "import { Cover } from \"../../bausteine/hintergedanke/CoverNeu\";\nimport { CoverNachId } from \"../../bausteine/hintergedanke/CoverNeu\";\nimport { FOLGEN_NEU } from \"../../bausteine/hintergedanke/CoverNeu\";",
   "vorschau": "bausteine/vorschau/hg-cover-reaktion.png"
  },
  {
   "id": "hg-cover-roentgen-riss",
   "name": "Cover Stil C: Röntgen-Riss",
   "was": "Frage + Hauptobjekt mit gezacktem Papierriss, innen Glow-Fassung und leuchtendes „?“. Datengetrieben: Cover f={stil:'C',…}.",
   "kategorie": "Cover-Raster",
   "stufe": "starter",
   "tags": [
    "cover",
    "thumbnail",
    "stil-c"
   ],
   "import": "import { Cover } from \"../../bausteine/hintergedanke/CoverNeu\";\nimport { CoverNachId } from \"../../bausteine/hintergedanke/CoverNeu\";\nimport { FOLGEN_NEU } from \"../../bausteine/hintergedanke/CoverNeu\";",
   "vorschau": "bausteine/vorschau/hg-cover-roentgen-riss.png"
  },
  {
   "id": "hg-cover-dunkel-frage",
   "name": "Cover Stil E: dunkle Frage",
   "was": "Fast schwarzer Grund mit farbigem Glühen, Riesenfrage rot·weiß, Objekt mittig, roter Stempel; 3:4-sicher (y 270–1640), verrät nichts. Vorlage für Rätsel-Videos.",
   "kategorie": "Cover-Raster",
   "stufe": "starter",
   "tags": [
    "cover",
    "thumbnail",
    "dunkel",
    "rätsel"
   ],
   "import": "import { T90 } from \"../../bausteine/hintergedanke/Thumbs90\";",
   "vorschau": "bausteine/vorschau/hg-cover-dunkel-frage.png"
  },
  {
   "id": "hg-cover-zwei-karten",
   "name": "Cover flach: zwei Karten",
   "was": "Flach 2D, idiotensicher: Schlagzeile oben, zwei Vergleichskarten nebeneinander (rot vs. grün), Stempel mit schwarzem Rand. Vorlage Thumbs98/100/101.",
   "kategorie": "Cover-Raster",
   "stufe": "starter",
   "tags": [
    "cover",
    "thumbnail",
    "vergleich"
   ],
   "import": "import { T98 } from \"../../bausteine/hintergedanke/Thumbs98\";",
   "vorschau": "bausteine/vorschau/hg-cover-zwei-karten.png"
  },
  {
   "id": "hg-cover-bild-fuellend",
   "name": "Cover flach: Bild füllt alles",
   "was": "Flach 2D: ein Motiv füllt das ganze Bild, kurze Schlagzeile oben, Neugier-Stempel unten, nichts davor. Vorlage Thumbs100s/97/95neu.",
   "kategorie": "Cover-Raster",
   "stufe": "starter",
   "tags": [
    "cover",
    "thumbnail",
    "flach"
   ],
   "import": "import { T100s } from \"../../bausteine/hintergedanke/Thumbs100s\";",
   "vorschau": "bausteine/vorschau/hg-cover-bild-fuellend.png"
  },
  {
   "id": "hg-cover-textblock",
   "name": "Cover-Textblock + Marke",
   "was": "Poster-Blocksatz: jede Zeile auf gleiche Breite gezogen (kurze Zeilen riesig), Tintenschatten; dazu Kanal-Marke oben außerhalb des 3:4-Rasters und Papiergrund.",
   "kategorie": "Cover-Raster",
   "stufe": "starter",
   "tags": [
    "cover",
    "text",
    "schrift"
   ],
   "import": "import { Block } from \"../../bausteine/hintergedanke/CoverNeu\";\nimport { blockLayout } from \"../../bausteine/hintergedanke/CoverNeu\";\nimport { Marke } from \"../../bausteine/hintergedanke/CoverNeu\";\nimport { Grund } from \"../../bausteine/hintergedanke/CoverNeu\";",
   "vorschau": "bausteine/vorschau/hg-cover-textblock.png"
  },
  {
   "id": "hg-cover-stempel",
   "name": "Cover-Stempel (gefüllt)",
   "was": "Roter gefüllter Stempel mit weißer Schrift, Tintenrand und hartem Schatten, schräg. Für Cover-Pointe („DENKST DU.“).",
   "kategorie": "Cover-Raster",
   "stufe": "starter",
   "tags": [
    "cover",
    "stempel"
   ],
   "import": "import { Stempel } from \"../../bausteine/hintergedanke/CoverNeu\";",
   "vorschau": "bausteine/vorschau/hg-cover-stempel.png"
  },
  {
   "id": "hg-cover-pfeil-kringel",
   "name": "Pfeil + Kringel",
   "was": "Handgezeichneter roter Kringel und dicker Bogenpfeil mit Tintenrand (SVG). Zeigt aufs Rätsel-Objekt.",
   "kategorie": "Cover-Raster",
   "stufe": "starter",
   "tags": [
    "cover",
    "pfeil",
    "markierung"
   ],
   "import": "import { Pfeil } from \"../../bausteine/hintergedanke/CoverNeu\";\nimport { Kringel } from \"../../bausteine/hintergedanke/CoverNeu\";",
   "vorschau": "bausteine/vorschau/hg-cover-pfeil-kringel.png"
  },
  {
   "id": "hg-cover-etikett",
   "name": "Etikett mit Schnur",
   "was": "Preisschild/Anhänger mit Loch und Schnur, 1–2 Zeilen (SVG). Für Preise, Zahlen, Namen am Objekt.",
   "kategorie": "Cover-Raster",
   "stufe": "starter",
   "tags": [
    "cover",
    "etikett",
    "preis"
   ],
   "import": "import { Etikett } from \"../../bausteine/hintergedanke/CoverNeu\";",
   "vorschau": "bausteine/vorschau/hg-cover-etikett.png"
  },
  {
   "id": "hg-cover-riss-fenster",
   "name": "Riss-Fenster + Glow-?",
   "was": "Gezackter Papierriss mit Lappen und Sprüngen, innen Röntgen-Navy mit Raster und leuchtendem Fragezeichen. Für „was steckt dahinter“.",
   "kategorie": "Cover-Raster",
   "stufe": "starter",
   "tags": [
    "cover",
    "röntgen",
    "riss"
   ],
   "import": "import { RissFenster } from \"../../bausteine/hintergedanke/CoverNeu\";\nimport { rissPunkte } from \"../../bausteine/hintergedanke/CoverNeu\";\nimport { GlowFrage } from \"../../bausteine/hintergedanke/CoverNeu\";",
   "vorschau": "bausteine/vorschau/hg-cover-riss-fenster.png"
  },
  {
   "id": "hg-cover-logo-karte",
   "name": "Logo-Karte",
   "was": "Weiße Karte mit Tintenrand und hartem Schatten, leicht schräg, für ein eigenes Logo.",
   "kategorie": "Cover-Raster",
   "stufe": "starter",
   "tags": [
    "cover",
    "logo",
    "karte"
   ],
   "import": "import { LogoKarte } from \"../../bausteine/hintergedanke/CoverNeu\";",
   "vorschau": "bausteine/vorschau/hg-cover-logo-karte.png"
  },
  {
   "id": "hg-fig-gestalt",
   "name": "FigGestalt",
   "was": "Kapuzenfigur, Gesicht im Schatten, leuchtende Augen, links rot/rechts blau angestrahlt; greift, blickt, atmet. Für Rätsel- und Entscheidungs-Videos; sparsam einsetzen, dann wirkt sie.",
   "kategorie": "Figuren",
   "stufe": "starter",
   "tags": [
    "figur",
    "person",
    "rätsel"
   ],
   "import": "import { FigGestalt } from \"../../bausteine/hintergedanke/Figuren91\";",
   "vorschau": "bausteine/vorschau/hg-fig-gestalt.mp4"
  },
  {
   "id": "hg-fig-denker",
   "name": "FigDenker",
   "was": "Die Gestalt mit Denk-Pose: rechte Hand wandert ans Kinn (kinn 0..1). Für „überleg mal“-Momente.",
   "kategorie": "Figuren",
   "stufe": "starter",
   "tags": [
    "figur",
    "person",
    "denken"
   ],
   "import": "import { FigDenker } from \"../../bausteine/hintergedanke/Figur92\";",
   "vorschau": "bausteine/vorschau/hg-fig-denker.mp4"
  },
  {
   "id": "hg-fig-showmaster",
   "name": "FigBeast (Showmaster)",
   "was": "Karikatur eines YouTube-Showmasters (Swoop-Haare, Bart, blauer Hoodie), keine echte Person. Für Challenge-/Gewinnspiel-Szenen.",
   "kategorie": "Figuren",
   "stufe": "starter",
   "tags": [
    "figur",
    "person",
    "host"
   ],
   "import": "import { FigBeast } from \"../../bausteine/hintergedanke/Figuren91\";",
   "vorschau": "bausteine/vorschau/hg-fig-showmaster.mp4"
  },
  {
   "id": "hg-fig-spielleiter",
   "name": "FigHost (Spielleiter)",
   "was": "Anzug, rote Fliege, Mikro, eine Braue hoch. Für Quiz- und Gameshow-Szenen.",
   "kategorie": "Figuren",
   "stufe": "starter",
   "tags": [
    "figur",
    "person",
    "host"
   ],
   "import": "import { FigHost } from \"../../bausteine/hintergedanke/Figuren91\";",
   "vorschau": "bausteine/vorschau/hg-fig-spielleiter.mp4"
  },
  {
   "id": "hg-du-kopf",
   "name": "DuKopf",
   "was": "Runder Strichfigur-Kopf mit starker Emotion (schock, zweifel, staunen), Pupillen folgen blick, optional Schweiß und Körper. Zuschauer-Stellvertreter auf Covern und in Szenen (SVG).",
   "kategorie": "Figuren",
   "stufe": "starter",
   "tags": [
    "figur",
    "reaktion",
    "cover",
    "emotion"
   ],
   "import": "import { DuKopf } from \"../../bausteine/hintergedanke/CoverNeu\";",
   "vorschau": "bausteine/vorschau/hg-du-kopf.mp4"
  },
  {
   "id": "hg-buehne",
   "name": "Papierbühne + Kopfzeile",
   "was": "Hintergrund jedes Videos: warmes Papier mit 108-px-Raster und Lichtfleck, Kopfzeile KANAL · FALL. Basis für Erklär-Shorts im Papier-&-Tinte-Look.",
   "kategorie": "Untertitel & Zähler",
   "stufe": "starter",
   "tags": [
    "bühne",
    "hintergrund",
    "kopfzeile"
   ],
   "import": "import { Stage } from \"../../basis/lib\";\nimport { Header } from \"../../basis/lib\";",
   "vorschau": "bausteine/vorschau/hg-buehne.mp4"
  },
  {
   "id": "hg-roentgen-wechsel",
   "name": "Röntgen-Wechsel",
   "was": "Scan-Balken läuft durchs Bild, Bühne kippt von Papier in Röntgen-Navy (xray-Kurve) und zurück; dunkle Karten leuchten. Für den Moment „wir schauen dahinter“.",
   "kategorie": "Untertitel & Zähler",
   "stufe": "starter",
   "tags": [
    "röntgen",
    "übergang",
    "scan"
   ],
   "import": "import { Stage } from \"../../basis/lib\";\nimport { ScanBar } from \"../../basis/lib\";\nimport { xray } from \"../../basis/lib\";\nimport { SourceCard } from \"../../basis/lib\";",
   "vorschau": "bausteine/vorschau/hg-roentgen-wechsel.mp4"
  },
  {
   "id": "hg-untertitel",
   "name": "Untertitel-Pillen",
   "was": "Wort-genaue Untertitel: 2–4 Wörter je schwarzer Pille, gesprochenes Wort wird weiß. Braucht Wortzeiten aus werkzeug/vertonen.py (woerter.json) + makeChunks.",
   "kategorie": "Untertitel & Zähler",
   "stufe": "starter",
   "tags": [
    "untertitel",
    "text",
    "captions"
   ],
   "import": "import { Captions } from \"../../basis/lib\";\nimport { makeChunks } from \"../../basis/lib\";\nimport { at } from \"../../basis/lib\";",
   "vorschau": "bausteine/vorschau/hg-untertitel.mp4"
  },
  {
   "id": "hg-quellenkarte",
   "name": "Quellenkarte",
   "was": "Papierkarte mit Mono-Quellzeile und fetter Aussage, federt herein (hell oder dark). Für Belege: Studie, Urteil, Zitat mit Quelle.",
   "kategorie": "Untertitel & Zähler",
   "stufe": "starter",
   "tags": [
    "karte",
    "quelle",
    "beleg"
   ],
   "import": "import { SourceCard } from \"../../basis/lib\";\nimport { Card } from \"../../basis/lib\";",
   "vorschau": "bausteine/vorschau/hg-quellenkarte.mp4"
  },
  {
   "id": "hg-chips",
   "name": "Chips",
   "was": "Mono-Etiketten in Versalien (Tinte, Rot, Gelb, Röntgen-Glow), poppen herein. Für Schlagworte, Kapitel, Hinweise.",
   "kategorie": "Untertitel & Zähler",
   "stufe": "starter",
   "tags": [
    "chip",
    "label",
    "text"
   ],
   "import": "import { Chip } from \"../../basis/lib\";\nimport { pop } from \"../../basis/lib\";",
   "vorschau": "bausteine/vorschau/hg-chips.mp4"
  },
  {
   "id": "hg-zaehler",
   "name": "Zähler + Textmarker",
   "was": "Große Zahl zählt hoch (countUp, deutsches Format), gelber Marker zieht darunter durch, in Papierkarten mit hartem Schatten. Für Werbeversprechen und Kennzahlen.",
   "kategorie": "Untertitel & Zähler",
   "stufe": "starter",
   "tags": [
    "zahl",
    "zähler",
    "karte"
   ],
   "import": "import { countUp } from \"../../basis/lib\";\nimport { de } from \"../../basis/lib\";\nimport { Card } from \"../../basis/lib\";\nimport { ease } from \"../../basis/lib\";",
   "vorschau": "bausteine/vorschau/hg-zaehler.mp4"
  },
  {
   "id": "hg-balken",
   "name": "Balken",
   "was": "Runde Fortschrittsbalken füllen sich auf einen Wert (hell und Röntgen-Fassung), Prozent zählt mit. Für Anteile und Vergleiche.",
   "kategorie": "Untertitel & Zähler",
   "stufe": "starter",
   "tags": [
    "chart",
    "balken",
    "vergleich"
   ],
   "import": "import { Bar } from \"../../basis/lib\";\nimport { countUp } from \"../../basis/lib\";",
   "vorschau": "bausteine/vorschau/hg-balken.mp4"
  },
  {
   "id": "hg-stempel",
   "name": "Stempel DURCHSCHAUT",
   "was": "Roter Gummistempel knallt schräg auf (Überschwung, Maske für Stempelstruktur). Pointe am Ende des Röntgens; Text frei wählbar.",
   "kategorie": "Untertitel & Zähler",
   "stufe": "starter",
   "tags": [
    "stempel",
    "pointe"
   ],
   "import": "import { Stamp } from \"../../basis/lib\";",
   "vorschau": "bausteine/vorschau/hg-stempel.mp4"
  },
  {
   "id": "hg-endkarte",
   "name": "End-Karte",
   "was": "Wortmarke Kanal + Claim + Chip „Folg für mehr →“, federt herein. Schluss jedes Videos.",
   "kategorie": "Untertitel & Zähler",
   "stufe": "starter",
   "tags": [
    "endkarte",
    "outro",
    "cta"
   ],
   "import": "import { EndCard } from \"../../basis/lib\";",
   "vorschau": "bausteine/vorschau/hg-endkarte.mp4"
  },
  {
   "id": "hg-nachspann",
   "name": "Nachspann mit Kommentarfrage",
   "was": "Kommentar-Frage baut sich Wort für Wort auf, dazu „Schreib’s in die Kommentare“ und eine Tipp-Blase. Verlängert Videos über 61,5 s (endeLang) ohne neuen Sprechtext.",
   "kategorie": "Untertitel & Zähler",
   "stufe": "starter",
   "tags": [
    "outro",
    "kommentar",
    "cta"
   ],
   "import": "import { Nachspann } from \"../../bausteine/hintergedanke/nachspann\";\nimport { endeLang } from \"../../bausteine/hintergedanke/nachspann\";",
   "vorschau": "bausteine/vorschau/hg-nachspann.mp4"
  },
  {
   "id": "bib-mitmach-umfrage",
   "name": "Umfrage mit Prozentbalken",
   "was": "Umfrage mit zwei Optionen: Balken wachsen gegen die Prozentzahlen, die Zahlen zählen hoch, die vorn liegende Option leuchtet in Akzentfarbe. Props: text (Frage), optA, optB, prozentA (Beispielwert, B = Rest).",
   "kategorie": "Mitmach",
   "stufe": "starter",
   "tags": [
    "umfrage",
    "balken",
    "abstimmen"
   ],
   "import": "import { MitmachUmfrage } from \"../../bausteine/bibliothek/mitmach/fragen\";",
   "vorschau": "bausteine/vorschau/bib-mitmach-umfrage.mp4"
  },
  {
   "id": "bib-mitmach-quiz",
   "name": "Quiz mit drei Antworten",
   "was": "Quiz mit drei Antworten: eine Markierung wandert über die Antworten, dann leuchtet die richtige grün mit Haken auf, die anderen werden blass. Props: text (Frage), antworten (3 Stück), richtig (Index 0–2), aufloesung (s).",
   "kategorie": "Mitmach",
   "stufe": "starter",
   "tags": [
    "quiz",
    "antworten",
    "raten"
   ],
   "import": "import { MitmachQuiz } from \"../../bausteine/bibliothek/mitmach/fragen\";",
   "vorschau": "bausteine/vorschau/bib-mitmach-quiz.mp4"
  },
  {
   "id": "bib-mitmach-kommentar",
   "name": "Kommentier-Aufforderung",
   "was": "Kommentier-Aufforderung: Text, ein Stichwort tippt sich in ein Eingabefeld, der Senden-Knopf wird gedrückt und eine Kommentar-Blase poppt heraus. Props: text, stichwort.",
   "kategorie": "Mitmach",
   "stufe": "starter",
   "tags": [
    "kommentar",
    "stichwort",
    "cta"
   ],
   "import": "import { MitmachKommentar } from \"../../bausteine/bibliothek/mitmach/fragen\";",
   "vorschau": "bausteine/vorschau/bib-mitmach-kommentar.mp4"
  },
  {
   "id": "bib-mitmach-rate-countdown",
   "name": "Rate-Countdown 3-2-1",
   "was": "Rate-Countdown: Stoppuhr mit laufendem Zeiger, die Zahlen 3-2-1 knallen hinein, am Ende wackelt „Zeit um!“. Props: text (Aufruf), von, takt (s je Zahl), ende.",
   "kategorie": "Mitmach",
   "stufe": "starter",
   "tags": [
    "countdown",
    "raten",
    "stoppuhr"
   ],
   "import": "import { MitmachRateCountdown } from \"../../bausteine/bibliothek/mitmach/fragen\";",
   "vorschau": "bausteine/vorschau/bib-mitmach-rate-countdown.mp4"
  },
  {
   "id": "bib-mitmach-waehle-ab",
   "name": "Wähle A oder B (zwei Türen)",
   "was": "Wähle A oder B: zwei Türen poppen herein und klopfen, am Ende schwingt eine auf und gibt ein leuchtendes Fragezeichen frei. Props: text, textA, textB, oeffne (\"A\", \"B\" oder \"\" für keine).",
   "kategorie": "Mitmach",
   "stufe": "starter",
   "tags": [
    "auswahl",
    "türen",
    "vergleich"
   ],
   "import": "import { MitmachWaehleAB } from \"../../bausteine/bibliothek/mitmach/fragen\";",
   "vorschau": "bausteine/vorschau/bib-mitmach-waehle-ab.mp4"
  },
  {
   "id": "bib-mitmach-speichern",
   "name": "Speichern-Hinweis",
   "was": "Speichern-Hinweis: großes Lesezeichen fällt von oben, federt, füllt sich mit Akzentfarbe, Funken sprühen, Text erscheint. Props: text, text2.",
   "kategorie": "Mitmach",
   "stufe": "starter",
   "tags": [
    "cta",
    "speichern",
    "lesezeichen"
   ],
   "import": "import { MitmachSpeichern } from \"../../bausteine/bibliothek/mitmach/aufrufe\";",
   "vorschau": "bausteine/vorschau/bib-mitmach-speichern.mp4"
  },
  {
   "id": "bib-mitmach-teilen",
   "name": "Teilen-Hinweis",
   "was": "Teilen-Hinweis: ein Papierflieger fliegt im Bogen von einem Absender-Kreis zu einem Empfänger-Kreis, gestrichelte Spur zeichnet sich, Haken beim Empfänger. Props: text, text2.",
   "kategorie": "Mitmach",
   "stufe": "starter",
   "tags": [
    "cta",
    "teilen",
    "papierflieger"
   ],
   "import": "import { MitmachTeilen } from \"../../bausteine/bibliothek/mitmach/aufrufe\";",
   "vorschau": "bausteine/vorschau/bib-mitmach-teilen.mp4"
  },
  {
   "id": "bib-mitmach-folgen",
   "name": "Folgen-Knopf mit tippender Hand",
   "was": "Folgen-Knopf mit tippender Hand: Knopf federt herein, eine gezeichnete Hand tippt (Knopf drückt sich ein), er wechselt auf „Gefolgt“ mit Haken, Ringe und Funken. Props: text, text2 (nach dem Tippen), tippen (s).",
   "kategorie": "Mitmach",
   "stufe": "starter",
   "tags": [
    "cta",
    "folgen",
    "hand"
   ],
   "import": "import { MitmachFolgen } from \"../../bausteine/bibliothek/mitmach/aufrufe\";",
   "vorschau": "bausteine/vorschau/bib-mitmach-folgen.mp4"
  },
  {
   "id": "bib-mitmach-stopp-rate",
   "name": "Stopp – rate mal!",
   "was": "„Stopp – rate mal!“-Pause: rotes Stoppschild schlägt mit Wackeln ein, danach springt der Ratetext herein, Pause-Zeichen blinkt. Props: text, text2.",
   "kategorie": "Mitmach",
   "stufe": "starter",
   "tags": [
    "pause",
    "raten",
    "stoppschild"
   ],
   "import": "import { MitmachStoppRate } from \"../../bausteine/bibliothek/mitmach/fragen\";",
   "vorschau": "bausteine/vorschau/bib-mitmach-stopp-rate.mp4"
  },
  {
   "id": "bib-mitmach-schaetz",
   "name": "Schätz-Schieberegler",
   "was": "Schätz-Schieberegler: Griff wandert suchend über die Skala, dann fällt ein Zielpunkt mit Flagge auf den echten Wert. Props: text, min, max, wert (Beispielwert), einheit.",
   "kategorie": "Mitmach",
   "stufe": "starter",
   "tags": [
    "schätzen",
    "regler",
    "auflösung"
   ],
   "import": "import { MitmachSchaetz } from \"../../bausteine/bibliothek/mitmach/fragen\";",
   "vorschau": "bausteine/vorschau/bib-mitmach-schaetz.mp4"
  },
  {
   "id": "bib-mitmach-wahr-falsch",
   "name": "Wahr/Falsch-Karte",
   "was": "Wahr-oder-falsch-Karte: Behauptung mit zwei Knöpfen, dann dreht sich die Karte (3D) und zeigt das Urteil mit Erklärung. Props: text (Behauptung), text2 (Erklärung), wahr (Urteil), drehen (s).",
   "kategorie": "Mitmach",
   "stufe": "starter",
   "tags": [
    "karte",
    "wahr-falsch",
    "umdrehen"
   ],
   "import": "import { MitmachWahrFalsch } from \"../../bausteine/bibliothek/mitmach/fragen\";",
   "vorschau": "bausteine/vorschau/bib-mitmach-wahr-falsch.mp4"
  },
  {
   "id": "bib-mitmach-bewertung",
   "name": "Bewertungsregler 1–10",
   "was": "Bewertungsregler 1–10: zehn Punkte leuchten nacheinander von Rot über Gelb zu Grün bis zum Wert, große Zahl hüpft mit. Props: text, wert (1–10, Beispiel).",
   "kategorie": "Mitmach",
   "stufe": "starter",
   "tags": [
    "bewertung",
    "skala",
    "punkte"
   ],
   "import": "import { MitmachBewertung } from \"../../bausteine/bibliothek/mitmach/fragen\";",
   "vorschau": "bausteine/vorschau/bib-mitmach-bewertung.mp4"
  },
  {
   "id": "bib-mitmach-teil2",
   "name": "Teil-2-Ankündigung",
   "was": "„Teil 2 kommt“-Ankündigung: große Ziffer klappt auf (3D), Ankündigungstext rutscht heran, ein Ladebalken füllt sich, Pfeile laufen. Props: text, text2, nummer.",
   "kategorie": "Mitmach",
   "stufe": "starter",
   "tags": [
    "ankündigung",
    "serie",
    "ladebalken"
   ],
   "import": "import { MitmachTeil2 } from \"../../bausteine/bibliothek/mitmach/aufrufe\";",
   "vorschau": "bausteine/vorschau/bib-mitmach-teil2.mp4"
  },
  {
   "id": "bib-mitmach-community-frage",
   "name": "Community-Fragekarte",
   "was": "Community-Fragekarte: Karte mit Chip „Frage aus der Community“, neutrale Avatare, die Frage tippt sich ein, Antworten-Knopf pulsiert. Props: text (Frage), name (Beispielname).",
   "kategorie": "Mitmach",
   "stufe": "starter",
   "tags": [
    "karte",
    "frage",
    "community"
   ],
   "import": "import { MitmachCommunityFrage } from \"../../bausteine/bibliothek/mitmach/aufrufe\";",
   "vorschau": "bausteine/vorschau/bib-mitmach-community-frage.mp4"
  },
  {
   "id": "bib-mitmach-enthuellung",
   "name": "Ergebnis-Enthüllung",
   "was": "Ergebnis-Enthüllung: zwei Vorhänge zittern, öffnen sich, dahinter springt das Ergebnis in den Scheinwerfer. Props: text (Überschrift), text2 (Ergebnis, Beispiel), oeffnen (s).",
   "kategorie": "Mitmach",
   "stufe": "starter",
   "tags": [
    "ergebnis",
    "vorhang",
    "auflösung"
   ],
   "import": "import { MitmachEnthuellung } from \"../../bausteine/bibliothek/mitmach/aufrufe\";",
   "vorschau": "bausteine/vorschau/bib-mitmach-enthuellung.mp4"
  },
  {
   "id": "hg-like-teilen",
   "name": "Like & Teilen",
   "was": "Herz zeichnet sich, Finger tippt, Herz füllt sich wie Flüssigkeit, +1; dann Papierflieger fliegt in eine Chat-Karte („Gesendet ✓“). Call-to-Action am Schluss.",
   "kategorie": "Mitmach",
   "stufe": "starter",
   "tags": [
    "cta",
    "like",
    "teilen",
    "interaktion"
   ],
   "import": "import { LikeTeilen } from \"../../bausteine/hintergedanke/bausteine/LikeTeilen\";",
   "vorschau": "bausteine/vorschau/hg-like-teilen.mp4"
  },
  {
   "id": "hg-folgen-karte",
   "name": "Folgen-Karte",
   "was": "Profilkarte federt herein, Story-Ring zeichnet sich, Finger tippt „Folgen“ → „Gefolgt ✓“, Konfetti, Follower +1, Karte federt raus. Szene läuft darunter weiter.",
   "kategorie": "Mitmach",
   "stufe": "starter",
   "tags": [
    "cta",
    "folgen",
    "interaktion"
   ],
   "import": "import { FolgenKarte } from \"../../bausteine/hintergedanke/bausteine/FolgenKarte\";",
   "vorschau": "bausteine/vorschau/hg-folgen-karte.mp4"
  },
  {
   "id": "hg-tipp-finger",
   "name": "Tipp-Finger + Funken",
   "was": "Gezeichneter Zeigefinger federt heran und tippt (Squash am Ziel), Funkenring fliegt weg. Für jeden Knopfdruck/Tap in Erklärszenen.",
   "kategorie": "Mitmach",
   "stufe": "starter",
   "tags": [
    "finger",
    "tap",
    "interaktion"
   ],
   "import": "import { Finger } from \"../../bausteine/hintergedanke/bausteine/teile\";\nimport { Funken } from \"../../bausteine/hintergedanke/bausteine/teile\";\nimport { squash } from \"../../bausteine/hintergedanke/bausteine/teile\";\nimport { feder } from \"../../bausteine/hintergedanke/bausteine/teile\";",
   "vorschau": "bausteine/vorschau/hg-tipp-finger.mp4"
  },
  {
   "id": "bib-hintergruende-papier",
   "name": "Papier mit Raster",
   "was": "Papier mit feinem Raster (Kanal-Bühne), Raster driftet leise, Licht atmet. Props: farbe, farbe2 (Rasterfarbe), dichte (Rasterweite px, 108).",
   "kategorie": "Hintergründe & Bühnen",
   "stufe": "starter",
   "tags": [
    "hintergrund",
    "bibliothek"
   ],
   "import": "import { HgPapier } from \"../../bausteine/bibliothek/hintergruende/papiere\";",
   "vorschau": "bausteine/vorschau/bib-hintergruende-papier.mp4"
  },
  {
   "id": "bib-hintergruende-karo",
   "name": "Karopapier",
   "was": "Karopapier (Rechenkästchen) mit kräftigeren Linien alle fünf Kästchen, Blatt schwebt leicht. Props: farbe (Papier), farbe2 (Linienfarbe), dichte (Kästchen px, 54).",
   "kategorie": "Hintergründe & Bühnen",
   "stufe": "starter",
   "tags": [
    "hintergrund",
    "bibliothek"
   ],
   "import": "import { HgKaro } from \"../../bausteine/bibliothek/hintergruende/papiere\";",
   "vorschau": "bausteine/vorschau/bib-hintergruende-karo.mp4"
  },
  {
   "id": "bib-hintergruende-liniert",
   "name": "Liniertes Notizpapier",
   "was": "Liniertes Notizpapier mit rotem Rand, Lochung und leicht schwebendem Blatt. Props: farbe (Papier), farbe2 (Linien), dichte (Zeilenabstand px, 84).",
   "kategorie": "Hintergründe & Bühnen",
   "stufe": "starter",
   "tags": [
    "hintergrund",
    "bibliothek"
   ],
   "import": "import { HgLiniert } from \"../../bausteine/bibliothek/hintergruende/papiere\";",
   "vorschau": "bausteine/vorschau/bib-hintergruende-liniert.mp4"
  },
  {
   "id": "bib-hintergruende-punktraster",
   "name": "Punktraster",
   "was": "Punktraster-Papier, durch das eine ruhige Welle läuft (Punkte pulsieren). Props: farbe (Papier), farbe2 (Punkte), dichte (Abstand px, 72).",
   "kategorie": "Hintergründe & Bühnen",
   "stufe": "starter",
   "tags": [
    "hintergrund",
    "bibliothek"
   ],
   "import": "import { HgPunktraster } from \"../../bausteine/bibliothek/hintergruende/papiere\";",
   "vorschau": "bausteine/vorschau/bib-hintergruende-punktraster.mp4"
  },
  {
   "id": "bib-hintergruende-blaupause",
   "name": "Blaupause",
   "was": "Blaupause: dunkles Blau mit feinem und grobem Leuchtraster, wanderndem Scanband und Eckmarken. Props: farbe (Grund außen), farbe2 (Mitte), dichte (feines Raster px, 36).",
   "kategorie": "Hintergründe & Bühnen",
   "stufe": "starter",
   "tags": [
    "hintergrund",
    "bibliothek",
    "dunkel"
   ],
   "import": "import { HgBlaupause } from \"../../bausteine/bibliothek/hintergruende/papiere\";",
   "vorschau": "bausteine/vorschau/bib-hintergruende-blaupause.mp4"
  },
  {
   "id": "bib-hintergruende-verlauf",
   "name": "Atmender Verlauf",
   "was": "Weicher Farbverlauf, dessen Lichtflecken langsam wandern und atmen. Props: farbe (oben), farbe2 (unten), dichte (Stärke des Akzentflecks 0..1, 0.25).",
   "kategorie": "Hintergründe & Bühnen",
   "stufe": "starter",
   "tags": [
    "hintergrund",
    "bibliothek"
   ],
   "import": "import { HgVerlauf } from \"../../bausteine/bibliothek/hintergruende/buehnen\";",
   "vorschau": "bausteine/vorschau/bib-hintergruende-verlauf.mp4"
  },
  {
   "id": "bib-hintergruende-spotlight",
   "name": "Spotlight-Bühne",
   "was": "Spotlight-Bühne: dunkler Raum, Lichtkegel von oben mit Staubkörnern, Lichtpool auf dem Boden. Props: farbe (Lichtfarbe), farbe2 (Raum), dichte (Staubkörner, 36).",
   "kategorie": "Hintergründe & Bühnen",
   "stufe": "starter",
   "tags": [
    "hintergrund",
    "bibliothek",
    "dunkel"
   ],
   "import": "import { HgSpotlight } from \"../../bausteine/bibliothek/hintergruende/buehnen\";",
   "vorschau": "bausteine/vorschau/bib-hintergruende-spotlight.mp4"
  },
  {
   "id": "bib-hintergruende-vignette",
   "name": "Vignette (Overlay)",
   "was": "Vignette als Overlay (transparent in der Mitte, dunkle Ränder), atmet leicht. Props: farbe (Randfarbe), dichte (Stärke 0..1, 0.45).",
   "kategorie": "Hintergründe & Bühnen",
   "stufe": "starter",
   "tags": [
    "hintergrund",
    "bibliothek",
    "overlay"
   ],
   "import": "import { HgVignette } from \"../../bausteine/bibliothek/hintergruende/buehnen\";",
   "vorschau": "bausteine/vorschau/bib-hintergruende-vignette.mp4"
  },
  {
   "id": "bib-hintergruende-filmkorn",
   "name": "Filmkorn (Overlay)",
   "was": "Filmkorn als Overlay (deterministisches Rauschen, wechselt 12-mal pro Sekunde). Props: dichte (Stärke 0..1, 0.28).",
   "kategorie": "Hintergründe & Bühnen",
   "stufe": "starter",
   "tags": [
    "hintergrund",
    "bibliothek",
    "overlay"
   ],
   "import": "import { HgFilmkorn } from \"../../bausteine/bibliothek/hintergruende/buehnen\";",
   "vorschau": "bausteine/vorschau/bib-hintergruende-filmkorn.mp4"
  },
  {
   "id": "bib-hintergruende-streifen",
   "name": "Wandernde Diagonalstreifen",
   "was": "Wandernde Diagonalstreifen in zwei Farben, laufen endlos. Props: farbe, farbe2, dichte (Streifenbreite px, 70).",
   "kategorie": "Hintergründe & Bühnen",
   "stufe": "starter",
   "tags": [
    "hintergrund",
    "bibliothek"
   ],
   "import": "import { HgStreifen } from \"../../bausteine/bibliothek/hintergruende/buehnen\";",
   "vorschau": "bausteine/vorschau/bib-hintergruende-streifen.mp4"
  },
  {
   "id": "bib-hintergruende-himmel",
   "name": "Himmel mit Wolken",
   "was": "Tageshimmel mit ziehenden Wolken in zwei Ebenen und Sonnenglanz. Props: farbe (Himmel oben), farbe2 (Horizont), dichte (Wolkenzahl, 8).",
   "kategorie": "Hintergründe & Bühnen",
   "stufe": "starter",
   "tags": [
    "hintergrund",
    "bibliothek"
   ],
   "import": "import { HgHimmel } from \"../../bausteine/bibliothek/hintergruende/welten\";",
   "vorschau": "bausteine/vorschau/bib-hintergruende-himmel.mp4"
  },
  {
   "id": "bib-hintergruende-nachthimmel",
   "name": "Nachthimmel mit Sternen",
   "was": "Nachthimmel mit funkelnden Sternen, Mond mit Schimmer und seltener Sternschnuppe. Props: farbe (oben), farbe2 (Horizont), dichte (Sterne, 90).",
   "kategorie": "Hintergründe & Bühnen",
   "stufe": "starter",
   "tags": [
    "hintergrund",
    "bibliothek",
    "dunkel"
   ],
   "import": "import { HgNachthimmel } from \"../../bausteine/bibliothek/hintergruende/welten\";",
   "vorschau": "bausteine/vorschau/bib-hintergruende-nachthimmel.mp4"
  },
  {
   "id": "bib-hintergruende-kreidetafel",
   "name": "Kreidetafel",
   "was": "Kreidetafel mit Holzrahmen, Kreidestaub, verwischten Wischspuren und einer Kreidelinie, die sich immer wieder zeichnet. Props: farbe (Tafelgrün), dichte (Staubwolken, 14).",
   "kategorie": "Hintergründe & Bühnen",
   "stufe": "starter",
   "tags": [
    "hintergrund",
    "bibliothek"
   ],
   "import": "import { HgKreidetafel } from \"../../bausteine/bibliothek/hintergruende/welten\";",
   "vorschau": "bausteine/vorschau/bib-hintergruende-kreidetafel.mp4"
  },
  {
   "id": "bib-hintergruende-korkwand",
   "name": "Kork-Pinnwand",
   "was": "Kork-Pinnwand mit Holzrahmen, Korkkörnung und drei leise pendelnden Zetteln an Pinnnadeln. Props: farbe (Kork), farbe2 (Rahmen), dichte (Körnung, 650).",
   "kategorie": "Hintergründe & Bühnen",
   "stufe": "starter",
   "tags": [
    "hintergrund",
    "bibliothek"
   ],
   "import": "import { HgKorkwand } from \"../../bausteine/bibliothek/hintergruende/welten\";",
   "vorschau": "bausteine/vorschau/bib-hintergruende-korkwand.mp4"
  },
  {
   "id": "bib-hintergruende-schreibtisch",
   "name": "Schreibtisch von oben",
   "was": "Schreibtisch von oben: Holzplatte mit Maserung, Notizbuch mit Bleistift, Kaffeetasse mit Dampf, Pflanze und Klebezettel. Props: farbe (Holz), farbe2 (Akzent des Zettels), dichte (Maserlinien, 26).",
   "kategorie": "Hintergründe & Bühnen",
   "stufe": "starter",
   "tags": [
    "hintergrund",
    "bibliothek"
   ],
   "import": "import { HgSchreibtisch } from \"../../bausteine/bibliothek/hintergruende/welten\";",
   "vorschau": "bausteine/vorschau/bib-hintergruende-schreibtisch.mp4"
  }
 ],
 "originale": []
};
