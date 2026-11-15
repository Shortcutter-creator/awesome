// Video „Ein Hochhaus für die ganze Menschheit“ – Skript des Nutzers (eine Zahl präzisiert), eigene Stimme (energisch).
// Maßstab: Grundfläche Paris (~10 km breit) × 5,45 km Höhe → eher Riesenblock als schlanker Turm. Keine Untertitel, kein Outro.
import React from "react";
import { AbsoluteFill, Audio, interpolate, staticFile, useCurrentFrame } from "remotion";
import { FPS, HEAD, MONO, at, clamp, de, ease, pop, rgba, type Voice } from "../../basis/lib";
import {
  Alpen, Auto, Baum, BergReal, CREME, Chip, Fussgaenger, GOLD, GRUEN, HausReal, Himmel, Icon, Laterne, Manometer, NACHTBLAU, Paris, ROT, Stadthaus, Turbine, Voegel,
  WASSER, Wildnis, Wolke, Zaehler, kamera, sz,
} from "../../bausteine/hochhaus/teile";
import daten from "./woerter.json";

const V = daten as unknown as Voice;
const WD = V.words;
const Z = (n: number) => V.zeilen[Math.min(n, V.zeilen.length - 1)].s;
const A = (w: string, n: number | { ab: number } = 1) => at(WD, w, n);

export const DAUER = Math.ceil((V.dauer + 2.4) * FPS);

const aHaus = A("Haus", 1);
const aBlanc = A("Blanc");
const a82 = A("8,2");
const a20 = A("20");
const aParis = A("Paris");
const a1500 = A("1.500");
const aFuenf = A("fünfeinhalb");
const aStadt = A("Stadt");
const aBewohner = A("Bewohnern");
const aTageslicht = A("Tageslicht");
const aKuenstlich = A("künstliche");
const aDecke = A("Decke");
const aAufzug1 = A("Aufzug", 1);
const aEinkaufen = A("Einkaufen");
const aMaerkte = A("Supermärkte");
const aSchulen = A("Schulen");
const aAerzte = A("Ärzte");
const aLobby = A("Sky-Lobby");
const aKrankenhaus = A("Krankenhaus");
const aParks = A("Parks");
const aExpress = A("Expressaufzügen");
const aKeller = A("Keller");
const aMinuten = A("Minuten", 1);
const aWasser = A("Wasser", 1);
const aLiter = A("Liter");
const aPumpen = A("Pumpen");
const aStrom = A("Strom");
const aDeutschland = A("Deutschland");
const aAbwasser = A("Abwasser");
const aTurbinen = A("Turbinen");
const aLuftdruck = A("Luftdruck");
const aHalb = A("halb");
const aFlugzeug = A("Flugzeug");
const aDraussen = A("draußen");
const aLeer = A("leer");
const aWildnis = A("Wildnis");
const aFelder = A("Felder");
const aWaelder = A("Wälder");
const aLasten = A("Lastenaufzüge");
const aWohnen = A("wohnen");
const aUnten = A("unten", { ab: Z(21) - 0.2 });

const KAMERA = [A("Decke"), A("Aufzug", 1), A("kilometerweit"), A("Stufe", 1), aHaus, aBlanc, a82, a20, aParis, a1500, aFuenf, aStadt, aBewohner, aTageslicht, aKuenstlich, aEinkaufen, aMaerkte, aLobby,
  aKeller, aMinuten, aWasser, aLiter, aPumpen, aStrom, aAbwasser, aTurbinen, aLuftdruck, aHalb, aFlugzeug, aDraussen, aLeer, aWildnis, aLasten, aWohnen, aUnten];

// Maßstab für Seitenansicht: 0,12 px pro Meter
const PX = 0.12;
const BODEN = 1250;
const HAUS_H = 5446 * PX; // 654 px
const BERG_H = 4806 * PX; // 577 px

// ---- 1 · Hook: Haus über den Wolken, Mont Blanc daneben ------------------------------------------
const Hook: React.FC<{ t: number; o: number }> = ({ t, o }) => {
  if (o <= 0) return null;
  const auf = ease(t, 0, 1.2);
  const drift = t * 12;
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <Himmel id="hook" />
        <circle cx={150} cy={360} r={60} fill="#fff6d6" opacity={0.9} />
        <circle cx={150} cy={360} r={140} fill="#fff6d6" opacity={0.12} />
        <Alpen bodenY={BODEN} />
        <BergReal x={200} y={BODEN - BERG_H} bodenY={BODEN} breite={440} />
        <HausReal id="hook" x0={380} w={700} bodenY={BODEN} h={HAUS_H} sichtbar={auf} t={t} />
        <Voegel t={t} x={120} y={520} />
        {[[120 - drift, 980, 1.3], [520 - drift * 0.6, 900, 1.6], [900 - drift, 1010, 1.2], [300 - drift * 0.8, 1080, 1.4]].map(([x, y, s], i) => <Wolke key={i} x={x} y={y} s={s} o={0.85} />)}
        <rect x={0} y={BODEN} width={1080} height={670} fill="#3d6b3d" />
        {Array.from({ length: 22 }, (_, i) => <Baum key={i} x={(i * 53) % 1080} y={BODEN + 18 + (i % 3) * 14} s={0.7} />)}
        <line x1={60} y1={BODEN - HAUS_H} x2={1040} y2={BODEN - HAUS_H} stroke={GOLD} strokeWidth={4} strokeDasharray="14 10" opacity={auf} />
        <line x1={60} y1={BODEN - BERG_H} x2={420} y2={BODEN - BERG_H} stroke={CREME} strokeWidth={4} strokeDasharray="10 10" opacity={ease(t, aBlanc - 0.2, aBlanc + 0.2)} />
      </svg>
      <div style={{ position: "absolute", left: 640, top: BODEN - HAUS_H - 70, transform: `translateX(-50%) scale(${pop(t, aHaus, 220, 12)})`, fontFamily: HEAD, fontWeight: 900, fontSize: 52, color: GOLD, textShadow: "0 4px 16px rgba(0,0,0,0.6)", whiteSpace: "nowrap" }}>5.446 m</div>
      {t >= aBlanc - 0.2 ? <div style={{ position: "absolute", left: 200, top: BODEN - BERG_H - 64, transform: `translateX(-50%) scale(${pop(t, aBlanc - 0.2, 220, 12)})`, fontFamily: MONO, fontWeight: 700, fontSize: 30, color: CREME, textShadow: "0 3px 10px rgba(0,0,0,0.7)", whiteSpace: "nowrap" }}>Mont Blanc 4.806 m</div> : null}
    </AbsoluteFill>
  );
};

// ---- 2 · Die Höhe: Paris als Fundament, Etagen stapeln sich -----------------------------------------
const Hoehe: React.FC<{ t: number; o: number }> = ({ t, o }) => {
  if (o <= 0) return null;
  const draufsicht = t < a1500 - 0.3;
  const grund = ease(t, Z(2) - 0.2, Z(2) + 0.6);
  const bau = ease(t, a1500 - 0.4, aFuenf + 0.5);
  const etagen = Math.round(1556 * bau);
  const meter = 5446 * bau;
  const menschen = Math.min(8.2, interpolate(t, [a82 - 0.2, a82 + 1.0], [0, 8.2], clamp));
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <Himmel id="hoehe" oben={NACHTBLAU} unten="#29466e" />
        {draufsicht ? (
          <g opacity={1 - ease(t, Z(2) - 0.3, Z(2))}>
            {Array.from({ length: 120 }, (_, i) => (
              <g key={i} opacity={i / 120 < menschen / 8.2 ? 0.95 : 0.12}>
                <circle cx={140 + (i % 15) * 57} cy={548 + Math.floor(i / 15) * 57} r={8} fill="#f1c9a5" />
                <rect x={131 + (i % 15) * 57} y={557 + Math.floor(i / 15) * 57} width={18} height={20} rx={7} fill={["#ffc94a", "#7fb3e6", "#ff8a7a", "#9fe0a8"][i % 4]} />
              </g>
            ))}
          </g>
        ) : null}
        {t >= aParis - 0.3 && !draufsicht ? null : null}
        {t >= Z(2) - 0.2 ? (
          <g opacity={draufsicht ? grund : 1}>
            {draufsicht ? (
              <g>
                <Paris cx={540} cy={820} w={760} zeichne={grund} />
                <g opacity={grund * 0.6}>
                  {Array.from({ length: 12 }, (_, i) => <line key={i} x1={540} y1={810} x2={540 + Math.cos((i / 12) * Math.PI * 2) * 300} y2={810 + Math.sin((i / 12) * Math.PI * 2) * 200} stroke={rgba(CREME, 0.5)} strokeWidth={2} />)}
                  {[90, 170, 250].map((r0) => <ellipse key={r0} cx={540} cy={810} rx={r0} ry={r0 * 0.65} fill="none" stroke={rgba(CREME, 0.35)} strokeWidth={2} />)}
                </g>
                <g transform={`translate(430 830) scale(${0.9 * grund})`} opacity={grund}>
                  <path d="M0,0 L-14,0 L-4,-30 L-2,-60 L0,-80 L2,-60 L4,-30 L14,0 Z" fill="none" stroke={GOLD} strokeWidth={3} />
                  <line x1={-9} y1={-18} x2={9} y2={-18} stroke={GOLD} strokeWidth={3} />
                </g>
              </g>
            ) : null}
          </g>
        ) : null}
        {!draufsicht ? (
          <g>
            <rect x={0} y={BODEN} width={1080} height={670} fill="#1c2c22" />
            <ellipse cx={540} cy={BODEN + 10} rx={460} ry={34} fill={rgba(GOLD, 0.25)} stroke={GOLD} strokeWidth={4} />
            <HausReal id="hoehe" x0={150} w={720} bodenY={BODEN} h={HAUS_H} sichtbar={bau} t={t} dunst={0.25} />
            <line x1={80} y1={BODEN - BERG_H} x2={1000} y2={BODEN - BERG_H} stroke={CREME} strokeWidth={3} strokeDasharray="10 10" opacity={0.7} />
          </g>
        ) : null}
      </svg>
      {draufsicht ? (
        <>
          <Zaehler x={540} y={300} wert={`${de(menschen, 1)} Mrd.`} label="MENSCHEN" farbe={GOLD} o={ease(t, a82 - 0.3, a82)} />
          {t >= a20 - 0.1 ? <Chip x={540} y={470} text="je 20 m²" p={pop(t, a20 - 0.1, 220, 12)} /> : null}
          {t >= aParis - 0.1 ? <Chip x={540} y={1140} text="Grundfläche: Paris · 105 km²" p={pop(t, aParis - 0.1, 220, 12)} bg={GOLD} size={40} /> : null}
        </>
      ) : (
        <>
          <Zaehler x={330} y={290} wert={de(etagen)} label="STOCKWERKE" farbe={GOLD} groesse={86} />
          <Zaehler x={720} y={290} wert={`${de(meter / 1000, 2)} km`} label="HÖHE" farbe={CREME} groesse={86} />
          <div style={{ position: "absolute", left: 90, top: BODEN - BERG_H - 44, fontFamily: MONO, fontWeight: 700, fontSize: 26, color: rgba(CREME, 0.8) }}>Mont Blanc</div>
          <div style={{ position: "absolute", left: 540, top: BODEN + 50, transform: "translateX(-50%)", fontFamily: MONO, fontWeight: 700, fontSize: 32, color: GOLD, whiteSpace: "nowrap" }}>Fundament: Paris · 105 km²</div>
        </>
      )}
    </AbsoluteFill>
  );
};

// ---- 3 · Das Leben auf einer Etage ------------------------------------------------------------------
const Leben: React.FC<{ t: number; o: number }> = ({ t, o }) => {
  if (o <= 0) return null;
  const decke = ease(t, aKuenstlich - 0.2, aKuenstlich + 0.6);
  const rand = ease(t, aTageslicht - 0.2, aTageslicht + 0.4);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <rect width={1080} height={1920} fill="#0d1526" />
        {/* Decke mit Licht-Paneelen (künstlicher Himmel) */}
        <rect x={0} y={420} width={1080} height={60} fill="#1d2a40" />
        {Array.from({ length: 10 }, (_, i) => <rect key={i} x={i * 116 - 8} y={420} width={16} height={74} fill="#2b3a55" />)}
        <rect x={0} y={476} width={1080} height={6} fill="#33466a" />
        <rect x={0} y={480} width={1080} height={300} fill={`url(#hh-kh)`} opacity={decke} />
        <defs>
          <linearGradient id="hh-kh" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#bfe3ff" stopOpacity={0.85} />
            <stop offset="100%" stopColor="#bfe3ff" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="hh-tag" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#fff2c4" stopOpacity={0.9} />
            <stop offset="100%" stopColor="#fff2c4" stopOpacity={0} />
          </linearGradient>
        </defs>
        {Array.from({ length: 9 }, (_, i) => {
          const blitz = t >= aDecke + i * 0.07 ? Math.max(0, 1 - (t - aDecke - i * 0.07) * 2.5) : 0;
          return <rect key={i} x={40 + i * 116} y={466} width={90} height={14 + 10 * blitz} rx={6} fill="#ffffff" opacity={0.3 + 0.7 * decke} style={{ filter: blitz > 0 ? `drop-shadow(0 0 ${30 * blitz}px #bfe3ff)` : undefined }} />;
        })}
        {/* Fensterfront links mit Tageslicht */}
        <rect x={0} y={480} width={40} height={720} fill="#cfe6ff" />
        {Array.from({ length: 8 }, (_, i) => <rect key={i} x={0} y={480 + i * 90} width={40} height={5} fill="#7f93ad" />)}
        <rect x={40} y={480} width={360} height={720} fill="url(#hh-tag)" opacity={rand} />
        {/* Häuser */}
        {[[30, 120, 330, "#4a5d7c"], [160, 110, 420, "#5b4a62"], [280, 130, 300, "#3f5f5a"], [420, 115, 470, "#56607a"], [545, 125, 360, "#6a5446"], [680, 110, 440, "#3f4f6e"], [800, 130, 320, "#5a6b4a"], [940, 120, 400, "#4e566e"]].map(([x, w, h, f], i) => (
          <Stadthaus key={i} x={x as number} w={w as number} h={h as number} bodenY={1130} farbe={f as string} seed={i} t={t} />
        ))}
        {/* Gehweg mit Bäumen, Laternen, Fußgängern */}
        <rect x={0} y={1130} width={1080} height={28} fill="#7b8496" />
        <rect x={0} y={1156} width={1080} height={4} fill="#9aa3b3" />
        {[90, 330, 570, 810].map((x) => <Baum key={x} x={x} y={1150} s={0.85} />)}
        {[210, 450, 690, 930].map((x) => <Laterne key={x} x={x} y={1150} an={decke} />)}
        {Array.from({ length: 6 }, (_, i) => <Fussgaenger key={i} x={((t * (30 + i * 6) + i * 180) % 1140) - 30} y={1152} farbe={["#ff6b5a", "#7fb3e6", "#ffd25e", "#9fe0a8", "#c792ea", "#ffffff"][i]} p={t * 1.6 + i * 0.3} s={0.9} />)}
        {/* Straße mit zwei Spuren */}
        <rect x={0} y={1160} width={1080} height={140} fill="#2b2f3a" />
        {Array.from({ length: 9 }, (_, i) => <rect key={i} x={i * 130 - ((t * 60) % 130)} y={1228} width={64} height={6} fill="#e6e1d3" opacity={0.8} />)}
        {[["limo", "#d64545", 0], ["taxi", "#ffd25e", 300], ["transporter", "#e6edf7", 620], ["limo", "#3f8fd2", 900]].map(([typ, f, off], i) => (
          <Auto key={`r${i}`} x={((t * 170 + (off as number)) % 1500) - 260} y={1292} typ={typ as "limo"} farbe={f as string} richtung={1} s={1.35} t={t} />
        ))}
        {[["bus", "#3fae6a", 0], ["limo", "#8a5cc7", 520], ["taxi", "#ffd25e", 900]].map(([typ, f, off], i) => (
          <Auto key={`l${i}`} x={1380 - ((t * 140 + (off as number)) % 1700)} y={1222} typ={typ as "limo"} farbe={f as string} richtung={-1} s={1.15} t={t} />
        ))}
        <rect x={0} y={1300} width={1080} height={20} fill="#7b8496" />
        {/* Geschossdecke und die Etage darunter */}
        <rect x={0} y={1320} width={1080} height={70} fill="#1d2a40" />
        {Array.from({ length: 10 }, (_, i) => <rect key={i} x={i * 116 - 8} y={1320} width={16} height={82} fill="#2b3a55" />)}
        {Array.from({ length: 9 }, (_, i) => <rect key={i} x={40 + i * 116} y={1392} width={90} height={12} rx={6} fill="#ffffff" opacity={0.25 + 0.5 * decke} />)}
        <rect x={0} y={1404} width={1080} height={180} fill="url(#hh-kh)" opacity={0.35 * decke} />
      </svg>
      <Zaehler x={540} y={280} wert="5,3 Mio." label="BEWOHNER PRO ETAGE" farbe={GOLD} o={ease(t, aBewohner - 0.3, aBewohner)} groesse={84} />
      {t >= aStadt - 0.1 && t < aBewohner - 0.3 ? <Chip x={540} y={300} text="1 Etage = 1 Großstadt" p={pop(t, aStadt - 0.1, 220, 12)} /> : null}
      {t >= aTageslicht ? <Chip x={240} y={640} text="Tageslicht nur am Rand" p={pop(t, aTageslicht, 220, 12)} size={34} /> : null}
      {t >= aKuenstlich ? <Chip x={680} y={560} text="künstlicher Himmel" p={pop(t, aKuenstlich, 220, 12)} bg="#bfe3ff" size={38} /> : null}
    </AbsoluteFill>
  );
};

// ---- 4 · Alltag: Läden, Sky-Lobby, Aufzug -------------------------------------------------------------
const Alltag: React.FC<{ t: number; o: number }> = ({ t, o }) => {
  if (o <= 0) return null;
  const lobby = ease(t, aLobby - 0.3, aLobby + 0.4);
  const fahrt = ease(t, aKeller - 0.2, aMinuten + 0.4);
  const zeit = 300 * fahrt;
  const aufzugY = interpolate(fahrt, [0, 1], [1180, 360]);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <rect width={1080} height={1920} fill="#0d1526" />
        {t < aLobby ? (
          <g opacity={1 - ease(t, aLobby - 0.4, aLobby - 0.1)}>
            {[[aEinkaufen, "markt", 260], [aSchulen, "schule", 540], [aAerzte, "arzt", 820]].map(([a, art, x]) => (
              <Icon key={art as string} art={art as "markt"} x={x as number} y={780} s={1.5 * Math.min(1, pop(t, (a as number) - 0.1, 220, 11))} o={t >= (a as number) - 0.1 ? 1 : 0} />
            ))}
          </g>
        ) : null}
        {t >= Z(9) - 0.1 && t < Z(10) + 0.3 ? (
          <g opacity={lobby * (1 - ease(t, Z(10) - 0.35, Z(10) - 0.05))}>
            <rect x={60} y={560} width={960} height={500} rx={30} fill="#13361f" stroke={GRUEN} strokeWidth={6} />
            {Array.from({ length: 10 }, (_, i) => <g key={i}><rect x={110 + i * 92} y={940} width={12} height={60} fill="#6b4a2a" /><circle cx={116 + i * 92} cy={920} r={40} fill={i % 2 ? "#3b8f45" : "#2f7a3a"} /></g>)}
            <ellipse cx={540} cy={1010} rx={90} ry={18} fill="#7fc3ff" opacity={0.8} />
            {[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M540,1000 Q${520 + i * 10},${960 - 10 * Math.sin(t * 6 + i)} ${500 + i * 20},1004`} fill="none" stroke="#bfe3ff" strokeWidth={3} />)}
            {[160, 900].map((x) => <rect key={x} x={x - 40} y={1010} width={80} height={10} rx={4} fill="#8c6a4e" />)}
            {Array.from({ length: 7 }, (_, i) => <Fussgaenger key={i} x={120 + ((t * 25 + i * 130) % 840)} y={1040} farbe={["#ff6b5a", "#7fb3e6", "#ffd25e", "#ffffff"][i % 4]} p={t * 1.4 + i * 0.3} s={1.1} />)}
            <Icon art="krankenhaus" x={260} y={720} s={Math.min(1, pop(t, aKrankenhaus - 0.1, 220, 11))} o={t >= aKrankenhaus - 0.1 ? 1 : 0} />
            <Icon art="park" x={540} y={720} s={Math.min(1, pop(t, aParks - 0.1, 220, 11))} o={t >= aParks - 0.1 ? 1 : 0} />
            <Icon art="aufzug" x={820} y={720} s={Math.min(1, pop(t, aExpress - 0.1, 220, 11))} o={t >= aExpress - 0.1 ? 1 : 0} />
          </g>
        ) : null}
        {t >= Z(10) - 0.2 ? (
          <g opacity={ease(t, Z(10) - 0.05, Z(10) + 0.3)}>
            <rect x={470} y={340} width={140} height={920} fill="#152238" stroke={CREME} strokeWidth={4} />
            {Array.from({ length: 16 }, (_, i) => <line key={i} x1={470} y1={340 + ((i * 60 + t * 900 * fahrt * (1 - fahrt) * 4) % 920)} x2={610} y2={340 + ((i * 60 + t * 900 * fahrt * (1 - fahrt) * 4) % 920)} stroke={rgba(CREME, 0.25)} strokeWidth={3} />)}
            <rect x={485} y={aufzugY - 60} width={110} height={120} rx={12} fill={GOLD} />
            <rect x={505} y={aufzugY - 40} width={70} height={60} rx={6} fill="#fff6d6" />
          </g>
        ) : null}
      </svg>
      {t >= aAufzug1 - 0.1 && t < aMaerkte - 0.1 ? <Chip x={540} y={330} text="kein Aufzug nötig" p={pop(t, aAufzug1 - 0.1, 230, 11)} size={56} /> : null}
      {t >= aMaerkte - 0.1 && t < aLobby - 0.3 ? <Chip x={540} y={330} text="alles auf der eigenen Etage" p={pop(t, aMaerkte - 0.1, 220, 12)} /> : null}
      {t >= aLobby - 0.2 && t < Z(10) - 0.3 ? <Chip x={540} y={330} text="Sky-Lobby · alle 100 Etagen" p={pop(t, aLobby - 0.2, 220, 12)} bg={GRUEN} fg="#ffffff" /> : null}
      {t >= Z(10) - 0.2 ? (
        <>
          <Zaehler x={250} y={560} wert={`${Math.floor(zeit / 60)}:${String(Math.floor(zeit % 60)).padStart(2, "0")}`} label="MINUTEN" farbe={GOLD} groesse={84} />
          <Zaehler x={250} y={760} wert={`${de(5.45 * fahrt, 1)} km`} label="HÖHE" farbe={CREME} groesse={70} />
          <Zaehler x={830} y={660} wert="20 m/s" label="EXPRESS" farbe={CREME} groesse={54} />
        </>
      ) : null}
    </AbsoluteFill>
  );
};

// ---- 5 · Wasser: Pumpen, Tanks, Strom, Turbinen ---------------------------------------------------------
const aKilometer = A("kilometerweit");
const aStufe = A("Stufe", 1);
const Wasser: React.FC<{ t: number; o: number }> = ({ t, o }) => {
  if (o <= 0) return null;
  const strom = ease(t, aStrom - 0.2, aDeutschland + 0.6);
  const runter = t >= aAbwasser - 0.2;
  const stufen = [1180, 1030, 880, 730, 580];
  const pfeil = ease(t, aKilometer - 0.2, aKilometer + 0.5);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <rect width={1080} height={1920} fill="#0b1426" />
        <rect x={330} y={560} width={36} height={660} fill="#2c3e5c" />
        {stufen.map((y, i) => {
          const an = t >= aStufe + i * 0.22 ? ease(t, aStufe + i * 0.22, aStufe + 0.25 + i * 0.22) : 0;
          return (
            <g key={i} opacity={ease(t, Z(11) - 0.1 + i * 0.1, Z(11) + 0.3 + i * 0.1)}>
              {an > 0 ? <rect x={238} y={y - 70} width={220} height={120} rx={20} fill={rgba(WASSER, 0.35 * an)} /> : null}
              <rect x={258} y={y - 50} width={180} height={84} rx={16} fill="#1e3557" stroke={WASSER} strokeWidth={5} />
              <rect x={265} y={y - 43 + 70 * (1 - (0.5 + 0.4 * Math.sin(t * 3 + i)))} width={166} height={70 * (0.5 + 0.4 * Math.sin(t * 3 + i))} rx={12} fill={rgba(WASSER, 0.6 + 0.3 * an)} />
            </g>
          );
        })}
        {Array.from({ length: 18 }, (_, i) => <circle key={i} cx={348} cy={1210 - ((t * 280 + i * 40) % 650)} r={10} fill={WASSER} opacity={t >= aWasser ? 0.95 : 0} />)}
        {pfeil > 0 ? (
          <g opacity={pfeil}>
            <line x1={520} y1={1210} x2={520} y2={1210 - 640 * pfeil} stroke={GOLD} strokeWidth={10} />
            <polygon points={`500,${1210 - 640 * pfeil} 540,${1210 - 640 * pfeil} 520,${1170 - 640 * pfeil}`} fill={GOLD} />
          </g>
        ) : null}
        {runter ? (
          <g opacity={ease(t, aAbwasser - 0.2, aAbwasser + 0.3)}>
            <rect x={770} y={560} width={36} height={660} fill="#2c3e5c" />
            {Array.from({ length: 18 }, (_, i) => <circle key={i} cx={788} cy={560 + ((t * 460 + i * 40) % 660)} r={10} fill="#7fd1a8" />)}
            {[760, 1020].map((y, i) => <Turbine key={i} x={788} y={y} r={80} winkel={t * 400 + i * 30} />)}
          </g>
        ) : null}
      </svg>
      {pfeil > 0.6 && t < aStrom - 0.3 ? <div style={{ position: "absolute", left: 560, top: 560 + 30, fontFamily: HEAD, fontWeight: 900, fontSize: 52, color: GOLD, whiteSpace: "nowrap", transform: `scale(${pop(t, aKilometer + 0.2, 220, 12)})`, transformOrigin: "0 50%" }}>bis 5,4 km hoch</div> : null}
      {t >= aWasser - 0.1 && t < aLiter - 0.2 ? <Chip x={540} y={330} text="Problem: Wasser" p={pop(t, aWasser - 0.1, 220, 12)} bg={WASSER} fg="#ffffff" size={60} /> : null}
      {t >= aLiter - 0.2 && t < aStrom - 0.2 ? <Zaehler x={540} y={300} wert="820 Mrd. Liter" label="WASSER PRO TAG" farbe={WASSER} groesse={84} /> : null}
      {t >= aStufe && t < aStrom - 0.2 ? <Chip x={330} y={1290} text="Stufe für Stufe" p={pop(t, aStufe, 220, 12)} bg={WASSER} fg="#ffffff" size={40} /> : null}
      {t >= aStrom - 0.2 ? (
        <div style={{ position: "absolute", left: 140, top: 270, width: 710, padding: "18px 26px", boxSizing: "border-box", background: rgba("#000000", 0.55), border: `3px solid ${rgba(CREME, 0.4)}`, borderRadius: 20, opacity: ease(t, aStrom - 0.2, aStrom + 0.2) }}>
          {[["Pumpen", 6.1, GOLD], ["Deutschland", 1.4, CREME]].map(([n, w, f]) => (
            <div key={n as string} style={{ marginBottom: 10 }}>
              <div style={{ fontFamily: HEAD, fontWeight: 900, fontSize: 40, color: f as string, whiteSpace: "nowrap" }}>{n}: {de(w as number, 1)} TWh pro Tag</div>
              <div style={{ height: 44, width: 650 * ((w as number) / 6.1) * strom, background: f as string, borderRadius: 10, marginTop: 6 }} />
            </div>
          ))}
        </div>
      ) : null}
      {t >= aDeutschland + 0.3 && t < aAbwasser ? <Chip x={540} y={560} text="über 4× so viel Strom!" p={pop(t, aDeutschland + 0.3, 220, 11)} bg={ROT} fg="#ffffff" size={52} /> : null}
      {t >= aTurbinen - 0.1 ? <Chip x={788} y={1290} text="Turbinen" p={pop(t, aTurbinen - 0.1, 220, 12)} bg="#7fd1a8" size={40} /> : null}
    </AbsoluteFill>
  );
};

// ---- 6 · Ganz oben: Luftdruck halbiert ---------------------------------------------------------------------
const Oben: React.FC<{ t: number; o: number }> = ({ t, o }) => {
  if (o <= 0) return null;
  const druck = interpolate(ease(t, aLuftdruck - 0.1, aHalb + 0.5), [0, 1], [1013, 505]);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <Himmel id="oben" oben="#071228" unten="#2f5d9c" />
        <HausReal id="oben" x0={130} w={760} bodenY={1700} h={940} t={t} tiefe={90} dunst={0.15} lobbys={2} />
        {Array.from({ length: 5 }, (_, i) => <g key={i}><rect x={170 + i * 145} y={820} width={110} height={70} rx={6} fill="#1d2b44" stroke={CREME} strokeWidth={4} /><rect x={176 + i * 145} y={826} width={98} height={14} fill="#3d5a82" /></g>)}
        {[[100 - t * 10, 1120, 1.8], [560 - t * 14, 1180, 2.2], [980 - t * 8, 1100, 1.6]].map(([x, y, s], i) => <Wolke key={i} x={x} y={y} s={s} />)}
        <Manometer x={540} y={520} r={170} wert={druck} />
        {t >= aFlugzeug - 0.2 ? (
          <g transform={`translate(${interpolate(t, [aFlugzeug - 0.2, aFlugzeug + 3], [1100, 600], clamp)} 300) scale(1.4)`}>
            <path d="M-60,0 L50,0 Q70,0 70,8 Q70,14 50,14 L-60,14 Z" fill={CREME} />
            <path d="M-10,6 L-40,40 L-25,40 L15,8 Z M-10,6 L-40,-28 L-25,-28 L15,4 Z" fill={CREME} />
            <path d="M-56,4 L-70,-18 L-60,-18 L-44,4 Z" fill={CREME} />
          </g>
        ) : null}
      </svg>
      {t >= aHalb ? <Chip x={540} y={730} text="nur noch halb so viel Luftdruck" p={pop(t, aHalb, 220, 12)} bg={ROT} fg="#ffffff" size={40} /> : null}
      {t >= aFlugzeug - 0.3 ? <Chip x={540} y={940} text="Druckluft wie im Flugzeug" p={pop(t, aFlugzeug - 0.3, 220, 12)} size={40} /> : null}
    </AbsoluteFill>
  );
};

// ---- 7 · Der Rest der Welt --------------------------------------------------------------------------------
const Welt: React.FC<{ t: number; o: number }> = ({ t, o }) => {
  if (o <= 0) return null;
  const zurueck = ease(t, Z(17) - 0.2, aLeer + 0.8);
  const s = interpolate(zurueck, [0, 1], [1.8, 0.75]);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <Himmel id="welt" />
        <Alpen bodenY={1000} o={0.8} />
        <Wildnis y={1000} />
        <path d="M-20,1300 C200,1250 260,1150 420,1120 C560,1090 600,1040 720,1030 C860,1020 980,1060 1100,1040" fill="none" stroke="#5aa9e6" strokeWidth={16} opacity={0.9} />
        <Voegel t={t} x={140} y={600} n={6} />
        <g transform={`translate(540 1000) scale(${s}) translate(-540 -1000)`}>
          <HausReal id="welt" x0={250} w={540} bodenY={1000} h={420} t={t} tiefe={60} dunst={0.3} />
          {t >= aLasten - 0.2
            ? [0, 1, 2].map((i) => {
                const y = 1000 - (((t - aLasten) * 180 + i * 140) % 420);
                return <g key={i}><rect x={836} y={y - 40} width={50} height={40} fill="#c98a4a" stroke="#6b4a2a" strokeWidth={3} /><line x1={861} y1={1000} x2={861} y2={580} stroke={CREME} strokeWidth={3} /></g>;
              })
            : null}
        </g>
        {[[200 - t * 8, 420, 1.2], [800 - t * 10, 500, 1.0]].map(([x, y, sc], i) => <Wolke key={i} x={x} y={y} s={sc} />)}
      </svg>
      {t >= aDraussen - 0.1 && t < aLeer - 0.1 ? <Chip x={540} y={330} text="Und draußen?" p={pop(t, aDraussen - 0.1, 230, 11)} size={60} /> : null}
      {t >= aLeer - 0.1 && t < aFelder - 0.1 ? <Chip x={540} y={330} text="der Rest der Erde: leer" p={pop(t, aLeer - 0.1, 220, 12)} bg={GRUEN} fg="#ffffff" /> : null}
      {[[aFelder, "Felder", 250], [aWaelder, "Wälder", 540], [aWildnis, "Wildnis", 830]].map(([a, txt, x]) =>
        t >= (a as number) - 0.1 ? <Chip key={txt as string} x={x as number} y={330} text={txt as string} p={pop(t, (a as number) - 0.1, 240, 11)} bg={GRUEN} fg="#ffffff" size={46} /> : null,
      )}
      {t >= aLasten ? <Chip x={600} y={1300} text="Lebensmittel per Lastenaufzug" p={pop(t, aLasten, 220, 12)} size={36} /> : null}
    </AbsoluteFill>
  );
};

// ---- 8 · Die Frage: ganz oben oder ganz unten? -----------------------------------------------------------
const Frage: React.FC<{ t: number; o: number }> = ({ t, o }) => {
  if (o <= 0) return null;
  const pO = pop(t, aWohnen - 0.2, 210, 12);
  const pU = pop(t, aUnten - 0.1, 210, 12);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, #0b1d3d 0%, #3a7bd5 50%, #3d6b3d 50%, #1f3d1f 100%)" }} />
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        {/* oben: Dach über den Wolken */}
        <defs><clipPath id="fr-oben"><rect x={0} y={0} width={1080} height={960} /></clipPath><clipPath id="fr-unten"><rect x={0} y={960} width={1080} height={960} /></clipPath></defs>
        <g clipPath="url(#fr-oben)">
          <HausReal id="frage-o" x0={190} w={620} bodenY={1300} h={640} t={t} tiefe={80} dunst={0.35} lobbys={3} />
          <Wolke x={140 - t * 10} y={860} s={2.0} /><Wolke x={560 - t * 6} y={900} s={2.4} /><Wolke x={980 - t * 8} y={870} s={1.8} />
          <Voegel t={t} x={60} y={420} n={5} farbe="#e6edf7" />
        </g>
        {/* unten: Fuß des Hauses mit Park */}
        <g clipPath="url(#fr-unten)">
          <rect x={0} y={960} width={1080} height={960} fill="#3d6b3d" />
          <HausReal id="frage-u" x0={-40} w={760} bodenY={1240} h={900} t={t} tiefe={60} dunst={0} lobbys={0} />
          <rect x={0} y={1240} width={1080} height={680} fill="#4f9a4f" />
          {Array.from({ length: 12 }, (_, i) => <Baum key={i} x={40 + i * 90} y={1262 + (i % 2) * 20} s={1.2} />)}
          {Array.from({ length: 8 }, (_, i) => <Fussgaenger key={i} x={((t * 30 + i * 140) % 1120) - 20} y={1300} farbe={["#ff6b5a", "#7fb3e6", "#ffd25e", "#ffffff"][i % 4]} p={t * 1.5 + i * 0.3} s={1.4} />)}
        </g>
      </svg>
      <div style={{ position: "absolute", left: 540, top: 380, transform: `translateX(-50%) scale(${pO})`, textAlign: "center", fontFamily: HEAD, fontWeight: 900, fontSize: 110, color: "#ffffff", textShadow: "0 6px 24px rgba(0,0,0,0.5)", whiteSpace: "nowrap" }}>⬆ GANZ OBEN</div>
      {t >= aUnten - 0.1 ? <div style={{ position: "absolute", left: 540, top: 1280, transform: `translateX(-50%) scale(${pU})`, textAlign: "center", fontFamily: HEAD, fontWeight: 900, fontSize: 110, color: "#ffffff", textShadow: "0 6px 24px rgba(0,0,0,0.5)", whiteSpace: "nowrap" }}>⬇ GANZ UNTEN</div> : null}
      {t >= aUnten + 0.4 ? <div style={{ position: "absolute", left: 540, top: 935, transform: `translate(-50%,-50%) scale(${pop(t, aUnten + 0.4, 200, 12)})`, background: CREME, color: NACHTBLAU, fontFamily: HEAD, fontWeight: 900, fontSize: 64, padding: "8px 34px 12px", borderRadius: 20, whiteSpace: "nowrap" }}>oder?</div> : null}
    </AbsoluteFill>
  );
};

export const Video: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  const k = kamera(t, KAMERA);
  return (
    <AbsoluteFill style={{ background: NACHTBLAU, overflow: "hidden" }}>
      <Audio src={staticFile(V.audio)} />
      <AbsoluteFill style={{ transform: `scale(${k})`, transformOrigin: "540px 820px" }}>
        <Hook t={t} o={sz(t, 0, Z(1))} />
        <Hoehe t={t} o={sz(t, Z(1), Z(4))} />
        <Leben t={t} o={sz(t, Z(4), Z(7))} />
        <Alltag t={t} o={sz(t, Z(7), Z(11))} />
        <Wasser t={t} o={sz(t, Z(11), Z(15))} />
        <Oben t={t} o={sz(t, Z(15), Z(17))} />
        <Welt t={t} o={sz(t, Z(17), Z(20))} />
        <Frage t={t} o={sz(t, Z(20), 999)} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** Für das Cover: Hook-Bild ohne Text. */
export const CoverBild: React.FC = () => (
  <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
    <Himmel id="cover" />
    <Alpen bodenY={BODEN} />
    <BergReal x={200} y={BODEN - BERG_H} bodenY={BODEN} breite={440} />
    <HausReal id="cover" x0={380} w={700} bodenY={BODEN} h={HAUS_H} t={1} />
    {[[120, 980, 1.3], [520, 900, 1.6], [900, 1010, 1.2], [300, 1080, 1.4]].map(([x, y, s], i) => <Wolke key={i} x={x} y={y} s={s} o={0.85} />)}
    <rect x={0} y={BODEN} width={1080} height={670} fill="#3d6b3d" />
  </svg>
);
