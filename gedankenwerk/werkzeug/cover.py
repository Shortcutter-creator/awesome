"""Rendert das Cover eines Videos und legt Prüfbilder für Feed und Profilraster an.

Aufruf:  python werkzeug/cover.py videos/<ordner>
Ergebnis: videos/<ordner>/cover.jpg (1080 × 1920) und in pruefung/:
  cover_feed.jpg     280 px breit – so klein erscheint es im Feed: Schlagzeile noch lesbar?
  cover_raster.jpg   3:4-Ausschnitt wie im Instagram-Profilraster: alles Wichtige drin?
  cover_zonen.jpg    Cover mit rot markierten Rändern außerhalb der Safe-Zone (y 240–1680)
Stil und Inhalt stehen in vorlage/src/videos/<id>/Cover.tsx (Stil-Vorgabe: theme.json → cover.stil).
"""
from __future__ import annotations

import sys

from gemeinsam import VORLAGE, ffmpeg_ok, konsole_utf8, rel, remotion, synchronisieren, video_ordner

OBEN, UNTEN = 240, 1680


def main() -> None:
    konsole_utf8()
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    if not args:
        raise SystemExit(__doc__)
    ordner = video_ordner(args[0])
    vid = synchronisieren(ordner)
    if not (VORLAGE / "src" / "videos" / vid / "Cover.tsx").exists():
        raise SystemExit(f"Kein Cover.tsx für dieses Video. Erst: python werkzeug/neu.py {rel(ordner)}")
    import re
    cover_src = (VORLAGE / "src" / "videos" / vid / "Cover.tsx").read_text(encoding="utf-8")
    if re.search(r'"HIER|„HIER|HIER\?', cover_src):
        raise SystemExit("Cover.tsx enthält noch Platzhalter aus der Vorlage (z. B. „HIER DIE FRAGE?“). "
                         f"Erst Frage/Text und Hauptobjekt in vorlage/src/videos/{vid}/Cover.tsx eintragen, dann erneut.")
    png = ordner / "_cover.png"
    remotion("still", "src/index.ts", f"{vid}-cover", str(png), "--log=error")
    cover = ordner / "cover.jpg"
    ffmpeg_ok("-i", str(png), "-q:v", "2", str(cover))
    out = ordner / "pruefung"
    out.mkdir(exist_ok=True)
    ffmpeg_ok("-i", str(png), "-vf", "scale=280:-2", "-q:v", "3", str(out / "cover_feed.jpg"))
    ffmpeg_ok("-i", str(png), "-vf", f"crop=1080:{UNTEN - OBEN}:0:{OBEN},scale=540:-2", "-q:v", "3", str(out / "cover_raster.jpg"))
    rot = "red@0.45"
    ffmpeg_ok("-i", str(png), "-vf",
              f"drawbox=x=0:y=0:w=iw:h={OBEN}:color={rot}:t=fill,drawbox=x=0:y={UNTEN}:w=iw:h=ih-{UNTEN}:color={rot}:t=fill,scale=540:-2",
              "-q:v", "3", str(out / "cover_zonen.jpg"))
    png.unlink(missing_ok=True)
    print(f"FERTIG {rel(cover)}")
    print(f"Ansehen: {rel(out / 'cover_feed.jpg')} (lesbar bei 280 px?), {rel(out / 'cover_raster.jpg')} (alles Wichtige im 3:4-Ausschnitt?), "
          f"{rel(out / 'cover_zonen.jpg')} (nichts Wichtiges im roten Bereich?)")


if __name__ == "__main__":
    main()
