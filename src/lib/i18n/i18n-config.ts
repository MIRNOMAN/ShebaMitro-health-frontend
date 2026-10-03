import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { translations, type Locale } from "./translations";

/**
 * Standard i18next configuration for ShebaMitro Health Frontend.
 * Supports Bangla (bn), English (en), and Hindi (hi).
 */
if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources: {
      en: { translation: translations.en },
      bn: { translation: translations.bn },
      hi: { translation: translations.hi },
    },
    lng: "bn", // Default language: Bangla
    fallbackLng: "en",
    interpolation: {
      escapeValue: false, // React already escapes values safely
    },
  });
}

export default i18n;
