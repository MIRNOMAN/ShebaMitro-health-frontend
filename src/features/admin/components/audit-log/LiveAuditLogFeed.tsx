"use client";

import React from "react";
import {
  ShieldAlert,
  ShieldCheck,
  FileEdit,
  DollarSign,
  Settings,
  Globe,
  Hash,
  Clock,
  UserCheck,
} from "lucide-react";
import { LiveAuditEntry, AuditLogAction, AuditLogSeverity } from "../../types/auditLog";

interface LiveAuditLogFeedProps {
  logs: LiveAuditEntry[];
}

export function LiveAuditLogFeed({ logs }: LiveAuditLogFeedProps) {
  const getActionBadge = (action: AuditLogAction) => {
    switch (action) {
      case "PROVIDER_APPROVAL":
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/30">
            <UserCheck className="h-3 w-3" /> Provider Approval
          </span>
        );
      case "PRESCRIPTION_MODIFIED":
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/30">
            <FileEdit className="h-3 w-3" /> Prescription Edit
          </span>
        );
      case "REFUND_ISSUED":
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-500 border border-purple-500/30">
            <DollarSign className="h-3 w-3" /> Refund Issued
          </span>
        );
      case "ADMIN_MUTATION":
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/30">
            <Settings className="h-3 w-3" /> Admin Mutation
          </span>
        );
      case "UNAUTHORIZED_LOGIN":
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-rose-500 text-white border border-rose-600 animate-pulse shadow-xs">
            <ShieldAlert className="h-3 w-3" /> UNAUTHORIZED ATTEMPT
          </span>
        );
    }
  };

  const getSeverityBadge = (severity: AuditLogSeverity) => {
    if (severity === "CRITICAL") {
      return (
        <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-rose-500/20 text-rose-500 border border-rose-500/40">
          CRITICAL RISK
        </span>
      );
    }
    if (severity === "WARNING") {
      return (
        <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded bg-amber-500/10 text-amber-500 border border-amber-500/30">
          WARN
        </span>
      );
    }
    return (
      <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/30">
        NORMAL
      </span>
    );
  };

  return (
    <div className="rounded-2xl border border-card-border bg-card p-5 space-y-4 shadow-xs">
      <div className="flex items-center justify-between border-b border-card-border pb-3">
        <h3 className="font-bold text-sm text-fg-app flex items-center gap-2">
          Live Streaming Audit Log Trail
        </h3>
        <span className="text-[10px] font-mono text-muted-foreground">
          Showing {logs.length} live entries
        </span>
      </div>

      <div className="space-y-3 max-h-[580px] overflow-y-auto pr-1">
        {logs.length === 0 ? (
          <div className="p-8 text-center text-xs text-muted-foreground border border-dashed border-card-border rounded-xl">
            No audit logs found matching current search filter.
          </div>
        ) : (
          logs.map((entry) => {
            const isCritical = entry.severity === "CRITICAL";

            return (
              <div
                key={entry.id}
                className={`p-4 rounded-xl border transition-all space-y-2 ${
                  isCritical
                    ? "border-rose-500/40 bg-rose-500/5 shadow-xs"
                    : "border-card-border bg-surface-card-hover/40 hover:border-card-border/80"
                }`}
              >
                {/* Header Row */}
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-fg-app">{entry.id}</span>
                    {getActionBadge(entry.action)}
                    {getSeverityBadge(entry.severity)}
                  </div>

                  <div className="flex items-center gap-3 text-[11px] font-mono text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {entry.timestamp}
                    </span>
                  </div>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-2 text-xs pt-1">
                  <div className="md:col-span-4">
                    <span className="text-[10px] text-muted-foreground uppercase font-bold block">Actor & Role</span>
                    <div className="font-semibold text-fg-app truncate">{entry.actorEmail}</div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-muted text-muted-foreground border border-card-border inline-block mt-0.5">
                      {entry.actorRole}
                    </span>
                  </div>

                  <div className="md:col-span-8">
                    <span className="text-[10px] text-muted-foreground uppercase font-bold block">
                      Target & Mutation Summary
                    </span>
                    <div className="font-mono text-[11px] font-bold text-primary-teal truncate">
                      {entry.targetResource}
                    </div>
                    <p className="text-xs text-fg-app mt-0.5 font-medium">{entry.details}</p>
                  </div>
                </div>

                {/* Footer Metadata */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-card-border/60 text-[11px]">
                  <div className="flex items-center gap-2 font-mono text-fg-app">
                    <Globe className={`h-3.5 w-3.5 ${isCritical ? "text-rose-500" : "text-primary-teal"}`} />
                    <span className="font-bold">{entry.ipAddress}</span>
                    <span className="text-muted-foreground">({entry.geolocation})</span>
                  </div>

                  <div className="font-mono text-[10px] text-primary-teal bg-primary-teal/10 px-2 py-0.5 rounded border border-primary-teal/20 flex items-center gap-1">
                    <Hash className="h-3 w-3" />
                    {entry.sha256Hash}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
