// Video „Der Ausbruch – Teil 2“: Henrik steckt fest, Elias kehrt um, alle am Zaun, Elias bleibt hängen.
// Bausteine aus bausteine/ausbruch/teile.tsx. Alle Zeiten über Wortanker.
import React from "react";
import { AbsoluteFill, Audio, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Captions, FPS, HEAD, MONO, THEME, at, ease, lin, makeChunks, pop, rgba, type Voice } from "../../basis/lib";
import {
  Drehlicht, GRAU, Himmel, Hund, KALT, Kriecher, Laeufer, MOND, Mann, NACHT, NameChip, ROT, SIL, Scheinwerfer, SchachtQuer,
  Serie, Status, Stempel, Titel, Vignette, Zaun, kamera, sz,
} from "../../bausteine/ausbruch/teile";
import daten from "./woerter.json";

const V = daten as unknown as Voice;
const WD = V.words;
const CHUNKS = makeChunks(WD);
const Z = (n: number) => V.zeilen[Math.min(n, V.zeilen.length - 1)].s;
const A = (w: string, n: number | { ab: number } = 1) => at(WD, w, n);

export const DAUER = Math.ceil((V.dauer + 2.4) * FPS);

const aSteckt = A("steckt");
const aSirene = A("Sirene");
const aWaerter = A("Wärter");
const aGang = A("Gang");
const aZaun = A("Zaun", 1);
const aElias = A("Elias", 1);
const aStehen = A("stehen");
const aMarco = A("Marco", 1);
const aWir = A("Wir");
const aZeit = A("Zeit");
const aRennt = A("rennt");
const aJacke = A("Jacke");
const aZenti = A("Zentimeter", 1);
const aHunde = A("Hunde");
const aHand = A("Hand");
const aGelenk = A("Handgelenk");
const aElias2 = A("Elias", 2);
const aRuck = A("Ruck");
const aViert = A("viert");
const aJonas = A("Jonas");
const aMarco2 = A("Marco", 2);
const aHenrik3 = A("Henrik", { ab: Z(8) });
const aHaengen = A("hängen");
const aDraht = A("Stacheldraht");
const aFindet = A("findet");
const aTeil = A("Teil");
const aEnde = WD[WD.length - 1].e + 0.4;

const KAMERA = [aSteckt, aSirene, aGang, aStehen, aWir, aZeit, aRennt, aJacke, aZenti, aHunde, aGelenk, aRuck, aViert, aJonas, aMarco2,
  aHenrik3, aDraht, aHaengen, aFindet, aTeil];

// ---- 1 · Henrik steckt fest, Wärter im Gang ----------------------------------------
const Fest: React.FC<{ t: number; o: number; jacke?: boolean; hunde?: boolean; ohneText?: boolean }> = ({ t, o, jacke, hunde, ohneText }) => {
  if (o <= 0) return null;
  const vor = jacke ? interpolate(ease(t, aJacke + 0.4, Z(5)), [0, 1], [0, 70]) : 0;
  const zerr = Math.sin(t * 9) * 5;
  const jackeAb = jacke ? ease(t, aJacke, aJacke + 0.6) : 0;
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920">
        <SchachtQuer eng />
        {/* Wärter laufen oben durch den Gang */}
        {!jacke && t >= aWaerter - 0.3
          ? [0, 1].map((i) => {
              const x = interpolate(t, [aWaerter - 0.3 + i * 0.35, aWaerter + 2.2 + i * 0.35], [-120, 1200]);
              return (
                <g key={i} transform={`translate(${x} 700)`}>
                  {[0, Math.PI].map((ph, j) => {
                    const kk = Math.sin((t - aWaerter) * 9 + i + ph);
                    return <path key={j} d={`M0,-330 L${40 * kk},-150 L${60 * kk},0`} fill="none" stroke="#000" strokeWidth={46} strokeLinecap="round" strokeLinejoin="round" />;
                  })}
                </g>
              );
            })
          : null}
        {/* Hunde im Gang */}
        {hunde && t >= aHunde - 0.2
          ? [0, 1].map((i) => (
              <Hund key={i} x={interpolate(t, [aHunde - 0.2, aHunde + 3], [-200 + i * 140, 420 + i * 140])} y={700} s={1.25} p={(t - aHunde) * 2.6 + i * 0.4} bellen={Math.max(0, Math.sin((t - aHunde) * 7 + i * 2))} />
            ))
          : null}
        {/* abgestreifte Jacke */}
        {jacke && t >= aJacke ? (
          <path d="M380,975 q20,-38 60,-40 q40,4 70,30 q-30,10 -60,10 q-40,8 -70,0 Z" fill="#1b2130" stroke={GRAU} strokeWidth={3} opacity={jackeAb} transform={`translate(${-30 * jackeAb} 0)`} />
        ) : null}
        <Kriecher x={540 + vor + (jacke ? 0 : zerr)} y={975} s={1.15} p={jacke ? (t - aJacke) * 0.6 : 0.25 + Math.sin(t * 6) * 0.06} grau rand={GRAU} armVor={jacke ? 0.4 : 0} />
        {!jacke ? <circle cx={700} cy={895} r={115 * Math.min(1, pop(t, aSteckt, 200, 12))} fill="none" stroke={ROT} strokeWidth={7} opacity={t >= aSteckt ? 1 : 0} /> : null}
      </svg>
      <NameChip t={t} a={jacke ? Z(4) : 0.15} text="HENRIK" x={470} y={1100} farbe={GRAU} />
      {!jacke && !ohneText ? <Stempel t={t} a={aSteckt} text="STECKT FEST" top={430} size={92} /> : null}
      {jacke ? <Titel t={t} a={aZenti} b={Z(5)} text="ZENTIMETER FÜR ZENTIMETER" size={56} /> : null}
      {hunde ? <Titel t={t} a={aHunde} text="HUNDE!" farbe={ROT} size={96} /> : null}
      <Vignette staerke={0.9} />
    </AbsoluteFill>
  );
};

// ---- 2 · Am Zaun: Elias bleibt stehen ------------------------------------------------
const AmZaun: React.FC<{ t: number; o: number }> = ({ t, o }) => {
  if (o <= 0) return null;
  const dreh = t >= aStehen;
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920">
        <Himmel t={t} rot={1} />
        <rect x={0} y={1180} width={1080} height={740} fill="#04060b" />
        <Zaun oben={640} unten={1240} />
        <Mann x={290} y={1250} s={1.9} rand={ROT} />
        <Mann x={500} y={1250} s={1.9} rand={ROT} />
        <Mann x={760} y={1250} s={1.95} rand={dreh ? MOND : ROT} spiegel={dreh} />
      </svg>
      <NameChip t={t} a={aElias} text="ELIAS" x={760} y={760} farbe={MOND} />
      <Titel t={t} a={aStehen} text="ER BLEIBT STEHEN" size={70} />
      <Vignette />
    </AbsoluteFill>
  );
};

// ---- 3 · Marco packt ihn am Arm --------------------------------------------------------
const Packt: React.FC<{ t: number; o: number }> = ({ t, o }) => {
  if (o <= 0) return null;
  const greif = ease(t, aMarco + 0.2, aMarco + 0.7);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920">
        <Himmel t={t} rot={1} />
        <rect x={0} y={1200} width={1080} height={720} fill="#04060b" />
        <Mann x={330} y={1320} s={3.4} rand={ROT} />
        <Mann x={760} y={1320} s={3.4} rand={MOND} spiegel />
        {/* Marcos Arm greift nach Elias */}
        <path d={`M430,850 Q${520 + 60 * greif},${880 - 20 * greif} ${560 + 110 * greif},${900 - 10 * greif}`} fill="none" stroke={ROT} strokeWidth={66} strokeLinecap="round" />
        <path d={`M430,850 Q${520 + 60 * greif},${880 - 20 * greif} ${560 + 110 * greif},${900 - 10 * greif}`} fill="none" stroke={SIL} strokeWidth={56} strokeLinecap="round" />
      </svg>
      <NameChip t={t} a={aMarco} text="MARCO" x={330} y={540} farbe={ROT} />
      {t >= aWir ? (
        <div style={{ position: "absolute", left: 540, top: 330, transform: `translateX(-50%) scale(${pop(t, aWir, 220, 12)}) rotate(-2deg)`, background: "#ffffff", color: NACHT, fontFamily: HEAD, fontWeight: 900, fontSize: 66, padding: "18px 36px", borderRadius: 26, whiteSpace: "nowrap", boxShadow: `0 0 30px ${rgba(ROT, 0.6)}` }}>
          „WIR HABEN KEINE ZEIT!“
        </div>
      ) : null}
      <Vignette />
    </AbsoluteFill>
  );
};

// ---- 4 · Elias rennt zurück -------------------------------------------------------------
const Zurueck: React.FC<{ t: number; o: number }> = ({ t, o }) => {
  if (o <= 0) return null;
  const tt = t - Z(3);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920">
        <Himmel t={t} mond={[880, 420]} rot={1} />
        {/* Gefängnisblock links */}
        <rect x={0} y={720} width={420} height={520} fill="#0b111d" stroke="#24324f" strokeWidth={4} />
        {Array.from({ length: 3 }, (_, r) => Array.from({ length: 4 }, (_, c) => (
          <rect key={`${r}${c}`} x={36 + c * 96} y={770 + r * 110} width={40} height={50} fill={(r + c + Math.floor(t * 1.2)) % 3 === 0 ? rgba(ROT, 0.7) : "#05080f"} />
        )))}
        <rect x={0} y={1240} width={1080} height={680} fill="#04060b" />
        <g transform={`translate(1080 260) rotate(${130 + Math.sin(tt * 2) * 18})`}>
          <polygon points="0,-6 1300,-200 1300,200 0,6" fill={rgba(ROT, 0.2)} />
        </g>
        <Laeufer x={980 - tt * 260} y={1250} s={1.9} p={tt * 2.6} richtung={-1} rand={MOND} />
      </svg>
      <Titel t={t} a={aRennt} text="ZURÜCK REIN" size={84} farbe={MOND} />
      <Vignette />
    </AbsoluteFill>
  );
};

// ---- 5 · Eine Hand packt das Handgelenk --------------------------------------------------
const Griff: React.FC<{ t: number; o: number }> = ({ t, o }) => {
  if (o <= 0) return null;
  const rein = ease(t, aHand - 0.2, aHand + 0.4);
  const zu = ease(t, aGelenk, aGelenk + 0.3);
  const ex = interpolate(rein, [0, 1], [1250, 640]);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920">
        <rect width={1080} height={1920} fill={NACHT} />
        <rect x={0} y={640} width={1080} height={420} fill="#000" />
        <line x1={0} y1={640} x2={1080} y2={640} stroke={rgba(KALT, 0.5)} strokeWidth={4} />
        <line x1={0} y1={1060} x2={1080} y2={1060} stroke={rgba(KALT, 0.5)} strokeWidth={4} />
        {/* Henriks Arm von links */}
        <rect x={-40} y={815} width={600} height={90} rx={45} fill="#0d0f14" stroke={GRAU} strokeWidth={4} />
        <rect x={520} y={792} width={120} height={136} rx={46} fill="#0d0f14" stroke={GRAU} strokeWidth={4} />
        {/* Elias' Hand von rechts */}
        <g transform={`translate(${ex} 0)`}>
          <rect x={60} y={805} width={700} height={110} rx={55} fill={SIL} stroke={KALT} strokeWidth={4} />
          <rect x={-80} y={770} width={170} height={180} rx={60} fill={SIL} stroke={KALT} strokeWidth={4} />
          {[0, 1, 2, 3].map((i) => (
            <rect key={i} x={-130 + 20 * zu} y={782 + i * 40} width={90 + 40 * zu} height={32} rx={16} fill={SIL} stroke={KALT} strokeWidth={3} />
          ))}
        </g>
      </svg>
      <Titel t={t} a={aGelenk} text="EINE HAND" size={84} />
      <Vignette staerke={0.92} />
    </AbsoluteFill>
  );
};

// ---- 6 · Elias zieht ihn heraus ------------------------------------------------------------
const Raus: React.FC<{ t: number; o: number }> = ({ t, o }) => {
  if (o <= 0) return null;
  const ruck = ease(t, aRuck, aRuck + 0.4);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920">
        <Himmel t={t} mond={[900, 420]} rot={1} />
        <rect x={0} y={560} width={560} height={760} fill="#1a2233" />
        <rect x={0} y={860} width={560} height={150} fill="#000" />
        <line x1={0} y1={860} x2={560} y2={860} stroke={rgba(KALT, 0.6)} strokeWidth={4} />
        <line x1={0} y1={1010} x2={560} y2={1010} stroke={rgba(KALT, 0.6)} strokeWidth={4} />
        <rect x={0} y={1240} width={1080} height={680} fill="#04060b" />
        <Mann x={880} y={1250} s={2.0} rand={MOND} spiegel arme={0.25} dreh={-6} />
        <Kriecher x={interpolate(ruck, [0, 1], [380, 700])} y={interpolate(ruck, [0, 1], [990, 1240])} s={1.2} p={0.25} grau rand={GRAU} armVor={1} />
      </svg>
      <NameChip t={t} a={aElias2} text="ELIAS" x={880} y={760} farbe={MOND} />
      <Stempel t={t} a={aRuck + 0.2} text="RAUS!" farbe={MOND} size={110} top={420} />
      <Vignette />
    </AbsoluteFill>
  );
};

// ---- 7 · Zu viert über den Zaun, Elias bleibt hängen, Scheinwerfer --------------------------
const KLETTERER = [
  { a: aJonas, x: 280, name: "JONAS", rand: ROT },
  { a: aMarco2, x: 470, name: "MARCO", rand: ROT },
  { a: aHenrik3, x: 660, name: "HENRIK", rand: GRAU },
];
const ZaunFinale: React.FC<{ t: number; o: number }> = ({ t, o }) => {
  if (o <= 0) return null;
  const ankunft = ease(t, Z(8) - 0.1, aViert + 0.9);
  const elias = ease(t, Z(9) - 0.4, Z(9) + 0.6);
  const licht = t >= aFindet - 0.6 ? ease(t, aFindet - 0.6, aFindet + 0.2) : 0;
  const lx = interpolate(licht, [0, 1], [180, 860]);
  const ly = interpolate(licht, [0, 1], [1150, 600]);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920">
        <Himmel t={t} rot={1} />
        <rect x={0} y={1180} width={1080} height={740} fill="#04060b" />
        <Zaun oben={640} unten={1240} />
        {KLETTERER.map((k, i) => {
          if (t < k.a - 0.1) {
            return <Mann key={i} x={interpolate(ankunft, [0, 1], [-200 - i * 140, k.x])} y={1250} s={1.7} rand={k.rand} o={ankunft > 0 ? 1 : 0} />;
          }
          const hoch = ease(t, k.a - 0.1, k.a + 0.9);
          const weg = ease(t, k.a + 0.9, k.a + 1.3);
          return <Mann key={i} x={k.x} y={interpolate(hoch, [0, 1], [1250, 720]) - 60 * weg} s={1.7 * (1 - 0.15 * weg)} rand={k.rand} arme={1} o={1 - weg} />;
        })}
        {/* Elias: wartet unten, klettert, bleibt oben im Draht hängen */}
        <Mann x={interpolate(ankunft, [0, 1], [-400, 860])} y={interpolate(elias, [0, 1], [1250, 760])} s={1.75} rand={MOND} arme={elias > 0 ? 1 : 0} dreh={elias * -6 + Math.sin(t * 7) * 3 * elias} />
        {elias > 0 ? (
          <g opacity={elias}>
            {[0, 1, 2].map((i) => <path key={i} d={`M${770 + i * 10},${590 + i * 26} q60,-30 180,20`} fill="none" stroke="#9aa6c0" strokeWidth={5} />)}
          </g>
        ) : null}
        {t >= aHaengen ? <circle cx={860} cy={570} r={140 * Math.min(1, pop(t, aHaengen, 200, 12))} fill="none" stroke={ROT} strokeWidth={7} /> : null}
        {licht > 0 ? <Scheinwerfer x0={1040} y0={240} x1={lx} y1={ly} o={licht} breite={170} /> : null}
      </svg>
      {KLETTERER.map((k) => <NameChip key={k.name} t={t} a={k.a} b={k.a + 1.1} text={k.name} x={k.x} y={1120} farbe={k.rand === GRAU ? GRAU : ROT} />)}
      {t >= aHaengen ? <Stempel t={t} a={aHaengen} text="BLEIBT HÄNGEN" size={84} top={1000} /> : null}
      {licht > 0 ? <AbsoluteFill style={{ background: `radial-gradient(circle at ${lx}px ${ly}px, ${rgba(MOND, 0.55 * licht)} 0%, ${rgba(MOND, 0)} 34%)` }} /> : null}
      <Vignette staerke={0.8} />
    </AbsoluteFill>
  );
};

const EndeText: React.FC<{ t: number }> = ({ t }) => {
  if (t < aTeil) return null;
  const p = pop(t, aTeil, 210, 12);
  return (
    <div style={{ position: "absolute", left: 540, top: 1580, transform: `translate(-50%,-50%) scale(${p})`, display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
      <div style={{ fontFamily: HEAD, fontWeight: 900, fontSize: 84, color: NACHT, background: ROT, padding: "6px 34px 12px", borderRadius: 16, whiteSpace: "nowrap", boxShadow: `0 0 34px ${rgba(ROT, 0.7)}` }}>TEIL 3 FOLGT</div>
      <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 32, letterSpacing: 3, color: MOND, opacity: ease(t, aTeil + 0.3, aTeil + 0.6) }}>Folgen · {THEME.kanal.handle}</div>
    </div>
  );
};

export const Video: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  const k = kamera(t, KAMERA);
  return (
    <AbsoluteFill style={{ background: NACHT, overflow: "hidden" }}>
      <Audio src={staticFile(V.audio)} />
      <AbsoluteFill style={{ transform: `scale(${k})`, transformOrigin: "540px 780px" }}>
        <Fest t={t} o={sz(t, 0, Z(1))} />
        <AmZaun t={t} o={sz(t, Z(1), Z(2))} />
        <Packt t={t} o={sz(t, Z(2), Z(3))} />
        <Zurueck t={t} o={sz(t, Z(3), Z(4))} />
        <Fest t={t} o={sz(t, Z(4), Z(5))} jacke />
        <Fest t={t} o={sz(t, Z(5), Z(6))} jacke hunde />
        <Griff t={t} o={sz(t, Z(6), Z(7))} />
        <Raus t={t} o={sz(t, Z(7), Z(8))} />
        <ZaunFinale t={t} o={sz(t, Z(8), 999)} />
      </AbsoluteFill>
      <Drehlicht t={t} a={0} staerke={0.7} />
      <Status t={t} a={0} zeile="SIRENE" text="ALARM" />
      <EndeText t={t} />
      {t < aEnde ? <Captions t={t} chunks={CHUNKS} dark /> : null}
      <Serie teil="Teil 2" o={ease(t, 0.3, 0.8)} />
    </AbsoluteFill>
  );
};

/** Für das Cover: Henrik steckt im Schacht fest. */
export const CoverBild: React.FC = () => <Fest t={aSteckt + 1.2} o={1} ohneText />;

void lin;
void aZaun;
void aZeit;
void aSirene;
void aGang;
