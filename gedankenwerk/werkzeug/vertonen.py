"""Vertont skript.txt eines Videos und erzeugt die Wortzeiten.

Anbieter (theme.json → stimme.anbieter): „qwen“ = kostenlos und lokal (Standard; Mac mit Apple-Chip und Windows;
mitgelieferte Stimme aus voice_id, z. B. max, oder eigene Stimme aus „beschreibung“), „piper“ = kostenlos und lokal (läuft überall, schlichter),
„elevenlabs“ = optional, eigenes Konto. Lokale Wortzeiten kommen per faster-whisper, bei ElevenLabs direkt vom Anbieter.

Aufruf:  python werkzeug/vertonen.py videos/<ordner> [--neu] [--ja]
  --neu   auch dann neu sprechen, wenn sich Text und Stimme nicht geändert haben (kostet erneut Guthaben)
  --ja    nicht nachfragen (für „ohne Rückfrage“)

Ablauf: skript.txt → Sprechtext ({Anzeige|Sprechform} → Sprechform) → Stimme (lokal oder ElevenLabs)
→ stimme/roh.(wav|mp3) + stimme/roh.json (Zeichenzeiten) → voice.wav (−16 LUFS, 48 kHz) + woerter.json (Wort-Anker fürs Video).
Ein unveränderter Text wird nicht erneut bezahlt: roh.mp3 wird wiederverwendet.
Gewollte Stille (z. B. Mitraten mit 3-2-1): ans Zeilenende „[pause 1.6]“ schreiben. Die Stille wird nach dieser Zeile
eingefügt und von pausen.py nicht gekürzt.
"""
from __future__ import annotations

import base64
import json
import re
import sys
from pathlib import Path

from gemeinsam import (ElevenFehler, dauer_von, eleven, eleven_klartext, ffmpeg_ok, konsole_utf8, lade_theme, lokal, rel,
                       video_ordner)

VORLAUF = 0.15          # s Stille vor dem ersten Wort
TOKEN = re.compile(r"[\wäöüßÄÖÜ']+")
GRUPPE = re.compile(r"\{([^|}]+)\|([^}]+)\}([^\s\w{]*)|(\S+)")  # Satzzeichen direkt hinter der Klammer gehören zum Wort


# ---------------------------------------------------------------------------
# Skript → Sprechtext mit Zeichenpositionen
# ---------------------------------------------------------------------------
PAUSE = re.compile(r"\s*\[pause\s+(\d+(?:[.,]\d+)?)\s*s?\]\s*$", re.I)


def pausen_wunsch(zeilen: list[str]) -> tuple[list[str], dict[int, float]]:
    """Trennt „[pause 1.6]“ vom Zeilenende ab → (Zeilen ohne Marke, {Zeilenindex: Sekunden})."""
    sauber, wunsch = [], {}
    for i, z in enumerate(zeilen):
        m = PAUSE.search(z)
        if m:
            sek = float(m.group(1).replace(",", "."))
            if not 0.2 <= sek <= 4:
                raise SystemExit(f"skript.txt: [pause {m.group(1)}] – erlaubt sind 0,2 bis 4 Sekunden.")
            wunsch[i] = sek
            z = z[: m.start()].rstrip()
        sauber.append(z)
    return sauber, wunsch


def skript_zeilen(ordner: Path) -> list[str]:
    datei = ordner / "skript.txt"
    if not datei.exists():
        raise SystemExit(f"{rel(datei)} fehlt. Erst das Skript schreiben (eine Zeile je Satz).")
    zeilen = [z.strip() for z in datei.read_text(encoding="utf-8").splitlines()]
    zeilen = [z for z in zeilen if z and not z.startswith("#")]
    if not zeilen:
        raise SystemExit(f"{rel(datei)} ist leer.")
    for i, z in enumerate(zeilen, 1):
        if z.count("{") != z.count("}") or re.search(r"\{[^|}]*\}", z):
            raise SystemExit(f"skript.txt Zeile {i}: Zahl-Klammer kaputt. Form: {{Anzeige|Sprechform}} – „{z[:80]}“")
    return zeilen


def zerlege(zeilen: list[str]) -> tuple[str, list[list[tuple[str, list[tuple[int, int]]]]]]:
    """→ (Sprechtext, je Zeile [(Anzeige-Wort, [(Start, Ende) der Sprech-Tokens im Sprechtext])])."""
    text = ""
    alle = []
    for zeile in zeilen:
        teile = []
        for m in GRUPPE.finditer(zeile):
            einfach = m.group(4)
            anzeige = einfach or m.group(1) + m.group(3)
            sprech = einfach or m.group(2) + m.group(3)
            if text:
                text += " "
            start = len(text)
            text += sprech
            spans = [(start + t.start(), start + t.end()) for t in TOKEN.finditer(sprech)]
            woerter = anzeige.split()
            if len(woerter) == 1:
                teile.append((woerter[0], spans))
                continue
            # Mehrere Anzeige-Wörter: das erste bekommt alles bis auf je ein Token für jedes weitere
            rest = len(woerter) - 1
            kopf = spans[: max(1, len(spans) - rest)]
            teile.append((woerter[0], kopf))
            for k, w in enumerate(woerter[1:]):
                i = len(kopf) + k
                teile.append((w, spans[i:i + 1]))
        alle.append(teile)
    return text, alle


# ---------------------------------------------------------------------------
# ElevenLabs
# ---------------------------------------------------------------------------
def sprechen(text: str, stimme: dict) -> tuple[bytes, dict, str]:
    """→ (mp3-Bytes, alignment, verwendetes Modell). Fällt bei Modell-Problemen einmal auf das Ersatzmodell zurück."""
    modelle = [stimme.get("modell") or "eleven_multilingual_v2"]
    if stimme.get("modell_ersatz") and stimme["modell_ersatz"] not in modelle:
        modelle.append(stimme["modell_ersatz"])
    settings = {
        "stability": stimme.get("stability", 0.6),
        "similarity_boost": stimme.get("similarity_boost", 0.75),
        "speed": stimme.get("tempo", 1.0),
    }
    letzter = None
    for modell in modelle:
        try:
            antwort = eleven(f"/v1/text-to-speech/{stimme['voice_id']}/with-timestamps?output_format=mp3_44100_128",
                             {"text": text, "model_id": modell, "voice_settings": settings})
        except ElevenFehler as f:
            modellproblem = f.code in (400, 422) and ("model" in f.text.lower() or "speed" in f.text.lower())
            if modellproblem and modell != modelle[-1]:
                print(f"  Modell {modell} geht hier nicht ({f.code}), nehme {modelle[-1]}.", flush=True)
                letzter = f
                continue
            raise SystemExit(eleven_klartext(f))
        ausrichtung = antwort.get("alignment") or antwort.get("normalized_alignment")
        if not antwort.get("audio_base64") or not ausrichtung or not ausrichtung.get("characters"):
            if modell != modelle[-1]:
                print(f"  Modell {modell} liefert keine Zeitstempel, nehme {modelle[-1]}.", flush=True)
                continue
            raise SystemExit("ElevenLabs hat keine Zeitstempel geliefert. Anderes Modell in theme.json → stimme.modell eintragen.")
        return base64.b64decode(antwort["audio_base64"]), ausrichtung, modell
    raise SystemExit(eleven_klartext(letzter) if letzter else "Vertonung fehlgeschlagen.")


def zeichen_zeiten(text: str, ausrichtung: dict) -> list[tuple[float, float]]:
    """Start/Ende je Zeichen des Sprechtexts. Weicht die Zeichenfolge ab, per Abgleich zuordnen."""
    zeichen = ausrichtung["characters"]
    st = ausrichtung["character_start_times_seconds"]
    en = ausrichtung["character_end_times_seconds"]
    if "".join(zeichen) == text:
        return list(zip(st, en))
    import difflib
    zeiten: list[tuple[float, float] | None] = [None] * len(text)
    sm = difflib.SequenceMatcher(None, text, "".join(zeichen), autojunk=False)
    for a, b, n in sm.get_matching_blocks():
        for k in range(n):
            zeiten[a + k] = (st[b + k], en[b + k])
    letzte = (0.0, 0.0)
    for i, z in enumerate(zeiten):  # Lücken mit dem Nachbarn füllen
        if z is None:
            zeiten[i] = (letzte[1], letzte[1])
        else:
            letzte = z
    return zeiten  # type: ignore[return-value]


# ---------------------------------------------------------------------------
# Messen
# ---------------------------------------------------------------------------
def anbieter_vorab(stimme: dict) -> str:
    return stimme.get("anbieter", "piper")


def silben(wort: str) -> int:
    return max(1, len(re.findall(r"[aeiouyäöü]+", re.sub(r"[^\wäöüÄÖÜß]", "", wort).lower())))


def tempo_silben(words: list[dict]) -> float:
    """Silben je Sekunde reiner Sprechzeit, gezählt auf den angezeigten Wörtern (so ist auch der Zielwert ~4,5 gemessen)."""
    n = sum(silben(w["w"]) for w in words)
    zeit = sum(w["e"] - w["s"] for w in words)
    return n / zeit if zeit else 0.0


def fuege_stille_ein(wav: Path, words: list[dict], zinfo: list[dict], wunsch: dict[int, float]) -> list[dict]:
    """Fügt gewollte Stille nach den markierten Zeilen ein und verschiebt alle späteren Zeiten."""
    if not wunsch:
        return []
    from pausen import lies, schreib
    import array
    daten, sr = lies(wav)
    stille, versatz = [], 0.0
    neu, pos = array.array("h"), 0
    for i in sorted(wunsch):
        if i + 1 >= len(zinfo):
            continue  # nach der letzten Zeile ist sowieso Schluss
        ende, naechst = zinfo[i]["e"], zinfo[i + 1]["s"]
        luecke = max(0.0, naechst - ende)
        dazu = max(0.0, wunsch[i] - luecke)
        punkt = ende + luecke / 2
        cut = int(punkt * sr)
        neu.extend(daten[pos:cut])
        neu.extend(array.array("h", bytes(2 * int(dazu * sr))))
        pos = cut
        stille.append({"s": round(ende + versatz, 3), "dauer": round(wunsch[i], 3)})
        for w in words + zinfo:
            if w["s"] >= punkt:
                w["s"] = round(w["s"] + dazu, 3)
                w["e"] = round(w["e"] + dazu, 3)
        versatz += dazu
    neu.extend(daten[pos:])
    schreib(wav, neu, sr)
    return stille


def kennung(stimme: dict) -> str:
    """Woran sich eine Stimme erkennen lässt (für „unverändert, nichts neu sprechen“): voice_id oder Beschreibung."""
    if stimme.get("anbieter") == "qwen" and stimme.get("beschreibung"):  # Beschreibung hat Vorrang vor voice_id
        return f"beschreibung:{stimme['beschreibung']}|seed={stimme.get('seed', 42)}"
    return stimme.get("voice_id", "")


def lokal_sprechen(text: str, stimme: dict, rohdir: Path) -> tuple[Path, dict]:
    """Kostenlose lokale Stimme (Piper) + Wortzeiten per faster-whisper → (wav, alignment wie bei ElevenLabs)."""
    txt = rohdir / "sprechtext.txt"
    txt.write_text(text, encoding="utf-8")
    roh = rohdir / "roh.wav"
    name = "der beschriebenen Stimme" if stimme.get("anbieter") == "qwen" and stimme.get("beschreibung") else (
        stimme.get("voice_name") or stimme.get("voice_id"))
    print(f"Spreche lokal mit {name} …" + (" (Qwen rechnet lokal, das dauert je nach Rechner einige Minuten)"
                                           if stimme.get("anbieter") == "qwen" else ""), flush=True)
    beschreibung = stimme.get("beschreibung") if stimme.get("anbieter") == "qwen" else None
    zusatz = ["--beschreibung", beschreibung, "--seed", str(int(stimme.get("seed", 42)))] if beschreibung else []
    lokal("sprechen", "--anbieter", stimme.get("anbieter", "piper"), "--stimme", stimme.get("voice_id") or "", *zusatz,
          "--text", str(txt), "--aus", str(roh))
    print("Erkenne Wortzeiten (faster-whisper, lokal) …", flush=True)
    wj = rohdir / "erkannt.json"
    lokal("ausrichten", "--audio", str(roh), "--text", str(txt), "--aus", str(wj))
    erkannt = json.loads(wj.read_text(encoding="utf-8"))["woerter"]
    return roh, ausrichtung_aus_woertern(text, erkannt)


def _norm(w: str) -> str:
    return re.sub(r"[^a-zäöüß0-9]", "", w.lower())


def ausrichtung_aus_woertern(text: str, erkannt: list) -> dict:
    """Ordnet erkannte Wörter den Tokens des Sprechtexts zu und baut daraus Zeichenzeiten (Format wie ElevenLabs).
    Nicht erkannte Tokens (z. B. Zahlen, die Whisper als Ziffern schreibt) werden zwischen den Nachbarn verteilt."""
    import difflib
    toks = [(m.start(), m.end(), _norm(m.group())) for m in TOKEN.finditer(text)]
    hyp = [(_norm(w), s, e) for w, s, e in erkannt if _norm(w)]
    zeit: list[tuple[float, float] | None] = [None] * len(toks)
    geschaetzt: list[list[int]] = []  # Zeichenbereiche, deren Zeit nur geschätzt ist (Whisper hat das Wort nicht erkannt)
    sm = difflib.SequenceMatcher(None, [t[2] for t in toks], [h[0] for h in hyp], autojunk=False)
    for a, b, n in sm.get_matching_blocks():
        for k in range(n):
            zeit[a + k] = (hyp[b + k][1], hyp[b + k][2])
    # Lücken: Zeitraum zwischen bekannten Nachbarn nach Zeichenlänge aufteilen
    i = 0
    ende_gesamt = hyp[-1][2] if hyp else 0.0
    while i < len(toks):
        if zeit[i] is not None:
            i += 1
            continue
        j = i
        while j < len(toks) and zeit[j] is None:
            j += 1
        von = zeit[i - 1][1] if i > 0 and zeit[i - 1] else 0.0
        bis = zeit[j][0] if j < len(toks) and zeit[j] else max(von + 0.3 * (j - i), ende_gesamt)
        laengen = [max(1, toks[k][1] - toks[k][0]) for k in range(i, j)]
        summe, pos = sum(laengen), von
        for k, l in zip(range(i, j), laengen):
            d = (bis - von) * l / summe
            zeit[k] = (pos, pos + d)
            geschaetzt.append([toks[k][0], toks[k][1]])
            pos += d
        i = j
    st = [0.0] * len(text)
    en = [0.0] * len(text)
    letzte = 0.0
    tok_i = 0
    for c in range(len(text)):
        while tok_i < len(toks) and c >= toks[tok_i][1]:
            tok_i += 1
        if tok_i < len(toks) and toks[tok_i][0] <= c < toks[tok_i][1]:
            s, e = zeit[tok_i]  # type: ignore[misc]
            a0, a1 = toks[tok_i][0], toks[tok_i][1]
            st[c] = s + (e - s) * (c - a0) / (a1 - a0)
            en[c] = s + (e - s) * (c + 1 - a0) / (a1 - a0)
            letzte = en[c]
        else:
            st[c] = en[c] = letzte
    return {"characters": list(text), "character_start_times_seconds": st, "character_end_times_seconds": en,
            "geschaetzt": geschaetzt}


# ---------------------------------------------------------------------------
def main() -> None:
    konsole_utf8()
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    if not args:
        raise SystemExit(__doc__)
    ordner = video_ordner(args[0])
    test = next((a.split("=", 1)[1] for a in sys.argv if a.startswith("--testantwort=")), None)
    theme = lade_theme()
    stimme = theme["stimme"]
    anbieter = stimme.get("anbieter", "piper")
    if not stimme.get("voice_id") and not (anbieter == "qwen" and stimme.get("beschreibung")) and not test:
        raise SystemExit("In theme.json ist noch keine Stimme gewählt. Sag Claude: look → Stimme.")
    tempo = float(stimme.get("tempo", 1.0))
    hoch = 1.1 if anbieter_vorab(stimme) == "elevenlabs" else 1.25
    if not 0.8 <= tempo <= hoch:
        raise SystemExit(f"theme.json → stimme.tempo muss zwischen 0,8 und {hoch} liegen.")

    zeilen, wunsch = pausen_wunsch(skript_zeilen(ordner))
    text, teile = zerlege(zeilen)
    rohdir = ordner / "stimme"
    rohdir.mkdir(exist_ok=True)
    roh = rohdir / ("roh.mp3" if anbieter == "elevenlabs" else "roh.wav")
    meta_p = rohdir / "roh.json"
    meta = json.loads(meta_p.read_text(encoding="utf-8")) if meta_p.exists() else {}
    gleich = (roh.exists() and meta.get("text") == text and meta.get("voice_id") == kennung(stimme)
              and meta.get("anbieter", "elevenlabs") == anbieter
              and meta.get("einstellungen") == [stimme.get("stability"), stimme.get("similarity_boost"), tempo])

    if test:
        antwort = json.loads(Path(test).read_text(encoding="utf-8"))
        roh.write_bytes(base64.b64decode(antwort["audio_base64"]))
        meta = {"text": text, "voice_id": "test", "modell": "test", "einstellungen": [None, None, tempo],
                "alignment": antwort["alignment"]}
    elif gleich and "--neu" not in sys.argv:
        print(f"Text und Stimme unverändert: nutze vorhandene Aufnahme ({rel(roh)}).")
    elif anbieter != "elevenlabs":
        roh, ausrichtung = lokal_sprechen(text, stimme, rohdir)
        meta = {"text": text, "voice_id": kennung(stimme), "anbieter": anbieter, "modell": anbieter,
                "einstellungen": [stimme.get("stability"), stimme.get("similarity_boost"), tempo], "alignment": ausrichtung}
    else:
        print(f"Vertone {len(text)} Zeichen mit {stimme.get('voice_name') or stimme['voice_id']} "
              f"({stimme.get('modell')}). Das zieht etwa {len(text)} Zeichen von deinem ElevenLabs-Guthaben ab.", flush=True)
        if "--ja" not in sys.argv and sys.stdin.isatty():
            if input("Weiter? [j/N] ").strip().lower() not in ("j", "ja", "y", "yes"):
                raise SystemExit("Abgebrochen, nichts verbraucht.")
        mp3, ausrichtung, modell = sprechen(text, stimme)
        roh.write_bytes(mp3)
        meta = {"text": text, "voice_id": stimme["voice_id"], "anbieter": "elevenlabs", "modell": modell,
                "einstellungen": [stimme.get("stability"), stimme.get("similarity_boost"), tempo], "alignment": ausrichtung}
    meta_p.write_text(json.dumps(meta, ensure_ascii=False), encoding="utf-8")

    # Stimme aufbereiten: Vorlauf, Lautheit −16 LUFS, 48 kHz mono
    wav = ordner / "voice.wav"
    faktor = tempo if anbieter != "elevenlabs" and abs(tempo - 1.0) > 0.005 else 1.0
    if faktor != 1.0:  # lokale Stimme: Tempo hier anpassen, Zeichenzeiten wandern mit
        al = meta["alignment"]
        meta["alignment"] = {**al, "character_start_times_seconds": [x / faktor for x in al["character_start_times_seconds"]],
                             "character_end_times_seconds": [x / faktor for x in al["character_end_times_seconds"]]}
    ffmpeg_ok("-i", str(roh), "-af", f"atempo={faktor},adelay={int(VORLAUF * 1000)}:all=1,loudnorm=I=-16:TP=-1.5:LRA=11",
              "-ar", "48000", "-ac", "1", "-c:a", "pcm_s16le", str(wav))
    laenge = dauer_von(wav)

    zz = zeichen_zeiten(text, meta["alignment"])
    geschaetzt = meta["alignment"].get("geschaetzt") or []
    words, zinfo = [], []
    for i, zeile_teile in enumerate(teile):
        z_s = None
        for anzeige, spans in zeile_teile:
            if spans:
                s = zz[spans[0][0]][0] + VORLAUF
                e = zz[spans[-1][1] - 1][1] + VORLAUF
            else:  # reines Satzzeichen o. ä.: an das vorige Wort hängen
                s = words[-1]["e"] if words else VORLAUF
                e = s + 0.05
            e = max(e, s + 0.04)
            words.append({"w": anzeige, "s": round(s, 3), "e": round(e, 3), "z": i})
            if spans and any(a < spans[-1][1] and b > spans[0][0] for a, b in geschaetzt):
                words[-1]["g"] = 1  # Zeit geschätzt → pruefe.py zeigt diese Stelle
            z_s = words[-1]["s"] if z_s is None else z_s
        zinfo.append({"s": z_s, "e": words[-1]["e"], "text": zeilen[i]})
    for a, b in zip(words, words[1:]):  # Zeiten müssen steigen
        if b["s"] < a["s"]:
            b["s"] = a["s"]
        b["e"] = max(b["e"], b["s"] + 0.04)

    stille = fuege_stille_ein(wav, words, zinfo, wunsch)
    if stille:
        laenge = dauer_von(wav)
    dauer = round(min(laenge, words[-1]["e"] + 0.6), 3)
    daten = {"audio": "voice.wav", "dauer": dauer, "modell": meta.get("modell"), "stimme": stimme.get("voice_name") or "",
             "tempo": tempo, "words": words, "zeilen": zinfo, "stille": stille}
    (ordner / "woerter.json").write_text(json.dumps(daten, ensure_ascii=False, indent=1), encoding="utf-8")

    sps = tempo_silben(words)
    satz1 = next((w["e"] for w in words if re.search(r"[.?!]$", w["w"])), words[-1]["e"]) - words[0]["s"]
    print(f"FERTIG {ordner.name}: {dauer:.1f} s Sprechzeit, {len(words)} Wörter, {sps:.2f} Silben/s, erster Satz {satz1:.1f} s")
    if sps > 5.0 and anbieter == "elevenlabs":
        print("  Hinweis: schneller als ~5 Silben/s. Bei ElevenLabs nicht bremsen (klingt künstlich): "
              "lange Sätze kürzen oder teilen und erneut vertonen.")
    elif sps > 5.6:  # lokale Stimmen: zügig ist gewollt (Tester fand gebremste 0,88 zu langsam, 05.11.2026), erst darüber bremsen
        vorschlag = max(0.8, round(tempo * 5.2 / sps, 2))
        print(f"  Hinweis: sehr schnell (> 5,6 Silben/s). In theme.json stimme.tempo auf {vorschlag} setzen und erneut vertonen "
              "(lokale Stimme: kostet nichts, Regelbuch → Tempo).")
    elif sps < (3.9 if anbieter == "elevenlabs" else 4.3):
        hoch = 1.1 if anbieter == "elevenlabs" else 1.25
        vorschlag = min(hoch, round(tempo * (4.5 if anbieter == "elevenlabs" else 5.0) / sps, 2))
        print(f"  Hinweis: eher langsam ({sps:.2f} Silben/s). In theme.json stimme.tempo auf {vorschlag} setzen und erneut vertonen.")
    if satz1 > 3.5:
        print("  Hinweis: Der erste Satz dauert über 3,5 s. Für einen starken Hook kürzen.")
    print(f"Weiter: python werkzeug/pausen.py {rel(ordner)}")


if __name__ == "__main__":
    main()
