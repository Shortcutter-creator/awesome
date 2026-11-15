// Cover: Reißverschluss an der Baustelle von oben – „EGOIST? PFLICHT!“
import React from "react";
import { AbsoluteFill } from "remotion";
import { SAFE } from "../../basis/Cover";
import { HEAD, rgba } from "../../basis/lib";
import { CoverBild } from "./Video";

export const Cover: React.FC = () => (
  <AbsoluteFill style={{ background: "#4c7a3f" }}>
    <CoverBild />
    <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(10,14,20,0.75) 0%, rgba(10,14,20,0.0) 45%)" }} />
    <div style={{ position: "absolute", top: SAFE.oben + 40, left: 0, right: 0, textAlign: "center", fontFamily: HEAD, fontWeight: 900, lineHeight: 0.98 }}>
      <div style={{ fontSize: 130, color: "#ffffff", textShadow: "0 6px 24px rgba(0,0,0,0.6)" }}>EGOIST?</div>
      <div style={{ fontSize: 150, color: "#ffd23f", textShadow: `0 0 40px ${rgba("#ffd23f", 0.5)}, 0 6px 24px rgba(0,0,0,0.6)` }}>PFLICHT!</div>
    </div>
  </AbsoluteFill>
);
