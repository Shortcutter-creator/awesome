// Video „Disziplin vs. Motivation“: zwei durchsichtige Figuren an zwei Klimmzugstangen vor dunklem Hintergrund.
// Motivation (links, orange) startet schnell, wird langsamer, lässt los und sitzt am Boden. Disziplin (rechts, blau) zieht gleichmäßig weiter.
// Ohne Stimme und ohne Untertitel (Wunsch); die Wortzeiten aus woerter.json steuern weiter den Ablauf.
// Die Wiederholungen plant plan.py aus den Wortzeiten (wiederholungen.json); die Klänge nutzen dieselben Zeiten. Kein Outro.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { FPS, HEAD, MONO, at, ease, pop, rgba, type Voice } from "../../basis/lib";
import daten from "./woerter.json";
import plan from "./wiederholungen.json";

const V = daten as unknown as Voice;
const WD = V.words;
const A = (w: string, n: number | { ab: number } = 1) => at(WD, w, n);

export const DAUER = Math.ceil((V.dauer + 2.4) * FPS);

type Rep = [number, number, number];
const MOT = plan.motivation.reps as Rep[];
const DIS = plan.disziplin.reps as Rep[];
const LOS = plan.motivation.loslassen;

const BG = "#04060b";
const ORANGE = "#ff9a4a";
const BLAU = "#6fb6ff";
const BY = 560; // Stangenhöhe
const BODEN = 1250;
const XM = 290; // Mitte links (Motivation)
const XD = 700; // Mitte rechts (Disziplin)

const aMaenner = A("Männer");
const aMotiv = A("Motivation", 1);
const aDiszi = A("Disziplin", 1);
const aRakete = A("Rakete");
const aLangsam = A("langsamer");
const aWeiter = A("weiter");
const aBoden = A("Boden");
const aImmer = A("immer");
const aGeschafft = A("geschafft");
const aGfl = A("Gefühl");
const aEntscheidung = A("Entscheidung");
const aZaehlt = A("zählt");
const aWeitermachst = A("weitermachst");

// ---- Bewegung aus den geplanten Wiederholungen ------------------------------------------------------
const zug = (reps: Rep[], t: number) => {
  for (const [s, e, a] of reps) {
    if (t >= s && t <= e) {
      const u = (t - s) / (e - s);
      const k = u < 0.45 ? Math.sin((u / 0.45) * (Math.PI / 2)) : Math.cos(((u - 0.45) / 0.55) * (Math.PI / 2));
      return a * k;
    }
  }
  return 0;
};
const zaehler = (reps: Rep[], t: number) => reps.filter(([s, e, a]) => a >= 0.8 && t >= (s + e) / 2).length;

// ---- Gläserne Figur ---------------------------------------------------------------------------------
const Glied: React.FC<{ d: string; farbe: string; w?: number; glanz: number }> = ({ d, farbe, w = 30, glanz }) => (
  <>
    <path d={d} fill="none" stroke={farbe} strokeWidth={w + 6} strokeLinecap="round" strokeLinejoin="round" opacity={0.55 + 0.4 * glanz} />
    <path d={d} fill="none" stroke={BG} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" />
    <path d={d} fill="none" stroke={farbe} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" opacity={0.12 + 0.12 * glanz} />
  </>
);

const ellbogen = (hx: number, hy: number, sx: number, sy: number, aussen: number, L = 170) => {
  const dx = hx - sx, dy = hy - sy;
  const d = Math.hypot(dx, dy);
  const mx = (sx + hx) / 2, my = (sy + hy) / 2;
  if (d >= L) return [mx, my] as const;
  const h = Math.sqrt((L / 2) ** 2 - (d / 2) ** 2);
  return [mx + (-dy / d) * h * aussen, my + (dx / d) * h * aussen] as const;
};

/** Hängende Figur: Hände an der Stange bei cx ± 62, p = 0 hängt, 1 = Kinn über der Stange. dy verschiebt (Fallen). */
const Haenger: React.FC<{ cx: number; p: number; farbe: string; glanz: number; dy?: number; haende?: boolean; o?: number }> = ({ cx, p, farbe, glanz, dy = 0, haende = true, o = 1 }) => {
  const sy = BY + 160 - 195 * p + dy;
  const arme = [-1, 1].map((sd) => {
    const hx = cx + sd * 62, hy = haende ? BY : sy - 150;
    const sx = cx + sd * 40;
    const [ex, ey] = ellbogen(hx, hy, sx, sy, sd);
    return `M${sx},${sy} L${ex},${ey} L${hx},${hy}`;
  });
  const beine = [-1, 1].map((sd) => `M${cx + sd * 20},${sy + 200} L${cx + sd * 22},${sy + 305} L${cx + sd * 16 - 6},${sy + 400}`);
  return (
    <g opacity={o} filter="url(#dm-glow)">
      {beine.map((d, i) => <Glied key={i} d={d} farbe={farbe} w={30} glanz={glanz} />)}
      <Glied d={`M${cx - 30},${sy + 10} L${cx + 30},${sy + 10} L${cx + 24},${sy + 200} L${cx - 24},${sy + 200} Z`} farbe={farbe} w={26} glanz={glanz} />
      {arme.map((d, i) => <Glied key={i} d={d} farbe={farbe} w={24} glanz={glanz} />)}
      <circle cx={cx} cy={sy - 44} r={32} fill={rgba(farbe, 0.12 + 0.12 * glanz)} stroke={farbe} strokeWidth={5} opacity={0.6 + 0.4 * glanz} />
    </g>
  );
};

/** Sitzende Figur am Boden, Kopf gesenkt. */
const Sitzer: React.FC<{ cx: number; farbe: string; glanz: number; o: number }> = ({ cx, farbe, glanz, o }) => {
  const hx = cx - 40, hy = BODEN - 34;
  const sx = cx - 10, sy = BODEN - 200;
  return (
    <g opacity={o} filter="url(#dm-glow)">
      <Glied d={`M${hx},${hy} L${cx + 40},${BODEN - 140} L${cx + 92},${BODEN - 14}`} farbe={farbe} w={30} glanz={glanz} />
      <Glied d={`M${hx - 10},${hy} L${cx + 26},${BODEN - 128} L${cx + 70},${BODEN - 12}`} farbe={farbe} w={30} glanz={glanz} />
      <Glied d={`M${sx - 26},${sy} L${sx + 26},${sy + 6} L${hx + 22},${hy} L${hx - 26},${hy - 6} Z`} farbe={farbe} w={26} glanz={glanz} />
      <Glied d={`M${sx + 10},${sy + 10} L${cx + 30},${BODEN - 120} L${cx + 50},${BODEN - 150}`} farbe={farbe} w={22} glanz={glanz} />
      <circle cx={sx + 30} cy={sy - 30} r={32} fill={rgba(farbe, 0.12 + 0.12 * glanz)} stroke={farbe} strokeWidth={5} opacity={0.6 + 0.4 * glanz} />
    </g>
  );
};

const Stange: React.FC<{ cx: number }> = ({ cx }) => (
  <g>
    <line x1={cx - 140} y1={BY - 40} x2={cx - 140} y2={BODEN} stroke="#2a3346" strokeWidth={10} />
    <line x1={cx + 140} y1={BY - 40} x2={cx + 140} y2={BODEN} stroke="#2a3346" strokeWidth={10} />
    <line x1={cx - 150} y1={BY} x2={cx + 150} y2={BY} stroke="#c7d2e6" strokeWidth={10} strokeLinecap="round" />
    <line x1={cx - 150} y1={BY - 3} x2={cx + 150} y2={BY - 3} stroke="#ffffff" strokeWidth={2} opacity={0.6} />
  </g>
);

const Zaehler: React.FC<{ t: number; x: number; wert: number; farbe: string; label: string; o: number; unter?: string; aUnter?: number }> = ({ t, x, wert, farbe, label, o, unter, aUnter = Infinity }) => (
  <div style={{ position: "absolute", left: x, top: 280, transform: "translateX(-50%)", textAlign: "center", opacity: o }}>
    <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 130, lineHeight: 1, color: farbe, textShadow: `0 0 30px ${rgba(farbe, 0.6)}` }}>{wert}</div>
    <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 30, letterSpacing: 5, color: rgba(farbe, 0.9), marginTop: 8 }}>{label}</div>
  </div>
);

export const Video: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  const ein = ease(t, 0, 0.6);
  // Motivation
  const fall = t >= LOS ? ease(t, LOS, LOS + 0.35) : 0;
  const sitzen = t >= LOS + 0.3 ? ease(t, LOS + 0.3, LOS + 0.9) : 0;
  const glanzM = t < aLangsam ? 1 : interpolate(t, [aLangsam, LOS, LOS + 1.5], [1, 0.45, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const atem = 0.03 + 0.02 * Math.sin(t * 2.2);
  const pM = t < LOS ? Math.max(zug(MOT, t), t < MOT[0][0] ? atem : 0) : 0;
  const figurO = ease(t, aMaenner - 0.15, aMaenner + 0.35);
  const nM = zaehler(MOT, t);
  // Disziplin
  const pD = Math.max(zug(DIS, t), t < DIS[0][0] ? 0.03 + 0.02 * Math.sin(t * 2.2 + 1) : 0);
  const nD = zaehler(DIS, t);
  const ueberholt = nD > zaehler(MOT, 999);
  const zahlenO = 1 - ease(t, aZaehlt - 0.3, aZaehlt + 0.1);
  // Nachbild bei schnellen Zügen (Tempo-Effekt)
  const nachbild = t < aLangsam ? [0.06, 0.12].map((dt) => zug(MOT, t - dt)) : [];
  return (
    <AbsoluteFill style={{ background: BG }}>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 55%, #0d1422 0%, #04060b 70%)", opacity: ein }} />
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity: ein }}>
        <defs>
          <filter id="dm-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="7" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {/* Boden mit schwacher Spiegelung */}
        <line x1={60} y1={BODEN} x2={1020} y2={BODEN} stroke="#1c2433" strokeWidth={4} />
        <ellipse cx={XM} cy={BODEN + 6} rx={120} ry={10} fill={rgba(ORANGE, 0.12 * glanzM)} />
        <ellipse cx={XD} cy={BODEN + 6} rx={120} ry={10} fill={rgba(BLAU, 0.12)} />
        <Stange cx={XM} />
        <Stange cx={XD} />
        {nachbild.map((p, i) => <Haenger key={i} cx={XM} p={p} farbe={ORANGE} glanz={0.4} o={0.18 - i * 0.07} />)}
        {sitzen < 1 ? <Haenger cx={XM} p={pM} farbe={ORANGE} glanz={glanzM} dy={fall * 130} haende={t < LOS + 0.05} o={(1 - sitzen) * figurO} /> : null}
        {sitzen > 0 ? <Sitzer cx={XM} farbe={ORANGE} glanz={glanzM} o={sitzen} /> : null}
        <Haenger cx={XD} p={pD} farbe={BLAU} glanz={1} o={figurO} />
      </svg>
      {/* Zähler */}
      <Zaehler t={t} x={XM} wert={nM} farbe={ORANGE} label="MOTIVATION" o={zahlenO * ease(t, aMotiv - 0.1, aMotiv + 0.3)} unter="= GEFÜHL" aUnter={aGfl} />
      <Zaehler t={t} x={XD} wert={nD} farbe={BLAU} label="DISZIPLIN" o={zahlenO * ease(t, aDiszi - 0.1, aDiszi + 0.3)} unter="= ENTSCHEIDUNG" aUnter={aEntscheidung} />
      {/* Merksätze unter dem Boden */}
      {[[XM, "= GEFÜHL", ORANGE, aGfl], [XD, "= ENTSCHEIDUNG", BLAU, aEntscheidung]].map(([x, text, farbe, a]) =>
        t >= (a as number) && t < aZaehlt + 0.2 ? (
          <div key={text as string} style={{ position: "absolute", left: x as number, top: 1268, transform: `translateX(-50%) scale(${pop(t, a as number, 210, 12)})`, opacity: 1 - ease(t, aZaehlt - 0.2, aZaehlt + 0.2), fontFamily: HEAD, fontWeight: 900, fontSize: 38, color: "#ffffff", background: rgba(farbe as string, 0.3), border: `3px solid ${farbe}`, borderRadius: 12, padding: "2px 14px", whiteSpace: "nowrap" }}>{text}</div>
        ) : null,
      )}
      {/* Hervorhebungen */}
      {t >= aRakete && t < aLangsam ? (
        <div style={{ position: "absolute", left: XM, top: 1270, transform: `translateX(-50%) scale(${pop(t, aRakete, 220, 12)})`, fontFamily: MONO, fontWeight: 700, fontSize: 30, color: ORANGE, letterSpacing: 3, whiteSpace: "nowrap" }}>VOLLGAS</div>
      ) : null}
      {t >= aBoden && t < aGfl - 0.1 ? (
        <div style={{ position: "absolute", left: XM, top: 1270, transform: `translateX(-50%) scale(${pop(t, aBoden, 210, 12)})`, fontFamily: MONO, fontWeight: 700, fontSize: 30, color: rgba(ORANGE, 0.8), letterSpacing: 3, whiteSpace: "nowrap" }}>AUFGEGEBEN</div>
      ) : null}
      {ueberholt && t >= aGeschafft - 0.2 && t < aEntscheidung - 0.1 ? (
        <div style={{ position: "absolute", left: XD, top: 1270, transform: `translateX(-50%) scale(${pop(t, aGeschafft - 0.2, 210, 12)})`, fontFamily: MONO, fontWeight: 700, fontSize: 30, color: BLAU, letterSpacing: 3, whiteSpace: "nowrap" }}>ÜBERHOLT</div>
      ) : null}
      {/* Schlusssatz oben */}
      {t >= aZaehlt - 0.2 ? (
        <div style={{ position: "absolute", left: 540, top: 262, transform: "translateX(-50%)", textAlign: "center", opacity: ease(t, aZaehlt - 0.2, aZaehlt + 0.2), whiteSpace: "nowrap" }}>
          <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 48, color: rgba("#ffffff", 0.75) }}>Nicht, wie schnell du anfängst.</div>
          {t >= aWeitermachst - 0.6 ? (
            <div style={{ fontFamily: HEAD, fontWeight: 900, fontSize: 70, lineHeight: 1.0, color: BLAU, marginTop: 8, textShadow: `0 0 26px ${rgba(BLAU, 0.6)}`, transform: `scale(${pop(t, aWeitermachst - 0.6, 200, 12)})` }}>Sondern dass du<br />weitermachst.</div>
          ) : null}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

void aWeiter;

void aImmer;

/** Für das Cover: beide Figuren mitten im Zug. */
export const CoverBild: React.FC = () => (
  <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
    <defs>
      <filter id="dm-glow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="7" result="b" />
        <feMerge>
          <feMergeNode in="b" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
    <rect width={1080} height={1920} fill={BG} />
    <line x1={60} y1={BODEN} x2={1020} y2={BODEN} stroke="#1c2433" strokeWidth={4} />
    <Stange cx={XM} />
    <Stange cx={XD} />
    <Sitzer cx={XM} farbe={ORANGE} glanz={0.35} o={1} />
    <Haenger cx={XD} p={0.9} farbe={BLAU} glanz={1} />
  </svg>
);
