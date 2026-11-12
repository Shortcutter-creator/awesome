// Illustrationen Folge 07 (Die Rücksendung). Gleicher Stil wie icons.tsx; glow = Röntgen-Fassung. Keine Logos.
import React from "react";
import { C, HEAD } from "../../basis/lib";

type P = { size?: number; glow?: boolean; style?: React.CSSProperties };
const ink = (g?: boolean) => (g ? C.glow : C.ink);
const fill = (g: boolean | undefined, f: string) => (g ? "rgba(143,216,255,0.2)" : f);
const gl = (g?: boolean): React.CSSProperties => (g ? { filter: "drop-shadow(0 0 14px rgba(143,216,255,0.45)) drop-shadow(0 0 3px rgba(143,216,255,0.8))" } : {});

/** Paket (Breite = size), Rücksende-Etikett vorn. */
export const Paket: React.FC<P> = ({ size = 400, glow, style }) => (
  <svg width={size} height={size * 0.87} viewBox="0 0 300 260" style={{ overflow: "visible", ...gl(glow), ...style }}>
    <path d="M20 66 L58 20 L242 20 L280 66 Z" fill={fill(glow, "#c68f68")} stroke={ink(glow)} strokeWidth={8} strokeLinejoin="round" />
    <rect x={20} y={66} width={260} height={178} rx={8} fill={fill(glow, "#d8a07a")} stroke={ink(glow)} strokeWidth={8} />
    <rect x={126} y={20} width={48} height={224} fill={fill(glow, "#f1e2c4")} stroke={ink(glow)} strokeWidth={6} />
    <rect x={40} y={150} width={72} height={70} rx={6} fill={glow ? "rgba(143,216,255,0.25)" : "#ffffff"} stroke={ink(glow)} strokeWidth={5} />
    <path d="M94 172 L62 172 A12 12 0 0 0 62 196 L92 196" fill="none" stroke={glow ? C.glow : C.red} strokeWidth={6} strokeLinecap="round" />
    <path d="M82 186 L94 196 L82 206" fill="none" stroke={glow ? C.glow : C.red} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const Shirt: React.FC<P & { farbe?: string }> = ({ size = 150, glow, style, farbe = "#4d7fd1" }) => (
  <svg width={size} height={size * 0.94} viewBox="0 0 160 150" style={{ overflow: "visible", ...gl(glow), ...style }}>
    <path d="M50 10 L8 42 L30 72 L50 58 L50 140 L110 140 L110 58 L130 72 L152 42 L110 10 Q 80 32 50 10 Z" fill={fill(glow, farbe)} stroke={ink(glow)} strokeWidth={7} strokeLinejoin="round" />
  </svg>
);

/** U-Turn-Pfeil (zurück). */
export const RueckPfeil: React.FC<P & { farbe?: string }> = ({ size = 160, glow, style, farbe }) => {
  const col = farbe ?? (glow ? C.glow : C.red);
  return (
    <svg width={size} height={size * 0.83} viewBox="0 0 120 100" style={{ overflow: "visible", ...gl(glow), ...style }}>
      <path d="M104 22 L44 22 A29 29 0 0 0 44 80 L88 80" fill="none" stroke={col} strokeWidth={14} strokeLinecap="round" />
      <path d="M72 58 L104 80 L72 102" fill="none" stroke={col} strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const Pfeil: React.FC<P & { dir?: "up" | "down"; farbe?: string }> = ({ size = 220, glow, style, dir = "up", farbe }) => {
  const col = farbe ?? (glow ? C.glow : C.ink);
  return (
    <svg width={size * 0.7} height={size} viewBox="0 0 100 140" style={{ overflow: "visible", transform: dir === "down" ? "scaleY(-1)" : undefined, ...gl(glow), ...style }}>
      <path d="M50 134 L50 30" stroke={col} strokeWidth={22} strokeLinecap="round" />
      <path d="M14 62 L50 12 L86 62" fill="none" stroke={col} strokeWidth={22} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const Kasse: React.FC<P & { bump?: number }> = ({ size = 480, glow, style, bump = 0 }) => (
  <svg width={size} height={size * 0.86} viewBox="0 0 300 260" style={{ overflow: "visible", ...gl(glow), ...style }}>
    <rect x={150} y={20} width={120} height={80} rx={10} fill={glow ? "rgba(143,216,255,0.1)" : "#26303d"} stroke={ink(glow)} strokeWidth={8} />
    <text x={210} y={80} textAnchor="middle" fontFamily={HEAD} fontWeight={900} fontSize={60} fill={C.glow}>€</text>
    <path d="M30 150 L70 104 L270 104 L270 150 Z" fill={fill(glow, "#e9ecef")} stroke={ink(glow)} strokeWidth={8} strokeLinejoin="round" />
    <rect x={30} y={150} width={240} height={46} rx={6} fill={fill(glow, "#ffffff")} stroke={ink(glow)} strokeWidth={8} />
    {[0, 1, 2, 3, 4].map((i) => (
      <circle key={i} cx={78 + i * 36} cy={127} r={9} fill={ink(glow)} opacity={0.55} />
    ))}
    <rect x={30 + bump * 0} y={196 + bump * 22} width={240} height={50} rx={6} fill={fill(glow, "#c9cfd6")} stroke={ink(glow)} strokeWidth={8} />
    <rect x={120} y={214 + bump * 22} width={60} height={12} rx={6} fill={ink(glow)} />
  </svg>
);

/** Tür: o = 0 zu … 1 offen. */
export const Tuer: React.FC<P & { o?: number }> = ({ size = 420, glow, style, o = 0 }) => {
  const x2 = 40 + 220 * (1 - 0.8 * o);
  return (
    <svg width={size * 0.72} height={size} viewBox="0 0 300 420" style={{ overflow: "visible", ...gl(glow), ...style }}>
      <rect x={20} y={10} width={260} height={402} fill={o > 0 ? (glow ? "rgba(143,216,255,0.35)" : "rgba(241,201,74,0.7)") : fill(glow, "#d9d3c8")} stroke={ink(glow)} strokeWidth={9} />
      <path d={`M40 24 L${x2} ${24 + 55 * o} L${x2} ${396 - 55 * o} L40 396 Z`} fill={fill(glow, "#8a5a38")} stroke={ink(glow)} strokeWidth={8} strokeLinejoin="round" />
      <circle cx={x2 - 24} cy={215} r={11} fill={glow ? C.glow : C.yellow} stroke={ink(glow)} strokeWidth={5} />
    </svg>
  );
};

export const Truck: React.FC<P> = ({ size = 170, glow, style }) => (
  <svg width={size} height={size * 0.65} viewBox="0 0 200 130" style={{ overflow: "visible", ...gl(glow), ...style }}>
    <rect x={8} y={14} width={116} height={78} rx={8} fill={fill(glow, "#ffffff")} stroke={ink(glow)} strokeWidth={7} />
    <path d="M124 38 L162 38 L192 66 L192 92 L124 92 Z" fill={fill(glow, C.sky)} stroke={ink(glow)} strokeWidth={7} strokeLinejoin="round" />
    <circle cx={48} cy={100} r={17} fill="#3b4049" stroke={ink(glow)} strokeWidth={6} />
    <circle cx={156} cy={100} r={17} fill="#3b4049" stroke={ink(glow)} strokeWidth={6} />
  </svg>
);

export const Lupe: React.FC<P> = ({ size = 150, glow, style }) => (
  <svg width={size} height={size} viewBox="0 0 150 150" style={{ overflow: "visible", ...gl(glow), ...style }}>
    <circle cx={62} cy={62} r={44} fill={fill(glow, C.sky)} stroke={ink(glow)} strokeWidth={9} />
    <path d="M94 94 L136 136" stroke={ink(glow)} strokeWidth={16} strokeLinecap="round" />
    <path d="M42 64 L58 80 L84 46" fill="none" stroke={C.green} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const Regal: React.FC<P> = ({ size = 160, glow, style }) => (
  <svg width={size} height={size * 0.9} viewBox="0 0 160 144" style={{ overflow: "visible", ...gl(glow), ...style }}>
    <rect x={10} y={8} width={140} height={128} fill="none" stroke={ink(glow)} strokeWidth={8} />
    <path d="M10 52 L150 52 M10 94 L150 94" stroke={ink(glow)} strokeWidth={8} />
    <rect x={24} y={24} width={34} height={28} fill={fill(glow, "#d8a07a")} stroke={ink(glow)} strokeWidth={5} />
    <rect x={88} y={30} width={44} height={22} fill={fill(glow, "#d8a07a")} stroke={ink(glow)} strokeWidth={5} />
    <rect x={30} y={66} width={50} height={28} fill={fill(glow, "#d8a07a")} stroke={ink(glow)} strokeWidth={5} />
    <rect x={104} y={106} width={34} height={30} fill={fill(glow, "#d8a07a")} stroke={ink(glow)} strokeWidth={5} />
  </svg>
);

export const Siegel: React.FC<P> = ({ size = 150, glow, style }) => (
  <svg width={size} height={size} viewBox="0 0 160 160" style={{ overflow: "visible", ...gl(glow), ...style }}>
    <circle cx={80} cy={80} r={68} fill={fill(glow, C.yellow)} stroke={ink(glow)} strokeWidth={8} />
    <circle cx={80} cy={80} r={52} fill="none" stroke={ink(glow)} strokeWidth={4} strokeDasharray="6 8" />
    <text x={80} y={96} textAnchor="middle" fontFamily={HEAD} fontWeight={900} fontSize={60} fill={C.ink}>€</text>
    <path d="M112 52 A38 38 0 0 0 52 46" fill="none" stroke={C.red} strokeWidth={8} strokeLinecap="round" />
    <path d="M46 62 L50 44 L68 52" fill="none" stroke={C.red} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const Kalender: React.FC<P> = ({ size = 150, glow, style }) => (
  <svg width={size} height={size} viewBox="0 0 150 150" style={{ overflow: "visible", ...gl(glow), ...style }}>
    <rect x={14} y={22} width={122} height={114} rx={12} fill={fill(glow, "#ffffff")} stroke={ink(glow)} strokeWidth={7} />
    <rect x={14} y={22} width={122} height={32} rx={12} fill={fill(glow, C.red)} stroke={ink(glow)} strokeWidth={7} />
    <path d="M44 8 L44 34 M106 8 L106 34" stroke={ink(glow)} strokeWidth={8} strokeLinecap="round" />
    {[0, 1, 2].map((r) => [0, 1, 2, 3].map((c) => <circle key={`${r}${c}`} cx={36 + c * 26} cy={76 + r * 22} r={6} fill={r === 1 && c === 2 ? C.green : ink(glow)} opacity={r === 1 && c === 2 ? 1 : 0.4} />))}
  </svg>
);

export const Schluessel: React.FC<P> = ({ size = 150, glow, style }) => (
  <svg width={size} height={size * 0.6} viewBox="0 0 160 96" style={{ overflow: "visible", ...gl(glow), ...style }}>
    <circle cx={36} cy={48} r={28} fill={fill(glow, C.yellow)} stroke={ink(glow)} strokeWidth={8} />
    <circle cx={36} cy={48} r={8} fill={ink(glow)} />
    <path d="M62 48 L148 48 M120 48 L120 70 M138 48 L138 66" stroke={ink(glow)} strokeWidth={10} strokeLinecap="round" />
  </svg>
);

// --- ergänzt 20.10.2026 (Arthur-Fassung) ---------------------------------

/** Euro-Münze (Durchmesser = size). */
export const Muenze: React.FC<P & { zeichen?: string }> = ({ size = 110, glow, style, zeichen = "€" }) => (
  <svg width={size} height={size} viewBox="0 0 120 120" style={{ overflow: "visible", ...gl(glow), ...style }}>
    <circle cx={60} cy={60} r={52} fill={glow ? "rgba(241,201,74,0.3)" : C.yellow} stroke={ink(glow)} strokeWidth={8} />
    <circle cx={60} cy={60} r={38} fill="none" stroke={ink(glow)} strokeWidth={3} opacity={0.5} />
    <text x={60} y={80} textAnchor="middle" fontFamily={HEAD} fontWeight={900} fontSize={zeichen.length > 1 ? 40 : 60} fill={glow ? C.glow : C.ink}>{zeichen}</text>
  </svg>
);

/** Vorhängeschloss: zu = 1 geschlossen. */
export const Schloss: React.FC<P & { zu?: number; farbe?: string }> = ({ size = 120, glow, style, zu = 1, farbe = C.red }) => (
  <svg width={size} height={size * 1.2} viewBox="0 0 100 120" style={{ overflow: "visible", ...gl(glow), ...style }}>
    <path d={`M28 ${54 - 14 * (1 - zu)} L28 34 A22 22 0 0 1 72 34 L72 54`} fill="none" stroke={ink(glow)} strokeWidth={10} strokeLinecap="round" transform={`translate(0 ${-14 * (1 - zu)})`} />
    <rect x={12} y={52} width={76} height={60} rx={10} fill={farbe} stroke={ink(glow)} strokeWidth={8} />
    <circle cx={50} cy={78} r={8} fill={ink(glow)} />
    <path d="M50 82 L50 96" stroke={ink(glow)} strokeWidth={7} strokeLinecap="round" />
  </svg>
);

/** Denkwolke (Breite = size), Inhalt per children als HTML darüber legen. */
export const Wolke: React.FC<P> = ({ size = 420, glow, style }) => (
  <svg width={size} height={size * 0.62} viewBox="0 0 400 248" style={{ overflow: "visible", ...gl(glow), ...style }}>
    <path d="M70 190 C 20 190 14 120 66 112 C 56 56 132 34 162 70 C 186 18 270 22 284 76 C 344 60 388 116 350 158 C 392 196 340 232 300 206 C 270 238 196 236 178 206 C 146 230 92 226 70 190 Z"
      fill={glow ? "rgba(143,216,255,0.14)" : "#fff"} stroke={ink(glow)} strokeWidth={8} strokeLinejoin="round" />
    <circle cx={60} cy={232} r={12} fill={glow ? "rgba(143,216,255,0.14)" : "#fff"} stroke={ink(glow)} strokeWidth={6} />
  </svg>
);
