// Kino-Bausteine im warmen Licht: Foyer mit Lauflichtern, Popcorn-Theke, Popcorn-Becher (S/M/L) mit Preisschild,
// Person von hinten mit Gedankenblase, Lockvogel-Etikett, Pfeil, Dreistufen-Kacheln. SVG/HTML in Bildkoordinaten (1080 × 1920).
import React from "react";
import { HEAD, MONO, ease, pop, rgba } from "../../basis/lib";

export const BORDEAUX = "#3a0d14";
export const BORDEAUX2 = "#5c1620";
export const DUNKEL = "#1a070b";
export const GOLD = "#f6c35b";
export const CREME = "#fff3dc";
export const ROT = "#e0383e";
export const GRUEN = "#3fbf72";
export const KORALLE = "#ff6b5a";

export const sz = (t: number, a: number, b: number, bl = 0.25) =>
  t < a - bl || t > b + bl ? 0 : Math.min(a <= 0 ? 1 : ease(t, a - bl, a + 0.05), 1 - ease(t, b - 0.05, b + bl));

export const kamera = (t: number, punkte: number[]) => {
  const p = [...punkte].sort((a, b) => a - b);
  const k = p.filter((a) => t >= a).length;
  const z = (i: number) => 1 + 0.05 * (i % 2);
  return k === 0 ? 1 : z(k - 1) + (z(k) - z(k - 1)) * ease(t, p[k - 1], p[k - 1] + 0.35);
};

// ---------------------------------------------------------------------------
// Foyer: Wand mit Plakaten, Lauflicht-Leiste, Theke mit Popcornmaschine. licht 0..1 dimmt.
// ---------------------------------------------------------------------------
export const Foyer: React.FC<{ t: number; licht?: number; theke?: boolean }> = ({ t, licht = 1, theke = true }) => (
  <g>
    <defs>
      <linearGradient id="ki-wand" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={DUNKEL} />
        <stop offset="100%" stopColor={BORDEAUX2} />
      </linearGradient>
      <radialGradient id="ki-spot" cx="50%" cy="0%" r="80%">
        <stop offset="0%" stopColor={GOLD} stopOpacity={0.35} />
        <stop offset="100%" stopColor={GOLD} stopOpacity={0} />
      </radialGradient>
    </defs>
    <rect width={1080} height={1920} fill={DUNKEL} />
    <rect x={0} y={250} width={1080} height={1060} fill="url(#ki-wand)" />
    {/* Lauflichter */}
    <rect x={40} y={262} width={1000} height={46} rx={10} fill="#2a0a10" stroke={GOLD} strokeWidth={4} />
    {Array.from({ length: 24 }, (_, i) => {
      const an = (i + Math.floor(t * 6)) % 3 === 0;
      return <circle key={i} cx={64 + i * 41.5} cy={285} r={9} fill={an ? "#fff4c4" : "#8a6a2a"} opacity={an ? 1 : 0.6} />;
    })}
    {/* Plakate */}
    {[120, 420, 720].map((x, i) => (
      <g key={x}>
        <rect x={x} y={360} width={240} height={340} rx={8} fill={["#1f2a44", "#3b1f3e", "#203b33"][i]} stroke={GOLD} strokeWidth={6} />
        <circle cx={x + 120} cy={480} r={60} fill={rgba(CREME, 0.12)} />
        <rect x={x + 30} y={600} width={180} height={18} rx={6} fill={rgba(CREME, 0.25)} />
        <rect x={x + 60} y={630} width={120} height={14} rx={6} fill={rgba(CREME, 0.18)} />
      </g>
    ))}
    <rect x={0} y={250} width={1080} height={1060} fill="url(#ki-spot)" />
    {theke ? (
      <g>
        {/* Popcornmaschine */}
        <rect x={760} y={730} width={220} height={260} rx={10} fill={rgba("#fff3dc", 0.12)} stroke={GOLD} strokeWidth={6} />
        <rect x={760} y={700} width={220} height={40} rx={8} fill={ROT} />
        <text x={870} y={728} textAnchor="middle" fontFamily={HEAD} fontWeight={900} fontSize={26} fill={CREME}>POPCORN</text>
        {Array.from({ length: 26 }, (_, i) => {
          const sprung = Math.max(0, Math.sin(t * 5 + i * 1.7));
          return <circle key={i} cx={785 + ((i * 37) % 170)} cy={960 - ((i * 23) % 80) - 30 * sprung * (i % 4 === 0 ? 1 : 0)} r={11} fill="#fff1c2" stroke="#e8c27a" strokeWidth={2} />;
        })}
        {/* Theke */}
        <rect x={60} y={990} width={960} height={320} rx={14} fill="#6e1c26" />
        <rect x={50} y={975} width={980} height={30} rx={10} fill={GOLD} />
        {Array.from({ length: 6 }, (_, i) => <rect key={i} x={90 + i * 155} y={1040} width={120} height={230} rx={8} fill="none" stroke={rgba("#000000", 0.3)} strokeWidth={4} />)}
      </g>
    ) : null}
    {licht < 1 ? <rect width={1080} height={1920} fill="#050102" opacity={(1 - licht) * 0.85} /> : null}
  </g>
);

// ---------------------------------------------------------------------------
// Popcorn-Becher: Mitte unten bei (x, y). groesse 0.7 / 0.85 / 1.1. glow für Hervorhebung.
// ---------------------------------------------------------------------------
export const Becher: React.FC<{ x: number; y: number; s?: number; glow?: number; grau?: number; o?: number; kipp?: number }> = ({ x, y, s = 1, glow = 0, grau = 0, o = 1, kipp = 0 }) => {
  const w = 170, h = 230;
  const streifen = Array.from({ length: 5 }, (_, i) => i);
  return (
    <g transform={`translate(${x} ${y}) rotate(${kipp}) scale(${s})`} opacity={o} style={{ filter: grau > 0 ? `grayscale(${grau})` : undefined }}>
      {glow > 0 ? <ellipse cx={0} cy={-h / 2} rx={w} ry={h * 0.9} fill={rgba(GOLD, 0.35 * glow)} /> : null}
      <ellipse cx={0} cy={6} rx={w * 0.45} ry={10} fill={rgba("#000000", 0.35)} />
      {/* Popcorn oben */}
      {Array.from({ length: 11 }, (_, i) => (
        <circle key={i} cx={-w / 2 + 14 + (i * 37) % (w - 20)} cy={-h - 6 - ((i * 17) % 30)} r={24} fill="#fff1c2" stroke="#e8c27a" strokeWidth={3} />
      ))}
      <clipPath id={`ki-b-${Math.round(x)}-${Math.round(s * 100)}`}>
        <path d={`M${-w / 2},${-h} L${w / 2},${-h} L${w / 2 - 26},0 L${-w / 2 + 26},0 Z`} />
      </clipPath>
      <g clipPath={`url(#ki-b-${Math.round(x)}-${Math.round(s * 100)})`}>
        <rect x={-w / 2} y={-h} width={w} height={h} fill="#ffffff" />
        {streifen.map((i) => <rect key={i} x={-w / 2 + i * (w / 5) * 1.0} y={-h} width={w / 10} height={h} fill={ROT} />)}
      </g>
      <path d={`M${-w / 2},${-h} L${w / 2},${-h} L${w / 2 - 26},0 L${-w / 2 + 26},0 Z`} fill="none" stroke="#7a1a1f" strokeWidth={5} />
      <rect x={-w / 2 - 6} y={-h - 8} width={w + 12} height={16} rx={6} fill="#ffffff" stroke="#7a1a1f" strokeWidth={4} />
    </g>
  );
};

/** Preisschild unter einem Becher (HTML). */
export const Preisschild: React.FC<{ t: number; a: number; x: number; y: number; name: string; preis: string; hell?: boolean; farbe?: string }> = ({ t, a, x, y, name, preis, hell, farbe }) => {
  if (t < a) return null;
  const p = pop(t, a, 210, 12);
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translateX(-50%) scale(${p})`, textAlign: "center", background: hell ? CREME : rgba(CREME, 0.92), color: DUNKEL, borderRadius: 16, padding: "8px 18px 10px", boxShadow: `0 8px 24px rgba(0,0,0,0.4)${farbe ? `, 0 0 0 5px ${farbe}` : ""}`, whiteSpace: "nowrap" }}>
      <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 30 }}>🍿 {name}</div>
      <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 40 }}>{preis}</div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Person von hinten (Kopf und Schultern), blick −1..1 dreht den Kopf. Mitte unten (x, y).
// ---------------------------------------------------------------------------
export const PersonHinten: React.FC<{ x: number; y: number; s?: number; blick?: number }> = ({ x, y, s = 1, blick = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-190,0 Q-180,-150 -60,-170 L60,-170 Q180,-150 190,0 Z" fill="#2b2f45" />
    <rect x={-34} y={-215} width={68} height={60} rx={20} fill="#e2b48f" />
    <g transform={`translate(${blick * 22} 0) rotate(${blick * 8} 0 -280)`}>
      <ellipse cx={0} cy={-290} rx={88} ry={98} fill="#e2b48f" />
      <path d="M-90,-300 Q-92,-400 0,-398 Q92,-400 90,-300 Q88,-250 70,-232 Q40,-258 0,-258 Q-40,-258 -70,-232 Q-88,-250 -90,-300 Z" fill="#3b2418" />
      <ellipse cx={-88 + blick * 10} cy={-284} rx={14} ry={22} fill="#d9a07c" />
      <ellipse cx={88 + blick * 10} cy={-284} rx={14} ry={22} fill="#d9a07c" />
    </g>
  </g>
);

/** Gedankenblase mit Inhalt (HTML). */
export const Gedanke: React.FC<{ t: number; a: number; x: number; y: number; children: React.ReactNode; b?: number }> = ({ t, a, x, y, children, b = Infinity }) => {
  if (t < a || t > b + 0.25) return null;
  const p = pop(t, a, 190, 13) * (Number.isFinite(b) ? 1 - ease(t, b, b + 0.25) : 1);
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) scale(${p})` }}>
      <div style={{ background: CREME, color: DUNKEL, borderRadius: 60, padding: "22px 36px", fontFamily: HEAD, fontWeight: 800, fontSize: 46, textAlign: "center", whiteSpace: "nowrap", boxShadow: "0 10px 30px rgba(0,0,0,0.45)" }}>{children}</div>
      <div style={{ position: "absolute", left: "50%", bottom: -44, width: 34, height: 34, borderRadius: 17, background: CREME, transform: "translateX(-10px)" }} />
      <div style={{ position: "absolute", left: "50%", bottom: -82, width: 20, height: 20, borderRadius: 10, background: CREME, transform: "translateX(6px)" }} />
    </div>
  );
};

/** Hängendes Etikett „Lockvogel“ an einer Schnur. */
export const Etikett: React.FC<{ t: number; a: number; x: number; y: number; text: string }> = ({ t, a, x, y, text }) => {
  if (t < a) return null;
  const p = pop(t, a, 160, 9);
  const schwing = Math.sin((t - a) * 4) * 6 * Math.exp(-(t - a) * 1.2);
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translateX(-50%) rotate(${schwing - 6}deg) scale(${p})`, transformOrigin: "50% 0" }}>
      <div style={{ width: 4, height: 50, background: GOLD, margin: "0 auto" }} />
      <div style={{ background: GOLD, color: DUNKEL, fontFamily: HEAD, fontWeight: 900, fontSize: 52, padding: "8px 26px 12px", borderRadius: 14, boxShadow: `0 0 30px ${rgba(GOLD, 0.7)}`, whiteSpace: "nowrap" }}>{text}</div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Dreistufen-Kachel für das Ende: Titel + drei Stufen, die mittlere hervorgehoben.
// ---------------------------------------------------------------------------
export const Kachel: React.FC<{ x: number; y: number; w: number; titel: string; stufen: [string, string][]; t: number; a: number }> = ({ x, y, w, titel, stufen, t, a }) => {
  if (t < a) return null;
  const p = pop(t, a, 200, 13);
  const mitte = ease(t, a + 0.4, a + 0.8);
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, transform: `scale(${p})`, transformOrigin: "50% 50%", background: rgba("#000000", 0.45), border: `3px solid ${rgba(GOLD, 0.6)}`, borderRadius: 22, padding: "14px 14px 18px", boxSizing: "border-box" }}>
      <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 34, letterSpacing: 3, color: GOLD, textAlign: "center", marginBottom: 12 }}>{titel}</div>
      <div style={{ display: "flex", gap: 8 }}>
        {stufen.map(([n, preis], i) => (
          <div key={n} style={{ flex: 1, textAlign: "center", borderRadius: 14, padding: "12px 4px", background: i === 1 ? rgba(GOLD, 0.25 + 0.5 * mitte) : rgba(CREME, 0.1), border: i === 1 ? `3px solid ${GOLD}` : "3px solid transparent", transform: i === 1 ? `scale(${1 + 0.08 * mitte})` : undefined }}>
            <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 36, color: CREME }}>{n}</div>
            {preis ? <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 30, color: CREME }}>{preis}</div> : null}
          </div>
        ))}
      </div>
    </div>
  );
};
