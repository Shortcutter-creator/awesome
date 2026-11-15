// Cover für „Million vs. Milliarde“ (werkzeug/cover.py rendert es).
// 3 Wörter Schlagzeile, Hook-Objekt (Stoppuhr) groß, Pointe (32 Jahre) bleibt offen.
import React from "react";
import { AbsoluteFill } from "remotion";
import { CoverZeile, SAFE } from "../../basis/Cover";
import { C, HEAD, MONO } from "../../basis/lib";
import { Stoppuhr } from "../../bausteine/hintergedanke/icons_h21";

const Karte: React.FC<{ label: string; wert: string; farbe: string }> = ({ label, wert, farbe }) => (
  <div style={{ flex: 1, background: C.paper2, border: `8px solid ${farbe}`, borderRadius: 34, padding: "30px 14px 36px", textAlign: "center", boxShadow: `10px 10px 0 ${C.ink}` }}>
    <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 36, letterSpacing: 1, color: C.ink }}>{label}</div>
    <div style={{ fontFamily: HEAD, fontWeight: 900, fontSize: 112, lineHeight: 1, color: farbe, marginTop: 14, letterSpacing: -3, whiteSpace: "nowrap" }}>{wert}</div>
  </div>
);

export const Cover: React.FC = () => (
  <AbsoluteFill style={{ background: C.paper }}>
    <AbsoluteFill style={{ backgroundImage: `linear-gradient(${C.grid} 2px, transparent 2px), linear-gradient(90deg, ${C.grid} 2px, transparent 2px)`, backgroundSize: "108px 108px" }} />
    <div style={{ position: "absolute", top: SAFE.oben + 60, left: 60, right: 60 }}>
      <CoverZeile text="MILLION" size={150} strich={false} />
      <CoverZeile text="ODER" size={110} farbe={C.ink} strich={false} />
      <CoverZeile text="MILLIARDE?" size={150} farbe={C.red} strich={false} />
    </div>
    <div style={{ position: "absolute", top: 780, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
      <Stoppuhr size={360} winkel={40} />
    </div>
    <div style={{ position: "absolute", top: 1200, left: 70, right: 70, display: "flex", gap: 36 }}>
      <Karte label="1 MIO. SEKUNDEN" wert="11 TAGE" farbe={C.green} />
      <Karte label="1 MRD. SEKUNDEN" wert="?" farbe={C.red} />
    </div>
  </AbsoluteFill>
);
