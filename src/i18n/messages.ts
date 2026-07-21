// Bilingual FR/EN dictionary. Keys are stable ids; the UI reads them through the
// LocaleProvider's t() helper. This is the scaffold set — the UI layer extends
// it with every label it needs. Both locales MUST expose the same keys.

import type { Locale } from "../core/types";

export type { Locale } from "../core/types";

export const MESSAGES = {
  fr: {
    appTitle: "Générateur de signatures email",
    tagline: "Créez une signature HTML professionnelle. Tout reste dans votre navigateur.",
    privacyNote: "Aucun envoi serveur. Vos données ne quittent jamais votre appareil.",
  },
  en: {
    appTitle: "Email signature generator",
    tagline: "Build a professional HTML signature. Everything stays in your browser.",
    privacyNote: "No server upload. Your data never leaves your device.",
  },
} satisfies Record<Locale, Record<string, string>>;

export type MessageKey = keyof (typeof MESSAGES)["fr"];
