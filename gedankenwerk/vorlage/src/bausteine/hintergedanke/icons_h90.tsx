// Illustrationen Formattest #90 (Hut-Rätsel der vier Gefangenen). Seitenansicht, Bild-Koordinaten 1080 × 1920.
// Gefangener = schlichte Figur im orangen Overall (wie im Vorbild), Zylinder schwarz oder weiß, klar unterscheidbar.
import React from "react";
import { C, HEAD } from "../../basis/lib";

export const ORANGE = "#e8743b";
export const HUT_S = "#1f1c1a";
export const HUT_W = "#ffffff";
export const BLICK = "rgba(47,163,95,0.26)"; // Sichtkegel (grün wie im Vorbild)
export const BLICK_RAND = "rgba(47,163,95,0.75)";

/** Kopf-/Augen-Geometrie eines Gefangenen (Füße bei x, y; Maßstab s; Blick f = 1 rechts / −1 links). */
export const kopf = (x: number, y: number, s: number, f: 1 | -1) => ({
  hx: x, hy: y - 236 * s, r: 34 * s,
  ex: x + 16 * s * f, ey: y - 240 * s,
  hutOben: y - 340 * s, hutUnten: y - 262 * s,
});

/** Zylinder, Krempe bei (x, y). */
export const Hut: React.FC<{ x: number; y: number; s?: number; farbe: "s" | "w"; rot?: number }> = ({ x, y, s = 1, farbe, rot = 0 }) => {
  const f = farbe === "s" ? HUT_S : HUT_W;
  const band = farbe === "s" ? "#5a534c" : "#d9d3c8";
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      <rect x={-31} y={-78} width={62} height={78} rx={6} fill={f} stroke={C.ink} strokeWidth={7} />
      <rect x={-31} y={-22} width={62} height={13} fill={band} stroke={C.ink} strokeWidth={4} />
      <rect x={-52} y={-6} width={104} height={14} rx={7} fill={f} stroke={C.ink} strokeWidth={7} />
    </g>
  );
};

/** Gefangener in Seitenansicht. dreh 0..1 = Kopf zuckt nach hinten. mund = durchgestrichener Mund (0..1). */
export const Gefangener: React.FC<{ x: number; y: number; s?: number; f: 1 | -1; hut: "s" | "w"; dreh?: number; atem?: number; hutHub?: number }> = ({
  x, y, s = 1, f, hut, dreh = 0, atem = 0, hutHub = 0,
}) => {
  const k = kopf(x, y, s, f);
  const rot = -f * 28 * dreh; // Kopf dreht über die Schulter
  const augeX = k.hx + (k.ex - k.hx) * (1 - 2 * dreh);
  const brust = y - 205 * s + atem * 3;
  return (
    <g>
      {/* Beine */}
      <path d={`M${x - 14 * s} ${y - 100 * s} L ${x - 18 * s} ${y} M ${x + 14 * s} ${y - 100 * s} L ${x + 20 * s} ${y}`} stroke={ORANGE} strokeWidth={30 * s} strokeLinecap="round" />
      <path d={`M${x - 14 * s} ${y - 100 * s} L ${x - 18 * s} ${y} M ${x + 14 * s} ${y - 100 * s} L ${x + 20 * s} ${y}`} stroke={C.ink} strokeWidth={4 * s} strokeLinecap="round" opacity={0.25} />
      {/* Schuhe */}
      <ellipse cx={x - 18 * s + 10 * f * s} cy={y - 4 * s} rx={22 * s} ry={9 * s} fill="#fff" stroke={C.ink} strokeWidth={5 * s} />
      <ellipse cx={x + 20 * s + 10 * f * s} cy={y - 4 * s} rx={22 * s} ry={9 * s} fill="#fff" stroke={C.ink} strokeWidth={5 * s} />
      {/* Rumpf */}
      <rect x={x - 34 * s} y={brust} width={68 * s} height={y - 92 * s - brust} rx={22 * s} fill={ORANGE} stroke={C.ink} strokeWidth={7 * s} />
      <line x1={x + 6 * f * s} y1={brust + 10 * s} x2={x + 6 * f * s} y2={y - 100 * s} stroke={C.ink} strokeWidth={3 * s} opacity={0.35} />
      {/* Arm (hängt) */}
      <path d={`M${x - 4 * f * s} ${brust + 14 * s} L ${x + 4 * f * s} ${y - 110 * s}`} stroke={ORANGE} strokeWidth={24 * s} strokeLinecap="round" />
      <path d={`M${x - 4 * f * s} ${brust + 14 * s} L ${x + 4 * f * s} ${y - 110 * s}`} stroke={C.ink} strokeWidth={4 * s} strokeLinecap="round" opacity={0.3} />
      {/* Hals + Kopf + Hut (dreht gemeinsam) */}
      <g transform={`rotate(${rot} ${x} ${brust})`}>
        <rect x={x - 10 * s} y={k.hy + 20 * s} width={20 * s} height={brust - k.hy - 16 * s} fill="#f0c9a6" stroke={C.ink} strokeWidth={5 * s} />
        <circle cx={k.hx} cy={k.hy} r={k.r} fill="#f0c9a6" stroke={C.ink} strokeWidth={7 * s} />
        <circle cx={augeX} cy={k.ey} r={5.5 * s} fill={C.ink} />
        <path d={`M${k.hx + 30 * s * f * (1 - 2 * dreh)} ${k.hy - 2 * s} l ${8 * s * f * (1 - 2 * dreh)} ${10 * s} l ${-8 * s * f * (1 - 2 * dreh)} ${2 * s}`} fill="none" stroke={C.ink} strokeWidth={4 * s} strokeLinejoin="round" />
        <Hut x={k.hx - 2 * s * f} y={k.hutUnten - hutHub} s={s} farbe={hut} rot={-4 * f} />
      </g>
    </g>
  );
};

/** Ziegelmauer. */
export const Mauer: React.FC<{ x: number; y: number; w: number; h: number }> = ({ x, y, w, h }) => {
  const reihen = Math.floor(h / 34);
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill="#c4644a" stroke={C.ink} strokeWidth={7} />
      {Array.from({ length: reihen }, (_, i) => (
        <g key={i}>
          <line x1={x} y1={y + (i + 1) * 34} x2={x + w} y2={y + (i + 1) * 34} stroke="#7d3524" strokeWidth={3} />
          <line x1={x + (i % 2 ? w * 0.33 : w * 0.66)} y1={y + i * 34} x2={x + (i % 2 ? w * 0.33 : w * 0.66)} y2={y + (i + 1) * 34} stroke="#7d3524" strokeWidth={3} />
        </g>
      ))}
      <rect x={x} y={y} width={w} height={h} fill="none" stroke={C.ink} strokeWidth={7} />
      <rect x={x - 8} y={y - 14} width={w + 16} height={18} rx={4} fill="#a9a397" stroke={C.ink} strokeWidth={6} />
    </g>
  );
};

/** Podest (Stufe) aus Stein. */
export const Podest: React.FC<{ x: number; y: number; w: number; h: number }> = ({ x, y, w, h }) => (
  <g>
    <rect x={x} y={y} width={w} height={h} fill="#a9a397" stroke={C.ink} strokeWidth={7} />
    <line x1={x} y1={y + 16} x2={x + w} y2={y + 16} stroke={C.ink} strokeWidth={3} opacity={0.35} />
  </g>
);

/** Nummernschild am Boden. hell 0..1 = leuchtet gelb auf. */
export const Nummer: React.FC<{ x: number; y: number; n: number; hell?: number; size?: number }> = ({ x, y, n, hell = 0, size = 96 }) => {
  const sc = 1 + 0.18 * hell;
  return (
    <g transform={`translate(${x} ${y}) scale(${sc})`}>
      <rect x={-size / 2} y={-size / 2} width={size} height={size} rx={14} fill={hell > 0.5 ? C.yellow : C.ink} stroke={C.ink} strokeWidth={6} />
      <text x={0} y={size * 0.2} textAnchor="middle" fontFamily={HEAD} fontWeight={900} fontSize={size * 0.62} fill={hell > 0.5 ? C.ink : "#fff"}>{n}</text>
    </g>
  );
};

/** Gefängnistür (Gitter) – auf 0..1 = Gitterstäbe fahren hoch (offen). */
export const Gitter: React.FC<{ x: number; y: number; w?: number; h?: number; auf?: number; farbe?: string }> = ({ x, y, w = 240, h = 220, auf = 0, farbe = C.ink }) => {
  const n = 6;
  return (
    <g transform={`translate(${x - w / 2} ${y - h / 2})`}>
      <rect x={0} y={0} width={w} height={h} rx={10} fill="rgba(31,28,26,0.08)" stroke={farbe} strokeWidth={10} />
      <clipPath id="h90gitter"><rect x={0} y={0} width={w} height={h} /></clipPath>
      <g clipPath="url(#h90gitter)">
        {Array.from({ length: n }, (_, i) => (
          <line key={i} x1={(w * (i + 1)) / (n + 1)} y1={-h * auf} x2={(w * (i + 1)) / (n + 1)} y2={h - h * auf} stroke={farbe} strokeWidth={11} strokeLinecap="round" />
        ))}
        <line x1={0} y1={h * 0.5 - h * auf} x2={w} y2={h * 0.5 - h * auf} stroke={farbe} strokeWidth={10} />
      </g>
    </g>
  );
};

/** Mund (Sprechblasen-Lippen) – für „kein Wort“. */
export const Mund: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-90 0 Q -45 -48 0 -22 Q 45 -48 90 0 Q 45 52 0 44 Q -45 52 -90 0 Z" fill="#e0483b" stroke={C.ink} strokeWidth={8} strokeLinejoin="round" />
    <path d="M-90 0 Q 0 16 90 0" fill="none" stroke={C.ink} strokeWidth={7} />
  </g>
);

/** Umdreh-Pfeil (Kreisbogen mit Spitze). */
export const DrehPfeil: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} fill="none" stroke={C.ink} strokeWidth={14} strokeLinecap="round" strokeLinejoin="round">
    <path d="M70 -20 A 75 75 0 1 0 60 50" />
    <path d="M30 60 L 62 50 L 58 18" />
  </g>
);

/** Rotes X. */
export const RotesX: React.FC<{ x: number; y: number; r: number; p?: number; dick?: number }> = ({ x, y, r, p = 1, dick = 24 }) => (
  <g stroke={C.red} strokeWidth={dick} strokeLinecap="round">
    <line x1={x - r * p} y1={y - r * p} x2={x + r * p} y2={y + r * p} />
    <line x1={x + r * p} y1={y - r * p} x2={x - r * p} y2={y + r * p} />
  </g>
);
