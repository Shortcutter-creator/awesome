// Wird von werkzeug/neu.py geschrieben. Nicht von Hand ändern.
import type React from "react";
import * as v0 from "./2026-11-12-million-milliarde/Video";
import * as c0 from "./2026-11-12-million-milliarde/Cover";

export type Eintrag = { id: string; Video: React.FC; dauer: number; Cover?: React.FC };
export const VIDEOS: Eintrag[] = [
  { id: "2026-11-12-million-milliarde", Video: v0.Video, dauer: v0.DAUER, Cover: c0.Cover },
];
