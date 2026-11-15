// Illustrationen Folge 08 (Drittelpfund). Gleicher Stil wie icons.tsx; glow = Röntgen-Fassung.
import React from "react";
import { C, HEAD } from "../../basis/lib";

type P = { size?: number; glow?: boolean; style?: React.CSSProperties };
const ink = (g?: boolean) => (g ? C.glow : C.ink);
const fill = (g: boolean | undefined, f: string) => (g ? "rgba(143,216,255,0.2)" : f);
const gl = (g?: boolean): React.CSSProperties => (g ? { filter: "drop-shadow(0 0 14px rgba(143,216,255,0.45)) drop-shadow(0 0 3px rgba(143,216,255,0.8))" } : {});

/** Burger in 6 Schichten. p[i] = Fall-Fortschritt 0..1 (Überschwingen erlaubt): boden, patty, käse, salat, tomate, deckel. dick = Drittelpfund-Patty. */
export const Burger: React.FC<P & { p?: number[]; dick?: boolean }> = ({ size = 400, p = [1, 1, 1, 1, 1, 1], dick, style }) => {
  const L = (i: number, children: React.ReactNode) => (
    <g key={i} transform={`translate(0 ${(1 - p[i]) * -900})`} opacity={Math.min(1, p[i] * 4)}>
      {children}
    </g>
  );
  const sw = 8;
  const py = dick ? 192 : 206;
  const ph = dick ? 76 : 50;
  return (
    <svg width={size} height={size * 0.83} viewBox="0 0 400 332" style={{ overflow: "visible", ...style }}>
      {L(0, <path d="M26 262 L374 262 Q 374 312 330 312 L70 312 Q 26 312 26 262 Z" fill="#e8b66a" stroke={C.ink} strokeWidth={sw} strokeLinejoin="round" />)}
      {L(1, <rect x={18} y={py} width={364} height={ph} rx={ph / 2} fill="#7a4a32" stroke={C.ink} strokeWidth={sw} />)}
      {L(2, <path d="M30 184 L370 184 L370 200 L326 200 L306 236 L284 200 L30 200 Z" fill={C.yellow} stroke={C.ink} strokeWidth={sw} strokeLinejoin="round" />)}
      {L(3, <path d="M24 170 Q 50 148 76 170 T 128 170 T 180 170 T 232 170 T 284 170 T 336 170 T 376 168 L 376 190 L24 190 Z" fill={C.green} stroke={C.ink} strokeWidth={sw} strokeLinejoin="round" />)}
      {L(4, <rect x={36} y={148} width={328} height={30} rx={15} fill={C.red} stroke={C.ink} strokeWidth={sw} />)}
      {L(
        5,
        <>
          <path d="M22 148 C 22 14, 378 14, 378 148 Z" fill="#e8b66a" stroke={C.ink} strokeWidth={sw} strokeLinejoin="round" />
          {[[110, 70], [170, 48], [240, 60], [290, 92], [150, 100], [220, 108], [86, 112]].map(([x, y], i) => (
            <ellipse key={i} cx={x} cy={y} rx={13} ry={7} transform={`rotate(${i * 37} ${x} ${y})`} fill="#f6f3ec" stroke={C.ink} strokeWidth={3} />
          ))}
        </>,
      )}
    </svg>
  );
};

/** Torte: `teile` gleiche Stücke, ein Stück (Anteil 0..1 seiner Größe) gefüllt. */
export const Torte: React.FC<P & { teile: number; anteil?: number }> = ({ size = 300, glow, style, teile, anteil = 1 }) => {
  const r = 90, c = 100;
  const th = (360 / teile) * anteil;
  const rad = (d: number) => (d * Math.PI) / 180;
  const a0 = -90, a1 = a0 + th;
  const pt = (a: number) => `${c + r * Math.cos(rad(a))} ${c + r * Math.sin(rad(a))}`;
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" style={{ overflow: "visible", ...gl(glow), ...style }}>
      <circle cx={c} cy={c} r={r} fill={fill(glow, C.paper2)} stroke={ink(glow)} strokeWidth={7} />
      {th > 0.5 && <path d={`M${c} ${c} L${pt(a0)} A${r} ${r} 0 ${th > 180 ? 1 : 0} 1 ${pt(a1)} Z`} fill={glow ? "rgba(143,216,255,0.6)" : C.yellow} stroke={ink(glow)} strokeWidth={6} strokeLinejoin="round" />}
      {Array.from({ length: teile }).map((_, i) => (
        <line key={i} x1={c} y1={c} x2={c + r * Math.cos(rad(-90 + (360 / teile) * i))} y2={c + r * Math.sin(rad(-90 + (360 / teile) * i))} stroke={ink(glow)} strokeWidth={5} />
      ))}
    </svg>
  );
};

export const Gehirn: React.FC<P> = ({ size = 260, glow, style }) => (
  <svg width={size} height={size * 0.84} viewBox="0 0 250 210" style={{ overflow: "visible", ...gl(glow), ...style }}>
    <path d="M100 40 C 60 20, 10 60, 30 100 C 0 130, 30 182, 72 170 C 92 202, 142 202, 152 170 C 192 190, 232 160, 222 120 C 252 90, 222 30, 172 40 C 152 8, 110 12, 100 40 Z" fill={fill(glow, "#f2b6c0")} stroke={ink(glow)} strokeWidth={8} strokeLinejoin="round" />
    <path d="M126 36 L126 172 M70 80 Q 96 90 100 114 M180 78 Q 154 92 152 116 M64 134 Q 90 128 108 146" fill="none" stroke={ink(glow)} strokeWidth={6} strokeLinecap="round" />
  </svg>
);

/** Waage; neig in Grad (positiv: rechts schwerer). */
export const Waage: React.FC<P & { neig: number; links: string; rechts: string }> = ({ size = 760, style, neig, links, rechts }) => {
  const a = (neig * Math.PI) / 180;
  const R = 300;
  const lx = 400 - R * Math.cos(a), ly = 130 - R * Math.sin(a);
  const rx = 400 + R * Math.cos(a), ry = 130 + R * Math.sin(a);
  const pan = (x: number, y: number, txt: string, schwer: boolean) => (
    <g>
      <path d={`M${x} ${y} L${x - 78} ${y + 150} M${x} ${y} L${x + 78} ${y + 150}`} stroke={C.ink} strokeWidth={5} fill="none" />
      <path d={`M${x - 96} ${y + 150} L${x + 96} ${y + 150} Q ${x + 84} ${y + 200} ${x} ${y + 200} Q ${x - 84} ${y + 200} ${x - 96} ${y + 150} Z`} fill={schwer ? C.yellow : C.steel} stroke={C.ink} strokeWidth={7} strokeLinejoin="round" />
      <rect x={x - 80} y={y + 70} width={160} height={72} rx={14} fill={C.paper2} stroke={C.ink} strokeWidth={6} />
      <text x={x} y={y + 120} textAnchor="middle" fontFamily={HEAD} fontWeight={900} fontSize={44} fill={C.ink}>{txt}</text>
    </g>
  );
  return (
    <svg width={size} height={size * 0.56} viewBox="0 0 800 450" style={{ overflow: "visible", ...style }}>
      <path d="M400 130 L330 410 L470 410 Z" fill={C.steel} stroke={C.ink} strokeWidth={7} strokeLinejoin="round" />
      <rect x={290} y={404} width={220} height={26} rx={10} fill={C.ink} />
      <line x1={lx} y1={ly} x2={rx} y2={ry} stroke={C.ink} strokeWidth={14} strokeLinecap="round" />
      <circle cx={400} cy={130} r={20} fill={C.yellow} stroke={C.ink} strokeWidth={7} />
      {pan(lx, ly, links, neig < 0)}
      {pan(rx, ry, rechts, neig > 0)}
    </svg>
  );
};

/** Preisschild mit Fragezeichen. */
export const Etikett: React.FC<P & { txt?: string }> = ({ size = 300, glow, style, txt = "?" }) => (
  <svg width={size} height={size * 0.62} viewBox="0 0 300 186" style={{ overflow: "visible", ...gl(glow), ...style }}>
    <path d="M62 8 L276 8 Q 292 8 292 24 L292 162 Q 292 178 276 178 L62 178 L8 93 Z" fill={fill(glow, C.yellow)} stroke={ink(glow)} strokeWidth={8} strokeLinejoin="round" />
    <circle cx={64} cy={93} r={13} fill={C.paper} stroke={ink(glow)} strokeWidth={6} />
    <text x={178} y={142} textAnchor="middle" fontFamily={HEAD} fontWeight={900} fontSize={130} fill={ink(glow)}>{txt}</text>
  </svg>
);

/** Lautsprecher mit Schallwellen (w 0..1 = wie viele Wellen sichtbar). */
export const Laut: React.FC<P & { w?: number }> = ({ size = 260, style, w = 1 }) => (
  <svg width={size} height={size * 0.7} viewBox="0 0 260 180" style={{ overflow: "visible", ...style }}>
    <path d="M20 66 L60 66 L110 24 L110 156 L60 114 L20 114 Z" fill={C.steel} stroke={C.ink} strokeWidth={8} strokeLinejoin="round" />
    {[0, 1, 2].map((i) => (
      <path key={i} d={`M${136 + i * 38} ${90 - 26 - i * 14} Q ${158 + i * 38} 90 ${136 + i * 38} ${90 + 26 + i * 14}`} fill="none" stroke={C.ink} strokeWidth={8} strokeLinecap="round" opacity={Math.max(0, Math.min(1, w * 3 - i))} />
    ))}
  </svg>
);

/** Apfel (gesünderer Snack). */
export const Apfel: React.FC<P> = ({ size = 200, glow, style }) => (
  <svg width={size} height={size} viewBox="0 0 200 200" style={{ overflow: "visible", ...gl(glow), ...style }}>
    <path d="M100 58 C 70 36, 22 50, 24 102 C 26 150, 62 190, 100 176 C 138 190, 174 150, 176 102 C 178 50, 130 36, 100 58 Z" fill={fill(glow, C.red)} stroke={ink(glow)} strokeWidth={8} strokeLinejoin="round" />
    <path d="M100 58 C 100 40, 104 26, 112 14" fill="none" stroke={ink(glow)} strokeWidth={8} strokeLinecap="round" />
    <path d="M110 36 C 124 14, 152 14, 160 22 C 150 40, 126 46, 110 36 Z" fill={fill(glow, C.green)} stroke={ink(glow)} strokeWidth={6} strokeLinejoin="round" />
    <path d="M52 94 C 54 78, 64 70, 76 68" fill="none" stroke="#fff" strokeWidth={8} strokeLinecap="round" opacity={0.7} />
  </svg>
);

/** Schokoriegel (Vergleichs-Snack). */
export const Riegel: React.FC<P> = ({ size = 200, glow, style }) => (
  <svg width={size} height={size * 0.6} viewBox="0 0 200 120" style={{ overflow: "visible", ...gl(glow), ...style }}>
    <path d="M14 30 L30 22 L30 98 L14 90 Z M186 30 L170 22 L170 98 L186 90 Z" fill={fill(glow, C.steel)} stroke={ink(glow)} strokeWidth={6} strokeLinejoin="round" />
    <rect x={30} y={18} width={140} height={84} rx={12} fill={fill(glow, "#7a4a32")} stroke={ink(glow)} strokeWidth={8} />
    <path d="M54 18 L54 102 M100 18 L100 102 M146 18 L146 102" stroke={ink(glow)} strokeWidth={5} opacity={0.5} />
  </svg>
);
