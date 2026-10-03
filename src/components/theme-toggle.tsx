/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, Laptop } from "lucide-react";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-10 w-10 rounded-xl border border-surface-border bg-surface-card animate-pulse" />
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <div className="relative inline-flex items-center gap-1 p-1 rounded-2xl bg-surface-card/80 border border-surface-border backdrop-blur-md shadow-sm">
      {/* Icon rotation button */}
      <button
        onClick={() => setTheme(isDark ? "light" : "dark")}
        className="relative flex items-center justify-center w-9 h-9 rounded-xl text-muted-fg hover:text-fg-app hover:bg-muted-bg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-teal group"
        aria-label="Toggle theme"
        title={`Switch to ${isDark ? "light" : "dark"} mode`}
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

      {/* Quick switcher buttons */}
      <div className="hidden sm:flex items-center gap-0.5 border-l border-surface-border/60 pl-1">
        <button
          onClick={() => setTheme("light")}
          className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
            theme === "light"
              ? "bg-primary-teal/15 text-primary-teal font-semibold shadow-xs"
              : "text-muted-fg hover:text-fg-app hover:bg-muted-bg/50"
          }`}
        >
          <Sun className="w-3.5 h-3.5" />
          <span>Light</span>
        </button>
        <button
          onClick={() => setTheme("dark")}
          className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
            theme === "dark"
              ? "bg-primary-teal/15 text-primary-teal font-semibold shadow-xs"
              : "text-muted-fg hover:text-fg-app hover:bg-muted-bg/50"
          }`}
        >
          <Moon className="w-3.5 h-3.5" />
          <span>Dark</span>
        </button>
        <button
          onClick={() => setTheme("system")}
          className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
            theme === "system"
              ? "bg-primary-teal/15 text-primary-teal font-semibold shadow-xs"
              : "text-muted-fg hover:text-fg-app hover:bg-muted-bg/50"
          }`}
        >
          <Laptop className="w-3.5 h-3.5" />
          <span>Auto</span>
        </button>
      </div>
    </div>
  );
}
