"use client";

import React from "react";
import { ShieldAlert, ShieldCheck, AlertOctagon, Terminal } from "lucide-react";
import { LiveAuditEntry } from "../../types/auditLog";

interface SecurityAlertBannerProps {
  auditLogs: LiveAuditEntry[];
}

export function SecurityAlertBanner({ auditLogs }: SecurityAlertBannerProps) {
  const criticalAlerts = auditLogs.filter((l) => l.severity === "CRITICAL");
  const latestAlert = criticalAlerts[0] || null;

  return (
    <div className="rounded-2xl border border-rose-500/30 bg-rose-500/5 p-4 space-y-3 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-rose-500/10 text-rose-500 border border-rose-500/20 animate-pulse">
            <ShieldAlert className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-sm text-fg-app">Security Threat & Intrusion Monitor</h3>
              <span className="px-2 py-0.5 text-[10px] font-extrabold rounded-full bg-rose-500 text-white animate-pulse">
                {criticalAlerts.length} Flagged Threats
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Automated WAF & anomaly detection flagging unauthorized login attempts & illegal mutations.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="px-3 py-1 rounded-xl bg-card border border-card-border text-emerald-500 font-bold flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" /> WAF Active
          </span>
          <span className="px-3 py-1 rounded-xl bg-card border border-card-border text-fg-app font-bold flex items-center gap-1.5">
            <Terminal className="h-3.5 w-3.5 text-primary-teal" /> WebSocket Stream #2026
          </span>
        </div>
      </div>

      {latestAlert && (
        <div className="p-3 bg-card/80 border border-rose-500/30 rounded-xl flex items-center justify-between text-xs gap-3">
          <div className="flex items-center gap-2 overflow-hidden">
            <AlertOctagon className="h-4 w-4 text-rose-500 shrink-0" />
            <span className="font-mono text-rose-500 font-bold shrink-0">{latestAlert.ipAddress}</span>
            <span className="text-muted-foreground font-semibold truncate">({latestAlert.geolocation}):</span>
            <span className="text-fg-app truncate font-medium">{latestAlert.details}</span>
          </div>
          <span className="font-mono text-[10px] text-muted-foreground shrink-0">{latestAlert.timestamp}</span>
        </div>
      )}
    </div>
  );
}
