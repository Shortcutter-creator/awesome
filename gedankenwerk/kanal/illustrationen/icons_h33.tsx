// Illustrationen Folge 33 (Mikrowelle schüttelt statt erhitzt). Gleicher Stil wie icons.tsx; glow = Röntgen-Fassung.
// Alles als <g> in Bild-Koordinaten (1080 × 1920), damit Gerät, Schüssel und Moleküle in EINEM svg zusammenspielen.
// Keine Hersteller-Logos, keine echten Personen (Strichfiguren aus icons_h28).
import React from "react";
import { C, HEAD, MONO } from "../../basis/lib";

export const ink = (g?: boolean) => (g ? C.glow : C.ink);
export const fill = (g: boolean | undefined, f: string) => (g ? "rgba(143,216,255,0.2)" : f);
export const GLOW_FILTER = "drop-shadow(0 0 12px rgba(143,216,255,0.45)) drop-shadow(0 0 3px rgba(143,216,255,0.8))";
export const HEISS = "#ff6a3d";
export const KALT = "#5fb4ff";
export const AMBER = "#ffd27a";
export const SCHOKO = "#6b3f26";
export const ERDNUSS = "#d8a868";
export const SPEISE = "#f0b45a"; // Essen (Eintopf/Nudeln) neutral

// ---------------------------------------------------------------------------
// Mikrowelle von vorne. Lokale Maße 780 × 490 (Ursprung oben links), s skaliert.
// Fenster (40,40)–(540,450); Kinder werden in Fenster-Koordinaten (0..500 × 0..410) gezeichnet und geclippt.
// ---------------------------------------------------------------------------
export const MW = { w: 780, h: 490, fx: 40, fy: 40, fw: 500, fh: 410 };
export const Mikro: React.FC<{
  x: number; y: number; s?: number; id: string; licht?: number; anzeige?: string; glow?: boolean; children?: React.ReactNode;
}> = ({ x, y, s = 1, id, licht = 1, anzeige = "", glow, children }) => {
  const k = ink(glow);
  const innen = glow ? "rgba(26,33,56,0.6)" : licht > 0.5 ? "#f4dd94" : "#3b4049";
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <defs>
        <clipPath id={`${id}-f`}><rect x={MW.fx} y={MW.fy} width={MW.fw} height={MW.fh} rx={18} /></clipPath>
        <pattern id={`${id}-gitter`} width={14} height={14} patternUnits="userSpaceOnUse">
          <circle cx={7} cy={7} r={2.6} fill={glow ? C.glow : C.ink} opacity={glow ? 0.35 : 0.22} />
        </pattern>
      </defs>
      {/* Füße */}
      <rect x={40} y={MW.h - 6} width={60} height={22} rx={6} fill={k} />
      <rect x={MW.w - 100} y={MW.h - 6} width={60} height={22} rx={6} fill={k} />
      <rect x={0} y={0} width={MW.w} height={MW.h} rx={28} fill={fill(glow, "#ffffff")} stroke={k} strokeWidth={9} />
      <rect x={MW.fx} y={MW.fy} width={MW.fw} height={MW.fh} rx={18} fill={innen} stroke="none" />
      <g clipPath={`url(#${id}-f)`}>
        <g transform={`translate(${MW.fx} ${MW.fy})`}>{children}</g>
        <rect x={MW.fx} y={MW.fy} width={MW.fw} height={MW.fh} fill={`url(#${id}-gitter)`} />
      </g>
      <rect x={MW.fx} y={MW.fy} width={MW.fw} height={MW.fh} rx={18} fill="none" stroke={k} strokeWidth={8} />
      {/* Griff + Bedienfeld */}
      <rect x={560} y={70} width={22} height={350} rx={11} fill={fill(glow, C.steel)} stroke={k} strokeWidth={6} />
      <rect x={610} y={60} width={140} height={70} rx={12} fill={glow ? "rgba(26,33,56,0.8)" : "#26303a"} stroke={k} strokeWidth={6} />
      <text x={680} y={110} textAnchor="middle" fontFamily={MONO} fontWeight={700} fontSize={40} fill={glow ? C.glow : "#7dff9e"}>{anzeige}</text>
      <circle cx={680} cy={220} r={42} fill={fill(glow, C.paper2)} stroke={k} strokeWidth={7} />
      <line x1={680} y1={220} x2={680} y2={186} stroke={k} strokeWidth={7} strokeLinecap="round" />
      <circle cx={680} cy={330} r={42} fill={fill(glow, C.paper2)} stroke={k} strokeWidth={7} />
      <line x1={680} y1={330} x2={706} y2={308} stroke={k} strokeWidth={7} strokeLinecap="round" />
      <rect x={630} y={400} width={100} height={36} rx={10} fill={fill(glow, C.paper2)} stroke={k} strokeWidth={6} />
    </g>
  );
};

/** Schüssel von der Seite, Mittelpunkt der Essensoberfläche (cx, cy), Radius r. rand/mitte färben die Oberfläche (heiß/kalt). */
export const Schuessel: React.FC<{ cx: number; cy: number; r: number; id: string; rand?: number; mitte?: number; glow?: boolean; teller?: boolean }> = ({
  cx, cy, r, id, rand = 0, mitte = 0, glow, teller = true,
}) => {
  const k = ink(glow);
  const sw = Math.max(4, r * 0.06);
  const mix = (a: string, b: string, p: number) => {
    const h = (s: string) => [1, 3, 5].map((i) => parseInt(s.slice(i, i + 2), 16));
    const A = h(a), B = h(b);
    return `rgb(${A.map((v, i) => Math.round(v + (B[i] - v) * p)).join(",")})`;
  };
  const randF = mix(SPEISE, HEISS, rand);
  const mitteF = mix(SPEISE, "#bfe6ff", mitte);
  return (
    <g>
      <defs>
        <radialGradient id={`${id}-o`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={mitteF} />
          <stop offset="45%" stopColor={mitteF} />
          <stop offset="80%" stopColor={randF} />
          <stop offset="100%" stopColor={randF} />
        </radialGradient>
      </defs>
      {teller && <ellipse cx={cx} cy={cy + r * 0.86} rx={r * 1.45} ry={r * 0.26} fill={glow ? "rgba(143,216,255,0.12)" : "rgba(255,255,255,0.75)"} stroke={k} strokeWidth={sw * 0.8} />}
      <path d={`M${cx - r} ${cy} C ${cx - r} ${cy + r * 0.9}, ${cx + r} ${cy + r * 0.9}, ${cx + r} ${cy} Z`} fill={fill(glow, "#ffffff")} stroke={k} strokeWidth={sw} strokeLinejoin="round" />
      <path d={`M${cx - r * 0.82} ${cy + r * 0.32} C ${cx - r * 0.5} ${cy + r * 0.5}, ${cx + r * 0.5} ${cy + r * 0.5}, ${cx + r * 0.82} ${cy + r * 0.32}`} fill="none" stroke={glow ? C.glow : C.red} strokeWidth={sw * 0.9} opacity={0.8} />
      <ellipse cx={cx} cy={cy} rx={r} ry={r * 0.3} fill={glow ? "rgba(143,216,255,0.25)" : `url(#${id}-o)`} stroke={k} strokeWidth={sw} />
    </g>
  );
};

/** Wassermolekül: großes O (−), zwei H (+). rot = Richtung der Plus-Seite in Grad (0 = nach oben). */
export const Molekuel: React.FC<{ x: number; y: number; r?: number; rot?: number; glow?: boolean; plus?: number; minus?: number; farbeO?: string; farbeH?: string; o?: number }> = ({
  x, y, r = 60, rot = 0, glow, plus = 0, minus = 0, farbeO, farbeH, o = 1,
}) => {
  const k = ink(glow);
  const a = (rot * Math.PI) / 180;
  const hs = [-52.25, 52.25].map((d) => {
    const b = a + (d * Math.PI) / 180;
    return { x: x + Math.sin(b) * r * 1.2, y: y - Math.cos(b) * r * 1.2 };
  });
  const sw = Math.max(3, r * 0.1);
  const fO = farbeO ?? (glow ? "#7a3c4c" : C.red);
  const fH = farbeH ?? (glow ? "#2c5a80" : "#ffffff");
  const lx = x - Math.sin(a) * r * 0.05, ly = y + Math.cos(a) * r * 0.05;
  const px = x + Math.sin(a) * r * 1.62, py = y - Math.cos(a) * r * 1.62;
  return (
    <g opacity={o}>
      {hs.map((h, i) => <line key={i} x1={x} y1={y} x2={h.x} y2={h.y} stroke={k} strokeWidth={sw * 1.4} />)}
      {hs.map((h, i) => <circle key={i} cx={h.x} cy={h.y} r={r * 0.56} fill={fH} stroke={k} strokeWidth={sw} />)}
      <circle cx={x} cy={y} r={r} fill={fO} stroke={k} strokeWidth={sw} />
      <g fontFamily={HEAD} fontWeight={900} textAnchor="middle">
        {minus > 0.01 && <text x={lx} y={ly + r * 0.32} fontSize={r * 0.95 * Math.min(1, minus)} opacity={Math.min(1, minus)} fill={glow ? "#ffe0dc" : "#ffffff"}>−</text>}
        {plus > 0.01 && <text x={px} y={py + r * 0.3} fontSize={r * 0.85 * Math.min(1, plus)} opacity={Math.min(1, plus)} fill={glow ? C.glow : C.ink}>+</text>}
      </g>
    </g>
  );
};

/** Magnetron: Röhre mit Kühlrippen und Antenne oben. Mitte (x, y), Breite w. */
export const Magnetron: React.FC<{ x: number; y: number; w?: number; glow?: boolean; strom?: number }> = ({ x, y, w = 200, glow, strom = 0 }) => {
  const k = ink(glow);
  const h = w * 0.9;
  const sw = Math.max(4, w * 0.035);
  return (
    <g>
      <rect x={x - w * 0.12} y={y - h / 2 - w * 0.28} width={w * 0.24} height={w * 0.3} rx={w * 0.06} fill={fill(glow, C.steel)} stroke={k} strokeWidth={sw} />
      <circle cx={x} cy={y - h / 2 - w * 0.3} r={w * 0.1} fill={glow ? AMBER : C.steel} stroke={k} strokeWidth={sw} opacity={glow ? 0.6 + 0.4 * strom : 1} />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <rect key={i} x={x - w / 2} y={y - h / 2 + i * (h / 6) + h / 24} width={w} height={h / 12} rx={4} fill={fill(glow, "#d9dde2")} stroke={k} strokeWidth={sw * 0.7} />
      ))}
      <rect x={x - w * 0.3} y={y - h / 2} width={w * 0.6} height={h} rx={w * 0.08} fill={fill(glow, "#b9c0c8")} stroke={k} strokeWidth={sw} />
      <circle cx={x} cy={y} r={w * 0.17} fill={glow ? `rgba(255,210,122,${0.25 + 0.5 * strom})` : "#8a929c"} stroke={k} strokeWidth={sw} />
    </g>
  );
};

/** Tafel Schokolade bzw. Riegel von oben (Mitte x, y). nuss → Erdnussriegel. */
export const Riegel: React.FC<{ x: number; y: number; w: number; h: number; nuss?: number; felder?: number }> = ({ x, y, w, h, nuss = 0, felder = 6 }) => {
  const farbe = nuss > 0.5 ? ERDNUSS : SCHOKO;
  const sw = Math.max(4, h * 0.06);
  return (
    <g>
      <rect x={x - w / 2} y={y - h / 2} width={w} height={h} rx={h * 0.12} fill={farbe} stroke={C.ink} strokeWidth={sw} />
      {nuss <= 0.5 && Array.from({ length: felder - 1 }, (_, i) => (
        <line key={i} x1={x - w / 2 + (w * (i + 1)) / felder} y1={y - h / 2 + sw} x2={x - w / 2 + (w * (i + 1)) / felder} y2={y + h / 2 - sw} stroke="#4a2a18" strokeWidth={sw * 0.8} />
      ))}
      {nuss <= 0.5 && <line x1={x - w / 2 + sw} y1={y} x2={x + w / 2 - sw} y2={y} stroke="#4a2a18" strokeWidth={sw * 0.8} />}
      {nuss > 0.5 && [[-0.35, -0.2], [-0.15, 0.22], [0.05, -0.15], [0.25, 0.2], [0.38, -0.22], [-0.42, 0.18], [0.12, 0.25]].map(([a, b], i) => (
        <ellipse key={i} cx={x + a * w} cy={y + b * h} rx={h * 0.13} ry={h * 0.09} fill="#b07a3e" stroke="#7a4f22" strokeWidth={3} transform={`rotate(${i * 37} ${x + a * w} ${y + b * h})`} />
      ))}
    </g>
  );
};

/** Eichhörnchen (sitzend, Blick nach links). Fuß bei (x, y). */
export const Eichhoernchen: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M30 -10 C 120 -10, 130 -120, 70 -160 C 30 -185, 10 -150, 40 -130 C 70 -110, 70 -60, 30 -50 Z" fill="#c8692e" stroke={C.ink} strokeWidth={7} strokeLinejoin="round" />
    <ellipse cx={0} cy={-50} rx={42} ry={52} fill="#d9803f" stroke={C.ink} strokeWidth={7} />
    <circle cx={-20} cy={-115} r={30} fill="#d9803f" stroke={C.ink} strokeWidth={7} />
    <path d="M-12 -140 L -2 -168 L 6 -136 Z" fill="#d9803f" stroke={C.ink} strokeWidth={6} strokeLinejoin="round" />
    <circle cx={-30} cy={-120} r={5} fill={C.ink} />
    <circle cx={-48} cy={-108} r={4} fill={C.ink} />
    <ellipse cx={-30} cy={-60} rx={14} ry={10} fill="#e9b37f" stroke={C.ink} strokeWidth={5} />
    <path d="M-30 -2 L 20 -2" stroke={C.ink} strokeWidth={7} strokeLinecap="round" />
  </g>
);

/** Thermometer (senkrecht), Fuß-Kugel bei (x, y), Höhe h, Füllung p 0..1. */
export const Thermometer: React.FC<{ x: number; y: number; h?: number; p: number; glow?: boolean; farbe?: string }> = ({ x, y, h = 360, p, glow, farbe = HEISS }) => {
  const k = ink(glow);
  const w = 46;
  const top = y - h;
  const fy = y - 30 - (h - 60) * p;
  return (
    <g>
      <rect x={x - w / 2} y={top} width={w} height={h} rx={w / 2} fill={glow ? "rgba(143,216,255,0.1)" : "#fff"} stroke={k} strokeWidth={7} />
      <rect x={x - 11} y={fy} width={22} height={y - fy} rx={11} fill={farbe} />
      <circle cx={x} cy={y + 20} r={40} fill={farbe} stroke={k} strokeWidth={7} />
      {[0.25, 0.5, 0.75].map((f, i) => <line key={i} x1={x + w / 2} y1={y - 30 - (h - 60) * f} x2={x + w / 2 + 22} y2={y - 30 - (h - 60) * f} stroke={k} strokeWidth={5} />)}
    </g>
  );
};

/** Hitzewelle (geschlängelter Pfeil) von (x1,y1) nach (x2,y2); phase verschiebt die Welle (fließt). */
export const Hitzepfeil: React.FC<{ x1: number; y1: number; x2: number; y2: number; phase?: number; farbe?: string; dick?: number; amp?: number; o?: number }> = ({
  x1, y1, x2, y2, phase = 0, farbe = HEISS, dick = 12, amp = 16, o = 1,
}) => {
  const dx = x2 - x1, dy = y2 - y1;
  const L = Math.hypot(dx, dy);
  const ux = dx / L, uy = dy / L, nx = -uy, ny = ux;
  const pts: string[] = [];
  const n = 40;
  for (let i = 0; i <= n; i++) {
    const f = i / n;
    const a = amp * Math.sin(f * L * 0.045 - phase) * Math.min(1, f * 4, (1 - f) * 6);
    pts.push(`${x1 + dx * f + nx * a} ${y1 + dy * f + ny * a}`);
  }
  const hx = x2, hy = y2;
  return (
    <g opacity={o}>
      <path d={`M${pts.join(" L ")}`} fill="none" stroke={farbe} strokeWidth={dick} strokeLinecap="round" strokeLinejoin="round" />
      <path d={`M${hx - ux * 34 + nx * 26} ${hy - uy * 34 + ny * 26} L ${hx} ${hy} L ${hx - ux * 34 - nx * 26} ${hy - uy * 34 - ny * 26}`} fill="none" stroke={farbe} strokeWidth={dick} strokeLinecap="round" strokeLinejoin="round" />
    </g>
  );
};

/** Feldpfeil (senkrecht), Mitte (x, y), v −1..1 (Richtung + Länge). */
export const Feldpfeil: React.FC<{ x: number; y: number; v: number; len?: number; farbe?: string; dick?: number }> = ({ x, y, v, len = 120, farbe = AMBER, dick = 10 }) => {
  const L = len * v;
  if (Math.abs(L) < 6) return <circle cx={x} cy={y} r={dick * 0.6} fill={farbe} opacity={0.6} />;
  const s = Math.sign(L);
  const y1 = y + L / 2, y2 = y - L / 2;
  const kopf = Math.min(28, Math.abs(L) * 0.4);
  return (
    <g>
      <line x1={x} y1={y1} x2={x} y2={y2} stroke={farbe} strokeWidth={dick} strokeLinecap="round" />
      <path d={`M${x - kopf} ${y2 + kopf * s} L ${x} ${y2} L ${x + kopf} ${y2 + kopf * s}`} fill="none" stroke={farbe} strokeWidth={dick} strokeLinecap="round" strokeLinejoin="round" />
    </g>
  );
};
