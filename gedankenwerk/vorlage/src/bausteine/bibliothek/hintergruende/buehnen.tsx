// Gruppe Hintergründe & Bühnen: Verläufe, Licht, Overlays (Vignette, Filmkorn) und Streifen. Alle vollflächig 1080×1920.
import React from "react";
import { AbsoluteFill } from "remotion";
import { AKZENT, C, HELL, mix, zufall } from "../_basis";
import type { HgP } from "./papiere";

/** Weicher Farbverlauf, dessen Lichtflecken langsam wandern und atmen. Props: farbe (oben), farbe2 (unten), dichte (Stärke des Akzentflecks 0..1, 0.25). */
export const HgVerlauf: React.FC<HgP> = ({ t, farbe = C.sky, farbe2 = C.paper2, dichte = 0.25 }) => {
  const a = Math.sin(t * 0.35), b = Math.cos(t * 0.27);
  const hell = mix(farbe, "#ffffff", 0.5);
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: `linear-gradient(${165 + a * 8}deg, ${farbe} 0%, ${farbe2} 100%)` }}>
      <AbsoluteFill style={{ background: `radial-gradient(circle at ${30 + a * 14}% ${24 + b * 8}%, ${hell} 0%, rgba(255,255,255,0) ${46 + a * 6}%)`, opacity: 0.85 }} />
      <AbsoluteFill style={{ background: `radial-gradient(circle at ${72 - b * 14}% ${70 + a * 8}%, ${AKZENT} 0%, rgba(255,255,255,0) ${42 + b * 6}%)`, opacity: dichte }} />
    </AbsoluteFill>
  );
};

/** Spotlight-Bühne: dunkler Raum, Lichtkegel von oben mit Staubkörnern, Lichtpool auf dem Boden. Props: farbe (Lichtfarbe), farbe2 (Raum), dichte (Staubkörner, 36). */
export const HgSpotlight: React.FC<HgP> = ({ t, farbe = mix(HELL, C.yellow, 0.25), farbe2 = C.navyOut, dichte = 36 }) => {
  const sway = Math.sin(t * 0.5) * 26;
  const atem = 0.85 + 0.15 * Math.sin(t * 1.3);
  const staub = Array.from({ length: dichte }, (_, i) => {
    const v = 0.2 + zufall(i + 40) * 0.5;
    const y = 1500 - (((zufall(i + 3) * 1500 + t * 60 * v) % 1500));
    const breite = 120 + (y / 1500) * 380;
    const x = 540 + sway * (1 - y / 1500) + (zufall(i + 7) - 0.5) * 2 * breite * 0.8 + Math.sin(t * v + i) * 14;
    return <circle key={i} cx={x} cy={y} r={2 + zufall(i + 11) * 3.5} fill={farbe} opacity={(0.25 + 0.5 * zufall(i + 19)) * atem} />;
  });
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: `radial-gradient(ellipse at 50% 80%, ${mix(farbe2, "#ffffff", 0.12)} 0%, ${farbe2} 70%)` }}>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", left: 0, top: 0 }}>
        <defs>
          <linearGradient id="hg-spot-kegel" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={farbe} stopOpacity={0.55 * atem} />
            <stop offset="1" stopColor={farbe} stopOpacity={0.1 * atem} />
          </linearGradient>
          <radialGradient id="hg-spot-pool" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor={farbe} stopOpacity={0.6 * atem} />
            <stop offset="1" stopColor={farbe} stopOpacity={0} />
          </radialGradient>
        </defs>
        <ellipse cx={540 + sway} cy={1560} rx={620} ry={150} fill="url(#hg-spot-pool)" />
        <ellipse cx={540 + sway} cy={1560} rx={430} ry={96} fill="none" stroke={farbe} strokeOpacity={0.35 * atem} strokeWidth={5} />
        <polygon points={`${500},-40 ${580},-40 ${540 + sway + 470},1560 ${540 + sway - 470},1560`} fill="url(#hg-spot-kegel)" />
        {staub}
        <rect x={0} y={1600} width={1080} height={320} fill="rgba(0,0,0,0.35)" />
      </svg>
    </AbsoluteFill>
  );
};

/** Vignette als Overlay (transparent in der Mitte, dunkle Ränder), atmet leicht. Props: farbe (Randfarbe), dichte (Stärke 0..1, 0.45). */
export const HgVignette: React.FC<HgP> = ({ t, farbe = C.ink, dichte = 0.45 }) => {
  const atem = 0.5 + 0.5 * Math.sin(t * 0.8);
  const rgb = farbe.startsWith("#") && farbe.length === 7 ? [1, 3, 5].map((i) => parseInt(farbe.slice(i, i + 2), 16)).join(",") : "0,0,0";
  return (
    <AbsoluteFill style={{ pointerEvents: "none", background: `radial-gradient(ellipse 75% 62% at 50% 50%, rgba(${rgb},0) ${52 + atem * 4}%, rgba(${rgb},${dichte}) 100%)` }} />
  );
};

/** Filmkorn als Overlay (deterministisches Rauschen, wechselt 12-mal pro Sekunde). Props: dichte (Stärke 0..1, 0.28). */
export const HgFilmkorn: React.FC<HgP> = ({ t, dichte = 0.28 }) => {
  const seed = Math.floor(t * 12) % 64;
  return (
    <AbsoluteFill style={{ pointerEvents: "none", mixBlendMode: "overlay", opacity: dichte * 2.4 }}>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", left: 0, top: 0 }}>
        <filter id="hg-korn" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} seed={seed} stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
          <feComponentTransfer>
            <feFuncR type="linear" slope="1.8" intercept="-0.4" />
            <feFuncG type="linear" slope="1.8" intercept="-0.4" />
            <feFuncB type="linear" slope="1.8" intercept="-0.4" />
          </feComponentTransfer>
        </filter>
        <rect width={1080} height={1920} filter="url(#hg-korn)" />
      </svg>
    </AbsoluteFill>
  );
};

/** Wandernde Diagonalstreifen in zwei Farben, laufen endlos. Props: farbe, farbe2, dichte (Streifenbreite px, 70). */
export const HgStreifen: React.FC<HgP> = ({ t, farbe = C.paper, farbe2 = mix(C.paper, AKZENT, 0.16), dichte = 70 }) => {
  const per = dichte * 2;
  const off = (t * 40) % per;
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: farbe }}>
      <div
        style={{
          position: "absolute", left: 540 - 1800, top: 960 - 1800, width: 3600, height: 3600, transform: "rotate(-45deg)",
          backgroundImage: `linear-gradient(90deg, ${farbe} 50%, ${farbe2} 50%)`, backgroundSize: `${per}px 100%`, backgroundRepeat: "repeat",
          backgroundPosition: `${off}px 0px`,
        }}
      />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0) 65%)" }} />
    </AbsoluteFill>
  );
};
