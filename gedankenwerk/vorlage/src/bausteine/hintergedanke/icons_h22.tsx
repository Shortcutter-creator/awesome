// Illustrationen Folge 22 (Marke / Halitosis). Gleicher Stil wie icons.tsx; glow = Röntgen-Fassung.
// Kein Original-Logo: Die Flasche trägt nur das Wort „MUNDWASSER“ als schlichten Text auf einem selbst gezeichneten Retro-Etikett.
import React from "react";
import { C, HEAD, MONO } from "../../basis/lib";

type P = { size?: number; glow?: boolean; style?: React.CSSProperties };
const ink = (g?: boolean) => (g ? C.glow : C.ink);
const fill = (g: boolean | undefined, f: string) => (g ? "rgba(143,216,255,0.2)" : f);
const gl = (g?: boolean): React.CSSProperties => (g ? { filter: "drop-shadow(0 0 14px rgba(143,216,255,0.45)) drop-shadow(0 0 3px rgba(143,216,255,0.8))" } : {});
const HELL = "#eaf7ff";
const AMBER = "#ffb82e";
export const ATEM = "#b7d98b"; // Atemwolke (hell)
export const ATEM_GLOW = "rgba(150,230,150,0.32)";

// ---------------------------------------------------------------------------
// Retro-Mundwasserflasche: Breite = size, Höhe = size * 1.62 (viewBox 220×356).
// name 0..1 schreibt „MUNDWASSER“ aufs Etikett, banner 0..1 rollt das rote Band „HALITOSIS“ aus.
// ---------------------------------------------------------------------------
export const FL = { w: 220, h: 356, bannerY: 262 };
export const Flasche: React.FC<P & { name?: number; banner?: number; pegel?: number }> = ({ size = 300, glow, style, name = 1, banner = 0, pegel = 1 }) => {
  const id = glow ? "flg" : "fln";
  const liq = glow ? "rgba(255,184,46,0.42)" : "#d99a2b";
  const liqHell = glow ? "rgba(255,210,120,0.35)" : "#e9b955";
  const top = 128 + (1 - pegel) * 180;
  return (
    <svg width={size} height={(size * FL.h) / FL.w} viewBox={`0 0 ${FL.w} ${FL.h}`} style={{ overflow: "visible", ...gl(glow), ...style }}>
      <defs>
        <clipPath id={`${id}-body`}>
          <path d="M92 70 L128 70 L128 92 Q128 104 150 112 Q196 126 196 156 L196 330 Q196 346 180 346 L40 346 Q24 346 24 330 L24 156 Q24 126 70 112 Q92 104 92 92 Z" />
        </clipPath>
        <clipPath id={`${id}-name`}>
          <rect x={44} y={150} width={132 * name} height={70} />
        </clipPath>
      </defs>
      {/* Schatten-Flasche (harter Versatz wie Karten) */}
      {!glow && <path d="M100 78 L136 78 L136 100 Q136 112 158 120 Q204 134 204 164 L204 338 Q204 354 188 354 L48 354 Q32 354 32 338 L32 164 Q32 134 78 120 Q100 112 100 100 Z" fill={C.ink} />}
      {/* Glas */}
      <path d="M92 70 L128 70 L128 92 Q128 104 150 112 Q196 126 196 156 L196 330 Q196 346 180 346 L40 346 Q24 346 24 330 L24 156 Q24 126 70 112 Q92 104 92 92 Z"
        fill={glow ? "rgba(143,216,255,0.08)" : "#f4ead2"} />
      {/* Flüssigkeit */}
      <g clipPath={`url(#${id}-body)`}>
        <rect x={20} y={top} width={180} height={240} fill={liq} />
        <rect x={20} y={top} width={180} height={12} fill={liqHell} />
      </g>
      <path d="M92 70 L128 70 L128 92 Q128 104 150 112 Q196 126 196 156 L196 330 Q196 346 180 346 L40 346 Q24 346 24 330 L24 156 Q24 126 70 112 Q92 104 92 92 Z"
        fill="none" stroke={ink(glow)} strokeWidth={8} strokeLinejoin="round" />
      {/* Glanzstreifen */}
      <path d="M40 170 L40 316" stroke={glow ? HELL : "#ffffff"} strokeWidth={9} strokeLinecap="round" opacity={0.55} />
      {/* Korken + Kapsel */}
      <rect x={86} y={20} width={48} height={52} rx={8} fill={fill(glow, "#8a5a3a")} stroke={ink(glow)} strokeWidth={7} />
      <path d="M94 34 L126 34 M94 48 L126 48" stroke={glow ? C.glow : "#5e3b24"} strokeWidth={4} />
      <rect x={80} y={62} width={60} height={14} rx={5} fill={fill(glow, "#c9a24a")} stroke={ink(glow)} strokeWidth={6} />
      {/* Etikett */}
      <rect x={36} y={140} width={148} height={170} rx={8} fill={glow ? "rgba(143,216,255,0.14)" : "#f6efdc"} stroke={ink(glow)} strokeWidth={6} />
      <rect x={45} y={149} width={130} height={152} rx={4} fill="none" stroke={glow ? "rgba(143,216,255,0.6)" : C.red} strokeWidth={3} />
      <path d="M62 170 L158 170" stroke={glow ? "rgba(143,216,255,0.6)" : C.ink} strokeWidth={3} />
      <circle cx={110} cy={170} r={6} fill={glow ? C.glow : C.red} />
      <g clipPath={`url(#${id}-name)`}>
        <text x={110} y={208} textAnchor="middle" fontFamily={HEAD} fontWeight={900} fontSize={26} textLength={116} lengthAdjust="spacingAndGlyphs" fill={glow ? HELL : C.ink}>MUNDWASSER</text>
      </g>
      <path d="M62 224 L158 224" stroke={glow ? "rgba(143,216,255,0.6)" : C.ink} strokeWidth={3} opacity={name} />
      <rect x={70} y={234} width={80} height={6} rx={3} fill={glow ? "rgba(143,216,255,0.35)" : C.line} opacity={name} />
      {/* Band „HALITOSIS“ */}
      {banner > 0.001 && (
        <g transform={`translate(110 ${FL.bannerY}) scale(${banner} 1) translate(-110 -${FL.bannerY})`}>
          <path d={`M22 ${FL.bannerY - 18} L198 ${FL.bannerY - 18} L190 ${FL.bannerY} L198 ${FL.bannerY + 18} L22 ${FL.bannerY + 18} L30 ${FL.bannerY} Z`}
            fill={glow ? "rgba(255,184,46,0.55)" : C.red} stroke={glow ? AMBER : C.ink} strokeWidth={5} strokeLinejoin="round" />
          <text x={110} y={FL.bannerY + 8} textAnchor="middle" fontFamily={HEAD} fontWeight={900} fontSize={22} textLength={128} lengthAdjust="spacingAndGlyphs" fill={glow ? HELL : "#ffffff"}>HALITOSIS</text>
        </g>
      )}
    </svg>
  );
};

// ---------------------------------------------------------------------------
// Kopf im Profil (Blick nach rechts), Mund offen. Breite = size, Höhe = size * 1.28 (viewBox 360×460).
// Mundpunkt (Austritt Atem) liegt bei (330, 272) im viewBox.
// ---------------------------------------------------------------------------
export const KOPF = { w: 360, h: 460, mx: 330, my: 272 };
export const Kopf: React.FC<P & { haut?: string; haar?: string; hemd?: string }> = ({ size = 360, glow, style, haut = "#e7c4a3", haar = "#5a4636", hemd = "#4d7fd1" }) => (
  <svg width={size} height={(size * KOPF.h) / KOPF.w} viewBox={`0 0 ${KOPF.w} ${KOPF.h}`} style={{ overflow: "visible", ...gl(glow), ...style }}>
    {/* Schultern */}
    <path d="M30 456 Q30 380 150 372 L250 372 Q340 380 340 456 Z" fill={fill(glow, hemd)} stroke={ink(glow)} strokeWidth={8} strokeLinejoin="round" />
    {/* Hals */}
    <path d="M140 300 L140 392 Q190 410 240 392 L240 320 Z" fill={fill(glow, haut)} stroke={ink(glow)} strokeWidth={8} strokeLinejoin="round" />
    {/* Kopf */}
    <path d="M118 340 C 96 300 74 260 76 200 C 80 110 150 50 236 52 C 300 54 326 110 322 166 L 352 222 Q 356 230 346 232 L 322 236 C 328 246 330 252 326 258 L 304 268 L 324 282 C 328 300 320 318 296 332 C 274 344 252 346 236 350 Q 170 364 118 340 Z"
      fill={fill(glow, haut)} stroke={ink(glow)} strokeWidth={8} strokeLinejoin="round" />
    {/* Mundöffnung */}
    <path d="M327 257 L300 268 L325 283 Q336 270 327 257 Z" fill={glow ? "rgba(143,216,255,0.35)" : "#6a2a2a"} stroke={ink(glow)} strokeWidth={6} strokeLinejoin="round" />
    {/* Haare */}
    <path d="M76 214 C 64 120 130 40 230 44 C 300 46 334 92 326 138 C 300 112 250 104 214 116 C 204 150 178 170 150 176 C 128 180 112 200 108 236 Z"
      fill={fill(glow, haar)} stroke={ink(glow)} strokeWidth={8} strokeLinejoin="round" />
    {/* Ohr */}
    <path d="M156 206 C 128 200 124 254 156 258" fill={fill(glow, haut)} stroke={ink(glow)} strokeWidth={7} strokeLinecap="round" />
    {/* Auge + Braue */}
    <circle cx={286} cy={178} r={9} fill={ink(glow)} />
    <path d="M268 152 Q290 142 308 152" fill="none" stroke={ink(glow)} strokeWidth={7} strokeLinecap="round" />
    {/* Wange */}
    <circle cx={262} cy={250} r={18} fill={glow ? "rgba(255,123,110,0.25)" : "#eaa48f"} opacity={0.7} />
  </svg>
);

// ---------------------------------------------------------------------------
// Atemwolke: Vereinigung von Kreisen (erst Kontur, dann Füllung → saubere Außenlinie).
// Breite = size, Höhe = size * 0.75 (viewBox 400×300). p 0..1 lässt die Bällchen nacheinander quellen,
// wob = Restschwingung (klingt ab, kein Dauer-Pulsieren), ph = Phase.
// Andockpunkt (zum Mund) unten links bei (0, 300).
// ---------------------------------------------------------------------------
const BALLS: [number, number, number][] = [
  [26, 278, 18], [62, 252, 30], [112, 214, 52], [178, 168, 78], [256, 136, 88], [330, 168, 64], [300, 222, 62], [214, 226, 66], [150, 152, 54], [356, 118, 40],
];
export const Wolke: React.FC<P & { p?: number; wob?: number; ph?: number; farbe?: string; linien?: number }> = ({ size = 400, glow, style, p = 1, wob = 0, ph = 0, farbe = ATEM, linien = 1 }) => {
  const r = BALLS.map(([, , rr], i) => {
    const q = Math.max(0, Math.min(1, p * BALLS.length * 0.55 - i * 0.45));
    const ease = 1 - Math.pow(1 - q, 3);
    return Math.max(0, rr * ease + wob * rr * 0.08 * Math.sin(ph * 5 + i * 1.7));
  });
  const stroke = glow ? "rgba(150,230,150,0.9)" : C.ink;
  return (
    <svg width={size} height={size * 0.75} viewBox="0 0 400 300" style={{ overflow: "visible", ...(glow ? { filter: "drop-shadow(0 0 14px rgba(150,230,150,0.5))" } : {}), ...style }}>
      {BALLS.map(([x, y], i) => r[i] > 0 && <circle key={`o${i}`} cx={x} cy={y} r={r[i] + 7} fill={stroke} />)}
      {BALLS.map(([x, y], i) => r[i] > 0 && <circle key={`f${i}`} cx={x} cy={y} r={r[i]} fill={glow ? "#1f3a3a" : farbe} />)}
      {glow && BALLS.map(([x, y], i) => r[i] > 0 && <circle key={`g${i}`} cx={x} cy={y} r={r[i]} fill={ATEM_GLOW} />)}
      {/* Geruchs-Kringel */}
      <g opacity={linien * Math.max(0, Math.min(1, p * 2 - 1))} fill="none" stroke={glow ? "rgba(190,255,190,0.85)" : "#6f9a45"} strokeWidth={7} strokeLinecap="round">
        <path d="M200 160 q 14 -14 28 0 t 28 0 t 28 0" />
        <path d="M150 210 q 14 -14 28 0 t 28 0 t 28 0" />
        <path d="M250 196 q 12 -12 24 0 t 24 0" />
      </g>
    </svg>
  );
};

// ---------------------------------------------------------------------------
// Klemmbrett „Befund“ mit Diagnose-Feld. Breite = size, Höhe = size * 1.3 (viewBox 300×390).
// frage 0..1 → rotes „?“, fach 0..1 → gelbes Feld „FACHNAME“.
// ---------------------------------------------------------------------------
export const Klemmbrett: React.FC<P & { frage?: number; fach?: number; label?: string }> = ({ size = 300, style, frage = 0, fach = 0, label = "FACHNAME" }) => (
  <svg width={size} height={size * 1.3} viewBox="0 0 300 390" style={{ overflow: "visible", ...style }}>
    <rect x={14} y={30} width={280} height={356} rx={20} fill={C.ink} />
    <rect x={6} y={22} width={280} height={356} rx={20} fill="#b98a5e" stroke={C.ink} strokeWidth={8} />
    <rect x={30} y={58} width={232} height={300} rx={6} fill={C.paper2} stroke={C.ink} strokeWidth={6} />
    {/* Klemme */}
    <rect x={96} y={6} width={100} height={46} rx={10} fill={C.steel} stroke={C.ink} strokeWidth={7} />
    <circle cx={146} cy={24} r={7} fill={C.ink} />
    {/* Kopf */}
    <text x={52} y={104} fontFamily={HEAD} fontWeight={900} fontSize={34} letterSpacing={2} fill={C.ink}>BEFUND</text>
    <path d="M226 78 L238 78 L238 90 L250 90 L250 102 L238 102 L238 114 L226 114 L226 102 L214 102 L214 90 L226 90 Z" fill={C.red} stroke={C.ink} strokeWidth={3} />
    {[132, 156, 180].map((y, i) => <rect key={y} x={52} y={y} width={[188, 150, 170][i]} height={8} rx={4} fill={C.line} />)}
    <text x={52} y={226} fontFamily={MONO} fontWeight={700} fontSize={20} letterSpacing={3} fill={C.muted}>DIAGNOSE:</text>
    <rect x={48} y={238} width={196} height={96} rx={10} fill="#ffffff" stroke={C.ink} strokeWidth={5} strokeDasharray={fach > 0.5 ? undefined : "12 9"} />
    {frage > 0.001 && (
      <text x={146} y={318} textAnchor="middle" fontFamily={HEAD} fontWeight={900} fontSize={88} fill={C.red} opacity={Math.min(1, frage) * (1 - Math.min(1, fach))}
        transform={`translate(146 290) scale(${Math.max(0.01, frage)}) translate(-146 -290)`}>?</text>
    )}
    {fach > 0.001 && (
      <g opacity={Math.min(1, fach)} transform={`translate(146 286) scale(${0.6 + 0.4 * fach}) rotate(-3) translate(-146 -286)`}>
        <rect x={58} y={262} width={176} height={50} rx={6} fill={C.yellow} stroke={C.ink} strokeWidth={4} />
        <text x={146} y={297} textAnchor="middle" fontFamily={MONO} fontWeight={700} fontSize={26} letterSpacing={label.length > 9 ? 0 : 2} fill={C.ink}>{label}</text>
      </g>
    )}
  </svg>
);

// ---------------------------------------------------------------------------
// Altes Medizin-Lexikon (HTML, 3D-Aufklappen). Seitenbreite w, Höhe h; aufgeklappt belegt es 2w.
// Die linke Kante (Buchrücken) liegt bei x = w (Container ist 2w breit).
// wortWeg 0..1 blendet den Eintrag „Halitosis“ auf der Seite aus (er fliegt heraus).
// ---------------------------------------------------------------------------
export const Lexikon: React.FC<{ w: number; h: number; auf: number; wortWeg?: number; markiert?: number; style?: React.CSSProperties }> = ({ w, h, auf, wortWeg = 0, markiert = 0, style }) => {
  const leder = "#7a2e24";
  const gold = "#e2b84a";
  const zeilen = (n: number, seed: number) =>
    Array.from({ length: n }, (_, i) => (
      <div key={i} style={{ height: 9, width: `${62 + ((i * 37 + seed * 13) % 34)}%`, background: "#cfc6b4", borderRadius: 5, marginBottom: 15 }} />
    ));
  return (
    <div style={{ position: "relative", width: 2 * w, height: h, perspective: 1800, ...style }}>
      {/* rechte Seite: Seitenblock (sichtbar, sobald der Deckel aufgeht) */}
      <div style={{ position: "absolute", left: w, top: 0, width: w, height: h, background: "#f3ebd8", border: `6px solid ${C.ink}`, borderRadius: "4px 14px 14px 4px", boxShadow: `8px 8px 0 ${C.ink}`, padding: "34px 30px", boxSizing: "border-box", overflow: "hidden" }}>
        <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 18, letterSpacing: 3, color: C.muted, marginBottom: 18 }}>H</div>
        {zeilen(3, 1)}
        <div style={{ position: "relative", margin: "6px 0 16px", height: 54 }}>
          <div style={{ position: "absolute", left: -10, top: 0, right: -6, height: 54, background: C.yellow, borderRadius: 6, opacity: markiert * (1 - 0.6 * wortWeg) }} />
          <div style={{ position: "relative", fontFamily: HEAD, fontWeight: 900, fontSize: 40, letterSpacing: -0.5, color: C.ink, lineHeight: "54px", paddingLeft: 4, opacity: 1 - wortWeg }}>Halitosis</div>
          {wortWeg > 0 && <div style={{ position: "absolute", left: 0, top: 6, width: w * 0.62, height: 42, border: `4px dashed ${C.muted}`, borderRadius: 8, opacity: wortWeg }} />}
        </div>
        {zeilen(6, 3)}
      </div>
      {/* Deckel: dreht um den Buchrücken nach links */}
      <div style={{ position: "absolute", left: w, top: 0, width: w, height: h, transformOrigin: "0 50%", transform: `rotateY(${-178 * auf}deg)`, transformStyle: "preserve-3d" }}>
        {/* Vorderseite */}
        <div style={{ position: "absolute", inset: 0, background: leder, border: `6px solid ${C.ink}`, borderRadius: "4px 14px 14px 4px", boxShadow: auf < 0.05 ? `8px 8px 0 ${C.ink}` : "none", backfaceVisibility: "hidden", boxSizing: "border-box" }}>
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 30, background: "#5e211a", borderRight: `5px solid ${C.ink}` }} />
          <div style={{ position: "absolute", left: 54, right: 22, top: 26, bottom: 26, border: `4px solid ${gold}`, borderRadius: 8 }} />
          <div style={{ position: "absolute", left: 54, right: 22, top: 36, bottom: 36, border: `2px solid ${gold}`, borderRadius: 6, margin: "0 10px" }} />
          <div style={{ position: "absolute", left: 30, right: 0, top: h * 0.3, textAlign: "center", fontFamily: HEAD, fontWeight: 900, color: gold, lineHeight: 1.05 }}>
            <div style={{ fontSize: w * 0.135, letterSpacing: 3 }}>MEDIZIN</div>
            <div style={{ width: "50%", height: 4, background: gold, margin: "12px auto" }} />
            <div style={{ fontSize: w * 0.135, letterSpacing: 3 }}>LEXIKON</div>
          </div>
        </div>
        {/* Rückseite (Innendeckel) */}
        <div style={{ position: "absolute", inset: 0, background: "#efe4cc", border: `6px solid ${C.ink}`, borderRadius: "14px 4px 4px 14px", transform: "rotateY(180deg)", backfaceVisibility: "hidden", boxSizing: "border-box", padding: "34px 30px" }}>
          <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 18, letterSpacing: 3, color: C.muted, marginBottom: 18 }}>G</div>
          {zeilen(10, 5)}
        </div>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Figur im Profil (Blick nach rechts) für die Retro-Anzeige. Breite = size, Höhe = size * 1.3 (viewBox 200×260).
// Mundpunkt bei (150, 96).
// ---------------------------------------------------------------------------
export const Figur: React.FC<P & { haar?: "lang" | "kurz"; farbe?: string }> = ({ size = 200, glow, style, haar = "kurz", farbe = "#4d7fd1" }) => (
  <svg width={size} height={size * 1.3} viewBox="0 0 200 260" style={{ overflow: "visible", ...gl(glow), ...style }}>
    {haar === "lang" && <path d="M48 72 C 40 30 90 8 124 22 C 150 32 156 60 150 74 L 120 70 C 112 100 100 130 64 150 C 44 130 46 100 48 72 Z" fill={fill(glow, "#7a4a2a")} stroke={ink(glow)} strokeWidth={7} strokeLinejoin="round" />}
    <path d="M24 258 Q24 168 100 160 Q176 168 176 258 Z" fill={fill(glow, farbe)} stroke={ink(glow)} strokeWidth={7} strokeLinejoin="round" />
    <path d="M86 132 L86 166 Q100 174 114 166 L114 132 Z" fill={fill(glow, "#e7c4a3")} stroke={ink(glow)} strokeWidth={7} strokeLinejoin="round" />
    <path d="M60 86 C 58 46 86 30 112 32 C 140 34 152 58 150 78 L 162 98 L 150 102 C 152 112 150 122 140 126 C 128 134 110 138 96 134 C 72 128 62 112 60 86 Z" fill={fill(glow, "#e7c4a3")} stroke={ink(glow)} strokeWidth={7} strokeLinejoin="round" />
    {haar === "kurz" ? (
      <path d="M58 88 C 50 44 86 22 120 28 C 146 32 156 50 152 64 C 130 54 108 56 94 64 C 86 74 82 86 72 96 Z" fill={fill(glow, "#3b3029")} stroke={ink(glow)} strokeWidth={7} strokeLinejoin="round" />
    ) : (
      <path d="M58 88 C 50 40 92 20 124 30 C 148 38 156 56 150 70 C 126 56 100 56 86 68 C 80 80 76 90 70 98 Z" fill={fill(glow, "#7a4a2a")} stroke={ink(glow)} strokeWidth={7} strokeLinejoin="round" />
    )}
    <circle cx={128} cy={78} r={6} fill={ink(glow)} />
    <path d="M136 112 L150 108" stroke={ink(glow)} strokeWidth={5} strokeLinecap="round" />
  </svg>
);

/** Herz, gestrichelt = leer. */
export const Herz: React.FC<P & { leer?: boolean; zug?: number }> = ({ size = 160, glow, style, leer = true, zug = 1 }) => (
  <svg width={size} height={size * 0.9} viewBox="0 0 200 180" style={{ overflow: "visible", ...gl(glow), ...style }}>
    <path d="M100 168 C 40 120 8 90 10 54 C 12 24 36 8 62 10 C 82 12 94 24 100 40 C 106 24 118 12 138 10 C 164 8 188 24 190 54 C 192 90 160 120 100 168 Z"
      fill={leer ? "none" : glow ? "rgba(255,123,110,0.6)" : C.red} stroke={glow ? "#ffd2cc" : C.red} strokeWidth={10} strokeLinejoin="round"
      strokeDasharray={leer ? "22 16" : undefined} pathLength={leer ? undefined : 1} opacity={zug} />
  </svg>
);

/** Ring (Ehering) von der Seite. */
export const Ring: React.FC<P> = ({ size = 120, glow, style }) => (
  <svg width={size} height={size} viewBox="0 0 120 120" style={{ overflow: "visible", ...gl(glow), ...style }}>
    <ellipse cx={60} cy={72} rx={44} ry={40} fill="none" stroke={glow ? AMBER : C.yellow} strokeWidth={14} />
    <ellipse cx={60} cy={72} rx={44} ry={40} fill="none" stroke={ink(glow)} strokeWidth={4} />
    <path d="M48 30 L60 12 L72 30 L60 40 Z" fill={glow ? HELL : "#ffffff"} stroke={ink(glow)} strokeWidth={5} strokeLinejoin="round" />
  </svg>
);

// ---------------------------------------------------------------------------
// Pflege-Produkte ohne Marke (Prinzip-Karten): Tube, Tiegel, Serum. Höhe ≈ size.
// ---------------------------------------------------------------------------
export const Tube: React.FC<P & { farbe?: string }> = ({ size = 160, glow, style, farbe = "#f2b8c6" }) => (
  <svg width={size * 0.55} height={size} viewBox="0 0 110 200" style={{ overflow: "visible", ...gl(glow), ...style }}>
    <path d="M14 16 L96 16 L84 150 L26 150 Z" fill={fill(glow, farbe)} stroke={ink(glow)} strokeWidth={7} strokeLinejoin="round" />
    <path d="M10 8 L100 8 L100 22 L10 22 Z" fill={fill(glow, "#ffffff")} stroke={ink(glow)} strokeWidth={6} strokeLinejoin="round" />
    <path d="M22 15 L88 15" stroke={ink(glow)} strokeWidth={3} strokeDasharray="5 5" />
    <rect x={30} y={60} width={50} height={46} rx={6} fill={fill(glow, "#ffffff")} stroke={ink(glow)} strokeWidth={5} />
    <rect x={38} y={72} width={34} height={6} rx={3} fill={ink(glow)} opacity={0.5} />
    <rect x={38} y={86} width={24} height={6} rx={3} fill={ink(glow)} opacity={0.5} />
    <rect x={30} y={150} width={50} height={44} rx={8} fill={fill(glow, "#ffffff")} stroke={ink(glow)} strokeWidth={7} />
  </svg>
);
export const Tiegel: React.FC<P & { farbe?: string }> = ({ size = 160, glow, style, farbe = "#bfe0f4" }) => (
  <svg width={size * 1.25} height={size} viewBox="0 0 200 160" style={{ overflow: "visible", ...gl(glow), ...style }}>
    <rect x={22} y={70} width={156} height={84} rx={18} fill={fill(glow, "#ffffff")} stroke={ink(glow)} strokeWidth={7} />
    <rect x={44} y={92} width={112} height={40} rx={6} fill={fill(glow, farbe)} stroke={ink(glow)} strokeWidth={5} />
    <rect x={14} y={30} width={172} height={44} rx={12} fill={fill(glow, farbe)} stroke={ink(glow)} strokeWidth={7} />
    <path d="M30 44 L170 44" stroke={glow ? HELL : "#ffffff"} strokeWidth={6} strokeLinecap="round" opacity={0.6} />
  </svg>
);
export const Serum: React.FC<P & { farbe?: string }> = ({ size = 160, glow, style, farbe = "#f1c94a" }) => (
  <svg width={size * 0.55} height={size} viewBox="0 0 110 200" style={{ overflow: "visible", ...gl(glow), ...style }}>
    <path d="M40 8 Q55 -6 70 8 L70 42 L40 42 Z" fill={fill(glow, "#3b4049")} stroke={ink(glow)} strokeWidth={6} strokeLinejoin="round" />
    <rect x={32} y={40} width={46} height={26} rx={5} fill={fill(glow, "#c9a24a")} stroke={ink(glow)} strokeWidth={6} />
    <path d="M40 66 L40 80 Q14 86 14 112 L14 180 Q14 194 28 194 L82 194 Q96 194 96 180 L96 112 Q96 86 70 80 L70 66 Z" fill={fill(glow, farbe)} stroke={ink(glow)} strokeWidth={7} strokeLinejoin="round" />
    <rect x={26} y={124} width={58} height={44} rx={6} fill={fill(glow, "#ffffff")} stroke={ink(glow)} strokeWidth={5} />
    <path d="M24 102 L24 176" stroke="#ffffff" strokeWidth={6} strokeLinecap="round" opacity={0.5} />
  </svg>
);

// ---------------------------------------------------------------------------
// Hänge-Etikett (Namensschild) mit Faden. Breite w, Höhe h. Text als HTML (passt sich an).
// ---------------------------------------------------------------------------
export const Schild: React.FC<{ text: string; w: number; h?: number; size?: number; farbe?: string; fg?: string; glow?: boolean; leer?: boolean; style?: React.CSSProperties }> = ({
  text, w, h = 90, size = 40, farbe = C.yellow, fg = C.ink, glow, leer, style,
}) => {
  const rand = glow ? AMBER : C.ink;
  return (
    <div style={{ position: "relative", width: w, height: h, ...style }}>
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ position: "absolute", inset: 0, overflow: "visible", ...(glow ? { filter: "drop-shadow(0 0 14px rgba(255,184,46,0.5))" } : {}) }}>
        {!glow && <path d={`M${h * 0.42 + 7} 7 L${w + 7} 7 L${w + 7} ${h + 7} L${h * 0.42 + 7} ${h + 7} L7 ${h / 2 + 7} Z`} fill={C.ink} />}
        <path d={`M${h * 0.42} 2 L${w - 2} 2 L${w - 2} ${h - 2} L${h * 0.42} ${h - 2} L2 ${h / 2} Z`} fill={leer ? (glow ? "rgba(255,184,46,0.08)" : "#fffdf6") : glow ? "rgba(255,184,46,0.55)" : farbe}
          stroke={rand} strokeWidth={5} strokeLinejoin="round" strokeDasharray={leer ? "14 10" : undefined} />
        <circle cx={h * 0.3} cy={h / 2} r={8} fill={glow ? C.navyOut : C.paper} stroke={rand} strokeWidth={4} />
      </svg>
      <div style={{ position: "absolute", left: h * 0.48, right: 10, top: 0, bottom: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: HEAD, fontWeight: 900, fontSize: size, letterSpacing: -0.5, color: glow ? HELL : fg, whiteSpace: "nowrap" }}>
        {text}
      </div>
    </div>
  );
};

/** Gerader Pfeil (nach rechts), p 0..1 zeichnet ihn. */
export const Pfeil: React.FC<{ len: number; p?: number; farbe?: string; dicke?: number; style?: React.CSSProperties }> = ({ len, p = 1, farbe = C.ink, dicke = 10, style }) => (
  <svg width={len} height={dicke * 5} viewBox={`0 0 ${len} ${dicke * 5}`} style={{ overflow: "visible", ...style }}>
    <line x1={dicke} y1={dicke * 2.5} x2={dicke + (len - dicke * 4) * p} y2={dicke * 2.5} stroke={farbe} strokeWidth={dicke} strokeLinecap="round" />
    {p > 0.6 && <path d={`M${len - dicke * 3.4} ${dicke * 0.6} L${len - dicke * 0.4} ${dicke * 2.5} L${len - dicke * 3.4} ${dicke * 4.4} Z`} fill={farbe} stroke={farbe} strokeWidth={dicke * 0.5} strokeLinejoin="round" opacity={Math.min(1, (p - 0.6) * 2.5)} />}
  </svg>
);

// ---------------------------------------------------------------------------
// Neufassung 20.10.: Bilder zu den erfundenen „Krankheiten“ (American Heritage) und zum Gerichtsurteil.
// ---------------------------------------------------------------------------
/** Fuß mit Geruchslinien (Bromodosis). viewBox 200×160. */
export const Fuss: React.FC<P & { dampf?: number; ph?: number }> = ({ size = 160, glow, style, dampf = 1, ph = 0 }) => (
  <svg width={size * 1.25} height={size} viewBox="0 0 200 160" style={{ overflow: "visible", ...gl(glow), ...style }}>
    <path d="M40 30 L70 30 L74 96 Q120 100 160 112 Q188 120 186 138 Q184 152 160 152 L44 152 Q30 152 30 136 Z" fill={fill(glow, "#e7c4a3")} stroke={ink(glow)} strokeWidth={7} strokeLinejoin="round" />
    {[0, 1, 2].map((i) => (
      <path key={i} d={`M${96 + i * 30} 88 q -10 -14 0 -28 q 10 -14 0 -28`} fill="none" stroke={glow ? "#9fe39f" : "#7fb24a"} strokeWidth={7} strokeLinecap="round"
        opacity={dampf} transform={`translate(${3 * Math.sin(ph * 4 + i)} ${-4 * ((ph * 1.3 + i * 0.33) % 1)})`} />
    ))}
  </svg>
);
/** Magen mit Säure-Blasen (Acidosis). viewBox 200×180. */
export const Magen: React.FC<P & { ph?: number }> = ({ size = 160, glow, style, ph = 0 }) => (
  <svg width={size * 1.1} height={size} viewBox="0 0 200 180" style={{ overflow: "visible", ...gl(glow), ...style }}>
    <path d="M70 10 L70 40 Q40 46 34 86 Q28 134 70 160 Q110 182 150 158 Q186 136 176 100 Q168 74 140 80 Q112 86 104 60 L100 10" fill={fill(glow, "#f2b8c6")} stroke={ink(glow)} strokeWidth={7} strokeLinejoin="round" strokeLinecap="round" />
    {[[80, 120, 9], [110, 136, 7], [130, 112, 6], [96, 100, 5]].map(([x, y, r], i) => (
      <circle key={i} cx={x} cy={y - 10 * ((ph * 0.8 + i * 0.27) % 1)} r={r} fill={glow ? "rgba(255,184,46,0.5)" : "#d7e86a"} stroke={ink(glow)} strokeWidth={4} />
    ))}
  </svg>
);
/** Leeres Zimmer: nackte Glühbirne, einsamer Hocker (Homotosis). viewBox 200×170. */
export const Zimmer: React.FC<P> = ({ size = 160, glow, style }) => (
  <svg width={size * 1.18} height={size} viewBox="0 0 200 170" style={{ overflow: "visible", ...gl(glow), ...style }}>
    <rect x={8} y={8} width={184} height={154} rx={10} fill={fill(glow, "#f1ebdf")} stroke={ink(glow)} strokeWidth={7} />
    <line x1={8} y1={128} x2={192} y2={128} stroke={ink(glow)} strokeWidth={5} />
    <line x1={100} y1={8} x2={100} y2={40} stroke={ink(glow)} strokeWidth={4} />
    <circle cx={100} cy={50} r={12} fill={glow ? AMBER : C.yellow} stroke={ink(glow)} strokeWidth={4} />
    <rect x={128} y={96} width={40} height={10} rx={3} fill={fill(glow, "#b98a5e")} stroke={ink(glow)} strokeWidth={4} />
    <line x1={134} y1={106} x2={130} y2={130} stroke={ink(glow)} strokeWidth={5} />
    <line x1={162} y1={106} x2={166} y2={130} stroke={ink(glow)} strokeWidth={5} />
    <path d="M36 60 L66 92 M66 60 L36 92" stroke={C.muted} strokeWidth={4} strokeDasharray="6 6" />
    <rect x={30} y={54} width={42} height={44} fill="none" stroke={C.muted} strokeWidth={4} strokeDasharray="6 6" />
  </svg>
);
/** Richterhammer; schlag 0..1 senkt den Kopf auf den Block. viewBox 220×180. */
export const Hammer: React.FC<P & { schlag?: number }> = ({ size = 180, glow, style, schlag = 0 }) => (
  <svg width={size * 1.22} height={size} viewBox="0 0 220 180" style={{ overflow: "visible", ...gl(glow), ...style }}>
    <rect x={0} y={158} width={110} height={22} rx={8} fill={fill(glow, "#8a5a36")} stroke={ink(glow)} strokeWidth={7} />
    <g transform={`rotate(${38 * (1 - schlag)} 160 116)`}>
      <rect x={40} y={108} width={120} height={16} rx={7} fill={fill(glow, "#b98a5e")} stroke={ink(glow)} strokeWidth={6} />
      <rect x={20} y={74} width={56} height={84} rx={10} fill={fill(glow, "#7a4a2a")} stroke={ink(glow)} strokeWidth={7} />
      <line x1={20} y1={92} x2={76} y2={92} stroke={ink(glow)} strokeWidth={5} />
      <line x1={20} y1={140} x2={76} y2={140} stroke={ink(glow)} strokeWidth={5} />
    </g>
  </svg>
);
