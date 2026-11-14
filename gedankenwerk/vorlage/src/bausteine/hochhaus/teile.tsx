// Hochhaus-Bausteine: Himmel, Wolken, Mont Blanc, Mega-Haus (Block mit Etagen), Paris-Umriss, Etagen-Querschnitt,
// Alltags-Icons, Sky-Lobby, Aufzug, Pumpen/Tanks/Turbinen, Druckanzeige, Wildnis, Lastenaufzug. SVG in 1080 × 1920.
import React from "react";
import { HEAD, MONO, ease, rgba } from "../../basis/lib";

export const NACHTBLAU = "#0b1426";
export const HIMMEL1 = "#3a7bd5";
export const HIMMEL2 = "#a8d4ff";
export const BETON = "#c9d2df";
export const GLAS = "#7fb3e6";
export const GOLD = "#ffc94a";
export const GRUEN = "#3fae6a";
export const WASSER = "#3fa9f5";
export const ROT = "#ff5a5a";
export const CREME = "#f6f3ec";

export const sz = (t: number, a: number, b: number, bl = 0.22) =>
  t < a - bl || t > b + bl ? 0 : Math.min(a <= 0 ? 1 : ease(t, a - bl, a + 0.05), 1 - ease(t, b - 0.05, b + bl));

export const kamera = (t: number, punkte: number[]) => {
  const p = [...punkte].sort((a, b) => a - b);
  const k = p.filter((a) => t >= a).length;
  const z = (i: number) => 1 + 0.06 * (i % 2);
  return k === 0 ? 1 : z(k - 1) + (z(k) - z(k - 1)) * ease(t, p[k - 1], p[k - 1] + 0.3);
};

export const Himmel: React.FC<{ id: string; oben?: string; unten?: string }> = ({ id, oben = HIMMEL1, unten = HIMMEL2 }) => (
  <g>
    <defs>
      <linearGradient id={`hh-${id}`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={oben} />
        <stop offset="100%" stopColor={unten} />
      </linearGradient>
    </defs>
    <rect width={1080} height={1920} fill={`url(#hh-${id})`} />
  </g>
);

export const Wolke: React.FC<{ x: number; y: number; s?: number; o?: number }> = ({ x, y, s = 1, o = 0.95 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o}>
    {[[-80, 10, 50], [-30, -12, 62], [30, -4, 56], [80, 12, 44], [0, 18, 70]].map(([cx, cy, r], i) => <circle key={i} cx={cx} cy={cy} r={r} fill="#ffffff" />)}
  </g>
);

/** Mont Blanc: Gipfel bei (x, y), Fuß bei bodenY. */
export const Berg: React.FC<{ x: number; y: number; bodenY: number; breite: number }> = ({ x, y, bodenY, breite }) => (
  <g>
    <polygon points={`${x - breite / 2},${bodenY} ${x - breite * 0.18},${y + (bodenY - y) * 0.35} ${x},${y} ${x + breite * 0.22},${y + (bodenY - y) * 0.4} ${x + breite / 2},${bodenY}`} fill="#6b7a90" />
    <polygon points={`${x - breite * 0.12},${y + (bodenY - y) * 0.25} ${x},${y} ${x + breite * 0.14},${y + (bodenY - y) * 0.27} ${x + breite * 0.04},${y + (bodenY - y) * 0.2} ${x - breite * 0.04},${y + (bodenY - y) * 0.24}`} fill="#ffffff" />
  </g>
);

/** Das Mega-Haus als Block: linke Kante x0, Breite w, Boden bodenY, Höhe h (px). sichtbar 0..1 baut von unten auf. */
export const Haus: React.FC<{ x0: number; w: number; bodenY: number; h: number; sichtbar?: number; etagen?: number; t: number }> = ({ x0, w, bodenY, h, sichtbar = 1, etagen = 40, t }) => {
  const hh = h * sichtbar;
  return (
    <g>
      <rect x={x0} y={bodenY - hh} width={w} height={hh} fill="#9fb0c6" />
      <rect x={x0} y={bodenY - hh} width={w} height={hh} fill="url(#hh-glas)" opacity={0.6} />
      <defs>
        <linearGradient id="hh-glas" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#ffffff" stopOpacity={0.35} />
          <stop offset="50%" stopColor={GLAS} stopOpacity={0.1} />
          <stop offset="100%" stopColor="#1d2b44" stopOpacity={0.4} />
        </linearGradient>
      </defs>
      {Array.from({ length: Math.floor(etagen * sichtbar) }, (_, i) => (
        <line key={i} x1={x0} y1={bodenY - (i + 1) * (h / etagen)} x2={x0 + w} y2={bodenY - (i + 1) * (h / etagen)} stroke={rgba("#ffffff", 0.35)} strokeWidth={1.5} />
      ))}
      {Array.from({ length: 18 }, (_, i) => {
        const y = bodenY - ((i * 97 + 30) % Math.max(1, hh - 10)) - 6;
        const x = x0 + 10 + ((i * 131) % Math.max(10, w - 30));
        return <rect key={i} x={x} y={y} width={14} height={4} fill={GOLD} opacity={0.4 + 0.4 * Math.sin(t * 2 + i)} />;
      })}
      <rect x={x0} y={bodenY - hh} width={w} height={hh} fill="none" stroke="#e6edf7" strokeWidth={3} />
    </g>
  );
};

/** Paris-Umriss (stilisiert) mit Seine, Mitte (cx, cy), Breite w. */
export const Paris: React.FC<{ cx: number; cy: number; w: number; o?: number; zeichne?: number }> = ({ cx, cy, w, o = 1, zeichne = 1 }) => {
  const s = w / 1000;
  const umriss = "M-480,40 C-470,-120 -330,-260 -150,-300 C20,-340 200,-320 330,-250 C450,-180 500,-60 490,60 C480,170 400,260 260,300 C100,340 -90,330 -250,280 C-400,230 -485,160 -480,40 Z";
  const seine = "M-500,-40 C-350,40 -220,-60 -80,-30 C60,0 140,120 300,90 C400,70 460,140 520,160";
  return (
    <g transform={`translate(${cx} ${cy}) scale(${s})`} opacity={o}>
      <path d={umriss} fill={rgba("#ffd27a", 0.25)} stroke={GOLD} strokeWidth={8 / s} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - zeichne} />
      <path d={seine} fill="none" stroke={WASSER} strokeWidth={14} opacity={zeichne} />
    </g>
  );
};

// ---------------------------------------------------------------------------
// Icons
// ---------------------------------------------------------------------------
export const Icon: React.FC<{ art: "markt" | "schule" | "arzt" | "krankenhaus" | "park" | "aufzug"; x: number; y: number; s?: number; o?: number }> = ({ art, x, y, s = 1, o = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o}>
    <circle r={70} fill={CREME} stroke={NACHTBLAU} strokeWidth={6} />
    {art === "markt" ? (
      <g fill="none" stroke={NACHTBLAU} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round">
        <path d="M-40,-25 L-28,-25 L-14,20 L28,20 L36,-12 L-22,-12" />
        <circle cx={-8} cy={34} r={6} fill={NACHTBLAU} /><circle cx={22} cy={34} r={6} fill={NACHTBLAU} />
      </g>
    ) : art === "schule" ? (
      <g fill="none" stroke={NACHTBLAU} strokeWidth={7} strokeLinejoin="round">
        <path d="M-42,-8 L0,-32 L42,-8 L0,16 Z" /><path d="M-24,4 L-24,26 Q0,40 24,26 L24,4" />
      </g>
    ) : art === "arzt" || art === "krankenhaus" ? (
      <g fill={ROT}><rect x={-12} y={-38} width={24} height={76} rx={4} /><rect x={-38} y={-12} width={76} height={24} rx={4} /></g>
    ) : art === "park" ? (
      <g><rect x={-5} y={0} width={10} height={36} fill="#7a4a2a" /><circle cx={0} cy={-12} r={30} fill={GRUEN} /></g>
    ) : (
      <g fill="none" stroke={NACHTBLAU} strokeWidth={7}><rect x={-26} y={-38} width={52} height={76} rx={6} /><path d="M-10,-12 L0,-24 L10,-12 M-10,12 L0,24 L10,12" /></g>
    )}
  </g>
);

/** Druckanzeige (Manometer): wert in hPa (0–1100). */
export const Manometer: React.FC<{ x: number; y: number; r: number; wert: number }> = ({ x, y, r, wert }) => {
  const w = (-135 + (wert / 1100) * 270) * (Math.PI / 180);
  return (
    <g>
      <circle cx={x} cy={y} r={r} fill={CREME} stroke={NACHTBLAU} strokeWidth={10} />
      {Array.from({ length: 12 }, (_, i) => {
        const a = (-135 + (i / 11) * 270 - 90) * (Math.PI / 180);
        return <line key={i} x1={x + Math.cos(a) * r * 0.78} y1={y + Math.sin(a) * r * 0.78} x2={x + Math.cos(a) * r * 0.9} y2={y + Math.sin(a) * r * 0.9} stroke={NACHTBLAU} strokeWidth={5} />;
      })}
      <line x1={x} y1={y} x2={x + Math.cos(w - Math.PI / 2) * r * 0.72} y2={y + Math.sin(w - Math.PI / 2) * r * 0.72} stroke={ROT} strokeWidth={10} strokeLinecap="round" />
      <circle cx={x} cy={y} r={14} fill={NACHTBLAU} />
      <text x={x} y={y + r * 0.5} textAnchor="middle" fontFamily={MONO} fontWeight={700} fontSize={r * 0.22} fill={NACHTBLAU}>{Math.round(wert)} hPa</text>
    </g>
  );
};

/** Turbine (Laufrad), dreht sich mit winkel. */
export const Turbine: React.FC<{ x: number; y: number; r: number; winkel: number }> = ({ x, y, r, winkel }) => (
  <g transform={`translate(${x} ${y}) rotate(${winkel})`}>
    <circle r={r} fill="none" stroke={CREME} strokeWidth={6} />
    {Array.from({ length: 6 }, (_, i) => <path key={i} d={`M0,0 Q${r * 0.5},${-r * 0.2} ${r * 0.9},0`} transform={`rotate(${i * 60})`} fill="none" stroke={CREME} strokeWidth={9} strokeLinecap="round" />)}
    <circle r={r * 0.18} fill={CREME} />
  </g>
);

/** Wildnis: Wiesen, Felder, Wälder bis zum Horizont bei y. */
export const Wildnis: React.FC<{ y: number }> = ({ y }) => (
  <g>
    <rect x={0} y={y} width={1080} height={1920 - y} fill="#4f9a4f" />
    {Array.from({ length: 7 }, (_, i) => <rect key={i} x={i * 160 - 40} y={y + 120 + (i % 2) * 140} width={140} height={110} fill={i % 3 ? "#d9c26a" : "#78b85a"} opacity={0.8} transform={`skewX(-20)`} />)}
    {Array.from({ length: 40 }, (_, i) => {
      const x = (i * 97) % 1080, yy = y + 30 + ((i * 53) % 420);
      return <g key={i}><rect x={x - 4} y={yy} width={8} height={18} fill="#5a3a22" /><circle cx={x} cy={yy - 8} r={18} fill={i % 2 ? "#2f7a3a" : "#3b8f45"} /></g>;
    })}
  </g>
);

export const Zaehler: React.FC<{ x: number; y: number; wert: string; label: string; farbe?: string; groesse?: number; o?: number }> = ({ x, y, wert, label, farbe = CREME, groesse = 96, o = 1 }) => (
  <div style={{ position: "absolute", left: x, top: y, transform: "translateX(-50%)", textAlign: "center", opacity: o, whiteSpace: "nowrap" }}>
    <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: groesse, lineHeight: 1, color: farbe, textShadow: "0 4px 20px rgba(0,0,0,0.5)" }}>{wert}</div>
    <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: groesse * 0.28, letterSpacing: 3, color: rgba(farbe, 0.85), marginTop: 6 }}>{label}</div>
  </div>
);

export const Chip: React.FC<{ x: number; y: number; text: React.ReactNode; p: number; bg?: string; fg?: string; size?: number }> = ({ x, y, text, p, bg = CREME, fg = NACHTBLAU, size = 44 }) => (
  <div style={{ position: "absolute", left: x, top: y, transform: `translateX(-50%) scale(${p})`, background: bg, color: fg, fontFamily: HEAD, fontWeight: 900, fontSize: size, padding: "6px 22px 10px", borderRadius: 16, whiteSpace: "nowrap", boxShadow: "0 8px 24px rgba(0,0,0,0.35)" }}>{text}</div>
);
