// #92 (lange Fassung): „Du“ als FigGestalt aus Figuren91.tsx, hier als eigene Kopie mit Zusatz `kinn` (0..1):
// rechte Hand wandert ans Kinn (Denk-Pose). Figuren91.tsx bleibt unberührt (H91 nutzt sie).
import React from "react";
import { C } from "../../basis/lib";
import { BLAU, ROT } from "./icons_h91";

type FigP = { x: number; y: number; greif?: number; blick?: number; atem?: number; s?: number; kinn?: number; id?: string };
const MANTEL = "#2b2c36";
const HAND = "#3a3b47";

const mix = (a: number, b: number, k: number) => a + (b - a) * k;

export const FigDenker: React.FC<FigP> = ({ x, y, greif = 0, blick = 0, atem = 0, s = 1, kinn = 0, id = "h92denk" }) => {
  const sch = y - 250 * s + atem * 2;
  const hy = y - 330 * s, b = blick * 8 * s;
  const arm = (seite: -1 | 1) => {
    const zu = Math.max(0, seite * greif);
    return { hx: x + seite * (70 + 90 * zu) * s, hy: sch + (130 - 90 * zu) * s };
  };
  const l = arm(-1), r0 = arm(1);
  // Denk-Pose: Ellbogen nach außen, Hand unter dem Kinn
  const sx = x + 48 * s, sy = sch + 22 * s;
  const elbX = mix((sx + r0.hx) / 2, x + 92 * s, kinn), elbY = mix((sy + r0.hy) / 2, sch + 92 * s, kinn);
  const hx = mix(r0.hx, x + 14 * s, kinn), hY = mix(r0.hy, hy + 58 * s, kinn);
  const ink = (d: string, w: number, col: string) => (
    <>
      <path d={d} stroke={C.ink} strokeWidth={(w + 11) * s} fill="none" />
      <path d={d} stroke={col} strokeWidth={w * s} fill="none" />
    </>
  );
  const rechterArm = (
    <g>
      {ink(`M${sx} ${sy} L ${elbX} ${elbY} L ${hx} ${hY}`, 25, MANTEL)}
      <circle cx={hx} cy={hY} r={17 * s} fill={HAND} stroke={C.ink} strokeWidth={6} />
    </g>
  );
  return (
    <g strokeLinejoin="round" strokeLinecap="round">
      <defs>
        <linearGradient id={`${id}-licht`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor={ROT} stopOpacity={0.55} />
          <stop offset="0.42" stopColor={MANTEL} stopOpacity={0} />
          <stop offset="0.58" stopColor={MANTEL} stopOpacity={0} />
          <stop offset="1" stopColor={BLAU} stopOpacity={0.55} />
        </linearGradient>
      </defs>
      {/* Beine + Schuhe */}
      <path d={`M${x - 24 * s} ${y - 120 * s} L ${x - 28 * s} ${y - 10 * s} M ${x + 24 * s} ${y - 120 * s} L ${x + 28 * s} ${y - 10 * s}`} stroke={C.ink} strokeWidth={42 * s} />
      <path d={`M${x - 24 * s} ${y - 120 * s} L ${x - 28 * s} ${y - 10 * s} M ${x + 24 * s} ${y - 120 * s} L ${x + 28 * s} ${y - 10 * s}`} stroke="#1c1d25" strokeWidth={30 * s} />
      <ellipse cx={x - 34 * s} cy={y - 4 * s} rx={30 * s} ry={13 * s} fill="#15161c" stroke={C.ink} strokeWidth={6} />
      <ellipse cx={x + 34 * s} cy={y - 4 * s} rx={30 * s} ry={13 * s} fill="#15161c" stroke={C.ink} strokeWidth={6} />
      {/* linker Arm wie gehabt */}
      <path d={`M${x - 48 * s} ${sch + 22 * s} L ${l.hx} ${l.hy}`} stroke={C.ink} strokeWidth={36 * s} />
      <path d={`M${x - 48 * s} ${sch + 22 * s} L ${l.hx} ${l.hy}`} stroke={MANTEL} strokeWidth={25 * s} />
      <circle cx={l.hx} cy={l.hy} r={17 * s} fill={HAND} stroke={C.ink} strokeWidth={6} />
      {/* rechter Arm hinter dem Rumpf, solange er unten ist */}
      {kinn < 0.5 && rechterArm}
      {/* Rumpf */}
      <path d={`M${x - 62 * s} ${y - 112 * s} L ${x - 58 * s} ${sch + 26 * s} Q ${x - 56 * s} ${sch} ${x - 30 * s} ${sch} L ${x + 30 * s} ${sch} Q ${x + 56 * s} ${sch} ${x + 58 * s} ${sch + 26 * s} L ${x + 62 * s} ${y - 112 * s} Z`}
        fill={MANTEL} stroke={C.ink} strokeWidth={7} />
      <path d={`M${x - 62 * s} ${y - 112 * s} L ${x + 62 * s} ${y - 112 * s}`} stroke="#1c1d25" strokeWidth={12 * s} />
      {/* Kapuze */}
      <path d={`M${x - 80 * s} ${hy + 70 * s} Q ${x - 92 * s} ${hy - 50 * s} ${x} ${hy - 96 * s} Q ${x + 92 * s} ${hy - 50 * s} ${x + 80 * s} ${hy + 70 * s} Z`}
        fill={MANTEL} stroke={C.ink} strokeWidth={7} />
      <path d={`M${x - 80 * s} ${hy + 70 * s} Q ${x - 92 * s} ${hy - 50 * s} ${x} ${hy - 96 * s} Q ${x + 92 * s} ${hy - 50 * s} ${x + 80 * s} ${hy + 70 * s} Z`}
        fill={`url(#${id}-licht)`} />
      <ellipse cx={x} cy={hy + 6 * s} rx={50 * s} ry={58 * s} fill="#0d0d12" />
      {[-1, 1].map((k) => (
        <ellipse key={k} cx={x + k * 20 * s + b} cy={hy - kinn * 3 * s} rx={11 * s} ry={6 * s} fill="#fff"
          style={{ filter: `drop-shadow(0 0 ${8 * s}px ${k < 0 ? ROT : BLAU}) drop-shadow(0 0 ${3 * s}px #fff)` }} />
      ))}
      <path d={`M${x - 62 * s} ${y - 112 * s} L ${x - 58 * s} ${y - 224 * s}`} stroke={ROT} strokeWidth={6 * s} opacity={0.8} strokeLinecap="round" />
      <path d={`M${x + 62 * s} ${y - 112 * s} L ${x + 58 * s} ${y - 224 * s}`} stroke={BLAU} strokeWidth={6 * s} opacity={0.8} strokeLinecap="round" />
      {/* rechter Arm vor dem Körper, sobald die Hand zum Kinn geht */}
      {kinn >= 0.5 && rechterArm}
    </g>
  );
};
