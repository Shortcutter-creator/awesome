// Illustrationen Folge 10 (Der Rundgang). Gleicher Stil wie icons.tsx; glow = Röntgen-Fassung.
import React from "react";
import { C, MONO } from "../../basis/lib";

type P = { size?: number; glow?: boolean; style?: React.CSSProperties };
const ink = (g?: boolean) => (g ? C.glow : C.ink);
const fill = (g: boolean | undefined, f: string) => (g ? "rgba(143,216,255,0.2)" : f);
const gl = (g?: boolean): React.CSSProperties => (g ? { filter: "drop-shadow(0 0 14px rgba(143,216,255,0.45)) drop-shadow(0 0 3px rgba(143,216,255,0.8))" } : {});

// ---------------------------------------------------------------------------
// Grundriss (Rundweg mit Abteilungen), viewBox 900 × 1000
// ---------------------------------------------------------------------------
export const PTS: [number, number][] = [[60, 900], [840, 900], [840, 660], [60, 660], [60, 420], [840, 420], [840, 180], [60, 180]];
const SEG = PTS.slice(1).map((p, i) => Math.hypot(p[0] - PTS[i][0], p[1] - PTS[i][1]));
export const TOTAL = SEG.reduce((a, b) => a + b, 0);
/** Punkt + Richtung (Grad) bei Streckenanteil s (0..1). */
export const routeAt = (s: number): [number, number, number] => {
  let d = Math.max(0, Math.min(1, s)) * TOTAL;
  for (let i = 0; i < SEG.length; i++) {
    if (d <= SEG[i] || i === SEG.length - 1) {
      const f = Math.min(1, d / SEG[i]);
      const [x0, y0] = PTS[i], [x1, y1] = PTS[i + 1];
      return [x0 + (x1 - x0) * f, y0 + (y1 - y0) * f, (Math.atan2(y1 - y0, x1 - x0) * 180) / Math.PI];
    }
    d -= SEG[i];
  }
  return [60, 180, 180];
};
const BLOCK_X = [130, 350, 570];
const BLOCK_Y = [700, 460, 220];
const BLOCK_COL = ["#f2b6c0", "#bfe0f4", "#f3d36b", "#cfe8c4", "#e8c9a8", "#d9c9f0", "#f6c7a0", "#b8e0d8", "#f0d98a"];
/** s-Wert, bei dem die Route Block (r,c) passiert. */
export const blockS = (r: number, c: number) => {
  const cx = BLOCK_X[c] + 100;
  if (r === 0) return (cx - 60) / TOTAL;
  if (r === 1) return (SEG[0] + SEG[1] + (840 - cx)) / TOTAL;
  return (SEG[0] + SEG[1] + SEG[2] + SEG[3] + (cx - 60)) / TOTAL;
};

export const Plan: React.FC<{
  scale: number; dark?: boolean; s?: number | null; route?: number; pfeile?: number; blink?: boolean; kurz?: number; rueck?: number; style?: React.CSSProperties;
}> = ({ scale, dark, s = null, route = 0, pfeile = 0, blink, kurz = 0, rueck = 0, style }) => {
  const stroke = dark ? C.glow : C.ink;
  const poly = PTS.map((p) => p.join(",")).join(" ");
  const person = s !== null ? routeAt(s) : null;
  const chevrons = Array.from({ length: 38 }).map((_, i) => ({ i, p: routeAt(((i + 0.5) * 100) / TOTAL) }));
  return (
    <svg width={900 * scale} height={1000 * scale} viewBox="0 0 900 1000" style={{ overflow: "visible", ...(dark ? { filter: "drop-shadow(0 0 10px rgba(143,216,255,0.25))" } : {}), ...style }}>
      <rect x={20} y={90} width={860} height={890} rx={14} fill={dark ? "rgba(143,216,255,0.06)" : C.paper2} stroke={stroke} strokeWidth={9} />
      <polyline points={poly} fill="none" stroke={dark ? "rgba(143,216,255,0.12)" : "#dde6ee"} strokeWidth={66} strokeLinejoin="round" strokeLinecap="round" />
      {BLOCK_Y.map((y, r) =>
        BLOCK_X.map((x, c) => {
          const sc = blockS(r, c);
          const fl = blink && s !== null ? (s >= sc ? Math.max(0, 1 - (s - sc) / 0.07) : 0) : 0;
          const besucht = blink && s !== null && s >= sc ? 0.28 : 0;
          return (
            <rect key={`${r}${c}`} x={x} y={y} width={200} height={160} rx={12}
              fill={dark ? `rgba(143,216,255,${0.1 + besucht * 0.5 + fl * 0.6})` : BLOCK_COL[r * 3 + c]}
              stroke={stroke} strokeWidth={6} />
          );
        }),
      )}
      {route > 0 && <polyline points={poly} fill="none" stroke={dark ? C.glow : C.red} strokeWidth={14} strokeLinejoin="round" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - route} opacity={0.9} />}
      {pfeile > 0 &&
        chevrons.map(({ i, p }) =>
          i / 38 <= pfeile ? (
            <path key={i} d="M-12 -14 L8 0 L-12 14" fill="none" stroke={dark ? "#eaf7ff" : C.ink} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" transform={`translate(${p[0]} ${p[1]}) rotate(${p[2]})`} />
          ) : null,
        )}
      {kurz > 0 && (
        <g opacity={1}>
          <clipPath id="kc"><rect x={0} y={1000 - kurz * 900} width={900} height={1000} /></clipPath>
          <g clipPath="url(#kc)">
            <polyline points="340,900 340,660" fill="none" stroke={C.green} strokeWidth={12} strokeDasharray="16 12" strokeLinecap="round" />
            <polyline points="560,660 560,420" fill="none" stroke={C.green} strokeWidth={12} strokeDasharray="16 12" strokeLinecap="round" />
            <polyline points="340,420 340,180" fill="none" stroke={C.green} strokeWidth={12} strokeDasharray="16 12" strokeLinecap="round" />
          </g>
        </g>
      )}
      <rect x={30} y={930} width={170} height={46} rx={8} fill={dark ? "rgba(47,163,95,0.35)" : C.green} stroke={stroke} strokeWidth={6} />
      <text x={115} y={962} textAnchor="middle" fontFamily={MONO} fontWeight={700} fontSize={26} letterSpacing={3} fill={dark ? "#eaf7ff" : "#fff"}>AUSGANG</text>
      {person && rueck > 0 && (
        <line x1={person[0]} y1={person[1]} x2={115 + (person[0] - 115) * (1 - rueck)} y2={930 + (person[1] - 930) * (1 - rueck)} stroke={C.red} strokeWidth={9} strokeDasharray="18 14" strokeLinecap="round" />
      )}
      {person && (
        <g transform={`translate(${person[0]} ${person[1]})`}>
          <circle r={40} fill={dark ? "rgba(143,216,255,0.5)" : C.red} stroke={stroke} strokeWidth={8} />
          <circle r={12} fill={dark ? "#fff" : "#fff"} />
        </g>
      )}
    </svg>
  );
};

// ---------------------------------------------------------------------------
export const Kompass: React.FC<P & { winkel: number }> = ({ size = 260, glow, style, winkel }) => (
  <svg width={size} height={size} viewBox="0 0 200 200" style={{ overflow: "visible", ...gl(glow), ...style }}>
    <circle cx={100} cy={100} r={88} fill={fill(glow, "#fff")} stroke={ink(glow)} strokeWidth={9} />
    {[0, 90, 180, 270].map((a) => <line key={a} x1={100} y1={22} x2={100} y2={38} stroke={ink(glow)} strokeWidth={7} strokeLinecap="round" transform={`rotate(${a} 100 100)`} />)}
    <g transform={`rotate(${winkel} 100 100)`}>
      <path d="M100 38 L116 100 L84 100 Z" fill={C.red} stroke={ink(glow)} strokeWidth={5} strokeLinejoin="round" />
      <path d="M100 162 L116 100 L84 100 Z" fill={glow ? "rgba(143,216,255,0.5)" : C.steel} stroke={ink(glow)} strokeWidth={5} strokeLinejoin="round" />
    </g>
    <circle cx={100} cy={100} r={8} fill={ink(glow)} />
  </svg>
);

export const Lupe: React.FC<P> = ({ size = 170, glow, style }) => (
  <svg width={size} height={size} viewBox="0 0 160 160" style={{ overflow: "visible", ...gl(glow), ...style }}>
    <circle cx={64} cy={64} r={46} fill="rgba(191,224,244,0.45)" stroke={ink(glow)} strokeWidth={10} />
    <path d="M98 98 L146 146" stroke={ink(glow)} strokeWidth={18} strokeLinecap="round" />
  </svg>
);

/** Gelbe Tragetasche, ohne Logo. */
export const Tasche: React.FC<P> = ({ size = 420, glow, style }) => (
  <svg width={size} height={size * 1.05} viewBox="0 0 400 420" style={{ overflow: "visible", ...gl(glow), ...style }}>
    <path d="M120 110 C 110 -10, 290 -10, 280 110" fill="none" stroke={ink(glow)} strokeWidth={12} strokeLinecap="round" />
    <path d="M60 110 L340 110 L372 396 Q 374 410 360 410 L40 410 Q 26 410 28 396 Z" fill={fill(glow, "#f1c94a")} stroke={ink(glow)} strokeWidth={9} strokeLinejoin="round" />
    <path d="M70 150 L330 150" stroke={ink(glow)} strokeWidth={5} opacity={0.35} />
  </svg>
);

export const Kerze: React.FC<P> = ({ size = 160, glow, style }) => (
  <svg width={size} height={size} viewBox="0 0 160 160" style={{ overflow: "visible", ...gl(glow), ...style }}>
    <path d="M36 92 L124 92 L116 140 Q 114 148 106 148 L54 148 Q 46 148 44 140 Z" fill={fill(glow, "#e6e9ee")} stroke={ink(glow)} strokeWidth={8} strokeLinejoin="round" />
    <path d="M80 90 Q 52 58 80 18 Q 108 58 80 90 Z" fill={glow ? "rgba(143,216,255,0.6)" : C.yellow} stroke={ink(glow)} strokeWidth={7} strokeLinejoin="round" />
  </svg>
);
export const Kissen: React.FC<P> = ({ size = 160, glow, style }) => (
  <svg width={size} height={size} viewBox="0 0 160 160" style={{ overflow: "visible", ...gl(glow), ...style }}>
    <path d="M14 30 Q 80 12 146 30 Q 134 80 146 130 Q 80 148 14 130 Q 26 80 14 30 Z" fill={fill(glow, "#e0867b")} stroke={ink(glow)} strokeWidth={8} strokeLinejoin="round" />
    <circle cx={80} cy={80} r={8} fill={ink(glow)} />
  </svg>
);
export const Pflanze: React.FC<P> = ({ size = 160, glow, style }) => (
  <svg width={size} height={size} viewBox="0 0 160 160" style={{ overflow: "visible", ...gl(glow), ...style }}>
    <path d="M80 96 Q 40 90 36 40 Q 78 44 80 96 Z M80 96 Q 120 90 126 36 Q 84 42 80 96 Z M80 100 Q 72 60 80 14 Q 94 60 80 100 Z" fill={fill(glow, C.green)} stroke={ink(glow)} strokeWidth={6} strokeLinejoin="round" />
    <path d="M44 100 L116 100 L106 150 Q 104 156 98 156 L62 156 Q 56 156 54 150 Z" fill={fill(glow, "#c8714a")} stroke={ink(glow)} strokeWidth={8} strokeLinejoin="round" />
  </svg>
);

export const Museum: React.FC<P> = ({ size = 170, glow, style }) => (
  <svg width={size} height={size * 0.85} viewBox="0 0 170 145" style={{ overflow: "visible", ...gl(glow), ...style }}>
    <path d="M8 52 L85 10 L162 52 Z" fill={fill(glow, "#e6e9ee")} stroke={ink(glow)} strokeWidth={7} strokeLinejoin="round" />
    {[30, 62, 94, 126].map((x) => <rect key={x} x={x} y={58} width={16} height={56} fill={fill(glow, "#fff")} stroke={ink(glow)} strokeWidth={6} />)}
    <rect x={8} y={118} width={154} height={18} rx={4} fill={fill(glow, "#c9cfd6")} stroke={ink(glow)} strokeWidth={7} />
  </svg>
);
export const Flugzeug: React.FC<P> = ({ size = 180, glow, style }) => (
  <svg width={size} height={size * 0.7} viewBox="0 0 180 126" style={{ overflow: "visible", ...gl(glow), ...style }}>
    <path d="M10 62 Q 10 46 34 46 L 120 46 Q 168 46 172 62 Q 168 78 120 78 L 34 78 Q 10 78 10 62 Z" fill={fill(glow, "#fff")} stroke={ink(glow)} strokeWidth={7} strokeLinejoin="round" />
    <path d="M70 48 L 44 8 L 70 8 L 108 48 Z M70 76 L 44 116 L 70 116 L 108 76 Z" fill={fill(glow, C.sky)} stroke={ink(glow)} strokeWidth={6} strokeLinejoin="round" />
    <path d="M14 48 L 6 22 L 28 46 Z" fill={fill(glow, C.red)} stroke={ink(glow)} strokeWidth={6} strokeLinejoin="round" />
  </svg>
);
export const Bonbon: React.FC<P> = ({ size = 170, glow, style }) => (
  <svg width={size} height={size * 0.6} viewBox="0 0 170 102" style={{ overflow: "visible", ...gl(glow), ...style }}>
    <path d="M44 51 L8 26 L8 76 Z M126 51 L162 26 L162 76 Z" fill={fill(glow, C.red)} stroke={ink(glow)} strokeWidth={6} strokeLinejoin="round" />
    <ellipse cx={85} cy={51} rx={44} ry={36} fill={fill(glow, "#f0a0b8")} stroke={ink(glow)} strokeWidth={8} />
    <path d="M62 34 Q 85 56 108 68" fill="none" stroke="#fff" strokeWidth={8} strokeLinecap="round" opacity={0.8} />
  </svg>
);
export const Regal: React.FC<P> = ({ size = 300, glow, style }) => (
  <svg width={size} height={size * 0.8} viewBox="0 0 300 240" style={{ overflow: "visible", ...gl(glow), ...style }}>
    <rect x={10} y={10} width={280} height={220} rx={8} fill="none" stroke={ink(glow)} strokeWidth={9} />
    <line x1={10} y1={120} x2={290} y2={120} stroke={ink(glow)} strokeWidth={9} />
    <rect x={30} y={60} width={70} height={52} fill={fill(glow, "#c9a06a")} stroke={ink(glow)} strokeWidth={6} />
    <rect x={120} y={72} width={60} height={40} fill={fill(glow, "#f2b6c0")} stroke={ink(glow)} strokeWidth={6} />
    <rect x={200} y={50} width={72} height={62} fill={fill(glow, "#bfe0f4")} stroke={ink(glow)} strokeWidth={6} />
    <rect x={30} y={170} width={86} height={52} fill={fill(glow, "#f3d36b")} stroke={ink(glow)} strokeWidth={6} />
    <rect x={150} y={150} width={60} height={72} fill={fill(glow, "#cfe8c4")} stroke={ink(glow)} strokeWidth={6} />
  </svg>
);

// --- ergänzt 20.10.2026 (Neufassung mit Arthur) -----------------------------
/** Wende-Pfeil („zurückholen“). */
export const Wende: React.FC<P> = ({ size = 260, glow, style }) => (
  <svg width={size} height={size} viewBox="0 0 200 200" style={{ overflow: "visible", ...gl(glow), ...style }}>
    <path d="M150 170 L150 80 Q 150 30 100 30 Q 50 30 50 80 L50 120" fill="none" stroke={ink(glow)} strokeWidth={18} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M18 100 L50 140 L82 100" fill="none" stroke={ink(glow)} strokeWidth={18} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
/** Stoppuhr, Zeiger auf winkel (Grad). */
export const Uhr: React.FC<P & { winkel: number }> = ({ size = 200, glow, style, winkel }) => (
  <svg width={size} height={size} viewBox="0 0 200 200" style={{ overflow: "visible", ...gl(glow), ...style }}>
    <rect x={86} y={6} width={28} height={22} rx={5} fill={fill(glow, "#fff")} stroke={ink(glow)} strokeWidth={7} />
    <circle cx={100} cy={112} r={80} fill={fill(glow, "#fff")} stroke={ink(glow)} strokeWidth={9} />
    {[0, 90, 180, 270].map((a) => <line key={a} x1={100} y1={42} x2={100} y2={56} stroke={ink(glow)} strokeWidth={7} strokeLinecap="round" transform={`rotate(${a} 100 112)`} />)}
    <line x1={100} y1={112} x2={100} y2={58} stroke={C.red} strokeWidth={9} strokeLinecap="round" transform={`rotate(${winkel} 100 112)`} />
    <circle cx={100} cy={112} r={9} fill={ink(glow)} />
  </svg>
);
/** Zielfahne. */
export const Fahne: React.FC<P> = ({ size = 180, glow, style }) => (
  <svg width={size} height={size} viewBox="0 0 160 160" style={{ overflow: "visible", ...gl(glow), ...style }}>
    <line x1={40} y1={150} x2={40} y2={12} stroke={ink(glow)} strokeWidth={10} strokeLinecap="round" />
    <path d="M44 16 L140 40 L44 70 Z" fill={glow ? "rgba(111,224,160,0.55)" : C.green} stroke={ink(glow)} strokeWidth={7} strokeLinejoin="round" />
  </svg>
);
