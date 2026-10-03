"use client";

import * as React from "react";
import { Globe, Check, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/components/providers/language-provider";
import type { Locale } from "@/lib/i18n/translations";

/**
 * LanguageToggle Component
 *
 * Compact language selector dropdown component for the Navbar:
 * Displays current flag + language code in header, and opens popover menu to switch
 * between Bangla (🇧🇩), English (🇺🇸), and Hindi (🇮🇳).
 */
export function LanguageToggle() {
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

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      {/* Navbar Pill Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex items-center gap-1.5 px-3 py-2 rounded-full border border-surface-border/80 bg-surface-card/90 backdrop-blur-md shadow-xs hover:border-luminous hover:bg-surface-card-hover transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-teal group text-xs font-bold text-fg-app"
        aria-label="Select language"
        title={t("selectLanguage")}
      >
        <span className="text-sm">{currentLanguage.flag}</span>
        <span className="uppercase tracking-wider">{currentLanguage.code}</span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-muted-fg transition-transform duration-300 ${
            isOpen ? "rotate-180 text-primary-teal" : "group-hover:text-fg-app"
          }`}
        />
      </button>

      {/* Glassmorphic Dropdown Popover */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.95 }}
            transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="absolute right-0 mt-2.5 w-44 rounded-2xl border border-surface-border bg-surface-card p-1.5 shadow-2xl z-50 luminous-border"
            style={{ backgroundColor: "var(--card)" }}
          >
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 text-[10px] font-black uppercase tracking-wider text-muted-fg border-b border-surface-border/60 mb-1">
              <Globe className="w-3.5 h-3.5 text-primary-teal" />
              <span>{t("selectLanguage")}</span>
            </div>

            <div className="space-y-0.5">
              {languages.map((lang) => {
                const isSelected = locale === lang.code;

                return (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLocale(lang.code as Locale);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                      isSelected
                        ? "bg-primary-teal/15 text-primary-teal"
                        : "text-fg-app hover:bg-muted-bg/80"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-base">{lang.flag}</span>
                      <span>{lang.nativeLabel}</span>
                    </span>
                    {isSelected && <Check className="w-4 h-4 text-primary-teal" />}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
