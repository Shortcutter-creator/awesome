"""Probelauf: rendert ein Testbild und ein 5-Sekunden-Video im aktuellen Look (ohne Stimme, kostet nichts).

Aufruf:  python werkzeug/probe.py
Ergebnis: videos/_probe/probe.jpg und videos/_probe/probe.mp4
"""
from __future__ import annotations

import time

from gemeinsam import VIDEOS, ffmpeg_ok, konsole_utf8, rel, remotion


def main() -> None:
    konsole_utf8()
    ziel = VIDEOS / "_probe"
    ziel.mkdir(parents=True, exist_ok=True)
    start = time.time()
    png = ziel / "probe.png"
    remotion("still", "src/index.ts", "Probe", str(png), "--frame=120", "--log=error")
    ffmpeg_ok("-i", str(png), "-q:v", "3", str(ziel / "probe.jpg"))
    png.unlink(missing_ok=True)
    remotion("render", "src/index.ts", "Probe", str(ziel / "probe.mp4"), "--log=error")
    print(f"Probe fertig in {time.time() - start:.0f} s: {rel(ziel / 'probe.jpg')} und {rel(ziel / 'probe.mp4')}")
    print("Bild ansehen: Gefällt der Look? Farben, Schrift und Kanalname kommen aus theme.json.")


if __name__ == "__main__":
    main()
