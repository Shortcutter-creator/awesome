// Flache Linien-Illustrationen für Kanal. `glow` = Röntgen-Fassung (leuchtende Kontur, ohne Füllung).
import React from "react";
import { C } from "../../basis/lib";

type P = { size?: number; glow?: boolean; style?: React.CSSProperties };
const ink = (g?: boolean) => (g ? C.glow : C.ink);
const fill = (g: boolean | undefined, f: string) => (g ? "rgba(143,216,255,0.2)" : f);
const glowStyle = (g?: boolean): React.CSSProperties => (g ? { filter: "drop-shadow(0 0 14px rgba(143,216,255,0.45)) drop-shadow(0 0 3px rgba(143,216,255,0.8))" } : {});

/** Küchenmaschine (Grundgerät mit Display und Drehknopf, Mixtopf mit Deckel und Griff). Keine Marke. */
export const Kuechenmaschine: React.FC<P & { screen?: number }> = ({ size = 420, glow, style, screen = 1 }) => (
  <svg width={size} height={size * 1.05} viewBox="0 0 400 420" style={{ overflow: "visible", ...glowStyle(glow), ...style }}>
    {/* Mixtopf */}
    <path d="M150 62 L330 62 L318 182 L162 182 Z" fill={fill(glow, C.steel)} stroke={ink(glow)} strokeWidth={8} strokeLinejoin="round" />
    <path d="M330 84 C 372 84, 378 158, 322 164" fill="none" stroke={ink(glow)} strokeWidth={10} strokeLinecap="round" />
    <path d="M172 92 L176 168" stroke={glow ? C.glow : "#ffffff"} strokeWidth={8} strokeLinecap="round" opacity={0.7} />
    {/* Deckel + Messbecher */}
    <rect x={140} y={40} width={200} height={26} rx={10} fill={fill(glow, "#3b4049")} stroke={ink(glow)} strokeWidth={8} />
    <rect x={215} y={16} width={50} height={28} rx={6} fill={fill(glow, "#3b4049")} stroke={ink(glow)} strokeWidth={8} />
    {/* Grundgerät */}
    <path d="M60 196 Q 60 170 90 170 L 340 170 Q 366 170 366 196 L 372 384 Q 372 404 350 404 L 50 404 Q 28 404 30 384 Z" fill={fill(glow, "#ffffff")} stroke={ink(glow)} strokeWidth={8} strokeLinejoin="round" />
    {/* Display */}
    <rect x={78} y={206} width={176} height={104} rx={16} fill={glow ? "rgba(143,216,255,0.08)" : "#26303d"} stroke={ink(glow)} strokeWidth={6} />
    <g opacity={screen}>
      <rect x={96} y={224} width={70} height={10} rx={5} fill={C.glow} opacity={0.9} />
      <rect x={96} y={244} width={120} height={8} rx={4} fill={C.glow} opacity={0.45} />
      <rect x={96} y={262} width={96} height={8} rx={4} fill={C.glow} opacity={0.45} />
      <circle cx={226} cy={282} r={11} fill="none" stroke={C.glow} strokeWidth={5} />
    </g>
    {/* Drehknopf */}
    <circle cx={166} cy={356} r={30} fill={fill(glow, "#e9ecef")} stroke={ink(glow)} strokeWidth={7} />
    <circle cx={166} cy={356} r={9} fill={ink(glow)} />
    <line x1={36} y1={404} x2={366} y2={404} stroke={ink(glow)} strokeWidth={8} strokeLinecap="round" />
  </svg>
);

/** Nur die gestrichelte Silhouette (Lücke im Regal). */
export const Silhouette: React.FC<P & { dash?: number }> = ({ size = 300, style, dash = 1 }) => (
  <svg width={size} height={size * 1.05} viewBox="0 0 400 420" style={{ overflow: "visible", ...style }}>
    <path
      d="M140 40 L340 40 L340 66 L330 66 L318 170 L 340 170 Q 366 170 366 196 L 372 384 Q 372 404 350 404 L 50 404 Q 28 404 30 384 L 60 196 Q 60 170 90 170 L 162 170 L 150 66 L 140 66 Z"
      fill="rgba(31,28,26,0.04)"
      stroke={C.ink}
      strokeWidth={7}
      strokeDasharray="22 16"
      strokeDashoffset={-dash * 76}
      opacity={0.6}
    />
  </svg>
);

export const Toaster: React.FC<P> = ({ size = 180, glow, style }) => (
  <svg width={size} height={size * 0.8} viewBox="0 0 200 160" style={{ overflow: "visible", ...style }}>
    <rect x={14} y={40} width={172} height={112} rx={34} fill={fill(glow, "#f0b8a8")} stroke={ink(glow)} strokeWidth={7} />
    <rect x={52} y={30} width={34} height={20} rx={6} fill="#d8a07a" stroke={ink(glow)} strokeWidth={6} />
    <rect x={112} y={30} width={34} height={20} rx={6} fill="#d8a07a" stroke={ink(glow)} strokeWidth={6} />
    <rect x={172} y={86} width={22} height={12} rx={5} fill={ink(glow)} />
  </svg>
);
export const Wasserkocher: React.FC<P> = ({ size = 150, glow, style }) => (
  <svg width={size} height={size * 1.2} viewBox="0 0 150 180" style={{ overflow: "visible", ...style }}>
    <path d="M34 40 L106 40 L118 166 L22 166 Z" fill={fill(glow, "#9fc9e8")} stroke={ink(glow)} strokeWidth={7} strokeLinejoin="round" />
    <path d="M106 56 C 146 60, 146 140, 114 146" fill="none" stroke={ink(glow)} strokeWidth={9} />
    <path d="M34 50 L10 34" stroke={ink(glow)} strokeWidth={9} strokeLinecap="round" />
    <rect x={14} y={162} width={112} height={14} rx={6} fill={ink(glow)} />
  </svg>
);
export const Mikrowelle: React.FC<P> = ({ size = 230, glow, style }) => (
  <svg width={size} height={size * 0.62} viewBox="0 0 240 150" style={{ overflow: "visible", ...style }}>
    <rect x={6} y={6} width={228} height={138} rx={16} fill={fill(glow, "#ffffff")} stroke={ink(glow)} strokeWidth={7} />
    <rect x={24} y={24} width={140} height={102} rx={10} fill="#3b4049" stroke={ink(glow)} strokeWidth={6} />
    <circle cx={198} cy={50} r={12} fill="none" stroke={ink(glow)} strokeWidth={6} />
    <rect x={186} y={80} width={26} height={8} rx={4} fill={ink(glow)} />
    <rect x={186} y={98} width={26} height={8} rx={4} fill={ink(glow)} />
  </svg>
);

export const Person: React.FC<P & { farbe?: string }> = ({ size = 160, glow, style, farbe = "#4d7fd1" }) => (
  <svg width={size} height={size} viewBox="0 0 160 160" style={{ overflow: "visible", ...glowStyle(glow), ...style }}>
    <circle cx={80} cy={52} r={32} fill={fill(glow, "#5a4636")} stroke={ink(glow)} strokeWidth={7} />
    <path d="M18 156 C 18 104, 142 104, 142 156 Z" fill={fill(glow, farbe)} stroke={ink(glow)} strokeWidth={7} strokeLinejoin="round" />
  </svg>
);

/** Zeigende Hand, kommt von rechts. */
export const Hand: React.FC<P> = ({ size = 260, glow, style }) => (
  <svg width={size} height={size * 0.5} viewBox="0 0 260 130" style={{ overflow: "visible", ...glowStyle(glow), ...style }}>
    <rect x={150} y={40} width={130} height={60} rx={8} fill={fill(glow, "#2f3542")} stroke={ink(glow)} strokeWidth={7} />
    <path d="M152 46 L 70 46 Q 40 46 40 60 Q 40 72 70 72 L 100 72 L 100 96 Q 100 108 120 108 L 152 106 Z" fill={fill(glow, "#e8b48f")} stroke={ink(glow)} strokeWidth={7} strokeLinejoin="round" />
    <path d="M100 72 L 132 72" stroke={ink(glow)} strokeWidth={5} />
    <path d="M104 88 L 134 88" stroke={ink(glow)} strokeWidth={5} />
  </svg>
);

export const Auge: React.FC<P> = ({ size = 120, glow, style }) => (
  <svg width={size} height={size * 0.6} viewBox="0 0 120 72" style={{ overflow: "visible", ...glowStyle(glow), ...style }}>
    <path d="M6 36 Q 60 -18 114 36 Q 60 90 6 36 Z" fill={fill(glow, "#fff")} stroke={ink(glow)} strokeWidth={7} />
    <circle cx={60} cy={36} r={16} fill={ink(glow)} />
  </svg>
);

export const Laden: React.FC<P> = ({ size = 150, glow, style }) => (
  <svg width={size} height={size} viewBox="0 0 150 150" style={{ overflow: "visible", ...style }}>
    <rect x={14} y={58} width={122} height={84} fill={fill(glow, "#fff")} stroke={ink(glow)} strokeWidth={7} />
    <path d="M8 58 L 20 18 L 130 18 L 142 58 Z" fill={fill(glow, C.red)} stroke={ink(glow)} strokeWidth={7} strokeLinejoin="round" />
    <path d="M45 18 L 40 58 M75 18 L75 58 M105 18 L110 58" stroke={glow ? C.glow : "#fff"} strokeWidth={8} />
    <rect x={30} y={80} width={36} height={62} fill={fill(glow, "#8a6a4a")} stroke={ink(glow)} strokeWidth={6} />
    <rect x={80} y={80} width={42} height={32} fill={fill(glow, C.sky)} stroke={ink(glow)} strokeWidth={6} />
  </svg>
);

export const Browser: React.FC<P> = ({ size = 150, glow, style }) => (
  <svg width={size} height={size} viewBox="0 0 150 150" style={{ overflow: "visible", ...style }}>
    <rect x={8} y={20} width={134} height={104} rx={12} fill={fill(glow, "#fff")} stroke={ink(glow)} strokeWidth={7} />
    <path d="M8 46 L142 46" stroke={ink(glow)} strokeWidth={6} />
    <circle cx={24} cy={33} r={5} fill={C.red} />
    <circle cx={40} cy={33} r={5} fill={C.yellow} />
    <rect x={28} y={62} width={56} height={44} rx={6} fill={fill(glow, C.sky)} stroke={ink(glow)} strokeWidth={5} />
    <rect x={94} y={66} width={34} height={10} rx={4} fill={ink(glow)} opacity={0.6} />
    <rect x={94} y={86} width={26} height={16} rx={5} fill={C.green} />
    <path d="M104 96 L 104 140 L 114 130 L 122 146 L 130 142 L 122 126 L 136 126 Z" fill="#fff" stroke={ink(glow)} strokeWidth={5} strokeLinejoin="round" />
  </svg>
);

export const Brille: React.FC<P> = ({ size = 150, style }) => (
  <svg width={size} height={size * 0.5} viewBox="0 0 160 80" style={{ overflow: "visible", ...style }}>
    <circle cx={42} cy={44} r={30} fill={C.sky} stroke={C.ink} strokeWidth={7} />
    <circle cx={118} cy={44} r={30} fill={C.sky} stroke={C.ink} strokeWidth={7} />
    <path d="M72 40 Q 80 30 88 40" fill="none" stroke={C.ink} strokeWidth={7} />
    <path d="M12 40 L 2 26 M148 40 L 158 26" stroke={C.ink} strokeWidth={7} strokeLinecap="round" />
  </svg>
);
export const Bett: React.FC<P> = ({ size = 160, style }) => (
  <svg width={size} height={size * 0.6} viewBox="0 0 170 100" style={{ overflow: "visible", ...style }}>
    <rect x={8} y={40} width={154} height={40} rx={12} fill="#fff" stroke={C.ink} strokeWidth={7} />
    <rect x={18} y={26} width={44} height={22} rx={10} fill={C.sky} stroke={C.ink} strokeWidth={6} />
    <path d="M70 40 Q 116 22 156 40" fill={C.green} stroke={C.ink} strokeWidth={6} />
    <path d="M14 80 L14 96 M156 80 L156 96" stroke={C.ink} strokeWidth={8} strokeLinecap="round" />
  </svg>
);
export const Bildschirm: React.FC<P> = ({ size = 160, style }) => (
  <svg width={size} height={size * 0.7} viewBox="0 0 160 112" style={{ overflow: "visible", ...style }}>
    <rect x={6} y={6} width={148} height={88} rx={12} fill="#26303d" stroke={C.ink} strokeWidth={7} />
    <path d="M66 30 L 66 70 L 100 50 Z" fill={C.red} />
    <path d="M56 108 L104 108" stroke={C.ink} strokeWidth={8} strokeLinecap="round" />
  </svg>
);

export const Tasse: React.FC<P> = ({ size = 160, glow, style }) => (
  <svg width={size} height={size} viewBox="0 0 160 160" style={{ overflow: "visible", ...glowStyle(glow), ...style }}>
    <path d="M24 34 L 116 34 L 108 144 Q 106 152 96 152 L 44 152 Q 34 152 32 144 Z" fill={fill(glow, "#f3d36b")} stroke={ink(glow)} strokeWidth={7} strokeLinejoin="round" />
    <path d="M114 58 C 160 56, 160 122, 108 122" fill="none" stroke={ink(glow)} strokeWidth={9} />
    <path d="M48 20 Q 56 8 48 -4 M72 20 Q 80 8 72 -4" fill="none" stroke={ink(glow)} strokeWidth={5} strokeLinecap="round" opacity={0.6} />
  </svg>
);

export const Kreuz: React.FC<{ size?: number; p: number }> = ({ size = 220, p }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{ overflow: "visible" }}>
    <path d="M12 12 L 88 88" stroke={C.red} strokeWidth={12} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - Math.min(1, p * 2)} />
    <path d="M88 12 L 12 88" stroke={C.red} strokeWidth={12} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - Math.max(0, Math.min(1, p * 2 - 1))} />
  </svg>
);
