import { THEME } from "../../basis/theme";
// Cover Formattest #90 (Hut-Rätsel) im dunklen Stil von ThumbsDunkel.tsx (D28/D32): fast schwarzer Grund, rotes Glühen,
// zwei Riesenwörter (weiß + rot), Objekt in der Mitte, roter Stempel. Helfer lokal nachgebaut, ThumbsDunkel bleibt unberührt.
// Verrät nichts: alle vier Nummern gleich hervorgehoben, keiner markiert.
// Render: npx remotion still src/kanal/entry/thumbs90.tsx T90 <out.png>
import React from "react";
import { AbsoluteFill } from "remotion";
import { C, HEAD, MONO, Stamp } from "../../basis/lib";
import { Gefangener, Mauer, Nummer, Podest } from "./icons_h90";

const Badge: React.FC = () => (
  <div style={{ position: "absolute", top: 280, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
    <div style={{ display: "flex", border: `6px solid ${C.ink}`, borderRadius: 14, overflow: "hidden", boxShadow: "8px 8px 0 rgba(0,0,0,0.6)", background: C.paper2 }}>
      <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: 40, letterSpacing: 6, padding: "10px 22px", color: C.ink }}>{THEME.kanal.name.toUpperCase()}</span>
      <span style={{ width: 34, background: C.red }} />
    </div>
  </div>
);
const Gross: React.FC<{ text: string; size: number; rot?: boolean; mt?: number }> = ({ text, size, rot, mt = 0 }) => {
  const basis: React.CSSProperties = { display: "inline-block", fontFamily: HEAD, fontWeight: 900, fontSize: size, lineHeight: 0.9,
    letterSpacing: -size * 0.035, whiteSpace: "nowrap" };
  if (!rot) return <span style={{ ...basis, marginTop: mt, color: "#fff", textShadow: "0 10px 0 rgba(0,0,0,0.6)" }}>{text}</span>;
  // Rote Wörter dünn weiß umrandet (der Kanalinhaber 21.10.: rot nicht auf jedem Hintergrund lesbar).
  // Kontur als eigene Ebene dahinter, sonst zeichnet der Stroke Linien in die überlappenden Buchstaben.
  return (
    <span style={{ position: "relative", display: "inline-block", marginTop: mt }}>
      <span style={{ ...basis, position: "absolute", left: 0, top: 0, color: "#fff", WebkitTextStroke: `${Math.round(size * 0.09)}px #fff`,
        textShadow: "0 0 50px rgba(224,72,59,0.7), 0 10px 0 rgba(0,0,0,0.6)" }}>{text}</span>
      <span style={{ ...basis, position: "relative", color: C.red }}>{text}</span>
    </span>
  );
};

const G = 1225;
export const T90: React.FC = () => (
  <AbsoluteFill style={{ overflow: "hidden" }}>
    <AbsoluteFill style={{ background: "#0e1013" }} />
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 62%, rgba(224,72,59,0.38) 0%, rgba(224,72,59,0) 58%)" }} />
    <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
      <g transform="translate(0 150)">
        <rect x={0} y={G} width={1080} height={10} fill="#3a3530" />
        <g style={{ filter: "drop-shadow(0 0 3px rgba(255,255,255,0.85)) drop-shadow(0 0 16px rgba(255,255,255,0.25))" }}>
          <Podest x={60} y={G - 200} w={210} h={200} />
          <Podest x={290} y={G - 100} w={195} h={100} />
          <Gefangener x={165} y={G - 200} s={1.2} f={1} hut="s" />
          <Gefangener x={385} y={G - 100} s={1.2} f={1} hut="w" />
          <Gefangener x={600} y={G} s={1.2} f={1} hut="s" />
          <Mauer x={712} y={610} w={52} h={G - 610} />
          <Gefangener x={905} y={G} s={1.2} f={-1} hut="w" />
        </g>
        {[165, 385, 600, 905].map((x, i) => <Nummer key={i} x={x} y={G + 58} n={i + 1} hell={1} />)}
      </g>
    </svg>
    <div style={{ position: "absolute", left: 0, right: 0, top: 385, display: "flex", flexDirection: "column", alignItems: "center" }}>
      {/* Marvin 20.10.: „rot weis weis rot ist besser lesbar“ */}
      <div style={{ display: "flex", gap: 30 }}><Gross text="FINDEST" size={150} rot /><Gross text="DU" size={150} /></div>
      <div style={{ display: "flex", gap: 28, marginTop: 14 }}><Gross text="DIE" size={144} /><Gross text="LÖSUNG?" size={144} rot /></div>
    </div>
    <Stamp t={1} a={0} text="1, 2, 3 ODER 4?" x={540} y={1565} size={80} rot={-5} />
    <Badge />
  </AbsoluteFill>
);
