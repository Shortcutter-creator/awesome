// Baustein „Like & Teilen“ (Kanal, ab #100s, 25.10.2026) für den Schluss, oben mittig über dem Hook-Bild.
// Like (~1,2 s): Herz zeichnet sich als Umriss → Finger tippt (Squash) → Herz füllt sich von unten wie Flüssigkeit →
//   Funkenring, Mini-Herzen, „+1“ steigt auf. Teilen (~1,8 s): Papierflieger angetippt → fliegt auf geschwungener Bahn
//   mit gestrichelter Spur in eine Chat-Karte (Kontakt + Empfänger-Text + Reel-Vorschau) → „Gesendet ✓“.
// Endzustand bleibt bis zum letzten Bild stehen.
// Einbau: <LikeTeilen likeAt={at("Like") + 0.05} teilenAt={at("jemandem") + 0.05} empfaenger="Kumpel, der immer dicht auffährt" vorschau={<MiniHook />} />
// Für den Bildruck der Szene: bildruck(t, [likeAt, teilenAt]) aus ./teile.
import React from "react";
import { useCurrentFrame } from "remotion";
import { C, FPS, HEAD, MONO } from "../../../basis/lib";
import { feder, Finger, Funken, glatt, mix, o1, papier, squash, Ton } from "./teile";

const ROT = "#e0483b", BLAU = "#3b82f6";
const HERZ = "M 0 34 C -60 -8 -52 -58 -20 -58 C -6 -58 0 -46 0 -40 C 0 -46 6 -58 20 -58 C 52 -58 60 -8 0 34 Z";
const LX = 420, SX = 660, BY = 400, R = 112; // Knöpfe (Mitte des Paars = x 540)

/** Punkt + Richtung auf einer kubischen Bézier-Kurve. */
const bez = (p: number[][], u: number) => {
  const m = 1 - u;
  const x = m ** 3 * p[0][0] + 3 * m * m * u * p[1][0] + 3 * m * u * u * p[2][0] + u ** 3 * p[3][0];
  const y = m ** 3 * p[0][1] + 3 * m * m * u * p[1][1] + 3 * m * u * u * p[2][1] + u ** 3 * p[3][1];
  const dx = 3 * m * m * (p[1][0] - p[0][0]) + 6 * m * u * (p[2][0] - p[1][0]) + 3 * u * u * (p[3][0] - p[2][0]);
  const dy = 3 * m * m * (p[1][1] - p[0][1]) + 6 * m * u * (p[2][1] - p[1][1]) + 3 * u * u * (p[3][1] - p[2][1]);
  return { x, y, w: (Math.atan2(dy, dx) * 180) / Math.PI };
};

const Flieger: React.FC<{ voll: number }> = ({ voll }) => (
  <g>
    <path d="M -52 4 L 52 -40 L 18 46 L 2 16 Z" fill={voll > 0.5 ? BLAU : "#fff"} stroke={C.ink} strokeWidth={6} strokeLinejoin="round" />
    <path d="M 2 16 L 52 -40 L -6 30 Z" fill={voll > 0.5 ? "#2563c9" : "#dcd6cb"} stroke={C.ink} strokeWidth={5} strokeLinejoin="round" />
  </g>
);

/** Standard-Vorschau, wenn keine eigene übergeben wird: Papier-Kachel mit Play-Dreieck (Koordinaten 64 × 110). */
const StandardVorschau: React.FC = () => (
  <g>
    <rect x={0} y={0} width={64} height={110} fill={C.paper} />
    <path d="M 24 40 L 46 55 L 24 70 Z" fill={C.ink} />
  </g>
);

export type LikeTeilenProps = { likeAt: number; teilenAt: number; empfaenger: string; vorschau?: React.ReactNode; ton?: boolean };

export const LikeTeilen: React.FC<LikeTeilenProps> = ({ likeAt, teilenAt, empfaenger, vorschau, ton = true }) => {
  const t = useCurrentFrame() / FPS;
  const start = likeAt - 0.85;
  if (t < start - 0.05) return <>{ton && <Ton at={likeAt} f="pop" v={0.36} />}{ton && <Ton at={teilenAt + 0.08} f="whoosh" v={0.22} />}{ton && <Ton at={teilenAt + 0.82} f="verbunden" v={0.26} />}</>;

  // --- Like ---
  const lIn = feder(t, start, 10, 190);
  const umriss = glatt(t, start + 0.15, likeAt - 0.12);
  const lDruck = squash(t, likeAt, 0.84);
  const pegel = glatt(t, likeAt + 0.03, likeAt + 0.42); // Füllstand 0..1
  const herzPuls = 1 + 0.12 * Math.sin(Math.PI * o1((t - likeAt - 0.38) / 0.3));
  const plusP = o1((t - likeAt - 0.12) / 0.9);
  // --- Teilen ---
  const sIn = feder(t, Math.max(likeAt + 0.25, teilenAt - 0.9), 10, 190);
  const sDruck = squash(t, teilenAt, 0.84);
  const flug = glatt(t, teilenAt + 0.08, teilenAt + 0.8); // 0..1 auf der Bahn
  const kIn = feder(t, teilenAt + 0.12, 11, 170);
  const an = teilenAt + 0.8; // Ankunft = gesendet
  const gesendet = feder(t, an, 9, 220);
  const kDruck = 1 + 0.05 * (t > an && t < an + 0.3 ? Math.sin(Math.PI * ((t - an) / 0.3)) : 0);
  // Chat-Karte
  const KX = 170, KY = 548, KW = 720, KH = 156;
  const tileX = KX + KW - 96, tileY = KY + 20;
  const bahn = [[SX, BY], [SX + 200, BY - 190], [tileX + 160, tileY - 170], [tileX + 32, tileY + 50]];
  const pf = bez(bahn, flug);
  const spur = flug > 0.01 ? Array.from({ length: 40 }, (_, k) => bez(bahn, (k / 39) * flug)).map((q) => `${q.x.toFixed(1)},${q.y.toFixed(1)}`).join(" ") : "";
  const welle = (a: number) => o1((t - a) / 0.5);

  return (
    <>
      {ton && <Ton at={likeAt} f="pop" v={0.36} />}
      {ton && <Ton at={teilenAt + 0.08} f="whoosh" v={0.22} />}
      {ton && <Ton at={an + 0.02} f="verbunden" v={0.26} />}
      {/* Szene oben leicht abdunkeln */}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(31,28,26,0.3) 0%, rgba(31,28,26,0.12) 38%, rgba(31,28,26,0) 62%)", opacity: o1(lIn) }} />
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", left: 0, top: 0 }}>
        <defs>
          <clipPath id="hgHerzClip"><path d={HERZ} /></clipPath>
        </defs>
        {/* Like-Knopf */}
        <g transform={`translate(${LX} ${BY}) scale(${(0.5 + 0.5 * lIn) * lDruck})`} opacity={o1(lIn * 2)}>
          <circle cx={7} cy={7} r={R} fill={C.ink} />
          <circle r={R} fill={C.paper2} stroke={C.ink} strokeWidth={6} />
          <g transform={`translate(0 12) scale(${1.45 * herzPuls})`}>
            <g clipPath="url(#hgHerzClip)">
              {/* steigende Flüssigkeit mit Wellenkante */}
              <path d={`M -70 40 L -70 ${mix(40, -66, pegel)} ${Array.from({ length: 15 }, (_, k) => { const x = -70 + k * 10; return `L ${x} ${mix(40, -66, pegel) + 4 * Math.sin(k * 0.9 + t * 14) * (1 - pegel * 0.8)}`; }).join(" ")} L 70 ${mix(40, -66, pegel)} L 70 40 Z`} fill={ROT} />
            </g>
            <path d={HERZ} fill="none" stroke={C.ink} strokeWidth={6} strokeLinejoin="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - umriss} />
          </g>
        </g>
        <Funken t={t} at={likeAt + 0.06} x={LX} y={BY + 4} r0={R + 8} r1={R + 62} n={8} farbe={ROT} />
        {[0, 1, 2, 3].map((k) => {
          const a = likeAt + 0.1 + k * 0.05, p = o1((t - a) / 0.75);
          if (p <= 0 || p >= 1) return null;
          const w = (-150 + k * 40) * (Math.PI / 180), d = 120 + 90 * (1 - (1 - p) ** 2);
          const s = 0.32 * feder(t, a, 8, 260) * (1 - glatt(t, a + 0.45, a + 0.75));
          return <path key={k} d={HERZ} fill={ROT} stroke={C.ink} strokeWidth={6} transform={`translate(${LX + Math.cos(w) * d} ${BY + Math.sin(w) * d - 40 * p}) scale(${s}) rotate(${(k - 1.5) * 14})`} />;
        })}
        {plusP > 0 && plusP < 1 && (
          <text x={LX + 92} y={BY - 92 - 70 * (1 - (1 - plusP) ** 2)} textAnchor="middle" fontFamily={HEAD} fontWeight={900} fontSize={54}
            fill={ROT} stroke={C.ink} strokeWidth={3} paintOrder="stroke" opacity={1 - glatt(t, likeAt + 0.7, likeAt + 1.02)}
            transform={`rotate(-8 ${LX + 92} ${BY - 120})`}>+1</text>
        )}
        {welle(likeAt) > 0 && welle(likeAt) < 1 && <circle cx={LX + 30} cy={BY + 40} r={30 + 70 * welle(likeAt)} fill="none" stroke={C.ink} strokeWidth={6 * (1 - welle(likeAt))} opacity={1 - welle(likeAt)} />}

        {/* Teilen-Knopf */}
        {sIn > 0.001 && (
          <g transform={`translate(${SX} ${BY}) scale(${(0.5 + 0.5 * sIn) * sDruck})`} opacity={o1(sIn * 2)}>
            <circle cx={7} cy={7} r={R} fill={C.ink} />
            <circle r={R} fill={C.paper2} stroke={C.ink} strokeWidth={6} />
            {flug <= 0 && <g transform="translate(10 2) rotate(-6) scale(1.15)"><Flieger voll={0} /></g>}
            {flug > 0 && <g opacity={0.25} transform="translate(10 2) rotate(-6) scale(1.15)"><path d="M -52 4 L 52 -40 L 18 46 L 2 16 Z" fill="none" stroke={C.ink} strokeWidth={5} strokeDasharray="10 10" /></g>}
          </g>
        )}
        {welle(teilenAt) > 0 && welle(teilenAt) < 1 && <circle cx={SX + 30} cy={BY + 40} r={30 + 70 * welle(teilenAt)} fill="none" stroke={C.ink} strokeWidth={6 * (1 - welle(teilenAt))} opacity={1 - welle(teilenAt)} />}

        {/* Chat-Karte */}
        {kIn > 0.001 && (
          <g transform={`translate(540 ${KY + KH / 2}) scale(${(0.7 + 0.3 * kIn) * kDruck}) translate(-540 ${-(KY + KH / 2) + (1 - kIn) * 60})`} opacity={o1(kIn * 2)}>
            <rect x={KX + 9} y={KY + 9} width={KW} height={KH} rx={30} fill={C.ink} />
            <rect x={KX} y={KY} width={KW} height={KH} rx={30} fill={C.paper2} stroke={C.ink} strokeWidth={5} />
            {/* Kontakt: neutraler Kopf */}
            <g transform={`translate(${KX + 72} ${KY + KH / 2})`}>
              <circle r={46} fill="#d9d3c8" stroke={C.ink} strokeWidth={4} />
              <clipPath id="hgKontakt"><circle r={44} /></clipPath>
              <g clipPath="url(#hgKontakt)">
                <circle cy={-10} r={17} fill={C.muted} />
                <path d="M -34 46 Q -34 12 0 12 Q 34 12 34 46 Z" fill={C.muted} />
              </g>
            </g>
            {/* Reel-Vorschau */}
            <g transform={`translate(${tileX} ${tileY})`}>
              <clipPath id="hgVorschau"><rect width={64} height={110} rx={10} /></clipPath>
              <g clipPath="url(#hgVorschau)">{vorschau ?? <StandardVorschau />}</g>
              <rect width={64} height={110} rx={10} fill="none" stroke={C.ink} strokeWidth={4} />
            </g>
          </g>
        )}
        {/* Flugspur + Flieger */}
        {flug > 0.01 && t < an + 0.5 && (
          <polyline points={spur} fill="none" stroke={C.ink} strokeWidth={5} strokeDasharray="14 12" strokeLinecap="round" opacity={0.75 * (1 - glatt(t, an, an + 0.5))} />
        )}
        {flug > 0 && t < an + 0.06 && (
          <g transform={`translate(${pf.x} ${pf.y}) rotate(${pf.w + 22}) scale(${mix(1.15, 0.5, flug)})`}><Flieger voll={1} /></g>
        )}
        {gesendet > 0.01 && (
          <g transform={`translate(${tileX + 32} ${tileY + 55})`}>
            <circle r={60 * o1((t - an) / 0.4)} fill="none" stroke={BLAU} strokeWidth={6 * (1 - o1((t - an) / 0.4))} opacity={1 - o1((t - an) / 0.4)} />
          </g>
        )}
        <Finger t={t} at={likeAt} x={LX + 30} y={BY + 40} />
        <Finger t={t} at={teilenAt} x={SX + 30} y={BY + 40} />
      </svg>
      {/* Texte der Chat-Karte (HTML, damit Umbruch und Schrift sauber sind) */}
      {kIn > 0.001 && (
        <div style={{ position: "absolute", left: KX + 140, top: KY, width: KW - 140 - 120, height: KH, display: "flex", flexDirection: "column", justifyContent: "center", gap: 6,
          opacity: o1(kIn * 2), transform: `translateY(${(1 - kIn) * 60 * (0.7 + 0.3 * kIn)}px) scale(${(0.7 + 0.3 * kIn) * kDruck})`, transformOrigin: `${540 - (KX + 140)}px ${KH / 2}px` }}>
          <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 34, lineHeight: 1.05, letterSpacing: -0.5, color: C.ink }}>{empfaenger}</div>
          <div style={{ position: "relative", height: 30 }}>
            <span style={{ position: "absolute", fontFamily: MONO, fontWeight: 700, fontSize: 25, letterSpacing: 2, color: C.muted, opacity: 1 - o1(gesendet * 2) }}>WIRD GESENDET …</span>
            <span style={{ position: "absolute", display: "flex", alignItems: "center", gap: 8, fontFamily: MONO, fontWeight: 700, fontSize: 25, letterSpacing: 2, color: C.green,
              opacity: o1(gesendet * 2), transform: `translateY(${(1 - o1(gesendet)) * 14}px)` }}>
              GESENDET
              <svg width={30} height={30} viewBox="0 0 34 34">
                <path d="M 5 18 L 13 26 L 29 8" fill="none" stroke={C.green} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round"
                  pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - glatt(t, an + 0.05, an + 0.35)} />
              </svg>
            </span>
          </div>
        </div>
      )}
    </>
  );
};
