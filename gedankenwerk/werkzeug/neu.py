"""Legt die Animation für ein vertontes Video an und meldet es in der Vorlage an.

Aufruf:  python werkzeug/neu.py videos/<ordner> [--thema="Kurzer Titel"]
Erzeugt vorlage/src/videos/<id>/Video.tsx + Cover.tsx aus vorlage/vorlagen/ (nur, wenn sie noch fehlen),
kopiert voice.wav + woerter.json in die Vorlage und schreibt vorlage/src/videos/register.ts neu.
Danach: Video.tsx Szene für Szene nach Regelbuch bauen, dann python werkzeug/render.py videos/<ordner>.
"""
from __future__ import annotations

import sys

from gemeinsam import VORLAGE, konsole_utf8, rel, synchronisieren, video_ordner

REGISTER_KOPF = """// Wird von werkzeug/neu.py geschrieben. Nicht von Hand ändern.
import type React from "react";
"""


def register_schreiben() -> int:
    """Meldet jeden Ordner unter src/videos/ mit Video.tsx an (Cover, falls vorhanden)."""
    basis = VORLAGE / "src" / "videos"
    eintraege, importe = [], []
    for i, d in enumerate(sorted(p for p in basis.iterdir() if p.is_dir() and (p / "Video.tsx").exists())):
        importe.append(f'import * as v{i} from "./{d.name}/Video";')
        cover = (d / "Cover.tsx").exists()
        if cover:
            importe.append(f'import * as c{i} from "./{d.name}/Cover";')
        eintraege.append(f'  {{ id: "{d.name}", Video: v{i}.Video, dauer: v{i}.DAUER' + (f", Cover: c{i}.Cover" if cover else "") + " },")
    text = REGISTER_KOPF + "\n".join(importe) + "\n\nexport type Eintrag = { id: string; Video: React.FC; dauer: number; Cover?: React.FC };\n"
    text += "export const VIDEOS: Eintrag[] = [\n" + "\n".join(eintraege) + "\n];\n"
    (basis / "register.ts").write_text(text, encoding="utf-8")
    return len(eintraege)


def main() -> None:
    konsole_utf8()
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    if not args:
        raise SystemExit(__doc__)
    ordner = video_ordner(args[0])
    thema = next((a.split("=", 1)[1] for a in sys.argv if a.startswith("--thema=")), ordner.name.split("-", 3)[-1].replace("-", " ").title())
    vid = synchronisieren(ordner)
    ziel = VORLAGE / "src" / "videos" / vid
    angelegt = []
    for name in ("Video.tsx", "Cover.tsx"):
        datei = ziel / name
        if not datei.exists():
            vorlage = (VORLAGE / "vorlagen" / name).read_text(encoding="utf-8")
            datei.write_text(vorlage.replace("__THEMA__", thema.replace('"', "'")).replace("__ID__", vid), encoding="utf-8")
            angelegt.append(name)
    n = register_schreiben()
    print(f"Video „{vid}“ angemeldet ({n} Videos in der Vorlage).")
    if angelegt:
        print(f"Neu angelegt: {', '.join(rel(ziel / a) for a in angelegt)} – jetzt die Szenen bauen.")
    else:
        print("Video.tsx und Cover.tsx gab es schon; nur Stimme und Wortzeiten aktualisiert.")
    print(f"Weiter: python werkzeug/render.py {rel(ordner)}")


if __name__ == "__main__":
    main()
