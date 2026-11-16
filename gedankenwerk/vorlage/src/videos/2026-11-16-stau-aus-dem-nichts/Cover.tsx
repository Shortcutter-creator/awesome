// Cover: Stauwelle von oben (roter Streifen auf der Autobahn) – „STAU AUS DEM NICHTS“
import React from "react";
import { AbsoluteFill } from "remotion";
import { SAFE } from "../../basis/Cover";
import { HEAD, rgba } from "../../basis/lib";
import { CoverBild } from "./Video";

export const Cover: React.FC = () => (
  <AbsoluteFill style={{ background: "#4f7d41" }}>
    <CoverBild />
    <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(10,14,20,0.8) 0%, rgba(10,14,20,0.0) 42%)" }} />
    <div style={{ position: "absolute", top: SAFE.oben + 40, left: 0, right: 0, textAlign: "center", fontFamily: HEAD, fontWeight: 900, lineHeight: 0.98 }}>
      <div style={{ fontSize: 130, color: "#ffffff", textShadow: "0 6px 24px rgba(0,0,0,0.6)" }}>STAU AUS</div>
      <div style={{ fontSize: 150, color: "#ff4d4d", textShadow: `0 0 40px ${rgba("#ff4d4d", 0.5)}, 0 6px 24px rgba(0,0,0,0.6)` }}>DEM NICHTS</div>
    </div>
  </AbsoluteFill>
);
