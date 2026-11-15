"""Mischt die Geräusche eines Videos: Stimme + Musikbett + Klänge aus klaenge/ nach der Liste klaenge.json.

Aufruf:  python werkzeug/klang.py videos/<ordner>            → videos/<ordner>/ton-vorschau.wav zum Anhören
         python werkzeug/klang.py videos/<ordner> --liste    → nur die Zeitleiste zeigen (welcher Klang wann)
render.py ruft das automatisch auf, sobald videos/<ordner>/klaenge.json existiert.

klaenge.json (Beispiel, alle Felder außer „klang“ und Zeit sind freiwillig; "stimme": false = ohne Sprecher):
{
  "bett": {"klang": "musikbett/bett_loop", "lautstaerke": 0.19, "wort": "160"},
  "cues": [
    {"klang": "pro_impact/short", "wort": "160", "pegel": -12},
    {"klang": "mallet/marimba", "wort": "50", "n": 2, "ton": "D4"},
    {"klang": "whoosh_fast/whip", "t": 7.6, "pan": 0.5},
    {"klang": "riser/tension", "wort": "Die", "ausrichtung": "spitze"},
    {"klang": "impact/punch", "wort": "kracht", "laenge": 1.5}
  ]
}
Zeit: „t“ in Sekunden ODER „wort“ (+ „n“ = wievieltes Vorkommen ODER „ab“ = erstes Vorkommen ab dieser Sekunde, wie
at(WD, wort, n) / at(WD, wort, { ab }) im Video-Code; Groß/klein und Satzzeichen egal; „ende“: true = Wortende) + „versatz“ in s.
„ausrichtung“: spitze (Standard: der lauteste Moment liegt auf der Zeit) oder start. „pegel“: Spitze in dBFS
(Standard je Gruppe, nie lauter als −11, damit die Stimme vorne bleibt). „pan“ −1 links … 1 rechts.
„ton“: Notenname (nur stimmbare Klänge, siehe katalog.json „stimmbar“) oder „halbtoene“: +/−Zahl.
„variante“: 1–3 (kurze Klänge haben 3 Varianten; ohne Angabe wechselt das Werkzeug sie selbst ab).
„laenge“: Klang nach so vielen Sekunden ausblenden.
Nur Standardbibliothek + ffmpeg, läuft auf Mac und Windows.
"""
from __future__ import annotations

import json
import math
import re
import sys
from pathlib import Path

from gemeinsam import PAKET, dauer_von, ffmpeg, konsole_utf8, lade_theme, rel, video_ordner

KLAENGE = PAKET / "klaenge"
SR = 48000
DECKEL = -11.0  # dBFS: kein Effekt lauter, Stimme bleibt vorne
STANDARD_PEGEL = {"Whoosh & Wischer": -17, "Riser & Spannung": -21, "Fall & Bass": -18, "Einschlag & Hit": -13,
                  "Pop & Erscheinen": -20, "Klick & Tick": -23, "Tippen & Klopfen": -21, "Tastatur": -24,
                  "Töne & Glocken": -20, "Glanz & Sting": -21, "Zip & Bewegung": -22, "Glitch & Digital": -21,
                  "Kamera": -20}
NOTEN = {"C": 0, "D": 2, "E": 4, "F": 5, "G": 7, "A": 9, "B": 11, "H": 11}


def note_hz(note: str) -> float:
    m = re.fullmatch(r"\s*([A-Ha-h])([#b]?)(-?\d)\s*", str(note))
    if not m:
        raise SystemExit(f"Ton „{note}“ verstehe ich nicht. Beispiele: A4, Eb5, F#3.")
    halb = NOTEN[m.group(1).upper()] + {"#": 1, "b": -1, "": 0}[m.group(2)] + 12 * (int(m.group(3)) + 1)
    return 440.0 * 2 ** ((halb - 69) / 12)


def lade_katalog() -> dict[str, dict]:
    datei = KLAENGE / "katalog.json"
    if not datei.exists():
        raise SystemExit("Die Klang-Bibliothek fehlt (klaenge/katalog.json). Ist das Paket vollständig entpackt?")
    return {k["id"]: k for k in json.loads(datei.read_text(encoding="utf-8"))["klaenge"]}


def norm(s: str) -> str:
    """Wie at() im Video-Code (vorlage/src/basis/lib.tsx): klein, ohne Satzzeichen – „Vier,“ = „vier“."""
    return re.sub(r"[^a-zäöüß0-9]", "", s.lower())


def wortzeit(ws: list[dict], wort: str, n: int = 1, ende: bool = False, ab: float | None = None) -> float:
    """Gleiche Zählung wie at(WD, wort, n) bzw. at(WD, wort, { ab }) im Video-Code: Anker lassen sich 1:1 übernehmen."""
    treffer = [w for w in ws if norm(w["w"]) == norm(wort)]
    w = next((x for x in treffer if x["s"] >= ab), None) if ab is not None else (treffer[n - 1] if len(treffer) >= n else None)
    if w is None:
        wo = f"ab {ab:.2f} s" if ab is not None else f"Nr. {n}"
        raise SystemExit(f"klaenge.json: Wort „{wort}“ ({wo}) kommt im Sprechtext nicht vor ({len(treffer)}× insgesamt). "
                         "Schreibweise wie in woerter.json?")
    return w["e"] if ende else w["s"]


def zeitpunkt(cue: dict, ws: list[dict]) -> float:
    if "t" in cue:
        t = float(cue["t"])
    elif "wort" in cue:
        t = wortzeit(ws, cue["wort"], int(cue.get("n", 1)), bool(cue.get("ende")), float(cue["ab"]) if "ab" in cue else None)
    else:
        raise SystemExit(f"klaenge.json: Cue {cue} braucht „t“ (Sekunden) oder „wort“.")
    return t + float(cue.get("versatz", 0))


def plane(ordner: Path) -> tuple[list[dict], dict | None]:
    """Liest klaenge.json und rechnet jede Cue in Datei, Startzeit, Verstärkung, Tonhöhe und Pan um."""
    kat = lade_katalog()
    plan = json.loads((ordner / "klaenge.json").read_text(encoding="utf-8"))
    ws = json.loads((ordner / "woerter.json").read_text(encoding="utf-8"))["words"]
    gezaehlt: dict[str, int] = {}
    cues = []
    for cue in plan.get("cues", []):
        kid = str(cue.get("klang", "")).removesuffix(".wav")
        if kid not in kat:
            nah = [k for k in kat if kid.split("/")[-1] in k][:5]
            raise SystemExit(f"klaenge.json: Klang „{kid}“ gibt es nicht." + (f" Meintest du: {', '.join(nah)}?" if nah else
                             " Suchen: python werkzeug/suche.py --klaenge <Stichwort>"))
        k = kat[kid]
        var = int(cue.get("variante") or (gezaehlt.get(kid, 0) % k["varianten"] + 1))
        gezaehlt[kid] = gezaehlt.get(kid, 0) + 1
        datei = PAKET / (k["datei"] if var <= 1 else k["datei"].replace(".wav", f"~{min(var, k['varianten'])}.wav"))
        faktor = 1.0
        if "ton" in cue:
            if not k.get("stimmbar") or not k.get("ton_hz"):
                raise SystemExit(f"klaenge.json: „{kid}“ ist nicht stimmbar; „ton“ weglassen oder einen Klang aus „Töne & Glocken“ nehmen.")
            faktor = note_hz(cue["ton"]) / k["ton_hz"]
        elif "halbtoene" in cue:
            faktor = 2 ** (float(cue["halbtoene"]) / 12)
        if not 0.25 <= faktor <= 4:
            raise SystemExit(f"klaenge.json: „{kid}“ um mehr als zwei Oktaven verstimmt – anderen Ton wählen.")
        pegel = min(float(cue.get("pegel", STANDARD_PEGEL.get(k["gruppe"], -20))), DECKEL)
        t = zeitpunkt(cue, ws)
        versatz = (k["spitze_s"] / faktor) if cue.get("ausrichtung", "spitze") == "spitze" else 0.0
        cues.append({"id": kid, "datei": datei, "t": t, "start": t - versatz, "db": pegel - k["spitze_db"], "faktor": faktor,
                     "pan": max(-1.0, min(1.0, float(cue.get("pan", 0)))), "laenge": cue.get("laenge"), "pegel": pegel})
    g = lade_theme().get("geraeusche") or {}
    bett = plan.get("bett", {} if g.get("bett", "musikbett/bett_loop") else None)
    if bett is not None and "lautstaerke" not in bett:
        bett["lautstaerke"] = g.get("bett_lautstaerke", 0.19)
    if bett is not None and "klang" not in bett:
        bett["klang"] = g.get("bett") or "musikbett/bett_loop"
    if bett:
        bid = bett.get("klang", "musikbett/bett_loop")
        if bid not in kat:
            raise SystemExit(f"klaenge.json: Musikbett „{bid}“ gibt es nicht.")
        start = zeitpunkt(bett, ws) if ("t" in bett or "wort" in bett) else ws[0]["s"]
        bett = {"datei": PAKET / kat[bid]["datei"], "start": start, "lautstaerke": float(bett.get("lautstaerke", 0.19))}
    return sorted(cues, key=lambda c: c["t"]), bett


def mische(ordner: Path, laenge: float, aus: Path) -> int:
    """Schreibt Stimme + Bett + Klänge als WAV (32-bit float, 48 kHz stereo). Gibt die Zahl der Cues zurück."""
    cues, bett = plane(ordner)
    stimme = ordner / "voice.wav"
    dateien = sorted({c["datei"] for c in cues}, key=str)
    fehlt = [d for d in dateien if not d.exists()]
    if fehlt:
        raise SystemExit(f"Klang-Datei fehlt: {rel(fehlt[0])}")
    eingaben = ["-i", str(stimme)]
    for d in dateien:
        eingaben += ["-i", str(d)]
    # „stimme“: false in klaenge.json → Video ohne Sprecher (Zeiten bleiben, die Stimme wird stumm gemischt)
    ohne_stimme = json.loads((ordner / "klaenge.json").read_text(encoding="utf-8")).get("stimme", True) is False
    leise = ",volume=0" if ohne_stimme else ""
    teile, namen = [f"[0:a]aformat=sample_fmts=fltp:sample_rates={SR}:channel_layouts=stereo,apad,atrim=0:{laenge:.3f}{leise}[st]"], ["[st]"]
    if bett:
        eingaben += ["-stream_loop", "-1", "-i", str(bett["datei"])]
        bi, dauer = len(dateien) + 1, max(0.5, laenge - bett["start"])
        aus_d = min(2.0, dauer / 3)
        teile.append(f"[{bi}:a]aformat=sample_fmts=fltp:sample_rates={SR}:channel_layouts=stereo,atrim=0:{dauer:.3f},asetpts=PTS-STARTPTS,"
                     f"volume={bett['lautstaerke']:.3f},afade=t=in:d=0.3,afade=t=out:st={dauer - aus_d:.3f}:d={aus_d:.3f},"
                     f"adelay={int(bett['start'] * 1000)}:all=1[bett]")
        namen.append("[bett]")
    nutzung: dict[Path, list[int]] = {}
    for j, c in enumerate(cues):
        nutzung.setdefault(c["datei"], []).append(j)
    quelle: dict[int, str] = {}
    for i, d in enumerate(dateien, 1):
        js = nutzung[d]
        if len(js) == 1:
            quelle[js[0]] = f"[{i}:a]"
        else:
            teile.append(f"[{i}:a]asplit={len(js)}" + "".join(f"[q{j}]" for j in js))
            quelle.update({j: f"[q{j}]" for j in js})
    for j, c in enumerate(cues):
        kette = [f"aformat=sample_fmts=fltp:sample_rates={SR}:channel_layouts=mono"]
        if abs(c["faktor"] - 1) > 1e-3:
            kette += [f"asetrate={SR * c['faktor']:.1f}", f"aresample={SR}"]
        if c["laenge"]:
            L = float(c["laenge"])
            kette += [f"atrim=0:{L:.3f}", f"afade=t=out:st={max(0.0, L - 0.15):.3f}:d=0.15"]
        start, schnitt = c["start"], 0.0
        if start < 0:  # Klang beginnt vor Bild 0: Anfang abschneiden, kurz einblenden
            schnitt, start = -start, 0.0
            kette += [f"atrim=start={schnitt:.3f}", "asetpts=PTS-STARTPTS", "afade=t=in:d=0.03"]
        links, rechts = math.cos((c["pan"] + 1) * math.pi / 4) * math.sqrt(2), math.sin((c["pan"] + 1) * math.pi / 4) * math.sqrt(2)
        kette += [f"volume={c['db']:.2f}dB", f"pan=stereo|c0={links:.3f}*c0|c1={rechts:.3f}*c0", f"adelay={int(round(start * 1000))}:all=1"]
        teile.append(quelle[j] + ",".join(kette) + f"[c{j}]")
        namen.append(f"[c{j}]")
    teile.append("".join(namen) + f"amix=inputs={len(namen)}:normalize=0:dropout_transition=0,atrim=0:{laenge:.3f}[aus]")
    skript = ordner / "_klang-filter.txt"
    skript.write_text(";\n".join(teile), encoding="utf-8")
    try:
        ausgabe = ["-map", "[aus]", "-ar", str(SR), "-c:a", "pcm_f32le", str(aus)]
        res = ffmpeg(*eingaben, "-/filter_complex", str(skript), *ausgabe)
        if res.returncode and ("Unrecognized option" in res.stderr or "Option not found" in res.stderr):
            res = ffmpeg(*eingaben, "-filter_complex_script", str(skript), *ausgabe)  # ffmpeg < 7 kennt -/filter_complex nicht
        if res.returncode:
            raise SystemExit(f"Mischen fehlgeschlagen: {res.stderr.strip()[-700:]}")
    finally:
        skript.unlink(missing_ok=True)
    return len(cues)


def main() -> None:
    konsole_utf8()
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    if not args:
        raise SystemExit(__doc__)
    ordner = video_ordner(args[0])
    if not (ordner / "klaenge.json").exists():
        raise SystemExit(f"Noch keine Klangliste: {rel(ordner / 'klaenge.json')} anlegen (regelbuch/BAUKASTEN.md → Geräusche).")
    if not (ordner / "voice.wav").exists():
        raise SystemExit(f"Erst vertonen: python werkzeug/vertonen.py {rel(ordner)}")
    cues, bett = plane(ordner)
    if "--liste" in sys.argv:
        for c in cues:
            extra = (f" Ton×{c['faktor']:.2f}" if abs(c["faktor"] - 1) > 1e-3 else "") + (f" pan {c['pan']:+.1f}" if c["pan"] else "")
            print(f"{c['t']:6.2f} s  {c['id']:<30} {c['pegel']:5.0f} dBFS{extra}")
        print(f"{len(cues)} Klänge, {len({c['id'] for c in cues})} verschiedene" + (f", Musikbett ab {bett['start']:.2f} s" if bett else ", kein Musikbett"))
        return
    daten = json.loads((ordner / "woerter.json").read_text(encoding="utf-8"))
    laenge = max(dauer_von(ordner / "voice.wav"), float(daten.get("dauer", 0))) + 1.0
    if (ordner / "video.mp4").exists():
        laenge = dauer_von(ordner / "video.mp4")
    aus = ordner / "ton-vorschau.wav"
    n = mische(ordner, laenge, aus)
    print(f"FERTIG {rel(aus)}: {n} Klänge, {len({c['id'] for c in cues})} verschiedene. Anhören; ins Video kommt es mit "
          f"python werkzeug/render.py {rel(ordner)}")


if __name__ == "__main__":
    main()
