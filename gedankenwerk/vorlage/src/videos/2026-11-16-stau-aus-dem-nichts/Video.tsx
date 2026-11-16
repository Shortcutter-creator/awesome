// Video „Stau aus dem Nichts“ – Skript des Nutzers. Eigene Stimme: Einstieg verwundert/fragend, ab der Erklärung energisch.
// Vogelperspektive auf eine dreispurige Autobahn; Verkehr wird simuliert (Geschwindigkeitsfeld + Abstandsregel),
// Nagoya-Experiment als Kreisbahn mit 22 Autos. Eigenes Musikbett (bett_puls). Keine Untertitel, kein Outro.
import React from "react";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame } from "remotion";
import { FPS, HEAD, MONO, at, ease, pop, rgba, type Voice } from "../../basis/lib";
import { Fahrzeug, sz, kamera } from "../../bausteine/verkehr/teile";
import {
  AutoAufBahn, Autobahn, CREME, GELB, Kachel, NACHT, Pille, ROT, Ringbahn, Uhr, farbe, laengeM, merke, simuliere, stauFeld, sy, typ, zustand,
  type Lauf,
} from "../../bausteine/stau/teile";
import daten from "./woerter.json";

const GN = "#3ecf7a"; // Grün
const V = daten as unknown as Voice;
const WD = V.words;
const Z = (n: number) => V.zeilen[Math.min(n, V.zeilen.length - 1)].s;
const A = (w: string, n: number | { ab: number } = 1) => at(WD, w, n);

export const DAUER = Math.ceil((V.dauer + 1.8) * FPS);

const aStau1 = A("Stau", 1);
const a15 = A("15", 1);
const aVerschw = A("verschwindet");
const aEinfach = A("einfach", 1);
const aUnfall = A("Unfall");
const aBaustelle = A("Baustelle");
const aSein = A("sein");
const aEinziges = A("einziges");
const aBremst1 = A("bremst", 1);
const aDicht = A("dicht");
const aDahinter = A("dahinter");
const aSpaet = A("spät");
const aStaerker1 = A("stärker", 1);
const aStaerker2 = A("stärker", 2);
const aStehen = A("stehen");
const aStauwelle = A("Stauwelle");
const aVorne = A("Vorne");
const aHinten2 = A("hinten", 2);
const aRueck = A("rückwärts");
const aFahrtr = A("Fahrtrichtung");
const a15b = A("15", 2);
const aJapan = A("Japan");
const a22 = A("22");
const aKreis = A("Kreis");
const aGleich1 = A("gleichmäßig", 1);
const aWenigen = A("wenigen");
const aTrotzdem = A("trotzdem");
const aHindernis = A("Hindernis");
const aDeshalb = A("Deshalb");
const aAbstand = A("Abstand");
const aGleich2 = A("gleichmäßig", 2);
const aSpurw = A("Spurwechseln");
const aBremser = A("Bremser");
const aWelle = A("Welle", { ab: Z(16) });
const aBeste = A("beste");

const KAMERA = [aStau1, a15, aUnfall, aBaustelle, aSein, aEinziges, aDicht, aBremst1, aDahinter, aStaerker1, aStaerker2, aStehen, aStauwelle, aVorne, aHinten2, aRueck, aJapan, a22, aKreis, aGleich1, aWenigen, aTrotzdem, aDeshalb, aAbstand, aGleich2, aSpurw, aWelle, aBeste];

// Startpositionen: je Spur absteigend (vorne zuerst), leicht versetzt
const starts = (oben: number, unten: number, abstand: number, versatz = [0, 0.35, 0.7]) =>
  versatz.map((o, s) => {
    const xs: number[] = [];
    for (let x = oben - o * abstand + ((s * 7) % 5); x > unten; x -= abstand * (0.85 + 0.3 * (((xs.length * 37 + s * 11) % 10) / 10))) xs.push(x);
    return xs;
  });

const Bahnautos: React.FC<{ l: Lauf[]; t: number; camX: number; k: number; spurPx: number; mitteY?: number; nur?: number }> = ({ l, t, camX, k, spurPx, mitteY = 960, nur }) => (
  <g>
    {l.map((spur, s) =>
      Array.from({ length: spur.n }, (_, i) => {
        if (nur !== undefined && s !== nur) return null;
        const z = zustand(spur, t, i);
        return <AutoAufBahn key={`${s}-${i}`} x={z.x} spur={s} camX={camX} k={k} i={i} b={z.b} t={t} mitteY={mitteY} spurPx={spurPx} />;
      }),
    )}
  </g>
);

// ---- 1 · Hook: Stau entsteht, 15 Minuten, löst sich auf – vorne ist nichts -------------------------------
const H_K = 22;
const H_P = 150;
const tS = aStau1 - 0.9; // Stau wächst ab hier von vorne nach hinten
const tV = aVerschw - 0.1; // ab hier löst er sich vorne auf
const hookLauf = () =>
  merke("hook", () =>
    simuliere(
      starts(400, -520, 19),
      stauFeld(14, 0, (t) => (t < tS ? 75 : 75 - 42 * (t - tS)), (t) => (t < tV ? 75 : 75 - 26 * (t - tV)), 14, 26),
      -4, Z(4) + 0.6, { vStart: 14, T: 0.5, s0: 1.6, laenge: laengeM(H_P, H_K) },
    ),
  );

const Hook: React.FC<{ t: number; o: number }> = ({ t, o }) => {
  if (o <= 0) return null;
  const l = hookLauf();
  const vor = ease(t, aEinfach - 0.1, aEinfach + 1.1);
  const camX = 0 + 150 * vor;
  const fragen = [[230, 640], [850, 820], [300, 1240], [820, 1420], [560, 520]];
  const minuten = 15 * ease(t, a15 - 0.1, aVerschw - 0.2);
  const pU = pop(t, a15 - 0.2) * (1 - ease(t, aEinfach - 0.2, aEinfach + 0.1));
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <Autobahn camX={camX} k={H_K} spurPx={H_P} />
        <Bahnautos l={l} t={t} camX={camX} k={H_K} spurPx={H_P} />
        {fragen.map(([x, y], i) => {
          const p = pop(t, aEinfach + 0.45 + i * 0.16, 220, 10);
          return p > 0 ? (
            <text key={i} x={x} y={y} fontFamily={HEAD} fontWeight={900} fontSize={140} fill={GELB} stroke={NACHT} strokeWidth={6} paintOrder="stroke" textAnchor="middle"
              transform={`translate(${x} ${y}) scale(${p}) rotate(${(i % 2 ? 1 : -1) * 12}) translate(${-x} ${-y})`}>?</text>
          ) : null;
        })}
      </svg>
      <Pille x={540} y={250} text="STAU" p={pop(t, aStau1 - 0.1) * (1 - ease(t, aVerschw - 0.2, aVerschw + 0.1))} bg={ROT} fg="#ffffff" size={100} rot={-3} />
      <Uhr x={540} y={400} minuten={minuten} p={pU} />
      <Pille x={540} y={250} text="… EINFACH SO?" p={pop(t, aEinfach) * (1 - ease(t, aUnfall - 0.3, aUnfall))} bg={CREME} fg={NACHT} size={84} />
      {[["💥", "UNFALL", aUnfall, 290], ["🚧", "BAUSTELLE", aBaustelle, 790]].map(([ic, txt, a, x]) => {
        const p = pop(t, (a as number) - 0.1);
        const x2 = pop(t, (a as number) + 0.25, 260, 12);
        return p > 0 ? (
          <div key={txt as string} style={{ position: "absolute", left: x as number, top: 240, transform: `translateX(-50%) scale(${p})`, textAlign: "center" }}>
            <div style={{ position: "relative", width: 300, height: 220, background: rgba(NACHT, 0.85), borderRadius: 28, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", boxShadow: "0 10px 30px rgba(0,0,0,0.45)" }}>
              <div style={{ fontSize: 100, lineHeight: 1 }}>{ic as string}</div>
              <div style={{ fontFamily: HEAD, fontWeight: 900, fontSize: 40, color: CREME, marginTop: 8 }}>{txt as string}</div>
              <svg width={300} height={220} style={{ position: "absolute", inset: 0 }}>
                <g opacity={Math.min(1, x2)} transform={`translate(150 110) scale(${x2})`}>
                  <path d="M-110,-80 L110,80 M110,-80 L-110,80" stroke={ROT} strokeWidth={22} strokeLinecap="round" />
                </g>
              </svg>
            </div>
          </div>
        ) : null;
      })}
    </AbsoluteFill>
  );
};

// ---- 2 · Wie kann das sein? Kamera über der Stelle, an der der Stau begann ----------------------------
const Frage: React.FC<{ t: number; o: number }> = ({ t, o }) => {
  if (o <= 0) return null;
  const l = hookLauf();
  const k = 15 + 2 * ease(t, Z(3), Z(4));
  const camX = 150 - 75 * ease(t, Z(3) - 0.3, Z(3) + 0.8);
  const pK = ease(t, Z(3) - 0.1, Z(3) + 0.5);
  const y = sy(75, camX, k);
  const p = pop(t, aSein - 0.15, 200, 10);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <Autobahn camX={camX} k={k} spurPx={(H_P * k) / H_K} />
        <Bahnautos l={l} t={t} camX={camX} k={k} spurPx={(H_P * k) / H_K} />
        <g opacity={pK}>
          <ellipse cx={540} cy={y} rx={300} ry={180} fill={rgba(ROT, 0.12)} stroke={ROT} strokeWidth={10} strokeDasharray="34 22" strokeDashoffset={-t * 60} />
        </g>
        {p > 0 ? <text x={540} y={y + 90} textAnchor="middle" fontFamily={HEAD} fontWeight={900} fontSize={300} fill={GELB} stroke={NACHT} strokeWidth={10} paintOrder="stroke" transform={`translate(540 ${y}) scale(${p}) translate(-540 ${-y})`}>?</text> : null}
      </svg>
      <Pille x={540} y={250} text="STARTPUNKT DES STAUS" p={pop(t, Z(3) + 0.1)} bg={rgba(NACHT, 0.85)} fg={CREME} size={54} />
    </AbsoluteFill>
  );
};

// ---- 3 · Auslöser: Zeitlupe, eine Kolonne, jeder bremst stärker ---------------------------------------
const A_K = 18;
const KOLONNE = 6;
const VF3 = 10;
const ABST3 = 14;
const A_P = 130;
const bremsplan = () => {
  const t3 = aStaerker2, tE = aStehen - 0.25;
  return [
    { t: aBremst1 + 0.05, tief: 0.25, halten: 0.3, label: "leicht" },
    { t: aStaerker1 - 0.35, tief: 0.45, halten: 0.4, label: "stärker" },
    { t: t3 - 0.3, tief: 0.65, halten: 0.5, label: "noch stärker" },
    { t: t3 + (tE - t3) * 0.35, tief: 0.8, halten: 0.6, label: "" },
    { t: t3 + (tE - t3) * 0.7, tief: 0.92, halten: 0.7, label: "" },
    { t: tE, tief: 1, halten: 99, label: "STEHT" },
  ];
};
const dip = (t: number, b: { t: number; tief: number; halten: number }) => {
  if (t < b.t) return 0;
  const r = 0.55, ab = 1.1;
  if (t < b.t + r) return b.tief * ease(t, b.t, b.t + r);
  if (t < b.t + r + b.halten) return b.tief;
  return b.tief * (1 - ease(t, b.t + r + b.halten, b.t + r + b.halten + ab));
};
const kolonne = (t: number, t0: number) => {
  const plan = bremsplan();
  const n = Math.max(0, Math.ceil((t - t0) * 60));
  const x = Array.from({ length: KOLONNE }, (_, i) => -i * ABST3);
  let cam = -29.4;
  for (let s = 0; s < n; s++) {
    const tt = t0 + s / 60;
    cam += (VF3 * (1 - ease(tt, aStehen - 0.4, aStehen + 0.8))) / 60;
    for (let i = 0; i < KOLONNE; i++) {
      x[i] += (VF3 * (1 - dip(tt, plan[i]))) / 60;
      if (i > 0) x[i] = Math.min(x[i], x[i - 1] - laengeM(A_P, A_K) - 0.8);
    }
  }
  return { cam, autos: x.map((xi, i) => ({ x: xi, b: dip(t, plan[i]) > 0.02 ? Math.min(1, 0.25 + dip(t, plan[i])) : 0, plan: plan[i] })) };
};

const Ausloeser: React.FC<{ t: number; o: number }> = ({ t, o }) => {
  if (o <= 0) return null;
  const t0 = Z(4) - 0.4;
  const { cam: camX, autos } = kolonne(t, t0);
  const k = A_K;
  const xMitte = 540;
  const hl = pop(t, aEinziges - 0.1) * (1 - ease(t, aBremst1 + 1.2, aBremst1 + 1.5));
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <Autobahn camX={camX} k={k} spurPx={A_P} />
        {autos.map((a, i) => {
          const y = sy(a.x, camX, k) + (150 * (A_P * 0.62) / 78) / 2;
          return <Fahrzeug key={i} x={xMitte} y={y} farbe={i === 0 ? "#e8eef5" : farbe(i + 30)} typ={i === 0 ? "kombi" : typ(i + 30)} b={a.b} s={(A_P * 0.62) / 78} t={t} licht={0.4} />;
        })}
        {hl > 0 ? <circle cx={xMitte} cy={sy(autos[0].x, camX, k) + 78} r={130 * hl} fill="none" stroke={GELB} strokeWidth={8} strokeDasharray="20 14" /> : null}
        {(() => {
          const p = pop(t, aDahinter - 0.1) * (1 - ease(t, aStaerker1 + 0.6, aStaerker1 + 0.9));
          return p > 0 ? <circle cx={xMitte} cy={sy(autos[1].x, camX, k) + 78} r={130 * Math.min(1, p)} fill="none" stroke={GELB} strokeWidth={8} strokeDasharray="20 14" /> : null;
        })()}
        {(() => {
          const p = ease(t, aDicht - 0.1, aDicht + 0.25) * (1 - ease(t, aBremst1 - 0.3, aBremst1));
          if (p <= 0) return null;
          const lang = 150 * (A_P * 0.62) / 78;
          return autos.slice(0, -1).map((a2, i) => {
            const y1 = sy(a2.x, camX, k) + lang + 8, y2 = sy(autos[i + 1].x, camX, k) - 8;
            return <path key={`k${i}`} opacity={p} d={`M${xMitte + 150},${y1} l20,0 L${xMitte + 170},${y2} l-20,0`} fill="none" stroke={ROT} strokeWidth={9} strokeLinejoin="round" />;
          });
        })()}
      </svg>
      {autos.map((a, i) => {
        const lbl = a.plan.label;
        if (!lbl) return null;
        const p = pop(t, a.plan.t - 0.05);
        const y = sy(a.x, camX, k) + 78;
        const st = lbl === "STEHT";
        return p > 0 ? (
          <div key={i} style={{ position: "absolute", left: i % 2 ? 190 : 870, top: y, transform: `translate(-50%,-50%) scale(${p})`, background: st ? ROT : rgba(NACHT, 0.85), color: st ? "#fff" : CREME, border: `4px solid ${ROT}`, borderRadius: 18, padding: "6px 22px 10px", fontFamily: HEAD, fontWeight: 900, fontSize: st ? 60 : 42, whiteSpace: "nowrap", boxShadow: "0 8px 22px rgba(0,0,0,0.4)" }}>
            {st ? "■ STEHT" : `↓ ${lbl}`}
          </div>
        ) : null;
      })}
      <Pille x={540} y={250} text="⏱ ZEITLUPE" p={pop(t, Z(4) - 0.1)} bg={rgba(NACHT, 0.85)} fg={CREME} size={50} />
      <Pille x={540} y={350} text="1 AUTO REICHT" p={pop(t, aEinziges - 0.05) * (1 - ease(t, Z(5) - 0.2, Z(5) + 0.1))} bg={GELB} fg={NACHT} size={56} />
      <Pille x={540} y={350} text="DICHT: WENIG ABSTAND" p={pop(t, aDicht - 0.1) * (1 - ease(t, aBremst1 - 0.3, aBremst1))} bg={ROT} fg="#ffffff" size={52} />
      <Pille x={540} y={350} text="ZU SPÄT REAGIERT" p={pop(t, aSpaet - 0.1) * (1 - ease(t, Z(7) - 0.2, Z(7) + 0.1))} bg={ROT} fg="#ffffff" size={56} />
    </AbsoluteFill>
  );
};

// ---- 4 · Stauwelle von oben: roter Streifen wandert rückwärts -------------------------------------------
const W_K = 6.2;
const W_P = 90;
const wC = 6.5; // m/s rückwärts (sichtbar gemacht)
const wT0 = Z(9) - 0.5;
const wU = (t: number) => 50 - wC * (t - wT0);
const welleLauf = () =>
  merke("welle", () => simuliere(starts(320, -1300, 40), stauFeld(19, 0.4, wU, (t) => wU(t) + 26, 14, 30), wT0 - 12, Z(12) + 0.6, { vStart: 19, laenge: laengeM(W_P, W_K) }));

const Welle: React.FC<{ t: number; o: number }> = ({ t, o }) => {
  if (o <= 0) return null;
  const l = welleLauf();
  const camX = -40;
  // Stau-Bereich aus den Autos: langsamer als 5 m/s
  let lo = Infinity, hi = -Infinity;
  l.forEach((sp) => {
    for (let i = 0; i < sp.n; i++) {
      const z = zustand(sp, t, i);
      if (z.v < 5) { lo = Math.min(lo, z.x - 5); hi = Math.max(hi, z.x + 1); }
    }
  });
  const yHi = sy(hi, camX, W_K), yLo = sy(lo, camX, W_K);
  const band = isFinite(lo) ? 1 : 0;
  const pV = ease(t, aVorne - 0.1, aVorne + 0.3) * (1 - ease(t, aRueck - 0.3, aRueck));
  const pH = ease(t, aHinten2 - 0.1, aHinten2 + 0.3) * (1 - ease(t, aRueck - 0.3, aRueck));
  const pR = pop(t, aRueck - 0.1);
  const breite = 3 * W_P;
  const xr = 540 + breite / 2 + 60;
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <Autobahn camX={camX} k={W_K} spurPx={W_P} />
        {band ? (
          <g>
            <rect x={540 - breite / 2 - 20} y={yHi} width={breite + 60 + 40} height={yLo - yHi} rx={18} fill={rgba(ROT, 0.32)} stroke={ROT} strokeWidth={6} />
          </g>
        ) : null}
        <Bahnautos l={l} t={t} camX={camX} k={W_K} spurPx={W_P} />
        {band && pV > 0 ? (
          <g opacity={pV}>
            {[-1, 0, 1].map((s) => (
              <path key={s} d={`M${540 + s * W_P - 22},${yHi - 30} l22,-40 l22,40`} fill="none" stroke={GN} strokeWidth={12} strokeLinecap="round" strokeLinejoin="round" transform={`translate(0 ${-((t * 60) % 40)})`} />
            ))}
          </g>
        ) : null}
        {band && pH > 0 ? (
          <g opacity={pH}>
            {[-1, 0, 1].map((s) => (
              <path key={s} d={`M${540 + s * W_P - 22},${yLo + 70} l22,-40 l22,40`} fill="none" stroke={GELB} strokeWidth={12} strokeLinecap="round" strokeLinejoin="round" transform={`translate(0 ${-((t * 60) % 40)})`} />
            ))}
          </g>
        ) : null}
        {/* Fahrtrichtung links, Stauwelle rechts */}
        <g opacity={ease(t, aFahrtr - 0.2, aFahrtr + 0.2)}>
          <path d="M150,1500 L150,1080" stroke={GN} strokeWidth={22} strokeLinecap="round" />
          <path d="M100,1130 L150,1060 L200,1130" fill="none" stroke={GN} strokeWidth={22} strokeLinecap="round" strokeLinejoin="round" />
        </g>
        {band && pR > 0 ? (
          <g opacity={Math.min(1, pR)}>
            <path d={`M${xr + 110},${(yHi + yLo) / 2 - 140} L${xr + 110},${(yHi + yLo) / 2 + 160}`} stroke={ROT} strokeWidth={22} strokeLinecap="round" />
            <path d={`M${xr + 60},${(yHi + yLo) / 2 + 110} L${xr + 110},${(yHi + yLo) / 2 + 180} L${xr + 160},${(yHi + yLo) / 2 + 110}`} fill="none" stroke={ROT} strokeWidth={22} strokeLinecap="round" strokeLinejoin="round" />
          </g>
        ) : null}
      </svg>
      {band ? <Pille x={540} y={(yHi + yLo) / 2 - 40} text="STAUWELLE" p={pop(t, aStauwelle - 0.1)} bg={ROT} fg="#ffffff" size={58} /> : null}
      {band ? <Pille x={860} y={yHi - 120} text="raus ↑" p={pV} bg={GN} fg={NACHT} size={50} /> : null}
      {band ? <Pille x={860} y={yLo + 40} text="neu dazu ↑" p={pH} bg={GELB} fg={NACHT} size={50} /> : null}
      <Pille x={190} y={1530} text="Fahrtrichtung" p={pop(t, aFahrtr - 0.1)} bg={GN} fg={NACHT} size={40} />
      {band ? <Kachel x={835} y={(yHi + yLo) / 2 + 220} wert="≈ 15 km/h" titel="RÜCKWÄRTS" farbe={ROT} p={pop(t, a15b - 0.1)} /> : null}
    </AbsoluteFill>
  );
};

// ---- 5 · Nagoya-Experiment: 22 Autos im Kreis --------------------------------------------------------------
const RING = 230;
const R_PX = 420;
const RX = 540, RY = 1150;
const R_S = 0.5;
const eT0 = Z(12) - 0.4;
const tJam = aWenigen - 0.6;
const ringFeld = (x: number, t: number) => {
  if (t < tJam) return 8.3;
  const amp = ease(t, tJam, tJam + 1.6);
  const mitte = 60 - 1.6 * (t - tJam);
  let d = (((x - mitte) % RING) + RING) % RING;
  if (d > RING / 2) d -= RING;
  const prof = d < -7 ? Math.max(0, 1 - (-7 - d) / 10) : d > 7 ? Math.max(0, 1 - (d - 7) / 18) : 1;
  return 8.3 * (1 - amp * prof);
};
const ringLauf = () =>
  merke("ring", () => simuliere([Array.from({ length: 22 }, (_, i) => RING - 0.01 - (i * RING) / 22)], (x, t) => ringFeld(x, t), eT0, Z(14) + 0.6, { vStart: 8.3, ring: RING, s0: 1.0, T: 0.3, laenge: (150 * R_S) / ((2 * Math.PI * R_PX) / RING) + 0.4 }));

const Experiment: React.FC<{ t: number; o: number }> = ({ t, o }) => {
  if (o <= 0) return null;
  const l = ringLauf()[0];
  const k = (2 * Math.PI * R_PX) / RING;
  const pRing = ease(t, Z(12) - 0.2, Z(12) + 0.6);
  return (
    <AbsoluteFill style={{ opacity: o, background: "#4f7d41" }}>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        {Array.from({ length: 70 }, (_, i) => <circle key={i} cx={(i * 211) % 1080} cy={(i * 397) % 1920} r={6 + (i % 4) * 4} fill={i % 2 ? "#47733b" : "#5b8c4b"} opacity={0.6} />)}
        <g opacity={pRing} transform={`translate(${RX} ${RY}) scale(${0.9 + 0.1 * pRing}) translate(${-RX} ${-RY})`}>
          <Ringbahn cx={RX} cy={RY} r={R_PX} breite={78 * R_S * 1.9} />
          {(() => {
            const z = ease(t, aKreis - 0.1, aKreis + 0.7) * (1 - ease(t, aGleich1 + 0.3, aGleich1 + 0.6));
            const u = 2 * Math.PI * (R_PX + 70);
            return z > 0 ? <circle cx={RX} cy={RY} r={R_PX + 70} fill="none" stroke={GELB} strokeWidth={10} strokeDasharray={`${u * z} ${u}`} transform={`rotate(-90 ${RX} ${RY})`} strokeLinecap="round" /> : null;
          })()}
          {(() => {
            const g = ease(t, aGleich1 - 0.1, aGleich1 + 0.3) * (1 - ease(t, aWenigen - 0.4, aWenigen));
            return g > 0 ? <circle cx={RX} cy={RY} r={R_PX} fill="none" stroke={rgba(GN, 0.55)} strokeWidth={90 + 20 * Math.sin(t * 6)} opacity={g} /> : null;
          })()}
          {Array.from({ length: l.n }, (_, i) => {
            const z = zustand(l, t, i);
            if (z.v > 3.5 || t < tJam) return null;
            const w = (z.x / RING) * Math.PI * 2 - Math.PI / 2;
            return <circle key={`g${i}`} cx={RX + Math.cos(w) * R_PX} cy={RY + Math.sin(w) * R_PX} r={66} fill={rgba(ROT, 0.42)} />;
          })}
          {Array.from({ length: l.n }, (_, i) => {
            const z = zustand(l, t, i);
            const w = (z.x / RING) * Math.PI * 2 - Math.PI / 2; // gegen den Uhrzeigersinn? → im Uhrzeigersinn ab oben
            const x = RX + Math.cos(w) * R_PX, y = RY + Math.sin(w) * R_PX;
            const dreh = (w * 180) / Math.PI + 180; // Fahrtrichtung tangential
            return <Fahrzeug key={i} x={x} y={y} farbe={farbe(i + 50)} typ="pkw" b={z.b} s={R_S} t={t} dreh={dreh} licht={0} />;
          })}
        </g>
      </svg>
      <Pille x={540} y={250} text="🇯🇵 NAGOYA, 2008" p={pop(t, aJapan - 0.1)} bg={CREME} fg={NACHT} size={56} />
      <Kachel x={290} y={370} wert="22" titel="AUTOS" farbe={GELB} p={pop(t, a22 - 0.1)} />
      <Kachel x={790} y={370} wert="230 m" titel="KREIS" farbe={GELB} p={pop(t, aKreis - 0.1)} />
      <Kachel x={540} y={530} wert="≈ 30 km/h" titel="GLEICHMÄSSIG" farbe={GN} p={pop(t, aGleich1 - 0.1)} />
      <Pille x={540} y={1640} text="⏱ wenige Minuten später" p={pop(t, aWenigen - 0.1) * (1 - ease(t, aTrotzdem - 0.2, aTrotzdem + 0.1))} bg={rgba(NACHT, 0.85)} fg={CREME} size={48} />
      <Pille x={540} y={1640} text="STAU – OHNE HINDERNIS" p={pop(t, aTrotzdem)} bg={ROT} fg="#ffffff" size={56} />
    </AbsoluteFill>
  );
};

// ---- 6 · Lösung: Abstand, gleichmäßig, wenig Spurwechsel – Bremser läuft aus ----------------------------
const L_K = 14;
const L_P = 140;
const tB = aBremser - 0.2;
const loesFeld = (x: number, t: number, spur: number) => {
  if (t < tB) return 19;
  const amp = 0.5 * Math.exp(-(t - tB) / 1.0) * ease(t, tB, tB + 0.3);
  const mitte = -10 - 6 * (t - tB);
  const d = x - mitte;
  const prof = Math.exp(-((d / 22) ** 2)) * (spur === 1 ? 1 : 0.35);
  return 19 * (1 - amp * prof);
};
const loesLauf = () => merke("loesung", () => simuliere(starts(300, -900, 44), loesFeld, Z(14) - 6, V.dauer + 2.5, { vStart: 19, T: 1.2, laenge: laengeM(L_P, L_K) }));

const Loesung: React.FC<{ t: number; o: number }> = ({ t, o }) => {
  if (o <= 0) return null;
  const l = loesLauf();
  const camX = 19 * (t - Z(14)) * 0.0 + 10;
  const pA = ease(t, aAbstand - 0.1, aAbstand + 0.3) * (1 - ease(t, aBremser - 0.4, aBremser - 0.1));
  // Abstands-Klammern in der mittleren Spur
  const mitte = l[1];
  const sichtbar: number[] = [];
  for (let i = 0; i < mitte.n; i++) {
    const y = sy(zustand(mitte, t, i).x, camX, L_K);
    if (y > 300 && y < 1700) sichtbar.push(i);
  }
  const xm = 540 + L_P * 1.5 + 70 + 40;
  const pOk = pop(t, aWelle - 0.1);
  // Bremser: Auto der mittleren Spur, das zu Beginn der Bremsung der Störung am nächsten ist
  let bi = 0, bd = 1e9;
  for (let i = 0; i < mitte.n; i++) { const d = Math.abs(zustand(mitte, tB, i).x - -10); if (d < bd) { bd = d; bi = i; } }
  const bz = zustand(mitte, t, bi);
  const bY = sy(bz.x, camX, L_K) + (150 * (L_P * 0.62) / 78) / 2;
  const pBr = pop(t, aBremser - 0.15) * (1 - ease(t, aWelle + 0.6, aWelle + 0.9));
  const pE = pop(t, aBeste - 0.15);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <Autobahn camX={camX} k={L_K} spurPx={L_P} />
        <Bahnautos l={l} t={t} camX={camX} k={L_K} spurPx={L_P} />
        {pA > 0
          ? sichtbar.slice(0, -1).map((i, j) => {
              const y1 = sy(zustand(mitte, t, i).x - laengeM(L_P, L_K), camX, L_K) + 6, y2 = sy(zustand(mitte, t, sichtbar[j + 1]).x, camX, L_K) - 6;
              return (
                <g key={i} opacity={pA}>
                  <path d={`M${xm - 22},${y1} L${xm},${y1} L${xm},${y2} L${xm - 22},${y2}`} fill="none" stroke={GN} strokeWidth={10} strokeLinejoin="round" />
                </g>
              );
            })
          : null}
      </svg>
      <Pille x={540} y={250} text="DU KANNST WAS TUN" p={pop(t, aDeshalb - 0.1) * (1 - ease(t, aAbstand - 0.3, aAbstand))} bg={GN} fg={NACHT} size={64} />
      <div style={{ position: "absolute", left: 60, top: 230, display: "flex", flexDirection: "column", gap: 16 }}>
        {[["↕", "ABSTAND HALTEN", aAbstand], ["≈", "GLEICHMÄSSIG FAHREN", aGleich2], ["✕", "WENIG SPURWECHSEL", aSpurw]].map(([ic, txt, a]) => {
          const p = pop(t, (a as number) - 0.1) * (1 - ease(t, aBeste - 0.3, aBeste));
          return p > 0 ? (
            <div key={txt as string} style={{ transform: `scale(${p})`, transformOrigin: "left center", display: "flex", alignItems: "center", gap: 16, background: rgba(NACHT, 0.85), borderRadius: 18, padding: "8px 24px 10px 12px", boxShadow: "0 8px 22px rgba(0,0,0,0.4)", width: "fit-content" }}>
              <div style={{ width: 62, height: 62, borderRadius: 31, background: ic === "✕" ? ROT : GN, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: HEAD, fontWeight: 900, fontSize: 40 }}>{ic as string}</div>
              <div style={{ fontFamily: HEAD, fontWeight: 900, fontSize: 46, color: CREME }}>{txt as string}</div>
            </div>
          ) : null;
        })}
      </div>
      {pBr > 0 ? (
        <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
          <circle cx={540} cy={bY} r={130 * Math.min(1, pBr)} fill="none" stroke={GELB} strokeWidth={8} strokeDasharray="22 14" />
        </svg>
      ) : null}
      <Pille x={850} y={bY - 40} text="Bremser" p={pBr} bg={GELB} fg={NACHT} size={46} />
      {pOk > 0 ? (
        <div style={{ position: "absolute", left: 540, top: 1380, transform: `translate(-50%,-50%) scale(${pOk * (1 - ease(t, aBeste - 0.3, aBeste))})`, width: 220, height: 220, borderRadius: 110, background: GN, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 12px 36px rgba(0,0,0,0.45)" }}>
          <svg width={140} height={140} viewBox="0 0 100 100"><path d="M20,52 L42,74 L82,30" fill="none" stroke="#fff" strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" /></svg>
        </div>
      ) : null}
      <Pille x={540} y={1530} text="WELLE VERPUFFT" p={pop(t, aWelle + 0.1) * (1 - ease(t, aBeste - 0.3, aBeste))} bg={GN} fg={NACHT} size={50} />
      {pE > 0 ? (
        <div style={{ position: "absolute", left: 540, top: 820, transform: `translate(-50%,-50%) scale(${pE})`, width: 900, background: CREME, borderRadius: 34, padding: "34px 40px 40px", textAlign: "center", boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }}>
          <div style={{ fontFamily: HEAD, fontWeight: 900, fontSize: 64, lineHeight: 1.1, color: NACHT }}>Der beste Stau ist der,</div>
          <div style={{ fontFamily: HEAD, fontWeight: 900, fontSize: 64, lineHeight: 1.1, color: "#1f9d55", opacity: ease(t, A("den", { ab: aBeste }) - 0.1, A("den", { ab: aBeste }) + 0.2) }}>den du nie verursachst.</div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

export const Video: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  const k = kamera(t, KAMERA);
  return (
    <AbsoluteFill style={{ background: "#4f7d41", overflow: "hidden" }}>
      <Audio src={staticFile(V.audio)} />
      <AbsoluteFill style={{ transform: `scale(${k})`, transformOrigin: "540px 900px" }}>
        <Hook t={t} o={sz(t, 0, Z(3) - 0.05, 0.15)} />
        <Frage t={t} o={sz(t, Z(3) - 0.05, Z(4) - 0.1, 0.15)} />
        <Ausloeser t={t} o={sz(t, Z(4) - 0.1, Z(9))} />
        <Welle t={t} o={sz(t, Z(9), Z(12))} />
        <Experiment t={t} o={sz(t, Z(12), Z(14))} />
        <Loesung t={t} o={sz(t, Z(14), 999)} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** Für das Cover: Stauwelle von oben (roter Streifen), ohne Text. */
export const CoverBild: React.FC = () => <Welle t={Z(10) + 1.5} o={1} />;

export { MONO };
