// Video „Der Ausbruch – Teil 1“: fiktive Spannungsgeschichte, vier Männer brechen aus.
// Nachtbilder als SVG-Silhouetten. Alle Zeiten über Wortanker aus woerter.json.
import React from "react";
import { AbsoluteFill, Audio, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Captions, FPS, HEAD, MONO, THEME, at, clamp, ease, lin, makeChunks, pop, rgba, type Voice } from "../../basis/lib";
import daten from "./woerter.json";

const V = daten as unknown as Voice;
const WD = V.words;
const CHUNKS = makeChunks(WD);
const Z = (n: number) => V.zeilen[Math.min(n, V.zeilen.length - 1)].s;
const ZE = (n: number) => V.zeilen[Math.min(n, V.zeilen.length - 1)].e;
const A = (w: string, n: number | { ab: number } = 1) => at(WD, w, n);

export const DAUER = Math.ceil((V.dauer + 2.4) * FPS);

// ---- Farben ------------------------------------------------------------------
const NACHT = "#05080f";
const NACHT2 = "#0c1424";
const BETON = "#1a2233";
const BETON2 = "#242e42";
const KALT = "#7fa8ff";
const MOND = "#dfe8ff";
const ROT = "#ff3b3b";
const LAMPE = "#ffd27a";
const SIL = "#020306";

// ---- Anker -------------------------------------------------------------------
const aVier = A("Vier");
const aMaenner = A("Männer");
const aPlan = A("Plan");
const aNeunzig = A("neunzig");
const aWaerter = A("Wärter");
const aDrei = A("Drei", 1);
const aBlock = A("Block");
const aStille = A("Totenstille");
const aElias = A("Elias");
const aZieht = A("zieht");
const aGitter = A("Gitter");
const aWand = A("Wand", 1);
const aSchacht = A("Schacht");
const aKaum = A("Kaum");
const aSchultern = A("Schultern");
const aEiner = A("Einer");
const aKriechen = A("kriechen");
const aMarco = A("Marco");
const aJonas = A("Jonas");
const aHenrik = A("Henrik", 1);
const aSchritte = A("Schritte");
const aDirekt = A("Direkt");
const aNiemand = A("Niemand");
const aLicht = A("Lichtkegel");
const aBetten = A("Betten");
const aLeeren = A("leeren");
const aSirene = A("Sirene");
const aDraussen = A("draußen");
const aAber = A("Aber");
const aFest = A("fest");
const aSchafft = A("Schafft");
const aFolg = A("Folg");
const aEnde = WD[WD.length - 1].e + 0.4;

// Szenengrenzen
const S_HOOK = [0, Z(1)] as const;
const S_AUSSEN = [Z(1), Z(2)] as const;
const S_GITTER = [Z(2), Z(3)] as const;
const S_SCHACHT = [Z(3), Z(4)] as const;
const S_QUER = [Z(4), Z(7)] as const;
const S_ZELLE = [Z(7), Z(9)] as const;
const S_LAUF = [Z(9), aAber - 0.1] as const;
const S_FEST = [aAber - 0.1, Z(10)] as const;
const S_ENDE = [Z(10), 999] as const;

/** Sichtbarkeit einer Szene (kurze Überblendung). */
const sz = (t: number, [a, b]: readonly [number, number], blende = 0.22) =>
  t < a - blende || t > b + blende ? 0 : Math.min(a <= 0 ? 1 : ease(t, a - blende, a + 0.05), 1 - ease(t, b - 0.05, b + blende));

// ---- Kamera: kurze Fahrten auf Schlüsselwörter -------------------------------
const KAMERA = [aMaenner, aPlan, aNeunzig, aBlock, aStille, aGitter, aWand, aSchacht, aSchultern, aMarco, aJonas, aHenrik,
  aSchritte, aDirekt, aNiemand, aLicht, aBetten, aSirene, aDraussen, aAber, aFest, aSchafft, aFolg].sort((a, b) => a - b);
const kamera = (t: number) => {
  const k = KAMERA.filter((a) => t >= a).length;
  const z = (i: number) => 1 + 0.06 * (i % 2);
  return k === 0 ? 1 : z(k - 1) + (z(k) - z(k - 1)) * ease(t, KAMERA[k - 1], KAMERA[k - 1] + 0.35);
};

// ---- Figuren -------------------------------------------------------------------
/** Stehende Silhouette, Füße bei (x, y), Höhe ≈ 200·s. */
const Mann: React.FC<{ x: number; y: number; s?: number; rand?: string; alt?: boolean; o?: number; atem?: number }> = ({ x, y, s = 1, rand = KALT, alt, o = 1, atem = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o}>
    <g transform={alt ? "rotate(-4) translate(4 4)" : undefined}>
      <circle cx={alt ? 6 : 0} cy={-172 + atem} r={21} fill={SIL} stroke={rand} strokeWidth={2.5} />
      <path
        d={`M-36,${-142 + atem} Q0,${-154 + atem} 36,${-142 + atem} L44,-66 L33,-64 L28,-92 L27,0 L7,0 L1,-58 L-5,0 L-25,0 L-27,-92 L-32,-64 L-43,-66 Z`}
        fill={SIL}
        stroke={rand}
        strokeWidth={2.5}
        strokeLinejoin="round"
      />
    </g>
  </g>
);

/** Kriechende Silhouette (nach rechts), Bauch bei (x, y), Länge ≈ 190·s. */
const Kriecher: React.FC<{ x: number; y: number; s?: number; p: number; rand?: string; o?: number; grau?: boolean }> = ({ x, y, s = 1, p, rand = KALT, o = 1, grau }) => {
  const a = Math.sin(p * Math.PI * 2);
  const b = Math.sin(p * Math.PI * 2 + Math.PI);
  const f = grau ? "#0d0f14" : SIL;
  const st = { stroke: rand, strokeWidth: 2.5 / s, fill: f, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };
  const glied = (x1: number, y1: number, x2: number, y2: number, x3: number, y3: number) => (
    <path d={`M${x1},${y1} L${x2},${y2} L${x3},${y3}`} fill="none" stroke={f} strokeWidth={16} strokeLinecap="round" strokeLinejoin="round" />
  );
  const gliedRand = (x1: number, y1: number, x2: number, y2: number, x3: number, y3: number) => (
    <path d={`M${x1},${y1} L${x2},${y2} L${x3},${y3}`} fill="none" stroke={rand} strokeWidth={20} strokeLinecap="round" strokeLinejoin="round" />
  );
  const arm1 = [40, -26, 66 + 10 * a, -8, 92 + 12 * a, -4] as const;
  const arm2 = [36, -26, 62 + 10 * b, -10, 86 + 12 * b, -4] as const;
  const bein1 = [-52, -22, -78, -6 + 4 * a, -112 + 10 * a, -8] as const;
  const bein2 = [-52, -22, -80, -8 + 4 * b, -114 + 10 * b, -10] as const;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o}>
      {gliedRand(...arm2)}{gliedRand(...bein2)}
      {glied(...arm2)}{glied(...bein2)}
      {gliedRand(...arm1)}{gliedRand(...bein1)}
      <ellipse cx={-6} cy={-24} rx={58} ry={17} {...st} />
      <circle cx={70} cy={-34 + 2 * a} r={17} {...st} />
      {glied(...arm1)}{glied(...bein1)}
      <ellipse cx={-6} cy={-24} rx={56} ry={15} fill={f} />
    </g>
  );
};

/** Laufende Silhouette (nach rechts), Füße bei (x, y). */
const Laeufer: React.FC<{ x: number; y: number; s?: number; p: number; rand?: string }> = ({ x, y, s = 1, p, rand = ROT }) => {
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
    <g transform={`translate(${x} ${y + Math.abs(w) * -6 * s}) scale(${s}) rotate(8)`}>
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

// ---- Bausteine der Szenen -----------------------------------------------------
const Gitterstaebe: React.FC<{ o?: number; licht?: string }> = ({ o = 1, licht = KALT }) => (
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

const ZelleHinten: React.FC<{ t: number; mondlicht?: number }> = ({ t, mondlicht = 1 }) => (
  <g>
    <rect x={0} y={0} width={1080} height={1920} fill={NACHT} />
    {/* Rückwand mit Fugen */}
    <rect x={0} y={250} width={1080} height={1060} fill={BETON} />
    {Array.from({ length: 14 }, (_, r) =>
      Array.from({ length: 6 }, (_, c) => (
        <rect key={`${r}-${c}`} x={(r % 2 ? -90 : 0) + c * 180 + 4} y={256 + r * 76} width={172} height={70} fill={(r * 7 + c * 3) % 5 === 0 ? BETON2 : "#1d2638"} />
      )),
    )}
    {/* Fenster mit Mondlicht */}
    <rect x={640} y={360} width={170} height={120} fill="#0f1a33" stroke="#3b4a66" strokeWidth={6} />
    {[680, 725, 770].map((x) => <rect key={x} x={x} y={360} width={8} height={120} fill="#3b4a66" />)}
    <polygon points="640,480 810,480 560,1300 160,1300" fill={rgba(MOND, 0.07 * mondlicht)} />
    {/* Etagenbett links */}
    <g>
      <rect x={110} y={820} width={300} height={22} fill="#2c364c" />
      <rect x={110} y={1080} width={300} height={22} fill="#2c364c" />
      <rect x={104} y={720} width={14} height={500} fill="#2c364c" />
      <rect x={402} y={720} width={14} height={500} fill="#2c364c" />
      <rect x={120} y={798} width={280} height={24} rx={8} fill="#3a4560" />
      <rect x={120} y={1058} width={280} height={24} rx={8} fill="#3a4560" />
    </g>
    {/* Lüftungsgitter (später der Schacht) */}
    <rect x={830} y={960} width={150} height={110} fill="#0d121c" stroke="#3b4a66" strokeWidth={6} />
    {[0, 1, 2, 3].map((i) => <rect key={i} x={838} y={972 + i * 24} width={134} height={8} fill="#3b4a66" />)}
    {/* Atem des Raums: leichter Staub im Mondlicht */}
    {Array.from({ length: 14 }, (_, i) => {
      const y = 600 + ((i * 97 + t * 18) % 650);
      const x = 300 + ((i * 53) % 360) + Math.sin(t * 0.7 + i) * 18 - (y - 600) * 0.45;
      return <circle key={i} cx={x} cy={y} r={2.2} fill={rgba(MOND, 0.35 * mondlicht)} />;
    })}
  </g>
);

const Vignette: React.FC<{ staerke?: number }> = ({ staerke = 0.85 }) => (
  <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 42%, rgba(0,0,0,0) 30%, rgba(0,0,0,${staerke}) 100%)`, pointerEvents: "none" }} />
);

const NameChip: React.FC<{ t: number; a: number; text: string; x: number; y: number; farbe?: string }> = ({ t, a, text, x, y, farbe = KALT }) => {
  if (t < a) return null;
  const p = pop(t, a, 210, 13);
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) scale(${p})`, fontFamily: MONO, fontWeight: 700, fontSize: 34, letterSpacing: 5, color: NACHT, background: farbe, padding: "6px 18px", borderRadius: 8, whiteSpace: "nowrap" }}>
      {text}
    </div>
  );
};

/** Countdown oben links: läuft ab „neunzig“ in Echtzeit, springt auf ALARM bei der Sirene. */
const Countdown: React.FC<{ t: number }> = ({ t }) => {
  if (t < aNeunzig) return null;
  const alarm = t >= aSirene;
  const gross = 1 - ease(t, Z(1) - 0.2, Z(1) + 0.4); // im Hook groß in der Mitte, danach klein in der Ecke
  const rest = Math.max(0, 90 - (t - aNeunzig));
  const txt = alarm ? "ALARM" : `${String(Math.floor(Math.ceil(rest) / 60)).padStart(2, "0")}:${String(Math.ceil(rest) % 60).padStart(2, "0")}`;
  const p = pop(t, aNeunzig, 220, 12);
  const pa = alarm ? pop(t, aSirene, 230, 10) : 1;
  const x = interpolate(gross, [0, 1], [96, 540]);
  const y = interpolate(gross, [0, 1], [300, 560]);
  const size = interpolate(gross, [0, 1], [62, 190]);
  const blink = alarm ? 0.75 + 0.25 * Math.cos((t - aSirene) * Math.PI * 2 * 0.9) : 1;
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(${-50 * gross}%, -50%) scale(${p * pa})`, transformOrigin: gross > 0.5 ? "50% 50%" : "0 50%" }}>
      {gross < 0.5 ? (
        <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 22, letterSpacing: 4, color: rgba(ROT, 0.85), marginBottom: 2 }}>{alarm ? "SIRENE" : "WÄRTER ZURÜCK IN"}</div>
      ) : null}
      <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: size, lineHeight: 1, letterSpacing: 4, color: ROT, opacity: blink, textShadow: `0 0 ${18 + 22 * gross}px ${rgba(ROT, 0.85)}`, whiteSpace: "nowrap" }}>
        {txt}
      </div>
    </div>
  );
};

/** Rotes Drehlicht: weicher Lichtfächer, der langsam durchs Bild wandert (kein Stroboskop). */
const Drehlicht: React.FC<{ t: number; a: number; staerke?: number }> = ({ t, a, staerke = 1 }) => {
  if (t < a) return null;
  const rein = ease(t, a, a + 0.4) * staerke;
  const w = (t - a) * 200; // Grad
  const puls = 0.5 + 0.5 * Math.cos(((t - a) * Math.PI * 2) / 1.8);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <AbsoluteFill style={{ background: rgba(ROT, 0.16 * rein * (0.4 + 0.6 * puls)), mixBlendMode: "screen" }} />
      <AbsoluteFill style={{ background: `conic-gradient(from ${w}deg at 540px 150px, ${rgba(ROT, 0.0)} 0deg, ${rgba(ROT, 0.42 * rein)} 25deg, ${rgba(ROT, 0)} 60deg, ${rgba(ROT, 0)} 180deg, ${rgba(ROT, 0.42 * rein)} 205deg, ${rgba(ROT, 0)} 240deg, ${rgba(ROT, 0)} 360deg)`, mixBlendMode: "screen" }} />
    </AbsoluteFill>
  );
};

// ---- Szene 1 + Ende: die Zelle --------------------------------------------------
const ZELLE_MAENNER = [
  { x: 250, alt: false },
  { x: 390, alt: false },
  { x: 530, alt: false },
  { x: 670, alt: true },
];
const ZelleSzene: React.FC<{ t: number; mitMaennern: boolean; o: number; leer?: boolean; lampe?: boolean }> = ({ t, mitMaennern, o, lampe }) => {
  if (o <= 0) return null;
  // Taschenlampe: wandert von rechts herein, bleibt auf den Betten
  const lx = lampe ? interpolate(ease(t, aLicht, aBetten + 0.2), [0, 1], [1150, 260]) : -999;
  const lampeO = lampe ? ease(t, aLicht - 0.2, aLicht + 0.3) : 0;
  const bettHell = lampe ? ease(t, aLeeren, aBetten + 0.3) : 0;
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920">
        <defs>
          <radialGradient id="lampe" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={LAMPE} stopOpacity={0.55} />
            <stop offset="70%" stopColor={LAMPE} stopOpacity={0.12} />
            <stop offset="100%" stopColor={LAMPE} stopOpacity={0} />
          </radialGradient>
        </defs>
        <ZelleHinten t={t} mondlicht={lampe ? 0.6 : 1} />
        {mitMaennern
          ? ZELLE_MAENNER.map((m, i) => {
              const a = aVier + (i * (aMaenner + 0.35 - aVier)) / 3;
              const p = Math.min(1, pop(t, a, 200, 14));
              return <Mann key={i} x={m.x} y={1230} s={1.95 * (0.9 + 0.1 * p)} o={p} alt={m.alt} atem={Math.sin(t * 2.2 + i) * 1.5} />;
            })
          : null}
        {/* Plan an der Wand: Kreidelinie vom Gitter zum Fenster */}
        {mitMaennern && t >= aPlan ? (
          <g opacity={ease(t, aPlan, aPlan + 0.2)}>
            <path d="M905,955 C880,820 760,760 720,600 C705,540 715,520 725,485" fill="none" stroke="#e8edf7" strokeWidth={7} strokeDasharray="22 14" strokeLinecap="round"
              pathLength={1} style={{ strokeDasharray: "0.04 0.025", strokeDashoffset: 1 - lin(t, aPlan, aPlan + 0.9) }} />
            <circle cx={905} cy={1015} r={92 * Math.min(1, pop(t, aPlan, 200, 12))} fill="none" stroke="#e8edf7" strokeWidth={7} />
            <path d="M700,500 L725,485 L728,515" fill="none" stroke="#e8edf7" strokeWidth={7} strokeLinecap="round" opacity={lin(t, aPlan + 0.8, aPlan + 0.9)} />
          </g>
        ) : null}
        {lampe ? (
          <>
            <ellipse cx={lx} cy={980} rx={250} ry={210} fill="url(#lampe)" opacity={lampeO} />
            <polygon points={`1180,760 1180,880 ${lx},1190 ${lx},770`} fill={rgba(LAMPE, 0.08 * lampeO)} />
            {/* leere Betten im Licht */}
            <rect x={120} y={798} width={280} height={24} rx={8} fill={rgba(LAMPE, 0.5 * bettHell)} />
            <rect x={120} y={1058} width={280} height={24} rx={8} fill={rgba(LAMPE, 0.5 * bettHell)} />
          </>
        ) : null}
        <Gitterstaebe />
      </svg>
    </AbsoluteFill>
  );
};

// ---- Szene 2: von außen -----------------------------------------------------------
const AussenSzene: React.FC<{ t: number; o: number }> = ({ t, o }) => {
  if (o <= 0) return null;
  const w = -38 + Math.sin((t - Z(1)) * 1.1) * 30; // Suchscheinwerfer
  const still = ease(t, aStille, aStille + 0.6);
  const pBlock = pop(t, aBlock, 200, 13);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920">
        <defs>
          <linearGradient id="himmel" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#02040a" />
            <stop offset="100%" stopColor="#14213d" />
          </linearGradient>
          <linearGradient id="kegel" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={MOND} stopOpacity={0.55} />
            <stop offset="100%" stopColor={MOND} stopOpacity={0} />
          </linearGradient>
        </defs>
        <rect width={1080} height={1920} fill="url(#himmel)" />
        {Array.from({ length: 40 }, (_, i) => <circle key={i} cx={(i * 211) % 1080} cy={(i * 137) % 700 + 240} r={i % 3 ? 1.6 : 2.6} fill={MOND} opacity={0.3 + 0.3 * Math.sin(t * 1.3 + i)} />)}
        <circle cx={250} cy={460} r={70} fill={MOND} opacity={0.9} />
        <circle cx={250} cy={460} r={150} fill={MOND} opacity={0.06} />
        {/* Mauer und Gebäude */}
        <rect x={0} y={900} width={1080} height={420} fill="#0a0f1a" />
        <rect x={80} y={760} width={620} height={300} fill="#0d1422" stroke="#1f2b44" strokeWidth={4} />
        {Array.from({ length: 4 }, (_, r) => Array.from({ length: 7 }, (_, c) => (
          <rect key={`${r}${c}`} x={112 + c * 84} y={796 + r * 62} width={30} height={34} fill={r === 2 && c === 4 ? rgba(LAMPE, 0.55) : "#05080f"} stroke="#24324f" strokeWidth={3} />
        )))}
        <text x={390} y={1010} textAnchor="middle" fontFamily={HEAD} fontWeight={900} fontSize={84} fill={rgba("#c9d4ea", 0.85 * Math.min(1, pBlock))} letterSpacing={8}>BLOCK C</text>
        {/* Stacheldraht */}
        <line x1={0} y1={890} x2={1080} y2={890} stroke="#3a4766" strokeWidth={4} />
        {Array.from({ length: 27 }, (_, i) => <path key={i} d={`M${i * 40},880 l12,20 l12,-20`} fill="none" stroke="#3a4766" strokeWidth={3} />)}
        {/* Wachturm rechts */}
        <rect x={840} y={560} width={30} height={760} fill="#0a0f1a" />
        <rect x={790} y={520} width={140} height={90} fill="#0d1422" stroke="#24324f" strokeWidth={4} />
        <polygon points="770,520 950,520 860,470" fill="#0d1422" stroke="#24324f" strokeWidth={4} />
        <g transform={`translate(860 570) rotate(${180 + w})`}>
          <polygon points="0,-8 900,-170 900,170 0,8" fill="url(#kegel)" opacity={0.75 * (1 - 0.6 * still)} />
        </g>
        <circle cx={860} cy={570} r={14} fill={MOND} />
        <rect x={0} y={1310} width={1080} height={610} fill="#04060b" />
      </svg>
      <AbsoluteFill style={{ background: rgba("#000000", 0.35 * still) }} />
      {t >= aDrei ? (
        <div style={{ position: "absolute", left: 540, top: 1150, transform: `translateX(-50%) scale(${pop(t, aDrei, 210, 13)})`, fontFamily: MONO, fontWeight: 700, fontSize: 64, letterSpacing: 8, color: MOND, textShadow: `0 0 18px ${rgba(KALT, 0.8)}` }}>03:00 UHR</div>
      ) : null}
    </AbsoluteFill>
  );
};

// ---- Szene 3: das Gitter --------------------------------------------------------------
const GitterSzene: React.FC<{ t: number; o: number }> = ({ t, o }) => {
  if (o <= 0) return null;
  const wackeln = t >= aGitter && t < aWand ? Math.sin((t - aGitter) * 40) * 4 : 0;
  const ab = ease(t, aWand, aWand + 0.7);
  const hand = ease(t, aZieht - 0.3, aZieht + 0.2);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920">
        <rect width={1080} height={1920} fill={NACHT} />
        <rect x={0} y={250} width={1080} height={1060} fill={BETON} />
        {Array.from({ length: 7 }, (_, r) => Array.from({ length: 4 }, (_, c) => (
          <rect key={`${r}${c}`} x={(r % 2 ? -150 : 0) + c * 300 + 6} y={256 + r * 152} width={288} height={142} fill={(r + c) % 3 ? "#1d2638" : BETON2} />
        )))}
        {/* Loch hinter dem Gitter */}
        <rect x={330} y={570} width={420} height={330} fill="#000" />
        <rect x={330} y={570} width={420} height={330} fill="none" stroke="#2b3750" strokeWidth={10} />
        {/* Gitter */}
        <g transform={`translate(${540 + wackeln - 260 * ab} ${735 + 520 * ab * ab}) rotate(${-38 * ab})`}>
          <rect x={-225} y={-180} width={450} height={360} rx={10} fill="#3a465f" stroke="#55647f" strokeWidth={8} />
          {Array.from({ length: 7 }, (_, i) => <rect key={i} x={-200} y={-150 + i * 44} width={400} height={20} rx={6} fill="#0b0f17" />)}
          {[-195, 195].map((x) => [-150, 150].map((y) => <circle key={`${x}${y}`} cx={x} cy={y} r={11} fill="#55647f" />))}
        </g>
        {/* Hände */}
        {[-1, 1].map((sd) => (
          <g key={sd} transform={`translate(${540 + sd * 170 + wackeln - 260 * ab} ${905 + 520 * ab * ab + (1 - hand) * 500})`} opacity={hand * (1 - ab * 0.8)}>
            <path d={`M${-70 * sd},400 Q${-60 * sd},180 ${-8 * sd},40 L${40 * sd},40 Q${30 * sd},200 ${40 * sd},400 Z`} fill={SIL} stroke={KALT} strokeWidth={4} />
            <rect x={-34} y={-14} width={68} height={70} rx={26} fill={SIL} stroke={KALT} strokeWidth={4} />
            {[-24, -8, 8, 24].map((fx) => <rect key={fx} x={fx - 8} y={-40} width={16} height={46} rx={8} fill={SIL} stroke={KALT} strokeWidth={3} />)}
          </g>
        ))}
      </svg>
      <Vignette />
    </AbsoluteFill>
  );
};

// ---- Szene 4: der Schacht (Draufsicht: Schultern im Loch) ----------------------------
const SchachtSzene: React.FC<{ t: number; o: number }> = ({ t, o }) => {
  if (o <= 0) return null;
  const tiefe = ease(t, Z(3), aSchacht + 0.6);
  const eng = ease(t, aKaum, aSchultern + 0.4);
  const breite = interpolate(eng, [0, 1], [600, 450]);
  const pMann = pop(t, aKaum - 0.15, 170, 14);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920">
        <rect width={1080} height={1920} fill={NACHT} />
        {/* Tunnel in die Tiefe */}
        {Array.from({ length: 9 }, (_, i) => {
          const k = (i + tiefe * 1.5) / 9;
          const w = breite * Math.pow(0.72, i - tiefe * 1.5);
          const h = w * 0.78;
          return <rect key={i} x={540 - w / 2} y={780 - h / 2} width={w} height={h} fill="none" stroke={rgba(KALT, 0.12 + 0.5 * (1 - k))} strokeWidth={4} />;
        })}
        <rect x={540 - breite / 2} y={780 - breite * 0.39} width={breite} height={breite * 0.78} fill="none" stroke={KALT} strokeWidth={8} />
        {/* Kopf + Schultern von oben */}
        <g transform={`translate(540 800) scale(${0.6 + 0.4 * Math.min(1, pMann)})`} opacity={Math.min(1, pMann)}>
          <ellipse cx={0} cy={0} rx={212} ry={72} fill={SIL} stroke={KALT} strokeWidth={4} />
          <circle cx={0} cy={-6} r={62} fill="#0a0d14" stroke={KALT} strokeWidth={4} />
        </g>
        {/* Maß: Schultern gegen Schacht */}
        {t >= aSchultern - 0.2 ? (
          <g opacity={ease(t, aSchultern - 0.2, aSchultern + 0.2)}>
            <line x1={540 - breite / 2} y1={1135} x2={540 + breite / 2} y2={1135} stroke={ROT} strokeWidth={6} />
            <line x1={328} y1={1185} x2={752} y2={1185} stroke={MOND} strokeWidth={6} />
            {[540 - breite / 2, 540 + breite / 2].map((x) => <line key={x} x1={x} y1={1118} x2={x} y2={1152} stroke={ROT} strokeWidth={6} />)}
            {[328, 752].map((x) => <line key={x} x1={x} y1={1168} x2={x} y2={1202} stroke={MOND} strokeWidth={6} />)}
          </g>
        ) : null}
      </svg>
      {t >= aSchacht ? (
        <div style={{ position: "absolute", left: 540, top: 400, transform: `translateX(-50%) scale(${pop(t, aSchacht, 210, 13)})`, fontFamily: HEAD, fontWeight: 900, fontSize: 88, letterSpacing: 6, color: MOND, whiteSpace: "nowrap", textShadow: `0 0 20px ${rgba(KALT, 0.7)}` }}>DER SCHACHT</div>
      ) : null}
      {t >= aSchultern + 0.1 ? (
        <div style={{ position: "absolute", left: 540, top: 1215, transform: `translateX(-50%) scale(${pop(t, aSchultern + 0.1, 210, 13)})`, fontFamily: MONO, fontWeight: 700, fontSize: 32, letterSpacing: 4, color: ROT, whiteSpace: "nowrap" }}>NUR EIN PAAR ZENTIMETER LUFT</div>
      ) : null}
      <Vignette staerke={0.9} />
    </AbsoluteFill>
  );
};

// ---- Szene 5–7: Querschnitt mit Kriechern, Schritten, Herzschlag ------------------------
const ROHR_Y = 900; // Mitte des Schachts
const KRIECHER = [
  { a: aEiner, name: "ELIAS", ziel: 880, y: 1060 },
  { a: aMarco, name: "MARCO", ziel: 630, y: 1120 },
  { a: aJonas, name: "JONAS", ziel: 385, y: 1060 },
  { a: aHenrik, name: "HENRIK", ziel: 145, y: 1120, grau: true },
];
const QuerSzene: React.FC<{ t: number; o: number }> = ({ t, o }) => {
  if (o <= 0) return null;
  const halt = t >= aSchritte; // bei den Schritten erstarren alle
  const stillstand = (tt: number) => Math.min(tt, aSchritte);
  // Wärter-Beine oben: laufen von rechts nach links, bleiben bei „Direkt“ über ihnen stehen
  const wx = interpolate(ease(t, aSchritte - 0.4, aDirekt + 0.5), [0, 1], [1200, 560]);
  const schrittP = t < aDirekt + 0.5 ? (t - aSchritte) * 1.7 : 0;
  const atem = t >= aNiemand ? ease(t, aNiemand, aNiemand + 0.6) : 0;
  const herz = (tt: number) => {
    const schlaege = [aNiemand + 0.6, aNiemand + 1.45, aNiemand + 2.3];
    return schlaege.reduce((s, a) => s + (tt >= a ? Math.exp(-(tt - a) * 9) : 0), 0);
  };
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920">
        <rect width={1080} height={1920} fill={NACHT} />
        {/* Gang oben */}
        <rect x={0} y={250} width={1080} height={480} fill="#0f1726" />
        <rect x={0} y={700} width={1080} height={30} fill="#2a3550" />
        {/* Decke/Boden aus Beton */}
        <rect x={0} y={730} width={1080} height={70} fill={BETON} />
        <rect x={0} y={990} width={1080} height={320} fill={BETON} />
        {Array.from({ length: 6 }, (_, i) => <rect key={i} x={i * 190 + 10} y={1000 + (i % 2) * 120} width={150} height={90} fill="#1d2638" />)}
        {/* Schacht */}
        <rect x={0} y={800} width={1080} height={190} fill="#000" />
        <line x1={0} y1={800} x2={1080} y2={800} stroke={rgba(KALT, 0.6)} strokeWidth={4} />
        <line x1={0} y1={990} x2={1080} y2={990} stroke={rgba(KALT, 0.6)} strokeWidth={4} />
        {/* Kriecher */}
        {KRIECHER.map((k, i) => {
          if (t < k.a - 0.1) return null;
          const tt = stillstand(t);
          const x = interpolate(ease(tt, k.a - 0.1, k.a + 2.6), [0, 1], [-140, k.ziel]) + (tt - k.a) * 6;
          const p = halt ? 0.25 : (tt - k.a) * 1.4 + i * 0.3;
          return <Kriecher key={i} x={x} y={975} s={1.3} p={p} grau={k.grau} rand={k.grau ? "#9aa5bb" : KALT} />;
        })}
        {/* Wärter-Beine im Gang */}
        {t >= aSchritte - 0.4 ? (
          <g transform={`translate(${wx} 700)`}>
            {[0, Math.PI].map((ph, i) => {
              const k = Math.sin(schrittP * Math.PI * 2 + ph);
              return (
                <g key={i}>
                  <path d={`M0,-330 L${-30 * k},-150 L${-46 * k},0`} fill="none" stroke={rgba(KALT, 0.55)} strokeWidth={54} strokeLinecap="round" strokeLinejoin="round" />
                  <path d={`M0,-330 L${-30 * k},-150 L${-46 * k},0`} fill="none" stroke="#000" strokeWidth={46} strokeLinecap="round" strokeLinejoin="round" />
                  <path d={`M${-46 * k - 34},-4 L${-46 * k + 20},-4`} stroke="#000" strokeWidth={28} strokeLinecap="round" />
                </g>
              );
            })}
            <ellipse cx={0} cy={180} rx={160} ry={40} fill={rgba(LAMPE, 0.08)} />
          </g>
        ) : null}
        {/* Staub rieselt bei jedem Schritt */}
        {t >= aSchritte
          ? Array.from({ length: 18 }, (_, i) => {
              const s0 = aSchritte + (i % 3) * 0.55;
              if (t < s0) return null;
              const fall = (t - s0) * 260;
              return <circle key={i} cx={wx - 60 + ((i * 37) % 120)} cy={805 + fall % 180} r={2.5} fill={rgba(MOND, 0.6 * Math.max(0, 1 - (t - s0) / 2.5))} />;
            })
          : null}
        {/* Herzschlag-Linie */}
        {t >= aNiemand ? (
          <path
            d={Array.from({ length: 121 }, (_, i) => {
              const x = 60 + i * 8;
              const tt = t - (120 - i) * 0.012;
              const h = herz(tt);
              return `${i ? "L" : "M"}${x},${1200 - 120 * h * Math.sin(i * 1.7)}`;
            }).join(" ")}
            fill="none"
            stroke={ROT}
            strokeWidth={5}
            opacity={atem}
          />
        ) : null}
      </svg>
      {KRIECHER.map((k) => {
        const tt = stillstand(t);
        const x = interpolate(ease(tt, k.a - 0.1, k.a + 2.6), [0, 1], [-140, k.ziel]) + (tt - k.a) * 6;
        return <NameChip key={k.name} t={t} a={k.a} text={k.name} x={Math.min(800, Math.max(110, x))} y={k.y} farbe={k.grau ? "#c9d1e0" : KALT} />;
      })}
      {t >= aDirekt ? (
        <div style={{ position: "absolute", left: 540, top: 420, transform: `translateX(-50%) scale(${pop(t, aDirekt, 220, 12)})`, fontFamily: HEAD, fontWeight: 900, fontSize: 72, letterSpacing: 4, color: LAMPE, textShadow: `0 0 18px ${rgba(LAMPE, 0.6)}`, whiteSpace: "nowrap", opacity: 1 - ease(t, aNiemand - 0.1, aNiemand + 0.3) }}>
          DIREKT ÜBER IHNEN
        </div>
      ) : null}
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 47%, rgba(0,0,0,0) ${40 - 22 * atem}%, rgba(0,0,0,${0.85 + 0.12 * atem}) 100%)` }} />
    </AbsoluteFill>
  );
};

// ---- Szene 10a: drei laufen ----------------------------------------------------------
const LaufSzene: React.FC<{ t: number; o: number }> = ({ t, o }) => {
  if (o <= 0) return null;
  const tt = t - S_LAUF[0];
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920">
        <rect width={1080} height={1920} fill="#04060b" />
        <rect x={0} y={250} width={1080} height={760} fill="#0b1222" />
        <circle cx={820} cy={430} r={60} fill={MOND} opacity={0.8} />
        {/* Zaun */}
        <rect x={0} y={760} width={1080} height={8} fill="#2c3854" />
        {Array.from({ length: 12 }, (_, i) => <rect key={i} x={i * 96} y={640} width={8} height={470} fill="#2c3854" />)}
        {Array.from({ length: 30 }, (_, i) => <path key={i} d={`M${i * 40},640 l14,-22 l14,22`} fill="none" stroke="#3a4766" strokeWidth={3} />)}
        <rect x={0} y={1110} width={1080} height={200} fill="#070b14" />
        {/* Suchscheinwerfer, jetzt rot */}
        <g transform={`translate(1080 260) rotate(${120 + Math.sin(tt * 2.2) * 22})`}>
          <polygon points="0,-6 1300,-200 1300,200 0,6" fill={rgba(ROT, 0.22)} />
        </g>
        {[0, 1, 2].map((i) => (
          <Laeufer key={i} x={-160 + tt * (300 + i * 22) + i * 170} y={1200 + i * 28} s={1.6 + i * 0.1} p={tt * 2.4 + i * 0.33} />
        ))}
      </svg>
      {t >= aDraussen ? (
        <div style={{ position: "absolute", left: 540, top: 400, transform: `translateX(-50%) scale(${pop(t, aDraussen, 220, 12)})`, fontFamily: HEAD, fontWeight: 900, fontSize: 74, letterSpacing: 6, color: MOND, whiteSpace: "nowrap" }}>
          3 SIND DRAUSSEN
        </div>
      ) : null}
      <Vignette />
    </AbsoluteFill>
  );
};

// ---- Szene 10b: Henrik steckt fest ------------------------------------------------------
const FestSzene: React.FC<{ t: number; o: number }> = ({ t, o }) => {
  if (o <= 0) return null;
  const zerr = Math.sin(t * 9) * 6 * ease(t, aFest - 0.3, aFest);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920">
        <rect width={1080} height={1920} fill={NACHT} />
        <rect x={0} y={560} width={1080} height={300} fill={BETON} />
        <rect x={0} y={1010} width={1080} height={300} fill={BETON} />
        {/* Schacht wird enger */}
        <polygon points="0,860 640,860 760,900 1080,900 1080,970 760,970 640,1010 0,1010" fill="#000" />
        <polyline points="0,860 640,860 760,900 1080,900" fill="none" stroke={rgba(KALT, 0.6)} strokeWidth={4} />
        <polyline points="0,1010 640,1010 760,970 1080,970" fill="none" stroke={rgba(KALT, 0.6)} strokeWidth={4} />
        <Kriecher x={560 + zerr} y={985} s={1.15} p={0.25 + Math.sin(t * 6) * 0.06} grau rand="#c9d1e0" />
        {/* enge Stelle markiert */}
        <circle cx={720} cy={935} r={115 * Math.min(1, pop(t, aFest, 200, 12))} fill="none" stroke={ROT} strokeWidth={7} opacity={t >= aFest ? 1 : 0} />
      </svg>
      <NameChip t={t} a={A("Henrik", 2)} text="HENRIK" x={430} y={1120} farbe="#c9d1e0" />
      {t >= aFest ? (
        <div style={{ position: "absolute", left: 540, top: 470, transform: `translateX(-50%) scale(${pop(t, aFest, 230, 11)}) rotate(-4deg)`, fontFamily: HEAD, fontWeight: 900, fontSize: 108, letterSpacing: 6, color: ROT, border: `9px solid ${ROT}`, borderRadius: 16, padding: "0 28px 6px", textShadow: `0 0 18px ${rgba(ROT, 0.6)}`, whiteSpace: "nowrap" }}>
          STECKT FEST
        </div>
      ) : null}
      <Vignette staerke={0.92} />
    </AbsoluteFill>
  );
};

// ---- Ende: Frage + Teil 2 -----------------------------------------------------------------
const EndeText: React.FC<{ t: number }> = ({ t }) => {
  if (t < aSchafft) return null;
  const p = pop(t, aSchafft, 200, 13);
  const pT = pop(t, aFolg, 210, 12);
  return (
    <>
      <div style={{ position: "absolute", left: 540, top: 560, transform: `translate(-50%,-50%) scale(${p})`, textAlign: "center", fontFamily: HEAD, fontWeight: 900, fontSize: 118, lineHeight: 1.0, color: "#ffffff", textShadow: `0 6px 30px rgba(0,0,0,0.9), 0 0 24px ${rgba(ROT, 0.6)}` }}>
        SCHAFFT
        <br />
        ER ES?
      </div>
      {t >= aFolg ? (
        <div style={{ position: "absolute", left: 540, top: 1580, transform: `translate(-50%,-50%) scale(${pT})`, display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
          <div style={{ fontFamily: HEAD, fontWeight: 900, fontSize: 84, color: NACHT, background: ROT, padding: "6px 34px 12px", borderRadius: 16, whiteSpace: "nowrap", boxShadow: `0 0 34px ${rgba(ROT, 0.7)}` }}>TEIL 2 FOLGT</div>
          <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 32, letterSpacing: 3, color: MOND, opacity: ease(t, aFolg + 0.3, aFolg + 0.6) }}>Folgen · {THEME.kanal.handle}</div>
        </div>
      ) : null}
    </>
  );
};

export const Video: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  const k = kamera(t);
  return (
    <AbsoluteFill style={{ background: NACHT, overflow: "hidden" }}>
      <Audio src={staticFile(V.audio)} />
      <AbsoluteFill style={{ transform: `scale(${k})`, transformOrigin: "540px 780px" }}>
        <ZelleSzene t={t} mitMaennern o={sz(t, S_HOOK)} />
        <AussenSzene t={t} o={sz(t, S_AUSSEN)} />
        <GitterSzene t={t} o={sz(t, S_GITTER)} />
        <SchachtSzene t={t} o={sz(t, S_SCHACHT)} />
        <QuerSzene t={t} o={sz(t, S_QUER)} />
        <ZelleSzene t={t} mitMaennern={false} lampe o={sz(t, S_ZELLE)} />
        <LaufSzene t={t} o={sz(t, S_LAUF)} />
        <FestSzene t={t} o={sz(t, S_FEST)} />
        <ZelleSzene t={t} mitMaennern={false} o={sz(t, S_ENDE)} />
      </AbsoluteFill>
      <Drehlicht t={t} a={aSirene} />
      <Countdown t={t} />
      <EndeText t={t} />
      {t < aEnde ? <Captions t={t} chunks={CHUNKS} dark /> : null}
      <div style={{ position: "absolute", top: 190, left: 96, right: 96, display: "flex", justifyContent: "space-between", fontFamily: MONO, fontSize: 26, letterSpacing: 3, color: rgba(MOND, 0.8), textTransform: "uppercase", opacity: ease(t, Z(1), Z(1) + 0.4) * (1 - ease(t, aSchafft, aSchafft + 0.3)) }}>
        <span />
        <span style={{ opacity: 0.75 }}>Der Ausbruch · Teil 1</span>
      </div>
    </AbsoluteFill>
  );
};

void clamp;
void ZE;
void aWaerter;
void aKriechen;
void aStille;

/** Für das Cover: die Zelle mit allen vier Männern (Hook-Bild). */
export const CoverZelle: React.FC = () => <ZelleSzene t={aMaenner + 3} mitMaennern o={1} />;
