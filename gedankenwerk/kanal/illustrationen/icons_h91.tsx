// Illustrationen Formattest #91 („Roter oder blauer Knopf“). Bild-Koordinaten 1080 × 1920.
// Eigene Datei, gemeinsame Dateien (lib.tsx, icons.tsx, icons_h90.tsx) bleiben unberührt.
import React from "react";
import { C } from "../../basis/lib";

export const ROT = "#e0483b";
export const ROT_DUNKEL = "#a32a20";
export const BLAU = "#3b82f6";
export const BLAU_DUNKEL = "#1f4fa8";
export const GRAU = "#a49d93";
export const GRAU_DUNKEL = "#6f6961";

/** Großer Druckknopf auf Säule. x = Mitte, y = Oberkante der Säule. druck 0..1 = Kappe gedrückt, grau 0..1 = entsättigt, hell 0..1 = Glühen. */
export const Knopf: React.FC<{ x: number; y: number; farbe: "r" | "b"; druck?: number; grau?: number; hell?: number; boden?: number; s?: number }> = ({
  x, y, farbe, druck = 0, grau = 0, hell = 0, boden = 1010, s = 1,
}) => {
  const f = farbe === "r" ? ROT : BLAU;
  const fd = farbe === "r" ? ROT_DUNKEL : BLAU_DUNKEL;
  const mixc = (a: string, b: string) => (grau > 0.5 ? b : a);
  const cap = mixc(f, GRAU), capD = mixc(fd, GRAU_DUNKEL);
  const rx = 112 * s, ry = 34 * s, hoehe = 46 * s;
  const capY = y - 52 * s + druck * 26 * s; // Oberseite der Kappe
  return (
    <g>
      {/* Glühen */}
      {hell > 0.01 && <circle cx={x} cy={y - 40 * s} r={210 * s} fill={cap} opacity={0.22 * hell} />}
      {/* Säule */}
      <rect x={x - 92 * s} y={y} width={184 * s} height={boden - y} fill="#d9d3c8" stroke={C.ink} strokeWidth={7} />
      <rect x={x - 92 * s} y={y} width={30 * s} height={boden - y} fill="#fff" opacity={0.35} />
      {/* Gehäuse */}
      <path d={`M${x - 140 * s} ${y} L ${x - 140 * s} ${y - 14 * s} A ${140 * s} ${42 * s} 0 0 1 ${x + 140 * s} ${y - 14 * s} L ${x + 140 * s} ${y} A ${140 * s} ${42 * s} 0 0 1 ${x - 140 * s} ${y} Z`}
        fill="#3a3632" stroke={C.ink} strokeWidth={7} strokeLinejoin="round" />
      <ellipse cx={x} cy={y - 14 * s} rx={140 * s} ry={42 * s} fill="#55504a" stroke={C.ink} strokeWidth={7} />
      <ellipse cx={x} cy={y - 14 * s} rx={120 * s} ry={34 * s} fill="#2a2724" />
      {/* Kappe (Zylinder) */}
      <path d={`M${x - rx} ${capY} L ${x - rx} ${capY + hoehe} A ${rx} ${ry} 0 0 0 ${x + rx} ${capY + hoehe} L ${x + rx} ${capY} Z`}
        fill={capD} stroke={C.ink} strokeWidth={7} strokeLinejoin="round" />
      <ellipse cx={x} cy={capY} rx={rx} ry={ry} fill={cap} stroke={C.ink} strokeWidth={7} />
      <ellipse cx={x - 34 * s} cy={capY - 8 * s} rx={38 * s} ry={11 * s} fill="#fff" opacity={0.45} />
    </g>
  );
};

/** „Du“-Figur von vorn. Füße bei (x, y). greif −1..1 = Hände reichen zum linken (rot) bzw. rechten (blau) Knopf; blick −1..1. */
export const Du: React.FC<{ x: number; y: number; greif?: number; blick?: number; atem?: number; s?: number }> = ({ x, y, greif = 0, blick = 0, atem = 0, s = 1 }) => {
  const sch = y - 228 * s + atem * 2; // Schulterhöhe
  const hy = y - 290 * s; // Kopfmitte
  const arm = (seite: -1 | 1) => {
    const zu = Math.max(0, seite * greif); // dieser Arm greift
    const hx = x + seite * (52 + 70 * zu) * s;
    const hyy = sch + (110 - 70 * zu) * s;
    return { hx, hyy };
  };
  const l = arm(-1), r = arm(1);
  return (
    <g>
      {/* Beine */}
      <path d={`M${x - 16 * s} ${y - 112 * s} L ${x - 22 * s} ${y} M ${x + 16 * s} ${y - 112 * s} L ${x + 22 * s} ${y}`} stroke="#4b5563" strokeWidth={30 * s} strokeLinecap="round" />
      <ellipse cx={x - 26 * s} cy={y - 3 * s} rx={22 * s} ry={9 * s} fill="#fff" stroke={C.ink} strokeWidth={5} />
      <ellipse cx={x + 26 * s} cy={y - 3 * s} rx={22 * s} ry={9 * s} fill="#fff" stroke={C.ink} strokeWidth={5} />
      {/* Arme */}
      {[l, r].map((a, i) => (
        <g key={i}>
          <path d={`M${x + (i ? 30 : -30) * s} ${sch + 12 * s} L ${a.hx} ${a.hyy}`} stroke="#f6f3ec" strokeWidth={24 * s} strokeLinecap="round" />
          <path d={`M${x + (i ? 30 : -30) * s} ${sch + 12 * s} L ${a.hx} ${a.hyy}`} fill="none" stroke={C.ink} strokeWidth={4} strokeLinecap="round" opacity={0.35} />
          <circle cx={a.hx} cy={a.hyy} r={13 * s} fill="#f0c9a6" stroke={C.ink} strokeWidth={5} />
        </g>
      ))}
      {/* Rumpf */}
      <rect x={x - 40 * s} y={sch} width={80 * s} height={y - 104 * s - sch} rx={24 * s} fill="#f6f3ec" stroke={C.ink} strokeWidth={7} />
      {/* Kopf */}
      <rect x={x - 10 * s} y={hy + 30 * s} width={20 * s} height={sch - hy - 28 * s} fill="#f0c9a6" stroke={C.ink} strokeWidth={5} />
      <circle cx={x} cy={hy} r={40 * s} fill="#f0c9a6" stroke={C.ink} strokeWidth={7} />
      <circle cx={x - 13 * s + blick * 9 * s} cy={hy - 4 * s} r={5.5 * s} fill={C.ink} />
      <circle cx={x + 13 * s + blick * 9 * s} cy={hy - 4 * s} r={5.5 * s} fill={C.ink} />
      <path d={`M${x - 10 * s + blick * 6 * s} ${hy + 17 * s} Q ${x + blick * 6 * s} ${hy + 12 * s} ${x + 10 * s + blick * 6 * s} ${hy + 17 * s}`} fill="none" stroke={C.ink} strokeWidth={4} strokeLinecap="round" />
    </g>
  );
};

/** Kleiner Mensch in der Menge. Füße bei (x, y). farbe = Shirtfarbe, tot 0..1 = grau + kippt um. */
export const Mini: React.FC<{ x: number; y: number; farbe: string; tot?: number; hub?: number; s?: number }> = ({ x, y, farbe, tot = 0, hub = 0, s = 1 }) => (
  <g transform={`translate(${x} ${y - hub}) rotate(${tot * 80}) scale(${s})`} opacity={1 - 0.55 * tot}>
    <rect x={-15} y={-38} width={30} height={34} rx={11} fill={tot > 0.5 ? GRAU : farbe} stroke={C.ink} strokeWidth={4} />
    <circle cx={0} cy={-50} r={11} fill={tot > 0.5 ? "#cfc9bf" : "#f0c9a6"} stroke={C.ink} strokeWidth={4} />
    <path d="M-7 -4 L -8 4 M 7 -4 L 8 4" stroke={C.ink} strokeWidth={6} strokeLinecap="round" />
  </g>
);

/** Sichtschutz-Kabine vor einem Mini (Füße bei x, y). p 0..1 = hochgefahren. */
export const Kabine: React.FC<{ x: number; y: number; p: number }> = ({ x, y, p }) => {
  if (p <= 0.01) return null;
  const h = 70 * p;
  return (
    <g>
      <rect x={x - 27} y={y + 6 - h} width={54} height={h} rx={6} fill="#8a837b" stroke={C.ink} strokeWidth={4} />
      <line x1={x - 18} y1={y + 6 - h + 12} x2={x + 18} y2={y + 6 - h + 12} stroke="#f6f3ec" strokeWidth={4} opacity={0.5 * p} />
    </g>
  );
};

/** Haken im grünen Kreis. */
export const Haken: React.FC<{ x: number; y: number; r: number; p?: number }> = ({ x, y, r, p = 1 }) => {
  if (p <= 0.01) return null;
  return (
    <g transform={`translate(${x} ${y}) scale(${p})`}>
      <circle r={r} fill={C.green} stroke={C.ink} strokeWidth={Math.max(3, r * 0.12)} />
      <path d={`M${-r * 0.45} ${r * 0.02} L ${-r * 0.12} ${r * 0.34} L ${r * 0.5} ${-r * 0.35}`} fill="none" stroke="#fff" strokeWidth={r * 0.22} strokeLinecap="round" strokeLinejoin="round" />
    </g>
  );
};

/** Kreuz im roten Kreis. */
export const Kreuz: React.FC<{ x: number; y: number; r: number; p?: number }> = ({ x, y, r, p = 1 }) => {
  if (p <= 0.01) return null;
  return (
    <g transform={`translate(${x} ${y}) scale(${p})`}>
      <circle r={r} fill={C.red} stroke={C.ink} strokeWidth={Math.max(3, r * 0.12)} />
      <path d={`M${-r * 0.36} ${-r * 0.36} L ${r * 0.36} ${r * 0.36} M ${r * 0.36} ${-r * 0.36} L ${-r * 0.36} ${r * 0.36}`} stroke="#fff" strokeWidth={r * 0.22} strokeLinecap="round" />
    </g>
  );
};

/** Auge, x = 0..1 durchgestrichen (rotes X). */
export const Auge: React.FC<{ x: number; y: number; s?: number; zu?: number }> = ({ x, y, s = 1, zu = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <circle r={118} fill={C.paper2} stroke={C.ink} strokeWidth={8} />
    <path d="M-82 0 Q 0 -70 82 0 Q 0 70 -82 0 Z" fill="#fff" stroke={C.ink} strokeWidth={8} strokeLinejoin="round" />
    <circle r={28} fill={C.ink} />
    <circle cx={-9} cy={-9} r={8} fill="#fff" />
    {zu > 0.01 && (
      <g stroke={C.red} strokeWidth={22} strokeLinecap="round">
        <line x1={-80 * zu} y1={-80 * zu} x2={80 * zu} y2={80 * zu} />
        <line x1={80 * zu} y1={-80 * zu} x2={-80 * zu} y2={80 * zu} />
      </g>
    )}
  </g>
);

/** Erde (dreht sich: dreh in Grad, Kontinente wandern horizontal). */
export const Erde: React.FC<{ x: number; y: number; r: number; dreh: number; id?: string }> = ({ x, y, r, dreh, id = "h91erde" }) => {
  const P = r * 2.4; // Musterbreite: immer Land sichtbar
  const off = ((dreh % 360) / 360) * P;
  const land = (dx: number) => (
    <g transform={`translate(${dx} 0)`} fill="#4caf6e" stroke={C.ink} strokeWidth={5} strokeLinejoin="round">
      <path d={`M${-r * 0.7} ${-r * 0.55} q ${r * 0.35} ${-r * 0.25} ${r * 0.6} ${-r * 0.05} q ${r * 0.1} ${r * 0.3} ${-r * 0.1} ${r * 0.45} q ${-r * 0.1} ${r * 0.35} ${-r * 0.35} ${r * 0.2} q ${-r * 0.25} ${-r * 0.25} ${-r * 0.15} ${-r * 0.6} Z`} />
      <path d={`M${r * 0.15} ${r * 0.05} q ${r * 0.3} ${-r * 0.1} ${r * 0.45} ${r * 0.15} q ${r * 0.05} ${r * 0.35} ${-r * 0.2} ${r * 0.6} q ${-r * 0.25} ${-r * 0.1} ${-r * 0.25} ${-r * 0.75} Z`} />
      <path d={`M${r * 0.95} ${-r * 0.6} q ${r * 0.4} ${-r * 0.1} ${r * 0.55} ${r * 0.2} q ${-r * 0.1} ${r * 0.3} ${-r * 0.45} ${r * 0.25} q ${-r * 0.2} ${-r * 0.2} ${-r * 0.1} ${-r * 0.45} Z`} />
    </g>
  );
  return (
    <g transform={`translate(${x} ${y})`}>
      <clipPath id={id}><circle r={r} /></clipPath>
      <circle r={r} fill="#5aa6e8" />
      <g clipPath={`url(#${id})`}>
        {land(-off)}
        {land(-off + P)}
        {land(-off - P)}
        {land(-off + 2 * P)}
      </g>
      <circle r={r} fill="none" stroke={C.ink} strokeWidth={8} />
      <ellipse cx={-r * 0.38} cy={-r * 0.45} rx={r * 0.25} ry={r * 0.12} fill="#fff" opacity={0.35} />
    </g>
  );
};
