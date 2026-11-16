"""Zweites Musikbett „musikbett/bett_puls“: treibender, aber ruhiger Puls (112 BPM, d-Moll → F-Dur), rein tonal
(kein Rauschen): weiche Bassdrum, Achtel-Bass, gezupftes Arpeggio mit Echo, leise Fläche, heller Tick statt Hi-Hat.
Nahtlose Schleife, eigene Synthese. Aufruf: python werkzeug/musikbett_puls.py <paketordner>"""
import json
import subprocess
import sys
import wave
from pathlib import Path

import numpy as np

SR = 48000
PAKET = Path(sys.argv[1]) if len(sys.argv) > 1 else Path(__file__).resolve().parent.parent
BPM = 112
TAKT = 4 * 60 / BPM
TAKTE = 64  # ≈ 137 s
L = int(TAKTE * TAKT * SR)

A4 = 440.0
hz = lambda n: A4 * 2 ** ((n - 69) / 12)  # MIDI → Hz
# Akkorde (je 2 Takte): Dm – Bb – F – C, Grundton und Dreiklang (MIDI)
AKK = [(38, [62, 65, 69]), (34, [62, 65, 70]), (41, [60, 65, 69]), (36, [60, 64, 67])]

L_out = np.zeros((2, L + SR * 3))


def add(sig: np.ndarray, t0: float, pan: float = 0.0, gain: float = 1.0) -> None:
    i = int(t0 * SR)
    n = min(len(sig), L_out.shape[1] - i)
    l, r = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4)
    L_out[0, i:i + n] += sig[:n] * gain * l
    L_out[1, i:i + n] += sig[:n] * gain * r


def env(n: int, a: float, d: float) -> np.ndarray:
    t = np.arange(n) / SR
    return np.minimum(1, t / max(a, 1e-4)) * np.exp(-t / d)


def kick() -> np.ndarray:
    n = int(0.35 * SR); t = np.arange(n) / SR
    f = 48 + 70 * np.exp(-t / 0.03)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * env(n, 0.002, 0.12)


def bass(f: float, dauer: float) -> np.ndarray:
    n = int(dauer * SR); t = np.arange(n) / SR
    s = np.sin(2 * np.pi * f * t) + 0.35 * np.sin(4 * np.pi * f * t) + 0.12 * np.sin(6 * np.pi * f * t)
    return s * env(n, 0.006, dauer * 0.55)


def pluck(f: float) -> np.ndarray:
    n = int(0.6 * SR); t = np.arange(n) / SR
    s = sum((0.6 ** k) * np.sin(2 * np.pi * f * (k + 1) * t) * np.exp(-t * (6 + 5 * k)) for k in range(5))
    return s * env(n, 0.003, 0.25)


def pad(fs: list[float], dauer: float) -> np.ndarray:
    n = int(dauer * SR); t = np.arange(n) / SR
    s = sum(np.sin(2 * np.pi * f * t) + np.sin(2 * np.pi * f * 1.004 * t) for f in fs)
    a = np.minimum(1, t / 0.6) * np.minimum(1, (dauer - t) / 0.6)
    return s * a / len(fs)


def tick() -> np.ndarray:
    n = int(0.05 * SR); t = np.arange(n) / SR
    return (np.sin(2 * np.pi * 6200 * t) + 0.5 * np.sin(2 * np.pi * 9300 * t)) * np.exp(-t / 0.008)


K, = (kick(),)
achtel = TAKT / 8
for takt in range(TAKTE):
    t0 = takt * TAKT
    grund, akk = AKK[(takt // 2) % 4]
    teil = takt // 16  # 4 Teile à 16 Takte: Intensität wechselt leicht
    for v in range(4):
        add(K, t0 + v * TAKT / 4, gain=0.55)
    for e in range(8):
        add(bass(hz(grund), achtel * 0.9), t0 + e * achtel, gain=0.32 if e % 2 == 0 else 0.22)
        add(tick(), t0 + e * achtel + achtel / 2, pan=0.35, gain=0.05 if teil != 0 else 0.03)
    # Arpeggio in Sechzehnteln (auf/ab), abwechselnd links/rechts
    folge = [akk[0], akk[1], akk[2], akk[1] + 12 if teil % 2 else akk[2] + 12 - 12, akk[0] + 12, akk[2], akk[1], akk[2]]
    for s in range(16):
        note = folge[s % 8] + (12 if (s // 8) % 2 and teil >= 2 else 0)
        add(pluck(hz(note)), t0 + s * TAKT / 16, pan=-0.4 if s % 2 else 0.4, gain=0.16)
    if takt % 2 == 0:
        add(pad([hz(n - 12) for n in akk], 2 * TAKT), t0, gain=0.10)

# Echo (punktierte Achtel) für Breite
d = int(achtel * 1.5 * SR)
echo = np.zeros_like(L_out)
echo[1, d:] += L_out[0, :-d] * 0.22
echo[0, 2 * d:] += L_out[1, :-2 * d] * 0.12
mix = L_out + echo
# nahtlos: Ausklang an den Anfang falten
mix[:, :mix.shape[1] - L] += 0  # (Platzhalter für Lesbarkeit)
schleife = mix[:, :L].copy()
schleife[:, : mix.shape[1] - L] += mix[:, L:]
# sanfter Tiefpass (FFT), Pegel
X = np.fft.rfft(schleife, axis=1)
f = np.fft.rfftfreq(L, 1 / SR)
X *= 1 / np.sqrt(1 + (f / 7000) ** 4)
schleife = np.fft.irfft(X, L, axis=1)
schleife = schleife / np.max(np.abs(schleife)) * 0.63  # Spitze ≈ −4 dBFS

ziel = PAKET / "klaenge/musikbett"
ziel.mkdir(parents=True, exist_ok=True)
wav = ziel / "bett_puls.wav"
with wave.open(str(wav), "wb") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((np.clip(schleife.T, -1, 1) * 32767).astype(np.int16).tobytes())
mp3 = ziel / "bett_puls.mp3"
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(wav), "-b:a", "160k", str(mp3)], check=True)
wav.unlink()

eintrag = {"id": "musikbett/bett_puls", "gruppe": "Musikbett", "art": ["bed"], "datei": "klaenge/musikbett/bett_puls.mp3",
           "varianten": 1, "dauer": round(L / SR, 3), "spitze_s": 0.0, "einsatz_s": 0.0, "spitze_db": -4.0, "stimmbar": False,
           "ton": None, "ton_hz": None,
           "beschreibung_en": f"driving but calm pulse music bed ({BPM} BPM, D minor/F major), tonal, no noise, seamless loop ({round(L / SR)} s)",
           "quelle": "eigene Synthese (Gedankenwerk)"}
for name in ("katalog.json", "katalog.js"):
    p = PAKET / "klaenge" / name
    roh = p.read_text(encoding="utf-8")
    js = name.endswith(".js")
    kopf = roh[: roh.index("{")] if js else ""
    fuss = roh[roh.rindex("}") + 1:] if js else ""
    kat = json.loads(roh[len(kopf): len(roh) - len(fuss)] if js else roh)
    kat["klaenge"] = [k for k in kat["klaenge"] if k["id"] != eintrag["id"]] + [eintrag]
    kat["anzahl"] = len(kat["klaenge"])
    p.write_text(kopf + json.dumps(kat, ensure_ascii=False, indent=None if js else 1) + fuss, encoding="utf-8")
print("ok", mp3, round(L / SR, 1), "s")
