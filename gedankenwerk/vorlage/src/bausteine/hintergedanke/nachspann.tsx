// Nachspann für YouTube: jede Folge über 1 Minute (der Kanalinhaber, 19.10.2026: „YouTube zahlt erst ab 1 Minute“).
// Nach „Folg …“ bleibt die Endkarte stehen; darunter baut sich die Kommentar-Frage der Folge Wort für Wort auf,
// danach der Kommentar-Hinweis und eine Antwort-Blase, in der jemand tippt. Kein neuer Sprechtext.
// Einsatz in HNN.tsx:  const ENDE = endeLang(V.dauer);  …  <Nachspann t={t} a={A.folg + 2.4} frage="…?" />
import React from "react";
import { useVideoConfig } from "remotion";
import { C, Chip, ease, HEAD, MONO, pop } from "../../basis/lib";

export const ZIEL_SEK = 61.5;
export const NACHSPANN_SEK = 7.0;
/** Folgenlänge: Sprechtext + 2,1 s Endkarte. Reicht das nicht über 61,5 s, kommt ein vollständiger Nachspann
 *  (mind. 7 s) dazu – nie ein angeschnittener (19.10.: nach dem langsameren Tempo blitzte sonst eine leere Karte auf). */
export const endeLang = (dauer: number) => {
  const normal = dauer + 2.1;
  return normal >= ZIEL_SEK ? normal : Math.max(ZIEL_SEK, normal + NACHSPANN_SEK);
};

const WORT_TAKT = 0.32;

// top: Standard 640 = zwischen geschrumpfter Pointe und Endkarte. Unten (ab ~1450) und rechts liegt bei YouTube Shorts die Bedienleiste.
export const Nachspann: React.FC<{ t: number; a: number; frage: string; top?: number }> = ({ t, a, frage, top = 640 }) => {
  const { durationInFrames, fps } = useVideoConfig();
  if (durationInFrames / fps - a < NACHSPANN_SEK - 2.5) return null; // Folge lang genug → kein Nachspann
  if (t < a - 0.35) return null;
  const woerter = frage.split(/\s+/);
  const fertig = a + 0.5 + woerter.length * WORT_TAKT;
  const karte = pop(t, a, 200, 14);
  const hinweis = pop(t, fertig + 0.3, 220, 13);
  const blase = pop(t, fertig + 1.4, 220, 13);
  // Bühne freiräumen: die Pointe blendet unter einer Papierfläche aus (gleiches Raster + Licht wie Stage, über das
  // ganze Bild gelegt und auf den Streifen zwischen Kopfzeile und Endkarte zugeschnitten → keine sichtbare Kante).
  const frei = ease(t, a - 0.35, a + 0.15);
  return (
    <>
    <div
      style={{
        position: "absolute", inset: 0, opacity: frei, clipPath: "inset(250px 0 925px 0)",
        backgroundColor: C.paper,
        backgroundImage: `radial-gradient(ellipse at 50% 42%, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0) 60%, rgba(0,0,0,0.07) 100%), linear-gradient(${C.grid} 2px, transparent 2px), linear-gradient(90deg, ${C.grid} 2px, transparent 2px)`,
        backgroundSize: "100% 100%, 108px 108px, 108px 108px",
        backgroundPosition: "0 0, -1px -1px, -1px -1px",
      }}
    />
    <div style={{ position: "absolute", left: 90, right: 90, top, display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div
        style={{
          width: "100%", background: C.paper2, border: `5px solid ${C.ink}`, borderRadius: 26, boxShadow: `8px 8px 0 ${C.ink}`,
          padding: "26px 34px 30px", opacity: Math.min(1, karte), transform: `translateY(${(1 - karte) * 60}px)`,
        }}
      >
        <div style={{ fontFamily: MONO, fontSize: 28, letterSpacing: 5, color: C.red, fontWeight: 700 }}>UND DU?</div>
        <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 52, lineHeight: 1.12, letterSpacing: -1, color: C.ink, marginTop: 10 }}>
          {woerter.map((w, i) => {
            const p = ease(t, a + 0.5 + i * WORT_TAKT, a + 0.5 + i * WORT_TAKT + 0.25);
            return (
              <span key={i} style={{ display: "inline-block", marginRight: 14, opacity: p, transform: `translateY(${(1 - p) * 14}px)` }}>{w}</span>
            );
          })}
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 22, marginTop: 24, width: "100%" }}>
        <div style={{ opacity: Math.min(1, hinweis), transform: `scale(${0.8 + 0.2 * Math.min(1, hinweis)})`, transformOrigin: "left" }}>
          <Chip text="Schreib’s in die Kommentare ↓" bg={C.yellow} fg={C.ink} border={C.ink} size={30} />
        </div>
        <Tippt t={t} a={fertig + 1.4} p={blase} />
      </div>
    </div>
    </>
  );
};

/** Antwort-Blase mit drei Punkten, die nacheinander erscheinen: „jemand schreibt gerade“. */
const Tippt: React.FC<{ t: number; a: number; p: number }> = ({ t, a, p }) => {
  const takt = t > a ? ((t - a) / 0.45) % 4 : 0; // 0–3 Punkte, dann von vorn
  return (
    <div
      style={{
        background: C.ink, borderRadius: 30, padding: "18px 26px", display: "flex", gap: 12,
        opacity: Math.min(1, p), transform: `scale(${Math.min(1, p)})`, transformOrigin: "left",
      }}
    >
      {[0, 1, 2].map((i) => (
        <div key={i} style={{ width: 16, height: 16, borderRadius: 8, background: "#fff", opacity: takt >= i + 1 ? 1 : 0.25 }} />
      ))}
    </div>
  );
};
