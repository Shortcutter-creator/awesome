// Illustrationen Folge 03 (Die Neun). Gleicher Stil wie icons.tsx; glow = Röntgen-Fassung.
import React from "react";
import { C, HEAD } from "../../basis/lib";

type P = { size?: number; glow?: boolean; style?: React.CSSProperties };
const ink = (g?: boolean) => (g ? C.glow : C.ink);
const fill = (g: boolean | undefined, f: string) => (g ? "rgba(143,216,255,0.2)" : f);
const gl = (g?: boolean): React.CSSProperties => (g ? { filter: "drop-shadow(0 0 14px rgba(143,216,255,0.45)) drop-shadow(0 0 3px rgba(143,216,255,0.8))" } : {});

/** Kleid auf Bügel (Breite = size). */
export const Kleid: React.FC<P> = ({ size = 500, glow, style }) => (
  <svg width={size} height={size * 1.4} viewBox="0 0 300 420" style={{ overflow: "visible", ...gl(glow), ...style }}>
    <path d="M150 52 L150 40 Q 150 28 164 28 Q 178 28 178 14 Q 178 4 164 4" fill="none" stroke={ink(glow)} strokeWidth={8} strokeLinecap="round" />
    <path d="M150 52 L36 112 L264 112 Z" fill="none" stroke={ink(glow)} strokeWidth={8} strokeLinejoin="round" />
    <path d="M112 114 L 112 152 M188 114 L 188 152" stroke={ink(glow)} strokeWidth={8} strokeLinecap="round" />
    <path d="M100 150 L200 150 Q 206 190 182 222 L 288 392 Q 294 406 276 406 L 24 406 Q 6 406 12 392 L 118 222 Q 94 190 100 150 Z" fill={fill(glow, "#d8606b")} stroke={ink(glow)} strokeWidth={8} strokeLinejoin="round" />
    <path d="M114 224 L186 224" stroke={glow ? C.glow : C.yellow} strokeWidth={14} strokeLinecap="round" />
    {[[80, 330], [150, 300], [220, 330], [60, 380], [130, 370], [200, 380], [250, 372], [150, 262]].map(([x, y], i) => (
      <circle key={i} cx={x} cy={y} r={8} fill={glow ? C.glow : "#f6f3ec"} opacity={glow ? 0.6 : 0.9} />
    ))}
  </svg>
);

/** Preisschild mit Loch links; children = Inhalt (HTML), Breite = size. */
export const Preisschild: React.FC<P & { children?: React.ReactNode; farbe?: string; schnur?: boolean }> = ({ size = 330, glow, style, children, farbe = "#f6f3ec", schnur = true }) => (
  <div style={{ position: "relative", width: size, height: size * 0.65, ...style }}>
    <svg width={size} height={size * 0.65} viewBox="0 0 400 260" style={{ position: "absolute", left: 0, top: 0, overflow: "visible", ...gl(glow) }}>
      {schnur && <path d="M70 130 C 20 60, 60 -40, 120 -60" fill="none" stroke={ink(glow)} strokeWidth={6} strokeLinecap="round" />}
      <path d="M78 10 L366 10 Q 392 10 392 36 L392 224 Q 392 250 366 250 L78 250 L10 130 Z" fill={fill(glow, farbe)} stroke={ink(glow)} strokeWidth={9} strokeLinejoin="round" />
      <circle cx={76} cy={130} r={17} fill={glow ? "#1a2138" : C.paper} stroke={ink(glow)} strokeWidth={7} />
    </svg>
    <div style={{ position: "absolute", left: size * 0.26, right: size * 0.04, top: 0, bottom: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: HEAD, fontWeight: 900, color: glow ? "#eaf7ff" : C.ink, fontSize: size * 0.3, letterSpacing: -size * 0.01, whiteSpace: "nowrap" }}>{children}</div>
  </div>
);

export const Gehirn: React.FC<P> = ({ size = 260, glow, style }) => (
  <svg width={size} height={size * 0.84} viewBox="0 0 250 210" style={{ overflow: "visible", ...gl(glow), ...style }}>
    <path d="M100 40 C 60 20, 10 60, 30 100 C 0 130, 30 182, 72 170 C 92 202, 142 202, 152 170 C 192 190, 232 160, 222 120 C 252 90, 222 30, 172 40 C 152 8, 110 12, 100 40 Z" fill={fill(glow, "#f2b6c0")} stroke={ink(glow)} strokeWidth={8} strokeLinejoin="round" />
    <path d="M126 36 L126 172 M70 80 Q 96 90 100 114 M180 78 Q 154 92 152 116 M64 134 Q 90 128 108 146" fill="none" stroke={ink(glow)} strokeWidth={6} strokeLinecap="round" />
  </svg>
);

export const Fernseher: React.FC<P> = ({ size = 220, glow, style }) => (
  <svg width={size} height={size * 0.75} viewBox="0 0 220 165" style={{ overflow: "visible", ...gl(glow), ...style }}>
    <rect x={8} y={8} width={204} height={120} rx={12} fill={fill(glow, "#26303d")} stroke={ink(glow)} strokeWidth={8} />
    <path d="M24 24 L90 24 L24 70 Z" fill="rgba(255,255,255,0.15)" />
    <path d="M70 128 L60 156 M150 128 L160 156 M44 156 L176 156" stroke={ink(glow)} strokeWidth={8} strokeLinecap="round" />
  </svg>
);

export const Handy: React.FC<P> = ({ size = 160, glow, style }) => (
  <svg width={size * 0.6} height={size} viewBox="0 0 100 166" style={{ overflow: "visible", ...gl(glow), ...style }}>
    <rect x={6} y={6} width={88} height={154} rx={16} fill={fill(glow, "#2f3542")} stroke={ink(glow)} strokeWidth={8} />
    <circle cx={50} cy={78} r={24} fill="none" stroke={C.glow} strokeWidth={8} strokeDasharray="110 40" />
    <path d="M62 44 L78 54 L60 64 Z" fill={C.glow} />
    <rect x={32} y={126} width={36} height={8} rx={4} fill={C.glow} opacity={0.6} />
  </svg>
);
