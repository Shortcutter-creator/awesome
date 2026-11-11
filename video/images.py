#!/usr/bin/env python3
"""Generiert die Szenenbilder eines Reel-Skripts lokal mit SDXL-Turbo (CPU).
  python3 video/images.py video/reels/morgen_v2.json [key ...]   # keys = nur diese neu erzeugen
"""
import json, sys, time, zlib
from pathlib import Path
import torch
from diffusers import AutoPipelineForText2Image

cfg_path = Path(sys.argv[1]); only = set(sys.argv[2:])
cfg = json.loads(cfg_path.read_text())
out = cfg_path.with_name(cfg_path.stem + "_img"); out.mkdir(exist_ok=True)
torch.set_num_threads(4)
pipe = AutoPipelineForText2Image.from_pretrained("stabilityai/sdxl-turbo", torch_dtype=torch.float32)
for key, desc in cfg["images"].items():
    f = out / f"{key}.png"
    if (f.exists() and key not in only) or (only and key not in only):
        continue
    prompt = cfg["style"] + ", " + desc.format(character=cfg["character"])
    seed = cfg.get("seeds", {}).get(key, zlib.crc32(key.encode()) % 10000)
    t = time.time()
    img = pipe(prompt, num_inference_steps=4, guidance_scale=0.0, width=576, height=1024,
               generator=torch.Generator().manual_seed(seed)).images[0]
    img.save(f)
    print(f"{key} ({time.time() - t:.0f}s)", flush=True)
print("DONE", flush=True)
