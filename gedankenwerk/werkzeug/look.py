"""Fertigen Look übernehmen oder anzeigen. Kanalname, Stimme und Abspann bleiben, nur Farben/Schrift/Untertitel/Figur wechseln.

Aufruf:  python werkzeug/look.py                 Liste der fertigen Looks (Ordner looks/)
         python werkzeug/look.py nacht           Look „nacht“ in theme.json übernehmen (vorher Sicherung theme.vorher.json)
         python werkzeug/look.py --zurueck       letzte Sicherung wiederherstellen
Danach: python werkzeug/probe.py zeigt den Look als Bild.
"""
from __future__ import annotations

import json
import shutil
import sys

from gemeinsam import PAKET, konsole_utf8, lade_theme, theme_fehler

LOOKS = PAKET / "looks"
THEME = PAKET / "theme.json"
SICHERUNG = PAKET / "theme.vorher.json"
BEREICHE = ("farben", "schrift", "untertitel", "mechanik_wechsel", "figur")


def kontrast(a: str, b: str) -> float:
    def lum(h: str) -> float:
        n = int(h[1:], 16)
        def k(c: int) -> float:
            v = c / 255
            return v / 12.92 if v <= 0.03928 else ((v + 0.055) / 1.055) ** 2.4
        return 0.2126 * k(n >> 16 & 255) + 0.7152 * k(n >> 8 & 255) + 0.0722 * k(n & 255)
    x, y = sorted((lum(a), lum(b)), reverse=True)
    return (x + 0.05) / (y + 0.05)


def main() -> None:
    konsole_utf8()
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    if "--zurueck" in sys.argv:
        if not SICHERUNG.exists():
            raise SystemExit("Keine Sicherung vorhanden.")
        shutil.copy2(SICHERUNG, THEME)
        print("Vorheriger Look wiederhergestellt.")
        return
    if not args:
        print("Fertige Looks:\n")
        for f in sorted(LOOKS.glob("*.json")):
            d = json.loads(f.read_text(encoding="utf-8"))
            print(f"- {f.stem}: {d.get('_beschreibung', '')}")
        print("\nÜbernehmen: python werkzeug/look.py <name>")
        return
    datei = LOOKS / f"{args[0]}.json"
    if not datei.exists():
        raise SystemExit(f"Look „{args[0]}“ gibt es nicht. Vorhanden: {', '.join(f.stem for f in LOOKS.glob('*.json'))}")
    look = json.loads(datei.read_text(encoding="utf-8"))
    theme = lade_theme()
    shutil.copy2(THEME, SICHERUNG)
    for b in BEREICHE:
        if b in look:
            theme.setdefault(b, {}).update(look[b])
    fehler = theme_fehler(theme)
    if fehler:
        raise SystemExit("Look nicht übernommen: " + "; ".join(fehler))
    f, u = theme["farben"], theme["untertitel"]
    k1, k2 = kontrast(f["text"], f["hintergrund"]), kontrast(u["farbe"], u["pille"])
    THEME.write_text(json.dumps(theme, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Look „{args[0]}“ übernommen. Kontrast Text/Hintergrund {k1:.1f}:1, Untertitel {k2:.1f}:1 (mindestens 4,5:1).")
    print("Ansehen: python werkzeug/probe.py   ·   Rückgängig: python werkzeug/look.py --zurueck")


if __name__ == "__main__":
    main()
