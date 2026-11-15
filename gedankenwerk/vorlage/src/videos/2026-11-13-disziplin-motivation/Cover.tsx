// Cover: Disziplin zieht, Motivation sitzt – 3 Wörter.
import React from "react";
import { AbsoluteFill } from "remotion";
import { SAFE } from "../../basis/Cover";
import { HEAD, rgba } from "../../basis/lib";
import { CoverBild } from "./Video";

export const Cover: React.FC = () => (
  <AbsoluteFill style={{ background: "#04060b" }}>
    <AbsoluteFill style={{ transform: "translateY(330px)" }}>
      <CoverBild />
    </AbsoluteFill>
    <div style={{ position: "absolute", top: SAFE.oben + 50, left: 0, right: 0, textAlign: "center", fontFamily: HEAD, fontWeight: 900, lineHeight: 0.98 }}>
      <div style={{ fontSize: 150, color: "#6fb6ff", textShadow: `0 0 40px ${rgba("#6fb6ff", 0.6)}` }}>DISZIPLIN</div>
      <div style={{ fontSize: 110, color: "#ffffff" }}>SCHLÄGT</div>
      <div style={{ fontSize: 130, color: "#ff9a4a", textShadow: `0 0 30px ${rgba("#ff9a4a", 0.5)}` }}>MOTIVATION</div>
    </div>
  </AbsoluteFill>
);
