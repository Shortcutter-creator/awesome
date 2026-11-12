// Illustrationen Folge 11 (Der Angeber). Gleicher Stil wie icons.tsx; glow = Röntgen-Fassung.
import React from "react";
import { C } from "../../basis/lib";

type P = { size?: number; glow?: boolean; style?: React.CSSProperties };
const ink = (g?: boolean) => (g ? C.glow : C.ink);
const fill = (g: boolean | undefined, f: string) => (g ? "rgba(143,216,255,0.2)" : f);
const gl = (g?: boolean): React.CSSProperties => (g ? { filter: "drop-shadow(0 0 14px rgba(143,216,255,0.45)) drop-shadow(0 0 3px rgba(143,216,255,0.8))" } : {});

/** Flacher Sportwagen (Seitenansicht, nach rechts). fl = Schubdüsen-Flamme 0..1.3, t = Zeit für Flackern, rad = Raddrehung in Grad. Kein Markenlogo. */
export const Sportwagen: React.FC<P & { fl?: number; t?: number; rad?: number; farbe?: string }> = ({ size = 400, glow, style, fl = 0, t = 0, rad = 0, farbe = "#c9cfd6" }) => {
  const flick = 0.85 + 0.15 * Math.sin(t * 38) + 0.06 * Math.sin(t * 61);
  const flame = (cx: number) => {
    const L = 78 * fl * flick;
    const inner = L * 0.55;
    return (
      <g key={cx}>
        <path d={`M${cx - 20} 134 Q ${cx - 26} ${134 + L * 0.5} ${cx} ${134 + L} Q ${cx + 26} ${134 + L * 0.5} ${cx + 20} 134 Z`} fill={glow ? "rgba(143,216,255,0.35)" : "#f08a3c"} stroke={ink(glow)} strokeWidth={5} strokeLinejoin="round" />
        <path d={`M${cx - 9} 136 Q ${cx - 12} ${136 + inner * 0.5} ${cx} ${136 + inner} Q ${cx + 12} ${136 + inner * 0.5} ${cx + 9} 136 Z`} fill={glow ? "rgba(233,248,255,0.8)" : C.yellow} />
      </g>
    );
  };
  const rad_ = (cx: number) => (
    <g key={cx} transform={`rotate(${rad} ${cx} 130)`}>
      <circle cx={cx} cy={130} r={30} fill={glow ? "rgba(143,216,255,0.12)" : "#2b2f36"} stroke={ink(glow)} strokeWidth={7} />
      <circle cx={cx} cy={130} r={13} fill={fill(glow, "#e9ecef")} stroke={ink(glow)} strokeWidth={4} />
      <path d={`M${cx} 112 L${cx} 148 M${cx - 18} 130 L${cx + 18} 130`} stroke={ink(glow)} strokeWidth={4} />
    </g>
  );
  return (
    <svg width={size} height={size * 0.575} viewBox="0 0 400 230" style={{ overflow: "visible", ...gl(glow), ...style }}>
      {fl > 0.02 && [160, 250].map(flame)}
      <path d="M16 120 Q 16 100 44 96 L 124 86 Q 160 50 232 50 Q 292 54 322 86 L 368 98 Q 388 104 388 122 L 388 136 L 16 136 Z" fill={fill(glow, farbe)} stroke={ink(glow)} strokeWidth={8} strokeLinejoin="round" />
      <path d="M146 84 Q 174 62 226 62 Q 264 64 288 84 Z" fill={fill(glow, C.sky)} stroke={ink(glow)} strokeWidth={6} strokeLinejoin="round" />
      <path d="M212 64 L212 84" stroke={ink(glow)} strokeWidth={5} />
      <path d="M350 106 L376 110" stroke={ink(glow)} strokeWidth={7} strokeLinecap="round" />
      <path d="M30 108 L70 104" stroke={glow ? C.glow : "#fff"} strokeWidth={6} strokeLinecap="round" opacity={0.7} />
      {rad_(88)}
      {rad_(312)}
    </svg>
  );
};

export const Kamera: React.FC<P> = ({ size = 140, glow, style }) => (
  <svg width={size} height={size * 0.75} viewBox="0 0 160 120" style={{ overflow: "visible", ...gl(glow), ...style }}>
    <path d="M52 22 L64 8 L100 8 L112 22 Z" fill={fill(glow, "#3b4049")} stroke={ink(glow)} strokeWidth={6} strokeLinejoin="round" />
    <rect x={8} y={22} width={144} height={92} rx={16} fill={fill(glow, "#ffffff")} stroke={ink(glow)} strokeWidth={7} />
    <circle cx={80} cy={68} r={30} fill={fill(glow, "#26303d")} stroke={ink(glow)} strokeWidth={7} />
    <circle cx={80} cy={68} r={12} fill={glow ? C.glow : C.glow} opacity={0.8} />
    <circle cx={132} cy={42} r={6} fill={glow ? C.glow : C.red} />
  </svg>
);

export const Anker: React.FC<P> = ({ size = 150, glow, style }) => (
  <svg width={size} height={size * 1.15} viewBox="0 0 140 160" style={{ overflow: "visible", ...gl(glow), ...style }}>
    <circle cx={70} cy={24} r={14} fill="none" stroke={ink(glow)} strokeWidth={9} />
    <path d="M70 38 L70 138 M42 58 L98 58" stroke={ink(glow)} strokeWidth={10} strokeLinecap="round" />
    <path d="M14 98 Q 20 146 70 146 Q 120 146 126 98" fill="none" stroke={ink(glow)} strokeWidth={10} strokeLinecap="round" />
    <path d="M6 108 L14 92 L28 106 M134 108 L126 92 L112 106" fill="none" stroke={ink(glow)} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const Lenkrad: React.FC<P> = ({ size = 150, glow, style }) => (
  <svg width={size} height={size} viewBox="0 0 150 150" style={{ overflow: "visible", ...gl(glow), ...style }}>
    <circle cx={75} cy={75} r={58} fill="none" stroke={ink(glow)} strokeWidth={14} />
    <circle cx={75} cy={75} r={14} fill={fill(glow, "#fff")} stroke={ink(glow)} strokeWidth={7} />
    <path d="M17 75 L61 75 M89 75 L133 75 M75 89 L75 133" stroke={ink(glow)} strokeWidth={11} strokeLinecap="round" />
  </svg>
);

export const Torte: React.FC<P> = ({ size = 170, glow, style }) => (
  <svg width={size} height={size} viewBox="0 0 170 170" style={{ overflow: "visible", ...gl(glow), ...style }}>
    <rect x={20} y={120} width={130} height={36} rx={8} fill={fill(glow, "#f6c7d0")} stroke={ink(glow)} strokeWidth={7} />
    <rect x={40} y={80} width={90} height={40} rx={8} fill={fill(glow, "#fff")} stroke={ink(glow)} strokeWidth={7} />
    <rect x={60} y={44} width={50} height={36} rx={8} fill={fill(glow, "#f6c7d0")} stroke={ink(glow)} strokeWidth={7} />
    <path d="M85 44 L85 22 M74 22 L96 22" stroke={ink(glow)} strokeWidth={7} strokeLinecap="round" />
    <path d="M85 8 Q 78 18 85 22 Q 92 18 85 8 Z" fill={glow ? C.glow : C.yellow} stroke={ink(glow)} strokeWidth={3} />
    <path d="M30 138 Q 50 128 70 138 T 110 138 T 140 138" fill="none" stroke={ink(glow)} strokeWidth={5} />
  </svg>
);

export const Krone: React.FC<P> = ({ size = 90, glow, style }) => (
  <svg width={size} height={size * 0.75} viewBox="0 0 120 90" style={{ overflow: "visible", ...gl(glow), ...style }}>
    <path d="M10 76 L6 22 L36 46 L60 10 L84 46 L114 22 L110 76 Z" fill={fill(glow, C.yellow)} stroke={ink(glow)} strokeWidth={7} strokeLinejoin="round" />
    <circle cx={60} cy={60} r={7} fill={glow ? C.glow : C.red} />
  </svg>
);

/** Gewöhnlicher Karton (Bestseller). */
export const Karton: React.FC<P> = ({ size = 200, glow, style }) => (
  <svg width={size} height={size * 0.85} viewBox="0 0 200 170" style={{ overflow: "visible", ...gl(glow), ...style }}>
    <path d="M14 50 L100 14 L186 50 L186 140 L100 160 L14 140 Z" fill={fill(glow, "#d8a97a")} stroke={ink(glow)} strokeWidth={8} strokeLinejoin="round" />
    <path d="M14 50 L100 84 L186 50 M100 84 L100 160" fill="none" stroke={ink(glow)} strokeWidth={7} strokeLinejoin="round" />
    <rect x={78} y={30} width={44} height={14} rx={4} fill={fill(glow, "#f6f3ec")} stroke={ink(glow)} strokeWidth={4} transform="rotate(-6 100 37)" />
  </svg>
);

/** Goldene Prunkbox mit Schleife und Krone (der Angeber). */
export const Prunkbox: React.FC<P> = ({ size = 240, glow, style }) => (
  <svg width={size} height={size * 1.05} viewBox="0 0 200 210" style={{ overflow: "visible", ...gl(glow), ...style }}>
    <rect x={24} y={86} width={152} height={112} rx={12} fill={fill(glow, "#f1c94a")} stroke={ink(glow)} strokeWidth={8} />
    <rect x={14} y={64} width={172} height={36} rx={10} fill={fill(glow, "#f7dc84")} stroke={ink(glow)} strokeWidth={8} />
    <path d="M100 64 L100 198" stroke={ink(glow)} strokeWidth={14} />
    <path d="M100 64 Q 62 24 54 46 Q 56 70 100 64 Q 138 70 146 46 Q 138 24 100 64 Z" fill={fill(glow, C.red)} stroke={ink(glow)} strokeWidth={6} strokeLinejoin="round" />
    <path d="M70 14 L68 -22 L86 -6 L100 -30 L114 -6 L132 -22 L130 14 Z" fill={fill(glow, C.yellow)} stroke={ink(glow)} strokeWidth={6} strokeLinejoin="round" transform="translate(0 8)" />
  </svg>
);

export const Muenze: React.FC<P & { zeichen?: string }> = ({ size = 90, glow, style, zeichen = "€" }) => (
  <div style={{ width: size, height: size, borderRadius: "50%", background: glow ? "rgba(143,216,255,0.2)" : C.yellow, border: `${Math.max(4, size / 14)}px solid ${ink(glow)}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "sans-serif", fontWeight: 900, fontSize: size * 0.55, color: ink(glow), boxSizing: "border-box", ...style }}>{zeichen}</div>
);

// ---------------------------------------------------------------------------
// Roadster (2026) nach den Pressefotos: kantiger weißer Keil, bronze getönte Glaskuppel,
// schwarze untere Partie, rote Lichtleiste am Heck, weiße Felgen mit schwarzen Klingen-Speichen.
// Seitenansicht, Nase nach rechts. viewBox 420×150, Radaufstandslinie y=146. Kein Logo.
// ---------------------------------------------------------------------------
export const RS = { vbW: 420, vbH: 150, boden: 146, mitte: 88, radstand: 235 };

type RoadsterP = P & {
  t?: number; rad?: number; farbe?: string; fluegel?: boolean;
  /** Düsen 0..1: schub = Heck waagerecht, lift = zwei nach unten, vorn = Bug waagerecht */
  schub?: number; lift?: number; vorn?: number;
};

export const Roadster: React.FC<RoadsterP> = ({ size = 420, glow, style, t = 0, rad = 0, farbe = "#f5f4f0", fluegel, schub = 0, lift = 0, vorn = 0 }) => {
  const uid = React.useId().replace(/:/g, "");
  const k = ink(glow);
  const schwarz = glow ? "rgba(143,216,255,0.10)" : "#26262b";
  const rot = glow ? "#ff8a80" : "#ff3b30";
  const flk = 0.9 + 0.07 * Math.sin(t * 41) + 0.05 * Math.sin(t * 67);
  const strahl = glow ? "rgba(233,248,255," : "rgba(150,220,255,";
  const body = "M 12 64 L 26 60 L 70 57 L 150 43 Q 200 35 238 41 L 294 72 L 398 88 Q 414 92 414 100 L 408 112 L 374 113 A 40 40 0 0 0 296 113 L 140 113 A 40 40 0 0 0 60 113 L 22 113 L 14 92 Z";
  const rad_ = (cx: number) => (
    <g key={cx} transform={`rotate(${rad} ${cx} 115)`}>
      <circle cx={cx} cy={115} r={31} fill={glow ? "#1c2540" : "#1d1d21"} stroke={k} strokeWidth={6} />
      <circle cx={cx} cy={115} r={23} fill={fill(glow, "#ecebe6")} stroke={k} strokeWidth={3} />
      {[0, 60, 120, 180, 240, 300].map((w) => (
        <path key={w} d={`M ${cx + 3} 113 L ${cx + 22} 109 L ${cx + 22} 116 L ${cx + 3} 118 Z`} fill={glow ? C.glow : "#26262b"} opacity={glow ? 0.7 : 1} transform={`rotate(${w} ${cx} 115)`} />
      ))}
      <circle cx={cx} cy={115} r={5} fill={glow ? C.glow : "#26262b"} />
    </g>
  );
  const jetH = (x0: number, dir: number, L: number) => {
    const l = L * flk;
    return (
      <g>
        <path d={`M ${x0} 86 Q ${x0 + dir * l * 0.45} 88 ${x0 + dir * l} 96 Q ${x0 + dir * l * 0.45} 104 ${x0} 106 Z`} fill={`url(#jh${dir > 0 ? "v" : "h"}${uid})`} />
        <path d={`M ${x0} 92 Q ${x0 + dir * l * 0.3} 93 ${x0 + dir * l * 0.6} 96 Q ${x0 + dir * l * 0.3} 99 ${x0} 100 Z`} fill={`${strahl}0.9)`} />
      </g>
    );
  };
  const jetV = (x: number, L: number) => {
    const l = L * flk;
    return (
      <g key={x}>
        <path d={`M ${x - 9} 120 Q ${x - 15} ${120 + l * 0.5} ${x - 4} ${120 + l} L ${x + 4} ${120 + l} Q ${x + 15} ${120 + l * 0.5} ${x + 9} 120 Z`} fill={`url(#jv${uid})`} />
        <path d={`M ${x - 4} 120 L ${x} ${120 + l * 0.55} L ${x + 4} 120 Z`} fill={`${strahl}0.95)`} />
      </g>
    );
  };
  return (
    <svg width={size} height={size * (RS.vbH / RS.vbW)} viewBox={`0 0 ${RS.vbW} ${RS.vbH}`} style={{ overflow: "visible", ...gl(glow), ...style }}>
      <defs>
        <clipPath id={`rb${uid}`}><path d={body} /></clipPath>
        <linearGradient id={`jhh${uid}`} x1="1" x2="0" y1="0" y2="0"><stop offset="0" stopColor={`${strahl}0.95)`} /><stop offset="1" stopColor={`${strahl}0)`} /></linearGradient>
        <linearGradient id={`jhv${uid}`} x1="0" x2="1" y1="0" y2="0"><stop offset="0" stopColor={`${strahl}0.95)`} /><stop offset="1" stopColor={`${strahl}0)`} /></linearGradient>
        <linearGradient id={`jv${uid}`} x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor={`${strahl}0.95)`} /><stop offset="1" stopColor={`${strahl}0)`} /></linearGradient>
      </defs>
      {schub > 0.02 && jetH(12, -1, 150 * schub)}
      {vorn > 0.02 && jetH(412, 1, 110 * vorn)}
      {lift > 0.02 && [168, 262].map((x) => jetV(x, 190 * lift))}
      {/* Karosserie */}
      {glow && <path d={body} fill={C.navyOut} />}
      <path d={body} fill={fill(glow, farbe)} />
      <g clipPath={`url(#rb${uid})`}>
        <path d="M 0 84 L 300 88 L 420 98 L 420 150 L 0 150 Z" fill={glow ? "rgba(143,216,255,0.06)" : "rgba(31,28,26,0.07)"} />
        <path d="M 0 72 L 34 74 L 54 97 L 380 104 L 420 104 L 420 150 L 0 150 Z" fill={schwarz} />
      </g>
      <path d={body} fill="none" stroke={k} strokeWidth={7} strokeLinejoin="round" />
      {/* Glaskuppel (bronze getönt) */}
      <path d="M 96 60 L 152 47 Q 200 40 234 45 L 284 72 L 206 75 L 132 70 Z" fill={glow ? "rgba(143,216,255,0.22)" : "#4f3d30"} stroke={k} strokeWidth={4} strokeLinejoin="round" />
      <path d="M 160 52 Q 200 46 228 49" fill="none" stroke={glow ? C.glow : "#b89572"} strokeWidth={4} strokeLinecap="round" opacity={0.8} />
      {/* Kanten, Türfuge, Spiegel */}
      <path d="M 296 84 L 406 96" stroke={k} strokeWidth={3} opacity={0.35} />
      <path d="M 70 78 L 286 84" stroke={k} strokeWidth={3} opacity={0.3} />
      <path d="M 282 76 L 274 104 M 170 72 L 176 103" stroke={k} strokeWidth={3} opacity={0.45} />
      <path d="M 268 71 L 282 64 L 290 66 L 286 73 Z" fill={fill(glow, farbe)} stroke={k} strokeWidth={4} strokeLinejoin="round" />
      {/* Licht: Frontleiste weiß, Heckleiste rot, Seitenmarker */}
      <path d="M 372 89 L 410 94 L 409 98 L 374 94 Z" fill={glow ? C.glow : "#fffbe6"} stroke={k} strokeWidth={3} strokeLinejoin="round" />
      <path d="M 8 66 L 36 61 L 36 67 L 10 72 Z" fill={rot} stroke={k} strokeWidth={3} strokeLinejoin="round" style={{ filter: glow ? undefined : "drop-shadow(0 0 6px rgba(255,59,48,0.55))" }} />
      <path d="M 44 87 L 58 89" stroke={rot} strokeWidth={5} strokeLinecap="round" />
      {fluegel && (
        <g>
          <path d="M 30 62 L 34 50 M 56 59 L 58 50" stroke={k} strokeWidth={5} />
          <path d="M 2 46 L 70 42 L 72 50 L 4 54 Z" fill={schwarz} stroke={k} strokeWidth={4} strokeLinejoin="round" />
          <path d="M 4 50 L 70 46" stroke={rot} strokeWidth={3} />
        </g>
      )}
      {rad_(100)}
      {rad_(335)}
    </svg>
  );
};

/** Umgedrehte Rampe (Turm mit Überhang) in Bühnen-Koordinaten 1080×1920. Geometrie siehe RampeGeo. */
export type RampeGeo = { cx: number; cy: number; rIn: number; w: number; boden: number; f: number; lippe: number };
const pt = (cx: number, cy: number, r: number, gradDeg: number) => [cx + r * Math.cos((gradDeg * Math.PI) / 180), cy + r * Math.sin((gradDeg * Math.PI) / 180)];

export const Rampe: React.FC<{ g: RampeGeo; glow?: boolean; schrift?: string; style?: React.CSSProperties }> = ({ g, glow, schrift = "AUTO", style }) => {
  const { cx, cy, rIn, w, boden, f, lippe } = g;
  const rOut = rIn + w;
  const xi = cx + rIn, xo = cx + rOut;
  const [lox, loy] = pt(cx, cy, rOut, lippe);
  const [lix, liy] = pt(cx, cy, rIn, lippe);
  const band = `M ${xo} ${boden} L ${xo} ${cy} A ${rOut} ${rOut} 0 0 0 ${lox} ${loy} L ${lix} ${liy} A ${rIn} ${rIn} 0 0 1 ${xi} ${cy} L ${xi} ${boden - f} A ${f} ${f} 0 0 1 ${xi - f} ${boden} Z`;
  const rM = rIn + w * 0.5, rR = rOut - 13;
  const [mx, my] = pt(cx, cy, rM, lippe + 6);
  const [rx, ry] = pt(cx, cy, rR, lippe + 3);
  const mitte = `M ${cx + rM} ${boden - 10} L ${cx + rM} ${cy} A ${rM} ${rM} 0 0 0 ${mx} ${my}`;
  const rand = `M ${cx + rR} ${boden - 8} L ${cx + rR} ${cy} A ${rR} ${rR} 0 0 0 ${rx} ${ry}`;
  const k = ink(glow);
  return (
    <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", left: 0, top: 0, overflow: "visible", ...gl(glow), ...style }}>
      <path d={band} fill={glow ? "rgba(143,216,255,0.12)" : "#f6f4ef"} stroke={k} strokeWidth={7} strokeLinejoin="round" />
      <path d={mitte} fill="none" stroke={glow ? C.glow : "#b9b3a8"} strokeWidth={5} strokeDasharray="26 20" opacity={glow ? 0.6 : 1} />
      <path d={rand} fill="none" stroke={glow ? "#ff8a80" : C.red} strokeWidth={6} strokeDasharray="0 17" strokeLinecap="round" />
      {[0.25, 0.5, 0.75].map((q) => {
        const y = cy + (boden - f - cy) * q;
        return <path key={q} d={`M ${xi + 6} ${y} L ${xo - 20} ${y}`} stroke={glow ? C.glow : C.line} strokeWidth={3} opacity={0.8} />;
      })}
      <text x={xi + w * 0.42} y={cy + (boden - f - cy) * 0.62} fill={k} fontFamily="'IBM Plex Mono', monospace" fontWeight={700} fontSize={w * 0.3} letterSpacing={w * 0.09} textAnchor="middle" transform={`rotate(-90 ${xi + w * 0.42} ${cy + (boden - f - cy) * 0.62})`} dominantBaseline="middle">{schrift}</text>
    </svg>
  );
};

/** Bahn auf der Innenseite der Rampe: s (px) → Aufstandspunkt + Drehung. Startet am Boden bei x0. */
export const rampenBahn = (g: RampeGeo, x0: number, halbRadstand: number) => {
  const { cx, cy, rIn, boden, f } = g;
  const xi = cx + rIn;
  const L0 = xi - f - x0, L1 = (f * Math.PI) / 2, L2 = boden - f - cy;
  const sag = (r: number) => r - Math.sqrt(Math.max(0, r * r - halbRadstand * halbRadstand));
  // Sehnen-Versatz: das Auto steht mit beiden Rädern auf dem Bogen, sanft ein-/ausgeblendet gegen Sprünge
  const bogen = (mcx: number, mcy: number, r: number, th: number, faktor: number) => {
    const rr = r - sag(r) * faktor;
    return { x: mcx + rr * Math.cos(th), y: mcy + rr * Math.sin(th), rot: (th * 180) / Math.PI - 90 };
  };
  const pose = (s: number) => {
    if (s <= L0) return { x: x0 + s, y: boden, rot: 0 };
    s -= L0;
    if (s <= L1) { const u = s / L1; return bogen(xi - f, boden - f, f, (Math.PI / 2) * (1 - u), Math.min(1, u / 0.3, (1 - u) / 0.3)); }
    s -= L1;
    if (s <= L2) return { x: xi, y: boden - f - s, rot: -90 };
    s -= L2;
    const th = -s / rIn;
    return bogen(cx, cy, rIn, th, Math.min(1, s / (rIn * 0.5)));
  };
  return { pose, L0, L1, L2, bisBogen: L0 + L1 + L2, bogenLaenge: (grad: number) => (rIn * grad * Math.PI) / 180 };
};
