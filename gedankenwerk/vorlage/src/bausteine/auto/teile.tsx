// Auto-Bausteine: Tacho, Schaltkulisse, Automatik-Wählhebel, Warnleuchte, Rückfahrkamera, Zahnräder, Funken,
// Pick-up von oben mit Bremsspuren und Qualm, Antriebsstrang. SVG/HTML in Bildkoordinaten (1080 × 1920).
import React from "react";
import { C, HEAD, MONO, ease, rgba } from "../../basis/lib";

const pol = (cx: number, cy: number, r: number, grad: number) => {
  const a = ((grad - 90) * Math.PI) / 180;
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)] as const;
};

// ---------------------------------------------------------------------------
// Tacho: 0–200 km/h über 240°, Mitte (cx, cy), Radius r. wert = km/h.
// ---------------------------------------------------------------------------
export const Tacho: React.FC<{ cx: number; cy: number; r?: number; wert: number; dunkel?: boolean; glanz?: number }> = ({ cx, cy, r = 260, wert, dunkel, glanz = 0 }) => {
  const farbe = dunkel ? C.glow : C.ink;
  const grad = (v: number) => -120 + (Math.max(0, Math.min(210, v)) / 200) * 240;
  const [nx, ny] = pol(cx, cy, r * 0.82, grad(wert));
  const bogen = (von: number, bis: number, rr: number) => {
    const [x1, y1] = pol(cx, cy, rr, grad(von));
    const [x2, y2] = pol(cx, cy, rr, grad(bis));
    return `M${x1},${y1} A${rr},${rr} 0 ${grad(bis) - grad(von) > 180 ? 1 : 0} 1 ${x2},${y2}`;
  };
  return (
    <g>
      <circle cx={cx} cy={cy} r={r + 26} fill={dunkel ? rgba(C.glow, 0.06) : "#1b1f27"} stroke={farbe} strokeWidth={8} />
      <path d={bogen(0, 200, r - 8)} fill="none" stroke={rgba("#ffffff", 0.18)} strokeWidth={18} />
      <path d={bogen(0, Math.max(0.5, wert), r - 8)} fill="none" stroke={wert > 150 ? C.red : "#ff8a3d"} strokeWidth={18} />
      {Array.from({ length: 21 }, (_, i) => {
        const v = i * 10;
        const [x1, y1] = pol(cx, cy, r - 30, grad(v));
        const [x2, y2] = pol(cx, cy, r - (i % 2 ? 48 : 62), grad(v));
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#e8ecf3" strokeWidth={i % 2 ? 3 : 6} strokeLinecap="round" />;
      })}
      {Array.from({ length: 11 }, (_, i) => {
        const v = i * 20;
        const [x, y] = pol(cx, cy, r - 100, grad(v));
        return <text key={i} x={x} y={y + 12} textAnchor="middle" fontFamily={HEAD} fontWeight={800} fontSize={r * 0.12} fill="#e8ecf3">{v}</text>;
      })}
      <line x1={cx} y1={cy} x2={nx} y2={ny} stroke={C.red} strokeWidth={12} strokeLinecap="round" />
      <circle cx={cx} cy={cy} r={26} fill={C.red} />
      <circle cx={cx} cy={cy} r={12} fill="#1b1f27" />
      <text x={cx} y={cy + r * 0.52} textAnchor="middle" fontFamily={MONO} fontWeight={700} fontSize={r * 0.26} fill="#ffffff">{Math.round(wert)}</text>
      <text x={cx} y={cy + r * 0.68} textAnchor="middle" fontFamily={MONO} fontWeight={700} fontSize={r * 0.09} fill="#9aa6b8">KM/H</text>
      {glanz > 0 ? <circle cx={cx} cy={cy} r={r + 26} fill="none" stroke={C.red} strokeWidth={14} opacity={glanz} /> : null}
    </g>
  );
};

// ---------------------------------------------------------------------------
// Schaltkulisse (H-Schema 1-3-5 / 2-4-R) mit Knauf. pos = Gang ("5", "R", "N", …) oder Mischung über zwischen.
// Mitte (cx, cy), Breite w.
// ---------------------------------------------------------------------------
const GASSEN: Record<string, [number, number]> = { "1": [-1, -1], "2": [-1, 1], "3": [0, -1], "4": [0, 1], "5": [1, -1], R: [1, 1], N: [0, 0] };
export const Kulisse: React.FC<{ cx: number; cy: number; w?: number; von: string; nach: string; k: number; sperre?: number; rot?: number; dunkel?: boolean }> = ({
  cx, cy, w = 420, von, nach, k, sperre = 0, rot = 0, dunkel,
}) => {
  const sx = w / 2, sy = w * 0.36;
  const p = (g: string) => [cx + GASSEN[g][0] * sx * 0.75, cy + GASSEN[g][1] * sy] as const;
  // Weg: von → N → nach
  const [ax, ay] = p(von), [nx, ny] = p("N"), [bx, by] = p(nach);
  const k1 = Math.min(1, k * 3), k2 = Math.max(0, Math.min(1, k * 3 - 1)), k3 = Math.max(0, k * 3 - 2);
  let kx = ax, ky = ay;
  if (k1 < 1) { kx = ax; ky = ay + (ny - ay) * k1; }
  else if (k2 < 1) { kx = nx + (bx - nx) * k2; ky = ny; }
  else { kx = bx; ky = ny + (by - ny) * k3; }
  const linie = dunkel ? C.glow : "#c3c9d4";
  return (
    <g>
      <rect x={cx - w / 2 - 50} y={cy - sy - 90} width={w + 100} height={2 * sy + 180} rx={40} fill={dunkel ? rgba(C.glow, 0.06) : "#1b1f27"} stroke={dunkel ? C.glow : C.ink} strokeWidth={6} />
      <line x1={p("1")[0]} y1={cy} x2={p("5")[0]} y2={cy} stroke={linie} strokeWidth={14} strokeLinecap="round" />
      {["1", "3", "5"].map((g) => <line key={g} x1={p(g)[0]} y1={p(g)[1]} x2={p(g)[0]} y2={p(g === "1" ? "2" : g === "3" ? "4" : "R")[1]} stroke={linie} strokeWidth={14} strokeLinecap="round" />)}
      {Object.entries(GASSEN).filter(([g]) => g !== "N").map(([g]) => {
        const [x, y] = p(g);
        const istR = g === "R";
        return (
          <text key={g} x={x} y={y + (GASSEN[g][1] < 0 ? -32 : 62)} textAnchor="middle" fontFamily={HEAD} fontWeight={900} fontSize={48} fill={istR && rot > 0 ? C.red : "#e8ecf3"}>{g}</text>
        );
      })}
      {sperre > 0 ? (
        <g transform={`translate(${p("R")[0] + 70} ${cy + sy * 0.5}) scale(${sperre})`}>
          <rect x={-26} y={-6} width={52} height={44} rx={8} fill={C.yellow} stroke={C.ink} strokeWidth={4} />
          <path d="M-15,-6 v-12 a15,15 0 0 1 30,0 v12" fill="none" stroke={C.yellow} strokeWidth={8} />
        </g>
      ) : null}
      <line x1={kx} y1={ky} x2={kx + 8} y2={ky + 30} stroke="#555c69" strokeWidth={18} strokeLinecap="round" />
      <circle cx={kx} cy={ky} r={44} fill="#2a2f3a" stroke={rot > 0 ? C.red : "#e8ecf3"} strokeWidth={6} />
      <circle cx={kx - 12} cy={ky - 14} r={12} fill="#ffffff" opacity={0.25} />
    </g>
  );
};

// ---------------------------------------------------------------------------
// Automatik-Wählhebel P R N D senkrecht, aktiver Buchstabe leuchtet. aktiv = Index 0..3 (Kommazahl blendet).
// ---------------------------------------------------------------------------
export const Waehlhebel: React.FC<{ x: number; y: number; aktiv: number; roh?: number }> = ({ x, y, aktiv, roh = -1 }) => (
  <g>
    <rect x={x - 90} y={y - 40} width={180} height={4 * 110 + 30} rx={34} fill="#1b1f27" stroke={C.ink} strokeWidth={6} />
    {["P", "R", "N", "D"].map((b, i) => {
      const an = Math.max(0, 1 - Math.abs(aktiv - i));
      const gewollt = roh === i;
      return (
        <g key={b}>
          {an > 0 ? <rect x={x - 62} y={y - 22 + i * 110} width={124} height={96} rx={20} fill={rgba(i === 2 ? C.green : "#ff8a3d", 0.9 * an)} /> : null}
          {gewollt ? <rect x={x - 62} y={y - 22 + i * 110} width={124} height={96} rx={20} fill="none" stroke={C.red} strokeWidth={6} strokeDasharray="12 8" /> : null}
          <text x={x} y={y + 50 + i * 110} textAnchor="middle" fontFamily={HEAD} fontWeight={900} fontSize={70} fill={an > 0.5 ? "#ffffff" : "#7d8596"}>{b}</text>
        </g>
      );
    })}
  </g>
);

// ---------------------------------------------------------------------------
// Motor-Warnleuchte (gelbes Motorsymbol), size = Breite.
// ---------------------------------------------------------------------------
export const Warnleuchte: React.FC<{ x: number; y: number; size?: number; an?: number }> = ({ x, y, size = 300, an = 1 }) => {
  const s = size / 200;
  const f = an > 0.5 ? "#ffb81c" : "#5b5f69";
  return (
    <g transform={`translate(${x - size / 2} ${y - size * 0.35}) scale(${s})`}>
      {an > 0.5 ? <ellipse cx={100} cy={70} rx={130} ry={100} fill={rgba("#ffb81c", 0.25 * an)} /> : null}
      <path
        d="M30,40 h20 v-14 h40 v-10 h-14 v-10 h52 v10 h-14 v10 h34 l14,14 h14 v-12 h12 v64 h-12 v-12 h-14 l-20,30 h-74 l-12,-16 h-20 v16 h-10 v-60 h10 v14 h-20 z"
        fill="none" stroke={f} strokeWidth={10} strokeLinejoin="round"
      />
    </g>
  );
};

// ---------------------------------------------------------------------------
// Rückfahrkamera-Bildschirm mit Hilfslinien. (x, y) = linke obere Ecke.
// ---------------------------------------------------------------------------
export const Rueckfahrkamera: React.FC<{ x: number; y: number; w?: number; t: number }> = ({ x, y, w = 680, t }) => {
  const h = w * 0.62;
  const linie = (k: number, farbe: string) => {
    const yy = y + h * (0.35 + 0.6 * k);
    const ww = w * (0.28 + 0.5 * k);
    return <line x1={x + w / 2 - ww / 2} y1={yy} x2={x + w / 2 + ww / 2} y2={yy} stroke={farbe} strokeWidth={8} />;
  };
  return (
    <g>
      <rect x={x - 18} y={y - 18} width={w + 36} height={h + 36} rx={30} fill="#0d0f14" />
      <rect x={x} y={y} width={w} height={h} rx={14} fill="#33404f" />
      <rect x={x} y={y + h * 0.45} width={w} height={h * 0.55} rx={14} fill="#4b5563" />
      {/* Straße, die nach hinten wegläuft */}
      {Array.from({ length: 5 }, (_, i) => {
        const k = ((i / 5 + t * 1.4) % 1);
        const yy = y + h * 0.5 + k * h * 0.48;
        return <rect key={i} x={x + w / 2 - 6 - k * 10} y={yy} width={12 + k * 20} height={10 + k * 30} fill="#e8ecf3" opacity={0.7} />;
      })}
      <path d={`M${x + w * 0.36},${y + h * 0.35} L${x + w * 0.08},${y + h}`} stroke={C.yellow} strokeWidth={8} />
      <path d={`M${x + w * 0.64},${y + h * 0.35} L${x + w * 0.92},${y + h}`} stroke={C.yellow} strokeWidth={8} />
      {linie(0.1, C.green)}
      {linie(0.45, C.yellow)}
      {linie(0.85, C.red)}
      <circle cx={x + 34} cy={y + 34} r={10} fill={C.red} opacity={Math.floor(t * 2) % 2 ? 1 : 0.3} />
      <text x={x + 54} y={y + 44} fontFamily={MONO} fontWeight={700} fontSize={26} fill="#ffffff">REAR</text>
    </g>
  );
};

// ---------------------------------------------------------------------------
// Zahnrad: n Zähne, Mitte (cx, cy), Radius r, Drehung rot (Grad).
// ---------------------------------------------------------------------------
export const Zahnrad: React.FC<{ cx: number; cy: number; r: number; n: number; rot: number; farbe: string; rand: string; pfeil?: 1 | -1 | 0; pfeilFarbe?: string }> = ({
  cx, cy, r, n, rot, farbe, rand, pfeil = 0, pfeilFarbe,
}) => {
  const pts: string[] = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * 360;
    const z = 360 / n;
    for (const [da, rr] of [[0, r * 0.86], [z * 0.15, r], [z * 0.45, r], [z * 0.6, r * 0.86]] as const) {
      const [x, y] = pol(0, 0, rr, a + da);
      pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
    }
  }
  const pf = pfeilFarbe ?? rand;
  return (
    <g transform={`translate(${cx} ${cy})`}>
      <g transform={`rotate(${rot})`}>
        <polygon points={pts.join(" ")} fill={farbe} stroke={rand} strokeWidth={5} strokeLinejoin="round" />
        <circle r={r * 0.32} fill="none" stroke={rand} strokeWidth={5} />
        {[0, 120, 240].map((a) => {
          const [x, y] = pol(0, 0, r * 0.6, a);
          return <circle key={a} cx={x} cy={y} r={r * 0.1} fill={rand} opacity={0.6} />;
        })}
      </g>
      <circle r={r * 0.14} fill={rand} />
      {pfeil !== 0 ? (
        <g>
          <path d={`M${-r * 0.55},${-r - 34} A${r + 34},${r + 34} 0 0 ${pfeil > 0 ? 1 : 0} ${r * 0.55},${-r - 34}`} transform={pfeil > 0 ? undefined : "scale(-1 1)"} fill="none" stroke={pf} strokeWidth={9} />
          <polygon points={`${r * 0.55 + 4},${-r - 52} ${r * 0.55 + 26},${-r - 22} ${r * 0.55 - 12},${-r - 18}`} transform={pfeil > 0 ? undefined : "scale(-1 1)"} fill={pf} />
        </g>
      ) : null}
    </g>
  );
};

// ---------------------------------------------------------------------------
// Funkenflug ab Zeitpunkt a an (x, y): kurze Linien, die wegfliegen und fallen.
// ---------------------------------------------------------------------------
export const Funken: React.FC<{ t: number; a: number; x: number; y: number; dauer?: number; n?: number }> = ({ t, a, x, y, dauer = 1.0, n = 28 }) => {
  if (t < a || t > a + dauer + 0.6) return null;
  return (
    <g>
      {Array.from({ length: n }, (_, i) => {
        const start = a + (i % 7) * (dauer / 7);
        const tt = t - start;
        if (tt < 0 || tt > 0.6) return null;
        const w = ((i * 137) % 360) * (Math.PI / 180);
        const v = 500 + ((i * 53) % 400);
        const px = x + Math.cos(w) * v * tt;
        const py = y + Math.sin(w) * v * tt + 900 * tt * tt;
        const l = 30 * (1 - tt / 0.6);
        return <line key={i} x1={px} y1={py} x2={px - Math.cos(w) * l} y2={py - Math.sin(w) * l} stroke={i % 3 ? "#ffd166" : "#ffffff"} strokeWidth={5} strokeLinecap="round" opacity={1 - tt / 0.6} />;
      })}
    </g>
  );
};

// ---------------------------------------------------------------------------
// Pick-up von oben (Nase nach oben), Mitte (x, y), Drehung dreh. blockiert 0..1 färbt die Hinterräder rot.
// ---------------------------------------------------------------------------
export const PickupOben: React.FC<{ x: number; y: number; dreh?: number; s?: number; blockiert?: number }> = ({ x, y, dreh = 0, s = 1, blockiert = 0 }) => {
  const rad = (rx: number, ry: number, hinten: boolean) => (
    <rect x={rx - 16} y={ry - 34} width={32} height={68} rx={8} fill={hinten && blockiert > 0 ? C.red : "#1b1f27"} opacity={hinten && blockiert > 0 ? 0.6 + 0.4 * blockiert : 1} />
  );
  return (
    <g transform={`translate(${x} ${y}) rotate(${dreh}) scale(${s})`}>
      {rad(-74, -120, false)}{rad(74, -120, false)}{rad(-74, 110, true)}{rad(74, 110, true)}
      <rect x={-70} y={-200} width={140} height={390} rx={34} fill="#d64545" stroke={C.ink} strokeWidth={6} />
      <rect x={-58} y={-120} width={116} height={100} rx={16} fill="#2b3442" />
      <rect x={-56} y={-10} width={112} height={180} rx={10} fill="#a83636" stroke={C.ink} strokeWidth={4} />
      {[-30, 0, 30].map((dx) => <line key={dx} x1={dx} y1={0} x2={dx} y2={160} stroke="#8c2c2c" strokeWidth={4} />)}
      <rect x={-56} y={-196} width={30} height={12} rx={4} fill="#fff7c2" />
      <rect x={26} y={-196} width={30} height={12} rx={4} fill="#fff7c2" />
      <rect x={-56} y={180} width={26} height={8} rx={3} fill={C.red} />
      <rect x={30} y={180} width={26} height={8} rx={3} fill={C.red} />
    </g>
  );
};

/** Qualmwolken ab Zeitpunkt a, die an (x, y) entstehen und wachsen. */
export const Qualm: React.FC<{ t: number; a: number; punkte: [number, number][] }> = ({ t, a, punkte }) => {
  if (t < a) return null;
  return (
    <g>
      {punkte.map(([x, y], i) => {
        const tt = t - a - i * 0.12;
        if (tt < 0) return null;
        const r = 30 + tt * 90;
        return <circle key={i} cx={x + Math.sin(i * 2.1) * tt * 40} cy={y + tt * 20} r={r} fill="#d9dde4" opacity={Math.max(0, 0.75 - tt * 0.4)} />;
      })}
    </g>
  );
};

// ---------------------------------------------------------------------------
// Antriebsstrang senkrecht: Motor → Kupplung → Getriebe → Räder. trenn 0..1 öffnet die Kupplung.
// zustand je Teil: 0 neutral, 1 gut (grün), 2 Gefahr (rot), 3 Warnung (gelb).
// ---------------------------------------------------------------------------
export const Antrieb: React.FC<{ x: number; y: number; trenn: number; zustand: [number, number, number, number]; dunkel?: boolean; o?: number[] }> = ({ x, y, trenn, zustand, dunkel, o = [1, 1, 1, 1] }) => {
  const namen = ["MOTOR", "KUPPLUNG", "GETRIEBE", "RÄDER"];
  const farbe = (z: number) => (z === 1 ? C.green : z === 2 ? C.red : z === 3 ? "#ffb81c" : dunkel ? C.glow : C.ink);
  const H = 150, GAP = 70;
  return (
    <g>
      {namen.map((n, i) => {
        const yy = y + i * (H + GAP) + (i === 0 ? -trenn * 60 : 0);
        const f = farbe(zustand[i]);
        return (
          <g key={n} opacity={o[i]}>
            {i < 3 ? (
              <rect x={x - 14} y={yy + H} width={28} height={GAP + (i === 0 ? trenn * 60 : 0)} fill={i === 0 && trenn > 0.05 ? "none" : dunkel ? rgba(C.glow, 0.6) : "#9aa3b2"} />
            ) : null}
            <rect x={x - 230} y={yy} width={460} height={H} rx={26} fill={dunkel ? rgba(f, 0.14) : C.paper2} stroke={f} strokeWidth={7} />
            <text x={x} y={yy + H / 2 + 22} textAnchor="middle" fontFamily={HEAD} fontWeight={900} fontSize={60} fill={dunkel ? C.darkText : C.ink}>{n}</text>
            {zustand[i] === 1 ? <text x={x + 190} y={yy + H / 2 + 22} textAnchor="middle" fontFamily={HEAD} fontWeight={900} fontSize={66} fill={C.green}>✓</text> : null}
            {zustand[i] === 2 || zustand[i] === 3 ? <text x={x + 190} y={yy + H / 2 + 24} textAnchor="middle" fontFamily={HEAD} fontWeight={900} fontSize={66} fill={f}>!</text> : null}
          </g>
        );
      })}
      {trenn > 0.05 ? (
        <g opacity={ease(trenn, 0.3, 1)}>
          <line x1={x - 120} y1={y + H + GAP / 2 - 30} x2={x + 120} y2={y + H + GAP / 2 - 30} stroke={C.red} strokeWidth={6} strokeDasharray="14 10" />
        </g>
      ) : null}
    </g>
  );
};
