// Video „Der Lockvogel-Effekt“ (Instagram Reel): Kinofoyer, drei Popcorn-Becher, die kleine Packung als Lockvogel.
// Nach dem Skript des Nutzers (zwei Aussagen entschärft, siehe quellen.md). Kein Outro, kein Kanalname.
import React from "react";
import { AbsoluteFill, Audio, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Captions, FPS, HEAD, MONO, at, ease, makeChunks, pop, rgba, type Voice } from "../../basis/lib";
import { Becher, CREME, DUNKEL, Etikett, Foyer, GOLD, GRUEN, Gedanke, Kachel, KORALLE, PersonHinten, Preisschild, kamera, sz } from "../../bausteine/kino/teile";
import daten from "./woerter.json";

const V = daten as unknown as Voice;
const WD = V.words;
const CHUNKS = makeChunks(WD);
const Z = (n: number) => V.zeilen[Math.min(n, V.zeilen.length - 1)].s;
const A = (w: string, n: number | { ab: number } = 1) => at(WD, w, n);

export const DAUER = Math.ceil((V.dauer + 2.6) * FPS);

const aGeld = A("Geld");
const aMerken = A("merken");
const aSiehst = A("siehst");
const aDrei = A("drei");
const aGroessen = A("Größen");
const aWelche = A("Welche");
const aKleine1 = A("kleine", 1);
const aEuro1 = A("Euro", 1);
const aPopcorn = A("Popcorn");
const a250 = A("2,50");
const aGreifst = A("greifst");
const aVernuenftig = A("vernünftig");
const aPlan = A("Plan");
const aKleine2 = A("kleine", 2);
const aVerkauft = A("verkauft");
const aSchnaeppchen = A("Schnäppchen");
const aLockvogel = A("Lockvogel-Effekt");
const aKlein = A("Klein");
const aGross = A("Groß");
const aMitte = A("Mitte");
const aZahlen = A("zahlen");
const aKaffee = A("Kaffeegrößen");
const aAbos = A("Abos");
const aHandy = A("Handytarife");
const aUeberall = A("Überall");
const aEnde = WD[WD.length - 1].e;

const KAMERA = [aGeld, aSiehst, aDrei, aGroessen, aKleine1, aEuro1, a250, aGreifst, aPlan, aVerkauft, aSchnaeppchen, aLockvogel, aKlein, aGross, aMitte, aZahlen];

// Becher-Positionen (Mitte unten) und Preisschilder
const B = [
  { x: 230, s: 0.72, name: "Klein", preis: "5,50 €" },
  { x: 520, s: 0.92, name: "Mittel", preis: "6,50 €" },
  { x: 790, s: 1.15, name: "Groß", preis: "9,00 €" },
];
const BY = 880;
const TAG_Y = 905;

// ---- Szene 1: Hook – Kamera fährt auf die Popcorn-Theke zu ------------------------------------------
const Hook: React.FC<{ t: number; o: number }> = ({ t, o }) => {
  if (o <= 0) return null;
  const zoom = 1 + 0.42 * ease(t, 0, Z(1));
  const pE = pop(t, aGeld, 200, 11);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <AbsoluteFill style={{ transform: `scale(${zoom})`, transformOrigin: "760px 900px" }}>
        <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
          <Foyer t={t} />
        </svg>
      </AbsoluteFill>
      {t >= aGeld ? (
        <div style={{ position: "absolute", left: 540, top: 620, transform: `translate(-50%,-50%) scale(${pE}) rotate(${-8 + 4 * Math.sin(t * 3)}deg)`, fontFamily: HEAD, fontWeight: 900, fontSize: 260, color: GOLD, textShadow: `0 0 60px ${rgba(GOLD, 0.8)}, 0 10px 30px rgba(0,0,0,0.6)` }}>€</div>
      ) : null}
      {t >= aMerken ? (
        <div style={{ position: "absolute", left: 540, top: 800, transform: `translateX(-50%) scale(${pop(t, aMerken, 210, 12)})`, fontFamily: HEAD, fontWeight: 900, fontSize: 64, color: CREME, background: rgba("#000000", 0.55), padding: "6px 24px", borderRadius: 14, whiteSpace: "nowrap" }}>ohne es zu merken</div>
      ) : null}
    </AbsoluteFill>
  );
};

// ---- Becher-Reihe (Szenen 2–5) ------------------------------------------------------------------------
const Reihe: React.FC<{ t: number; glowKlein?: number; grauKlein?: number; mittelGross?: number }> = ({ t, glowKlein = 0, grauKlein = 0, mittelGross = 0 }) => {
  const ein = [aSiehst - 0.1, aDrei - 0.05, aGroessen - 0.05];
  return (
    <>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        {B.map((b, i) => {
          if (t < ein[i]) return null;
          const p = pop(t, ein[i], 200, 12);
          return <Becher key={i} x={b.x} y={BY} s={b.s * (0.6 + 0.4 * p) * (i === 1 ? 1 + 0.06 * mittelGross : 1)} glow={i === 0 ? glowKlein : i === 1 ? 0.6 * mittelGross : 0} grau={i === 0 ? grauKlein : 0} />;
        })}
      </svg>
      {B.map((b, i) => <Preisschild key={b.name} t={t} a={ein[i]} x={b.x} y={TAG_Y} name={b.name} preis={b.preis} farbe={i === 1 && mittelGross > 0.5 ? GRUEN : undefined} />)}
    </>
  );
};

const Theke: React.FC<{ t: number; licht?: number }> = ({ t, licht = 1 }) => (
  <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
    <Foyer t={t} theke={false} licht={licht * 0.75} />
    <rect x={40} y={890} width={1000} height={420} rx={14} fill="#6e1c26" opacity={0.95} />
    <rect x={30} y={875} width={1020} height={26} rx={10} fill={GOLD} />
  </svg>
);

// ---- Szene 2: Preistafel + Frage ----------------------------------------------------------------------
const Preise: React.FC<{ t: number; o: number }> = ({ t, o }) => {
  if (o <= 0) return null;
  const frage = t >= aWelche;
  const rest = Math.max(0, Z(3) - t);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Theke t={t} />
      <Reihe t={t} />
      {frage ? (
        <div style={{ position: "absolute", left: 540, top: 330, transform: `translateX(-50%) scale(${pop(t, aWelche, 210, 12)})`, textAlign: "center" }}>
          <div style={{ fontFamily: HEAD, fontWeight: 900, fontSize: 84, lineHeight: 1.0, color: CREME, whiteSpace: "nowrap", textShadow: "0 6px 24px rgba(0,0,0,0.7)" }}>Welche würdest<br />du nehmen?</div>
          {rest > 0.1 && t > V.zeilen[2].e ? (
            <div style={{ margin: "16px auto 0", width: 96, height: 96, borderRadius: 48, border: `8px solid ${GOLD}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: MONO, fontWeight: 700, fontSize: 52, color: GOLD }}>{Math.ceil(rest)}</div>
          ) : null}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ---- Szene 3: Der Gedanke ------------------------------------------------------------------------------
const Gedankengang: React.FC<{ t: number; o: number }> = ({ t, o }) => {
  if (o <= 0) return null;
  const blick = t < aEuro1 ? Math.sin((t - Z(3)) * 2.4) * 0.8 : t < a250 ? 0 : t < aGreifst ? 0.9 : 0;
  const mittel = t >= aGreifst ? ease(t, aGreifst, aGreifst + 0.4) : 0;
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Theke t={t} />
      <Reihe t={t} mittelGross={mittel} />
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <PersonHinten x={540} y={1330} s={0.72} blick={blick} />
      </svg>
      <Gedanke t={t} a={aKleine1} b={aEuro1 - 0.1} x={540} y={420}>5,50 € ≈ 6,50 €</Gedanke>
      <Gedanke t={t} a={aEuro1} b={a250 - 0.1} x={540} y={420}>+1 € = <span style={{ color: GRUEN }}>viel mehr Popcorn</span></Gedanke>
      <Gedanke t={t} a={a250} b={aGreifst - 0.1} x={540} y={420}>+2,50 € <span style={{ color: KORALLE }}>zu teuer</span></Gedanke>
      <Gedanke t={t} a={aGreifst} x={540} y={420}>Mittel ✅ {t >= aVernuenftig ? <span style={{ color: "#7a5a2a" }}>vernünftig?</span> : null}</Gedanke>
      {void aPopcorn}
    </AbsoluteFill>
  );
};

// ---- Szene 4: Die Enthüllung -----------------------------------------------------------------------------
const Enthuellung: React.FC<{ t: number; o: number }> = ({ t, o }) => {
  if (o <= 0) return null;
  const dunkel = ease(t, aPlan - 0.2, aPlan + 0.5);
  const glow = 0.5 + 0.5 * Math.sin((t - aPlan) * 4);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Theke t={t} licht={1 - 0.6 * dunkel} />
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <ellipse cx={B[0].x} cy={BY - 120} rx={220} ry={300} fill={rgba(GOLD, 0.22 * dunkel)} />
      </svg>
      <Reihe t={t} glowKlein={dunkel * glow} mittelGross={t >= aSchnaeppchen ? ease(t, aSchnaeppchen, aSchnaeppchen + 0.4) : 0} />
      <Etikett t={t} a={aKleine2 - 0.1} x={B[0].x + 20} y={300} text="LOCKVOGEL" />
      {t >= aVerkauft ? (
        <div style={{ position: "absolute", left: B[0].x, top: 1080, transform: `translateX(-50%) scale(${pop(t, aVerkauft, 210, 12)})`, fontFamily: HEAD, fontWeight: 900, fontSize: 34, color: "#ffffff", background: KORALLE, padding: "4px 14px", borderRadius: 10, whiteSpace: "nowrap" }}>nicht zum Verkaufen</div>
      ) : null}
      {t >= aSchnaeppchen ? (
        <div style={{ position: "absolute", left: B[1].x + 30, top: 500, transform: `translateX(-50%) scale(${pop(t, aSchnaeppchen, 210, 11)}) rotate(4deg)`, fontFamily: HEAD, fontWeight: 900, fontSize: 48, color: DUNKEL, background: GRUEN, padding: "6px 18px", borderRadius: 14, whiteSpace: "nowrap" }}>„Schnäppchen“</div>
      ) : null}
      {t >= aLockvogel - 0.1 ? (
        <div style={{ position: "absolute", left: 540, top: 1170, transform: `translateX(-50%) scale(${pop(t, aLockvogel - 0.1, 210, 12)})`, textAlign: "center", background: rgba(CREME, 0.95), color: DUNKEL, borderRadius: 18, padding: "8px 26px 12px", boxShadow: `0 0 0 5px ${GOLD}`, whiteSpace: "nowrap" }}>
          <div style={{ fontFamily: HEAD, fontWeight: 900, fontSize: 52 }}>Lockvogel-Effekt</div>
          <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 24, letterSpacing: 2 }}>DECOY-EFFEKT</div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ---- Szene 5: Der Vergleich – Pfeile zwischen den Preisen ------------------------------------------------
const Vergleich: React.FC<{ t: number; o: number }> = ({ t, o }) => {
  if (o <= 0) return null;
  const k1 = t >= aKlein - 0.2 ? ease(t, aKlein - 0.2, aKlein + 0.4) : 0;
  const k2 = t >= aGross - 0.2 ? ease(t, aGross - 0.2, aGross + 0.4) : 0;
  const bogen = (x1: number, x2: number, k: number, farbe: string, hoch: number) => {
    const y = TAG_Y + 130;
    const d = `M${x1},${y} Q${(x1 + x2) / 2},${y + hoch} ${x2},${y}`;
    return (
      <g>
        <path d={d} fill="none" stroke={farbe} strokeWidth={9} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - k} />
        {k > 0.95 ? <polygon points={`${x2},${y} ${x2 - 26},${y + 18} ${x2 - 6},${y + 30}`} fill={farbe} /> : null}
      </g>
    );
  };
  const menge = t >= aMitte ? ease(t, aMitte - 0.1, aMitte + 1.0) : 0;
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Theke t={t} />
      <Reihe t={t} mittelGross={menge} />
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        {bogen(B[0].x + 20, B[1].x - 20, k1, GRUEN, 70)}
        {bogen(B[1].x + 20, B[2].x - 20, k2, KORALLE, 150)}
        {/* viele landen in der Mitte: Punkte wandern zum mittleren Becher */}
        {menge > 0
          ? Array.from({ length: 14 }, (_, i) => {
              const sx = 120 + ((i * 131) % 760), sy = 1300 - (i % 3) * 30;
              const k = Math.min(1, Math.max(0, menge * 1.4 - (i % 5) * 0.08));
              return <circle key={i} cx={interpolate(k, [0, 1], [sx, B[1].x + ((i % 5) - 2) * 18])} cy={interpolate(k, [0, 1], [sy, BY + 30])} r={12} fill={CREME} opacity={1 - ease(k, 0.85, 1)} />;
            })
          : null}
      </svg>
      {k1 > 0.6 ? <div style={{ position: "absolute", left: (B[0].x + B[1].x) / 2, top: TAG_Y + 220, transform: `translateX(-50%) scale(${pop(t, aKlein + 0.2, 210, 12)})`, fontFamily: HEAD, fontWeight: 900, fontSize: 44, color: GRUEN, whiteSpace: "nowrap" }}>+1,00 € 👍</div> : null}
      {k2 > 0.6 ? <div style={{ position: "absolute", left: (B[1].x + B[2].x) / 2, top: TAG_Y + 300, transform: `translateX(-50%) scale(${pop(t, aGross + 0.2, 210, 12)})`, fontFamily: HEAD, fontWeight: 900, fontSize: 44, color: KORALLE, whiteSpace: "nowrap" }}>+2,50 € 👎</div> : null}
      {t >= aZahlen ? (
        <div style={{ position: "absolute", left: 540, top: 360, transform: `translateX(-50%) scale(${pop(t, aZahlen, 210, 12)})`, fontFamily: HEAD, fontWeight: 900, fontSize: 60, color: CREME, background: rgba("#000000", 0.5), padding: "6px 24px", borderRadius: 16, whiteSpace: "nowrap" }}>mehr bezahlt als geplant</div>
      ) : null}
    </AbsoluteFill>
  );
};

// ---- Szene 6: Abschluss – Kamera zoomt raus: überall drei Stufen ---------------------------------------
const Abschluss: React.FC<{ t: number; o: number }> = ({ t, o }) => {
  if (o <= 0) return null;
  const raus = ease(t, Z(13) - 0.2, Z(13) + 0.8);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <AbsoluteFill style={{ transform: `scale(${1 - 0.55 * raus})`, transformOrigin: "540px 300px", opacity: 1 - raus }}>
        <Theke t={t} />
        <Reihe t={t} mittelGross={1} />
      </AbsoluteFill>
      <Kachel t={t} a={Z(13) + 0.3} x={150} y={290} w={700} titel="KINO · POPCORN" stufen={[["Klein", "5,50 €"], ["Mittel", "6,50 €"], ["Groß", "9,00 €"]]} />
      <Kachel t={t} a={aKaffee - 0.1} x={150} y={490} w={700} titel="KAFFEE" stufen={[["Klein", ""], ["Mittel", ""], ["Groß", ""]]} />
      <Kachel t={t} a={aAbos - 0.1} x={150} y={690} w={700} titel="STREAMING-ABO" stufen={[["Basis", ""], ["Standard", ""], ["Premium", ""]]} />
      <Kachel t={t} a={aHandy - 0.1} x={150} y={890} w={700} titel="HANDYTARIF" stufen={[["S", ""], ["M", ""], ["L", ""]]} />
      {t >= aUeberall ? (
        <div style={{ position: "absolute", left: 540, top: 1095, transform: `translateX(-50%) scale(${pop(t, aUeberall, 210, 12)})`, fontFamily: HEAD, fontWeight: 900, fontSize: 52, color: GOLD, whiteSpace: "nowrap" }}>überall derselbe Trick</div>
      ) : null}
      {t >= aEnde + 0.15 ? (
        <div style={{ position: "absolute", left: 540, top: 1170, transform: `translateX(-50%) scale(${pop(t, aEnde + 0.15, 200, 12)})`, background: rgba(CREME, 0.95), color: DUNKEL, borderRadius: 20, padding: "10px 30px 14px", fontFamily: HEAD, fontWeight: 900, fontSize: 50, lineHeight: 1.1, textAlign: "center", whiteSpace: "nowrap", boxShadow: `0 0 0 5px ${GOLD}` }}>Wo ist dir das<br />schon passiert? 👇</div>
      ) : null}
    </AbsoluteFill>
  );
};

export const Video: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  const k = kamera(t, KAMERA);
  return (
    <AbsoluteFill style={{ background: DUNKEL, overflow: "hidden" }}>
      <Audio src={staticFile(V.audio)} />
      <AbsoluteFill style={{ transform: `scale(${k})`, transformOrigin: "540px 780px" }}>
        <Hook t={t} o={sz(t, 0, Z(1))} />
        <Preise t={t} o={sz(t, Z(1), Z(3))} />
        <Gedankengang t={t} o={sz(t, Z(3), Z(7))} />
        <Enthuellung t={t} o={sz(t, Z(7), Z(11))} />
        <Vergleich t={t} o={sz(t, Z(11), Z(13))} />
        <Abschluss t={t} o={sz(t, Z(13), 999)} />
      </AbsoluteFill>
      <div style={{ position: "absolute", top: 190, right: 96, fontFamily: MONO, fontSize: 26, letterSpacing: 3, color: rgba(CREME, 0.7), textTransform: "uppercase", opacity: ease(t, 0.6, 1.0) }}>Preis-Psychologie</div>
      <Captions t={t} chunks={CHUNKS} dark />
    </AbsoluteFill>
  );
};

/** Für das Cover: drei Becher, der kleine leuchtet als Lockvogel. */
export const CoverBild: React.FC = () => (
  <>
    <Theke t={0} licht={0.6} />
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
      <ellipse cx={B[0].x} cy={BY - 120} rx={220} ry={300} fill={rgba(GOLD, 0.25)} />
      {B.map((b, i) => <Becher key={i} x={b.x} y={BY} s={b.s} glow={i === 0 ? 1 : 0} />)}
    </svg>
    {B.map((b) => <Preisschild key={b.name} t={1} a={0} x={b.x} y={TAG_Y} name={b.name} preis={b.preis} />)}
  </>
);
