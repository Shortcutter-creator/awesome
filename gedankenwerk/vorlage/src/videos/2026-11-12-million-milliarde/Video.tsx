// Video „Million vs. Milliarde“ – Größenvergleiche: Zeit (Sekunden), Fläche (Kästchen), Höhe (Turm), Dauer (Ausgeben).
// Alle Zeiten über Wortanker aus woerter.json.
import React from "react";
import { Audio, interpolate, staticFile, useCurrentFrame } from "remotion";
import {
  C, Captions, Card, Chip, EndCard, FPS, HEAD, Header, MONO, Stage, Stamp, Wechsel,
  at, clamp, countUp, de, ease, endOf, life, lin, makeChunks, mech, pop, rgba, type Voice,
} from "../../basis/lib";
import { Stoppuhr } from "../../bausteine/hintergedanke/icons_h21";
import daten from "./woerter.json";

const V = daten as unknown as Voice;
const WD = V.words;
const CHUNKS = makeChunks(WD);
const Z = (n: number) => V.zeilen[Math.min(n, V.zeilen.length - 1)].s;

export const DAUER = Math.ceil((V.dauer + 2.0) * FPS);

// ---- Anker -------------------------------------------------------------------
const a11 = at(WD, "11");
const aMrd = at(WD, "Milliarde", 1);
const eFrage = V.zeilen[1].e;
const a32 = at(WD, "32");
const aSchritt = at(WD, "Schritt");
const aNullen = at(WD, "Nullen");
const aSchau = Z(4);
const aTausend = at(WD, "tausend");
const aJede = at(WD, "Jede");
const a1000a = at(WD, "1.000", 1);
const aDeine = at(WD, "Deine");
const aDieses = at(WD, "dieses");
const aStapeln = at(WD, "stapeln");
const aTurm = at(WD, "Turm");
const aMeter = at(WD, "Meter");
const aMrdTurm = Z(10);
const aKm = at(WD, "Kilometer");
const aGeb = at(WD, "Gebäude");
const aZeit = Z(12);
const aEuro = at(WD, "Euro", 1);
const aDrei2 = at(WD, "drei", 2);
const a2700 = at(WD, "2.700");
const aChristi = at(WD, "Christi");
const aEuro2 = at(WD, "Euro", 2);
const a270 = at(WD, "270");
const aZurueck = at(WD, "Milliarde", { ab: Z(17) });
const aUhr = at(WD, "Uhr");
const aViel = at(WD, "viel");
const aWelt2 = at(WD, "Welt", 2);
const aEnde = WD[WD.length - 1].e + 0.45;

// Schnittstellen der Szenen
const S1_ENDE = Z(3);           // Hook-Bild weicht den Zahlen
const S2_ENDE = aSchau + 0.3;   // Zahlen weichen dem Raster
const S3_ENDE = aStapeln - 0.15;
const S4_ENDE = aZeit;
const S5_ENDE = aZurueck - 0.2;

// ---- Hilfen ------------------------------------------------------------------
const L = 180;  // linke Textkante
const R = 850;  // rechte Textkante (rechts davon kein Text)
const MITTE = (L + R) / 2;

/** Sichtbarkeit einer Szene: rein bei a, raus bei b. */
const szene = (t: number, a: number, b: number) => (t < a - 0.01 || t > b + 0.3 ? 0 : Math.min(ease(t, a, a + 0.3), 1 - ease(t, b, b + 0.3)));

// ---- Takt 1 + 7 · Hook-Bild: Stoppuhr + zwei Zeilen ---------------------------
const HookBild: React.FC<{ t: number; a: number; zurueck: boolean }> = ({ t, a, zurueck }) => {
  const rein = pop(t, a, 150, 14);
  const p32 = zurueck ? 1 : pop(t, a32, 200, 11);
  const zeigeB = zurueck || t >= aMrd;
  const pB = zurueck ? 1 : pop(t, aMrd, 180, 13);
  const pA = zurueck ? 1 : pop(t, a11, 200, 11);
  // Zeiger: läuft, im Countdown schneller, auf „Uhr“ eine volle Extrarunde
  const winkel = 30 + t * 140 + 720 * ease(t, eFrage, a32) + 360 * ease(t, aUhr, aUhr + 0.9);
  const tick = [eFrage + 0.1, eFrage + 0.6, eFrage + 1.1].filter((x) => t >= x).length;
  const countdown = !zurueck && t >= eFrage + 0.1 && t < a32;
  const schweben = Math.sin(t * 1.7) * 8;
  const uhrPuls = 1 + 0.06 * Math.sin(lin(t, aUhr, aUhr + 0.6) * Math.PI);
  const pViel = zurueck ? pop(t, aViel, 200, 12) : 0;
  return (
    <>
      <div style={{ position: "absolute", left: MITTE, top: 270 + schweben, transform: `translateX(-50%) scale(${(0.55 + 0.45 * rein) * uhrPuls})`, transformOrigin: "50% 60%" }}>
        <Stoppuhr size={420} winkel={winkel} />
        {countdown ? (
          <div style={{ position: "absolute", left: 210, top: 264, transform: `translate(-50%,-50%) scale(${1.25 - 0.25 * lin(t, eFrage + 0.1 + (tick - 1) * 0.5, eFrage + 0.35 + (tick - 1) * 0.5)})`, width: 230, height: 230, borderRadius: "50%", background: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: HEAD, fontWeight: 900, fontSize: 170, color: C.red }}>
            {4 - tick}
          </div>
        ) : null}
      </div>
      {/* Zeile A: Million */}
      <Card style={{ left: 140, width: 750, top: 790, height: 190, padding: "22px 40px", boxSizing: "border-box", opacity: rein, transform: `translateY(${(1 - rein) * 40}px) scale(${1 + 0.04 * pViel})`, border: pViel > 0.5 ? `6px solid ${C.green}` : undefined }}>
        <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 30, letterSpacing: 2, color: C.muted }}>1.000.000 SEKUNDEN</div>
        <div style={{ fontFamily: HEAD, fontWeight: 900, fontSize: 92, lineHeight: 1.05, color: C.green, opacity: pA, transform: `scale(${0.7 + 0.3 * pA})`, transformOrigin: "0 50%" }}>
          = 11 TAGE
        </div>
      </Card>
      {/* Zeile B: Milliarde */}
      {zeigeB ? (
        <Card style={{ left: 140, width: 750, top: 1020, height: 210, padding: "22px 40px", boxSizing: "border-box", opacity: Math.min(1, pB), transform: `translateY(${(1 - Math.min(1, pB)) * 40}px)`, border: `6px solid ${C.red}`, boxShadow: `8px 8px 0 ${C.red}` }}>
          <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 30, letterSpacing: 2, color: C.muted }}>1.000.000.000 SEKUNDEN</div>
          {t < a32 && !zurueck ? (
            <div style={{ fontFamily: HEAD, fontWeight: 900, fontSize: 110, lineHeight: 1, color: C.ink, transform: `scale(${1 + 0.12 * Math.max(0, Math.sin(Math.max(0, t - eFrage) * Math.PI * 2))})`, transformOrigin: "0 50%" }}>= ?</div>
          ) : (
            <div style={{ fontFamily: HEAD, fontWeight: 900, fontSize: 110, lineHeight: 1, color: C.red, transform: `scale(${0.6 + 0.4 * p32})`, transformOrigin: "0 50%" }}>≈ 32 JAHRE</div>
          )}
        </Card>
      ) : null}
    </>
  );
};

// ---- Takt 2 + 3 · Die Zahlen: drei Nullen mehr --------------------------------
const Zahlen: React.FC<{ t: number }> = ({ t }) => {
  const o = szene(t, S1_ENDE, S2_ENDE);
  if (o <= 0) return null;
  const pA = pop(t, S1_ENDE, 180, 13);
  const pB = pop(t, aSchritt, 180, 13);
  const pN = ease(t, aNullen, aNullen + 0.35);
  const pX = pop(t, aNullen + 0.35, 200, 11);
  const zahl: React.CSSProperties = { fontFamily: HEAD, fontWeight: 900, fontSize: 96, letterSpacing: -2, lineHeight: 1, whiteSpace: "nowrap" };
  return (
    <div style={{ position: "absolute", inset: 0, opacity: o }}>
      <div style={{ position: "absolute", left: L, top: 470, opacity: pA, transform: `translateX(${(1 - pA) * -60}px)` }}>
        <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 32, letterSpacing: 3, color: C.green }}>MILLION</div>
        <div style={{ ...zahl, color: C.ink, marginTop: 10 }}>1.000.000</div>
      </div>
      {t >= aSchritt ? (
        <div style={{ position: "absolute", left: L, top: 720, opacity: Math.min(1, pB), transform: `translateX(${(1 - Math.min(1, pB)) * -60}px)` }}>
          <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 32, letterSpacing: 3, color: C.red }}>MILLIARDE</div>
          <div style={{ ...zahl, color: C.ink, marginTop: 10 }}>
            1.000.000
            <span style={{ background: `linear-gradient(90deg, ${C.yellow} ${pN * 100}%, transparent ${pN * 100}%)`, borderRadius: 10, padding: "0 4px" }}>.000</span>
          </div>
        </div>
      ) : null}
      {t >= aNullen + 0.35 ? (
        <div style={{ position: "absolute", left: MITTE, top: 1010, transform: `translateX(-50%) scale(${pX})`, display: "flex", gap: 22 }}>
          <Chip text="+ 3 Nullen" size={44} bg={C.yellow} fg={C.ink} border={C.ink} style={{ padding: "12px 26px" }} />
          <Chip text="= × 1.000" size={44} bg={C.ink} style={{ padding: "12px 26px" }} />
        </div>
      ) : null}
    </div>
  );
};

// ---- Takt 4 · Mechanik 1: tausend Kästchen ------------------------------------
const SP = 40, ZE = 25, PITCH = 16.75, ZELLE = 13.5, GX = L, GY = 560;
const Raster: React.FC<{ t: number }> = ({ t }) => {
  const o = szene(t, aSchau + 0.3, S3_ENDE);
  if (o <= 0) return null;
  const pKarte = pop(t, aTausend - 0.3, 170, 13);
  // großes Kästchen → schrumpft auf Zelle 0
  const pBox = pop(t, aJede, 170, 12);
  const k = ease(t, a1000a, a1000a + 0.55);
  const groesse = interpolate(k, [0, 1], [260, ZELLE]);
  const bx = interpolate(k, [0, 1], [MITTE - 130, GX]);
  const by = interpolate(k, [0, 1], [640, GY]);
  const fuell = lin(t, a1000a + 0.45, a1000a + 1.7);
  const n = Math.floor(fuell * 999);
  const pChip = pop(t, a1000a + 1.7, 190, 12);
  const pDein = ease(t, aDeine, aDeine + 0.4);
  const ring = pop(t, aDieses, 200, 10);
  return (
    <div style={{ position: "absolute", inset: 0, opacity: o }}>
      {t >= aTausend - 0.3 ? (
        <Card dark style={{ left: 140, width: 750, top: 290, padding: "20px 34px", boxSizing: "border-box", opacity: Math.min(1, pKarte), transform: `scale(${0.8 + 0.2 * pKarte})` }}>
          <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 28, letterSpacing: 3, color: C.glow }}>1 MILLIARDE =</div>
          <div style={{ fontFamily: HEAD, fontWeight: 900, fontSize: 70, lineHeight: 1.1, color: C.darkText }}>1.000 × 1 Million</div>
        </Card>
      ) : null}
      {/* die übrigen 999 Kästchen */}
      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
        {Array.from({ length: n }, (_, j) => {
          const i = j + 1;
          const x = GX + (i % SP) * PITCH, y = GY + Math.floor(i / SP) * PITCH;
          return <rect key={i} x={x} y={y} width={ZELLE} height={ZELLE} rx={2} fill={C.glow} opacity={0.85 - 0.5 * pDein} />;
        })}
      </svg>
      {/* das eine Kästchen: deine Million */}
      {t >= aJede ? (
        <div style={{ position: "absolute", left: bx, top: by, width: groesse, height: groesse, transform: `scale(${k > 0 ? 1 : pBox})`, transformOrigin: "50% 50%", background: C.green, borderRadius: Math.max(2, 18 * (1 - k)), border: k < 0.9 ? `6px solid ${C.darkText}` : undefined, boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: HEAD, fontWeight: 900, fontSize: 64, color: "#ffffff", boxShadow: `0 0 ${20 + 30 * pDein}px ${rgba(C.green, 0.9)}` }}>
          {k < 0.4 ? <span style={{ opacity: 1 - k / 0.4 }}>1 Mio.</span> : null}
        </div>
      ) : null}
      {t >= aDieses ? (
        <>
          <div style={{ position: "absolute", left: GX + ZELLE / 2, top: GY + ZELLE / 2, width: 120, height: 120, transform: `translate(-50%,-50%) scale(${ring})`, border: `7px solid ${C.yellow}`, borderRadius: "50%" }} />
          <div style={{ position: "absolute", left: GX + 74, top: GY - 72, opacity: Math.min(1, ring), transform: `translateY(${(1 - Math.min(1, ring)) * 20}px)` }}>
            <Chip text="Deine Million" size={30} bg={C.yellow} fg={C.ink} />
          </div>
        </>
      ) : null}
      {t >= a1000a + 1.7 ? (
        <div style={{ position: "absolute", left: MITTE, top: GY + ZE * PITCH + 50, transform: `translateX(-50%) scale(${pChip})` }}>
          <Chip text="1.000 Kästchen = 1 Milliarde" size={36} bg={C.glow} fg={C.navyOut} />
        </div>
      ) : null}
    </div>
  );
};

// ---- Takt 4 · Mechanik 2: Türme ----------------------------------------------
const BODEN = 1240, OBEN = 400;
const Tuerme: React.FC<{ t: number }> = ({ t }) => {
  const o = szene(t, S3_ENDE, S4_ENDE);
  if (o <= 0) return null;
  const zoom = ease(t, aKm, aKm + 2.4);
  const sichtbar = 2.6 * Math.pow(1150 / 2.6, zoom); // Meter vom Boden bis OBEN
  const ppm = (BODEN - OBEN) / sichtbar;
  const hMio = 1 * ease(t, aStapeln, aMeter + 0.3);
  const hMrd = t < aMrdTurm ? 0 : 1000 * Math.pow(lin(t, aMrdTurm, aKm + 2.3), 2.2);
  const pBurj = pop(t, aGeb, 150, 14);
  const px = (m: number) => Math.max(3, m * ppm);
  const scheine = Math.floor(hMio * 12);
  const mensch = 1.8 * ppm;
  const pMod = pop(t, aTurm, 190, 12);
  const pKm = pop(t, aKm, 190, 12);
  const topMrd = BODEN - px(hMrd);
  return (
    <div style={{ position: "absolute", inset: 0, opacity: o }}>
      {/* Boden */}
      <div style={{ position: "absolute", left: 100, width: 800, top: BODEN, height: 6, background: C.glow, borderRadius: 3 }} />
      {/* Mensch als Maßstab (1,80 m) */}
      {mensch > 4 ? (
        <svg width={120} height={mensch + 10} style={{ position: "absolute", left: 190 - 60, top: BODEN - mensch - 4 }} viewBox={`0 0 120 ${mensch + 10}`}>
          <g transform={`translate(60 ${mensch + 4}) scale(${mensch / 180})`} stroke={C.darkText} strokeWidth={9} strokeLinecap="round" fill="none">
            <circle cx={0} cy={-158} r={20} fill={C.darkText} />
            <line x1={0} y1={-136} x2={0} y2={-70} />
            <line x1={0} y1={-70} x2={-22} y2={0} />
            <line x1={0} y1={-70} x2={22} y2={0} />
            <line x1={0} y1={-120} x2={-30} y2={-80} />
            <line x1={0} y1={-120} x2={30} y2={-80} />
          </g>
        </svg>
      ) : null}
      {/* Turm Million: Geldscheinstapel */}
      <div style={{ position: "absolute", left: 300, width: 120, top: BODEN - px(hMio), height: px(hMio), background: C.green, borderRadius: 4, overflow: "hidden", boxShadow: `0 0 18px ${rgba(C.green, 0.7)}` }}>
        {px(hMio) > 30
          ? Array.from({ length: scheine }, (_, i) => <div key={i} style={{ position: "absolute", left: 0, right: 0, bottom: (i * px(1)) / 12, height: 3, background: rgba("#ffffff", 0.35) }} />)
          : null}
      </div>
      {t >= aTurm ? (
        <div style={{ position: "absolute", left: 360, top: BODEN - px(hMio) - 64, transform: `translateX(-50%) scale(${pMod})` }}>
          <Chip text="1 Mio. = 1 m" size={30} bg={C.green} fg="#ffffff" />
        </div>
      ) : null}
      {/* Turm Milliarde */}
      {hMrd > 0 ? (
        <div style={{ position: "absolute", left: 500, width: 130, top: topMrd, height: BODEN - topMrd, background: `linear-gradient(90deg, ${C.red}, ${rgba(C.red, 0.75)})`, borderRadius: 4, boxShadow: `0 0 22px ${rgba(C.red, 0.7)}` }} />
      ) : null}
      {t >= aKm ? (
        <div style={{ position: "absolute", left: 565, top: Math.max(OBEN - 120, topMrd - 64), transform: `translateX(-50%) scale(${pKm})` }}>
          <Chip text="1 Mrd. = 1.000 m" size={30} bg={C.red} fg="#ffffff" />
        </div>
      ) : null}
      {/* Burj Khalifa, 828 m */}
      {t >= aGeb ? (
        <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, opacity: Math.min(1, pBurj) }}>
          {(() => {
            const h = 828 * ppm * Math.min(1, pBurj), cx = 750, b = BODEN;
            const stufe = (f: number, w: number) => `${cx - w / 2},${b - h * f}`;
            const stufeR = (f: number, w: number) => `${cx + w / 2},${b - h * f}`;
            const links = [stufe(0, 110), stufe(0.35, 110), stufe(0.35, 84), stufe(0.6, 84), stufe(0.6, 56), stufe(0.8, 56), stufe(0.8, 30), stufe(0.9, 12), stufe(1, 4)];
            const rechts = [stufeR(1, 4), stufeR(0.9, 12), stufeR(0.8, 30), stufeR(0.8, 56), stufeR(0.6, 56), stufeR(0.6, 84), stufeR(0.35, 84), stufeR(0.35, 110), stufeR(0, 110)];
            return <polygon points={[...links, ...rechts].join(" ")} fill={rgba(C.darkText, 0.18)} stroke={C.darkText} strokeWidth={5} strokeLinejoin="round" />;
          })()}
        </svg>
      ) : null}
      {t >= aGeb ? (
        <div style={{ position: "absolute", left: 750, top: BODEN - 828 * ppm * Math.min(1, pBurj) - 92, transform: `translateX(-50%) scale(${Math.min(1, pBurj)})`, textAlign: "center", fontFamily: MONO, fontWeight: 700, fontSize: 26, letterSpacing: 2, color: C.darkText, lineHeight: 1.25 }}>
          BURJ KHALIFA
          <br />
          828 m
        </div>
      ) : null}
      {/* Höhenlinie 1.000 m beim Gebäude */}
      {t >= aGeb + 0.5 ? (
        <div style={{ position: "absolute", left: 500, width: 330, top: topMrd, borderTop: `4px dashed ${C.yellow}`, opacity: ease(t, aGeb + 0.5, aGeb + 0.8) }} />
      ) : null}
      {t >= aGeb + 0.8 ? (
        <div style={{ position: "absolute", left: MITTE, top: 300, transform: `translateX(-50%) scale(${pop(t, aGeb + 0.8, 200, 12)})` }}>
          <Chip text="172 m höher" size={40} bg={C.yellow} fg={C.ink} />
        </div>
      ) : null}
    </div>
  );
};

// ---- Takt 5 + 6 · Übertrag: ausgeben auf dem Zeitstrahl ----------------------
const VON = -800, BIS = 2026;
const jx = (jahr: number) => L + ((jahr - VON) / (BIS - VON)) * (R - L);
const Zeitstrahl: React.FC<{ t: number }> = ({ t }) => {
  const o = szene(t, aZeit, S5_ENDE);
  if (o <= 0) return null;
  const pTag = pop(t, aEuro - 0.2, 180, 12);
  const pAchse = ease(t, aZeit + 0.2, aZeit + 0.8);
  const pMioL = pop(t, at(WD, "Million", { ab: aZeit }), 200, 12);
  const pMio = pop(t, aDrei2, 200, 11);
  const kMrd = ease(t, a2700, a2700 + 1.6);
  const jahreMrd = countUp(t, a2700, a2700 + 1.6, 2738);
  const pChr = pop(t, aChristi, 190, 12);
  const pStart = pop(t, aChristi + 0.5, 200, 11);
  const pT10 = pop(t, aEuro2, 180, 12);
  const k10 = ease(t, a270, a270 + 1.0);
  const H_B = 84;
  const balken = (y: number, von: number, k: number, farbe: string) => {
    const x1 = jx(BIS), x0 = jx(BIS - (BIS - von) * k);
    return <div style={{ position: "absolute", top: y, left: Math.min(x0, x1 - 14), width: Math.max(14, x1 - x0), height: H_B, background: farbe, borderRadius: 12, border: `5px solid ${C.ink}`, boxSizing: "border-box", boxShadow: `6px 6px 0 ${rgba(C.ink, 0.25)}` }} />;
  };
  const etikett: React.CSSProperties = { position: "absolute", right: 1080 - R, fontFamily: HEAD, fontWeight: 900, fontSize: 46, color: C.ink, whiteSpace: "nowrap", transformOrigin: "100% 50%" };
  return (
    <div style={{ position: "absolute", inset: 0, opacity: o }}>
      {t >= aEuro - 0.2 ? (
        <div style={{ position: "absolute", left: MITTE, top: 290, transform: `translateX(-50%) scale(${pTag})`, display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ width: 150, height: 84, background: C.green, border: `6px solid ${C.ink}`, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: HEAD, fontWeight: 900, fontSize: 48, color: "#ffffff", transform: `rotate(${-6 + 4 * Math.sin(t * 3)}deg)` }}>€</div>
          <Chip text="1.000 € pro Tag" size={52} bg={C.ink} style={{ padding: "14px 28px" }} />
        </div>
      ) : null}
      {/* Million */}
      {pMioL > 0 ? (
        <div style={{ ...etikett, top: 420, color: C.green, opacity: Math.min(1, pMioL), transform: `scale(${0.8 + 0.2 * pMioL})` }}>
          1 Mio. → {t >= aDrei2 ? "2,7 Jahre" : "…"}
        </div>
      ) : null}
      {t >= aDrei2 ? <div style={{ opacity: Math.min(1, pMio), transform: `scale(${pMio})`, transformOrigin: `${jx(BIS)}px 520px`, position: "absolute", inset: 0 }}>{balken(486, BIS - 2.74, 1, C.green)}</div> : null}
      {/* Milliarde */}
      {t >= a2700 - 0.6 ? (
        <>
          <div style={{ ...etikett, top: 600, color: C.red, opacity: ease(t, a2700 - 0.6, a2700 - 0.2) }}>1 Mrd. → {de(Math.round(jahreMrd))} Jahre</div>
          {t >= a2700 ? balken(666, BIS - 2738, kMrd, C.red) : null}
        </>
      ) : null}
      {/* Achse */}
      <div style={{ position: "absolute", left: L, width: (R - L) * pAchse, top: 790, height: 8, background: C.ink, borderRadius: 4 }} />
      {[[-500, "500 v. Chr."], [1000, "1000"], [BIS, "heute"]].map(([j, txt]) => (
        <div key={String(j)} style={{ position: "absolute", left: jx(j as number), top: 780, opacity: pAchse }}>
          <div style={{ width: 6, height: 30, background: C.ink, marginLeft: -3 }} />
          <div style={{ position: "absolute", top: 40, ...(j === BIS ? { right: 0 } : { left: 0, transform: "translateX(-50%)" }), fontFamily: MONO, fontWeight: 700, fontSize: 30, color: C.muted, whiteSpace: "nowrap" }}>{txt}</div>
        </div>
      ))}
      {/* Christi Geburt + Startpunkt */}
      {t >= aChristi ? (
        <>
          <div style={{ position: "absolute", left: jx(0) - 3, top: 640, height: 230 * Math.min(1, pChr), borderLeft: `6px dashed ${C.accent}` }} />
          <div style={{ position: "absolute", left: jx(0), top: 880, transform: `translateX(-50%) scale(${pChr})` }}>
            <Chip text="Christi Geburt" size={36} bg={C.accent} />
          </div>
          <div style={{ position: "absolute", left: jx(-712) - 16, top: 646, width: 32, height: 32, borderRadius: "50%", background: C.yellow, border: `5px solid ${C.ink}`, transform: `scale(${pStart})` }} />
          <div style={{ position: "absolute", left: L, top: 950, transform: `scale(${pStart})`, transformOrigin: "0 50%" }}>
            <Chip text="Start: 712 v. Chr." size={36} bg={C.red} fg="#ffffff" />
          </div>
        </>
      ) : null}
      {/* 10.000 € pro Tag */}
      {t >= aEuro2 ? (
        <>
          <div style={{ ...etikett, top: 1040, color: C.accent, opacity: Math.min(1, pT10), transform: `scale(${0.8 + 0.2 * pT10})` }}>
            10.000 €/Tag → {t >= a270 ? de(Math.round(countUp(t, a270, a270 + 1, 274))) : "…"} Jahre
          </div>
          {balken(1104, BIS - 274, k10, C.accent)}
          {t >= a270 + 1 ? (
            <div style={{ position: "absolute", left: jx(BIS - 274) - 20, top: 1200, transform: `translateX(-100%) scale(${pop(t, a270 + 1, 200, 12)})`, transformOrigin: "100% 50%", fontFamily: MONO, fontWeight: 700, fontSize: 30, color: C.ink, whiteSpace: "nowrap" }}>Start: 1752</div>
          ) : null}
        </>
      ) : null}
    </div>
  );
};

// ---- Kamera: kurze Fahrt (0,35 s, 7 %) auf Schlüsselwörter in den hellen Teilen (BAUKASTEN § 6) ----
const W_ = (w: string, wahl: number | { ab: number } = 1) => at(WD, w, wahl);
const KAMERA: number[] = [
  W_("Sekunden"), a11, W_("lange"), aMrd, a32, W_("Jahre"),
  W_("Schritt"), W_("Aber"), aNullen, aNullen + 0.35,
  W_("Tag"), aEuro, W_("Million", { ab: aZeit }), aDrei2, W_("weg"), W_("Milliarde", { ab: 36 }), a2700, W_("Jahre", { ab: 39 }),
  aChristi, W_("müssen"), W_("Selbst"), aEuro2, W_("Tag", { ab: 44 }), a270, W_("beschäftigt"),
  aUhr, W_("Geld"), W_("Milliarde", { ab: 52 }), aWelt2, W_("Schick"), W_("Millionen", { ab: 55 }), W_("verwechselt"), W_("gefällt"), W_("folg"),
].sort((a, b) => a - b);
const zoomAuf = (k: number) => 1 + 0.07 * (k % 2);
const Kamera: React.FC<{ t: number; children: React.ReactNode }> = ({ t, children }) => {
  const k = KAMERA.filter((a) => t >= a).length;
  const s = k === 0 ? 1 : zoomAuf(k - 1) + (zoomAuf(k) - zoomAuf(k - 1)) * ease(t, KAMERA[k - 1], KAMERA[k - 1] + 0.35);
  return <div style={{ position: "absolute", inset: 0, transform: `scale(${s})`, transformOrigin: "850px 760px" }}>{children}</div>;
};

export const Video: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  const x = mech(t, aSchau, S4_ENDE);
  const hookA = t < S1_ENDE + 0.3 ? 1 - ease(t, S1_ENDE, S1_ENDE + 0.3) : 0;
  const zurueck = t >= aZurueck;
  return (
    <Stage x={x}>
      <Audio src={staticFile(V.audio)} />
      <Header t={t} a={S1_ENDE} thema="Million vs. Milliarde" x={x} />

      <Kamera t={t}>
      {/* Takt 1 · Hook */}
      {hookA > 0 ? (
        <div style={{ position: "absolute", inset: 0, opacity: hookA }}>
          <HookBild t={t} a={0} zurueck={false} />
        </div>
      ) : null}

      {/* Takt 2–3 · Beleg + Wende */}
      <Zahlen t={t} />

      {/* Takt 4 · Mechanik */}
      <Wechsel t={t} a={aSchau - 0.1} />
      <Raster t={t} />
      <Tuerme t={t} />

      {/* Takt 5–6 · Übertrag + Regel */}
      <Zeitstrahl t={t} />

      {/* Takt 7 · Pointe: Schlussbild = Hook-Bild, jetzt mit der Erkenntnis */}
      {zurueck ? (
        <div style={{ position: "absolute", inset: 0, opacity: ease(t, aZurueck, aZurueck + 0.3) }}>
          <HookBild t={t} a={aZurueck} zurueck />
        </div>
      ) : null}
      <Stamp t={t} a={aWelt2} text="× 1.000" x={MITTE + 120} y={560} size={92} />
      </Kamera>

      {/* Takt 8 · Abgang */}
      <EndCard t={t} a={aEnde} top={1480} />

      <Captions t={t} chunks={CHUNKS} dark={x > 0.5} />
    </Stage>
  );
};

void endOf;
void life;
void clamp;
