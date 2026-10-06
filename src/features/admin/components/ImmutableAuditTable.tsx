"use client";

import React from "react";
import { Lock, FileCheck, CheckCircle, XCircle, AlertCircle, Hash } from "lucide-react";
import { AuditRecord } from "../types";

interface ImmutableAuditTableProps {
  auditLogs: AuditRecord[];
}

export function ImmutableAuditTable({ auditLogs }: ImmutableAuditTableProps) {
  const getDecisionBadge = (decision: AuditRecord["decision"]) => {
    switch (decision) {
      case "APPROVED":
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/30">
            <CheckCircle className="h-3 w-3" /> APPROVED
          </span>
        );
      case "REJECTED":
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-500 border border-rose-500/30">
            <XCircle className="h-3 w-3" /> REJECTED
          </span>
        );
      case "INFO_REQUESTED":
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/30">
            <AlertCircle className="h-3 w-3" /> INFO REQUESTED
          </span>
        );
    }
  };

  return (
    <div className="rounded-2xl border border-card-border bg-card p-5 space-y-4 shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-card-border pb-3">
        <div className="flex items-center gap-2">
          <Lock className="h-4 w-4 text-primary-teal" />
          <h3 className="font-bold text-sm text-fg-app">Immutable Verification Audit Log</h3>
        </div>
        <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-muted text-muted-foreground border border-card-border flex items-center gap-1">
          <FileCheck className="h-3 w-3 text-primary-teal" /> Cryptographic Ledger (SHA-256)
        </span>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-card-border text-[10px] uppercase font-bold text-muted-foreground bg-muted/40">
              <th className="py-2.5 px-3">Audit ID</th>
              <th className="py-2.5 px-3">Provider Entity</th>
              <th className="py-2.5 px-3">Type</th>
              <th className="py-2.5 px-3">Audit Decision</th>
              <th className="py-2.5 px-3">Notes & Reason</th>
              <th className="py-2.5 px-3">Auditor</th>
              <th className="py-2.5 px-3">Timestamp</th>
              <th className="py-2.5 px-3 text-right">SHA-256 Checksum</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-card-border/60">
            {auditLogs.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-6 text-center text-muted-foreground">
                  No audit logs recorded yet.
                </td>
              </tr>
            ) : (
              auditLogs.map((log) => (
                <tr key={log.auditId} className="hover:bg-muted/20 transition-colors">
                  <td className="py-3 px-3 font-mono font-bold text-fg-app">{log.auditId}</td>
                  <td className="py-3 px-3">
                    <span className="font-bold text-fg-app block">{log.providerName}</span>
                    <span className="text-[10px] font-mono text-muted-foreground">{log.providerId}</span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 text-[10px] font-semibold rounded-md bg-muted text-fg-app border border-card-border">
                      {log.providerType}
                    </span>
                  </td>
                  <td className="py-3 px-3">{getDecisionBadge(log.decision)}</td>
                  <td className="py-3 px-3 max-w-xs">
                    {log.deficiencyNote || log.requestedDocDetails ? (
                      <p className="text-[11px] text-fg-app truncate">
                        {log.deficiencyNote || log.requestedDocDetails}
                      </p>
                    ) : (
                      <span className="text-muted-foreground italic text-[10px]">Verification Approved</span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-muted-foreground text-[11px]">{log.auditedBy}</td>
                  <td className="py-3 px-3 font-mono text-[11px] text-muted-foreground">
                    {log.timestamp}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <span className="font-mono text-[10px] text-primary-teal bg-primary-teal/10 px-2 py-0.5 rounded border border-primary-teal/20 flex items-center gap-1 justify-end inline-flex">
                      <Hash className="h-3 w-3" />
                      {log.sha256Hash}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
