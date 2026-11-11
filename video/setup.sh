#!/usr/bin/env bash
# Installiert alles für Schnitt + VoiceOver (idempotent).
set -e
cd "$(dirname "$0")"
pip install -q piper-tts faster-whisper cairosvg diffusers accelerate librosa==0.11.0 s3tokenizer transformers==5.2.0 resemble-perth conformer==0.3.2 pyloudnorm omegaconf pykakasi soundfile
pip install -q --no-deps chatterbox-tts==0.1.7
mkdir -p voices
for f in de_DE-thorsten-high.onnx de_DE-thorsten-high.onnx.json; do
  [ -s "voices/$f" ] || curl -sSL -o "voices/$f" "https://huggingface.co/rhasspy/piper-voices/resolve/main/de/de_DE/thorsten/high/$f"
done
