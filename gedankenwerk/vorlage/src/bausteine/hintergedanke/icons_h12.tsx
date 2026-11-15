// Illustrationen Folge 12 (Der schiefe Bildschirm). Gleicher Stil wie icons.tsx; glow = Röntgen-Fassung.
import React from "react";
import { C } from "../../basis/lib";

type P = { size?: number; glow?: boolean; style?: React.CSSProperties };
const ink = (g?: boolean) => (g ? C.glow : C.ink);
const fill = (g: boolean | undefined, f: string) => (g ? "rgba(143,216,255,0.2)" : f);
const gl = (g?: boolean): React.CSSProperties => (g ? { filter: "drop-shadow(0 0 14px rgba(143,216,255,0.45)) drop-shadow(0 0 3px rgba(143,216,255,0.8))" } : {});

export type Lay = { left: number; top: number; size: number };
/** Punkt am Laptop in Bildpixeln: Scharnier + Strecke `along` entlang des Deckels + `off` entlang der Bildschirmnormalen. */
export const lapPt = (L: Lay, w: number, along: number, off = 0) => {
  const s = L.size / 500;
  const r = (w * Math.PI) / 180;
  return { x: L.left + (70 + Math.cos(r) * along + Math.sin(r) * off) * s, y: L.top + (342 - Math.sin(r) * along + Math.cos(r) * off) * s };
};
/** Richtung der Bildschirmnormalen (zeigt zum Nutzer). */
export const lapNormal = (w: number) => {
  const r = (w * Math.PI) / 180;
  return { x: Math.sin(r), y: Math.cos(r) };
};

/** Laptop von der Seite. winkel = Öffnungswinkel des Deckels zur Grundplatte (90 = senkrecht, kleiner = nach vorn geneigt). */
export const Laptop: React.FC<P & { winkel?: number; bogen?: number; bogenFarbe?: string; geist?: { winkel: number; farbe: string; o: number } }> = ({
  size = 500, winkel = 90, glow, style, bogen = 0, bogenFarbe = C.red, geist,
}) => {
  const r = (winkel * Math.PI) / 180;
  const R = 200;
  const ex = 70 + R * Math.cos(r), ey = 342 - R * Math.sin(r);
  const gr = geist ? (geist.winkel * Math.PI) / 180 : 0;
  return (
    <svg width={size} height={size * 0.84} viewBox="0 0 500 420" style={{ overflow: "visible", ...gl(glow), ...style }}>
      {/* Grundplatte */}
      <rect x={30} y={342} width={450} height={30} rx={10} fill={fill(glow, "#ffffff")} stroke={ink(glow)} strokeWidth={8} />
      <path d="M110 357 L430 357" stroke={ink(glow)} strokeWidth={5} strokeLinecap="round" strokeDasharray="26 14" opacity={0.6} />
      {geist && (
        <line x1={70} y1={342} x2={70 + 330 * Math.cos(gr)} y2={342 - 330 * Math.sin(gr)} stroke={geist.farbe} strokeWidth={9} strokeDasharray="22 16" strokeLinecap="round" opacity={geist.o} />
      )}
      {bogen > 0 && (
        <>
          <line x1={70} y1={342} x2={70 + R + 20} y2={342} stroke={bogenFarbe} strokeWidth={5} strokeDasharray="10 12" opacity={0.7} />
          <path d={`M ${70 + R} 342 A ${R} ${R} 0 0 ${winkel < 180 ? 0 : 1} ${ex} ${ey}`} fill="none" stroke={bogenFarbe} strokeWidth={14} strokeLinecap="round" pathLength={1} strokeDasharray={`${bogen} 1`} />
        </>
      )}
      {/* Deckel, am Scharnier gedreht */}
      <g transform={`translate(70 342) rotate(${90 - winkel})`}>
        <rect x={-20} y={-300} width={36} height={300} rx={9} fill={fill(glow, C.steel)} stroke={ink(glow)} strokeWidth={8} />
        <rect x={4} y={-284} width={8} height={268} rx={3} fill={glow ? "rgba(143,216,255,0.55)" : "#7fc0e6"} />
        <circle cx={-2} cy={-292} r={3} fill={ink(glow)} />
      </g>
      <circle cx={70} cy={342} r={12} fill={ink(glow)} />
    </svg>
  );
};

export const Handy: React.FC<P & { blase?: number }> = ({ size = 200, glow, style, blase = 0 }) => (
  <svg width={size * 0.55} height={size} viewBox="0 0 110 200" style={{ overflow: "visible", ...gl(glow), ...style }}>
    <rect x={6} y={6} width={98} height={188} rx={20} fill={fill(glow, "#2f3542")} stroke={ink(glow)} strokeWidth={7} />
    <rect x={16} y={24} width={78} height={152} rx={8} fill={glow ? "rgba(143,216,255,0.1)" : C.paper2} />
    <circle cx={55} cy={92} r={30} fill="none" stroke={ink(glow)} strokeWidth={5} />
    <line x1={55} y1={52} x2={55} y2={132} stroke={ink(glow)} strokeWidth={3} opacity={0.5} />
    <line x1={15} y1={92} x2={95} y2={92} stroke={ink(glow)} strokeWidth={3} opacity={0.5} />
    <circle cx={55 + blase * 16} cy={92 + blase * 6} r={11} fill={Math.abs(blase) < 0.1 ? C.green : C.yellow} stroke={ink(glow)} strokeWidth={4} />
    <rect x={30} y={142} width={50} height={10} rx={5} fill={ink(glow)} opacity={0.5} />
  </svg>
);

export const Sonne: React.FC<P> = ({ size = 160, glow, style }) => (
  <svg width={size} height={size} viewBox="0 0 160 160" style={{ overflow: "visible", ...gl(glow), ...style }}>
    {Array.from({ length: 8 }).map((_, i) => {
      const a = (i * Math.PI) / 4;
      return <line key={i} x1={80 + Math.cos(a) * 52} y1={80 + Math.sin(a) * 52} x2={80 + Math.cos(a) * 74} y2={80 + Math.sin(a) * 74} stroke={ink(glow)} strokeWidth={8} strokeLinecap="round" />;
    })}
    <circle cx={80} cy={80} r={38} fill={fill(glow, C.yellow)} stroke={ink(glow)} strokeWidth={7} />
  </svg>
);

export const Autoschluessel: React.FC<P> = ({ size = 160, glow, style }) => (
  <svg width={size} height={size} viewBox="0 0 160 160" style={{ overflow: "visible", ...gl(glow), ...style }}>
    <path d="M70 70 L140 140" stroke={ink(glow)} strokeWidth={9} strokeLinecap="round" />
    <path d="M112 112 L126 98 M126 126 L140 112" stroke={ink(glow)} strokeWidth={7} strokeLinecap="round" />
    <rect x={14} y={14} width={78} height={92} rx={24} transform="rotate(-18 53 60)" fill={fill(glow, C.red)} stroke={ink(glow)} strokeWidth={7} />
    <circle cx={50} cy={58} r={14} fill={fill(glow, "#fff")} stroke={ink(glow)} strokeWidth={6} />
  </svg>
);

export const Pullover: React.FC<P> = ({ size = 160, glow, style }) => (
  <svg width={size} height={size} viewBox="0 0 160 160" style={{ overflow: "visible", ...gl(glow), ...style }}>
    <path d="M52 22 L108 22 L146 56 L130 92 L116 82 L116 142 L44 142 L44 82 L30 92 L14 56 Z" fill={fill(glow, "#e3a07c")} stroke={ink(glow)} strokeWidth={7} strokeLinejoin="round" />
    <path d="M62 22 Q 80 48 98 22" fill="none" stroke={ink(glow)} strokeWidth={6} />
    <path d="M44 128 L116 128" stroke={ink(glow)} strokeWidth={5} opacity={0.6} />
  </svg>
);

export const Paket: React.FC<P> = ({ size = 220, glow, style }) => (
  <svg width={size} height={size * 0.9} viewBox="0 0 220 200" style={{ overflow: "visible", ...gl(glow), ...style }}>
    <rect x={14} y={50} width={192} height={136} rx={10} fill={fill(glow, "#d9b383")} stroke={ink(glow)} strokeWidth={8} />
    <path d="M14 50 L40 14 L180 14 L206 50" fill={fill(glow, "#e6c797")} stroke={ink(glow)} strokeWidth={8} strokeLinejoin="round" />
    <rect x={90} y={14} width={40} height={172} fill={fill(glow, "#f6f3ec")} stroke={ink(glow)} strokeWidth={6} opacity={0.9} />
  </svg>
);

export const Haken: React.FC<{ size?: number; farbe: string; p?: number }> = ({ size = 120, farbe, p = 1 }) => (
  <svg width={size} height={size} viewBox="0 0 120 120" style={{ overflow: "visible" }}>
    <path d="M18 64 L48 94 L102 28" fill="none" stroke={farbe} strokeWidth={16} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={`${p} 1`} />
  </svg>
);
export const Strich: React.FC<{ size?: number; farbe: string; p?: number }> = ({ size = 120, farbe, p = 1 }) => (
  <svg width={size} height={size} viewBox="0 0 120 120" style={{ overflow: "visible" }}>
    <path d="M22 22 L98 98" fill="none" stroke={farbe} strokeWidth={16} strokeLinecap="round" pathLength={1} strokeDasharray={`${Math.min(1, p * 2)} 1`} />
    <path d="M98 22 L22 98" fill="none" stroke={farbe} strokeWidth={16} strokeLinecap="round" pathLength={1} strokeDasharray={`${Math.max(0, p * 2 - 1)} 1`} />
  </svg>
);
