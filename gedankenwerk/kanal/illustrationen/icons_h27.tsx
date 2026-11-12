// Illustrationen Folge 27 (Aufzug-Fangbremse). Gleicher Stil wie icons.tsx; glow = Röntgen-Fassung.
// Keine Logos: Elisha Otis nur als neutrale Silhouette (Zylinderhut, Bart), kein Firmenzeichen.
import React from "react";
import { C } from "../../basis/lib";

type P = { size?: number; glow?: boolean; style?: React.CSSProperties };
const ink = (g?: boolean) => (g ? C.glow : C.ink);
const fill = (g: boolean | undefined, f: string) => (g ? "rgba(143,216,255,0.2)" : f);
const gl = (g?: boolean): React.CSSProperties => (g ? { filter: "drop-shadow(0 0 14px rgba(143,216,255,0.45)) drop-shadow(0 0 3px rgba(143,216,255,0.8))" } : {});
const DUNKEL = "#2b2a2e";

// ---------------------------------------------------------------------------
// Aufzugskabine (Vorderansicht). viewBox 300 × 380; Führungsschuhe ragen 40 Einheiten links/rechts heraus.
// ---------------------------------------------------------------------------
export const KAB = { vbW: 300, vbH: 380, schuh: 40 };
export const Kabine: React.FC<P & { licht?: number }> = ({ size = 300, glow, style, licht = 1 }) => (
  <svg width={size} height={(size * KAB.vbH) / KAB.vbW} viewBox="0 0 300 380" style={{ overflow: "visible", ...gl(glow), ...style }}>
    {/* Führungsschuhe */}
    {[[-40, 40], [-40, 300], [300, 40], [300, 300]].map(([x, y], i) => (
      <rect key={i} x={x} y={y} width={40} height={50} rx={6} fill={fill(glow, "#6b7480")} stroke={ink(glow)} strokeWidth={6} />
    ))}
    {/* Tragrahmen + Seilöse */}
    <circle cx={150} cy={4} r={14} fill="none" stroke={ink(glow)} strokeWidth={7} />
    <rect x={-6} y={14} width={312} height={28} rx={8} fill={fill(glow, "#3b4049")} stroke={ink(glow)} strokeWidth={7} />
    {/* Korb */}
    <rect x={10} y={42} width={280} height={330} rx={12} fill={fill(glow, "#3b4049")} stroke={ink(glow)} strokeWidth={8} />
    {/* Anzeige mit Pfeil */}
    <rect x={110} y={56} width={80} height={22} rx={6} fill={glow ? "rgba(143,216,255,0.1)" : "#26303d"} stroke={ink(glow)} strokeWidth={4} />
    <path d="M150 60 L160 74 L140 74 Z" fill={glow ? C.glow : C.yellow} opacity={licht} />
    {/* Türen */}
    <rect x={28} y={90} width={120} height={268} rx={4} fill={fill(glow, C.steel)} stroke={ink(glow)} strokeWidth={6} />
    <rect x={152} y={90} width={120} height={268} rx={4} fill={fill(glow, C.steel)} stroke={ink(glow)} strokeWidth={6} />
    {!glow && (
      <g stroke="#ffffff" strokeWidth={8} strokeLinecap="round" opacity={0.65}>
        <line x1={56} y1={116} x2={56} y2={330} />
        <line x1={180} y1={116} x2={180} y2={330} />
      </g>
    )}
  </svg>
);

// ---------------------------------------------------------------------------
// Elisha Otis als Büste (neutrale Silhouette: Zylinder, Bart, kein Gesicht). viewBox 300 × 340.
// umriss = nur gestrichelte Kontur (Unbekannter, bevor der Name fällt).
// ---------------------------------------------------------------------------
export const OtisBueste: React.FC<P & { umriss?: boolean }> = ({ size = 300, glow, style, umriss }) => {
  const st = umriss
    ? { fill: "rgba(31,28,26,0.05)", stroke: C.ink, strokeWidth: 6, strokeDasharray: "18 12", opacity: 0.55 }
    : { stroke: ink(glow), strokeWidth: 7, strokeLinejoin: "round" as const };
  const f = (farbe: string) => (umriss ? "rgba(31,28,26,0.04)" : fill(glow, farbe));
  return (
    <svg width={size} height={(size * 340) / 300} viewBox="0 0 300 340" style={{ overflow: "visible", ...gl(glow), ...style }}>
      {/* Mantel */}
      <path d="M22 340 Q 30 232 108 214 L 192 214 Q 270 232 278 340 Z" {...st} fill={f(DUNKEL)} />
      {!umriss && <path d="M128 214 L150 270 L172 214 Z" fill={glow ? "rgba(143,216,255,0.35)" : "#f6f3ec"} stroke={ink(glow)} strokeWidth={5} />}
      {/* Kopf */}
      <ellipse cx={150} cy={150} rx={54} ry={62} {...st} fill={f("#6a5f5c")} />
      {/* Bart (Kranz um Kinn und Wangen) */}
      <path d="M98 150 Q 96 246 150 262 Q 204 246 202 150 Q 186 200 150 202 Q 114 200 98 150 Z" {...st} fill={f(DUNKEL)} />
      {/* Zylinder */}
      <rect x={104} y={8} width={92} height={88} rx={6} {...st} fill={f("#26232a")} />
      {!umriss && <rect x={104} y={72} width={92} height={14} fill={glow ? "rgba(143,216,255,0.4)" : "#7a6450"} />}
      <rect x={74} y={92} width={152} height={18} rx={9} {...st} fill={f("#26232a")} />
    </svg>
  );
};

/** Otis stehend (Silhouette mit Zylinder und Bart). viewBox 120 × 300, size = Breite. arm 0..1 hebt den rechten Arm. */
export const Herr: React.FC<P & { arm?: number }> = ({ size = 120, glow, style, arm = 0 }) => (
  <svg width={size} height={(size * 300) / 120} viewBox="0 0 120 300" style={{ overflow: "visible", ...gl(glow), ...style }}>
    <g fill={fill(glow, DUNKEL)} stroke={ink(glow)} strokeWidth={5} strokeLinejoin="round">
      {/* Arm (hinter dem Körper) */}
      <g transform={`rotate(${-150 * arm} 84 96)`}>
        <path d="M80 92 L 96 172 L 84 176 L 70 98 Z" />
      </g>
      {/* Körper / Gehrock */}
      <path d="M34 92 Q 60 82 86 92 L 92 200 L 76 200 L 74 296 L 62 296 L 60 214 L 58 296 L 46 296 L 44 200 L 28 200 Z" />
      {/* Kopf + Bart */}
      <circle cx={60} cy={62} r={20} fill={fill(glow, "#6a5f5c")} />
      <path d="M41 62 Q 40 96 60 100 Q 80 96 79 62 Q 72 80 60 80 Q 48 80 41 62 Z" />
      {/* Zylinder */}
      <rect x={42} y={2} width={36} height={40} rx={3} />
      <rect x={32} y={38} width={56} height={9} rx={4} />
    </g>
  </svg>
);

/** Axt. viewBox 220 × 220, Drehpunkt am Stielende (30, 200). */
export const AxtG: React.FC = () => (
  <g>
    <line x1={30} y1={200} x2={160} y2={44} stroke={C.ink} strokeWidth={26} strokeLinecap="round" />
    <line x1={30} y1={200} x2={160} y2={44} stroke="#b98a5e" strokeWidth={14} strokeLinecap="round" />
    <path d="M128 40 L 176 6 Q 214 40 204 104 L 158 82 Z" fill={C.steel} stroke={C.ink} strokeWidth={7} strokeLinejoin="round" />
    <path d="M180 14 Q 208 46 200 96" fill="none" stroke="#ffffff" strokeWidth={6} strokeLinecap="round" opacity={0.8} />
  </g>
);
export const Axt: React.FC<P> = ({ size = 220, style }) => (
  <svg width={size} height={size} viewBox="0 0 220 220" style={{ overflow: "visible", ...style }}>
    <AxtG />
  </svg>
);

/** Publikum: Reihe von Köpfen (einige mit Hut). lift 0..1 hebt die Köpfe leicht (Staunen). */
export const Publikum: React.FC<{ w: number; lift?: number; n?: number }> = ({ w, lift = 0, n = 11 }) => {
  const farben = ["#4a4652", "#5d5866", "#3e3a44"];
  return (
    <svg width={w} height={180} viewBox={`0 0 ${w} 180`} style={{ overflow: "visible" }}>
      {Array.from({ length: n }).map((_, i) => {
        const x = ((i + 0.5) * w) / n;
        const r = 26 + ((i * 7) % 3) * 4;
        const y = 92 + ((i * 5) % 3) * 10 - (i % 2 ? 12 : 8) * lift;
        const f = farben[i % 3];
        return (
          <g key={i} stroke={C.ink} strokeWidth={5} strokeLinejoin="round">
            <path d={`M${x - 46} 180 Q ${x - 44} ${y + r + 8} ${x} ${y + r + 4} Q ${x + 44} ${y + r + 8} ${x + 46} 180 Z`} fill={f} />
            <circle cx={x} cy={y} r={r} fill={f} />
            {i % 3 === 0 && (
              <>
                <rect x={x - 18} y={y - r - 36} width={36} height={40} rx={3} fill="#26232a" />
                <rect x={x - 28} y={y - r + 0} width={56} height={9} rx={4} fill="#26232a" />
              </>
            )}
            {i % 3 === 1 && <path d={`M${x - 26} ${y - r + 12} Q ${x} ${y - r - 30} ${x + 26} ${y - r + 12} Z`} fill="#26232a" />}
          </g>
        );
      })}
    </svg>
  );
};

// ---------------------------------------------------------------------------
// Röntgen-Mechanik
// ---------------------------------------------------------------------------
/** Führungsschiene (senkrecht). zahn 0..1 = Sägezähne an der Innenseite; bolzen = Markierungen, die beim Fahren wandern. */
export const Schiene: React.FC<{
  x: number; y: number; h: number; w?: number; seite: "l" | "r"; zahn?: number; z0?: number; tz?: number; bolzen?: number; glow?: boolean; p?: number; kontakt?: number[];
}> = ({ x, y, h, w = 60, seite, zahn = 0, z0 = 0, tz = 64, bolzen, glow = true, p = 1, kontakt = [] }) => {
  const innen = seite === "l" ? w : 0; // Innenkante (zum Schacht hin) in lokalen Koordinaten
  const dir = seite === "l" ? 1 : -1;
  const tiefe = 40 * zahn;
  const hh = h * p;
  const zaehne: string[] = [];
  if (zahn > 0.01) {
    for (let yk = (((z0 - y) % tz) + tz) % tz; yk < h; yk += tz) {
      if (yk + tz > hh + 1) continue;
      zaehne.push(`M${innen} ${yk} L${innen + dir * tiefe} ${yk} L${innen} ${yk + tz - 6} Z`);
    }
  }
  if (hh < 1) return null;
  const bz: number[] = [];
  if (bolzen !== undefined) {
    const off = ((bolzen % 92) + 92) % 92;
    for (let yb = off - 92; yb < hh; yb += 92) if (yb > 6 && yb < hh - 6) bz.push(yb);
  }
  return (
    <svg width={w + 60} height={h} viewBox={`${seite === "l" ? 0 : -60} 0 ${w + 60} ${h}`}
      style={{ position: "absolute", left: seite === "l" ? x : x - 60, top: y, overflow: "visible", ...gl(glow) }}>
      <rect x={0} y={0} width={w} height={hh} rx={6} fill={glow ? "rgba(143,216,255,0.22)" : C.steel} stroke={ink(glow)} strokeWidth={6} />
      {zaehne.map((d, i) => <path key={i} d={d} fill={glow ? "rgba(143,216,255,0.32)" : C.steel} stroke={ink(glow)} strokeWidth={5} strokeLinejoin="round" />)}
      {bz.map((yb, i) => <rect key={i} x={w / 2 - 10} y={yb - 5} width={20} height={10} rx={4} fill={ink(glow)} opacity={0.75} />)}
      {kontakt.map((yk, i) => <rect key={`k${i}`} x={seite === "l" ? w - 10 : 0} y={yk - y - 40} width={10} height={80} rx={5} fill="#ffd27a" />)}
    </svg>
  );
};

/** Geschwindigkeitsbegrenzer: Seilscheibe mit Speichen. winkel in Grad, farbe für Kontur (amber bei Sperre). viewBox 240 × 240. */
export const Begrenzer: React.FC<P & { winkel?: number; farbe?: string }> = ({ size = 220, glow = true, style, winkel = 0, farbe }) => {
  const k = farbe ?? ink(glow);
  return (
    <svg width={size} height={size} viewBox="0 0 240 240" style={{ overflow: "visible", ...gl(glow), ...style }}>
      <circle cx={120} cy={120} r={108} fill={glow ? "rgba(143,216,255,0.16)" : C.steel} stroke={k} strokeWidth={9} />
      <circle cx={120} cy={120} r={88} fill="none" stroke={k} strokeWidth={5} />
      <g transform={`rotate(${winkel} 120 120)`}>
        {[0, 60, 120, 180, 240, 300].map((a) => (
          <line key={a} x1={120} y1={120} x2={120 + 84 * Math.cos((a * Math.PI) / 180)} y2={120 + 84 * Math.sin((a * Math.PI) / 180)} stroke={k} strokeWidth={10} strokeLinecap="round" />
        ))}
        <circle cx={120 + 70} cy={120} r={13} fill="#ffd27a" />
      </g>
      <circle cx={120} cy={120} r={24} fill={glow ? C.navyIn : C.ink} stroke={k} strokeWidth={7} />
    </svg>
  );
};

/** Tacho (Halbkreis). wert 0..1 = Zeigerstellung; grün → gelb → rot. viewBox 260 × 160. */
export const Tacho: React.FC<P & { wert?: number }> = ({ size = 260, glow = true, style, wert = 0 }) => {
  const cx = 130, cy = 140, r = 108;
  const pt = (w: number, rr: number) => {
    const a = Math.PI + w * Math.PI;
    return `${cx + rr * Math.cos(a)} ${cy + rr * Math.sin(a)}`;
  };
  const bogen = (a: number, b: number) => `M${pt(a, r)} A ${r} ${r} 0 0 1 ${pt(b, r)}`;
  const zeiger = pt(Math.min(1, Math.max(0, wert)), 92);
  return (
    <svg width={size} height={(size * 160) / 260} viewBox="0 0 260 160" style={{ overflow: "visible", ...gl(glow), ...style }}>
      <path d={`M${cx - 126} ${cy} A 126 126 0 0 1 ${cx + 126} ${cy} Z`} fill={glow ? "rgba(26,33,56,0.9)" : "#fffdf8"} stroke={ink(glow)} strokeWidth={7} />
      <path d={bogen(0.02, 0.55)} fill="none" stroke="#6fe0a0" strokeWidth={18} />
      <path d={bogen(0.55, 0.75)} fill="none" stroke="#ffd27a" strokeWidth={18} />
      <path d={bogen(0.75, 0.98)} fill="none" stroke="#ff7b6e" strokeWidth={18} />
      <line x1={cx} y1={cy} x2={zeiger.split(" ")[0]} y2={zeiger.split(" ")[1]} stroke="#eaf7ff" strokeWidth={9} strokeLinecap="round" />
      <circle cx={cx} cy={cy} r={14} fill="#eaf7ff" />
    </svg>
  );
};

/** Schalter (Wippe). an 0..1 kippt die Wippe. viewBox 200 × 240. */
export const Schalter: React.FC<P & { an?: number }> = ({ size = 160, glow = true, style, an = 0 }) => (
  <svg width={size} height={(size * 240) / 200} viewBox="0 0 200 240" style={{ overflow: "visible", ...gl(glow), ...style }}>
    <rect x={14} y={14} width={172} height={212} rx={24} fill={fill(glow, "#fffdf8")} stroke={ink(glow)} strokeWidth={8} />
    <g transform={`translate(100 120) scale(1 ${1 - 0.08 * an}) translate(-100 -120)`}>
      <rect x={58} y={54} width={84} height={132} rx={14} fill={glow ? "rgba(143,216,255,0.3)" : C.steel} stroke={ink(glow)} strokeWidth={7} />
      <rect x={58} y={an > 0.5 ? 54 : 120} width={84} height={66} rx={14} fill={glow ? "rgba(143,216,255,0.55)" : "#ffffff"} stroke={ink(glow)} strokeWidth={7} />
    </g>
    <text x={100} y={44} textAnchor="middle" fontFamily="monospace" fontWeight={700} fontSize={26} fill={ink(glow)}>I</text>
    <text x={100} y={216} textAnchor="middle" fontFamily="monospace" fontWeight={700} fontSize={26} fill={ink(glow)}>O</text>
  </svg>
);

// ---------------------------------------------------------------------------
// Übertrag: Lkw-Federspeicher, Zug
// ---------------------------------------------------------------------------
/** Lkw (Seitenansicht). rad = Drehwinkel der Räder in Grad. viewBox 380 × 210. */
export const Lkw: React.FC<P & { rad?: number }> = ({ size = 380, style, rad = 0 }) => (
  <svg width={size} height={(size * 210) / 380} viewBox="0 0 380 210" style={{ overflow: "visible", ...style }}>
    <rect x={10} y={18} width={240} height={132} rx={8} fill="#fffdf8" stroke={C.ink} strokeWidth={7} />
    <path d="M256 150 L256 62 Q 256 50 268 50 L 322 50 Q 344 50 352 72 L 366 112 L 366 150 Z" fill={C.red} stroke={C.ink} strokeWidth={7} strokeLinejoin="round" />
    <path d="M290 62 L 326 62 Q 338 62 342 74 L 350 102 L 290 102 Z" fill="#bfe0f4" stroke={C.ink} strokeWidth={5} strokeLinejoin="round" />
    <rect x={10} y={150} width={356} height={14} rx={5} fill={C.ink} />
    {[64, 200, 318].map((x) => (
      <g key={x} transform={`rotate(${rad} ${x} 172)`}>
        <circle cx={x} cy={172} r={30} fill="#3b4049" stroke={C.ink} strokeWidth={6} />
        <circle cx={x} cy={172} r={12} fill={C.steel} />
        <line x1={x} y1={148} x2={x} y2={160} stroke={C.steel} strokeWidth={6} strokeLinecap="round" />
      </g>
    ))}
  </svg>
);

/** Federspeicher-Zylinder im Schnitt: Feder drückt den Kolben → Backe an die Trommel; Druckluft schiebt zurück.
 *  kolben 0 = Bremse zu, 1 = auf. luft 0..1 = Luft in der Kammer. feder 0..1 = Feder hervorgehoben. viewBox 820 × 220. */
export const Federspeicher: React.FC<{ w?: number; kolben: number; luft: number; feder?: number; kontakt?: number }> = ({ w = 820, kolben, luft, feder = 0, kontakt = 0 }) => {
  const px = 384 - 100 * kolben;
  const n = 7;
  const x0 = 40, x1 = px - 6;
  const pts = Array.from({ length: n * 2 + 1 }).map((_, i) => `${x0 + ((x1 - x0) * i) / (n * 2)} ${i === 0 || i === n * 2 ? 120 : i % 2 ? 66 : 174}`);
  return (
    <svg width={w} height={(w * 220) / 820} viewBox="0 0 820 220" style={{ overflow: "visible" }}>
      {/* Luftleitung */}
      <path d="M470 40 L 470 8 L 560 8" fill="none" stroke={C.ink} strokeWidth={10} strokeLinecap="round" />
      {/* Zylinder */}
      <rect x={20} y={40} width={500} height={160} rx={18} fill="#fffdf8" stroke={C.ink} strokeWidth={7} />
      {/* Luftkammer */}
      <rect x={px + 22} y={47} width={Math.max(0, 491 - px - 22)} height={146} rx={10} fill="#7fc0ec" opacity={0.85 * luft} />
      {/* Feder */}
      <polyline points={pts.join(" ")} fill="none" stroke={C.ink} strokeWidth={13} strokeLinejoin="round" />
      <polyline points={pts.join(" ")} fill="none" stroke={feder > 0.01 ? C.yellow : "#a8a29a"} strokeWidth={6} strokeLinejoin="round" />
      {/* Kolben + Stange */}
      <rect x={px} y={50} width={22} height={140} rx={6} fill="#6b7480" stroke={C.ink} strokeWidth={6} />
      <rect x={px + 22} y={110} width={278} height={20} rx={6} fill="#6b7480" stroke={C.ink} strokeWidth={5} />
      {/* Bremsbacke + Trommel */}
      <rect x={px + 290} y={70} width={26} height={100} rx={8} fill={C.red} stroke={C.ink} strokeWidth={6} />
      <circle cx={760} cy={120} r={52} fill="#6b7480" stroke={C.ink} strokeWidth={7} />
      <circle cx={760} cy={120} r={16} fill={C.ink} />
      {kontakt > 0.01 && <rect x={700} y={78} width={10} height={84} rx={5} fill={C.yellow} opacity={kontakt} />}
    </svg>
  );
};

/** Lok (Frontansicht). viewBox 240 × 280. */
export const Lok: React.FC<P> = ({ size = 240, style }) => (
  <svg width={size} height={(size * 280) / 240} viewBox="0 0 240 280" style={{ overflow: "visible", ...style }}>
    <path d="M28 250 L 28 70 Q 28 28 72 24 L 168 24 Q 212 28 212 70 L 212 250 Z" fill={C.red} stroke={C.ink} strokeWidth={8} strokeLinejoin="round" />
    <path d="M48 64 Q 48 48 66 48 L 174 48 Q 192 48 192 64 L 192 128 L 48 128 Z" fill="#26303d" stroke={C.ink} strokeWidth={6} />
    <path d="M64 116 L 100 60" stroke="#ffffff" strokeWidth={8} strokeLinecap="round" opacity={0.5} />
    <rect x={28} y={200} width={184} height={16} fill="#fffdf8" />
    <circle cx={66} cy={170} r={16} fill={C.yellow} stroke={C.ink} strokeWidth={5} />
    <circle cx={174} cy={170} r={16} fill={C.yellow} stroke={C.ink} strokeWidth={5} />
    <rect x={20} y={250} width={200} height={22} rx={6} fill={C.ink} />
  </svg>
);

// ---------------------------------------------------------------------------
// Haus im Querschnitt: Dachkammer oben (Kerze, Flicken) → Penthouse; unten Kronleuchter. viewBox 540 × 840.
// ---------------------------------------------------------------------------
export const Haus: React.FC<{
  size?: number; kammer?: number; pent?: number; krone?: number; treppe?: number; schacht?: number; kab?: number; hlOben?: number; hlUnten?: number;
}> = ({ size = 540, kammer = 0, pent = 0, krone = 0, treppe = 0, schacht = 0, kab = 0, hlOben = 0, hlUnten = 0 }) => {
  const m = (a: number, b: number) => a + (b - a) * pent;
  const dach = `M${m(0, 22)} 280 L${m(76, 22)} 40 L${m(464, 518)} 40 L${m(540, 518)} 280 Z`;
  const etagen = [280, 420, 560, 700];
  return (
    <svg width={size} height={(size * 840) / 540} viewBox="0 0 540 840" style={{ overflow: "visible" }}>
      {/* Etagen */}
      {etagen.map((y, i) => (
        <g key={y}>
          <rect x={0} y={y} width={540} height={140} fill={i >= 2 ? "#f3e6cf" : "#efe9de"} stroke={C.ink} strokeWidth={7} />
          {[150, 300].map((wx) => <rect key={wx} x={wx} y={y + 30} width={70} height={80} rx={4} fill="#bfe0f4" stroke={C.ink} strokeWidth={5} />)}
        </g>
      ))}
      {/* Kronleuchter (Beletage) */}
      {krone > 0.01 && (
        <g opacity={krone} transform={`translate(420 560)`}>
          <line x1={0} y1={0} x2={0} y2={34} stroke={C.ink} strokeWidth={5} />
          <path d="M-40 40 Q 0 74 40 40" fill="none" stroke={C.ink} strokeWidth={6} />
          {[-40, 0, 40].map((x) => <circle key={x} cx={x} cy={x === 0 ? 58 : 40} r={9} fill={C.yellow} stroke={C.ink} strokeWidth={4} />)}
          <circle cx={0} cy={48} r={70} fill="rgba(241,201,74,0.25)" />
        </g>
      )}
      {/* Treppenhaus */}
      {treppe > 0.01 && (
        <path d="M30 830 L 30 790 L 70 790 L 70 750 L 110 750 L 110 700 M30 690 L 30 650 L 70 650 L 70 610 L 110 610 L 110 560 M30 550 L 30 510 L 70 510 L 70 470 L 110 470 L 110 420 M30 410 L 30 370 L 70 370 L 70 330 L 110 330 L 110 280"
          fill="none" stroke={C.ink} strokeWidth={7} strokeLinejoin="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - treppe} />
      )}
      {/* Dach / Dachkammer → Penthouse */}
      <path d={dach} fill={pent > 0.5 ? "#cfe8f6" : "#e3d6bd"} stroke={C.ink} strokeWidth={8} strokeLinejoin="round" />
      {pent < 0.5 && <path d={dach} fill="none" stroke="#9a5b4a" strokeWidth={22} strokeLinejoin="round" opacity={1 - pent * 2} style={{ clipPath: "inset(0 0 4px 0)" }} />}
      {pent > 0.01 && (
        <g opacity={pent}>
          {[120, 220, 320, 420].map((x) => <line key={x} x1={x} y1={44} x2={x} y2={276} stroke={C.ink} strokeWidth={5} />)}
          <path d="M40 64 L 140 64" stroke="#ffffff" strokeWidth={10} strokeLinecap="round" opacity={0.7} />
          {/* Pflanze */}
          <rect x={360} y={226} width={44} height={50} rx={6} fill="#b98a5e" stroke={C.ink} strokeWidth={5} />
          <path d="M382 226 Q 350 170 362 140 M382 226 Q 382 160 392 128 M382 226 Q 414 176 420 150" fill="none" stroke={C.green} strokeWidth={12} strokeLinecap="round" />
        </g>
      )}
      {/* Dachkammer: Kerze + Flicken */}
      {kammer > 0.01 && pent < 0.5 && (
        <g opacity={kammer * (1 - pent * 2)}>
          <rect x={230} y={150} width={56} height={44} fill="#d9c7a4" stroke={C.ink} strokeWidth={4} transform="rotate(-6 258 172)" />
          <path d="M236 160 L 280 186 M238 186 L 278 158" stroke={C.ink} strokeWidth={3} />
          <rect x={346} y={222} width={18} height={50} fill="#fffdf8" stroke={C.ink} strokeWidth={4} />
          <path d="M355 220 Q 344 204 355 188 Q 366 204 355 220 Z" fill={C.yellow} stroke={C.ink} strokeWidth={3} />
          <rect x={150} y={250} width={140} height={22} rx={6} fill="#8a837b" stroke={C.ink} strokeWidth={4} />
        </g>
      )}
      {/* Aufzugsschacht + Kabine */}
      {schacht > 0.01 && (
        <g opacity={schacht}>
          <rect x={452} y={44} width={70} height={792} fill="rgba(61,143,209,0.18)" stroke="#3d8fd1" strokeWidth={6} strokeDasharray="14 8" />
          <rect x={458} y={748 - kab * 640} width={58} height={84} rx={6} fill="#3b4049" stroke={C.ink} strokeWidth={5} />
          <rect x={466} y={760 - kab * 640} width={42} height={64} rx={3} fill={C.steel} />
        </g>
      )}
      {/* Markierungen */}
      {hlOben > 0.01 && <path d={dach} fill="none" stroke={C.red} strokeWidth={12} opacity={hlOben} strokeLinejoin="round" />}
      {hlUnten > 0.01 && <rect x={0} y={560} width={540} height={280} fill="none" stroke={C.yellow} strokeWidth={12} opacity={hlUnten} />}
    </svg>
  );
};

/** Elektromotor mit Seilscheibe. viewBox 320 × 240. */
export const Motor: React.FC<P> = ({ size = 320, style }) => (
  <svg width={size} height={(size * 240) / 320} viewBox="0 0 320 240" style={{ overflow: "visible", ...style }}>
    <rect x={30} y={196} width={230} height={26} rx={6} fill="#3b4049" stroke={C.ink} strokeWidth={6} />
    <rect x={40} y={52} width={190} height={146} rx={30} fill="#5b8fc7" stroke={C.ink} strokeWidth={8} />
    {[78, 108, 138, 168, 198].map((x) => <line key={x} x1={x} y1={64} x2={x} y2={186} stroke={C.ink} strokeWidth={5} opacity={0.6} />)}
    <rect x={226} y={92} width={30} height={66} rx={8} fill="#3b4049" stroke={C.ink} strokeWidth={6} />
    <circle cx={286} cy={125} r={34} fill={C.steel} stroke={C.ink} strokeWidth={7} />
    <circle cx={286} cy={125} r={10} fill={C.ink} />
  </svg>
);

/** Fangbremse als Symbol: Zahnschiene + eingerasteter Haken. viewBox 240 × 340. */
export const Fangbremse: React.FC<P> = ({ size = 240, glow, style }) => (
  <svg width={size} height={(size * 340) / 240} viewBox="0 0 240 340" style={{ overflow: "visible", ...gl(glow), ...style }}>
    <rect x={20} y={0} width={56} height={340} rx={8} fill={fill(glow, C.steel)} stroke={ink(glow)} strokeWidth={7} />
    {[20, 90, 160, 230].map((y) => <path key={y} d={`M76 ${y} L 116 ${y} L 76 ${y + 64} Z`} fill={fill(glow, C.steel)} stroke={ink(glow)} strokeWidth={6} strokeLinejoin="round" />)}
    <path d="M206 120 L 104 150 L 98 166 L 120 168 L 214 140 Z" fill={glow ? "rgba(255,210,122,0.5)" : C.yellow} stroke={ink(glow)} strokeWidth={7} strokeLinejoin="round" />
    <circle cx={208} cy={130} r={16} fill={fill(glow, "#3b4049")} stroke={ink(glow)} strokeWidth={6} />
  </svg>
);

/** Gerissenes Seil (zwei ausgefranste Enden mit Lücke). viewBox 70 × 200. */
export const SeilRiss: React.FC<P> = ({ size = 70, glow, style }) => {
  const d = "M35 0 L35 60 M35 60 L20 82 M35 60 L36 86 M35 60 L52 80 M35 200 L35 134 M35 134 L18 114 M35 134 L36 108 M35 134 L52 116";
  return (
    <svg width={size} height={(size * 200) / 70} viewBox="0 0 70 200" style={{ overflow: "visible", ...gl(glow), ...style }}>
      <path d={d} fill="none" stroke={ink(glow)} strokeWidth={16} strokeLinecap="round" />
      <path d={d} fill="none" stroke={glow ? "#eaf7ff" : "#9aa2ac"} strokeWidth={7} strokeLinecap="round" />
    </svg>
  );
};
