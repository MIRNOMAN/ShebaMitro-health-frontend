"use client";

import * as React from "react";
import { Globe, Check, ChevronDown, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/components/providers/language-provider";
import type { Locale } from "@/lib/i18n/translations";

/**
 * Animated LanguageSwitcher Component
 *
 * Persists locale preference in cookies (`NEXT_LOCALE` & `shebamitro_locale`) and localStorage.
 * Operates across public views app/(public) and dashboard views app/(dashboard).
 */
export function LanguageSwitcher() {
  const { locale, setLocale, currentLanguage, languages, t } = useLanguage();
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectLanguage = (newLocale: Locale) => {
    setLocale(newLocale);

    // Persist locale preference in cookies for next-intl & middleware
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
    document.cookie = `shebamitro_locale=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;

    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Animated Navbar Pill Trigger */}
      <motion.button
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex items-center gap-2 px-3.5 py-2 rounded-full border border-surface-border/80 bg-surface-card/90 backdrop-blur-md shadow-xs hover:border-primary-teal hover:bg-surface-card-hover transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-teal group text-xs font-black text-fg-app"
        aria-label="Select global language"
        title={t("selectLanguage")}
      >
        <span className="text-sm">{currentLanguage.flag}</span>
        <span className="uppercase tracking-wider font-extrabold">{currentLanguage.code}</span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-muted-fg transition-transform duration-300 ${
            isOpen ? "rotate-180 text-primary-teal" : "group-hover:text-fg-app"
          }`}
        />
      </motion.button>

      {/* Glassmorphic Animated Dropdown Popover */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.94 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="absolute right-0 mt-2.5 w-48 rounded-2xl border border-surface-border bg-surface-card p-2 shadow-2xl z-50 overflow-hidden"
            style={{ backgroundColor: "var(--card)" }}
          >
            <div className="flex items-center justify-between px-2.5 py-1.5 text-[10px] font-black uppercase tracking-wider text-muted-fg border-b border-surface-border/60 mb-1">
              <span className="flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-primary-teal" />
                <span>{t("selectLanguage")}</span>
              </span>
              <Sparkles className="w-3 h-3 text-emerald-400 animate-pulse" />
            </div>

            <div className="space-y-1">
              {languages.map((lang) => {
                const isSelected = locale === lang.code;

                return (
                  <motion.button
                    key={lang.code}
                    whileHover={{ x: 3 }}
                    onClick={() => handleSelectLanguage(lang.code as Locale)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-extrabold transition-all ${
                      isSelected
                        ? "bg-primary-teal/15 text-primary-teal border border-primary-teal/30"
                        : "text-fg-app hover:bg-muted-bg/80 border border-transparent"
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <span className="text-base">{lang.flag}</span>
                      <span>{lang.nativeLabel}</span>
                    </span>
                    {isSelected && <Check className="w-4 h-4 text-primary-teal" />}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Alias export for backward compatibility
export const LanguageToggle = LanguageSwitcher;
