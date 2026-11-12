// Illustrationen Folge 02 (Akkordeon-Trick). Gleicher Stil wie icons.tsx; glow = Röntgen-Fassung.
import React from "react";
import { C } from "../../basis/lib";

type P = { size?: number; glow?: boolean; style?: React.CSSProperties };
const ink = (g?: boolean) => (g ? C.glow : C.ink);
const fill = (g: boolean | undefined, f: string) => (g ? "rgba(143,216,255,0.2)" : f);
const gl = (g?: boolean): React.CSSProperties => (g ? { filter: "drop-shadow(0 0 14px rgba(143,216,255,0.45)) drop-shadow(0 0 3px rgba(143,216,255,0.8))" } : {});

/** Akkordeon: zug 0 = zusammen, 1 = weit auseinander. */
export const Akkordeon: React.FC<P & { zug?: number }> = ({ size = 600, glow, style, zug = 0.5 }) => {
  const g = 62 + 46 * zug; // halber Abstand der Kästen
  const l = 240 - g;
  const r = 240 + g;
  const n = 9;
  const pleats = Array.from({ length: n + 1 }, (_, i) => l + (i * (r - l)) / n);
  return (
    <svg width={size} height={size * 0.62} viewBox="0 0 480 300" style={{ overflow: "visible", ...gl(glow), ...style }}>
      {/* Balg */}
      <rect x={l} y={38} width={r - l} height={224} fill={fill(glow, C.red)} stroke={ink(glow)} strokeWidth={8} />
      {pleats.slice(1, -1).map((x, i) => (
        <path key={i} d={`M${x} 38 L${x} 262`} stroke={ink(glow)} strokeWidth={7} />
      ))}
      {pleats.slice(0, -1).map((x, i) => (
        <rect key={i} x={x + 6} y={48} width={Math.max(2, (r - l) / n - 12)} height={14} fill={glow ? "rgba(143,216,255,0.35)" : "rgba(255,255,255,0.35)"} />
      ))}
      {/* linker Kasten (Bass) */}
      <rect x={l - 84} y={22} width={84} height={256} rx={16} fill={fill(glow, "#2f3542")} stroke={ink(glow)} strokeWidth={8} />
      {[0, 1, 2, 3].map((i) => (
        <circle key={i} cx={l - 42} cy={64 + i * 54} r={13} fill={glow ? C.glow : "#e9ecef"} stroke={ink(glow)} strokeWidth={4} />
      ))}
      {/* rechter Kasten (Tasten) */}
      <rect x={r} y={22} width={84} height={256} rx={16} fill={fill(glow, "#f6f3ec")} stroke={ink(glow)} strokeWidth={8} />
      {[0, 1, 2, 3, 4].map((i) => (
        <rect key={i} x={r + 22} y={46 + i * 44} width={40} height={26} rx={7} fill={glow ? "rgba(143,216,255,0.4)" : "#2f3542"} stroke={ink(glow)} strokeWidth={4} />
      ))}
    </svg>
  );
};

/** Weinflasche mit Etikett: fr = Trikolore (senkrecht), de = Schwarz-Rot-Gold (waagerecht). */
export const Flasche: React.FC<P & { land?: "fr" | "de" | "none"; hell?: boolean }> = ({ size = 220, glow, style, land = "none", hell = true }) => {
  const flaschenFarbe = glow ? "rgba(143,216,255,0.2)" : "#3c6b4a";
  return (
    <svg width={size * 0.4} height={size} viewBox="0 0 100 250" style={{ overflow: "visible", opacity: hell ? 1 : 0.5, ...gl(glow), ...style }}>
      <path d="M38 6 L62 6 L62 70 C 62 86, 90 96, 90 132 L90 232 Q 90 244 78 244 L22 244 Q 10 244 10 232 L10 132 C 10 96, 38 86, 38 70 Z" fill={flaschenFarbe} stroke={ink(glow)} strokeWidth={7} strokeLinejoin="round" />
      <rect x={36} y={4} width={28} height={26} rx={4} fill={fill(glow, "#8a1f2d")} stroke={ink(glow)} strokeWidth={6} />
      <rect x={18} y={140} width={64} height={70} rx={4} fill={glow ? "rgba(143,216,255,0.12)" : "#f6f3ec"} stroke={ink(glow)} strokeWidth={5} />
      {land === "fr" && (
        <g>
          <rect x={22} y={152} width={18.6} height={46} fill={glow ? C.glow : "#3b5bb5"} opacity={glow ? 0.9 : 1} />
          <rect x={40.6} y={152} width={18.6} height={46} fill={glow ? "#eaf7ff" : "#ffffff"} opacity={glow ? 0.6 : 1} />
          <rect x={59.2} y={152} width={18.6} height={46} fill={glow ? C.glow : C.red} opacity={glow ? 0.9 : 1} />
        </g>
      )}
      {land === "de" && (
        <g>
          <rect x={22} y={152} width={56} height={15.3} fill={glow ? C.glow : C.ink} opacity={glow ? 0.9 : 1} />
          <rect x={22} y={167.3} width={56} height={15.3} fill={glow ? "#eaf7ff" : C.red} opacity={glow ? 0.6 : 1} />
          <rect x={22} y={182.6} width={56} height={15.3} fill={glow ? C.glow : C.yellow} opacity={glow ? 0.9 : 1} />
        </g>
      )}
      <path d="M24 100 L24 128" stroke={glow ? C.glow : "#ffffff"} strokeWidth={6} strokeLinecap="round" opacity={0.5} />
    </svg>
  );
};

export const Note: React.FC<P & { farbe?: string }> = ({ size = 70, glow, style, farbe }) => (
  <svg width={size} height={size} viewBox="0 0 80 80" style={{ overflow: "visible", ...gl(glow), ...style }}>
    <ellipse cx={26} cy={60} rx={17} ry={13} fill={farbe ?? (glow ? C.glow : C.ink)} stroke={ink(glow)} strokeWidth={5} transform="rotate(-18 26 60)" />
    <path d="M41 56 L41 8 Q 52 22 70 22" fill="none" stroke={ink(glow)} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const Lautsprecher: React.FC<P & { puls?: number }> = ({ size = 300, glow, style, puls = 0 }) => (
  <svg width={size} height={size * 1.2} viewBox="0 0 200 240" style={{ overflow: "visible", ...gl(glow), ...style }}>
    <rect x={30} y={10} width={140} height={220} rx={22} fill={fill(glow, "#2f3542")} stroke={ink(glow)} strokeWidth={8} />
    <circle cx={100} cy={70} r={22} fill={fill(glow, "#8a93a0")} stroke={ink(glow)} strokeWidth={6} />
    <circle cx={100} cy={150} r={(48 + puls * 6)} fill={fill(glow, "#8a93a0")} stroke={ink(glow)} strokeWidth={7} />
    <circle cx={100} cy={150} r={(20 + puls * 4)} fill={glow ? C.glow : C.ink} />
  </svg>
);

export const Eiffel: React.FC<P & { zeichne?: number }> = ({ size = 300, glow, style, zeichne = 1 }) => {
  const col = glow ? C.glow : C.ink;
  const d = (s: string) => (
    <path d={s} fill="none" stroke={col} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - zeichne} />
  );
  return (
    <svg width={size * 0.6} height={size} viewBox="0 0 120 200" style={{ overflow: "visible", ...gl(glow), ...style }}>
      {d("M60 6 L60 40")}
      {d("M60 40 L46 100 L18 192 L40 192 L52 150 L68 150 L80 192 L102 192 L74 100 L60 40")}
      {d("M46 100 L74 100")}
      {d("M38 140 L82 140")}
      {d("M52 150 Q 60 124 68 150")}
      {d("M10 192 L110 192")}
    </svg>
  );
};

export const Ohr: React.FC<P> = ({ size = 260, glow, style }) => (
  <svg width={size * 0.75} height={size} viewBox="0 0 150 200" style={{ overflow: "visible", ...gl(glow), ...style }}>
    <path d="M76 8 C 22 8, 14 70, 34 104 C 44 124, 40 146, 50 164 C 62 190, 100 190, 106 154 C 112 124, 140 126, 138 78 C 136 34, 112 8, 76 8 Z" fill={fill(glow, "#e8b48f")} stroke={ink(glow)} strokeWidth={8} strokeLinejoin="round" />
    <path d="M76 40 C 48 40, 50 80, 66 96 C 78 110, 74 128, 84 140" fill="none" stroke={ink(glow)} strokeWidth={7} strokeLinecap="round" />
    <path d="M96 62 C 106 76, 100 92, 92 98" fill="none" stroke={ink(glow)} strokeWidth={6} strokeLinecap="round" />
  </svg>
);

export const Brot: React.FC<P> = ({ size = 160, glow, style }) => (
  <svg width={size} height={size * 0.62} viewBox="0 0 200 124" style={{ overflow: "visible", ...gl(glow), ...style }}>
    <path d="M14 96 C 6 40, 50 10, 100 10 C 150 10, 194 40, 186 96 Q 184 112 168 112 L 32 112 Q 16 112 14 96 Z" fill={fill(glow, "#d49a5a")} stroke={ink(glow)} strokeWidth={8} strokeLinejoin="round" />
    <path d="M58 34 L76 64 M96 26 L114 58 M136 34 L152 64" stroke={ink(glow)} strokeWidth={7} strokeLinecap="round" />
  </svg>
);

export const Glocke: React.FC<P & { schwing?: number }> = ({ size = 160, glow, style, schwing = 0 }) => (
  <svg width={size} height={size} viewBox="0 0 160 160" style={{ overflow: "visible", transform: `rotate(${schwing}deg)`, transformOrigin: "50% 8%", ...gl(glow), ...style }}>
    <circle cx={80} cy={14} r={9} fill={ink(glow)} />
    <path d="M80 22 C 36 22, 36 80, 28 118 L 132 118 C 124 80, 124 22, 80 22 Z" fill={fill(glow, C.yellow)} stroke={ink(glow)} strokeWidth={8} strokeLinejoin="round" />
    <path d="M18 120 L142 120" stroke={ink(glow)} strokeWidth={9} strokeLinecap="round" />
    <circle cx={80} cy={140} r={13} fill={fill(glow, C.red)} stroke={ink(glow)} strokeWidth={6} />
  </svg>
);

export const Wagen: React.FC<P> = ({ size = 520, glow, style }) => (
  <svg width={size} height={size * 0.8} viewBox="0 0 300 240" style={{ overflow: "visible", ...gl(glow), ...style }}>
    <path d="M10 14 L58 14 L84 160 L246 160" fill="none" stroke={ink(glow)} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M66 46 L286 46 L262 138 L84 138 Z" fill={fill(glow, "#dfe4ea")} stroke={ink(glow)} strokeWidth={8} strokeLinejoin="round" />
    <path d="M108 46 L116 138 M160 46 L162 138 M212 46 L208 138" stroke={ink(glow)} strokeWidth={5} />
    <circle cx={104} cy={200} r={22} fill={fill(glow, "#2f3542")} stroke={ink(glow)} strokeWidth={8} />
    <circle cx={230} cy={200} r={22} fill={fill(glow, "#2f3542")} stroke={ink(glow)} strokeWidth={8} />
  </svg>
);

/** Gedankenwolke mit Schwänzchen links unten. */
export const Blase: React.FC<P & { children?: React.ReactNode }> = ({ size = 520, glow, style, children }) => (
  <div style={{ position: "relative", width: size, height: size * 0.82, ...style }}>
    <svg width={size} height={size * 0.82} viewBox="0 0 500 410" style={{ position: "absolute", left: 0, top: 0, overflow: "visible", ...gl(glow) }}>
      <path d="M110 90 C 90 20, 190 -4, 230 30 C 270 -10, 380 4, 392 70 C 480 70, 500 180, 430 214 C 460 290, 380 340, 316 316 C 270 360, 190 352, 170 310 C 100 330, 40 280, 70 220 C 10 190, 30 100, 110 90 Z" fill={fill(glow, "#ffffff")} stroke={ink(glow)} strokeWidth={8} strokeLinejoin="round" />
      <circle cx={104} cy={364} r={24} fill={fill(glow, "#ffffff")} stroke={ink(glow)} strokeWidth={7} />
      <circle cx={52} cy={400} r={14} fill={fill(glow, "#ffffff")} stroke={ink(glow)} strokeWidth={6} />
    </svg>
    <div style={{ position: "absolute", left: 0, top: 0, width: size, height: size * 0.72, display: "flex", alignItems: "center", justifyContent: "center" }}>{children}</div>
  </div>
);
