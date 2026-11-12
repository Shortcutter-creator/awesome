import { THEME } from "../../basis/theme";
// Cover-System Kanal (seit 20.10.2026). Recherche: projects/kanal/thumbnails/cover-recherche-2026-10-20.md
// Drei Stile, gleichmäßig verteilt (Messung über Zeit). Welcher Stil je Folge: projects/kanal/cover_stile.json
//   A „Widerspruch“  Satz 1 (Glaubenssatz) riesig auf Gelb + roter Stempel „DENKST DU.“ (setzt sich automatisch unter den Text)
//   B „Reaktion“     Frage in 2 Zeilen (Schlüsselwort rot) + DuKopf mit Schock + Rätsel-Objekt mit Kringel + Pfeil
//   C „Röntgen-Riss“ Behauptung/Frage + Hauptobjekt mit gezacktem Riss, innen Glow-Fassung + GlowFrage
//
// SO ERGÄNZT MAN EINE FOLGE (≈ 10–15 min):
//  1. Stil aus cover_stile.json lesen; skript.txt lesen. Text NUR aus dem Skript (Satz 1–3 = Hook), NIE die Auflösung
//     (alles nach „Röntgen wir das.“ ist tabu). Keine Folgennummer. Firmen-Folge → Logo aus deine Logo-Datei ist Pflicht.
//  2. Datensatz in FOLGEN_NEU (unten) anlegen, Schlüssel "NN". Vorlagen: A = "01"/"06", B = "03"/"07"/"11", C = "02"/"04"/"10".
//     - Zeilen ≤ ~12 Zeichen (sonst < 110 px Schrift = im 280-px-Raster unlesbar). A: 3–4 Zeilen, B/C: 2 Zeilen (C bis 3 mit maxSize 220–230).
//     - Text oben ab y 290; zwei Zeilen enden bei ~y 560–650, A-Stempel bei ~y 900–1000. Szene darunter bis max. y 1680
//       (3:4-Rasterausschnitt = y 240–1680). Unten links (Aufrufzähler) nichts Wichtiges.
//     - Objekte: Icons der Folge aus icons_hNN.tsx importieren (NUR importieren, Icon-Dateien nicht ändern) und mit <Bei x y rot>
//       platzieren; SVG-Bausteine (DuKopf, Kringel, Pfeil, Etikett, GeisterBall …) in <Leinwand>.
//     - C: riss {cx, cy, rx, ry, rot, seed} auf das Objekt legen; `innen` = dieselbe <Bei>-Platzierung mit glow + <GlowFrage>.
//       Hat das Icon kein glow, reicht <GlowFrage> allein.
//     - logo {el, x, y, rot, karte?}: karte:false für Logos mit eigener Fläche (Marke, Marke).
//  3. Rendern: cd remotion-composer && npx remotion still src/kanal/entry/cover-neu.tsx N<NN> /tmp/N<NN>.png --timeout=120000
//     (Composition N<NN> entsteht automatisch aus FOLGEN_NEU.)
//  4. Im Feed prüfen: 3:4-Ausschnitt y 240–1680 auf 280 px verkleinern und ansehen (Haupttext sofort lesbar? Rätsel klar? Keine Auflösung?).
//  5. Übernehmen: altes Cover einmalig als _thumbnail-alt.png/.jpg sichern, dann thumbnail.png = Render,
//     thumbnail.jpg per `sips -s format jpeg -s formatOptions 88 thumbnail.png --out thumbnail.jpg`.
// Nicht ändern: lib.tsx, icons*.tsx, deine Logo-Datei, Thumbs*.tsx, entry/thumbs.tsx.
import React from "react";
import { AbsoluteFill } from "remotion";
import { C, HEAD, MONO } from "../../basis/lib";
import { Kuechenmaschine } from "./icons";
import { Flasche, Note } from "./icons_h02";
import { Kleid } from "./icons_h03";
import { Dose } from "./icons_h04";
import { Prospekt, Hammer } from "./icons_h05";
import { Becher } from "./icons_h06";
import { Paket, RueckPfeil } from "./icons_h07";
import { Burger, Etikett as Etikett8 } from "./icons_h08";
import { HotDog } from "./icons_h09";
import { Plan } from "./icons_h10";
import { Roadster } from "./icons_h11";
import { GeisterBall, Gehirn } from "./icons_h31";
import { Smartphone, ZeigeHandAn, Wuerstchen } from "./icons_h26";
import { Verlobungsring } from "./icons_h14";

type Pt = { x: number; y: number };

// ===========================================================================
// Gemeinsame Bausteine
// ===========================================================================

/** Hintergrund: Papier mit Raster (wie der Kanal), optional Volltonfläche. */
export const Grund: React.FC<{ farbe?: string; raster?: boolean }> = ({ farbe = C.paper, raster = true }) => (
  <>
    <AbsoluteFill style={{ background: farbe }} />
    {raster && (
      <AbsoluteFill style={{ backgroundImage: `linear-gradient(rgba(40,34,30,0.08) 2px, transparent 2px), linear-gradient(90deg, rgba(40,34,30,0.08) 2px, transparent 2px)`, backgroundSize: "108px 108px" }} />
    )}
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0) 55%, rgba(0,0,0,0.10) 100%)" }} />
  </>
);

/** Kanal-Marke ganz oben, bewusst AUSSERHALB der 3:4-Rastermitte (frisst dort keinen Platz). */
export const Marke: React.FC<{ dunkel?: boolean }> = ({ dunkel }) => (
  <div style={{ position: "absolute", top: 96, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
    <div style={{ display: "flex", alignItems: "stretch", border: `5px solid ${C.ink}`, borderRadius: 12, overflow: "hidden", background: dunkel ? C.ink : C.paper2 }}>
      <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: 34, letterSpacing: 6, padding: "6px 18px", color: dunkel ? C.paper2 : C.ink }}>{THEME.kanal.name.toUpperCase()}</span>
      <span style={{ width: 26, background: C.red }} />
    </div>
  </div>
);

// Breiten (em) von Inter Tight 900, gemessen am Font (20.10.2026); textLength gleicht Kerning-Reste aus.
const BREITE: Record<string, number> = {
  A: 0.772, B: 0.645, C: 0.745, D: 0.708, E: 0.599, F: 0.56, G: 0.748, H: 0.726, I: 0.267, J: 0.564, K: 0.691, L: 0.547, M: 0.908, N: 0.699,
  O: 0.771, P: 0.633, Q: 0.773, R: 0.644, S: 0.643, T: 0.664, U: 0.698, V: 0.771, W: 1.066, X: 0.739, Y: 0.74, Z: 0.671, "Ä": 0.772, "Ö": 0.771, "Ü": 0.698,
  "0": 0.707, "1": 0.428, "2": 0.622, "3": 0.651, "4": 0.679, "5": 0.652, "6": 0.67, "7": 0.576, "8": 0.674, "9": 0.67,
  " ": 0.176, ".": 0.349, ",": 0.366, "!": 0.355, "?": 0.576, "„": 0.628, "“": 0.643, "'": 0.349, "%": 0.867, "-": 0.451, "€": 0.68, "$": 0.66,
};
const textBreite = (s: string) => [...s.toUpperCase()].reduce((a, ch) => a + (BREITE[ch] ?? 0.68), 0);

export type Zeile = { t: string; farbe?: string; max?: number; nach?: number /* Extra-Abstand nach der Zeile (z. B. Komma-Unterlänge) */ };
/**
 * Textblock als SVG: jede Zeile wird auf exakt dieselbe Breite gezogen (Poster-Blocksatz).
 * Kurze Zeilen werden dadurch riesig (bis `max`), lange kleiner. Tinten-Kontur + harter Schatten.
 */
/** Zeilen-Layout des Blocks: Schriftgröße + Grundlinie je Zeile und Unterkante (für Stempel/Szene darunter). */
export const blockLayout = (zeilen: Zeile[], top: number, w = 920, gap = 30, maxSize = 300) => {
  let y = top;
  const rows = zeilen.map((z) => {
    const voll = w / textBreite(z.t);
    const size = Math.min(z.max ?? maxSize, voll);
    const hat = /[ÄÖÜ]/.test(z.t) ? size * 0.2 : 0; // Platz für Umlautpunkte
    y += size * 0.73 + hat;
    // Nur volle Zeilen auf exakte Breite ziehen; gekappte Zeilen zentriert in natürlicher Breite (keine Verzerrung).
    const row = { ...z, size, base: y, gezogen: size >= voll - 0.5 };
    y += gap + (z.nach ?? 0);
    return row;
  });
  return { rows, unten: y - gap };
};

export const Block: React.FC<{ zeilen: Zeile[]; x?: number; top: number; w?: number; gap?: number; schatten?: number; kontur?: number; rot?: number; konturFarbe?: string; maxSize?: number }> = ({
  zeilen, x = 80, top, w = 920, gap = 30, schatten = 12, kontur = 0, rot = 0, konturFarbe = C.ink, maxSize = 300,
}) => {
  const { rows, unten } = blockLayout(zeilen, top, w, gap, maxSize);
  const y = unten + gap;
  const hoehe = y - top + 40;
  return (
    <svg width={1080} height={hoehe + 40} viewBox={`0 ${top - 20} 1080 ${hoehe + 40}`}
      style={{ position: "absolute", left: 0, top: top - 20, overflow: "visible", transform: `rotate(${rot}deg)`, transformOrigin: "540px 50%" }}>
      {rows.map((r, i) => (
        <g key={i} fontFamily={HEAD} fontWeight={900}>
          {schatten > 0 && (r.farbe ?? C.ink) !== C.ink && (
            <text x={(r.gezogen ? x : x + w / 2) + schatten} y={r.base + schatten} fontSize={r.size} {...(r.gezogen ? { textLength: w, lengthAdjust: "spacingAndGlyphs" } : { textAnchor: "middle" })} fill={C.ink}
              stroke={C.ink} strokeWidth={kontur * 2} strokeLinejoin="round">{r.t}</text>
          )}
          <text x={r.gezogen ? x : x + w / 2} y={r.base} fontSize={r.size} {...(r.gezogen ? { textLength: w, lengthAdjust: "spacingAndGlyphs" } : { textAnchor: "middle" })} fill={r.farbe ?? C.ink}
            stroke={kontur > 0 ? konturFarbe : "none"} strokeWidth={kontur * 2} strokeLinejoin="round" style={{ paintOrder: "stroke fill" } as React.CSSProperties}>{r.t}</text>
        </g>
      ))}
    </svg>
  );
};

/** Gefüllter Stempel (rot, weiße Schrift, Tintenrand + harter Schatten). Mitte = (x, y). */
export const Stempel: React.FC<{ text: string; x: number; y: number; size?: number; rot?: number; farbe?: string }> = ({ text, x, y, size = 150, rot = -7, farbe = C.red }) => (
  <div style={{
    position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) rotate(${rot}deg)`,
    fontFamily: HEAD, fontWeight: 900, fontSize: size, lineHeight: 1, letterSpacing: -2, color: "#fff", whiteSpace: "nowrap",
    background: farbe, border: `${Math.round(size * 0.07)}px solid ${C.ink}`, borderRadius: size * 0.12,
    padding: `${size * 0.08}px ${size * 0.22}px ${size * 0.13}px`, boxShadow: `${size * 0.09}px ${size * 0.09}px 0 ${C.ink}`,
  }}>{text}</div>
);

/** Dicker roter Pfeil (quadratische Kurve von → nach, Spitze am Ziel), mit Tintenrand. */
export const Pfeil: React.FC<{ von: Pt; nach: Pt; bogen?: number; dicke?: number }> = ({ von, nach, bogen = 0.25, dicke = 30 }) => {
  const mx = (von.x + nach.x) / 2, my = (von.y + nach.y) / 2;
  const dx = nach.x - von.x, dy = nach.y - von.y;
  const c = { x: mx - dy * bogen, y: my + dx * bogen };
  const tx = nach.x - c.x, ty = nach.y - c.y, tl = Math.hypot(tx, ty);
  const ux = tx / tl, uy = ty / tl;
  const kopf = dicke * 2.6;
  const ende = { x: nach.x - ux * kopf * 0.8, y: nach.y - uy * kopf * 0.8 };
  const l = { x: ende.x - uy * kopf * 0.75, y: ende.y + ux * kopf * 0.75 };
  const r = { x: ende.x + uy * kopf * 0.75, y: ende.y - ux * kopf * 0.75 };
  const d = `M${von.x} ${von.y} Q ${c.x} ${c.y} ${ende.x} ${ende.y}`;
  const spitze = `${nach.x},${nach.y} ${l.x},${l.y} ${r.x},${r.y}`;
  return (
    <g>
      <path d={d} stroke={C.ink} strokeWidth={dicke + 16} fill="none" strokeLinecap="round" />
      <polygon points={spitze} fill={C.ink} stroke={C.ink} strokeWidth={16} strokeLinejoin="round" />
      <path d={d} stroke={C.red} strokeWidth={dicke} fill="none" strokeLinecap="round" />
      <polygon points={spitze} fill={C.red} stroke={C.red} strokeWidth={2} strokeLinejoin="round" />
    </g>
  );
};

/** Handgezeichneter roter Kreis (läuft über den Anfang hinaus). */
export const Kringel: React.FC<{ x: number; y: number; rx: number; ry: number; rot?: number; dicke?: number }> = ({ x, y, rx, ry, rot = -8, dicke = 16 }) => {
  const pts: string[] = [];
  for (let i = 0; i <= 64; i++) {
    const a = -2.2 + (i / 64) * Math.PI * 2.18;
    const k = 1 + 0.06 * Math.sin(i * 0.7) + 0.05 * (i / 64);
    pts.push(`${(Math.cos(a) * rx * k).toFixed(1)} ${(Math.sin(a) * ry * k).toFixed(1)}`);
  }
  const d = `M${pts.join(" L ")}`;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      <path d={d} stroke={C.ink} strokeWidth={dicke + 10} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={0.9} />
      <path d={d} stroke={C.red} strokeWidth={dicke} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  );
};

export type Gefuehl = "schock" | "zweifel" | "staunen";
/**
 * Du-Figur: runder Strichfigur-Kopf (keine echte Person) mit starker Emotion.
 * blick = Pupillen-Richtung (−1..1). Mitte = (x, y), Radius r.
 */
export const DuKopf: React.FC<{ x: number; y: number; r: number; gefuehl?: Gefuehl; blick?: Pt; schweiss?: boolean; koerper?: boolean }> = ({
  x, y, r, gefuehl = "schock", blick = { x: 0, y: 0 }, schweiss = true, koerper = true,
}) => {
  const sw = r * 0.075;
  const augR = gefuehl === "zweifel" ? r * 0.2 : r * 0.25;
  const pupR = gefuehl === "schock" ? r * 0.065 : r * 0.1;
  const aug = [-1, 1].map((k) => ({ x: x + k * r * 0.36, y: y - r * 0.14 }));
  return (
    <g>
      {koerper && (
        <>
          <line x1={x} y1={y + r * 0.9} x2={x} y2={y + r * 2.6} stroke="#9aa0a8" strokeWidth={r * 0.42} strokeLinecap="round" />
          <line x1={x} y1={y + r * 0.9} x2={x} y2={y + r * 2.6} stroke={C.ink} strokeWidth={sw * 0.6} strokeLinecap="round" opacity={0.35} />
        </>
      )}
      {/* Schock-Striche */}
      {gefuehl !== "zweifel" && [-38, -62, -86].map((a, i) => {
        const rad = (a * Math.PI) / 180;
        const s = (k: number) => ({ x: x + Math.cos(rad) * r * k * (i === 1 ? 1.06 : 1), y: y + Math.sin(rad) * r * k });
        const p1 = s(1.18), p2 = s(1.5);
        const q1 = { x: 2 * x - p1.x, y: p1.y }, q2 = { x: 2 * x - p2.x, y: p2.y };
        return (
          <g key={i} stroke={C.ink} strokeWidth={sw} strokeLinecap="round">
            <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} />
            <line x1={q1.x} y1={q1.y} x2={q2.x} y2={q2.y} />
          </g>
        );
      })}
      <circle cx={x} cy={y} r={r} fill="#fff" stroke={C.ink} strokeWidth={sw} />
      {/* Augenbrauen */}
      {aug.map((a, i) => {
        const k = i === 0 ? -1 : 1;
        const hoch = gefuehl === "zweifel" ? (i === 0 ? r * 0.5 : r * 0.36) : r * 0.52;
        const neig = gefuehl === "zweifel" ? (i === 0 ? -r * 0.06 : r * 0.08) : -r * 0.06;
        return <path key={i} d={`M${a.x - k * r * 0.2} ${a.y - hoch + neig} Q ${a.x} ${a.y - hoch - r * 0.12} ${a.x + k * r * 0.2} ${a.y - hoch - neig}`} stroke={C.ink} strokeWidth={sw} fill="none" strokeLinecap="round" />;
      })}
      {aug.map((a, i) => (
        <g key={i}>
          <circle cx={a.x} cy={a.y} r={augR} fill="#fff" stroke={C.ink} strokeWidth={sw * 0.8} />
          <circle cx={a.x + blick.x * augR * 0.5} cy={a.y + blick.y * augR * 0.5} r={pupR} fill={C.ink} />
        </g>
      ))}
      {/* Mund */}
      {gefuehl === "schock" && (
        <g>
          <ellipse cx={x} cy={y + r * 0.47} rx={r * 0.2} ry={r * 0.27} fill={C.ink} />
          <ellipse cx={x} cy={y + r * 0.6} rx={r * 0.12} ry={r * 0.09} fill={C.red} />
        </g>
      )}
      {gefuehl === "staunen" && <ellipse cx={x} cy={y + r * 0.45} rx={r * 0.11} ry={r * 0.14} fill={C.ink} />}
      {gefuehl === "zweifel" && (
        <path d={`M${x - r * 0.28} ${y + r * 0.5} Q ${x - r * 0.14} ${y + r * 0.4} ${x} ${y + r * 0.5} T ${x + r * 0.28} ${y + r * 0.44}`} stroke={C.ink} strokeWidth={sw} fill="none" strokeLinecap="round" />
      )}
      {schweiss && (
        <path d={`M${x + r * 0.86} ${y - r * 0.62} q ${-r * 0.13} ${r * 0.22} 0 ${r * 0.3} q ${r * 0.13} ${-r * 0.08} 0 ${-r * 0.3} Z`} fill="#8fd0f0" stroke={C.ink} strokeWidth={sw * 0.6} strokeLinejoin="round" />
      )}
    </g>
  );
};

/** Preisschild/Etikett mit Schnur (zeigt nach links). Mitte = (x, y). */
export const Etikett: React.FC<{ x: number; y: number; w?: number; rot?: number; zeilen: string[]; schnur?: Pt }> = ({ x, y, w = 360, rot = -8, zeilen, schnur }) => {
  const h = w * 0.56;
  return (
    <g>
      {schnur && <path d={`M${schnur.x} ${schnur.y} Q ${(schnur.x + x - w * 0.42) / 2} ${Math.max(schnur.y, y) + 60} ${x - w * 0.42} ${y}`} stroke={C.ink} strokeWidth={7} fill="none" />}
      <g transform={`translate(${x} ${y}) rotate(${rot})`}>
        <path d={`M${-w / 2} 0 L ${-w / 2 + h * 0.4} ${-h / 2} L ${w / 2} ${-h / 2} L ${w / 2} ${h / 2} L ${-w / 2 + h * 0.4} ${h / 2} Z`} fill={C.paper2} stroke={C.ink} strokeWidth={10} strokeLinejoin="round" />
        <circle cx={-w / 2 + h * 0.3} cy={0} r={h * 0.09} fill={C.paper} stroke={C.ink} strokeWidth={7} />
        {zeilen.map((z, i) => (
          <text key={i} x={w * 0.08} y={zeilen.length === 1 ? h * 0.18 : (i === 0 ? -h * 0.02 : h * 0.3)} textAnchor="middle" fontFamily={HEAD} fontWeight={900}
            fontSize={zeilen.length === 1 ? h * 0.5 : i === 0 ? h * 0.48 : h * 0.24} fill={C.ink} letterSpacing={-1}>{z}</text>
        ))}
      </g>
    </g>
  );
};

export type Riss = { cx: number; cy: number; rx: number; ry: number; rot?: number; seed?: number };

/** Punkte eines unregelmäßigen Risses (deterministisch): grobe Beulen + feine Zähne, kein Stern. */
export const rissPunkte = ({ cx, cy, rx, ry, rot = 0, seed = 3 }: Riss, n = 58): Pt[] => {
  const rr = (rot * Math.PI) / 180;
  let s = seed * 7919 + 17;
  const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
  const out: Pt[] = [];
  for (let i = 0; i < n; i++) {
    const a = ((i + (rnd() - 0.5) * 0.6) / n) * Math.PI * 2;
    const beule = 1 + 0.16 * Math.sin(2 * a + seed) + 0.1 * Math.sin(3 * a + seed * 2.3);
    const zahn = i % 2 === 0 ? 1.025 + rnd() * 0.04 : 0.965 - rnd() * 0.035;
    const k = beule * zahn;
    const px = Math.cos(a) * rx * k, py = Math.sin(a) * ry * k;
    out.push({ x: cx + px * Math.cos(rr) - py * Math.sin(rr), y: cy + px * Math.sin(rr) + py * Math.cos(rr) });
  }
  return out;
};
export const rissPfad = (pts: Pt[]) => `M${pts.map((p) => `${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" L ")} Z`;

/**
 * Röntgen-Fenster: innen Navy + Leuchtraster + children (Glow-Objekt, „?“); am Rand weißer Papier-Rissrand,
 * nach innen gebogene Papierlappen und nach außen laufende Sprünge – damit es als Riss liest, nicht als Sticker.
 */
export const RissFenster: React.FC<{ riss: Riss; lappen?: number[]; spruenge?: number[]; children?: React.ReactNode }> = ({ riss, lappen = [5, 24, 42], spruenge = [14, 34, 50], children }) => {
  const pts = rissPunkte(riss);
  const d = rissPfad(pts);
  const n = pts.length;
  const lap = lappen.map((i) => {
    const a = pts[i % n], b = pts[(i + 4) % n], m = pts[(i + 2) % n];
    const t = { x: m.x + (riss.cx - m.x) * 0.38, y: m.y + (riss.cy - m.y) * 0.38 };
    return { a, b, t };
  });
  const spr = spruenge.map((i, k) => {
    const p = pts[i % n];
    const vx = p.x - riss.cx, vy = p.y - riss.cy, l = Math.hypot(vx, vy);
    const ux = vx / l, uy = vy / l, len = 70 + 30 * k;
    return `M${p.x} ${p.y} L ${p.x + ux * len * 0.5 - uy * 14} ${p.y + uy * len * 0.5 + ux * 14} L ${p.x + ux * len} ${p.y + uy * len}`;
  });
  return (
    <>
      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
        {spr.map((sd, i) => <path key={i} d={sd} stroke={C.ink} strokeWidth={9} fill="none" strokeLinecap="round" strokeLinejoin="round" />)}
      </svg>
      <AbsoluteFill style={{ clipPath: `path('${d}')` }}>
        <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 55%, ${C.navyIn} 0%, ${C.navyOut} 70%)` }} />
        <AbsoluteFill style={{ backgroundImage: "linear-gradient(rgba(143,216,255,0.13) 2px, transparent 2px), linear-gradient(90deg, rgba(143,216,255,0.13) 2px, transparent 2px)", backgroundSize: "54px 54px" }} />
        {children}
      </AbsoluteFill>
      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
        <path d={d} fill="none" stroke={C.ink} strokeWidth={30} strokeLinejoin="round" />
        <path d={d} fill="none" stroke="#fbf8f1" strokeWidth={17} strokeLinejoin="round" />
        {lap.map((l, i) => (
          <g key={i}>
            <polygon points={`${l.a.x},${l.a.y} ${l.t.x + 8},${l.t.y + 10} ${l.b.x},${l.b.y}`} fill="rgba(0,0,0,0.35)" />
            <polygon points={`${l.a.x},${l.a.y} ${l.t.x},${l.t.y} ${l.b.x},${l.b.y}`} fill="#f3eee4" stroke={C.ink} strokeWidth={7} strokeLinejoin="round" />
          </g>
        ))}
      </svg>
    </>
  );
};

/** Leuchtendes Röntgen-Fragezeichen. */
export const GlowFrage: React.FC<{ x: number; y: number; size?: number; rot?: number }> = ({ x, y, size = 360, rot = 8 }) => (
  <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) rotate(${rot}deg)`, fontFamily: HEAD, fontWeight: 900, fontSize: size, lineHeight: 1,
    color: "#e9f8ff", textShadow: "0 0 18px rgba(143,216,255,1), 0 0 50px rgba(143,216,255,0.8), 0 0 90px rgba(143,216,255,0.5)" }}>?</div>
);

/** Logo-Karte (weiße Karte, Tintenrand, harter Schatten) für Firmen-Folgen. */
export const LogoKarte: React.FC<{ x: number; y: number; rot?: number; children: React.ReactNode }> = ({ x, y, rot = -4, children }) => (
  <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) rotate(${rot}deg)`, background: "#fff", border: `7px solid ${C.ink}`, borderRadius: 16,
    padding: "14px 26px 4px", boxShadow: `12px 12px 0 ${C.ink}` }}>{children}</div>
);

const Leinwand: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>{children}</svg>
);

// ===========================================================================
// Datengetriebene Stile. Eine Folge = ein Datensatz in FOLGEN_NEU (Stil laut projects/kanal/cover_stile.json).
// ===========================================================================
export type LogoPos = { el: React.ReactNode; x: number; y: number; rot?: number; karte?: boolean };
/** A „Widerspruch“: glaube = Satz 1 als 2–4 Zeilen (Blocksatz), Stempel sitzt automatisch unter dem Text. */
export type FolgeA = { stil: "A"; glaube: Zeile[]; stempel?: string; stempelDy?: number; szene: React.ReactNode; logo?: LogoPos };
/** B „Reaktion“: frage = 2 Zeilen (Schlüsselwort rot), szene = Objekt + DuKopf + Kringel + Pfeil. */
export type FolgeB = { stil: "B"; frage: Zeile[]; maxSize?: number; szene: React.ReactNode; logo?: LogoPos };
/** C „Röntgen-Riss“: titel = 2–3 Zeilen, hinten = Objekt, riss = Fenster, innen = Glow-Fassung + GlowFrage, vorne = Dinge über dem Riss. */
export type FolgeC = {
  stil: "C"; titel: Zeile[]; maxSize?: number; hinten: React.ReactNode; riss: Riss; innen: React.ReactNode; vorne?: React.ReactNode;
  lappen?: number[]; spruenge?: number[]; logo?: LogoPos;
};
export type Folge = FolgeA | FolgeB | FolgeC;

const LogoDa: React.FC<{ logo?: LogoPos }> = ({ logo }) => {
  if (!logo) return null;
  if (logo.karte === false) {
    return <div style={{ position: "absolute", left: logo.x, top: logo.y, transform: `translate(-50%,-50%) rotate(${logo.rot ?? 0}deg)` }}>{logo.el}</div>;
  }
  return <LogoKarte x={logo.x} y={logo.y} rot={logo.rot ?? -4}>{logo.el}</LogoKarte>;
};

const TEXT_TOP = 290;

const RenderA: React.FC<{ f: FolgeA }> = ({ f }) => {
  const { unten } = blockLayout(f.glaube, TEXT_TOP, 900, 22, 190);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Grund farbe={C.yellow} />
      {f.szene}
      <LogoDa logo={f.logo} />
      <Block zeilen={f.glaube} top={TEXT_TOP} x={90} w={900} gap={22} schatten={0} maxSize={190} />
      <Stempel text={f.stempel ?? "DENKST DU."} x={560} y={unten + 115 + (f.stempelDy ?? 0)} size={140} rot={-7} />
      <Marke />
    </AbsoluteFill>
  );
};

const RenderB: React.FC<{ f: FolgeB }> = ({ f }) => (
  <AbsoluteFill style={{ overflow: "hidden" }}>
    <Grund />
    {f.szene}
    <LogoDa logo={f.logo} />
    <Block zeilen={f.frage} top={TEXT_TOP} x={80} w={920} gap={30} schatten={11} maxSize={f.maxSize ?? 300} />
    <Marke />
  </AbsoluteFill>
);

const RenderC: React.FC<{ f: FolgeC }> = ({ f }) => (
  <AbsoluteFill style={{ overflow: "hidden" }}>
    <Grund />
    {f.hinten}
    <RissFenster riss={f.riss} lappen={f.lappen} spruenge={f.spruenge}>{f.innen}</RissFenster>
    {f.vorne}
    <LogoDa logo={f.logo} />
    <Block zeilen={f.titel} top={TEXT_TOP} x={80} w={920} gap={30} schatten={11} maxSize={f.maxSize ?? 300} />
    <Marke />
  </AbsoluteFill>
);

export const Cover: React.FC<{ f: Folge }> = ({ f }) =>
  f.stil === "A" ? <RenderA f={f} /> : f.stil === "B" ? <RenderB f={f} /> : <RenderC f={f} />;

/** Objekt absolut platzieren (linke obere Ecke + Drehung). */
const Bei: React.FC<{ x: number; y: number; rot?: number; children: React.ReactNode }> = ({ x, y, rot = 0, children }) => (
  <div style={{ position: "absolute", left: x, top: y, transform: `rotate(${rot}deg)` }}>{children}</div>
);
const SvgFrage: React.FC<{ x: number; y: number; size?: number; rot?: number }> = ({ x, y, size = 200, rot = 10 }) => (
  <div style={{ position: "absolute", left: x, top: y, fontFamily: HEAD, fontWeight: 900, fontSize: size, lineHeight: 1, color: C.red, transform: `rotate(${rot}deg)`, WebkitTextStroke: `8px ${C.ink}`, paintOrder: "stroke fill" } as React.CSSProperties}>?</div>
);
const R = C.red, I = C.ink;

// ---------------------------------------------------------------------------
// Entwürfe vom 20.10. (#31, #26, #14 je in A/B/C) – bleiben als Vergleich: CA31 … CC14
// ---------------------------------------------------------------------------
export const ENTWUERFE: Record<string, Folge> = {
  CA31: { stil: "A", glaube: [{ t: "DER BALL" }, { t: "FLIEGT" }, { t: "HOCH." }], szene: (
    <>
      <Leinwand>
        <path d="M1000 1690 Q 960 1250 790 1120" stroke={R} strokeWidth={16} strokeDasharray="4 34" strokeLinecap="round" fill="none" />
        <GeisterBall x={760} y={1100} r={82} />
        <DuKopf x={330} y={1390} r={205} gefuehl="staunen" blick={{ x: 0.85, y: -0.6 }} />
      </Leinwand>
      <SvgFrage x={860} y={960} size={210} />
    </>
  ) },
  CA26: { stil: "A", glaube: [{ t: "DEIN HANDY" }, { t: "SPÜRT" }, { t: "DEN DRUCK." }], szene: (
    <>
      <Bei x={150} y={1110} rot={-8}><Smartphone size={280} /></Bei>
      <ZeigeHandAn x={400} y={1330} size={560} handschuh rot={-6} />
      <Leinwand>
        {[-1, 0, 1].map((k) => <line key={k} x1={350 + k * 40} y1={1250 - Math.abs(k) * 10} x2={330 + k * 70} y2={1200 - Math.abs(k) * 25} stroke={R} strokeWidth={14} strokeLinecap="round" />)}
      </Leinwand>
    </>
  ) },
  CB31: { stil: "B", frage: [{ t: "WO IST", farbe: I }, { t: "DER BALL?", farbe: R }], szene: (
    <Leinwand>
      <path d="M1010 1690 Q 960 1120 640 960" stroke={R} strokeWidth={14} strokeDasharray="4 32" strokeLinecap="round" fill="none" opacity={0.85} />
      <GeisterBall x={560} y={930} r={78} />
      <Kringel x={560} y={930} rx={150} ry={135} rot={-10} />
      <DuKopf x={300} y={1300} r={215} gefuehl="schock" blick={{ x: 0.7, y: -0.8 }} />
      <Pfeil von={{ x: 960, y: 760 }} nach={{ x: 730, y: 880 }} bogen={-0.25} dicke={30} />
    </Leinwand>
  ) },
  CB26: { stil: "B", frage: [{ t: "WARUM EIN", farbe: I }, { t: "WÜRSTCHEN?", farbe: R }], szene: (
    <>
      <Bei x={80} y={930} rot={-8}><Smartphone size={270} /></Bei>
      <Bei x={560} y={790} rot={-24}><Wuerstchen size={400} /></Bei>
      <Leinwand>
        <Kringel x={760} y={865} rx={265} ry={160} rot={-24} />
        <DuKopf x={800} y={1470} r={175} gefuehl="schock" blick={{ x: 0, y: -1 }} />
      </Leinwand>
      <ZeigeHandAn x={290} y={1190} size={520} handschuh rot={-2} />
      <Leinwand><Pfeil von={{ x: 1010, y: 1260 }} nach={{ x: 930, y: 1040 }} bogen={-0.25} dicke={28} /></Leinwand>
    </>
  ) },
  CC31: { stil: "C", titel: [{ t: "DEIN GEHIRN", farbe: I }, { t: "LÜGT.", farbe: R, max: 330 }],
    hinten: <Leinwand><DuKopf x={540} y={1250} r={330} gefuehl="schock" blick={{ x: 0.5, y: -1 }} schweiss={false} koerper={false} /></Leinwand>,
    riss: { cx: 540, cy: 1010, rx: 225, ry: 105, rot: -6, seed: 7 }, lappen: [8, 38], spruenge: [18, 48],
    innen: <><svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}><Gehirn x={540} y={1010} k={1.3} glow /></svg><GlowFrage x={600} y={1010} size={190} /></>,
    vorne: <Leinwand><GeisterBall x={880} y={830} r={60} /></Leinwand> },
  CC26: { stil: "C", titel: [{ t: "WAS SPÜRT", farbe: I }, { t: "DEIN HANDY?", farbe: R }],
    hinten: <Bei x={330} y={760} rot={-6}><Smartphone size={420} /></Bei>,
    riss: { cx: 545, cy: 1190, rx: 175, ry: 250, rot: -14, seed: 11 },
    innen: <><Bei x={330} y={760} rot={-6}><Smartphone size={420} glow /></Bei><GlowFrage x={545} y={1185} size={330} /></>,
    vorne: <ZeigeHandAn x={700} y={930} size={470} handschuh rot={-14} /> },
};

// ---------------------------------------------------------------------------
// Folgen (Stil laut cover_stile.json). Texte nur aus skript.txt, nie die Auflösung.
// ---------------------------------------------------------------------------
export const FOLGEN_NEU: Record<string, Folge> = {
  // #02 Wein-Musik · C · „Welchen Wein du kaufst, entscheidest du ganz allein. Denkst du.“ (Musik nur als Noten-Hinweis)
  "02": { stil: "C", titel: [{ t: "WER WÄHLT", farbe: I }, { t: "DEINEN WEIN?", farbe: R }],
    hinten: <><Bei x={330} y={650} rot={-6}><Flasche size={1000} /></Bei><Bei x={110} y={820} rot={-14}><Note size={170} /></Bei><Bei x={810} y={760} rot={12}><Note size={140} /></Bei></>,
    riss: { cx: 560, cy: 1260, rx: 150, ry: 230, rot: -8, seed: 4 }, lappen: [6, 26, 44], spruenge: [16, 36, 52],
    innen: <><Bei x={330} y={650} rot={-6}><Flasche size={1000} glow /></Bei><GlowFrage x={560} y={1255} size={290} /></> },

  // #03 39 vs. 34 Dollar · B · „Teurer und trotzdem gefragter“
  "03": { stil: "B", frage: [{ t: "TEURER UND", farbe: I }, { t: "GEFRAGTER?!", farbe: R }], szene: (
    <>
      <Bei x={40} y={690} rot={-4}><Kleid size={400} /></Bei>
      <Leinwand>
        <Etikett x={770} y={1300} w={300} rot={-6} zeilen={["34 $"]} />
        <Etikett x={760} y={930} w={390} rot={8} zeilen={["39 $"]} />
        <Kringel x={770} y={930} rx={250} ry={160} rot={8} />
        <Pfeil von={{ x: 1015, y: 640 }} nach={{ x: 930, y: 800 }} bogen={0.3} dicke={28} />
        <DuKopf x={300} y={1470} r={180} gefuehl="schock" blick={{ x: 1, y: -0.6 }} />
      </Leinwand>
    </>
  ) },

  "26": ENTWUERFE.CB26,
  "31": ENTWUERFE.CB31,
};

/** Composition-Komponente: id = "N01" (Folge) oder "CA31" (Entwurf). Nur Strings als Props (Remotion serialisiert sie). */
export const CoverNachId: React.FC<{ id: string }> = ({ id }) => {
  const f = id.startsWith("N") ? FOLGEN_NEU[id.slice(1)] : ENTWUERFE[id];
  if (!f) throw new Error(`Cover ${id} fehlt in FOLGEN_NEU/ENTWUERFE`);
  return <Cover f={f} />;
};
