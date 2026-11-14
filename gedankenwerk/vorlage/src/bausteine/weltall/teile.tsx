// Weltall-Bausteine: Sternenhimmel, Sonne (an/aus), Erde mit Tag/Nacht, Mond, Licht- und Schwerkraftfront,
// Stadt (Tag → Nacht), Vögel auf der Leitung, Thermometer, Uhr. SVG/HTML in Bildkoordinaten (1080 × 1920).
import React from "react";
import { MONO, ease, rgba } from "../../basis/lib";

export const ALL = "#03050b";
export const SONNE = "#ffd25e";
export const SONNE2 = "#ff9a3c";
export const BLAU = "#4ea3ff";
export const CREME = "#f4f1ea";

export const sz = (t: number, a: number, b: number, bl = 0.25) =>
  t < a - bl || t > b + bl ? 0 : Math.min(a <= 0 ? 1 : ease(t, a - bl, a + 0.05), 1 - ease(t, b - 0.05, b + bl));

export const kamera = (t: number, punkte: number[]) => {
  const p = [...punkte].sort((a, b) => a - b);
  const k = p.filter((a) => t >= a).length;
  const z = (i: number) => 1 + 0.05 * (i % 2);
  return k === 0 ? 1 : z(k - 1) + (z(k) - z(k - 1)) * ease(t, p[k - 1], p[k - 1] + 0.35);
};

export const Sterne: React.FC<{ t: number; n?: number; o?: number; y0?: number; y1?: number }> = ({ t, n = 90, o = 1, y0 = 0, y1 = 1920 }) => (
  <g opacity={o}>
    {Array.from({ length: n }, (_, i) => {
      const x = (i * 337 + 41) % 1080;
      const y = y0 + ((i * 197 + 13) % Math.max(1, y1 - y0));
      return <circle key={i} cx={x} cy={y} r={i % 7 === 0 ? 2.8 : 1.6} fill="#ffffff" opacity={0.35 + 0.35 * Math.sin(t * 1.7 + i)} />;
    })}
  </g>
);

/** Sonne: an 0..1 (0 = verschwunden, nur gestrichelter Umriss bleibt). */
export const Sonne: React.FC<{ x: number; y: number; r: number; an: number; umriss?: boolean; t: number }> = ({ x, y, r, an, umriss = true, t }) => (
  <g>
    {an > 0 ? (
      <g opacity={an}>
        <circle cx={x} cy={y} r={r * 2.6} fill={rgba(SONNE2, 0.12)} />
        <circle cx={x} cy={y} r={r * 1.7} fill={rgba(SONNE, 0.22)} />
        {Array.from({ length: 16 }, (_, i) => {
          const w = (i / 16) * Math.PI * 2 + t * 0.15;
          const l = r * (1.25 + 0.15 * Math.sin(t * 3 + i));
          return <line key={i} x1={x + Math.cos(w) * r * 1.05} y1={y + Math.sin(w) * r * 1.05} x2={x + Math.cos(w) * l} y2={y + Math.sin(w) * l} stroke={SONNE} strokeWidth={6} strokeLinecap="round" opacity={0.7} />;
        })}
        <circle cx={x} cy={y} r={r * an} fill={SONNE} />
        <circle cx={x - r * 0.3} cy={y - r * 0.3} r={r * 0.35 * an} fill="#fff3c4" opacity={0.6} />
      </g>
    ) : null}
    {umriss && an < 1 ? <circle cx={x} cy={y} r={r} fill="none" stroke={rgba(SONNE, 0.55 * (1 - an))} strokeWidth={4} strokeDasharray="12 10" /> : null}
  </g>
);

/** Erde: licht 0..1 (Tagseite zur Sonne), richtung = Winkel (Grad) zur Sonne. */
export const Erde: React.FC<{ x: number; y: number; r: number; licht: number; richtung: number; t: number; id: string }> = ({ x, y, r, licht, richtung, t, id }) => (
  <g>
    <defs>
      <clipPath id={`er-${id}`}>
        <circle cx={x} cy={y} r={r} />
      </clipPath>
      <linearGradient id={`et-${id}`} gradientTransform={`rotate(${richtung + 180} 0.5 0.5)`}>
        <stop offset="0%" stopColor="#000000" stopOpacity={0.05} />
        <stop offset="55%" stopColor="#000000" stopOpacity={0.15} />
        <stop offset="80%" stopColor="#000000" stopOpacity={0.75} />
      </linearGradient>
    </defs>
    {licht > 0 ? <circle cx={x} cy={y} r={r * 1.18} fill={rgba(BLAU, 0.18 * licht)} /> : null}
    <g clipPath={`url(#er-${id})`}>
      <rect x={x - r} y={y - r} width={2 * r} height={2 * r} fill="#1d5fb3" />
      {[0, 1, 2, 3].map((i) => {
        const cx = x - r + (((i * 0.31 + t * 0.03) % 1.3) - 0.15) * 2 * r;
        return <ellipse key={i} cx={cx} cy={y + (i % 2 ? 0.3 : -0.25) * r} rx={r * 0.35} ry={r * 0.22} fill="#3f9a5a" />;
      })}
      <rect x={x - r} y={y - r} width={2 * r} height={2 * r} fill={`url(#et-${id})`} />
      <rect x={x - r} y={y - r} width={2 * r} height={2 * r} fill="#02040a" opacity={0.88 * (1 - licht)} />
      {licht < 0.6
        ? Array.from({ length: 14 }, (_, i) => (
            <circle key={i} cx={x - r * 0.7 + ((i * 53) % 100) / 100 * r * 1.4} cy={y - r * 0.5 + ((i * 37) % 100) / 100 * r} r={2.5} fill="#ffd27a" opacity={0.8 * (1 - licht / 0.6)} />
          ))
        : null}
    </g>
    <circle cx={x} cy={y} r={r} fill="none" stroke={rgba("#bfe0ff", 0.4 + 0.3 * licht)} strokeWidth={3} />
  </g>
);

export const Mond: React.FC<{ x: number; y: number; r: number; licht: number }> = ({ x, y, r, licht }) => (
  <g opacity={0.15 + 0.85 * licht}>
    <circle cx={x} cy={y} r={r} fill="#e9e6dc" />
    <circle cx={x - r * 0.3} cy={y - r * 0.2} r={r * 0.18} fill="#cfc9b8" />
    <circle cx={x + r * 0.25} cy={y + r * 0.3} r={r * 0.12} fill="#cfc9b8" />
  </g>
);

/** Uhr oben links: simulierte Zeit seit dem Verschwinden der Sonne. */
export const Uhr: React.FC<{ sekunden: number; o: number; titel?: string; farbe?: string }> = ({ sekunden, o, titel = "SEIT DIE SONNE WEG IST", farbe = SONNE }) => {
  const m = Math.floor(sekunden / 60), s = Math.floor(sekunden % 60);
  return (
    <div style={{ position: "absolute", left: 96, top: 262, opacity: o }}>
      <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 22, letterSpacing: 3, color: rgba(farbe, 0.85) }}>{titel}</div>
      <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 76, lineHeight: 1, color: farbe, textShadow: `0 0 20px ${rgba(farbe, 0.6)}` }}>
        {String(m).padStart(2, "0")}:{String(s).padStart(2, "0")}
      </div>
    </div>
  );
};

/** Stadt mit Himmel: nacht 0..1. */
export const Stadt: React.FC<{ t: number; nacht: number; sterne: number }> = ({ t, nacht, sterne }) => {
  const tag = ["#7cc3ff", "#cfe9ff"], dunkel = ["#03050b", "#0b1530"];
  const mix = (a: string, b: string, k: number) => {
    const h = (s: string) => [1, 3, 5].map((i) => parseInt(s.slice(i, i + 2), 16));
    const [x, y] = [h(a), h(b)];
    return `rgb(${x.map((v, i) => Math.round(v + (y[i] - v) * k)).join(",")})`;
  };
  return (
    <g>
      <defs>
        <linearGradient id="st-himmel" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={mix(tag[0], dunkel[0], nacht)} />
          <stop offset="100%" stopColor={mix(tag[1], dunkel[1], nacht)} />
        </linearGradient>
      </defs>
      <rect width={1080} height={1920} fill="url(#st-himmel)" />
      <Sterne t={t} n={70} o={sterne} y0={250} y1={900} />
      {/* Häuser */}
      {Array.from({ length: 9 }, (_, i) => {
        const w = 90 + ((i * 37) % 60), h = 220 + ((i * 113) % 260);
        const x = i * 122 - 10;
        return (
          <g key={i}>
            <rect x={x} y={1310 - h} width={w} height={h} fill={mix("#4a5a72", "#0a0f1c", nacht)} />
            {Array.from({ length: Math.floor(h / 50) * 2 }, (_, j) => {
              const an = nacht > 0.4 && (i * 7 + j * 3) % 4 !== 0;
              return <rect key={j} x={x + 14 + (j % 2) * (w / 2)} y={1310 - h + 20 + Math.floor(j / 2) * 50} width={18} height={24} fill={an ? "#ffd27a" : mix("#9db4d3", "#111827", nacht)} opacity={an ? 0.9 : 1} />;
            })}
          </g>
        );
      })}
    </g>
  );
};

/** Vögel auf einer Leitung; singen 0..1 zeigt Noten. */
export const Voegel: React.FC<{ t: number; singen: number; nacht: number }> = ({ t, singen, nacht }) => (
  <g>
    <path d="M0,980 Q540,1050 1080,980" fill="none" stroke={nacht > 0.5 ? "#2a3550" : "#2b2f3a"} strokeWidth={4} />
    {[220, 380, 600, 760].map((x, i) => {
      const y = 980 + 70 * (1 - Math.pow((x - 540) / 540, 2)) - 4;
      return (
        <g key={x}>
          <ellipse cx={x} cy={y - 22} rx={26} ry={18} fill={nacht > 0.5 ? "#0b0f1a" : "#22262f"} stroke={nacht > 0.5 ? rgba("#9fb8e6", 0.6) : "none"} strokeWidth={2} />
          <circle cx={x + 20} cy={y - 40} r={12} fill={nacht > 0.5 ? "#0b0f1a" : "#22262f"} stroke={nacht > 0.5 ? rgba("#9fb8e6", 0.6) : "none"} strokeWidth={2} />
          <path d={`M${x + 30},${y - 42} l14,4 l-14,4 Z`} fill="#e0a43b" />
          {singen > 0.05 ? (
            <text x={x + 40 + ((t * 40 + i * 20) % 30)} y={y - 70 - ((t * 60 + i * 30) % 50)} fontSize={40} fill={rgba("#ffffff", singen)}>♪</text>
          ) : null}
        </g>
      );
    })}
  </g>
);

export const Thermometer: React.FC<{ x: number; y: number; stand: number }> = ({ x, y, stand }) => (
  <g>
    <rect x={x - 22} y={y - 260} width={44} height={260} rx={22} fill={rgba("#ffffff", 0.15)} stroke={CREME} strokeWidth={4} />
    <circle cx={x} cy={y + 20} r={40} fill="#e5484d" stroke={CREME} strokeWidth={4} />
    <rect x={x - 12} y={y - 240 * stand} width={24} height={240 * stand + 10} rx={12} fill="#e5484d" />
  </g>
);
