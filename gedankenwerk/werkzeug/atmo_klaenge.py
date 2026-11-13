"""Erzeugt Atmo-Klänge (synthetisch, eigene Arbeit): Sirene fern/nah, dunkles Drone-Bett, Herzschlag, Schritte.
Aufruf: python atmo_klaenge.py <paketordner>"""
import json
import sys
import wave
from pathlib import Path

import numpy as np

SR = 48000
PAKET = Path(sys.argv[1])
rng = np.random.default_rng(7)


def schreib(pfad: Path, st: np.ndarray) -> None:
    pfad.parent.mkdir(parents=True, exist_ok=True)
    st = st / (np.max(np.abs(st)) + 1e-9) * 0.891  # Spitze -1 dBFS
    pcm = (np.clip(st, -1, 1) * 32767).astype(np.int16)
    with wave.open(str(pfad), "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(pcm.T.reshape(-1).tobytes() if pcm.ndim == 2 else pcm.tobytes())


def tiefpass(x: np.ndarray, hz: float) -> np.ndarray:
    a = np.exp(-2 * np.pi * hz / SR)
    y = np.empty_like(x)
    acc = 0.0
    for _ in range(2):
        acc = 0.0
        for i in range(len(x)):
            acc = (1 - a) * x[i] + a * acc
            y[i] = acc
        x = y.copy()
    return y


def tiefpass_fft(x: np.ndarray, hz: float, steil: float = 4) -> np.ndarray:
    X = np.fft.rfft(x)
    f = np.fft.rfftfreq(len(x), 1 / SR)
    X *= 1 / np.sqrt(1 + (f / hz) ** (2 * steil))
    return np.fft.irfft(X, len(x))


def hall(x: np.ndarray, dauer: float, nass: float, seed: int) -> np.ndarray:
    r = np.random.default_rng(seed)
    n = int(dauer * SR)
    ir = r.standard_normal(n) * np.exp(-np.linspace(0, 6.9, n))
    ir = tiefpass_fft(ir, 3500, 2)
    ir /= np.sqrt(np.sum(ir ** 2))
    L = len(x) + n
    y = np.fft.irfft(np.fft.rfft(x, L) * np.fft.rfft(ir, L), L)
    y = y / (np.max(np.abs(y)) + 1e-9) * np.max(np.abs(x))
    out = np.zeros(L)
    out[: len(x)] += (1 - nass) * x
    return out + nass * y


def blende(x: np.ndarray, rein: float, raus: float) -> np.ndarray:
    n = len(x)
    e = np.ones(n)
    a, b = int(rein * SR), int(raus * SR)
    if a:
        e[:a] = np.linspace(0, 1, a) ** 2
    if b:
        e[n - b:] = np.linspace(1, 0, b) ** 2
    return x * e


def sirene(dauer: float, zyklus: float, f_lo: float, f_hi: float) -> np.ndarray:
    t = np.arange(int(dauer * SR)) / SR
    phase_lfo = (t / zyklus) % 1.0
    kurve = np.where(phase_lfo < 0.5, phase_lfo * 2, 2 - phase_lfo * 2)  # dreieck 0..1..0
    kurve = 0.5 - 0.5 * np.cos(np.pi * kurve)
    f = f_lo + (f_hi - f_lo) * kurve
    ph = 2 * np.pi * np.cumsum(f) / SR
    x = np.sin(ph) + 0.45 * np.sin(2 * ph) + 0.3 * np.sin(3 * ph) + 0.15 * np.sin(5 * ph)
    return x


def stereo(x: np.ndarray, breite: float, verz_ms: float = 11) -> np.ndarray:
    d = int(verz_ms * SR / 1000)
    r = np.concatenate([np.zeros(d), x[:-d]]) if d else x
    return np.stack([x, (1 - breite) * x + breite * r])


# --- Sirene fern: dumpf, viel Hall, langsames Auf-/Abschwellen -----------------
x = sirene(9.0, 4.2, 480, 980)
x = tiefpass_fft(x, 700, 3)
x = blende(x, 2.5, 3.0)
x = hall(x, 2.2, 0.65, 1)
schreib(PAKET / "klaenge/sirene/fern.wav", stereo(x, 0.7, 17))

# --- Sirene nah: heller, Alarm im Gebäude ---------------------------------------
x = sirene(8.0, 2.4, 520, 1150)
x = tiefpass_fft(x, 2200, 3)
x = blende(x, 0.25, 2.2)
x = hall(x, 1.6, 0.4, 2)
schreib(PAKET / "klaenge/sirene/nah.wav", stereo(x, 0.5, 9))

# --- Drone-Bett: 24 s, nahtlos schleifbar ----------------------------------------
D = 24.0
t = np.arange(int(D * SR)) / SR
def ton(hz):  # ganze Schwingungen je Schleife → nahtlos
    return np.sin(2 * np.pi * round(hz * D) / D * t)
lfo1 = 0.5 + 0.5 * np.sin(2 * np.pi * t / 12)
lfo2 = 0.5 + 0.5 * np.sin(2 * np.pi * t / 8 + 1)
x = 0.9 * ton(55) + 0.7 * ton(55.5) + 0.35 * ton(82.4) * lfo1 + 0.2 * ton(110.25) * lfo2 + 0.12 * ton(164.8) * (1 - lfo1)
rausch = np.random.default_rng(3).standard_normal(len(t))
rausch = tiefpass_fft(rausch, 400, 2) * (0.25 + 0.2 * lfo2)
x = x + rausch * 2.0
# nahtlos: Anfang und Ende über 1 s kreuzblenden
n = SR
x[:n] = x[:n] * np.linspace(0, 1, n) + x[-n:] * np.linspace(1, 0, n)
x = x[:-n]
schreib(PAKET / "klaenge/atmo/drone.wav", stereo(x, 0.6, 23))

# --- Herzschlag (lub-dub) ---------------------------------------------------------
t = np.arange(int(0.9 * SR)) / SR
def schlag(t0, hz, amp):
    tt = np.clip(t - t0, 0, None)
    return amp * (t >= t0) * np.sin(2 * np.pi * hz * tt * (1 - 0.3 * tt)) * np.exp(-tt * 18)
x = schlag(0.0, 55, 1.0) + schlag(0.22, 48, 0.7)
x = tiefpass_fft(x, 180, 2)
schreib(PAKET / "klaenge/atmo/herzschlag.wav", stereo(x, 0.0))

# --- Schritte über einem Gang: 4 Schritte, mit Hall ------------------------------
dauer = 3.2
x = np.zeros(int(dauer * SR))
for i, t0 in enumerate([0.05, 0.62, 1.2, 1.77]):
    n = int(0.25 * SR)
    tt = np.arange(n) / SR
    thud = np.sin(2 * np.pi * 75 * tt) * np.exp(-tt * 30)
    klick = rng.standard_normal(n) * np.exp(-tt * 90) * 0.5
    s = tiefpass_fft(thud + klick, 1800, 2) * (0.8 + 0.1 * i)
    a = int(t0 * SR)
    x[a:a + n] += s
x = hall(x, 1.4, 0.45, 4)
schreib(PAKET / "klaenge/atmo/schritte.wav", stereo(x, 0.4, 7))

# --- Katalog ergänzen -------------------------------------------------------------
NEU = {
    "sirene/fern": ("Atmo & Alarm", "distant prison alarm siren, muffled wail with long reverb, slow swell in and out"),
    "sirene/nah": ("Atmo & Alarm", "prison alarm siren inside the building, bright wail, fast onset"),
    "atmo/drone": ("Atmo & Alarm", "dark low suspense drone, seamless loop, usable as background bed"),
    "atmo/herzschlag": ("Atmo & Alarm", "single low heartbeat, lub-dub"),
    "atmo/schritte": ("Atmo & Alarm", "four heavy footsteps in a concrete corridor with reverb"),
}
kp = PAKET / "klaenge/katalog.json"
kat = json.loads(kp.read_text(encoding="utf-8"))
if "Atmo & Alarm" not in kat["gruppen"]:
    kat["gruppen"].append("Atmo & Alarm")
liste = kat["klaenge"]
liste[:] = [k for k in liste if k["id"] not in NEU]
for kid, (gruppe, text) in NEU.items():
    with wave.open(str(PAKET / f"klaenge/{kid}.wav")) as w:
        roh = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).reshape(-1, 2)[:, 0] / 32768
    spitze = int(np.argmax(np.abs(roh)))
    laut = np.nonzero(np.abs(roh) > 0.02)[0]
    liste.append({"id": kid, "gruppe": gruppe, "art": [kid.split("/")[0]], "datei": f"klaenge/{kid}.wav", "varianten": 1,
                  "dauer": round(len(roh) / SR, 3), "spitze_s": round(spitze / SR, 3),
                  "einsatz_s": round((laut[0] if laut.size else 0) / SR, 3), "spitze_db": -1.0, "stimmbar": False,
                  "beschreibung_en": text, "quelle": "gedankenwerk synth (eigene Erzeugung)"})
kat["anzahl"] = len(liste)
kp.write_text(json.dumps(kat, ensure_ascii=False, indent=1), encoding="utf-8")
print("ok", len(liste))
