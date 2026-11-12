// Illustrationen Folge 06 (Der mittlere Becher). Gleicher Stil wie icons.tsx; glow = Röntgen-Fassung. Keine Logos.
import React from "react";
import { C, HEAD } from "../../basis/lib";

type P = { size?: number; glow?: boolean; style?: React.CSSProperties };
const ink = (g?: boolean) => (g ? C.glow : C.ink);
const fill = (g: boolean | undefined, f: string) => (g ? "rgba(143,216,255,0.2)" : f);
const gl = (g?: boolean): React.CSSProperties => (g ? { filter: "drop-shadow(0 0 14px rgba(143,216,255,0.45)) drop-shadow(0 0 3px rgba(143,216,255,0.8))" } : {});

/** Kaffeebecher mit Deckel und Manschette. size = Breite; Höhe = 1,3 × Breite. label = Aufschrift der Manschette. */
export const Becher: React.FC<P & { label?: string; labelSize?: number }> = ({ size = 300, glow, style, label, labelSize = 32 }) => (
  <svg width={size} height={size * 1.3} viewBox="0 0 200 260" style={{ overflow: "visible", ...gl(glow), ...style }}>
    <path d="M26 38 L174 38 L150 250 Q148 258 138 258 L62 258 Q52 258 50 250 Z" fill={fill(glow, "#ffffff")} stroke={ink(glow)} strokeWidth={8} strokeLinejoin="round" />
    <path d="M33 100 L167 100 L156.8 190 L43.2 190 Z" fill={fill(glow, "#b98a5e")} stroke={ink(glow)} strokeWidth={6} strokeLinejoin="round" />
    {label && (
      <text x={100} y={155 + labelSize * 0.35} textAnchor="middle" fontFamily={HEAD} fontWeight={900} fontSize={labelSize} fill={glow ? "#eaf7ff" : "#ffffff"} letterSpacing={1}>
        {label}
      </text>
    )}
    <rect x={14} y={14} width={172} height={30} rx={12} fill={fill(glow, "#3b4049")} stroke={ink(glow)} strokeWidth={8} />
    <rect x={70} y={2} width={60} height={14} rx={6} fill={fill(glow, "#3b4049")} stroke={ink(glow)} strokeWidth={6} />
  </svg>
);

export const Stern: React.FC<P> = ({ size = 120, glow, style }) => (
  <svg width={size} height={size} viewBox="0 0 120 120" style={{ overflow: "visible", ...gl(glow), ...style }}>
    <path d="M60 8 L75 42 L112 46 L84 70 L92 108 L60 89 L28 108 L36 70 L8 46 L45 42 Z" fill={glow ? C.glow : C.yellow} stroke={glow ? "#eaf7ff" : C.ink} strokeWidth={7} strokeLinejoin="round" />
  </svg>
);

export const Pommes: React.FC<P> = ({ size = 150, glow, style }) => (
  <svg width={size} height={size} viewBox="0 0 150 150" style={{ overflow: "visible", ...gl(glow), ...style }}>
    {[34, 52, 70, 88, 106].map((x, i) => (
      <rect key={i} x={x} y={14 + (i % 2) * 10} width={14} height={80} rx={5} fill={fill(glow, C.yellow)} stroke={ink(glow)} strokeWidth={5} />
    ))}
    <path d="M24 70 L126 70 L116 140 L34 140 Z" fill={fill(glow, C.red)} stroke={ink(glow)} strokeWidth={7} strokeLinejoin="round" />
    <rect x={56} y={92} width={38} height={22} rx={6} fill="#fff" opacity={0.85} />
  </svg>
);

export const Handy: React.FC<P> = ({ size = 150, glow, style }) => (
  <svg width={size * 0.62} height={size} viewBox="0 0 94 150" style={{ overflow: "visible", ...gl(glow), ...style }}>
    <rect x={6} y={6} width={82} height={138} rx={16} fill={fill(glow, "#26303d")} stroke={ink(glow)} strokeWidth={7} />
    <rect x={20} y={28} width={54} height={20} rx={6} fill={C.sky} />
    <rect x={20} y={58} width={54} height={20} rx={6} fill={C.yellow} />
    <rect x={20} y={88} width={54} height={20} rx={6} fill={C.sky} />
    <circle cx={47} cy={128} r={6} fill={ink(glow)} />
  </svg>
);

export const Flasche: React.FC<P> = ({ size = 150, glow, style }) => (
  <svg width={size * 0.5} height={size} viewBox="0 0 76 150" style={{ overflow: "visible", ...gl(glow), ...style }}>
    <path d="M30 8 L46 8 L46 52 Q 70 66 70 96 L70 138 Q70 144 64 144 L12 144 Q6 144 6 138 L6 96 Q6 66 30 52 Z" fill={fill(glow, "#4d7a4a")} stroke={ink(glow)} strokeWidth={7} strokeLinejoin="round" />
    <rect x={14} y={94} width={48} height={34} rx={4} fill={glow ? "rgba(143,216,255,0.3)" : "#f6f3ec"} stroke={ink(glow)} strokeWidth={4} />
    <rect x={28} y={4} width={20} height={14} rx={3} fill={ink(glow)} />
  </svg>
);
