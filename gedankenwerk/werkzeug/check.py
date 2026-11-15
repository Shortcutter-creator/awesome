"""Startprüfung: Ist alles da, damit Claude ein Video bauen kann?

Aufruf:  python werkzeug/check.py            (Windows ggf. py werkzeug/check.py)
         python werkzeug/check.py --online   prüft zusätzlich den ElevenLabs-Schlüssel beim Anbieter
         python werkzeug/check.py --json     Ergebnis maschinenlesbar für Claude
Exit-Code 0 = bereit, 1 = mindestens ein Punkt fehlt.
"""
from __future__ import annotations

import importlib.util
import json
import platform
import re
import shutil
import ssl
import subprocess
import sys
import urllib.error
import urllib.request

from gemeinsam import PAKET, https_kontext, konsole_utf8, lade_env, lade_theme, theme_fehler, venv_python

PY_MIN = (3, 11)
NODE_MIN = 18


def system() -> dict:
    name = {"Darwin": "mac", "Windows": "windows", "Linux": "linux"}.get(platform.system(), platform.system())
    return {"system": name, "version": platform.release(), "chip": platform.machine()}


def version_von(befehl: list[str]) -> str | None:
    pfad = shutil.which(befehl[0])
    if not pfad:
        return None
    try:
        aus = subprocess.run([pfad, *befehl[1:]], capture_output=True, text=True, timeout=20)
    except (OSError, subprocess.TimeoutExpired):
        return None
    return (aus.stdout or aus.stderr).strip().splitlines()[0] if (aus.stdout or aus.stderr) else ""


def pruefe_programme(ergebnis: list[dict]) -> None:
    py_ok = sys.version_info[:2] >= PY_MIN
    ergebnis.append({"punkt": "Python", "ok": py_ok, "wert": platform.python_version(),
                     "tipp": None if py_ok else f"Python {PY_MIN[0]}.{PY_MIN[1]} oder neuer installieren"})

    node = version_von(["node", "--version"])
    m = re.match(r"v?(\d+)", node or "")
    node_ok = bool(m and int(m.group(1)) >= NODE_MIN)
    ergebnis.append({"punkt": "Node.js", "ok": node_ok, "wert": node or "nicht gefunden",
                     "tipp": None if node_ok else f"Node.js LTS (ab {NODE_MIN}) installieren"})

    npx = shutil.which("npx")
    ergebnis.append({"punkt": "npx", "ok": bool(npx), "wert": "vorhanden" if npx else "nicht gefunden",
                     "tipp": None if npx else "kommt mit Node.js; nach der Installation Terminal neu öffnen"})

    ff = version_von(["ffmpeg", "-version"])
    ergebnis.append({"punkt": "ffmpeg", "ok": bool(ff), "wert": (ff or "nicht gefunden")[:60],
                     "tipp": None if ff else "ffmpeg installieren (Mac: brew install ffmpeg, Windows: winget install Gyan.FFmpeg)"})


def pruefe_python_pakete(ergebnis: list[dict]) -> None:
    req = PAKET / "werkzeug" / "requirements.txt"
    if not req.exists():
        return
    fehlend = []
    for zeile in req.read_text(encoding="utf-8").splitlines():
        zeile = zeile.split("#")[0].strip()
        if not zeile:
            continue
        modul = re.split(r"[<>=!~\[ ]", zeile)[0]
        modul = {"pillow": "PIL"}.get(modul.lower(), modul).replace("-", "_")
        if importlib.util.find_spec(modul) is None:
            fehlend.append(zeile)
    ergebnis.append({"punkt": "Python-Pakete", "ok": not fehlend,
                     "wert": "vollständig" if not fehlend else "fehlt: " + ", ".join(fehlend),
                     "tipp": None if not fehlend else "python -m pip install -r werkzeug/requirements.txt"})


def pruefe_vorlage(ergebnis: list[dict]) -> None:
    vorlage = PAKET / "vorlage"
    if not (vorlage / "package.json").exists():
        return
    ok = (vorlage / "node_modules").is_dir()
    ergebnis.append({"punkt": "Animations-Vorlage", "ok": ok, "wert": "installiert" if ok else "noch nicht installiert",
                     "tipp": None if ok else "im Ordner vorlage einmal: npm install"})


def pruefe_schluessel(ergebnis: list[dict], online: bool) -> None:
    env_da = (PAKET / ".env").exists()
    schluessel = lade_env().get("ELEVENLABS_API_KEY", "")
    if not schluessel:
        ergebnis.append({"punkt": "ElevenLabs-Schlüssel", "ok": False,
                         "wert": "keine .env-Datei" if not env_da else "in .env leer",
                         "tipp": ".env aus .env.example anlegen und ELEVENLABS_API_KEY eintragen"})
        return
    if not online:
        ergebnis.append({"punkt": "ElevenLabs-Schlüssel", "ok": True, "wert": "eingetragen (nicht online geprüft)", "tipp": None})
        return
    anfrage = urllib.request.Request("https://api.elevenlabs.io/v1/user", headers={"xi-api-key": schluessel})
    try:
        with urllib.request.urlopen(anfrage, timeout=20, context=https_kontext()) as antwort:
            daten = json.loads(antwort.read().decode("utf-8"))
        abo = daten.get("subscription") or {}
        rest = None
        if isinstance(abo.get("character_limit"), int) and isinstance(abo.get("character_count"), int):
            rest = abo["character_limit"] - abo["character_count"]
        wert = f"gültig, Plan {abo.get('tier', '?')}" + (f", noch {rest:,} Zeichen".replace(",", ".") if rest is not None else "")
        ergebnis.append({"punkt": "ElevenLabs-Schlüssel", "ok": True, "wert": wert, "tipp": None})
    except urllib.error.HTTPError as fehler:
        if fehler.code == 401:
            # Ein Schlüssel ohne Leserecht auf /user kann trotzdem vertonen; das unterscheidet erst der Probelauf.
            ergebnis.append({"punkt": "ElevenLabs-Schlüssel", "ok": False, "wert": "abgelehnt (401)",
                             "tipp": "Schlüssel falsch kopiert oder ohne Berechtigung. Neu anlegen unter elevenlabs.io/app/settings/api-keys "
                                     "und dabei Text to Speech, Voices und User (lesen) erlauben"})
        else:
            ergebnis.append({"punkt": "ElevenLabs-Schlüssel", "ok": False, "wert": f"Antwort {fehler.code}",
                             "tipp": "später noch einmal prüfen; ElevenLabs antwortet gerade nicht normal"})
    except (urllib.error.URLError, ssl.SSLError, TimeoutError) as fehler:
        grund = getattr(fehler, "reason", fehler)
        tipp = "Internetverbindung prüfen"
        if "CERTIFICATE" in str(grund).upper() and platform.system() == "Darwin":
            tipp = ("Zertifikate fehlen: python -m pip install certifi, oder im Programme-Ordner unter Python 3.x "
                    "„Install Certificates.command“ doppelklicken")
        ergebnis.append({"punkt": "ElevenLabs-Schlüssel", "ok": False, "wert": "keine Verbindung", "tipp": tipp})


def pruefe_lokale_stimme(ergebnis: list[dict]) -> None:
    py = venv_python()
    try:
        _anb = (lade_theme().get("stimme") or {}).get("anbieter", "piper")
    except SystemExit:
        _anb = "piper"
    ergebnis.append({"punkt": "Lokale Stimme (Umgebung)", "ok": bool(py), "wert": "eingerichtet" if py else "noch nicht eingerichtet",
                     "tipp": None if py else "python werkzeug/stimme_einrichten.py" + (" --qwen" if _anb == "qwen" else "") + " (einmalig, kostenlos)"})
    try:
        stimme = (lade_theme().get("stimme") or {}).get("voice_id", "")
    except SystemExit:
        return
    anbieter = (lade_theme().get("stimme") or {}).get("anbieter", "piper")
    if anbieter == "qwen":
        from stimme_einrichten import QWEN_MODELLE, qwen_weg
        st = lade_theme().get("stimme") or {}
        weg = qwen_weg()
        if weg is None:
            ergebnis.append({"punkt": "Qwen-Stimme", "ok": False, "wert": "läuft nur auf Mac mit Apple-Chip und Windows 64 Bit",
                             "tipp": 'In theme.json → stimme "anbieter": "piper", "voice_id": "de_DE-thorsten-high" eintragen'})
            return
        from stimme_einrichten import QWEN_STIMMEN, klon_namen
        if st.get("beschreibung"):
            arten, was, flag = ["base", "voicedesign"], "eigene Stimme (Beschreibung)", "--qwen-design"
        elif not stimme:
            arten, was, flag = ["base"], "Stimmen", "--qwen"  # Wahl fehlt noch -> meldet pruefe_theme
        elif stimme.lower() in klon_namen():
            arten, was, flag = ["base"], f"Stimme {stimme}", "--qwen"
        elif stimme.lower() in QWEN_STIMMEN:
            arten, was, flag = ["customvoice"], f"Sprecher {stimme}", "--qwen-sprecher"
        else:
            ergebnis.append({"punkt": "Qwen-Stimme", "ok": False, "wert": f"„{stimme}“ gibt es nicht",
                             "tipp": f"In theme.json → stimme voice_id eine von: {', '.join(klon_namen())}"})
            return
        fehlt = [a for a in arten if not (PAKET / "stimmen" / QWEN_MODELLE[weg][a][1] / "config.json").exists()]
        groesse = " + ".join(QWEN_MODELLE[weg][a][2] for a in fehlt)
        ergebnis.append({"punkt": "Qwen-Modell", "ok": not fehlt, "wert": f"{was}, Modell geladen" if not fehlt else f"{was}: Modell nicht geladen",
                         "tipp": None if not fehlt else f"python werkzeug/stimme_einrichten.py {flag} (einmalig, {groesse})"})
        return
    da = (PAKET / "stimmen" / f"{stimme}.onnx").exists()
    ergebnis.append({"punkt": "Lokale Stimme (Datei)", "ok": da, "wert": stimme if da else f"{stimme} fehlt",
                     "tipp": None if da else "python werkzeug/stimme_einrichten.py"})


def pruefe_theme(ergebnis: list[dict]) -> None:
    try:
        theme = lade_theme()
    except SystemExit as fehler:
        ergebnis.append({"punkt": "theme.json", "ok": False, "wert": str(fehler), "tipp": "Claude: look"})
        return
    fehler = theme_fehler(theme)
    ergebnis.append({"punkt": "theme.json", "ok": not fehler, "wert": "in Ordnung" if not fehler else "; ".join(fehler),
                     "tipp": None if not fehler else "Claude: look"})
    stimme = theme.get("stimme") or {}
    if not stimme.get("voice_id"):
        ergebnis.append({"punkt": "Stimme gewählt", "ok": False, "wert": "noch keine voice_id",
                         "tipp": "Claude: look → Hörproben in stimmen/klon/proben/ anhören und eine Stimme wählen"})


def main() -> int:
    konsole_utf8()
    online = "--online" in sys.argv
    sys_info = system()
    ergebnis: list[dict] = []
    pruefe_programme(ergebnis)
    pruefe_python_pakete(ergebnis)
    pruefe_vorlage(ergebnis)
    anbieter = "piper"
    try:
        anbieter = (lade_theme().get("stimme") or {}).get("anbieter", "piper")
    except SystemExit:
        pass
    if anbieter == "elevenlabs":
        pruefe_schluessel(ergebnis, online)
    else:
        pruefe_lokale_stimme(ergebnis)
    pruefe_theme(ergebnis)
    bereit = all(p["ok"] for p in ergebnis)

    if "--json" in sys.argv:
        print(json.dumps({"bereit": bereit, **sys_info, "punkte": ergebnis}, ensure_ascii=False, indent=2))
        return 0 if bereit else 1

    print(f"Gedankenwerk-Startprüfung · System: {sys_info['system']} {sys_info['version']} ({sys_info['chip']})\n")
    for p in ergebnis:
        marke = "[OK]   " if p["ok"] else "[FEHLT]"
        print(f"{marke} {p['punkt']}: {p['wert']}")
        if p["tipp"]:
            print(f"        → {p['tipp']}")
    print("\nAlles bereit. Gib Claude ein Thema." if bereit else "\nNoch nicht bereit. (Claude: Skill „einrichten“ ausführen. Nutzer: sag Claude „einrichten“.)")
    return 0 if bereit else 1


if __name__ == "__main__":
    sys.exit(main())
