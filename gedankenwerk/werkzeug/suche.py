"""Sucht Bausteine und Geräusche, ohne die großen Kataloge ganz lesen zu müssen (spart viel Claude-Limit).

Aufruf:  python werkzeug/suche.py <Stichwörter …>               Bausteine + Klänge, beste Treffer
         python werkzeug/suche.py --bausteine Auto Stau          nur Bausteine
         python werkzeug/suche.py --klaenge whoosh schnell       nur Klänge
         python werkzeug/suche.py --uebersicht                   Kategorien/Gruppen mit Anzahl und Beispielen
         python werkzeug/suche.py --id bib-ill-stadt-verkehr-bruecke   ein Eintrag komplett (mit Import-Zeile)
Optionen: --max N (Standard 12), --kategorie "<Name>" bzw. --gruppe "<Name>" (filtert).
Stichwörter deutsch oder englisch, Groß/klein und Umlaute egal (ae = ä).
Nur Standardbibliothek.
"""
from __future__ import annotations

import json
import re
import sys

from gemeinsam import PAKET, konsole_utf8

KAT_B = PAKET / "bausteine" / "katalog.json"
KAT_K = PAKET / "klaenge" / "katalog.json"


def norm(s: str) -> str:
    s = str(s).lower()
    for a, b in (("ä", "ae"), ("ö", "oe"), ("ü", "ue"), ("ß", "ss")):
        s = s.replace(a, b)
    return s


def lade(datei) -> list[dict]:
    if not datei.exists():
        return []
    d = json.loads(datei.read_text(encoding="utf-8"))
    return d["klaenge"] if isinstance(d, dict) and "klaenge" in d else d


def text_b(b: dict) -> list[tuple[str, int]]:
    return [(b.get("id", ""), 3), (b.get("name", ""), 4), (" ".join(b.get("tags", [])), 3), (b.get("kategorie", ""), 2), (b.get("was", ""), 1)]


def text_k(k: dict) -> list[tuple[str, int]]:
    return [(k.get("id", ""), 4), (k.get("gruppe", ""), 3), (" ".join(k.get("art", [])), 2), (k.get("beschreibung_en", ""), 1)]


def punkte(felder: list[tuple[str, int]], woerter: list[str]) -> int:
    summe = 0
    for w in woerter:
        treffer = 0
        for text, gewicht in felder:
            t = norm(text)
            if re.search(r"(^|[^a-z0-9])" + re.escape(w), t):
                treffer = max(treffer, gewicht * 2)  # Wortanfang
            elif w in t:
                treffer = max(treffer, gewicht)
        if not treffer:
            return 0  # alle Stichwörter müssen vorkommen
        summe += treffer
    return summe


def kurz(s: str, n: int) -> str:
    s = re.sub(r"\s+", " ", str(s)).strip()
    return s if len(s) <= n else s[: n - 1] + "…"


def zeige_b(b: dict, voll: bool = False) -> None:
    print(f"  {b['id']}  ·  {b.get('name', '')}  [{b.get('kategorie', '')}]")
    print(f"      {kurz(b.get('was', ''), 400 if voll else 140)}")
    imp = (b.get("import") or "").strip().splitlines()
    if imp:
        print("      " + ("\n      ".join(imp) if voll else imp[0] + (" …" if len(imp) > 1 else "")))
    if voll and b.get("vorschau"):
        print(f"      Vorschau: {b['vorschau']}")
    if voll:
        zeige_signaturen(b.get("import") or "")


def zeige_signaturen(imp: str) -> None:
    """Quelldatei + Props der importierten Namen: Import „../../bausteine/x/y“ (aus vorlage/src/videos/<id>/) liegt in
    vorlage/src/bausteine/x/y.tsx. Spart das Suchen per grep."""
    for m in re.finditer(r"import\s*\{([^}]*)\}\s*from\s*\"\.\./\.\./(bausteine/[^\"]+)\"", imp):
        namen = [n.strip().split(" as ")[0] for n in m.group(1).split(",") if n.strip()]
        basis = PAKET / "vorlage" / "src" / m.group(2)
        datei = next((basis.with_suffix(e) for e in (".tsx", ".ts") if basis.with_suffix(e).exists()), None)
        if datei is None and (basis / "index.ts").exists():
            datei = basis / "index.ts"
        if datei is None:
            continue
        print(f"      Quelle: {datei.relative_to(PAKET).as_posix()}")
        text = datei.read_text(encoding="utf-8", errors="ignore")
        for name in namen:
            t = re.search(r"export (?:const|function) " + re.escape(name) + r"\b[\s\S]{0,600}?(?:=>|\)\s*\{)", text)
            if t:
                print(f"      {kurz(t.group(0), 420)}")


def zeige_k(k: dict, voll: bool = False) -> None:
    extra = (f", stimmbar (Grundton {k['ton']})" if k.get("stimmbar") and k.get("ton") else "") + (", 3 Varianten" if k.get("varianten", 1) > 1 else "")
    print(f"  {k['id']}  ·  {k['gruppe']}  ·  {k['dauer']:.2f} s, Spitze bei {k['spitze_s']:.2f} s{extra}")
    print(f"      {kurz(k.get('beschreibung_en', ''), 400 if voll else 120)}")


def main() -> None:
    konsole_utf8()
    argv = sys.argv[1:]
    def opt(name: str, standard: str | None = None) -> str | None:
        if name in argv:
            i = argv.index(name)
            wert = argv[i + 1] if i + 1 < len(argv) else standard
            del argv[i: i + 2]
            return wert
        return standard
    maximal = int(opt("--max", "12") or 12)
    kategorie = opt("--kategorie")
    gruppe = opt("--gruppe")
    einzeln = opt("--id")
    nur_b, nur_k, uebersicht = "--bausteine" in argv, "--klaenge" in argv, "--uebersicht" in argv
    woerter = [norm(a) for a in argv if not a.startswith("--")]
    bs, ks = lade(KAT_B), lade(KAT_K)
    if not bs and not ks:
        raise SystemExit("Keine Kataloge gefunden (bausteine/katalog.json, klaenge/katalog.json).")
    if einzeln:
        for b in bs:
            if b["id"] == einzeln:
                return zeige_b(b, voll=True)
        for k in ks:
            if k["id"] == einzeln:
                return zeige_k(k, voll=True)
        raise SystemExit(f"„{einzeln}“ gibt es nicht. Suche: python werkzeug/suche.py <Stichwort>")
    if uebersicht or not woerter:
        if not nur_k and bs:
            print(f"BAUSTEINE ({len(bs)}) – Kategorien:")
            kats: dict[str, list[dict]] = {}
            for b in bs:
                kats.setdefault(b.get("kategorie", "?"), []).append(b)
            for name, liste in sorted(kats.items(), key=lambda x: -len(x[1])):
                print(f"  {name} ({len(liste)}): " + ", ".join(kurz(b.get("name", b["id"]), 28) for b in liste[:4]) + (" …" if len(liste) > 4 else ""))
        if not nur_b and ks:
            print(f"\nKLÄNGE ({len(ks)}) – Gruppen:")
            grs: dict[str, list[dict]] = {}
            for k in ks:
                grs.setdefault(k["gruppe"], []).append(k)
            for name, liste in grs.items():
                print(f"  {name} ({len(liste)}): " + ", ".join(k["id"] for k in liste[:6]) + (" …" if len(liste) > 6 else ""))
        print("\nSuchen: python werkzeug/suche.py <Stichwort> · Details: --id <id>")
        return
    if not nur_k:
        kand = [b for b in bs if not kategorie or norm(kategorie) in norm(b.get("kategorie", ""))]
        treffer = sorted(((punkte(text_b(b), woerter), b) for b in kand), key=lambda x: -x[0])
        treffer = [b for p, b in treffer if p > 0]
        print(f"BAUSTEINE: {len(treffer)} Treffer" + (f" (zeige {maximal})" if len(treffer) > maximal else ""))
        for b in treffer[:maximal]:
            zeige_b(b)
    if not nur_b:
        kand = [k for k in ks if not gruppe or norm(gruppe) in norm(k["gruppe"])]
        treffer = sorted(((punkte(text_k(k), woerter), k) for k in kand), key=lambda x: -x[0])
        treffer = [k for p, k in treffer if p > 0]
        print(f"\nKLÄNGE: {len(treffer)} Treffer" + (f" (zeige {maximal})" if len(treffer) > maximal else ""))
        for k in treffer[:maximal]:
            zeige_k(k)
    print("\nVollständiger Eintrag mit Import-Zeile: python werkzeug/suche.py --id <id>")


if __name__ == "__main__":
    main()
