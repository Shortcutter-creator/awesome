// Cover: drei Popcorn-Becher, der kleine leuchtet – 2 Wörter.
import React from "react";
import { AbsoluteFill } from "remotion";
import { SAFE } from "../../basis/Cover";
import { HEAD, rgba } from "../../basis/lib";
import { CoverBild } from "./Video";

export const Cover: React.FC = () => (
  <AbsoluteFill style={{ background: "#1a070b" }}>
    <AbsoluteFill style={{ transform: "translateY(240px)" }}>
      <CoverBild />
    </AbsoluteFill>
    <div style={{ position: "absolute", top: SAFE.oben + 60, left: 0, right: 0, textAlign: "center", fontFamily: HEAD, fontWeight: 900, lineHeight: 0.98 }}>
      <div style={{ fontSize: 120, color: "#fff3dc", textShadow: "0 8px 30px rgba(0,0,0,0.8)" }}>DER</div>
      <div style={{ fontSize: 140, color: "#f6c35b", textShadow: `0 0 40px ${rgba("#f6c35b", 0.6)}` }}>POPCORN-</div>
      <div style={{ fontSize: 140, color: "#f6c35b", textShadow: `0 0 40px ${rgba("#f6c35b", 0.6)}` }}>TRICK</div>
    </div>
  </AbsoluteFill>
);
