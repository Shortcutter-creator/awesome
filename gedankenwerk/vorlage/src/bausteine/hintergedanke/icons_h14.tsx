// Illustrationen Folge 14 (Der Diamant). Gleicher Stil wie icons.tsx; glow = Röntgen-Fassung. Keine Firmen-Logos.
import React from "react";
import { C, HEAD } from "../../basis/lib";

type P = { size?: number; glow?: boolean; style?: React.CSSProperties };
const ink = (g?: boolean) => (g ? C.glow : C.ink);
const fill = (g: boolean | undefined, f: string) => (g ? "rgba(143,216,255,0.2)" : f);
const gl = (g?: boolean): React.CSSProperties => (g ? { filter: "drop-shadow(0 0 14px rgba(143,216,255,0.45)) drop-shadow(0 0 3px rgba(143,216,255,0.8))" } : {});
const GOLD = "#e8b93c";

/** Facettierter Brillant als <g> im Raster 300×220 (Gürtel y=70, Tafel y=20, Spitze y=210). theta dreht ihn um die Hochachse. */
const DiamantG: React.FC<{ glow?: boolean; theta: number; funkel?: number }> = ({ glow, theta, funkel = 0 }) => {
  const cx = 150, gy = 70, top = 20, apex = 210, hw = 130, tw = 80;
  const N = 8;
  const tones = ["#ffffff", "#e3f3fb", "#bfe0f4", "#9fcbe8"];
  const glowTones = ["rgba(143,216,255,0.34)", "rgba(143,216,255,0.22)", "rgba(143,216,255,0.12)", "rgba(143,216,255,0.06)"];
  const pal = glow ? glowTones : tones;
  const pts = Array.from({ length: N + 1 }, (_, k) => {
    const a = theta + (k * 2 * Math.PI) / N;
    return { a, x: cx + Math.cos(a) * hw, xt: cx + Math.cos(a) * tw };
  });
  const facets: React.ReactNode[] = [];
  for (let k = 0; k < N; k++) {
    const m = pts[k].a + Math.PI / N;
    if (Math.sin(m) <= 0) continue;
    const s = 0.5 + 0.5 * Math.cos(2 * m + 0.8);
    const iCrown = Math.min(3, Math.floor(s * 4));
    const iPav = Math.min(3, Math.floor((1 - s) * 4));
    const p0 = pts[k], p1 = pts[k + 1];
    facets.push(
      <polygon key={`c${k}`} points={`${p0.x},${gy} ${p1.x},${gy} ${p1.xt},${top} ${p0.xt},${top}`} fill={pal[iCrown]} stroke={ink(glow)} strokeWidth={5} strokeLinejoin="round" />,
      <polygon key={`p${k}`} points={`${p0.x},${gy} ${p1.x},${gy} ${cx},${apex}`} fill={pal[iPav]} stroke={ink(glow)} strokeWidth={5} strokeLinejoin="round" />,
    );
  }
  return (
    <g>
      {facets}
      <path d={`M ${cx - hw} ${gy} L ${cx - tw} ${top} L ${cx + tw} ${top} L ${cx + hw} ${gy} L ${cx} ${apex} Z`} fill="none" stroke={ink(glow)} strokeWidth={9} strokeLinejoin="round" />
      <line x1={cx - hw} y1={gy} x2={cx + hw} y2={gy} stroke={ink(glow)} strokeWidth={7} />
      {funkel > 0.02 && (
        <g transform={`translate(${cx - 62} ${top + 22}) scale(${funkel})`} opacity={Math.min(1, funkel)}>
          <path d="M0 -26 L6 -6 L26 0 L6 6 L0 26 L-6 6 L-26 0 L-6 -6 Z" fill={glow ? C.glow : "#ffffff"} stroke={ink(glow)} strokeWidth={4} strokeLinejoin="round" />
        </g>
      )}
    </g>
  );
};

/** Einzelner Diamant (flach, facettiert). */
export const Diamant: React.FC<P & { theta?: number; funkel?: number }> = ({ size = 300, glow, style, theta = 0.6, funkel = 0 }) => (
  <svg width={size} height={size * (220 / 300)} viewBox="0 0 300 220" style={{ overflow: "visible", ...gl(glow), ...style }}>
    <DiamantG glow={glow} theta={theta} funkel={funkel} />
  </svg>
);

/** Verlobungsring: Goldband (dreht sich um die Hochachse) mit Diamant. Kein Markenzeichen. */
export const Verlobungsring: React.FC<P & { theta?: number; funkel?: number }> = ({ size = 400, glow, style, theta = 0.6, funkel = 0 }) => {
  const rx = Math.max(16, Math.abs(Math.cos(theta * 0.5)) * 118);
  return (
    <svg width={size} height={size * (470 / 400)} viewBox="0 0 400 470" style={{ overflow: "visible", ...gl(glow), ...style }}>
      {glow ? (
        <>
          <ellipse cx={200} cy={322} rx={rx} ry={118} fill="rgba(143,216,255,0.1)" stroke={C.glow} strokeWidth={34} opacity={0.35} />
          <ellipse cx={200} cy={322} rx={rx} ry={118} fill="none" stroke={C.glow} strokeWidth={9} />
        </>
      ) : (
        <>
          <ellipse cx={200} cy={322} rx={rx} ry={118} fill="none" stroke={C.ink} strokeWidth={44} />
          <ellipse cx={200} cy={322} rx={rx} ry={118} fill="none" stroke={GOLD} strokeWidth={28} />
          <path d={`M ${200 - rx * 0.7} ${322 + 118 * 0.72} A ${rx} 118 0 0 0 ${200 - rx} 322`} fill="none" stroke="#fff3c4" strokeWidth={7} strokeLinecap="round" opacity={0.8} />
        </>
      )}
      <g transform="translate(95 68) scale(0.7)">
        <DiamantG glow={glow} theta={theta * 0.9 + 0.5} funkel={funkel} />
      </g>
    </svg>
  );
};

/** Lohntüte mit Euro-Zeichen (steht für ein Monatsgehalt). */
export const Lohntuete: React.FC<P> = ({ size = 160, glow, style }) => (
  <svg width={size} height={size * 1.25} viewBox="0 0 160 200" style={{ overflow: "visible", ...gl(glow), ...style }}>
    <path d="M32 70 Q 20 70 18 90 L 14 170 Q 14 192 36 192 L 124 192 Q 146 192 146 170 L 142 90 Q 140 70 128 70 Z" fill={fill(glow, "#dcbc8c")} stroke={ink(glow)} strokeWidth={7} strokeLinejoin="round" />
    <path d="M46 72 L54 38 L106 38 L114 72 Z" fill={fill(glow, "#c9a574")} stroke={ink(glow)} strokeWidth={7} strokeLinejoin="round" />
    <path d="M50 38 L42 14 L66 28 L80 8 L94 28 L118 14 L110 38 Z" fill={fill(glow, "#dcbc8c")} stroke={ink(glow)} strokeWidth={7} strokeLinejoin="round" />
    <rect x={44} y={58} width={72} height={14} rx={6} fill={glow ? C.glow : C.red} stroke={ink(glow)} strokeWidth={5} />
    <circle cx={80} cy={134} r={36} fill={glow ? "rgba(143,216,255,0.12)" : C.paper2} stroke={ink(glow)} strokeWidth={6} />
    <text x={80} y={151} textAnchor="middle" fontFamily={HEAD} fontWeight={900} fontSize={50} fill={ink(glow)}>€</text>
  </svg>
);

export const Herz: React.FC<P> = ({ size = 240, glow, style }) => (
  <svg width={size} height={size * 0.9} viewBox="0 0 200 180" style={{ overflow: "visible", ...gl(glow), ...style }}>
    <path d="M100 170 C 20 112, 2 72, 30 38 C 56 8, 92 20, 100 52 C 108 20, 144 8, 170 38 C 198 72, 180 112, 100 170 Z" fill={fill(glow, C.red)} stroke={ink(glow)} strokeWidth={8} strokeLinejoin="round" />
    <path d="M44 60 C 52 44, 70 42, 80 54" fill="none" stroke={glow ? C.glow : "#ffffff"} strokeWidth={8} strokeLinecap="round" opacity={0.7} />
  </svg>
);

/** Bürohochhaus (steht für die Werbeagentur). Ohne Logo. */
export const Buero: React.FC<P> = ({ size = 260, glow, style }) => {
  const win: React.ReactNode[] = [];
  for (let r = 0; r < 6; r++)
    for (let c = 0; c < 3; c++)
      win.push(<rect key={`${r}${c}`} x={62 + c * 40} y={66 + r * 34} width={24} height={20} rx={3} fill={glow ? "rgba(143,216,255,0.35)" : (r + c) % 3 === 0 ? C.yellow : "#ffffff"} stroke={ink(glow)} strokeWidth={4} />);
  return (
    <svg width={size} height={size * 1.36} viewBox="0 0 220 300" style={{ overflow: "visible", ...gl(glow), ...style }}>
      <line x1={110} y1={6} x2={110} y2={40} stroke={ink(glow)} strokeWidth={7} strokeLinecap="round" />
      <rect x={44} y={40} width={132} height={252} rx={8} fill={fill(glow, C.steel)} stroke={ink(glow)} strokeWidth={8} />
      {win}
      <rect x={90} y={254} width={40} height={38} rx={4} fill={fill(glow, "#3b4049")} stroke={ink(glow)} strokeWidth={5} />
      <line x1={20} y1={292} x2={200} y2={292} stroke={ink(glow)} strokeWidth={8} strokeLinecap="round" />
    </svg>
  );
};

/** Preisschild (Text kommt als HTML darüber). */
export const Schild: React.FC<P & { farbe?: string }> = ({ size = 520, glow, style, farbe = C.yellow }) => (
  <svg width={size} height={size * (220 / 520)} viewBox="0 0 520 220" style={{ overflow: "visible", ...gl(glow), ...style }}>
    <path d="M66 10 L496 10 Q 510 10 510 24 L510 196 Q 510 210 496 210 L66 210 L8 110 Z" fill={fill(glow, farbe)} stroke={ink(glow)} strokeWidth={8} strokeLinejoin="round" />
    <circle cx={66} cy={110} r={16} fill={glow ? "#1a2138" : C.paper} stroke={ink(glow)} strokeWidth={6} />
    <path d="M66 110 C 30 70, 36 20, -8 -24" fill="none" stroke={ink(glow)} strokeWidth={6} strokeLinecap="round" />
  </svg>
);

export const Anker: React.FC<P> = ({ size = 200, glow, style }) => (
  <svg width={size} height={size * 1.25} viewBox="0 0 160 200" style={{ overflow: "visible", ...gl(glow), ...style }}>
    <g fill="none" stroke={ink(glow)} strokeWidth={13} strokeLinecap="round" strokeLinejoin="round">
      <circle cx={80} cy={28} r={16} />
      <line x1={80} y1={46} x2={80} y2={172} />
      <line x1={50} y1={70} x2={110} y2={70} />
      <path d="M22 118 Q 26 176 80 176 Q 134 176 138 118" />
      <path d="M8 134 L22 112 L40 130" />
      <path d="M152 134 L138 112 L120 130" />
    </g>
  </svg>
);

export const Sprechblase: React.FC<P> = ({ size = 360, glow, style }) => (
  <svg width={size} height={size * 0.56} viewBox="0 0 300 168" style={{ overflow: "visible", ...gl(glow), ...style }}>
    <path d="M30 8 L270 8 Q 292 8 292 30 L292 108 Q 292 130 270 130 L170 130 L120 162 L128 130 L30 130 Q 8 130 8 108 L8 30 Q 8 8 30 8 Z" fill={fill(glow, "#ffffff")} stroke={ink(glow)} strokeWidth={7} strokeLinejoin="round" />
  </svg>
);

/** Kartenterminal (Handgerät) mit Display und Tasten. */
export const Terminal: React.FC<P> = ({ size = 150, glow, style }) => (
  <svg width={size} height={size * 1.5} viewBox="0 0 160 240" style={{ overflow: "visible", ...gl(glow), ...style }}>
    <rect x={14} y={8} width={132} height={226} rx={20} fill={fill(glow, "#3b4049")} stroke={ink(glow)} strokeWidth={7} />
    <rect x={30} y={26} width={100} height={70} rx={8} fill={glow ? "rgba(143,216,255,0.12)" : "#cfe9f6"} stroke={ink(glow)} strokeWidth={5} />
    <rect x={42} y={40} width={50} height={8} rx={4} fill={glow ? C.glow : C.ink} opacity={0.8} />
    <rect x={42} y={58} width={76} height={8} rx={4} fill={glow ? C.glow : C.ink} opacity={0.4} />
    <rect x={42} y={74} width={60} height={8} rx={4} fill={glow ? C.glow : C.ink} opacity={0.4} />
    {[0, 1, 2].map((r) => [0, 1, 2].map((c) => <rect key={`${r}${c}`} x={34 + c * 34} y={114 + r * 30} width={26} height={20} rx={5} fill={glow ? "rgba(143,216,255,0.3)" : "#e9ecef"} stroke={ink(glow)} strokeWidth={3} />))}
    <rect x={34} y={206} width={92} height={14} rx={7} fill={glow ? C.glow : C.green} stroke={ink(glow)} strokeWidth={3} />
  </svg>
);

/** Spendenformular: Blatt mit Betrags-Kästchen und Knopf. */
export const Formular: React.FC<P> = ({ size = 150, glow, style }) => (
  <svg width={size} height={size * 1.25} viewBox="0 0 160 200" style={{ overflow: "visible", ...gl(glow), ...style }}>
    <rect x={14} y={8} width={132} height={184} rx={12} fill={fill(glow, "#ffffff")} stroke={ink(glow)} strokeWidth={7} />
    <rect x={32} y={26} width={80} height={12} rx={6} fill={ink(glow)} opacity={0.75} />
    <rect x={32} y={48} width={56} height={8} rx={4} fill={ink(glow)} opacity={0.35} />
    {[0, 1, 2].map((i) => <rect key={i} x={30 + i * 38} y={78} width={30} height={30} rx={6} fill="none" stroke={ink(glow)} strokeWidth={5} />)}
    <rect x={32} y={122} width={96} height={8} rx={4} fill={ink(glow)} opacity={0.35} />
    <rect x={32} y={150} width={96} height={26} rx={10} fill={glow ? "rgba(143,216,255,0.4)" : C.red} stroke={ink(glow)} strokeWidth={5} />
  </svg>
);

/** Gutschein mit Kästchen; haken 0..1 zeichnet den Haken. */
export const Gutschein: React.FC<P & { haken?: number }> = ({ size = 220, glow, style, haken = 0 }) => (
  <svg width={size} height={size * 0.62} viewBox="0 0 240 150" style={{ overflow: "visible", ...gl(glow), ...style }}>
    <path d="M14 14 L226 14 L226 56 A 20 20 0 0 0 226 96 L226 136 L14 136 L14 96 A 20 20 0 0 0 14 56 Z" fill={fill(glow, C.yellow)} stroke={ink(glow)} strokeWidth={7} strokeLinejoin="round" />
    <line x1={176} y1={22} x2={176} y2={128} stroke={ink(glow)} strokeWidth={4} strokeDasharray="8 8" opacity={0.7} />
    <rect x={40} y={32} width={96} height={12} rx={6} fill={ink(glow)} opacity={0.7} />
    <rect x={34} y={70} width={52} height={52} rx={8} fill={glow ? "rgba(143,216,255,0.1)" : "#ffffff"} stroke={ink(glow)} strokeWidth={6} />
    <path d="M44 96 L58 110 L80 78" fill="none" stroke={glow ? C.glow : C.green} strokeWidth={11} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={`${haken} 1`} />
    <rect x={100} y={84} width={60} height={10} rx={5} fill={ink(glow)} opacity={0.4} />
    <rect x={100} y={102} width={44} height={10} rx={5} fill={ink(glow)} opacity={0.4} />
    <path d="M201 64 L207 80 L224 80 L210 90 L216 106 L201 96 L186 106 L192 90 L178 80 L195 80 Z" fill={glow ? "none" : "#fff"} stroke={ink(glow)} strokeWidth={4} strokeLinejoin="round" transform="translate(-4 -2) scale(0.9)" />
  </svg>
);

/** Schreibmaschinenblatt: Walze oben, Papier darunter (Text kommt als HTML darüber). */
export const Schreibblatt: React.FC<P> = ({ size = 700, glow, style }) => (
  <svg width={size} height={size * (640 / 700)} viewBox="0 0 700 640" style={{ overflow: "visible", ...gl(glow), ...style }}>
    <rect x={50} y={40} width={600} height={590} rx={6} fill={fill(glow, "#fffdf7")} stroke={ink(glow)} strokeWidth={8} />
    <rect x={-10} y={0} width={720} height={78} rx={39} fill={fill(glow, "#3b4049")} stroke={ink(glow)} strokeWidth={8} />
    <circle cx={-10} cy={39} r={28} fill={fill(glow, "#9aa1aa")} stroke={ink(glow)} strokeWidth={7} />
    <circle cx={710} cy={39} r={28} fill={fill(glow, "#9aa1aa")} stroke={ink(glow)} strokeWidth={7} />
    <line x1={100} y1={78} x2={600} y2={78} stroke={ink(glow)} strokeWidth={4} opacity={0.5} />
  </svg>
);
