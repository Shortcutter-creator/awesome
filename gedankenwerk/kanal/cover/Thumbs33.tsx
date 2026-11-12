import { THEME } from "../../basis/theme";
// Cover Folge #33 (Mikrowelle). Regel (Memory feedback_kanal_thumbnails_bold): EIN Riesen-Element + Objekt + roter Stempel.
// Inhalte nur aus projects/kanal-33-mikrowelle/skript.txt („gar keine Hitze“). Auflösung (Moleküle schütteln) bewusst NICHT auf dem Cover:
// die Röntgen-Hälfte zeigt nur Magnetron und Wellen. Kein Logo. Alles Wichtige in y 220–1680.
// Render: npx remotion still src/kanal/entry/thumbs33.tsx T33 <out.png>
import React from "react";
import { AbsoluteFill } from "remotion";
import { C, HEAD, MONO, Stamp } from "../../basis/lib";
import { AMBER, GLOW_FILTER, HEISS, Hitzepfeil, Magnetron, Mikro, MW, Schuessel } from "./icons_h33";

const Papier: React.FC = () => (
  <>
    <AbsoluteFill style={{ backgroundImage: `linear-gradient(${C.grid} 2px, transparent 2px), linear-gradient(90deg, ${C.grid} 2px, transparent 2px)`, backgroundSize: "108px 108px" }} />
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 55%, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0) 55%, rgba(0,0,0,0.08) 100%)" }} />
  </>
);

const Badge: React.FC<{ top?: number }> = ({ top = 236 }) => (
  <div style={{ position: "absolute", top, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
    <div style={{ display: "flex", alignItems: "stretch", border: `6px solid ${C.ink}`, borderRadius: 14, overflow: "hidden", boxShadow: `8px 8px 0 ${C.ink}`, background: C.paper2 }}>
      <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: 40, letterSpacing: 6, padding: "10px 22px", color: C.ink }}>{THEME.kanal.name.toUpperCase()}</span>
      <span style={{ width: 34, background: C.red }} />
    </div>
  </div>
);

const K = 1.12;
const MX = (1080 - MW.w * K) / 2, MY = 925;
const SCHNITT = "M 640 850 L 1080 850 L 1080 1500 L 465 1500 Z";

export const T33: React.FC = () => (
  <AbsoluteFill style={{ background: C.paper, overflow: "hidden" }}>
    <Papier />
    <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
      <defs>
        <clipPath id="t33x"><path d={SCHNITT} /></clipPath>
      </defs>
      {/* Papier-Hälfte: Mikrowelle mit Schüssel */}
      <Mikro x={MX} y={MY} s={K} id="t33a" anzeige="0:30">
        <Schuessel cx={250} cy={285} r={125} id="t33s" rand={0.5} />
      </Mikro>
      {/* Röntgen-Hälfte (diagonal) */}
      <g clipPath="url(#t33x)">
        <rect x={0} y={0} width={1080} height={1920} fill={C.navyOut} />
        {Array.from({ length: 22 }, (_, i) => <line key={`v${i}`} x1={i * 54} y1={0} x2={i * 54} y2={1920} stroke="rgba(143,216,255,0.08)" strokeWidth={2} />)}
        {Array.from({ length: 36 }, (_, i) => <line key={`h${i}`} x1={0} y1={i * 54} x2={1080} y2={i * 54} stroke="rgba(143,216,255,0.08)" strokeWidth={2} />)}
        <g style={{ filter: GLOW_FILTER }}>
          <Mikro x={MX} y={MY} s={K} id="t33b" anzeige="" glow>
            <Schuessel cx={250} cy={285} r={125} id="t33sg" glow />
            <Hitzepfeil x1={MW.fw - 10} y1={120} x2={400} y2={230} farbe={AMBER} dick={10} amp={16} />
            <Hitzepfeil x1={MW.fw - 10} y1={320} x2={400} y2={260} farbe={AMBER} dick={10} amp={16} phase={2} />
          </Mikro>
          <Magnetron x={MX + K * 680} y={MY + K * 250} w={150} glow strom={1} />
        </g>
      </g>
      <path d="M 640 850 L 465 1500" stroke="#e9f8ff" strokeWidth={8} />
    </svg>
    {/* Riesen-Schlagzeile */}
    <div style={{ position: "absolute", left: 0, right: 0, top: 368, display: "flex", flexDirection: "column", alignItems: "center" }}>
      <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: 42, letterSpacing: 6, color: C.ink, background: C.yellow, padding: "4px 18px", border: `5px solid ${C.ink}`, transform: "rotate(-3deg)" }}>DEINE MIKROWELLE MACHT</span>
      {["KEINE", "HITZE"].map((z, i) => (
        <span key={z} style={{ display: "inline-block", transform: "rotate(-3deg)", marginTop: i ? -10 : 10, fontFamily: HEAD, fontWeight: 900, fontSize: 230, lineHeight: 0.95, letterSpacing: -8,
          color: i ? HEISS : C.red, WebkitTextStroke: `10px ${C.ink}`, paintOrder: "stroke fill", textShadow: `12px 12px 0 ${C.ink}`, whiteSpace: "nowrap" } as React.CSSProperties}>{z}</span>
      ))}
    </div>
    <Stamp t={1} a={0} text="WAS DANN?" x={540} y={1625} size={110} rot={-6} />
    <Badge />
  </AbsoluteFill>
);
