#!/usr/bin/env python3
"""Video-Schnitt + VoiceOver Pipeline.

  python3 video/vo.py analyze  <video>            -> <video>.analysis.json (Transkript + Stillen)
  python3 video/vo.py autocut  <video> [--min-silence 0.6] -> <video>.edit.json (Entwurf ohne Pausen)
  python3 video/vo.py render   <edit.json>          -> fertiges Video
"""
import argparse, json, os, re, subprocess, sys, tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent
VOICES = Path(os.environ.get("PIPER_VOICES", ROOT / "voices"))
DEFAULT_VOICE = "de_DE-thorsten-high"


def run(cmd, **kw):
    return subprocess.run(cmd, check=True, **kw)


def duration(path):
    out = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration",
                          "-of", "csv=p=0", str(path)], capture_output=True, text=True, check=True)
    return float(out.stdout.strip())


def has_audio(path):
    out = subprocess.run(["ffprobe", "-v", "error", "-select_streams", "a", "-show_entries",
                          "stream=index", "-of", "csv=p=0", str(path)], capture_output=True, text=True)
    return bool(out.stdout.strip())


def silences(path, noise="-35dB", min_d=0.6):
    if not has_audio(path):
        return []
    err = subprocess.run(["ffmpeg", "-hide_banner", "-i", str(path), "-af",
                          f"silencedetect=noise={noise}:d={min_d}", "-f", "null", "-"],
                         capture_output=True, text=True).stderr
    starts = [float(x) for x in re.findall(r"silence_start: ([\d.]+)", err)]
    ends = [float(x) for x in re.findall(r"silence_end: ([\d.]+)", err)]
    total = duration(path)
    return [[s, ends[i] if i < len(ends) else total] for i, s in enumerate(starts)]


def transcribe(path, lang="de", model="small"):
    if not has_audio(path):
        return []
    import numpy as np
    from faster_whisper import WhisperModel
    pcm = subprocess.run(["ffmpeg", "-v", "error", "-i", str(path), "-f", "s16le", "-ac", "1",
                          "-ar", "16000", "-"], capture_output=True, check=True).stdout
    audio = np.frombuffer(pcm, np.int16).astype(np.float32) / 32768
    segs, _ = WhisperModel(model, device="cpu", compute_type="int8").transcribe(
        audio, language=lang, word_timestamps=True)
    return [{"start": round(s.start, 2), "end": round(s.end, 2), "text": s.text.strip()} for s in segs]


def cmd_analyze(a):
    v = Path(a.video)
    data = {"video": str(v), "duration": duration(v),
            "silences": silences(v, min_d=a.min_silence),
            "transcript": transcribe(v, a.lang)}
    out = v.with_suffix(".analysis.json")
    out.write_text(json.dumps(data, indent=2, ensure_ascii=False))
    print(out)


def cmd_autocut(a):
    v = Path(a.video)
    total, pad = duration(v), 0.15
    keep, t = [], 0.0
    for s, e in silences(v, min_d=a.min_silence):
        if s - t > 0.05:
            keep.append([round(max(0, t), 2), round(min(total, s + pad), 2)])
        t = e - pad
    if total - t > 0.05:
        keep.append([round(max(0, t), 2), round(total, 2)])
    edit = {"input": str(v), "output": str(v.with_name(v.stem + "_final.mp4")),
            "keep": keep or [[0, round(total, 2)]], "original_volume": 0.15,
            "voice": DEFAULT_VOICE, "speed": 1.0, "voiceover": []}
    out = v.with_suffix(".edit.json")
    out.write_text(json.dumps(edit, indent=2, ensure_ascii=False))
    print(out)


def tts(text, voice, speed, out):
    model = VOICES / f"{voice}.onnx"
    run([sys.executable, "-m", "piper", "-m", str(model), "--length-scale", str(1 / speed),
         "-f", str(out)], input=text.encode(), capture_output=True)


def cmd_render(a):
    e = json.loads(Path(a.edit).read_text())
    src, keep = e["input"], e.get("keep") or [[0, duration(e["input"])]]
    out = e.get("output") or str(Path(src).with_name(Path(src).stem + "_final.mp4"))
    vol, voice, speed = e.get("original_volume", 0.15), e.get("voice", DEFAULT_VOICE), e.get("speed", 1.0)
    audio_in = has_audio(src)
    tmp = Path(tempfile.mkdtemp())

    f, vl, al = [], [], []
    for i, (s, t) in enumerate(keep):
        f.append(f"[0:v]trim={s}:{t},setpts=PTS-STARTPTS[v{i}]")
        vl.append(f"[v{i}]")
        if audio_in:
            f.append(f"[0:a]atrim={s}:{t},asetpts=PTS-STARTPTS[a{i}]")
            al.append(f"[a{i}]")
    n = len(keep)
    f.append(f"{''.join(vl)}concat=n={n}:v=1:a=0[vout]")
    total = sum(t - s for s, t in keep)
    if audio_in:
        f.append(f"{''.join(al)}concat=n={n}:v=0:a=1,volume={vol}[orig]")
    else:
        f.append(f"anullsrc=r=48000:cl=stereo,atrim=0:{total}[orig]")

    inputs, mix = ["-i", src], ["[orig]"]
    for j, line in enumerate(e.get("voiceover", [])):
        wav = tmp / f"vo{j}.wav"
        tts(line["text"], line.get("voice", voice), line.get("speed", speed), wav)
        inputs += ["-i", str(wav)]
        ms = int(float(line["at"]) * 1000)
        f.append(f"[{j+1}:a]aresample=48000,adelay={ms}|{ms}[vo{j}]")
        mix.append(f"[vo{j}]")
    f.append(f"{''.join(mix)}amix=inputs={len(mix)}:normalize=0:duration=first[aout]")
    run(["ffmpeg", "-y", "-v", "error", *inputs, "-filter_complex", ";".join(f),
         "-map", "[vout]", "-map", "[aout]", "-c:v", "libx264", "-preset", "medium", "-crf", "20",
         "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", out])
    print(out, f"({total:.1f}s)")


def main():
    p = argparse.ArgumentParser()
    sp = p.add_subparsers(dest="cmd", required=True)
    x = sp.add_parser("analyze"); x.add_argument("video"); x.add_argument("--lang", default="de")
    x.add_argument("--min-silence", type=float, default=0.6); x.set_defaults(fn=cmd_analyze)
    x = sp.add_parser("autocut"); x.add_argument("video")
    x.add_argument("--min-silence", type=float, default=0.6); x.set_defaults(fn=cmd_autocut)
    x = sp.add_parser("render"); x.add_argument("edit"); x.set_defaults(fn=cmd_render)
    a = p.parse_args(); a.fn(a)


if __name__ == "__main__":
    main()
