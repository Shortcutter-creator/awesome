// Video „Der verschwundene Euro – Auflösung“: 30 Münzen in drei Reihen zu je 10 €, Farben zeigen Hotel, Page, zurück.
import React from "react";
import { AbsoluteFill, Audio, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Captions, FPS, HEAD, MONO, at, ease, makeChunks, pop, rgba, type Voice } from "../../basis/lib";
import { CREME, DUNKEL, Einblendung, GOLD, GRUEN, KORALLE, Lobby, Muenze, Schrift, kamera, sz } from "../../bausteine/hotel/teile";
import daten from "./woerter.json";

const V = daten as unknown as Voice;
const WD = V.words;
const CHUNKS = makeChunks(WD);
const Z = (n: number) => V.zeilen[Math.min(n, V.zeilen.length - 1)].s;
const A = (w: string, n: number | { ab: number } = 1) => at(WD, w, n);

export const DAUER = Math.ceil((V.dauer + 2.4) * FPS);

const aKein = A("kein");
const aFalsch = A("falsch");
const a27 = A("27", 1);
const aEnthalten = A("enthalten");
const a2 = A("2", 1);
const a25 = A("25");
const a2b = A("2", 2);
const a27b = A("27", 2);
const aNicht = A("nicht");
const aDazu = A("dazuzählen");
const a3 = A("3");
const aAddieren = A("addieren");
const a27c = A("27", 3);
const a30 = A("30");

const KAMERA = [aKein, aFalsch, a27, aEnthalten, a25, a27b, aNicht, aDazu, a3, aAddieren, a27c, a30];

// Münzraster: 3 Reihen × 10 (je Reihe die 10 € eines Freundes). Index 0..24 Hotel, 25..26 Page, 27..29 zurück.
const MX = (i: number) => 237 + (i % 10) * 67;
const MY = (i: number) => 700 + Math.floor(i / 10) * 92;
const rolle = (i: number) => (i < 25 ? "hotel" : i < 27 ? "page" : "zurueck");

const Raster: React.FC<{ t: number }> = ({ t }) => {
  const rein = (i: number) => ease(t, Z(1) - 0.2 + i * 0.02, Z(1) + 0.2 + i * 0.02);
  const faerben = t >= aEnthalten - 0.1;
  const pageLeuchten = t >= a2 - 0.1 ? 0.5 + 0.5 * Math.sin((t - a2) * 6) : 0;
  const zurueckRein = ease(t, a3 - 0.1, aAddieren + 0.2);
  const dopplung = t >= aNicht - 0.2 && t < Z(4) + 0.1;
  const geister = ease(t, aNicht - 0.2, aNicht + 0.3);
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
      {Array.from({ length: 30 }, (_, i) => {
        const r = rolle(i);
        if (r === "zurueck") {
          if (zurueckRein <= 0) return <circle key={i} cx={MX(i)} cy={MY(i)} r={27} fill="none" stroke={rgba(CREME, 0.35)} strokeWidth={3} strokeDasharray="6 6" />;
          const k = Math.min(1, zurueckRein * 1.2 - (i - 27) * 0.1);
          return <Muenze key={i} x={interpolate(Math.max(0, k), [0, 1], [MX(i), MX(i)])} y={interpolate(Math.max(0, k), [0, 1], [1220, MY(i)])} r={28} wert={1} farbe={GRUEN} o={k > 0 ? 1 : 0} />;
        }
        const farbe = !faerben ? undefined : r === "hotel" ? GOLD : KORALLE;
        return <Muenze key={i} x={MX(i)} y={MY(i) - 30 * (1 - rein(i))} r={28} wert={1} farbe={farbe} o={rein(i)} glanz={r === "page" ? pageLeuchten : 0} />;
      })}
      {/* Klammer um die 27 gezahlten Euro */}
      {t >= a27 - 0.1 ? (
        <g opacity={ease(t, a27 - 0.1, a27 + 0.3)}>
          <path d={`M200,${MY(0) - 50} L200,${MY(20) + 45} L${MX(26) + 34},${MY(20) + 45} L${MX(26) + 34},${MY(10) + 45} L${MX(9) + 34},${MY(10) + 45} L${MX(9) + 34},${MY(0) - 50} Z`} fill="none" stroke={CREME} strokeWidth={5} strokeDasharray="14 8" />
        </g>
      ) : null}
      {/* Doppelt zählen: zwei Geister-Münzen werden durchgestrichen */}
      {dopplung ? (
        <g opacity={geister}>
          {[0, 1].map((j) => <Muenze key={j} x={MX(27) + j * 67} y={MY(27) + 150} r={28} wert={1} farbe={KORALLE} o={0.55} />)}
          <line x1={MX(27) - 50} y1={MY(27) + 110} x2={MX(28) + 50} y2={MY(27) + 190} stroke={KORALLE} strokeWidth={10} strokeLinecap="round" />
          <line x1={MX(28) + 50} y1={MY(27) + 110} x2={MX(27) - 50} y2={MY(27) + 190} stroke={KORALLE} strokeWidth={10} strokeLinecap="round" />
        </g>
      ) : null}
    </svg>
  );
};

const Legende: React.FC<{ t: number }> = ({ t }) => {
  if (t < aEnthalten - 0.1) return null;
  const p = ease(t, aEnthalten - 0.1, aEnthalten + 0.3);
  const eintrag = (farbe: string, text: string, sichtbar: boolean) => (
    <div style={{ display: "flex", alignItems: "center", gap: 12, opacity: sichtbar ? 1 : 0.25 }}>
      <div style={{ width: 30, height: 30, borderRadius: 15, background: farbe }} />
      <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: 28, color: CREME }}>{text}</span>
    </div>
  );
  return (
    <div style={{ position: "absolute", left: 200, top: 1000, display: "flex", gap: 30, opacity: p }}>
      {eintrag(GOLD, "Hotel 25 €", true)}
      {eintrag(KORALLE, "Page 2 €", true)}
      {eintrag(GRUEN, "zurück 3 €", t >= a3)}
    </div>
  );
};

export const Video: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  const k = kamera(t, KAMERA);
  const muenze = 1 - ease(t, Z(1) - 0.4, Z(1));
  return (
    <AbsoluteFill style={{ background: DUNKEL, overflow: "hidden" }}>
      <Audio src={staticFile(V.audio)} />
      <AbsoluteFill style={{ transform: `scale(${k})`, transformOrigin: "540px 780px" }}>
        <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
          <Lobby t={t} licht={0.35 + 0.25 * ease(t, Z(1), Z(1) + 1)} />
          {muenze > 0 ? <Muenze x={540} y={760 + Math.sin(t * 1.6) * 14} r={150} wert={1} dreh={t * 140} glanz={0.6} o={muenze} /> : null}
        </svg>
        <AbsoluteFill style={{ background: rgba("#0a0503", 0.35) }} />
        {/* Hook: alte Rechnung wird durchgestrichen */}
        {t < Z(1) + 0.2 ? (
          <AbsoluteFill style={{ opacity: sz(t, 0, Z(1)) }}>
            {t >= aKein - 0.1 ? (
              <div style={{ position: "absolute", left: 540, top: 330, transform: `translateX(-50%) scale(${pop(t, aKein - 0.1, 220, 11)}) rotate(-4deg)`, fontFamily: HEAD, fontWeight: 900, fontSize: 92, color: GRUEN, border: `9px solid ${GRUEN}`, borderRadius: 18, padding: "0 30px 6px", background: rgba(DUNKEL, 0.7), whiteSpace: "nowrap" }}>
                KEIN EURO FEHLT
              </div>
            ) : null}
            <Schrift t={t} a={0.1} text="27 € + 2 € = 29 €" x={540} y={1050} size={100} farbe={CREME} dauer={0.5} />
            {t >= aFalsch ? <div style={{ position: "absolute", left: 250, top: 1050, width: 580 * ease(t, aFalsch, aFalsch + 0.4), height: 10, background: KORALLE, borderRadius: 5, transform: "rotate(-4deg)" }} /> : null}
          </AbsoluteFill>
        ) : null}
        {t >= Z(1) - 0.3 ? (
          <AbsoluteFill style={{ opacity: ease(t, Z(1) - 0.3, Z(1)) }}>
            <Raster t={t} />
            <Legende t={t} />
            {t >= a27 - 0.1 && t < a25 - 0.2 ? <Schrift t={t} a={a27 - 0.1} text="27 € gezahlt" x={540} y={560} size={100} farbe={CREME} /> : null}
            {t >= a25 - 0.2 && t < Z(3) ? (
              <>
                <Schrift t={t} a={a25 - 0.2} text="25 € Hotel" x={200} y={370} size={86} farbe={GOLD} anker="start" />
                <Schrift t={t} a={a2b - 0.1} text="+ 2 € Page" x={200} y={465} size={86} farbe={KORALLE} anker="start" />
                <Schrift t={t} a={a27b - 0.1} text="= 27 € ✅" x={200} y={565} size={86} farbe={CREME} anker="start" />
              </>
            ) : null}
            {t >= Z(3) - 0.1 && t < Z(4) + 0.1 ? <Einblendung t={t} a={Z(3) - 0.1} text={<span>2 € <span style={{ color: KORALLE }}>nicht doppelt</span> zählen</span>} top={420} size={58} /> : null}
            {t >= Z(4) - 0.1 && t < Z(5) ? <Schrift t={t} a={a3 - 0.1} text="+ 3 € zurück" x={540} y={520} size={100} farbe={GRUEN} /> : null}
            {t >= Z(5) - 0.1 ? (
              <>
                <Schrift t={t} a={Z(5) - 0.1} text="27 € + 3 € = 30 € ✅" x={540} y={520} size={104} farbe={CREME} dauer={0.8} />
                <Einblendung t={t} a={a30 + 0.4} text={<div style={{ fontSize: 46, lineHeight: 1.35 }}>25 € Hotel + 2 € Page = 27 € ✅<br />27 € + 3 € zurück = 30</div>} top={1080} />
              </>
            ) : null}
          </AbsoluteFill>
        ) : null}
      </AbsoluteFill>
      <div style={{ position: "absolute", top: 190, right: 96, fontFamily: MONO, fontSize: 26, letterSpacing: 3, color: rgba(CREME, 0.75), textTransform: "uppercase", opacity: ease(t, 0.6, 1.0) }}>Rätsel · Auflösung</div>
      <Captions t={t} chunks={CHUNKS} dark />
    </AbsoluteFill>
  );
};

void aDazu;

/** Für das Cover: Münzraster, alle 30 gefärbt. */
export const CoverBild: React.FC = () => (
  <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
    <Lobby t={0} licht={0.35} />
    {Array.from({ length: 30 }, (_, i) => <Muenze key={i} x={MX(i)} y={MY(i) + 220} r={28} wert={1} farbe={rolle(i) === "hotel" ? GOLD : rolle(i) === "page" ? KORALLE : GRUEN} />)}
  </svg>
);
