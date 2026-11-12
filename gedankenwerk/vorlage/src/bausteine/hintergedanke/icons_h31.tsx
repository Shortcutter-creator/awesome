// Illustrationen Folge 31 (Der unsichtbare Ballwurf). Gleicher Stil wie icons.tsx; glow = Röntgen-Fassung.
// Alles als <g> in Bild-Koordinaten (1080 × 1920). Werfer = graue Strichfigur (wie im Vorbild), keine echte Person.
import React from "react";
import { C } from "../../basis/lib";

export type Pt = { x: number; y: number };
export const AMBER = "#ffd27a";
export const GRAU = "#9aa0a8";
export const HANDGRAU = "#cdd2d8";
export const TENNIS = "#d6e84a";
const GLOWF = "rgba(143,216,255,0.2)";
export const GLOW_FILTER = "drop-shadow(0 0 12px rgba(143,216,255,0.45)) drop-shadow(0 0 3px rgba(143,216,255,0.8))";

const rad = (d: number) => (d * Math.PI) / 180;
const mixP = (a: Pt, b: Pt, p: number): Pt => ({ x: a.x + (b.x - a.x) * p, y: a.y + (b.y - a.y) * p });

// Körpermaße (lokal, Füße bei 0,0, Maßstab 1)
export const SCHULTER: Pt = { x: 10, y: -500 };
export const KOPF: Pt = { x: 0, y: -612 };
export const KOPF_R = 78;
const L1 = 150, L2 = 150;

/** Ellbogen per einfacher Zwei-Gelenk-Rechnung (Ellbogen hängt nach unten/außen). */
const ellbogen = (s: Pt, h: Pt): Pt => {
  const dx = h.x - s.x, dy = h.y - s.y;
  const d = Math.min(L1 + L2 - 1, Math.max(20, Math.hypot(dx, dy)));
  const a = Math.atan2(dy, dx);
  const al = Math.acos((L1 * L1 + d * d - L2 * L2) / (2 * L1 * d));
  return { x: s.x + L1 * Math.cos(a + al), y: s.y + L1 * Math.sin(a + al) };
};

/** Augenmitte (lokal) – für Blickstrahlen. */
export const augenMitte = (blick: number, front = 0): Pt => {
  const d = { x: Math.cos(rad(blick)), y: Math.sin(rad(blick)) };
  return mixP({ x: KOPF.x + 38 * d.x, y: KOPF.y + 38 * d.y }, { x: KOPF.x, y: KOPF.y - 8 }, front);
};

export type WerferP = {
  x: number; y: number; s?: number;
  hand: Pt; // rechte Hand, lokal
  blick: number; // Blickrichtung in Grad (0 = rechts, −90 = oben, + = unten)
  front?: number; // 0 = Profil, 1 = schaut dich an
  grins?: number;
  glow?: boolean;
  farbe?: string;
  hut?: boolean; // Zylinder (Zauberer)
  hlArm?: number; // 0..1 Arm hervorheben (Röntgen)
  hlKopf?: number;
  vorHand?: React.ReactNode; // lokal, hinter der Hand (Ball)
  nachHand?: React.ReactNode;
  opacity?: number;
};

export const Werfer: React.FC<WerferP> = ({
  x, y, s = 1, hand, blick, front = 0, grins = 0, glow, farbe = GRAU, hut, hlArm = 0, hlKopf = 0, vorHand, nachHand, opacity = 1,
}) => {
  const ink = glow ? C.glow : C.ink;
  const koerper = glow ? "rgba(143,216,255,0.35)" : farbe;
  const e = ellbogen(SCHULTER, hand);
  const d = { x: Math.cos(rad(blick)), y: Math.sin(rad(blick)) };
  const p = { x: -d.y, y: d.x };
  const augen = [-1, 1].map((k) => {
    const prof = { x: KOPF.x + 38 * d.x + k * 21 * p.x, y: KOPF.y + 38 * d.y + k * 21 * p.y };
    const fr = { x: KOPF.x + k * 27, y: KOPF.y - 8 };
    const m = mixP(prof, fr, front);
    const pup = mixP({ x: m.x + 6 * d.x, y: m.y + 6 * d.y }, { x: m.x, y: m.y + 2 }, front);
    return { m, pup };
  });
  const md = rad(blick + 52);
  const mund = mixP({ x: KOPF.x + 50 * Math.cos(md), y: KOPF.y + 50 * Math.sin(md) }, { x: KOPF.x, y: KOPF.y + 36 }, front);
  const armFarbe = hlArm > 0.01 ? AMBER : ink;
  const kopfFarbe = hlKopf > 0.01 ? AMBER : ink;
  const hutRot = Math.max(-60, Math.min(30, blick)) * 0.25;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={opacity} style={glow ? { filter: GLOW_FILTER } : undefined}>
      {/* Beine */}
      <path d="M0 -262 L -58 0 M 0 -262 L 58 0" stroke={ink} strokeWidth={13} strokeLinecap="round" fill="none" />
      {/* linker Arm hängt */}
      <path d={`M${-SCHULTER.x} ${SCHULTER.y} L -60 -410 L -78 -330`} stroke={ink} strokeWidth={13} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      {/* Rumpf */}
      <line x1={0} y1={-520} x2={0} y2={-268} stroke={koerper} strokeWidth={40} strokeLinecap="round" />
      <line x1={0} y1={-520} x2={0} y2={-268} stroke={ink} strokeWidth={6} strokeLinecap="round" opacity={0.3} />
      {/* Kopf */}
      <circle cx={KOPF.x} cy={KOPF.y} r={KOPF_R} fill={glow ? GLOWF : "#fff"} stroke={kopfFarbe} strokeWidth={9 + 5 * hlKopf} />
      {augen.map((a, i) => (
        <g key={i}>
          <circle cx={a.m.x} cy={a.m.y} r={15} fill={glow ? "rgba(143,216,255,0.15)" : "#fff"} stroke={ink} strokeWidth={5} />
          <circle cx={a.pup.x} cy={a.pup.y} r={8} fill={ink} />
        </g>
      ))}
      <path d={`M${mund.x - 15} ${mund.y} Q ${mund.x} ${mund.y + 4 + 12 * grins} ${mund.x + 15} ${mund.y}`} stroke={ink} strokeWidth={6} strokeLinecap="round" fill="none" />
      {hut && (
        <g transform={`rotate(${hutRot} ${KOPF.x} ${KOPF.y})`}>
          <rect x={KOPF.x - 46} y={KOPF.y - 182} width={92} height={112} rx={6} fill={glow ? GLOWF : C.ink} stroke={ink} strokeWidth={6} />
          <rect x={KOPF.x - 46} y={KOPF.y - 102} width={92} height={18} fill={C.red} />
          <rect x={KOPF.x - 70} y={KOPF.y - 78} width={140} height={14} rx={7} fill={glow ? GLOWF : C.ink} stroke={ink} strokeWidth={5} />
        </g>
      )}
      {/* rechter Arm */}
      <path d={`M${SCHULTER.x} ${SCHULTER.y} L ${e.x} ${e.y} L ${hand.x} ${hand.y}`} stroke={armFarbe} strokeWidth={13 + 6 * hlArm} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      {vorHand}
      <circle cx={hand.x} cy={hand.y} r={38} fill={glow ? "rgba(143,216,255,0.16)" : HANDGRAU} stroke={armFarbe} strokeWidth={8} />
      {nachHand}
    </g>
  );
};

/** Ball (lokal oder absolut, je nach Eltern-g). */
export const Ball: React.FC<{ x: number; y: number; r?: number; farbe?: string; glow?: boolean; opacity?: number }> = ({ x, y, r = 30, farbe = C.red, glow, opacity = 1 }) => (
  <g opacity={opacity}>
    <circle cx={x} cy={y} r={r} fill={glow ? "rgba(255,210,122,0.35)" : farbe} stroke={glow ? AMBER : C.ink} strokeWidth={r * 0.23} />
    {!glow && <circle cx={x - r * 0.32} cy={y - r * 0.32} r={r * 0.24} fill="#fff" opacity={0.55} />}
    {farbe === TENNIS && <path d={`M${x - r * 0.75} ${y - r * 0.55} Q ${x} ${y} ${x - r * 0.55} ${y + r * 0.75}`} stroke="#fff" strokeWidth={r * 0.14} fill="none" />}
  </g>
);

/** Gedachter Ball: gestrichelte Kontur ohne Füllung. */
export const GeisterBall: React.FC<{ x: number; y: number; r?: number; farbe?: string; opacity?: number }> = ({ x, y, r = 30, farbe = C.red, opacity = 1 }) => (
  <g opacity={opacity}>
    <circle cx={x} cy={y} r={r} fill="none" stroke={farbe} strokeWidth={r * 0.2} strokeDasharray={`${r * 0.42} ${r * 0.3}`} />
  </g>
);

/** Gehirn (Mitte x,y; Breite ≈ 2.2·k·100). */
export const Gehirn: React.FC<{ x: number; y: number; k?: number; glow?: boolean; farbe?: string }> = ({ x, y, k = 1, glow, farbe = "#f2aebd" }) => {
  const ink = glow ? C.glow : C.ink;
  return (
    <g transform={`translate(${x} ${y}) scale(${k})`} style={glow ? { filter: GLOW_FILTER } : undefined}>
      <path
        d="M-96 8 C -118 -44 -76 -96 -24 -84 C -4 -114 58 -110 72 -74 C 118 -70 124 -6 94 18 C 106 60 56 90 14 74 C -16 100 -82 86 -84 48 C -114 44 -116 22 -96 8 Z"
        fill={glow ? GLOWF : farbe} stroke={ink} strokeWidth={8} strokeLinejoin="round"
      />
      <path d="M-4 -82 C -14 -40 18 -20 4 20 C -6 46 14 60 12 74" stroke={ink} strokeWidth={6} fill="none" strokeLinecap="round" />
      <path d="M-70 -30 C -48 -40 -36 -20 -46 0 M 36 -50 C 60 -46 66 -24 52 -8 M 40 26 C 60 22 72 40 66 54 M -58 30 C -40 26 -30 44 -38 58" stroke={ink} strokeWidth={6} fill="none" strokeLinecap="round" />
    </g>
  );
};

/** Auge mit beweglicher Pupille (Mitte x,y; Breite 220·k). */
export const Auge31: React.FC<{ x: number; y: number; k?: number; px?: number; py?: number; glow?: boolean }> = ({ x, y, k = 1, px = 0, py = 0, glow }) => {
  const ink = glow ? C.glow : C.ink;
  return (
    <g transform={`translate(${x} ${y}) scale(${k})`} style={glow ? { filter: GLOW_FILTER } : undefined}>
      <path d="M-110 0 Q 0 -96 110 0 Q 0 96 -110 0 Z" fill={glow ? GLOWF : "#fff"} stroke={ink} strokeWidth={9} strokeLinejoin="round" />
      <circle cx={px} cy={py} r={36} fill={glow ? "rgba(143,216,255,0.5)" : "#5b8fd6"} stroke={ink} strokeWidth={7} />
      <circle cx={px} cy={py} r={16} fill={ink} />
      <circle cx={px - 10} cy={py - 12} r={7} fill="#fff" opacity={0.8} />
    </g>
  );
};

/** Hand von oben (fängt den Ball am Bildrand). Ursprung = Handballen. */
export const FangHand: React.FC<{ x: number; y: number; k?: number }> = ({ x, y, k = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${k})`}>
    <rect x={-26} y={-260} width={52} height={230} fill={HANDGRAU} stroke={C.ink} strokeWidth={7} />
    <path d="M-44 -40 Q -50 30 -10 44 Q 30 50 44 10 L 44 -40 Z" fill={HANDGRAU} stroke={C.ink} strokeWidth={7} strokeLinejoin="round" />
    <path d="M-30 6 L -30 40 M -10 14 L -10 46 M 10 14 L 10 46" stroke={C.ink} strokeWidth={5} strokeLinecap="round" />
  </g>
);
