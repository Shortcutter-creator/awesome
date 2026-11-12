// Die drei Cover-Stile (theme.json → cover.stil). Alles Wichtige liegt in der 3:4-Safe-Zone y 240–1680,
// denn das Profilraster von Instagram schneidet oben und unten ab. werkzeug/cover.py prüft das.
import React from "react";
import { AbsoluteFill } from "remotion";
import { C, HEAD, MONO, THEME, TITEL_GEWICHT, hell, rgba } from "./theme";

export const SAFE = { oben: 240, unten: 1680 };

/** Konturfarbe nach Helligkeit: helle Schrift schwarz umranden, dunkle weiß. */
const kontur = (farbe: string) => (hell(farbe) > 0.5 ? "#000000" : "#ffffff");

/** Große Cover-Zeile mit sichtbarem Wortabstand und Kontur nach Helligkeit. */
export const CoverZeile: React.FC<{ text: string; farbe?: string; size?: number; strich?: boolean; style?: React.CSSProperties }> = ({
  text,
  farbe = C.ink,
  size = 150,
  strich = true,
  style,
}) => (
  <div
    style={{
      fontFamily: HEAD,
      fontWeight: TITEL_GEWICHT >= 800 ? 900 : TITEL_GEWICHT,
      fontSize: size,
      lineHeight: 0.98,
      letterSpacing: -2,
      wordSpacing: `${Math.round(size * 0.22)}px`,
      textTransform: "uppercase",
      color: farbe,
      WebkitTextStroke: strich ? `${Math.max(4, Math.round(size / 22))}px ${kontur(farbe)}` : undefined,
      paintOrder: "stroke fill",
      textAlign: "center",
      ...style,
    }}
  >
    {text}
  </div>
);

/** Kleines Kanal-Badge oben in der Safe-Zone. */
const Badge: React.FC<{ dunkel?: boolean }> = ({ dunkel }) => (
  <div style={{ position: "absolute", top: SAFE.oben + 40, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
    <span
      style={{
        fontFamily: MONO,
        fontWeight: 700,
        fontSize: 30,
        letterSpacing: 5,
        textTransform: "uppercase",
        color: dunkel ? C.darkText : C.ink,
        border: `3px solid ${dunkel ? rgba(C.darkText, 0.5) : C.ink}`,
        borderRadius: 999,
        padding: "8px 26px",
      }}
    >
      {THEME.kanal.name}
    </span>
  </div>
);

/**
 * Stil „frage“: direkte Frage groß auf dunklem Grund, darunter das Hauptobjekt.
 * zeilen: 1–2 kurze Zeilen (je ≤ ~12 Zeichen), betont: Index der Zeile in Markierungsfarbe.
 */
export const CoverFrage: React.FC<{ zeilen: string[]; betont?: number; objekt?: React.ReactNode; unten?: string }> = ({ zeilen, betont = 1, objekt, unten }) => (
  <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 45%, ${C.navyIn} 0%, ${C.navyOut} 75%)` }}>
    <Badge dunkel />
    <div style={{ position: "absolute", top: SAFE.oben + 150, left: 70, right: 70 }}>
      {zeilen.map((z, i) => (
        <CoverZeile key={i} text={z} farbe={i === betont ? C.yellow : C.darkText} size={zeilen.length > 1 ? 150 : 180} />
      ))}
    </div>
    <div style={{ position: "absolute", top: 820, left: 90, right: 90, height: 640, display: "flex", alignItems: "center", justifyContent: "center" }}>{objekt}</div>
    {unten ? (
      <div style={{ position: "absolute", top: SAFE.unten - 150, left: 90, right: 90, textAlign: "center", fontFamily: HEAD, fontWeight: 800, fontSize: 52, color: C.darkText }}>{unten}</div>
    ) : null}
  </AbsoluteFill>
);

type Seite = { label: string; wert: string; gut?: boolean };
/** Stil „vergleich“: Frage oben, zwei Karten mit großen Zahlen (grün = gut, rot = schlecht). */
export const CoverVergleich: React.FC<{ frage: string[]; links: Seite; rechts: Seite; symbol?: React.ReactNode; stempel?: string }> = ({
  frage,
  links,
  rechts,
  symbol,
  stempel,
}) => {
  const karte = (s: Seite) => {
    const f = s.gut ? C.green : C.red;
    return (
      <div style={{ flex: 1, background: C.paper2, border: `8px solid ${f}`, borderRadius: 34, padding: "36px 18px 42px", textAlign: "center", boxShadow: `10px 10px 0 ${C.ink}` }}>
        <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 38, letterSpacing: 2, color: C.ink, textTransform: "uppercase" }}>{s.label}</div>
        <div style={{ fontFamily: HEAD, fontWeight: 900, fontSize: 132, lineHeight: 1, color: f, marginTop: 14, letterSpacing: -3 }}>{s.wert}</div>
      </div>
    );
  };
  return (
    <AbsoluteFill style={{ background: C.paper }}>
      <AbsoluteFill style={{ backgroundImage: `linear-gradient(${C.grid} 2px, transparent 2px), linear-gradient(90deg, ${C.grid} 2px, transparent 2px)`, backgroundSize: "108px 108px" }} />
      <Badge />
      <div style={{ position: "absolute", top: SAFE.oben + 150, left: 70, right: 70 }}>
        {frage.map((z, i) => (
          <CoverZeile key={i} text={z} size={132} strich={false} />
        ))}
      </div>
      {symbol ? <div style={{ position: "absolute", top: 760, left: 0, right: 0, display: "flex", justifyContent: "center" }}>{symbol}</div> : null}
      <div style={{ position: "absolute", top: symbol ? 1060 : 900, left: 80, right: 80, display: "flex", gap: 40 }}>
        {karte(links)}
        {karte(rechts)}
      </div>
      {stempel ? (
        <div style={{ position: "absolute", top: SAFE.unten - 220, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
          <div style={{ transform: "rotate(-6deg)", fontFamily: HEAD, fontWeight: 900, fontSize: 84, color: C.red, background: C.paper2, border: `10px solid #000`, borderRadius: 20, padding: "6px 30px 12px", textTransform: "uppercase", whiteSpace: "nowrap" }}>
            {stempel}
          </div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

/** Stil „nah“: Hauptobjekt füllt das Bild (darf angeschnitten sein), darüber höchstens 3 Wörter. */
export const CoverNah: React.FC<{ text: string; objekt: React.ReactNode; hintergrund?: string; farbe?: string }> = ({ text, objekt, hintergrund = C.paper, farbe = C.yellow }) => (
  <AbsoluteFill style={{ background: hintergrund, overflow: "hidden" }}>
    <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>{objekt}</AbsoluteFill>
    <div style={{ position: "absolute", top: SAFE.oben + 60, left: 60, right: 60 }}>
      <CoverZeile text={text} farbe={farbe} size={text.length > 12 ? 150 : 190} />
    </div>
  </AbsoluteFill>
);
