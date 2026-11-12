// Illustrationen Folge 24 (Bronze, Silber und die Joneses). Gleicher Stil wie icons.tsx; glow = Röntgen-Fassung.
// Keine echten Personen, keine Olympia-Ringe, keine Logos: Medaillen mit Emoji-Gesicht, eigene gezeichnete Comic-Familie.
import React from "react";
import { C, HEAD, MONO } from "../../basis/lib";

type P = { size?: number; glow?: boolean; style?: React.CSSProperties };
const ink = (g?: boolean) => (g ? C.glow : C.ink);
const fill = (g: boolean | undefined, f: string) => (g ? "rgba(143,216,255,0.2)" : f);
const gl = (g?: boolean): React.CSSProperties => (g ? { filter: "drop-shadow(0 0 14px rgba(143,216,255,0.45)) drop-shadow(0 0 3px rgba(143,216,255,0.8))" } : {});
export const HELL = "#eaf7ff";
export const AMBER = "#ffb82e";

export const METALL = {
  gold: { haupt: "#f1c94a", rand: "#c99a1e", licht: "#fff2b8" },
  silber: { haupt: "#d3d8de", rand: "#8f99a5", licht: "#ffffff" },
  bronze: { haupt: "#d38c52", rand: "#9c5a2a", licht: "#f6c49a" },
} as const;
export type Metall = keyof typeof METALL;
/** Röntgen-Fassung: Metall bleibt als Tönung erkennbar. */
const GLOW_TINT: Record<Metall, string> = { gold: "rgba(241,201,74,0.4)", silber: "rgba(220,228,238,0.28)", bronze: "rgba(222,140,80,0.42)" };

// ---------------------------------------------------------------------------
// Emoji-Gesicht als <g>: laune −1 (traurig) … +1 (strahlt). blick verschiebt die Pupillen (−1..1), traene 0..1.
// ---------------------------------------------------------------------------
export const Gesicht: React.FC<{ cx: number; cy: number; r: number; laune: number; glow?: boolean; blick?: { x: number; y: number }; traene?: number; farbe?: string }> = ({
  cx,
  cy,
  r,
  laune,
  glow,
  blick = { x: 0, y: 0 },
  traene = 0,
  farbe,
}) => {
  const li = farbe ?? (glow ? HELL : C.ink);
  const sw = r * 0.085;
  const ey = cy - r * 0.16;
  const ex = [cx - r * 0.36, cx + r * 0.36];
  const froh = laune >= 0.5;
  const my = cy + r * 0.36;
  const hw = r * 0.4;
  const c = laune * r * 0.32;
  return (
    <g>
      {/* Wangen beim Strahlen */}
      {froh && (
        <g opacity={Math.min(1, (laune - 0.5) * 3)}>
          <ellipse cx={ex[0] - r * 0.08} cy={cy + r * 0.16} rx={r * 0.15} ry={r * 0.09} fill={glow ? "rgba(255,184,46,0.45)" : "#ef8a7a"} opacity={0.7} />
          <ellipse cx={ex[1] + r * 0.08} cy={cy + r * 0.16} rx={r * 0.15} ry={r * 0.09} fill={glow ? "rgba(255,184,46,0.45)" : "#ef8a7a"} opacity={0.7} />
        </g>
      )}
      {/* Augen */}
      {froh
        ? ex.map((x, i) => (
            <path key={i} d={`M${x - r * 0.15} ${ey + r * 0.05} Q ${x} ${ey - r * 0.2} ${x + r * 0.15} ${ey + r * 0.05}`} fill="none" stroke={li} strokeWidth={sw} strokeLinecap="round" />
          ))
        : ex.map((x, i) => <ellipse key={i} cx={x + blick.x * r * 0.06} cy={ey + blick.y * r * 0.08} rx={r * 0.085} ry={r * 0.12} fill={li} />)}
      {/* traurige Brauen: innen hoch */}
      {laune < -0.3 && (
        <g opacity={Math.min(1, (-laune - 0.3) * 3)}>
          <path d={`M${ex[0] - r * 0.17} ${ey - r * 0.2} L${ex[0] + r * 0.14} ${ey - r * 0.33}`} stroke={li} strokeWidth={sw * 0.9} strokeLinecap="round" />
          <path d={`M${ex[1] + r * 0.17} ${ey - r * 0.2} L${ex[1] - r * 0.14} ${ey - r * 0.33}`} stroke={li} strokeWidth={sw * 0.9} strokeLinecap="round" />
        </g>
      )}
      {/* Mund */}
      {froh ? (
        <path
          d={`M${cx - hw} ${my - r * 0.06} L${cx + hw} ${my - r * 0.06} Q ${cx + hw * 0.95} ${my + c * 1.25} ${cx} ${my + c * 1.25} Q ${cx - hw * 0.95} ${my + c * 1.25} ${cx - hw} ${my - r * 0.06} Z`}
          fill={glow ? "rgba(26,33,56,0.85)" : C.ink}
          stroke={li}
          strokeWidth={sw * 0.8}
          strokeLinejoin="round"
        />
      ) : (
        <path d={`M${cx - hw} ${my - c / 2} Q ${cx} ${my + 1.5 * c} ${cx + hw} ${my - c / 2}`} fill="none" stroke={li} strokeWidth={sw} strokeLinecap="round" />
      )}
      {/* Träne */}
      {traene > 0.01 && (
        <path
          d={`M${ex[0]} ${ey + r * 0.16 + traene * r * 0.22} q ${-r * 0.09} ${r * 0.14} 0 ${r * 0.2} q ${r * 0.09} ${-r * 0.06} 0 ${-r * 0.2} Z`}
          fill={glow ? C.glow : "#6fb6e8"}
          stroke={li}
          strokeWidth={sw * 0.45}
          opacity={Math.min(1, traene * 2)}
        />
      )}
    </g>
  );
};

// ---------------------------------------------------------------------------
// Medaille mit Band. viewBox 300 × 470, Aufhängepunkt oben Mitte (150, 0) → transformOrigin "50% 0".
// Scheibenmitte (150, 320), Radius 140. Höhe = size × 470/300.
// ---------------------------------------------------------------------------
export const MED_H = 470 / 300;
export const Medaille: React.FC<
  P & { metall: Metall; laune?: number; gesicht?: boolean; blick?: { x: number; y: number }; traene?: number; zahl?: string; band?: boolean }
> = ({ size = 300, glow, style, metall, laune = 0, gesicht = true, blick, traene = 0, zahl, band = true }) => {
  const m = METALL[metall];
  const s = glow ? C.glow : C.ink;
  return (
    <svg width={size} height={size * MED_H} viewBox="0 0 300 470" style={{ overflow: "visible", ...gl(glow), ...style }}>
      {band && (
        <g>
          <path d="M58 0 L122 0 L176 186 L132 194 Z" fill={fill(glow, C.red)} stroke={s} strokeWidth={7} strokeLinejoin="round" />
          <path d="M242 0 L178 0 L124 186 L168 194 Z" fill={fill(glow, "#4d7fd1")} stroke={s} strokeWidth={7} strokeLinejoin="round" />
          <path d="M90 0 L148 186" stroke={glow ? "rgba(143,216,255,0.5)" : "#ffffff"} strokeWidth={8} opacity={0.55} />
          <path d="M210 0 L152 186" stroke={glow ? "rgba(143,216,255,0.5)" : "#ffffff"} strokeWidth={8} opacity={0.55} />
          <rect x={122} y={170} width={56} height={30} rx={8} fill={fill(glow, m.rand)} stroke={s} strokeWidth={7} />
          {/* Schlaufe oben (Aufhängepunkt) */}
          <rect x={50} y={-14} width={200} height={24} rx={10} fill={fill(glow, "#2e3a5c")} stroke={s} strokeWidth={7} />
        </g>
      )}
      <circle cx={150} cy={320} r={140} fill={glow ? "rgba(143,216,255,0.16)" : m.rand} stroke={s} strokeWidth={8} />
      <circle cx={150} cy={320} r={114} fill={glow ? GLOW_TINT[metall] : m.haupt} stroke={s} strokeWidth={5} />
      {!glow && <path d="M62 270 Q 84 214 140 200" fill="none" stroke={m.licht} strokeWidth={12} strokeLinecap="round" opacity={0.75} />}
      {glow && <circle cx={150} cy={320} r={127} fill="none" stroke={C.glow} strokeWidth={2} strokeDasharray="6 10" opacity={0.6} />}
      {gesicht && <Gesicht cx={150} cy={322} r={110} laune={laune} glow={glow} blick={blick} traene={traene} />}
      {!gesicht && zahl && (
        <text x={150} y={366} textAnchor="middle" fontFamily={HEAD} fontWeight={900} fontSize={130} fill={glow ? HELL : C.ink}>
          {zahl}
        </text>
      )}
    </svg>
  );
};

/** Einfacher Emoji-Kopf (gelb) für die Skala-Enden. */
export const EmojiKopf: React.FC<P & { laune: number; traene?: number }> = ({ size = 120, glow, style, laune, traene = 0 }) => (
  <svg width={size} height={size} viewBox="0 0 200 200" style={{ overflow: "visible", ...gl(glow), ...style }}>
    <circle cx={100} cy={100} r={92} fill={fill(glow, C.yellow)} stroke={ink(glow)} strokeWidth={9} />
    <Gesicht cx={100} cy={102} r={86} laune={laune} glow={glow} traene={traene} />
  </svg>
);

// ---------------------------------------------------------------------------
// Siegerpodest: 2 | 1 | 3. viewBox 900 × 420. Oberkanten: Platz 2 y=150, Platz 1 y=40, Platz 3 y=230.
// ---------------------------------------------------------------------------
export const POD = { w: 900, h: 420, top: { 2: 150, 1: 40, 3: 230 }, mitte: { 2: 160, 1: 450, 3: 740 } } as const;
export const Podest: React.FC<P & { leer1?: boolean }> = ({ size = 900, glow, style }) => {
  const s = ink(glow);
  const block = (x: number, y: number, n: string, f: string) => (
    <g key={n}>
      <rect x={x} y={y} width={280} height={420 - y} fill={fill(glow, f)} stroke={s} strokeWidth={8} strokeLinejoin="round" />
      <rect x={x} y={y} width={280} height={30} fill={glow ? "rgba(143,216,255,0.28)" : "#ffffff"} stroke={s} strokeWidth={8} />
      <text x={x + 140} y={y + 30 + Math.min(150, (420 - y - 30) * 0.5 + 44)} textAnchor="middle" fontFamily={HEAD} fontWeight={900} fontSize={120} fill={glow ? HELL : C.ink}>
        {n}
      </text>
    </g>
  );
  return (
    <svg width={size} height={(size * 420) / 900} viewBox="0 0 900 420" style={{ overflow: "visible", ...gl(glow), ...style }}>
      {block(20, 150, "2", "#e4e7eb")}
      {block(310, 40, "1", "#f5dc85")}
      {block(600, 230, "3", "#efc8a6")}
    </svg>
  );
};

/** Leerer Platz 4 (gestrichelter Block). */
export const PlatzVier: React.FC<P> = ({ size = 200, glow, style }) => (
  <svg width={size} height={size * 0.75} viewBox="0 0 200 150" style={{ overflow: "visible", ...style }}>
    <rect x={10} y={30} width={180} height={116} rx={6} fill={glow ? "rgba(143,216,255,0.06)" : "rgba(31,28,26,0.04)"} stroke={glow ? C.glow : C.ink} strokeWidth={6} strokeDasharray="16 12" />
    <text x={100} y={122} textAnchor="middle" fontFamily={HEAD} fontWeight={900} fontSize={84} fill={glow ? "rgba(234,247,255,0.55)" : C.muted}>
      4
    </text>
  </svg>
);

// ---------------------------------------------------------------------------
// Gedankenblase: Wolkenrand aus Kreisen (erst Kontur, dann Füllung → saubere Außenlinie), Schwanz aus 3 Kreisen.
// schwanz: "unten" (Kopf liegt darunter) oder "oben" (Kopf liegt darüber); schwanzX: x der Schwanzspitze (0..1).
// ---------------------------------------------------------------------------
export const Gedankenblase: React.FC<P & { w: number; h: number; schwanz?: "unten" | "oben"; schwanzX?: number; children?: React.ReactNode; farbe?: string }> = ({
  w,
  h,
  glow,
  style,
  schwanz = "unten",
  schwanzX = 0.5,
  children,
  farbe,
}) => {
  const f = farbe ?? (glow ? "#24345a" : "#ffffff");
  const s = glow ? C.glow : C.ink;
  const rx = w / 2 - 30, ry = h / 2 - 30;
  const n = 11;
  const bumps = Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2 + 0.2;
    return { x: w / 2 + rx * Math.cos(a) * 0.86, y: h / 2 + ry * Math.sin(a) * 0.8, r: Math.min(w, h) * (i % 2 ? 0.2 : 0.24) };
  });
  const tx = w * schwanzX;
  const tail = schwanz === "unten"
    ? [{ x: tx, y: h + 22, r: 22 }, { x: tx + (schwanzX < 0.5 ? -20 : 20), y: h + 70, r: 14 }, { x: tx + (schwanzX < 0.5 ? -36 : 36), y: h + 106, r: 9 }]
    : [{ x: tx, y: -22, r: 22 }, { x: tx + (schwanzX < 0.5 ? -20 : 20), y: -70, r: 14 }, { x: tx + (schwanzX < 0.5 ? -36 : 36), y: -106, r: 9 }];
  return (
    <div style={{ position: "relative", width: w, height: h, ...style }}>
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", ...gl(glow) }}>
        {bumps.map((b, i) => <circle key={`s${i}`} cx={b.x} cy={b.y} r={b.r} fill="none" stroke={s} strokeWidth={14} />)}
        <ellipse cx={w / 2} cy={h / 2} rx={rx} ry={ry} fill="none" stroke={s} strokeWidth={14} />
        {bumps.map((b, i) => <circle key={`f${i}`} cx={b.x} cy={b.y} r={b.r} fill={f} />)}
        <ellipse cx={w / 2} cy={h / 2} rx={rx} ry={ry} fill={f} />
        {tail.map((b, i) => <circle key={`t${i}`} cx={b.x} cy={b.y} r={b.r} fill={f} stroke={s} strokeWidth={6} />)}
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>{children}</div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Vergleichszeichen „<>“ als roter Knopf. auf = Spreizung der Winkel (0..1).
// ---------------------------------------------------------------------------
export const Vergleichszeichen: React.FC<P & { auf?: number }> = ({ size = 220, glow, style, auf = 1 }) => {
  const d = 14 + 22 * auf;
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" style={{ overflow: "visible", ...gl(glow), ...style }}>
      <circle cx={104} cy={106} r={92} fill={C.ink} opacity={glow ? 0 : 1} />
      <circle cx={100} cy={100} r={92} fill={glow ? "rgba(143,216,255,0.2)" : C.red} stroke={ink(glow)} strokeWidth={8} />
      <path d={`M${100 - d + 34} 62 L${100 - d - 10} 100 L${100 - d + 34} 138`} fill="none" stroke="#ffffff" strokeWidth={20} strokeLinecap="round" strokeLinejoin="round" />
      <path d={`M${100 + d - 34} 62 L${100 + d + 10} 100 L${100 + d - 34} 138`} fill="none" stroke="#ffffff" strokeWidth={20} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

// ---------------------------------------------------------------------------
// Skala 1–10 als Balken mit Strichen. Breite w, Höhe ~90. p = Aufbau (0..1).
// ---------------------------------------------------------------------------
export const skalaX = (w: number, v: number) => 24 + ((w - 48) * (v - 1)) / 9;
export const Skala: React.FC<{ w: number; p?: number; glow?: boolean; style?: React.CSSProperties }> = ({ w, p = 1, glow, style }) => (
  <svg width={w} height={120} viewBox={`0 0 ${w} 120`} style={{ overflow: "visible", ...style }}>
    <defs>
      <linearGradient id="h24-skala" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#7d8fa6" />
        <stop offset="0.5" stopColor="#f1c94a" />
        <stop offset="1" stopColor="#2fa35f" />
      </linearGradient>
    </defs>
    <rect x={4} y={20} width={(w - 8) * p} height={44} rx={22} fill="url(#h24-skala)" stroke={glow ? C.glow : C.ink} strokeWidth={6} />
    {Array.from({ length: 10 }, (_, i) => {
      const x = skalaX(w, i + 1);
      const q = Math.max(0, Math.min(1, p * 10 - i));
      return (
        <g key={i} opacity={q}>
          <line x1={x} y1={70} x2={x} y2={i === 0 || i === 9 ? 96 : 86} stroke={glow ? C.glow : C.ink} strokeWidth={i === 0 || i === 9 ? 6 : 4} strokeLinecap="round" />
          <text x={x} y={118} textAnchor="middle" fontFamily={MONO} fontWeight={700} fontSize={i === 0 || i === 9 ? 30 : 22} fill={glow ? C.glow : i === 0 || i === 9 ? C.ink : C.muted}>
            {i + 1}
          </text>
        </g>
      );
    })}
  </svg>
);

// ---------------------------------------------------------------------------
// Fernseher (Video-Kachel): viewBox 420 × 360. inhalt = Podest mit Medaillengewinner im Bild (0..1), lauf = Fortschritt.
// ---------------------------------------------------------------------------
export const Fernseher: React.FC<P & { inhalt?: number; lauf?: number; frage?: number }> = ({ size = 420, glow, style, inhalt = 0, lauf = 0, frage = 0 }) => {
  const s = ink(glow);
  return (
    <svg width={size} height={(size * 360) / 420} viewBox="0 0 420 360" style={{ overflow: "visible", ...gl(glow), ...style }}>
      <path d="M170 40 L130 4 M250 40 L290 4" stroke={s} strokeWidth={7} strokeLinecap="round" />
      <rect x={10} y={40} width={400} height={280} rx={30} fill={fill(glow, "#5d4a3c")} stroke={s} strokeWidth={8} />
      <rect x={34} y={62} width={300} height={236} rx={18} fill={glow ? "rgba(143,216,255,0.1)" : C.sky} stroke={s} strokeWidth={6} />
      <circle cx={372} cy={110} r={16} fill={fill(glow, "#d8c7a8")} stroke={s} strokeWidth={6} />
      <circle cx={372} cy={164} r={16} fill={fill(glow, "#d8c7a8")} stroke={s} strokeWidth={6} />
      <path d="M90 320 L70 352 M330 320 L350 352" stroke={s} strokeWidth={8} strokeLinecap="round" />
      {/* Bildinhalt: Podest + Sportlerin mit Medaille */}
      <g opacity={inhalt} transform={`translate(0 ${(1 - inhalt) * 20})`}>
        <rect x={110} y={214} width={60} height={60} fill="#e4e7eb" stroke={s} strokeWidth={4} />
        <rect x={170} y={190} width={60} height={84} fill="#f5dc85" stroke={s} strokeWidth={4} />
        <rect x={230} y={232} width={60} height={42} fill="#efc8a6" stroke={s} strokeWidth={4} />
        <circle cx={260} cy={176} r={17} fill="#c99674" stroke={s} strokeWidth={4} />
        <path d="M236 232 Q 236 196 260 196 Q 284 196 284 232 Z" fill="#4d7fd1" stroke={s} strokeWidth={4} />
        <path d="M252 198 L260 214 L268 198" fill="none" stroke={C.red} strokeWidth={4} />
        <circle cx={260} cy={218} r={8} fill={METALL.bronze.haupt} stroke={s} strokeWidth={3} />
        <path d="M240 206 L222 180 M280 206 L298 180" stroke={s} strokeWidth={6} strokeLinecap="round" />
      </g>
      {frage > 0.01 && (
        <text x={300} y={160} textAnchor="middle" fontFamily={HEAD} fontWeight={900} fontSize={70} fill={C.red} opacity={frage} stroke={C.ink} strokeWidth={3}>
          ?
        </text>
      )}
      {/* Wiedergabeleiste */}
      <rect x={54} y={278} width={260} height={8} rx={4} fill={glow ? "rgba(143,216,255,0.3)" : "rgba(31,28,26,0.25)"} />
      <rect x={54} y={278} width={260 * lauf} height={8} rx={4} fill={C.red} />
    </svg>
  );
};

/** Zuschauer von hinten (Studentin/Student). viewBox 140 × 150. */
export const Zuschauer: React.FC<P & { farbe?: string; haar?: string }> = ({ size = 140, glow, style, farbe = "#4d7fd1", haar = "#5a4636" }) => (
  <svg width={size} height={(size * 150) / 140} viewBox="0 0 140 150" style={{ overflow: "visible", ...gl(glow), ...style }}>
    <path d="M10 150 C 10 98, 130 98, 130 150 Z" fill={fill(glow, farbe)} stroke={ink(glow)} strokeWidth={7} strokeLinejoin="round" />
    <circle cx={70} cy={56} r={36} fill={fill(glow, haar)} stroke={ink(glow)} strokeWidth={7} />
  </svg>
);

// ---------------------------------------------------------------------------
// Comic (1913, eigene Figuren): Familie kauft Hut, Auto, Klavier, schielt über den Zaun.
// ---------------------------------------------------------------------------
/** Comic-Figur. viewBox 120 × 220, Füße bei y=220. blick: Pupillen nach rechts (−1..1). */
export const ComicFigur: React.FC<{ typ: "vater" | "mutter"; glow?: boolean; hut?: number; blick?: number; x: number; y: number; s?: number }> = ({ typ, glow, hut = 0, blick = 0, x, y, s = 1 }) => {
  const st = ink(glow);
  const haut = fill(glow, "#f0c8a0");
  const kleid = typ === "vater" ? fill(glow, "#5b6b8a") : fill(glow, "#b0546a");
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {typ === "vater" ? (
        <path d="M30 216 L36 120 Q 60 108 84 120 L90 216 Z" fill={kleid} stroke={st} strokeWidth={6} strokeLinejoin="round" />
      ) : (
        <path d="M22 216 L44 120 Q 60 112 76 120 L98 216 Z" fill={kleid} stroke={st} strokeWidth={6} strokeLinejoin="round" />
      )}
      <circle cx={60} cy={82} r={30} fill={haut} stroke={st} strokeWidth={6} />
      {typ === "mutter" && <circle cx={60} cy={44} r={15} fill={fill(glow, "#6b4a33")} stroke={st} strokeWidth={5} />}
      {typ === "mutter" && <path d="M32 74 Q 60 46 88 74" fill={fill(glow, "#6b4a33")} stroke={st} strokeWidth={5} />}
      <circle cx={50 + blick * 5} cy={80} r={4.5} fill={st} />
      <circle cx={70 + blick * 5} cy={80} r={4.5} fill={st} />
      {typ === "vater" && <path d="M46 96 Q 53 90 60 96 Q 67 90 74 96" fill="none" stroke={st} strokeWidth={5} strokeLinecap="round" />}
      {typ === "mutter" && <path d="M52 98 Q 60 103 68 98" fill="none" stroke={st} strokeWidth={4} strokeLinecap="round" />}
      {/* Zylinder (neu gekauft, Bernstein) */}
      {typ === "vater" && hut > 0.01 && (
        <g opacity={Math.min(1, hut)} transform={`translate(0 ${(1 - hut) * -40})`}>
          <rect x={30} y={56} width={60} height={9} rx={4} fill={glow ? "rgba(255,184,46,0.35)" : "#2b2b2b"} stroke={glow ? AMBER : st} strokeWidth={5} />
          <rect x={38} y={10} width={44} height={50} rx={4} fill={glow ? "rgba(255,184,46,0.35)" : "#2b2b2b"} stroke={glow ? AMBER : st} strokeWidth={5} />
          <rect x={38} y={42} width={44} height={8} fill={glow ? AMBER : C.red} />
        </g>
      )}
    </g>
  );
};

/** Altes Auto (1913-Stil) von der Seite, viewBox 220 × 120. */
const AltAuto: React.FC<{ glow?: boolean; x: number; y: number; s?: number; farbe?: string }> = ({ glow, x, y, s = 1, farbe }) => {
  const st = glow ? AMBER : C.ink;
  const f = glow ? "rgba(255,184,46,0.3)" : farbe ?? "#c0392b";
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M10 80 L20 50 L70 50 L84 18 L140 18 L150 50 L206 54 L210 84 Z" fill={f} stroke={st} strokeWidth={6} strokeLinejoin="round" />
      <rect x={92} y={26} width={42} height={24} fill={glow ? "rgba(143,216,255,0.2)" : C.sky} stroke={st} strokeWidth={4} />
      <circle cx={52} cy={88} r={24} fill={glow ? "rgba(26,33,56,0.9)" : "#2b2b2b"} stroke={st} strokeWidth={6} />
      <circle cx={170} cy={88} r={24} fill={glow ? "rgba(26,33,56,0.9)" : "#2b2b2b"} stroke={st} strokeWidth={6} />
      <circle cx={52} cy={88} r={7} fill={st} />
      <circle cx={170} cy={88} r={7} fill={st} />
    </g>
  );
};

/** Klavier (aufrecht), viewBox 180 × 160. */
const Klavier: React.FC<{ glow?: boolean; x: number; y: number; s?: number }> = ({ glow, x, y, s = 1 }) => {
  const st = glow ? AMBER : C.ink;
  const f = glow ? "rgba(255,184,46,0.3)" : "#4a2f22";
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x={10} y={0} width={160} height={110} rx={8} fill={f} stroke={st} strokeWidth={6} />
      <rect x={4} y={96} width={172} height={28} rx={4} fill={glow ? "rgba(255,255,255,0.15)" : "#ffffff"} stroke={st} strokeWidth={5} />
      {Array.from({ length: 9 }, (_, i) => <rect key={i} x={16 + i * 18} y={98} width={9} height={14} fill={st} />)}
      <path d="M24 124 L24 160 M156 124 L156 160" stroke={st} strokeWidth={8} strokeLinecap="round" />
      <path d="M40 30 Q 60 14 80 30 M100 30 Q 120 14 140 30" fill="none" stroke={glow ? AMBER : "#8a6a4a"} strokeWidth={4} />
    </g>
  );
};

/** Zaun, viewBox w × h. */
export const Zaun: React.FC<{ w: number; h?: number; glow?: boolean; style?: React.CSSProperties }> = ({ w, h = 120, glow, style }) => {
  const n = Math.max(3, Math.round(w / 46));
  const st = ink(glow);
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ overflow: "visible", ...gl(glow), ...style }}>
      <rect x={0} y={h * 0.35} width={w} height={12} fill={fill(glow, "#e9dcc4")} stroke={st} strokeWidth={5} />
      <rect x={0} y={h * 0.72} width={w} height={12} fill={fill(glow, "#e9dcc4")} stroke={st} strokeWidth={5} />
      {Array.from({ length: n }, (_, i) => {
        const x = 6 + (i * (w - 40)) / (n - 1);
        return <path key={i} d={`M${x} ${h} L${x} 18 L${x + 14} 2 L${x + 28} 18 L${x + 28} ${h} Z`} fill={fill(glow, "#f6efe0")} stroke={st} strokeWidth={5} strokeLinejoin="round" />;
      })}
    </svg>
  );
};

/** Ein Comic-Kästchen 400 × 340 mit Motiv. p = Einblende des gekauften Gegenstands. */
export const ComicPanel: React.FC<{ motiv: "hut" | "auto" | "klavier" | "zaun"; w?: number; glow?: boolean; p?: number; blick?: number; style?: React.CSSProperties }> = ({
  motiv,
  w = 400,
  glow,
  p = 1,
  blick = 0,
  style,
}) => {
  const st = ink(glow);
  const bg = glow ? "rgba(80,125,190,0.5)" : "#fbf4df";
  return (
    <svg width={w} height={(w * 340) / 400} viewBox="0 0 400 340" style={{ overflow: "visible", ...gl(glow), ...style }}>
      <rect x={4} y={4} width={392} height={332} rx={6} fill={bg} stroke={st} strokeWidth={8} />
      {/* Boden */}
      <path d="M4 296 L396 296" stroke={st} strokeWidth={4} opacity={0.6} />
      {motiv === "hut" && (
        <g>
          <ComicFigur typ="vater" glow={glow} hut={p} x={90} y={78} />
          <ComicFigur typ="mutter" glow={glow} x={210} y={78} blick={-0.6} />
          <g opacity={p}>
            <path d="M120 70 L112 52 M150 60 L150 40 M180 70 L188 52" stroke={glow ? AMBER : C.red} strokeWidth={5} strokeLinecap="round" />
          </g>
        </g>
      )}
      {motiv === "auto" && (
        <g>
          <g opacity={p} transform={`translate(${(1 - p) * 120} 0)`}>
            <AltAuto glow={glow} x={150} y={192} s={1.05} />
          </g>
          <ComicFigur typ="vater" glow={glow} hut={1} x={40} y={78} blick={0.8} />
        </g>
      )}
      {motiv === "klavier" && (
        <g>
          <g opacity={p} transform={`translate(0 ${(1 - p) * -60})`}>
            <Klavier glow={glow} x={190} y={136} s={1.0} />
          </g>
          <ComicFigur typ="mutter" glow={glow} x={50} y={78} blick={0.8} />
        </g>
      )}
      {motiv === "zaun" && (
        <g>
          {/* Familie hinter dem Zaun, schielt nach rechts */}
          <g transform={`translate(0 ${(1 - p) * 70})`}>
            <ComicFigur typ="vater" glow={glow} hut={1} x={70} y={70} blick={blick} />
            <ComicFigur typ="mutter" glow={glow} x={170} y={78} blick={blick} />
          </g>
          <rect x={8} y={226} width={384} height={106} fill={bg} />
          <g transform="translate(14 176)">
            <Zaun w={372} h={120} glow={glow} />
          </g>
          <path d={`M290 110 L360 92`} stroke={glow ? AMBER : C.red} strokeWidth={5} strokeDasharray="10 8" strokeLinecap="round" opacity={p} />
          <text x={368} y={104} fontFamily={HEAD} fontWeight={900} fontSize={44} fill={glow ? AMBER : C.red} opacity={p}>
            ?
          </text>
        </g>
      )}
    </svg>
  );
};

// ---------------------------------------------------------------------------
// Haus, viewBox 300 × 300. leer = gestrichelte Silhouette (die Joneses: nie gezeigt).
// ---------------------------------------------------------------------------
export const Haus: React.FC<P & { leer?: boolean; zeichne?: number; licht?: number }> = ({ size = 300, glow, style, leer, zeichne = 1, licht = 0 }) => {
  const st = ink(glow);
  if (leer) {
    return (
      <svg width={size} height={size} viewBox="0 0 300 300" style={{ overflow: "visible", ...style }}>
        <path
          d="M20 140 L150 24 L280 140 L254 140 L254 296 L46 296 L46 140 Z"
          fill={glow ? "rgba(143,216,255,0.05)" : "rgba(31,28,26,0.04)"}
          stroke={glow ? C.glow : C.ink}
          strokeWidth={7}
          strokeDasharray="20 14"
          strokeLinejoin="round"
          pathLength={1000}
          strokeDashoffset={0}
          opacity={0.85 * zeichne}
        />
      </svg>
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 300 300" style={{ overflow: "visible", ...gl(glow), ...style }}>
      <rect x={46} y={136} width={208} height={160} fill={fill(glow, "#f6efe0")} stroke={st} strokeWidth={8} />
      <path d="M20 140 L150 24 L280 140 Z" fill={fill(glow, C.red)} stroke={st} strokeWidth={8} strokeLinejoin="round" />
      <rect x={124} y={206} width={52} height={90} fill={fill(glow, "#8a6a4a")} stroke={st} strokeWidth={6} />
      <rect x={70} y={170} width={42} height={42} fill={glow ? `rgba(255,184,46,${0.2 + 0.5 * licht})` : C.sky} stroke={st} strokeWidth={6} />
      <rect x={188} y={170} width={42} height={42} fill={glow ? `rgba(255,184,46,${0.2 + 0.5 * licht})` : C.sky} stroke={st} strokeWidth={6} />
    </svg>
  );
};

/** Leere Nachbar-Silhouette (gestrichelte Figur) mit optionalem Fragezeichen. viewBox 160 × 240. */
export const NachbarLeer: React.FC<{ size?: number; glow?: boolean; frage?: number; style?: React.CSSProperties }> = ({ size = 160, glow, frage = 0, style }) => (
  <svg width={size} height={size * 1.5} viewBox="0 0 160 240" style={{ overflow: "visible", ...style }}>
    <circle cx={80} cy={60} r={42} fill="none" stroke={glow ? C.glow : C.ink} strokeWidth={6} strokeDasharray="14 10" opacity={0.85} />
    <path d="M14 236 C 14 140, 146 140, 146 236" fill="none" stroke={glow ? C.glow : C.ink} strokeWidth={6} strokeDasharray="14 10" opacity={0.85} />
    {frage > 0.01 && (
      <text x={80} y={84} textAnchor="middle" fontFamily={HEAD} fontWeight={900} fontSize={76} fill={glow ? AMBER : C.red} opacity={Math.min(1, frage)}>
        ?
      </text>
    )}
  </svg>
);

// ---------------------------------------------------------------------------
// Übertrag: Handy, Auto, Urlaubsfoto
// ---------------------------------------------------------------------------
/** Smartphone, viewBox 160 × 300. alt = älteres Modell (dicker Rand, kleiner Bildschirm). */
export const Handy: React.FC<P & { alt?: boolean; glanz?: number }> = ({ size = 160, glow, style, alt, glanz = 0 }) => (
  <svg width={size} height={(size * 300) / 160} viewBox="0 0 160 300" style={{ overflow: "visible", ...gl(glow), ...style }}>
    {alt ? (
      <g>
        <rect x={12} y={20} width={136} height={264} rx={22} fill={fill(glow, "#5d636e")} stroke={ink(glow)} strokeWidth={8} />
        <rect x={28} y={56} width={104} height={170} rx={6} fill={glow ? "rgba(143,216,255,0.12)" : "#26303d"} stroke={ink(glow)} strokeWidth={5} />
        <circle cx={80} cy={252} r={14} fill="none" stroke={ink(glow)} strokeWidth={5} />
        <rect x={44} y={90} width={72} height={10} rx={5} fill={C.green} opacity={0.9} />
        <rect x={44} y={112} width={50} height={10} rx={5} fill={C.glow} opacity={0.5} />
      </g>
    ) : (
      <g>
        <rect x={8} y={6} width={144} height={288} rx={30} fill={fill(glow, "#1f2430")} stroke={ink(glow)} strokeWidth={8} />
        <rect x={20} y={18} width={120} height={264} rx={22} fill={glow ? "rgba(143,216,255,0.14)" : "#7b6fd6"} />
        <rect x={56} y={26} width={48} height={14} rx={7} fill={glow ? C.navyOut : "#1f2430"} />
        <path d="M20 200 Q 80 120 140 160 L140 282 L20 282 Z" fill={glow ? "rgba(143,216,255,0.12)" : "#e46fa8"} opacity={0.85} />
        <path d={`M${30 + glanz * 90} 40 L${10 + glanz * 90} 270`} stroke="#ffffff" strokeWidth={18} opacity={0.35 * Math.sin(Math.PI * Math.min(1, glanz))} />
      </g>
    )}
  </svg>
);

/** Auto von der Seite, viewBox 300 × 140. */
export const Auto: React.FC<P & { farbe?: string; rad?: number }> = ({ size = 300, glow, style, farbe = "#4d7fd1", rad = 0 }) => (
  <svg width={size} height={(size * 140) / 300} viewBox="0 0 300 140" style={{ overflow: "visible", ...gl(glow), ...style }}>
    <path d="M14 100 L20 70 Q 26 58 44 56 L84 52 L112 22 Q 120 14 134 14 L196 14 Q 210 14 220 24 L248 54 L276 60 Q 290 64 290 78 L290 100 Z" fill={fill(glow, farbe)} stroke={ink(glow)} strokeWidth={8} strokeLinejoin="round" />
    <path d="M100 54 L124 28 L164 28 L164 54 Z" fill={fill(glow, C.sky)} stroke={ink(glow)} strokeWidth={6} strokeLinejoin="round" />
    <path d="M176 28 L206 28 L232 54 L176 54 Z" fill={fill(glow, C.sky)} stroke={ink(glow)} strokeWidth={6} strokeLinejoin="round" />
    {[78, 228].map((x, i) => (
      <g key={i} transform={`rotate(${rad} ${x} 104)`}>
        <circle cx={x} cy={104} r={28} fill={fill(glow, "#2b2b2b")} stroke={ink(glow)} strokeWidth={7} />
        <circle cx={x} cy={104} r={10} fill={fill(glow, C.steel)} stroke={ink(glow)} strokeWidth={4} />
        <path d={`M${x} 82 L${x} 92`} stroke={glow ? C.glow : C.steel} strokeWidth={5} />
      </g>
    ))}
    <rect x={272} y={70} width={14} height={10} rx={3} fill={C.yellow} />
  </svg>
);

/** Urlaubsfoto (Sofortbild): Sonne, Meer, Palme. viewBox 260 × 300. */
export const Urlaubsfoto: React.FC<P> = ({ size = 260, glow, style }) => (
  <svg width={size} height={(size * 300) / 260} viewBox="0 0 260 300" style={{ overflow: "visible", ...gl(glow), ...style }}>
    <rect x={6} y={6} width={248} height={288} rx={8} fill={fill(glow, "#ffffff")} stroke={ink(glow)} strokeWidth={7} />
    <rect x={24} y={24} width={212} height={196} fill={glow ? "rgba(143,216,255,0.1)" : "#ffd59a"} stroke={ink(glow)} strokeWidth={5} />
    <circle cx={180} cy={80} r={30} fill={glow ? "rgba(255,184,46,0.6)" : "#ff9f43"} />
    <rect x={24} y={150} width={212} height={70} fill={glow ? "rgba(143,216,255,0.25)" : "#3fa7d6"} />
    <path d="M24 190 Q 80 172 130 190 T 236 190 L236 220 L24 220 Z" fill={glow ? "rgba(143,216,255,0.15)" : "#f3dfb0"} />
    <path d="M70 200 Q 76 140 92 96" fill="none" stroke={ink(glow)} strokeWidth={7} strokeLinecap="round" />
    <path d="M92 96 Q 60 84 40 104 M92 96 Q 120 78 138 98 M92 96 Q 80 66 58 66 M92 96 Q 112 64 132 70" fill="none" stroke={glow ? C.glow : "#2fa35f"} strokeWidth={9} strokeLinecap="round" />
  </svg>
);

/** Kleines Herz. */
export const Herzchen: React.FC<{ size?: number; farbe?: string; style?: React.CSSProperties }> = ({ size = 60, farbe = C.red, style }) => (
  <svg width={size} height={size * 0.9} viewBox="0 0 200 180" style={{ overflow: "visible", ...style }}>
    <path d="M100 168 C 40 120 8 90 10 54 C 12 24 36 8 62 10 C 82 12 94 24 100 40 C 106 24 118 12 138 10 C 164 8 188 24 190 54 C 192 90 160 120 100 168 Z" fill={farbe} stroke={C.ink} strokeWidth={12} strokeLinejoin="round" />
  </svg>
);

/** Pfeil nach oben/unten (wächst mit p). Höhe len. */
export const PfeilV: React.FC<{ len: number; dir: "up" | "down"; p?: number; farbe: string; dicke?: number; style?: React.CSSProperties }> = ({ len, dir, p = 1, farbe, dicke = 14, style }) => {
  const l = Math.max(0.001, p) * len;
  const y0 = dir === "up" ? len : 0;
  const y1 = dir === "up" ? len - l : l;
  const k = dir === "up" ? 1 : -1;
  return (
    <svg width={60} height={len} viewBox={`0 0 60 ${len}`} style={{ overflow: "visible", ...style }}>
      <path d={`M30 ${y0} L30 ${y1}`} stroke={farbe} strokeWidth={dicke} strokeLinecap="round" />
      {p > 0.05 && <path d={`M6 ${y1 + 26 * k} L30 ${y1} L54 ${y1 + 26 * k}`} fill="none" stroke={farbe} strokeWidth={dicke} strokeLinecap="round" strokeLinejoin="round" />}
    </svg>
  );
};
