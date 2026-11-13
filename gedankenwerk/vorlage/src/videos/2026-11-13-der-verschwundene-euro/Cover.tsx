// Cover: Abendlicht-Lobby mit Münze(n) + höchstens 3 Wörter.
import React from "react";
import { AbsoluteFill } from "remotion";
import { SAFE } from "../../basis/Cover";
import { HEAD, MONO, rgba } from "../../basis/lib";
import { CoverBild } from "./Video";

export const Cover: React.FC = () => (
  <AbsoluteFill style={{ background: "#24140f" }}>
    <CoverBild />
    <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(10,5,3,0.75) 0%, rgba(10,5,3,0.1) 40%, rgba(10,5,3,0.1) 75%, rgba(10,5,3,0.7) 100%)" }} />
    <div style={{ position: "absolute", top: SAFE.oben + 60, left: 0, right: 0, textAlign: "center" }}>
      <div style={{ fontFamily: HEAD, fontWeight: 900, fontSize: 160, lineHeight: 0.95, color: "#fbecd2", textShadow: "0 8px 30px rgba(0,0,0,0.8)" }}>1 EURO</div>
      <div style={{ fontFamily: HEAD, fontWeight: 900, fontSize: 160, lineHeight: 1.0, color: "#f2b45a", textShadow: `0 0 40px ${rgba("#e08a3c", 0.7)}` }}>FEHLT?</div>
    </div>
    <div style={{ position: "absolute", top: SAFE.unten - 170, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
      <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 40, letterSpacing: 8, color: "#24140f", background: "#f2b45a", padding: "10px 30px", borderRadius: 12 }}>RÄTSEL</div>
    </div>
  </AbsoluteFill>
);
