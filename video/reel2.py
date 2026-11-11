#!/usr/bin/env python3
"""Reel v2: generierte Szenenbilder mit Kamerafahrt, ausdrucksstarkes VoiceOver (Chatterbox),
wortgenaue Untertitel, Nummern-Reveals, Musik mit Ducking.

  python3 video/images.py video/reels/morgen_v2.json   # Bilder (einmalig)
  python3 video/reel2.py  video/reels/morgen_v2.json   # Video
"""
import hashlib, json, math, random, subprocess, sys, tempfile, wave
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

sys.path.insert(0, str(Path(__file__).resolve().parent))
from reel import (W, H, FPS, SR, font, draw_text_center, load_wav, trim_silence, word_times,
                  synth_music, sfx_whoosh, sfx_hit, hex2rgb, ease_out_back, clamp)

ROOT = Path(__file__).resolve().parent
LINE_GAP, SECTION_GAP, XFADE = 0.15, 0.30, 0.30
CAP_WORDS = 4
random.seed(3)


# ---------- Stimme ----------
_tts = None
NUM = {"1": "eins", "2": "zwei", "3": "drei", "4": "vier", "5": "fünf", "8": "acht"}


def norm(text):
    import re
    t = text.lower().replace("…", " ")
    t = re.sub(r"(\d+)", lambda m: " " + NUM.get(m.group(1), m.group(1)) + " ", t)
    return re.sub(r"[^a-zäöüß ]", " ", t).split()


def score(wav, text, model):
    import difflib
    a = load_wav(wav)[::3]
    hyp = " ".join(s.text for s in model.transcribe(a, language="de")[0])
    return difflib.SequenceMatcher(None, norm(text), norm(hyp)).ratio(), hyp


def tts(text, ref, exaggeration, cache_dir, model, tries=8):
    """Erzeugt den Satz, prüft ihn per Spracherkennung und wiederholt bei Fehlern."""
    global _tts
    key = hashlib.md5(f"{text}|{ref}|{exaggeration}".encode()).hexdigest()[:12]
    f = cache_dir / f"{key}.wav"
    if f.exists() and score(f, text, model)[0] >= 0.85:
        return f
    import soundfile as sf, torch
    if _tts is None:
        from chatterbox.mtl_tts import ChatterboxMultilingualTTS
        _tts = ChatterboxMultilingualTTS.from_pretrained(device="cpu")
    best = (-1, None, "")
    for k in range(tries):
        torch.manual_seed(1000 + k)
        w = _tts.generate(text, language_id="de", audio_prompt_path=str(ref),
                          exaggeration=exaggeration, cfg_weight=0.35 if exaggeration >= 0.8 else 0.45)
        cand = cache_dir / f"{key}_try{k}.wav"
        sf.write(cand, w.squeeze(0).numpy(), _tts.sr)
        sc, hyp = score(cand, text, model)
        print(f"    tts [{sc:.2f}] {text}  ->  {hyp.strip()}", flush=True)
        if sc > best[0]:
            best = (sc, cand, hyp)
        if sc >= 0.9:
            break
    best[1].replace(f)
    for c in cache_dir.glob(f"{key}_try*.wav"):
        c.unlink()
    return f


def speed_up(a, tempo):
    if abs(tempo - 1) < 1e-3:
        return a
    p = subprocess.run(["ffmpeg", "-v", "error", "-f", "f32le", "-ar", str(SR), "-ac", "1", "-i", "-",
                        "-af", f"atempo={tempo}", "-f", "f32le", "-"], input=a.tobytes(), capture_output=True, check=True)
    return np.frombuffer(p.stdout, np.float32).copy()


# ---------- Timeline ----------
def build_timeline(cfg, cfg_path):
    from faster_whisper import WhisperModel
    cache = cfg_path.with_name(cfg_path.stem + "_tts"); cache.mkdir(exist_ok=True)
    ref = ROOT / cfg["voice_ref"]
    model = WhisperModel("small", device="cpu", compute_type="int8")
    t, voice, caps, shots, sections = 0.25, [], [], [], []
    for si, sec in enumerate(cfg["sections"]):
        if si:
            t += SECTION_GAP
        sec_start = t
        for li, line in enumerate(sec["lines"]):
            if li:
                t += LINE_GAP
            a = speed_up(trim_silence(load_wav(tts(line.get("say", line["text"]), ref, line.get("exaggeration", 0.6), cache, model))),
                         cfg.get("tempo", 1.0))
            voice.append((t, a))
            words = [(w, t + s, t + e) for w, s, e in word_times(a, line["text"], model)]
            # Untertitel-Chunks
            cur = []
            for w in words:
                cur.append(w)
                if len(cur) >= CAP_WORDS or w[0][-1] in ".,:!?…":
                    caps.append(cur); cur = []
            if cur:
                caps.append(cur)
            dur = len(a) / SR
            imgs = line["images"]
            for k, key in enumerate(imgs):
                # Bildwechsel am Wortanfang, der der gleichmäßigen Teilung am nächsten ist
                target = t + dur * k / len(imgs)
                start = t if k == 0 else min((w[1] for w in words), key=lambda x: abs(x - target))
                shots.append({"start": sec_start if (li == 0 and k == 0) else start, "key": key, "sec": si,
                              "reveal": bool(sec.get("badge")) and li == 0 and k == 0})
            t += dur
        sections.append((sec_start, t))
    total = t + 1.0
    for i, s in enumerate(shots):
        s["end"] = shots[i + 1]["start"] if i + 1 < len(shots) else total
    caps_t = []
    for i, c in enumerate(caps):
        end = caps[i + 1][0][1] if i + 1 < len(caps) else c[-1][2] + 0.6
        end = min(end, c[-1][2] + 0.6)
        caps_t.append({"start": c[0][1], "end": end, "words": c})
    return voice, shots, caps_t, sections, total


# ---------- Bild ----------
def load_cover(path, scale=1.18):
    im = Image.open(path).convert("RGB")
    s = max(W * scale / im.width, H * scale / im.height)
    im = im.resize((int(im.width * s), int(im.height * s)), Image.LANCZOS)
    return im.filter(ImageFilter.UnsharpMask(radius=2, percent=60, threshold=2))


def kenburns(im, p, mode):
    """p 0..1, mode bestimmt Richtung. Gibt W x H Ausschnitt zurück."""
    e = 0.5 - 0.5 * math.cos(math.pi * p)  # sanft
    z0, z1, dx, dy = {0: (1.0, 1.12, -1, 0), 1: (1.12, 1.0, 1, -1),
                      2: (1.04, 1.14, 1, 1), 3: (1.14, 1.04, -1, 1)}[mode]
    z = z0 + (z1 - z0) * e
    cw, ch = im.width / z, im.height / z
    mx, my = (im.width - cw) / 2, (im.height - ch) / 2
    cx = mx + dx * mx * 0.5 * (e - 0.5) * 2
    cy = my + dy * my * 0.5 * (e - 0.5) * 2
    box = (cx, cy, cx + cw, cy + ch)
    return im.resize((W, H), Image.BILINEAR, box=box)


def overlays():
    y = np.linspace(0, 1, H)[:, None]
    a = np.clip((y - 0.52) / 0.48, 0, 1) ** 1.4 * 200 + np.clip((0.12 - y) / 0.12, 0, 1) * 120
    a = np.repeat(a, W, axis=1)
    x = np.linspace(-1, 1, W)[None, :]
    yy = np.linspace(-1, 1, H)[:, None]
    vig = np.clip((np.sqrt(x ** 2 + yy ** 2) - 0.75) * 160, 0, 120)
    alpha = np.clip(a + vig, 0, 230).astype(np.uint8)
    ov = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    ov.putalpha(Image.fromarray(alpha))
    return ov


def render(cfg, cfg_path, shots, caps, total, out):
    img_dir = cfg_path.with_name(cfg_path.stem + "_img")
    covers = {k: load_cover(img_dir / f"{k}.png") for k in {s["key"] for s in shots}}
    secs = cfg["sections"]
    shade = overlays()
    ff = subprocess.Popen(["ffmpeg", "-y", "-v", "error", "-f", "rawvideo", "-pix_fmt", "rgb24",
                           "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-", "-c:v", "libx264",
                           "-preset", "medium", "-crf", "18", "-pix_fmt", "yuv420p", str(out)],
                          stdin=subprocess.PIPE)
    n = int(total * FPS)
    si = ci = 0
    for fi in range(n):
        t = fi / FPS
        while si + 1 < len(shots) and t >= shots[si + 1]["start"]:
            si += 1
        sh = shots[si]
        sec = secs[sh["sec"]]
        acc = hex2rgb(sec.get("accent", "#ffd60a"))
        lt = t - sh["start"]

        def frame_of(i, tt):
            s = shots[i]
            d = s["end"] - s["start"] + XFADE
            return kenburns(covers[s["key"]], clamp((tt - s["start"]) / d), i % 4)

        cur = frame_of(si, t)
        # Überblendung mit leichtem Push-In
        if si > 0 and lt < XFADE:
            q = lt / XFADE
            prev = frame_of(si - 1, t)
            z = 1.06 - 0.06 * q
            cz = cur.resize((int(W * z), int(H * z)), Image.BILINEAR).crop(
                (int((W * z - W) / 2), int((H * z - H) / 2), int((W * z - W) / 2) + W, int((H * z - H) / 2) + H))
            cur = Image.blend(prev, cz, 0.5 - 0.5 * math.cos(math.pi * q))
        frame = cur.convert("RGBA")
        frame.alpha_composite(shade)

        # Nummern-Reveal
        if sh["reveal"] and lt < 1.4:
            k = clamp(lt / 0.28)
            pop = ease_out_back(k, 2.5)
            fade = 1 - clamp((lt - 1.0) / 0.4)
            dark = Image.new("RGBA", (W, H), (0, 0, 0, int(110 * fade)))
            frame.alpha_composite(dark)
            layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
            d = ImageDraw.Draw(layer)
            size = max(10, int(520 * (0.35 + 0.65 * pop)))
            f = font(size)
            txt = sec["badge"]
            tw = d.textlength(txt, font=f)
            shake = (1 - clamp(lt / 0.3)) * 22
            dx, dy = random.uniform(-shake, shake), random.uniform(-shake, shake)
            d.text(((W - tw) / 2 + dx, H * 0.30 - size * 0.55 + dy), txt, font=f, fill=(*acc, 255),
                   stroke_width=20, stroke_fill=(0, 0, 0, 255))
            if fade < 1:
                layer.putalpha(layer.split()[3].point(lambda v: int(v * fade)))
            frame.alpha_composite(layer)

        # Label oben
        if sec.get("label"):
            appear = clamp((lt - 0.9) / 0.3) if sh["reveal"] else 1.0
            if appear > 0:
                lab = Image.new("RGBA", (W, H), (0, 0, 0, 0))
                d = ImageDraw.Draw(lab)
                f = font(58)
                txt = f'{sec["badge"]}  {sec["label"]}'
                tw = d.textlength(txt, font=f)
                y = 150 - 40 * (1 - appear)
                d.rounded_rectangle(((W - tw) / 2 - 34, y, (W + tw) / 2 + 34, y + 92), 24, fill=(*acc, int(235 * appear)))
                d.text(((W - tw) / 2, y + 12), txt, font=f, fill=(0, 0, 0, int(255 * appear)))
                frame.alpha_composite(lab)

        # Untertitel
        while ci + 1 < len(caps) and t >= caps[ci + 1]["start"]:
            ci += 1
        c = caps[ci]
        if c["start"] - 0.05 <= t < c["end"]:
            ct = t - c["start"]
            pop = ease_out_back(clamp(ct / 0.18), 1.6)
            active = max([k for k, w in enumerate(c["words"]) if t >= w[1]] or [0])
            text = " ".join(w[0] for w in c["words"]).upper()
            draw_text_center(frame, text, H * 0.70, int(104 * (0.8 + 0.2 * pop)), (255, 255, 255),
                             stroke=11, highlight=active)

        # Fortschritt
        d = ImageDraw.Draw(frame)
        d.rectangle((0, 0, W, 12), fill=(0, 0, 0, 140))
        d.rectangle((0, 0, int(W * t / total), 12), fill=(*acc, 255))

        rgb = frame.convert("RGB")
        if sh["reveal"] and lt < 0.15:
            rgb = Image.blend(rgb, Image.new("RGB", (W, H), (255, 255, 255)), 0.7 * (1 - lt / 0.15))
        ff.stdin.write(rgb.tobytes())
        if fi % 150 == 0:
            print(f"  frame {fi}/{n}", flush=True)
    ff.stdin.close(); ff.wait()


def mix(cfg, voice, shots, sections, total, out_wav):
    n = int(total * SR) + SR
    v = np.zeros(n, np.float32)
    for t, a in voice:
        s = int(t * SR); v[s:s + len(a)] += a
    peak = np.percentile(np.abs(v[v != 0]), 99.5) if v.any() else 1
    v *= 0.7 / max(peak, 1e-6)
    m = synth_music(total, cfg.get("bpm", 112)); m = np.pad(m, (0, n - len(m)))
    env = np.convolve(np.abs(v), np.ones(4800) / 4800, mode="same")
    duck = 1 - 0.6 * np.clip(env / 0.03, 0, 1)
    fx = np.zeros(n, np.float32)
    wh, hit = sfx_whoosh(), sfx_hit()
    for sh in shots[1:]:
        s = max(0, int((sh["start"] - 0.5) * SR))
        g = 0.0 if sh["reveal"] else 0.18
        fx[s:s + len(wh)] += wh[: n - s] * g
    for sh in shots:
        if sh["reveal"]:
            s = int(sh["start"] * SR); fx[s:s + len(hit)] += hit[: n - s] * 0.75
            s2 = max(0, int((sh["start"] - 0.4) * SR)); fx[s2:s2 + len(wh)] += wh[: n - s2] * 0.5
    fade = np.ones(n, np.float32); fl = int(0.8 * SR); end = int(total * SR)
    fade[end - fl:end] = np.linspace(1, 0, fl); fade[end:] = 0
    y = np.tanh((v + m * duck * 0.45 + fx * 0.6) * fade * 1.05) * 0.95
    with wave.open(str(out_wav), "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((np.clip(y, -1, 1) * 32767).astype(np.int16).tobytes())


def main():
    cfg_path = Path(sys.argv[1]).resolve()
    cfg = json.loads(cfg_path.read_text())
    out = ROOT / cfg["output"]; out.parent.mkdir(parents=True, exist_ok=True)
    tmp = Path(tempfile.mkdtemp())
    print("1/4 VoiceOver + Timings …", flush=True)
    voice, shots, caps, sections, total = build_timeline(cfg, cfg_path)
    print(f"    {len(shots)} Bilder in {total:.1f}s (Ø {total / len(shots):.1f}s pro Bild)", flush=True)
    print("2/4 Audio …", flush=True)
    mix(cfg, voice, shots, sections, total, tmp / "mix.wav")
    print("3/4 Video …", flush=True)
    render(cfg, cfg_path, shots, caps, total, tmp / "v.mp4")
    print("4/4 Mux …", flush=True)
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", tmp / "v.mp4", "-i", tmp / "mix.wav", "-c:v", "copy",
                    "-c:a", "aac", "-b:a", "192k", "-ar", "48000", "-movflags", "+faststart", "-shortest", str(out)],
                   check=True)
    print(out)


if __name__ == "__main__":
    main()
