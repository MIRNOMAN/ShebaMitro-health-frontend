import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, HeartPulse, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: {
    default: "Authentication | ShebaMitro",
    template: "%s | ShebaMitro Health",
  },
  description: "Secure digital healthcare authentication portal for ShebaMitro.",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between bg-bg-app text-fg-app selection:bg-primary-teal selection:text-white">
      {/* Background Ambient Mesh & Lighting */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute -top-32 -left-32 w-[550px] h-[550px] bg-primary-teal/15 rounded-full blur-[140px]" />
        <div className="absolute top-1/2 -right-32 w-[550px] h-[550px] bg-violet-accent/10 rounded-full blur-[140px]" />
        <div className="absolute -bottom-32 left-1/3 w-[550px] h-[550px] bg-emerald-accent/15 rounded-full blur-[140px]" />
        <div className="absolute inset-0 bg-[radial-gradient(#14b8a6_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.07]" />
      </div>

      {/* Top Header */}
      <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between z-20">
        <Link
          href="/"
          className="flex items-center gap-3 group cursor-pointer"
        >
          <div className="h-11 w-11 rounded-2xl bg-gradient-to-tr from-primary-teal via-teal-500 to-emerald-accent flex items-center justify-center text-white shadow-xl shadow-primary-teal/20 group-hover:scale-105 transition-transform duration-300">
            <HeartPulse className="h-6 w-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-xl sm:text-2xl tracking-tight text-fg-app">
                Sheba<span className="bg-gradient-to-r from-primary-teal to-emerald-accent bg-clip-text text-transparent">Mitro</span>
              </span>
              <span className="px-2 py-0.5 rounded-full bg-primary-teal/15 text-primary-teal text-[10px] font-black uppercase tracking-wider">
                Pro
              </span>
            </div>
            <span className="block text-[11px] font-bold text-muted-fg uppercase tracking-wider">
              Smart Digital Healthcare Platform
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-surface-border bg-surface-card/70 backdrop-blur-md text-xs font-bold text-muted-fg shadow-xs">
            <ShieldCheck className="h-4 w-4 text-emerald-accent" />
            <span>HIPAA • DGDA • ISO Certified</span>
          </div>
          <Link
            href="/"
            className="px-4 py-2 rounded-xl text-xs font-bold text-muted-fg hover:text-fg-app border border-surface-border bg-surface-card/50 hover:bg-surface-card transition-all"
          >
            ← Back to Home
          </Link>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 flex-1 flex items-center justify-center z-10">
        {children}
      </main>

      {/* Footer */}
      <footer className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-fg border-t border-surface-border/60 z-20">
        <p className="flex items-center gap-1.5">
          <span>© {new Date().getFullYear()} ShebaMitro Health Ltd. Bangladesh.</span>
          <span className="hidden sm:inline">•</span>
          <span className="hidden sm:inline text-emerald-accent font-semibold flex items-center gap-1">
            <Sparkles className="h-3 w-3" /> 99.99% Cloud Telehealth Uptime
          </span>
        </p>
        <div className="flex items-center gap-4 font-medium">
          <Link href="/privacy" className="hover:text-primary-teal transition-colors">
            Privacy Policy
          </Link>
          <span>•</span>
          <Link href="/terms" className="hover:text-primary-teal transition-colors">
            Terms of Service
          </Link>
          <span>•</span>
          <Link href="/contact" className="hover:text-primary-teal transition-colors">
            24/7 Emergency SOS
          </Link>
        </div>
      </footer>
    </div>
  );
}
