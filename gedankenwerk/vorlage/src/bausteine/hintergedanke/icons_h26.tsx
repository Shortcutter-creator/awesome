// Illustrationen Folge 26 (Touchscreen und Handschuhe). Gleicher Stil wie icons.tsx; glow = Röntgen-Fassung.
// Keine Logos: Das Smartphone ist neutral (kein Marke-Logo), der Redner nur eine Silhouette ohne Gesicht.
import React from "react";
import { C } from "../../basis/lib";

type P = { size?: number; glow?: boolean; style?: React.CSSProperties };
const ink = (g?: boolean) => (g ? C.glow : C.ink);
const fill = (g: boolean | undefined, f: string) => (g ? "rgba(143,216,255,0.2)" : f);
const gl = (g?: boolean): React.CSSProperties => (g ? { filter: "drop-shadow(0 0 14px rgba(143,216,255,0.45)) drop-shadow(0 0 3px rgba(143,216,255,0.8))" } : {});

// ---------------------------------------------------------------------------
// Smartphone (Vorderansicht). `size` = Breite, Höhe = 2 × Breite. viewBox 300 × 600.
// ---------------------------------------------------------------------------
export const SCR = { x: 22, y: 22, w: 256, h: 556 };
/** Leiterbahnen: senkrechte (GX) und waagrechte (GY) Linien im Bildschirm, in viewBox-Einheiten. */
export const GX = [1, 2, 3, 4].map((j) => SCR.x + (SCR.w * j) / 5);
export const GY = [1, 2, 3, 4, 5, 6, 7].map((i) => SCR.y + (SCR.h * i) / 8);
const SCREEN = "#26303d";
const LIT = "#cfe9f8";

export const Smartphone: React.FC<P & { licht?: number; gitter?: number; gitterO?: number }> = ({ size = 300, glow, style, licht = 0, gitter = 0, gitterO = 1 }) => (
  <svg width={size} height={size * 2} viewBox="0 0 300 600" style={{ overflow: "visible", ...gl(glow), ...style }}>
    <rect x={6} y={6} width={288} height={588} rx={48} fill={fill(glow, "#3b4049")} stroke={ink(glow)} strokeWidth={8} />
    <rect x={SCR.x} y={SCR.y} width={SCR.w} height={SCR.h} rx={34} fill={glow ? "rgba(143,216,255,0.06)" : SCREEN} />
    {!glow && licht > 0 && <rect x={SCR.x} y={SCR.y} width={SCR.w} height={SCR.h} rx={34} fill={LIT} opacity={licht} />}
    {!glow && (
      <g opacity={0.35 * (1 - licht)}>
        <rect x={60} y={120} width={110} height={14} rx={7} fill="#ffffff" />
        <rect x={60} y={150} width={180} height={10} rx={5} fill="#ffffff" opacity={0.6} />
      </g>
    )}
    {gitter > 0 && (
      <g opacity={gitterO} stroke={glow ? C.glow : "#3d8fd1"} strokeWidth={5} strokeLinecap="round">
        {GY.map((y, i) => (
          <line key={`r${i}`} x1={SCR.x + 6} y1={y} x2={SCR.x + 6 + (SCR.w - 12) * Math.min(1, Math.max(0, gitter * 2 - i * 0.12))} y2={y} />
        ))}
        {GX.map((x, j) => (
          <line key={`c${j}`} x1={x} y1={SCR.y + 6} x2={x} y2={SCR.y + 6 + (SCR.h - 12) * Math.min(1, Math.max(0, gitter * 2 - 1 + j * 0.12))} />
        ))}
      </g>
    )}
    <rect x={122} y={34} width={56} height={18} rx={9} fill={glow ? C.glow : C.ink} opacity={glow ? 0.6 : 1} />
    <rect x={110} y={560} width={80} height={7} rx={3.5} fill={glow ? C.glow : "#ffffff"} opacity={0.55} />
  </svg>
);

// ---------------------------------------------------------------------------
// Zeigende Hand (zeigt nach links). viewBox 420 × 200, Fingerspitze bei TIP.
// handschuh: Strick-Handschuh · silber: leitende Fäden in der Spitze (0..1) · wurst: Faust hält ein Würstchen
// dash: nur gestrichelte Umrisslinie („nicht da“)
// ---------------------------------------------------------------------------
export const TIP = { x: 6, y: 62 };
type HP = P & { handschuh?: boolean; silber?: number; wurst?: boolean; dash?: number; farbe?: string };
const KNIT = "#c9463a";
const KNIT2 = "#f3e9dc";
export const ZeigeHand: React.FC<HP> = ({ size = 420, glow, style, handschuh, silber = 0, wurst, dash = 0, farbe }) => {
  const g = glow || dash > 0;
  const haut = farbe ?? (handschuh ? KNIT : "#e8b48f");
  const f = (c: string) => (dash > 0 ? "rgba(143,216,255,0.04)" : fill(glow, c));
  const sw = handschuh ? 8 : 7;
  const da = dash > 0 ? { strokeDasharray: "16 12", strokeDashoffset: -dash * 56 } : {};
  const st = { stroke: ink(g), strokeWidth: sw, strokeLinejoin: "round" as const, ...da };
  const fy = handschuh ? [30, 94] : [38, 86];
  return (
    <svg width={size} height={size * (200 / 420)} viewBox="0 0 420 200" style={{ overflow: "visible", ...gl(glow), ...style }}>
      {/* Ärmel / Bündchen */}
      <rect x={322} y={36} width={110} height={150} rx={10} fill={f(handschuh ? "#a8372d" : "#2f3542")} {...st} />
      {handschuh && dash === 0 && [0, 1, 2, 3, 4, 5].map((i) => <line key={i} x1={338 + i * 16} y1={44} x2={338 + i * 16} y2={178} stroke={glow ? "rgba(143,216,255,0.55)" : "#7d261f"} strokeWidth={5} />)}
      {/* Würstchen (in der Faust) */}
      {wurst && (
        <g>
          <rect x={2} y={40} width={250} height={46} rx={23} fill={f("#c8613f")} {...st} />
          {!g && <path d="M30 52 L 150 52" stroke="#e9a07f" strokeWidth={7} strokeLinecap="round" />}
        </g>
      )}
      {/* Zeigefinger */}
      {!wurst && <rect x={TIP.x} y={fy[0]} width={210} height={fy[1] - fy[0]} rx={(fy[1] - fy[0]) / 2} fill={f(haut)} {...st} />}
      {!wurst && !handschuh && !g && <rect x={14} y={42} width={30} height={18} rx={8} fill="#f6d9c8" stroke={C.ink} strokeWidth={4} />}
      {/* Faust */}
      <path d="M180 36 L 300 36 Q 336 36 336 72 L 336 150 Q 336 188 300 188 L 200 188 Q 168 188 168 158 L 168 60 Q 168 36 180 36 Z" fill={f(haut)} {...st} />
      {/* eingerollte Finger */}
      {[0, 1, 2].map((i) => (
        <rect key={i} x={150} y={wurst ? 86 + i * 34 : 92 + i * 32} width={86} height={32} rx={16} fill={f(haut)} {...st} strokeWidth={sw - 1} />
      ))}
      {/* Daumen */}
      <path d="M300 54 Q 236 46 204 86 Q 198 100 214 104 Q 252 92 300 96 Z" fill={f(haut)} {...st} strokeWidth={sw - 1} />
      {/* Strickmuster */}
      {handschuh && dash === 0 && (
        <g stroke={glow ? "rgba(143,216,255,0.6)" : KNIT2} strokeWidth={5} fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path d="M250 120 l 12 12 l 12 -12 l 12 12 l 12 -12" />
          <path d="M250 150 l 12 12 l 12 -12 l 12 12 l 12 -12" />
          {!wurst && <path d="M70 52 l 10 10 l 10 -10 l 10 10 l 10 -10 l 10 10 l 10 -10" />}
        </g>
      )}
      {/* leitende Silberfäden in der Fingerspitze */}
      {silber > 0 && !wurst && (
        <g opacity={Math.min(1, silber * 1.5)} style={{ filter: "drop-shadow(0 0 8px rgba(230,240,255,0.95))" }}>
          <rect x={TIP.x + 2} y={fy[0] + 4} width={60} height={fy[1] - fy[0] - 8} rx={(fy[1] - fy[0] - 8) / 2} fill="#dfe6ee" opacity={0.85} />
          {[0, 1, 2, 3].map((i) => (
            <line key={i} x1={16 + i * 13} y1={fy[0] + 8} x2={16 + i * 13} y2={fy[0] + 8 + (fy[1] - fy[0] - 16) * silber} stroke="#8d99a8" strokeWidth={4} strokeLinecap="round" />
          ))}
        </g>
      )}
    </svg>
  );
};

/** Hand so platzieren, dass die Fingerspitze genau auf (x, y) liegt; dreht um die Spitze. */
export const ZeigeHandAn: React.FC<HP & { x: number; y: number; rot?: number; o?: number }> = ({ x, y, rot = 0, o = 1, size = 420, ...rest }) => {
  const s = size / 420;
  return (
    <div style={{ position: "absolute", left: x - TIP.x * s, top: y - TIP.y * s, opacity: o, transform: `rotate(${rot}deg)`, transformOrigin: `${TIP.x * s}px ${TIP.y * s}px` }}>
      <ZeigeHand size={size} {...rest} />
    </div>
  );
};

// ---------------------------------------------------------------------------
/** Eingabestift, senkrecht, Spitze unten Mitte. `size` = Höhe. */
export const Stift: React.FC<P> = ({ size = 360, glow, style }) => (
  <svg width={size * 0.15} height={size} viewBox="0 0 60 400" style={{ overflow: "visible", ...gl(glow), ...style }}>
    <path d="M14 10 Q 14 0 30 0 Q 46 0 46 10 L 46 320 L 30 396 L 14 320 Z" fill={fill(glow, "#c9cfd6")} stroke={ink(glow)} strokeWidth={7} strokeLinejoin="round" />
    <path d="M14 300 L 46 300" stroke={ink(glow)} strokeWidth={6} />
    <rect x={22} y={40} width={8} height={200} rx={4} fill={glow ? C.glow : "#ffffff"} opacity={0.6} />
  </svg>
);

/** Querschnitt alter (resistiver) Touchscreen: obere Folie biegt sich bei bx durch und berührt die untere. viewBox 900 × 180. */
export const Querschnitt: React.FC<{ w?: number; bend?: number; bx?: number; kontakt?: number; label?: number }> = ({ w = 900, bend = 0, bx = 450, kontakt = 0 }) => {
  const d = 40 * Math.min(1, Math.max(0, bend));
  const top = `M 0 40 L ${bx - 120} 40 C ${bx - 60} 40 ${bx - 40} ${40 + d} ${bx} ${40 + d} C ${bx + 40} ${40 + d} ${bx + 60} 40 ${bx + 120} 40 L 900 40`;
  return (
    <svg width={w} height={w * (180 / 900)} viewBox="0 0 900 180" style={{ overflow: "visible" }}>
      <rect x={0} y={104} width={900} height={60} rx={10} fill="#3b4049" stroke={C.ink} strokeWidth={7} />
      {/* Abstandspunkte im Luftspalt */}
      {[60, 150, 240, 330, 420, 510, 600, 690, 780, 860].map((x) => (
        <circle key={x} cx={x} cy={64} r={6} fill={C.muted} opacity={Math.abs(x - bx) < 90 && d > 8 ? 0 : 0.8} />
      ))}
      <path d="M 0 90 L 900 90" stroke={C.ink} strokeWidth={16} strokeLinecap="round" />
      <path d="M 0 90 L 900 90" stroke="#9fc9e8" strokeWidth={8} strokeLinecap="round" />
      <path d={top} fill="none" stroke={C.ink} strokeWidth={16} strokeLinecap="round" />
      <path d={top} fill="none" stroke="#f1c94a" strokeWidth={8} strokeLinecap="round" />
      {kontakt > 0 && <circle cx={bx} cy={86} r={10 + 18 * kontakt} fill="#fff6c8" opacity={0.9 * kontakt} style={{ filter: "drop-shadow(0 0 10px #f1c94a)" }} />}
    </svg>
  );
};

/** Würstchen (Snack). `size` = Breite. */
export const Wuerstchen: React.FC<P> = ({ size = 260, glow, style }) => (
  <svg width={size} height={size * (110 / 300)} viewBox="0 0 300 110" style={{ overflow: "visible", ...gl(glow), ...style }}>
    <path d="M10 55 L -6 44 M10 55 L -6 66" stroke={ink(glow)} strokeWidth={6} strokeLinecap="round" />
    <path d="M290 55 L 306 44 M290 55 L 306 66" stroke={ink(glow)} strokeWidth={6} strokeLinecap="round" />
    <rect x={10} y={15} width={280} height={80} rx={40} fill={fill(glow, "#c8613f")} stroke={ink(glow)} strokeWidth={7} />
    {!glow && <path d="M50 36 L 210 36" stroke="#e9a07f" strokeWidth={9} strokeLinecap="round" />}
  </svg>
);

/** Schneeflocke, Mitte = Mittelpunkt. */
export const Flocke: React.FC<{ size?: number; farbe?: string }> = ({ size = 60, farbe = "#ffffff" }) => (
  <svg width={size} height={size} viewBox="-50 -50 100 100" style={{ overflow: "visible" }}>
    {[0, 60, 120].map((r) => (
      <g key={r} transform={`rotate(${r})`} stroke={farbe} strokeWidth={8} strokeLinecap="round">
        <line x1={0} y1={-44} x2={0} y2={44} />
        <path d="M-12 -32 L0 -20 L12 -32 M-12 32 L0 20 L12 32" fill="none" />
      </g>
    ))}
  </svg>
);

/** Redner-Silhouette (neutral, ohne Gesicht), zeigt mit dem rechten Arm auf die Leinwand. viewBox 200 × 340. */
export const Redner: React.FC<P & { arm?: number }> = ({ size = 200, style, arm = 0 }) => (
  <svg width={size} height={size * 1.7} viewBox="0 0 200 340" style={{ overflow: "visible", ...style }}>
    <g fill="#2b2a2e" stroke={C.ink} strokeWidth={6} strokeLinejoin="round">
      <circle cx={100} cy={46} r={32} />
      <path d="M58 92 Q 100 78 142 92 L 150 210 L 128 210 L 126 336 L 104 336 L 100 226 L 96 336 L 74 336 L 72 210 L 50 210 Z" />
      <g transform={`rotate(${-70 * arm} 62 100)`}>
        <path d="M62 96 L 40 190 L 56 194 L 76 104 Z" />
      </g>
    </g>
  </svg>
);

/** Laptop von oben (Unterteil): Tastatur + Trackpad; gitter = Leiterbahnen im Trackpad (0..1). viewBox 400 × 260. */
export const LaptopOben: React.FC<P & { gitter?: number; tipp?: number }> = ({ size = 300, glow, style, gitter = 0 }) => (
  <svg width={size} height={size * 0.65} viewBox="0 0 400 260" style={{ overflow: "visible", ...gl(glow), ...style }}>
    <rect x={4} y={4} width={392} height={252} rx={22} fill={fill(glow, C.steel)} stroke={ink(glow)} strokeWidth={7} />
    <rect x={34} y={22} width={332} height={110} rx={10} fill={fill(glow, "#3b4049")} stroke={ink(glow)} strokeWidth={5} />
    {[0, 1, 2, 3].map((r) =>
      Array.from({ length: 10 }).map((_, k) => (
        <rect key={`${r}-${k}`} x={44 + k * 32} y={30 + r * 25} width={24} height={18} rx={4} fill={glow ? "none" : "#5b6270"} stroke={glow ? C.glow : "none"} strokeWidth={2} />
      )),
    )}
    <rect x={124} y={148} width={152} height={92} rx={12} fill={fill(glow, "#dde2e8")} stroke={ink(glow)} strokeWidth={6} />
    {gitter > 0 && (
      <g stroke="#3d8fd1" strokeWidth={4} strokeLinecap="round" opacity={0.95}>
        {[1, 2, 3].map((i) => <line key={`r${i}`} x1={132} y1={148 + i * 23} x2={132 + 136 * Math.min(1, gitter * 1.6)} y2={148 + i * 23} />)}
        {[1, 2, 3, 4, 5].map((j) => <line key={`c${j}`} x1={124 + j * 25.3} y1={156} x2={124 + j * 25.3} y2={156 + 76 * Math.max(0, Math.min(1, gitter * 1.6 - 0.6))} />)}
      </g>
    )}
  </svg>
);

/** Blitz (Ladung). viewBox 80 × 140. */
export const Blitz: React.FC<{ size?: number; style?: React.CSSProperties }> = ({ size = 80, style }) => (
  <svg width={size} height={size * 1.75} viewBox="0 0 80 140" style={{ overflow: "visible", ...style }}>
    <path d="M48 4 L 10 78 L 38 78 L 26 136 L 72 52 L 44 52 Z" fill={C.yellow} stroke={C.ink} strokeWidth={6} strokeLinejoin="round" />
  </svg>
);

/** Druck-Pfeil nach unten. */
export const DruckPfeil: React.FC<{ size?: number; farbe?: string }> = ({ size = 120, farbe = C.ink }) => (
  <svg width={size} height={size * 1.3} viewBox="0 0 100 130" style={{ overflow: "visible" }}>
    <path d="M36 4 L 64 4 L 64 70 L 92 70 L 50 126 L 8 70 L 36 70 Z" fill={farbe} stroke={C.ink} strokeWidth={6} strokeLinejoin="round" />
  </svg>
);
