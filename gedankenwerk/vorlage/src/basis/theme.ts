// Liest den Look aus paket/theme.json. Jede Farbe und Schrift im Video kommt von hier,
// damit eine Änderung an theme.json in jedem Video wirkt.
import roh from "../../../theme.json";
import { schrift } from "./schriften";

type Theme = typeof roh;
export const THEME: Theme = roh;
const F = roh.farben;

/** #RRGGBB + Deckkraft → rgba() */
export const rgba = (hex: string, a: number): string => {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
};

/** Mischt zwei #RRGGBB-Farben (k = 0 → a, 1 → b). */
export const mische = (a: string, b: string, k: number): string => {
  const x = parseInt(a.slice(1), 16);
  const y = parseInt(b.slice(1), 16);
  const kanal = (s: number) => Math.round(((x >> s) & 255) * (1 - k) + ((y >> s) & 255) * k);
  return `#${((kanal(16) << 16) | (kanal(8) << 8) | kanal(0)).toString(16).padStart(6, "0")}`;
};

/** Helligkeit 0..1 (relative Luminanz), z. B. für Konturfarbe auf Covern. */
export const hell = (hex: string): number => {
  const n = parseInt(hex.slice(1), 16);
  const lin = (c: number) => {
    const v = c / 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * lin((n >> 16) & 255) + 0.7152 * lin((n >> 8) & 255) + 0.0722 * lin(n & 255);
};

/** Kontrastverhältnis zweier #RRGGBB-Farben (1 bis 21). */
export const kontrast = (a: string, b: string): number => {
  const [x, y] = [hell(a), hell(b)].sort((m, n) => n - m);
  return (x + 0.05) / (y + 0.05);
};

/** Schriftfarbe, die auf `bg` lesbar ist: `fg`, wenn der Kontrast reicht (≥ 3), sonst Schwarz oder Weiß. */
export const lesbar = (fg: string, bg: string): string => {
  if (!/^#[0-9a-f]{6}$/i.test(fg) || !/^#[0-9a-f]{6}$/i.test(bg)) return fg;
  if (kontrast(fg, bg) >= 3) return fg;
  return kontrast("#111111", bg) >= kontrast("#ffffff", bg) ? "#111111" : "#ffffff";
};

/**
 * Farbpalette. Die Schlüssel paper/ink/red/… bleiben aus Kompatibilität mit den Bausteinen erhalten
 * und zeigen auf die neutralen Namen aus theme.json.
 */
export const C = {
  paper: F.hintergrund,
  paper2: F.flaeche,
  grid: F.raster,
  ink: F.text,
  muted: F.text_leise,
  line: F.linie,
  red: F.negativ,
  green: F.positiv,
  yellow: F.markierung,
  accent: F.akzent,
  sky: mische(F.akzent, "#ffffff", 0.7),
  steel: mische(F.linie, F.text_leise, 0.3),
  // dunkler Erklärteil (nur sichtbar bei mechanik_wechsel.art = "dunkel")
  navyOut: F.dunkel_hintergrund,
  navyIn: mische(F.dunkel_hintergrund, F.dunkel_akzent, 0.18),
  glow: F.dunkel_akzent,
  glowSoft: rgba(F.dunkel_akzent, 0.18),
  darkText: F.dunkel_text,
};

export const HEAD = schrift(roh.schrift.titel);
export const TEXT = schrift(roh.schrift.text);
export const MONO = schrift(roh.schrift.mono, "IBM Plex Mono");
export const TITEL_GEWICHT = roh.schrift.titel_gewicht;

export const FPS = roh.format.fps;
export const W = roh.format.breite;
export const H = roh.format.hoehe;
