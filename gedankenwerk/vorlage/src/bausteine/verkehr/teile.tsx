// Verkehrs-Bausteine (Vogelperspektive, Autos fahren nach oben): Straße mit zwei Spuren und Baustelle (rechte Spur
// endet), Leitbaken, Bagger, Absperrung mit Warnleuchten, Autos/Transporter/Lkw von oben mit Bremslicht und Blinker,
// Schild „Fahrstreifen endet“, Fahrer-Gesicht (Kopfschütteln), Zähler. SVG in Bildkoordinaten (1080 × 1920).
import React from "react";
import { HEAD, MONO, ease, rgba } from "../../basis/lib";

export const ASPHALT = "#3a3e45";
export const GRAS = "#4c7a3f";
export const CREME = "#f6f3ec";
export const ROT = "#ff4d4d";
export const GRUEN = "#3ecf7a";
export const GELB = "#ffd23f";
export const ORANGE = "#ff8a1f";
export const NACHT = "#11151c";

// Geometrie (Weltkoordinaten): Spurmitten, Fahrbahnränder, Engstelle
export const SPUR_L = 465;
export const SPUR_R = 615;
export const RAND_L = 388;
export const RAND_R = 692;
export const ENGE = 560; // hier ist die rechte Spur zu Ende (Spitze der Verengung)
export const KEIL = 300; // Länge der Verengung (schräge Baken)

export const FARBEN = ["#e84a5f", "#2f80ed", "#f2c94c", "#27ae60", "#f2994a", "#9b51e0", "#e0e0e0", "#56ccf2", "#eb5757", "#333a44", "#6fcf97", "#bb6bd9"];

export const sz = (t: number, a: number, b: number, bl = 0.22) =>
  t < a - bl || t > b + bl ? 0 : Math.min(a <= 0 ? 1 : ease(t, a - bl, a + 0.05), 1 - ease(t, b - 0.05, b + bl));

export const kamera = (t: number, punkte: number[]) => {
  const p = [...punkte].sort((a, b) => a - b);
  const k = p.filter((a) => t >= a).length;
  const z = (i: number) => 1 + 0.05 * (i % 2);
  return k === 0 ? 1 : z(k - 1) + (z(k) - z(k - 1)) * ease(t, p[k - 1], p[k - 1] + 0.3);
};

/** x-Position der Baken-Linie (rechte Spur wird von RAND_R zur Mitte gedrängt) bei Höhe y. */
export const bakenX = (y: number) => {
  if (y <= ENGE) return 548;
  if (y >= ENGE + KEIL) return RAND_R - 6;
  const k = (y - ENGE) / KEIL;
  return 548 + (RAND_R - 6 - 548) * k;
};

// ---------------------------------------------------------------------------------------------------
// Fahrzeuge von oben (zeigen nach oben). b = Bremslicht 0..1, blink = Blinker (-1 links, 1 rechts, 0 aus)
// ---------------------------------------------------------------------------------------------------
export type Typ = "pkw" | "kombi" | "transporter" | "lkw";
export const LAENGE: Record<Typ, number> = { pkw: 150, kombi: 162, transporter: 180, lkw: 300 };

export const Fahrzeug: React.FC<{ x: number; y: number; farbe: string; typ?: Typ; b?: number; blink?: number; t?: number; dreh?: number; s?: number; licht?: number }> = ({
  x, y, farbe, typ = "pkw", b = 0, blink = 0, t = 0, dreh = 0, s = 1, licht = 0.6,
}) => {
  const L = LAENGE[typ];
  const W = typ === "lkw" ? 92 : typ === "transporter" ? 86 : 78;
  const h = L / 2, w = W / 2;
  const blinkAn = blink !== 0 && Math.floor(t * 3) % 2 === 0;
  const bx = blink < 0 ? -w + 6 : w - 6;
  return (
    <g transform={`translate(${x} ${y}) rotate(${dreh}) scale(${s})`}>
      {/* Schatten */}
      <rect x={-w + 6} y={-h + 10} width={W} height={L} rx={20} fill="rgba(0,0,0,0.35)" />
      {/* Räder */}
      {[-1, 1].map((sx) => [-0.62, 0.6].map((sy) => <rect key={`${sx}${sy}`} x={sx * w - (sx > 0 ? 4 : 10)} y={sy * h - 14} width={14} height={28} rx={4} fill="#15171b" />))}
      {typ === "lkw" ? (
        <g>
          {/* Auflieger */}
          <rect x={-w} y={-h + 70} width={W} height={L - 70} rx={6} fill="#eef0f2" stroke="#b9bec6" strokeWidth={2} />
          {[0, 1, 2, 3, 4, 5].map((i) => <line key={i} x1={-w + 6} x2={w - 6} y1={-h + 100 + i * 34} y2={-h + 100 + i * 34} stroke="#cfd3d9" strokeWidth={2} />)}
          <rect x={-w + 10} y={-h + 120} width={W - 20} height={60} rx={6} fill={farbe} opacity={0.85} />
          {/* Zugmaschine */}
          <rect x={-w + 4} y={-h} width={W - 8} height={66} rx={14} fill={farbe} />
          <rect x={-w + 12} y={-h + 8} width={W - 24} height={18} rx={5} fill="#1d2a38" />
          <rect x={-w + 14} y={-h + 32} width={W - 28} height={26} rx={6} fill={rgba("#ffffff", 0.18)} />
        </g>
      ) : (
        <g>
          <rect x={-w} y={-h} width={W} height={L} rx={typ === "transporter" ? 14 : 24} fill={farbe} />
          {/* Glanz links */}
          <rect x={-w + 4} y={-h + 10} width={w * 0.55} height={L - 20} rx={14} fill={rgba("#ffffff", 0.14)} />
          {/* Motorhaube-Linien */}
          <path d={`M${-w + 14},${-h + 12} Q0,${-h + 2} ${w - 14},${-h + 12}`} fill="none" stroke={rgba("#000000", 0.18)} strokeWidth={2} />
          {/* Frontscheibe */}
          <path d={`M${-w + 8},${-h + (typ === "transporter" ? 26 : 44)} Q0,${-h + (typ === "transporter" ? 16 : 34)} ${w - 8},${-h + (typ === "transporter" ? 26 : 44)} L${w - 12},${-h + (typ === "transporter" ? 50 : 70)} L${-w + 12},${-h + (typ === "transporter" ? 50 : 70)} Z`} fill="#1b2633" />
          <path d={`M${-w + 14},${-h + (typ === "transporter" ? 28 : 46)} L${-w + 26},${-h + (typ === "transporter" ? 46 : 66)}`} stroke={rgba("#ffffff", 0.35)} strokeWidth={3} />
          {/* Dach */}
          <rect x={-w + 12} y={-h + (typ === "transporter" ? 52 : 72)} width={W - 24} height={typ === "transporter" ? L - 64 : typ === "kombi" ? 62 : 46} rx={10} fill={farbe} stroke={rgba("#000000", 0.18)} strokeWidth={2} />
          {/* Heckscheibe */}
          {typ !== "transporter" ? <path d={`M${-w + 12},${h - (typ === "kombi" ? 24 : 34)} L${w - 12},${h - (typ === "kombi" ? 24 : 34)} L${w - 8},${h - 14} Q0,${h - 8} ${-w + 8},${h - 14} Z`} fill="#1b2633" /> : null}
          {/* Spiegel */}
          <ellipse cx={-w - 5} cy={-h + 60} rx={7} ry={5} fill={farbe} stroke={rgba("#000", 0.3)} />
          <ellipse cx={w + 5} cy={-h + 60} rx={7} ry={5} fill={farbe} stroke={rgba("#000", 0.3)} />
        </g>
      )}
      {/* Scheinwerfer */}
      <ellipse cx={-w + 13} cy={-h + 5} rx={9} ry={4} fill="#fff6d0" opacity={0.95} />
      <ellipse cx={w - 13} cy={-h + 5} rx={9} ry={4} fill="#fff6d0" opacity={0.95} />
      {licht > 0 ? <path d={`M${-w + 4},${-h} L${-w - 20},${-h - 90} L${w + 20},${-h - 90} L${w - 4},${-h} Z`} fill={rgba("#fff6d0", 0.06 * licht)} /> : null}
      {/* Rücklichter / Bremslicht */}
      <rect x={-w + 4} y={h - 7} width={18} height={7} rx={2} fill={b > 0.05 ? "#ff2a2a" : "#7a1d1d"} />
      <rect x={w - 22} y={h - 7} width={18} height={7} rx={2} fill={b > 0.05 ? "#ff2a2a" : "#7a1d1d"} />
      {b > 0.05 ? (
        <g opacity={b}>
          <ellipse cx={-w + 13} cy={h + 4} rx={26} ry={16} fill={rgba("#ff2a2a", 0.45)} />
          <ellipse cx={w - 13} cy={h + 4} rx={26} ry={16} fill={rgba("#ff2a2a", 0.45)} />
          <ellipse cx={0} cy={h + 14} rx={w + 20} ry={26} fill={rgba("#ff2a2a", 0.16)} />
        </g>
      ) : null}
      {/* Blinker */}
      {blinkAn ? (
        <g>
          <circle cx={bx} cy={-h + 8} r={8} fill={ORANGE} />
          <circle cx={bx} cy={h - 8} r={8} fill={ORANGE} />
          <circle cx={bx} cy={-h + 8} r={22} fill={rgba(ORANGE, 0.35)} />
          <circle cx={bx} cy={h - 8} r={22} fill={rgba(ORANGE, 0.35)} />
        </g>
      ) : null}
    </g>
  );
};

// ---------------------------------------------------------------------------------------------------
// Landschaft und Straße
// ---------------------------------------------------------------------------------------------------
const Baumkrone: React.FC<{ x: number; y: number; r: number; seed: number }> = ({ x, y, r, seed }) => (
  <g>
    <circle cx={x + 10} cy={y + 12} r={r} fill="rgba(0,0,0,0.25)" />
    <circle cx={x} cy={y} r={r} fill={seed % 3 === 0 ? "#2f6b33" : seed % 3 === 1 ? "#386f2c" : "#2b5e3a"} />
    <circle cx={x - r * 0.3} cy={y - r * 0.3} r={r * 0.55} fill={seed % 2 ? "#4a8a3c" : "#428a48"} />
    <circle cx={x + r * 0.35} cy={y + r * 0.1} r={r * 0.4} fill={rgba("#000000", 0.12)} />
  </g>
);

/** Grünstreifen, Leitplanken, Bäume, Asphalt, Markierungen. y0..y1 = sichtbarer Weltbereich. baustelle 0..1. */
export const Strasse: React.FC<{ y0: number; y1: number; baustelle?: number; t: number; mitte?: number; zweispurig?: boolean }> = ({ y0, y1, baustelle = 1, t, mitte = 1, zweispurig = false }) => {
  const H = y1 - y0;
  const dash = [] as number[];
  for (let y = Math.floor(y0 / 120) * 120; y < y1; y += 120) dash.push(y);
  const baeume = [] as { x: number; y: number; r: number; s: number }[];
  for (let i = Math.floor(y0 / 170) - 1; i * 170 < y1 + 170; i++) {
    const s = Math.abs(i * 7919) % 97;
    baeume.push({ x: 120 + (s % 5) * 34 - 60, y: i * 170 + (s % 3) * 30, r: 52 + (s % 4) * 10, s });
    baeume.push({ x: 960 - (s % 4) * 30 + 60, y: i * 170 + 80 + (s % 2) * 40, r: 50 + (s % 3) * 12, s: s + 1 });
  }
  const b = zweispurig ? 0 : baustelle;
  // Baken entlang der Verengung und darüber
  const baken = [] as { x: number; y: number }[];
  for (let y = ENGE + KEIL; y >= Math.max(y0 - 40, -2000); y -= 46) baken.push({ x: bakenX(y), y });
  return (
    <g>
      <rect x={-200} y={y0} width={1480} height={H} fill={GRAS} />
      {/* Grastextur */}
      {Array.from({ length: 160 }, (_, i) => {
        const yy = y0 + ((i * 397) % Math.max(1, H));
        const xx = (i * 211) % 2 ? 40 + ((i * 53) % 300) : 760 + ((i * 71) % 300);
        return <circle key={i} cx={xx} cy={yy} r={6 + (i % 4) * 3} fill={i % 2 ? "#44703a" : "#578a47"} opacity={0.6} />;
      })}
      {baeume.map((p, i) => <Baumkrone key={i} x={p.x} y={p.y} r={p.r} seed={p.s} />)}
      {/* Bankett + Asphalt */}
      <rect x={RAND_L - 28} y={y0} width={RAND_R - RAND_L + 56} height={H} fill="#8d8a80" />
      <rect x={RAND_L - 16} y={y0} width={RAND_R - RAND_L + 32} height={H} fill={ASPHALT} />
      {/* Asphalt-Flicken */}
      {Array.from({ length: 18 }, (_, i) => (
        <rect key={i} x={RAND_L + ((i * 131) % 260)} y={y0 + ((i * 577) % Math.max(1, H))} width={40 + (i % 3) * 30} height={14 + (i % 2) * 10} rx={6} fill={rgba("#000000", 0.08)} />
      ))}
      {/* Leitplanken */}
      {[RAND_L - 40, RAND_R + 40].map((x) => (
        <g key={x}>
          <line x1={x} x2={x} y1={y0} y2={y1} stroke="#c8ccd2" strokeWidth={7} />
          <line x1={x + 3} x2={x + 3} y1={y0} y2={y1} stroke="#8e939b" strokeWidth={2} />
        </g>
      ))}
      {/* Randlinien */}
      <line x1={RAND_L} x2={RAND_L} y1={y0} y2={y1} stroke="#f2f2f2" strokeWidth={8} />
      <line x1={RAND_R} x2={RAND_R} y1={y0} y2={y1} stroke="#f2f2f2" strokeWidth={8} opacity={1} />
      {/* Mittel-Leitlinie (unterhalb der Verengung, bzw. überall bei zweispurig) */}
      {dash.map((y) => (y > ENGE + KEIL || zweispurig || b < 0.5 ? <rect key={y} x={536} y={y} width={8} height={60} fill="#f2f2f2" opacity={mitte} /> : null))}
      {/* Baustelle */}
      {b > 0 ? (
        <g opacity={b}>
          {/* gesperrter Bereich */}
          <path d={`M${RAND_R + 16},${ENGE + KEIL} L${548},${ENGE} L${548},${Math.min(y0, ENGE) - 2000} L${RAND_R + 16},${Math.min(y0, ENGE) - 2000} Z`} fill="#6b6457" />
          {/* gelbe Baustellenmarkierung links */}
          <line x1={RAND_L + 18} x2={RAND_L + 18} y1={y0} y2={ENGE + KEIL + 200} stroke={GELB} strokeWidth={8} />
          {/* Erdhaufen, Material */}
          <ellipse cx={630} cy={ENGE - 120} rx={46} ry={70} fill="#8a6a45" />
          <ellipse cx={622} cy={ENGE - 132} rx={26} ry={40} fill="#a07d52" />
          {[0, 1, 2].map((i) => <rect key={i} x={590 + i * 22} y={ENGE - 340 + i * 4} width={14} height={110} rx={3} fill="#c9c3b5" stroke="#9b958a" />)}
          {/* Bagger von oben */}
          <g transform={`translate(624 ${ENGE - 560}) rotate(${-20 + 18 * Math.sin(t * 1.3)})`}>
            <rect x={-46} y={-30} width={22} height={140} rx={8} fill="#2a2a2a" />
            <rect x={24} y={-30} width={22} height={140} rx={8} fill="#2a2a2a" />
            <rect x={-38} y={-10} width={76} height={96} rx={10} fill={GELB} stroke="#b8901a" strokeWidth={3} />
            <rect x={-30} y={0} width={30} height={30} rx={4} fill="#22303d" />
            <rect x={-8} y={-130} width={16} height={130} rx={5} fill="#e5b320" />
            <path d="M-22,-150 L22,-150 L16,-126 L-16,-126 Z" fill="#3a3a3a" />
          </g>
          {/* Absperrschranke quer über die rechte Spur am Beginn der Verengung */}
          <g transform={`translate(${RAND_R - 40} ${ENGE + KEIL + 30})`}>
            <rect x={-80} y={-10} width={160} height={20} fill="#ffffff" />
            {[0, 1, 2, 3, 4].map((i) => <rect key={i} x={-80 + i * 32} y={-10} width={16} height={20} fill="#e3262b" />)}
            {[-70, 0, 70].map((x, i) => {
              const an = Math.floor(t * 2.5 + i * 0.33) % 2 === 0;
              return (
                <g key={x}>
                  <circle cx={x} cy={-18} r={9} fill={an ? "#ffe066" : "#7a6420"} />
                  {an ? <circle cx={x} cy={-18} r={26} fill={rgba("#ffe066", 0.35)} /> : null}
                </g>
              );
            })}
          </g>
          {/* Leitbaken (rot-weiß) */}
          {baken.map((p, i) => (
            <g key={i} transform={`translate(${p.x} ${p.y})`}>
              <rect x={-6} y={-16} width={12} height={32} rx={3} fill="#ffffff" stroke="#888" strokeWidth={1} />
              <rect x={-6} y={-8} width={12} height={8} fill="#e3262b" />
              <rect x={-6} y={6} width={12} height={6} fill="#e3262b" />
              <rect x={-14} y={14} width={28} height={6} rx={2} fill="#222" />
            </g>
          ))}
        </g>
      ) : null}
    </g>
  );
};

/** Schild „Fahrstreifen endet“ (blau, zwei Pfeile, der rechte endet), aufrecht gezeichnet. */
export const SchildEnde: React.FC<{ x: number; y: number; s?: number; p?: number }> = ({ x, y, s = 1, p = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s * p})`}>
    <rect x={-6} y={0} width={12} height={150} fill="#9aa1aa" />
    <rect x={-96} y={-210} width={192} height={220} rx={12} fill="#1f5fbf" stroke="#ffffff" strokeWidth={8} />
    <path d="M-40,-10 L-40,-150" stroke="#ffffff" strokeWidth={22} />
    <path d="M-62,-140 L-40,-182 L-18,-140 Z" fill="#ffffff" />
    <path d="M40,-10 L40,-80 Q40,-110 10,-130" fill="none" stroke="#ffffff" strokeWidth={22} />
    <path d="M30,-112 L-6,-142 L28,-150 Z" fill="#ffffff" />
    <rect x={20} y={-104} width={42} height={12} fill="#e3262b" transform="rotate(-38 40 -98)" />
  </g>
);

/** Kreis-Ausschnitt: Fahrer im Stau schüttelt den Kopf. */
export const Fahrer: React.FC<{ x: number; y: number; r?: number; t: number; schuetteln?: number; winken?: number; laecheln?: number; farbe?: string }> = ({
  x, y, r = 150, t, schuetteln = 0, winken = 0, laecheln = 0, farbe = "#2f80ed",
}) => {
  const dreh = schuetteln * 14 * Math.sin(t * 11);
  const mund = laecheln > 0.5 ? `M-34,46 Q0,${74} 34,46` : `M-30,58 Q0,40 30,58`;
  const hand = winken * 22 * Math.sin(t * 9);
  return (
    <g transform={`translate(${x} ${y})`}>
      <defs>
        <clipPath id={`fa-${x}-${y}`}><circle cx={0} cy={0} r={r} /></clipPath>
      </defs>
      <circle cx={0} cy={6} r={r + 10} fill="rgba(0,0,0,0.35)" />
      <g clipPath={`url(#fa-${x}-${y})`}>
        <rect x={-r} y={-r} width={2 * r} height={2 * r} fill="#9cc6e8" />
        {/* Autoinnenraum: Kopfstütze, Sitz, Lenkrad */}
        <rect x={-r} y={r * 0.35} width={2 * r} height={r} fill={farbe} />
        <rect x={-r * 0.9} y={-r} width={r * 0.25} height={2 * r} fill={rgba(farbe, 0.85)} />
        <g transform={`rotate(${dreh} 0 ${r * 0.6})`}>
          <rect x={-34} y={50} width={68} height={60} fill="#e2b48f" />
          <ellipse cx={0} cy={0} rx={70} ry={82} fill="#f1c7a2" />
          <path d="M-72,-10 Q-70,-92 0,-92 Q70,-92 72,-10 Q60,-60 0,-62 Q-60,-60 -72,-10 Z" fill="#4a3324" />
          <ellipse cx={-26} cy={0} rx={9} ry={11} fill="#1f1f1f" />
          <ellipse cx={26} cy={0} rx={9} ry={11} fill="#1f1f1f" />
          <path d={laecheln > 0.5 ? "M-42,-26 L-12,-22" : "M-42,-30 L-12,-20"} stroke="#3a2a1e" strokeWidth={7} strokeLinecap="round" />
          <path d={laecheln > 0.5 ? "M42,-26 L12,-22" : "M42,-30 L12,-20"} stroke="#3a2a1e" strokeWidth={7} strokeLinecap="round" />
          <path d={mund} fill="none" stroke="#7a3b2a" strokeWidth={7} strokeLinecap="round" />
        </g>
        <circle cx={0} cy={r * 0.95} r={r * 0.55} fill="none" stroke="#222" strokeWidth={18} />
        {winken > 0 ? (
          <g transform={`translate(${r * 0.55} ${r * 0.15}) rotate(${hand})`} opacity={winken}>
            <rect x={-14} y={0} width={28} height={90} rx={12} fill="#f1c7a2" />
            <ellipse cx={0} cy={-6} rx={26} ry={30} fill="#f1c7a2" />
            {[-16, -6, 4, 14].map((dx) => <rect key={dx} x={dx - 4} y={-46} width={9} height={30} rx={4} fill="#f1c7a2" />)}
          </g>
        ) : null}
      </g>
      <circle cx={0} cy={0} r={r} fill="none" stroke={CREME} strokeWidth={8} />
    </g>
  );
};

/** Zähler-Kachel „Staulänge“. */
export const Stauzaehler: React.FC<{ x: number; y: number; wert: string; farbe?: string; o?: number; p?: number; titel?: string }> = ({ x, y, wert, farbe = ROT, o = 1, p = 1, titel = "STAULÄNGE" }) => (
  <div style={{ position: "absolute", left: x, top: y, transform: `translateX(-50%) scale(${p})`, opacity: o, background: rgba(NACHT, 0.82), border: `4px solid ${farbe}`, borderRadius: 26, padding: "14px 34px 18px", textAlign: "center", boxShadow: "0 10px 30px rgba(0,0,0,0.45)" }}>
    <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 30, letterSpacing: 4, color: rgba(CREME, 0.8) }}>{titel}</div>
    <div style={{ fontFamily: HEAD, fontWeight: 900, fontSize: 104, lineHeight: 1, color: farbe }}>{wert}</div>
  </div>
);

/** Großer Text (Pille). */
export const Pille: React.FC<{ x: number; y: number; text: React.ReactNode; p: number; bg?: string; fg?: string; size?: number; rot?: number }> = ({ x, y, text, p, bg = CREME, fg = NACHT, size = 56, rot = 0 }) =>
  p <= 0.001 ? null : (
    <div style={{ position: "absolute", left: x, top: y, transform: `translateX(-50%) scale(${p}) rotate(${rot}deg)`, background: bg, color: fg, fontFamily: HEAD, fontWeight: 900, fontSize: size, padding: "8px 28px 12px", borderRadius: 20, whiteSpace: "nowrap", boxShadow: "0 10px 28px rgba(0,0,0,0.4)" }}>{text}</div>
  );
