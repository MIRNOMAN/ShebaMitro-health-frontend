"use client";

import React, { useState, useEffect } from "react";
import { Terminal } from "lucide-react";
import { LiveAuditEntry } from "@/features/admin/types/auditLog";
import { INITIAL_LIVE_AUDIT_LOGS } from "@/features/admin/data/auditLogData";
import { SecurityAlertBanner } from "@/features/admin/components/audit-log/SecurityAlertBanner";
import { AuditStreamControls } from "@/features/admin/components/audit-log/AuditStreamControls";
import { LiveAuditLogFeed } from "@/features/admin/components/audit-log/LiveAuditLogFeed";

export default function AdminAuditLogPage() {
  const [logs, setLogs] = useState<LiveAuditEntry[]>(INITIAL_LIVE_AUDIT_LOGS);
  const [isStreaming, setIsStreaming] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [actionFilter, setActionFilter] = useState("ALL");

  // WebSocket Live Stream Simulation Effect
  useEffect(() => {
    if (!isStreaming) return;

    const interval = setInterval(() => {
      const isSecurityEvent = Math.random() > 0.6;
      const newEntry: LiveAuditEntry = isSecurityEvent
        ? {
            id: `LOG-${Math.floor(99300 + Math.random() * 900)}`,
            timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
            actorEmail: "unauthorized.scanner@botnet-node.io",
            actorRole: "Anonymous",
            action: "UNAUTHORIZED_LOGIN",
            targetResource: "POST /api/v1/admin/super-user/escalate",
            details: "Unauthorized token escalation probe blocked by security gateway.",
            ipAddress: `198.51.${Math.floor(100 + Math.random() * 100)}.${Math.floor(10 + Math.random() * 80)}`,
            geolocation: "Frankfurt, Germany (Flagged Proxy)",
            severity: "CRITICAL",
            sha256Hash: `SHA256:${Math.floor(100000 + Math.random() * 900000).toString(16).toUpperCase()}`,
          }
        : {
            id: `LOG-${Math.floor(99300 + Math.random() * 900)}`,
            timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
            actorEmail: "pharmacist.lead@lazzpharma.com",
            actorRole: "Pharmacist",
            action: "PRESCRIPTION_MODIFIED",
            targetResource: "DISPENSE-2026-4401 (Napa Extra 500mg)",
            details: "Verified prescription barcode and updated inventory dispatch status to Ready.",
            ipAddress: "103.205.71.99",
            geolocation: "Dhaka, Bangladesh",
            severity: "INFO",
            sha256Hash: `SHA256:${Math.floor(100000 + Math.random() * 900000).toString(16).toUpperCase()}`,
          };

      setLogs((prev) => [newEntry, ...prev.slice(0, 49)]); // keep latest 50
    }, 4500);

    return () => clearInterval(interval);
  }, [isStreaming]);

  // Filtering logic
  const filteredLogs = logs.filter((l) => {
    const q = searchQuery.toLowerCase().trim();
    const matchSearch =
      !q ||
      l.actorEmail.toLowerCase().includes(q) ||
      l.details.toLowerCase().includes(q) ||
      l.ipAddress.toLowerCase().includes(q) ||
      l.targetResource.toLowerCase().includes(q) ||
      l.id.toLowerCase().includes(q);

    const matchRole = roleFilter === "ALL" || l.actorRole === roleFilter;
    const matchAction = actionFilter === "ALL" || l.action === actionFilter;

    return matchSearch && matchRole && matchAction;
  });

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-card-border pb-4">
        <div>
          <h1 className="text-xl font-extrabold text-fg-app flex items-center gap-2">
            <Terminal className="h-6 w-6 text-primary-teal" /> Live Streaming Audit Log Viewer
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Real-time WebSocket telemetry tracking provider approvals, prescription modifications, refund issuances, and admin mutations.
          </p>
        </div>
      </div>

      {/* Top Security Alert Highlight */}
      <SecurityAlertBanner auditLogs={logs} />

      {/* Streaming Controls & Filters */}
      <AuditStreamControls
        isStreaming={isStreaming}
        onToggleStreaming={() => setIsStreaming((prev) => !prev)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        roleFilter={roleFilter}
        setRoleFilter={setRoleFilter}
        actionFilter={actionFilter}
        setActionFilter={setActionFilter}
      />

      {/* Live Streaming Log Trail Feed */}
      <LiveAuditLogFeed logs={filteredLogs} />
    </div>
  );
}
