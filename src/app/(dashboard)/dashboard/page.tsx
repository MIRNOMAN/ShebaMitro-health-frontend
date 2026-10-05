"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  UserCheck,
  Stethoscope,
  FlaskConical,
  Pill,
  ArrowRight,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const DASHBOARD_PORTALS = [
  {
    role: "patient",
    title: "Patient Dashboard",
    subtitle: "Vitals tracking, medicine alarms, upcoming appointments, and diagnostic reports",
    href: "/dashboard/patient",
    icon: UserCheck,
    colorClass: "border-emerald-500/30 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400",
    badge: "Personal Health",
  },
  {
    role: "doctor",
    title: "Doctor Dashboard",
    subtitle: "Real-time patient queue, live teleconsultation room, and digital Rx quick writer",
    href: "/dashboard/doctor",
    icon: Stethoscope,
    colorClass: "border-primary-teal/30 bg-primary-teal/5 text-primary-teal",
    badge: "Clinical Practice",
  },
  {
    role: "lab",
    title: "Lab Partner Dashboard",
    subtitle: "Home sample collection dispatching, phlebotomist tracking, and PDF report uploads",
    href: "/dashboard/lab",
    icon: FlaskConical,
    colorClass: "border-purple-500/30 bg-purple-500/5 text-purple-600 dark:text-purple-400",
    badge: "Diagnostic Hub",
  },
  {
    role: "pharmacy",
    title: "Pharmacy Dashboard",
    subtitle: "Order packing queue, prescription verification audit, and Express 2-hour rider fleet",
    href: "/dashboard/pharmacy",
    icon: Pill,
    colorClass: "border-amber-500/30 bg-amber-500/5 text-amber-600 dark:text-amber-400",
    badge: "Medicine Hub",
  },
];

export default function DashboardIndexPage() {
  const router = useRouter();

  // Auto-redirect to matching role dashboard if cookie is set
  useEffect(() => {
    const match = document.cookie.match(/sheba_role=([^;]+)/);
    if (match && match[1]) {
      const role = match[1];
      if (["patient", "doctor", "lab", "pharmacy"].includes(role)) {
        router.push(`/dashboard/${role}`);
      }
    }
  }, [router]);

  return (
    <div className="space-y-8 pb-10">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-teal/10 text-primary-teal border border-primary-teal/20 text-xs font-semibold">
          <ShieldCheck className="h-4 w-4" /> Single Sign-On Multi-Role Portals
        </div>

        <h1 className="text-3xl font-extrabold text-fg-app tracking-tight">
          Select Your <span className="text-primary-teal">Role Dashboard</span>
        </h1>
        <p className="text-sm text-muted-foreground">
          Choose a role portal to view specialized healthcare workflows and real-time dashboards.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {DASHBOARD_PORTALS.map((portal) => {
          const Icon = portal.icon;
          return (
            <div
              key={portal.role}
              className={`p-6 rounded-2xl border ${portal.colorClass} space-y-4 shadow-xs hover:shadow-md transition-all flex flex-col justify-between`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-card border border-card-border shadow-xs">
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-card border border-card-border">
                    {portal.badge}
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-fg-app">{portal.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {portal.subtitle}
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <Link href={portal.href}>
                  <Button variant="primary" className="w-full justify-center text-xs h-11">
                    Enter {portal.title} <ArrowRight className="h-4 w-4 ml-1.5" />
                  </Button>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
