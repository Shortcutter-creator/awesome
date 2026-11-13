// Wird von werkzeug/neu.py geschrieben. Nicht von Hand ändern.
import type React from "react";
import * as v0 from "./2026-11-12-million-milliarde/Video";
import * as c0 from "./2026-11-12-million-milliarde/Cover";
import * as v1 from "./2026-11-13-der-ausbruch/Video";
import * as c1 from "./2026-11-13-der-ausbruch/Cover";
import * as v2 from "./2026-11-13-der-ausbruch-teil-2/Video";
import * as c2 from "./2026-11-13-der-ausbruch-teil-2/Cover";
import * as v3 from "./2026-11-13-der-ausbruch-teil-3/Video";
import * as c3 from "./2026-11-13-der-ausbruch-teil-3/Cover";
import * as v4 from "./2026-11-13-rueckwaertsgang-autobahn/Video";
import * as c4 from "./2026-11-13-rueckwaertsgang-autobahn/Cover";

export type Eintrag = { id: string; Video: React.FC; dauer: number; Cover?: React.FC };
export const VIDEOS: Eintrag[] = [
  { id: "2026-11-12-million-milliarde", Video: v0.Video, dauer: v0.DAUER, Cover: c0.Cover },
  { id: "2026-11-13-der-ausbruch", Video: v1.Video, dauer: v1.DAUER, Cover: c1.Cover },
  { id: "2026-11-13-der-ausbruch-teil-2", Video: v2.Video, dauer: v2.DAUER, Cover: c2.Cover },
  { id: "2026-11-13-der-ausbruch-teil-3", Video: v3.Video, dauer: v3.DAUER, Cover: c3.Cover },
  { id: "2026-11-13-rueckwaertsgang-autobahn", Video: v4.Video, dauer: v4.DAUER, Cover: c4.Cover },
];
