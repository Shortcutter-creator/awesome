import { THEME } from "../../basis/theme";
// Cover #100s „Der Stau ohne Ursache“: flach 2D, idiotensicher (Vorlage Thumbs95neu: Gross + hell(), Stempel rand-schwarz).
// Autobahn von oben füllt das Bild, in der Mitte eine rote Stau-Zone mit Bremslichtern, davor und dahinter freie Fahrt. Nichts davor.
// Schlagzeile nur aus dem Skript („Dieser Stau hat keine Ursache“), Stempel als Neugier-Frage ohne Auflösung.
// Render: npx remotion still src/kanal/entry/thumbs100s.tsx T100s <out.png>
import React from "react";
import { AbsoluteFill } from "remotion";
import { C, HEAD, MONO, Stamp } from "../../basis/lib";
import { Auto, Baum, K, rnd } from "./icons_h100s";

const INK = C.ink;
const hell = (hex: string) => {
  const n = parseInt(hex.slice(1), 16), r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
};
const Gross: React.FC<{ text: string; size: number; farbe?: string }> = ({ text, size, farbe }) => {
  const basis: React.CSSProperties = { display: "inline-block", fontFamily: HEAD, fontWeight: 900, fontSize: size, lineHeight: 0.9, letterSpacing: -size * 0.035,
    wordSpacing: size * 0.22, whiteSpace: "nowrap" };
  if (!farbe) return <span style={{ ...basis, color: "#fff", textShadow: "0 10px 0 rgba(0,0,0,0.6)" }}>{text}</span>;
  const kontur = hell(farbe) > 0.5 ? "#000" : "#fff";
  return (
    <span style={{ position: "relative", display: "inline-block" }}>
      <span style={{ ...basis, position: "absolute", left: 0, top: 0, color: kontur, WebkitTextStroke: `${Math.round(size * 0.09)}px ${kontur}`,
        textShadow: `0 0 50px ${farbe}aa, 0 10px 0 rgba(0,0,0,0.6)` }}>{text}</span>
      <span style={{ ...basis, position: "relative", color: farbe }}>{text}</span>
    </span>
  );
};
const Badge: React.FC = () => (
  <div style={{ position: "absolute", top: 250, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
    <div style={{ display: "flex", border: `6px solid ${INK}`, borderRadius: 14, overflow: "hidden", boxShadow: "8px 8px 0 rgba(0,0,0,0.6)", background: C.paper2 }}>
      <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: 40, letterSpacing: 6, padding: "10px 22px", color: INK }}>{THEME.kanal.name.toUpperCase()}</span>
      <span style={{ width: 34, background: C.red }} />
    </div>
  </div>
);

// Autobahn (Maßstab 1,5 gegenüber dem Video): 3 Spuren, Mitte x 540
const S = 1.5, LANE = [540 - 130 * S, 540, 540 + 130 * S], RL = 540 - 205 * S, RR = 540 + 205 * S;
const ZONE = { a: 820, b: 1400 };
type A = { j: number; y: number; stau: boolean; du?: boolean };
const AUTOS: A[] = [
  // frei vorne (oben)
  { j: 0, y: 690, stau: false }, { j: 2, y: 560, stau: false },
  // Stau-Zone, dicht an dicht
  ...[0, 1, 2].flatMap((j) => [0, 1, 2].map((k) => ({ j, y: ZONE.a + 105 + k * 192 + j * 14, stau: true, du: j === 1 && k === 2 }))),
  // frei hinten (unten)
  { j: 1, y: 1760, stau: false }, { j: 2, y: 1850, stau: false },
];
const BAEUME = Array.from({ length: 16 }, (_, k) => ({ x: k % 2 ? 60 + 140 * rnd(k + 3) : 900 + 140 * rnd(k + 9), y: 200 + k * 110 + 40 * rnd(k), r: 36 + 20 * rnd(k * 7) }));

export const T100s: React.FC = () => (
  <AbsoluteFill style={{ overflow: "hidden" }}>
    <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
      <rect width={1080} height={1920} fill={K.gras} />
      {BAEUME.map((b, k) => <Baum key={k} x={b.x} y={b.y} r={b.r} />)}
      <rect x={RL - 12} y={0} width={RR - RL + 24} height={1920} fill={K.asphaltRand} />
      <rect x={RL} y={0} width={RR - RL} height={1920} fill={K.asphalt} />
      <rect x={RL + 14} y={0} width={10} height={1920} fill="#f6f3ec" />
      <rect x={RR - 24} y={0} width={10} height={1920} fill="#f6f3ec" />
      {[540 - 65 * S, 540 + 65 * S].map((x) => Array.from({ length: 12 }, (_, k) => <rect key={`${x}${k}`} x={x - 5} y={k * 180 - 40} width={10} height={90} fill="#f6f3ec" opacity={0.85} />))}
      <rect x={RL + 26} y={ZONE.a} width={RR - RL - 52} height={ZONE.b - ZONE.a} rx={40} fill={K.rot} opacity={0.55} />
      <rect x={RL + 26} y={ZONE.a} width={RR - RL - 52} height={ZONE.b - ZONE.a} rx={40} fill="none" stroke={K.rot} strokeWidth={10} />
      {AUTOS.map((a, k) => <Auto key={k} x={LANE[a.j]} y={a.y} s={S} bremse={a.stau ? 1 : 0} farbe={a.du ? K.orange : K.weiss} rand={5} />)}
    </svg>
    {/* oben abdunkeln, damit die Schlagzeile steht */}
    <AbsoluteFill style={{ background: "linear-gradient(rgba(14,16,19,0.92) 0%, rgba(14,16,19,0.85) 33%, rgba(14,16,19,0) 42%)" }} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 400, textAlign: "center" }}>
      <Gross text="DIESER STAU" size={150} />
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 555, textAlign: "center" }}>
      <Gross text="HAT KEINEN GRUND" size={100} farbe={C.red} />
    </div>
    <style>{".rand-schwarz > div { border-color: #000 !important; }"}</style>
    <div className="rand-schwarz"><Stamp t={1} a={0} text="WER HAT IHN VERURSACHT?" x={540} y={1560} size={60} rot={-5} /></div>
    <Badge />
  </AbsoluteFill>
);
