// Cover: das Mega-Haus über den Wolken neben dem Mont Blanc – 3 Wörter.
import React from "react";
import { AbsoluteFill } from "remotion";
import { SAFE } from "../../basis/Cover";
import { HEAD, rgba } from "../../basis/lib";
import { CoverBild } from "./Video";

export const Cover: React.FC = () => (
  <AbsoluteFill style={{ background: "#0b1426" }}>
    <AbsoluteFill style={{ transform: "translateY(180px)" }}>
      <CoverBild />
    </AbsoluteFill>
    <div style={{ position: "absolute", top: SAFE.oben + 50, left: 0, right: 0, textAlign: "center", fontFamily: HEAD, fontWeight: 900, lineHeight: 0.98 }}>
      <div style={{ fontSize: 120, color: "#ffffff", textShadow: "0 6px 24px rgba(0,0,0,0.5)" }}>1 HAUS FÜR</div>
      <div style={{ fontSize: 150, color: "#ffc94a", textShadow: `0 0 40px ${rgba("#ffc94a", 0.6)}, 0 6px 24px rgba(0,0,0,0.5)` }}>ALLE</div>
    </div>
  </AbsoluteFill>
);
