"""Gemeinsame Helfer für alle Gedankenwerk-Werkzeuge: Paketordner, .env, theme.json.

Nur Standardbibliothek, läuft auf macOS und Windows gleich. Pfade immer relativ zum Paketordner.
"""
from __future__ import annotations

import json
import os
import re
import shutil
import ssl
import subprocess
import sys
import urllib.error
import urllib.request
from pathlib import Path

PAKET = Path(__file__).resolve().parent.parent
VORLAGE = PAKET / "vorlage"
VIDEOS = PAKET / "videos"
ELEVEN = "https://api.elevenlabs.io"
HEX = re.compile(r"^#[0-9a-fA-F]{6}$")


def konsole_utf8() -> None:
    """Windows-Konsolen sprechen oft cp1252; Umlaute sollen trotzdem lesbar ankommen."""
    for strom in (sys.stdout, sys.stderr):
        try:
            strom.reconfigure(encoding="utf-8", errors="replace")
        except (AttributeError, ValueError):
            pass


def https_kontext() -> ssl.SSLContext:
    """Python von python.org (Mac) bringt oft keine Zertifikate mit; certifi springt dann ein."""
    try:
        import certifi
        return ssl.create_default_context(cafile=certifi.where())
    except ImportError:
        return ssl.create_default_context()


def lade_env(pfad: Path | None = None) -> dict[str, str]:
    """Liest KEY=WERT-Zeilen aus .env (ohne Zusatzpaket). Umgebungsvariablen gehen vor."""
    pfad = pfad or PAKET / ".env"
    werte: dict[str, str] = {}
    if pfad.exists():
        for zeile in pfad.read_text(encoding="utf-8").splitlines():
            zeile = zeile.strip()
            if not zeile or zeile.startswith("#") or "=" not in zeile:
                continue
            k, v = zeile.split("=", 1)
            werte[k.strip()] = v.strip().strip('"').strip("'")
    for k in list(werte):
        if os.environ.get(k):
            werte[k] = os.environ[k]
    return werte


def elevenlabs_schluessel() -> str:
    """Schlüssel oder klare Fehlermeldung mit dem nächsten Schritt."""
    schluessel = lade_env().get("ELEVENLABS_API_KEY", "") or os.environ.get("ELEVENLABS_API_KEY", "")
    if not schluessel:
        raise SystemExit(
            "Kein ElevenLabs-Schlüssel gefunden. Lege die Datei .env an (Vorlage: .env.example) "
            "oder sag Claude: einrichten."
        )
    return schluessel


def lade_theme(pfad: Path | None = None) -> dict:
    pfad = pfad or PAKET / "theme.json"
    try:
        return json.loads(pfad.read_text(encoding="utf-8"))
    except FileNotFoundError:
        raise SystemExit("theme.json fehlt im Paketordner. Ohne sie weiß Claude nicht, wie dein Kanal aussieht.")
    except json.JSONDecodeError as fehler:
        raise SystemExit(f"theme.json ist kein gültiges JSON (Zeile {fehler.lineno}, Spalte {fehler.colno}). "
                         "Sag Claude: look – dann wird sie repariert.")


def theme_fehler(theme: dict) -> list[str]:
    """Prüft Pflichtfelder und Farbformate; leere Liste = in Ordnung."""
    fehler = []
    for bereich in ("kanal", "farben", "schrift", "stimme", "untertitel", "abspann", "cover", "format"):
        if not isinstance(theme.get(bereich), dict):
            fehler.append(f"Bereich „{bereich}“ fehlt")
    for name, wert in (theme.get("farben") or {}).items():
        if isinstance(wert, str) and wert.startswith("#") and not HEX.match(wert):
            fehler.append(f"Farbe {name} = {wert} ist kein #RRGGBB")
    stimme = theme.get("stimme") or {}
    tempo = stimme.get("tempo", 1.0)
    hoch = 1.1 if stimme.get("anbieter") == "elevenlabs" else 1.25
    if not isinstance(tempo, (int, float)) or not 0.8 <= tempo <= hoch:
        fehler.append(f"stimme.tempo = {tempo} liegt außerhalb 0,8 bis {hoch:.2f}".replace(".", ","))
    return fehler


# ---------------------------------------------------------------------------
# Videoordner und Vorlage
# ---------------------------------------------------------------------------
def video_ordner(arg: str) -> Path:
    """Akzeptiert „videos/2026-10-30-thema“, „2026-10-30-thema“ oder einen absoluten Pfad."""
    kandidaten = [Path(arg), PAKET / arg, VIDEOS / arg]
    for k in kandidaten:
        if k.is_dir():
            return k.resolve()
    raise SystemExit(f"Videoordner „{arg}“ nicht gefunden. Erwartet wird z. B. videos/2026-10-30-mein-thema")


def video_id(ordner: Path) -> str:
    """Composition-ID = Ordnername (nur a–z, 0–9, Bindestrich)."""
    vid = re.sub(r"[^a-z0-9-]+", "-", ordner.name.lower()).strip("-")
    if not vid:
        raise SystemExit(f"Ordnername „{ordner.name}“ taugt nicht als Video-Kennung (nur a–z, 0–9, Bindestrich)")
    return vid


def synchronisieren(ordner: Path) -> str:
    """Bringt voice.wav und woerter.json aus dem Videoordner in die Vorlage. Gibt die Video-ID zurück."""
    vid = video_id(ordner)
    woerter = ordner / "woerter.json"
    stimme = ordner / "voice.wav"
    if not woerter.exists() or not stimme.exists():
        raise SystemExit(f"In {ordner.name} fehlen voice.wav oder woerter.json. Erst vertonen: python werkzeug/vertonen.py {rel(ordner)}")
    src = VORLAGE / "src" / "videos" / vid
    pub = VORLAGE / "public" / "videos" / vid
    src.mkdir(parents=True, exist_ok=True)
    pub.mkdir(parents=True, exist_ok=True)
    daten = json.loads(woerter.read_text(encoding="utf-8"))
    daten["audio"] = f"videos/{vid}/voice.wav"
    (src / "woerter.json").write_text(json.dumps(daten, ensure_ascii=False, indent=1), encoding="utf-8")
    shutil.copy2(stimme, pub / "voice.wav")
    return vid


def rel(pfad: Path) -> str:
    try:
        return pfad.resolve().relative_to(PAKET).as_posix()
    except ValueError:
        return str(pfad)


# ---------------------------------------------------------------------------
# Programme aufrufen (Windows: npx heißt npx.cmd)
# ---------------------------------------------------------------------------
def programm(name: str) -> str:
    pfad = shutil.which(name)
    if not pfad:
        raise SystemExit(f"Programm „{name}“ nicht gefunden. Sag Claude: einrichten.")
    return pfad


def ffmpeg(*args: str, still: bool = True) -> subprocess.CompletedProcess:
    befehl = [programm("ffmpeg"), "-hide_banner", "-y"] + (["-loglevel", "error"] if still else []) + list(args)
    return subprocess.run(befehl, capture_output=True, text=True, encoding="utf-8", errors="replace")


def ffmpeg_ok(*args: str) -> None:
    res = ffmpeg(*args)
    if res.returncode != 0:
        raise SystemExit(f"ffmpeg-Fehler: {res.stderr.strip()[-600:]}")


def dauer_von(datei: Path) -> float:
    res = subprocess.run([programm("ffprobe"), "-v", "error", "-show_entries", "format=duration", "-of", "default=nw=1:nk=1", str(datei)],
                         capture_output=True, text=True)
    try:
        return float(res.stdout.strip())
    except ValueError:
        raise SystemExit(f"Konnte die Länge von {datei.name} nicht lesen: {res.stderr.strip()[:300]}")


def remotion(*args: str) -> None:
    """npx remotion … im Ordner vorlage; bricht mit lesbarer Meldung ab."""
    if not (VORLAGE / "node_modules").is_dir():
        raise SystemExit("Die Animations-Vorlage ist noch nicht installiert. Sag Claude: einrichten (npm install im Ordner vorlage).")
    res = subprocess.run([programm("npx"), "remotion", *args], cwd=VORLAGE, capture_output=True, text=True, encoding="utf-8", errors="replace")
    if res.returncode != 0:
        aus = (res.stderr or "") + (res.stdout or "")
        raise SystemExit(f"Remotion-Fehler:\n{aus.strip()[-2500:]}")


# ---------------------------------------------------------------------------
# ElevenLabs
# ---------------------------------------------------------------------------
class ElevenFehler(Exception):
    def __init__(self, code: int, text: str):
        super().__init__(text)
        self.code = code
        self.text = text


def eleven(pfad: str, daten: dict | None = None, timeout: int = 180) -> dict:
    """GET (daten=None) oder POST an die ElevenLabs-API, Antwort als JSON."""
    kopf = {"xi-api-key": elevenlabs_schluessel(), "Accept": "application/json"}
    body = None
    if daten is not None:
        body = json.dumps(daten).encode("utf-8")
        kopf["Content-Type"] = "application/json"
    anfrage = urllib.request.Request(ELEVEN + pfad, data=body, headers=kopf, method="POST" if body else "GET")
    try:
        with urllib.request.urlopen(anfrage, timeout=timeout, context=https_kontext()) as antwort:
            return json.loads(antwort.read().decode("utf-8"))
    except urllib.error.HTTPError as fehler:
        text = fehler.read().decode("utf-8", errors="replace")[:800]
        raise ElevenFehler(fehler.code, text) from None
    except (urllib.error.URLError, TimeoutError) as fehler:
        raise SystemExit(f"Keine Verbindung zu ElevenLabs ({getattr(fehler, 'reason', fehler)}). Internet prüfen und erneut starten.")


def eleven_klartext(f: ElevenFehler) -> str:
    """Übersetzt typische API-Fehler in einen Satz für den Nutzer."""
    t = f.text.lower()
    if f.code == 401:
        return "ElevenLabs lehnt den Schlüssel ab. In .env prüfen oder neu anlegen unter elevenlabs.io/app/settings/api-keys."
    if "quota" in t or "credits" in t or f.code == 402:
        return "Dein ElevenLabs-Guthaben reicht nicht für diesen Text. Guthaben im ElevenLabs-Konto prüfen."
    if f.code == 429:
        return "ElevenLabs meldet zu viele Anfragen gleichzeitig. In einer Minute erneut versuchen."
    if "voice" in t and ("not found" in t or "does not exist" in t):
        return "Die Stimme aus theme.json gibt es in deinem Konto nicht. Sag Claude: look → Stimme."
    if "permission" in t or "missing_permissions" in t:
        return "Dem Schlüssel fehlt eine Berechtigung (Text to Speech bzw. Voices: Read). Schlüssel neu erstellen."
    return f"ElevenLabs-Fehler {f.code}: {f.text[:300]}"


# ---------------------------------------------------------------------------
# Paket-Umgebung für die lokale Stimme (werkzeug/.venv, angelegt von stimme_einrichten.py)
# ---------------------------------------------------------------------------
def venv_python() -> str | None:
    basis = PAKET / "werkzeug" / ".venv"
    for kandidat in (basis / "bin" / "python", basis / "Scripts" / "python.exe"):
        if kandidat.exists():
            return str(kandidat)
    return None


def lokal(*args: str) -> None:
    """Ruft werkzeug/lokal.py in der Paket-Umgebung auf; klare Meldung, wenn sie fehlt."""
    py = venv_python()
    if py is None:
        raise SystemExit("Die kostenlose lokale Stimme ist noch nicht eingerichtet. Sag Claude: einrichten "
                         "(oder: python werkzeug/stimme_einrichten.py).")
    res = subprocess.run([py, str(PAKET / "werkzeug" / "lokal.py"), *args], capture_output=True, text=True,
                         encoding="utf-8", errors="replace")
    if res.returncode != 0:
        raise SystemExit(f"Lokale Stimme: Fehler\n{(res.stderr or res.stdout).strip()[-1500:]}")
    for zeile in (res.stderr or "").splitlines():  # Hinweis „x von y Sätzen unverändert (aus dem Zwischenspeicher)“ zeigen
        if "Zwischenspeicher" in zeile:
            print(zeile.strip(), flush=True)
