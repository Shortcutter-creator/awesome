// Bausteine für die Serie „Der Ausbruch“: Nachtfarben, Silhouetten, Zelle, Schacht, Zaun, Hunde, Wald, Licht.
// Gezeichnet als SVG in Bildkoordinaten (1080 × 1920). Teil 1 hat die Urformen im eigenen Video.tsx.
import React from "react";
import { AbsoluteFill } from "remotion";
import { HEAD, MONO, ease, pop, rgba } from "../../basis/lib";

export const NACHT = "#05080f";
export const BETON = "#1a2233";
export const BETON2 = "#242e42";
export const KALT = "#7fa8ff";
export const MOND = "#dfe8ff";
export const ROT = "#ff3b3b";
export const LAMPE = "#ffd27a";
export const SIL = "#020306";
export const GRAU = "#c9d1e0";

/** Ausblende ab b über d Sekunden; b = Infinity heißt: bleibt stehen. */
const aus = (t: number, b: number, d: number) => (Number.isFinite(b) ? ease(t, b, b + d) : 0);

/** Sichtbarkeit einer Szene zwischen a und b, mit kurzer Überblendung. */
export const sz = (t: number, a: number, b: number, blende = 0.22) =>
  t < a - blende || t > b + blende ? 0 : Math.min(a <= 0 ? 1 : ease(t, a - blende, a + 0.05), 1 - ease(t, b - 0.05, b + blende));

/** Kurze Kamerafahrten (0,35 s, 6 %) auf die gegebenen Zeitpunkte, abwechselnd hinein und zurück. */
export const kamera = (t: number, punkte: number[]) => {
  const p = [...punkte].sort((a, b) => a - b);
  const k = p.filter((a) => t >= a).length;
  const z = (i: number) => 1 + 0.06 * (i % 2);
  return k === 0 ? 1 : z(k - 1) + (z(k) - z(k - 1)) * ease(t, p[k - 1], p[k - 1] + 0.35);
};

// ---------------------------------------------------------------------------
// Figuren
// ---------------------------------------------------------------------------
/** Stehende Silhouette, Füße bei (x, y), Höhe ≈ 200·s. arme: 0 = unten, 1 = nach oben gestreckt. spiegel = blickt nach links. */
export const Mann: React.FC<{ x: number; y: number; s?: number; rand?: string; alt?: boolean; o?: number; arme?: number; spiegel?: boolean; dreh?: number }> = ({
  x, y, s = 1, rand = KALT, alt, o = 1, arme = 0, spiegel, dreh = 0,
}) => {
  const ay = -66 - 150 * arme; // Handhöhe
  const ax = 44 - 14 * arme;
  return (
    <g transform={`translate(${x} ${y}) scale(${spiegel ? -s : s} ${s}) rotate(${dreh})`} opacity={o}>
      <g transform={alt ? "rotate(-4) translate(4 4)" : undefined}>
        {[-1, 1].map((sd) => (
          <path key={sd} d={`M${sd * 30},-136 L${sd * ax},${ay}`} fill="none" stroke={rand} strokeWidth={21} strokeLinecap="round" />
        ))}
        {[-1, 1].map((sd) => (
          <path key={sd} d={`M${sd * 30},-136 L${sd * ax},${ay}`} fill="none" stroke={SIL} strokeWidth={16} strokeLinecap="round" />
        ))}
        <circle cx={alt ? 6 : 0} cy={-172} r={21} fill={SIL} stroke={rand} strokeWidth={2.5} />
        <path d="M-36,-142 Q0,-154 36,-142 L32,-92 L27,0 L7,0 L1,-58 L-5,0 L-25,0 L-30,-92 Z" fill={SIL} stroke={rand} strokeWidth={2.5} strokeLinejoin="round" />
      </g>
    </g>
  );
};

/** Kriechende Silhouette (nach rechts), Bauch bei (x, y), Länge ≈ 200·s. p = Bewegungsphase. */
export const Kriecher: React.FC<{ x: number; y: number; s?: number; p: number; rand?: string; o?: number; grau?: boolean; armVor?: number }> = ({
  x, y, s = 1, p, rand = KALT, o = 1, grau, armVor = 0,
}) => {
  const a = Math.sin(p * Math.PI * 2);
  const b = Math.sin(p * Math.PI * 2 + Math.PI);
  const f = grau ? "#0d0f14" : SIL;
  const glied = (pts: readonly number[], farbe: string, w: number) => (
    <path d={`M${pts[0]},${pts[1]} L${pts[2]},${pts[3]} L${pts[4]},${pts[5]}`} fill="none" stroke={farbe} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" />
  );
  const arm1 = [40, -26, 66 + 10 * a + 30 * armVor, -8 - 6 * armVor, 92 + 12 * a + 70 * armVor, -4 - 8 * armVor];
  const arm2 = [36, -26, 62 + 10 * b, -10, 86 + 12 * b, -4];
  const bein1 = [-52, -22, -78, -6 + 4 * a, -112 + 10 * a, -8];
  const bein2 = [-52, -22, -80, -8 + 4 * b, -114 + 10 * b, -10];
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o}>
      {glied(arm2, rand, 20)}{glied(bein2, rand, 20)}{glied(arm2, f, 16)}{glied(bein2, f, 16)}
      {glied(arm1, rand, 20)}{glied(bein1, rand, 20)}
      <ellipse cx={-6} cy={-24} rx={58} ry={17} fill={f} stroke={rand} strokeWidth={2.5} />
      <circle cx={70} cy={-34 + 2 * a} r={17} fill={f} stroke={rand} strokeWidth={2.5} />
      {glied(arm1, f, 16)}{glied(bein1, f, 16)}
      <ellipse cx={-6} cy={-24} rx={56} ry={15} fill={f} />
    </g>
  );
};

/** Laufende Silhouette, Füße bei (x, y). richtung 1 = nach rechts, −1 = nach links. */
export const Laeufer: React.FC<{ x: number; y: number; s?: number; p: number; rand?: string; richtung?: 1 | -1; o?: number }> = ({ x, y, s = 1, p, rand = ROT, richtung = 1, o = 1 }) => {
  const w = Math.sin(p * Math.PI * 2);
  const bein = (ph: number) => {
    const k = Math.sin(p * Math.PI * 2 + ph);
    return `M0,-92 L${22 * k},-48 L${34 * k - 8},0`;
  };
  const arm = (ph: number) => {
    const k = Math.sin(p * Math.PI * 2 + ph);
    return `M6,-150 L${-20 * k + 6},-118 L${-28 * k + 16},-96`;
  };
  return (
    <g transform={`translate(${x} ${y + Math.abs(w) * -6 * s}) scale(${s * richtung} ${s}) rotate(8)`} opacity={o}>
      {[bein(0), bein(Math.PI), arm(Math.PI), arm(0)].map((d, i) => (
        <g key={i}>
          <path d={d} fill="none" stroke={rand} strokeWidth={21} strokeLinecap="round" strokeLinejoin="round" />
          <path d={d} fill="none" stroke={SIL} strokeWidth={16} strokeLinecap="round" strokeLinejoin="round" />
        </g>
      ))}
      <path d="M-14,-160 Q4,-168 22,-158 L16,-90 L-8,-90 Z" fill={SIL} stroke={rand} strokeWidth={2.5} />
      <circle cx={10} cy={-182} r={19} fill={SIL} stroke={rand} strokeWidth={2.5} />
    </g>
  );
};

/** Hund im Lauf (nach rechts), Pfoten bei (x, y), Länge ≈ 170·s. */
export const Hund: React.FC<{ x: number; y: number; s?: number; p: number; rand?: string; richtung?: 1 | -1; bellen?: number }> = ({ x, y, s = 1, p, rand = ROT, richtung = 1, bellen = 0 }) => {
  const k = Math.sin(p * Math.PI * 2);
  const beine = [
    [50, -50, 62 + 26 * k, 0],
    [40, -50, 48 - 26 * k, 0],
    [-46, -52, -58 - 26 * k, 0],
    [-56, -52, -44 + 26 * k, 0],
  ];
  return (
    <g transform={`translate(${x} ${y}) scale(${s * richtung} ${s})`}>
      {beine.map(([x1, y1, x2, y2], i) => (
        <g key={i}>
          <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={rand} strokeWidth={17} strokeLinecap="round" />
          <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={SIL} strokeWidth={12} strokeLinecap="round" />
        </g>
      ))}
      <path d={`M-70,-58 Q-96,${-90 - 10 * k} -112,${-84 - 8 * k}`} fill="none" stroke={rand} strokeWidth={13} strokeLinecap="round" />
      <path d={`M-70,-58 Q-96,${-90 - 10 * k} -112,${-84 - 8 * k}`} fill="none" stroke={SIL} strokeWidth={8} strokeLinecap="round" />
      <ellipse cx={-6} cy={-66} rx={74} ry={26} fill={SIL} stroke={rand} strokeWidth={2.5} />
      <g transform={`translate(66 -84) rotate(${-8 - 14 * bellen})`}>
        <path d="M-14,10 L4,-20 L30,-16 L58,-6 L58,8 L30,14 Z" fill={SIL} stroke={rand} strokeWidth={2.5} strokeLinejoin="round" />
        <path d="M-4,-14 L2,-40 L14,-18 Z" fill={SIL} stroke={rand} strokeWidth={2.5} />
        <circle cx={26} cy={-6} r={3.5} fill={ROT} />
        {bellen > 0.1 ? <path d={`M30,12 L58,${12 + 18 * bellen} L28,18 Z`} fill={SIL} stroke={rand} strokeWidth={2} /> : null}
      </g>
    </g>
  );
};

// ---------------------------------------------------------------------------
// Orte
// ---------------------------------------------------------------------------
export const Himmel: React.FC<{ t: number; mond?: [number, number]; rot?: number }> = ({ t, mond = [820, 430], rot = 0 }) => (
  <g>
    <defs>
      <linearGradient id="az-himmel" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#02040a" />
        <stop offset="100%" stopColor={rot > 0 ? "#2a0f18" : "#14213d"} />
      </linearGradient>
    </defs>
    <rect width={1080} height={1920} fill="url(#az-himmel)" />
    {Array.from({ length: 36 }, (_, i) => <circle key={i} cx={(i * 211) % 1080} cy={(i * 137) % 640 + 240} r={i % 3 ? 1.6 : 2.6} fill={MOND} opacity={0.25 + 0.25 * Math.sin(t * 1.3 + i)} />)}
    <circle cx={mond[0]} cy={mond[1]} r={60} fill={MOND} opacity={0.85} />
    <circle cx={mond[0]} cy={mond[1]} r={140} fill={MOND} opacity={0.05} />
  </g>
);

/** Zaun von vorn: Pfosten, Maschendraht, Stacheldrahtrollen oben (bei y oben), Boden bei y unten. */
export const Zaun: React.FC<{ oben?: number; unten?: number; offen?: number }> = ({ oben = 600, unten = 1240, offen = 0 }) => (
  <g>
    <defs>
      <pattern id="az-masche" width={36} height={36} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <rect width={36} height={36} fill="none" stroke="#3a4766" strokeWidth={2.5} />
      </pattern>
    </defs>
    <rect x={0} y={oben} width={1080} height={unten - oben} fill="url(#az-masche)" opacity={0.75} />
    {Array.from({ length: 7 }, (_, i) => <rect key={i} x={i * 180 + 20} y={oben - 40} width={14} height={unten - oben + 40} fill="#2c3854" />)}
    <rect x={0} y={oben - 6} width={1080} height={8} fill="#2c3854" />
    {/* Stacheldraht-Rollen */}
    {Array.from({ length: 22 }, (_, i) => {
      const cx = i * 52 + 10;
      const auf = offen > 0 && cx > 400 && cx < 680 ? offen : 0;
      return (
        <ellipse key={i} cx={cx + (cx < 540 ? -40 : 40) * auf} cy={oben - 46} rx={34 + 10 * auf} ry={34} fill="none" stroke="#56647f" strokeWidth={3.5} />
      );
    })}
    {Array.from({ length: 50 }, (_, i) => <path key={i} d={`M${i * 22},${oben - 50} l6,-10 l6,10`} fill="none" stroke="#7d8aa6" strokeWidth={2.5} />)}
  </g>
);

/** Baumreihe als Silhouette. */
export const Wald: React.FC<{ y: number; hoehe?: number; farbe?: string; seed?: number }> = ({ y, hoehe = 260, farbe = "#03060c", seed = 1 }) => (
  <g>
    {Array.from({ length: 16 }, (_, i) => {
      const x = ((i * 73 + seed * 31) % 16) * 72 - 20;
      const h = hoehe * (0.7 + 0.3 * (((i * 37 + seed * 11) % 10) / 10));
      return (
        <g key={i}>
          <polygon points={`${x},${y - h} ${x - 60},${y - h * 0.45} ${x + 60},${y - h * 0.45}`} fill={farbe} />
          <polygon points={`${x},${y - h * 0.7} ${x - 80},${y} ${x + 80},${y}`} fill={farbe} />
        </g>
      );
    })}
    <rect x={0} y={y} width={1080} height={1920 - y} fill={farbe} />
  </g>
);

/** Suchscheinwerfer: Kegel von (x0, y0) zum Ziel (x1, y1), heller Fleck am Ziel. */
export const Scheinwerfer: React.FC<{ x0: number; y0: number; x1: number; y1: number; o?: number; farbe?: string; breite?: number }> = ({ x0, y0, x1, y1, o = 1, farbe = MOND, breite = 150 }) => {
  const dx = x1 - x0, dy = y1 - y0, l = Math.hypot(dx, dy) || 1;
  const nx = (-dy / l) * breite, ny = (dx / l) * breite;
  return (
    <g opacity={o}>
      <polygon points={`${x0},${y0} ${x1 + nx},${y1 + ny} ${x1 - nx},${y1 - ny}`} fill={rgba(farbe, 0.16)} />
      <ellipse cx={x1} cy={y1} rx={breite * 1.1} ry={breite * 0.9} fill={rgba(farbe, 0.22)} />
      <ellipse cx={x1} cy={y1} rx={breite * 0.55} ry={breite * 0.45} fill={rgba(farbe, 0.25)} />
      <circle cx={x0} cy={y0} r={16} fill={farbe} />
    </g>
  );
};

/** Querschnitt durch den Schacht: Gang oben, Schacht (Höhe 190) bei y 800–990. */
export const SchachtQuer: React.FC<{ eng?: boolean }> = ({ eng }) => (
  <g>
    <rect width={1080} height={1920} fill={NACHT} />
    <rect x={0} y={250} width={1080} height={480} fill="#0f1726" />
    <rect x={0} y={700} width={1080} height={30} fill="#2a3550" />
    <rect x={0} y={730} width={1080} height={70} fill={BETON} />
    <rect x={0} y={990} width={1080} height={320} fill={BETON} />
    {Array.from({ length: 6 }, (_, i) => <rect key={i} x={i * 190 + 10} y={1020 + (i % 2) * 120} width={150} height={90} fill="#1d2638" />)}
    {eng ? (
      <>
        <polygon points="0,800 600,800 740,860 1080,860 1080,930 740,930 600,990 0,990" fill="#000" />
        <polyline points="0,800 600,800 740,860 1080,860" fill="none" stroke={rgba(KALT, 0.6)} strokeWidth={4} />
        <polyline points="0,990 600,990 740,930 1080,930" fill="none" stroke={rgba(KALT, 0.6)} strokeWidth={4} />
        <rect x={740} y={730} width={340} height={130} fill={BETON} />
        <rect x={740} y={930} width={340} height={60} fill={BETON} />
      </>
    ) : (
      <>
        <rect x={0} y={800} width={1080} height={190} fill="#000" />
        <line x1={0} y1={800} x2={1080} y2={800} stroke={rgba(KALT, 0.6)} strokeWidth={4} />
        <line x1={0} y1={990} x2={1080} y2={990} stroke={rgba(KALT, 0.6)} strokeWidth={4} />
      </>
    )}
  </g>
);

/** Zelle von innen: Rückwand, Fenster, Etagenbett, Lüftungsgitter. tag = Morgenlicht statt Nacht. */
export const ZelleHinten: React.FC<{ t: number; tag?: number; gitterOffen?: boolean }> = ({ t, tag = 0, gitterOffen }) => {
  const wand = tag > 0 ? "#3b3f4a" : BETON;
  return (
    <g>
      <rect x={0} y={0} width={1080} height={1920} fill={NACHT} />
      <rect x={0} y={250} width={1080} height={1060} fill={wand} />
      {Array.from({ length: 14 }, (_, r) =>
        Array.from({ length: 6 }, (_, c) => (
          <rect key={`${r}-${c}`} x={(r % 2 ? -90 : 0) + c * 180 + 4} y={256 + r * 76} width={172} height={70} fill={tag > 0 ? ((r * 7 + c * 3) % 5 === 0 ? "#4a4f5c" : "#42464f") : (r * 7 + c * 3) % 5 === 0 ? BETON2 : "#1d2638"} />
        )),
      )}
      <rect x={640} y={360} width={170} height={120} fill={tag > 0 ? "#f3d9a4" : "#0f1a33"} stroke="#3b4a66" strokeWidth={6} />
      {[680, 725, 770].map((x) => <rect key={x} x={x} y={360} width={8} height={120} fill="#3b4a66" />)}
      <polygon points="640,480 810,480 560,1300 160,1300" fill={tag > 0 ? rgba("#ffd9a0", 0.18 * tag) : rgba(MOND, 0.07)} />
      <g>
        <rect x={110} y={820} width={300} height={22} fill="#2c364c" />
        <rect x={110} y={1080} width={300} height={22} fill="#2c364c" />
        <rect x={104} y={720} width={14} height={500} fill="#2c364c" />
        <rect x={402} y={720} width={14} height={500} fill="#2c364c" />
        <rect x={120} y={798} width={280} height={24} rx={8} fill="#3a4560" />
        <rect x={120} y={1058} width={280} height={24} rx={8} fill="#3a4560" />
      </g>
      <rect x={830} y={960} width={150} height={110} fill="#05070c" stroke="#3b4a66" strokeWidth={6} />
      {gitterOffen ? null : [0, 1, 2, 3].map((i) => <rect key={i} x={838} y={972 + i * 24} width={134} height={8} fill="#3b4a66" />)}
      {Array.from({ length: 14 }, (_, i) => {
        const y = 600 + ((i * 97 + t * 18) % 650);
        const x = 300 + ((i * 53) % 360) + Math.sin(t * 0.7 + i) * 18 - (y - 600) * 0.45;
        return <circle key={i} cx={x} cy={y} r={2.2} fill={rgba(tag > 0 ? "#fff3d6" : MOND, 0.35)} />;
      })}
    </g>
  );
};

export const Gitterstaebe: React.FC<{ o?: number; licht?: string }> = ({ o = 1, licht = KALT }) => (
  <g opacity={o}>
    <rect x={60} y={300} width={960} height={26} fill="#10151f" stroke={rgba(licht, 0.5)} strokeWidth={2} />
    <rect x={60} y={1250} width={960} height={26} fill="#10151f" stroke={rgba(licht, 0.5)} strokeWidth={2} />
    {Array.from({ length: 9 }, (_, i) => {
      const x = 96 + i * 112;
      return (
        <g key={i}>
          <rect x={x} y={300} width={22} height={976} fill="#0b0f17" />
          <rect x={x} y={300} width={5} height={976} fill={rgba(licht, 0.55)} />
        </g>
      );
    })}
  </g>
);

// ---------------------------------------------------------------------------
// Licht und Text
// ---------------------------------------------------------------------------
export const Vignette: React.FC<{ staerke?: number }> = ({ staerke = 0.85 }) => (
  <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 42%, rgba(0,0,0,0) 30%, rgba(0,0,0,${staerke}) 100%)`, pointerEvents: "none" }} />
);

/** Rotes Drehlicht: weicher Lichtfächer, der langsam durchs Bild wandert (kein Stroboskop). */
export const Drehlicht: React.FC<{ t: number; a: number; b?: number; staerke?: number }> = ({ t, a, b = Infinity, staerke = 1 }) => {
  if (t < a || t > b + 0.8) return null;
  const rein = ease(t, a, a + 0.4) * (1 - aus(t, b, 0.8)) * staerke;
  const w = (t - a) * 200;
  const puls = 0.5 + 0.5 * Math.cos(((t - a) * Math.PI * 2) / 1.8);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <AbsoluteFill style={{ background: rgba(ROT, 0.16 * rein * (0.4 + 0.6 * puls)), mixBlendMode: "screen" }} />
      <AbsoluteFill style={{ background: `conic-gradient(from ${w}deg at 540px 150px, ${rgba(ROT, 0)} 0deg, ${rgba(ROT, 0.42 * rein)} 25deg, ${rgba(ROT, 0)} 60deg, ${rgba(ROT, 0)} 180deg, ${rgba(ROT, 0.42 * rein)} 205deg, ${rgba(ROT, 0)} 240deg, ${rgba(ROT, 0)} 360deg)`, mixBlendMode: "screen" }} />
    </AbsoluteFill>
  );
};

export const NameChip: React.FC<{ t: number; a: number; text: string; x: number; y: number; farbe?: string; b?: number }> = ({ t, a, text, x, y, farbe = KALT, b = Infinity }) => {
  if (t < a || t > b + 0.25) return null;
  const p = pop(t, a, 210, 13) * (1 - aus(t, b, 0.25));
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) scale(${p})`, fontFamily: MONO, fontWeight: 700, fontSize: 34, letterSpacing: 5, color: NACHT, background: farbe, padding: "6px 18px", borderRadius: 8, whiteSpace: "nowrap" }}>
      {text}
    </div>
  );
};

/** Große Zeile oben (Schlagwort der Szene). */
export const Titel: React.FC<{ t: number; a: number; b?: number; text: string; farbe?: string; size?: number; top?: number }> = ({ t, a, b = Infinity, text, farbe = MOND, size = 80, top = 400 }) => {
  if (t < a || t > b + 0.25) return null;
  const p = pop(t, a, 220, 12);
  return (
    <div style={{ position: "absolute", left: 540, top, transform: `translateX(-50%) scale(${p})`, opacity: 1 - aus(t, b, 0.25), fontFamily: HEAD, fontWeight: 900, fontSize: size, letterSpacing: 4, color: farbe, textShadow: `0 0 18px ${rgba(farbe, 0.55)}, 0 4px 20px rgba(0,0,0,0.9)`, whiteSpace: "nowrap" }}>
      {text}
    </div>
  );
};

/** Gerahmter Stempel, knallt schräg herein. */
export const Stempel: React.FC<{ t: number; a: number; text: string; top?: number; farbe?: string; size?: number }> = ({ t, a, text, top = 470, farbe = ROT, size = 100 }) => {
  if (t < a) return null;
  return (
    <div style={{ position: "absolute", left: 540, top, transform: `translateX(-50%) scale(${pop(t, a, 230, 11)}) rotate(-4deg)`, fontFamily: HEAD, fontWeight: 900, fontSize: size, letterSpacing: 6, color: farbe, border: `9px solid ${farbe}`, borderRadius: 16, padding: "0 28px 6px", textShadow: `0 0 18px ${rgba(farbe, 0.6)}`, whiteSpace: "nowrap" }}>
      {text}
    </div>
  );
};

/** Oben links: rote Statuszeile (z. B. ALARM). */
export const Status: React.FC<{ t: number; a: number; b?: number; zeile: string; text: string }> = ({ t, a, b = Infinity, zeile, text }) => {
  if (t < a || t > b + 0.4) return null;
  const blink = 0.75 + 0.25 * Math.cos((t - a) * Math.PI * 2 * 0.9);
  return (
    <div style={{ position: "absolute", left: 96, top: 300, transform: "translateY(-50%)", opacity: ease(t, a, a + 0.3) * (1 - aus(t, b, 0.4)) }}>
      <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 22, letterSpacing: 4, color: rgba(ROT, 0.85), marginBottom: 2 }}>{zeile}</div>
      <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 62, lineHeight: 1, letterSpacing: 4, color: ROT, opacity: blink, textShadow: `0 0 18px ${rgba(ROT, 0.85)}` }}>{text}</div>
    </div>
  );
};

/** Kopfzeile rechts oben: Serientitel. */
export const Serie: React.FC<{ teil: string; o?: number }> = ({ teil, o = 1 }) => (
  <div style={{ position: "absolute", top: 190, right: 96, fontFamily: MONO, fontSize: 26, letterSpacing: 3, color: rgba(MOND, 0.6), textTransform: "uppercase", opacity: o }}>
    Der Ausbruch · {teil}
  </div>
);
