"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, Laptop, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export type ThemeOption = "light" | "dark" | "system";

/**
 * ThemeToggle Component
 *
 * Compact Icon-Only Theme Button for the Navbar.
 * Displays only the Sun/Moon icon pill button in the header bar.
 * Clicking opens a sleek glassmorphic dropdown popover to select Light, Dark, or System mode.
 */
export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Close dropdown on outside click
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!mounted) {
    return (
      <div className="h-10 w-10 rounded-full border border-surface-border bg-surface-card animate-pulse" />
    );
  }

  const isDark = resolvedTheme === "dark";

  const options: { id: ThemeOption; label: string; icon: React.ReactNode }[] = [
    { id: "light", label: "Light", icon: <Sun className="w-4 h-4 text-amber-500" /> },
    { id: "dark", label: "Dark", icon: <Moon className="w-4 h-4 text-primary-teal" /> },
    { id: "system", label: "System Auto", icon: <Laptop className="w-4 h-4 text-violet-accent" /> },
  ];

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      {/* Icon Button matching User Screenshot 1 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex items-center justify-center px-3 py-2 rounded-full border border-surface-border/80 bg-surface-card/90 backdrop-blur-md shadow-xs hover:border-luminous hover:bg-surface-card-hover transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-teal group"
        aria-label="Toggle theme mode"
        title="Theme settings"
      >
        <div className="relative w-5 h-5 flex items-center justify-center">
          <Sun
            className={`w-5 h-5 text-amber-500 absolute transition-all duration-500 transform ${
              isDark
                ? "rotate-90 scale-0 opacity-0"
                : "rotate-0 scale-100 opacity-100 group-hover:rotate-45"
            }`}
          />
          <Moon
            className={`w-5 h-5 text-primary-teal absolute transition-all duration-500 transform ${
              isDark
                ? "rotate-0 scale-100 opacity-100 group-hover:-rotate-12"
                : "-rotate-90 scale-0 opacity-0"
            }`}
          />
        </div>
      </button>

      {/* Sleek Theme Selection Dropdown Popover */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.95 }}
            transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="absolute right-0 mt-2 w-44 rounded-2xl border border-surface-border bg-surface-card/95 p-1.5 backdrop-blur-2xl shadow-xl z-50 luminous-border"
          >
            <p className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-muted-fg border-b border-surface-border/50 mb-1">
              Select Theme
            </p>
            <div className="space-y-0.5">
              {options.map((opt) => {
                const isSelected = theme === opt.id;

                return (
                  <button
                    key={opt.id}
                    onClick={() => {
                      setTheme(opt.id);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      isSelected
                        ? "bg-primary-teal/15 text-primary-teal"
                        : "text-muted-fg hover:text-fg-app hover:bg-muted-bg/60"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      {opt.icon}
                      <span>{opt.label}</span>
                    </span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-primary-teal" />}
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
