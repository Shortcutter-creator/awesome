"""Stimmen auflisten: kostenlose lokale Stimmen (Standard) und optional die deines ElevenLabs-Kontos.

Aufruf:  python werkzeug/stimmen.py --lokal         kostenlose lokale Stimmen (Qwen, Piper) und ob sie geladen sind
         python werkzeug/stimmen.py                 ElevenLabs: alle Stimmen deines Kontos (Name, Kennung, Sprache, Vorschau-Link)
         python werkzeug/stimmen.py --deutsch       nur Stimmen mit Deutsch
         python werkzeug/stimmen.py --probe <voice_id>   kurzer deutscher Probesatz → videos/_probe/stimme-<name>.mp3
                                                      (kostet etwa 110 Zeichen Guthaben)
Neue Stimmen fügst du in ElevenLabs unter „Voices“ → „Voice Library“ deinem Konto hinzu; dann tauchen sie hier auf.
"""
from __future__ import annotations

import base64
import re
import sys

from gemeinsam import VIDEOS, ElevenFehler, eleven, eleven_klartext, konsole_utf8, lade_theme, rel

PROBESATZ = "Warum stehen die Süßigkeiten immer direkt an der Kasse? Die Antwort hat mit deiner Geduld zu tun."


def deutsch(v: dict) -> bool:
    labels = " ".join(str(x) for x in (v.get("labels") or {}).values()).lower()
    sprachen = [s.get("language", "") for s in v.get("verified_languages") or []]
    return "de" in sprachen or "german" in labels or "deutsch" in labels


def liste(nur_deutsch: bool) -> None:
    try:
        daten = eleven("/v1/voices")
    except ElevenFehler as f:
        raise SystemExit(eleven_klartext(f))
    stimmen = daten.get("voices", [])
    if nur_deutsch:
        stimmen = [v for v in stimmen if deutsch(v)]
    if not stimmen:
        print("Keine passenden Stimmen im Konto. In ElevenLabs unter Voices → Voice Library deutsche Stimmen hinzufügen.")
        return
    print(f"{len(stimmen)} Stimmen:\n")
    for v in stimmen:
        l = v.get("labels") or {}
        merkmale = ", ".join(x for x in (l.get("gender"), l.get("age"), l.get("accent"), l.get("use_case") or l.get("descriptive")) if x)
        print(f"- {v.get('name')}  ·  {v.get('voice_id')}  ·  {'Deutsch' if deutsch(v) else '–'}  ·  {merkmale}")
        if v.get("preview_url"):
            print(f"    Vorschau: {v['preview_url']}")


def probe(voice_id: str) -> None:
    stimme = lade_theme()["stimme"]
    try:
        antwort = eleven(f"/v1/text-to-speech/{voice_id}/with-timestamps?output_format=mp3_44100_128",
                         {"text": PROBESATZ, "model_id": stimme.get("modell") or "eleven_multilingual_v2",
                          "voice_settings": {"stability": stimme.get("stability", 0.6), "similarity_boost": stimme.get("similarity_boost", 0.75)}})
    except ElevenFehler as f:
        if f.code in (400, 422) and stimme.get("modell_ersatz"):
            antwort = eleven(f"/v1/text-to-speech/{voice_id}/with-timestamps?output_format=mp3_44100_128",
                             {"text": PROBESATZ, "model_id": stimme["modell_ersatz"]})
        else:
            raise SystemExit(eleven_klartext(f))
    ziel = VIDEOS / "_probe"
    ziel.mkdir(parents=True, exist_ok=True)
    datei = ziel / f"stimme-{re.sub(r'[^a-zA-Z0-9-]+', '-', voice_id)[:20]}.mp3"
    datei.write_bytes(base64.b64decode(antwort["audio_base64"]))
    print(f"Hörprobe: {rel(datei)}  ({len(PROBESATZ)} Zeichen)")


def lokale() -> None:
    from stimme_einrichten import LOKALE_STIMMEN, QWEN_MODELLE, QWEN_STIMMEN, STIMMEN, qwen_weg
    weg = qwen_weg()
    print("Qwen3 (anbieter = qwen, kostenlos, natürlicher; Lizenz Apache-2.0):\n")
    if weg is None:
        print("  Auf diesem System nicht verfügbar (nur Mac mit Apple-Chip und Windows 64 Bit). Nimm Piper.")
    else:
        for art, titel, flag in (("customvoice", "Sprecher", "--qwen"), ("voicedesign", "Eigene Stimme aus Beschreibung", "--qwen-design")):
            da = (STIMMEN / QWEN_MODELLE[weg][art][1] / "config.json").exists()
            print(f"  {titel}: {'geladen' if da else 'nicht geladen – python werkzeug/stimme_einrichten.py ' + flag}")
        for name, text in QWEN_STIMMEN.items():
            print(f"  - {name}  ·  {text}")
        print('  Eigene Stimme: in theme.json → stimme "beschreibung": "A warm German male narrator …" (statt voice_id)')
    print("\nKostenlose Piper-Stimmen (anbieter = piper, Lizenz CC0, laufen überall):\n")
    for name, (_, text) in LOKALE_STIMMEN.items():
        da = (STIMMEN / f"{name}.onnx").exists()
        print(f"- {name}  ·  {text}  ·  {'geladen' if da else 'noch nicht geladen'}")
    print("\nHörproben: python werkzeug/stimme_einrichten.py --alle --probe  →  videos/_probe/")


def main() -> None:
    konsole_utf8()
    if "--lokal" in sys.argv:
        lokale()
        return
    if "--probe" in sys.argv:
        i = sys.argv.index("--probe")
        if i + 1 >= len(sys.argv):
            raise SystemExit("Nach --probe die voice_id angeben.")
        probe(sys.argv[i + 1])
    else:
        liste("--deutsch" in sys.argv)


if __name__ == "__main__":
    main()
