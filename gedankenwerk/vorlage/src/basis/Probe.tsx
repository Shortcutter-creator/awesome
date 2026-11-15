// Look-Test: zeigt alle Grundbausteine im aktuellen theme.json (werkzeug/probe.py).
import React from "react";
import { useCurrentFrame } from "remotion";
import { Bar, C, Captions, Card, Chip, EndCard, FPS, HEAD, Header, SourceCard, Stage, Stamp, TITEL_GEWICHT, makeChunks, type Word } from "./lib";

export const PROBE_DAUER = 5 * 30;

const satz = "So sieht dein Kanal aus: Farben, Schrift und Untertitel kommen aus theme.json.";
const WORTE: Word[] = satz.split(" ").map((w, i) => ({ w, s: 0.3 + i * 0.32, e: 0.3 + i * 0.32 + 0.28, z: 0 }));
const CHUNKS = makeChunks(WORTE);

export const Probe: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  return (
    <Stage>
      <Header t={t} a={0} thema="Look-Probe" />
      <SourceCard t={t} a={0.2} meta="Quelle · Jahr" text="Eine belegte Aussage steht hier." />
      <Card style={{ top: 560, left: 140, right: 140, padding: "34px 40px" }}>
        <div style={{ fontFamily: HEAD, fontWeight: TITEL_GEWICHT, fontSize: 76, lineHeight: 1.05, color: C.ink }}>Überschrift im Video</div>
        <div style={{ marginTop: 26, display: "flex", gap: 16 }}>
          <Chip text="Akzent" bg={C.accent} />
          <Chip text="richtig" bg={C.green} />
          <Chip text="falsch" bg={C.red} />
        </div>
        <div style={{ marginTop: 30 }}>
          <Bar t={t} a={0.6} b={1.6} wert={0.72} w={720} />
        </div>
      </Card>
      <Stamp t={t} a={1.8} text="POINTE" x={540} y={1060} />
      <Captions t={t} chunks={CHUNKS} />
      <EndCard t={t} a={3.6} top={1500} />
    </Stage>
  );
};
