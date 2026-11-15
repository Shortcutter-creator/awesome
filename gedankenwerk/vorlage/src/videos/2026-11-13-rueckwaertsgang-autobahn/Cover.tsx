// Cover für „Rückwärtsgang bei 100“: Hook-Bild (Tacho 100, Hebel auf R) + 3 Wörter.
import React from "react";
import { AbsoluteFill } from "remotion";
import { CoverZeile, SAFE } from "../../basis/Cover";
import { C } from "../../basis/lib";
import { CoverBild } from "./Video";

export const Cover: React.FC = () => (
  <AbsoluteFill style={{ background: C.paper }}>
    <AbsoluteFill style={{ backgroundImage: `linear-gradient(${C.grid} 2px, transparent 2px), linear-gradient(90deg, ${C.grid} 2px, transparent 2px)`, backgroundSize: "108px 108px" }} />
    <AbsoluteFill style={{ transform: "translateY(260px) scale(0.92)", transformOrigin: "540px 900px" }}>
      <CoverBild />
    </AbsoluteFill>
    <div style={{ position: "absolute", top: SAFE.oben + 30, left: 60, right: 60 }}>
      <CoverZeile text="R BEI" size={170} strich={false} />
      <CoverZeile text="100?" size={210} farbe={C.red} strich={false} />
    </div>
  </AbsoluteFill>
);
