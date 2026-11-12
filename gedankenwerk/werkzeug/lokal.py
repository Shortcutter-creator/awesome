"""Lokale Stimme und Wortzeiten – läuft in der Paket-Umgebung werkzeug/.venv (legt stimme_einrichten.py an).

Nicht direkt aufrufen; vertonen.py nutzt es:
  lokal.py sprechen   --anbieter piper --stimme <name> --text <datei> --aus <wav>
  lokal.py ausrichten --audio <wav> --text <datei> --aus <json>   → {"woerter": [[wort, start, ende], ...]}
Kostenlos, offline nach dem ersten Download, Mac und Windows, ohne Grafikkarte.
"""
from __future__ import annotations

import argparse
import json
import subprocess
import sys
import wave
from pathlib import Path

PAKET = Path(__file__).resolve().parent.parent
STIMMEN = PAKET / "stimmen"
WHISPER_MODELL = "small"


def espeak_pfad() -> Path:
    """espeak-ng (Aussprache) verträgt nur kurze Pfade zu seinen Daten. Liegt das Paket tief verschachtelt,
    werden die Daten einmalig nach ~/.gedankenwerk/espeak-ng-data kopiert."""
    import shutil
    from piper import voice as pv
    original = Path(pv.ESPEAK_DATA_DIR)
    if len(str(original)) <= 100:
        return original
    kurz = Path.home() / ".gedankenwerk" / "espeak-ng-data"
    if not (kurz / "phontab").exists():
        shutil.copytree(original, kurz, dirs_exist_ok=True)
    return kurz


def piper(stimme: str, text: str, aus: Path) -> None:
    from piper import PiperVoice
    modell = STIMMEN / f"{stimme}.onnx"
    if not modell.exists():
        raise SystemExit(f"Stimme „{stimme}“ fehlt in stimmen/. Sag Claude: einrichten.")
    voice = PiperVoice.load(str(modell), espeak_data_dir=espeak_pfad())
    with wave.open(str(aus), "wb") as w:
        voice.synthesize_wav(text, w)
    with wave.open(str(aus), "rb") as w:
        if w.getnframes() < w.getframerate() * 0.5:
            raise SystemExit("Die lokale Stimme hat keinen Ton erzeugt (Aussprache-Daten fehlen?). Sag Claude: einrichten.")


# Qwen3-TTS (Apache-2.0). Zwei Wege, je nach System:
#   Mac mit Apple-Chip  → MLX (mlx-audio), Modelle in stimmen/qwen3-<art>
#   Windows / Intel-Mac / Linux → PyTorch auf der CPU (Paket qwen-tts), Modelle in stimmen/qwen3-pytorch-<art>
# Standard ist der Stimmklon (art „base“): jeder Satz wird aus einer festen Referenz in stimmen/klon/ gesprochen.
# Das klingt natürlicher als die eingebauten Sprecher und bleibt über das ganze Video dieselbe Stimme.
QWEN_SPRECHER = ("ryan", "aiden", "eric", "serena", "vivian")  # eingebaute Sprecher (älterer Weg, nur auf Wunsch)
KLON = STIMMEN / "klon"
REF_SATZ = "Weißt du, warum du im Supermarkt fast immer mehr kaufst, als du eigentlich wolltest? Die Antwort ist überraschend einfach."


def ist_mlx() -> bool:
    import platform
    return platform.system() == "Darwin" and platform.machine() == "arm64"


def qwen_ordner(art: str) -> Path:
    """art = „base“ (Stimmklon, Standard), „voicedesign“ (Stimme aus Beschreibung) oder „customvoice“ (eingebaute Sprecher)."""
    return STIMMEN / (f"qwen3-{art}" if ist_mlx() else f"qwen3-pytorch-{art}")


def klon_stimmen() -> dict:
    """Mitgelieferte Stimmen: name → {datei, ref_text, label} aus stimmen/klon/stimmen.json."""
    p = KLON / "stimmen.json"
    if not p.exists():
        return {}
    return {k: v for k, v in json.loads(p.read_text(encoding="utf-8")).items() if not k.startswith("_")}


def saetze(text: str) -> list[str]:
    """Stimmklon satzweise: kurze Stücke bleiben stabil; Splitter unter 18 Zeichen hängen am vorigen Satz."""
    import re
    teile: list[str] = []
    for s in (x.strip() for x in re.split(r"(?<=[.?!])\s+", text)):
        if not s:
            continue
        if teile and len(s) < 18:
            teile[-1] = f"{teile[-1]} {s}"
        else:
            teile.append(s)
    return teile


def abschnitte(text: str, grenze: int = 260) -> list[str]:
    """Qwen entgleist bei langen Texten am Stück; deshalb satzweise Abschnitte bis ~260 Zeichen."""
    import re
    saetze = [s.strip() for s in re.split(r"(?<=[.?!])\s+", text) if s.strip()]
    teile, cur = [], ""
    for s in saetze:
        if cur and len(cur) + len(s) + 1 > grenze:
            teile.append(cur)
            cur = ""
        cur = f"{cur} {s}".strip()
    if cur:
        teile.append(cur)
    return teile


def schreibe_wav(stuecke, sr: int, aus: Path) -> None:
    import numpy as np
    pcm = (np.clip(np.concatenate(stuecke), -1, 1) * 32767).astype(np.int16)
    with wave.open(str(aus), "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(sr)
        w.writeframes(pcm.tobytes())


def qwen_modell(art: str):
    ordner = qwen_ordner(art)
    if not (ordner / "config.json").exists():
        schalter = {"base": "--qwen", "voicedesign": "--qwen-design", "customvoice": "--qwen-sprecher"}[art]
        raise SystemExit(f"Das Qwen-Modell ({art}) ist nicht geladen. Einmalig: python werkzeug/stimme_einrichten.py {schalter}")
    if ist_mlx():
        from mlx_audio.tts.utils import load_model
        return load_model(str(ordner))
    import os
    import torch
    from qwen_tts import Qwen3TTSModel
    # Alle Kerne nutzen: PyTorch nimmt sonst unter Umständen nur einen (gemessen 04.11.: 1 Kern ≈ 10× Echtzeit)
    torch.set_num_threads(max(1, os.cpu_count() or 1))
    geraet = "cuda" if torch.cuda.is_available() else "cpu"  # NVIDIA-Grafikkarte, wenn vorhanden
    return Qwen3TTSModel.from_pretrained(str(ordner), device_map=geraet, dtype=torch.float32)


def qwen_sprich(modell, art: str, teil: str, seed: int, stimme: str = "", beschreibung: str = "",
                ref: Path | None = None, ref_text: str = ""):
    """Ein Stück Text → (audio float32, Abtastrate). Gleicher Startwert je Stück hält die Stimme stabil."""
    import numpy as np
    if ist_mlx():
        import mlx.core as mx
        mx.random.seed(seed)
        if art == "base":
            erg = modell.generate(text=teil, ref_audio=str(ref), ref_text=ref_text, lang_code="german",
                                  temperature=0.75, max_tokens=1600, split_pattern="\u2063")
        elif art == "voicedesign":
            erg = modell.generate_voice_design(text=teil, instruct=beschreibung, language="german", max_tokens=1200)
        else:
            erg = modell.generate(text=teil, voice=stimme, lang_code="german")
        return np.concatenate([np.array(r.audio, dtype=np.float32) for r in erg if r.audio is not None]), modell.sample_rate
    import torch
    torch.manual_seed(seed)
    if art == "base":
        wavs, sr = modell.generate_voice_clone(text=teil, language="German", ref_audio=str(ref), ref_text=ref_text, max_new_tokens=1200)
    elif art == "voicedesign":
        wavs, sr = modell.generate_voice_design(text=teil, language="German", instruct=beschreibung, max_new_tokens=1200)
    else:
        wavs, sr = modell.generate_custom_voice(text=teil, language="German", speaker=stimme.capitalize(), max_new_tokens=1200)
    return np.asarray(wavs[0], dtype=np.float32), sr


def eigene_referenz(beschreibung: str, seed: int) -> Path:
    """Eigene Stimme: einmal per Voice Design einen Referenzsatz sprechen (gleiche Beschreibung + seed = gleiche Datei),
    danach wird jeder Satz daraus geklont. So bleibt eine beschriebene Stimme über das ganze Video gleich."""
    import hashlib
    ref = KLON / f"eigen-{hashlib.sha1(f'{beschreibung}|{seed}'.encode()).hexdigest()[:10]}.wav"
    if not ref.exists():
        KLON.mkdir(parents=True, exist_ok=True)
        print("  Entwerfe die beschriebene Stimme (einmalig) …", file=sys.stderr, flush=True)
        modell = qwen_modell("voicedesign")
        audio, sr = qwen_sprich(modell, "voicedesign", REF_SATZ, seed, beschreibung=beschreibung)
        schreibe_wav([audio], sr, ref)
        del modell
    return ref


def qwen(stimme: str, beschreibung: str, text: str, aus: Path, seed: int = 42) -> None:
    """Qwen3-TTS: mitgelieferte Stimme (Klon), eigene Stimme aus Beschreibung (Klon) oder eingebauter Sprecher."""
    import numpy as np
    stimme = (stimme or "").lower()
    klone = klon_stimmen()
    if beschreibung:
        art, ref, ref_text = "base", eigene_referenz(beschreibung, seed), REF_SATZ
    elif stimme in klone:
        art, ref, ref_text = "base", KLON / klone[stimme]["datei"], klone[stimme]["ref_text"]
    elif stimme in QWEN_SPRECHER:
        art, ref, ref_text = "customvoice", None, ""
    else:
        raise SystemExit(f"Stimme „{stimme}“ gibt es nicht. Möglich: {', '.join(klone)} – oder eine eigene Beschreibung.")
    import hashlib
    teile = saetze(text) if art == "base" else abschnitte(text)
    # Satz-Zwischenspeicher: Wird nur ein Satz geändert, spricht Qwen nur diesen neu (auf Windows-CPU spart das
    # Minuten). So muss niemand Tonstücke von Hand zusammensetzen – dabei ging an Nahtstellen die Pause verloren.
    speicher = aus.parent / "saetze"
    speicher.mkdir(parents=True, exist_ok=True)
    kennung = f"{art}|{stimme}|{beschreibung}|{seed}|"
    datei = lambda teil: speicher / f"{hashlib.sha1((kennung + teil).encode('utf-8')).hexdigest()[:16]}.npz"
    fehlen = [t for t in teile if not datei(t).exists()]
    if len(fehlen) < len(teile):
        print(f"  {len(teile) - len(fehlen)} von {len(teile)} Sätzen unverändert (aus dem Zwischenspeicher)", file=sys.stderr, flush=True)
    modell = qwen_modell(art) if fehlen else None
    stuecke, sr = [], 24000
    for i, teil in enumerate(teile, 1):
        f = datei(teil)
        if f.exists():
            with np.load(f) as z:
                audio, sr = z["audio"], int(z["sr"])
        else:
            if not ist_mlx():
                print(f"  Satz {i} von {len(teile)} …", file=sys.stderr, flush=True)
            audio, sr = qwen_sprich(modell, art, teil, seed, stimme=stimme, ref=ref, ref_text=ref_text)
            audio = sanftes_ende(np.asarray(audio, dtype=np.float32), sr)
            np.savez(f, audio=audio, sr=sr)
        stuecke += [audio, np.zeros(int(0.3 * sr), dtype=np.float32)]
    schreibe_wav([ohne_anfangsstille(np.concatenate(stuecke), sr)], sr, aus)


def sanftes_ende(audio, sr: int):
    """Endet ein Satz nicht in Stille (Qwen bricht manchmal mitten im Ausklang ab), die letzten 30 ms ausblenden,
    damit an der Satzgrenze kein Knacken oder harter Abriss entsteht."""
    import numpy as np
    n = int(0.03 * sr)
    if audio.size > n and float(np.max(np.abs(audio[-n:]))) > 0.02:
        audio = audio.copy()
        audio[-n:] *= np.linspace(1.0, 0.0, n, dtype=np.float32)
    return audio


def ohne_anfangsstille(audio, sr: int):
    """Qwen beginnt oft mit ~0,5 s Stille; dann legt die Wortzeit-Erkennung die ersten Wörter zu spät
    („Stimme ab Bild 0“ scheitert). Stille bis 40 ms vor dem ersten hörbaren Laut abschneiden."""
    import numpy as np
    laut = np.flatnonzero(np.abs(audio) > 0.02)
    return audio[max(0, int(laut[0]) - int(0.04 * sr)):] if laut.size else audio


def sprechen(a: argparse.Namespace) -> None:
    text = Path(a.text).read_text(encoding="utf-8")
    if a.anbieter == "piper":
        piper(a.stimme, text, Path(a.aus))
    elif a.anbieter == "qwen":
        qwen(a.stimme or "", a.beschreibung or "", text, Path(a.aus), a.seed)
    else:
        raise SystemExit(f"Lokaler Anbieter „{a.anbieter}“ ist unbekannt.")


def ausrichten(a: argparse.Namespace) -> None:
    import numpy as np
    from faster_whisper import WhisperModel
    pcm = subprocess.run(["ffmpeg", "-v", "error", "-i", a.audio, "-ac", "1", "-ar", "16000", "-f", "s16le", "-"],
                         capture_output=True, check=True).stdout
    audio = np.frombuffer(pcm, np.int16).astype(np.float32) / 32768
    modell = WhisperModel(WHISPER_MODELL, device="cpu", compute_type="int8")
    hinweis = Path(a.text).read_text(encoding="utf-8")[:800]
    segs, _ = modell.transcribe(audio, language="de", word_timestamps=True, initial_prompt=hinweis, vad_filter=False)
    woerter = [[w.word.strip(), round(float(w.start), 3), round(float(w.end), 3)] for s in segs for w in (s.words or [])]
    Path(a.aus).write_text(json.dumps({"woerter": woerter}, ensure_ascii=False), encoding="utf-8")


def main() -> None:
    ap = argparse.ArgumentParser()
    sub = ap.add_subparsers(dest="befehl", required=True)
    s = sub.add_parser("sprechen")
    s.add_argument("--anbieter", required=True)
    s.add_argument("--stimme", default="")
    s.add_argument("--beschreibung", default="")
    s.add_argument("--seed", type=int, default=42)
    s.add_argument("--text", required=True)
    s.add_argument("--aus", required=True)
    r = sub.add_parser("ausrichten")
    r.add_argument("--audio", required=True)
    r.add_argument("--text", required=True)
    r.add_argument("--aus", required=True)
    a = ap.parse_args()
    sprechen(a) if a.befehl == "sprechen" else ausrichten(a)


if __name__ == "__main__":
    for strom in (sys.stdout, sys.stderr):
        try:
            strom.reconfigure(encoding="utf-8", errors="replace")
        except (AttributeError, ValueError):
            pass
    main()
