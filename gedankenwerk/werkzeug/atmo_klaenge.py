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


# --- Hundegebell (fern, zwei Hunde) -------------------------------------------------
def bell(f0, dauer=0.22):
    n = int(dauer * SR)
    tt = np.arange(n) / SR
    f = f0 * (1.25 - 0.45 * np.minimum(tt / dauer, 1))
    ph = 2 * np.pi * np.cumsum(f) / SR
    x = sum(np.sin(k * ph) / k ** 0.9 for k in range(1, 14))
    x = x + rng.standard_normal(n) * 0.6 * np.exp(-tt * 40)
    env = np.minimum(1, tt / 0.012) * np.exp(-tt * 9)
    x = x * env
    X = np.fft.rfft(x)
    fr = np.fft.rfftfreq(n, 1 / SR)
    X *= np.exp(-((fr - 1100) / 700) ** 2) * 1.6 + np.exp(-((fr - 2500) / 600) ** 2) * 0.7 + 0.15
    return np.fft.irfft(X, n)
dauer = 3.6
x = np.zeros(int(dauer * SR))
for t0, f0, amp in [(0.05, 330, 1), (0.42, 340, 0.9), (1.25, 300, 0.8), (1.6, 410, 0.6), (1.9, 400, 0.6), (2.6, 320, 0.9), (2.95, 330, 0.85)]:
    b = bell(f0) * amp
    a = int(t0 * SR)
    x[a:a + len(b)] += b
x = tiefpass_fft(x, 2600, 2)
x = hall(x, 1.8, 0.5, 5)
schreib(PAKET / "klaenge/atmo/bellen.wav", stereo(x, 0.6, 13))

# --- Wind im Wald --------------------------------------------------------------------
t = np.arange(int(8.0 * SR)) / SR
w = np.random.default_rng(9).standard_normal(len(t))
lfo = 0.55 + 0.45 * np.sin(2 * np.pi * t / 5.5) * np.sin(2 * np.pi * t / 3.1 + 0.7)
x = (tiefpass_fft(w, 700, 2) * 1.0 + tiefpass_fft(w, 2500, 1) * 0.15) * lfo
x = blende(x, 1.5, 2.0)
schreib(PAKET / "klaenge/atmo/wind.wav", stereo(x, 0.8, 19))

# --- Vögel am Morgen -------------------------------------------------------------------
dauer = 5.0
x = np.zeros(int(dauer * SR))
r = np.random.default_rng(11)
for k in range(16):
    t0 = r.uniform(0.1, 4.6)
    n = int(r.uniform(0.06, 0.14) * SR)
    tt = np.arange(n) / SR
    f = r.uniform(2800, 4200) + r.uniform(-1500, 1500) * tt / tt[-1]
    s = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.sin(np.pi * tt / tt[-1]) ** 2 * r.uniform(0.3, 1)
    a = int(t0 * SR)
    x[a:a + n] += s[: len(x) - a]
x = hall(x, 1.2, 0.35, 6)
schreib(PAKET / "klaenge/atmo/voegel.wav", stereo(x, 0.7, 9))

# --- Draht spannt und knackt -----------------------------------------------------------
dauer = 1.6
t = np.arange(int(dauer * SR)) / SR
x = np.zeros(len(t))
for t0, f in [(0.0, 1850), (0.35, 2630), (0.8, 2210), (1.05, 3120)]:
    tt = np.clip(t - t0, 0, None)
    x += (t >= t0) * (np.sin(2 * np.pi * f * tt) + 0.5 * np.sin(2 * np.pi * f * 2.76 * tt)) * np.exp(-tt * 7)
kn = np.random.default_rng(12).standard_normal(len(t)) * (0.5 + 0.5 * np.sin(2 * np.pi * 23 * t)) * np.exp(-((t - 0.6) / 0.4) ** 2)
x = x * 0.5 + tiefpass_fft(kn, 3000, 2) * 0.8
x = hall(x, 0.8, 0.3, 7)
schreib(PAKET / "klaenge/atmo/draht.wav", stereo(x, 0.4, 5))

# --- Rennen über Gras -------------------------------------------------------------------
dauer = 3.0
x = np.zeros(int(dauer * SR))
r = np.random.default_rng(13)
for i in range(18):
    t0 = 0.05 + i * 0.155 + r.uniform(-0.02, 0.02)
    n = int(0.12 * SR)
    tt = np.arange(n) / SR
    s = (np.sin(2 * np.pi * 70 * tt) * 0.8 + r.standard_normal(n) * 0.5) * np.exp(-tt * 38)
    a = int(t0 * SR)
    if a + n < len(x):
        x[a:a + n] += tiefpass_fft(s, 1400, 2) * r.uniform(0.6, 1)
schreib(PAKET / "klaenge/atmo/rennen.wav", stereo(x, 0.3, 5))

# --- Katalog ergänzen -------------------------------------------------------------
NEU = {
    "sirene/fern": ("Atmo & Alarm", "distant prison alarm siren, muffled wail with long reverb, slow swell in and out"),
    "sirene/nah": ("Atmo & Alarm", "prison alarm siren inside the building, bright wail, fast onset"),
    "atmo/drone": ("Atmo & Alarm", "dark low suspense drone, seamless loop, usable as background bed"),
    "atmo/herzschlag": ("Atmo & Alarm", "single low heartbeat, lub-dub"),
    "atmo/schritte": ("Atmo & Alarm", "four heavy footsteps in a concrete corridor with reverb"),
    "atmo/bellen": ("Atmo & Alarm", "two dogs barking in the distance, with reverb"),
    "atmo/wind": ("Atmo & Alarm", "night wind in a forest, slow gusts"),
    "atmo/voegel": ("Atmo & Alarm", "morning birds chirping"),
    "atmo/draht": ("Atmo & Alarm", "metal wire straining and pinging"),
    "atmo/rennen": ("Atmo & Alarm", "running footsteps on grass"),
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
