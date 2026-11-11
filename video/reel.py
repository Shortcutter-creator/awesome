#!/usr/bin/env python3
"""Erzeugt ein komplettes 9:16-Reel aus einem Skript (JSON):
VoiceOver (piper) -> Wort-Timings (faster-whisper) -> animierte Szenen (Pillow) -> Beat + SFX -> MP4.

  python3 video/reel.py video/reels/morgen.json
"""
import json, math, random, re, subprocess, sys, tempfile, urllib.request, wave
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parent
VOICES = ROOT / "voices"
EMOJI_DIR = ROOT / "emoji_cache"
W, H, FPS, SR = 1080, 1920, 30, 48000
FONT = "/usr/share/fonts/opentype/inter/InterDisplay-Black.otf"
EMOJI_URL = "https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.1.0/assets/svg/{}.svg"
LINE_GAP, SECTION_GAP = 0.10, 0.22
random.seed(7)


# ---------- helpers ----------
def hex2rgb(h):
    h = h.lstrip("#")
    return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))


def ease_out_back(t, s=2.2):
    t -= 1
    return t * t * ((s + 1) * t + s) + 1


def clamp(x, a=0.0, b=1.0):
    return max(a, min(b, x))


_emoji = {}


def emoji_img(code, size=560):
    key = (code, size)
    if key in _emoji:
        return _emoji[key]
    EMOJI_DIR.mkdir(exist_ok=True)
    svg = EMOJI_DIR / f"{code}.svg"
    if not svg.exists():
        svg.write_bytes(urllib.request.urlopen(EMOJI_URL.format(code)).read())
    import cairosvg, io
    png = cairosvg.svg2png(url=str(svg), output_width=size, output_height=size)
    im = Image.open(io.BytesIO(png)).convert("RGBA")
    # weicher Schatten
    sh = Image.new("RGBA", (size + 80, size + 80), (0, 0, 0, 0))
    a = im.split()[3].point(lambda v: int(v * 0.55))
    sh.paste((0, 0, 0, 255), (40, 60), a)
    sh = sh.filter(ImageFilter.GaussianBlur(18))
    sh.alpha_composite(im, (40, 40))
    _emoji[key] = sh
    return sh


_fonts = {}


def font(size):
    if size not in _fonts:
        _fonts[size] = ImageFont.truetype(FONT, size)
    return _fonts[size]


# ---------- audio ----------
def tts(text, voice, speed, out):
    subprocess.run([sys.executable, "-m", "piper", "-m", str(VOICES / f"{voice}.onnx"),
                    "--length-scale", str(round(1 / speed, 3)), "-f", str(out)],
                   input=text.encode(), capture_output=True, check=True)


def load_wav(path):
    pcm = subprocess.run(["ffmpeg", "-v", "error", "-i", str(path), "-f", "f32le", "-ac", "1",
                          "-ar", str(SR), "-"], capture_output=True, check=True).stdout
    return np.frombuffer(pcm, np.float32).copy()


def trim_silence(x, thr=0.01):
    idx = np.where(np.abs(x) > thr)[0]
    if not len(idx):
        return x
    return x[max(0, idx[0] - int(0.02 * SR)): idx[-1] + int(0.06 * SR)]


def word_times(audio, text, model):
    """Wort-Timings aus Whisper, auf die Skript-Wörter gemappt."""
    words = text.split()
    a16 = audio[::3]  # 48k -> 16k
    segs, _ = model.transcribe(a16, language="de", word_timestamps=True)
    ww = [w for s in segs for w in (s.words or [])]
    dur = len(audio) / SR
    if len(ww) == len(words):
        return [(words[i], ww[i].start, ww[i].end) for i in range(len(words))]
    # Fallback: proportional nach Zeichenlänge
    lens = [len(w) + 2 for w in words]
    tot, t, out = sum(lens), 0.0, []
    for w, l in zip(words, lens):
        d = dur * l / tot
        out.append((w, t, t + d))
        t += d
    return out


def synth_music(dur, bpm):
    n = int(dur * SR)
    out = np.zeros(n, np.float32)
    beat = 60 / bpm
    t_k = np.arange(int(0.35 * SR)) / SR
    kick = np.sin(2 * np.pi * (45 + 110 * np.exp(-t_k * 28)) * t_k) * np.exp(-t_k * 9)
    t_h = np.arange(int(0.05 * SR)) / SR
    hat = np.random.default_rng(1).standard_normal(len(t_h)) * np.exp(-t_h * 90)
    hat = np.diff(hat, prepend=0)  # hochpass-artig
    t_c = np.arange(int(0.18 * SR)) / SR
    clap = np.random.default_rng(2).standard_normal(len(t_c)) * np.exp(-t_c * 25)
    # Bass-Puls (Moll-Feeling: A - F - C - G)
    roots = [55.0, 43.65, 65.41, 49.0]
    i, t = 0, 0.0
    while t < dur:
        s = int(t * SR)
        def add(sig, gain, at=s):
            e = min(n, at + len(sig))
            if at < n:
                out[at:e] += gain * sig[: e - at]
        add(kick, 0.9)
        add(hat, 0.18, int((t + beat / 2) * SR))
        if i % 2 == 1:
            add(clap, 0.22)
        f = roots[(i // 8) % 4]
        tb = np.arange(int(beat * 0.9 * SR)) / SR
        bass = np.tanh(2.5 * np.sin(2 * np.pi * f * tb)) * np.exp(-tb * 4)
        add(bass, 0.22, int((t + beat / 2) * SR))
        t += beat
        i += 1
    return out * 0.5


def sfx_whoosh():
    t = np.arange(int(0.45 * SR)) / SR
    nz = np.random.default_rng(3).standard_normal(len(t))
    env = np.sin(np.pi * t / t[-1]) ** 2
    # einfacher Bandpass via gleitender Mittelwert-Differenz
    k = 6
    nz = np.convolve(nz, np.ones(k) / k, mode="same") - np.convolve(nz, np.ones(40) / 40, mode="same")
    return (nz * env * 0.9).astype(np.float32)


def sfx_hit():
    t = np.arange(int(0.6 * SR)) / SR
    boom = np.sin(2 * np.pi * (38 + 90 * np.exp(-t * 18)) * t) * np.exp(-t * 6)
    crack = np.random.default_rng(4).standard_normal(len(t)) * np.exp(-t * 40) * 0.5
    return np.tanh(1.8 * (boom + crack)).astype(np.float32)


def sfx_pop():
    t = np.arange(int(0.08 * SR)) / SR
    return (np.sin(2 * np.pi * (900 - 5000 * t) * t) * np.exp(-t * 60) * 0.35).astype(np.float32)


# ---------- timeline ----------
def build_timeline(cfg, tmp):
    from faster_whisper import WhisperModel
    model = WhisperModel("small", device="cpu", compute_type="int8")
    voice, speed = cfg.get("voice", "de_DE-thorsten-high"), cfg.get("speed", 1.1)
    t, voice_track, shots, sections = 0.0, [], [], []
    for si, sec in enumerate(cfg["sections"]):
        if si:
            t += SECTION_GAP
        sec_start = t
        for li, line in enumerate(sec["lines"]):
            if li:
                t += LINE_GAP
            wav = tmp / f"s{si}_{li}.wav"
            tts(line["text"], line.get("voice", voice), line.get("speed", speed), wav)
            a = trim_silence(load_wav(wav))
            voice_track.append((t, a))
            words = [(w, t + s, t + e) for w, s, e in word_times(a, line["text"], model)]
            # Wörter in Bild-Chunks (max 3 Wörter, Bruch nach Satzzeichen)
            chunk, chunks = [], []
            for w in words:
                chunk.append(w)
                if len(chunk) >= 3 or re.search(r"[.,:!?]$", w[0]):
                    chunks.append(chunk)
                    chunk = []
            if chunk:
                chunks.append(chunk)
            line_end = t + len(a) / SR
            for ci, ch in enumerate(chunks):
                start = ch[0][1] if ci else t
                end = chunks[ci + 1][0][1] if ci + 1 < len(chunks) else line_end
                shots.append({"start": start, "end": end, "words": ch, "sec": si,
                              "emoji": line["emoji"][ci % len(line["emoji"])],
                              "reveal": bool(sec.get("badge")) and li == 0 and ci == 0})
            t = line_end
        sections.append((sec_start, t))
    # Lücken schließen: jeder Shot läuft bis zum nächsten
    for i in range(len(shots) - 1):
        shots[i]["end"] = shots[i + 1]["start"]
    total = t + 0.6
    shots[-1]["end"] = total
    return voice_track, shots, sections, total


# ---------- render ----------
def gradient(c1, c2):
    y = np.linspace(0, 1, H)[:, None, None]
    x = np.linspace(0, 1, W)[None, :, None]
    r = np.sqrt((x - 0.5) ** 2 + (y - 0.38) ** 2 * 0.6)
    m = np.clip(r * 1.6, 0, 1)
    img = np.array(c1)[None, None] * (1 - m) + np.array(c2)[None, None] * m
    return Image.fromarray(img.astype(np.uint8), "RGB").convert("RGBA")


def rays_layer(color):
    S = 2400
    im = Image.new("RGBA", (S, S), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    c = S // 2
    for k in range(16):
        a0 = k * 2 * math.pi / 16
        a1 = a0 + math.pi / 16
        d.polygon([(c, c), (c + S * math.cos(a0), c + S * math.sin(a0)),
                   (c + S * math.cos(a1), c + S * math.sin(a1))], fill=(*color, 34))
    return im


def draw_text_center(img, text, y, size, fill, stroke=10, highlight=None):
    """Zeichnet Wörter zentriert; highlight = Index des aktiven Worts."""
    d = ImageDraw.Draw(img)
    f = font(size)
    words = text.split()
    space = size * 0.28
    widths = [d.textlength(w, font=f) for w in words]
    # Zeilenumbruch bei max Breite
    lines, cur, cw = [], [], 0
    for i, w in enumerate(widths):
        if cur and cw + space + w > W - 120:
            lines.append(cur)
            cur, cw = [], 0
        cw += (space if cur else 0) + w
        cur.append(i)
    lines.append(cur)
    lh = size * 1.12
    y0 = y - lh * len(lines) / 2
    for li, idxs in enumerate(lines):
        lw = sum(widths[i] for i in idxs) + space * (len(idxs) - 1)
        x = (W - lw) / 2
        for i in idxs:
            col = (255, 214, 10) if i == highlight else fill
            d.text((x, y0 + li * lh), words[i], font=f, fill=col,
                   stroke_width=stroke, stroke_fill=(0, 0, 0))
            x += widths[i] + space


def render(cfg, shots, sections, total, out_path):
    secs = cfg["sections"]
    bgs = [gradient(hex2rgb(s["colors"][0]), hex2rgb(s["colors"][1])) for s in secs]
    bgs_alt = [gradient(tuple(int(v * 0.8) for v in hex2rgb(s["colors"][0])), hex2rgb(s["colors"][1])) for s in secs]
    rays = [rays_layer((255, 255, 255)) for _ in secs]
    nframes = int(total * FPS)
    ff = subprocess.Popen(["ffmpeg", "-y", "-v", "error", "-f", "rawvideo", "-pix_fmt", "rgb24",
                           "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-", "-c:v", "libx264",
                           "-preset", "medium", "-crf", "19", "-pix_fmt", "yuv420p", str(out_path)],
                          stdin=subprocess.PIPE)
    si_shot = 0
    for fi in range(nframes):
        t = fi / FPS
        while si_shot + 1 < len(shots) and t >= shots[si_shot + 1]["start"]:
            si_shot += 1
        sh = shots[si_shot]
        sec = secs[sh["sec"]]
        lt = t - sh["start"]  # Zeit seit Schnitt
        p = clamp(lt / 0.22)
        pop = ease_out_back(p)

        # Hintergrund + rotierende Strahlen (abwechselnde Variante je Schnitt -> Bildwechsel)
        frame = (bgs if si_shot % 2 == 0 else bgs_alt)[sh["sec"]].copy()
        ang = (t * 18 + si_shot * 23) % 360
        r = rays[sh["sec"]].rotate(ang, resample=Image.BILINEAR)
        frame.alpha_composite(r, (int((W - r.width) / 2), int(H * 0.38 - r.height / 2)))

        # Kamera-Shake + Punch-Zoom bei jedem Schnitt
        shake = (1 - clamp(lt / 0.25)) * (26 if sh["reveal"] else 10)
        dx, dy = random.uniform(-shake, shake), random.uniform(-shake, shake)
        zoom = 1.0 + 0.06 * lt  # langsames Reinzoomen

        if sh["reveal"]:
            # Riesige Nummer knallt rein
            txt = sec["badge"]
            s = int(560 * (0.4 + 0.6 * pop) * (1 + 0.04 * lt))
            layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
            d = ImageDraw.Draw(layer)
            f = font(max(10, s))
            tw = d.textlength(txt, font=f)
            d.text(((W - tw) / 2 + dx, H * 0.36 - s * 0.6 + dy), txt, font=f, fill=(255, 255, 255),
                   stroke_width=18, stroke_fill=(0, 0, 0))
            frame.alpha_composite(layer)
        else:
            em = emoji_img(sh["emoji"])
            sc = (0.3 + 0.7 * pop) * zoom
            ew = max(4, int(em.width * sc))
            e2 = em.resize((ew, ew), Image.BILINEAR)
            wob = math.sin(t * 6 + si_shot) * 4
            e2 = e2.rotate(wob, resample=Image.BILINEAR, expand=False)
            frame.alpha_composite(e2, (int((W - ew) / 2 + dx), int(H * 0.36 - ew / 2 + dy)))

        # Section-Label oben
        if sec.get("label"):
            lab = Image.new("RGBA", (W, H), (0, 0, 0, 0))
            d = ImageDraw.Draw(lab)
            f = font(64)
            txt = f'{sec.get("badge", "")}  {sec["label"]}'
            tw = d.textlength(txt, font=f)
            d.rounded_rectangle(((W - tw) / 2 - 36, 150, (W + tw) / 2 + 36, 250), 26, fill=(0, 0, 0, 170))
            d.text(((W - tw) / 2, 160), txt, font=f, fill=(255, 255, 255))
            frame.alpha_composite(lab)

        # Untertitel (aktives Wort gelb), Pop-In
        words = sh["words"]
        active = 0
        for k, (_, ws, _) in enumerate(words):
            if t >= ws:
                active = k
        text = " ".join(w for w, _, _ in words).upper()
        size = int(118 * (0.75 + 0.25 * pop))
        draw_text_center(frame, text, H * 0.70 + dy * 0.5, size, (255, 255, 255), stroke=12, highlight=active)

        # Fortschrittsbalken oben
        d = ImageDraw.Draw(frame)
        d.rectangle((0, 0, W, 14), fill=(0, 0, 0, 120))
        d.rectangle((0, 0, int(W * t / total), 14), fill=(255, 214, 10))

        # Weißer Blitz beim Schnitt (stärker bei Nummern)
        fl = (0.85 if sh["reveal"] else 0.35) * (1 - clamp(lt / (0.12 if not sh["reveal"] else 0.2)))
        rgb = frame.convert("RGB")
        if fl > 0:
            rgb = Image.blend(rgb, Image.new("RGB", (W, H), (255, 255, 255)), fl)
        ff.stdin.write(rgb.tobytes())
        if fi % 150 == 0:
            print(f"  frame {fi}/{nframes}", flush=True)
    ff.stdin.close()
    ff.wait()


def mix_audio(cfg, voice_track, shots, sections, total, out_wav):
    n = int(total * SR) + SR
    v = np.zeros(n, np.float32)
    for t, a in voice_track:
        s = int(t * SR)
        v[s:s + len(a)] += a
    m = synth_music(total, cfg.get("bpm", 124))
    m = np.pad(m, (0, n - len(m)))
    # Ducking: Musik leiser, wenn Stimme spricht
    env = np.convolve(np.abs(v), np.ones(4800) / 4800, mode="same")
    duck = 1 - 0.55 * np.clip(env / 0.03, 0, 1)
    fx = np.zeros(n, np.float32)
    wh, hit, pop = sfx_whoosh(), sfx_hit(), sfx_pop()
    for si, (ss, _) in enumerate(sections):
        if si:
            s = max(0, int((ss - 0.3) * SR))
            fx[s:s + len(wh)] += wh[: n - s] * 0.5
    for sh in shots:
        s = int(sh["start"] * SR)
        src = hit if sh["reveal"] else pop
        fx[s:s + len(src)] += src[: n - s] * (0.8 if sh["reveal"] else 0.6)
    # Fade out
    fade = np.ones(n, np.float32)
    fl = int(0.5 * SR)
    end = int(total * SR)
    fade[end - fl:end] = np.linspace(1, 0, fl)
    fade[end:] = 0
    mix = (v * 1.15 + m * duck * 0.55 + fx * 0.6) * fade
    mix = np.tanh(mix * 1.1) * 0.95
    pcm = (np.clip(mix, -1, 1) * 32767).astype(np.int16)
    with wave.open(str(out_wav), "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes(pcm.tobytes())


def main():
    cfg_path = Path(sys.argv[1])
    cfg = json.loads(cfg_path.read_text())
    out = ROOT / cfg.get("output", f"output/{cfg_path.stem}.mp4")
    out.parent.mkdir(parents=True, exist_ok=True)
    tmp = Path(tempfile.mkdtemp())
    print("1/4 VoiceOver + Timings …", flush=True)
    voice_track, shots, sections, total = build_timeline(cfg, tmp)
    print(f"    {len(shots)} Schnitte in {total:.1f}s (Ø {total / len(shots):.2f}s pro Bild)")
    print("2/4 Audio-Mix …", flush=True)
    mix_audio(cfg, voice_track, shots, sections, total, tmp / "mix.wav")
    print("3/4 Video rendern …", flush=True)
    render(cfg, shots, sections, total, tmp / "video.mp4")
    print("4/4 Zusammenführen …", flush=True)
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", tmp / "video.mp4", "-i", tmp / "mix.wav",
                    "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-ar", "48000",
                    "-movflags", "+faststart", "-shortest", str(out)], check=True)
    print(out)


if __name__ == "__main__":
    main()
