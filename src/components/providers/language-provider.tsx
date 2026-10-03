/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import * as React from "react";
import i18n from "@/lib/i18n/i18n-config";
import { I18nextProvider } from "react-i18next";
import {
  translations,
  languages,
  type Locale,
  type LanguageOption,
} from "@/lib/i18n/translations";

export type TranslationKey = keyof typeof translations.en;

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  currentLanguage: LanguageOption;
  languages: LanguageOption[];
  t: (key: TranslationKey) => string;
}

const LanguageContext = React.createContext<LanguageContextType | null>(null);

const STORAGE_KEY = "shebamitro_locale";

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = React.useState<Locale>("bn"); // Default to Bangla

  React.useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as Locale | null;
    if (saved && (saved === "bn" || saved === "en" || saved === "hi")) {
      setLocaleState(saved);
      i18n.changeLanguage(saved);
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    i18n.changeLanguage(newLocale);
    localStorage.setItem(STORAGE_KEY, newLocale);
  };

  const defaultLang: LanguageOption = languages[0] ?? {
    code: "bn",
    label: "Bangla",
    nativeLabel: "বাংলা",
    flag: "🇧🇩",
  };

  const currentLanguage: LanguageOption =
    languages.find((l) => l.code === locale) ?? defaultLang;

  const t = (key: TranslationKey): string => {
    const dict = translations[locale] as Record<TranslationKey, string> | undefined;
    const fallbackDict = translations.en as Record<TranslationKey, string>;
    if (dict && key in dict) {
      return dict[key] || fallbackDict[key] || String(key);
    }
    return fallbackDict[key] || String(key);
  };

  return (
    <I18nextProvider i18n={i18n}>
      <LanguageContext.Provider
        value={{
          locale,
          setLocale,
          currentLanguage,
          languages,
          t,
        }}
      >
        {children}
      </LanguageContext.Provider>
    </I18nextProvider>
  );
}

export function useLanguage() {
  const context = React.useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
