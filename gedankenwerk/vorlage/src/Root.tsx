// Alle Compositions: Probe (Look-Test) + jedes Video aus videos/register.ts (schreibt werkzeug/neu.py).
import React from "react";
import { Composition, Still } from "remotion";
import { FPS, H, W } from "./basis/theme";
import { Probe, PROBE_DAUER } from "./basis/Probe";
import { VIDEOS } from "./videos/register";

export const Root: React.FC = () => (
  <>
    <Composition id="Probe" component={Probe} durationInFrames={PROBE_DAUER} fps={FPS} width={W} height={H} />
    {VIDEOS.map((v) => (
      <React.Fragment key={v.id}>
        <Composition id={v.id} component={v.Video} durationInFrames={v.dauer} fps={FPS} width={W} height={H} />
        {v.Cover ? <Still id={`${v.id}-cover`} component={v.Cover} width={W} height={H} /> : null}
      </React.Fragment>
    ))}
  </>
);
