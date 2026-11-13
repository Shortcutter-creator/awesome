// Video „Rückwärtsgang bei 100“: Was passiert, wenn man auf der Autobahn den Rückwärtsgang einlegt?
// Ohne Outro: Das Video endet mit der Auflösung (Hook-Bild mit Erkenntnis), keine Endkarte, kein Folgen-Aufruf.
import React from "react";
import { AbsoluteFill, Audio, interpolate, staticFile, useCurrentFrame } from "remotion";
import {
  C, Captions, Card, Chip, FPS, HEAD, Header, MONO, SourceCard, Stage, Stamp, Wechsel,
  at, ease, lin, makeChunks, mech, pop, rgba, type Voice,
} from "../../basis/lib";
import { Antrieb, Funken, Kulisse, PickupOben, Qualm, Rueckfahrkamera, Tacho, Waehlhebel, Warnleuchte, Zahnrad } from "../../bausteine/auto/teile";
import daten from "./woerter.json";

const V = daten as unknown as Voice;
const WD = V.words;
const CHUNKS = makeChunks(WD);
const Z = (n: number) => V.zeilen[Math.min(n, V.zeilen.length - 1)].s;
const A = (w: string, n: number | { ab: number } = 1) => at(WD, w, n);

// kein Abspann: nach dem letzten Wort nur kurz stehen lassen
export const DAUER = Math.ceil((V.dauer + 1.6) * FPS);

// ---- Anker -----------------------------------------------------------------------
const aR = A("R", 1);
const aMotor = A("Motor", 1);
const aKaputt = A("kaputt");
const aNichts = A("nichts");
const aFord = A("Ford");
const a113 = A("113");
const aKamera = A("Rückfahrkamera");
const aSchutz = A("Schutz");
const aLeerlauf = A("Leerlauf");
const aSchalt = A("Schaltgetriebe");
const aSperre = A("Sperre");
const aSpannend = A("spannend");
const aZahnrad = A("Zahnrad", 1);
const aRichtung = A("Drehrichtung");
const aSynchron = A("synchronisiert");
const aHinein = A("hineingeschoben");
const aStill = A("stillstehen");
const aTempo = A("Tempo");
const aZaehne = A("Zähne");
const aKrachen = A("krachen");
const aYoutuber = A("Youtuber");
const aHaenden = A("Händen");
const aHinter = A("Hinterräder");
const aHeck = A("Heck");
const aMotor2 = A("Motor", 2);
const aKupplung = A("Kupplung");
const aGefahr = A("Gefährlich");
const aRaeder = A("Räder");
const aSchaden = A("Schaden");
const aAnleitung = A("Bedienungsanleitungen");
const aStillstand = A("Stillstand");
const aHeil = A("heil");
const aKontrolle = A("Kontrolle");

const MECH_REIN = Z(7);
const MECH_RAUS = Z(16);

/** Szene sichtbar zwischen a und b. */
const sz = (t: number, a: number, b: number) =>
  t < a - 0.25 || t > b + 0.25 ? 0 : Math.min(a <= 0 ? 1 : ease(t, a - 0.2, a + 0.1), 1 - ease(t, b - 0.05, b + 0.25));

// ---- Kamera: kurze Fahrten auf Schlüsselwörter (BAUKASTEN § 6) + Rütteln beim Krachen -------------
const KAMERA = [aR, aKaputt, aNichts, A("Automatik"), a113, A("getestet"), aKamera, aLeerlauf, aSperre, aRichtung, aHinein, aStill, aKrachen, aHaenden, aHinter, aHeck,
  aKupplung, aRaeder, aSchaden, aStillstand, aHeil, aKontrolle].sort((a, b) => a - b);
const kamera = (t: number) => {
  const k = KAMERA.filter((a) => t >= a).length;
  const z = (i: number) => 1 + 0.06 * (i % 2);
  return k === 0 ? 1 : z(k - 1) + (z(k) - z(k - 1)) * ease(t, KAMERA[k - 1], KAMERA[k - 1] + 0.35);
};
const ruetteln = (t: number, a: number, dauer = 0.7) => {
  if (t < a || t > a + dauer) return [0, 0];
  const s = 14 * (1 - (t - a) / dauer);
  return [Math.sin(t * 97) * s, Math.cos(t * 83) * s];
};

// ---- Fahrtwind: Streifen, die durchs Bild schießen (Geschwindigkeits-Effekt) ---------------------
const Fahrtwind: React.FC<{ t: number; staerke: number; dunkel?: boolean }> = ({ t, staerke, dunkel }) => {
  if (staerke <= 0) return null;
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
      {Array.from({ length: 22 }, (_, i) => {
        const y = 270 + ((i * 89) % 1030);
        const v = 1600 + (i % 5) * 300;
        const x = 1300 - (((t * v) + i * 397) % 1900);
        const l = 120 + (i % 4) * 80;
        return <line key={i} x1={x} y1={y} x2={x + l} y2={y} stroke={dunkel ? rgba(C.glow, 0.35) : rgba(C.ink, 0.12)} strokeWidth={4 + (i % 3) * 2} strokeLinecap="round" opacity={staerke} />;
      })}
    </svg>
  );
};

// ---- Hook-Bild: Tacho + Schaltkulisse (kehrt am Ende zurück) --------------------------------------
const HookBild: React.FC<{ t: number; ende?: boolean }> = ({ t, ende }) => {
  const wert = ende ? 100 : interpolate(ease(t, 0, 0.9), [0, 1], [0, 100]) + Math.sin(t * 9) * 0.6;
  const k = ende ? 1 : ease(t, aR - 0.6, aR);
  const rot = ende ? 1 : t >= aR ? 1 : 0;
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
      <Tacho cx={540} cy={570} r={250} wert={wert} glanz={rot && !ende ? 1 - ease(t, aR, aR + 0.8) : 0} />
      <Kulisse cx={540} cy={1115} w={420} von="5" nach="R" k={k} rot={rot} />
    </svg>
  );
};

// ---- Szene: Motor kaputt? ------------------------------------------------------------------------
const MotorFrage: React.FC<{ t: number; o: number }> = ({ t, o }) => {
  if (o <= 0) return null;
  const blink = t >= aMotor ? (Math.floor((t - aMotor) * 2.5) % 2 === 0 ? 1 : 0.25) : 0;
  const zittern = t > V.zeilen[1].e ? Math.sin(t * 60) * 4 : 0;
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <rect x={140} y={360} width={800} height={600} rx={60} fill="#1b1f27" />
        <g transform={`translate(${zittern} 0)`}>
          <Warnleuchte x={540} y={640} size={460} an={blink} />
        </g>
      </svg>
      {t >= aKaputt ? (
        <div style={{ position: "absolute", left: 540, top: 1040, transform: `translateX(-50%) scale(${pop(t, aKaputt, 220, 11)})`, fontFamily: HEAD, fontWeight: 900, fontSize: 112, color: C.ink, whiteSpace: "nowrap" }}>
          MOTOR <span style={{ color: C.red }}>KAPUTT?</span>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ---- Szene: Automatik – fast nichts, Test 113 km/h, Rückfahrkamera, Leerlauf ------------------------
const Automatik: React.FC<{ t: number; o: number }> = ({ t, o }) => {
  if (o <= 0) return null;
  const pNichts = pop(t, aNichts, 210, 12);
  const wert = t < a113 ? 100 : interpolate(ease(t, a113, a113 + 0.8), [0, 1], [100, 113]);
  const zeigeKamera = t >= aKamera - 0.1 && t < Z(5) + 0.1;
  const pKam = pop(t, aKamera - 0.1, 200, 13);
  const aktiv = t < aLeerlauf - 0.3 ? 3 : interpolate(ease(t, aLeerlauf - 0.3, aLeerlauf + 0.3), [0, 1], [3, 2]);
  const zeigeHebel = t >= Z(5) - 0.1;
  return (
    <AbsoluteFill style={{ opacity: o }}>
      {t < Z(3) ? (
        <div style={{ position: "absolute", left: 540, top: 640, transform: `translate(-50%,-50%) scale(${pNichts})`, textAlign: "center" }}>
          <div style={{ fontFamily: HEAD, fontWeight: 900, fontSize: 150, lineHeight: 0.95, color: C.green }}>FAST</div>
          <div style={{ fontFamily: HEAD, fontWeight: 900, fontSize: 150, lineHeight: 0.95, color: C.green }}>NICHTS</div>
          <div style={{ marginTop: 26 }}><Chip text="bei den meisten Autos" size={34} /></div>
        </div>
      ) : null}
      {t >= Z(3) - 0.1 && t < aKamera ? (
        <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity: ease(t, Z(3) - 0.1, Z(3) + 0.25) }}>
          <Tacho cx={540} cy={820} r={250} wert={wert} glanz={t >= a113 ? 1 - ease(t, a113 + 0.8, a113 + 1.4) : 0} />
        </svg>
      ) : null}
      <SourceCard t={t} a={aFord - 0.1} b={aKamera - 0.15} meta="netzwelt.de · Test mit Ford Fusion" text="Automatik, knapp 113 km/h" />
      {zeigeKamera ? (
        <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity: Math.min(1, pKam) }}>
          <g transform={`translate(540 760) scale(${0.7 + 0.3 * Math.min(1, pKam)}) translate(-540 -760)`}>
            <Rueckfahrkamera x={200} y={550} w={680} t={t} />
          </g>
        </svg>
      ) : null}
      {zeigeKamera ? (
        <div style={{ position: "absolute", left: 540, top: 1060, transform: `translateX(-50%) scale(${pop(t, aKamera + 0.3, 210, 12)})` }}>
          <Chip text="Das Einzige, was passiert" size={36} bg={C.yellow} fg={C.ink} />
        </div>
      ) : null}
      {zeigeHebel ? (
        <>
          <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity: ease(t, Z(5) - 0.1, Z(5) + 0.25) }}>
            <g transform="translate(300 420) scale(1.55) translate(-300 -420)"><Waehlhebel x={300} y={420} aktiv={aktiv} roh={t >= aSchutz - 0.2 ? 1 : -1} /></g>
          </svg>
          {t >= aSchutz ? (
            <div style={{ position: "absolute", left: 470, top: 520, transform: `scale(${pop(t, aSchutz, 210, 12)})`, transformOrigin: "0 50%", display: "flex", flexDirection: "column", gap: 26 }}>
              <Chip text="R gewünscht" size={42} bg={C.red} fg="#ffffff" />
              <Chip text="Schutz greift" size={42} />
              {t >= aLeerlauf ? <Chip text="→ N  Leerlauf" size={42} bg={C.green} fg="#ffffff" style={{ transform: `scale(${pop(t, aLeerlauf, 220, 11)})` }} /> : null}
            </div>
          ) : null}
        </>
      ) : null}
    </AbsoluteFill>
  );
};

// ---- Szene: Schaltgetriebe mit Sperre ----------------------------------------------------------------
const Sperre: React.FC<{ t: number; o: number }> = ({ t, o }) => {
  if (o <= 0) return null;
  const sp = Math.min(1, pop(t, aSperre, 220, 11));
  const ruckeln = t >= aSperre ? Math.sin((t - aSperre) * 30) * 8 * Math.max(0, 1 - (t - aSperre) * 1.5) : 0;
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <g transform={`translate(${ruckeln} 0)`}>
          <Kulisse cx={540} cy={820} w={520} von="5" nach="R" k={t >= aSperre ? 0.62 : ease(t, Z(6), Z(6) + 0.6) * 0.62} sperre={sp} rot={t >= aSperre ? 1 : 0} />
        </g>
      </svg>
      <div style={{ position: "absolute", left: 540, top: 300, transform: `translateX(-50%) scale(${pop(t, Z(6), 210, 12)})` }}>
        <Chip text="Schaltgetriebe" size={44} />
      </div>
      {t >= aSperre ? (
        <div style={{ position: "absolute", left: 540, top: 1160, transform: `translateX(-50%) scale(${sp})`, fontFamily: HEAD, fontWeight: 900, fontSize: 96, color: C.ink, whiteSpace: "nowrap" }}>
          SPERRE VOR <span style={{ color: C.red }}>R</span>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ---- Mechanik (dunkel): Zahnräder ----------------------------------------------------------------------
const Getriebe: React.FC<{ t: number; o: number }> = ({ t, o }) => {
  if (o <= 0) return null;
  // Drehwinkel: drehen bis „stillstehen“, stehen, dann wieder schnell ab „Tempo“
  const w = (tt: number) => {
    const bisStill = Math.min(tt, aStill) - MECH_REIN;
    const auslauf = tt > aStill ? Math.min(tt - aStill, 0.6) * (1 - Math.min(tt - aStill, 0.6) / 1.2) : 0;
    const schnell = tt > aTempo ? (tt - aTempo) * 3.2 : 0;
    return (bisStill + auslauf + schnell) * 70;
  };
  const rot = w(t);
  const pIdler = pop(t, aZahnrad, 190, 13);
  const rein = t < aHinein ? 0 : ease(t, aHinein, aHinein + 0.5);
  const crash = t >= aZaehne - 0.1;
  const crashRein = crash ? Math.min(1, (t - (aZaehne - 0.1)) / 0.2) : 0;
  const idlerY = crash ? 900 + 220 * (1 - crashRein) + Math.sin(t * 70) * 10 * crashRein : interpolate(rein, [0, 1], [1120, 900]);
  const zeigePfeile = t >= aRichtung;
  const still = t >= aStill && t < aTempo;
  const [rx, ry] = ruetteln(t, aKrachen - 0.1, 1.0);
  return (
    <AbsoluteFill style={{ opacity: o, transform: `translate(${rx}px, ${ry}px)` }}>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        {/* Antriebswelle oben links, Abtrieb oben rechts */}
        <Zahnrad cx={330} cy={700} r={150} n={18} rot={rot} farbe={rgba(C.glow, 0.15)} rand={C.glow} pfeil={zeigePfeile ? 1 : 0} />
        <Zahnrad cx={750} cy={700} r={150} n={18} rot={-rot + 10} farbe={rgba(C.glow, 0.15)} rand={C.glow} pfeil={zeigePfeile && t >= aHinein ? -1 : 0} pfeilFarbe={C.red} />
        {t >= aZahnrad - 0.1 ? (
          <g opacity={Math.min(1, pIdler)}>
            <Zahnrad cx={540} cy={idlerY} r={95} n={12} rot={t >= aHinein && !still ? -rot * 1.6 : 0} farbe={rgba(C.red, 0.25)} rand={C.red} />
          </g>
        ) : null}
        <Funken t={t} a={aZaehne} x={540} y={820} dauer={1.2} n={36} />
        {t >= aZaehne ? <Funken t={t} a={aZaehne + 0.2} x={460} y={840} dauer={1.0} n={20} /> : null}
      </svg>
      <div style={{ position: "absolute", left: 540, top: 300, transform: `translateX(-50%) scale(${pop(t, aZahnrad, 210, 12)})` }}>
        <Chip text="Rückwärts-Zahnrad" size={40} bg={C.red} fg="#ffffff" />
      </div>
      {zeigePfeile && t < aSynchron ? (
        <div style={{ position: "absolute", left: 540, top: 1150, transform: `translateX(-50%) scale(${pop(t, aRichtung, 210, 12)})`, fontFamily: HEAD, fontWeight: 900, fontSize: 70, color: C.darkText, whiteSpace: "nowrap" }}>
          DREHRICHTUNG UM
        </div>
      ) : null}
      {t >= aSynchron && t < aStill ? (
        <div style={{ position: "absolute", left: 540, top: 1150, transform: `translateX(-50%) scale(${pop(t, aSynchron, 210, 12)})` }}>
          <Chip text="nicht synchronisiert" size={42} bg={C.yellow} fg={C.ink} />
        </div>
      ) : null}
      {still ? (
        <div style={{ position: "absolute", left: 540, top: 1150, transform: `translateX(-50%) scale(${pop(t, aStill, 210, 12)})` }}>
          <Chip text="✓ nur bei 0 U/min" size={44} bg={C.green} fg="#ffffff" />
        </div>
      ) : null}
      {t >= aKrachen - 0.1 ? (
        <div style={{ position: "absolute", left: 540, top: 1130, transform: `translateX(-50%) scale(${pop(t, aKrachen - 0.1, 260, 9)}) rotate(-6deg)`, fontFamily: HEAD, fontWeight: 900, fontSize: 130, letterSpacing: 6, color: "#ffd166", textShadow: `0 0 30px ${rgba("#ff8a3d", 0.9)}`, whiteSpace: "nowrap" }}>
          KRRRK!
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ---- Pick-up von oben: blockierende Hinterräder, Heck bricht aus --------------------------------------
const Pickup: React.FC<{ t: number; o: number }> = ({ t, o }) => {
  if (o <= 0) return null;
  const block = t >= aHinter ? ease(t, aHinter, aHinter + 0.3) : 0;
  const dreh = t >= aHeck ? interpolate(ease(t, aHeck, aHeck + 1.0), [0, 1], [0, 28]) : 0;
  const strassen = (t - Z(12)) * 900 * (1 - 0.7 * block);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <rect x={180} y={250} width={720} height={1060} fill="#2a2f3a" />
        <rect x={170} y={250} width={10} height={1060} fill="#e8ecf3" />
        <rect x={900} y={250} width={10} height={1060} fill="#e8ecf3" />
        {Array.from({ length: 8 }, (_, i) => {
          const y = 250 + ((i * 160 + strassen) % 1280) - 160;
          return <rect key={i} x={535} y={y} width={10} height={80} fill="#e8ecf3" opacity={0.8} />;
        })}
        {/* Bremsspuren */}
        {block > 0
          ? [-74, 74].map((dx) => {
              const lang = Math.min(1, (t - aHinter) / 1.2) * 420;
              return <rect key={dx} x={540 + dx * Math.cos((dreh * Math.PI) / 180) - 12 + Math.sin((dreh * Math.PI) / 180) * 110 * 0} y={950} width={24} height={lang} fill="#0d0f14" opacity={0.85} />;
            })
          : null}
        <PickupOben x={540} y={800} dreh={dreh} s={1.25} blockiert={block} />
        <Qualm t={t} a={aHinter + 0.15} punkte={[[450, 1000], [630, 1000], [470, 1060], [610, 1060], [540, 1100]]} />
      </svg>
      {t >= aYoutuber - 0.1 && t < aHinter ? (
        <SourceCard t={t} a={aYoutuber - 0.1} b={aHinter - 0.1} meta="AUTO BILD · Youtuber-Test" text="Ford Ranger (1994), Schaltgetriebe, über 70 km/h" />
      ) : null}
      {t >= aHaenden && t < aHinter ? (
        <div style={{ position: "absolute", left: 540, top: 1180, transform: `translateX(-50%) scale(${pop(t, aHaenden, 210, 12)})` }}>
          <Chip text="mit beiden Händen erzwungen" size={36} bg={C.yellow} fg={C.ink} />
        </div>
      ) : null}
      {t >= aHinter ? (
        <div style={{ position: "absolute", left: 540, top: 300, transform: `translateX(-50%) scale(${pop(t, aHinter, 230, 11)})` }}>
          <Chip text="Hinterräder blockiert" size={44} bg={C.red} fg="#ffffff" />
        </div>
      ) : null}
      {t >= aHeck ? <Stamp t={t} a={aHeck} text="HECK BRICHT AUS" x={540} y={1180} size={70} /> : null}
    </AbsoluteFill>
  );
};

// ---- Antriebsstrang: Kupplung trennt, Motor ok, Räder/Getriebe gefährdet -------------------------------
const Strang: React.FC<{ t: number; o: number }> = ({ t, o }) => {
  if (o <= 0) return null;
  const trenn = t >= aKupplung ? ease(t, aKupplung, aKupplung + 0.6) : 0;
  const zustand: [number, number, number, number] = [
    t >= aKupplung + 0.4 ? 1 : 0,
    0,
    t >= aSchaden ? 3 : 0,
    t >= aRaeder ? 2 : 0,
  ];
  const ein = (i: number) => ease(t, Z(14) - 0.1 + i * 0.15, Z(14) + 0.2 + i * 0.15);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <Antrieb x={540} y={380} trenn={trenn} zustand={zustand} dunkel o={[ein(0), ein(1), ein(2), ein(3)]} />
      </svg>
    </AbsoluteFill>
  );
};

// ---- Regel: nur im Stillstand ----------------------------------------------------------------------------
const Regel: React.FC<{ t: number; o: number }> = ({ t, o }) => {
  if (o <= 0) return null;
  const wert = interpolate(ease(t, aAnleitung, aStillstand + 0.2), [0, 1], [100, 0]);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <Tacho cx={540} cy={800} r={240} wert={wert} />
      </svg>
      <Card style={{ left: 140, width: 760, top: 290, padding: "18px 30px", boxSizing: "border-box", opacity: ease(t, Z(16), Z(16) + 0.3) }}>
        <div style={{ fontFamily: MONO, fontSize: 24, letterSpacing: 2.5, color: C.muted }}>BEDIENUNGSANLEITUNG (z. B. KIA)</div>
        <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 40, color: C.ink, marginTop: 4 }}>„… erst dann in den Rückwärtsgang, wenn das Fahrzeug vollständig zum Stillstand gekommen ist.“</div>
      </Card>
      {t >= aStillstand ? <Stamp t={t} a={aStillstand} text="R NUR BEI 0" x={540} y={1150} size={92} farbe={C.green} /> : null}
    </AbsoluteFill>
  );
};

export const Video: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  const x = mech(t, MECH_REIN, MECH_RAUS);
  const k = kamera(t);
  const hookO = sz(t, 0, Z(1));
  const endeO = t >= Z(17) - 0.2 ? ease(t, Z(17) - 0.2, Z(17) + 0.15) : 0;
  const wind = Math.max(hookO, endeO, sz(t, Z(3), aKamera) * 0.6);
  return (
    <Stage x={x}>
      <Audio src={staticFile(V.audio)} />
      <Header t={t} a={Z(1)} thema="Rückwärtsgang bei 100" x={x} />
      <Fahrtwind t={t} staerke={wind} dunkel={x > 0.5} />
      <AbsoluteFill style={{ transform: `scale(${k})`, transformOrigin: "540px 780px" }}>
        {hookO > 0 ? <AbsoluteFill style={{ opacity: hookO }}><HookBild t={t} /></AbsoluteFill> : null}
        <MotorFrage t={t} o={sz(t, Z(1), Z(2))} />
        <Automatik t={t} o={sz(t, Z(2), Z(6))} />
        <Sperre t={t} o={sz(t, Z(6), Z(8))} />
        <Getriebe t={t} o={sz(t, Z(8), Z(12))} />
        <Pickup t={t} o={sz(t, Z(12), Z(14))} />
        <Strang t={t} o={sz(t, Z(14), Z(16))} />
        <Regel t={t} o={sz(t, Z(16), Z(17))} />
        {/* Pointe: Hook-Bild kehrt zurück, jetzt mit der Auflösung. Kein Outro. */}
        {endeO > 0 ? (
          <AbsoluteFill style={{ opacity: endeO }}>
            <HookBild t={t} ende />
            {t >= aHeil ? (
              <div style={{ position: "absolute", left: 540, top: 858, transform: `translate(-50%,-50%) scale(${pop(t, aHeil, 220, 11)})` }}>
                <Chip text="✓ Motor bleibt heil" size={42} bg={C.green} fg="#ffffff" />
              </div>
            ) : null}
            {t >= aKontrolle ? <Stamp t={t} a={aKontrolle} text="RISIKO: KONTROLLE" x={540} y={1230} size={64} /> : null}
          </AbsoluteFill>
        ) : null}
      </AbsoluteFill>
      <Wechsel t={t} a={MECH_REIN - 0.1} />
      {t >= aSpannend - 0.1 && t < Z(8) ? (
        <div style={{ position: "absolute", left: 540, top: 820, transform: `translate(-50%,-50%) scale(${pop(t, aSpannend - 0.1, 200, 12)})`, fontFamily: HEAD, fontWeight: 900, fontSize: 110, color: C.darkText, textAlign: "center", lineHeight: 1 }}>
          IM<br />GETRIEBE
        </div>
      ) : null}
      <Captions t={t} chunks={CHUNKS} dark={x > 0.5} />
    </Stage>
  );
};

void lin;
void aMotor2;
void aGefahr;
void aSchalt;
void aTempo;

/** Für das Cover: das Hook-Bild (Tacho auf 100, Hebel auf R). */
export const CoverBild: React.FC = () => <HookBild t={0} ende />;
