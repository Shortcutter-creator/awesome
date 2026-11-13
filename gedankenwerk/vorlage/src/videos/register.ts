// Wird von werkzeug/neu.py geschrieben. Nicht von Hand ändern.
import type React from "react";
import * as v0 from "./2026-11-12-million-milliarde/Video";
import * as c0 from "./2026-11-12-million-milliarde/Cover";
import * as v1 from "./2026-11-13-der-ausbruch/Video";
import * as c1 from "./2026-11-13-der-ausbruch/Cover";

export type Eintrag = { id: string; Video: React.FC; dauer: number; Cover?: React.FC };
export const VIDEOS: Eintrag[] = [
  { id: "2026-11-12-million-milliarde", Video: v0.Video, dauer: v0.DAUER, Cover: c0.Cover },
  { id: "2026-11-13-der-ausbruch", Video: v1.Video, dauer: v1.DAUER, Cover: c1.Cover },
];
