// Illustrationen Folge 15 (Der Einkaufswagen). Gleicher Stil wie icons.tsx; glow = Röntgen-Fassung.
import React from "react";
import { C, HEAD } from "../../basis/lib";

type P = { size?: number; glow?: boolean; style?: React.CSSProperties };
const ink = (g?: boolean) => (g ? C.glow : C.ink);
const fill = (g: boolean | undefined, f: string) => (g ? "rgba(143,216,255,0.2)" : f);
const gl = (g?: boolean): React.CSSProperties => (g ? { filter: "drop-shadow(0 0 14px rgba(143,216,255,0.45)) drop-shadow(0 0 3px rgba(143,216,255,0.8))" } : {});
const SKIN = "#e8b48f";
const WIRE = "rgba(255,255,255,0.45)";

/** Früher Einkaufswagen (1937er Bauart): Klappstuhl-Gestell, zwei Drahtkörbe übereinander, vier Räder. Blick nach rechts, Griff links.
 *  inhalt = Zahl der Waren (0..6), dreh = Raddrehung in Grad. */
export const Wagen: React.FC<P & { inhalt?: number; dreh?: number; web?: number }> = ({ size = 600, glow, style, inhalt = 0, dreh = 0, web = 0 }) => {
  const wire = (x0: number, y0: number, x1: number, y1: number, xb0: number, xb1: number, yb: number, nv: number, nh: number) => {
    const L: React.ReactNode[] = [];
    for (let i = 1; i < nv; i++) {
      const k = i / nv;
      L.push(<line key={"v" + i} x1={x0 + (x1 - x0) * k} y1={y0} x2={xb0 + (xb1 - xb0) * k} y2={yb} />);
    }
    for (let j = 1; j < nh; j++) {
      const k = j / nh;
      const y = y0 + (yb - y0) * k;
      L.push(<line key={"h" + j} x1={x0 + (xb0 - x0) * k} y1={y} x2={x1 + (xb1 - x1) * k} y2={y} />);
    }
    return L;
  };
  const waren = [
    { x: 150, y: 150, c: C.red, k: "kreis", r: 26 },
    { x: 215, y: 138, c: C.yellow, k: "box", r: 30 },
    { x: 280, y: 146, c: C.green, k: "kreis", r: 24 },
    { x: 335, y: 150, c: "#4d7fd1", k: "box", r: 26 },
    { x: 180, y: 300, c: C.yellow, k: "kreis", r: 24 },
    { x: 262, y: 296, c: C.red, k: "box", r: 26 },
  ];
  const rad = (cx: number, cy: number, far?: boolean) => (
    <g opacity={far ? 0.55 : 1}>
      <circle cx={cx} cy={cy} r={27} fill={fill(glow, "#3b4049")} stroke={ink(glow)} strokeWidth={8} />
      <g transform={`rotate(${dreh} ${cx} ${cy})`}>
        <line x1={cx - 17} y1={cy} x2={cx + 17} y2={cy} stroke={glow ? C.glow : "#e9ecef"} strokeWidth={5} strokeLinecap="round" />
        <line x1={cx} y1={cy - 17} x2={cx} y2={cy + 17} stroke={glow ? C.glow : "#e9ecef"} strokeWidth={5} strokeLinecap="round" />
      </g>
    </g>
  );
  return (
    <svg width={size} height={size * 0.98} viewBox="0 0 440 430" style={{ overflow: "visible", ...gl(glow), ...style }}>
      {rad(142, 384, true)}
      {rad(362, 384, true)}
      {/* Klappstuhl-Gestell (X) */}
      <path d="M110 240 L 340 390 M 340 240 L 110 390" stroke={ink(glow)} strokeWidth={11} strokeLinecap="round" fill="none" />
      {/* unterer Korb */}
      <path d="M118 285 L 338 285 L 322 362 L 134 362 Z" fill={fill(glow, WIRE)} stroke={ink(glow)} strokeWidth={8} strokeLinejoin="round" />
      <g stroke={ink(glow)} strokeWidth={3} opacity={0.5}>{wire(118, 285, 338, 285, 134, 322, 362, 7, 3)}</g>
      {/* obere Körbe: Inhalt */}
      {waren.slice(0, Math.min(inhalt, 4)).map((w, i) =>
        w.k === "kreis" ? (
          <circle key={i} cx={w.x} cy={w.y + 20} r={w.r} fill={fill(glow, w.c)} stroke={ink(glow)} strokeWidth={6} />
        ) : (
          <rect key={i} x={w.x - w.r} y={w.y - w.r + 22} width={w.r * 2} height={w.r * 2} rx={6} fill={fill(glow, w.c)} stroke={ink(glow)} strokeWidth={6} />
        )
      )}
      {waren.slice(4, Math.max(4, inhalt)).map((w, i) =>
        w.k === "kreis" ? (
          <circle key={"u" + i} cx={w.x} cy={w.y} r={w.r} fill={fill(glow, w.c)} stroke={ink(glow)} strokeWidth={6} />
        ) : (
          <rect key={"u" + i} x={w.x - w.r} y={w.y - w.r} width={w.r * 2} height={w.r * 2} rx={6} fill={fill(glow, w.c)} stroke={ink(glow)} strokeWidth={6} />
        )
      )}
      {/* oberer Korb */}
      <path d="M86 150 L 372 150 L 346 258 L 112 258 Z" fill={fill(glow, WIRE)} stroke={ink(glow)} strokeWidth={9} strokeLinejoin="round" />
      <g stroke={ink(glow)} strokeWidth={3.5} opacity={0.5}>{wire(86, 150, 372, 150, 112, 346, 258, 10, 3)}</g>
      {/* Griff */}
      <path d="M92 150 L 56 64 L 168 64" fill="none" stroke={ink(glow)} strokeWidth={11} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M62 64 L 160 64" stroke={glow ? C.glow : C.red} strokeWidth={11} strokeLinecap="round" />
      {rad(110, 408)}
      {rad(340, 408)}
      {/* Spinnweben am Griff */}
      {web > 0 && (
        <g stroke={glow ? C.glow : C.muted} strokeWidth={3} fill="none" opacity={web * 0.9} strokeLinecap="round">
          <path d="M56 64 L 56 150 M56 64 L 130 112 M 56 64 L 150 64" />
          <path d="M56 100 Q 76 100 76 82 M 56 130 Q 100 128 112 100" />
        </g>
      )}
    </svg>
  );
};

/** Figur ganzer Körper. Fußlinie bei y = size * (292/300). arm: hang (Korb), vor (schiebt), none. */
export const Figur: React.FC<
  P & { farbe?: string; kleid?: boolean; hut?: boolean; hutFarbe?: string; arm?: "hang" | "vor" | "none"; haar?: string; rot?: number }
> = ({ size = 300, glow, style, farbe = "#4d7fd1", kleid, hut, hutFarbe = C.red, arm = "none", haar = "#5a4636", rot = 0 }) => (
  <svg width={size * 0.5} height={size} viewBox="0 0 150 300" style={{ overflow: "visible", ...gl(glow), ...style }}>
    {/* Beine */}
    {kleid ? (
      <>
        <rect x={52} y={230} width={14} height={58} rx={5} fill={fill(glow, SKIN)} stroke={ink(glow)} strokeWidth={6} />
        <rect x={84} y={230} width={14} height={58} rx={5} fill={fill(glow, SKIN)} stroke={ink(glow)} strokeWidth={6} />
      </>
    ) : (
      <>
        <rect x={44} y={190} width={24} height={98} rx={7} fill={fill(glow, "#2f3542")} stroke={ink(glow)} strokeWidth={6} />
        <rect x={82} y={190} width={24} height={98} rx={7} fill={fill(glow, "#2f3542")} stroke={ink(glow)} strokeWidth={6} />
      </>
    )}
    {/* Körper */}
    {kleid ? (
      <path d="M48 102 L 102 102 L 130 240 L 20 240 Z" fill={fill(glow, farbe)} stroke={ink(glow)} strokeWidth={7} strokeLinejoin="round" />
    ) : (
      <path d="M36 106 Q 36 98 48 98 L 102 98 Q 114 98 114 106 L 112 216 L 38 216 Z" fill={fill(glow, farbe)} stroke={ink(glow)} strokeWidth={7} strokeLinejoin="round" />
    )}
    {/* Kopf */}
    <circle cx={75} cy={62} r={32} fill={fill(glow, SKIN)} stroke={ink(glow)} strokeWidth={7} />
    <path d="M44 56 Q 46 26 76 26 Q 106 26 106 56 Q 92 40 76 40 Q 58 40 44 56 Z" fill={fill(glow, haar)} stroke={ink(glow)} strokeWidth={5} strokeLinejoin="round" />
    {rot > 0 && <circle cx={95} cy={74} r={9} fill={C.red} opacity={0.5 * rot} />}
    {hut && (
      <>
        <ellipse cx={75} cy={34} rx={56} ry={10} fill={fill(glow, kleid ? hutFarbe : "#2f3542")} stroke={ink(glow)} strokeWidth={6} />
        <path d="M48 32 Q 48 2 75 2 Q 102 2 102 32 Z" fill={fill(glow, kleid ? hutFarbe : "#2f3542")} stroke={ink(glow)} strokeWidth={6} strokeLinejoin="round" />
        <path d="M50 24 L 100 24" stroke={glow ? C.glow : "#fff"} strokeWidth={5} opacity={0.8} />
      </>
    )}
    {/* Arm */}
    {arm === "hang" && (
      <>
        <path d="M108 112 L 124 196" stroke={ink(glow)} strokeWidth={22} strokeLinecap="round" />
        <path d="M108 112 L 124 196" stroke={fill(glow, farbe)} strokeWidth={10} strokeLinecap="round" />
        <circle cx={125} cy={204} r={11} fill={fill(glow, SKIN)} stroke={ink(glow)} strokeWidth={5} />
      </>
    )}
    {arm === "vor" && (
      <>
        <path d="M100 116 L 156 166" stroke={ink(glow)} strokeWidth={22} strokeLinecap="round" />
        <path d="M100 116 L 156 166" stroke={fill(glow, farbe)} strokeWidth={10} strokeLinecap="round" />
        <circle cx={160} cy={170} r={11} fill={fill(glow, SKIN)} stroke={ink(glow)} strokeWidth={5} />
      </>
    )}
  </svg>
);

/** Schweißtropfen (um den Kopf, p = 0..1 Fall). */
export const Schweiss: React.FC<{ size?: number; p?: number }> = ({ size = 110, p = 1 }) => (
  <svg width={size} height={size} viewBox="0 0 110 110" style={{ overflow: "visible" }}>
    {[
      { x: 12, y: 30, d: 0 },
      { x: 52, y: 8, d: 0.25 },
      { x: 92, y: 34, d: 0.5 },
    ].map((d, i) => {
      const k = Math.max(0, Math.min(1, p * 1.6 - d.d));
      return (
        <path
          key={i}
          d={`M${d.x} ${d.y + 28 * k} q -12 18 0 24 q 12 -6 0 -24 z`}
          fill="#8fd8ff"
          stroke={C.ink}
          strokeWidth={4}
          strokeLinejoin="round"
          opacity={Math.min(1, k * 3) * (1 - 0.5 * k)}
        />
      );
    })}
  </svg>
);

/** Handkorb (Weidenkorb mit Bügel); voll = Waren sichtbar. */
export const Handkorb: React.FC<P & { voll?: boolean }> = ({ size = 200, glow, style, voll = true }) => (
  <svg width={size} height={size * 0.85} viewBox="0 0 200 170" style={{ overflow: "visible", ...gl(glow), ...style }}>
    <path d="M44 74 Q 44 6 100 6 Q 156 6 156 74" fill="none" stroke={ink(glow)} strokeWidth={9} strokeLinecap="round" />
    {voll && (
      <>
        <circle cx={66} cy={66} r={22} fill={fill(glow, C.red)} stroke={ink(glow)} strokeWidth={5} />
        <rect x={92} y={34} width={30} height={50} rx={7} fill={fill(glow, C.green)} stroke={ink(glow)} strokeWidth={5} />
        <ellipse cx={138} cy={66} rx={26} ry={16} fill={fill(glow, "#e0b25a")} stroke={ink(glow)} strokeWidth={5} />
      </>
    )}
    <path d="M18 78 L 182 78 L 160 154 L 40 154 Z" fill={fill(glow, "#d9a867")} stroke={ink(glow)} strokeWidth={8} strokeLinejoin="round" />
    <path d="M30 104 L 170 104 M 36 128 L 164 128 M 70 78 L 64 154 M 100 78 L 100 154 M 130 78 L 136 154" stroke={ink(glow)} strokeWidth={3.5} opacity={0.45} />
  </svg>
);

/** Kinderwagen (Silhouette mit Verdeck). */
export const Kinderwagen: React.FC<P> = ({ size = 260, glow, style }) => (
  <svg width={size} height={size * 0.92} viewBox="0 0 260 240" style={{ overflow: "visible", ...gl(glow), ...style }}>
    <path d="M30 100 Q 30 24 112 24 Q 140 24 142 100 Z" fill={fill(glow, C.sky)} stroke={ink(glow)} strokeWidth={8} strokeLinejoin="round" />
    <path d="M26 100 L 214 100 Q 214 168 150 170 L 86 170 Q 28 168 26 100 Z" fill={fill(glow, "#ffffff")} stroke={ink(glow)} strokeWidth={8} strokeLinejoin="round" />
    <path d="M214 100 L 236 44 L 252 44" fill="none" stroke={ink(glow)} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M60 170 L 60 190 M 180 170 L 180 190" stroke={ink(glow)} strokeWidth={7} />
    <circle cx={64} cy={198} r={28} fill={fill(glow, "#3b4049")} stroke={ink(glow)} strokeWidth={8} />
    <circle cx={184} cy={198} r={28} fill={fill(glow, "#3b4049")} stroke={ink(glow)} strokeWidth={8} />
    <circle cx={64} cy={198} r={7} fill={glow ? C.glow : "#e9ecef"} />
    <circle cx={184} cy={198} r={7} fill={glow ? C.glow : "#e9ecef"} />
  </svg>
);

/** Regal mit Waren (Ladengang). */
export const Regal: React.FC<P> = ({ size = 400, glow, style }) => {
  const reihe = (y: number, cols: string[]) =>
    cols.map((c, i) => (
      <rect key={i} x={30 + i * 52} y={y - 40 - (i % 3) * 6} width={40} height={40 + (i % 3) * 6} rx={5} fill={fill(glow, c)} stroke={ink(glow)} strokeWidth={4} />
    ));
  return (
    <svg width={size} height={size * 0.75} viewBox="0 0 400 300" style={{ overflow: "visible", ...gl(glow), ...style }}>
      <rect x={8} y={8} width={384} height={288} rx={8} fill={fill(glow, "#f6f3ec")} stroke={ink(glow)} strokeWidth={8} />
      {reihe(100, [C.red, C.yellow, C.sky, C.green, C.red, "#e0b25a", C.sky])}
      {reihe(196, [C.yellow, C.green, C.red, "#4d7fd1", C.yellow, C.green, C.red])}
      {reihe(288 - 8, [C.sky, C.red, C.yellow, C.green, "#e0b25a", C.red, C.sky])}
      <path d="M8 102 L 392 102 M 8 198 L 392 198" stroke={ink(glow)} strokeWidth={7} />
    </svg>
  );
};

/** Münzstapel: n = 0..10 Münzen. */
export const Muenzen: React.FC<P & { n?: number }> = ({ size = 360, glow, style, n = 10 }) => {
  const k = Math.max(0, Math.min(10, Math.round(n)));
  return (
    <svg width={size * 0.7} height={size} viewBox="0 0 252 360" style={{ overflow: "visible", ...gl(glow), ...style }}>
      {Array.from({ length: k }).map((_, i) => {
        const y = 320 - i * 28;
        const dx = i % 2 ? 6 : -4;
        return (
          <g key={i}>
            <path d={`M${26 + dx} ${y} v 22 a 100 28 0 0 0 200 0 v -22 z`} fill={fill(glow, "#e0b030")} stroke={ink(glow)} strokeWidth={6} strokeLinejoin="round" />
            <ellipse cx={126 + dx} cy={y} rx={100} ry={28} fill={fill(glow, C.yellow)} stroke={ink(glow)} strokeWidth={6} />
            <ellipse cx={126 + dx} cy={y} rx={70} ry={17} fill="none" stroke={ink(glow)} strokeWidth={3} opacity={0.35} />
          </g>
        );
      })}
      {k >= 10 && <text x={126} y={320 - 9 * 28 + 12} textAnchor="middle" fontFamily={HEAD} fontWeight={900} fontSize={44} fill={ink(glow)} opacity={0.7}>€</text>}
    </svg>
  );
};

/** Bar von vorn: Theke, Hocker; voll = Gäste und Gläser. */
export const Bar: React.FC<P & { voll?: boolean }> = ({ size = 260, glow, style, voll }) => (
  <svg width={size} height={size * 0.8} viewBox="0 0 260 208" style={{ overflow: "visible", ...gl(glow), ...style }}>
    <rect x={10} y={10} width={240} height={44} rx={6} fill={fill(glow, "#8a6a4a")} stroke={ink(glow)} strokeWidth={6} opacity={0.9} />
    {[0, 1, 2].map((i) => (
      <rect key={i} x={30 + i * 70} y={18} width={18} height={26} rx={4} fill={fill(glow, i === 1 ? C.green : C.sky)} stroke={ink(glow)} strokeWidth={4} />
    ))}
    {voll &&
      [48, 112, 176, 226].map((x, i) => (
        <g key={i}>
          <circle cx={x} cy={82} r={19} fill={fill(glow, SKIN)} stroke={ink(glow)} strokeWidth={5} />
          <path d={`M${x - 26} 142 Q ${x - 26} 102 ${x} 102 Q ${x + 26} 102 ${x + 26} 142 Z`} fill={fill(glow, ["#4d7fd1", C.red, C.green, C.yellow][i])} stroke={ink(glow)} strokeWidth={5} strokeLinejoin="round" />
        </g>
      ))}
    <rect x={6} y={140} width={248} height={22} rx={6} fill={fill(glow, "#b98a5e")} stroke={ink(glow)} strokeWidth={6} />
    {[40, 110, 180, 232].map((x, i) => (
      <g key={i}>
        <ellipse cx={x} cy={176} rx={22} ry={8} fill={fill(glow, C.steel)} stroke={ink(glow)} strokeWidth={5} />
        <path d={`M${x} 184 L ${x} 204`} stroke={ink(glow)} strokeWidth={6} strokeLinecap="round" />
      </g>
    ))}
  </svg>
);

/** Bäckerei-Front mit Markise. */
export const Baecker: React.FC<P> = ({ size = 220, glow, style }) => (
  <svg width={size} height={size * 0.82} viewBox="0 0 220 180" style={{ overflow: "visible", ...gl(glow), ...style }}>
    <rect x={14} y={70} width={192} height={102} fill={fill(glow, "#fff")} stroke={ink(glow)} strokeWidth={7} />
    <path d="M6 70 L 22 22 L 198 22 L 214 70 Z" fill={fill(glow, "#f1c94a")} stroke={ink(glow)} strokeWidth={7} strokeLinejoin="round" />
    <path d="M56 22 L 50 70 M 95 22 L 92 70 M 132 22 L 132 70 M 170 22 L 174 70" stroke={glow ? C.glow : "#fff"} strokeWidth={9} />
    <rect x={28} y={92} width={80} height={56} rx={6} fill={fill(glow, C.sky)} stroke={ink(glow)} strokeWidth={5} />
    <ellipse cx={52} cy={128} rx={18} ry={10} fill={fill(glow, "#e0b25a")} stroke={ink(glow)} strokeWidth={4} />
    <ellipse cx={86} cy={128} rx={18} ry={10} fill={fill(glow, "#e0b25a")} stroke={ink(glow)} strokeWidth={4} />
    <rect x={132} y={92} width={56} height={80} fill={fill(glow, "#8a6a4a")} stroke={ink(glow)} strokeWidth={5} />
  </svg>
);

/** Trinkgeldglas; scheine = 0..4 Banknoten. */
export const Glas: React.FC<P & { scheine?: number }> = ({ size = 220, glow, style, scheine = 4 }) => (
  <svg width={size * 0.8} height={size} viewBox="0 0 176 220" style={{ overflow: "visible", ...gl(glow), ...style }}>
    {[
      { x: 42, y: 66, r: -14 },
      { x: 78, y: 56, r: 10 },
      { x: 56, y: 90, r: 4 },
      { x: 90, y: 100, r: -8 },
    ]
      .slice(0, scheine)
      .map((b, i) => (
        <g key={i} transform={`rotate(${b.r} ${b.x + 36} ${b.y + 22})`}>
          <rect x={b.x} y={b.y} width={72} height={44} rx={5} fill={fill(glow, i % 2 ? "#8fcf9f" : "#6fbf85")} stroke={ink(glow)} strokeWidth={5} />
          <circle cx={b.x + 36} cy={b.y + 22} r={11} fill="none" stroke={ink(glow)} strokeWidth={4} opacity={0.6} />
        </g>
      ))}
    <path d="M24 30 L 152 30 L 144 196 Q 143 208 130 208 L 46 208 Q 33 208 32 196 Z" fill={glow ? "rgba(143,216,255,0.12)" : "rgba(191,224,244,0.35)"} stroke={ink(glow)} strokeWidth={7} strokeLinejoin="round" />
    <circle cx={64} cy={186} r={11} fill={fill(glow, C.yellow)} stroke={ink(glow)} strokeWidth={4} />
    <circle cx={96} cy={190} r={11} fill={fill(glow, C.yellow)} stroke={ink(glow)} strokeWidth={4} />
    <circle cx={122} cy={180} r={10} fill={fill(glow, C.yellow)} stroke={ink(glow)} strokeWidth={4} />
    <rect x={18} y={20} width={140} height={14} rx={6} fill={fill(glow, C.steel)} stroke={ink(glow)} strokeWidth={5} />
  </svg>
);

// --- Nachbesserung 20.10.2026 (Stimme Arthur) ---------------------------------------------------------

/** Umbau Klappstuhl → Wagen in derselben Geometrie wie `Wagen` (viewBox 440×430).
 *  stuhl = Sitz/Lehne sichtbar (1) … weg (0), korb = 0..1 Fall der zwei Drahtkörbe, rad = 0..1 Räder, griff = 0..1 roter Griff. */
export const Umbau: React.FC<P & { stuhl?: number; korb?: number; rad?: number; griff?: number }> = ({ size = 600, glow, style, stuhl = 1, korb = 0, rad = 0, griff = 0 }) => {
  const k1 = Math.max(0, Math.min(1, korb * 1.6));
  const k2 = Math.max(0, Math.min(1, korb * 1.6 - 0.6));
  const r = Math.max(0, rad);
  const radG = (cx: number, cy: number, far?: boolean) =>
    r > 0.01 ? (
      <g opacity={far ? 0.55 : 1} transform={`translate(${cx} ${cy}) scale(${r}) translate(${-cx} ${-cy})`}>
        <circle cx={cx} cy={cy} r={27} fill={fill(glow, "#3b4049")} stroke={ink(glow)} strokeWidth={8} />
        <line x1={cx - 17} y1={cy} x2={cx + 17} y2={cy} stroke={glow ? C.glow : "#e9ecef"} strokeWidth={5} strokeLinecap="round" />
      </g>
    ) : null;
  return (
    <svg width={size} height={size * 0.98} viewBox="0 0 440 430" style={{ overflow: "visible", ...gl(glow), ...style }}>
      {radG(142, 384, true)}
      {radG(362, 384, true)}
      {/* Klappstuhl-Gestell (X) – bleibt */}
      <path d="M110 240 L 340 390 M 340 240 L 110 390" stroke={ink(glow)} strokeWidth={11} strokeLinecap="round" fill="none" />
      {/* Füße des Stuhls (ohne Räder) */}
      <g opacity={1 - r}>
        <path d="M96 392 L 124 392 M 326 392 L 354 392" stroke={ink(glow)} strokeWidth={10} strokeLinecap="round" />
      </g>
      {/* Lehne → wird zum Griff */}
      <path d="M110 240 L 92 150 L 56 64" fill="none" stroke={ink(glow)} strokeWidth={11} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M56 64 L 168 64" stroke={ink(glow)} strokeWidth={11} strokeLinecap="round" opacity={griff} />
      <path d="M62 64 L 160 64" stroke={glow ? C.glow : C.red} strokeWidth={11} strokeLinecap="round" opacity={griff} />
      {/* Sitzfläche (Holz) */}
      <g opacity={stuhl}>
        <rect x={100} y={226} width={250} height={26} rx={8} fill={fill(glow, "#c9935a")} stroke={ink(glow)} strokeWidth={8} />
        <path d="M60 80 L 104 210" stroke={fill(glow, "#c9935a")} strokeWidth={20} strokeLinecap="round" />
      </g>
      {/* unterer Korb fällt */}
      {k2 > 0.01 && (
        <g transform={`translate(0 ${-(1 - k2) * 420})`} opacity={Math.min(1, k2 * 3)}>
          <path d="M118 285 L 338 285 L 322 362 L 134 362 Z" fill={fill(glow, WIRE)} stroke={ink(glow)} strokeWidth={8} strokeLinejoin="round" />
          <path d="M150 285 L 158 362 M 190 285 L 194 362 M 230 285 L 230 362 M 270 285 L 266 362 M 306 285 L 300 362 M 124 318 L 332 318" stroke={ink(glow)} strokeWidth={3} opacity={0.5} />
        </g>
      )}
      {/* oberer Korb fällt */}
      {k1 > 0.01 && (
        <g transform={`translate(0 ${-(1 - k1) * 420})`} opacity={Math.min(1, k1 * 3)}>
          <path d="M86 150 L 372 150 L 346 258 L 112 258 Z" fill={fill(glow, WIRE)} stroke={ink(glow)} strokeWidth={9} strokeLinejoin="round" />
          <path d="M120 150 L 140 258 M 160 150 L 174 258 M 200 150 L 208 258 M 240 150 L 242 258 M 280 150 L 276 258 M 320 150 L 310 258 M 96 194 L 362 194 M 104 228 L 354 228" stroke={ink(glow)} strokeWidth={3.5} opacity={0.5} />
        </g>
      )}
      {radG(110, 408)}
      {radG(340, 408)}
    </svg>
  );
};

/** Münze (Draufsicht, schräg). */
export const Muenze: React.FC<P> = ({ size = 70, glow, style }) => (
  <svg width={size} height={size} viewBox="0 0 70 70" style={{ overflow: "visible", ...gl(glow), ...style }}>
    <circle cx={35} cy={35} r={30} fill={fill(glow, C.yellow)} stroke={ink(glow)} strokeWidth={6} />
    <circle cx={35} cy={35} r={19} fill="none" stroke={ink(glow)} strokeWidth={3} opacity={0.4} />
    <text x={35} y={46} textAnchor="middle" fontFamily={HEAD} fontWeight={900} fontSize={30} fill={ink(glow)} opacity={0.75}>$</text>
  </svg>
);

/** Geldschein. */
export const Schein: React.FC<P> = ({ size = 160, glow, style }) => (
  <svg width={size} height={size * 0.55} viewBox="0 0 160 88" style={{ overflow: "visible", ...gl(glow), ...style }}>
    <rect x={4} y={4} width={152} height={80} rx={8} fill={fill(glow, "#8fcf9f")} stroke={ink(glow)} strokeWidth={6} />
    <circle cx={80} cy={44} r={20} fill="none" stroke={ink(glow)} strokeWidth={5} opacity={0.6} />
    <text x={80} y={56} textAnchor="middle" fontFamily={HEAD} fontWeight={900} fontSize={32} fill={ink(glow)} opacity={0.7}>$</text>
  </svg>
);

/** Ladentür (Eingang) mit Glasfenster. */
export const Tuer: React.FC<P & { offen?: number }> = ({ size = 360, glow, style, offen = 0 }) => (
  <svg width={size * 0.62} height={size} viewBox="0 0 223 360" style={{ overflow: "visible", ...gl(glow), ...style }}>
    <rect x={6} y={6} width={211} height={348} rx={6} fill={fill(glow, "#3b4049")} stroke={ink(glow)} strokeWidth={8} />
    <g transform={`translate(18 18) scale(${1 - 0.55 * offen} 1)`}>
      <rect x={0} y={0} width={187} height={336} rx={4} fill={fill(glow, "#c9935a")} stroke={ink(glow)} strokeWidth={7} />
      <rect x={22} y={24} width={143} height={150} rx={6} fill={glow ? "rgba(143,216,255,0.15)" : "rgba(191,224,244,0.8)"} stroke={ink(glow)} strokeWidth={6} />
      <circle cx={160} cy={210} r={9} fill={fill(glow, C.yellow)} stroke={ink(glow)} strokeWidth={4} />
    </g>
  </svg>
);
