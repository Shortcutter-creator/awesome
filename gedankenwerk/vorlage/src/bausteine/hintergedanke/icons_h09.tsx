// Illustrationen Folge 09 (Der Hot Dog). Gleicher Stil wie icons.tsx; glow = Röntgen-Fassung.
import React from "react";
import { C, HEAD } from "../../basis/lib";

type P = { size?: number; glow?: boolean; style?: React.CSSProperties };
const ink = (g?: boolean) => (g ? C.glow : C.ink);
const fill = (g: boolean | undefined, f: string) => (g ? "rgba(143,216,255,0.2)" : f);
const gl = (g?: boolean): React.CSSProperties => (g ? { filter: "drop-shadow(0 0 14px rgba(143,216,255,0.45)) drop-shadow(0 0 3px rgba(143,216,255,0.8))" } : {});

export const HotDog: React.FC<P> = ({ size = 700, glow, style }) => (
  <svg width={size} height={size * 0.5} viewBox="0 0 400 200" style={{ overflow: "visible", ...gl(glow), ...style }}>
    <rect x={22} y={70} width={356} height={116} rx={58} fill={fill(glow, "#e8b66a")} stroke={ink(glow)} strokeWidth={8} />
    <rect x={4} y={40} width={392} height={66} rx={33} fill={fill(glow, "#c8553d")} stroke={ink(glow)} strokeWidth={8} />
    <path d="M40 66 L 80 48 L 120 66 L 160 48 L 200 66 L 240 48 L 280 66 L 320 48 L 360 66" fill="none" stroke={glow ? C.glow : C.yellow} strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M26 122 Q 26 180 90 182 L 310 182 Q 374 180 374 122 Q 300 140 200 130 Q 100 140 26 122 Z" fill={fill(glow, "#e8b66a")} stroke={ink(glow)} strokeWidth={8} strokeLinejoin="round" />
  </svg>
);

export const Becher: React.FC<P> = ({ size = 240, glow, style }) => (
  <svg width={size * 0.67} height={size} viewBox="0 0 160 240" style={{ overflow: "visible", ...gl(glow), ...style }}>
    <path d="M100 30 L 118 -14 L 130 -10" fill="none" stroke={ink(glow)} strokeWidth={8} strokeLinecap="round" />
    <rect x={14} y={30} width={132} height={26} rx={10} fill={fill(glow, "#3b4049")} stroke={ink(glow)} strokeWidth={7} />
    <path d="M22 56 L138 56 L122 222 Q 120 232 110 232 L 50 232 Q 40 232 38 222 Z" fill={fill(glow, "#ffffff")} stroke={ink(glow)} strokeWidth={8} strokeLinejoin="round" />
    <path d="M28 100 L132 100 L128 150 L32 150 Z" fill={glow ? "rgba(143,216,255,0.4)" : C.red} stroke={ink(glow)} strokeWidth={5} />
  </svg>
);

/** Preisschild mit Loch links; children = Inhalt, Breite = size. */
export const Preisschild: React.FC<P & { children?: React.ReactNode; farbe?: string; schnur?: boolean }> = ({ size = 330, glow, style, children, farbe = "#f6f3ec", schnur = true }) => (
  <div style={{ position: "relative", width: size, height: size * 0.65, ...style }}>
    <svg width={size} height={size * 0.65} viewBox="0 0 400 260" style={{ position: "absolute", left: 0, top: 0, overflow: "visible", ...gl(glow) }}>
      {schnur && <path d="M70 130 C 20 60, 60 -40, 120 -60" fill="none" stroke={ink(glow)} strokeWidth={6} strokeLinecap="round" />}
      <path d="M78 10 L366 10 Q 392 10 392 36 L392 224 Q 392 250 366 250 L78 250 L10 130 Z" fill={fill(glow, farbe)} stroke={ink(glow)} strokeWidth={9} strokeLinejoin="round" />
      <circle cx={76} cy={130} r={17} fill={glow ? "#1a2138" : C.paper} stroke={ink(glow)} strokeWidth={7} />
    </svg>
    <div style={{ position: "absolute", left: size * 0.26, right: size * 0.04, top: 0, bottom: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: HEAD, fontWeight: 900, color: glow ? "#eaf7ff" : C.ink, fontSize: size * 0.21, letterSpacing: -size * 0.008, whiteSpace: "nowrap" }}>{children}</div>
  </div>
);

export const Haehnchen: React.FC<P> = ({ size = 440, glow, style }) => (
  <svg width={size} height={size * 0.72} viewBox="0 0 400 290" style={{ overflow: "visible", ...gl(glow), ...style }}>
    <g transform="rotate(-24 90 210)"><rect x={18} y={170} width={110} height={44} rx={22} fill={fill(glow, "#c9702d")} stroke={ink(glow)} strokeWidth={8} /><circle cx={14} cy={180} r={13} fill={glow ? C.glow : "#f6f3ec"} stroke={ink(glow)} strokeWidth={6} /><circle cx={14} cy={204} r={13} fill={glow ? C.glow : "#f6f3ec"} stroke={ink(glow)} strokeWidth={6} /></g>
    <g transform="rotate(24 310 210)"><rect x={272} y={170} width={110} height={44} rx={22} fill={fill(glow, "#c9702d")} stroke={ink(glow)} strokeWidth={8} /><circle cx={386} cy={180} r={13} fill={glow ? C.glow : "#f6f3ec"} stroke={ink(glow)} strokeWidth={6} /><circle cx={386} cy={204} r={13} fill={glow ? C.glow : "#f6f3ec"} stroke={ink(glow)} strokeWidth={6} /></g>
    <ellipse cx={200} cy={140} rx={150} ry={110} fill={fill(glow, "#d98a3d")} stroke={ink(glow)} strokeWidth={9} />
    <path d="M110 90 Q 160 50 230 70" fill="none" stroke={glow ? C.glow : "#f1c27a"} strokeWidth={14} strokeLinecap="round" opacity={0.8} />
    <path d="M150 170 Q 200 200 260 168 M170 130 Q 215 150 270 124" fill="none" stroke={ink(glow)} strokeWidth={6} strokeLinecap="round" opacity={0.5} />
  </svg>
);

export const Geldschein: React.FC<P> = ({ size = 200, style }) => (
  <svg width={size} height={size * 0.5} viewBox="0 0 200 100" style={{ overflow: "visible", ...style }}>
    <rect x={6} y={6} width={188} height={88} rx={10} fill="#7fcf9a" stroke={C.ink} strokeWidth={7} />
    <circle cx={100} cy={50} r={26} fill="#bdeacb" stroke={C.ink} strokeWidth={6} />
    <text x={100} y={64} textAnchor="middle" fontFamily={HEAD} fontWeight={900} fontSize={40} fill={C.ink}>$</text>
    <circle cx={28} cy={26} r={6} fill={C.ink} /><circle cx={172} cy={74} r={6} fill={C.ink} />
  </svg>
);

/** Holz-Lockente. */
export const Ente: React.FC<P> = ({ size = 440, glow, style }) => (
  <svg width={size} height={size * 0.72} viewBox="0 0 400 290" style={{ overflow: "visible", ...gl(glow), ...style }}>
    <path d="M30 140 Q 40 250 200 252 Q 340 250 350 160 Q 330 130 290 140 Q 270 120 262 70 Q 258 14 200 14 Q 150 14 148 70 Q 150 120 120 140 Z" fill={fill(glow, "#c89a62")} stroke={ink(glow)} strokeWidth={9} strokeLinejoin="round" />
    <path d="M150 40 Q 90 40 76 66 Q 120 86 156 72 Z" fill={fill(glow, "#f0a23a")} stroke={ink(glow)} strokeWidth={8} strokeLinejoin="round" />
    <circle cx={186} cy={52} r={11} fill={ink(glow)} />
    <path d="M70 180 Q 160 215 280 176 M80 218 Q 170 240 270 214" fill="none" stroke={ink(glow)} strokeWidth={6} strokeLinecap="round" opacity={0.5} />
    <path d="M190 246 L190 276 M150 276 L 250 276" stroke={ink(glow)} strokeWidth={9} strokeLinecap="round" />
  </svg>
);

export const Butter: React.FC<P> = ({ size = 200, glow, style }) => (
  <svg width={size} height={size * 0.62} viewBox="0 0 200 124" style={{ overflow: "visible", ...gl(glow), ...style }}>
    <path d="M24 40 L 150 40 L 190 14 L 66 14 Z" fill={fill(glow, "#fbe58a")} stroke={ink(glow)} strokeWidth={7} strokeLinejoin="round" />
    <rect x={24} y={40} width={126} height={76} rx={6} fill={fill(glow, "#f6d34a")} stroke={ink(glow)} strokeWidth={7} />
    <path d="M150 40 L190 14 L190 90 L150 116 Z" fill={fill(glow, "#e0b82e")} stroke={ink(glow)} strokeWidth={7} strokeLinejoin="round" />
    <rect x={24} y={62} width={126} height={32} fill={glow ? "rgba(143,216,255,0.35)" : "#c9cfd6"} stroke={ink(glow)} strokeWidth={6} />
  </svg>
);

export const Glas: React.FC<P> = ({ size = 160, glow, style }) => (
  <svg width={size * 0.7} height={size} viewBox="0 0 112 160" style={{ overflow: "visible", ...gl(glow), ...style }}>
    <path d="M12 8 L100 8 L90 148 Q 89 154 82 154 L30 154 Q 23 154 22 148 Z" fill={fill(glow, "#e6f4fb")} stroke={ink(glow)} strokeWidth={7} strokeLinejoin="round" />
    <path d="M17 52 L95 52 L90 148 Q 89 154 82 154 L30 154 Q 23 154 22 148 Z" fill={glow ? "rgba(143,216,255,0.45)" : C.sky} stroke={ink(glow)} strokeWidth={5} strokeLinejoin="round" />
  </svg>
);

export const Schloss: React.FC<P> = ({ size = 160, glow, style }) => (
  <svg width={size * 0.8} height={size} viewBox="0 0 128 160" style={{ overflow: "visible", ...gl(glow), ...style }}>
    <path d="M34 72 L34 46 Q 34 14 64 14 Q 94 14 94 46 L94 72" fill="none" stroke={ink(glow)} strokeWidth={13} strokeLinecap="round" />
    <rect x={10} y={68} width={108} height={84} rx={14} fill={fill(glow, C.yellow)} stroke={ink(glow)} strokeWidth={8} />
    <circle cx={64} cy={104} r={10} fill={ink(glow)} /><rect x={59} y={106} width={10} height={26} rx={4} fill={ink(glow)} />
  </svg>
);

export const Karton: React.FC<P> = ({ size = 160, glow, style }) => (
  <svg width={size} height={size * 0.8} viewBox="0 0 160 128" style={{ overflow: "visible", ...gl(glow), ...style }}>
    <rect x={8} y={20} width={144} height={100} rx={6} fill={glow ? "rgba(143,216,255,0.38)" : "#c9a06a"} stroke={ink(glow)} strokeWidth={7} />
    <rect x={64} y={20} width={32} height={46} fill={glow ? "rgba(143,216,255,0.4)" : "#e8d3a8"} stroke={ink(glow)} strokeWidth={5} />
  </svg>
);

/** Große Lagerhalle ohne Beschriftung/Logo. */
export const Lagerhalle: React.FC<P> = ({ size = 900, style }) => (
  <svg width={size} height={size * 0.6} viewBox="0 0 600 360" style={{ overflow: "visible", ...style }}>
    <path d="M20 120 L 300 40 L 580 120 L 580 340 L 20 340 Z" fill="#d9dde2" stroke={C.ink} strokeWidth={9} strokeLinejoin="round" />
    <rect x={20} y={120} width={560} height={44} fill={C.red} stroke={C.ink} strokeWidth={8} />
    <rect x={60} y={190} width={140} height={150} fill="#9aa4b0" stroke={C.ink} strokeWidth={7} />
    <rect x={230} y={190} width={140} height={150} fill="#9aa4b0" stroke={C.ink} strokeWidth={7} />
    <rect x={400} y={190} width={140} height={150} fill="#9aa4b0" stroke={C.ink} strokeWidth={7} />
    {[0, 1, 2, 3].map((i) => (<React.Fragment key={i}><line x1={60} x2={200} y1={214 + i * 30} y2={214 + i * 30} stroke={C.ink} strokeWidth={4} /><line x1={230} x2={370} y1={214 + i * 30} y2={214 + i * 30} stroke={C.ink} strokeWidth={4} /><line x1={400} x2={540} y1={214 + i * 30} y2={214 + i * 30} stroke={C.ink} strokeWidth={4} /></React.Fragment>))}
    <rect x={60} y={298} width={60} height={42} fill="#c9a06a" stroke={C.ink} strokeWidth={5} /><rect x={420} y={290} width={70} height={50} fill="#c9a06a" stroke={C.ink} strokeWidth={5} />
  </svg>
);
