// Illustrationen Folge 05 (Der Streichpreis). Gleicher Stil wie icons.tsx; glow = Röntgen-Fassung.
import React from "react";
import { C, HEAD, MONO } from "../../basis/lib";

type P = { size?: number; glow?: boolean; style?: React.CSSProperties };
const ink = (g?: boolean) => (g ? C.glow : C.ink);
const fill = (g: boolean | undefined, f: string) => (g ? "rgba(143,216,255,0.2)" : f);
const gl = (g?: boolean): React.CSSProperties => (g ? { filter: "drop-shadow(0 0 14px rgba(143,216,255,0.45)) drop-shadow(0 0 3px rgba(143,216,255,0.8))" } : {});

/** Prospekt (Breite = size): Kopfband, zwei Produktfelder mit durchgestrichenem Preis (Balken, keine Ziffern). strike 0..1 */
export const Prospekt: React.FC<P & { strike?: number }> = ({ size = 560, glow, style, strike = 1 }) => {
  const prod = (x: number, col: string) => (
    <g>
      <rect x={x} y={150} width={150} height={120} rx={12} fill={fill(glow, col)} stroke={ink(glow)} strokeWidth={7} />
      <rect x={x + 20} y={296} width={80} height={22} rx={8} fill={C.muted} opacity={0.7} />
      <path d={`M${x + 6} ${312} L${x + 114} ${298}`} stroke={C.red} strokeWidth={9} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - strike} />
      <rect x={x + 20} y={336} width={110} height={34} rx={10} fill={C.red} />
    </g>
  );
  return (
    <svg width={size} height={size * 1.3} viewBox="0 0 400 520" style={{ overflow: "visible", ...gl(glow), ...style }}>
      <rect x={20} y={14} width={360} height={490} rx={16} fill={fill(glow, "#ffffff")} stroke={ink(glow)} strokeWidth={8} />
      <rect x={20} y={14} width={360} height={96} rx={16} fill={fill(glow, C.red)} stroke={ink(glow)} strokeWidth={8} />
      <rect x={46} y={42} width={180} height={18} rx={9} fill="#fff" opacity={0.9} />
      <rect x={46} y={70} width={120} height={12} rx={6} fill="#fff" opacity={0.6} />
      {prod(46, C.sky)}
      {prod(214, C.yellow)}
      <rect x={46} y={410} width={308} height={14} rx={7} fill={ink(glow)} opacity={0.18} />
      <rect x={46} y={436} width={220} height={14} rx={7} fill={ink(glow)} opacity={0.18} />
    </svg>
  );
};

/** Richterhammer; angle = Kippung des Hammers (0 = oben, 35 = Schlag). */
export const Hammer: React.FC<P & { angle?: number }> = ({ size = 380, glow, style, angle = 0 }) => (
  <svg width={size} height={size * 0.9} viewBox="0 0 300 270" style={{ overflow: "visible", ...gl(glow), ...style }}>
    <rect x={30} y={214} width={240} height={42} rx={12} fill={fill(glow, "#b98a5e")} stroke={ink(glow)} strokeWidth={8} />
    <g transform={`rotate(${angle} 210 200)`}>
      <path d="M200 190 L90 60" stroke={ink(glow)} strokeWidth={30} strokeLinecap="round" />
      <path d="M200 190 L90 60" stroke={fill(glow, "#d8a07a")} strokeWidth={14} strokeLinecap="round" />
      <g transform="rotate(-40 80 70)">
        <rect x={20} y={30} width={130} height={76} rx={14} fill={fill(glow, "#8a5a38")} stroke={ink(glow)} strokeWidth={8} />
        <rect x={52} y={30} width={14} height={76} fill={ink(glow)} opacity={0.5} />
        <rect x={104} y={30} width={14} height={76} fill={ink(glow)} opacity={0.5} />
      </g>
    </g>
  </svg>
);

export const Anker: React.FC<P> = ({ size = 300, glow, style }) => (
  <svg width={size} height={size * 1.2} viewBox="0 0 200 240" style={{ overflow: "visible", ...gl(glow), ...style }}>
    <circle cx={100} cy={30} r={20} fill="none" stroke={ink(glow)} strokeWidth={12} />
    <path d="M100 50 L100 210" stroke={ink(glow)} strokeWidth={14} strokeLinecap="round" />
    <path d="M62 84 L138 84" stroke={ink(glow)} strokeWidth={14} strokeLinecap="round" />
    <path d="M24 150 C 26 204, 76 220, 100 214 C 124 220, 174 204, 176 150" fill="none" stroke={ink(glow)} strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M24 150 L 8 128 M176 150 L192 128" stroke={ink(glow)} strokeWidth={14} strokeLinecap="round" />
  </svg>
);

/** Glücksrad: Segment „10“ oben, „65“ unten bei rot=0. rot in Grad; Zeiger oben fest. hub = Text in der Mitte. */
export const Gluecksrad: React.FC<P & { rot?: number; hub?: string }> = ({ size = 520, glow, style, rot = 0, hub }) => {
  const n = 8;
  const cols = [C.red, C.yellow, C.sky, C.green];
  const R = 190;
  const wedge = (i: number) => {
    const a0 = ((i - 0.5) * 360) / n - 90, a1 = ((i + 0.5) * 360) / n - 90;
    const p = (a: number) => `${200 + R * Math.cos((a * Math.PI) / 180)} ${200 + R * Math.sin((a * Math.PI) / 180)}`;
    return `M200 200 L${p(a0)} A${R} ${R} 0 0 1 ${p(a1)} Z`;
  };
  return (
    <svg width={size} height={size * 1.02} viewBox="0 0 400 410" style={{ overflow: "visible", ...gl(glow), ...style }}>
      <g transform={`translate(0 10) rotate(${rot} 200 200)`}>
        {Array.from({ length: n }).map((_, i) => (
          <path key={i} d={wedge(i)} fill={fill(glow, cols[i % 4])} stroke={ink(glow)} strokeWidth={6} strokeLinejoin="round" />
        ))}
        <circle cx={200} cy={200} r={R} fill="none" stroke={ink(glow)} strokeWidth={10} />
        <text x={200} y={72} textAnchor="middle" fontFamily={HEAD} fontWeight={900} fontSize={50} fill={glow ? "#eaf7ff" : C.ink}>10</text>
        <text x={200} y={342} textAnchor="middle" fontFamily={HEAD} fontWeight={900} fontSize={50} fill={glow ? "#eaf7ff" : C.ink} transform="rotate(180 200 330)">65</text>
      </g>
      <circle cx={200} cy={210} r={58} fill={glow ? "#1a2138" : "#fff"} stroke={ink(glow)} strokeWidth={8} />
      {hub && <text x={200} y={232} textAnchor="middle" fontFamily={HEAD} fontWeight={900} fontSize={64} fill={glow ? "#eaf7ff" : C.ink}>{hub}</text>}
      <path d="M176 4 L224 4 L200 46 Z" fill={C.red} stroke={ink(glow)} strokeWidth={7} strokeLinejoin="round" />
    </svg>
  );
};

/** Preisetikett mit Loch; children = Inhalt (Breite = size). */
export const Etikett: React.FC<P & { farbe?: string; children?: React.ReactNode }> = ({ size = 440, glow, style, farbe = "#f6f3ec", children }) => (
  <div style={{ position: "relative", width: size, height: size * 0.6, ...style }}>
    <svg width={size} height={size * 0.6} viewBox="0 0 400 240" style={{ position: "absolute", left: 0, top: 0, overflow: "visible", ...gl(glow) }}>
      <path d="M70 10 L370 10 Q 392 10 392 32 L392 208 Q 392 230 370 230 L70 230 L10 120 Z" fill={fill(glow, farbe)} stroke={ink(glow)} strokeWidth={9} strokeLinejoin="round" />
      <circle cx={70} cy={120} r={16} fill={glow ? "#1a2138" : C.paper} stroke={ink(glow)} strokeWidth={7} />
    </svg>
    <div style={{ position: "absolute", left: size * 0.22, right: size * 0.04, top: 0, bottom: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>{children}</div>
  </div>
);

export const Speisekarte: React.FC<P & { top?: number }> = ({ size = 150, glow, style, top = 1 }) => (
  <svg width={size} height={size} viewBox="0 0 150 150" style={{ overflow: "visible", ...gl(glow), ...style }}>
    <rect x={20} y={8} width={110} height={134} rx={10} fill={fill(glow, "#fff")} stroke={ink(glow)} strokeWidth={7} />
    <rect x={34} y={24} width={82} height={26} rx={6} fill={fill(glow, C.yellow)} stroke={ink(glow)} strokeWidth={5} opacity={top} />
    <rect x={34} y={64} width={60} height={9} rx={4} fill={ink(glow)} opacity={0.45} />
    <rect x={34} y={86} width={70} height={9} rx={4} fill={ink(glow)} opacity={0.45} />
    <rect x={34} y={108} width={50} height={9} rx={4} fill={ink(glow)} opacity={0.45} />
  </svg>
);

export const Sale: React.FC<P> = ({ size = 150, glow, style }) => (
  <svg width={size} height={size} viewBox="0 0 150 150" style={{ overflow: "visible", ...gl(glow), ...style }}>
    <path d="M75 6 L92 24 L116 18 L120 42 L142 52 L130 74 L142 96 L120 106 L116 132 L92 126 L75 144 L58 126 L34 132 L30 106 L8 96 L20 74 L8 52 L30 42 L34 18 L58 24 Z" fill={fill(glow, C.red)} stroke={ink(glow)} strokeWidth={6} strokeLinejoin="round" />
    <text x={75} y={92} textAnchor="middle" fontFamily={HEAD} fontWeight={900} fontSize={52} fill="#fff">%</text>
  </svg>
);

/** Kopf + Schultern (Büste). */
export const Kopf: React.FC<P> = ({ size = 520, glow, style }) => (
  <svg width={size} height={size} viewBox="0 0 400 400" style={{ overflow: "visible", ...gl(glow), ...style }}>
    <path d="M30 396 C 30 300, 120 280, 200 280 C 280 280, 370 300, 370 396 Z" fill={fill(glow, "#4d7fd1")} stroke={ink(glow)} strokeWidth={9} strokeLinejoin="round" />
    <rect x={165} y={236} width={70} height={60} fill={fill(glow, "#e8b48f")} stroke={ink(glow)} strokeWidth={8} />
    <circle cx={200} cy={150} r={118} fill={fill(glow, "#e8b48f")} stroke={ink(glow)} strokeWidth={9} />
  </svg>
);

/** Lupe (Nachbesserung 20.10.: „nur im Kleingedruckten“). */
export const Lupe: React.FC<P> = ({ size = 160, glow, style }) => (
  <svg width={size} height={size} viewBox="0 0 160 160" style={{ overflow: "visible", ...gl(glow), ...style }}>
    <circle cx={64} cy={64} r={46} fill={glow ? "rgba(143,216,255,0.12)" : "rgba(191,224,244,0.35)"} stroke={ink(glow)} strokeWidth={10} />
    <path d="M98 98 L146 146" stroke={ink(glow)} strokeWidth={18} strokeLinecap="round" />
  </svg>
);
