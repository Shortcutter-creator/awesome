#!/usr/bin/env bash
# Installiert alles für Schnitt + VoiceOver (idempotent).
set -e
cd "$(dirname "$0")"
pip install -q piper-tts faster-whisper cairosvg
mkdir -p voices
for f in de_DE-thorsten-high.onnx de_DE-thorsten-high.onnx.json; do
  [ -s "voices/$f" ] || curl -sSL -o "voices/$f" "https://huggingface.co/rhasspy/piper-voices/resolve/main/de/de_DE/thorsten/high/$f"
done
