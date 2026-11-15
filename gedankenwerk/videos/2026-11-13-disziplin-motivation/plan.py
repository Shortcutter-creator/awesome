"""Plant die Klimmzüge passend zu den Wortzeiten → wiederholungen.json (Video) + Klang-Cues (klaenge.json).
Aufruf: python plan.py <videoordner> <src-ordner>"""
import json
import sys
from pathlib import Path

V, SRC = Path(sys.argv[1]), Path(sys.argv[2])
d = json.loads((V / "woerter.json").read_text())
W = d["words"]


def wort(w, n=1, ende=False):
    n_ = lambda s: "".join(c for c in s.lower() if c.isalnum())
    m = [x for x in W if n_(x["w"]) == n_(w)]
    return m[n - 1]["e" if ende else "s"]


start = wort("geht's", ende=True) + 0.15
t_lang = wort("langsamer")
t_weg = wort("weg")
t_los = wort("los", 2)
ende = d["dauer"] + 2.4

# Motivation: schnell, wird langsamer, Wiederholungen werden kürzer, Pausen dazwischen
mot, t, dur = [], start, 0.62
while True:
    if t < t_lang:
        amp, pause = 1.0, 0.0
    else:
        k = min(1.0, (t - t_lang) / max(0.5, t_los - t_lang))
        amp, pause = 1.0 - 0.6 * k, 0.15 + 0.9 * k
    if t + dur > t_los - 0.4:
        break
    mot.append([round(t, 3), round(t + dur, 3), round(amp, 3)])
    t += dur + pause
    dur = min(1.6, dur * (1.11 if t < t_lang else 1.14))

# Disziplin: gleichmäßig bis zum Ende
dis, t = [], start + 0.2
while t + 1.5 < ende:
    dis.append([round(t, 3), round(t + 1.5, 3), 1.0])
    t += 1.5 + 0.08

plan = {"start": start, "motivation": {"reps": mot, "loslassen": t_los}, "disziplin": {"reps": dis}}
(SRC / "wiederholungen.json").write_text(json.dumps(plan, indent=1))
voll_m = sum(1 for r in mot if r[2] >= 0.8)
print(f"Start {start:.2f}s, Motivation {len(mot)} Versuche ({voll_m} volle), loslassen {t_los:.2f}s; Disziplin {len(dis)} Wiederholungen")
ueberholt = next((r[1] for i, r in enumerate(dis) if i + 1 > voll_m), None)
print(f"Disziplin überholt bei {ueberholt:.2f}s")

# Klänge: jeder volle Klimmzug oben ein Tick (Motivation hell, Disziplin dunkel und gleichmäßig)
cues = [
    {"klang": "whoosh_big/thump_deep", "t": 0.05},
    {"klang": "cut_hit/kick", "wort": "Motivation", "n": 1, "pegel": -16},
    {"klang": "cut_hit/kick", "wort": "Disziplin", "n": 1, "pegel": -16},
    {"klang": "riser/rush", "wort": "Rakete", "ausrichtung": "start", "laenge": 1.2, "pegel": -24},
    {"klang": "downlifter/air_fall", "wort": "langsamer"},
    {"klang": "impact/deep", "wort": "los", "n": 2, "versatz": 0.35, "pegel": -15},
    {"klang": "sub_drop/punch", "wort": "Boden", "pegel": -17},
    {"klang": "mallet/up4", "wort": "geschafft"},
    {"klang": "ui_pop/soft", "wort": "Gefühl"},
    {"klang": "ui_pop/soft", "wort": "Entscheidung"},
    {"klang": "logo_sting/soft_bloom", "wort": "weitermachst", "ausrichtung": "start"},
]
for s, e, a in mot:
    if a >= 0.8:
        cues.append({"klang": "click/tink", "t": round((s + e) / 2, 3), "pegel": -24})
for s, e, a in dis:
    cues.append({"klang": "knock/wood", "t": round((s + e) / 2, 3), "pegel": -24})
(V / "klaenge.json").write_text(json.dumps({"bett": {"klang": "musikbett/bett_loop", "lautstaerke": 0.15}, "cues": cues}, ensure_ascii=False, indent=1))
print(len(cues), "Klänge")
