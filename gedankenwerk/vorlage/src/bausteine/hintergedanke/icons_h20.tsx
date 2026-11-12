// Illustrationen Folge 20 (10.000 Schritte). Gleicher Stil wie icons.tsx; glow = Röntgen-Fassung.
// Keine Logos: Schrittzähler ist ein generisches Retro-Gerät (rundes Gehäuse, Gürtelclip, Rollen-Zählwerk), Packungen ohne Marke.
import React from "react";
import { C, HEAD, MONO } from "../../basis/lib";

type P = { size?: number; glow?: boolean; style?: React.CSSProperties };
const ink = (g?: boolean) => (g ? C.glow : C.ink);
const fill = (g: boolean | undefined, f: string) => (g ? "rgba(143,216,255,0.2)" : f);
const gl = (g?: boolean): React.CSSProperties => (g ? { filter: "drop-shadow(0 0 14px rgba(143,216,255,0.45)) drop-shadow(0 0 3px rgba(143,216,255,0.8))" } : {});
export const KANJI = '"Hiragino Sans", "Hiragino Kaku Gothic ProN", "Noto Sans JP", "Yu Gothic", sans-serif';
const HELL = "#eaf7ff";
const AMBER = "#ffb82e";

/** Zahnrad als Pfad (n Zähne). */
const zahnrad = (cx: number, cy: number, r: number, n: number) => {
  const pts: string[] = [];
  for (let i = 0; i < n * 4; i++) {
    const a = (i / (n * 4)) * Math.PI * 2;
    const rr = i % 4 < 2 ? r : r * 0.8;
    pts.push(`${(cx + rr * Math.cos(a)).toFixed(1)},${(cy + rr * Math.sin(a)).toFixed(1)}`);
  }
  return `M${pts.join(" L")} Z`;
};

// ---------------------------------------------------------------------------
// Schrittzähler (Retro): rotes Gehäuse, Chromring, cremefarbenes Zifferblatt, 5-stelliges Rollen-Zählwerk.
// Seitenverhältnis 400 × 460 → Höhe = 1,15 × size. Fenster-Mitte im viewBox: (200, 250).
// wert = angezeigte Zahl (Rollen drehen wie ein echtes Zählwerk), ziffernO = Deckkraft der Ziffern,
// fenster = gelber Rahmen ums Fenster (0..1), aufdruck = Text unter dem Fenster, gang = Drehwinkel der Zahnräder (nur glow).
// ---------------------------------------------------------------------------
export const SZ_H = 1.15;
const DRUM_X = [84, 128, 184, 228, 272];
export const Schrittzaehler: React.FC<
  P & { wert?: number; ziffernO?: number; fenster?: number; aufdruck?: string; aufdruckO?: number; gang?: number; farbe?: string }
> = ({ size = 400, glow, style, wert = 0, ziffernO = 1, fenster = 0, aufdruck, aufdruckO = 1, gang = 0, farbe = "#cf4136" }) => {
  const v = Math.max(0, Math.min(99999, wert));
  const ziffern = [4, 3, 2, 1, 0].map((p) => {
    const pot = Math.pow(10, p);
    const d = Math.floor(v / pot) % 10;
    const off = p === 0 ? v - Math.floor(v) : Math.max(0, Math.min(1, (v % pot) - (pot - 1)));
    return { d, off };
  });
  const zf = glow ? HELL : "#ffffff";
  return (
    <svg width={size} height={size * SZ_H} viewBox="0 0 400 460" style={{ overflow: "visible", ...gl(glow), ...style }}>
      <defs>
        <clipPath id="h20-fenster">
          <rect x={80} y={212} width={240} height={76} rx={6} />
        </clipPath>
        <linearGradient id="h20-walze" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#000" stopOpacity={0.55} />
          <stop offset="0.3" stopColor="#000" stopOpacity={0} />
          <stop offset="0.7" stopColor="#000" stopOpacity={0} />
          <stop offset="1" stopColor="#000" stopOpacity={0.55} />
        </linearGradient>
      </defs>
      {/* Gürtelclip hinten (schaut oben heraus) */}
      <rect x={146} y={0} width={108} height={96} rx={20} fill={fill(glow, C.steel)} stroke={ink(glow)} strokeWidth={7} />
      <rect x={168} y={16} width={64} height={12} rx={6} fill={glow ? "rgba(143,216,255,0.35)" : "#ffffff"} opacity={0.8} />
      {/* Rückstell-Knopf oben rechts */}
      <rect x={300} y={52} width={46} height={32} rx={9} transform="rotate(38 323 68)" fill={fill(glow, "#3b4049")} stroke={ink(glow)} strokeWidth={7} />
      {/* Gehäuse */}
      <rect x={24} y={56} width={352} height={396} rx={150} fill={glow ? "rgba(143,216,255,0.12)" : farbe} stroke={ink(glow)} strokeWidth={8} />
      {!glow && <path d="M78 150 Q 96 96 160 76" fill="none" stroke="#ffffff" strokeWidth={12} strokeLinecap="round" opacity={0.35} />}
      {/* Chromring + Zifferblatt */}
      <circle cx={200} cy={254} r={164} fill={fill(glow, C.steel)} stroke={ink(glow)} strokeWidth={7} />
      <circle cx={200} cy={254} r={146} fill={glow ? "rgba(143,216,255,0.06)" : "#f7f1df"} stroke={ink(glow)} strokeWidth={5} />
      {/* Skala */}
      {Array.from({ length: 60 }, (_, i) => {
        const a = (i / 60) * Math.PI * 2;
        const lang = i % 5 === 0;
        const r1 = lang ? 122 : 130;
        return (
          <line key={i} x1={200 + r1 * Math.sin(a)} y1={254 - r1 * Math.cos(a)} x2={200 + 138 * Math.sin(a)} y2={254 - 138 * Math.cos(a)}
            stroke={glow ? "rgba(143,216,255,0.6)" : C.ink} strokeWidth={lang ? 5 : 3} strokeLinecap="round" />
        );
      })}
      {/* Röntgen: Mechanik sichtbar */}
      {glow && (
        <g opacity={0.9}>
          <path d={zahnrad(160, 150, 34, 10)} transform={`rotate(${gang} 160 150)`} fill="rgba(143,216,255,0.18)" stroke={C.glow} strokeWidth={4} strokeLinejoin="round" />
          <circle cx={160} cy={150} r={8} fill={C.glow} />
          <path d={zahnrad(232, 140, 24, 8)} transform={`rotate(${-gang * 1.4} 232 140)`} fill="rgba(143,216,255,0.18)" stroke={C.glow} strokeWidth={4} strokeLinejoin="round" />
          <circle cx={232} cy={140} r={6} fill={C.glow} />
          <path d="M160 184 L160 212 M232 164 L232 212" stroke="rgba(143,216,255,0.6)" strokeWidth={4} strokeDasharray="6 6" />
        </g>
      )}
      {/* Zählwerk-Fenster */}
      <rect x={74} y={206} width={252} height={88} rx={12} fill={glow ? "rgba(10,14,28,0.75)" : C.ink} stroke={ink(glow)} strokeWidth={6} />
      <g clipPath="url(#h20-fenster)" opacity={ziffernO}>
        {ziffern.map(({ d, off }, i) => {
          const x = DRUM_X[i];
          return (
            <g key={i}>
              <rect x={x} y={212} width={44} height={76} rx={4} fill={glow ? "rgba(143,216,255,0.12)" : "#3a3633"} />
              <text x={x + 22} y={272 - off * 76} textAnchor="middle" fontFamily={MONO} fontWeight={700} fontSize={58} fill={zf}>{d}</text>
              <text x={x + 22} y={272 + 76 - off * 76} textAnchor="middle" fontFamily={MONO} fontWeight={700} fontSize={58} fill={zf}>{(d + 1) % 10}</text>
              <rect x={x} y={212} width={44} height={76} fill="url(#h20-walze)" opacity={glow ? 0.5 : 1} />
            </g>
          );
        })}
        <circle cx={178} cy={276} r={5} fill={zf} />
      </g>
      {fenster > 0 && (
        <rect x={62} y={194} width={276} height={112} rx={18} fill="none" stroke={C.yellow} strokeWidth={10} opacity={fenster} />
      )}
      {aufdruck && (
        <text x={200} y={352} textAnchor="middle" fontFamily={KANJI} fontWeight={700} fontSize={44} fill={glow ? C.glow : C.ink} opacity={aufdruckO} letterSpacing={6}>
          {aufdruck}
        </text>
      )}
    </svg>
  );
};

// ---------------------------------------------------------------------------
// Schuhabdruck (Spitze nach oben; 80 × 180).
// ---------------------------------------------------------------------------
export const Abdruck: React.FC<P & { farbe?: string }> = ({ size = 120, glow, style, farbe = C.ink }) => (
  <svg width={size * 0.45} height={size} viewBox="0 0 80 180" style={{ overflow: "visible", ...gl(glow), ...style }}>
    <path d="M40 4 C 68 4, 78 40, 74 74 C 71 98, 60 110, 42 110 C 22 110, 9 98, 7 74 C 3 40, 13 4, 40 4 Z" fill={glow ? "rgba(143,216,255,0.5)" : farbe} />
    <ellipse cx={40} cy={150} rx={26} ry={27} fill={glow ? "rgba(143,216,255,0.5)" : farbe} />
    {[30, 50, 70, 90].map((y) => (
      <line key={y} x1={18} y1={y} x2={62} y2={y} stroke={C.paper} strokeWidth={5} strokeLinecap="round" opacity={0.55} />
    ))}
    <line x1={22} y1={148} x2={58} y2={148} stroke={C.paper} strokeWidth={5} strokeLinecap="round" opacity={0.55} />
  </svg>
);

// ---------------------------------------------------------------------------
// Stethoskop (200 × 210).
// ---------------------------------------------------------------------------
export const Stethoskop: React.FC<P> = ({ size = 200, glow, style }) => (
  <svg width={size} height={size * 1.05} viewBox="0 0 200 210" style={{ overflow: "visible", ...gl(glow), ...style }}>
    <path d="M56 26 L56 76 C 56 128, 140 128, 140 76 L140 26" fill="none" stroke={ink(glow)} strokeWidth={11} strokeLinecap="round" />
    <path d="M98 117 L98 140 C 98 186, 160 190, 160 150" fill="none" stroke={glow ? C.glow : "#3b4049"} strokeWidth={14} strokeLinecap="round" />
    <circle cx={56} cy={20} r={11} fill={fill(glow, C.steel)} stroke={ink(glow)} strokeWidth={6} />
    <circle cx={140} cy={20} r={11} fill={fill(glow, C.steel)} stroke={ink(glow)} strokeWidth={6} />
    <circle cx={160} cy={132} r={30} fill={fill(glow, C.steel)} stroke={ink(glow)} strokeWidth={8} />
    <circle cx={160} cy={132} r={14} fill={fill(glow, "#ffffff")} stroke={ink(glow)} strokeWidth={5} />
  </svg>
);

// ---------------------------------------------------------------------------
// Fähnchen Japan (150 × 100): nur Grundformen.
// ---------------------------------------------------------------------------
export const FahneJapan: React.FC<P> = ({ size = 120, style }) => (
  <svg width={size} height={size * 0.67} viewBox="0 0 150 100" style={{ overflow: "visible", ...style }}>
    <rect x={4} y={4} width={142} height={92} rx={8} fill="#ffffff" stroke={C.ink} strokeWidth={6} />
    <circle cx={75} cy={50} r={27} fill={C.red} />
  </svg>
);

// ---------------------------------------------------------------------------
// Ältere Frau (100 × 150): grauer Dutt, Brille. zaehler = Schrittzähler an der Hüfte (0..1).
// ---------------------------------------------------------------------------
export const Frau: React.FC<P & { farbe?: string; zaehler?: number }> = ({ size = 100, glow, style, farbe = "#7c6fb0", zaehler = 0 }) => (
  <svg width={size} height={size * 1.5} viewBox="0 0 100 150" style={{ overflow: "visible", ...gl(glow), ...style }}>
    {/* Körper */}
    <path d="M18 146 L24 92 Q 28 74 50 72 Q 72 74 76 92 L82 146 Z" fill={glow ? "rgba(143,216,255,0.42)" : farbe} stroke={ink(glow)} strokeWidth={5} strokeLinejoin="round" />
    {/* Kopf + Haare */}
    <circle cx={50} cy={14} r={11} fill={glow ? "rgba(220,235,255,0.55)" : "#d9d6d2"} stroke={ink(glow)} strokeWidth={4} />
    <circle cx={50} cy={42} r={22} fill={glow ? "rgba(143,216,255,0.16)" : "#efc9a6"} stroke={ink(glow)} strokeWidth={5} />
    <path d="M28 40 Q 30 18 50 18 Q 70 18 72 40 Q 62 28 50 30 Q 38 28 28 40 Z" fill={glow ? "rgba(220,235,255,0.55)" : "#d9d6d2"} stroke={ink(glow)} strokeWidth={4} strokeLinejoin="round" />
    {/* Brille */}
    <circle cx={41} cy={45} r={7} fill="none" stroke={ink(glow)} strokeWidth={3} />
    <circle cx={59} cy={45} r={7} fill="none" stroke={ink(glow)} strokeWidth={3} />
    <line x1={48} y1={45} x2={52} y2={45} stroke={ink(glow)} strokeWidth={3} />
    {/* Schrittzähler an der Hüfte */}
    {zaehler > 0 && (
      <g opacity={Math.min(1, zaehler)} transform={`translate(72 106) scale(${(0.4 + 0.6 * Math.min(1.2, zaehler)) * 1.45}) translate(-72 -106)`}>
        <rect x={60} y={94} width={22} height={22} rx={8} fill={glow ? AMBER : C.red} stroke={glow ? "#fff1cc" : C.ink} strokeWidth={3} />
        <rect x={64} y={101} width={14} height={7} rx={2} fill={glow ? "#1a2138" : "#ffffff"} />
      </g>
    )}
  </svg>
);

// ---------------------------------------------------------------------------
// Generische Packungen (keine Marken): Sprühflasche, Deo, Cremetiegel.
// ---------------------------------------------------------------------------
export const Spruehflasche: React.FC<P> = ({ size = 160, glow, style }) => (
  <svg width={size * 0.7} height={size} viewBox="0 0 140 200" style={{ overflow: "visible", ...gl(glow), ...style }}>
    <path d="M40 8 L104 8 L118 26 L96 30 L92 52 L52 52 Z" fill={fill(glow, "#3b4049")} stroke={ink(glow)} strokeWidth={6} strokeLinejoin="round" />
    <path d="M58 52 L60 70 L50 74 L52 52" fill={fill(glow, "#3b4049")} stroke={ink(glow)} strokeWidth={5} strokeLinejoin="round" />
    <path d="M60 52 L86 52 L88 70 Q 120 84 118 120 L118 186 Q 118 196 108 196 L36 196 Q 26 196 26 186 L26 120 Q 26 84 58 70 Z" fill={fill(glow, "#9fd6e8")} stroke={ink(glow)} strokeWidth={7} strokeLinejoin="round" />
    <rect x={38} y={120} width={68} height={52} rx={8} fill={fill(glow, "#ffffff")} stroke={ink(glow)} strokeWidth={5} />
    <rect x={48} y={134} width={48} height={8} rx={4} fill={ink(glow)} opacity={0.6} />
    <rect x={48} y={150} width={32} height={8} rx={4} fill={ink(glow)} opacity={0.35} />
  </svg>
);
export const Deo: React.FC<P> = ({ size = 160, glow, style }) => (
  <svg width={size * 0.5} height={size} viewBox="0 0 100 200" style={{ overflow: "visible", ...gl(glow), ...style }}>
    <rect x={22} y={6} width={56} height={50} rx={12} fill={fill(glow, "#f2f0ea")} stroke={ink(glow)} strokeWidth={6} />
    <rect x={14} y={52} width={72} height={142} rx={16} fill={fill(glow, "#86b6e0")} stroke={ink(glow)} strokeWidth={7} />
    <path d="M14 104 Q 50 88 86 104" fill="none" stroke={glow ? C.glow : "#ffffff"} strokeWidth={6} opacity={0.8} />
    <path d="M14 122 Q 50 106 86 122" fill="none" stroke={glow ? C.glow : "#ffffff"} strokeWidth={6} opacity={0.5} />
  </svg>
);
export const Tiegel: React.FC<P> = ({ size = 180, glow, style }) => (
  <svg width={size} height={size * 0.72} viewBox="0 0 180 130" style={{ overflow: "visible", ...gl(glow), ...style }}>
    <rect x={20} y={10} width={140} height={34} rx={10} fill={fill(glow, "#d9b46a")} stroke={ink(glow)} strokeWidth={7} />
    <path d="M24 44 L156 44 L150 112 Q 148 124 136 124 L44 124 Q 32 124 30 112 Z" fill={fill(glow, "#f6e3e6")} stroke={ink(glow)} strokeWidth={7} strokeLinejoin="round" />
    <rect x={52} y={64} width={76} height={38} rx={8} fill={fill(glow, "#ffffff")} stroke={ink(glow)} strokeWidth={4} />
  </svg>
);

// ---------------------------------------------------------------------------
// Anhänger / Preisschild (260 × 150), Loch links bei (42, 75).
// ---------------------------------------------------------------------------
export const Anhaenger: React.FC<P & { oben: string; unten: string }> = ({ size = 280, style, oben, unten }) => (
  <svg width={size} height={size * 0.577} viewBox="0 0 260 150" style={{ overflow: "visible", ...style }}>
    <path d="M64 8 L244 8 Q 254 8 254 18 L254 132 Q 254 142 244 142 L64 142 L8 75 Z" fill={C.yellow} stroke={C.ink} strokeWidth={7} strokeLinejoin="round" style={{ filter: `drop-shadow(6px 6px 0 ${C.ink})` }} />
    <circle cx={42} cy={75} r={11} fill={C.paper} stroke={C.ink} strokeWidth={5} />
    <text x={160} y={56} textAnchor="middle" fontFamily={MONO} fontWeight={700} fontSize={20} letterSpacing={2} fill={C.ink}>{oben}</text>
    <text x={160} y={114} textAnchor="middle" fontFamily={HEAD} fontWeight={900} fontSize={52} letterSpacing={-1} fill={C.ink}>{unten}</text>
  </svg>
);

// ---------------------------------------------------------------------------
// Nachbesserung 20.10.2026 (Hook „das hat dir mal ein Arzt gesagt“, Grenzen der Studie, Marketing-Zitat)
// ---------------------------------------------------------------------------
/** Arzt (200 × 300): weißer Kittel, Stethoskop um den Hals, Arm hebt sich mit `arm` (0..1) zum Zeigefinger. */
export const Arzt: React.FC<P & { arm?: number }> = ({ size = 200, glow, style, arm = 0 }) => {
  const a = (-70 + 120 * arm) * (Math.PI / 180);
  const sx = 150, sy = 140;
  const hx = sx + Math.cos(a) * 70, hy = sy - Math.sin(a) * 70;
  return (
    <svg width={size} height={size * 1.5} viewBox="0 0 200 300" style={{ overflow: "visible", ...gl(glow), ...style }}>
      {/* Beine */}
      <rect x={64} y={228} width={30} height={66} rx={10} fill={fill(glow, "#3b4049")} stroke={ink(glow)} strokeWidth={6} />
      <rect x={106} y={228} width={30} height={66} rx={10} fill={fill(glow, "#3b4049")} stroke={ink(glow)} strokeWidth={6} />
      {/* Kittel */}
      <path d="M40 250 L50 140 Q 56 112 100 110 Q 144 112 150 140 L160 250 Z" fill={fill(glow, "#ffffff")} stroke={ink(glow)} strokeWidth={7} strokeLinejoin="round" />
      <path d="M100 116 L100 250" stroke={ink(glow)} strokeWidth={4} opacity={0.5} />
      <path d="M78 114 L100 150 L122 114" fill="none" stroke={ink(glow)} strokeWidth={5} strokeLinejoin="round" />
      {/* Stethoskop um den Hals */}
      <path d="M76 120 Q 70 176 96 182 Q 122 176 124 120" fill="none" stroke={glow ? C.glow : "#3b4049"} strokeWidth={7} strokeLinecap="round" />
      <circle cx={96} cy={186} r={11} fill={fill(glow, C.steel)} stroke={ink(glow)} strokeWidth={5} />
      {/* Kreuz auf der Brusttasche */}
      <rect x={118} y={172} width={24} height={20} rx={3} fill={fill(glow, "#ffffff")} stroke={ink(glow)} strokeWidth={4} />
      <path d="M130 175 L130 189 M123 182 L137 182" stroke={glow ? C.glow : C.red} strokeWidth={5} strokeLinecap="round" />
      {/* Arme */}
      <path d="M52 146 L36 222" stroke={ink(glow)} strokeWidth={22} strokeLinecap="round" />
      <path d="M52 146 L36 222" stroke={fill(glow, "#ffffff")} strokeWidth={12} strokeLinecap="round" />
      <path d={`M${sx} ${sy} L${hx.toFixed(1)} ${hy.toFixed(1)}`} stroke={ink(glow)} strokeWidth={22} strokeLinecap="round" />
      <path d={`M${sx} ${sy} L${hx.toFixed(1)} ${hy.toFixed(1)}`} stroke={fill(glow, "#ffffff")} strokeWidth={12} strokeLinecap="round" />
      <circle cx={hx} cy={hy} r={10} fill={fill(glow, "#efc9a6")} stroke={ink(glow)} strokeWidth={4} />
      {/* Kopf */}
      <circle cx={100} cy={70} r={40} fill={fill(glow, "#efc9a6")} stroke={ink(glow)} strokeWidth={7} />
      <path d="M62 62 Q 66 26 100 28 Q 134 26 138 62 Q 122 46 100 48 Q 78 46 62 62 Z" fill={fill(glow, "#5a4636")} stroke={ink(glow)} strokeWidth={5} strokeLinejoin="round" />
      <circle cx={86} cy={74} r={5} fill={ink(glow)} />
      <circle cx={114} cy={74} r={5} fill={ink(glow)} />
      <path d="M88 92 Q 100 100 112 92" fill="none" stroke={ink(glow)} strokeWidth={5} strokeLinecap="round" />
    </svg>
  );
};

/** Hantel (200 × 100). */
export const Hantel: React.FC<P> = ({ size = 200, glow, style }) => (
  <svg width={size} height={size * 0.5} viewBox="0 0 200 100" style={{ overflow: "visible", ...gl(glow), ...style }}>
    <rect x={40} y={42} width={120} height={16} rx={6} fill={fill(glow, C.steel)} stroke={ink(glow)} strokeWidth={5} />
    <rect x={14} y={14} width={30} height={72} rx={8} fill={fill(glow, "#3b4049")} stroke={ink(glow)} strokeWidth={6} />
    <rect x={156} y={14} width={30} height={72} rx={8} fill={fill(glow, "#3b4049")} stroke={ink(glow)} strokeWidth={6} />
    <rect x={2} y={28} width={14} height={44} rx={5} fill={fill(glow, "#3b4049")} stroke={ink(glow)} strokeWidth={5} />
    <rect x={184} y={28} width={14} height={44} rx={5} fill={fill(glow, "#3b4049")} stroke={ink(glow)} strokeWidth={5} />
  </svg>
);

/** Herz (120 × 110). */
export const Herz: React.FC<P & { farbe?: string }> = ({ size = 120, glow, style, farbe = C.red }) => (
  <svg width={size} height={size * 0.92} viewBox="0 0 120 110" style={{ overflow: "visible", ...gl(glow), ...style }}>
    <path d="M60 104 C 20 74, 4 52, 6 32 C 8 12, 26 4, 40 6 C 50 8, 56 14, 60 22 C 64 14, 70 8, 80 6 C 94 4, 112 12, 114 32 C 116 52, 100 74, 60 104 Z" fill={glow ? "rgba(143,216,255,0.3)" : farbe} stroke={ink(glow)} strokeWidth={7} strokeLinejoin="round" />
  </svg>
);

/** Megafon (200 × 140) für „Werkzeug fürs Marketing“. */
export const Megafon: React.FC<P> = ({ size = 200, glow, style }) => (
  <svg width={size} height={size * 0.7} viewBox="0 0 200 140" style={{ overflow: "visible", ...gl(glow), ...style }}>
    <path d="M30 52 L120 14 L120 126 L30 88 Z" fill={glow ? "rgba(255,184,46,0.35)" : C.yellow} stroke={glow ? AMBER : C.ink} strokeWidth={7} strokeLinejoin="round" />
    <rect x={8} y={50} width={28} height={40} rx={6} fill={fill(glow, "#3b4049")} stroke={glow ? AMBER : C.ink} strokeWidth={6} />
    <path d="M50 92 L60 126 L82 122 L74 100" fill={fill(glow, "#3b4049")} stroke={glow ? AMBER : C.ink} strokeWidth={6} strokeLinejoin="round" />
    <path d="M140 46 Q 156 70 140 94 M160 30 Q 186 70 160 110" fill="none" stroke={glow ? AMBER : C.ink} strokeWidth={7} strokeLinecap="round" />
  </svg>
);
