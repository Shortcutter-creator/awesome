// Grundbausteine jedes Gedankenwerk-Videos: Zeit-Helfer, Wortanker, Untertitel, Bühne, Karten, Abschluss.
// Farben und Schriften kommen aus theme.ts (= theme.json). Diese Datei nicht pro Video ändern.
import React from "react";
import { AbsoluteFill, Easing, interpolate, spring } from "remotion";
import { C, FPS, H, HEAD, MONO, THEME, TITEL_GEWICHT, lesbar, rgba } from "./theme";

export { C, FPS, H, HEAD, MONO, W, TEXT, THEME, TITEL_GEWICHT, hell, kontrast, lesbar, mische, rgba } from "./theme";

// ---------------------------------------------------------------------------
// Zeit-Helfer (alles in Sekunden)
// ---------------------------------------------------------------------------
export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
/** 0 → 1 zwischen a und b, weich auslaufend. */
export const ease = (t: number, a: number, b: number) =>
  interpolate(t, [a, b], [0, 1], { ...clamp, easing: Easing.bezier(0.2, 0.8, 0.2, 1) });
/** 0 → 1 zwischen a und b, gleichmäßig. */
export const lin = (t: number, a: number, b: number) => interpolate(t, [a, b], [0, 1], clamp);
/** Feder ab a (leichtes Überschwingen). */
export const pop = (t: number, a: number, stiff = 190, damp = 12) =>
  t < a ? 0 : spring({ frame: (t - a) * FPS, fps: FPS, config: { damping: damp, stiffness: stiff, mass: 0.8 } });
/** Ein-/Ausblende eines Elements: rein bei a, raus bei b (schneller raus als rein). */
export const life = (t: number, a: number, b = Infinity) => (t < b ? pop(t, a) : 1 - ease(t, b, b + 0.22));
/** Zahl zählt zwischen a und b von `from` auf `to`. Jahreszahlen nie hochzählen, nur einblenden. */
export const countUp = (t: number, a: number, b: number, to: number, from = 0) => from + (to - from) * ease(t, a, b);
/** Deutsche Zahl: 1.549 bzw. 3,5 */
export const de = (n: number, digits = 0) =>
  n.toLocaleString("de-DE", { minimumFractionDigits: digits, maximumFractionDigits: digits });

// ---------------------------------------------------------------------------
// Wörter (aus werkzeug/vertonen.py → woerter.json) und Untertitel
// ---------------------------------------------------------------------------
export type Word = { w: string; s: number; e: number; z: number };
export type Voice = { audio: string; dauer: number; words: Word[]; zeilen: { s: number; e: number; text: string }[] };

const norm = (s: string) => s.toLowerCase().replace(/[^a-zäöüß0-9]/g, "");
type Wahl = number | { ab: number };
/**
 * Findet ein gesprochenes Wort. Exakter Treffer ohne Satzzeichen, Groß/klein egal („verkauft“ ≠ „verkaufte“).
 * Dritter Wert: n-tes Vorkommen (Zahl) oder { ab: Sekunde } = erstes Vorkommen ab dieser Zeit.
 * { ab } ist sicherer: Kleine Wörter wie „das“, „der“, „wenn“ kommen fast immer mehrfach vor.
 */
const treffer = (words: Word[], word: string, wahl: Wahl) => {
  const passend = words.filter((w) => norm(w.w) === norm(word));
  const hit = typeof wahl === "number" ? passend[wahl - 1] : passend.find((w) => w.s >= wahl.ab);
  if (!hit) throw new Error(`Anker „${word}“ (${JSON.stringify(wahl)}) nicht im gesprochenen Text – woerter.json prüfen`);
  return hit;
};
/** Startzeit eines Wortes in Sekunden. */
export const at = (words: Word[], word: string, wahl: Wahl = 1) => treffer(words, word, wahl).s;
/** Endzeit eines Wortes in Sekunden. */
export const endOf = (words: Word[], word: string, wahl: Wahl = 1) => treffer(words, word, wahl).e;

/** 2–4 Wörter je Untertitel-Pille, höchstens ~22 Zeichen; Satzende und Pausen trennen. */
export const makeChunks = (words: Word[]): Word[][] => {
  const out: Word[][] = [];
  for (const w of words) {
    const cur = out[out.length - 1];
    const prev = cur?.[cur.length - 1];
    const len = cur ? cur.map((c) => c.w).join(" ").length + 1 + w.w.length : 0;
    const satzende = prev && /[.?!:]$/.test(prev.w);
    if (!cur || satzende || w.s - prev!.e > 0.3 || cur.length >= 4 || len > 22) out.push([w]);
    else cur.push(w);
  }
  return out;
};

const U = THEME.untertitel;
/** Wort-Untertitel in einer Pille; das gerade gesprochene Wort leuchtet in der Aktiv-Farbe. */
export const Captions: React.FC<{ t: number; chunks: Word[][]; dark?: boolean; y?: number }> = ({ t, chunks, y = U.y }) => {
  if (!U.an) return null;
  const idx = chunks.findIndex((c, i) => {
    const next = chunks[i + 1];
    return t >= c[0].s - 0.04 && (next ? t < next[0].s - 0.04 : t < c[c.length - 1].e + 0.35);
  });
  if (idx < 0) return null;
  const c = chunks[idx];
  const p = pop(t, c[0].s - 0.04, 320, 18);
  return (
    <div style={{ position: "absolute", top: y, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
      <div
        style={{
          background: U.pille,
          border: `3px solid ${rgba(U.farbe, 0.12)}`,
          borderRadius: 18,
          padding: "14px 30px 18px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.18)",
          transform: `scale(${0.92 + 0.08 * p})`,
          opacity: Math.min(1, p * 1.4),
          maxWidth: 900,
          textAlign: "center",
        }}
      >
        {c.map((w, i) => {
          const gesagt = t >= w.s - 0.03;
          const jetzt = gesagt && t < w.e + 0.05;
          return (
            <span
              key={i}
              style={{
                fontFamily: HEAD,
                fontWeight: 800,
                fontSize: U.groesse,
                letterSpacing: -1,
                lineHeight: 1.1,
                color: jetzt ? U.aktiv : gesagt ? U.farbe : rgba(U.farbe, 0.35),
              }}
            >
              {w.w.replace(/[„“"]/g, "")}
              {i < c.length - 1 ? " " : ""}
            </span>
          );
        })}
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Bühne und Mechanik-Wechsel (theme.json → mechanik_wechsel.art: keiner | dunkel | rahmen)
// ---------------------------------------------------------------------------
export type Art = "keiner" | "dunkel" | "rahmen";
const ART = THEME.mechanik_wechsel.art as Art;

/**
 * Stärke des Mechanik-Wechsels 0..1 zwischen `rein` und `raus` (Sekunden).
 * Bei art = "keiner" immer 0: dann bleibt alles hell, Bausteine mit dark={x > 0.5} ebenso.
 */
export const mech = (t: number, rein: number, raus: number, dur = 0.7, art: Art = ART) => {
  if (art === "keiner") return 0;
  return t < raus ? lin(t, rein + dur * 0.15, rein + dur * 0.85) : 1 - lin(t, raus + dur * 0.15, raus + dur * 0.85);
};
/** Alter Name aus Hintergedanke-Bausteinen; gleich wie mech(). */
export const xray = mech;
/** Wie mech(), aber immer mit dunklem Wechsel – für Beispiel-Projekte, deren Zeichnungen auf dunklen Grund ausgelegt sind. */
export const xrayFest = (t: number, rein: number, raus: number, dur = 0.7) => mech(t, rein, raus, dur, "dunkel");

/** Hintergrund mit Raster. x = Mechanik-Wechsel (0..1), siehe mech(). */
export const Stage: React.FC<{ x?: number; art?: Art; children?: React.ReactNode }> = ({ x = 0, art = ART, children }) => (
  <AbsoluteFill style={{ background: C.paper, overflow: "hidden" }}>
    <AbsoluteFill
      style={{
        backgroundImage: `linear-gradient(${C.grid} 2px, transparent 2px), linear-gradient(90deg, ${C.grid} 2px, transparent 2px)`,
        backgroundSize: "108px 108px",
        backgroundPosition: "-1px -1px",
      }}
    />
    {art === "dunkel" && x > 0 ? (
      <AbsoluteFill style={{ opacity: x }}>
        <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 40%, ${C.navyIn} 0%, ${C.navyOut} 78%)` }} />
        <AbsoluteFill
          style={{
            backgroundImage: `linear-gradient(${rgba(C.glow, 0.07)} 2px, transparent 2px), linear-gradient(90deg, ${rgba(C.glow, 0.07)} 2px, transparent 2px)`,
            backgroundSize: "54px 54px",
          }}
        />
      </AbsoluteFill>
    ) : null}
    {art === "rahmen" && x > 0 ? (
      <AbsoluteFill style={{ border: `${Math.round(18 * x)}px solid ${C.accent}`, borderRadius: 0 }} />
    ) : null}
    {children}
  </AbsoluteFill>
);

/** Sichtbarer Übergang in den Erklärteil: ein Streifen läuft von oben nach unten (nur bei art = dunkel/rahmen). */
export const Wechsel: React.FC<{ t: number; a: number; dur?: number; label?: string; art?: Art }> = ({ t, a, dur = 0.7, label = "", art = ART }) => {
  if (art === "keiner" || t < a || t > a + dur + 0.1) return null;
  const farbe = art === "dunkel" ? C.glow : C.accent;
  const y = interpolate(t, [a, a + dur], [-80, H + 40], clamp);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: y, height: 70 }}>
      <div style={{ position: "absolute", inset: 0, background: `linear-gradient(${rgba(farbe, 0)}, ${rgba(farbe, 0.55)} 70%, ${farbe} 100%)` }} />
      {label ? (
        <div style={{ position: "absolute", right: 96, bottom: 10, fontFamily: MONO, fontWeight: 700, fontSize: 22, letterSpacing: 4, color: C.darkText }}>{label}</div>
      ) : null}
    </div>
  );
};
/** Alter Name aus Hintergedanke-Bausteinen. */
export const ScanBar = Wechsel;

// ---------------------------------------------------------------------------
// Kopfzeile, Karten, Chips
// ---------------------------------------------------------------------------
/** Kopfzeile: links der Kanalname, rechts das Thema. `fall` ist der alte Name von `thema`. */
export const Header: React.FC<{ t: number; a: number; thema?: string; fall?: string; nr?: string; x?: number }> = ({ t, a, thema, fall, x = 0 }) => {
  const p = ease(t, a, a + 0.4);
  return (
    <div
      style={{
        position: "absolute",
        top: 190,
        left: 96,
        right: 96,
        display: "flex",
        justifyContent: "space-between",
        fontFamily: MONO,
        fontSize: 26,
        letterSpacing: 3,
        color: x > 0.5 ? C.glow : C.ink,
        opacity: p,
        transform: `translateY(${(1 - p) * -16}px)`,
        textTransform: "uppercase",
      }}
    >
      <span />{/* Kanalname oben links entfernt (Wunsch: kein „Dein Kanal“-Schriftzug) */}
      <span style={{ opacity: 0.75 }}>{thema ?? fall ?? ""}</span>
    </div>
  );
};

export const Card: React.FC<{ style?: React.CSSProperties; dark?: boolean; children?: React.ReactNode }> = ({ style, dark, children }) => (
  <div
    style={{
      background: dark ? rgba(C.glow, 0.16) : C.paper2,
      border: `4px solid ${dark ? C.glow : C.ink}`,
      borderRadius: 22,
      boxShadow: dark ? `0 0 26px ${C.glowSoft}, inset 0 0 18px ${C.glowSoft}` : `8px 8px 0 ${C.ink}`,
      position: "absolute",
      ...style,
    }}
  >
    {children}
  </div>
);

export const Chip: React.FC<{ text: string; bg?: string; fg?: string; border?: string; size?: number; style?: React.CSSProperties }> = ({
  text,
  bg = C.ink,
  fg = C.paper2,
  border,
  size = 26,
  style,
}) => (
  <span
    style={{
      display: "inline-block",
      fontFamily: MONO,
      fontWeight: 700,
      fontSize: size,
      letterSpacing: 2.5,
      textTransform: "uppercase",
      background: bg,
      color: lesbar(fg, bg),
      border: `3px solid ${border ?? bg}`,
      borderRadius: 12,
      padding: "6px 16px",
      whiteSpace: "nowrap",
      ...style,
    }}
  >
    {text}
  </span>
);

/** Quellenkarte: Mono-Zeile (Quelle · Jahr) + fette Aussage. Pflicht im Takt „Beleg“. */
export const SourceCard: React.FC<{ t: number; a: number; b?: number; meta: string; text: string; dark?: boolean; top?: number }> = ({
  t,
  a,
  b = Infinity,
  meta,
  text,
  dark,
  top = 270,
}) => {
  const p = life(t, a, b);
  if (p <= 0.001) return null;
  return (
    <Card
      dark={dark}
      style={{ top, left: 120, right: 120, padding: "22px 30px 24px", borderLeft: `16px solid ${dark ? C.glow : C.accent}`, opacity: p, transform: `translateY(${(1 - p) * 40}px)` }}
    >
      <div style={{ fontFamily: MONO, fontSize: 22, letterSpacing: 2.5, color: dark ? C.glow : C.muted, textTransform: "uppercase" }}>{meta}</div>
      <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 40, lineHeight: 1.15, color: dark ? C.darkText : C.ink, marginTop: 6 }}>{text}</div>
    </Card>
  );
};

/** Horizontaler Balken, füllt sich zwischen a und b auf `wert` (0..1). */
export const Bar: React.FC<{ t: number; a: number; b: number; wert: number; farbe?: string; dark?: boolean; w?: number; h?: number }> = ({
  t,
  a,
  b,
  wert,
  farbe = C.accent,
  dark,
  w = 560,
  h = 34,
}) => (
  <div style={{ width: w, height: h, borderRadius: h / 2, border: `4px solid ${dark ? C.glow : C.ink}`, background: dark ? rgba(C.glow, 0.08) : C.paper2, overflow: "hidden" }}>
    <div style={{ width: `${wert * ease(t, a, b) * 100}%`, height: "100%", background: farbe, borderRadius: h / 2 }} />
  </div>
);

/** Stempel: knallt bei a schräg auf. Für die Pointe; Text kurz (1–3 Wörter). */
export const Stamp: React.FC<{ t: number; a: number; text: string; x: number; y: number; size?: number; rot?: number; farbe?: string }> = ({
  t,
  a,
  text,
  x,
  y,
  size = 96,
  rot = -9,
  farbe = C.red,
}) => {
  if (t < a) return null;
  const s = interpolate(t, [a, a + 0.12, a + 0.22], [2.4, 0.94, 1], clamp);
  const o = lin(t, a, a + 0.08);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${s})`,
        opacity: o,
        fontFamily: HEAD,
        fontWeight: 900,
        fontSize: size,
        letterSpacing: 4,
        color: farbe,
        border: `10px solid ${farbe}`,
        borderRadius: 18,
        padding: "4px 30px 10px",
        background: rgba(C.paper2, 0.92),
        boxShadow: `6px 6px 0 ${rgba(farbe, 0.35)}`,
        whiteSpace: "nowrap",
      }}
    >
      {text}
    </div>
  );
};

// ---------------------------------------------------------------------------
// Abschluss
// ---------------------------------------------------------------------------
/** Schlichte End-Karte mit Kanalname, Einzeiler und Folgen-Hinweis (aus theme.json → kanal). */
export const EndCard: React.FC<{ t: number; a: number; top?: number }> = ({ t, a, top = 1000 }) => {
  const p = pop(t, a, 160, 14);
  const p2 = ease(t, a + 0.25, a + 0.6);
  if (t < a) return null;
  return (
    <div style={{ position: "absolute", left: 90, right: 90, top, display: "flex", flexDirection: "column", alignItems: "center", opacity: Math.min(1, p), textAlign: "center" }}>
      <div style={{ fontFamily: HEAD, fontWeight: TITEL_GEWICHT, fontSize: 112, letterSpacing: -3, lineHeight: 1, color: C.ink, transform: `scale(${0.85 + 0.15 * p})` }}>
        {THEME.kanal.name}
      </div>
      <div style={{ fontFamily: MONO, fontSize: 28, letterSpacing: 3, color: C.muted, marginTop: 14, opacity: p2, textTransform: "uppercase" }}>{THEME.kanal.einzeiler}</div>
      <div style={{ marginTop: 34, opacity: p2, transform: `translateY(${(1 - p2) * 20}px)` }}>
        <Chip text={`Folgen  ·  ${THEME.kanal.handle}`} size={32} style={{ padding: "14px 30px", boxShadow: `6px 6px 0 ${C.accent}`, textTransform: "none" }} />
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Ton: Geräusche mischt werkzeug/klang.py nach videos/<ordner>/klaenge.json (nicht in der Animation).
// SfxTrack bleibt als No-op, damit ältere Bausteine ohne Änderung laufen.
// ---------------------------------------------------------------------------
export type Sfx = { t: number; f: string; v?: number };
export const SfxTrack: React.FC<{ list: Sfx[] }> = () => null;
