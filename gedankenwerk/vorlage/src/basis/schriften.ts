// Mitgelieferte Schriften (Google Fonts, SIL Open Font License). Der Name in theme.json → schrift wählt eine davon.
// Neue Schrift: hier eine Zeile ergänzen (Import aus @remotion/google-fonts/<Name ohne Leerzeichen>).
import * as archivo from "@remotion/google-fonts/Archivo";
import * as bricolage from "@remotion/google-fonts/BricolageGrotesque";
import * as dmSerif from "@remotion/google-fonts/DMSerifDisplay";
import * as fraunces from "@remotion/google-fonts/Fraunces";
import * as ibmPlexMono from "@remotion/google-fonts/IBMPlexMono";
import * as inter from "@remotion/google-fonts/Inter";
import * as interTight from "@remotion/google-fonts/InterTight";
import * as jetbrainsMono from "@remotion/google-fonts/JetBrainsMono";
import * as lora from "@remotion/google-fonts/Lora";
import * as manrope from "@remotion/google-fonts/Manrope";
import * as montserrat from "@remotion/google-fonts/Montserrat";
import * as nunito from "@remotion/google-fonts/Nunito";
import * as poppins from "@remotion/google-fonts/Poppins";
import * as spaceGrotesk from "@remotion/google-fonts/SpaceGrotesk";

type Modul = {
  loadFont: (style: "normal", opts: { weights: string[]; subsets: string[]; ignoreTooManyRequestsWarning?: boolean }) => { fontFamily: string };
  getInfo: () => { fonts: Record<string, Record<string, unknown>>; subsets: string[] };
};

export const SCHRIFTEN: Record<string, Modul> = {
  "Archivo": archivo as unknown as Modul,
  "Bricolage Grotesque": bricolage as unknown as Modul,
  "DM Serif Display": dmSerif as unknown as Modul,
  "Fraunces": fraunces as unknown as Modul,
  "IBM Plex Mono": ibmPlexMono as unknown as Modul,
  "Inter": inter as unknown as Modul,
  "Inter Tight": interTight as unknown as Modul,
  "JetBrains Mono": jetbrainsMono as unknown as Modul,
  "Lora": lora as unknown as Modul,
  "Manrope": manrope as unknown as Modul,
  "Montserrat": montserrat as unknown as Modul,
  "Nunito": nunito as unknown as Modul,
  "Poppins": poppins as unknown as Modul,
  "Space Grotesk": spaceGrotesk as unknown as Modul,
};

const geladen: Record<string, string> = {};
// Nur diese Schnitte und Zeichensätze laden: genug für Deutsch, und der Render startet schnell.
const GEWICHTE = ["400", "500", "700", "800", "900"];
const ZEICHEN = ["latin", "latin-ext"];

/** Lädt eine Schrift einmal und gibt ihren CSS-Namen zurück; unbekannte Namen fallen auf Ersatz zurück. */
export const schrift = (name: string, ersatz = "Inter"): string => {
  const key = SCHRIFTEN[name] ? name : ersatz;
  if (!geladen[key]) {
    const m = SCHRIFTEN[key];
    const info = m.getInfo();
    const da = Object.keys(info.fonts.normal ?? {});
    const weights = GEWICHTE.filter((g) => da.includes(g));
    const subsets = ZEICHEN.filter((z) => info.subsets.includes(z));
    geladen[key] = m.loadFont("normal", { weights: weights.length ? weights : da.slice(0, 1), subsets, ignoreTooManyRequestsWarning: true }).fontFamily;
  }
  return geladen[key];
};
