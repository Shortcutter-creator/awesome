// Gemeinsame Teile der Kanal-Bausteine (LikeTeilen, FolgenKarte): Federn, Finger, Funken, Töne.
// Stil: Papier & Tinte, 2D, alles mit Federphysik (Überschwung), keine linearen Fades.
import React from "react";
import { spring } from "remotion";
import { C, FPS } from "../../../basis/lib";

export const o1 = (v: number) => Math.max(0, Math.min(1, v));
export const mix = (a: number, b: number, k: number) => a + (b - a) * k;

/** Feder ab Zeit a (Sekunden): 0 → 1 mit Überschwung. d = Dämpfung (klein = mehr Schwingen), s = Steifigkeit. */
export const feder = (t: number, a: number, d = 11, s = 190, m = 0.7) =>
  t < a ? 0 : spring({ frame: (t - a) * FPS, fps: FPS, config: { damping: d, stiffness: s, mass: m } });

/** Weiches Ein-/Ausgehen ohne Überschwung (für Strich-Zeichnen). */
export const glatt = (t: number, a: number, b: number) => {
  const k = o1((t - a) / (b - a));
  return k * k * (3 - 2 * k);
};

/** Squash beim Tippen: 1 → 0,85 in 60 ms, dann federnd zurück (mit Überschwung über 1). */
export const squash = (t: number, at: number, tief = 0.85) => {
  if (t < at) return 1;
  if (t < at + 0.06) return mix(1, tief, (t - at) / 0.06);
  return mix(tief, 1, feder(t, at + 0.06, 7, 260, 0.6));
};

/** Kurzer Bildruck für die Host-Szene: liefert einen Skalenfaktor (≈ 1,025 Spitze) um einen Tap herum. */
export const bildruck = (t: number, ats: number[], staerke = 0.025) =>
  1 + ats.reduce((m, a) => Math.max(m, t < a || t > a + 0.3 ? 0 : staerke * Math.sin(Math.PI * ((t - a) / 0.3))), 0);

/** Finger von oben gesehen, Spitze bei (0,0), zeigt nach oben links. Haut, Nagel, Tintenrand. */
const FingerForm: React.FC = () => (
  <g transform="rotate(-24)">
    {/* Hand */}
    <path d="M -26 118 Q -30 200 10 236 L 112 236 Q 136 196 128 150 Q 124 124 100 124 Q 92 104 70 108 Q 60 92 38 98 L 26 104 L 24 124 Z"
      fill="#f2c4a0" stroke={C.ink} strokeWidth={5} strokeLinejoin="round" />
    {/* Zeigefinger */}
    <path d="M -24 128 L -24 24 Q -24 -2 0 -2 Q 24 -2 24 24 L 24 128 Z" fill="#f2c4a0" stroke={C.ink} strokeWidth={5} strokeLinejoin="round" />
    <path d="M -12 30 Q -12 10 0 10 Q 12 10 12 30 L 12 36 Q 0 40 -12 36 Z" fill="#fbe3d2" stroke={C.ink} strokeWidth={3} />
    <path d="M -10 74 Q 0 78 10 74 M -8 82 Q 0 85 8 82" fill="none" stroke={C.ink} strokeWidth={3} strokeLinecap="round" opacity={0.55} />
    {/* Daumen-Andeutung */}
    <path d="M 100 124 Q 124 124 128 150" fill="none" stroke={C.ink} strokeWidth={4} strokeLinecap="round" opacity={0.4} />
  </g>
);

/**
 * Finger, der bei `at` auf (x, y) tippt: federt ab at−0,55 aus der Ecke unten rechts heran, schwebt kurz,
 * drückt bei `at` (Schatten wird klein), zieht sich ab at+0,35 wieder zurück.
 */
export const Finger: React.FC<{ t: number; at: number; x: number; y: number; s?: number }> = ({ t, at, x, y, s = 1 }) => {
  const rein = feder(t, at - 0.55, 13, 150);
  const raus = glatt(t, at + 0.22, at + 0.5);
  if (rein <= 0.001 || raus >= 0.999) return null;
  const weg = (1 - rein) + raus; // 0 = am Ziel
  const schweben = t < at ? 1 - glatt(t, at - 0.12, at) : glatt(t, at + 0.08, at + 0.25); // 1 = über dem Knopf, 0 = gedrückt
  const dx = 260 * weg + 10 * schweben, dy = 330 * weg + 16 * schweben;
  const sc = s * (0.94 + 0.06 * schweben);
  return (
    <g opacity={o1(2 - 2 * raus)}>
      <ellipse cx={x + 6 + dx * 0.6} cy={y + 10 + dy * 0.6} rx={22 + 10 * schweben} ry={12 + 5 * schweben} fill="rgba(31,28,26,0.22)" />
      <g transform={`translate(${x + dx} ${y + dy}) scale(${sc})`}>
        <FingerForm />
      </g>
    </g>
  );
};

/** Ring aus n Strichen, der vom Mittelpunkt wegfliegt (Funken). */
export const Funken: React.FC<{ t: number; at: number; x: number; y: number; r0?: number; r1?: number; n?: number; farbe?: string; dauer?: number }> = ({
  t, at, x, y, r0 = 70, r1 = 130, n = 8, farbe = C.ink, dauer = 0.45,
}) => {
  const k = o1((t - at) / dauer);
  if (k <= 0 || k >= 1) return null;
  const e = 1 - (1 - k) ** 3;
  return (
    <g>
      {Array.from({ length: n }, (_, i) => {
        const w = (i / n) * Math.PI * 2 - Math.PI / 2;
        const a = mix(r0, r1, e), b = mix(r0, r1, Math.min(1, e * 1.5)) + 10;
        return (
          <line key={i} x1={x + Math.cos(w) * a} y1={y + Math.sin(w) * a} x2={x + Math.cos(w) * b} y2={y + Math.sin(w) * b}
            stroke={farbe} strokeWidth={9 * (1 - k) + 2} strokeLinecap="round" />
        );
      })}
    </g>
  );
};

/** Gedankenwerk liefert keinen Ton: Ton ist ein No-op (Props bleiben, damit Aufrufe weiter passen). */
export const Ton: React.FC<{ at: number; f: string; v?: number; an?: boolean }> = () => null;

/** Papier-Karte mit Tintenrand und harter Schatten-Kante (wie Chips/SourceCard). */
export const papier = (radius = 36): React.CSSProperties => ({
  background: C.paper2, border: `5px solid ${C.ink}`, borderRadius: radius, boxShadow: `10px 10px 0 ${C.ink}`,
});
