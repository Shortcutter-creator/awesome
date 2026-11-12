import { Config } from "@remotion/cli/config";

// Gleiche Einstellungen auf Mac und Windows; werkzeug/render.py setzt Qualität und Lautheit.
Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
// Optional: eigener Browser (z. B. in Cloud-Umgebungen mit Proxy-Zertifikat). Ohne Variable bleibt alles wie gehabt.
if (process.env.REMOTION_BROWSER) Config.setBrowserExecutable(process.env.REMOTION_BROWSER);
