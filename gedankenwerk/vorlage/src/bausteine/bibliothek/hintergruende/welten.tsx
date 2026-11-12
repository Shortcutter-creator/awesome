// Gruppe Hintergründe & Bühnen: Szenen-Hintergründe (Himmel, Nacht, Kreidetafel, Pinnwand, Schreibtisch). Alle vollflächig 1080×1920.
import React from "react";
import { AbsoluteFill } from "remotion";
import { AKZENT, C, HELL, mix, zufall } from "../_basis";
import type { HgP } from "./papiere";

const Wolke: React.FC<{ x: number; y: number; s: number; farbe: string; alpha: number }> = ({ x, y, s, farbe, alpha }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={alpha} fill={farbe}>
    <ellipse cx={0} cy={30} rx={190} ry={44} />
    <circle cx={-80} cy={0} r={52} />
    <circle cx={-10} cy={-30} r={72} />
    <circle cx={80} cy={-4} r={54} />
  </g>
);

/** Tageshimmel mit ziehenden Wolken in zwei Ebenen und Sonnenglanz. Props: farbe (Himmel oben), farbe2 (Horizont), dichte (Wolkenzahl, 8). */
export const HgHimmel: React.FC<HgP> = ({ t, farbe = mix(C.sky, "#6fb4e6", 0.45), farbe2 = C.paper2, dichte = 8 }) => {
  const wolken = Array.from({ length: dichte }, (_, i) => {
    const fern = i % 2 === 0;
    const v = fern ? 14 : 26;
    const s = fern ? 0.8 + zufall(i + 2) * 0.3 : 1.2 + zufall(i + 5) * 0.5;
    const weg = 1080 + 900;
    const x = ((zufall(i + 9) * weg + t * v) % weg) - 450;
    const y = 160 + (i / dichte) * 1350 + zufall(i + 13) * 90;
    return <Wolke key={i} x={x} y={y} s={s} farbe="#ffffff" alpha={fern ? 0.7 : 0.97} />;
  });
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: `linear-gradient(180deg, ${farbe} 0%, ${mix(farbe, farbe2, 0.7)} 78%, ${farbe2} 100%)` }}>
      <AbsoluteFill style={{ background: `radial-gradient(circle at 82% 10%, rgba(255,250,220,${0.8 + 0.1 * Math.sin(t)}) 0%, rgba(255,250,220,0) 42%)` }} />
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", left: 0, top: 0 }}>{wolken}</svg>
    </AbsoluteFill>
  );
};

/** Nachthimmel mit funkelnden Sternen, Mond mit Schimmer und seltener Sternschnuppe. Props: farbe (oben), farbe2 (Horizont), dichte (Sterne, 90). */
export const HgNachthimmel: React.FC<HgP> = ({ t, farbe = C.navyOut, farbe2 = C.navyIn, dichte = 90 }) => {
  const sterne = Array.from({ length: dichte }, (_, i) => {
    const x = zufall(i * 3 + 1) * 1080, y = zufall(i * 3 + 2) * 1500;
    const r = 1.6 + 3.2 * zufall(i * 3 + 3) ** 2;
    const f = 0.45 + 0.55 * (0.5 + 0.5 * Math.sin(t * (1.2 + zufall(i + 50) * 2.4) + i * 1.7));
    return r > 3.6 ? (
      <path key={i} transform={`translate(${x} ${y})`} d={`M 0 ${-r * 3} Q 0 0 ${r * 3} 0 Q 0 0 0 ${r * 3} Q 0 0 ${-r * 3} 0 Z`} fill={HELL} opacity={f} />
    ) : (
      <circle key={i} cx={x} cy={y} r={r} fill={HELL} opacity={f} />
    );
  });
  const u = (t % 7) / 0.9;
  const sx = 120 + u * 620, sy = 220 + u * 360;
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: `linear-gradient(180deg, ${farbe} 0%, ${mix(farbe, farbe2, 0.8)} 100%)` }}>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", left: 0, top: 0 }}>
        <defs>
          <mask id="hg-mond"><rect width={400} height={400} fill="#fff" /><circle cx={235} cy={170} r={92} fill="#000" /></mask>
          <radialGradient id="hg-mond-glanz"><stop offset="0" stopColor={HELL} stopOpacity={0.35} /><stop offset="1" stopColor={HELL} stopOpacity={0} /></radialGradient>
        </defs>
        {sterne}
        <circle cx={800} cy={380} r={230 + 12 * Math.sin(t * 0.9)} fill="url(#hg-mond-glanz)" />
        <g transform="translate(600 180)"><circle cx={200} cy={200} r={110} fill={HELL} mask="url(#hg-mond)" /></g>
        {u < 1 && (
          <g opacity={Math.sin(u * Math.PI)}>
            <line x1={sx} y1={sy} x2={sx - 150} y2={sy - 90} stroke={HELL} strokeWidth={5} strokeLinecap="round" />
            <circle cx={sx} cy={sy} r={7} fill={HELL} />
          </g>
        )}
        <path d="M0 1720 Q 180 1600 340 1690 T 700 1650 T 1080 1700 L1080 1920 L0 1920 Z" fill={mix(farbe, "#000000", 0.45)} />
        <path d="M0 1810 Q 260 1730 520 1800 T 1080 1780 L1080 1920 L0 1920 Z" fill={mix(farbe, "#000000", 0.65)} />
      </svg>
    </AbsoluteFill>
  );
};

/** Kreidetafel mit Holzrahmen, Kreidestaub, verwischten Wischspuren und einer Kreidelinie, die sich immer wieder zeichnet. Props: farbe (Tafelgrün), dichte (Staubwolken, 14). */
export const HgKreidetafel: React.FC<HgP> = ({ t, farbe = "#2d4a3f", farbe2 = "#a47445", dichte = 14 }) => {
  const staub = Array.from({ length: dichte }, (_, i) => (
    <ellipse key={i} cx={100 + zufall(i + 1) * 880} cy={150 + zufall(i + 2) * 1450} rx={80 + zufall(i + 3) * 160} ry={30 + zufall(i + 4) * 60}
      fill="#ffffff" opacity={0.035 + 0.03 * zufall(i + 5) + 0.01 * Math.sin(t * 0.6 + i)} transform={`rotate(${-20 + zufall(i + 6) * 40} ${100 + zufall(i + 1) * 880} ${150 + zufall(i + 2) * 1450})`} />
  ));
  const zug = (t % 6) / 4.2;
  const laenge = 900;
  const teilchen = Array.from({ length: 22 }, (_, i) => {
    const v = 14 + zufall(i + 80) * 22;
    return <circle key={i} cx={120 + zufall(i + 30) * 840 + Math.sin(t * 0.4 + i) * 20} cy={1500 - ((zufall(i + 60) * 1400 + t * v) % 1400)} r={1.5 + zufall(i + 90) * 2} fill="#ffffff" opacity={0.2 + 0.2 * zufall(i + 100)} />;
  });
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: farbe2 }}>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", left: 0, top: 0 }}>
        <defs>
          <filter id="hg-kreide" x="-5%" y="-5%" width="110%" height="110%">
            <feTurbulence type="fractalNoise" baseFrequency="0.06" numOctaves={2} seed={3} result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale={9} />
          </filter>
          <linearGradient id="hg-tafel" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={mix(farbe, "#ffffff", 0.07)} /><stop offset="1" stopColor={farbe} /></linearGradient>
        </defs>
        <rect x={0} y={0} width={1080} height={1920} fill={farbe2} />
        <rect x={0} y={0} width={1080} height={1920} fill="rgba(0,0,0,0.08)" />
        <rect x={52} y={52} width={976} height={1650} rx={10} fill="url(#hg-tafel)" stroke="rgba(0,0,0,0.5)" strokeWidth={8} />
        {staub}
        <g filter="url(#hg-kreide)" opacity={0.2} stroke="#fff" strokeWidth={90} strokeLinecap="round" fill="none">
          <path d="M 140 420 Q 540 330 940 440" /><path d="M 160 980 Q 540 1060 920 960" /><path d="M 150 1400 Q 540 1330 930 1420" />
        </g>
        <g filter="url(#hg-kreide)" stroke="#f4f1e6" strokeWidth={9} strokeLinecap="round" fill="none" opacity={0.9}>
          <rect x={110} y={110} width={860} height={1540} rx={14} opacity={0.35} strokeWidth={5} />
          <path d="M 150 1540 Q 330 1500 480 1550 T 800 1530 T 930 1545" strokeDasharray={laenge} strokeDashoffset={laenge * (1 - Math.min(1, zug))} />
        </g>
        {teilchen}
        <rect x={20} y={1700} width={1040} height={44} rx={8} fill={mix(farbe2, "#000000", 0.2)} stroke="rgba(0,0,0,0.45)" strokeWidth={5} />
        <rect x={20} y={1700} width={1040} height={14} rx={6} fill="rgba(255,255,255,0.18)" />
        <rect x={110} y={1680} width={150} height={26} rx={13} fill="#f4f1e6" stroke="rgba(0,0,0,0.4)" strokeWidth={4} />
        <rect x={680} y={1650} width={190} height={60} rx={10} fill="#b9b0a2" stroke="rgba(0,0,0,0.45)" strokeWidth={5} />
        <rect x={680} y={1650} width={190} height={26} rx={10} fill="#3d4a66" />
      </svg>
    </AbsoluteFill>
  );
};

/** Kork-Pinnwand mit Holzrahmen, Korkkörnung und drei leise pendelnden Zetteln an Pinnnadeln. Props: farbe (Kork), farbe2 (Rahmen), dichte (Körnung, 650). */
export const HgKorkwand: React.FC<HgP> = ({ t, farbe = "#c8955b", farbe2 = "#7a5230", dichte = 650 }) => {
  const koerner = Array.from({ length: dichte }, (_, i) => {
    const hell = zufall(i + 700) > 0.5;
    return <ellipse key={i} cx={60 + zufall(i + 1) * 960} cy={60 + zufall(i + 2) * 1800} rx={2 + zufall(i + 3) * 7} ry={1.5 + zufall(i + 4) * 4}
      fill={hell ? mix(farbe, "#ffffff", 0.3) : mix(farbe, "#000000", 0.3)} opacity={0.5 + 0.4 * zufall(i + 5)} transform={`rotate(${zufall(i + 6) * 180} ${60 + zufall(i + 1) * 960} ${60 + zufall(i + 2) * 1800})`} />;
  });
  const zettel = [
    { x: 250, y: 330, w: 380, h: 440, rot: -5, pin: AKZENT, farbe: C.paper2 },
    { x: 700, y: 760, w: 360, h: 330, rot: 4, pin: C.green, farbe: mix(C.yellow, "#ffffff", 0.35) },
    { x: 280, y: 1150, w: 420, h: 480, rot: 3, pin: C.sky, farbe: C.paper2 },
  ];
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: farbe2 }}>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", left: 0, top: 0 }}>
        <rect width={1080} height={1920} fill={farbe2} />
        <rect x={40} y={40} width={1000} height={1840} rx={8} fill={farbe} stroke="rgba(0,0,0,0.45)" strokeWidth={8} />
        {koerner}
        <rect x={40} y={40} width={1000} height={1840} rx={8} fill="none" stroke="rgba(0,0,0,0.22)" strokeWidth={30} />
        {zettel.map((z, i) => {
          const pend = z.rot + Math.sin(t * 0.9 + i * 2) * 2.2;
          return (
            <g key={i} transform={`translate(${z.x} ${z.y}) rotate(${pend})`}>
              <rect x={10} y={14} width={z.w} height={z.h} fill="rgba(0,0,0,0.22)" />
              <rect x={0} y={0} width={z.w} height={z.h} fill={z.farbe} stroke={C.ink} strokeWidth={5} />
              {[0, 1, 2, 3, 4].map((k) => <line key={k} x1={30} x2={z.w - 30} y1={90 + k * 60} y2={90 + k * 60} stroke={C.line} strokeWidth={5} strokeLinecap="round" />)}
              <circle cx={z.w / 2} cy={26} r={15} fill={z.pin} stroke={C.ink} strokeWidth={4} />
              <circle cx={z.w / 2 - 5} cy={21} r={4} fill="rgba(255,255,255,0.7)" />
            </g>
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};

/** Schreibtisch von oben: Holzplatte mit Maserung, Notizbuch mit Bleistift, Kaffeetasse mit Dampf, Pflanze und Klebezettel. Props: farbe (Holz), farbe2 (Akzent des Zettels), dichte (Maserlinien, 26). */
export const HgSchreibtisch: React.FC<HgP> = ({ t, farbe = "#b98655", farbe2 = C.yellow, dichte = 26 }) => {
  const dielen = 4, bw = 1080 / dielen;
  const maser = Array.from({ length: dichte }, (_, i) => {
    const d = i % dielen, x0 = d * bw + 30 + zufall(i + 1) * (bw - 60);
    const ph = zufall(i + 2) * 6;
    const y0 = zufall(i + 3) * 1500;
    return <path key={i} d={`M ${x0} ${y0} q ${14 * Math.sin(ph)} 160 ${6 * Math.cos(ph)} 320 t ${-8 * Math.sin(ph)} 360`} stroke={mix(farbe, "#000000", 0.35)} strokeWidth={2 + zufall(i + 4) * 2} fill="none" opacity={0.3} strokeLinecap="round" />;
  });
  const dampf = [0, 1, 2].map((k) => {
    const p = ((t * 0.5 + k / 3) % 1);
    return <path key={k} d={`M ${860 + (k - 1) * 22} ${520 - p * 90} q 14 -24 0 -48 t 0 -48`} stroke="#ffffff" strokeWidth={8} fill="none" strokeLinecap="round" opacity={Math.sin(p * Math.PI) * 0.7} />;
  });
  const blatt = (r: number, a: number, k: number) => <ellipse key={k} cx={0} cy={-68} rx={26} ry={70} fill={k % 2 ? "#3f9a5a" : "#4fae66"} stroke={C.ink} strokeWidth={5} transform={`rotate(${a + Math.sin(t * 0.8 + k) * 2.5})`} />;
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: farbe }}>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", left: 0, top: 0 }}>
        {Array.from({ length: dielen }, (_, d) => (
          <rect key={d} x={d * bw} y={0} width={bw} height={1920} fill={mix(farbe, d % 2 ? "#ffffff" : "#000000", d % 2 ? 0.05 : 0.06)} />
        ))}
        {maser}
        {Array.from({ length: dielen - 1 }, (_, d) => <line key={d} x1={(d + 1) * bw} x2={(d + 1) * bw} y1={0} y2={1920} stroke="rgba(0,0,0,0.35)" strokeWidth={5} />)}
        {/* Notizbuch */}
        <g transform="translate(130 1010) rotate(-6)">
          <rect x={16} y={20} width={520} height={680} rx={14} fill="rgba(0,0,0,0.25)" />
          <rect x={0} y={0} width={520} height={680} rx={14} fill={C.paper2} stroke={C.ink} strokeWidth={6} />
          {Array.from({ length: 11 }, (_, k) => <line key={k} x1={70} x2={490} y1={110 + k * 50} y2={110 + k * 50} stroke={C.sky} strokeWidth={4} />)}
          {Array.from({ length: 12 }, (_, k) => <rect key={k} x={-10} y={36 + k * 52} width={34} height={14} rx={7} fill={C.steel} stroke={C.ink} strokeWidth={3} />)}
          <g transform="translate(300 330) rotate(24)">
            <rect x={-170} y={-12} width={300} height={24} rx={4} fill={AKZENT} stroke={C.ink} strokeWidth={5} />
            <polygon points="130,-12 190,0 130,12" fill="#f0d3a8" stroke={C.ink} strokeWidth={5} strokeLinejoin="round" />
            <rect x={-200} y={-12} width={32} height={24} rx={6} fill={C.steel} stroke={C.ink} strokeWidth={5} />
          </g>
        </g>
        {/* Tasse */}
        <g>
          <circle cx={868} cy={612} r={118} fill="rgba(0,0,0,0.22)" />
          <circle cx={858} cy={600} r={116} fill={C.paper2} stroke={C.ink} strokeWidth={6} />
          <path d="M 970 580 q 60 0 60 36 q 0 36 -60 36" fill="none" stroke={C.ink} strokeWidth={22} strokeLinecap="round" />
          <path d="M 970 580 q 60 0 60 36 q 0 36 -60 36" fill="none" stroke={C.paper2} strokeWidth={10} strokeLinecap="round" />
          <circle cx={858} cy={600} r={82} fill="#5a3a28" stroke={C.ink} strokeWidth={6} />
          <ellipse cx={832} cy={578} rx={26} ry={13} fill="rgba(255,255,255,0.22)" transform="rotate(-24 832 578)" />
          {dampf}
        </g>
        {/* Pflanze */}
        <g transform="translate(870 1550)">
          <circle cx={10} cy={14} r={120} fill="rgba(0,0,0,0.22)" />
          {[0, 1, 2, 3, 4, 5, 6].map((k) => blatt(0, k * 51, k))}
          <circle r={64} fill="#c9714f" stroke={C.ink} strokeWidth={6} />
          <circle r={46} fill="#4a3226" />
          <circle cx={-14} cy={-14} r={10} fill="rgba(255,255,255,0.25)" />
        </g>
        {/* Klebezettel */}
        <g transform="translate(560 120) rotate(7)">
          <rect x={10} y={12} width={230} height={230} fill="rgba(0,0,0,0.2)" />
          <rect width={230} height={230} fill={farbe2} stroke={C.ink} strokeWidth={5} />
          {[0, 1, 2].map((k) => <line key={k} x1={34} x2={196 - k * 30} y1={80 + k * 44} y2={80 + k * 44} stroke={C.ink} strokeWidth={6} strokeLinecap="round" opacity={0.55} />)}
        </g>
      </svg>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 40% 35%, rgba(255,255,255,0.14), rgba(0,0,0,0.18))" }} />
    </AbsoluteFill>
  );
};
