// Illustrationen Folge 21 (Glühbirnen-Kartell). Gleicher Stil wie icons.tsx; glow = Röntgen-Fassung.
// Keine Logos: Herstellernamen nur als schlichter Text auf Namensschildern (in H21.tsx).
import React from "react";
import { interpolateColors } from "remotion";
import { C, HEAD, MONO } from "../../basis/lib";

type P = { size?: number; glow?: boolean; style?: React.CSSProperties };
const ink = (g?: boolean) => (g ? C.glow : C.ink);
const fill = (g: boolean | undefined, f: string) => (g ? "rgba(143,216,255,0.2)" : f);
const gl = (g?: boolean): React.CSSProperties => (g ? { filter: "drop-shadow(0 0 14px rgba(143,216,255,0.45)) drop-shadow(0 0 3px rgba(143,216,255,0.8))" } : {});
const pol = (cx: number, cy: number, r: number, deg: number) => [cx + r * Math.sin((deg * Math.PI) / 180), cy - r * Math.cos((deg * Math.PI) / 180)] as const;

// ---------------------------------------------------------------------------
// Glühbirne (stehend: Glas oben, Sockel unten). Breite = size, Höhe = size * 440/300.
// an 0..1 = Glühdraht leuchtet; halo = warmer Lichtschein ums Glas. id = eindeutige Gradient-ID.
// ---------------------------------------------------------------------------
const GLAS = "M108 300 C108 252 30 232 30 150 A120 120 0 1 1 270 150 C270 232 192 252 192 300 Z";
const WENDEL = (() => {
  let d = "M112 160";
  for (let i = 0; i < 8; i++) d += " q4.75 -17 9.5 0";
  return d;
})();
export const BIRNE_H = 440 / 300;
export const Gluehbirne: React.FC<P & { an?: number; id?: string; halo?: boolean; rot?: boolean }> = ({ size = 300, glow, style, an = 0, id = "b", halo = true, rot }) => {
  const a = Math.max(0, Math.min(1, an));
  const glas = glow
    ? interpolateColors(a, [0, 1], ["rgba(143,216,255,0.14)", "rgba(255,214,120,0.30)"])
    : interpolateColors(a, [0, 1], ["#eef0ee", "#ffe9a6"]);
  const draht = glow
    ? interpolateColors(a, [0, 1], ["#8fd8ff", "#fff1c2"])
    : interpolateColors(a, [0, 1], ["#4a4440", "#fff6d2"]);
  const sockel = fill(glow, C.steel);
  const warm = rot ? "255,123,110" : "255,200,90";
  return (
    <svg width={size} height={size * BIRNE_H} viewBox="0 0 300 440" style={{ overflow: "visible", ...gl(glow), ...style }}>
      <defs>
        <radialGradient id={`${id}-halo`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={`rgba(${warm},${0.75 * a})`} />
          <stop offset="45%" stopColor={`rgba(${warm},${0.28 * a})`} />
          <stop offset="100%" stopColor={`rgba(${warm},0)`} />
        </radialGradient>
      </defs>
      {halo && a > 0.01 && <circle cx={150} cy={150} r={250} fill={`url(#${id}-halo)`} />}
      {/* Glas */}
      <path d={GLAS} fill={glas} stroke={ink(glow)} strokeWidth={8} strokeLinejoin="round" />
      {/* Glanzlicht */}
      <path d="M66 128 Q72 82 112 60" fill="none" stroke={glow ? C.glow : "#ffffff"} strokeWidth={10} strokeLinecap="round" opacity={glow ? 0.55 : 0.85} />
      {/* Fuß + Haltedrähte */}
      <path d="M126 300 L136 226 L164 226 L174 300" fill={glow ? "rgba(143,216,255,0.12)" : "rgba(255,255,255,0.5)"} stroke={ink(glow)} strokeWidth={5} strokeLinejoin="round" />
      <path d="M140 228 L112 160 M160 228 L188 160" stroke={ink(glow)} strokeWidth={5} strokeLinecap="round" />
      {/* Glühwendel */}
      <path d={WENDEL} fill="none" stroke={draht} strokeWidth={a > 0.3 ? 8 : 6} strokeLinecap="round" strokeLinejoin="round"
        style={a > 0.01 ? { filter: `drop-shadow(0 0 ${6 + 10 * a}px rgba(255,190,70,${0.9 * a}))` } : undefined} />
      {/* Sockel */}
      <rect x={100} y={296} width={100} height={22} rx={6} fill={sockel} stroke={ink(glow)} strokeWidth={7} />
      <rect x={106} y={318} width={88} height={74} rx={8} fill={sockel} stroke={ink(glow)} strokeWidth={7} />
      <path d="M106 340 L194 328 M106 362 L194 350 M106 384 L194 372" stroke={ink(glow)} strokeWidth={5} />
      <path d="M116 392 L184 392 L172 414 L128 414 Z" fill={ink(glow)} />
      <rect x={138} y={410} width={24} height={16} rx={6} fill={sockel} stroke={ink(glow)} strokeWidth={5} />
    </svg>
  );
};

// ---------------------------------------------------------------------------
// Handschlag: zwei Unterarme (Anzugärmel) kommen von links/rechts, p = 1 → Hände greifen ineinander.
// Breite = size, Höhe = size * 0.22. Ärmel reichen weit über den Rand hinaus (overflow sichtbar).
// ---------------------------------------------------------------------------
export const Handschlag: React.FC<P & { p?: number; weg?: number }> = ({ size = 1000, glow, style, p = 1, weg = 700 }) => {
  const dx = (1 - p) * weg;
  const haut = fill(glow, "#e7c4a3");
  return (
    <svg width={size} height={size * 0.22} viewBox="0 0 1000 220" style={{ overflow: "visible", ...gl(glow), ...style }}>
      {/* linker Arm */}
      <g transform={`translate(${-dx} 0)`}>
        <rect x={-500} y={62} width={880} height={104} rx={14} fill={fill(glow, "#2f3a52")} stroke={ink(glow)} strokeWidth={8} />
        <rect x={360} y={58} width={42} height={112} rx={8} fill={fill(glow, "#f6f3ec")} stroke={ink(glow)} strokeWidth={7} />
        <rect x={396} y={70} width={126} height={92} rx={40} fill={haut} stroke={ink(glow)} strokeWidth={8} />
        <path d="M418 80 Q452 30 512 50 Q530 58 516 76" fill={haut} stroke={ink(glow)} strokeWidth={8} strokeLinejoin="round" strokeLinecap="round" />
      </g>
      {/* rechter Arm (liegt oben, Finger umschließen) */}
      <g transform={`translate(${dx} 0)`}>
        <rect x={620} y={56} width={880} height={104} rx={14} fill={fill(glow, "#5b5048")} stroke={ink(glow)} strokeWidth={8} />
        <rect x={598} y={52} width={42} height={112} rx={8} fill={fill(glow, "#f6f3ec")} stroke={ink(glow)} strokeWidth={7} />
        <rect x={470} y={64} width={134} height={96} rx={40} fill={haut} stroke={ink(glow)} strokeWidth={8} />
        <path d="M500 76 L496 150 M526 72 L522 154 M552 72 L550 154" stroke={glow ? C.glow : "#b98f6e"} strokeWidth={6} strokeLinecap="round" />
        <path d="M578 70 Q560 36 512 44" fill="none" stroke={ink(glow)} strokeWidth={8} strokeLinecap="round" />
      </g>
    </svg>
  );
};

// ---------------------------------------------------------------------------
// Namensschild (Tischaufsteller). Breite = size, Höhe = size * 0.55.
// ---------------------------------------------------------------------------
export const Namensschild: React.FC<P & { name: string; sub?: string; subO?: number; nameSize?: number }> = ({ size = 260, glow, style, name, sub, subO = 1, nameSize = 46 }) => (
  <svg width={size} height={size * 0.55} viewBox="0 0 260 143" style={{ overflow: "visible", ...gl(glow), ...style }}>
    <path d="M10 136 L34 8 L226 8 L250 136 Z" fill={fill(glow, C.paper2)} stroke={ink(glow)} strokeWidth={7} strokeLinejoin="round" style={glow ? undefined : { filter: `drop-shadow(6px 6px 0 ${C.ink})` }} />
    <line x1={30} y1={28} x2={230} y2={28} stroke={glow ? C.glow : C.line} strokeWidth={4} />
    <text x={130} y={sub ? 84 : 96} textAnchor="middle" fontFamily={HEAD} fontWeight={900} fontSize={nameSize} letterSpacing={2} fill={glow ? "#eaf7ff" : C.ink}>{name}</text>
    {sub && (
      <text x={130} y={120} textAnchor="middle" fontFamily={MONO} fontWeight={700} fontSize={22} letterSpacing={4} fill={glow ? C.glow : C.muted} opacity={subO}>{sub}</text>
    )}
  </svg>
);

// ---------------------------------------------------------------------------
// Werk (Fabrik mit Sheddach + Schornstein). Breite = size, Höhe = size * 0.8.
// ---------------------------------------------------------------------------
export const Werk: React.FC<P> = ({ size = 240, glow, style }) => (
  <svg width={size} height={size * 0.8} viewBox="0 0 240 192" style={{ overflow: "visible", ...gl(glow), ...style }}>
    <rect x={176} y={18} width={30} height={90} rx={4} fill={fill(glow, "#8a837b")} stroke={ink(glow)} strokeWidth={6} />
    <path d="M12 184 L12 92 L62 62 L62 92 L112 62 L112 92 L162 62 L162 92 L228 92 L228 184 Z" fill={fill(glow, "#c9a27a")} stroke={ink(glow)} strokeWidth={7} strokeLinejoin="round" />
    {[0, 1, 2].map((i) => (
      <rect key={i} x={30 + i * 62} y={112} width={36} height={30} rx={4} fill={fill(glow, C.yellow)} stroke={ink(glow)} strokeWidth={5} />
    ))}
    <rect x={186} y={130} width={30} height={54} rx={3} fill={fill(glow, "#5b5048")} stroke={ink(glow)} strokeWidth={5} />
  </svg>
);

// ---------------------------------------------------------------------------
// Stoppuhr. winkel = Zeigerstellung in Grad. Breite = size, Höhe = size * 1.1.
// ---------------------------------------------------------------------------
export const Stoppuhr: React.FC<P & { winkel?: number }> = ({ size = 200, glow, style, winkel = 0 }) => {
  const [hx, hy] = pol(100, 120, 62, winkel);
  return (
    <svg width={size} height={size * 1.1} viewBox="0 0 200 220" style={{ overflow: "visible", ...gl(glow), ...style }}>
      <rect x={86} y={14} width={28} height={24} rx={5} fill={fill(glow, C.steel)} stroke={ink(glow)} strokeWidth={6} />
      <path d="M150 52 L166 36" stroke={ink(glow)} strokeWidth={10} strokeLinecap="round" />
      <circle cx={100} cy={120} r={82} fill={fill(glow, "#ffffff")} stroke={ink(glow)} strokeWidth={8} />
      {Array.from({ length: 12 }, (_, i) => {
        const [x1, y1] = pol(100, 120, 70, i * 30);
        const [x2, y2] = pol(100, 120, i % 3 ? 62 : 56, i * 30);
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={ink(glow)} strokeWidth={i % 3 ? 4 : 6} strokeLinecap="round" />;
      })}
      <line x1={100} y1={120} x2={hx} y2={hy} stroke={glow ? "#ffb82e" : C.red} strokeWidth={7} strokeLinecap="round" />
      <circle cx={100} cy={120} r={9} fill={ink(glow)} />
    </svg>
  );
};

// ---------------------------------------------------------------------------
// Strafzettel ohne Betrag. Breite = size, Höhe = size * 1.1.
// ---------------------------------------------------------------------------
export const Strafzettel: React.FC<P> = ({ size = 300, glow, style }) => (
  <svg width={size} height={size * 1.1} viewBox="0 0 300 330" style={{ overflow: "visible", ...gl(glow), ...style }}>
    <path d="M14 10 L286 10 L286 300 L264 318 L242 300 L220 318 L198 300 L176 318 L154 300 L132 318 L110 300 L88 318 L66 300 L44 318 L22 300 L14 306 Z"
      fill={glow ? "rgba(255,123,110,0.14)" : "#fffaf0"} stroke={glow ? "#ffd2cc" : C.ink} strokeWidth={7} strokeLinejoin="round" />
    <rect x={14} y={10} width={272} height={78} fill={glow ? "rgba(255,123,110,0.75)" : C.red} stroke={glow ? "#ffd2cc" : C.ink} strokeWidth={7} />
    <text x={150} y={66} textAnchor="middle" fontFamily={HEAD} fontWeight={900} fontSize={52} letterSpacing={4} fill="#ffffff">STRAFE</text>
    <text x={40} y={136} fontFamily={MONO} fontWeight={700} fontSize={22} letterSpacing={3} fill={glow ? "#ffd2cc" : C.muted}>GRUND:</text>
    <text x={40} y={174} fontFamily={HEAD} fontWeight={900} fontSize={34} fill={glow ? "#ffe9e5" : C.ink}>Abweichung</text>
    {[214, 248].map((y) => (
      <line key={y} x1={40} y1={y} x2={260} y2={y} stroke={glow ? "rgba(255,210,204,0.6)" : C.line} strokeWidth={5} strokeLinecap="round" />
    ))}
  </svg>
);

// ---------------------------------------------------------------------------
// Mülleimer. Breite = size, Höhe = size * 1.15.
// ---------------------------------------------------------------------------
export const Muelleimer: React.FC<P & { deckel?: number }> = ({ size = 200, glow, style, deckel = 0 }) => (
  <svg width={size} height={size * 1.15} viewBox="0 0 200 230" style={{ overflow: "visible", ...gl(glow), ...style }}>
    <path d="M36 66 L164 66 L150 222 L50 222 Z" fill={fill(glow, "#7d8a96")} stroke={ink(glow)} strokeWidth={8} strokeLinejoin="round" />
    <path d="M78 92 L82 198 M100 92 L100 198 M122 92 L118 198" stroke={ink(glow)} strokeWidth={6} strokeLinecap="round" />
    <g transform={`rotate(${-deckel * 35} 26 60)`}>
      <rect x={22} y={44} width={156} height={20} rx={8} fill={fill(glow, "#9aa6b1")} stroke={ink(glow)} strokeWidth={7} />
      <rect x={80} y={28} width={40} height={18} rx={6} fill="none" stroke={ink(glow)} strokeWidth={7} />
    </g>
  </svg>
);

// ---------------------------------------------------------------------------
// Einkaufstüte mit Beschriftung. Breite = size, Höhe = size * 1.1.
// ---------------------------------------------------------------------------
export const Tuete: React.FC<P & { text?: string; farbe?: string }> = ({ size = 200, glow, style, text, farbe = C.yellow }) => (
  <svg width={size} height={size * 1.1} viewBox="0 0 200 220" style={{ overflow: "visible", ...gl(glow), ...style }}>
    <path d="M66 70 Q66 24 100 24 Q134 24 134 70" fill="none" stroke={ink(glow)} strokeWidth={9} strokeLinecap="round" />
    <path d="M26 64 L174 64 L184 212 L16 212 Z" fill={fill(glow, farbe)} stroke={ink(glow)} strokeWidth={8} strokeLinejoin="round" />
    {text && (
      <text x={100} y={162} textAnchor="middle" fontFamily={HEAD} fontWeight={900} fontSize={74} fill={glow ? "#eaf7ff" : C.ink}>{text}</text>
    )}
  </svg>
);

// ---------------------------------------------------------------------------
// Prinzip-Karten: Drucker mit Patrone + Schloss, verschraubter Akku, Handy ohne Updates. viewBox 160.
// ---------------------------------------------------------------------------
export const Drucker: React.FC<P & { schloss?: number }> = ({ size = 160, glow, style, schloss = 1 }) => (
  <svg width={size} height={size} viewBox="0 0 160 160" style={{ overflow: "visible", ...gl(glow), ...style }}>
    <rect x={40} y={14} width={80} height={40} fill={fill(glow, "#ffffff")} stroke={ink(glow)} strokeWidth={6} />
    <rect x={10} y={46} width={140} height={70} rx={12} fill={fill(glow, C.steel)} stroke={ink(glow)} strokeWidth={7} />
    <rect x={30} y={100} width={100} height={42} fill={fill(glow, "#ffffff")} stroke={ink(glow)} strokeWidth={6} />
    <line x1={44} y1={116} x2={116} y2={116} stroke={C.line} strokeWidth={5} />
    {/* Patrone */}
    <rect x={22} y={60} width={34} height={36} rx={5} fill={fill(glow, "#2f6fb5")} stroke={ink(glow)} strokeWidth={5} />
    {/* Schloss */}
    <g opacity={schloss} transform={`translate(${108} ${52 + (1 - schloss) * -16})`}>
      <path d="M10 22 L10 12 Q10 0 22 0 Q34 0 34 12 L34 22" fill="none" stroke={ink(glow)} strokeWidth={6} />
      <rect x={2} y={20} width={40} height={32} rx={6} fill={fill(glow, C.yellow)} stroke={ink(glow)} strokeWidth={6} />
      <circle cx={22} cy={35} r={5} fill={ink(glow)} />
    </g>
  </svg>
);

export const Akku: React.FC<P & { dreh?: number }> = ({ size = 160, glow, style, dreh = 0 }) => (
  <svg width={size} height={size} viewBox="0 0 160 160" style={{ overflow: "visible", ...gl(glow), ...style }}>
    <rect x={14} y={30} width={132} height={100} rx={14} fill={fill(glow, "#3d7a4f")} stroke={ink(glow)} strokeWidth={7} />
    <path d="M86 48 L60 84 L80 84 L72 114 L100 74 L80 74 Z" fill={fill(glow, C.yellow)} stroke={ink(glow)} strokeWidth={5} strokeLinejoin="round" />
    {[[30, 46], [130, 46], [30, 114], [130, 114]].map(([x, y], i) => (
      <g key={i} transform={`rotate(${dreh * 180 + i * 20} ${x} ${y})`}>
        <circle cx={x} cy={y} r={10} fill={fill(glow, C.steel)} stroke={ink(glow)} strokeWidth={4} />
        <path d={`M${x - 6} ${y} L${x + 6} ${y} M${x} ${y - 6} L${x} ${y + 6}`} stroke={ink(glow)} strokeWidth={3} />
      </g>
    ))}
  </svg>
);

export const Handy: React.FC<P & { kreuz?: number }> = ({ size = 160, glow, style, kreuz = 0 }) => (
  <svg width={size} height={size} viewBox="0 0 160 160" style={{ overflow: "visible", ...gl(glow), ...style }}>
    <rect x={42} y={6} width={76} height={148} rx={14} fill={fill(glow, "#2e2c2b")} stroke={ink(glow)} strokeWidth={7} />
    <rect x={50} y={22} width={60} height={112} rx={6} fill={fill(glow, C.sky)} />
    {/* Update-Pfeil im Kreis */}
    <path d="M66 78 A16 16 0 1 1 80 94" fill="none" stroke={ink(glow)} strokeWidth={5} strokeLinecap="round" />
    <path d="M60 70 L66 80 L76 74" fill="none" stroke={ink(glow)} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
    <g opacity={kreuz}>
      <path d="M58 52 L102 104 M102 52 L58 104" stroke={C.red} strokeWidth={9} strokeLinecap="round" />
    </g>
  </svg>
);
