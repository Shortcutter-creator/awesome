// Cover für „__THEMA__“ (werkzeug/cover.py rendert es). Stil aus theme.json → cover.stil: frage | vergleich | nah.
// Höchstens 3 Wörter Schlagzeile, Hauptobjekt groß, nur was die Quellen tragen, Pointe nicht verraten.
import React from "react";
import { CoverFrage, CoverNah, CoverVergleich } from "../../basis/Cover";
import { C, HEAD, THEME } from "../../basis/lib";

const Objekt: React.FC = () => (
  // HIER das Hauptobjekt des Videos (gleiche Zeichnung wie im Hook)
  <div style={{ width: 520, height: 520, borderRadius: "50%", background: C.accent, border: `12px solid ${C.ink}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: HEAD, fontWeight: 900, fontSize: 320, color: C.paper2 }}>?</div>
);

export const Cover: React.FC = () => {
  const stil = THEME.cover.stil;
  if (stil === "vergleich") {
    return <CoverVergleich frage={["HIER DIE", "FRAGE?"]} links={{ label: "Variante A", wert: "23", gut: true }} rechts={{ label: "Variante B", wert: "19", gut: false }} />;
  }
  if (stil === "nah") return <CoverNah text="HIER?" objekt={<div style={{ transform: "scale(2.2)" }}><Objekt /></div>} />;
  return <CoverFrage zeilen={["HIER DIE", "FRAGE?"]} objekt={<Objekt />} />;
};
