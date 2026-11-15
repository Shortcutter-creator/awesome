// Video „Reißverschluss: Warum du erst ganz vorne einfädeln solltest“ – Skript des Nutzers, eigene Stimme (energisch,
// erster Satz als Frage). Vogelperspektive: Autos fahren nach oben, die rechte Spur endet an einer Baustelle.
// Hook: Das „Egoist“-Auto fährt auf der freien RECHTEN Spur vor (die endende Spur), sonst wäre die Szene unlogisch.
// Keine Untertitel, kein Outro.
import React from "react";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame } from "remotion";
import { FPS, HEAD, MONO, at, ease, pop, rgba, type Voice } from "../../basis/lib";
import {
  CREME, ENGE, FARBEN, Fahrer, Fahrzeug, GELB, GRUEN, KEIL, NACHT, ORANGE, Pille, RAND_R, ROT, SPUR_L, SPUR_R, SchildEnde, Stauzaehler, Strasse, type Typ,
  kamera, sz,
} from "../../bausteine/verkehr/teile";
import daten from "./woerter.json";

const V = daten as unknown as Voice;
const WD = V.words;
const Z = (n: number) => V.zeilen[Math.min(n, V.zeilen.length - 1)].s;
const A = (w: string, n: number | { ab: number } = 1) => at(WD, w, n);

export const DAUER = Math.ceil((V.dauer + 1.6) * FPS);

const aEgoist = A("Egoist");
const aFalsch = A("Falsch");
const aRichtig = A("richtig");
const aPflicht = A("Pflicht");
const aZwei = A("zweispurige");
const aBaustelle = A("Baustelle");
const aEndet = A("endet");
const aFrueh = A("früh");
const aLeer = A("leer");
const aGebremst = A("gebremst");
const aWaechst = A("wächst", 1);
const aHinten = A("hinten");
const aBeide = A("beide", 1);
const aVorne2 = A("vorne", { ab: Z(9) });
const aEngstelle = A("Engstelle");
const aAbw1 = A("abwechselnd", 1);
const aLinks = A("links");
const aRechts = A("rechts", { ab: Z(10) });
const aReiss = A("Reißverschluss");
const aHalb = A("halb");
const aGerecht = A("gerechter");
const aDran = A("dran");
const aVorne3 = A("vorne", { ab: Z(13) });
const aEinf = A("einfädeln", { ab: Z(13) });
const aLass = A("lass", { ab: Z(14) });

const KAMERA = [aEgoist, aFalsch, aRichtig, aPflicht, aBaustelle, aEndet, aFrueh, aLeer, aGebremst, aBeide, aEngstelle, aLinks, aRechts, aHalb, aGerecht, aVorne3, aEinf, aLass];

const GAP = 200;
const TYPEN: Typ[] = ["pkw", "kombi", "pkw", "transporter", "pkw", "kombi", "pkw"];
const farbe = (i: number) => FARBEN[(i * 5 + 3) % FARBEN.length];
const typ = (i: number) => TYPEN[(i * 3 + 1) % TYPEN.length];

type Auto = { x: number; y: number; farbe: string; typ?: Typ; b?: number; blink?: number; dreh?: number };

/** Welt mit Kamera: (cx, cy) = Weltpunkt in Bildmitte, s = Maßstab. */
const Welt: React.FC<{ t: number; s: number; cx?: number; cy: number; autos: Auto[]; baustelle?: number; zweispurig?: boolean; kinder?: React.ReactNode }> = ({
  t, s, cx = 540, cy, autos, baustelle = 1, zweispurig = false, kinder,
}) => {
  const y0 = cy - 960 / s - 200, y1 = cy + 960 / s + 200;
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
      <g transform={`translate(540 960) scale(${s}) translate(${-cx} ${-cy})`}>
        <Strasse y0={y0} y1={y1} t={t} baustelle={baustelle} zweispurig={zweispurig} />
        {kinder}
        {autos.filter((a) => a.y > y0 - 200 && a.y < y1 + 200).map((a, i) => <Fahrzeug key={i} {...a} t={t} />)}
      </g>
    </svg>
  );
};

// ---- Reißverschluss-Mechanik: abwechselnd links / rechts, Fahrzeuge rücken nach -------------------------
const D = 0.8; // Dauer des Anfahrens
const FRONT_L = ENGE + 290;
const FRONT_R = ENGE + KEIL + 60;
const ZIEL = ENGE - 40; // hier ist ein rechtes Auto ganz drüben
const weg = (tau: number) => (tau <= 0 ? 0 : tau < D ? GAP * (tau / D) ** 2 : GAP + (2 * GAP / D) * (tau - D));
const dauerBis = (s: number) => (s <= GAP ? D * Math.sqrt(s / GAP) : D + (s - GAP) / (2 * GAP / D));

/** Zeiten, zu denen die Fahrzeuge losfahren: Überquerung der Engstelle gleichmäßig alle c Sekunden, links zuerst. */
const zipZeiten = (start: number, c: number, n: number) => {
  const L: number[] = [], R: number[] = [];
  for (let k = 0; k < n; k++) {
    const links = k % 2 === 0;
    const kreuz = start + k * c;
    (links ? L : R).push(kreuz - dauerBis((links ? FRONT_L : FRONT_R) - ZIEL));
  }
  return { L, R };
};

const zipAutos = (t: number, zeiten: { L: number[]; R: number[] }, anzahl: number, ankunft: number, offs = 0, ankunftRate = 0, n0 = 8): Auto[] => {
  const out: Auto[] = [];
  (["L", "R"] as const).forEach((spur) => {
    const ts = zeiten[spur];
    const front = spur === "L" ? FRONT_L : FRONT_R;
    const x0 = spur === "L" ? SPUR_L : SPUR_R;
    let p = 0;
    for (const te of ts) p += ease(t, te, te + D);
    for (let j = 0; j < anzahl; j++) {
      const id = j * 2 + (spur === "R" ? 1 : 0) + offs;
      // Ankunft von unten (gestaffelt von vorne nach hinten)
      const ta = ankunftRate > 0 && j >= n0 ? Math.max(ankunft + 1.2, zeiten.L[0] ?? 0) + (j - n0) * ankunftRate : ankunft + j * 0.09;
      const rein = ease(t, ta, ta + 1.0);
      if (rein <= 0) continue;
      const te = ts[j];
      let x = x0, y: number, dreh = 0, blink = 0, b = 1;
      if (te !== undefined && t >= te) {
        const s = weg(t - te);
        y = front - s;
        b = 0;
        if (spur === "R") {
          const k = Math.min(1, Math.max(0, (FRONT_R - y - 50) / (FRONT_R - ZIEL - 50)));
          const kk = k * k * (3 - 2 * k);
          x = SPUR_R + (SPUR_L - SPUR_R) * kk;
          dreh = -26 * Math.sin(Math.PI * kk);
          blink = kk < 0.95 ? -1 : 0;
        }
      } else {
        y = front + (j - p) * GAP + (1 - rein) * 900;
        if (spur === "R" && j - p < 0.6) blink = -1;
        b = rein < 0.85 ? 0 : 1;
      }
      out.push({ x, y, farbe: farbe(id), typ: typ(id), b, blink, dreh });
    }
  });
  return out;
};

// ---- Variante 1: alle fädeln früh ein, die Schlange wächst nach hinten -----------------------------------
const FRONT1 = ENGE + 80;
const frueh = (t: number, start: number, n0: number, rate: number, bis: number, welle: number): Auto[] => {
  const out: Auto[] = [];
  const n = n0 + Math.max(0, Math.ceil((bis - start) / rate)) + 2;
  for (let k = 0; k < n; k++) {
    const yS = FRONT1 + k * GAP;
    const idx = k - n0;
    const ta = k < n0 ? -99 : start + (idx < 5 ? idx * 0.62 : 5 * 0.62 + (idx - 5) * rate);
    const p = k < n0 ? 1 : ease(t, ta, ta + 1.3);
    if (p <= 0) continue;
    const vonRechts = k >= n0 && k % 2 === 1;
    const y = yS + (1 - p) * 1100;
    let x = SPUR_L, dreh = 0;
    if (vonRechts) {
      const m = Math.min(1, Math.max(0, (p - 0.35) / 0.5));
      const mm = m * m * (3 - 2 * m);
      x = SPUR_R + (SPUR_L - SPUR_R) * mm;
      dreh = -24 * Math.sin(Math.PI * mm);
    }
    // Bremslicht: an, sobald angekommen; Welle beim „gebremst“
    let b = p > 0.9 ? 0.75 : 0;
    const w = t - welle - k * 0.1;
    if (w > 0 && w < 0.6) b = 1;
    out.push({ x, y, farbe: farbe(k + 40), typ: typ(k + 40), b, blink: vonRechts && p < 0.95 ? -1 : 0, dreh });
  }
  return out;
};

// ---- 1 · Hook ------------------------------------------------------------------------------------------
const Hook: React.FC<{ t: number; o: number }> = ({ t, o }) => {
  if (o <= 0) return null;
  const autos: Auto[] = [];
  for (let i = 0; i < 9; i++) autos.push({ x: SPUR_L, y: FRONT_L - 60 + i * GAP, farbe: farbe(i + 20), typ: typ(i + 20), b: 1 });
  // das „Egoist“-Auto fährt rechts vor
  const f = ease(t, 0, Math.max(1.2, aEgoist - 0.1));
  const yE = 2300 - f * (2300 - (FRONT_R + 10));
  autos.push({ x: SPUR_R, y: yE, farbe: "#e8eef5", typ: "kombi", b: f > 0.96 ? 1 : 0, blink: f > 0.7 ? -1 : 0 });
  const kopf = sz(t, 0.35, 99, 0.2);
  const fragen = [[220, 520], [880, 760], [300, 1260], [860, 1240], [760, 470]];
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Welt t={t} s={1} cy={1060} autos={autos} />
      {/* Spur des Egoisten markiert */}
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <g opacity={kopf}>
          <Fahrer x={190} y={1480} r={140} t={t} schuetteln={1} farbe="#2f80ed" />
        </g>
        {fragen.map(([x, y], i) => {
          const p = pop(t, 0.25 + i * 0.22 + (i > 2 ? aEgoist - 1.0 : 0), 220, 10);
          return p > 0 ? (
            <text key={i} x={x} y={y} fontFamily={HEAD} fontWeight={900} fontSize={150} fill={GELB} stroke={NACHT} strokeWidth={6} paintOrder="stroke" textAnchor="middle"
              transform={`translate(${x} ${y}) scale(${p}) rotate(${(i % 2 ? 1 : -1) * 12}) translate(${-x} ${-y})`}>?</text>
          ) : null;
        })}
      </svg>
      <Pille x={540} y={250} text="EGOIST?" p={pop(t, aEgoist - 0.15)} bg={CREME} fg={NACHT} size={110} rot={-3} />
    </AbsoluteFill>
  );
};

// ---- 2 · Falsch! / richtig / Pflicht -------------------------------------------------------------------
const Urteil: React.FC<{ t: number; o: number }> = ({ t, o }) => {
  if (o <= 0) return null;
  const autos: Auto[] = [];
  for (let i = 0; i < 9; i++) autos.push({ x: SPUR_L, y: FRONT_L - 60 + i * GAP, farbe: farbe(i + 20), typ: typ(i + 20), b: 1 });
  autos.push({ x: SPUR_R, y: FRONT_R + 10, farbe: "#e8eef5", typ: "kombi", b: 1, blink: -1 });
  const pF = pop(t, aFalsch - 0.05, 260, 11);
  const raus = ease(t, aRichtig - 0.15, aRichtig + 0.1);
  const pR = pop(t, aRichtig - 0.05);
  const pP = pop(t, aPflicht - 0.1, 200, 13);
  const dunkel = 0.35 + 0.35 * ease(t, aPflicht - 0.2, aPflicht + 0.2);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Welt t={t} s={1} cy={1060} autos={autos} />
      <AbsoluteFill style={{ background: rgba(NACHT, dunkel) }} />
      {pF > 0 && raus < 1 ? (
        <div style={{ position: "absolute", left: 540, top: 560, transform: `translate(-50%,-50%) scale(${pF * (1 - raus)}) rotate(-8deg)`, border: `14px solid ${ROT}`, borderRadius: 30, padding: "10px 50px 20px", fontFamily: HEAD, fontWeight: 900, fontSize: 190, color: ROT, background: rgba("#ffffff", 0.92), boxShadow: "0 18px 50px rgba(0,0,0,0.5)" }}>FALSCH!</div>
      ) : null}
      {pR > 0 ? (
        <div style={{ position: "absolute", left: 540, top: 560 - 160 * ease(t, aPflicht - 0.2, aPflicht + 0.25), transform: `translate(-50%,-50%) scale(${pR})`, display: "flex", alignItems: "center", gap: 26, background: GRUEN, color: "#ffffff", borderRadius: 30, padding: "12px 44px 18px", fontFamily: HEAD, fontWeight: 900, fontSize: 120, boxShadow: "0 18px 50px rgba(0,0,0,0.5)", whiteSpace: "nowrap" }}>✓ RICHTIG</div>
      ) : null}
      {pP > 0 ? (
        <div style={{ position: "absolute", left: 540, top: 760, transform: `translateX(-50%) scale(${pP})`, width: 880, background: CREME, borderRadius: 34, padding: "34px 44px 40px", boxShadow: "0 20px 60px rgba(0,0,0,0.55)", textAlign: "left" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 26 }}>
            <div style={{ fontFamily: HEAD, fontWeight: 900, fontSize: 170, lineHeight: 0.9, color: "#1f5fbf" }}>§</div>
            <div>
              <div style={{ fontFamily: HEAD, fontWeight: 900, fontSize: 80, color: NACHT, lineHeight: 1 }}>§ 7 Abs. 4</div>
              <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 34, letterSpacing: 4, color: "#55606e" }}>STRASSENVERKEHRS-ORDNUNG</div>
            </div>
          </div>
          <div style={{ marginTop: 26, fontFamily: HEAD, fontWeight: 700, fontSize: 44, lineHeight: 1.25, color: NACHT, opacity: ease(t, aPflicht + 0.3, aPflicht + 0.8) }}>
            „… <span style={{ background: rgba(GELB, 0.75), padding: "0 6px" }}>unmittelbar vor Beginn der Verengung</span> jeweils <span style={{ background: rgba(GELB, 0.75), padding: "0 6px" }}>im Wechsel</span> …“
          </div>
          <div style={{ position: "absolute", right: -26, top: -40, transform: `rotate(10deg) scale(${pop(t, aPflicht + 0.45, 260, 10)})`, background: ROT, color: "#fff", fontFamily: HEAD, fontWeight: 900, fontSize: 62, padding: "6px 26px 12px", borderRadius: 16 }}>PFLICHT</div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ---- 3 · Aufbau: zweispurige Straße, Baustelle, rechte Spur endet --------------------------------------
const Aufbau: React.FC<{ t: number; o: number }> = ({ t, o }) => {
  if (o <= 0) return null;
  const t0 = Z(3);
  // fließender Verkehr: links durchgehend, rechts fädelt am Keil ein (zeitversetzt, ohne Stau)
  const autos: Auto[] = [];
  const v = 340;
  for (let i = 0; i < 10; i++) {
    const yl = 2600 + i * 420 - (t - t0 + 2) * v;
    const yr = 2810 + i * 420 - (t - t0 + 2) * v;
    const w1 = ((yl % 4200) + 4200) % 4200 - 600;
    const w2 = ((yr % 4200) + 4200) % 4200 - 600;
    autos.push({ x: SPUR_L, y: w1, farbe: farbe(i + 60), typ: i === 4 ? "lkw" : typ(i + 60), licht: 0.6 } as Auto);
    let x = SPUR_R, dreh = 0, blink = 0;
    const bs = ease(t, aBaustelle - 0.3, aBaustelle + 0.3);
    if (bs > 0.5 && w2 < FRONT_R + 120) {
      const k = Math.min(1, Math.max(0, (FRONT_R + 120 - w2) / (FRONT_R + 120 - ZIEL)));
      const kk = k * k * (3 - 2 * k);
      x = SPUR_R + (SPUR_L - SPUR_R) * kk;
      dreh = -24 * Math.sin(Math.PI * kk);
      blink = kk < 0.95 ? -1 : 0;
    }
    autos.push({ x, y: w2, farbe: farbe(i + 70), typ: typ(i + 70), dreh, blink });
  }
  const bau = ease(t, aBaustelle - 0.2, aBaustelle + 0.4);
  const pEnde = pop(t, aEndet - 0.2);
  const cy = 1180 - 120 * ease(t, aBaustelle - 0.3, aBaustelle + 0.6);
  const s = 1.1 - 0.1 * ease(t, t0, aBaustelle);
  const rot = ease(t, aEndet - 0.1, aEndet + 0.3);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Welt t={t} s={s} cy={cy} autos={autos} baustelle={bau} zweispurig={bau < 0.02}
        kinder={
          <g>
            {rot > 0 ? (
              <g opacity={rot}>
                <rect x={SPUR_R - 70} y={ENGE + KEIL + 60} width={140} height={2400} fill={rgba(ROT, 0.16)} />
                <path d={`M${SPUR_R},${ENGE + KEIL + 1500} L${SPUR_R},${ENGE + KEIL + 120}`} stroke={ROT} strokeWidth={14} strokeDasharray="30 22" />
                <g transform={`translate(${SPUR_R} ${ENGE + KEIL + 70})`}>
                  <circle r={46} fill={ROT} />
                  <path d="M-20,-20 L20,20 M20,-20 L-20,20" stroke="#fff" strokeWidth={12} strokeLinecap="round" />
                </g>
              </g>
            ) : null}
            {pEnde > 0 ? <SchildEnde x={860} y={ENGE + KEIL + 560} s={1.15} p={pEnde} /> : null}
          </g>
        }
      />
      <Pille x={540} y={250} text="2 SPUREN" p={pop(t, aZwei - 0.1) * (1 - ease(t, aBaustelle - 0.25, aBaustelle))} />
      <Pille x={540} y={250} text="🚧 BAUSTELLE" p={pop(t, aBaustelle - 0.05) * (1 - ease(t, aEndet - 0.25, aEndet))} bg={ORANGE} fg={NACHT} />
      <Pille x={540} y={250} text="RECHTE SPUR ENDET" p={pop(t, aEndet - 0.05)} bg={ROT} fg="#ffffff" />
    </AbsoluteFill>
  );
};

// ---- 4 · Variante 1: früh einfädeln ---------------------------------------------------------------------
const Frueh: React.FC<{ t: number; o: number }> = ({ t, o }) => {
  if (o <= 0) return null;
  const t0 = Z(5);
  const ende = Z(9);
  const zoom = ease(t, aWaechst - 0.3, aHinten + 0.6);
  const s = 1 - 0.58 * zoom;
  const cy = ENGE + 630 / s;
  const autos = frueh(t, t0 + 0.1, 3, 0.34, ende + 1.5, aGebremst);
  const leer = ease(t, aLeer - 0.2, aLeer + 0.3);
  const km = 0.4 + 1.6 * ease(t, aWaechst - 0.2, aHinten + 0.5);
  const pZ = pop(t, aWaechst - 0.3);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Welt t={t} s={s} cy={cy} autos={autos}
        kinder={
          leer > 0 ? (
            <g opacity={leer * (1 - 0.6 * zoom)}>
              <rect x={SPUR_R - 66} y={ENGE + KEIL + 40} width={132} height={1500} rx={20} fill={rgba(GELB, 0.18)} stroke={GELB} strokeWidth={8} strokeDasharray="26 18" />
            </g>
          ) : null
        }
      />
      <Pille x={540} y={250} text="VARIANTE 1: FRÜH EINFÄDELN" p={pop(t, t0 - 0.1)} size={50} bg={rgba(NACHT, 0.85)} fg={CREME} />
      <Pille x={800} y={980} text="LEER" p={pop(t, aLeer - 0.05) * (1 - ease(t, aGebremst - 0.3, aGebremst))} bg={GELB} fg={NACHT} size={72} rot={4} />
      <Pille x={760} y={1060} text="BREMSEN!" p={pop(t, aGebremst - 0.05) * (1 - ease(t, aWaechst - 0.4, aWaechst - 0.1))} bg={ROT} fg="#ffffff" size={72} rot={-4} />
      {pZ > 0 ? <Stauzaehler x={790} y={1340} wert={`${km.toFixed(1).replace(".", ",")} km`} p={pZ} farbe={ROT} /> : null}
      {pZ > 0 ? <div style={{ position: "absolute", left: 790, top: 1590, transform: "translateX(-50%)", fontFamily: MONO, fontWeight: 700, fontSize: 26, color: rgba(CREME, 0.8), opacity: pZ }}>BEISPIEL</div> : null}
    </AbsoluteFill>
  );
};

// ---- 5 · Variante 2: Reißverschluss --------------------------------------------------------------------
const Zipper: React.FC<{ t: number; o: number }> = ({ t, o }) => {
  if (o <= 0) return null;
  const t0 = Z(9);
  const zeiten = zipZeiten(aEngstelle + 0.2, 0.62, 40);
  const autos = zipAutos(t, zeiten, 18, t0 - 0.15, 0, 1.24, 9);
  const zoom = 1 - ease(t, aEngstelle - 0.5, aEngstelle + 0.4);
  const s = 1 - 0.58 * zoom;
  const cy = ENGE + 560 / s;
  const pL = pop(t, aLinks - 0.1) * (1 - ease(t, aReiss + 0.2, aReiss + 0.5));
  const pR = pop(t, aRechts - 0.1) * (1 - ease(t, aReiss + 0.2, aReiss + 0.5));
  const pfeil = ease(t, aBeide - 0.1, aBeide + 0.4) * (1 - ease(t, aEngstelle - 0.2, aEngstelle + 0.2));
  const km = 1.0;
  const pZ = pop(t, aVorne2 - 0.2) * (1 - ease(t, aEngstelle - 0.5, aEngstelle - 0.2));
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Welt t={t} s={s} cy={cy} autos={autos}
        kinder={
          <g>
            {pfeil > 0 ? (
              <g opacity={pfeil}>
                {[SPUR_L, SPUR_R].map((x) => (
                  <g key={x}>
                    <path d={`M${x},${ENGE + 1700} L${x},${(x === SPUR_L ? FRONT_L : FRONT_R) + 90}`} stroke={GRUEN} strokeWidth={16} strokeDasharray="34 20" strokeDashoffset={-t * 120} />
                    <path d={`M${x - 34},${(x === SPUR_L ? FRONT_L : FRONT_R) + 130} L${x},${(x === SPUR_L ? FRONT_L : FRONT_R) + 80} L${x + 34},${(x === SPUR_L ? FRONT_L : FRONT_R) + 130}`} fill="none" stroke={GRUEN} strokeWidth={16} strokeLinecap="round" strokeLinejoin="round" />
                  </g>
                ))}
              </g>
            ) : null}
            {/* Reißverschluss-Zähne an der Engstelle */}
            {(() => {
              const z = ease(t, aReiss - 0.2, aReiss + 0.3) * (1 - ease(t, Z(11) - 0.3, Z(11)));
              return z > 0 ? (
                <g opacity={z}>
                  {Array.from({ length: 10 }, (_, i) => (
                    <rect key={i} x={i % 2 ? 548 : 512} y={ENGE + KEIL - i * 32} width={34} height={22} rx={5} fill={i % 2 ? GELB : CREME} />
                  ))}
                  <rect x={520} y={ENGE - 40} width={56} height={70} rx={10} fill={GELB} />
                </g>
              ) : null;
            })()}
          </g>
        }
      />
      <Pille x={540} y={250} text="VARIANTE 2: REISSVERSCHLUSS" p={pop(t, t0 - 0.1)} size={50} bg={rgba(NACHT, 0.85)} fg={CREME} />
      <Pille x={540} y={370} text="BEIDE SPUREN BIS GANZ NACH VORNE" p={pop(t, aBeide - 0.1) * (1 - ease(t, aEngstelle - 0.5, aEngstelle - 0.2))} bg={GRUEN} fg="#ffffff" size={50} />
      <Pille x={250} y={760} text="1 · LINKS" p={pL} bg={CREME} fg={NACHT} size={58} rot={-4} />
      <Pille x={850} y={760} text="2 · RECHTS" p={pR} bg={GELB} fg={NACHT} size={58} rot={4} />
      <Pille x={540} y={370} text="🤐 REISSVERSCHLUSS" p={pop(t, aReiss - 0.1)} bg={GELB} fg={NACHT} size={64} />
      {pZ > 0 ? <Stauzaehler x={790} y={1340} wert={`${km.toFixed(1).replace(".", ",")} km`} p={pZ} farbe={GRUEN} /> : null}
      {pZ > 0 ? <div style={{ position: "absolute", left: 790, top: 1590, transform: "translateX(-50%)", fontFamily: MONO, fontWeight: 700, fontSize: 26, color: rgba(CREME, 0.8), opacity: pZ }}>BEISPIEL</div> : null}
    </AbsoluteFill>
  );
};

// ---- 6 · Vergleich: halb so lang, gerechter --------------------------------------------------------------
const MiniStrasse: React.FC<{ x: number; spuren: 1 | 2; n: number; zahlen: number; t: number; farbeRand: string }> = ({ x, spuren, n, zahlen, t, farbeRand }) => {
  const s = 0.34;
  const top = 470;
  return (
    <g transform={`translate(${x} ${top})`}>
      <rect x={-75} y={-40} width={150} height={1320} fill="#3a3e45" />
      <line x1={-75} x2={-75} y1={-40} y2={1280} stroke="#f2f2f2" strokeWidth={4} />
      <line x1={75} x2={75} y1={-40} y2={1280} stroke="#f2f2f2" strokeWidth={4} />
      {Array.from({ length: 12 }, (_, i) => <rect key={i} x={-2} y={60 + i * 100} width={4} height={50} fill="#f2f2f2" />)}
      {/* Baustelle oben rechts */}
      <path d="M75,40 L2,-10 L2,-40 L75,-40 Z" fill="#6b6457" />
      {Array.from({ length: 6 }, (_, i) => <rect key={i} x={2 + i * 12} y={-12 + i * 9} width={6} height={12} fill={i % 2 ? "#e3262b" : "#fff"} />)}
      {Array.from({ length: n }, (_, i) => {
        const spur = spuren === 1 ? 0 : i % 2;
        const reihe = spuren === 1 ? i : Math.floor(i / 2);
        const cx = spur === 0 ? -37 : 37;
        const cy = 60 + reihe * GAP * s + (spur ? 40 : 0);
        const nr = i + 1;
        const pN = zahlen > 0 ? pop(t, zahlen + i * 0.16, 240, 12) : 0;
        return (
          <g key={i}>
            <Fahrzeug x={cx} y={cy} farbe={farbe(i + 90)} typ={typ(i + 90)} s={s} b={1} />
            {pN > 0 ? (
              <g transform={`translate(${cx} ${cy}) scale(${pN})`}>
                <circle r={22} fill={GELB} stroke={NACHT} strokeWidth={3} />
                <text y={10} textAnchor="middle" fontFamily={HEAD} fontWeight={900} fontSize={28} fill={NACHT}>{nr}</text>
              </g>
            ) : null}
          </g>
        );
      })}
      {/* Klammer: Staulänge */}
      {(() => {
        const reihen = spuren === 1 ? n : Math.ceil(n / 2);
        const h = 60 + reihen * GAP * s;
        return (
          <g>
            <path d={`M100,20 l20,0 L120,${h} l-20,0`} fill="none" stroke={farbeRand} strokeWidth={8} />
          </g>
        );
      })()}
    </g>
  );
};

const Vergleich: React.FC<{ t: number; o: number }> = ({ t, o }) => {
  if (o <= 0) return null;
  const t0 = Z(11);
  const pL = pop(t, t0 - 0.1);
  const pR = pop(t, aHalb - 0.15);
  const pG = pop(t, aGerecht - 0.1);
  return (
    <AbsoluteFill style={{ opacity: o, background: "#2c4a2a" }}>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        {Array.from({ length: 70 }, (_, i) => <circle key={i} cx={(i * 211) % 1080} cy={(i * 397) % 1920} r={8 + (i % 4) * 4} fill={i % 2 ? "#33552f" : "#3d6538"} opacity={0.7} />)}
        <line x1={540} x2={540} y1={330} y2={1800} stroke={rgba(CREME, 0.5)} strokeWidth={4} strokeDasharray="14 12" />
        <g opacity={Math.min(1, pL)}><MiniStrasse x={300} spuren={1} n={16} zahlen={0} t={t} farbeRand={ROT} /></g>
        <g opacity={Math.min(1, pR)}><MiniStrasse x={780} spuren={2} n={16} zahlen={aDran > 0 ? aGerecht + 0.2 : 0} t={t} farbeRand={GRUEN} /></g>
      </svg>
      <Stauzaehler x={290} y={240} wert="2 km" p={pL} farbe={ROT} titel="FRÜH EINFÄDELN" />
      <Stauzaehler x={790} y={240} wert="1 km" p={pR} farbe={GRUEN} titel="REISSVERSCHLUSS" />
      <Pille x={790} y={1220} text="½ SO LANG" p={pop(t, aHalb)} bg={GRUEN} fg="#ffffff" size={64} rot={-3} />
      <Pille x={540} y={1720} text="⚖ GERECHTER: JEDER IST MAL DRAN" p={pG} bg={GELB} fg={NACHT} size={46} />
    </AbsoluteFill>
  );
};

// ---- 7 · Schluss: bis vorne fahren, abwechselnd einfädeln, reinlassen ---------------------------------
const Schluss: React.FC<{ t: number; o: number }> = ({ t, o }) => {
  if (o <= 0) return null;
  const t0 = Z(13);
  const zeiten = zipZeiten(t0 + 0.9, 1.05, 20);
  const autos = zipAutos(t, zeiten, 10, t0 - 2.5, 7);
  const s = 1.25 + 0.1 * ease(t, aLass - 0.2, aLass + 1.5);
  const cy = ENGE + 330;
  const pV = pop(t, aVorne3 - 0.1);
  const pE = pop(t, aEinf - 0.1);
  const pW = pop(t, aLass - 0.15);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Welt t={t} s={s} cy={cy} autos={autos} />
      <Pille x={540} y={250} text="1 · BIS VORNE FAHREN" p={pV} bg={CREME} fg={NACHT} size={60} />
      <Pille x={540} y={360} text="2 · ABWECHSELND EINFÄDELN" p={pE} bg={GELB} fg={NACHT} size={60} />
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        {pW > 0 ? <g transform={`translate(190 1430) scale(${Math.min(1.1, pW)}) translate(-190 -1430)`}><Fahrer x={190} y={1430} r={150} t={t} winken={1} laecheln={1} farbe="#27ae60" /></g> : null}
      </svg>
      <Pille x={600} y={1660} text="3 · LASS DEN ANDEREN REIN 👋" p={pop(t, aLass + 0.1)} bg={GRUEN} fg="#ffffff" size={52} />
    </AbsoluteFill>
  );
};

export const Video: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  const k = kamera(t, KAMERA);
  return (
    <AbsoluteFill style={{ background: "#4c7a3f", overflow: "hidden" }}>
      <Audio src={staticFile(V.audio)} />
      <AbsoluteFill style={{ transform: `scale(${k})`, transformOrigin: "540px 900px" }}>
        <Hook t={t} o={sz(t, 0, Z(1) - 0.05, 0.12)} />
        <Urteil t={t} o={sz(t, Z(1) - 0.05, Z(3), 0.12)} />
        <Aufbau t={t} o={sz(t, Z(3), Z(5))} />
        <Frueh t={t} o={sz(t, Z(5), Z(9))} />
        <Zipper t={t} o={sz(t, Z(9), Z(11))} />
        <Vergleich t={t} o={sz(t, Z(11), Z(13))} />
        <Schluss t={t} o={sz(t, Z(13), 999)} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** Für das Cover: Reißverschluss an der Engstelle, ohne Text. */
export const CoverBild: React.FC = () => {
  const t = 3.1;
  const zeiten = zipZeiten(1, 0.62, 30);
  const autos = zipAutos(t, zeiten, 14, -5);
  return <Welt t={t} s={1.05} cy={ENGE + 640} autos={autos} />;
};

export { RAND_R };
