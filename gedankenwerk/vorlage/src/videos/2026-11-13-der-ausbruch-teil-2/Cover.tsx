// Cover für „Der Ausbruch – Teil 2“: Szene aus dem Hook + 3 Wörter, Serienbanner.
import React from "react";
import { AbsoluteFill } from "remotion";
import { SAFE } from "../../basis/Cover";
import { HEAD, MONO, rgba } from "../../basis/lib";
import { CoverBild } from "./Video";

const ROT = "#ff3b3b";

export const Cover: React.FC = () => (
  <AbsoluteFill style={{ background: "#05080f" }}>
    <AbsoluteFill style={{ transform: "scale(1.15)", transformOrigin: "540px 1000px" }}>
      <CoverBild />
    </AbsoluteFill>
    <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.15) 42%, rgba(0,0,0,0.1) 70%, rgba(0,0,0,0.8) 100%)" }} />
    <div style={{ position: "absolute", top: SAFE.oben + 60, left: 0, right: 0, textAlign: "center" }}>
      <div style={{ fontFamily: HEAD, fontWeight: 900, fontSize: 150, lineHeight: 0.95, color: "#ffffff", letterSpacing: -2, textShadow: "0 8px 30px rgba(0,0,0,0.9)" }}>ER STECKT</div>
      <div style={{ fontFamily: HEAD, fontWeight: 900, fontSize: 170, lineHeight: 1.0, color: ROT, letterSpacing: -2, textShadow: `0 0 40px ${rgba(ROT, 0.8)}` }}>FEST</div>
    </div>
    <div style={{ position: "absolute", top: SAFE.unten - 170, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
      <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 44, letterSpacing: 8, color: "#05080f", background: ROT, padding: "10px 30px", borderRadius: 12 }}>DER AUSBRUCH · TEIL 2</div>
    </div>
  </AbsoluteFill>
);
