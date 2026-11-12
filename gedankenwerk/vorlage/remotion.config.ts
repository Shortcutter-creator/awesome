import { Config } from "@remotion/cli/config";

// Gleiche Einstellungen auf Mac und Windows; werkzeug/render.py setzt Qualität und Lautheit.
Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
