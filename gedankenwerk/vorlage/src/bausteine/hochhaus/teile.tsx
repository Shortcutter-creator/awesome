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

// =====================================================================================================
// Detail-Bausteine (zweite Fassung): realistischeres Haus, Alpen, Autos, Stadthäuser, Straßenmöbel
// =====================================================================================================

/** Realistischeres Mega-Haus: Glasfassade mit Fensterraster, Rippen, Sky-Lobby-Bändern, Seitenfläche (Tiefe),
 *  Dachaufbauten, Dunst nach oben und Schatten. x0 = linke Kante, w = Breite, bodenY = Boden, h = Höhe (px). */
export const HausReal: React.FC<{ id: string; x0: number; w: number; bodenY: number; h: number; sichtbar?: number; t: number; tiefe?: number; dunst?: number; lobbys?: number }> = ({
  id, x0, w, bodenY, h, sichtbar = 1, t, tiefe = 70, dunst = 0.45, lobbys = 15,
}) => {
  const hh = Math.max(0, h * sichtbar);
  const top = bodenY - hh;
  const dy = tiefe * 0.55;
  const rippen = Math.floor(w / 46);
  return (
    <g>
      <defs>
        <pattern id={`hr-f-${id}`} width={12} height={9} patternUnits="userSpaceOnUse">
          <rect width={12} height={9} fill="#7f93ad" />
          <rect x={1.5} y={1.5} width={9} height={6} fill="#22385a" />
          <rect x={1.5} y={1.5} width={9} height={2} fill="#3d5a82" />
        </pattern>
        <linearGradient id={`hr-r-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#e3f0ff" stopOpacity={0.55} />
          <stop offset="45%" stopColor="#9cc4ef" stopOpacity={0.18} />
          <stop offset="100%" stopColor="#0f1b2e" stopOpacity={0.35} />
        </linearGradient>
        <linearGradient id={`hr-d-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#dcebff" stopOpacity={dunst} />
          <stop offset="60%" stopColor="#dcebff" stopOpacity={dunst * 0.25} />
          <stop offset="100%" stopColor="#dcebff" stopOpacity={0} />
        </linearGradient>
      </defs>
      {/* Schatten am Boden */}
      <polygon points={`${x0 + w},${bodenY} ${x0 + w + tiefe},${bodenY - dy} ${x0 + w + tiefe + hh * 0.35},${bodenY + 18} ${x0 + w + 40},${bodenY + 26}`} fill="rgba(0,0,0,0.22)" />
      {/* Seitenfläche */}
      <polygon points={`${x0 + w},${bodenY} ${x0 + w + tiefe},${bodenY - dy} ${x0 + w + tiefe},${top - dy} ${x0 + w},${top}`} fill={`url(#hr-f-${id})`} />
      <polygon points={`${x0 + w},${bodenY} ${x0 + w + tiefe},${bodenY - dy} ${x0 + w + tiefe},${top - dy} ${x0 + w},${top}`} fill="rgba(5,12,25,0.5)" />
      {/* Front */}
      <rect x={x0} y={top} width={w} height={hh} fill={`url(#hr-f-${id})`} />
      <rect x={x0} y={top} width={w} height={hh} fill={`url(#hr-r-${id})`} />
      {/* Rippen (Tragwerk) */}
      {Array.from({ length: rippen + 1 }, (_, i) => <rect key={i} x={x0 + i * (w / rippen) - 2} y={top} width={4} height={hh} fill="#d7e2f0" opacity={0.55} />)}
      {/* Sky-Lobbys: grüne Bänder alle 100 Etagen */}
      {Array.from({ length: lobbys }, (_, i) => {
        const y = bodenY - (i + 1) * (h / (lobbys + 0.56));
        if (y < top) return null;
        return (
          <g key={i}>
            <rect x={x0} y={y - 5} width={w} height={10} fill="#2f6b3a" />
            <rect x={x0} y={y - 5} width={w} height={2} fill="#9fe0a8" opacity={0.7} />
            {Array.from({ length: Math.floor(w / 26) }, (_, j) => <circle key={j} cx={x0 + 10 + j * 26} cy={y - 3} r={4} fill="#4fae5c" />)}
          </g>
        );
      })}
      {/* einzelne beleuchtete Fenster */}
      {Array.from({ length: 90 }, (_, i) => {
        const yy = bodenY - ((i * 137 + 23) % Math.max(1, Math.floor(hh - 6))) - 4;
        const xx = x0 + 6 + ((i * 211) % Math.max(10, Math.floor(w - 14)));
        return <rect key={i} x={xx} y={yy} width={8} height={4} fill={GOLD} opacity={0.35 + 0.35 * Math.sin(t * 1.5 + i)} />;
      })}
      {/* Dunst nach oben (Luftperspektive) */}
      <rect x={x0} y={top} width={w + tiefe} height={hh} fill={`url(#hr-d-${id})`} />
      {/* Dach mit Aufbauten */}
      {sichtbar > 0.98 ? (
        <g>
          <polygon points={`${x0},${top} ${x0 + w},${top} ${x0 + w + tiefe},${top - dy} ${x0 + tiefe},${top - dy}`} fill="#c7d3e2" />
          {[0.12, 0.3, 0.55, 0.78].map((k, i) => <rect key={i} x={x0 + w * k} y={top - dy * 0.6 - 10} width={34} height={12} fill="#9aa9bd" />)}
          {[0.2, 0.62, 0.9].map((k, i) => (
            <g key={i}>
              <line x1={x0 + w * k} y1={top - dy * 0.5} x2={x0 + w * k} y2={top - dy * 0.5 - 46 - i * 12} stroke="#e6edf7" strokeWidth={3} />
              <circle cx={x0 + w * k} cy={top - dy * 0.5 - 46 - i * 12} r={4} fill={ROT} opacity={0.4 + 0.6 * (Math.sin(t * 4 + i) > 0 ? 1 : 0)} />
            </g>
          ))}
        </g>
      ) : null}
      <rect x={x0} y={top} width={w} height={hh} fill="none" stroke="#eef3fa" strokeWidth={2.5} />
      <line x1={x0 + w} y1={top} x2={x0 + w + tiefe} y2={top - dy} stroke="#eef3fa" strokeWidth={2} />
    </g>
  );
};

/** Alpenketten im Dunst hinter dem Vordergrund. */
export const Alpen: React.FC<{ bodenY: number; o?: number }> = ({ bodenY, o = 1 }) => (
  <g opacity={o}>
    <path d={`M0,${bodenY - 330} L80,${bodenY - 410} L160,${bodenY - 350} L240,${bodenY - 470} L330,${bodenY - 380} L420,${bodenY - 440} L520,${bodenY - 360} L640,${bodenY - 420} L760,${bodenY - 340} L880,${bodenY - 400} L1000,${bodenY - 330} L1080,${bodenY - 380} L1080,${bodenY} L0,${bodenY} Z`} fill="#9fb6d3" opacity={0.55} />
    <path d={`M0,${bodenY - 220} L110,${bodenY - 300} L210,${bodenY - 240} L330,${bodenY - 320} L450,${bodenY - 230} L560,${bodenY - 280} L700,${bodenY - 210} L840,${bodenY - 270} L960,${bodenY - 200} L1080,${bodenY - 250} L1080,${bodenY} L0,${bodenY} Z`} fill="#7f97b6" opacity={0.7} />
  </g>
);

/** Detaillierter Berg mit Licht- und Schattenseite, Felsrippen und Schneefeldern. */
export const BergReal: React.FC<{ x: number; y: number; bodenY: number; breite: number }> = ({ x, y, bodenY, breite }) => {
  const H = bodenY - y;
  const L = x - breite / 2, R = x + breite / 2;
  return (
    <g>
      <polygon points={`${L},${bodenY} ${x - breite * 0.2},${y + H * 0.4} ${x},${y} ${x + breite * 0.05},${bodenY}`} fill="#8a97aa" />
      <polygon points={`${x},${y} ${x + breite * 0.22},${y + H * 0.42} ${R},${bodenY} ${x + breite * 0.05},${bodenY}`} fill="#56637a" />
      {[0.25, 0.45, 0.65].map((k, i) => <path key={i} d={`M${x + (i - 1) * 18},${y + H * 0.1} L${x - breite * (0.1 + k * 0.15)},${y + H * k} L${x - breite * (0.05 + k * 0.2)},${bodenY}`} fill="none" stroke="#6f7c90" strokeWidth={3} opacity={0.6} />)}
      <polygon points={`${x - breite * 0.13},${y + H * 0.26} ${x},${y} ${x + breite * 0.15},${y + H * 0.3} ${x + breite * 0.07},${y + H * 0.22} ${x + breite * 0.02},${y + H * 0.3} ${x - breite * 0.05},${y + H * 0.2}`} fill="#ffffff" />
      <polygon points={`${x},${y} ${x + breite * 0.15},${y + H * 0.3} ${x + breite * 0.07},${y + H * 0.22}`} fill="#d7e2f2" />
      <polygon points={`${x - breite * 0.3},${y + H * 0.55} ${x - breite * 0.2},${y + H * 0.48} ${x - breite * 0.16},${y + H * 0.56}`} fill="#ffffff" opacity={0.85} />
    </g>
  );
};

/** Vogelschwarm (kleine flatternde V). */
export const Voegel: React.FC<{ t: number; x: number; y: number; n?: number; farbe?: string }> = ({ t, x, y, n = 7, farbe = "#1b2433" }) => (
  <g>
    {Array.from({ length: n }, (_, i) => {
      const bx = x + t * 40 + (i % 4) * 26 + Math.sin(i) * 10, by = y + Math.floor(i / 2) * 14 + Math.sin(t * 3 + i) * 3;
      const f = 5 + 4 * Math.sin(t * 12 + i);
      return <path key={i} d={`M${bx - 9},${by - f} Q${bx - 4},${by - 2} ${bx},${by} Q${bx + 4},${by - 2} ${bx + 9},${by - f}`} fill="none" stroke={farbe} strokeWidth={2.5} strokeLinecap="round" />;
    })}
  </g>
);

/** Detailliertes Auto (Seitenansicht), Unterkante bei (x, y), fährt nach rechts (richtung 1) oder links (−1). */
export const Auto: React.FC<{ x: number; y: number; typ?: "limo" | "taxi" | "bus" | "transporter"; farbe?: string; richtung?: 1 | -1; s?: number; t?: number }> = ({
  x, y, typ = "limo", farbe = "#d64545", richtung = 1, s = 1, t = 0,
}) => {
  const rad = (cx: number, r = 10) => (
    <g key={cx} transform={`translate(${cx} -10)`}>
      <circle r={r} fill="#15181e" />
      <circle r={r * 0.58} fill="#c9d0da" />
      <g transform={`rotate(${(t * 720) % 360})`}>{[0, 72, 144, 216, 288].map((w) => <line key={w} x1={0} y1={0} x2={0} y2={-r * 0.5} transform={`rotate(${w})`} stroke="#7b8594" strokeWidth={1.6} />)}</g>
      <circle r={r * 0.18} fill="#7b8594" />
    </g>
  );
  const glas = "#a9d8ff";
  return (
    <g transform={`translate(${x} ${y}) scale(${s * richtung} ${s})`}>
      {typ === "bus" ? (
        <g>
          <ellipse cx={95} cy={1} rx={100} ry={4} fill="rgba(0,0,0,0.3)" />
          <rect x={0} y={-62} width={190} height={52} rx={8} fill={farbe} />
          <rect x={0} y={-30} width={190} height={6} fill="#ffffff" opacity={0.85} />
          {Array.from({ length: 6 }, (_, i) => <rect key={i} x={10 + i * 26} y={-56} width={20} height={18} rx={3} fill={glas} />)}
          <rect x={168} y={-56} width={18} height={22} rx={3} fill={glas} />
          <rect x={150} y={-40} width={14} height={30} fill="#2a3346" />
          <rect x={186} y={-22} width={4} height={6} fill="#ffe08a" />
          <rect x={0} y={-22} width={4} height={6} fill="#ff4d4d" />
          {rad(32, 11)}{rad(150, 11)}
        </g>
      ) : typ === "transporter" ? (
        <g>
          <ellipse cx={62} cy={1} rx={66} ry={4} fill="rgba(0,0,0,0.3)" />
          <path d="M0,-10 L0,-50 Q0,-54 4,-54 L88,-54 Q96,-54 100,-48 L118,-30 Q122,-26 122,-20 L122,-10 Z" fill={farbe} />
          <path d="M90,-48 L102,-48 L114,-32 L90,-32 Z" fill={glas} />
          <line x1={84} y1={-50} x2={84} y2={-12} stroke="rgba(0,0,0,0.25)" strokeWidth={2} />
          <rect x={118} y={-26} width={4} height={6} fill="#ffe08a" />
          <rect x={0} y={-24} width={3} height={8} fill="#ff4d4d" />
          {rad(24)}{rad(98)}
        </g>
      ) : (
        <g>
          <ellipse cx={56} cy={1} rx={60} ry={4} fill="rgba(0,0,0,0.3)" />
          <path d="M0,-12 L2,-24 Q4,-28 12,-29 L30,-30 L44,-44 Q48,-47 56,-47 L78,-47 Q86,-47 90,-42 L100,-30 L108,-28 Q114,-26 114,-20 L114,-12 Q114,-8 110,-8 L4,-8 Q0,-8 0,-12 Z" fill={farbe} />
          <path d="M46,-42 L62,-42 L62,-31 L36,-31 Z" fill={glas} />
          <path d="M66,-42 L82,-42 Q86,-42 88,-38 L94,-31 L66,-31 Z" fill={glas} />
          <path d="M48,-41 L52,-41 L44,-32 L40,-32 Z" fill="#ffffff" opacity={0.6} />
          <line x1={64} y1={-31} x2={64} y2={-10} stroke="rgba(0,0,0,0.25)" strokeWidth={2} />
          <rect x={70} y={-26} width={8} height={2.5} fill="rgba(0,0,0,0.35)" />
          <rect x={108} y={-24} width={6} height={5} rx={2} fill="#ffe08a" />
          <rect x={0} y={-24} width={4} height={6} fill="#ff4d4d" />
          {typ === "taxi" ? <g><rect x={54} y={-54} width={20} height={7} rx={2} fill="#1d1d24" /><text x={64} y={-48.5} textAnchor="middle" fontFamily={MONO} fontWeight={700} fontSize={6} fill="#ffd25e">TAXI</text></g> : null}
          {rad(26)}{rad(90)}
        </g>
      )}
    </g>
  );
};

/** Stadthaus mit Fensterraster, Balkonen, Laden im Erdgeschoss (Markise) und Dachaufbau. */
export const Stadthaus: React.FC<{ x: number; w: number; h: number; bodenY: number; farbe: string; seed: number; t: number }> = ({ x, w, h, bodenY, farbe, seed, t }) => {
  const top = bodenY - h;
  const sp = Math.max(2, Math.floor((w - 16) / 26));
  const zeilen = Math.max(2, Math.floor((h - 70) / 38));
  const markise = ["#e05a4f", "#3f8fd2", "#3fae6a", "#e0a43b"][seed % 4];
  return (
    <g>
      <rect x={x} y={top} width={w} height={h} fill={farbe} />
      <rect x={x - 3} y={top - 6} width={w + 6} height={8} fill="rgba(0,0,0,0.25)" />
      {seed % 3 === 0 ? <polygon points={`${x - 4},${top - 4} ${x + w / 2},${top - 34} ${x + w + 4},${top - 4}`} fill="#6b3a2e" /> : null}
      {seed % 3 === 1 ? <g><rect x={x + 10} y={top - 18} width={22} height={12} fill="#9aa4b4" /><rect x={x + w - 30} y={top - 26} width={14} height={20} fill="#7d8796" /></g> : null}
      {seed % 3 === 2 ? <g><rect x={x + w / 2 - 12} y={top - 30} width={24} height={24} rx={4} fill="#8c6a4e" /><line x1={x + w - 12} y1={top - 6} x2={x + w - 12} y2={top - 40} stroke="#c9d0da" strokeWidth={2} /></g> : null}
      {Array.from({ length: zeilen }, (_, r) =>
        Array.from({ length: sp }, (_, c) => {
          const lit = (seed * 7 + r * 3 + c * 5) % 5 < 2;
          const wx = x + 8 + c * ((w - 16) / sp) + 3, wy = top + 12 + r * 38;
          return (
            <g key={`${r}-${c}`}>
              <rect x={wx} y={wy} width={(w - 16) / sp - 6} height={24} fill={lit ? "#ffd68a" : "#253650"} opacity={lit ? 0.75 + 0.25 * Math.sin(t + r + c) : 1} />
              <line x1={wx + ((w - 16) / sp - 6) / 2} y1={wy} x2={wx + ((w - 16) / sp - 6) / 2} y2={wy + 24} stroke="rgba(0,0,0,0.3)" strokeWidth={1.5} />
            </g>
          );
        }),
      )}
      {Array.from({ length: zeilen }, (_, r) => ((seed + r) % 3 === 0 ? <rect key={r} x={x + 4} y={top + 36 + r * 38} width={w - 8} height={3} fill="rgba(255,255,255,0.45)" /> : null))}
      {/* Erdgeschoss: Laden */}
      <rect x={x + 6} y={bodenY - 44} width={w - 30} height={36} fill="#9fd0f0" opacity={0.85} />
      <rect x={x + w - 22} y={bodenY - 40} width={14} height={40} fill="#2a2f3d" />
      <path d={`M${x + 2},${bodenY - 54} L${x + w - 26},${bodenY - 54} L${x + w - 18},${bodenY - 44} L${x - 4},${bodenY - 44} Z`} fill={markise} />
      {Array.from({ length: Math.floor((w - 24) / 12) }, (_, i) => <rect key={i} x={x + 2 + i * 12} y={bodenY - 54} width={6} height={10} fill="#ffffff" opacity={0.5} />)}
    </g>
  );
};

export const Laterne: React.FC<{ x: number; y: number; an?: number }> = ({ x, y, an = 1 }) => (
  <g>
    <rect x={x - 2} y={y - 90} width={4} height={90} fill="#3a4152" />
    <path d={`M${x},${y - 90} Q${x + 2},${y - 100} ${x + 16},${y - 98}`} fill="none" stroke="#3a4152" strokeWidth={4} />
    <rect x={x + 10} y={y - 100} width={14} height={6} rx={3} fill="#ffe7a8" />
    <ellipse cx={x + 17} cy={y - 90} rx={24} ry={40} fill={rgba("#ffe7a8", 0.12 * an)} />
  </g>
);

export const Baum: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-3} y={-30} width={6} height={30} fill="#6b4a2a" />
    <circle cx={0} cy={-42} r={20} fill="#2f7a3a" />
    <circle cx={-12} cy={-34} r={13} fill="#3b8f45" />
    <circle cx={12} cy={-34} r={13} fill="#3b8f45" />
    <circle cx={-5} cy={-50} r={9} fill="#57a862" opacity={0.8} />
  </g>
);

export const Fussgaenger: React.FC<{ x: number; y: number; farbe: string; p: number; s?: number }> = ({ x, y, farbe, p, s = 1 }) => {
  const k = Math.sin(p * Math.PI * 2);
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <line x1={0} y1={-16} x2={-5 * k} y2={0} stroke="#2b2f3a" strokeWidth={4} strokeLinecap="round" />
      <line x1={0} y1={-16} x2={5 * k} y2={0} stroke="#2b2f3a" strokeWidth={4} strokeLinecap="round" />
      <rect x={-5} y={-34} width={10} height={20} rx={4} fill={farbe} />
      <circle cx={0} cy={-40} r={6} fill="#e2b48f" />
    </g>
  );
};
