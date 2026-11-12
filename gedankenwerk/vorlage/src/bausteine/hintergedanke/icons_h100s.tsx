// Zeichnungen für Kanal #100s „Der Stau ohne Ursache“ (flach 2D, Kontur C.ink, keine Marken).
import React from "react";
import { C, HEAD, MONO } from "../../basis/lib";

export const o1 = (v: number) => Math.max(0, Math.min(1, v));
export const mix = (a: number, b: number, k: number) => a + (b - a) * k;
const hex = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
export const mixC = (a: string, b: string, k: number) => {
  const A = hex(a), B = hex(b), q = o1(k);
  return "#" + A.map((v, i) => Math.round(v + (B[i] - v) * q).toString(16).padStart(2, "0")).join("");
};
export const rnd = (i: number) => {
  const s = Math.sin(i * 12.9898 + 78.233) * 43758.5453;
  return s - Math.floor(s);
};

export const K = {
  asphalt: "#4d5259",
  asphaltRand: "#3c4046",
  gras: "#b8cf98",
  grasDunkel: "#9dbb7d",
  baum: "#6f9e5c",
  baumHell: "#86b26f",
  weiss: "#f6f3ec",
  scheibe: "#3a4352",
  rot: "#e0483b",
  bremse: "#ff3b2f",
  orange: "#f08a24",
  blau: "#3b82f6",
  gruen: "#2fa35f",
  gelb: "#f1c94a",
};

/** Auto von oben, Front zeigt nach oben (Fahrtrichtung). Mitte = (0,0) im eigenen Koordinatensystem. */
export const Auto: React.FC<{ x: number; y: number; s?: number; rot?: number; farbe?: string; bremse?: number; o?: number; rand?: number }> = ({
  x, y, s = 1, rot = 0, farbe = K.weiss, bremse = 0, o = 1, rand = 5,
}) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`} opacity={o}>
    {bremse > 0.02 && <ellipse cx={0} cy={66} rx={46} ry={26} fill={K.bremse} opacity={0.45 * bremse} style={{ filter: "blur(7px)" }} />}
    <rect x={-33} y={-58} width={66} height={116} rx={18} fill={farbe} stroke={C.ink} strokeWidth={rand} />
    <path d="M -24 -30 Q 0 -40 24 -30 L 20 -12 L -20 -12 Z" fill={K.scheibe} />
    <path d="M -21 26 L 21 26 L 24 38 Q 0 44 -24 38 Z" fill={K.scheibe} opacity={0.85} />
    <rect x={-21} y={-8} width={42} height={30} rx={6} fill="rgba(0,0,0,0.06)" />
    <rect x={-27} y={50} width={14} height={6} rx={2} fill={bremse > 0.02 ? K.bremse : "#9a3a33"} opacity={0.55 + 0.45 * bremse} />
    <rect x={13} y={50} width={14} height={6} rx={2} fill={bremse > 0.02 ? K.bremse : "#9a3a33"} opacity={0.55 + 0.45 * bremse} />
    <rect x={-26} y={-57} width={12} height={5} rx={2} fill="#fff7d0" />
    <rect x={14} y={-57} width={12} height={5} rx={2} fill="#fff7d0" />
  </g>
);

export const Baum: React.FC<{ x: number; y: number; r: number }> = ({ x, y, r }) => (
  <g>
    <circle cx={x + 6} cy={y + 8} r={r} fill="rgba(31,28,26,0.18)" />
    <circle cx={x} cy={y} r={r} fill={K.baum} stroke={C.ink} strokeWidth={4} />
    <circle cx={x - r * 0.3} cy={y - r * 0.3} r={r * 0.45} fill={K.baumHell} />
  </g>
);

export const Haken: React.FC<{ x: number; y: number; p: number; s?: number; col?: string }> = ({ x, y, p, s = 1, col = K.gruen }) => (
  <g transform={`translate(${x} ${y}) scale(${s * (0.7 + 0.3 * o1(p))})`} opacity={o1(p * 3)}>
    <circle r={46} fill="#fff" stroke={col} strokeWidth={8} />
    <path d="M -22 2 L -6 18 L 24 -16" fill="none" stroke={col} strokeWidth={11} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - o1(p)} />
  </g>
);

/** Rote Durchstreichung über einer runden Karte (Radius r). */
export const Strich: React.FC<{ r: number; p: number }> = ({ r, p }) => (
  <path d={`M ${-r * 0.72} ${r * 0.72} L ${-r * 0.72 + r * 1.44 * o1(p)} ${r * 0.72 - r * 1.44 * o1(p)}`} stroke={K.rot} strokeWidth={18} strokeLinecap="round" />
);

/** Unfall: zwei Autos schräg aneinander, gelber Stern. */
export const Unfall: React.FC = () => (
  <g>
    <Auto x={-26} y={8} s={0.62} rot={-28} />
    <Auto x={30} y={-6} s={0.62} rot={62} />
    <path d="M 4 -46 L 12 -26 L 32 -32 L 20 -14 L 36 0 L 14 -2 L 8 18 L 0 -2 L -20 4 L -8 -14 L -22 -30 L -2 -26 Z" fill={K.gelb} stroke={C.ink} strokeWidth={4} strokeLinejoin="round" />
  </g>
);

/** Baustelle: Leitkegel + Absperrbake. */
export const Baustelle: React.FC = () => (
  <g>
    <rect x={-62} y={30} width={124} height={14} rx={4} fill={C.ink} />
    <path d="M -22 30 L -6 -52 L 6 -52 L 22 30 Z" fill={K.orange} stroke={C.ink} strokeWidth={5} strokeLinejoin="round" />
    <path d="M -14 -8 L 14 -8 L 17 6 L -17 6 Z" fill="#fff" />
    <path d="M -9 -32 L 9 -32 L 11 -22 L -11 -22 Z" fill="#fff" />
    <rect x={30} y={-24} width={26} height={54} rx={4} fill="#fff" stroke={C.ink} strokeWidth={4} />
    <path d="M 30 -10 L 56 -22 M 30 8 L 56 -4 M 30 26 L 56 14" stroke={K.rot} strokeWidth={6} />
  </g>
);

export const Uhr: React.FC<{ s?: number; zeiger: number; farbe?: string }> = ({ s = 1, zeiger, farbe = C.ink }) => (
  <svg width={56 * s} height={56 * s} viewBox="-28 -28 56 56" style={{ display: "block" }}>
    <circle r={23} fill="#fff" stroke={farbe} strokeWidth={5} />
    <line x1={0} y1={0} x2={0} y2={-14} stroke={farbe} strokeWidth={4} strokeLinecap="round" transform={`rotate(${zeiger * 360})`} />
    <line x1={0} y1={0} x2={9} y2={0} stroke={farbe} strokeWidth={4} strokeLinecap="round" transform={`rotate(${zeiger * 30})`} />
  </svg>
);

/** Zapfsäule (Verbrauch). */
export const Zapfsaeule: React.FC<{ s?: number }> = ({ s = 1 }) => (
  <svg width={48 * s} height={56 * s} viewBox="-24 -28 48 56" style={{ display: "block" }}>
    <rect x={-18} y={-22} width={26} height={46} rx={5} fill="#fff" stroke={C.ink} strokeWidth={4} />
    <rect x={-13} y={-16} width={16} height={12} rx={2} fill={C.ink} />
    <path d="M 8 -10 L 16 -4 L 16 14 Q 16 20 20 18" fill="none" stroke={C.ink} strokeWidth={4} strokeLinecap="round" />
  </svg>
);

/** Bremslicht-Symbol (rotes Rücklicht-Paar). */
export const BremsSymbol: React.FC<{ s?: number; an?: number }> = ({ s = 1, an = 1 }) => (
  <svg width={64 * s} height={44 * s} viewBox="-32 -22 64 44" style={{ display: "block" }}>
    <rect x={-30} y={-18} width={60} height={36} rx={10} fill="#fff" stroke={C.ink} strokeWidth={4} />
    <rect x={-22} y={-7} width={14} height={14} rx={3} fill={an > 0.5 ? K.bremse : "#9a3a33"} />
    <rect x={8} y={-7} width={14} height={14} rx={3} fill={an > 0.5 ? K.bremse : "#9a3a33"} />
  </svg>
);

/** Herz (Like) mit Füllung 0..1 (rot). */
export const Herz: React.FC<{ x: number; y: number; s: number; fill: number }> = ({ x, y, s, fill }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M 0 34 C -60 -8 -52 -58 -20 -58 C -6 -58 0 -46 0 -40 C 0 -46 6 -58 20 -58 C 52 -58 60 -8 0 34 Z" fill={mixC("#ffffff", K.rot, fill)} stroke={C.ink} strokeWidth={6} strokeLinejoin="round" />
  </g>
);

/** Papierflieger (Teilen). */
export const Flieger: React.FC<{ x: number; y: number; s: number; rot?: number; voll?: number }> = ({ x, y, s, rot = 0, voll = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <path d="M -52 4 L 52 -40 L 18 46 L 2 16 Z" fill={mixC("#ffffff", K.blau, voll)} stroke={C.ink} strokeWidth={6} strokeLinejoin="round" />
    <path d="M 2 16 L 52 -40 L -6 30 Z" fill={mixC("#dcd6cb", "#2563c9", voll)} stroke={C.ink} strokeWidth={5} strokeLinejoin="round" />
  </g>
);

export const Tipp: React.FC<{ x: number; y: number; p: number; welle: number }> = ({ x, y, p, welle }) => (
  <g opacity={p}>
    {welle > 0 && welle < 1 && <circle cx={x} cy={y} r={30 + welle * 70} fill="none" stroke={C.ink} strokeWidth={6 * (1 - welle)} opacity={1 - welle} />}
    <circle cx={x} cy={y} r={34} fill="rgba(31,28,26,0.22)" stroke="#fff" strokeWidth={5} />
    <circle cx={x} cy={y} r={14} fill="#fff" />
  </g>
);

/** Pfeil nach oben/unten mit Schaft (für Fahrtrichtung / Stau-Richtung). */
export const Pfeil: React.FC<{ x: number; y: number; len: number; dir: 1 | -1; farbe: string; w?: number; o?: number }> = ({ x, y, len, dir, farbe, w = 16, o = 1 }) => {
  const kopf = Math.min(46, len * 0.45);
  const ende = y + (dir * len) / 2, start = y - (dir * len) / 2;
  return (
    <g opacity={o}>
      <line x1={x} y1={start} x2={x} y2={ende - dir * kopf * 0.6} stroke={C.ink} strokeWidth={w + 8} strokeLinecap="round" />
      <line x1={x} y1={start} x2={x} y2={ende - dir * kopf * 0.6} stroke={farbe} strokeWidth={w} strokeLinecap="round" />
      <path d={`M ${x - kopf * 0.8} ${ende - dir * kopf} L ${x} ${ende} L ${x + kopf * 0.8} ${ende - dir * kopf} Z`} fill={farbe} stroke={C.ink} strokeWidth={5} strokeLinejoin="round" />
    </g>
  );
};

/** SVG-Chip (Text zentriert). */
export const SChip: React.FC<{ x: number; y: number; text: string; size?: number; bg?: string; fg?: string; bd?: string; o?: number; s?: number }> = ({
  x, y, text, size = 26, bg = C.ink, fg = "#fff", bd, o = 1, s = 1,
}) => {
  if (o <= 0.01) return null;
  const w = text.length * (size * 0.6 + 2.5) + 34, h = size + 24;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o1(o)}>
      <rect x={-w / 2 + 4} y={-h / 2 + 4} width={w} height={h} rx={12} fill="rgba(0,0,0,0.45)" />
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={12} fill={bg} stroke={bd ?? C.ink} strokeWidth={3} />
      <text x={1.25} y={size * 0.36} textAnchor="middle" fontFamily={MONO} fontWeight={700} fontSize={size} letterSpacing={2.5} fill={fg}>
        {text}
      </text>
    </g>
  );
};

export const GrossZahl: React.FC<{ x: number; y: number; text: string; size: number; farbe?: string; o?: number; s?: number }> = ({ x, y, text, size, farbe = C.ink, o = 1, s = 1 }) =>
  o <= 0.01 ? null : (
    <text x={x} y={y} textAnchor="middle" fontFamily={HEAD} fontWeight={900} fontSize={size} letterSpacing={-3} fill={farbe} opacity={o1(o)}
      style={{ transformOrigin: `${x}px ${y - size * 0.35}px`, transform: `scale(${s})` }}>
      {text}
    </text>
  );

/** Kleine Comic-Sprechblase (Umbau 25.10., der Kanalinhaber: „kleine sprechblasen mit zensierten schimpfwörtern“).
 *  Papier mit Tintenrand wie die Chips, Schrift MONO. (x, y) = Spitze des Zipfels (am Auto), seite: Blase links/rechts/oben davon.
 *  p = Einblendung 0..1 (Feder), hop = kurzer Hüpfer beim Erscheinen. */
export const Blase: React.FC<{ x: number; y: number; text: string; p: number; seite?: "oben" | "links" | "rechts"; size?: number; fg?: string; hop?: number }> = ({
  x, y, text, p, seite = "oben", size = 34, fg = C.ink, hop = 0,
}) => {
  if (p <= 0.01) return null;
  const zeichen = Array.from(text).length;
  const w = zeichen * (size * 0.62 + 2) + 34, h = size + 26;
  // Mittelpunkt der Blase relativ zur Spitze
  const cx = seite === "oben" ? 0 : seite === "links" ? -w / 2 - 26 : w / 2 + 26;
  const cy = seite === "oben" ? -h / 2 - 26 : -h / 2 - 14;
  const zipfel = seite === "oben"
    ? `M -12 ${-28} L 0 0 L 12 ${-28}`
    : seite === "links" ? `M -40 -34 L 0 0 L -32 -18` : `M 40 -34 L 0 0 L 32 -18`;
  const s = 0.6 + 0.4 * o1(p);
  return (
    <g transform={`translate(${x} ${y - 14 * hop}) scale(${s})`} opacity={o1(p * 1.6)}>
      <rect x={cx - w / 2 + 5} y={cy - h / 2 + 5} width={w} height={h} rx={h / 2} fill={C.ink} />
      <path d={`${zipfel} Z`} fill={C.paper2} stroke={C.ink} strokeWidth={4.5} strokeLinejoin="round" />
      <rect x={cx - w / 2} y={cy - h / 2} width={w} height={h} rx={h / 2} fill={C.paper2} stroke={C.ink} strokeWidth={4.5} />
      <text x={cx} y={cy + size * 0.36} textAnchor="middle" fontFamily={MONO} fontWeight={800} fontSize={size} letterSpacing={1} fill={fg}>{text}</text>
    </g>
  );
};
