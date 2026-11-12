// Illustrationen Folge 19 (Marke: Reifen → Sterne). Gleicher Stil wie icons.tsx; glow = Röntgen-Fassung.
// Keine Logos: kein Bibendum, kein Schriftzug. Der Stern ist eine eigene, abgerundete Form; das Heft trägt nur „GUIDE“.
import React from "react";
import { C, HEAD, MONO } from "../../basis/lib";

type P = { size?: number; glow?: boolean; style?: React.CSSProperties };
const ink = (g?: boolean) => (g ? C.glow : C.ink);
const fill = (g: boolean | undefined, f: string) => (g ? "rgba(143,216,255,0.2)" : f);
const gl = (g?: boolean): React.CSSProperties => (g ? { filter: "drop-shadow(0 0 14px rgba(143,216,255,0.45)) drop-shadow(0 0 3px rgba(143,216,255,0.8))" } : {});
const pol = (cx: number, cy: number, r: number, deg: number) => [cx + r * Math.sin((deg * Math.PI) / 180), cy - r * Math.cos((deg * Math.PI) / 180)] as const;

// ---------------------------------------------------------------------------
// Reifen von der Seite. rot = Drehung in Grad, abrieb 0..1 (Profilblöcke werden flacher).
// ---------------------------------------------------------------------------
export const Reifen: React.FC<P & { rot?: number; abrieb?: number }> = ({ size = 400, glow, style, rot = 0, abrieb = 0 }) => {
  const tief = 26 * (1 - 0.85 * abrieb);
  return (
    <svg width={size} height={size} viewBox="0 0 400 400" style={{ overflow: "visible", ...gl(glow), ...style }}>
      <circle cx={200} cy={200} r={168} fill={glow ? "rgba(143,216,255,0.16)" : "#2e2c2b"} stroke={ink(glow)} strokeWidth={8} />
      <g transform={`rotate(${rot} 200 200)`}>
        {Array.from({ length: 24 }, (_, i) => {
          const d = i * 15;
          return (
            <rect key={i} x={200 - 13} y={200 - 168 - tief + 4} width={26} height={tief} rx={4} transform={`rotate(${d} 200 200)`}
              fill={glow ? "rgba(143,216,255,0.35)" : "#2e2c2b"} stroke={ink(glow)} strokeWidth={6} />
          );
        })}
        {/* Flanke mit Rillen */}
        <circle cx={200} cy={200} r={140} fill="none" stroke={glow ? "rgba(143,216,255,0.5)" : "#4a4744"} strokeWidth={5} strokeDasharray="30 18" />
        {/* Felge */}
        <circle cx={200} cy={200} r={104} fill={fill(glow, C.steel)} stroke={ink(glow)} strokeWidth={8} />
        {Array.from({ length: 5 }, (_, i) => {
          const [x, y] = pol(200, 200, 92, i * 72);
          return <line key={i} x1={200} y1={200} x2={x} y2={y} stroke={ink(glow)} strokeWidth={14} strokeLinecap="round" />;
        })}
        <circle cx={200} cy={200} r={30} fill={fill(glow, "#e9ecef")} stroke={ink(glow)} strokeWidth={8} />
        <circle cx={200} cy={200} r={9} fill={ink(glow)} />
      </g>
    </svg>
  );
};

// ---------------------------------------------------------------------------
// Stern: abgerundeter Fünfzack (eigene Form, nicht das Marke-Zeichen).
// ---------------------------------------------------------------------------
const sternPfad = (() => {
  const pts: string[] = [];
  for (let i = 0; i < 10; i++) {
    const [x, y] = pol(100, 104, i % 2 ? 40 : 88, i * 36);
    pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
  }
  return `M${pts.join(" L")} Z`;
})();
export const Stern: React.FC<P & { farbe?: string; leer?: boolean }> = ({ size = 120, glow, style, farbe = C.red, leer }) => (
  <svg width={size} height={size} viewBox="0 0 200 200" style={{ overflow: "visible", ...gl(glow), ...style }}>
    <path d={sternPfad} fill={leer ? "none" : glow ? "rgba(255,123,110,0.88)" : farbe} stroke={leer ? (glow ? C.glow : C.muted) : glow ? "#ffd2cc" : C.ink}
      strokeWidth={leer ? 8 : 14} strokeLinejoin="round" strokeDasharray={leer ? "16 12" : undefined} />
  </svg>
);

// ---------------------------------------------------------------------------
// Heft (Reiseführer): rotes Cover, „GUIDE“ + Jahr. Breite = size, Höhe = size * 4/3.
// ---------------------------------------------------------------------------
export const Heft: React.FC<P & { jahr?: string; farbe?: string; titel?: string }> = ({ size = 300, glow, style, jahr = "1900", farbe = "#c8302a", titel = "GUIDE" }) => (
  <svg width={size} height={(size * 4) / 3} viewBox="0 0 300 400" style={{ overflow: "visible", ...gl(glow), ...style }}>
    <rect x={18} y={14} width={270} height={376} rx={14} fill={glow ? "rgba(143,216,255,0.1)" : "#f6f3ec"} stroke={ink(glow)} strokeWidth={7} />
    <rect x={8} y={8} width={270} height={376} rx={14} fill={glow ? "rgba(255,123,110,0.3)" : farbe} stroke={ink(glow)} strokeWidth={8} />
    <rect x={8} y={8} width={34} height={376} rx={10} fill={glow ? "rgba(255,123,110,0.45)" : "#9e231f"} stroke={ink(glow)} strokeWidth={6} />
    <rect x={70} y={70} width={180} height={4} fill={glow ? C.glow : "#f1c94a"} />
    <text x={160} y={150} textAnchor="middle" fontFamily={HEAD} fontWeight={900} fontSize={52} letterSpacing={4} fill={glow ? "#eaf7ff" : "#ffffff"}>{titel}</text>
    <rect x={70} y={176} width={180} height={4} fill={glow ? C.glow : "#f1c94a"} />
    <text x={160} y={330} textAnchor="middle" fontFamily={MONO} fontWeight={700} fontSize={40} letterSpacing={4} fill={glow ? C.glow : "#f1c94a"}>{jahr}</text>
  </svg>
);

// ---------------------------------------------------------------------------
// Auto um 1900 (Kutschenform, große Speichenräder). Breite = size, Höhe = size * 0.7.
// ---------------------------------------------------------------------------
export const AltAuto: React.FC<P & { rad?: number; farbe?: string }> = ({ size = 200, glow, style, rad = 0, farbe = "#2f5f8a" }) => {
  const R = ({ cx, r }: { cx: number; r: number }) => (
    <g transform={`rotate(${rad} ${cx} 112)`}>
      <circle cx={cx} cy={112} r={r} fill={glow ? "rgba(143,216,255,0.12)" : "#f6f3ec"} stroke={ink(glow)} strokeWidth={7} />
      {[0, 45, 90, 135].map((d) => {
        const [x1, y1] = pol(cx, 112, r - 4, d);
        const [x2, y2] = pol(cx, 112, r - 4, d + 180);
        return <line key={d} x1={x1} y1={y1} x2={x2} y2={y2} stroke={ink(glow)} strokeWidth={4} />;
      })}
      <circle cx={cx} cy={112} r={5} fill={ink(glow)} />
    </g>
  );
  return (
    <svg width={size} height={size * 0.7} viewBox="0 0 200 140" style={{ overflow: "visible", ...gl(glow), ...style }}>
      <path d="M30 96 L30 62 Q30 52 40 52 L120 52 L132 30 L150 30 L150 52 L172 52 Q180 52 180 62 L180 96 Z" fill={fill(glow, farbe)} stroke={ink(glow)} strokeWidth={7} strokeLinejoin="round" />
      <path d="M60 52 L60 26 Q60 16 72 16 L98 16" fill="none" stroke={ink(glow)} strokeWidth={7} strokeLinecap="round" />
      <path d="M150 30 L160 14" stroke={ink(glow)} strokeWidth={6} strokeLinecap="round" />
      <circle cx={162} cy={12} r={7} fill="none" stroke={ink(glow)} strokeWidth={5} />
      <R cx={52} r={28} />
      <R cx={156} r={24} />
    </svg>
  );
};

// ---------------------------------------------------------------------------
// Werkbank mit Schraubstock. stapel 0..1: Hefte unter dem kurzen Bein, kipp = Neigung in Grad (ohne Stütze).
// Breite = size, Höhe = size * 0.62.
// ---------------------------------------------------------------------------
export const Werkbank: React.FC<P & { stapel?: number; kipp?: number; heftGlow?: boolean }> = ({ size = 700, glow, style, stapel = 1, kipp = 0, heftGlow }) => (
  <svg width={size} height={size * 0.62} viewBox="0 0 700 434" style={{ overflow: "visible", ...gl(glow), ...style }}>
    <line x1={10} y1={420} x2={690} y2={420} stroke={ink(glow)} strokeWidth={8} strokeLinecap="round" />
    <g transform={`rotate(${kipp} 120 420)`}>
      {/* Platte */}
      <rect x={40} y={140} width={620} height={46} rx={8} fill={fill(glow, "#b98a5e")} stroke={ink(glow)} strokeWidth={8} />
      <line x1={60} y1={163} x2={640} y2={163} stroke={glow ? "rgba(143,216,255,0.4)" : "#9a6f48"} strokeWidth={4} />
      {/* Beine: links voll, rechts zu kurz */}
      <rect x={90} y={186} width={40} height={234} fill={fill(glow, "#a07650")} stroke={ink(glow)} strokeWidth={8} />
      <rect x={570} y={186} width={40} height={168} fill={fill(glow, "#a07650")} stroke={ink(glow)} strokeWidth={8} />
      <rect x={130} y={300} width={440} height={22} fill={fill(glow, "#a07650")} stroke={ink(glow)} strokeWidth={6} />
      {/* Schraubstock + Werkzeug */}
      <rect x={90} y={88} width={120} height={52} rx={6} fill={fill(glow, "#5b6672")} stroke={ink(glow)} strokeWidth={7} />
      <rect x={210} y={104} width={60} height={14} rx={6} fill={ink(glow)} />
      <path d="M380 128 L470 92" stroke={ink(glow)} strokeWidth={14} strokeLinecap="round" />
      <circle cx={482} cy={86} r={20} fill="none" stroke={ink(glow)} strokeWidth={10} />
      <rect x={530} y={110} width={90} height={30} rx={6} fill={fill(glow, C.red)} stroke={ink(glow)} strokeWidth={6} />
    </g>
    {/* Hefte-Stapel unter dem kurzen Bein */}
    {[0, 1, 2].map((i) => {
      const q = Math.max(0, Math.min(1, stapel * 3 - i));
      const hg = heftGlow || glow;
      return (
        <g key={i} opacity={q} transform={`translate(0 ${(1 - q) * -40})`}>
          <rect x={548 + (i % 2) * 8} y={398 - i * 22} width={92} height={20} rx={4} fill={hg ? "rgba(255,123,110,0.55)" : "#c8302a"} stroke={hg ? "#ffd2cc" : C.ink} strokeWidth={5} />
        </g>
      );
    })}
  </svg>
);

// ---------------------------------------------------------------------------
// Speiseglocke auf Teller. auf 0..1 hebt den Deckel.
// ---------------------------------------------------------------------------
export const Glocke: React.FC<P & { auf?: number }> = ({ size = 300, glow, style, auf = 0 }) => (
  <svg width={size} height={size * 0.75} viewBox="0 0 300 225" style={{ overflow: "visible", ...gl(glow), ...style }}>
    <ellipse cx={150} cy={196} rx={140} ry={20} fill={fill(glow, "#ffffff")} stroke={ink(glow)} strokeWidth={7} />
    <g transform={`translate(${auf * 40} ${-auf * 70}) rotate(${auf * 18} 260 186)`}>
      <path d="M30 186 Q30 60 150 60 Q270 60 270 186 Z" fill={fill(glow, C.steel)} stroke={ink(glow)} strokeWidth={8} strokeLinejoin="round" />
      <path d="M70 160 Q72 100 120 84" fill="none" stroke={glow ? C.glow : "#ffffff"} strokeWidth={9} strokeLinecap="round" opacity={0.75} />
      <circle cx={150} cy={48} r={16} fill={fill(glow, C.steel)} stroke={ink(glow)} strokeWidth={7} />
    </g>
  </svg>
);

// ---------------------------------------------------------------------------
// Anonymer Tester: Hut, Sonnenbrille, Mantelkragen.
// ---------------------------------------------------------------------------
export const Tester: React.FC<P> = ({ size = 220, glow, style }) => (
  <svg width={size} height={size * 1.2} viewBox="0 0 200 240" style={{ overflow: "visible", ...gl(glow), ...style }}>
    <path d="M30 236 Q30 160 100 156 Q170 160 170 236 Z" fill={fill(glow, "#5b5048")} stroke={ink(glow)} strokeWidth={7} strokeLinejoin="round" />
    <path d="M100 160 L78 236 M100 160 L122 236" stroke={ink(glow)} strokeWidth={6} />
    <circle cx={100} cy={104} r={44} fill={fill(glow, "#e7c4a3")} stroke={ink(glow)} strokeWidth={7} />
    <rect x={64} y={94} width={30} height={20} rx={8} fill={ink(glow)} />
    <rect x={106} y={94} width={30} height={20} rx={8} fill={ink(glow)} />
    <line x1={94} y1={102} x2={106} y2={102} stroke={ink(glow)} strokeWidth={5} />
    <path d="M28 70 L172 70" stroke={ink(glow)} strokeWidth={10} strokeLinecap="round" />
    <path d="M56 70 L64 26 Q100 14 136 26 L144 70 Z" fill={fill(glow, "#3b4049")} stroke={ink(glow)} strokeWidth={7} strokeLinejoin="round" />
    <rect x={60} y={52} width={80} height={10} fill={glow ? "rgba(255,123,110,0.6)" : C.red} />
  </svg>
);

// ---------------------------------------------------------------------------
// Kleine Inhalts-Symbole des Hefts (Karte, Zapfsäule, Schraubenschlüssel) – viewBox 120.
// ---------------------------------------------------------------------------
export const Karte: React.FC<P> = ({ size = 120, glow, style }) => (
  <svg width={size} height={size} viewBox="0 0 120 120" style={{ overflow: "visible", ...gl(glow), ...style }}>
    <path d="M10 24 L44 12 L76 24 L110 12 L110 96 L76 108 L44 96 L10 108 Z" fill={fill(glow, "#e9e2c8")} stroke={ink(glow)} strokeWidth={6} strokeLinejoin="round" />
    <path d="M44 12 L44 96 M76 24 L76 108" stroke={ink(glow)} strokeWidth={4} />
    <path d="M18 80 Q40 50 60 66 T102 34" fill="none" stroke={glow ? "rgba(255,123,110,0.9)" : C.red} strokeWidth={6} strokeLinecap="round" strokeDasharray="10 8" />
  </svg>
);
export const Zapfsaeule: React.FC<P> = ({ size = 120, glow, style }) => (
  <svg width={size} height={size} viewBox="0 0 120 120" style={{ overflow: "visible", ...gl(glow), ...style }}>
    <rect x={18} y={14} width={56} height={96} rx={8} fill={fill(glow, C.red)} stroke={ink(glow)} strokeWidth={6} />
    <rect x={28} y={26} width={36} height={24} rx={4} fill={fill(glow, "#ffffff")} stroke={ink(glow)} strokeWidth={4} />
    <path d="M74 40 L92 50 L92 88 Q92 98 102 96 L102 60" fill="none" stroke={ink(glow)} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
    <rect x={10} y={104} width={72} height={10} rx={4} fill={ink(glow)} />
  </svg>
);
export const Schluessel: React.FC<P> = ({ size = 120, glow, style }) => (
  <svg width={size} height={size} viewBox="0 0 120 120" style={{ overflow: "visible", ...gl(glow), ...style }}>
    <path d="M30 96 L74 52" stroke={ink(glow)} strokeWidth={16} strokeLinecap="round" />
    <path d="M70 30 A26 26 0 1 0 96 56 L84 52 L74 46 L70 34 Z" fill={fill(glow, C.steel)} stroke={ink(glow)} strokeWidth={6} strokeLinejoin="round" />
  </svg>
);

// ---------------------------------------------------------------------------
// Prinzip-Karten: Bierkrug, Backpulver-Tütchen.
// ---------------------------------------------------------------------------
export const Bierkrug: React.FC<P> = ({ size = 160, glow, style }) => (
  <svg width={size} height={size} viewBox="0 0 160 160" style={{ overflow: "visible", ...gl(glow), ...style }}>
    <path d="M30 40 L104 40 L100 146 L34 146 Z" fill={fill(glow, "#2a1d16")} stroke={ink(glow)} strokeWidth={7} strokeLinejoin="round" />
    <path d="M104 62 Q140 62 138 96 Q136 124 102 124" fill="none" stroke={ink(glow)} strokeWidth={10} />
    <path d="M24 44 Q24 18 50 22 Q66 6 86 20 Q110 14 110 44 Z" fill={fill(glow, "#f6f3ec")} stroke={ink(glow)} strokeWidth={7} strokeLinejoin="round" />
  </svg>
);
export const Tuetchen: React.FC<P> = ({ size = 160, glow, style }) => (
  <svg width={size} height={size} viewBox="0 0 160 160" style={{ overflow: "visible", ...gl(glow), ...style }}>
    <path d="M28 20 L132 20 L128 146 L32 146 Z" fill={fill(glow, "#ffffff")} stroke={ink(glow)} strokeWidth={7} strokeLinejoin="round" />
    <path d="M28 20 L80 52 L132 20" fill="none" stroke={ink(glow)} strokeWidth={6} strokeLinejoin="round" />
    <rect x={44} y={74} width={72} height={46} rx={6} fill={glow ? "rgba(143,216,255,0.3)" : "#2f6fb5"} />
    <text x={80} y={105} textAnchor="middle" fontFamily={HEAD} fontWeight={900} fontSize={20} fill="#ffffff">BACK</text>
  </svg>
);
