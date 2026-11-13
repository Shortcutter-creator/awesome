// Video „Der verschwundene Euro“ (Rätsel): warmes Abendlicht, Hotel-Lobby, ruhige Erzählstimme.
// Endet mit der Frage und der Kommentar-Einblendung (kein Outro). Auflösung als eigenes Video.
import React from "react";
import { AbsoluteFill, Audio, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Captions, FPS, HEAD, MONO, at, ease, makeChunks, pop, rgba, type Voice } from "../../basis/lib";
import {
  AMBER, Aufzug, CREME, DUNKEL, Einblendung, FREUNDE, Freund, GOLD, KORALLE, Lobby, Muenze, Page, Preistafel, Rezeptionist,
  Schein, Schrift, kamera, sz,
} from "../../bausteine/hotel/teile";
import daten from "./woerter.json";

const V = daten as unknown as Voice;
const WD = V.words;
const CHUNKS = makeChunks(WD);
const Z = (n: number) => V.zeilen[Math.min(n, V.zeilen.length - 1)].s;
const A = (w: string, n: number | { ab: number } = 1) => at(WD, w, n);

// kein Outro: nach der Frage bleibt die Kommentar-Einblendung kurz stehen
export const DAUER = Math.ceil((V.dauer + 2.4) * FPS);

const aFreunde = A("Freunde");
const aHotel = A("Hotel");
const a30 = A("30", 1);
const aJeder = A("Jeder", 1);
const a10 = A("10");
const aZimmer2 = A("Zimmer", 2);
const aRezept = A("Rezeptionist");
const aHeute = A("heute");
const a25 = A("25");
const aPagen = A("Pagen", 1);
const a5a = A("5", 1);
const a5b = A("5", 2);
const aTeilen = A("teilen");
const aJedem = A("jedem");
const aBehaelt = A("behält");
const aBezahlt = A("bezahlt");
const a3 = A("3");
const a27 = A("27");
const aPlus = A("Plus");
const a29 = A("29");
const aAnfang = A("Anfang");
const a30b = A("30", 2);
const aWo = A("Wo");
const aFehlend = A("fehlende");
const aEnde = WD[WD.length - 1].e;

const KAMERA = [aHotel, a30, aJeder, a10, aZimmer2, aHeute, a25, aPagen, a5a, a5b, aTeilen, aJedem, aBehaelt, aBezahlt, a27, aPlus, a29, aAnfang, aWo];

// ---- 1 · Ankunft --------------------------------------------------------------------------------
const Ankunft: React.FC<{ t: number; o: number }> = ({ t, o }) => {
  if (o <= 0) return null;
  const ziele = [240, 420, 600];
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <Lobby t={t} />
        {ziele.map((zx, i) => {
          const a = 0.05 + i * 0.35;
          const k = ease(t, a, a + 2.4);
          const x = interpolate(k, [0, 1], [-160 - i * 40, zx]);
          return <Freund key={i} x={x} y={1250} s={1.3} farbe={FREUNDE[i]} gehen={k < 1 ? (t - a) * 1.6 : 0} haar={["#3b2418", "#7a4a20", "#1d1d24"][i]} />;
        })}
      </svg>
      <Einblendung t={t} a={a30 - 0.1} text={<span>3 × 10 € = <span style={{ color: KORALLE }}>30 €</span></span>} />
    </AbsoluteFill>
  );
};

// ---- 2 · Bezahlung am Tresen ---------------------------------------------------------------------
const Bezahlung: React.FC<{ t: number; o: number }> = ({ t, o }) => {
  if (o <= 0) return null;
  const zeiten = [aJeder - 0.05, (aJeder + a10) / 2, a10 + 0.15];
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <Lobby t={t} tresen={false} />
        {/* Tresenplatte nah */}
        <rect x={0} y={820} width={1080} height={490} fill="#7a4428" />
        <rect x={0} y={800} width={1080} height={30} fill="#d9a84e" />
        <rect x={0} y={830} width={1080} height={70} fill={rgba("#000000", 0.18)} />
        {zeiten.map((a, i) => {
          if (t < a - 0.35) return null;
          const k = ease(t, a - 0.35, a);
          const x = 280 + i * 260;
          return (
            <g key={i}>
              <Schein x={x} y={interpolate(k, [0, 1], [1500, 1010 + (i % 2) * 30])} w={240} rot={-8 + i * 7} />
              {/* Hand, die den Schein hinlegt und wieder geht */}
              <circle cx={x} cy={interpolate(k, [0, 1], [1560, 1090]) + 300 * ease(t, a + 0.15, a + 0.6)} r={34} fill="#f1c9a5" opacity={1 - ease(t, a + 0.3, a + 0.6)} />
            </g>
          );
        })}
        {t >= aZimmer2 - 0.2 ? (
          <g transform={`translate(540 ${interpolate(ease(t, aZimmer2 - 0.2, aZimmer2 + 0.3), [0, 1], [700, 1180])})`}>
            <circle cx={-60} cy={0} r={30} fill="none" stroke="#d9a84e" strokeWidth={12} />
            <rect x={-30} y={-7} width={110} height={14} rx={6} fill="#d9a84e" />
            <rect x={56} y={0} width={10} height={22} fill="#d9a84e" />
            <rect x={72} y={0} width={10} height={16} fill="#d9a84e" />
          </g>
        ) : null}
      </svg>
      <Einblendung t={t} a={aJeder} b={Z(3) - 0.2} text={<span>je 10 €</span>} />
    </AbsoluteFill>
  );
};

// ---- 3 · Der Fehler: Preistafel, Rezeptionist stutzt, 5 € an den Pagen -----------------------------
const Fehler: React.FC<{ t: number; o: number }> = ({ t, o }) => {
  if (o <= 0) return null;
  const neu = ease(t, a25 - 0.2, a25 + 0.7);
  const stutzt = ease(t, aHeute - 0.2, aHeute + 0.2);
  const page = ease(t, aPagen - 0.4, aPagen + 0.2);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <Lobby t={t} tresen={false} />
        <Preistafel x={760} y={540} neu={neu} />
        <rect x={360} y={960} width={720} height={350} fill="#7a4428" />
        <rect x={350} y={945} width={740} height={24} rx={6} fill="#d9a84e" />
        <Rezeptionist x={640} y={850} s={1.25} stutzt={stutzt} blick={t < aPagen ? 0.8 : -1} />
        {stutzt > 0 && t < aPagen ? (
          <text x={700} y={700} fontFamily={HEAD} fontWeight={900} fontSize={110} fill={GOLD} transform={`rotate(10 700 700)`} opacity={stutzt}>?</text>
        ) : null}
        <Page x={interpolate(page, [0, 1], [-120, 210])} y={1250} s={1.1} hand={t >= a5a ? 1 : 0} o={page > 0 ? 1 : 0} />
        {t >= a5a - 0.1
          ? [0, 1, 2, 3, 4].map((i) => {
              const k = ease(t, a5a - 0.1 + i * 0.08, a5a + 0.5 + i * 0.08);
              return <Muenze key={i} x={interpolate(k, [0, 1], [600, 205 + (i - 2) * 22])} y={interpolate(k, [0, 1], [930, 1000 - i * 6])} r={26} wert={1} />;
            })
          : null}
      </svg>
      {t >= a5a ? <Einblendung t={t} a={a5a} text={<span>5 € zurück</span>} top={1040} size={52} /> : null}
    </AbsoluteFill>
  );
};

// ---- 4 · Der Page im Aufzug ------------------------------------------------------------------------
const PageAufzug: React.FC<{ t: number; o: number }> = ({ t, o }) => {
  if (o <= 0) return null;
  const offen = ease(t, Z(5) - 0.1, Z(5) + 0.6);
  const zaehl = (i: number) => (t >= a5b - 0.2 + i * 0.16 ? 1 : 0.35);
  const zurueck = (i: number) => ease(t, aJedem + i * 0.18, aJedem + 0.7 + i * 0.18);
  const tasche = ease(t, aBehaelt, aBehaelt + 0.7);
  const zwinkern = t >= aBehaelt + 0.4 && t < aBehaelt + 1.3 ? 1 : 0;
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <Aufzug offen={offen}>
          <Page x={540} y={1280} s={2.3} hand={1} zwinkern={zwinkern} />
          {/* Münzen in der Hand: 3 gehen an die Freunde, 2 in die Tasche */}
          {[0, 1, 2, 3, 4].map((i) => {
            const bx = 400 + i * 70, by = 900;
            if (i < 3) {
              const k = zurueck(i);
              return <Muenze key={i} x={interpolate(k, [0, 1], [bx, 300 + i * 240])} y={interpolate(k, [0, 1], [by, 470])} r={30} wert={1} o={k > 0.98 ? 0 : 1} glanz={zaehl(i) === 1 && k === 0 ? 0.6 : 0} />;
            }
            const k = tasche;
            return <Muenze key={i} x={interpolate(k, [0, 1], [bx, 640])} y={interpolate(k, [0, 1], [by, 1050])} r={30} wert={1} o={1 - ease(t, aBehaelt + 0.5, aBehaelt + 0.8)} glanz={zaehl(i) === 1 && k === 0 ? 0.6 : 0} />;
          })}
        </Aufzug>
        {/* drei Freunde als kleine Köpfe oben, je +1 € */}
        {t >= aJedem - 0.2
          ? [0, 1, 2].map((i) => (
              <g key={i} opacity={ease(t, aJedem - 0.2, aJedem + 0.1)}>
                <circle cx={300 + i * 240} cy={470} r={62} fill={FREUNDE[i]} stroke={CREME} strokeWidth={5} />
                <circle cx={300 + i * 240} cy={460} r={30} fill="#f1c9a5" />
              </g>
            ))
          : null}
      </svg>
      {[0, 1, 2].map((i) => (t >= aJedem + 0.7 + i * 0.18 ? (
        <div key={i} style={{ position: "absolute", left: 300 + i * 240, top: 560, transform: `translateX(-50%) scale(${pop(t, aJedem + 0.7 + i * 0.18, 220, 12)})`, fontFamily: HEAD, fontWeight: 900, fontSize: 48, color: CREME, textShadow: "0 3px 12px rgba(0,0,0,0.6)" }}>+1 €</div>
      ) : null))}
      <Einblendung t={t} a={aTeilen - 0.2} b={aJedem - 0.3} text={<span>5 € ÷ 3 = <span style={{ color: KORALLE }}>1,666… €</span></span>} top={400} size={58} />
      {t >= aBehaelt + 0.3 ? <Einblendung t={t} a={aBehaelt + 0.3} text={<span>Page behält <span style={{ color: KORALLE }}>2 €</span></span>} top={1120} size={54} /> : null}
    </AbsoluteFill>
  );
};

// ---- 5 · Die Rechnung in Handschrift --------------------------------------------------------------
const Rechnung: React.FC<{ t: number; o: number }> = ({ t, o }) => {
  if (o <= 0) return null;
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <Lobby t={t} licht={0.55} />
      </svg>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 45%, ${rgba("#3a2219", 0.35)} 0%, ${rgba("#0a0503", 0.55)} 100%)` }} />
      <Schrift t={t} a={Z(7) + 0.1} text="jeder: 10 € − 1 € = 9 €" x={540} y={470} size={86} />
      <Schrift t={t} a={a3 - 0.1} text="3 × 9 € = 27 €" x={540} y={640} size={110} farbe={GOLD} />
      <Schrift t={t} a={aPlus - 0.1} text="+ 2 € (Page)" x={540} y={800} size={110} farbe={KORALLE} />
      <Schrift t={t} a={a29 - 0.1} text="= 29 € ?" x={540} y={960} size={130} />
      <Einblendung t={t} a={a29 + 0.4} text={<span>27 € + 2 € = 29 € ❓</span>} top={1110} size={60} />
    </AbsoluteFill>
  );
};

// ---- 6 · Die Frage: Licht wird dunkler, ein Euro dreht sich im Leeren -------------------------------
const Frage: React.FC<{ t: number; o: number }> = ({ t, o }) => {
  if (o <= 0) return null;
  const dunkel = ease(t, Z(10), Z(10) + 1.5);
  const schweben = Math.sin(t * 1.6) * 14;
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <Lobby t={t} licht={1 - 0.9 * dunkel} />
        <ellipse cx={540} cy={760} rx={340} ry={340} fill={rgba(GOLD, 0.16 * dunkel)} />
        <Muenze x={540} y={760 + schweben} r={150} wert={1} dreh={(t - Z(10)) * 140} glanz={0.6 * dunkel} />
      </svg>
      {t >= a30b - 0.1 && t < aWo ? (
        <div style={{ position: "absolute", left: 540, top: 330, transform: `translateX(-50%) scale(${pop(t, a30b - 0.1, 210, 12)})`, display: "flex", gap: 40, fontFamily: HEAD, fontWeight: 900, fontSize: 96, whiteSpace: "nowrap" }}>
          <span style={{ color: CREME }}>30 €</span>
          <span style={{ color: rgba(CREME, 0.5) }}>≠</span>
          <span style={{ color: KORALLE }}>29 €</span>
        </div>
      ) : null}
      {t >= aWo ? (
        <div style={{ position: "absolute", left: 540, top: 330, transform: `translateX(-50%) scale(${pop(t, aWo, 200, 13)})`, textAlign: "center", fontFamily: HEAD, fontWeight: 900, fontSize: 84, lineHeight: 1.05, color: CREME, textShadow: `0 0 30px ${rgba(AMBER, 0.6)}`, whiteSpace: "nowrap" }}>
          WO IST DER<br /><span style={{ color: GOLD }}>FEHLENDE EURO?</span>
        </div>
      ) : null}
      <Einblendung t={t} a={aFehlend + 0.4} text={<div style={{ textAlign: "center", lineHeight: 1.2 }}>Schreib deine Lösung<br />in die Kommentare 👇</div>} top={1060} size={54} />
    </AbsoluteFill>
  );
};

export const Video: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  const k = kamera(t, KAMERA);
  return (
    <AbsoluteFill style={{ background: DUNKEL, overflow: "hidden" }}>
      <Audio src={staticFile(V.audio)} />
      <AbsoluteFill style={{ transform: `scale(${k})`, transformOrigin: "540px 780px" }}>
        <Ankunft t={t} o={sz(t, 0, Z(2))} />
        <Bezahlung t={t} o={sz(t, Z(2), Z(3))} />
        <Fehler t={t} o={sz(t, Z(3), Z(5))} />
        <PageAufzug t={t} o={sz(t, Z(5), Z(7))} />
        <Rechnung t={t} o={sz(t, Z(7), Z(10))} />
        <Frage t={t} o={sz(t, Z(10), 999)} />
      </AbsoluteFill>
      <div style={{ position: "absolute", top: 190, right: 96, fontFamily: MONO, fontSize: 26, letterSpacing: 3, color: rgba(CREME, 0.75), textTransform: "uppercase", opacity: ease(t, 0.6, 1.0) }}>Rätsel · Der verschwundene Euro</div>
      <Captions t={t} chunks={CHUNKS} dark />
    </AbsoluteFill>
  );
};

void aFreunde;
void aAnfang;
void aEnde;
void a27;

/** Für das Cover: der Euro im Abendlicht (ohne Text). */
export const CoverBild: React.FC = () => (
  <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
    <Lobby t={0} licht={0.35} />
    <ellipse cx={540} cy={1000} rx={360} ry={360} fill={rgba(GOLD, 0.18)} />
    <Muenze x={540} y={1000} r={190} wert={1} dreh={25} glanz={0.7} />
  </svg>
);
