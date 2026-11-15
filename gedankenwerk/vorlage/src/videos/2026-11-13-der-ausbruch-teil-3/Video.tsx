// Video „Der Ausbruch – Teil 3“ (Finale): Henrik befreit Elias, Flucht in den Wald, am Morgen nur ein Zettel.
// Bausteine aus bausteine/ausbruch/teile.tsx. Alle Zeiten über Wortanker.
import React from "react";
import { AbsoluteFill, Audio, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Captions, FPS, HEAD, MONO, THEME, at, countUp, ease, lin, makeChunks, pop, rgba, type Voice } from "../../basis/lib";
import {
  Drehlicht, GRAU, Gitterstaebe, Himmel, Hund, KALT, Laeufer, MOND, Mann, NACHT, NameChip, ROT, SIL, Scheinwerfer, Serie, Status,
  Titel, Vignette, Wald, Zaun, ZelleHinten, kamera, sz,
} from "../../bausteine/ausbruch/teile";
import daten from "./woerter.json";

const V = daten as unknown as Voice;
const WD = V.words;
const CHUNKS = makeChunks(WD);
const Z = (n: number) => V.zeilen[Math.min(n, V.zeilen.length - 1)].s;
const A = (w: string, n: number | { ab: number } = 1) => at(WD, w, n);

export const DAUER = Math.ceil((V.dauer + 2.6) * FPS);

const aBlendet = A("blendet");
const aHunde = A("Hunde", 1);
const aKlettert = A("klettert");
const aBiegt = A("biegt");
const aAuseinander = A("auseinander");
const aBlut = A("Blut");
const aFrei = A("frei");
const aSpringen = A("springen");
const aLanden = A("Landen");
const aLaufen = A("laufen");
const aZweihundert = A("zweihundert");
const aBellen = A("bellen");
const aDunkel = A("Dunkelheit");
const aStill = A("still");
const aVier = A("Vier");
const aKeiner = A("Keiner");
const aZettel = A("Zettel");
const aBett = A("Bett");
const aNeunzig = A("Neunzig");
const aGereicht = A("gereicht");
const aFolg = A("Folg");
const aEnde = WD[WD.length - 1].e + 0.4;

const KAMERA = [aBlendet, aHunde, aKlettert, aBiegt, aAuseinander, aBlut, aFrei, aSpringen, aLanden, aLaufen, aZweihundert, aBellen,
  aDunkel, aVier, aKeiner, aZettel, aNeunzig, aGereicht, aFolg];

// ---- 1–2 · Elias im Draht, Hunde kommen, Henrik klettert zurück ----------------------------
const ImDraht: React.FC<{ t: number; o: number; ohneText?: boolean }> = ({ t, o, ohneText }) => {
  if (o <= 0) return null;
  const hoch = ease(t, aKlettert - 0.1, aKlettert + 1.2);
  const glare = 0.5 + 0.2 * Math.sin(t * 3);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920">
        <Himmel t={t} rot={1} />
        <rect x={0} y={1180} width={1080} height={740} fill="#04060b" />
        <Zaun oben={640} unten={1240} />
        <Mann x={860} y={760} s={1.75} rand={MOND} arme={1} dreh={-6 + Math.sin(t * 7) * 3} />
        {[0, 1, 2].map((i) => <path key={i} d={`M${770 + i * 10},${590 + i * 26} q60,-30 180,20`} fill="none" stroke="#9aa6c0" strokeWidth={5} />)}
        {t >= aKlettert - 0.1 ? <Mann x={660} y={interpolate(hoch, [0, 1], [1250, 790])} s={1.7} rand={GRAU} arme={1} /> : null}
        {t >= aHunde - 0.3
          ? [0, 1].map((i) => (
              <Hund key={i} x={interpolate(t, [aHunde - 0.3, aHunde + 4], [-220 - i * 160, 300 - i * 160])} y={1300 + i * 30} s={1.3} p={(t - aHunde) * 2.8 + i * 0.4} bellen={Math.max(0, Math.sin((t - aHunde) * 7 + i * 2))} />
            ))
          : null}
        <Scheinwerfer x0={1040} y0={240} x1={860} y1={600} breite={170} />
      </svg>
      <AbsoluteFill style={{ background: `radial-gradient(circle at 860px 600px, ${rgba(MOND, glare * ease(t, aBlendet - 0.2, aBlendet + 0.3) + 0.15)} 0%, ${rgba(MOND, 0)} 36%)` }} />
      <NameChip t={t} a={ohneText ? 999 : 0.15} b={Z(1)} text="ELIAS" x={640} y={520} farbe={MOND} />
      <NameChip t={t} a={aKlettert} text="HENRIK" x={560} y={1310} farbe={GRAU} />
      <Titel t={t} a={aHunde} b={Z(1)} text="DIE HUNDE KOMMEN" farbe={ROT} size={68} top={470} />
      <Vignette staerke={0.8} />
    </AbsoluteFill>
  );
};

// ---- 3–4 · Draht auseinanderbiegen, Blut, frei -----------------------------------------------
const Draht: React.FC<{ t: number; o: number }> = ({ t, o }) => {
  if (o <= 0) return null;
  const auf = ease(t, aBiegt, aAuseinander + 0.6);
  const reiss = ease(t, aFrei, aFrei + 0.35);
  const spalt = 60 + 220 * auf + 200 * reiss;
  const blut = t >= aBlut ? ease(t, aBlut, aBlut + 0.8) : 0;
  const strang = (y: number, i: number) => {
    const sd = y < 900 ? -1 : 1;
    const d = sd * (spalt / 2) * (1 - Math.abs(y - 900) / 520);
    let p = `M-20,${y}`;
    for (let x = 0; x <= 1100; x += 55) {
      const nahe = Math.exp(-(((x - 540) / 230) ** 2));
      p += ` L${x},${y + d * nahe + (x / 55) % 2 * 10 - 5}`;
    }
    return <path key={i} d={p} fill="none" stroke="#9aa6c0" strokeWidth={7} strokeLinejoin="round" />;
  };
  const hand = (sd: -1 | 1) => {
    const y = 900 + sd * (spalt / 2 + 30);
    return (
      <g transform={`translate(540 ${y})`}>
        <rect x={-130} y={sd < 0 ? -60 : 0} width={260} height={60} rx={30} fill={SIL} stroke={GRAU} strokeWidth={4} />
        {[-90, -30, 30, 90].map((fx) => <rect key={fx} x={fx - 22} y={sd < 0 ? -10 : -20} width={44} height={30} rx={14} fill={SIL} stroke={GRAU} strokeWidth={3} />)}
        <rect x={-70} y={sd < 0 ? -200 : 60} width={140} height={140} rx={60} fill={SIL} stroke={GRAU} strokeWidth={4} />
        {[-70, 10, 75].map((bx, i) => (
          <ellipse key={bx} cx={bx} cy={sd < 0 ? 4 + i * 6 : -4 - i * 6} rx={9} ry={14 * blut} fill={ROT} opacity={blut} />
        ))}
      </g>
    );
  };
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920">
        <rect width={1080} height={1920} fill="#0a0d16" />
        <rect x={0} y={250} width={1080} height={1060} fill="#111827" />
        <g transform="translate(0 -140)">
          {[460, 560, 660, 760, 1040, 1140, 1240, 1340].map((y, i) => strang(y, i))}
          {hand(-1)}
          {hand(1)}
        </g>
      </svg>
      <Titel t={t} a={aBiegt} b={aBlut - 0.1} text="MIT BLOSSEN HÄNDEN" size={62} top={1235} />
      <Titel t={t} a={aBlut} b={aFrei - 0.1} text="BLUT" farbe={ROT} size={100} top={1215} />
      <Titel t={t} a={aFrei} text="FREI" farbe={MOND} size={140} top={1170} />
      <Vignette staerke={0.85} />
    </AbsoluteFill>
  );
};

// ---- 5–7 · Sprung, Lauf zum Wald, Hunde dahinter -----------------------------------------------
const LAEUFER = [
  { dx: 0, rand: MOND },
  { dx: -120, rand: ROT },
  { dx: -240, rand: ROT },
  { dx: -360, rand: GRAU },
];
const Flucht: React.FC<{ t: number; o: number }> = ({ t, o }) => {
  if (o <= 0) return null;
  const fall = ease(t, aSpringen, aLanden + 0.1);
  const lauf = Math.max(0, t - aLaufen);
  const weit = lauf > 0 ? 1 : 0;
  const rest = t >= aZweihundert ? Math.round(countUp(t, aZweihundert, Z(7) + 0.4, 40, 200)) : 200;
  const dunkel = t >= aDunkel ? ease(t, aDunkel - 0.3, aDunkel + 0.6) : 0;
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920">
        <Himmel t={t} rot={1} mond={[880, 350]} />
        {/* Wald am Horizont, wird näher */}
        <g transform={`translate(${-lauf * 40} ${-lauf * 6}) scale(${1 + lauf * 0.06})`} style={{ transformOrigin: "1080px 900px" }}>
          <Wald y={930} hoehe={240} farbe="#030509" seed={3} />
        </g>
        <rect x={0} y={1180} width={1080} height={740} fill="#04060b" />
        {/* Zaun links hinten, solange sie springen */}
        {weit === 0 ? <Zaun oben={640} unten={1240} /> : null}
        {LAEUFER.map((l, i) => {
          if (weit === 0) {
            const x = 300 + i * 150;
            return <Mann key={i} x={x} y={interpolate(fall, [0, 1], [720, 1250])} s={1.6} rand={l.rand} arme={1 - fall} />;
          }
          const x = 200 + l.dx + lauf * 210;
          return <Laeufer key={i} x={x % 1500} y={1250 + i * 18} s={1.55} p={lauf * 2.5 + i * 0.27} rand={l.rand} />;
        })}
        {t >= aBellen - 0.3
          ? [0, 1].map((i) => (
              <Hund key={i} x={interpolate(t, [aBellen - 0.3, Z(7)], [-260 - i * 150, 150 - i * 150])} y={1320 + i * 26} s={1.3} p={(t - aBellen) * 2.8 + i * 0.4} bellen={Math.max(0, Math.sin((t - aBellen) * 7 + i * 2))} />
            ))
          : null}
      </svg>
      <AbsoluteFill style={{ background: `linear-gradient(90deg, rgba(0,0,0,0) 30%, rgba(0,0,0,${0.75 * dunkel}) 100%)` }} />
      {t >= aZweihundert ? (
        <div style={{ position: "absolute", left: 540, top: 420, transform: `translateX(-50%) scale(${pop(t, aZweihundert, 210, 12)})`, fontFamily: MONO, fontWeight: 700, fontSize: 120, letterSpacing: 4, color: MOND, textShadow: `0 0 20px ${rgba(KALT, 0.8)}`, whiteSpace: "nowrap" }}>
          {rest} m
        </div>
      ) : null}
      {t >= aZweihundert ? <div style={{ position: "absolute", left: 540, top: 380, transform: "translateX(-50%)", fontFamily: MONO, fontWeight: 700, fontSize: 26, letterSpacing: 5, color: rgba(MOND, 0.7), opacity: ease(t, aZweihundert, aZweihundert + 0.3) }}>BIS ZUM WALD</div> : null}
      <Vignette />
    </AbsoluteFill>
  );
};

// ---- 8 · Im Wald, alles wird still ---------------------------------------------------------------
const ImWald: React.FC<{ t: number; o: number }> = ({ t, o }) => {
  if (o <= 0) return null;
  const rein = ease(t, Z(7), Z(7) + 1.4);
  const still = t >= aStill ? ease(t, aStill, aStill + 1.2) : 0;
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920">
        <rect width={1080} height={1920} fill="#03050a" />
        <rect x={0} y={250} width={1080} height={1060} fill="#081020" />
        <g transform={`translate(0 ${80 * (1 - rein)})`}>
          <Wald y={1330} hoehe={1000} farbe="#050a14" seed={5} />
        </g>
        <g transform={`translate(0 ${160 * (1 - rein)})`}>
          <Wald y={1400} hoehe={700} farbe="#020408" seed={7} />
        </g>
        {[0, 1, 2, 3].map((i) => (
          <Laeufer key={i} x={420 + i * 70 + (t - Z(7)) * 120} y={1290} s={1.1} p={(t - Z(7)) * 2.2 + i * 0.3} rand={KALT} o={1 - ease(t, Z(7) + 0.8, aStill)} />
        ))}
      </svg>
      <AbsoluteFill style={{ background: rgba("#000000", 0.45 * still) }} />
      <Titel t={t} a={aStill} text="STILLE" size={110} farbe={rgba(MOND, 0.85)} top={560} />
    </AbsoluteFill>
  );
};

// ---- 9 · Vier Männer, frei im Mondlicht (Spiegel des Hook-Bilds aus Teil 1, ohne Gitter) ----------
const VIER = [
  { x: 250, name: "ELIAS", rand: MOND },
  { x: 410, name: "MARCO", rand: KALT },
  { x: 570, name: "JONAS", rand: KALT },
  { x: 730, name: "HENRIK", rand: GRAU, alt: true },
];
const Frei: React.FC<{ t: number; o: number }> = ({ t, o }) => {
  if (o <= 0) return null;
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920">
        <rect width={1080} height={1920} fill="#03050a" />
        <Himmel t={t} mond={[800, 470]} />
        <Wald y={1000} hoehe={460} farbe="#04070e" seed={9} />
        <ellipse cx={540} cy={1240} rx={520} ry={70} fill={rgba(MOND, 0.08)} />
        {VIER.map((m, i) => {
          const p = Math.min(1, pop(t, aVier + i * 0.18, 200, 14));
          return <Mann key={i} x={m.x} y={1240} s={1.95 * (0.9 + 0.1 * p)} o={p} rand={m.rand} alt={m.alt} />;
        })}
      </svg>
      {VIER.map((m, i) => <NameChip key={m.name} t={t} a={aKeiner + 0.25 + i * 0.12} text={m.name} x={m.x} y={770} farbe={m.rand} />)}
      <Titel t={t} a={aKeiner} text="KEINER ZURÜCKGELASSEN" size={60} top={330} />
      <Vignette staerke={0.75} />
    </AbsoluteFill>
  );
};

// ---- 10–12 · Am Morgen: leere Zelle, Zettel ------------------------------------------------------
const Morgen: React.FC<{ t: number; o: number }> = ({ t, o }) => {
  if (o <= 0) return null;
  const pZ = pop(t, aZettel, 200, 13);
  const nah = ease(t, Z(10) - 0.1, Z(10) + 0.6);
  const text = "90 SEKUNDEN HABEN GEREICHT.";
  const n = t >= aNeunzig - 0.1 ? Math.floor(lin(t, aNeunzig - 0.1, aGereicht + 0.4) * text.length) : 0;
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <AbsoluteFill style={{ transform: `scale(${1 + 0.9 * nah})`, transformOrigin: "260px 1060px", filter: `blur(${6 * nah}px)` }}>
        <svg width={1080} height={1920} viewBox="0 0 1080 1920">
          <ZelleHinten t={t} tag={1} gitterOffen />
          {t >= aZettel ? <rect x={190} y={1028} width={130} height={90} rx={4} fill="#f4efe2" transform={`rotate(-8 255 1073) scale(1)`} opacity={Math.min(1, pZ)} /> : null}
          <Gitterstaebe licht="#ffd9a0" />
        </svg>
      </AbsoluteFill>
      {nah > 0 ? (
        <div style={{ position: "absolute", left: 540, top: 820, width: 780, height: 520, transform: `translate(-50%,-50%) rotate(-3deg) scale(${0.6 + 0.4 * nah})`, opacity: nah, background: "#f4efe2", borderRadius: 10, boxShadow: "0 30px 80px rgba(0,0,0,0.6)", padding: "70px 60px", boxSizing: "border-box", backgroundImage: "repeating-linear-gradient(180deg, transparent 0 66px, rgba(47,111,237,0.18) 66px 68px)" }}>
          <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 64, lineHeight: 1.1, color: "#1b1f2a", letterSpacing: 1 }}>
            {text.slice(0, n)}
            <span style={{ opacity: Math.floor(t * 2) % 2 ? 1 : 0 }}>{n < text.length && n > 0 ? "▍" : ""}</span>
          </div>
        </div>
      ) : null}
      <Titel t={t} a={aBett} b={Z(10) - 0.1} text="NUR EIN ZETTEL" size={70} farbe="#ffe2b0" top={330} />
      <Vignette staerke={0.55} />
    </AbsoluteFill>
  );
};

const EndeText: React.FC<{ t: number }> = ({ t }) => {
  if (t < aFolg) return null;
  const p = pop(t, aFolg, 210, 12);
  return (
    <div style={{ position: "absolute", left: 540, top: 1580, transform: `translate(-50%,-50%) scale(${p})`, display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
      <div style={{ fontFamily: HEAD, fontWeight: 900, fontSize: 84, color: NACHT, background: MOND, padding: "6px 34px 12px", borderRadius: 16, whiteSpace: "nowrap" }}>ENDE</div>
      <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 32, letterSpacing: 3, color: MOND, opacity: ease(t, aFolg + 0.3, aFolg + 0.6) }}>Folgen · {THEME.kanal.handle}</div>
    </div>
  );
};

export const Video: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  const k = kamera(t, KAMERA);
  return (
    <AbsoluteFill style={{ background: NACHT, overflow: "hidden" }}>
      <Audio src={staticFile(V.audio)} />
      <AbsoluteFill style={{ transform: `scale(${k})`, transformOrigin: "540px 780px" }}>
        <ImDraht t={t} o={sz(t, 0, Z(2))} />
        <Draht t={t} o={sz(t, Z(2), Z(4))} />
        <Flucht t={t} o={sz(t, Z(4), Z(7))} />
        <ImWald t={t} o={sz(t, Z(7), Z(8))} />
        <Frei t={t} o={sz(t, Z(8), Z(9))} />
        <Morgen t={t} o={sz(t, Z(9), 999)} />
      </AbsoluteFill>
      <Drehlicht t={t} a={0} b={aStill - 0.6} staerke={0.6} />
      <Status t={t} a={0} b={aStill - 0.6} zeile="SIRENE" text="ALARM" />
      <EndeText t={t} />
      {t < aEnde ? <Captions t={t} chunks={CHUNKS} dark /> : null}
      <Serie teil="Teil 3 · Finale" o={ease(t, 0.3, 0.8) * (1 - ease(t, Z(9), Z(9) + 0.4))} />
    </AbsoluteFill>
  );
};

/** Für das Cover: Elias im Stacheldraht, geblendet (Pointe bleibt offen). */
export const CoverBild: React.FC = () => <ImDraht t={aBlendet + 0.6} o={1} ohneText />;
