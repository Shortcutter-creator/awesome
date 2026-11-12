import { THEME } from "../../basis/theme";
// Thumbnails (Cover) für Kanal-Shorts, 1080×1920 Standbild.
// Signatur: Das Hauptobjekt der Folge steht halb auf Papier, halb „geröntgt“ (diagonaler Scan-Schnitt).
// Alles Wichtige liegt in y 220–1680: TikTok zeigt im Profilraster nur die Mitte (3:4).
// Inhalte nur aus skript.txt der Folge (Regel 8 der Bauanleitung: nichts dazuerfinden).
import React from "react";
import { AbsoluteFill } from "remotion";
import { C, HEAD, MONO } from "../../basis/lib";
import { Kuechenmaschine } from "./icons";
import { Akkordeon, Note } from "./icons_h02";
import { Kleid, Preisschild } from "./icons_h03";
import { Dose } from "./icons_h04";
import { Prospekt, Hammer } from "./icons_h05";
import { Becher } from "./icons_h06";
import { Paket, RueckPfeil } from "./icons_h07";
import { Burger, Etikett as Etikett8 } from "./icons_h08";
import { HotDog, Preisschild as Preisschild9 } from "./icons_h09";
import { Plan } from "./icons_h10";
import { Roadster } from "./icons_h11";
import { Laptop } from "./icons_h12";
import { Iphone } from "./icons_h13";
import { Lohntuete, Verlobungsring } from "./icons_h14";
import { Wagen } from "./icons_h15";
import { Reifen, Stern } from "./icons_h19";
import { Schrittzaehler, Abdruck } from "./icons_h20";
import { Gluehbirne } from "./icons_h21";
import { Flasche, Wolke } from "./icons_h22";
import { Geldschein as Geldschein23, Wuerfelzucker } from "./icons_h23";
import { Gedankenblase as Blase24, Medaille as Medaille24 } from "./icons_h24";
import { PreisText as PreisText25, Schild as Schild25 } from "./icons_h25";
import { Smartphone as Smartphone26, ZeigeHand as ZeigeHand26 } from "./icons_h26";
import { Fangbremse as Fangbremse27, Kabine as Kabine27, SeilRiss as SeilRiss27 } from "./icons_h27";
import { Kreuz as Kreuz26 } from "./icons";

type Teil = { x: number; y: number; rot?: number; el: (glow: boolean) => React.ReactNode };
type Cfg = {
  zeilen: [string, string];      // Schlagzeile, 2 Zeilen
  rot?: number;                  // welche Zeile rot statt schwarz (0/1)
  frage: string;                 // Zeile unten auf dem Röntgen-Teil
  teile: Teil[];                 // Objekte (normal + Röntgen-Fassung)
  schnitt?: [number, number];    // y des Scan-Schnitts links/rechts
  kreis?: { x: number; y: number; w: number; h: number; rot?: number }; // roter Markierungskreis
  /** Marken-Logo (Pflicht bei markenbezogenen Folgen, seit 18.10.2026): immer in Originalfarben, über dem Röntgen-Schnitt. */
  logo?: { el: React.ReactNode; x: number; y: number; rot?: number; karte?: boolean };
};

const Zentriert: React.FC<{ x: number; y: number; rot?: number; children: React.ReactNode }> = ({ x, y, rot = 0, children }) => (
  <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) rotate(${rot}deg)` }}>{children}</div>
);

const Preis: React.FC<{ txt: string; size?: number; durch?: boolean; glow?: boolean }> = ({ txt, size = 74, durch, glow }) => (
  <span style={{ fontFamily: HEAD, fontWeight: 900, fontSize: size, color: glow ? C.glow : C.ink, letterSpacing: -2, position: "relative", whiteSpace: "nowrap" }}>
    {txt}
    {durch && <span style={{ position: "absolute", left: -8, right: -8, top: "52%", height: size * 0.12, background: C.red, transform: "rotate(-8deg)" }} />}
  </span>
);

export const FOLGEN: Record<string, Cfg> = {
  "02": {
    zeilen: ["DIESE MUSIK", "VERKAUFT WEIN."], rot: 1,
    frage: "3 von 4 Weinen: französisch.",
    teile: [
      { x: 540, y: 1080, el: (g) => <Akkordeon size={720} glow={g} zug={0.55} /> },
      { x: 860, y: 820, rot: 12, el: (g) => <Note size={170} glow={g} /> },
      { x: 220, y: 860, rot: -14, el: (g) => <Note size={130} glow={g} /> },
    ],
  },
  "03": {
    zeilen: ["39 $ SCHLÄGT", "34 $."], rot: 1,
    frage: "Teurer verkauft sich besser?!",
    teile: [
      { x: 430, y: 1040, el: (g) => <Kleid size={460} glow={g} /> },
      { x: 820, y: 840, rot: 10, el: (g) => <Preisschild size={330} glow={g}><Preis txt="39 $" glow={g} /></Preisschild> },
      { x: 830, y: 1170, rot: -6, el: (g) => <Preisschild size={260} glow={g} schnur={false}><Preis txt="34 $" size={58} durch glow={g} /></Preisschild> },
    ],
    kreis: { x: 830, y: 850, w: 380, h: 250, rot: 10 },
  },
  "20": {
    zeilen: ["10.000", "SCHRITTE?"], rot: 0,
    frage: "Kein Arzt. Ein Schrittzähler.",
    teile: [
      { x: 540, y: 1080, rot: -6, el: (g) => <Schrittzaehler size={560} glow={g} wert={10000} fenster={g ? 1 : 0} /> },
      { x: 150, y: 1330, rot: -20, el: (g) => <Abdruck size={150} glow={g} /> },
      { x: 950, y: 1250, rot: 18, el: (g) => <Abdruck size={140} glow={g} /> },
    ],
  },
  "23": {
    zeilen: ["STUDIE", "GEKAUFT"], rot: 1,
    frage: "Wer hat Fett zum Feind gemacht?",
    schnitt: [1310, 1110],
    teile: [
      // Geldschein nur im Röntgen-Teil sichtbar (steckt unter dem Würfel)
      { x: 690, y: 1290, rot: -8, el: (g) => (g ? <Geldschein23 size={460} glow /> : null) },
      { x: 690, y: 1110, rot: -8, el: (g) => <Wuerfelzucker size={470} glow={g} /> },
      { x: 530, y: 885, rot: -6, el: (g) => (
        <span style={{ fontFamily: HEAD, fontWeight: 900, fontSize: 236, letterSpacing: -8, lineHeight: 1, whiteSpace: "nowrap",
          color: g ? "#eaf7ff" : C.red, WebkitTextStroke: g ? "0" : `8px ${C.ink}`, paintOrder: "stroke fill",
          textShadow: g ? "0 0 34px rgba(143,216,255,0.85), 0 6px 0 rgba(0,0,0,0.45)" : `10px 10px 0 ${C.ink}` } as React.CSSProperties}>6.500 $</span>
      ) },
      { x: 265, y: 1160, rot: -12, el: () => (
        <span style={{ display: "inline-block", fontFamily: HEAD, fontWeight: 900, fontSize: 70, letterSpacing: 4, color: C.red, border: `9px solid ${C.red}`, borderRadius: 18,
          padding: "0 28px 6px", background: "rgba(246,243,236,0.94)", boxShadow: "6px 6px 0 rgba(224,72,59,0.35)",
          maskImage: "radial-gradient(circle at 30% 40%, #000 55%, rgba(0,0,0,0.75) 70%, #000 85%)" } as React.CSSProperties}>BEZAHLT</span>
      ) },
    ],
  },
  "24": {
    zeilen: ["BRONZE >", "SILBER."], rot: 1,
    frage: "Warum freut sich Platz 3 mehr?",
    teile: [
      // Bronze (strahlt) links, Silber (traurig) rechts – Silber steckt im Röntgen-Teil, mit Gedankenblase „Gold“
      { x: 290, y: 1245, rot: -8, el: (g) => <Medaille24 size={240} metall="bronze" laune={1} glow={g} /> },
      { x: 800, y: 1255, rot: 7, el: (g) => <Medaille24 size={228} metall="silber" laune={-1} traene={1} glow={g} blick={{ x: 0.3, y: -1 }} /> },
      { x: 935, y: 1040, rot: 4, el: (g) => (
        <Blase24 w={230} h={150} glow={g} schwanz="unten" schwanzX={0.3}>
          <div style={{ width: 84, height: 84, borderRadius: 42, background: "#f1c94a", border: "7px solid #c99a1e", boxShadow: `0 0 0 4px ${C.ink}`,
            display: "flex", alignItems: "center", justifyContent: "center", fontFamily: HEAD, fontWeight: 900, fontSize: 50, color: C.ink }}>1</div>
        </Blase24>
      ) },
      { x: 535, y: 868, rot: -4, el: (g) => (
        <span style={{ fontFamily: HEAD, fontWeight: 900, fontSize: 170, letterSpacing: -6, lineHeight: 1, whiteSpace: "nowrap",
          WebkitTextStroke: g ? "0" : `8px ${C.ink}`, paintOrder: "stroke fill",
          textShadow: g ? "0 0 34px rgba(143,216,255,0.85), 0 6px 0 rgba(0,0,0,0.45)" : `10px 10px 0 ${C.ink}` } as React.CSSProperties}>
          <span style={{ color: g ? "#eaf7ff" : "#d38c52" }}>7,1</span>
          <span style={{ color: g ? "#eaf7ff" : C.red }}> &gt; </span>
          <span style={{ color: g ? "#eaf7ff" : "#c9cfd6" }}>4,8</span>
        </span>
      ) },
      { x: 545, y: 1135, rot: -9, el: () => (
        <span style={{ display: "inline-block", fontFamily: HEAD, fontWeight: 900, fontSize: 64, letterSpacing: 4, color: C.red, border: `9px solid ${C.red}`, borderRadius: 18,
          padding: "0 26px 6px", background: "rgba(246,243,236,0.94)", boxShadow: "6px 6px 0 rgba(224,72,59,0.35)",
          maskImage: "radial-gradient(circle at 30% 40%, #000 55%, rgba(0,0,0,0.75) 70%, #000 85%)" } as React.CSSProperties}>VERGLEICH</span>
      ) },
    ],
  },
  "25": {
    zeilen: ["DAS KOMMA", "KOSTET"], rot: 1,
    frage: "Warum wirkt 1.499,00 € teurer?",
    schnitt: [1330, 1110],
    teile: [
      // Preisschild an der Schnur, riesiges rotes „,00“; der Scan-Schnitt läuft durch die rechte untere Ecke
      { x: 540, y: 1005, rot: -4, el: (g) => (
        <Schild25 w={980} h={480} schnur={70} glow={g}>
          <PreisText25 vor="1.499" cent="00" size={270} glow={g} kommaFarbe={g ? "#ff7b6e" : C.red}
            vorStyle={{ fontSize: "0.56em" }} centStyle={{ color: g ? "#ff7b6e" : C.red }} euroStyle={{ fontSize: "0.5em", marginLeft: 18 }} />
        </Schild25>
      ) },
      { x: 300, y: 1360, rot: -7, el: () => (
        <span style={{ display: "inline-block", fontFamily: HEAD, fontWeight: 900, fontSize: 66, letterSpacing: 4, color: C.red, border: `9px solid ${C.red}`, borderRadius: 18,
          padding: "0 26px 6px", background: "rgba(246,243,236,0.94)", boxShadow: "6px 6px 0 rgba(224,72,59,0.35)",
          maskImage: "radial-gradient(circle at 30% 40%, #000 55%, rgba(0,0,0,0.75) 70%, #000 85%)" } as React.CSSProperties}>WIRKT TEURER</span>
      ) },
    ],
  },
  "26": {
    zeilen: ["KEIN DRUCK.", "NUR STROM."], rot: 1,
    frage: "Warum geht’s nicht mit Handschuh?",
    schnitt: [1180, 1010],
    teile: [
      // Handy halb geröntgt (Leiterbahn-Gitter nur im Röntgen-Teil), Strickhandschuh tippt – nichts passiert. Kein Logo.
      { x: 450, y: 1040, rot: -6, el: (g) => <Smartphone26 size={340} glow={g} gitter={g ? 1 : 0} /> },
      { x: 713, y: 1045, el: (g) => <ZeigeHand26 size={500} handschuh glow={g} /> },
      { x: 405, y: 905, el: () => <Kreuz26 size={100} p={1} /> },
    ],
    kreis: { x: 520, y: 1000, w: 250, h: 180, rot: -8 },
  },
  "27": {
    zeilen: ["SEIL REISST?", "WAS PASSIERT?"], rot: 1, // Marvin 20.10.: „was passiert?“ statt „fast nichts“
    frage: "Warum stürzt der Aufzug nicht?",
    teile: [
      // Kabine zwischen zwei Zahnschienen, Haken eingerastet, Seil gerissen. Kein Logo (Otis nur Person, hier gar nicht im Bild).
      { x: 175, y: 1100, el: (g) => <Fangbremse27 size={240} glow={g} /> },
      { x: 905, y: 1100, el: (g) => <div style={{ transform: "scaleX(-1)" }}><Fangbremse27 size={240} glow={g} /></div> },
      { x: 540, y: 1100, el: (g) => <Kabine27 size={440} glow={g} /> },
      { x: 540, y: 748, el: (g) => <SeilRiss27 size={74} glow={g} /> },
    ],
    kreis: { x: 540, y: 745, w: 190, h: 150, rot: -8 },
  },
  "15": {
    zeilen: ["KEINER WOLLTE", "IHN SCHIEBEN."], rot: 1,
    frage: "Also bezahlte er Models.",
    teile: [{ x: 540, y: 1060, rot: -4, el: (g) => <Wagen size={700} glow={g} web={1} /> }],
  },
};

// Schriftgröße so wählen, dass die Zeile in 940 px passt (Inter Tight 900, Versalien ≈ 0,64 em je Zeichen)
const passend = (txt: string, max: number) => Math.min(max, Math.floor(940 / (txt.length * 0.64)));

export const Thumb: React.FC<{ nr: string; unterzeile?: string }> = ({ nr, unterzeile = "▸ DER TRICK DAHINTER" }) => {
  const f = FOLGEN[nr];
  const [yl, yr] = f.schnitt ?? [1290, 1050];
  const clip = `polygon(0 ${yl}px, 1080px ${yr}px, 1080px 1920px, 0 1920px)`;
  const objekte = (glow: boolean) => f.teile.map((t, i) => <Zentriert key={i} x={t.x} y={t.y} rot={t.rot}>{t.el(glow)}</Zentriert>);
  const groesse = Math.min(passend(f.zeilen[0], 176), passend(f.zeilen[1], 176));
  const winkel = (Math.atan2(yr - yl, 1080) * 180) / Math.PI;
  return (
    <AbsoluteFill style={{ background: C.paper, overflow: "hidden" }}>
      {/* Papier-Bühne */}
      <AbsoluteFill style={{ backgroundImage: `linear-gradient(${C.grid} 2px, transparent 2px), linear-gradient(90deg, ${C.grid} 2px, transparent 2px)`, backgroundSize: "108px 108px" }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 55%, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0) 55%, rgba(0,0,0,0.08) 100%)" }} />
      {objekte(false)}
      {/* Röntgen-Teil */}
      <AbsoluteFill style={{ clipPath: clip }}>
        <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 60%, ${C.navyIn} 0%, ${C.navyOut} 80%)` }} />
        <AbsoluteFill style={{ backgroundImage: "linear-gradient(rgba(143,216,255,0.08) 2px, transparent 2px), linear-gradient(90deg, rgba(143,216,255,0.08) 2px, transparent 2px)", backgroundSize: "54px 54px" }} />
        {objekte(true)}
      </AbsoluteFill>
      {/* Scan-Kante */}
      <div style={{ position: "absolute", left: -40, top: yl, width: 1200, height: 10, transformOrigin: "40px 5px", transform: `translateY(-5px) rotate(${winkel}deg)`,
        background: C.glow, boxShadow: "0 0 24px 8px rgba(143,216,255,0.75), 0 0 80px 20px rgba(143,216,255,0.35)" }} />
      {/* Markierungskreis */}
      {f.kreis && (
        <div style={{ position: "absolute", left: f.kreis.x, top: f.kreis.y, width: f.kreis.w, height: f.kreis.h, transform: `translate(-50%,-50%) rotate(${f.kreis.rot ?? 0}deg)`,
          border: `14px solid ${C.red}`, borderRadius: "50%", boxShadow: "4px 4px 0 rgba(31,28,26,0.25)" }} />
      )}
      {/* Marken-Logo */}
      {f.logo && (
        <div style={{ position: "absolute", left: f.logo.x, top: f.logo.y, transform: `translate(-50%,-50%) rotate(${f.logo.rot ?? 0}deg)`,
          ...(f.logo.karte === false ? { filter: "drop-shadow(6px 6px 0 rgba(31,28,26,0.9))" } : { background: "#fffdf8", border: `6px solid ${C.ink}`, borderRadius: 18, padding: "18px 24px", boxShadow: `8px 8px 0 ${C.ink}` }) }}>
          {f.logo.el}
        </div>
      )}
      {/* Serien-Badge */}
      <div style={{ position: "absolute", top: 236, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <div style={{ display: "flex", alignItems: "stretch", border: `6px solid ${C.ink}`, borderRadius: 14, overflow: "hidden", boxShadow: `8px 8px 0 ${C.ink}`, background: C.paper2 }}>
          <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: 40, letterSpacing: 6, padding: "10px 22px", color: C.ink }}>{THEME.kanal.name.toUpperCase()}</span>
          <span style={{ width: 34, background: C.red }} />
        </div>
      </div>
      {/* Schlagzeile mit Textmarker */}
      <div style={{ position: "absolute", top: 380, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
        {f.zeilen.map((z, i) => (
          <div key={i} style={{ position: "relative", padding: "0 22px" }}>
            <div style={{ position: "absolute", left: 0, right: 0, top: "18%", bottom: "6%", background: C.yellow, transform: `rotate(${i ? 1.2 : -1.4}deg)`, borderRadius: 10, boxShadow: `6px 6px 0 ${C.ink}` }} />
            <div style={{ position: "relative", fontFamily: HEAD, fontWeight: 900, fontSize: groesse, lineHeight: 1.02, letterSpacing: -3,
              color: f.rot === i ? C.red : C.ink, whiteSpace: "nowrap" }}>{z}</div>
          </div>
        ))}
      </div>
      {/* Neugier-Zeile auf dem Röntgen-Teil */}
      <div style={{ position: "absolute", top: 1440, height: 210, left: 80, right: 80, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ fontFamily: HEAD, fontWeight: 900, fontSize: 92, color: "#ffffff", textAlign: "center", lineHeight: 1.04, letterSpacing: -2,
          textShadow: "0 0 30px rgba(143,216,255,0.6), 0 5px 0 rgba(0,0,0,0.4)", textWrap: "balance" } as React.CSSProperties}>{f.frage}</div>
      </div>
      <div style={{ position: "absolute", top: 1664, left: 0, right: 0, textAlign: "center", fontFamily: MONO, fontWeight: 700, fontSize: 30, letterSpacing: 8, color: C.glow, opacity: 0.9 }}>
        {unterzeile}
      </div>
    </AbsoluteFill>
  );
};
