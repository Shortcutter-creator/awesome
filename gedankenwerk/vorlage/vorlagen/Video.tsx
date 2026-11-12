// Video „__THEMA__“ – angelegt von werkzeug/neu.py. Diese Datei gehört nur zu diesem Video.
// Aufbau nach Regelbuch (8 Takte). Die Startfassung rendert sofort; ersetze jeden Block „HIER“ durch die echte Szene.
// Zeiten immer über Wortanker: at(WD, "Wort") oder at(WD, "das", { ab: 12 }) – nie feste Sekunden.
import React from "react";
import { Audio, staticFile, useCurrentFrame } from "remotion";
import {
  C, Captions, Card, Chip, EndCard, FPS, HEAD, Header, SourceCard, Stage, Stamp, Wechsel,
  at, endOf, ease, life, makeChunks, mech, pop, type Voice,
} from "../../basis/lib";
import daten from "./woerter.json";

const V = daten as unknown as Voice;
const WD = V.words;
const CHUNKS = makeChunks(WD);
/** Start der n-ten Skriptzeile (0 = erste). Hilft, solange noch keine Wortanker gesetzt sind. */
const Z = (n: number) => V.zeilen[Math.min(n, V.zeilen.length - 1)].s;
const LETZTE = V.zeilen.length - 1;

// Abspann: nach dem letzten Wort noch ~2 s stehen lassen
export const DAUER = Math.ceil((V.dauer + 2.0) * FPS);

export const Video: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  // Mechanik-Teil (Takt 4): HIER rein/raus auf die richtigen Wörter legen
  const x = mech(t, Z(3), Z(Math.min(5, LETZTE)));

  // Takt 1 · Hook: Hauptobjekt ab Bild 0 groß und in Bewegung. HIER durch die echte Szene ersetzen.
  const hook = pop(t, 0, 140, 14);
  const schweben = Math.sin(t * 1.6) * 14;

  return (
    <Stage x={x}>
      <Audio src={staticFile(V.audio)} />
      <Header t={t} a={Math.min(4, Z(1))} thema="__THEMA__" x={x} />

      {/* Takt 1 · Hook (0–3 s) */}
      <div style={{ position: "absolute", left: 540, top: 760 + schweben, transform: `translate(-50%,-50%) scale(${0.6 + 0.4 * hook})` }}>
        <div style={{ width: 420, height: 420, borderRadius: "50%", background: C.accent, border: `10px solid ${C.ink}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: HEAD, fontWeight: 900, fontSize: 260, color: C.paper2 }}>?</div>
      </div>

      {/* Takt 2 · Beleg: Quelle · Jahr + Aussage exakt wie in quellen.md */}
      <SourceCard t={t} a={Z(1)} b={Z(2)} meta="Quelle · Jahr" text="HIER die belegte Aussage" dark={x > 0.5} />

      {/* Takt 3 · Wende */}
      {t >= Z(2) && t < Z(3) ? (
        <Card style={{ top: 1080, left: 140, right: 140, padding: "26px 34px", opacity: life(t, Z(2), Z(3)) }}>
          <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 52, color: C.ink }}>HIER die Wende</div>
        </Card>
      ) : null}

      {/* Takt 4 · Mechanik: sichtbarer Wechsel (nur bei mechanik_wechsel.art = dunkel/rahmen) */}
      <Wechsel t={t} a={Z(3) - 0.1} />

      {/* Takt 5–6 · Übertrag + Regel */}
      {LETZTE >= 6 ? (
        <div style={{ position: "absolute", top: 1100, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: ease(t, Z(5), Z(5) + 0.4) * (t < Z(LETZTE - 1) ? 1 : 0) }}>
          <Chip text="HIER die Regel" size={40} bg={C.accent} />
        </div>
      ) : null}

      {/* Takt 7 · Pointe: Schlussbild = Hook-Bild, jetzt mit der Erkenntnis */}
      <Stamp t={t} a={Z(Math.max(0, LETZTE - 1))} text="POINTE" x={540} y={1120} size={88} />

      {/* Takt 8 · Abgang */}
      {/* Endkarte erst, wenn der letzte Untertitel weg ist (Untertitel bleibt bis Wortende + 0,35 s) – sonst stapeln sich beide */}
      <EndCard t={t} a={WD[WD.length - 1].e + 0.45} top={1480} />

      <Captions t={t} chunks={CHUNKS} dark={x > 0.5} />
    </Stage>
  );
};

// at und endOf werden beim Ersetzen der Platzhalter gebraucht.
void at;
void endOf;
