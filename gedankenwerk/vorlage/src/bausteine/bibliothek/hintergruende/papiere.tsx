// Gruppe Hintergründe & Bühnen: Papier-Untergründe (Raster, Karo, Linien, Punkte, Blaupause). Alle vollflächig 1080×1920.
import React from "react";
import { AbsoluteFill } from "remotion";
import { AKZENT, C, MONO, mix } from "../_basis";

/** Gemeinsame Props der Hintergründe: t = Sekunde, farbe/farbe2 = Hauptfarben (Standard aus dem Look), dichte = Rasterweite bzw. Menge. */
export type HgP = { t: number; farbe?: string; farbe2?: string; dichte?: number };

/** Papier mit feinem Raster (Hintergedanke-Bühne), Raster driftet leise, Licht atmet. Props: farbe, farbe2 (Rasterfarbe), dichte (Rasterweite px, 108). */
export const HgPapier: React.FC<HgP> = ({ t, farbe = C.paper, farbe2 = C.grid, dichte = 108 }) => {
  const atem = 0.5 + 0.5 * Math.sin(t * 0.9);
  const drift = (t * 5) % dichte;
  return (
    <AbsoluteFill style={{ background: farbe, overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          backgroundImage: `linear-gradient(${farbe2} 2px, transparent 2px), linear-gradient(90deg, ${farbe2} 2px, transparent 2px)`,
          backgroundSize: `${dichte}px ${dichte}px`,
          backgroundPosition: `${drift - 1}px ${drift - 1}px`,
        }}
      />
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% ${40 + atem * 4}%, rgba(255,255,255,${0.5 + atem * 0.12}) 0%, rgba(255,255,255,0) 60%, rgba(0,0,0,0.08) 100%)` }} />
    </AbsoluteFill>
  );
};

/** Karopapier (Rechenkästchen) mit kräftigeren Linien alle fünf Kästchen, Blatt schwebt leicht. Props: farbe (Papier), farbe2 (Linienfarbe), dichte (Kästchen px, 54). */
export const HgKaro: React.FC<HgP> = ({ t, farbe = C.paper2, farbe2 = mix(C.steel, "#6fb4e6", 0.45), dichte = 54 }) => {
  const g = dichte * 5;
  const drift = (t * 6) % g;
  return (
    <AbsoluteFill style={{ background: farbe, overflow: "hidden" }}>
      <AbsoluteFill style={{ opacity: 0.8, backgroundImage: `linear-gradient(${farbe2} 2px, transparent 2px), linear-gradient(90deg, ${farbe2} 2px, transparent 2px)`, backgroundSize: `${dichte}px ${dichte}px`, backgroundPosition: `${drift}px ${drift}px` }} />
      <AbsoluteFill style={{ opacity: 0.95, backgroundImage: `linear-gradient(${farbe2} 3px, transparent 3px), linear-gradient(90deg, ${farbe2} 3px, transparent 3px)`, backgroundSize: `${g}px ${g}px`, backgroundPosition: `${drift}px ${drift}px` }} />
      <AbsoluteFill style={{ background: "linear-gradient(90deg, rgba(0,0,0,0.07) 0%, rgba(0,0,0,0) 8%, rgba(0,0,0,0) 92%, rgba(0,0,0,0.07) 100%)" }} />
      <AbsoluteFill style={{ background: `linear-gradient(${110 + Math.sin(t * 0.5) * 6}deg, rgba(255,255,255,0) 30%, rgba(255,255,255,0.35) 50%, rgba(255,255,255,0) 70%)` }} />
    </AbsoluteFill>
  );
};

/** Liniertes Notizpapier mit rotem Rand, Lochung und leicht schwebendem Blatt. Props: farbe (Papier), farbe2 (Linien), dichte (Zeilenabstand px, 84). */
export const HgLiniert: React.FC<HgP> = ({ t, farbe = C.paper2, farbe2 = mix(C.sky, C.steel, 0.2), dichte = 84 }) => {
  const sway = Math.sin(t * 0.7) * 4;
  const zeilen = Math.floor((1920 - 230) / dichte) + 1;
  return (
    <AbsoluteFill style={{ background: C.line, overflow: "hidden" }}>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", left: 0, top: 0 }}>
        <g transform={`translate(0 ${sway})`}>
          <rect x={0} y={-20} width={1080} height={1980} fill={farbe} />
          {Array.from({ length: zeilen }, (_, i) => (
            <line key={i} x1={0} x2={1080} y1={230 + i * dichte} y2={230 + i * dichte} stroke={farbe2} strokeWidth={4} />
          ))}
          <line x1={172} x2={172} y1={-20} y2={1960} stroke={AKZENT} strokeWidth={4} opacity={0.75} />
          <line x1={184} x2={184} y1={-20} y2={1960} stroke={AKZENT} strokeWidth={2} opacity={0.45} />
          {[330, 960, 1590].map((y) => (
            <g key={y}>
              <circle cx={74} cy={y} r={26} fill={C.line} />
              <circle cx={74} cy={y} r={26} fill="none" stroke="rgba(0,0,0,0.18)" strokeWidth={4} />
              <path d={`M 52 ${y + 6} A 26 26 0 0 0 96 ${y + 6}`} stroke="rgba(255,255,255,0.6)" strokeWidth={3} fill="none" />
            </g>
          ))}
          <rect x={0} y={-20} width={1080} height={1980} fill={`url(#hg-lin-licht)`} />
        </g>
        <defs>
          <linearGradient id="hg-lin-licht" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="rgba(0,0,0,0.06)" />
            <stop offset="0.12" stopColor="rgba(0,0,0,0)" />
            <stop offset="1" stopColor="rgba(0,0,0,0.04)" />
          </linearGradient>
        </defs>
      </svg>
    </AbsoluteFill>
  );
};

/** Punktraster-Papier, durch das eine ruhige Welle läuft (Punkte pulsieren). Props: farbe (Papier), farbe2 (Punkte), dichte (Abstand px, 72). */
export const HgPunktraster: React.FC<HgP> = ({ t, farbe = C.paper, farbe2 = C.muted, dichte = 72 }) => {
  const sp = Math.ceil(1080 / dichte) + 1, ze = Math.ceil(1920 / dichte) + 1;
  const ox = (1080 - (sp - 1) * dichte) / 2, oy = (1920 - (ze - 1) * dichte) / 2;
  const punkte: React.ReactNode[] = [];
  for (let j = 0; j < ze; j++)
    for (let i = 0; i < sp; i++) {
      const x = ox + i * dichte, y = oy + j * dichte;
      const d = Math.hypot(x - 540, y - 860);
      const w = 0.5 + 0.5 * Math.sin(d * 0.011 - t * 1.4);
      punkte.push(<circle key={`${i}-${j}`} cx={x} cy={y} r={3.5 + 3.5 * w} fill={farbe2} opacity={0.35 + 0.4 * w} />);
    }
  return (
    <AbsoluteFill style={{ background: farbe, overflow: "hidden" }}>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", left: 0, top: 0 }}>{punkte}</svg>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 42%, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0) 60%, rgba(0,0,0,0.07) 100%)" }} />
    </AbsoluteFill>
  );
};

/** Blaupause: dunkles Blau mit feinem und grobem Leuchtraster, wanderndem Scanband und Eckmarken. Props: farbe (Grund außen), farbe2 (Mitte), dichte (feines Raster px, 36). */
export const HgBlaupause: React.FC<HgP & { beschriftung?: string }> = ({ t, farbe = C.navyOut, farbe2 = C.navyIn, dichte = 36, beschriftung = "" }) => {
  const g = dichte * 5;
  const drift = (t * 8) % g;
  const scan = ((t * 140) % 2400) - 300;
  const ecke = (x: number, y: number, sx: number, sy: number) => (
    <path d={`M ${x} ${y + sy * 90} L ${x} ${y} L ${x + sx * 90} ${y}`} stroke={C.glow} strokeWidth={5} fill="none" opacity={0.8} />
  );
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: `radial-gradient(ellipse at 50% 40%, ${farbe2} 0%, ${farbe} 78%)` }}>
      <AbsoluteFill style={{ backgroundImage: `linear-gradient(rgba(143,216,255,0.07) 2px, transparent 2px), linear-gradient(90deg, rgba(143,216,255,0.07) 2px, transparent 2px)`, backgroundSize: `${dichte}px ${dichte}px`, backgroundPosition: `0px ${drift}px` }} />
      <AbsoluteFill style={{ backgroundImage: `linear-gradient(rgba(143,216,255,0.16) 2px, transparent 2px), linear-gradient(90deg, rgba(143,216,255,0.16) 2px, transparent 2px)`, backgroundSize: `${g}px ${g}px`, backgroundPosition: `0px ${drift}px` }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: scan, height: 120, background: "linear-gradient(rgba(143,216,255,0), rgba(143,216,255,0.16) 80%, rgba(143,216,255,0.3))" }} />
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", left: 0, top: 0 }}>
        {ecke(50, 50, 1, 1)}{ecke(1030, 50, -1, 1)}{ecke(50, 1870, 1, -1)}{ecke(1030, 1870, -1, -1)}
        {beschriftung ? <text x={1030} y={1840} textAnchor="end" fontFamily={MONO} fontWeight={700} fontSize={30} letterSpacing={6} fill={C.glow} opacity={0.65}>{beschriftung}</text> : null}
      </svg>
    </AbsoluteFill>
  );
};
