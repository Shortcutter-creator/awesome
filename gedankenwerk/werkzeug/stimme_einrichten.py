"""Richtet die kostenlose lokale Stimme ein: eigene Python-Umgebung werkzeug/.venv, Piper + faster-whisper, Stimmen-Dateien.

Aufruf:  python werkzeug/stimme_einrichten.py --qwen     Standard: Qwen3-Stimmklon mit 8 mitgelieferten Stimmen (Max, Hannes, Ben,
                                                          Klaus, Jonas, Dylan, Lena, Mara), Mac mit Apple-Chip und Windows 64 Bit
         python werkzeug/stimme_einrichten.py --qwen-design   zusätzlich „eigene Stimme aus Beschreibung“ (Qwen3 VoiceDesign)
         python werkzeug/stimme_einrichten.py --qwen-sprecher zusätzlich die eingebauten Qwen-Sprecher (älterer Weg)
         python werkzeug/stimme_einrichten.py            nur Piper (Thorsten) – Notlösung für sehr schwache Rechner
         python werkzeug/stimme_einrichten.py --alle     alle mitgelieferten deutschen Piper-Stimmen laden
         python werkzeug/stimme_einrichten.py --probe    danach je Stimme eine Hörprobe nach videos/_probe/
Einmalig, braucht Internet (~300 MB: Programme, Stimme, Erkennungsmodell). Danach läuft alles offline.
Eigene Umgebung, damit nichts am System-Python geändert wird (Homebrew-Python verbietet das sogar).
"""
from __future__ import annotations

import subprocess
import sys
import urllib.request
import venv

from gemeinsam import PAKET, VIDEOS, https_kontext, konsole_utf8, venv_python

STIMMEN = PAKET / "stimmen"
HF = "https://huggingface.co/rhasspy/piper-voices/resolve/main/de/de_DE"
# Nur Stimmen mit freier Lizenz (Modellkarte von rhasspy/piper-voices): CC0
LOKALE_STIMMEN = {
    "de_DE-thorsten-high": ("thorsten/high", "Thorsten · Mann · klar, hohe Qualität (Standard)"),
    "de_DE-thorsten_emotional-medium": ("thorsten_emotional/medium", "Thorsten emotional · Mann · mehrere Stimmungen"),
    "de_DE-kerstin-low": ("kerstin/low", "Kerstin · Frau · einfache Qualität"),
}
STANDARD = "de_DE-thorsten-high"
# Qwen3-TTS (Apache-2.0, nicht gated). Standard = Stimmklon (Base) aus den Referenzen in stimmen/klon/ (stimmen.json).
# Eingebaute Sprecher (CustomVoice) nur noch auf Wunsch (--qwen-sprecher):
QWEN_STIMMEN = {"ryan": "Ryan · Mann · dynamisch", "aiden": "Aiden · Mann · sonnig",
                "eric": "Eric · Mann · lebhaft, leicht rau", "serena": "Serena · Frau · warm", "vivian": "Vivian · Frau · hell"}
# Mac mit Apple-Chip: MLX-Fassungen (mlx-community); Windows: Originalmodelle von Qwen für PyTorch auf der CPU.
QWEN_MODELLE = {
    "mlx": {"base": ("mlx-community/Qwen3-TTS-12Hz-1.7B-Base-8bit", "qwen3-base", "ca. 3 GB"),
            "customvoice": ("mlx-community/Qwen3-TTS-12Hz-1.7B-CustomVoice-8bit", "qwen3-customvoice", "ca. 3 GB"),
            "voicedesign": ("mlx-community/Qwen3-TTS-12Hz-1.7B-VoiceDesign-8bit", "qwen3-voicedesign", "ca. 3 GB")},
    "torch": {"base": ("Qwen/Qwen3-TTS-12Hz-0.6B-Base", "qwen3-pytorch-base", "ca. 2,5 GB"),
              "customvoice": ("Qwen/Qwen3-TTS-12Hz-0.6B-CustomVoice", "qwen3-pytorch-customvoice", "ca. 2,5 GB"),
              "voicedesign": ("Qwen/Qwen3-TTS-12Hz-1.7B-VoiceDesign", "qwen3-pytorch-voicedesign", "ca. 4,5 GB")},
}
QWEN_PAKETE = {"mlx": ["mlx-audio==0.5.9", "huggingface_hub"], "torch": ["torch", "qwen-tts", "soundfile", "huggingface_hub"]}
PAKETE = ["piper-tts>=1.3", "faster-whisper>=1.1", "numpy"]
BESCHREIBUNG_PROBE = "A warm German male narrator in his mid thirties, calm and clear, friendly and confident."
PROBE = "Warum stehen die Süßigkeiten immer direkt an der Kasse? Weil du dort wartest. Und wer wartet, greift zu."


def klon_namen() -> list[str]:
    import json
    p = STIMMEN / "klon" / "stimmen.json"
    return [k for k in json.loads(p.read_text(encoding="utf-8")) if not k.startswith("_")] if p.exists() else []


def umgebung() -> str:
    py = venv_python()
    if py is None:
        print("Lege die Paket-Umgebung an (werkzeug/.venv) …", flush=True)
        venv.EnvBuilder(with_pip=True, clear=False).create(PAKET / "werkzeug" / ".venv")
        py = venv_python()
        if py is None:
            raise SystemExit("Die Umgebung konnte nicht angelegt werden. Python neu installieren (python.org) und erneut versuchen.")
    print("Installiere Piper und faster-whisper (einmalig, ein paar Minuten) …", flush=True)
    r = subprocess.run([py, "-m", "pip", "install", "--disable-pip-version-check", "-q", *PAKETE])
    if r.returncode:
        raise SystemExit("Installation fehlgeschlagen. Internet prüfen; die Meldung oben an Claude geben.")
    return py


def lade(name: str) -> None:
    pfad, _ = LOKALE_STIMMEN[name]
    STIMMEN.mkdir(exist_ok=True)
    for endung in (".onnx", ".onnx.json"):
        ziel = STIMMEN / f"{name}{endung}"
        if ziel.exists() and ziel.stat().st_size > 1000:
            continue
        print(f"Lade Stimme {name}{endung} …", flush=True)
        url = f"{HF}/{pfad}/{name}{endung}"
        with urllib.request.urlopen(url, timeout=120, context=https_kontext()) as antwort, open(ziel, "wb") as f:
            while block := antwort.read(1 << 20):
                f.write(block)


def qwen_weg() -> str | None:
    import platform
    if platform.system() == "Darwin" and platform.machine() == "arm64":
        return "mlx"
    if platform.system() == "Windows" and platform.machine().lower() in ("amd64", "x86_64"):
        return "torch"
    return None


ART_NAME = {"base": "Stimmklon", "voicedesign": "eigene Stimme aus Beschreibung", "customvoice": "eingebaute Sprecher"}


def qwen_einrichten(py: str, arten: list[str]) -> None:
    weg = qwen_weg()
    if weg is None:
        print("Qwen3 übersprungen: läuft auf einem Mac mit Apple-Chip und auf Windows (64 Bit). Piper bleibt die Stimme.")
        return
    gb = " + ".join(f"{QWEN_MODELLE[weg][a][2]} ({ART_NAME[a]})" for a in arten)
    zeit = "10 bis 20 Minuten" if weg == "torch" else "5 bis 10 Minuten"
    print(f"Qwen3 wird eingerichtet: Download {gb}, einmalig, rund {zeit} je nach Internet. Danach läuft alles offline.", flush=True)
    r = subprocess.run([py, "-m", "pip", "install", "--disable-pip-version-check", "-q", *QWEN_PAKETE[weg]])
    if r.returncode:
        raise SystemExit("Qwen-Installation fehlgeschlagen (Meldung oben an Claude geben). Piper funktioniert weiter.")
    for art in arten:
        repo, ordner, _ = QWEN_MODELLE[weg][art]
        ziel = STIMMEN / ordner
        if (ziel / "config.json").exists():
            continue
        print(f"Lade {repo} …", flush=True)
        r = subprocess.run([py, "-c", f"from huggingface_hub import snapshot_download; snapshot_download('{repo}', local_dir=r'{ziel}')"])
        if r.returncode:
            raise SystemExit("Das Qwen-Modell ließ sich nicht laden (Internet? Speicherplatz?). Piper funktioniert weiter.")


def main() -> None:
    konsole_utf8()
    py = umgebung()
    arten = [a for a, schalter in (("base", "--qwen"), ("voicedesign", "--qwen-design"), ("customvoice", "--qwen-sprecher"))
             if schalter in sys.argv]
    if "--qwen-design" in sys.argv and "base" not in arten:
        arten.insert(0, "base")  # eine beschriebene Stimme wird einmal entworfen und dann geklont
    if arten:
        qwen_einrichten(py, arten)
    nur_qwen = bool(arten) and qwen_weg() is not None and "--alle" not in sys.argv
    namen = list(LOKALE_STIMMEN) if "--alle" in sys.argv else ([] if nur_qwen else [STANDARD])  # Piper nur als Notlösung
    for n in namen:
        lade(n)
    print("Lade das Erkennungsmodell für die Wortzeiten (einmalig) …", flush=True)
    r = subprocess.run([py, "-c", "from faster_whisper import WhisperModel; WhisperModel('small', device='cpu', compute_type='int8')"])
    if r.returncode:
        raise SystemExit("Das Erkennungsmodell ließ sich nicht laden. Internet prüfen und erneut starten.")
    if "--probe" in sys.argv:
        ziel = VIDEOS / "_probe"
        ziel.mkdir(parents=True, exist_ok=True)
        txt = ziel / "probe.txt"
        txt.write_text(PROBE, encoding="utf-8")
        proben = [("piper", n) for n in namen]
        weg = qwen_weg()
        if weg and (STIMMEN / QWEN_MODELLE[weg]["base"][1] / "config.json").exists():
            # Zum Anhören liegen fertige Proben aller 8 Stimmen in stimmen/klon/proben/ (sofort, auch auf Windows).
            # Hier nur ein Funktionstest mit einer Stimme, damit klar ist, dass Qwen auf diesem Rechner spricht.
            proben = [("qwen", "max")]
            print("Hörproben aller Stimmen: stimmen/klon/proben/<name>.mp3 · Funktionstest mit Max läuft …", flush=True)
        if weg and (STIMMEN / QWEN_MODELLE[weg]["customvoice"][1] / "config.json").exists():
            proben += [("qwen", n) for n in QWEN_STIMMEN]
        for anbieter, n in proben:
            subprocess.run([py, str(PAKET / "werkzeug" / "lokal.py"), "sprechen", "--anbieter", anbieter, "--stimme", n,
                            "--text", str(txt), "--aus", str(ziel / f"stimme-{anbieter}-{n}.wav")], check=True)
            print(f"Hörprobe: videos/_probe/stimme-{anbieter}-{n}.wav")
        if weg and (STIMMEN / QWEN_MODELLE[weg]["voicedesign"][1] / "config.json").exists():
            subprocess.run([py, str(PAKET / "werkzeug" / "lokal.py"), "sprechen", "--anbieter", "qwen", "--beschreibung", BESCHREIBUNG_PROBE,
                            "--text", str(txt), "--aus", str(ziel / "stimme-qwen-beschrieben.wav")], check=True)
            print("Hörprobe: videos/_probe/stimme-qwen-beschrieben.wav")
    if not nur_qwen:
        print("\nLokale Notlösung Piper (anbieter = piper):")
    for n, (_, text) in ({} if nur_qwen else LOKALE_STIMMEN).items():
        da = (STIMMEN / f"{n}.onnx").exists()
        print(f"  {'[da]  ' if da else '[fehlt]'} {n}: {text}")
    weg = qwen_weg()
    if weg is None:
        print("Qwen3: auf diesem System nicht verfügbar (nur Mac mit Apple-Chip und Windows 64 Bit).")
    else:
        schalter = {"base": "--qwen", "voicedesign": "--qwen-design", "customvoice": "--qwen-sprecher"}
        titel = {"base": f"Stimmklon ({', '.join(klon_namen())})", "voicedesign": "eigene Stimme aus Beschreibung",
                 "customvoice": f"eingebaute Sprecher {', '.join(QWEN_STIMMEN)}"}
        for art in ("base", "voicedesign", "customvoice"):
            da = (STIMMEN / QWEN_MODELLE[weg][art][1] / "config.json").exists()
            print(f"Qwen3 {titel[art]} (anbieter = qwen): {'geladen' if da else 'nicht geladen (' + schalter[art] + ')'}")


if __name__ == "__main__":
    main()
