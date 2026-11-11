# Video: Schnitt + VoiceOver

## Workflow
1. **Video hochladen** – im Claude-Chat anhängen (am einfachsten) oder nach `video/input/` pushen.
2. **Sagen, was du willst**, z. B.: „Schneid alle Pausen raus und sprich diesen Text drüber: …“
   oder nur Stichpunkte – dann schreibe ich das Skript.
3. Ich schneide, erzeuge das VoiceOver und schicke dir das fertige MP4 zurück.

## Unter der Haube
```bash
./setup.sh                          # einmalig: piper-tts, faster-whisper, deutsche Stimme
python3 vo.py analyze  clip.mp4     # Transkript + Pausen -> clip.analysis.json
python3 vo.py autocut  clip.mp4     # Schnittentwurf ohne Pausen -> clip.edit.json
python3 vo.py render   clip.edit.json
```

`clip.edit.json`:
```json
{
  "input": "clip.mp4",
  "output": "clip_final.mp4",
  "keep": [[0, 4.2], [6.1, 15.0]],
  "original_volume": 0.15,
  "voice": "de_DE-thorsten-high",
  "speed": 1.0,
  "voiceover": [
    {"at": 0.5, "text": "Heute zeige ich euch ..."},
    {"at": 6.0, "text": "Und jetzt der wichtigste Teil."}
  ]
}
```
- `keep`: Abschnitte des Originals (Sekunden), die drin bleiben.
- `at`: Zeitpunkt im **geschnittenen** Video.
- `original_volume`: 0 = Originalton aus, 1 = voll.

## Reels komplett generieren (ohne eigenes Material)
```bash
python3 reel.py reels/morgen.json   # -> output/morgen_reel.mp4 (1080x1920)
```
Skript-JSON: Abschnitte mit Farben, optionaler Nummer (`badge`) und Sätzen mit Twemoji-Codes.
Ergebnis: VoiceOver, wortgenaue Untertitel (aktives Wort gelb), Schnitt alle ~0,8 s,
Blitz + Shake bei Nummern, Beat mit Ducking, Whoosh/Hit-Sounds.

## Reels v2: Bilder + ausdrucksstarke Stimme
```bash
python3 images.py reels/morgen_v2.json            # Szenenbilder mit SDXL-Turbo (~1 min/Bild, CPU)
python3 images.py reels/morgen_v2.json groggy     # einzelnes Bild neu erzeugen
python3 reel2.py  reels/morgen_v2.json            # -> output/morgen_reel_v2.mp4
```
- Figur + Stil werden in jedem Bild-Prompt wiederholt (`character`, `style`), Seeds über `seeds`.
- Stimme: Chatterbox (MIT), `exaggeration` pro Satz = wie emotional gesprochen wird; `tempo` beschleunigt ohne Tonhöhe zu ändern.
- Jeder Satz wird per Spracherkennung gegen das Skript geprüft und bei Fehlern neu erzeugt.
- `say`: abweichende Aussprache-Schreibweise für die Stimme, Untertitel zeigen `text`.
