// Illustrationen Folge 04 (Preis-Geschmack). Gleicher Stil wie icons.tsx; glow = Röntgen-Fassung. Keine Marken-Logos.
import React from "react";
import { C, HEAD } from "../../basis/lib";

type P = { size?: number; glow?: boolean; style?: React.CSSProperties };
const ink = (g?: boolean) => (g ? C.glow : C.ink);
const fill = (g: boolean | undefined, f: string) => (g ? "rgba(143,216,255,0.2)" : f);
const gl = (g?: boolean): React.CSSProperties => (g ? { filter: "drop-shadow(0 0 14px rgba(143,216,255,0.45)) drop-shadow(0 0 3px rgba(143,216,255,0.8))" } : {});

/** Getränkedose, Breite = size, Höhe = 2 × size. Nur der Schriftzug „ENERGY“, kein Logo. */
export const Dose: React.FC<P> = ({ size = 300, glow, style }) => (
  <svg width={size} height={size * 2} viewBox="0 0 200 400" style={{ overflow: "visible", ...gl(glow), ...style }}>
    <path d="M26 54 L174 54 L178 360 Q 178 384 154 384 L46 384 Q 22 384 22 360 Z" fill={fill(glow, "#2f6fb5")} stroke={ink(glow)} strokeWidth={8} strokeLinejoin="round" />
    <path d="M24 54 L176 54 L177 96 L23 96 Z" fill={fill(glow, "#d3d8de")} stroke={ink(glow)} strokeWidth={6} />
    <path d="M23 336 L177 336 L178 360 Q 178 384 154 384 L46 384 Q 22 384 22 360 Z" fill={fill(glow, "#d3d8de")} stroke={ink(glow)} strokeWidth={6} />
    <ellipse cx={100} cy={52} rx={76} ry={14} fill={fill(glow, "#e9ecef")} stroke={ink(glow)} strokeWidth={7} />
    <ellipse cx={100} cy={50} rx={22} ry={6} fill="none" stroke={ink(glow)} strokeWidth={5} />
    <path d="M30 250 L170 150 L170 190 L30 290 Z" fill={glow ? "rgba(143,216,255,0.35)" : "#f1c94a"} />
    <text x={100} y={132} textAnchor="middle" fontFamily={HEAD} fontWeight={900} fontSize={30} letterSpacing={3} fill={glow ? C.glow : "#ffffff"}>ENERGY</text>
    <path d="M44 110 L44 322" stroke={glow ? C.glow : "#ffffff"} strokeWidth={7} strokeLinecap="round" opacity={0.35} />
  </svg>
);

/** Limo-Flasche (Softdrink), neutral, ohne Logo. Höhe = 2,2 × size/…; Breite = size. */
export const Limo: React.FC<P> = ({ size = 160, glow, style }) => (
  <svg width={size} height={size * 2.4} viewBox="0 0 100 240" style={{ overflow: "visible", ...gl(glow), ...style }}>
    <path d="M38 6 L62 6 L62 56 C 62 74, 90 82, 90 116 L90 222 Q 90 234 78 234 L22 234 Q 10 234 10 222 L10 116 C 10 82, 38 74, 38 56 Z" fill={fill(glow, "#e8913a")} stroke={ink(glow)} strokeWidth={7} strokeLinejoin="round" />
    <rect x={34} y={2} width={32} height={20} rx={5} fill={fill(glow, "#d9dde2")} stroke={ink(glow)} strokeWidth={6} />
    <rect x={10} y={130} width={80} height={64} fill={glow ? "rgba(143,216,255,0.15)" : "#f6f3ec"} stroke={ink(glow)} strokeWidth={5} />
    <path d="M10 152 L90 152 M10 172 L90 172" stroke={ink(glow)} strokeWidth={5} />
    <path d="M24 92 L24 120" stroke={glow ? C.glow : "#fff"} strokeWidth={6} strokeLinecap="round" opacity={0.5} />
  </svg>
);

export const Mund: React.FC<P> = ({ size = 300, glow, style }) => (
  <svg width={size} height={size * 0.6} viewBox="0 0 240 144" style={{ overflow: "visible", ...gl(glow), ...style }}>
    <path d="M10 72 Q 60 8 120 40 Q 180 8 230 72 Q 120 88 10 72 Z" fill={fill(glow, "#d8606b")} stroke={ink(glow)} strokeWidth={8} strokeLinejoin="round" />
    <path d="M10 72 Q 120 88 230 72 Q 180 138 120 138 Q 60 138 10 72 Z" fill={fill(glow, "#e0776f")} stroke={ink(glow)} strokeWidth={8} strokeLinejoin="round" />
    <path d="M26 74 Q 120 90 214 74" fill="none" stroke={ink(glow)} strokeWidth={6} strokeLinecap="round" />
  </svg>
);

/** Weinglas, f = Füllstand 0..1 (Wein). */
export const Weinglas: React.FC<P & { f?: number; id?: string }> = ({ size = 280, glow, style, f = 1, id = "a" }) => (
  <svg width={size * 0.62} height={size} viewBox="0 0 160 260" style={{ overflow: "visible", ...gl(glow), ...style }}>
    <defs>
      <clipPath id={`bowl${id}`}>
        <path d="M30 20 L130 20 Q 142 118 80 134 Q 18 118 30 20 Z" />
      </clipPath>
    </defs>
    <rect x={20} y={20 + (1 - f) * 118} width={120} height={f * 118} fill={glow ? "rgba(143,216,255,0.55)" : "#8a1f2d"} clipPath={`url(#bowl${id})`} />
    <path d="M30 20 L130 20 Q 142 118 80 134 Q 18 118 30 20 Z" fill="none" stroke={ink(glow)} strokeWidth={8} strokeLinejoin="round" />
    <path d="M80 134 L80 226 M36 236 Q 80 218 124 236" fill="none" stroke={ink(glow)} strokeWidth={9} strokeLinecap="round" />
    <path d="M44 40 Q 46 80 56 104" fill="none" stroke={glow ? C.glow : "#fff"} strokeWidth={6} strokeLinecap="round" opacity={0.5} />
  </svg>
);

/** Tablettenpackung (Blister). */
export const Blister: React.FC<P> = ({ size = 200, glow, style }) => (
  <svg width={size} height={size * 0.68} viewBox="0 0 220 150" style={{ overflow: "visible", ...gl(glow), ...style }}>
    <rect x={8} y={8} width={204} height={134} rx={16} fill={fill(glow, "#d3d8de")} stroke={ink(glow)} strokeWidth={8} />
    {[0, 1, 2, 3].map((i) => (
      <g key={i}>
        <ellipse cx={42 + i * 45} cy={48} rx={17} ry={22} fill={fill(glow, "#ffffff")} stroke={ink(glow)} strokeWidth={5} />
        <ellipse cx={42 + i * 45} cy={102} rx={17} ry={22} fill={fill(glow, "#ffffff")} stroke={ink(glow)} strokeWidth={5} />
      </g>
    ))}
  </svg>
);

export const Kopfhoerer: React.FC<P> = ({ size = 200, glow, style }) => (
  <svg width={size} height={size * 0.92} viewBox="0 0 200 184" style={{ overflow: "visible", ...gl(glow), ...style }}>
    <path d="M32 112 C 24 20, 176 20, 168 112" fill="none" stroke={ink(glow)} strokeWidth={13} strokeLinecap="round" />
    <rect x={10} y={90} width={52} height={84} rx={22} fill={fill(glow, "#2f3542")} stroke={ink(glow)} strokeWidth={8} />
    <rect x={138} y={90} width={52} height={84} rx={22} fill={fill(glow, "#2f3542")} stroke={ink(glow)} strokeWidth={8} />
  </svg>
);
