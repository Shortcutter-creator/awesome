"""Kürzt zu lange Sprechpausen in voice.wav; die Wortzeiten in woerter.json wandern mit.

Aufruf:  python werkzeug/pausen.py videos/<ordner> [--messen] [--satz=0.38] [--komma=0.22]
  --messen   nur zeigen, was gekürzt würde
Grenzen: nach . ? ! höchstens 0,38 s, nach , : ; höchstens 0,22 s, sonst 0,12 s Pause.
Geschnitten wird nur in wirklich leisen Stellen, mit kurzer Blende. Die vorige Fassung landet in stimme/vor-pausen/.
Nur Standardbibliothek (wave + array), läuft auf Mac und Windows.
"""
from __future__ import annotations

import array
import json
import math
import re
import shutil
import sys
import wave
from pathlib import Path

from gemeinsam import konsole_utf8, rel, video_ordner

MAX_SATZ, MAX_KOMMA, MAX_WORT = 0.38, 0.22, 0.12
BLENDE = 0.012     # s Überblendung an jeder Schnittstelle
STILL_DB = -40     # unter diesem Pegel (10-ms-Rahmen) gilt der Ton als Pause


def grenze(wort: str) -> float:
    if re.search(r"[.?!…]$", wort):
        return MAX_SATZ
    if re.search(r"[,:;–-]$", wort):
        return MAX_KOMMA
    return MAX_WORT


def lies(wav: Path) -> tuple[array.array, int]:
    with wave.open(str(wav), "rb") as w:
        if w.getsampwidth() != 2 or w.getnchannels() != 1:
            raise SystemExit("voice.wav muss 16-bit mono sein. Neu erzeugen: python werkzeug/vertonen.py <ordner>")
        sr = w.getframerate()
        daten = array.array("h")
        daten.frombytes(w.readframes(w.getnframes()))
    if sys.byteorder == "big":
        daten.byteswap()
    return daten, sr


def schreib(wav: Path, daten: array.array, sr: int) -> None:
    aus = array.array("h", daten)
    if sys.byteorder == "big":
        aus.byteswap()
    with wave.open(str(wav), "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(sr)
        w.writeframes(aus.tobytes())


def stillen(daten: array.array, sr: int) -> list[tuple[float, float]]:
    hop = int(0.01 * sr)
    out, cur = [], None
    n = len(daten) // hop
    for k in range(n + 1):
        if k < n:
            seg = daten[k * hop:(k + 1) * hop]
            rms = math.sqrt(sum(x * x for x in seg) / hop) / 32768
            leise = 20 * math.log10(rms + 1e-9) < STILL_DB
        else:
            leise = False
        if leise:
            cur = k if cur is None else cur
        elif cur is not None:
            out.append((cur / 100, k / 100))
            cur = None
    return out


def main() -> None:
    global MAX_SATZ, MAX_KOMMA
    konsole_utf8()
    for a in sys.argv[1:]:
        if a.startswith("--satz="):
            MAX_SATZ = float(a.split("=", 1)[1])
        elif a.startswith("--komma="):
            MAX_KOMMA = float(a.split("=", 1)[1])
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    if not args:
        raise SystemExit(__doc__)
    ordner = video_ordner(args[0])
    wav, jf = ordner / "voice.wav", ordner / "woerter.json"
    if not wav.exists() or not jf.exists():
        raise SystemExit(f"Erst vertonen: python werkzeug/vertonen.py {rel(ordner)}")
    d = json.loads(jf.read_text(encoding="utf-8"))
    ws = d["words"]
    daten, sr = lies(wav)
    laenge = len(daten) / sr

    geschuetzt = [(s["s"], s["s"] + s["dauer"] + 0.3) for s in d.get("stille", [])]
    schnitte = []  # (start, ende, wort davor, wort danach, länge vorher)
    for a, b in stillen(daten, sr):
        if a < 0.2 or b > laenge - 0.2:
            continue  # Anfang und Ende nicht anfassen
        if any(a < g1 and b > g0 for g0, g1 in geschuetzt):
            continue  # gewollte Stille aus [pause …]
        kandidaten = [i for i, w in enumerate(ws[:-1]) if w["s"] < b]
        if not kandidaten:
            continue
        i = min(kandidaten, key=lambda i: abs(ws[i]["e"] - a))
        zuviel = (b - a) - grenze(ws[i]["w"])
        if zuviel < 0.05:
            continue
        mitte = (a + b) / 2
        schnitte.append((mitte - zuviel / 2, mitte + zuviel / 2, ws[i]["w"], ws[i + 1]["w"], b - a))

    weg = sum(b - a for a, b, *_ in schnitte)
    print(f"{ordner.name}: {len(schnitte)} Pausen gekürzt, {weg:.1f} s weniger ({d['dauer']:.1f} → {d['dauer'] - weg:.1f} s)")
    for a, b, w1, w2, l in sorted(schnitte, key=lambda s: s[1] - s[0], reverse=True)[:6]:
        print(f"   {a:6.1f} s  {w1} … {w2}: {l:.2f} → {l - (b - a):.2f} s")
    if "--messen" in sys.argv or not schnitte:
        return

    sicher = ordner / "stimme" / "vor-pausen"
    sicher.mkdir(parents=True, exist_ok=True)
    if not (sicher / "woerter.json").exists():
        shutil.copy2(wav, sicher / "voice.wav")
        shutil.copy2(jf, sicher / "woerter.json")

    bl = int(BLENDE * sr)
    neu, pos = array.array("h"), 0
    for a, b, *_ in schnitte:
        ia, ib = int(a * sr), int(b * sr)
        stueck = daten[pos:ia]
        for k in range(min(bl, len(stueck))):
            if pos > 0:
                stueck[k] = int(stueck[k] * k / bl)
            stueck[-1 - k] = int(stueck[-1 - k] * k / bl)
        neu.extend(stueck)
        pos = ib
    rest = daten[pos:]
    for k in range(min(bl, len(rest))):
        rest[k] = int(rest[k] * k / bl)
    neu.extend(rest)
    schreib(wav, neu, sr)

    def verschiebe(t: float) -> float:
        return round(t - sum(min(b, max(a, t)) - a for a, b, *_ in schnitte), 3)

    for w in ws + d.get("zeilen", []):
        w["s"], w["e"] = verschiebe(w["s"]), verschiebe(w["e"])
    for s in d.get("stille", []):
        s["s"] = verschiebe(s["s"])
    d["dauer"] = round(d["dauer"] - weg, 3)
    d["pausen_gekuerzt"] = round(weg, 2)
    jf.write_text(json.dumps(d, ensure_ascii=False, indent=1), encoding="utf-8")
    print(f"Weiter: python werkzeug/neu.py {rel(ordner)}  (beim ersten Mal) oder werkzeug/render.py")


if __name__ == "__main__":
    main()
