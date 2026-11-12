import { THEME } from "../../../basis/theme";
// Baustein „Folgen-Karte“ (Kanal, ab #100s, 25.10.2026): Profilkarte federt oben mittig herein, Story-Ring zeichnet sich,
// Name/Handle gestaffelt, blauer „Folgen“-Knopf → Finger tippt (Squash, Bildruck) → Knopf morpht zu grauem „Gefolgt ✓“,
// Konfetti, „Follower +1“ rollt herein; auf `ende` federt die Karte nach oben raus. Szene läuft darunter weiter.
// Einbau: <FolgenKarte start={at("magst") - 0.1} tapAt={at("gerne") + 0.06} ende={at("Denn")} />  (Sekunden aus data/hNN.json)
// Für den Bildruck der Szene: bildruck(t, [tapAt]) aus ./teile in den Szenen-Scale multiplizieren.
import React from "react";
import { Img, staticFile, useCurrentFrame } from "remotion";
import { C, FPS, HEAD, MONO } from "../../../basis/lib";
import { feder, Finger, glatt, mix, o1, papier, squash, Ton } from "./teile";

const BLAU = "#3b82f6", GRAU = "#e6e1d8";
const hex = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const mixC = (a: string, b: string, k: number) => {
  const A = hex(a), B = hex(b);
  return `rgb(${A.map((v, i) => Math.round(v + (B[i] - v) * o1(k))).join(",")})`;
};
const rnd = (i: number) => {
  const s = Math.sin(i * 91.17 + 7.3) * 43758.5453;
  return s - Math.floor(s);
};
const KONFETTI = [C.yellow, C.red, BLAU, C.green, C.ink];

export type FolgenProps = { start: number; tapAt: number; ende: number; top?: number; bild?: string; ton?: boolean; kanalName?: string; kanalHandle?: string };

export const FolgenKarte: React.FC<FolgenProps> = ({ start, tapAt, ende, top = 262, bild, ton = true, kanalName = THEME.kanal.name, kanalHandle = THEME.kanal.handle }) => {
  const t = useCurrentFrame() / FPS;
  const rein = feder(t, start, 10, 170);
  const raus = feder(t, ende, 13, 190);
  const sichtbar = t >= start - 0.01 && t < ende + 0.45;
  const L = 210, W = 660, H = 300; // Karte, Mitte x 540
  const knopfY = top + 196 + 38; // Mitte des Knopfs
  // Knopf: Squash beim Tippen, Morph zu „Gefolgt“
  const morph = feder(t, tapAt + 0.05, 14, 220);
  const bw = mix(600, 430, morph);
  const druck = squash(t, tapAt);
  const kartenDruck = 1 - 0.03 * (t > tapAt && t < tapAt + 0.35 ? Math.sin(Math.PI * ((t - tapAt) / 0.35)) : 0);
  // Ring zeichnet sich, Texte gestaffelt
  const ring = glatt(t, start + 0.12, start + 0.75);
  const av = feder(t, start + 0.08, 9, 210);
  const name = feder(t, start + 0.22, 12, 200), handle = feder(t, start + 0.32, 12, 200), knopf = feder(t, start + 0.42, 9, 220);
  const plus = feder(t, tapAt + 0.25, 10, 200);
  const haken = glatt(t, tapAt + 0.18, tapAt + 0.45);
  const welle = o1((t - tapAt) / 0.5);
  const U = 2 * Math.PI * 80;
  return (
    <>
      {ton && <Ton at={start} f="whoosh" v={0.12} />}
      {ton && <Ton at={tapAt} f="pop" v={0.36} />}
      {ton && <Ton at={tapAt + 0.12} f="verbunden" v={0.2} />}
      {sichtbar && (
        <>
          {/* Szene darunter leicht abdunkeln (oben stärker) */}
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(31,28,26,0.32) 0%, rgba(31,28,26,0.12) 40%, rgba(31,28,26,0) 70%)",
            opacity: o1(rein) * (1 - glatt(t, ende, ende + 0.3)) }} />
          <div style={{ position: "absolute", left: L, top, width: W, height: H, ...papier(36), transformOrigin: "50% 0%",
            transform: `translateY(${(1 - rein) * -300 - raus * 420}px) rotate(${(1 - rein) * -5 + raus * 5}deg) scale(${(0.9 + 0.1 * Math.min(rein, 1.05)) * kartenDruck})`,
            opacity: o1(rein * 3) * (1 - glatt(t, ende + 0.1, ende + 0.3)) }}>
            {/* Avatar mit Story-Ring, der sich selbst zeichnet */}
            <svg width={180} height={180} viewBox="0 0 180 180" style={{ position: "absolute", left: 17, top: 15 }}>
              <defs>
                <linearGradient id="hgStoryRing" x1="0" y1="1" x2="1" y2="0">
                  <stop offset="0" stopColor="#f1c94a" />
                  <stop offset="0.45" stopColor="#f08a24" />
                  <stop offset="0.75" stopColor="#e0483b" />
                  <stop offset="1" stopColor="#b5368f" />
                </linearGradient>
              </defs>
              <circle cx={90} cy={90} r={80} fill="none" stroke="url(#hgStoryRing)" strokeWidth={9} strokeLinecap="round"
                strokeDasharray={`${U} ${U}`} strokeDashoffset={U * (1 - ring)} transform="rotate(-90 90 90)" />
            </svg>
            <div style={{ position: "absolute", left: 37, top: 35, width: 140, height: 140, borderRadius: "50%", overflow: "hidden", border: `5px solid ${C.paper2}`,
              transform: `scale(${0.4 + 0.6 * av})`, background: C.paper }}>
              {bild ? <Img src={staticFile(bild)} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <div style={{ width: "100%", height: "100%", background: C.accent }} />}
            </div>
            <div style={{ position: "absolute", left: 206, top: 46, fontFamily: HEAD, fontWeight: 900, fontSize: 60, letterSpacing: -2, color: C.ink,
              opacity: o1(name * 1.5), transform: `translateY(${(1 - name) * 26}px)` }}>{kanalName}</div>
            <div style={{ position: "absolute", left: 210, top: 124, fontFamily: MONO, fontWeight: 500, fontSize: 26, letterSpacing: 2, color: C.muted,
              opacity: o1(handle * 1.5), transform: `translateY(${(1 - handle) * 20}px)` }}>{kanalHandle}</div>
            {/* „Follower +1“ rollt nach dem Tippen herein */}
            {plus > 0.01 && (
              <div style={{ position: "absolute", left: 488, top: 118, height: 38, padding: "0 12px", borderRadius: 20, background: C.ink, display: "flex", alignItems: "center", gap: 8,
                transform: `scale(${0.6 + 0.4 * plus})`, opacity: o1(plus * 2), overflow: "hidden" }}>
                <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: 20, letterSpacing: 1.5, color: C.paper2 }}>FOLLOWER</span>
                <span style={{ display: "inline-block", height: 30, overflow: "hidden", fontFamily: HEAD, fontWeight: 900, fontSize: 26, color: C.yellow }}>
                  <span style={{ display: "block", transform: `translateY(${(1 - o1(plus)) * 30}px)` }}>+1</span>
                </span>
              </div>
            )}
            {/* Knopf */}
            <div style={{ position: "absolute", left: 27 + (600 - bw) / 2, top: 196, width: bw, height: 76, borderRadius: 20,
              background: mixC(BLAU, GRAU, morph), border: `3px solid ${mixC(BLAU, C.ink, morph)}`,
              transform: `scale(${(0.82 + 0.18 * knopf) * druck})`, opacity: o1(knopf * 2),
              display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
              <span style={{ position: "absolute", fontFamily: HEAD, fontWeight: 800, fontSize: 40, color: "#fff", opacity: 1 - o1(morph * 2), transform: `translateY(${-o1(morph) * 24}px)` }}>Folgen</span>
              <span style={{ position: "absolute", display: "flex", alignItems: "center", gap: 12, fontFamily: HEAD, fontWeight: 800, fontSize: 40, color: C.ink,
                opacity: o1(morph * 2 - 0.4), transform: `translateY(${(1 - o1(morph)) * 24}px)` }}>
                Gefolgt
                <svg width={34} height={34} viewBox="0 0 34 34">
                  <path d="M 5 18 L 13 26 L 29 8" fill="none" stroke={C.green} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round"
                    pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - haken} />
                </svg>
              </span>
            </div>
          </div>
          <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, pointerEvents: "none" }}>
            {/* Tipp-Welle und Konfetti am Knopf */}
            {welle > 0 && welle < 1 && <circle cx={540} cy={knopfY} r={30 + 120 * (1 - (1 - welle) ** 2)} fill="none" stroke={C.ink} strokeWidth={6 * (1 - welle)} opacity={1 - welle} />}
            {t > tapAt + 0.05 && t < tapAt + 1.1 && Array.from({ length: 22 }, (_, i) => {
              const dt = t - tapAt - 0.05;
              const w = -Math.PI / 2 + (rnd(i) - 0.5) * 2.6;
              const v = 560 + 420 * rnd(i + 30);
              const x = 540 + (rnd(i + 60) - 0.5) * 300 + Math.cos(w) * v * dt;
              const y = knopfY + Math.sin(w) * v * dt + 900 * dt * dt;
              const rot = (rnd(i + 90) - 0.5) * 900 * dt;
              return <rect key={i} x={-10} y={-5} width={20} height={10} rx={2.5} fill={KONFETTI[i % KONFETTI.length]}
                transform={`translate(${x} ${y}) rotate(${rot})`} opacity={1 - o1((dt - 0.6) / 0.45)} />;
            })}
            <Finger t={t} at={tapAt} x={560} y={knopfY + 6} />
          </svg>
        </>
      )}
    </>
  );
};
