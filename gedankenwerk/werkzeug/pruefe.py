"""Qualitätskontrolle eines fertigen Videos: misst, was messbar ist, und legt Prüfbilder zum Ansehen an.

Aufruf:  python werkzeug/pruefe.py videos/<ordner>
Ergebnis: Ausgabe mit OK / PRÜFEN je Punkt + videos/<ordner>/pruefung/
  bogen.jpg       1 Bild pro Sekunde (Kontaktbogen: passiert jede Sekunde etwas?)
  hook.jpg        die ersten 3 Sekunden, 5 Bilder pro Sekunde (ist der Einstieg stark?)
  390/blatt_*.jpg je Satzende ein Bild in Handybreite 390 px (ist alles lesbar?)
  untertitel/     Stellen, an denen die Untertitel-Zeiten nur geschätzt sind (stockt der Untertitel?)
  abnahme.json    alle Messwerte
Die Messwerte ersetzen nicht das Hinsehen: Claude schaut sich die Bilder danach selbst an.
"""
from __future__ import annotations

import json
import re
import sys

from gemeinsam import VORLAGE, dauer_von, ffmpeg, konsole_utf8, lade_theme, rel, video_id, video_ordner
from vertonen import tempo_silben


def szenenwechsel(video) -> list[tuple[float, float]]:
    res = ffmpeg("-i", str(video), "-vf", "scale=270:-2,select='gte(scene,0)',metadata=print:file=-", "-an", "-f", "null", "-", still=False)
    werte, t = [], None
    for zeile in (res.stdout + res.stderr).splitlines():
        if m := re.search(r"pts_time:([\d.]+)", zeile):
            t = float(m.group(1))
        if (m := re.search(r"scene_score=([\d.]+)", zeile)) and t is not None:
            werte.append((t, float(m.group(1))))
    return werte


def main() -> None:
    konsole_utf8()
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    if not args:
        raise SystemExit(__doc__)
    ordner = video_ordner(args[0])
    video = ordner / "video.mp4"
    if not video.exists():
        raise SystemExit(f"Noch kein video.mp4. Erst: python werkzeug/render.py {rel(ordner)}")
    # Veraltetes Video erkennen: Animation oder Aufnahme neuer als video.mp4 (z. B. Render nach einem Fehler abgebrochen)
    quellen = [p for p in (VORLAGE / "src" / "videos" / video_id(ordner)).glob("*.ts*") if p.name != "Cover.tsx"] + [ordner / "woerter.json"]
    neuer = [p for p in quellen if p.exists() and p.stat().st_mtime > video.stat().st_mtime + 1]
    if neuer:
        raise SystemExit(f"video.mp4 ist älter als {', '.join(p.name for p in neuer)} – vermutlich ist der letzte Render "
                         f"gescheitert. Erst neu rendern: python werkzeug/render.py {rel(ordner)}")
    daten = json.loads((ordner / "woerter.json").read_text(encoding="utf-8"))
    ws = daten["words"]
    theme = lade_theme()
    ziel_min, ziel_max = theme["format"].get("laenge_ziel_s", [60, 80])
    lufs_ziel = theme["format"].get("lautheit_lufs", -14)
    out = ordner / "pruefung"
    out.mkdir(exist_ok=True)

    # Prüfbilder
    ffmpeg("-i", str(video), "-vf", "fps=1,scale=216:-1,tile=10x8:padding=3", "-frames:v", "1", str(out / "bogen.jpg"))
    ffmpeg("-i", str(video), "-t", "3.2", "-vf", "fps=5,scale=270:-1,tile=8x2:padding=3", "-frames:v", "1", str(out / "hook.jpg"))
    lese = out / "390"
    lese.mkdir(exist_ok=True)
    for alt in lese.glob("*.jpg"):
        alt.unlink()
    enden = [w["e"] - 0.05 for w in ws if re.search(r"[.?!]$", w["w"])]
    for i, t in enumerate(enden):
        ffmpeg("-ss", f"{t:.2f}", "-i", str(video), "-frames:v", "1", "-vf", "scale=390:-2", str(lese / f"satz_{i + 1:02d}.jpg"))
    blaetter = 0
    for j in range(0, len(enden), 6):  # je 6 Bilder in Originalgröße 390 px (3 × 2), damit nichts weiter schrumpft
        n = min(6, len(enden) - j)
        ein = sum((["-i", str(lese / f"satz_{k + 1:02d}.jpg")] for k in range(j, j + n)), [])
        lay = "|".join(f"{(k % 3) * 390}_{(k // 3) * 694}" for k in range(n))
        filt = f"xstack=inputs={n}:layout={lay}:fill=white" if n > 1 else "null"
        ffmpeg(*ein, "-filter_complex", filt, str(lese / f"blatt_{j // 6 + 1}.jpg"))
        blaetter += 1
    for einzel in lese.glob("satz_*.jpg"):
        einzel.unlink()

    # Messwerte
    dur = dauer_von(video)
    sc = szenenwechsel(video)
    beats, letzte = [], -9.0
    for i in range(1, len(sc) - 1):
        tt, s = sc[i]
        if s > 0.02 and s >= sc[i - 1][1] and s >= sc[i + 1][1] and tt - letzte > 0.25:
            beats.append(tt)
            letzte = tt
    takt_bis = min(dur, ws[-1]["e"] + 2.1)
    beat_rate = len([b for b in beats if b <= takt_bis]) / takt_bis if takt_bis else 0
    ruhe = max(((b - a, a) for a, b in zip([0.0] + beats, beats + [dur])), default=(dur, 0.0))
    ruhe_ok = ruhe[0] <= 4 or ruhe[1] >= ws[-1]["e"] - 1.5
    # gewollte Stille ([pause …]) zählt nicht als Ruhe-Fehler, wenn sie die Ruhe erklärt
    for s in daten.get("stille", []):
        if s["s"] - 0.5 <= ruhe[1] <= s["s"] + s["dauer"]:
            ruhe_ok = True
    lauf = ffmpeg("-i", str(video), "-af", "ebur128", "-f", "null", "-", still=False).stderr
    lufs_werte = re.findall(r"I:\s+(-?[\d.]+) LUFS", lauf)
    lufs = float(lufs_werte[-1]) if lufs_werte else 0.0
    erster = next((w["e"] for w in ws if re.search(r"[.?!]$", w["w"])), ws[-1]["e"]) - ws[0]["s"]
    sps = tempo_silben(ws)
    eleven = (theme.get("stimme") or {}).get("anbieter") == "elevenlabs" or "eleven" in str(daten.get("modell") or "")
    ende = dur - ws[-1]["e"]

    punkte = {
        f"Länge {ziel_min}–{ziel_max} s (Toleranz ±10 s)": (ziel_min - 10 <= dur <= ziel_max + 10, f"{dur:.1f} s"),
        ("Stimme ab Bild 0 (≤ 0,3 s)" if eleven else "Stimme ab Bild 0 (≤ 0,45 s, lokale Stimme)"):
            (ws[0]["s"] <= (0.3 if eleven else 0.45), f"{ws[0]['s']:.2f} s"),
        "Erster Satz ≤ 3,5 s": (erster <= 3.5, f"{erster:.2f} s"),
        ("Sprechtempo 4,0–5,2 Silben/s (Ziel ~4,5)" if eleven else "Sprechtempo 4,3–5,6 Silben/s (Ziel ~5,0, lokale Stimme)"):
            ((4.0 <= sps <= 5.2) if eleven else (4.3 <= sps <= 5.6), f"{sps:.2f} Silben/s"),
        "Bild-Beats ≥ 0,75 pro Sekunde": (beat_rate >= 0.75, f"{beat_rate:.2f}/s"),
        "Längste Ruhe ≤ 4 s": (ruhe_ok, f"{ruhe[0]:.1f} s ab {ruhe[1]:.1f} s"),
        "Schlussbild steht 0,3–8 s nach dem letzten Wort": (0.3 <= ende <= 8.5, f"{ende:.1f} s"),
        f"Lautheit {lufs_ziel} LUFS (±1)": (abs(lufs - lufs_ziel) <= 1, f"{lufs} LUFS"),
    }
    import re as _re
    src = VORLAGE / "src" / "videos" / video_id(ordner)
    reste = [p.name for p in src.glob("*.tsx") if _re.search(r'"HIER|„HIER|HIER\?|text="POINTE"', p.read_text(encoding="utf-8"))]
    if ordner.parent.name == "videos":  # eigene Videos; die mitgelieferten Beispiele haben keinen Szenenplan
        punkte["Szenenplan mit Bausteinen (szenenplan.md)"] = ((ordner / "szenenplan.md").exists(),
                                                           "vorhanden" if (ordner / "szenenplan.md").exists() else "fehlt – Skill video Schritt 5")
    punkte["Keine Platzhalter aus der Vorlage (HIER …)"] = (not reste, ", ".join(reste) if reste else "keine")

    # Harter Schnitt: Satzende ohne hörbare Pause bis zum nächsten Satz (entsteht z. B., wenn Tonstücke von Hand
    # aneinandergehängt werden). Grenze 0,12 s ist eine Werkzeug-Schwelle, pausen.py lässt nach Sätzen bis 0,38 s stehen.
    # Gemessen wird die echte Stille in voice.wav (Wortzeiten allein täuschen: bei ElevenLabs reichen Wortenden oft bis
    # ans nächste Wort, obwohl man eine Pause hört). Harter Schnitt = keine ≥ 0,1 s leise Stelle rund um die Satzgrenze.
    from pausen import lies, stillen
    try:
        _daten, _sr = lies(ordner / "voice.wav")
        leise = [(x, y) for x, y in stillen(_daten, _sr) if y - x >= 0.1]
    except (SystemExit, FileNotFoundError, OSError):
        leise = None
    vorlauf = float(daten.get("vorlauf", 0.0))
    hart = []
    if leise is not None:
        for a, b in zip(ws, ws[1:]):
            if not re.search(r"[.?!…]$", a["w"]):
                continue
            von, bis = a["e"] - 0.3 - vorlauf, b["s"] + 0.15 - vorlauf
            if not any(x < bis and y > von for x, y in leise):
                hart.append(f"{a['e']:.1f} s „{a['w']}“ → „{b['w']}“")
    punkte["Pause nach jedem Satz (kein harter Schnitt)"] = (not hart, "; ".join(hart[:4]) if hart else "überall")

    # Untertitel: Wörter, deren Zeit nur geschätzt ist (Erkennung hat sie nicht gehört). Einzelne (Zahlen) sind normal;
    # ab 3 in Folge stockt der Untertitel sichtbar → Stelle ansehen.
    folgen, lauf_g = [], []
    for w in ws + [{"w": "", "s": 0, "e": 0}]:
        if w.get("g"):
            lauf_g.append(w)
        else:
            if len(lauf_g) >= 3:
                folgen.append(lauf_g)
            lauf_g = []
    gesch = [w for w in ws if w.get("g")]
    gdir = out / "untertitel"
    gdir.mkdir(exist_ok=True)
    for alt in gdir.glob("*.jpg"):
        alt.unlink()
    for k, f in enumerate(folgen[:8]):
        t = (f[0]["s"] + f[-1]["e"]) / 2
        ffmpeg("-ss", f"{t:.2f}", "-i", str(video), "-frames:v", "1", "-vf", "scale=390:-2", str(gdir / f"stelle_{k + 1:02d}_{t:05.1f}s.jpg"))
    punkte["Untertitel-Zeiten erkannt (keine 3+ geschätzten Wörter in Folge)"] = (
        not folgen, (f"{len(folgen)} Stelle(n): " + "; ".join(f"{f[0]['s']:.1f} s „{' '.join(w['w'] for w in f)}“" for f in folgen[:4])
                     + f" → Bilder in {rel(gdir)}") if folgen else f"ok ({len(gesch)} Einzelwörter geschätzt)")

    # Schreibweise: Umlaut-Ersatz (ae/oe/ue statt ä/ö/ü) in sichtbaren Texten der Animation. Nur ein Hinweis zum Hinsehen.
    ausnahmen = re.compile(r"(?i)quel|tuell|nuell|duell|statue|poet|aero|israel|michael|boeing|joe|true|queue|blue|value|zuerst|braess")
    treffer = set()
    for datei in src.glob("*.tsx"):
        # sichtbarer Text: JSX-Text vor einem schließenden Tag oder Zeichenketten mit Leerzeichen/Großbuchstaben (keine ids)
        for m in re.finditer(r'"([^"\n=();]{3,})"|>([^<>{}=;()\n]{3,})</', datei.read_text(encoding="utf-8")):
            t = m.group(1) or m.group(2)
            if "/" in t or t.startswith((".", "#", "rgb", "http")):
                continue
            if m.group(1) and not (" " in t or re.search(r"[A-ZÄÖÜ]", t)):
                continue
            for wort in re.findall(r"[A-Za-zÄÖÜäöüß-]+", t):
                if re.search(r"(?<![aeiouAEIOUqQ])(ae|oe|ue|AE|OE|UE)(?![aeiouAEIOU])", wort) and not ausnahmen.search(wort):
                    treffer.add(wort)
    # Geräusche: Klangliste vorhanden und abwechslungsreich (Schwelle 10 ist eine Werkzeug-Schwelle, BAUKASTEN § 9 nennt 20–50)
    if (theme.get("geraeusche") or {}).get("an", True):
        if (ordner / "klaenge.json").exists():
            from klang import plane
            kl, _ = plane(ordner)
            verschieden = len({k["id"] for k in kl})
            punkte["Geräusche: ≥ 10 verschiedene Klänge"] = (verschieden >= 10, f"{len(kl)} Klänge, {verschieden} verschiedene")
        else:
            punkte["Geräusche: ≥ 10 verschiedene Klänge"] = (False, "keine klaenge.json")
    punkte["Umlaute echt (kein ae/oe/ue-Ersatz)"] = (not treffer, ", ".join(sorted(treffer)[:8]) if treffer else "keine Treffer")
    print(f"Prüfung {ordner.name}\n")
    for k, (ok, v) in punkte.items():
        print(f"{'OK     ' if ok else 'PRÜFEN '} {k}: {v}")
    offen = [k for k, (ok, _) in punkte.items() if not ok]
    print(f"\nPrüfbilder: {rel(out / 'bogen.jpg')}, {rel(out / 'hook.jpg')}, {rel(lese)}/blatt_1…{blaetter}.jpg")
    print("Jetzt ansehen (Checkliste im Skill video, Schritt 6.3): Hook groß und in Bewegung? Abstände gleichmäßig, nichts verdeckt, nichts läuft aus dem Bild? Jede Zeile bei 390 px lesbar? Mitte bei x 540? Bild gefüllt statt leer?")
    if offen:
        print(f"{len(offen)} Punkt(e) zu prüfen. Knapp verfehlt ist ok, wenn das Bild es rechtfertigt – nie mit Flackern oder Takt-Puls nachhelfen.")
        if any(k.startswith(("Bild-Beats", "Längste Ruhe")) for k in offen):
            print("Zu wenig Bewegung: regelbuch/BAUKASTEN.md § 6 lesen. Kurz: etwa jede Sekunde ein großes Ereignis auf ein gesprochenes Wort "
                  "(Karte poppt rein, Zahl springt, Balken wächst über die halbe Breite, Szenenwechsel) und an der genannten Ruhe-Stelle "
                  "ein neues Element auf das nächste Schlüsselwort legen. Danach neu rendern und prüfen.")
        if any(k.startswith("Pause nach jedem Satz") for k in offen):
            print("Harter Schnitt: Nie Tonstücke von Hand zusammensetzen. Das ganze Video neu vertonen (python werkzeug/vertonen.py, "
                  "unveränderte Sätze kommen aus dem Zwischenspeicher) und danach python werkzeug/pausen.py.")
        if any(k.startswith("Untertitel-Zeiten") for k in offen):
            print("Untertitel: Die Bilder unter pruefung/untertitel/ ansehen. Passt das hervorgehobene Wort nicht zum Gesprochenen, "
                  "die Zeile in skript.txt so schreiben, wie sie gesprochen wird (Zahlen als {Anzeige|Sprechform}) und neu vertonen.")
        if any(k.startswith("Geräusche") for k in offen):
            print("Geräusche: regelbuch/BAUKASTEN.md § 9 lesen und videos/<ordner>/klaenge.json schreiben (jedes Bild-Ereignis sein passender "
                  "Klang, suchen mit python werkzeug/suche.py --klaenge <Stichwort>), dann neu rendern.")
        if any(k.startswith("Umlaute echt") for k in offen):
            print("Umlaute: Gefundene Wörter prüfen. Ist es ein Ersatz (z. B. Paeckungen), im Video-Code ä/ö/ü/ß einsetzen. Echte Wörter wie Feuer, Quelle sind ok.")
        if any(k.startswith("Keine Platzhalter") for k in offen):
            print("Platzhalter gefunden: In den genannten Dateien jeden Text mit „HIER“ durch den echten Inhalt ersetzen. Das Video ist so nicht fertig.")
    (out / "abnahme.json").write_text(json.dumps({k: {"ok": ok, "wert": v} for k, (ok, v) in punkte.items()}, ensure_ascii=False, indent=1),
                                      encoding="utf-8")


if __name__ == "__main__":
    main()
