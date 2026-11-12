// Illustrationen Folge 23 (Die Zucker-Studie). Gleicher Stil wie icons.tsx; glow = Röntgen-Fassung.
// Keine Logos: Fachzeitschrift nur mit Text (Name + Jahr), Packungen ohne Marke, Geldschein generisch.
import React from "react";
import { C, HEAD, MONO } from "../../basis/lib";

type P = { size?: number; glow?: boolean; style?: React.CSSProperties };
const ink = (g?: boolean) => (g ? C.glow : C.ink);
const fill = (g: boolean | undefined, f: string) => (g ? "rgba(143,216,255,0.2)" : f);
const gl = (g?: boolean): React.CSSProperties => (g ? { filter: "drop-shadow(0 0 14px rgba(143,216,255,0.45)) drop-shadow(0 0 3px rgba(143,216,255,0.8))" } : {});
const HELL = "#eaf7ff";
const ROT_GLOW = "#ff7b6e";

/** Kleine deterministische Zufallsfolge (gleiche Körnung in jedem Bild). */
const rnd = (seed: number) => {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
};

// ---------------------------------------------------------------------------
// Würfelzucker (isometrisch). viewBox 400 × 420 → Höhe = 1,05 × size. Unterkante (Mitte) bei (200, 390).
// ---------------------------------------------------------------------------
type Pt = [number, number];
const flaeche = (o: Pt, e1: Pt, e2: Pt, u: number, v: number): Pt => [o[0] + u * e1[0] + v * e2[0], o[1] + u * e1[1] + v * e2[1]];
const KOERNER = (() => {
  const r = rnd(23);
  const faces: { o: Pt; e1: Pt; e2: Pt }[] = [
    { o: [30, 115], e1: [170, -85], e2: [170, 85] }, // oben
    { o: [30, 115], e1: [170, 85], e2: [0, 190] }, // links
    { o: [200, 200], e1: [170, -85], e2: [0, 190] }, // rechts
  ];
  return faces.map((f) => Array.from({ length: 26 }, () => ({ p: flaeche(f.o, f.e1, f.e2, 0.08 + 0.84 * r(), 0.08 + 0.84 * r()), rot: r() * 90, s: 6 + r() * 8 })));
})();
export const Wuerfelzucker: React.FC<P> = ({ size = 400, glow, style }) => (
  <svg width={size} height={size * 1.05} viewBox="0 0 400 420" style={{ overflow: "visible", ...gl(glow), ...style }}>
    <path d="M200 30 L370 115 L200 200 L30 115 Z" fill={fill(glow, "#ffffff")} stroke={ink(glow)} strokeWidth={8} strokeLinejoin="round" />
    <path d="M30 115 L200 200 L200 390 L30 305 Z" fill={fill(glow, "#f1eee8")} stroke={ink(glow)} strokeWidth={8} strokeLinejoin="round" />
    <path d="M200 200 L370 115 L370 305 L200 390 Z" fill={glow ? "rgba(143,216,255,0.12)" : "#d9d4cb"} stroke={ink(glow)} strokeWidth={8} strokeLinejoin="round" />
    {KOERNER.map((face, fi) =>
      face.map((k, i) => (
        <rect
          key={`${fi}-${i}`}
          x={k.p[0] - k.s / 2}
          y={k.p[1] - k.s / 2}
          width={k.s}
          height={k.s}
          rx={2}
          transform={`rotate(${k.rot} ${k.p[0]} ${k.p[1]})`}
          fill={glow ? C.glow : fi === 2 ? "#bdb6aa" : "#cfc9bf"}
          opacity={glow ? 0.35 : 0.75}
        />
      )),
    )}
    {/* Glanzkante */}
    <path d="M60 118 L200 48" stroke={glow ? C.glow : "#ffffff"} strokeWidth={6} strokeLinecap="round" opacity={0.8} />
  </svg>
);

// ---------------------------------------------------------------------------
// Butterstück im halb geöffneten Papier. viewBox 400 × 260 → Höhe = 0,65 × size.
// ---------------------------------------------------------------------------
export const Butter: React.FC<P> = ({ size = 360, glow, style }) => (
  <svg width={size} height={size * 0.65} viewBox="0 0 400 260" style={{ overflow: "visible", ...gl(glow), ...style }}>
    {/* Block */}
    <path d="M40 110 L100 58 L360 58 L300 110 Z" fill={fill(glow, "#f8dc78")} stroke={ink(glow)} strokeWidth={7} strokeLinejoin="round" />
    <path d="M40 110 L300 110 L300 228 L40 228 Z" fill={fill(glow, C.yellow)} stroke={ink(glow)} strokeWidth={7} strokeLinejoin="round" />
    <path d="M300 110 L360 58 L360 176 L300 228 Z" fill={glow ? "rgba(143,216,255,0.12)" : "#d8ab2e"} stroke={ink(glow)} strokeWidth={7} strokeLinejoin="round" />
    {/* Papier über der rechten Hälfte */}
    <path d="M176 110 L236 58 L360 58 L300 110 Z" fill={fill(glow, "#f4f1ea")} stroke={ink(glow)} strokeWidth={6} strokeLinejoin="round" />
    <path d="M176 110 L300 110 L300 228 L176 228 L184 206 L172 186 L184 166 L172 146 L184 128 Z" fill={fill(glow, "#fbfaf6")} stroke={ink(glow)} strokeWidth={6} strokeLinejoin="round" />
    <path d="M300 110 L360 58 L360 176 L300 228 Z" fill={glow ? "rgba(143,216,255,0.16)" : "#e3dfd6"} stroke={ink(glow)} strokeWidth={6} strokeLinejoin="round" />
    <path d="M206 140 L276 140 M206 164 L262 164" stroke={glow ? C.glow : C.line} strokeWidth={6} strokeLinecap="round" />
    {/* Glanz auf der Butter */}
    <path d="M62 128 L62 196" stroke={glow ? C.glow : "#fff3c4"} strokeWidth={8} strokeLinecap="round" opacity={0.8} />
  </svg>
);

// ---------------------------------------------------------------------------
// Warnschild mit Herz (rotes Dreieck). viewBox 300 × 270 → Höhe = 0,9 × size.
// ---------------------------------------------------------------------------
export const HerzWarnung: React.FC<P> = ({ size = 260, glow, style }) => (
  <svg width={size} height={size * 0.9} viewBox="0 0 300 270" style={{ overflow: "visible", ...gl(glow), ...style }}>
    <path d="M150 22 L282 250 L18 250 Z" fill={glow ? "rgba(143,216,255,0.14)" : C.ink} stroke={glow ? C.glow : C.ink} strokeWidth={44} strokeLinejoin="round" />
    <path d="M150 22 L282 250 L18 250 Z" fill={glow ? "rgba(26,33,56,0.6)" : "#fffdf8"} stroke={glow ? ROT_GLOW : C.red} strokeWidth={28} strokeLinejoin="round" />
    <path
      d="M150 222 C 96 186, 84 146, 108 128 C 128 114, 144 124, 150 140 C 156 124, 172 114, 192 128 C 216 146, 204 186, 150 222 Z"
      fill={glow ? ROT_GLOW : C.red}
      stroke={glow ? ROT_GLOW : C.ink}
      strokeWidth={6}
      strokeLinejoin="round"
    />
    <path d="M118 142 Q 124 132 134 134" fill="none" stroke="#ffffff" strokeWidth={6} strokeLinecap="round" opacity={0.75} />
  </svg>
);

// ---------------------------------------------------------------------------
// Geldschein (generisch, ohne Wertzahl außer `betrag`). viewBox 400 × 200 → Höhe = 0,5 × size.
// ---------------------------------------------------------------------------
export const Geldschein: React.FC<P & { betrag?: string }> = ({ size = 360, glow, style, betrag }) => {
  const zf = glow ? "#ffb82e" : "#2c5e3a";
  return (
    <svg width={size} height={size * 0.5} viewBox="0 0 400 200" style={{ overflow: "visible", ...gl(glow), ...style }}>
      <rect x={4} y={4} width={392} height={192} rx={16} fill={fill(glow, "#9fd0a2")} stroke={ink(glow)} strokeWidth={8} />
      <rect x={24} y={24} width={352} height={152} rx={8} fill="none" stroke={glow ? C.glow : "#4f8a5a"} strokeWidth={4} strokeDasharray="10 7" />
      {betrag ? (
        <>
          <rect x={70} y={52} width={260} height={96} rx={18} fill={glow ? "rgba(255,184,46,0.16)" : "#c8e8c6"} stroke={glow ? "#ffb82e" : C.ink} strokeWidth={5} />
          <text x={200} y={122} textAnchor="middle" fontFamily={HEAD} fontWeight={900} fontSize={66} letterSpacing={-2} fill={zf}>
            {betrag}
          </text>
        </>
      ) : (
        <>
          <ellipse cx={200} cy={100} rx={54} ry={64} fill={glow ? "rgba(143,216,255,0.12)" : "#c8e8c6"} stroke={ink(glow)} strokeWidth={5} />
          <text x={200} y={126} textAnchor="middle" fontFamily={HEAD} fontWeight={900} fontSize={76} fill={zf}>
            $
          </text>
        </>
      )}
      {[
        [56, 62],
        [344, 150],
      ].map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r={20} fill="none" stroke={glow ? C.glow : "#4f8a5a"} strokeWidth={4} />
          <text x={x} y={y + 9} textAnchor="middle" fontFamily={HEAD} fontWeight={900} fontSize={26} fill={zf}>
            $
          </text>
        </g>
      ))}
    </svg>
  );
};

// ---------------------------------------------------------------------------
// Balkenwaage. viewBox 800 × 640 → Höhe = 0,8 × size. kipp in Grad (positiv = linke Schale unten).
// waagePfanne() liefert die Mitte der Schalen-Kante (dort stehen Dinge) in viewBox-Koordinaten.
// ---------------------------------------------------------------------------
const W_PIV: Pt = [400, 150];
const W_ARM = 300;
const W_HANG = 190;
export const waagePfanne = (kipp: number, seite: "l" | "r"): Pt => {
  const k = (kipp * Math.PI) / 180;
  const s = seite === "l" ? -1 : 1;
  return [W_PIV[0] + s * W_ARM * Math.cos(k), W_PIV[1] - s * W_ARM * Math.sin(k) + W_HANG];
};
export const Waage: React.FC<P & { kipp?: number }> = ({ size = 800, glow, style, kipp = 0 }) => {
  const k = (kipp * Math.PI) / 180;
  const L: Pt = [W_PIV[0] - W_ARM * Math.cos(k), W_PIV[1] + W_ARM * Math.sin(k)];
  const R: Pt = [W_PIV[0] + W_ARM * Math.cos(k), W_PIV[1] - W_ARM * Math.sin(k)];
  const schale = (e: Pt) => {
    const y = e[1] + W_HANG;
    return (
      <g>
        <path d={`M${e[0]} ${e[1]} L${e[0] - 110} ${y} M${e[0]} ${e[1]} L${e[0] + 110} ${y}`} stroke={ink(glow)} strokeWidth={5} />
        <path d={`M${e[0] - 130} ${y} Q ${e[0]} ${y + 80} ${e[0] + 130} ${y} Z`} fill={fill(glow, C.steel)} stroke={ink(glow)} strokeWidth={7} strokeLinejoin="round" />
        <circle cx={e[0]} cy={e[1]} r={10} fill={ink(glow)} />
      </g>
    );
  };
  return (
    <svg width={size} height={size * 0.8} viewBox="0 0 800 640" style={{ overflow: "visible", ...gl(glow), ...style }}>
      {/* Ständer */}
      <rect x={386} y={150} width={28} height={420} rx={8} fill={fill(glow, "#b98a5e")} stroke={ink(glow)} strokeWidth={7} />
      <path d="M290 620 L510 620 L470 566 L330 566 Z" fill={fill(glow, "#8a6a4a")} stroke={ink(glow)} strokeWidth={7} strokeLinejoin="round" />
      {/* Balken */}
      <path d={`M${L[0]} ${L[1]} L${R[0]} ${R[1]}`} stroke={ink(glow)} strokeWidth={22} strokeLinecap="round" />
      <path d={`M${L[0]} ${L[1]} L${R[0]} ${R[1]}`} stroke={glow ? "rgba(143,216,255,0.35)" : "#d9b46a"} strokeWidth={9} strokeLinecap="round" />
      {schale(L)}
      {schale(R)}
      <path d="M400 96 L424 150 L376 150 Z" fill={fill(glow, C.red)} stroke={ink(glow)} strokeWidth={6} strokeLinejoin="round" />
      <circle cx={400} cy={150} r={22} fill={fill(glow, C.yellow)} stroke={ink(glow)} strokeWidth={7} />
    </svg>
  );
};

// ---------------------------------------------------------------------------
// Fachzeitschrift (nur Text, kein Logo). Breite size, Höhe 4/3 · size. auf = 0..1 klappt den Umschlag nach links auf.
// Die Gesamtbreite ist 2 · size (Doppelseite); geschlossen steht das Heft mittig darin.
// markiert = gelber Marker auf der Ergebnis-Zeile der Innenseite.
// ---------------------------------------------------------------------------
const Umschlag: React.FC<{ glow?: boolean }> = ({ glow }) => (
  <svg width="100%" height="100%" viewBox="0 0 300 400" preserveAspectRatio="none" style={{ display: "block", overflow: "visible" }}>
    <rect x={4} y={4} width={292} height={392} rx={8} fill={fill(glow, "#fbf8f1")} stroke={ink(glow)} strokeWidth={7} />
    <rect x={4} y={4} width={292} height={126} rx={8} fill={glow ? "rgba(143,216,255,0.14)" : "#7f2b26"} stroke={ink(glow)} strokeWidth={7} />
    <g fontFamily={HEAD} fontWeight={800} textAnchor="middle" fill={glow ? HELL : "#fffdf8"} letterSpacing={0.5}>
      <text x={150} y={46} fontSize={27}>NEW ENGLAND</text>
      <text x={150} y={80} fontSize={27}>JOURNAL OF</text>
      <text x={150} y={114} fontSize={27}>MEDICINE</text>
    </g>
    <text x={150} y={166} textAnchor="middle" fontFamily={MONO} fontWeight={700} fontSize={26} letterSpacing={4} fill={ink(glow)}>
      1967
    </text>
    <path d="M30 184 L270 184" stroke={ink(glow)} strokeWidth={4} />
    {!glow &&
      [214, 238, 262, 300, 324, 348].map((y, i) => (
        <rect key={y} x={30} y={y} width={i % 3 === 2 ? 150 : 240} height={10} rx={5} fill={C.line} />
      ))}
    {glow && <path d="M30 214 L270 214 M30 238 L230 238" stroke={C.glow} strokeWidth={4} strokeDasharray="8 10" opacity={0.6} />}
  </svg>
);
const Innen: React.FC<{ glow?: boolean; links?: boolean; markiert?: number }> = ({ glow, links, markiert = 0 }) => (
  <svg width="100%" height="100%" viewBox="0 0 300 400" preserveAspectRatio="none" style={{ display: "block", overflow: "visible" }}>
    <rect x={4} y={4} width={292} height={392} rx={8} fill={fill(glow, "#fffdf8")} stroke={ink(glow)} strokeWidth={7} />
    {links ? (
      [40, 64, 88, 112, 136, 160, 184, 208, 232, 256, 280, 304, 328].map((y, i) => <rect key={y} x={30} y={y} width={i % 4 === 3 ? 140 : 240} height={9} rx={4} fill={glow ? "rgba(143,216,255,0.4)" : C.line} />)
    ) : (
      <>
        <text x={26} y={46} fontFamily={MONO} fontWeight={700} fontSize={19} letterSpacing={3} fill={glow ? C.glow : C.muted}>
          ÜBERSICHT
        </text>
        <text x={26} y={86} fontFamily={HEAD} fontWeight={900} fontSize={31} letterSpacing={-0.5} fill={glow ? HELL : C.ink}>
          Ernährung &amp; Herz
        </text>
        <path d="M26 104 L274 104" stroke={ink(glow)} strokeWidth={3} />
        {markiert > 0 && <rect x={22} y={126} width={250 * markiert} height={30} rx={6} fill={C.yellow} opacity={0.9} />}
        <rect x={26} y={134} width={240} height={12} rx={6} fill={glow ? "rgba(143,216,255,0.5)" : "#5e5852"} />
        {[176, 200, 224, 248, 272, 296, 320, 344].map((y, i) => (
          <rect key={y} x={26} y={y} width={i % 3 === 2 ? 150 : 240} height={9} rx={4} fill={glow ? "rgba(143,216,255,0.4)" : C.line} />
        ))}
      </>
    )}
  </svg>
);
export const Zeitschrift: React.FC<P & { auf?: number; markiert?: number }> = ({ size = 360, glow, style, auf = 0, markiert = 0 }) => {
  const w = size;
  const h = (size * 4) / 3;
  const k = Math.cos(Math.PI * Math.min(1, Math.max(0, auf)));
  const schatten = glow ? {} : { boxShadow: `8px 8px 0 ${C.ink}` };
  return (
    <div style={{ position: "relative", width: 2 * w, height: h, transform: `translateX(${(-w / 2) * (1 - auf)}px)`, ...gl(glow), ...style }}>
      {auf > 0.01 && (
        <div style={{ position: "absolute", left: w, top: 0, width: w, height: h, borderRadius: 8, ...schatten }}>
          <Innen glow={glow} markiert={markiert} />
        </div>
      )}
      <div style={{ position: "absolute", left: w, top: 0, width: w, height: h, transformOrigin: "0 50%", transform: `scaleX(${Math.abs(k) < 0.002 ? 0.002 : k})`, borderRadius: 8, ...(k > 0 ? schatten : {}) }}>
        {k >= 0 ? <Umschlag glow={glow} /> : <Innen glow={glow} links />}
        {!glow && Math.abs(k) < 0.98 && <div style={{ position: "absolute", inset: 0, borderRadius: 8, background: `rgba(31,28,26,${0.28 * (1 - Math.abs(k))})` }} />}
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Akte (Mappe mit Reiter). viewBox 400 × 300 → Höhe = 0,75 × size. children = Text auf dem Etikett.
// ---------------------------------------------------------------------------
export const Akte: React.FC<P & { children?: React.ReactNode }> = ({ size = 600, glow, style, children }) => {
  const s = size / 400;
  return (
    <div style={{ position: "relative", width: size, height: size * 0.75, ...style }}>
      <svg width={size} height={size * 0.75} viewBox="0 0 400 300" style={{ overflow: "visible", position: "absolute", left: 0, top: 0, ...gl(glow) }}>
        <path d="M18 40 Q 18 30 28 30 L 138 30 L 160 56 L 372 56 Q 382 56 382 66 L 382 282 L 18 282 Z" fill={fill(glow, "#c99a4e")} stroke={ink(glow)} strokeWidth={7} strokeLinejoin="round" />
        <rect x={40} y={46} width={320} height={60} rx={4} fill={fill(glow, "#fffdf8")} stroke={ink(glow)} strokeWidth={4} />
        <path d="M18 92 L 382 92 L 382 282 L 18 282 Z" fill={fill(glow, "#e9c27a")} stroke={ink(glow)} strokeWidth={7} strokeLinejoin="round" />
        <rect x={56} y={118} width={288} height={142} rx={10} fill={fill(glow, "#fffdf8")} stroke={ink(glow)} strokeWidth={5} />
      </svg>
      <div style={{ position: "absolute", left: 56 * s, top: 118 * s, width: 288 * s, height: 142 * s, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>{children}</div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Alter Brief (Blatt mit Eselsohr). viewBox 200 × 240 → Höhe = 1,2 × size.
// ---------------------------------------------------------------------------
export const Brief: React.FC<P> = ({ size = 140, glow, style }) => (
  <svg width={size} height={size * 1.2} viewBox="0 0 200 240" style={{ overflow: "visible", ...gl(glow), ...style }}>
    <path d="M10 10 L150 10 L190 50 L190 230 L10 230 Z" fill={fill(glow, "#efe3c4")} stroke={ink(glow)} strokeWidth={7} strokeLinejoin="round" />
    <path d="M150 10 L150 50 L190 50" fill={fill(glow, "#dccb9f")} stroke={ink(glow)} strokeWidth={6} strokeLinejoin="round" />
    {[74, 100, 126, 152, 178].map((y, i) => (
      <path key={y} d={`M32 ${y} L${i === 4 ? 110 : 168} ${y}`} stroke={glow ? C.glow : "#9a8a66"} strokeWidth={7} strokeLinecap="round" opacity={0.8} />
    ))}
    <path d="M32 40 L110 40" stroke={glow ? C.glow : "#9a8a66"} strokeWidth={9} strokeLinecap="round" />
  </svg>
);

// ---------------------------------------------------------------------------
// Archivkarton. viewBox 400 × 300 → Höhe = 0,75 × size. etikett = Leuchtstärke des Etiketts (0..1).
// ---------------------------------------------------------------------------
export const Archivkarton: React.FC<P & { etikett?: number; text?: string }> = ({ size = 360, glow, style, etikett = 0, text = "ARCHIV" }) => {
  const AMBER = "#ffb82e";
  return (
    <svg width={size} height={size * 0.75} viewBox="0 0 400 300" style={{ overflow: "visible", ...gl(glow), ...style }}>
      <path d="M30 60 L370 60 L370 290 L30 290 Z" fill={fill(glow, "#c9a26a")} stroke={ink(glow)} strokeWidth={8} strokeLinejoin="round" />
      <path d="M18 30 L382 30 L382 72 L18 72 Z" fill={fill(glow, "#b58a52")} stroke={ink(glow)} strokeWidth={8} strokeLinejoin="round" />
      <rect x={130} y={120} width={140} height={70} rx={8} fill={etikett > 0 ? `rgba(255,184,46,${0.18 + 0.5 * etikett})` : fill(glow, "#fffdf8")} stroke={etikett > 0.5 ? AMBER : ink(glow)} strokeWidth={6} />
      <text x={200} y={167} textAnchor="middle" fontFamily={MONO} fontWeight={700} fontSize={30} letterSpacing={3} fill={etikett > 0.5 ? (glow ? C.navyOut : C.ink) : glow ? C.glow : C.ink}>
        {text}
      </text>
      <rect x={168} y={226} width={64} height={22} rx={11} fill={glow ? "rgba(26,33,56,0.9)" : "#5e4a2e"} stroke={ink(glow)} strokeWidth={5} />
    </svg>
  );
};

// ---------------------------------------------------------------------------
// Drei generische Packungen (ohne Marke) für den Übertrag.
// ---------------------------------------------------------------------------
/** Cremetiegel. viewBox 200 × 200. */
export const Cremetiegel: React.FC<P> = ({ size = 160, glow, style }) => (
  <svg width={size} height={size} viewBox="0 0 200 200" style={{ overflow: "visible", ...gl(glow), ...style }}>
    <rect x={30} y={40} width={140} height={44} rx={12} fill={fill(glow, "#c9b6e4")} stroke={ink(glow)} strokeWidth={7} />
    <path d="M38 84 L162 84 L156 176 Q 154 186 144 186 L56 186 Q 46 186 44 176 Z" fill={fill(glow, "#ffffff")} stroke={ink(glow)} strokeWidth={7} strokeLinejoin="round" />
    <rect x={52} y={110} width={96} height={46} rx={8} fill={fill(glow, "#efe6f7")} stroke={ink(glow)} strokeWidth={5} />
    <path d="M66 126 L134 126 M66 142 L114 142" stroke={glow ? C.glow : "#9b86c0"} strokeWidth={6} strokeLinecap="round" />
    <path d="M44 54 L44 70" stroke="#ffffff" strokeWidth={6} strokeLinecap="round" opacity={0.7} />
  </svg>
);
/** Müslipackung mit Schale. viewBox 160 × 220. */
export const Muesli: React.FC<P> = ({ size = 160, glow, style }) => (
  <svg width={size * 0.73} height={size} viewBox="0 0 160 220" style={{ overflow: "visible", ...gl(glow), ...style }}>
    <path d="M14 30 L146 30 L146 212 L14 212 Z" fill={fill(glow, "#f0a24a")} stroke={ink(glow)} strokeWidth={7} strokeLinejoin="round" />
    <path d="M14 30 L30 8 L130 8 L146 30" fill={fill(glow, "#d9883a")} stroke={ink(glow)} strokeWidth={6} strokeLinejoin="round" />
    <rect x={30} y={46} width={100} height={30} rx={6} fill={fill(glow, "#fffdf8")} stroke={ink(glow)} strokeWidth={5} />
    <path d="M30 140 Q 80 196 130 140 Z" fill={fill(glow, "#ffffff")} stroke={ink(glow)} strokeWidth={6} strokeLinejoin="round" />
    {[
      [52, 132],
      [66, 124],
      [80, 130],
      [94, 122],
      [108, 132],
      [72, 136],
      [100, 138],
    ].map(([x, y], i) => (
      <circle key={i} cx={x} cy={y} r={7} fill={i % 2 ? "#c47a2c" : "#e0483b"} stroke={ink(glow)} strokeWidth={3} />
    ))}
  </svg>
);
/** Zahnpastatube (stehend, Kappe unten). viewBox 140 × 220. */
export const Zahnpasta: React.FC<P> = ({ size = 160, glow, style }) => (
  <svg width={size * 0.64} height={size} viewBox="0 0 140 220" style={{ overflow: "visible", ...gl(glow), ...style }}>
    <path d="M20 12 L120 12 L112 170 L28 170 Z" fill={fill(glow, "#ffffff")} stroke={ink(glow)} strokeWidth={7} strokeLinejoin="round" />
    <path d="M20 12 L120 12 L120 28 L20 28 Z" fill={fill(glow, C.steel)} stroke={ink(glow)} strokeWidth={6} />
    <path d="M30 70 L110 70 L108 96 L32 96 Z" fill={fill(glow, "#4d7fd1")} stroke="none" />
    <path d="M32 110 L108 110 L107 124 L33 124 Z" fill={fill(glow, C.red)} stroke="none" />
    <rect x={46} y={170} width={48} height={42} rx={8} fill={fill(glow, "#4d7fd1")} stroke={ink(glow)} strokeWidth={7} />
  </svg>
);

// ---------------------------------------------------------------------------
// Anhänger (Etikett mit Loch), Text als HTML. Breite size, Höhe 0,46 · size.
// ---------------------------------------------------------------------------
export const Anhaenger23: React.FC<{ size?: number; text: string; bg?: string; fg?: string; style?: React.CSSProperties }> = ({ size = 280, text, bg = C.red, fg = "#fff", style }) => (
  <div style={{ position: "relative", width: size, height: size * 0.46, ...style }}>
    <svg width={size} height={size * 0.46} viewBox="0 0 300 138" style={{ position: "absolute", left: 0, top: 0, overflow: "visible", filter: `drop-shadow(6px 6px 0 ${C.ink})` }}>
      <path d="M62 8 L290 8 L290 130 L62 130 L10 69 Z" fill={bg} stroke={C.ink} strokeWidth={7} strokeLinejoin="round" />
      <circle cx={52} cy={69} r={11} fill={C.paper} stroke={C.ink} strokeWidth={5} />
    </svg>
    <div style={{ position: "absolute", left: size * 0.24, right: size * 0.04, top: 0, bottom: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: HEAD, fontWeight: 900, fontSize: Math.min(size * 0.2, (size * 0.66) / (text.length * 0.6)), letterSpacing: 1, color: fg }}>
      {text}
    </div>
  </div>
);
