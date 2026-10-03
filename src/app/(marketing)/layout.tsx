import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { HeartPulse, Sparkles } from "lucide-react";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-bg-app text-fg-app">
      {/* ── Navigation Header ───────────────────────────────── */}
      <header className="sticky top-0 z-50 w-full border-b border-surface-border bg-bg-app/80 backdrop-blur-xl transition-colors duration-300">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="flex items-center gap-2.5 text-lg font-bold tracking-tight hover:opacity-90 transition-all duration-300 group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary-teal via-emerald-accent to-violet-accent flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform duration-300 glow-teal">
              <HeartPulse className="w-5 h-5 animate-pulse" />
            </div>
            <span className="bg-gradient-to-r from-primary-teal via-emerald-accent to-violet-accent bg-clip-text text-transparent font-extrabold text-xl tracking-tight">
              ShebaMitro
            </span>
          </Link>

          <div className="flex items-center gap-4 sm:gap-6">
            <Link
              href="/"
              className="text-sm font-medium text-muted-fg hover:text-primary-teal transition-colors hidden sm:inline-block"
            >
              Theme System
            </Link>
            <Link
              href="/dashboard"
              className="text-sm font-medium text-muted-fg hover:text-emerald-accent transition-colors hidden sm:inline-block"
            >
              Dashboard
            </Link>

            {/* Theme Toggle Component */}
            <ThemeToggle />
          </div>
        </nav>
      </header>

      {/* ── Page Content ───────────────────────────────────── */}
      <main className="flex-1">{children}</main>

      {/* ── Footer ─────────────────────────────────────────── */}
      <footer className="border-t border-surface-border py-8 bg-surface-card/40 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-fg">
            <Sparkles className="w-4 h-4 text-primary-teal" />
            <span>Next.js 15 App Router &bull; TypeScript &bull; Tailwind CSS v4 &bull; next-themes</span>
          </div>
          <p className="text-sm text-muted-fg">
            &copy; {new Date().getFullYear()} ShebaMitro Health Frontend. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
