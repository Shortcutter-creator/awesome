// Hotel-Bausteine im warmen Abendlicht: Lobby, Tresen, Figuren (drei Freunde, Rezeptionist, Page), Geld, Preistafel,
// Aufzug, Handschrift. SVG/HTML in Bildkoordinaten (1080 × 1920).
import React from "react";
import { loadFont } from "@remotion/google-fonts/Caveat";
import { HEAD, MONO, ease, rgba } from "../../basis/lib";

const { fontFamily: CAVEAT } = loadFont("normal", { weights: ["600", "700"], subsets: ["latin", "latin-ext"] });
export const HAND = CAVEAT;

export const GOLD = "#f2b45a";
export const AMBER = "#e08a3c";
export const DUNKEL = "#24140f";
export const WAND = "#5a3626";
export const WAND2 = "#6e4632";
export const BODEN = "#3a2219";
export const MESSING = "#d9a84e";
export const CREME = "#fbecd2";
export const KORALLE = "#e2664a";
export const GRUEN = "#3fae6a";
export const FREUNDE = ["#3e8e8a", "#d9a43b", "#c95a44"];
const HAUT = "#f1c9a5";

/** Szene sichtbar zwischen a und b (kurze Überblendung). */
export const sz = (t: number, a: number, b: number, bl = 0.25) =>
  t < a - bl || t > b + bl ? 0 : Math.min(a <= 0 ? 1 : ease(t, a - bl, a + 0.05), 1 - ease(t, b - 0.05, b + bl));

/** Kurze Kamerafahrten (0,35 s, 6 %) auf Schlüsselwörter. */
export const kamera = (t: number, punkte: number[]) => {
  const p = [...punkte].sort((a, b) => a - b);
  const k = p.filter((a) => t >= a).length;
  const z = (i: number) => 1 + 0.06 * (i % 2);
  return k === 0 ? 1 : z(k - 1) + (z(k) - z(k - 1)) * ease(t, p[k - 1], p[k - 1] + 0.35);
};

// ---------------------------------------------------------------------------
// Lobby im Abendlicht. licht 0..1 dimmt alles ab (für das Ende).
// ---------------------------------------------------------------------------
export const Lobby: React.FC<{ t: number; licht?: number; tresen?: boolean }> = ({ t, licht = 1, tresen = true }) => (
  <g>
    <defs>
      <linearGradient id="ho-wand" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#3b2219" />
        <stop offset="100%" stopColor={WAND2} />
      </linearGradient>
      <linearGradient id="ho-fenster" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#ffd88f" />
        <stop offset="60%" stopColor="#f59a52" />
        <stop offset="100%" stopColor="#c8573a" />
      </linearGradient>
      <linearGradient id="ho-strahl" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor={GOLD} stopOpacity={0.35} />
        <stop offset="100%" stopColor={GOLD} stopOpacity={0} />
      </linearGradient>
      <radialGradient id="ho-leuchter" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#ffe3a8" stopOpacity={0.9} />
        <stop offset="100%" stopColor="#ffe3a8" stopOpacity={0} />
      </radialGradient>
    </defs>
    <rect width={1080} height={1920} fill={DUNKEL} />
    <rect x={0} y={250} width={1080} height={820} fill="url(#ho-wand)" />
    {/* Holzpaneele */}
    {Array.from({ length: 7 }, (_, i) => <rect key={i} x={i * 160 + 10} y={860} width={140} height={200} rx={6} fill="none" stroke={rgba("#000000", 0.25)} strokeWidth={4} />)}
    {/* Fenster mit Abendhimmel */}
    {[110, 330].map((x) => (
      <g key={x}>
        <path d={`M${x},820 L${x},430 A90,90 0 0 1 ${x + 180},430 L${x + 180},820 Z`} fill="url(#ho-fenster)" stroke={MESSING} strokeWidth={8} />
        <line x1={x + 90} y1={340} x2={x + 90} y2={820} stroke={MESSING} strokeWidth={6} />
        <line x1={x} y1={600} x2={x + 180} y2={600} stroke={MESSING} strokeWidth={6} />
        <circle cx={x + 120} cy={700} r={34} fill="#fff1c4" opacity={0.8} />
      </g>
    ))}
    {/* Lichtstrahlen auf den Boden */}
    {[110, 330].map((x, i) => (
      <polygon key={x} points={`${x},450 ${x + 180},450 ${x + 520 + 20 * Math.sin(t * 0.5 + i)},1310 ${x + 200},1310`} fill="url(#ho-strahl)" />
    ))}
    {/* Kronleuchter */}
    <line x1={760} y1={250} x2={760} y2={360} stroke={MESSING} strokeWidth={5} />
    <circle cx={760} cy={400} r={150} fill="url(#ho-leuchter)" opacity={0.6 + 0.08 * Math.sin(t * 2)} />
    <path d="M690,390 Q760,450 830,390" fill="none" stroke={MESSING} strokeWidth={8} />
    {[690, 725, 760, 795, 830].map((x) => <circle key={x} cx={x} cy={390 + (x === 760 ? 26 : 8)} r={10} fill="#fff1c4" />)}
    {/* Boden */}
    <rect x={0} y={1070} width={1080} height={240} fill={BODEN} />
    {Array.from({ length: 9 }, (_, i) => <line key={i} x1={i * 140 - 200} y1={1310} x2={i * 140 + 40} y2={1070} stroke={rgba(CREME, 0.06)} strokeWidth={4} />)}
    <rect x={0} y={1070} width={1080} height={6} fill={rgba(MESSING, 0.5)} />
    {/* Pflanze */}
    <rect x={40} y={1000} width={70} height={80} rx={8} fill="#7a4a30" />
    {[-40, -15, 10, 35].map((dx, i) => <ellipse key={i} cx={75 + dx} cy={950 - (i % 2) * 40} rx={22} ry={70} fill="#2f5d3a" transform={`rotate(${dx * 0.8} ${75 + dx} 980)`} />)}
    {/* Tresen */}
    {tresen ? (
      <g>
        <rect x={600} y={870} width={420} height={210} rx={10} fill="#7a4428" />
        <rect x={590} y={860} width={440} height={22} rx={6} fill={MESSING} />
        {[0, 1, 2].map((i) => <rect key={i} x={625 + i * 135} y={905} width={110} height={150} rx={6} fill="none" stroke={rgba("#000000", 0.25)} strokeWidth={4} />)}
        <Klingel x={960} y={860} />
      </g>
    ) : null}
    {licht < 1 ? <rect width={1080} height={1920} fill="#0a0503" opacity={(1 - licht) * 0.85} /> : null}
  </g>
);

export const Klingel: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-30} y={-8} width={60} height={8} rx={3} fill="#3b2a20" />
    <path d="M-24,-8 A24,24 0 0 1 24,-8 Z" fill={MESSING} />
    <rect x={-3} y={-40} width={6} height={10} fill={MESSING} />
    <ellipse cx={-8} cy={-20} rx={6} ry={4} fill="#fff1c4" opacity={0.7} />
  </g>
);

// ---------------------------------------------------------------------------
// Figuren
// ---------------------------------------------------------------------------
/** Freund: Füße bei (x, y), Höhe ≈ 330·s. gehen = Phase (0 = steht). */
export const Freund: React.FC<{ x: number; y: number; s?: number; farbe: string; gehen?: number; haar?: string; o?: number }> = ({ x, y, s = 1, farbe, gehen = 0, haar = "#3b2418", o = 1 }) => {
  const k = Math.sin(gehen * Math.PI * 2);
  const hop = gehen ? Math.abs(k) * 6 : 0;
  return (
    <g transform={`translate(${x} ${y - hop}) scale(${s})`} opacity={o}>
      <ellipse cx={0} cy={hop / s} rx={60} ry={10} fill={rgba("#000000", 0.25)} />
      <path d={`M-16,-120 L${-18 + 14 * k},0`} stroke="#2b2b35" strokeWidth={26} strokeLinecap="round" />
      <path d={`M16,-120 L${18 - 14 * k},0`} stroke="#2b2b35" strokeWidth={26} strokeLinecap="round" />
      <path d={`M-44,-250 Q0,-266 44,-250 L50,-110 L-50,-110 Z`} fill={farbe} />
      <path d={`M-44,-240 L${-62 - 8 * k},-140`} stroke={farbe} strokeWidth={24} strokeLinecap="round" />
      <path d={`M44,-240 L${62 + 8 * k},-140`} stroke={farbe} strokeWidth={24} strokeLinecap="round" />
      <circle cx={-62 - 8 * k} cy={-136} r={12} fill={HAUT} />
      <circle cx={62 + 8 * k} cy={-136} r={12} fill={HAUT} />
      <circle cx={0} cy={-296} r={40} fill={HAUT} />
      <path d="M-40,-300 Q-38,-346 0,-344 Q38,-346 40,-300 Q20,-318 0,-316 Q-20,-318 -40,-300 Z" fill={haar} />
      <circle cx={-14} cy={-294} r={4} fill="#2b1a12" />
      <circle cx={14} cy={-294} r={4} fill="#2b1a12" />
      <path d="M-10,-276 Q0,-268 10,-276" fill="none" stroke="#2b1a12" strokeWidth={3} strokeLinecap="round" />
    </g>
  );
};

/** Rezeptionist hinter dem Tresen: Brust bei (x, y). stutzt 0..1 hebt eine Braue. blick: −1 links … 1 rechts. */
export const Rezeptionist: React.FC<{ x: number; y: number; s?: number; stutzt?: number; blick?: number }> = ({ x, y, s = 1, stutzt = 0, blick = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-70,0 Q0,-30 70,0 L80,120 L-80,120 Z" fill="#7b1f2a" />
    <path d="M-18,-12 L0,40 L18,-12 Z" fill="#ffffff" />
    <path d="M-14,-4 L0,6 L14,-4 L14,10 L0,2 L-14,10 Z" fill="#1d1d24" />
    <circle cx={0} cy={-60} r={44} fill={HAUT} />
    <path d="M-44,-66 Q-40,-112 0,-110 Q40,-112 44,-66 Q30,-90 0,-88 Q-30,-90 -44,-66 Z" fill="#2b1a12" />
    <circle cx={-15 + 5 * blick} cy={-58} r={4.5} fill="#2b1a12" />
    <circle cx={15 + 5 * blick} cy={-58} r={4.5} fill="#2b1a12" />
    <path d={`M-24,${-72 - 6 * stutzt} L-8,${-70 - 2 * stutzt}`} stroke="#2b1a12" strokeWidth={4} strokeLinecap="round" />
    <path d={`M8,-70 L24,${-72 + 4 * stutzt}`} stroke="#2b1a12" strokeWidth={4} strokeLinecap="round" />
    <path d={stutzt > 0.5 ? "M-10,-36 L10,-38" : "M-10,-38 Q0,-30 10,-38"} fill="none" stroke="#2b1a12" strokeWidth={3} strokeLinecap="round" />
  </g>
);

/** Page (Hotelpage) mit Kappe: Füße bei (x, y), Höhe ≈ 300·s. zwinkern 0..1. */
export const Page: React.FC<{ x: number; y: number; s?: number; zwinkern?: number; hand?: number; o?: number }> = ({ x, y, s = 1, zwinkern = 0, hand = 0, o = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o}>
    <ellipse cx={0} cy={0} rx={56} ry={9} fill={rgba("#000000", 0.25)} />
    <path d="M-15,-110 L-17,0" stroke="#1d1d24" strokeWidth={24} strokeLinecap="round" />
    <path d="M15,-110 L17,0" stroke="#1d1d24" strokeWidth={24} strokeLinecap="round" />
    <path d="M-42,-228 Q0,-240 42,-228 L46,-100 L-46,-100 Z" fill="#b8272f" />
    {[-200, -170, -140].map((yy) => <circle key={yy} cx={0} cy={yy} r={5} fill={MESSING} />)}
    <path d={`M-42,-220 L-56,-130`} stroke="#b8272f" strokeWidth={22} strokeLinecap="round" />
    <path d={`M42,-220 L${56 - 50 * hand},${-130 - 40 * hand}`} stroke="#b8272f" strokeWidth={22} strokeLinecap="round" />
    <circle cx={-56} cy={-126} r={11} fill={HAUT} />
    <circle cx={56 - 50 * hand} cy={-126 - 40 * hand} r={11} fill={HAUT} />
    <circle cx={0} cy={-270} r={38} fill={HAUT} />
    <rect x={-30} y={-320} width={60} height={26} rx={6} fill="#b8272f" />
    <rect x={-30} y={-300} width={60} height={6} fill={MESSING} />
    <circle cx={-13} cy={-268} r={4} fill="#2b1a12" />
    {zwinkern > 0.5 ? <path d="M7,-268 L19,-268" stroke="#2b1a12" strokeWidth={4} strokeLinecap="round" /> : <circle cx={13} cy={-268} r={4} fill="#2b1a12" />}
    <path d="M-10,-250 Q2,-242 12,-252" fill="none" stroke="#2b1a12" strokeWidth={3} strokeLinecap="round" />
  </g>
);

// ---------------------------------------------------------------------------
// Geld
// ---------------------------------------------------------------------------
export const Schein: React.FC<{ x: number; y: number; w?: number; rot?: number; wert?: 10 | 5; o?: number }> = ({ x, y, w = 260, rot = 0, wert = 10, o = 1 }) => {
  const h = w * 0.53;
  const f = wert === 10 ? "#c7604a" : "#8fa3a0";
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`} opacity={o}>
      <rect x={-w / 2 + 6} y={-h / 2 + 8} width={w} height={h} rx={10} fill={rgba("#000000", 0.25)} />
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={10} fill={f} stroke="#5c2a1f" strokeWidth={3} />
      <rect x={-w / 2 + 14} y={-h / 2 + 14} width={w - 28} height={h - 28} rx={8} fill="none" stroke={rgba("#ffffff", 0.45)} strokeWidth={3} />
      <circle cx={w * 0.18} cy={0} r={h * 0.3} fill={rgba("#ffffff", 0.2)} />
      <text x={-w / 2 + 26} y={-h / 2 + h * 0.42} fontFamily={HEAD} fontWeight={900} fontSize={h * 0.36} fill="#ffffff">{wert}</text>
      <text x={w / 2 - 30} y={h / 2 - 22} textAnchor="end" fontFamily={HEAD} fontWeight={900} fontSize={h * 0.3} fill="#ffffff">€</text>
    </g>
  );
};

/** Euromünze: 1 € (goldener Kern, silberner Ring) oder 2 € (umgekehrt). dreh = Drehwinkel um die senkrechte Achse (Grad). */
export const Muenze: React.FC<{ x: number; y: number; r?: number; wert?: 1 | 2; dreh?: number; glanz?: number; o?: number; farbe?: string }> = ({ x, y, r = 40, wert = 1, dreh = 0, glanz = 0, o = 1, farbe }) => {
  const sx = Math.cos((dreh * Math.PI) / 180);
  const gold = "#e8b84a", silber = "#d6d9de";
  const aussen = farbe ?? (wert === 1 ? silber : gold);
  const innen = farbe ?? (wert === 1 ? gold : silber);
  return (
    <g transform={`translate(${x} ${y}) scale(${Math.max(0.04, Math.abs(sx))} 1)`} opacity={o}>
      {glanz > 0 ? <circle r={r * 1.7} fill={rgba(GOLD, 0.35 * glanz)} /> : null}
      <circle r={r} fill={aussen} stroke="#8a6a2a" strokeWidth={3} />
      <circle r={r * 0.68} fill={innen} stroke={rgba("#000000", 0.2)} strokeWidth={2} />
      {sx > 0 ? <text y={r * 0.26} textAnchor="middle" fontFamily={HEAD} fontWeight={900} fontSize={r * 0.8} fill="#6b4a1a">{wert}</text> : <text y={r * 0.22} textAnchor="middle" fontFamily={HEAD} fontWeight={900} fontSize={r * 0.6} fill="#6b4a1a">€</text>}
    </g>
  );
};

// ---------------------------------------------------------------------------
// Preistafel an der Wand. neu 0..1: alter Preis gestrichen, neuer erscheint.
// ---------------------------------------------------------------------------
export const Preistafel: React.FC<{ x: number; y: number; neu: number }> = ({ x, y, neu }) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x={-170} y={-120} width={340} height={240} rx={14} fill="#1f1a17" stroke={MESSING} strokeWidth={8} />
    <text x={0} y={-62} textAnchor="middle" fontFamily={MONO} fontWeight={700} fontSize={30} letterSpacing={4} fill={CREME}>ZIMMER</text>
    <text x={0} y={10} textAnchor="middle" fontFamily={HAND} fontWeight={700} fontSize={84} fill={neu > 0.3 ? rgba(CREME, 0.5) : CREME}>30 €</text>
    {neu > 0 ? <line x1={-90} y1={-14} x2={-90 + 180 * Math.min(1, neu * 2)} y2={-14} stroke={KORALLE} strokeWidth={9} strokeLinecap="round" /> : null}
    {neu > 0.5 ? <text x={0} y={92} textAnchor="middle" fontFamily={HAND} fontWeight={700} fontSize={64} fill={GOLD} opacity={Math.min(1, (neu - 0.5) * 2)}>heute 25 €</text> : null}
  </g>
);

// ---------------------------------------------------------------------------
// Aufzug mit Messingtüren. offen 0..1.
// ---------------------------------------------------------------------------
export const Aufzug: React.FC<{ offen: number; children?: React.ReactNode }> = ({ offen, children }) => (
  <g>
    <rect width={1080} height={1920} fill={DUNKEL} />
    <rect x={0} y={250} width={1080} height={1060} fill={WAND} />
    <rect x={190} y={330} width={700} height={980} rx={12} fill="#2a1a12" stroke={MESSING} strokeWidth={14} />
    <rect x={204} y={344} width={672} height={952} fill="#f0c784" opacity={0.85} />
    <rect x={204} y={344} width={672} height={952} fill="url(#ho-innen)" />
    <defs>
      <radialGradient id="ho-innen" cx="50%" cy="20%" r="80%">
        <stop offset="0%" stopColor="#fff1c4" stopOpacity={0.6} />
        <stop offset="100%" stopColor="#8a5a2e" stopOpacity={0.6} />
      </radialGradient>
    </defs>
    {children}
    <rect x={204} y={344} width={336 * (1 - offen)} height={952} fill={MESSING} />
    <rect x={540 + 336 * offen} y={344} width={336 * (1 - offen)} height={952} fill={MESSING} />
    {offen < 0.98 ? <line x1={540 - 336 * offen} y1={344} x2={540 - 336 * offen} y2={1296} stroke="#8a6a2a" strokeWidth={6} /> : null}
    <rect x={470} y={270} width={140} height={44} rx={10} fill="#1f1a17" />
    <text x={540} y={302} textAnchor="middle" fontFamily={MONO} fontWeight={700} fontSize={28} fill={GOLD}>▲ 3</text>
  </g>
);

/** Handschrift-Zeile, die sich von links „schreibt“ (Maske wächst). */
export const Schrift: React.FC<{ t: number; a: number; text: string; x: number; y: number; size?: number; farbe?: string; dauer?: number; anker?: "start" | "middle" }> = ({
  t, a, text, x, y, size = 90, farbe = CREME, dauer = 0.6, anker = "middle",
}) => {
  if (t < a) return null;
  const k = ease(t, a, a + dauer);
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: anker === "middle" ? "translate(-50%,-50%)" : "translateY(-50%)", whiteSpace: "nowrap", fontFamily: HAND, fontWeight: 700, fontSize: size, color: farbe, clipPath: `inset(-20% ${100 - k * 100}% -20% -5%)`, textShadow: "0 4px 18px rgba(0,0,0,0.5)" }}>
      {text}
    </div>
  );
};

/** Einblendung: helle Karte mit großer Zeile (wie im Skript „Einblendung“). */
export const Einblendung: React.FC<{ t: number; a: number; b?: number; text: React.ReactNode; top?: number; size?: number }> = ({ t, a, b = Infinity, text, top = 330, size = 64 }) => {
  if (t < a || t > b + 0.3) return null;
  const p = Math.min(1, ease(t, a, a + 0.3)) * (Number.isFinite(b) ? 1 - ease(t, b, b + 0.3) : 1);
  return (
    <div style={{ position: "absolute", left: 540, top, transform: `translate(-50%,0) scale(${0.85 + 0.15 * p})`, opacity: p, background: rgba(CREME, 0.94), color: DUNKEL, borderRadius: 24, padding: "14px 34px 18px", fontFamily: HEAD, fontWeight: 900, fontSize: size, whiteSpace: "nowrap", boxShadow: `0 10px 40px ${rgba("#000000", 0.45)}, 0 0 0 5px ${rgba(MESSING, 0.8)}` }}>
      {text}
    </div>
  );
};
