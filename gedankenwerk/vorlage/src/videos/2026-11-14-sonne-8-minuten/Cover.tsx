// Cover: Sonne verschwunden (Umriss), Erde noch hell – 3 Wörter.
import React from "react";
import { AbsoluteFill } from "remotion";
import { SAFE } from "../../basis/Cover";
import { HEAD, rgba } from "../../basis/lib";
import { CoverBild } from "./Video";

export const Cover: React.FC = () => (
  <AbsoluteFill style={{ background: "#03050b" }}>
    <CoverBild />
    <div style={{ position: "absolute", top: SAFE.oben + 50, left: 0, right: 0, textAlign: "center", fontFamily: HEAD, fontWeight: 900, lineHeight: 0.98 }}>
      <div style={{ fontSize: 120, color: "#f4f1ea" }}>8 MINUTEN</div>
      <div style={{ fontSize: 150, color: "#ffd25e", textShadow: `0 0 40px ${rgba("#ffd25e", 0.6)}` }}>OHNE SONNE</div>
    </div>
  </AbsoluteFill>
);
