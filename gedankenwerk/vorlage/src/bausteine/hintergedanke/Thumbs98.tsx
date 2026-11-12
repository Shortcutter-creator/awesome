import { THEME } from "../../basis/theme";
// Cover #98 „Bergab im Leerlauf kostet Sprit“ – flach in 2D, nüchterner Vergleich wie Konzept 5 von #95 (LERNEN: Cover-Wahl #95).
// Zwei Karten: links Schalthebel N mit laufender Anzeige (rot, Tropfen), rechts Gang 3 mit 0,0 (grün). Gleiches Auto, gleiches Gefälle.
// Zahlen belegt (quellen.md #98): Leerlauf etwa 0,5–1 l/h (ADAC) → 0,8 liegt darin; Schubabschaltung 0,0 (Wikipedia).
// Schrift: wordSpacing 0,22, helle Farben schwarz umrandet, Stempel schwarzer Rand (Vorlage Thumbs95neu `Gross` + `hell()`).
// Render: npx remotion still src/kanal/entry/thumbs98.tsx T98 <out.png>
import React from "react";
import { AbsoluteFill } from "remotion";
import { C, HEAD, MONO, Stamp } from "../../basis/lib";

const INK = C.ink;
const ROT = "#ff4f4f", GRUEN = "#3ee08a", GELB = "#ffc83d", ORANGE = "#ff8a2a";
const LACK = "#3f86d6", LACK_D = "#2a5f9e";

const Badge: React.FC = () => (
  <div style={{ position: "absolute", top: 280, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
    <div style={{ display: "flex", border: `6px solid ${INK}`, borderRadius: 14, overflow: "hidden", boxShadow: "8px 8px 0 rgba(0,0,0,0.6)", background: C.paper2 }}>
      <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: 40, letterSpacing: 6, padding: "10px 22px", color: INK }}>{THEME.kanal.name.toUpperCase()}</span>
      <span style={{ width: 34, background: C.red }} />
    </div>
  </div>
);
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

/** Auto in Seitenansicht (nach rechts), Mitte unten (x, y), Breite w. Kopie von AutoSeite aus Thumbs95neu. */
const AutoSeite: React.FC<{ x: number; y: number; w: number }> = ({ x, y, w }) => (
  <g transform={`translate(${x} ${y}) scale(${w / 400})`} strokeLinejoin="round" strokeLinecap="round">
    <path d="M-200 -36 Q -204 -84 -168 -92 L -96 -100 L -44 -154 L 72 -154 L 132 -100 L 186 -90 Q 206 -80 204 -44 L 200 -22 L -198 -22 Z" fill={LACK} stroke={INK} strokeWidth={9} />
    <path d="M-80 -102 L -38 -144 L 66 -144 L 116 -102 Z" fill="#20314f" stroke={INK} strokeWidth={6} />
    <path d="M14 -144 L 14 -102" stroke={INK} strokeWidth={8} />
    <path d="M-196 -60 L 200 -60" stroke={LACK_D} strokeWidth={8} opacity={0.8} />
    <rect x={184} y={-84} width={20} height={20} rx={5} fill="#ffe08a" stroke={INK} strokeWidth={5} />
    <rect x={-202} y={-84} width={16} height={20} rx={4} fill="#ff3b3b" stroke={INK} strokeWidth={5} />
    {[-118, 118].map((wx) => (
      <g key={wx}>
        <circle cx={wx} cy={-22} r={38} fill="#16191f" stroke={INK} strokeWidth={8} />
        <circle cx={wx} cy={-22} r={15} fill="#9aa4b1" stroke={INK} strokeWidth={5} />
      </g>
    ))}
  </g>
);

/** Eine Karte: Gefälle mit Auto, Schaltknauf, Verbrauch. */
const Karte: React.FC<{ x: number; farbe: string; knauf: string; knaufFarbe: string; wert: string; wertFarbe: string; titel: string; tropfen?: boolean; haken?: boolean }> = ({
  x, farbe, knauf, knaufFarbe, wert, wertFarbe, titel, tropfen, haken,
}) => (
  <div style={{ position: "absolute", left: x - 238, top: 700, width: 476, height: 860, borderRadius: 40, background: "rgba(14,20,36,0.93)",
    border: `8px solid ${farbe}`, boxShadow: `0 0 50px ${farbe}55`, overflow: "hidden" }}>
    <svg width={476} height={860} style={{ position: "absolute", left: 0, top: 0 }}>
      {/* Gefälle */}
      <g transform="rotate(12 238 250)">
        <rect x={-80} y={262} width={640} height={60} fill="#3a3e46" />
        <path d="M -80 292 L 560 292" stroke="#e8e6df" strokeWidth={6} strokeDasharray="34 30" />
        <rect x={-80} y={322} width={640} height={70} fill="#4f7a3a" />
        <AutoSeite x={238} y={276} w={330} />
      </g>
      {/* Schaltknauf */}
      <g transform="translate(238 470)">
        <circle r={84} fill={knaufFarbe} stroke="#04060d" strokeWidth={10} style={{ filter: `drop-shadow(0 0 24px ${knaufFarbe})` }} />
        <text y={36} textAnchor="middle" fontFamily={HEAD} fontWeight={900} fontSize={110} fill="#04060d">{knauf}</text>
      </g>
      {tropfen && [0, 1, 2].map((k) => (
        <path key={k} transform={`translate(${74} ${616 + k * 52}) scale(${1 - k * 0.18})`} d="M0 -26 C 10 -12 16 -4 16 6 A 16 16 0 0 1 -16 6 C -16 -4 -10 -12 0 -26 Z" fill={ORANGE} />
      ))}
      {haken && (
        <g transform="translate(404 600)">
          <circle r={34} fill={GRUEN} stroke="#04060d" strokeWidth={6} />
          <path d="M-15 1 L -4 13 L 17 -12" stroke="#04060d" strokeWidth={8} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      )}
    </svg>
    <div style={{ position: "absolute", left: 0, right: 0, top: 596, textAlign: "center" }}><Gross text={wert} size={150} farbe={wertFarbe} /></div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 740, textAlign: "center", fontFamily: MONO, fontWeight: 700, fontSize: 40, letterSpacing: 4, color: "#cfd8ee" }}>{titel}</div>
  </div>
);

export const T98: React.FC = () => (
  <AbsoluteFill style={{ overflow: "hidden" }}>
    <AbsoluteFill style={{ background: "#0e1013" }} />
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 66%, rgba(255,138,42,0.26) 0%, rgba(255,138,42,0) 56%)" }} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 392, textAlign: "center" }}>
      <Gross text="LEERLAUF" size={150} />
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 548, textAlign: "center" }}>
      <Gross text="SPART SPRIT?" size={112} farbe={GELB} />
    </div>
    <Karte x={290} farbe={ROT} knauf="N" knaufFarbe={ORANGE} wert="0,8" wertFarbe={ROT} titel="L/H · LEERLAUF" tropfen />
    <Karte x={790} farbe={GRUEN} knauf="3" knaufFarbe={GRUEN} wert="0,0" wertFarbe={GRUEN} titel="L/H · IM GANG" haken />
    <style>{".rand-schwarz > div { border-color: #000 !important; }"}</style>
    <div className="rand-schwarz"><Stamp t={1} a={0} text="BERGAB IM GANG: 0 LITER" x={540} y={1645} size={64} rot={-5} /></div>
    <Badge />
  </AbsoluteFill>
);
