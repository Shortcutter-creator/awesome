// Illustrationen Folge 25 (Das Komma im Preis). Gleicher Stil wie icons.tsx; glow = Röntgen-Fassung.
// Kernidee: Das Komma ist ein eigenes, körperliches Objekt (SVG), damit es sich markieren, anheben und wegfliegen lässt.
// Keine Marken, keine echten Betriebe: Speisekarte, Onlineshop-Kachel und Friseur-Preisliste sind generisch.
import React from "react";
import { C, HEAD, MONO } from "../../basis/lib";

type P = { size?: number; glow?: boolean; style?: React.CSSProperties };
const ink = (g?: boolean) => (g ? C.glow : C.ink);
const fill = (g: boolean | undefined, f: string) => (g ? "rgba(143,216,255,0.2)" : f);
const gl = (g?: boolean): React.CSSProperties => (g ? { filter: "drop-shadow(0 0 14px rgba(143,216,255,0.45)) drop-shadow(0 0 3px rgba(143,216,255,0.8))" } : {});
export const HELL = "#eaf7ff";
export const AMBER = "#ffb82e";

// ---------------------------------------------------------------------------
// Komma als Objekt: Kopf (Kreis) + Schwanz. Höhe = size; Kreis-Unterkante liegt bei 52 % der Höhe.
// ---------------------------------------------------------------------------
export const Komma: React.FC<P & { farbe?: string; rand?: boolean }> = ({ size = 100, glow, style, farbe, rand = true }) => {
  const f = farbe ?? (glow ? HELL : C.ink);
  return (
    <svg width={size * 0.6} height={size} viewBox="0 0 60 100" style={{ display: "block", overflow: "visible", ...gl(glow), ...style }}>
      <path
        d="M32 4 C 46 4, 56 14, 56 30 C 56 60, 40 86, 12 98 L 7 90 C 24 80, 32 66, 33 54 C 18 54, 8 44, 8 29 C 8 14, 18 4, 32 4 Z"
        fill={f}
        stroke={rand ? (glow ? C.glow : C.ink) : "none"}
        strokeWidth={rand ? 5 : 0}
        strokeLinejoin="round"
      />
      {!glow && <ellipse cx={24} cy={20} rx={7} ry={5} fill="#ffffff" opacity={0.35} transform="rotate(-30 24 20)" />}
    </svg>
  );
};

/** Preis mit körperlichem Komma: vor + Komma + cent + €. Jeder Teil lässt sich einzeln bewegen/markieren. */
export const PreisText: React.FC<{
  vor: string;
  cent?: string;
  euro?: boolean;
  size: number;
  glow?: boolean;
  farbe?: string;
  kommaFarbe?: string;
  kommaTf?: string;
  kommaO?: number;
  ring?: number; // 0..1 roter Kreis um das Komma
  ringFarbe?: string;
  centStyle?: React.CSSProperties;
  zeichen?: (i: number) => React.CSSProperties; // Stil je Cent-Ziffer
  euroStyle?: React.CSSProperties;
  vorStyle?: React.CSSProperties;
}> = ({ vor, cent, euro = true, size, glow, farbe, kommaFarbe, kommaTf, kommaO = 1, ring = 0, ringFarbe = C.red, centStyle, zeichen, euroStyle, vorStyle }) => {
  const col = farbe ?? (glow ? HELL : C.ink);
  const kH = size * 0.46;
  return (
    <span style={{ display: "inline-block", fontFamily: HEAD, fontWeight: 900, fontSize: size, letterSpacing: -size * 0.03, color: col, whiteSpace: "nowrap", lineHeight: 1 }}>
      <span style={{ display: "inline-block", ...vorStyle }}>{vor}</span>
      {cent !== undefined && (
        <span style={{ position: "relative", display: "inline-block", verticalAlign: "baseline", width: size * 0.3, height: kH * 0.52, opacity: kommaO, transform: kommaTf, transformOrigin: "50% 60%" }}>
          <span style={{ position: "absolute", left: size * 0.15 - kH * 0.3, top: 0, display: "block", fontSize: 0, lineHeight: 0 }}>
            <Komma size={kH} glow={glow} farbe={kommaFarbe} />
          </span>
          {ring > 0.001 && (
            <svg width={size * 0.9} height={size * 0.9} viewBox="0 0 100 100" style={{ position: "absolute", left: size * 0.15 - size * 0.45, top: kH * 0.34 - size * 0.45, overflow: "visible" }}>
              <ellipse cx={50} cy={50} rx={44} ry={46} fill="none" stroke={ringFarbe} strokeWidth={7} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - ring} transform="rotate(-80 50 50)" />
            </svg>
          )}
        </span>
      )}
      {cent !== undefined && (
        <span style={{ display: "inline-block", ...centStyle }}>
          {cent.split("").map((z, i) => (
            <span key={i} style={{ display: "inline-block", ...(zeichen ? zeichen(i) : {}) }}>
              {z}
            </span>
          ))}
        </span>
      )}
      {euro && <span style={{ display: "inline-block", marginLeft: size * 0.2, ...euroStyle }}>€</span>}
    </span>
  );
};

// ---------------------------------------------------------------------------
// Großes Preisschild an einer Schnur (Nagel oben = Drehpunkt). Box: w × (schnur + h).
// ---------------------------------------------------------------------------
export const Schild: React.FC<{
  w: number;
  h: number;
  schnur?: number;
  glow?: boolean;
  label?: string;
  labelFarbe?: string;
  nagel?: boolean;
  children?: React.ReactNode;
}> = ({ w, h, schnur = 0, glow, label, labelFarbe, nagel = true, children }) => {
  const y0 = schnur;
  const c = h * 0.22;
  const r = h * 0.06;
  const sw = Math.max(5, h * 0.019);
  const i = sw / 2;
  const body = `M${c} ${y0 + i} L${w - c} ${y0 + i} L${w - i} ${y0 + c} L${w - i} ${y0 + h - r} Q${w - i} ${y0 + h - i} ${w - r} ${y0 + h - i} L${r} ${y0 + h - i} Q${i} ${y0 + h - i} ${i} ${y0 + h - r} L${i} ${y0 + c} Z`;
  const band = `M${c} ${y0 + i} L${w - c} ${y0 + i} L${w - i} ${y0 + c} L${i} ${y0 + c} Z`;
  const hy = y0 + c * 0.5;
  return (
    <div style={{ position: "relative", width: w, height: schnur + h }}>
      <svg width={w} height={schnur + h} viewBox={`0 0 ${w} ${schnur + h}`} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", ...gl(glow) }}>
        {!glow && <path d={body} transform={`translate(${h * 0.03} ${h * 0.03})`} fill={C.ink} />}
        <path d={body} fill={fill(glow, "#fffdf8")} stroke={ink(glow)} strokeWidth={sw} strokeLinejoin="round" />
        <path d={band} fill={glow ? "rgba(143,216,255,0.16)" : C.yellow} stroke={ink(glow)} strokeWidth={sw} strokeLinejoin="round" />
        <circle cx={w / 2} cy={hy} r={h * 0.045} fill={glow ? C.navyOut : C.paper} stroke={ink(glow)} strokeWidth={sw * 0.8} />
        {schnur > 0 && <path d={`M${w / 2} 0 L${w / 2 - h * 0.012} ${hy - h * 0.045}`} stroke={ink(glow)} strokeWidth={sw * 0.7} strokeLinecap="round" />}
        {schnur > 0 && nagel && <circle cx={w / 2} cy={0} r={h * 0.03} fill={ink(glow)} />}
      </svg>
      {label && (
        <div style={{ position: "absolute", left: c * 0.6, top: y0 + c * 0.5, transform: "translateY(-50%)", fontFamily: MONO, fontWeight: 700, fontSize: h * 0.062, letterSpacing: h * 0.01, color: labelFarbe ?? (glow ? C.glow : C.ink) }}>{label}</div>
      )}
      <div style={{ position: "absolute", left: 0, right: 0, top: y0 + c, height: h - c, display: "flex", alignItems: "center", justifyContent: "center" }}>{children}</div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Kopf-Silhouette (Profil nach rechts) mit Sprechblase im Inneren. welle 0..1 = Ausschlag der Schallwellen.
// ---------------------------------------------------------------------------
export const Kopf: React.FC<P & { blase?: number; welle?: number; phase?: number }> = ({ size = 420, glow, style, blase = 1, welle = 0, phase = 0 }) => (
  <svg width={size} height={size * 1.15} viewBox="0 0 400 460" style={{ overflow: "visible", ...gl(glow), ...style }}>
    <path
      d="M140 452 L146 380 C 70 352, 34 284, 40 200 C 48 92, 136 22, 236 24 C 326 26, 378 96, 372 186 L 396 252 C 400 264, 392 270, 380 272 L 374 274 L 378 300 C 380 310, 372 314, 364 316 L 366 340 C 368 366, 344 376, 302 372 L 296 452 Z"
      fill={fill(glow, "#d9cfc2")}
      stroke={ink(glow)}
      strokeWidth={8}
      strokeLinejoin="round"
    />
    {/* Ohr */}
    <path d="M168 196 C 140 186, 132 238, 162 244" fill="none" stroke={ink(glow)} strokeWidth={6} strokeLinecap="round" />
    {/* Sprechblase innen */}
    <g opacity={blase} transform={`translate(250 150) scale(${0.6 + 0.4 * blase}) translate(-250 -150)`}>
      <path d="M176 92 L 324 92 Q 344 92 344 112 L 344 186 Q 344 206 324 206 L 300 206 L 316 238 L 272 206 L 196 206 Q 176 206 176 186 L 176 112 Q 176 92 196 92 Z" fill={glow ? "rgba(143,216,255,0.12)" : "#ffffff"} stroke={ink(glow)} strokeWidth={6} strokeLinejoin="round" />
      {[0, 1, 2, 3, 4, 5, 6].map((k) => {
        const a = 0.25 + 0.75 * Math.abs(Math.sin(phase * 1.7 + k * 1.3)) * welle + (1 - welle) * 0.08;
        const hh = 12 + 74 * a;
        return <rect key={k} x={196 + k * 20} y={149 - hh / 2} width={10} height={hh} rx={5} fill={glow ? AMBER : C.red} />;
      })}
    </g>
  </svg>
);

/** Silben-Kachel (HTML). */
export const Silbe: React.FC<{ text: string; glow?: boolean; aktiv?: number; size?: number; style?: React.CSSProperties }> = ({ text, glow, aktiv = 0, size = 30, style }) => (
  <span
    style={{
      display: "inline-block",
      fontFamily: MONO,
      fontWeight: 700,
      fontSize: size,
      lineHeight: 1,
      padding: `${size * 0.36}px ${size * 0.42}px`,
      borderRadius: size * 0.36,
      border: `3px solid ${aktiv > 0.5 ? AMBER : glow ? C.glow : C.ink}`,
      background: aktiv > 0.5 ? AMBER : glow ? "rgba(70,110,170,0.4)" : C.paper2,
      color: aktiv > 0.5 ? C.navyOut : glow ? HELL : C.ink,
      boxShadow: glow ? (aktiv > 0.5 ? "0 0 22px rgba(255,184,46,0.7)" : "0 0 12px rgba(143,216,255,0.25)") : `3px 3px 0 ${C.ink}`,
      whiteSpace: "nowrap",
      ...style,
    }}
  >
    {text}
  </span>
);

/** Mund (geschlossene Lippen); durch 0..1 = roter Strich. */
export const Mund: React.FC<P & { durch?: number }> = ({ size = 200, glow, style, durch = 0 }) => (
  <svg width={size} height={size * 0.6} viewBox="0 0 200 120" style={{ overflow: "visible", ...gl(glow), ...style }}>
    <path d="M14 60 C 50 18, 80 30, 100 40 C 120 30, 150 18, 186 60 C 150 104, 50 104, 14 60 Z" fill={glow ? "rgba(255,123,110,0.3)" : "#e57a72"} stroke={ink(glow)} strokeWidth={7} strokeLinejoin="round" />
    <path d="M22 60 C 70 66, 130 66, 178 60" fill="none" stroke={ink(glow)} strokeWidth={6} strokeLinecap="round" />
    <path d="M10 112 L 190 8" stroke={glow ? "#ff7b6e" : C.red} strokeWidth={14} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - durch} />
  </svg>
);

// ---------------------------------------------------------------------------
// Restaurant: Speisekarte (normal oder „schick“) und Kassenbon
// ---------------------------------------------------------------------------
export const Speisekarte: React.FC<{ w: number; h: number; schick?: boolean; titel?: string; preis?: React.ReactNode; zeilen?: number; style?: React.CSSProperties }> = ({
  w,
  h,
  schick,
  titel = "SPEISEKARTE",
  preis,
  zeilen = 3,
  style,
}) => {
  const bg = schick ? "#20242c" : "#fffdf8";
  const fg = schick ? "#f3e6c4" : C.ink;
  const bar = schick ? "rgba(243,230,196,0.35)" : C.line;
  return (
    <div style={{ position: "relative", width: w, height: h, background: bg, border: `6px solid ${C.ink}`, borderRadius: 18, boxShadow: `8px 8px 0 ${C.ink}`, overflow: "hidden", ...style }}>
      {schick && <div style={{ position: "absolute", inset: 14, border: "3px solid #c9a75a", borderRadius: 10 }} />}
      <div style={{ position: "absolute", left: 0, right: 0, top: h * 0.07, textAlign: "center", fontFamily: MONO, fontWeight: 700, fontSize: w * 0.06, letterSpacing: w * 0.012, color: schick ? "#c9a75a" : C.muted }}>{titel}</div>
      <div style={{ position: "absolute", left: w * 0.36, right: w * 0.36, top: h * 0.17, height: 4, background: schick ? "#c9a75a" : C.ink, borderRadius: 2 }} />
      {Array.from({ length: zeilen }).map((_, k) => {
        const mitte = k === Math.floor(zeilen / 2);
        const y = h * 0.27 + (k * (h * 0.66)) / zeilen;
        return (
          <div key={k} style={{ position: "absolute", left: w * 0.1, right: w * 0.08, top: y, height: (h * 0.66) / zeilen, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={{ width: w * (mitte ? 0.36 : 0.42), height: w * 0.035, background: mitte ? fg : bar, borderRadius: 6, opacity: mitte ? 0.85 : 1 }} />
              <div style={{ width: w * 0.26, height: w * 0.022, background: bar, borderRadius: 4, marginTop: w * 0.02 }} />
            </div>
            {mitte && preis ? (
              <div style={{ color: fg }}>{preis}</div>
            ) : (
              <div style={{ width: w * 0.14, height: w * 0.035, background: bar, borderRadius: 6 }} />
            )}
          </div>
        );
      })}
    </div>
  );
};

/** Kassenbon mit Zackenkante unten; len = Höhe in px (wächst bei „mehr aus“). */
export const Kassenbon: React.FC<{ w: number; len: number; zeilen?: number; style?: React.CSSProperties }> = ({ w, len, zeilen = 3, style }) => {
  const z = 14;
  const n = Math.round(w / (z * 2));
  const zack = Array.from({ length: n })
    .map((_, k) => `L${(k * 2 + 1) * (w / (n * 2))} ${len + z} L${((k + 1) * 2) * (w / (n * 2))} ${len}`)
    .join(" ");
  const rows = Math.max(1, zeilen);
  return (
    <div style={{ position: "relative", width: w, height: len + z, ...style }}>
      <svg width={w} height={len + z} viewBox={`0 0 ${w} ${len + z}`} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
        <path d={`M0 0 L${w} 0 L${w} ${len} ${zack} L0 ${len} Z`} transform="translate(6 6)" fill="rgba(31,28,26,0.85)" />
        <path d={`M0 0 L${w} 0 L${w} ${len} ${zack} L0 ${len} Z`} fill="#ffffff" stroke={C.ink} strokeWidth={5} strokeLinejoin="round" />
      </svg>
      <div style={{ position: "absolute", left: 0, right: 0, top: 12, textAlign: "center", fontFamily: MONO, fontWeight: 700, fontSize: w * 0.1, letterSpacing: 3, color: C.muted }}>BON</div>
      {Array.from({ length: rows }).map((_, k) => {
        const y = 12 + w * 0.17 + k * 34;
        if (y > len - 60) return null;
        return (
          <div key={k} style={{ position: "absolute", left: w * 0.12, right: w * 0.12, top: y, display: "flex", justifyContent: "space-between" }}>
            <div style={{ width: w * (0.34 + 0.12 * ((k * 7) % 3) / 2), height: 10, background: C.line, borderRadius: 5 }} />
            <div style={{ width: w * 0.16, height: 10, background: C.line, borderRadius: 5 }} />
          </div>
        );
      })}
      <div style={{ position: "absolute", left: w * 0.1, right: w * 0.1, top: len - 46, borderTop: `4px dashed ${C.ink}`, paddingTop: 8, display: "flex", justifyContent: "space-between" }}>
        <div style={{ width: w * 0.3, height: 12, background: C.ink, borderRadius: 6 }} />
        <div style={{ width: w * 0.22, height: 12, background: C.ink, borderRadius: 6 }} />
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Übertrag: Onlineshop-Kachel und Friseur-Preisliste (generisch, keine Marke)
// ---------------------------------------------------------------------------
export const ShopKachel: React.FC<P> = ({ size = 220, style }) => (
  <svg width={size} height={size * 1.1} viewBox="0 0 200 220" style={{ overflow: "visible", ...style }}>
    <rect x={10} y={10} width={180} height={200} rx={16} fill="#ffffff" stroke={C.ink} strokeWidth={7} />
    <path d="M10 42 L190 42" stroke={C.ink} strokeWidth={6} />
    <circle cx={28} cy={26} r={5} fill={C.red} />
    <circle cx={44} cy={26} r={5} fill={C.yellow} />
    <circle cx={60} cy={26} r={5} fill={C.green} />
    <rect x={28} y={56} width={144} height={92} rx={10} fill={C.sky} stroke={C.ink} strokeWidth={5} />
    {/* Produkt: Tasche */}
    <path d="M74 88 L126 88 L132 136 L68 136 Z" fill={C.red} stroke={C.ink} strokeWidth={5} strokeLinejoin="round" />
    <path d="M86 88 C 86 70, 114 70, 114 88" fill="none" stroke={C.ink} strokeWidth={5} />
    <rect x={28} y={160} width={90} height={10} rx={5} fill={C.line} />
    <rect x={28} y={178} width={144} height={22} rx={8} fill={C.green} stroke={C.ink} strokeWidth={4} />
    {/* Warenkorb */}
    <path d="M136 182 L142 182 L146 194 L162 194 L166 186 L144 186" fill="none" stroke="#ffffff" strokeWidth={3.5} strokeLinejoin="round" strokeLinecap="round" />
  </svg>
);

export const FriseurListe: React.FC<P> = ({ size = 220, style }) => (
  <svg width={size} height={size * 1.1} viewBox="0 0 200 220" style={{ overflow: "visible", ...style }}>
    <path d="M70 18 L100 4 L130 18" fill="none" stroke={C.ink} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
    <rect x={14} y={18} width={172} height={194} rx={12} fill="#2b3a33" stroke={C.ink} strokeWidth={7} />
    <rect x={24} y={28} width={152} height={174} rx={6} fill="none" stroke="#c8a46a" strokeWidth={4} />
    {/* Schere */}
    <g transform="translate(100 66) rotate(-20)">
      <circle cx={-16} cy={14} r={11} fill="none" stroke="#f3efe6" strokeWidth={6} />
      <circle cx={16} cy={14} r={11} fill="none" stroke="#f3efe6" strokeWidth={6} />
      <path d="M-8 4 L 20 -30 M8 4 L -20 -30" stroke="#f3efe6" strokeWidth={6} strokeLinecap="round" />
    </g>
    {[0, 1, 2].map((k) => (
      <g key={k}>
        <rect x={40} y={112 + k * 28} width={k === 1 ? 70 : 84} height={9} rx={4.5} fill="rgba(243,239,230,0.55)" />
        <rect x={130} y={112 + k * 28} width={32} height={9} rx={4.5} fill="rgba(243,239,230,0.55)" />
      </g>
    ))}
  </svg>
);

// ---------------------------------------------------------------------------
// Pointe: Kasse mit Schublade (auf 0..1)
// ---------------------------------------------------------------------------
export const Kasse: React.FC<P & { auf?: number; anzeige?: React.ReactNode }> = ({ size = 360, style, auf = 0, anzeige }) => (
  <div style={{ position: "relative", width: size, height: size * 0.86, ...style }}>
    <svg width={size} height={size * 0.86} viewBox="0 0 360 310" style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
      {/* Anzeige */}
      <path d="M200 20 L330 20 L330 92 L200 92 Z" fill="#26303d" stroke={C.ink} strokeWidth={8} strokeLinejoin="round" />
      <path d="M250 92 L250 120 L280 120 L280 92" fill={C.steel} stroke={C.ink} strokeWidth={7} />
      {/* Körper */}
      <path d="M30 120 L330 120 L350 232 L10 232 Z" fill={C.red} stroke={C.ink} strokeWidth={8} strokeLinejoin="round" />
      {[0, 1, 2].map((r) =>
        [0, 1, 2, 3, 4].map((k) => <rect key={`${r}-${k}`} x={60 + k * 40 + r * 4} y={138 + r * 28} width={28} height={18} rx={5} fill="#fbe3dc" stroke={C.ink} strokeWidth={4} />),
      )}
      <rect x={270} y={140} width={46} height={74} rx={8} fill={C.yellow} stroke={C.ink} strokeWidth={5} />
      {/* Schublade */}
      <g transform={`translate(0 ${auf * 46})`}>
        <rect x={20} y={232} width={320} height={60} rx={8} fill="#f3efe6" stroke={C.ink} strokeWidth={8} />
        <rect x={150} y={254} width={60} height={12} rx={6} fill={C.ink} />
      </g>
      <rect x={14} y={226} width={332} height={14} rx={6} fill={C.ink} />
    </svg>
    <div style={{ position: "absolute", left: (200 / 360) * size, top: (20 / 360) * size, width: (130 / 360) * size, height: (72 / 360) * size * 1.0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: MONO, fontWeight: 700, fontSize: size * 0.09, color: C.glow }}>
      {anzeige}
    </div>
  </div>
);

// ---------------------------------------------------------------------------
// Nachbesserung 20.10.: Balkenwaage für den Hook („Gleicher Preis, gleiches Gefühl.“) und Gast-Punkt (Cornell, 201 Gäste)
// ---------------------------------------------------------------------------
/** Balkenwaage: Fuß, Stange, Balken um `th` Grad gekippt (positiv = links unten). `schnuere` = Linien Hängepunkt → Schild. */
export const Waage: React.FC<{ px: number; py: number; arm: number; th: number; fuss: number; schnuere?: [number, number, number, number][] }> = ({ px, py, arm, th, fuss, schnuere = [] }) => (
  <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
    {schnuere.map(([x1, y1, x2, y2], i) => (
      <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={C.ink} strokeWidth={5} strokeLinecap="round" />
    ))}
    <path d={`M${px - 170} ${fuss + 40} L${px - 120} ${fuss} L${px + 120} ${fuss} L${px + 170} ${fuss + 40} Z`} fill={C.steel} stroke={C.ink} strokeWidth={7} strokeLinejoin="round" />
    <rect x={px - 15} y={py} width={30} height={fuss - py} fill="#d9d2c3" stroke={C.ink} strokeWidth={7} />
    <g transform={`rotate(${-th} ${px} ${py})`}>
      <rect x={px - arm - 26} y={py - 15} width={2 * arm + 52} height={30} rx={15} fill={C.yellow} stroke={C.ink} strokeWidth={7} />
      <circle cx={px - arm} cy={py} r={9} fill={C.ink} />
      <circle cx={px + arm} cy={py} r={9} fill={C.ink} />
    </g>
    <circle cx={px} cy={py} r={24} fill={C.paper} stroke={C.ink} strokeWidth={7} />
    <circle cx={px} cy={py} r={7} fill={C.ink} />
  </svg>
);

/** Ein Gast als Punktfigur (Kopf + Schultern). */
export const Gast: React.FC<{ x: number; y: number; s?: number; farbe?: string }> = ({ x, y, s = 1, farbe = C.paper2 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <circle cx={0} cy={-9} r={8} fill={farbe} stroke={C.ink} strokeWidth={3.5} />
    <path d="M-13 13 Q-13 1 0 1 Q13 1 13 13 Z" fill={farbe} stroke={C.ink} strokeWidth={3.5} strokeLinejoin="round" />
  </g>
);
