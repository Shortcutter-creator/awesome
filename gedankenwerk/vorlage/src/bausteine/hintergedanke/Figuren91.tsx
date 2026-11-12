// Figuren-Konzepte für #91 „Roter oder blauer Knopf“ (der Kanalinhaber 21.10.2026: „mir gefällt die person in der mitte nicht …
// gib mir 3 konzepte der person in der mitte (lass eine davon aussehen wie mr beast) ich entscheide dann“).
// Gleiche Schnittstelle wie Du aus icons_h91 (Füße bei x,y; greif −1..1 = Hand zum roten/blauen Knopf; blick −1..1; atem),
// damit die gewählte Figur in H91 einfach getauscht werden kann.
// Konzeptbilder: npx remotion still src/kanal/entry/figuren91.tsx KZ1 out.png
import React from "react";
import { AbsoluteFill } from "remotion";
import { C, HEAD } from "../../basis/lib";
import { BLAU, Knopf, ROT } from "./icons_h91";

type FigP = { x: number; y: number; greif?: number; blick?: number; atem?: number; s?: number };
const HAUT = "#f2c7a5";

/** Gemeinsames Gerüst: Beine, Rumpf (Kleidung), Arme mit Händen. Kopf zeichnet jede Figur selbst. */
const Koerper: React.FC<FigP & { stoff: string; stoffDunkel: string; hose: string; schuh: string; aermel?: string; innen?: React.ReactNode; hand?: string; rechteHand?: React.ReactNode }> = ({
  x, y, greif = 0, atem = 0, s = 1, stoff, stoffDunkel, hose, schuh, aermel, innen, hand = HAUT, rechteHand,
}) => {
  const sch = y - 250 * s + atem * 2;
  const arm = (seite: -1 | 1) => {
    const zu = Math.max(0, seite * greif);
    return { hx: x + seite * (70 + 90 * zu) * s, hy: sch + (130 - 90 * zu) * s };
  };
  const l = arm(-1), r = arm(1);
  return (
    <g strokeLinejoin="round" strokeLinecap="round">
      {/* Beine + Schuhe */}
      <path d={`M${x - 24 * s} ${y - 120 * s} L ${x - 28 * s} ${y - 10 * s} M ${x + 24 * s} ${y - 120 * s} L ${x + 28 * s} ${y - 10 * s}`} stroke={C.ink} strokeWidth={42 * s} />
      <path d={`M${x - 24 * s} ${y - 120 * s} L ${x - 28 * s} ${y - 10 * s} M ${x + 24 * s} ${y - 120 * s} L ${x + 28 * s} ${y - 10 * s}`} stroke={hose} strokeWidth={30 * s} />
      <ellipse cx={x - 34 * s} cy={y - 4 * s} rx={30 * s} ry={13 * s} fill={schuh} stroke={C.ink} strokeWidth={6} />
      <ellipse cx={x + 34 * s} cy={y - 4 * s} rx={30 * s} ry={13 * s} fill={schuh} stroke={C.ink} strokeWidth={6} />
      {/* Arme */}
      {[l, r].map((a, i) => {
        const sx = x + (i ? 48 : -48) * s;
        return (
          <g key={i}>
            <path d={`M${sx} ${sch + 22 * s} L ${a.hx} ${a.hy}`} stroke={C.ink} strokeWidth={36 * s} />
            <path d={`M${sx} ${sch + 22 * s} L ${a.hx} ${a.hy}`} stroke={aermel ?? stoff} strokeWidth={25 * s} />
            <circle cx={a.hx} cy={a.hy} r={17 * s} fill={hand} stroke={C.ink} strokeWidth={6} />
            {i === 1 && rechteHand && <g transform={`translate(${a.hx} ${a.hy})`}>{rechteHand}</g>}
          </g>
        );
      })}
      {/* Rumpf */}
      <path d={`M${x - 62 * s} ${y - 112 * s} L ${x - 58 * s} ${sch + 26 * s} Q ${x - 56 * s} ${sch} ${x - 30 * s} ${sch} L ${x + 30 * s} ${sch} Q ${x + 56 * s} ${sch} ${x + 58 * s} ${sch + 26 * s} L ${x + 62 * s} ${y - 112 * s} Z`}
        fill={stoff} stroke={C.ink} strokeWidth={7} />
      <path d={`M${x - 62 * s} ${y - 112 * s} L ${x + 62 * s} ${y - 112 * s}`} stroke={stoffDunkel} strokeWidth={12 * s} />
      {innen}
    </g>
  );
};

// ---------------------------------------------------------------------------
// K1 · „Der Showmaster“ im MrBeast-Look: braune hochgeschwungene Haare, kurzer Bart, breites Zahnlachen, blauer Hoodie.
// Kein Name, kein Logo: eine Karikatur des Typs, nicht die Person.
export const FigBeast: React.FC<FigP> = (p) => {
  const { x, y, blick = 0, s = 1 } = p;
  const hy = y - 330 * s, b = blick * 8 * s;
  const HOOD = "#2f6fdb", HOOD_D = "#1f4fa8", HAAR = "#6b4423", BART = "#5a3a20";
  return (
    <g>
      <Koerper {...p} stoff={HOOD} stoffDunkel={HOOD_D} hose="#30343c" schuh="#f6f3ec"
        innen={<g>
          {/* Kapuze im Nacken, Bauchtasche, Kordeln */}
          <path d={`M${x - 46 * s} ${y - 252 * s} Q ${x} ${y - 214 * s} ${x + 46 * s} ${y - 252 * s}`} fill="none" stroke={HOOD_D} strokeWidth={16 * s} />
          <path d={`M${x - 40 * s} ${y - 170 * s} L ${x + 40 * s} ${y - 170 * s} L ${x + 50 * s} ${y - 124 * s} L ${x - 50 * s} ${y - 124 * s} Z`} fill={HOOD_D} stroke={C.ink} strokeWidth={5} />
          <path d={`M${x - 14 * s} ${y - 240 * s} L ${x - 16 * s} ${y - 196 * s} M ${x + 14 * s} ${y - 240 * s} L ${x + 16 * s} ${y - 196 * s}`} stroke="#fff" strokeWidth={5 * s} />
        </g>} />
      {/* Hals + Kopf */}
      <rect x={x - 16 * s} y={hy + 50 * s} width={32 * s} height={36 * s} fill={HAUT} stroke={C.ink} strokeWidth={6} />
      <ellipse cx={x} cy={hy} rx={66 * s} ry={74 * s} fill={HAUT} stroke={C.ink} strokeWidth={7} />
      {/* Ohren */}
      <ellipse cx={x - 66 * s} cy={hy + 4 * s} rx={11 * s} ry={17 * s} fill={HAUT} stroke={C.ink} strokeWidth={5} />
      <ellipse cx={x + 66 * s} cy={hy + 4 * s} rx={11 * s} ry={17 * s} fill={HAUT} stroke={C.ink} strokeWidth={5} />
      {/* Kurzer Bart entlang Kinn und Wangen */}
      <path d={`M${x - 62 * s} ${hy + 10 * s} Q ${x - 60 * s} ${hy + 74 * s} ${x} ${hy + 78 * s} Q ${x + 60 * s} ${hy + 74 * s} ${x + 62 * s} ${hy + 10 * s}
        Q ${x + 48 * s} ${hy + 48 * s} ${x} ${hy + 50 * s} Q ${x - 48 * s} ${hy + 48 * s} ${x - 62 * s} ${hy + 10 * s} Z`} fill={BART} opacity={0.9} />
      {/* Breites Lachen mit Zähnen */}
      <path d={`M${x - 30 * s} ${hy + 24 * s} Q ${x} ${hy + 64 * s} ${x + 30 * s} ${hy + 24 * s} Z`} fill="#7a1f1a" stroke={C.ink} strokeWidth={5} />
      <path d={`M${x - 26 * s} ${hy + 27 * s} L ${x + 26 * s} ${hy + 27 * s} L ${x + 22 * s} ${hy + 36 * s} L ${x - 22 * s} ${hy + 36 * s} Z`} fill="#fff" />
      {/* Augen + Brauen */}
      {[-1, 1].map((k) => (
        <g key={k}>
          <ellipse cx={x + k * 24 * s} cy={hy - 8 * s} rx={12 * s} ry={14 * s} fill="#fff" stroke={C.ink} strokeWidth={4} />
          <circle cx={x + k * 24 * s + b} cy={hy - 6 * s} r={6.5 * s} fill={C.ink} />
          <path d={`M${x + k * 12 * s} ${hy - 30 * s} Q ${x + k * 24 * s} ${hy - 38 * s} ${x + k * 38 * s} ${hy - 30 * s}`} stroke={HAAR} strokeWidth={7 * s} fill="none" strokeLinecap="round" />
        </g>
      ))}
      {/* Haare: kurz an den Seiten, oben hochgeschwungen nach rechts */}
      <path d={`M${x - 66 * s} ${hy - 8 * s} Q ${x - 72 * s} ${hy - 70 * s} ${x - 20 * s} ${hy - 86 * s} Q ${x + 30 * s} ${hy - 112 * s} ${x + 78 * s} ${hy - 84 * s}
        Q ${x + 60 * s} ${hy - 76 * s} ${x + 66 * s} ${hy - 40 * s} Q ${x + 40 * s} ${hy - 64 * s} ${x - 10 * s} ${hy - 58 * s} Q ${x - 50 * s} ${hy - 52 * s} ${x - 66 * s} ${hy - 8 * s} Z`}
        fill={HAAR} stroke={C.ink} strokeWidth={6} />
      <path d={`M${x - 10 * s} ${hy - 82 * s} Q ${x + 30 * s} ${hy - 98 * s} ${x + 60 * s} ${hy - 84 * s}`} stroke="#8a5a32" strokeWidth={6 * s} fill="none" strokeLinecap="round" />
    </g>
  );
};

// K2 · „Der Spielleiter“: schwarzer Anzug, rote Fliege, Mikro in der Hand, Seitenscheitel, schiefes Grinsen.
export const FigHost: React.FC<FigP> = (p) => {
  const { x, y, blick = 0, s = 1 } = p;
  const hy = y - 330 * s, b = blick * 8 * s;
  const ANZUG = "#24252b";
  const mikro = (
    <g transform={`rotate(-20) scale(${s})`}>
      <rect x={-7} y={-62} width={14} height={50} rx={5} fill="#3a3a3a" stroke={C.ink} strokeWidth={4} />
      <circle cx={0} cy={-68} r={15} fill="#9aa0a6" stroke={C.ink} strokeWidth={4} />
    </g>
  );
  return (
    <g>
      <Koerper {...p} stoff={ANZUG} stoffDunkel="#111" hose={ANZUG} schuh="#111" rechteHand={mikro}
        innen={<g>
          {/* Hemd-Dreieck, Revers, Fliege, Knöpfe */}
          <path d={`M${x - 26 * s} ${y - 248 * s} L ${x} ${y - 176 * s} L ${x + 26 * s} ${y - 248 * s} Z`} fill="#fff" stroke={C.ink} strokeWidth={4} />
          <path d={`M${x - 30 * s} ${y - 248 * s} L ${x - 4 * s} ${y - 170 * s} L ${x - 30 * s} ${y - 200 * s} Z M ${x + 30 * s} ${y - 248 * s} L ${x + 4 * s} ${y - 170 * s} L ${x + 30 * s} ${y - 200 * s} Z`} fill="#34363d" stroke={C.ink} strokeWidth={4} />
          <path d={`M${x} ${y - 238 * s} L ${x - 24 * s} ${y - 250 * s} L ${x - 24 * s} ${y - 226 * s} Z M ${x} ${y - 238 * s} L ${x + 24 * s} ${y - 250 * s} L ${x + 24 * s} ${y - 226 * s} Z`} fill={ROT} stroke={C.ink} strokeWidth={4} />
          <circle cx={x} cy={y - 238 * s} r={6 * s} fill={ROT} stroke={C.ink} strokeWidth={3} />
          {[0, 1].map((i) => <circle key={i} cx={x} cy={y - (150 - 26 * i) * s} r={4.5 * s} fill="#55575e" />)}
        </g>} />
      <rect x={x - 16 * s} y={hy + 50 * s} width={32 * s} height={36 * s} fill={HAUT} stroke={C.ink} strokeWidth={6} />
      <ellipse cx={x} cy={hy} rx={60 * s} ry={72 * s} fill={HAUT} stroke={C.ink} strokeWidth={7} />
      <ellipse cx={x - 60 * s} cy={hy + 4 * s} rx={10 * s} ry={16 * s} fill={HAUT} stroke={C.ink} strokeWidth={5} />
      <ellipse cx={x + 60 * s} cy={hy + 4 * s} rx={10 * s} ry={16 * s} fill={HAUT} stroke={C.ink} strokeWidth={5} />
      {/* Augen: eine Braue hoch */}
      <ellipse cx={x - 22 * s} cy={hy - 6 * s} rx={10 * s} ry={11 * s} fill="#fff" stroke={C.ink} strokeWidth={4} />
      <ellipse cx={x + 22 * s} cy={hy - 6 * s} rx={10 * s} ry={11 * s} fill="#fff" stroke={C.ink} strokeWidth={4} />
      <circle cx={x - 22 * s + b} cy={hy - 5 * s} r={5.5 * s} fill={C.ink} />
      <circle cx={x + 22 * s + b} cy={hy - 5 * s} r={5.5 * s} fill={C.ink} />
      <path d={`M${x - 36 * s} ${hy - 24 * s} L ${x - 10 * s} ${hy - 22 * s}`} stroke="#1a1a1a" strokeWidth={7 * s} strokeLinecap="round" />
      <path d={`M${x + 8 * s} ${hy - 30 * s} Q ${x + 24 * s} ${hy - 44 * s} ${x + 38 * s} ${hy - 30 * s}`} stroke="#1a1a1a" strokeWidth={7 * s} fill="none" strokeLinecap="round" />
      {/* Schiefes Grinsen */}
      <path d={`M${x - 22 * s} ${hy + 30 * s} Q ${x + 6 * s} ${hy + 42 * s} ${x + 28 * s} ${hy + 22 * s}`} stroke={C.ink} strokeWidth={6 * s} fill="none" strokeLinecap="round" />
      {/* Glatte schwarze Haare mit Seitenscheitel */}
      <path d={`M${x - 60 * s} ${hy - 4 * s} Q ${x - 66 * s} ${hy - 74 * s} ${x - 4 * s} ${hy - 80 * s} Q ${x + 58 * s} ${hy - 82 * s} ${x + 62 * s} ${hy - 14 * s}
        Q ${x + 50 * s} ${hy - 46 * s} ${x + 10 * s} ${hy - 50 * s} L ${x - 18 * s} ${hy - 62 * s} Q ${x - 46 * s} ${hy - 44 * s} ${x - 60 * s} ${hy - 4 * s} Z`}
        fill="#1a1a1a" stroke={C.ink} strokeWidth={6} />
      <path d={`M${x - 18 * s} ${hy - 62 * s} Q ${x + 20 * s} ${hy - 76 * s} ${x + 46 * s} ${hy - 58 * s}`} stroke="#4a4a52" strokeWidth={5 * s} fill="none" strokeLinecap="round" />
    </g>
  );
};

// K3 · „Die Gestalt“: Kapuzenfigur, Gesicht im Schatten, leuchtende Augen; links rot, rechts blau angestrahlt.
export const FigGestalt: React.FC<FigP & { id?: string }> = (p) => {
  const { x, y, blick = 0, s = 1, id = "gst" } = p;
  const hy = y - 330 * s, b = blick * 8 * s;
  const MANTEL = "#2b2c36";
  return (
    <g>
      <defs>
        <linearGradient id={`${id}-licht`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor={ROT} stopOpacity={0.55} />
          <stop offset="0.42" stopColor={MANTEL} stopOpacity={0} />
          <stop offset="0.58" stopColor={MANTEL} stopOpacity={0} />
          <stop offset="1" stopColor={BLAU} stopOpacity={0.55} />
        </linearGradient>
      </defs>
      <Koerper {...p} stoff={MANTEL} stoffDunkel="#1c1d25" hose="#1c1d25" schuh="#15161c" hand="#3a3b47" />
      {/* Kapuze */}
      <path d={`M${x - 80 * s} ${hy + 70 * s} Q ${x - 92 * s} ${hy - 50 * s} ${x} ${hy - 96 * s} Q ${x + 92 * s} ${hy - 50 * s} ${x + 80 * s} ${hy + 70 * s} Z`}
        fill={MANTEL} stroke={C.ink} strokeWidth={7} />
      <path d={`M${x - 80 * s} ${hy + 70 * s} Q ${x - 92 * s} ${hy - 50 * s} ${x} ${hy - 96 * s} Q ${x + 92 * s} ${hy - 50 * s} ${x + 80 * s} ${hy + 70 * s} Z`}
        fill={`url(#${id}-licht)`} />
      {/* Gesicht im Schatten */}
      <ellipse cx={x} cy={hy + 6 * s} rx={50 * s} ry={58 * s} fill="#0d0d12" />
      {/* Leuchtende Augen */}
      {[-1, 1].map((k) => (
        <ellipse key={k} cx={x + k * 20 * s + b} cy={hy} rx={11 * s} ry={6 * s} fill="#fff"
          style={{ filter: `drop-shadow(0 0 ${8 * s}px ${k < 0 ? ROT : BLAU}) drop-shadow(0 0 ${3 * s}px #fff)` }} />
      ))}
      {/* Randlicht am Mantel */}
      <path d={`M${x - 62 * s} ${y - 112 * s} L ${x - 58 * s} ${y - 224 * s}`} stroke={ROT} strokeWidth={6 * s} opacity={0.8} strokeLinecap="round" />
      <path d={`M${x + 62 * s} ${y - 112 * s} L ${x + 58 * s} ${y - 224 * s}`} stroke={BLAU} strokeWidth={6 * s} opacity={0.8} strokeLinecap="round" />
    </g>
  );
};

// ---------------------------------------------------------------------------
// Konzeptbilder 1080×1350: Knöpfe links/rechts, Figur in der Mitte (zentriert!), Titel oben.
const Buehne: React.FC<{ titel: string; unter: string; children: React.ReactNode }> = ({ titel, unter, children }) => {
  const BODEN = 1240, KY = 1060;
  return (
    <AbsoluteFill style={{ background: C.paper }}>
      <AbsoluteFill style={{ background: `radial-gradient(circle at 18% 70%, rgba(224,72,59,0.28) 0%, rgba(224,72,59,0) 40%), radial-gradient(circle at 82% 70%, rgba(59,130,246,0.28) 0%, rgba(59,130,246,0) 40%)` }} />
      <svg width={1080} height={1350} style={{ position: "absolute", inset: 0 }}>
        <rect x={0} y={BODEN} width={1080} height={110} fill="#d9d3c8" />
        <line x1={0} y1={BODEN} x2={1080} y2={BODEN} stroke={C.ink} strokeWidth={6} />
        <Knopf x={230} y={KY} farbe="r" hell={0.7} boden={BODEN} />
        <Knopf x={850} y={KY} farbe="b" hell={0.7} boden={BODEN} />
        {children}
      </svg>
      <div style={{ position: "absolute", top: 60, left: 0, right: 0, textAlign: "center", fontFamily: HEAD, fontWeight: 900, fontSize: 76, color: C.ink }}>{titel}</div>
      <div style={{ position: "absolute", top: 160, left: 0, right: 0, textAlign: "center", fontFamily: HEAD, fontWeight: 600, fontSize: 36, color: "#6b645c" }}>{unter}</div>
    </AbsoluteFill>
  );
};

export const KZ1: React.FC = () => <Buehne titel="1 · Der Showmaster" unter="MrBeast-Look: Swoop-Haare, Bart, blauer Hoodie"><FigBeast x={540} y={1240} s={1.55} greif={-0.6} blick={-0.6} /></Buehne>;
export const KZ2: React.FC = () => <Buehne titel="2 · Der Spielleiter" unter="Anzug, rote Fliege, Mikro, eine Braue hoch"><FigHost x={540} y={1240} s={1.55} greif={0.5} blick={0.5} /></Buehne>;
export const KZ3: React.FC = () => <Buehne titel="3 · Die Gestalt" unter="Kapuze, Gesicht im Schatten, rot/blau angestrahlt"><FigGestalt x={540} y={1240} s={1.55} /></Buehne>;
export const FIG91 = { KZ1, KZ2, KZ3 };
