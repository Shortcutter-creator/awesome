// Stau-Bausteine: dreispurige Autobahn von oben (Autos fahren nach oben), Verkehrs-Simulation mit Stauwelle
// (Geschwindigkeitsfeld + Abstandsregel, keine Überholvorgänge, kein Auffahren), Kreisbahn für das Nagoya-Experiment.
// Weltkoordinaten in Metern (x = Strecke in Fahrtrichtung), Darstellung über Kamera (camX, k px/m).
import React from "react";
import { HEAD, MONO, rgba } from "../../basis/lib";
import { Fahrzeug, FARBEN, type Typ } from "../verkehr/teile";

export const GRAS = "#4f7d41";
export const ASPHALT = "#3a3e46";
export const CREME = "#f6f3ec";
export const ROT = "#ff4d4d";
export const GRUEN = "#3ecf7a";
export const GELB = "#ffd23f";
export const NACHT = "#11151c";

export const SPUR_B = 3.75; // Spurbreite in m
export const FPS_SIM = 30;

const glatt = (u: number) => (u <= 0 ? 0 : u >= 1 ? 1 : u * u * (3 - 2 * u));

// ---------------------------------------------------------------------------------------------------
// Simulation
// ---------------------------------------------------------------------------------------------------
export type Feld = (x: number, t: number, spur: number) => number; // Wunschgeschwindigkeit in m/s
export type Lauf = { x: Float32Array[]; v: Float32Array[]; b: Float32Array[]; t0: number; n: number };

/** Stau-Bereich zwischen hinterer Kante u(t) und vorderer Kante d(t): v = vf außerhalb, vj innen, weiche Rampen. */
export const stauFeld = (vf: number, vj: number, u: (t: number) => number, d: (t: number) => number, rampeH = 18, rampeV = 30) =>
  (x: number, t: number) => {
    const uu = u(t), dd = d(t);
    if (dd <= uu) return vf;
    let k = 0;
    if (x < uu) k = 1 - glatt((uu - x) / rampeH);
    else if (x > dd) k = 1 - glatt((x - dd) / rampeV);
    else k = 1;
    return vf - (vf - vj) * k;
  };

/**
 * Fahrzeuge je Spur, Startpositionen x0 (absteigend sortiert je Spur). Wunsch v aus dem Feld, begrenzt durch
 * Abstand (s0 + T·v) zum Vordermann und durch Beschleunigung/Bremsung. Ringlänge > 0: Kreisbahn.
 */
export const simuliere = (
  spuren: number[][], feld: Feld, t0: number, t1: number, opt: { vStart?: number; s0?: number; T?: number; aMax?: number; bMax?: number; laenge?: number; ring?: number } = {},
): Lauf[] => {
  const { vStart = 15, s0 = 2.0, T = 0.9, aMax = 2.6, bMax = 7, laenge = 4.6, ring = 0 } = opt;
  const dt = 1 / 120;
  const schritte = Math.ceil((t1 - t0) * FPS_SIM) + 1;
  return spuren.map((x0, spur) => {
    const n = x0.length;
    const x = Float64Array.from(x0), v = new Float64Array(n).fill(vStart), bl = new Float64Array(n);
    const out: Lauf = { x: [], v: [], b: [], t0, n };
    let t = t0, f = 0;
    const speichern = () => {
      out.x.push(Float32Array.from(x)); out.v.push(Float32Array.from(v)); out.b.push(Float32Array.from(bl));
    };
    speichern();
    while (f < schritte - 1) {
      for (let s = 0; s < 120 / FPS_SIM; s++) {
        for (let i = 0; i < n; i++) {
          let wunsch = feld(x[i], t, spur);
          const vor = ring ? (i === 0 ? n - 1 : i - 1) : i - 1;
          if (vor >= 0 && (ring || i > 0)) {
            let luecke = x[vor] - x[i];
            if (ring) luecke = ((luecke % ring) + ring) % ring;
            luecke -= laenge;
            const grenze = Math.max(0, (luecke - s0) / T);
            wunsch = Math.min(wunsch, grenze, v[vor] + Math.max(0, luecke - s0) * 0.9);
          }
          const dv = Math.max(-bMax * dt, Math.min(aMax * dt, wunsch - v[i]));
          const neu = Math.max(0, v[i] + dv);
          const verz = (v[i] - neu) / dt;
          bl[i] = Math.max(bl[i] * 0.94, neu < 0.6 ? 1 : Math.min(1, verz / 2.2));
          if (neu > 0.6 && verz < 0.3) bl[i] *= 0.9;
          v[i] = neu;
        }
        for (let i = 0; i < n; i++) x[i] += v[i] * dt;
        if (ring) for (let i = 0; i < n; i++) if (x[i] >= ring) x[i] -= ring;
        t += dt;
      }
      f++;
      speichern();
    }
    return out;
  });
};

const CACHE = new Map<string, Lauf[]>();
export const merke = (key: string, f: () => Lauf[]) => {
  if (!CACHE.has(key)) CACHE.set(key, f());
  return CACHE.get(key)!;
};

/** Zustand zum Zeitpunkt t (lineare Interpolation zwischen Bildern). */
export const zustand = (l: Lauf, t: number, i: number) => {
  const f = Math.max(0, Math.min(l.x.length - 1.001, (t - l.t0) * FPS_SIM));
  const a = Math.floor(f), k = f - a;
  return { x: l.x[a][i] + (l.x[a + 1][i] - l.x[a][i]) * k, v: l.v[a][i] + (l.v[a + 1][i] - l.v[a][i]) * k, b: l.b[a][i] + (l.b[a + 1][i] - l.b[a][i]) * k };
};

export const farbe = (i: number) => FARBEN[(i * 7 + 2) % FARBEN.length];
const TYPEN: Typ[] = ["pkw", "kombi", "pkw", "pkw", "transporter", "pkw", "kombi"];
export const typ = (i: number) => TYPEN[(i * 5 + 1) % TYPEN.length];

// ---------------------------------------------------------------------------------------------------
// Darstellung
// ---------------------------------------------------------------------------------------------------
/** Bildschirm-y für Welt-x (Kamera camX in Bildmitte bei y = mitteY). */
export const sy = (x: number, camX: number, k: number, mitteY = 960) => mitteY - (x - camX) * k;

/** Dreispurige Autobahn (senkrecht, Bildmitte x = 540). Mittelstreifen links mit Leitplanke, rechts Standstreifen. */
export const Autobahn: React.FC<{ camX: number; k: number; spuren?: number; mitteY?: number; spurPx?: number }> = ({ camX, k, spuren = 3, mitteY = 960, spurPx }) => {
  const sb = spurPx ?? SPUR_B * k;
  const q = sb / SPUR_B; // Querschnitt: px pro m
  const breite = spuren * sb;
  const x0 = 540 - breite / 2;
  const oben = camX + (mitteY) / k, unten = camX - (1920 - mitteY) / k; // Welt-x am oberen/unteren Rand
  const striche: number[] = [];
  for (let x = Math.floor(unten / 18) * 18 - 18; x < oben + 18; x += 18) striche.push(x);
  const baeume: { x: number; s: number; seite: number }[] = [];
  for (let i = Math.floor(unten / 9) - 2; i * 9 < oben + 20; i++) {
    const h = Math.abs((i * 2654435761) % 1000);
    if (h % 3 === 0) continue;
    baeume.push({ x: i * 9 + (h % 5), s: h, seite: h % 2 ? 1 : -1 });
  }
  const standstreifen = 2.5 * q;
  const bankett = 1.2 * q;
  return (
    <g>
      <rect x={0} y={0} width={1080} height={1920} fill={GRAS} />
      {Array.from({ length: 90 }, (_, i) => {
        const wx = Math.floor(unten / 40) * 40 + ((i * 37) % Math.max(1, Math.ceil(oben - unten) + 80));
        const y = sy(wx, camX, k, mitteY);
        const xx = (i * 211) % 2 ? 30 + ((i * 53) % Math.max(10, x0 - 120)) : x0 + breite + standstreifen + 60 + ((i * 71) % 300);
        return <circle key={i} cx={xx} cy={y} r={5 + (i % 4) * 3} fill={i % 2 ? "#47733b" : "#5b8c4b"} opacity={0.6} />;
      })}
      {baeume.map((b, i) => {
        const y = sy(b.x, camX, k, mitteY);
        const r = (2.2 + (b.s % 4) * 0.5) * q;
        const cx = b.seite < 0 ? x0 - bankett - 1.4 * q - r - (b.s % 7) * q * 0.6 : x0 + breite + standstreifen + bankett + 1.6 * q + r + (b.s % 7) * q * 0.6;
        if (cx < -r || cx > 1080 + r) return null;
        return (
          <g key={i}>
            <circle cx={cx + 0.4 * q} cy={y + 0.5 * q} r={r} fill="rgba(0,0,0,0.25)" />
            <circle cx={cx} cy={y} r={r} fill={b.s % 3 === 1 ? "#2f6b33" : "#376f2e"} />
            <circle cx={cx - r * 0.3} cy={y - r * 0.3} r={r * 0.55} fill={b.s % 2 ? "#4a8a3c" : "#438a49"} />
          </g>
        );
      })}
      {/* Bankett, Asphalt, Standstreifen */}
      <rect x={x0 - bankett} y={0} width={breite + standstreifen + 2 * bankett} height={1920} fill="#8d8a80" />
      <rect x={x0 - 0.3 * q} y={0} width={breite + standstreifen + 0.6 * q} height={1920} fill={ASPHALT} />
      {/* Asphaltflecken in Weltkoordinaten */}
      {Array.from({ length: 14 }, (_, i) => {
        const wx = Math.floor(unten / 60) * 60 + i * 23;
        return <rect key={i} x={x0 + ((i * 97) % Math.max(20, breite - 40))} y={sy(wx, camX, k, mitteY)} width={(1 + (i % 3)) * q} height={0.5 * q} rx={0.25 * q} fill="rgba(0,0,0,0.09)" />;
      })}
      {/* Leitplanken */}
      {[x0 - bankett - 0.6 * q, x0 + breite + standstreifen + bankett + 0.6 * q].map((x) => (
        <g key={x}>
          <line x1={x} x2={x} y1={0} y2={1920} stroke="#c8ccd2" strokeWidth={Math.max(3, 0.25 * q)} />
          <line x1={x + 2} x2={x + 2} y1={0} y2={1920} stroke="#8e939b" strokeWidth={1.5} />
        </g>
      ))}
      {/* Randlinien */}
      <line x1={x0} x2={x0} y1={0} y2={1920} stroke="#f2f2f2" strokeWidth={Math.max(3, 0.15 * q)} />
      <line x1={x0 + breite} x2={x0 + breite} y1={0} y2={1920} stroke="#f2f2f2" strokeWidth={Math.max(3, 0.25 * q)} />
      {/* Leitlinien: 6 m Strich, 12 m Lücke */}
      {Array.from({ length: spuren - 1 }, (_, s) =>
        striche.map((wx) => {
          const y1 = sy(wx + 6, camX, k, mitteY), y2 = sy(wx, camX, k, mitteY);
          return <rect key={`${s}-${wx}`} x={x0 + (s + 1) * sb - Math.max(1.5, 0.075 * q)} y={y1} width={Math.max(3, 0.15 * q)} height={y2 - y1} fill="#f2f2f2" />;
        }),
      )}
    </g>
  );
};

/** Fahrzeug auf der Autobahn zeichnen (Spur 0 = links). */
export const AutoAufBahn: React.FC<{ x: number; spur: number; camX: number; k: number; i: number; b: number; t: number; mitteY?: number; spuren?: number; dx?: number; spurPx: number }> = ({
  x, spur, camX, k, i, b, t, mitteY = 960, spuren = 3, dx = 0, spurPx,
}) => {
  const s = (spurPx * 0.62) / 78; // Breite ≈ 62 % der Spur
  const lang = 150 * s; // px
  const breite = spuren * spurPx;
  const cx = 540 - breite / 2 + (spur + 0.5) * spurPx + dx;
  const cy = sy(x, camX, k, mitteY) + lang / 2;
  if (cy < -200 || cy > 2120) return null;
  return <Fahrzeug x={cx} y={cy} farbe={farbe(i + spur * 13)} typ={typ(i + spur * 5)} b={b} s={s} t={t} licht={0.4} />;
};
/** Fahrzeuglänge in Metern (Simulation), passend zur gezeichneten Länge. */
export const laengeM = (spurPx: number, k: number) => (150 * (spurPx * 0.62) / 78) / k + 0.4;

/** Kreisbahn (Nagoya): Ring mit Radius r px um (cx, cy). */
export const Ringbahn: React.FC<{ cx: number; cy: number; r: number; breite: number }> = ({ cx, cy, r, breite }) => (
  <g>
    <circle cx={cx} cy={cy} r={r + breite / 2 + 26} fill="#8d8a80" />
    <circle cx={cx} cy={cy} r={r + breite / 2} fill={ASPHALT} />
    <circle cx={cx} cy={cy} r={r - breite / 2} fill={GRAS} />
    <circle cx={cx} cy={cy} r={r - breite / 2 - 26} fill="#5b8c4b" />
    <circle cx={cx} cy={cy} r={r + breite / 2 - 6} fill="none" stroke="#f2f2f2" strokeWidth={5} />
    <circle cx={cx} cy={cy} r={r - breite / 2 + 6} fill="none" stroke="#f2f2f2" strokeWidth={5} />
    {Array.from({ length: 12 }, (_, i) => {
      const w = (i / 12) * Math.PI * 2;
      return <circle key={i} cx={cx + Math.cos(w) * (r * 0.45)} cy={cy + Math.sin(w) * (r * 0.45)} r={30 + (i % 3) * 8} fill={i % 2 ? "#2f6b33" : "#3b8f45"} />;
    })}
  </g>
);

/** Pille mit Text. */
export const Pille: React.FC<{ x: number; y: number; text: React.ReactNode; p: number; bg?: string; fg?: string; size?: number; rot?: number }> = ({ x, y, text, p, bg = CREME, fg = NACHT, size = 56, rot = 0 }) =>
  p <= 0.001 ? null : (
    <div style={{ position: "absolute", left: x, top: y, transform: `translateX(-50%) scale(${p}) rotate(${rot}deg)`, background: bg, color: fg, fontFamily: HEAD, fontWeight: 900, fontSize: size, padding: "8px 28px 12px", borderRadius: 20, whiteSpace: "nowrap", boxShadow: "0 10px 28px rgba(0,0,0,0.4)" }}>{text}</div>
  );

/** Uhr-Kachel „+15 min“. */
export const Uhr: React.FC<{ x: number; y: number; minuten: number; p: number }> = ({ x, y, minuten, p }) =>
  p <= 0.001 ? null : (
    <div style={{ position: "absolute", left: x, top: y, transform: `translateX(-50%) scale(${p})`, display: "flex", alignItems: "center", gap: 22, background: rgba(NACHT, 0.88), border: `4px solid ${GELB}`, borderRadius: 28, padding: "14px 34px 16px 22px", boxShadow: "0 10px 30px rgba(0,0,0,0.45)" }}>
      <svg width={96} height={96} viewBox="-50 -50 100 100">
        <circle r={44} fill={CREME} stroke={GELB} strokeWidth={6} />
        {Array.from({ length: 12 }, (_, i) => <line key={i} x1={0} y1={-36} x2={0} y2={-30} stroke={NACHT} strokeWidth={4} transform={`rotate(${i * 30})`} />)}
        <line x1={0} y1={0} x2={0} y2={-30} stroke={NACHT} strokeWidth={5} strokeLinecap="round" transform={`rotate(${minuten * 6})`} />
        <line x1={0} y1={0} x2={0} y2={-20} stroke={ROT} strokeWidth={6} strokeLinecap="round" transform={`rotate(${minuten * 0.5 + 300})`} />
        <circle r={5} fill={NACHT} />
      </svg>
      <div style={{ fontFamily: HEAD, fontWeight: 900, fontSize: 96, color: GELB, lineHeight: 1 }}>+{Math.round(minuten)} min</div>
    </div>
  );

/** Kennzahl-Kachel. */
export const Kachel: React.FC<{ x: number; y: number; wert: string; titel: string; farbe?: string; p: number }> = ({ x, y, wert, titel, farbe = GELB, p }) =>
  p <= 0.001 ? null : (
    <div style={{ position: "absolute", left: x, top: y, transform: `translateX(-50%) scale(${p})`, background: rgba(NACHT, 0.85), border: `4px solid ${farbe}`, borderRadius: 24, padding: "10px 28px 14px", textAlign: "center", boxShadow: "0 10px 30px rgba(0,0,0,0.45)", whiteSpace: "nowrap" }}>
      <div style={{ fontFamily: HEAD, fontWeight: 900, fontSize: 76, lineHeight: 1, color: farbe }}>{wert}</div>
      <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 24, letterSpacing: 3, color: rgba(CREME, 0.85), marginTop: 4 }}>{titel}</div>
    </div>
  );
