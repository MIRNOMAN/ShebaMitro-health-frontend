"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  HeartPulse,
  ChevronLeft,
  ChevronRight,
  Bell,
  User,
  LogOut,
  Settings,
  ShieldCheck,
  Check,
  ChevronDown,
  LayoutDashboard,
  Calendar,
  Clock,
  FileText,
  FlaskConical,
  Activity,
  Users,
  Video,
  PenTool,
  TrendingUp,
  Truck,
  Package,
  Pill,
  Menu,
  X,
  Sparkles,
} from "lucide-react";
import { LanguageToggle } from "@/components/language-toggle";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";

type UserRole = "patient" | "doctor" | "lab" | "pharmacy";

interface NavLinkItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
}

// Role-tailored navigation items
const ROLE_NAV_LINKS: Record<UserRole, NavLinkItem[]> = {
  patient: [
    { label: "Overview", href: "/dashboard/patient", icon: LayoutDashboard },
    { label: "Appointments", href: "/dashboard/patient/appointments", icon: Calendar, badge: "2 Upcoming" },
    { label: "Medicine Alarms", href: "/dashboard/patient/medicine-alarms", icon: Clock, badge: "Active" },
    { label: "Diagnostic Reports", href: "/dashboard/patient/diagnostic-reports", icon: FlaskConical },
    { label: "Digital Prescriptions", href: "/dashboard/patient/prescriptions", icon: FileText },
    { label: "Health Metrics", href: "/dashboard/patient/health-metrics", icon: Activity },
  ],
  doctor: [
    { label: "Overview", href: "/dashboard/doctor", icon: LayoutDashboard },
    { label: "Patient Queue", href: "/dashboard/doctor/patient-queue", icon: Users, badge: "8 Waiting" },
    { label: "Today's Appointments", href: "/dashboard/doctor/appointments", icon: Calendar },
    { label: "Teleconsultation", href: "/dashboard/doctor/teleconsultation", icon: Video, badge: "Live" },
    { label: "Digital Rx Writer", href: "/dashboard/doctor/rx-writer", icon: PenTool },
    { label: "Analytics & Earnings", href: "/dashboard/doctor/analytics", icon: TrendingUp },
    { label: "Availability Schedule", href: "/dashboard/doctor/schedule", icon: Clock },
  ],
  lab: [
    { label: "Overview", href: "/dashboard/lab", icon: LayoutDashboard },
    { label: "Sample Pickups", href: "/dashboard/lab/sample-pickups", icon: Truck, badge: "12 Home" },
    { label: "Test Requests", href: "/dashboard/lab/test-requests", icon: FlaskConical },
    { label: "Upload Reports", href: "/dashboard/lab/upload-reports", icon: FileText },
    { label: "Lab Branch Status", href: "/dashboard/lab/branches", icon: Activity },
    { label: "Financial Reports", href: "/dashboard/lab/financials", icon: TrendingUp },
  ],
  pharmacy: [
    { label: "Overview", href: "/dashboard/pharmacy", icon: LayoutDashboard },
    { label: "Order Dispatch Queue", href: "/dashboard/pharmacy/dispatch-queue", icon: Package, badge: "5 New" },
    { label: "Express Delivery Riders", href: "/dashboard/pharmacy/express-riders", icon: Truck, badge: "⚡ 2-Hour" },
    { label: "Inventory Stock", href: "/dashboard/pharmacy/inventory", icon: Pill },
    { label: "Prescription Verification", href: "/dashboard/pharmacy/verifications", icon: ShieldCheck },
    { label: "Sales Analytics", href: "/dashboard/pharmacy/analytics", icon: TrendingUp },
  ],
};

const WORKSPACE_OPTIONS: { role: UserRole; name: string; subtitle: string; icon: React.ElementType }[] = [
  { role: "patient", name: "Patient Workspace", subtitle: "Personal Health & Records", icon: User },
  { role: "doctor", name: "Doctor Clinic Workspace", subtitle: "Chamber & Teleconsultation", icon: Users },
  { role: "lab", name: "Lab Admin Workspace", subtitle: "Diagnostic Sample Hub", icon: FlaskConical },
  { role: "pharmacy", name: "Pharmacy Hub Workspace", subtitle: "Order Dispatch & Express Rider", icon: Pill },
];

const NOTIFICATIONS = [
  {
    id: 1,
    title: "Doctor Appointment Reminder",
    desc: "Prof. Dr. Mahmudul Hasan at 05:30 PM today.",
    time: "10m ago",
    unread: true,
  },
  {
    id: 2,
    title: "Lab Report Ready",
    desc: "Executive Full Body Checkup PDF is ready to download.",
    time: "1h ago",
    unread: true,
  },
  {
    id: 3,
    title: "Express Medicine Rider Dispatched",
    desc: "Order #PH-48291 is out for 2-hour delivery.",
    time: "2h ago",
    unread: false,
  },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [isMobileOpen, setIsMobileOpen] = useState<boolean>(false);
  const [currentRole, setCurrentRole] = useState<UserRole>("patient");

  // Dropdown states
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [isNotifOpen, setIsNotifOpen] = useState<boolean>(false);

  // Read role from cookie or pathname
  useEffect(() => {
    if (pathname.includes("/dashboard/doctor")) {
      setCurrentRole("doctor");
    } else if (pathname.includes("/dashboard/lab")) {
      setCurrentRole("lab");
    } else if (pathname.includes("/dashboard/pharmacy")) {
      setCurrentRole("pharmacy");
    } else if (pathname.includes("/dashboard/patient")) {
      setCurrentRole("patient");
    } else {
      const match = document.cookie.match(/sheba_role=([^;]+)/);
      if (match && ["patient", "doctor", "lab", "pharmacy"].includes(match[1]!)) {
        setCurrentRole(match[1] as UserRole);
      }
    }
  }, [pathname]);

  const handleSwitchWorkspace = (role: UserRole) => {
    setCurrentRole(role);
    document.cookie = `sheba_role=${role}; path=/; max-age=86400`;
    setIsProfileOpen(false);

    switch (role) {
      case "doctor":
        router.push("/dashboard/doctor");
        break;
      case "lab":
        router.push("/dashboard/lab");
        break;
      case "pharmacy":
        router.push("/dashboard/pharmacy");
        break;
      case "patient":
      default:
        router.push("/dashboard/patient");
        break;
    }
  };

  const handleSignOut = () => {
    document.cookie = "sheba_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    document.cookie = "sheba_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    router.push("/auth");
  };

  const navLinks = ROLE_NAV_LINKS[currentRole] || ROLE_NAV_LINKS.patient;

  // Breadcrumbs title parser
  const getBreadcrumbs = () => {
    const parts = pathname.split("/").filter(Boolean);
    if (parts.length === 1) return [{ label: "Dashboard", href: "/dashboard" }];
    return parts.map((part, index) => {
      const href = "/" + parts.slice(0, index + 1).join("/");
      const formatted = part.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
      return { label: formatted, href };
    });
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <div className="flex min-h-screen bg-bg-app text-fg-app transition-colors duration-300">
      {/* ── Sidebar (Desktop Collapsible) ────────────────────────────────── */}
      <aside
        className={`hidden lg:flex flex-col border-r border-card-border bg-card shadow-sm transition-all duration-300 relative z-30 shrink-0 ${
          isCollapsed ? "w-20" : "w-64"
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex h-16 items-center justify-between border-b border-card-border px-4">
          <Link href="/" className="flex items-center gap-2.5 min-w-0">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-teal text-white shadow-md glow-teal shrink-0">
              <HeartPulse className="h-5 w-5" />
            </div>
            {!isCollapsed && (
              <div className="min-w-0">
                <span className="font-extrabold text-base tracking-tight text-fg-app block truncate">
                  ShebaMitro
                </span>
                <span className="text-[10px] font-bold text-primary-teal uppercase tracking-wider block">
                  {currentRole} portal
                </span>
              </div>
            )}
          </Link>

          {/* Collapse Toggle Button */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex h-7 w-7 items-center justify-center rounded-lg bg-muted/60 text-muted-foreground hover:bg-muted hover:text-fg-app transition-colors"
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 space-y-1.5 p-3 overflow-y-auto">
          {!isCollapsed && (
            <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              {currentRole} Navigation
            </span>
          )}

          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href || (link.href !== "/dashboard" && pathname.startsWith(link.href));

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-semibold transition-all duration-200 ${
                  isActive
                    ? "bg-primary-teal/15 text-primary-teal border border-primary-teal/30 shadow-xs"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-fg-app"
                }`}
                title={link.label}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon className={`h-4 w-4 shrink-0 ${isActive ? "text-primary-teal" : "text-muted-foreground"}`} />
                  {!isCollapsed && <span className="truncate">{link.label}</span>}
                </div>

                {!isCollapsed && link.badge && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary-teal/10 text-primary-teal border border-primary-teal/20">
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer Role Badge */}
        {!isCollapsed && (
          <div className="p-3 border-t border-card-border">
            <div className="p-3 rounded-xl bg-surface-card-hover border border-card-border flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-500 font-bold flex items-center justify-center text-xs">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-xs font-bold text-fg-app block capitalize">
                  {currentRole} Mode
                </span>
                <span className="text-[10px] text-muted-foreground block truncate">
                  RBAC Verified Session
                </span>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* ── Main Content Area & Masthead ───────────────────────────── */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Top Masthead Header */}
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-card-border bg-card/80 px-4 sm:px-6 backdrop-blur-md">
          {/* Left: Mobile Menu Toggle & Breadcrumbs */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="lg:hidden p-2 rounded-xl bg-muted text-fg-app"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Breadcrumbs */}
            <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
              {breadcrumbs.map((bc, idx) => (
                <React.Fragment key={bc.href}>
                  {idx > 0 && <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/60" />}
                  <Link
                    href={bc.href}
                    className={`font-semibold transition-colors hover:text-primary-teal ${
                      idx === breadcrumbs.length - 1 ? "text-fg-app font-bold" : "text-muted-foreground"
                    }`}
                  >
                    {bc.label}
                  </Link>
                </React.Fragment>
              ))}
            </nav>
          </div>

          {/* Right Controls: Notifications, Language Toggle, Theme Toggle, Profile & Workspace Switcher */}
          <div className="flex items-center gap-3">
            {/* Language Toggle */}
            <LanguageToggle />

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Notification Bell Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsNotifOpen(!isNotifOpen);
                  setIsProfileOpen(false);
                }}
                className="relative p-2 rounded-xl border border-card-border bg-card hover:bg-surface-card-hover transition-colors text-fg-app shadow-xs"
              >
                <Bell className="h-4 w-4" />
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-white text-[10px] font-bold animate-pulse">
                  2
                </span>
              </button>

              <AnimatePresence>
                {isNotifOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-80 rounded-2xl border border-card-border bg-card p-4 shadow-2xl z-50 space-y-3"
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-card-border">
                      <span className="font-bold text-xs text-fg-app">Notifications</span>
                      <span className="text-[10px] font-semibold text-primary-teal bg-primary-teal/10 px-2 py-0.5 rounded-full">
                        2 Unread
                      </span>
                    </div>

                    <div className="space-y-2">
                      {NOTIFICATIONS.map((n) => (
                        <div
                          key={n.id}
                          className={`p-2.5 rounded-xl text-xs space-y-1 transition-colors border ${
                            n.unread ? "bg-primary-teal/10 border-primary-teal/30" : "bg-muted/40 border-card-border/40"
                          }`}
                        >
                          <div className="flex items-center justify-between font-bold text-fg-app">
                            <span>{n.title}</span>
                            <span className="text-[10px] font-normal text-muted-foreground">{n.time}</span>
                          </div>
                          <p className="text-[11px] text-muted-foreground leading-tight">{n.desc}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Profile Dropdown & Workspace Switcher */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsProfileOpen(!isProfileOpen);
                  setIsNotifOpen(false);
                }}
                className="flex items-center gap-2 p-1.5 pl-2.5 rounded-full border border-card-border bg-card hover:bg-surface-card-hover transition-colors shadow-xs"
              >
                <div className="h-7 w-7 rounded-full bg-primary-teal text-white font-bold flex items-center justify-center text-xs">
                  {currentRole.charAt(0).toUpperCase()}
                </div>
                <span className="text-xs font-bold text-fg-app capitalize hidden sm:inline">
                  {currentRole}
                </span>
                <ChevronDown className="h-3.5 w-3.5 text-muted-foreground mr-1" />
              </button>

              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-72 rounded-2xl border border-card-border bg-card p-3 shadow-2xl z-50 space-y-3"
                  >
                    {/* Profile Header Info */}
                    <div className="p-2.5 rounded-xl bg-surface-card-hover border border-card-border flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-primary-teal text-white font-extrabold flex items-center justify-center text-sm shadow-xs">
                        {currentRole.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <span className="font-bold text-xs text-fg-app block truncate capitalize">
                          {currentRole} User
                        </span>
                        <span className="text-[10px] text-muted-foreground block truncate">
                          user@shebamitro.health
                        </span>
                      </div>
                    </div>

                    {/* Workspace Switcher Section */}
                    <div className="space-y-1 pt-1 border-t border-card-border">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-2">
                        Switch Workspace / Role
                      </span>
                      <div className="space-y-1">
                        {WORKSPACE_OPTIONS.map((ws) => {
                          const Icon = ws.icon;
                          const isSelected = currentRole === ws.role;

                          return (
                            <button
                              key={ws.role}
                              type="button"
                              onClick={() => handleSwitchWorkspace(ws.role)}
                              className={`w-full flex items-center justify-between p-2 rounded-xl text-xs text-left transition-all ${
                                isSelected
                                  ? "bg-primary-teal/15 text-primary-teal font-bold"
                                  : "text-fg-app hover:bg-muted/50 font-medium"
                              }`}
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <Icon className="h-4 w-4 shrink-0 text-primary-teal" />
                                <div className="min-w-0">
                                  <span className="block text-xs truncate">{ws.name}</span>
                                  <span className="block text-[10px] text-muted-foreground truncate font-normal">
                                    {ws.subtitle}
                                  </span>
                                </div>
                              </div>
                              {isSelected && <Check className="h-4 w-4 text-primary-teal shrink-0" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Sign Out */}
                    <div className="pt-2 border-t border-card-border">
                      <button
                        onClick={handleSignOut}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-rose-500 hover:bg-rose-500/10 transition-colors"
                      >
                        <span className="flex items-center gap-2">
                          <LogOut className="h-4 w-4" /> Sign Out
                        </span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Main Content Body */}
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto">{children}</main>
      </div>

      {/* Mobile Drawer Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setIsMobileOpen(false)}
          />

          <div className="relative w-64 max-w-xs bg-card border-r border-card-border h-full p-4 flex flex-col justify-between z-10">
            <div>
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-card-border">
                <span className="font-extrabold text-base text-fg-app">ShebaMitro Nav</span>
                <button onClick={() => setIsMobileOpen(false)} className="p-1 rounded-lg bg-muted">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <nav className="space-y-1">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsMobileOpen(false)}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold ${
                        isActive ? "bg-primary-teal text-white" : "text-fg-app hover:bg-muted"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        <span>{link.label}</span>
                      </div>
                    </Link>
                  );
                })}
              </nav>
            </div>

            <Button variant="ghost" onClick={handleSignOut} className="w-full text-rose-500">
              <LogOut className="h-4 w-4 mr-2" /> Sign Out
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
