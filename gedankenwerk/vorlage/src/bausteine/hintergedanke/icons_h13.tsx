// Illustrationen Folge 13 (Marke 9:41). Gleicher Stil wie icons.tsx; glow = Röntgen-Fassung. Keine Logos, kein echter Sperrbildschirm.
import React from "react";
import { C, HEAD } from "../../basis/lib";

type P = { size?: number; glow?: boolean; style?: React.CSSProperties };
const ink = (g?: boolean) => (g ? C.glow : C.ink);
const fill = (g: boolean | undefined, f: string) => (g ? "rgba(143,216,255,0.2)" : f);
const gl = (g?: boolean): React.CSSProperties => (g ? { filter: "drop-shadow(0 0 14px rgba(143,216,255,0.45)) drop-shadow(0 0 3px rgba(143,216,255,0.8))" } : {});
const SCREEN = "#26303d";

/** Smartphone, flach: Gehäuse, Dynamic-Island-Pille, große Uhrzeit. `size` = Breite, Höhe = 2 × Breite. */
export const Iphone: React.FC<P & { zeit?: string; zeitO?: number; galerie?: number; kacheln?: number; doppelpunkt?: number; datum?: string; farbe?: string }> = ({
  size = 300, glow, style, zeit, zeitO = 1, galerie = 0, kacheln = 12, doppelpunkt = 1, datum, farbe = "#3b4049",
}) => {
  const tiles = ["#bfe0f4", "#f1c94a", "#2fa35f", "#e0483b", "#c9cfd6", "#f6f3ec", "#bfe0f4", "#f1c94a", "#2fa35f", "#c9cfd6", "#e0483b", "#bfe0f4"];
  return (
    <svg width={size} height={size * 2} viewBox="0 0 300 600" style={{ overflow: "visible", ...gl(glow), ...style }}>
      <rect x={6} y={6} width={288} height={588} rx={58} fill={fill(glow, farbe)} stroke={ink(glow)} strokeWidth={8} />
      <rect x={20} y={20} width={260} height={560} rx={46} fill={glow ? "rgba(143,216,255,0.08)" : SCREEN} />
      <rect x={104} y={36} width={92} height={28} rx={14} fill={glow ? C.glow : C.ink} opacity={glow ? 0.7 : 1} />
      {zeit && (
        <text x={150} y={230} textAnchor="middle" fontFamily={HEAD} fontWeight={800} fontSize={116} letterSpacing={-4} fill={glow ? C.glow : "#ffffff"} opacity={zeitO}>
          {doppelpunkt >= 1 || !zeit.includes(":") ? zeit : (
            <>
              {zeit.split(":")[0]}
              <tspan opacity={doppelpunkt}>:</tspan>
              {zeit.split(":")[1]}
            </>
          )}
        </text>
      )}
      {zeit && datum && (
        <text x={150} y={110} textAnchor="middle" fontFamily={HEAD} fontWeight={700} fontSize={26} letterSpacing={1} fill={glow ? C.glow : "#ffffff"} opacity={0.75 * zeitO}>
          {datum}
        </text>
      )}
      {galerie > 0 && (
        <g opacity={galerie}>
          {tiles.slice(0, Math.max(0, Math.min(12, Math.floor(kacheln)))).map((c, i) => (
            <rect key={i} x={34 + (i % 3) * 82} y={92 + Math.floor(i / 3) * 108} width={72} height={98} rx={8} fill={glow ? "rgba(143,216,255,0.3)" : c} stroke={ink(glow)} strokeWidth={3} />
          ))}
        </g>
      )}
      <rect x={106} y={556} width={88} height={7} rx={3.5} fill={glow ? C.glow : "#ffffff"} opacity={0.6} />
    </svg>
  );
};

/** Tablet im Hochformat. `size` = Breite. */
export const Tablet: React.FC<P & { zeit?: string; zeitO?: number }> = ({ size = 420, glow, style, zeit, zeitO = 1 }) => (
  <svg width={size} height={size * 1.36} viewBox="0 0 400 544" style={{ overflow: "visible", ...gl(glow), ...style }}>
    <rect x={6} y={6} width={388} height={532} rx={40} fill={fill(glow, "#3b4049")} stroke={ink(glow)} strokeWidth={8} />
    <rect x={30} y={30} width={340} height={484} rx={20} fill={glow ? "rgba(143,216,255,0.08)" : SCREEN} />
    <circle cx={200} cy={20} r={4} fill={ink(glow)} />
    {zeit ? (
      <text x={200} y={230} textAnchor="middle" fontFamily={HEAD} fontWeight={800} fontSize={118} letterSpacing={-4} fill={glow ? C.glow : "#ffffff"} opacity={zeitO}>
        {zeit}
      </text>
    ) : (
      <g opacity={0.5}>
        <rect x={70} y={110} width={140} height={14} rx={7} fill={glow ? C.glow : "#ffffff"} />
        <rect x={70} y={146} width={220} height={10} rx={5} fill={glow ? C.glow : "#ffffff"} opacity={0.6} />
        <rect x={70} y={174} width={180} height={10} rx={5} fill={glow ? C.glow : "#ffffff"} opacity={0.6} />
      </g>
    )}
  </svg>
);

/** Handgelenk mit digitaler Armbanduhr. `size` = Breite. */
export const Armbanduhr: React.FC<P & { zeit?: string }> = ({ size = 360, glow, style, zeit = "9:41" }) => (
  <svg width={size} height={size * 1.2} viewBox="0 0 300 360" style={{ overflow: "visible", ...gl(glow), ...style }}>
    <path d="M52 0 L248 0 L236 360 L64 360 Z" fill={fill(glow, "#e8b48f")} stroke={ink(glow)} strokeWidth={7} strokeLinejoin="round" />
    <rect x={42} y={40} width={216} height={280} rx={20} fill={fill(glow, "#4a5160")} stroke={ink(glow)} strokeWidth={7} />
    <rect x={238} y={130} width={20} height={56} rx={8} fill={ink(glow)} />
    <rect x={52} y={78} width={188} height={204} rx={52} fill={fill(glow, "#3b4049")} stroke={ink(glow)} strokeWidth={8} />
    <rect x={66} y={92} width={160} height={176} rx={40} fill={glow ? "rgba(143,216,255,0.08)" : SCREEN} />
    <text x={146} y={202} textAnchor="middle" fontFamily={HEAD} fontWeight={800} fontSize={66} letterSpacing={-2} fill={glow ? C.glow : "#ffffff"}>
      {zeit}
    </text>
  </svg>
);

/** Analoge Wanduhr mit Zeigern (h, m). */
export const Uhr: React.FC<P & { h?: number; m?: number }> = ({ size = 400, glow, style, h = 9, m = 41 }) => {
  const ah = (((h % 12) + m / 60) * 30 * Math.PI) / 180;
  const am = (m * 6 * Math.PI) / 180;
  const pt = (a: number, r: number) => ({ x: 150 + Math.sin(a) * r, y: 150 - Math.cos(a) * r });
  const hh = pt(ah, 74), mm = pt(am, 108);
  return (
    <svg width={size} height={size} viewBox="0 0 300 300" style={{ overflow: "visible", ...gl(glow), ...style }}>
      <circle cx={150} cy={150} r={138} fill={fill(glow, "#ffffff")} stroke={ink(glow)} strokeWidth={9} />
      {Array.from({ length: 12 }).map((_, i) => {
        const a = (i * 30 * Math.PI) / 180;
        const p1 = pt(a, 116), p2 = pt(a, 128);
        return <line key={i} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke={ink(glow)} strokeWidth={i % 3 === 0 ? 8 : 4} strokeLinecap="round" />;
      })}
      <line x1={150} y1={150} x2={hh.x} y2={hh.y} stroke={ink(glow)} strokeWidth={13} strokeLinecap="round" />
      <line x1={150} y1={150} x2={mm.x} y2={mm.y} stroke={ink(glow)} strokeWidth={9} strokeLinecap="round" />
      <circle cx={150} cy={150} r={10} fill={C.red} />
    </svg>
  );
};

/** Tisch mit Obstschale (Musterwohnung). */
export const ObstTisch: React.FC<P> = ({ size = 260, glow, style }) => (
  <svg width={size} height={size * 0.78} viewBox="0 0 300 234" style={{ overflow: "visible", ...gl(glow), ...style }}>
    <rect x={14} y={150} width={272} height={26} rx={6} fill={fill(glow, "#b98a5e")} stroke={ink(glow)} strokeWidth={7} />
    <rect x={44} y={176} width={26} height={52} fill={fill(glow, "#b98a5e")} stroke={ink(glow)} strokeWidth={6} />
    <rect x={230} y={176} width={26} height={52} fill={fill(glow, "#b98a5e")} stroke={ink(glow)} strokeWidth={6} />
    <circle cx={118} cy={96} r={26} fill={fill(glow, C.red)} stroke={ink(glow)} strokeWidth={6} />
    <circle cx={162} cy={90} r={26} fill={fill(glow, C.yellow)} stroke={ink(glow)} strokeWidth={6} />
    <circle cx={190} cy={104} r={22} fill={fill(glow, C.green)} stroke={ink(glow)} strokeWidth={6} />
    <path d="M78 110 L222 110 Q 214 150 150 150 Q 86 150 78 110 Z" fill={fill(glow, "#ffffff")} stroke={ink(glow)} strokeWidth={7} strokeLinejoin="round" />
  </svg>
);

/** Pizza, ein Stück herausgezogen, Käsefäden dazwischen. */
export const Pizza: React.FC<P> = ({ size = 260, glow, style }) => {
  const cx = 130, cy = 140, r = 100;
  const a0 = (-70 * Math.PI) / 180, a1 = (-20 * Math.PI) / 180;
  const p0 = { x: cx + r * Math.cos(a0), y: cy + r * Math.sin(a0) };
  const p1 = { x: cx + r * Math.cos(a1), y: cy + r * Math.sin(a1) };
  const big = `M${cx} ${cy} L${p1.x} ${p1.y} A ${r} ${r} 0 1 1 ${p0.x} ${p0.y} Z`;
  const slice = `M${cx} ${cy} L${p0.x} ${p0.y} A ${r} ${r} 0 0 1 ${p1.x} ${p1.y} Z`;
  return (
    <svg width={size} height={size * 0.9} viewBox="0 0 300 270" style={{ overflow: "visible", ...gl(glow), ...style }}>
      <path d={big} fill={fill(glow, "#f1c94a")} stroke={ink(glow)} strokeWidth={7} strokeLinejoin="round" />
      <circle cx={100} cy={170} r={13} fill={fill(glow, C.red)} stroke={ink(glow)} strokeWidth={4} />
      <circle cx={150} cy={205} r={13} fill={fill(glow, C.red)} stroke={ink(glow)} strokeWidth={4} />
      <circle cx={60} cy={130} r={13} fill={fill(glow, C.red)} stroke={ink(glow)} strokeWidth={4} />
      <circle cx={120} cy={120} r={11} fill={fill(glow, C.green)} stroke={ink(glow)} strokeWidth={4} />
      <path d={`M${cx + 24} ${cy - 10} Q ${cx + 44} ${cy - 30} ${cx + 62} ${cy - 22} M${cx + 20} ${cy + 6} Q ${cx + 50} ${cy + 4} ${cx + 66} ${cy - 2}`} fill="none" stroke={glow ? C.glow : C.yellow} strokeWidth={6} strokeLinecap="round" />
      <g transform="translate(62 -52)">
        <path d={slice} fill={fill(glow, "#f1c94a")} stroke={ink(glow)} strokeWidth={7} strokeLinejoin="round" />
        <circle cx={cx + 56} cy={cy - 52} r={10} fill={fill(glow, C.red)} stroke={ink(glow)} strokeWidth={4} />
      </g>
    </svg>
  );
};

/** Leinwand mit Ständer (Bühne). */
export const Leinwand: React.FC<P & { children?: React.ReactNode }> = ({ size = 400, glow, style }) => (
  <svg width={size} height={size * 0.62} viewBox="0 0 400 248" style={{ overflow: "visible", ...gl(glow), ...style }}>
    <rect x={20} y={14} width={360} height={190} rx={8} fill={fill(glow, "#ffffff")} stroke={ink(glow)} strokeWidth={8} />
    <path d="M200 204 L200 240 M150 240 L250 240" stroke={ink(glow)} strokeWidth={8} strokeLinecap="round" />
  </svg>
);

/** Spielwürfel, Augen 1–6. `size` = Kantenlänge. */
export const Wuerfel: React.FC<P & { augen?: number }> = ({ size = 160, glow, style, augen = 5 }) => {
  const pos: Record<number, [number, number][]> = {
    1: [[50, 50]], 2: [[28, 28], [72, 72]], 3: [[26, 26], [50, 50], [74, 74]], 4: [[28, 28], [72, 28], [28, 72], [72, 72]],
    5: [[26, 26], [74, 26], [50, 50], [26, 74], [74, 74]], 6: [[28, 24], [72, 24], [28, 50], [72, 50], [28, 76], [72, 76]],
  };
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ overflow: "visible", ...gl(glow), ...style }}>
      <rect x={4} y={4} width={92} height={92} rx={18} fill={fill(glow, "#ffffff")} stroke={ink(glow)} strokeWidth={6} />
      {(pos[augen] ?? pos[5]).map(([x, y], i) => <circle key={i} cx={x} cy={y} r={8} fill={glow ? C.glow : C.ink} />)}
    </svg>
  );
};

/** Hinterkopf + Schultern eines Zuschauers, optional mit erhobenem Arm und Armbanduhr. */
export const Zuschauer: React.FC<P & { arm?: number; zeit?: string; farbe?: string }> = ({ size = 160, glow, style, arm = 0, zeit = "9:41", farbe = "#4d7fd1" }) => (
  <svg width={size} height={size * 1.25} viewBox="0 0 160 200" style={{ overflow: "visible", ...gl(glow), ...style }}>
    {arm > 0.01 && (
      <g transform={`translate(${118} ${150 - 70 * arm})`} opacity={Math.min(1, arm * 1.5)}>
        <rect x={-13} y={0} width={26} height={70 * arm + 10} rx={12} fill={fill(glow, "#e8b48f")} stroke={ink(glow)} strokeWidth={5} />
        <rect x={-26} y={-6} width={52} height={44} rx={10} fill={fill(glow, "#3b4049")} stroke={ink(glow)} strokeWidth={5} />
        <text x={0} y={23} textAnchor="middle" fontFamily={HEAD} fontWeight={800} fontSize={19} fill={glow ? C.glow : "#ffffff"}>{zeit}</text>
      </g>
    )}
    <path d="M14 200 Q 16 128 80 124 Q 144 128 146 200 Z" fill={fill(glow, farbe)} stroke={ink(glow)} strokeWidth={6} strokeLinejoin="round" />
    <circle cx={80} cy={84} r={44} fill={fill(glow, "#5a4636")} stroke={ink(glow)} strokeWidth={6} />
  </svg>
);

/** Zielscheibe (Viewbox 200). */
export const Zielscheibe: React.FC<P> = ({ size = 260, glow, style }) => (
  <svg width={size} height={size} viewBox="0 0 200 200" style={{ overflow: "visible", ...gl(glow), ...style }}>
    {[92, 68, 44, 20].map((r, i) => (
      <circle key={r} cx={100} cy={100} r={r} fill={glow ? (i % 2 ? "rgba(143,216,255,0.25)" : "rgba(143,216,255,0.08)") : i % 2 ? "#ffffff" : C.red} stroke={ink(glow)} strokeWidth={5} />
    ))}
  </svg>
);

/** Werbeplakat mit Stern-Störer „NEU“ und Produktumriss. */
export const Plakat: React.FC<P & { text?: string }> = ({ size = 360, glow, style, text = "NEU!" }) => (
  <svg width={size} height={size * 1.3} viewBox="0 0 300 390" style={{ overflow: "visible", ...gl(glow), ...style }}>
    <rect x={6} y={6} width={288} height={378} rx={16} fill={fill(glow, C.yellow)} stroke={ink(glow)} strokeWidth={8} />
    <rect x={104} y={120} width={92} height={184} rx={20} fill={fill(glow, "#3b4049")} stroke={ink(glow)} strokeWidth={6} />
    <rect x={40} y={330} width={220} height={18} rx={9} fill={ink(glow)} opacity={0.6} />
    <g transform="translate(222 76) rotate(-12)">
      <path d={Array.from({ length: 24 }).map((_, i) => { const a = (i * 15 * Math.PI) / 180; const r = i % 2 ? 46 : 62; return `${i ? "L" : "M"}${(Math.cos(a) * r).toFixed(1)} ${(Math.sin(a) * r).toFixed(1)}`; }).join(" ") + " Z"} fill={fill(glow, C.red)} stroke={ink(glow)} strokeWidth={5} strokeLinejoin="round" />
      <text x={0} y={10} textAnchor="middle" fontFamily={HEAD} fontWeight={900} fontSize={30} fill="#ffffff">{text}</text>
    </g>
  </svg>
);

/** Geschlossener Karton (neu, unbenutzt). */
export const Karton: React.FC<P> = ({ size = 300, glow, style }) => (
  <svg width={size} height={size * 0.86} viewBox="0 0 300 258" style={{ overflow: "visible", ...gl(glow), ...style }}>
    <path d="M30 70 L150 20 L270 70 L150 120 Z" fill={fill(glow, "#e3c08f")} stroke={ink(glow)} strokeWidth={7} strokeLinejoin="round" />
    <path d="M30 70 L150 120 L150 250 L30 200 Z" fill={fill(glow, "#c99c62")} stroke={ink(glow)} strokeWidth={7} strokeLinejoin="round" />
    <path d="M270 70 L150 120 L150 250 L270 200 Z" fill={fill(glow, "#b48650")} stroke={ink(glow)} strokeWidth={7} strokeLinejoin="round" />
    <path d="M90 45 L210 95" stroke={ink(glow)} strokeWidth={5} opacity={0.5} />
  </svg>
);

/** Musterwohnung im Schnitt: Sofa, Stehlampe, Bild, Tisch; Obstschale poppt mit `obst` (0..1). */
export const Wohnzimmer: React.FC<P & { obst?: number; licht?: number }> = ({ size = 420, glow, style, obst = 1, licht = 1 }) => (
  <svg width={size} height={size * 0.8} viewBox="0 0 420 336" style={{ overflow: "visible", ...gl(glow), ...style }}>
    <rect x={0} y={0} width={420} height={270} fill={fill(glow, "#f3e7d3")} />
    <rect x={0} y={270} width={420} height={66} fill={fill(glow, "#c9a77f")} />
    <line x1={0} y1={270} x2={420} y2={270} stroke={ink(glow)} strokeWidth={6} />
    <rect x={150} y={40} width={110} height={78} rx={6} fill={fill(glow, C.sky)} stroke={ink(glow)} strokeWidth={6} />
    <path d="M160 108 L190 74 L212 96 L228 80 L250 108 Z" fill={fill(glow, C.green)} opacity={0.8} />
    {/* Stehlampe */}
    <line x1={372} y1={110} x2={372} y2={268} stroke={ink(glow)} strokeWidth={6} />
    <path d="M342 110 L402 110 L388 66 L356 66 Z" fill={fill(glow, C.yellow)} stroke={ink(glow)} strokeWidth={6} strokeLinejoin="round" />
    {licht > 0.01 && <path d="M346 112 L398 112 L430 230 L314 230 Z" fill={C.yellow} opacity={0.22 * licht} />}
    {/* Sofa */}
    <rect x={20} y={170} width={150} height={70} rx={18} fill={fill(glow, "#4d7fd1")} stroke={ink(glow)} strokeWidth={6} />
    <rect x={12} y={206} width={166} height={52} rx={14} fill={fill(glow, "#3f6bb4")} stroke={ink(glow)} strokeWidth={6} />
    {/* Tisch */}
    <rect x={200} y={222} width={140} height={16} rx={4} fill={fill(glow, "#b98a5e")} stroke={ink(glow)} strokeWidth={6} />
    <line x1={218} y1={238} x2={218} y2={270} stroke={ink(glow)} strokeWidth={7} />
    <line x1={322} y1={238} x2={322} y2={270} stroke={ink(glow)} strokeWidth={7} />
    {obst > 0.01 && (
      <g transform={`translate(270 222) scale(${obst}) translate(-270 -222)`}>
        <circle cx={252} cy={194} r={14} fill={fill(glow, C.red)} stroke={ink(glow)} strokeWidth={4} />
        <circle cx={276} cy={190} r={14} fill={fill(glow, C.yellow)} stroke={ink(glow)} strokeWidth={4} />
        <circle cx={292} cy={200} r={12} fill={fill(glow, C.green)} stroke={ink(glow)} strokeWidth={4} />
        <path d="M236 202 L306 202 Q 300 222 271 222 Q 242 222 236 202 Z" fill={fill(glow, "#ffffff")} stroke={ink(glow)} strokeWidth={5} strokeLinejoin="round" />
      </g>
    )}
  </svg>
);
