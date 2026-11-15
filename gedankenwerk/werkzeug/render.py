"""Rendert ein Video und bringt den Ton auf −14 LUFS (Plattform-Standard).

Aufruf:  python werkzeug/render.py videos/<ordner>
Ergebnis: videos/<ordner>/video.mp4 (1080 × 1920, H.264, AAC). Dauert je nach Rechner 1–5 Minuten.
"""
from __future__ import annotations

import sys
import time

from gemeinsam import VORLAGE, dauer_von, ffmpeg_ok, konsole_utf8, lade_theme, rel, remotion, synchronisieren, video_ordner


def main() -> None:
    konsole_utf8()
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    if not args:
        raise SystemExit(__doc__)
    ordner = video_ordner(args[0])
    vid = synchronisieren(ordner)
    if not (VORLAGE / "src" / "videos" / vid / "Video.tsx").exists():
        raise SystemExit(f"Für dieses Video gibt es noch keine Animation. Erst: python werkzeug/neu.py {rel(ordner)}")
    lufs = lade_theme()["format"].get("lautheit_lufs", -14)
    roh = ordner / "_roh.mp4"
    start = time.time()
    print(f"Rendere {vid} …", flush=True)
    remotion("render", "src/index.ts", vid, str(roh), "--crf=18", "--log=error")
    if not roh.exists() or roh.stat().st_size == 0:
        raise SystemExit("Der Render hat keine Datei erzeugt. Fehlermeldung oben lesen oder Claude fragen.")
    ziel = ordner / "video.mp4"
    norm = ["-af", f"aformat=channel_layouts=stereo,loudnorm=I={lufs}:TP=-1.5:LRA=11", "-ar", "48000", "-c:a", "aac", "-b:a", "192k",
            "-movflags", "+faststart", str(ziel)]
    an = (lade_theme().get("geraeusche") or {}).get("an", True)
    if an and (ordner / "klaenge.json").exists():  # Geräusche: Stimme + Musikbett + Klänge nach klaenge.json mischen
        from klang import mische
        ton = ordner / "_ton.wav"
        n = mische(ordner, dauer_von(roh), ton)
        print(f"Geräusche gemischt: {n} Klänge", flush=True)
        ffmpeg_ok("-i", str(roh), "-i", str(ton), "-map", "0:v", "-map", "1:a", "-c:v", "copy", *norm)
        ton.unlink(missing_ok=True)
    else:
        ffmpeg_ok("-i", str(roh), "-c:v", "copy", *norm)
    roh.unlink(missing_ok=True)
    print(f"FERTIG {rel(ziel)}: {dauer_von(ziel):.1f} s, {ziel.stat().st_size / 1e6:.1f} MB, Renderzeit {time.time() - start:.0f} s")
    print(f"Weiter: python werkzeug/pruefe.py {rel(ordner)}")


if __name__ == "__main__":
    main()
