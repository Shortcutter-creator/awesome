// Video „Was passiert, wenn die Sonne 8 Minuten verschwindet?“ – Gedankenexperiment, Skript des Nutzers (zwei Wörter präzisiert).
// Simulierte Zeit: 0:00 Sonne weg · 8:00 Sonne zurück · 8:20 bei uns dunkel · 16:20 bei uns wieder hell. Kein Outro.
import React from "react";
import { AbsoluteFill, Audio, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Captions, FPS, HEAD, MONO, at, clamp, ease, makeChunks, pop, rgba, type Voice } from "../../basis/lib";
import { ALL, BLAU, CREME, Erde, Mond, SONNE, Sonne, Sterne, Stadt, Thermometer, Uhr, Voegel, kamera, sz } from "../../bausteine/weltall/teile";
import daten from "./woerter.json";

const V = daten as unknown as Voice;
const WD = V.words;
const CHUNKS = makeChunks(WD);
const Z = (n: number) => V.zeilen[Math.min(n, V.zeilen.length - 1)].s;
const A = (w: string, n: number | { ab: number } = 1) => at(WD, w, n);

export const DAUER = Math.ceil((V.dauer + 2.8) * FPS);

const aVerschwunden = A("verschwunden");
const aMerkst = A("merkst");
const aAcht = A("acht", 1);
const aScheint = A("scheint");
const aSchwerkraft = A("Schwerkraft");
const aKreist = A("kreist");
const aDunkel = A("dunkel", 1);
const aMitten = A("Mitten");
const aNacht = A("Nacht");
const aMond = A("Mond");
const aSterne = A("Sterne");
const aVerstummen = A("verstummen");
const aKuehl = A("kühler");
const aHalt = A("Halt");
const aGeradeaus = A("geradeaus");
const aAcht2 = A("acht", 2);
const a700 = A("700");
const aHell = A("hell");
const aVerrueckt = A("Verrückte");
const aDunkel2 = A("dunkel", 2);
const aSchon = A("schon");

const KAMERA = [aVerschwunden, aMerkst, aAcht, aScheint, aSchwerkraft, aKreist, aDunkel, aNacht, aMond, aSterne, aVerstummen, aKuehl, aHalt, aGeradeaus, aAcht2, a700, aHell, aVerrueckt, aDunkel2, aSchon];

// Simulierte Sekunden seit dem Verschwinden der Sonne
const T0 = aVerschwunden;
const sim = (t: number) =>
  t < T0 ? 0 : t < aDunkel ? interpolate(t, [T0, aDunkel], [0, 500], clamp) : t < aHell ? interpolate(t, [aDunkel, aHell], [500, 980], clamp) : 980;

// Raum-Ansicht: Sonne oben links, Erde unten rechts
const SX = 260, SY = 560, ER_X = 790, ER_Y = 1130;
const D = Math.hypot(ER_X - SX, ER_Y - SY);
const RICHTUNG = (Math.atan2(SY - ER_Y, SX - ER_X) * 180) / Math.PI;

const Raum: React.FC<{ t: number; o: number; zurueck?: boolean }> = ({ t, o, zurueck }) => {
  if (o <= 0) return null;
  const s = sim(t);
  const weg = ease(t, T0 - 0.05, T0 + 0.4); // Sonne erlischt
  const sonneAn = zurueck ? 1 : 1 - weg;
  const front = Math.min(1, s / 500); // letzte Lichtfront (und Schwerkraft)
  const R = D * front;
  const erdeHell = zurueck ? ease(t, aHell - 0.1, aHell + 0.3) : t < aDunkel ? 1 : 1 - ease(t, aDunkel - 0.05, aDunkel + 0.25);
  const grav = t >= aSchwerkraft - 0.2 ? ease(t, aSchwerkraft - 0.2, aSchwerkraft + 0.3) : 0;
  // Erde wandert langsam auf der Bahn
  const w0 = Math.atan2(ER_Y - SY, ER_X - SX);
  const w = w0 + (zurueck ? 0 : Math.min(t, aDunkel) - T0) * 0.004;
  const ex = SX + Math.cos(w) * D, ey = SY + Math.sin(w) * D;
  const ux = (ex - SX) / D, uy = (ey - SY) / D;
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <rect width={1080} height={1920} fill={ALL} />
        <Sterne t={t} />
        {/* Umlaufbahn */}
        <circle cx={SX} cy={SY} r={D} fill="none" stroke={rgba("#9fb8e6", 0.22)} strokeWidth={3} strokeDasharray="10 12" />
        {/* Restlicht zwischen Front und Erde */}
        {!zurueck && t >= T0 && front < 1 ? (
          <line x1={SX + ux * R} y1={SY + uy * R} x2={ex - ux * 95} y2={ey - uy * 95} stroke={SONNE} strokeWidth={14} strokeLinecap="round" opacity={0.55} />
        ) : null}
        {!zurueck && t < T0 + 0.1 ? <line x1={SX + ux * 100} y1={SY + uy * 100} x2={ex - ux * 95} y2={ey - uy * 95} stroke={SONNE} strokeWidth={14} strokeLinecap="round" opacity={0.55} /> : null}
        {/* Front: Licht (gelb) und Schwerkraft (blau gestrichelt) */}
        {!zurueck && t >= T0 && front < 1 ? (
          <>
            <circle cx={SX} cy={SY} r={R} fill="none" stroke={rgba(SONNE, 0.5)} strokeWidth={6} />
            {grav > 0 ? <circle cx={SX} cy={SY} r={R + 6} fill="none" stroke={rgba(BLAU, 0.8 * grav)} strokeWidth={6} strokeDasharray="18 14" /> : null}
          </>
        ) : null}
        {/* zurückkehrendes Licht */}
        {zurueck ? <line x1={SX + ux * 100} y1={SY + uy * 100} x2={ex - ux * 95} y2={ey - uy * 95} stroke={SONNE} strokeWidth={14} strokeLinecap="round" opacity={0.55 * ease(t, aHell - 0.6, aHell)} /> : null}
        <Sonne x={SX} y={SY} r={90} an={sonneAn} t={t} />
        <Erde x={ex} y={ey} r={95} licht={erdeHell} richtung={RICHTUNG} t={t} id="raum" />
      </svg>
      {t >= aAcht - 0.1 && t < aSchwerkraft - 0.2 ? (
        <div style={{ position: "absolute", left: 540, top: 1260, transform: `translateX(-50%) scale(${pop(t, aAcht - 0.1, 210, 12)})`, fontFamily: HEAD, fontWeight: 900, fontSize: 60, color: SONNE, whiteSpace: "nowrap" }}>Licht: 8 min 20 s</div>
      ) : null}
      {t >= aSchwerkraft - 0.2 && t < aDunkel ? (
        <div style={{ position: "absolute", left: 540, top: 1238, transform: `translateX(-50%) scale(${pop(t, aSchwerkraft - 0.2, 210, 12)})`, textAlign: "center", whiteSpace: "nowrap" }}>
          <div style={{ fontFamily: HEAD, fontWeight: 900, fontSize: 50, lineHeight: 1.05, color: BLAU }}>Schwerkraft:<br />so schnell wie Licht</div>
        </div>
      ) : null}
      {!zurueck && t >= aDunkel - 0.05 ? (
        <AbsoluteFill style={{ background: "#000000", opacity: 0.55 * ease(t, aDunkel - 0.05, aDunkel + 0.2) }} />
      ) : null}
      {zurueck && t >= aHell - 0.1 ? (
        <AbsoluteFill style={{ background: `radial-gradient(circle at ${ex}px ${ey}px, ${rgba("#fff6d6", 0.95)} 0%, ${rgba(SONNE, 0.5)} 35%, ${rgba(SONNE, 0)} 80%)`, opacity: 1 - ease(t, aHell + 0.1, aHell + 1.2) }} />
      ) : null}
    </AbsoluteFill>
  );
};

// ---- Stadt: mitten am Tag wird es Nacht ---------------------------------------------------------------
const Nacht: React.FC<{ t: number; o: number }> = ({ t, o }) => {
  if (o <= 0) return null;
  const nacht = ease(t, aMitten - 0.2, aNacht + 0.4);
  const sterne = t >= aSterne - 0.2 ? ease(t, aSterne - 0.2, aSterne + 0.8) : 0;
  const mond = t >= aMond ? 1 - ease(t, aMond, aMond + 0.8) : 1;
  const singen = t < aVerstummen ? 1 : 1 - ease(t, aVerstummen, aVerstummen + 0.3);
  const stand = t >= aKuehl - 0.3 ? interpolate(ease(t, aKuehl - 0.3, aKuehl + 1.0), [0, 1], [0.72, 0.42]) : 0.72;
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <Stadt t={t} nacht={nacht} sterne={sterne} />
        {nacht < 0.95 ? <circle cx={780} cy={430} r={70} fill={SONNE} opacity={1 - nacht} /> : null}
        <Mond x={300} y={470} r={46} licht={mond * (0.35 + 0.65 * nacht)} />
        <Voegel t={t} singen={singen} nacht={nacht} />
        {t >= aKuehl - 0.4 ? <g opacity={ease(t, aKuehl - 0.4, aKuehl)}><Thermometer x={900} y={760} stand={stand} /></g> : null}
      </svg>
      {t >= aMond ? <div style={{ position: "absolute", left: 300, top: 540, transform: `translateX(-50%) scale(${pop(t, aMond, 210, 12)})`, fontFamily: MONO, fontWeight: 700, fontSize: 26, letterSpacing: 2, color: rgba(CREME, 0.8), whiteSpace: "nowrap" }}>Mond: kein Licht mehr</div> : null}
      {t >= aVerstummen ? <div style={{ position: "absolute", left: 490, top: 880, transform: `translateX(-50%) scale(${pop(t, aVerstummen, 210, 12)})`, fontFamily: HEAD, fontWeight: 900, fontSize: 44, color: CREME, whiteSpace: "nowrap" }}>Stille</div> : null}
    </AbsoluteFill>
  );
};

// ---- Erde fliegt geradeaus -----------------------------------------------------------------------------
const OX = 540, OY = -600, OR = 1500;
const bahnY = (x: number) => OY + Math.sqrt(OR * OR - (x - OX) ** 2);
const Geradeaus: React.FC<{ t: number; o: number }> = ({ t, o }) => {
  if (o <= 0) return null;
  const lauf = ease(t, Z(9) - 0.2, Z(11) + 1.0);
  const xStart = 230;
  const xHalt = 400;
  // bis „Halt“ auf der Bahn, danach geradeaus auf der Tangente
  const k = lin(t, Z(9) - 0.2, aHalt);
  const xa = interpolate(k, [0, 1], [xStart, xHalt]);
  const tx = xHalt, ty = bahnY(xHalt);
  const steig = -(tx - OX) / Math.sqrt(OR * OR - (tx - OX) ** 2); // dy/dx der Bahn
  const nachHalt = t >= aHalt ? interpolate(t, [aHalt, Z(12)], [0, 440], clamp) : 0;
  const ex = t < aHalt ? xa : tx + nachHalt;
  const ey = t < aHalt ? bahnY(xa) : ty + steig * nachHalt;
  const gx = tx + nachHalt, gy = bahnY(tx + nachHalt);
  void lauf;
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <rect width={1080} height={1920} fill={ALL} />
        <Sterne t={t} />
        <path d={Array.from({ length: 50 }, (_, i) => { const x = 60 + i * 20; return `${i ? "L" : "M"}${x},${bahnY(x)}`; }).join(" ")} fill="none" stroke={rgba("#9fb8e6", 0.45)} strokeWidth={4} strokeDasharray="12 10" />
        {t >= aHalt ? <line x1={tx} y1={ty} x2={tx + 600} y2={ty + steig * 600} stroke={rgba(BLAU, 0.8)} strokeWidth={4} /> : null}
        {t >= aHalt ? <circle cx={gx} cy={gy} r={60} fill="none" stroke={rgba("#9fb8e6", 0.5)} strokeWidth={3} strokeDasharray="6 6" /> : null}
        <Erde x={ex} y={ey} r={60} licht={0.15} richtung={-90} t={t} id="bahn" />
        <text x={OX} y={470} textAnchor="middle" fill={rgba(SONNE, 0.6)} fontFamily={MONO} fontWeight={700} fontSize={26}>↑ zur (unsichtbaren) Sonne</text>
      </svg>
      {t >= aGeradeaus - 0.1 ? (
        <div style={{ position: "absolute", left: 540, top: 1060, transform: `translateX(-50%) scale(${pop(t, aGeradeaus - 0.1, 210, 12)})`, fontFamily: HEAD, fontWeight: 900, fontSize: 56, color: CREME, whiteSpace: "nowrap" }}>geradeaus statt im Kreis</div>
      ) : null}
      {t >= aAcht2 - 0.1 ? (
        <div style={{ position: "absolute", left: 540, top: 1150, transform: `translateX(-50%) scale(${pop(t, aAcht2 - 0.1, 210, 12)})`, fontFamily: MONO, fontWeight: 700, fontSize: 32, color: rgba(CREME, 0.8), whiteSpace: "nowrap" }}>nur 8 Minuten · Bild stark übertrieben</div>
      ) : null}
      {t >= a700 - 0.1 ? (
        <div style={{ position: "absolute", left: 540, top: 1230, transform: `translateX(-50%) scale(${pop(t, a700 - 0.1, 220, 11)})`, textAlign: "center", background: rgba("#000000", 0.6), border: `4px solid ${BLAU}`, borderRadius: 18, padding: "8px 26px 10px", whiteSpace: "nowrap" }}>
          <div style={{ fontFamily: HEAD, fontWeight: 900, fontSize: 64, color: BLAU }}>≈ 700 m</div>
          <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 24, color: rgba(CREME, 0.8) }}>bei 150 Mio. km Abstand zur Sonne</div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
const lin = (t: number, a: number, b: number) => interpolate(t, [a, b], [0, 1], clamp);

// ---- Pointe: Zeitleiste --------------------------------------------------------------------------------
const Pointe: React.FC<{ t: number; o: number }> = ({ t, o }) => {
  if (o <= 0) return null;
  const X0 = 170, X1 = 850, MAX = 17 * 60;
  const xs = (sek: number) => X0 + (sek / MAX) * (X1 - X0);
  const zeichne = ease(t, Z(14) - 0.2, Z(14) + 0.8);
  const marker = t >= aDunkel2 - 0.1 ? ease(t, aDunkel2 - 0.1, aDunkel2 + 0.3) : 0;
  const reihe = (y: number, titel: string, segs: [number, number, string][]) => (
    <g>
      <text x={X0} y={y - 18} fill={CREME} fontFamily={MONO} fontWeight={700} fontSize={36}>{titel}</text>
      {segs.map(([a, b, f], i) => <rect key={i} x={xs(a)} y={y} width={Math.max(0, (xs(b) - xs(a)) * zeichne)} height={72} fill={f} rx={8} />)}
    </g>
  );
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <rect width={1080} height={1920} fill={ALL} />
        <Sterne t={t} />
        <Sonne x={300} y={560} r={80} an={1} t={t} />
        <Erde x={760} y={620} r={80} licht={0} richtung={180} t={t} id="pointe" />
        {reihe(930, "SONNE", [[0, 480, "#2a2f3d"], [480, MAX, SONNE]])}
        {reihe(1080, "BEI UNS", [[0, 500, "#7cc3ff"], [500, 980, "#0b1122"], [980, MAX, "#7cc3ff"]])}
        <rect x={xs(500)} y={1080} width={(xs(980) - xs(500)) * zeichne} height={72} fill="none" stroke={rgba("#9fb8e6", 0.5)} strokeWidth={2} />
        {[0, 480, 500, 980].map((s) => (
          <text key={s} x={xs(s) + (s === 480 ? -34 : s === 500 ? 34 : 0)} y={s === 480 ? 1032 : 1192} textAnchor="middle" fill={rgba(CREME, s === 480 || s === 500 ? 0.95 : 0.6)} fontFamily={MONO} fontWeight={700} fontSize={30} opacity={zeichne}>
            {`${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`}
          </text>
        ))}
        {marker > 0 ? <line x1={xs(500)} y1={880} x2={xs(500)} y2={1170} stroke="#ff5a5a" strokeWidth={5} opacity={marker} /> : null}
      </svg>
      {t >= aSchon - 0.1 ? (
        <div style={{ position: "absolute", left: 540, top: 1225, transform: `translateX(-50%) scale(${pop(t, aSchon - 0.1, 210, 12)})`, textAlign: "center", background: rgba("#000000", 0.6), border: "4px solid #ff5a5a", borderRadius: 18, padding: "8px 24px 10px", whiteSpace: "nowrap" }}>
          <div style={{ fontFamily: HEAD, fontWeight: 900, fontSize: 44, color: CREME }}>8:20 dunkel – Sonne seit 20 s zurück</div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

export const Video: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  const k = kamera(t, KAMERA);
  const uhrO = t < T0 ? 0 : Math.min(ease(t, T0, T0 + 0.3), 1 - ease(t, Z(14) - 0.3, Z(14)));
  return (
    <AbsoluteFill style={{ background: ALL, overflow: "hidden" }}>
      <Audio src={staticFile(V.audio)} />
      <AbsoluteFill style={{ transform: `scale(${k})`, transformOrigin: "540px 840px" }}>
        <Raum t={t} o={sz(t, 0, Z(6))} />
        <Nacht t={t} o={sz(t, Z(6), Z(9))} />
        <Geradeaus t={t} o={sz(t, Z(9), Z(12))} />
        <Raum t={t} o={sz(t, Z(12), Z(14))} zurueck />
        <Pointe t={t} o={sz(t, Z(14), 999)} />
      </AbsoluteFill>
      <Uhr sekunden={sim(t)} o={uhrO} titel="SEIT DIE SONNE VERSCHWAND" />
      <div style={{ position: "absolute", top: 190, right: 96, fontFamily: MONO, fontSize: 26, letterSpacing: 3, color: rgba(CREME, 0.6), textTransform: "uppercase" }}>Gedankenexperiment</div>
      <Captions t={t} chunks={CHUNKS} dark />
    </AbsoluteFill>
  );
};

/** Für das Cover: Sonne weg (Umriss), Erde noch hell. */
export const CoverBild: React.FC = () => (
  <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
    <rect width={1080} height={1920} fill={ALL} />
    <Sterne t={0} />
    <circle cx={SX} cy={SY + 300} r={D} fill="none" stroke={rgba("#9fb8e6", 0.22)} strokeWidth={3} strokeDasharray="10 12" />
    <Sonne x={SX} y={SY + 300} r={90} an={0} t={0} />
    <line x1={SX + 120} y1={SY + 430} x2={ER_X - 80} y2={ER_Y + 190} stroke={SONNE} strokeWidth={14} strokeLinecap="round" opacity={0.55} />
    <Erde x={ER_X} y={ER_Y + 280} r={95} licht={1} richtung={RICHTUNG} t={0} id="cover" />
  </svg>
);
