"use client";

import React from "react";
import { Search, Play, Pause, Radio, Filter, UserCheck, ShieldAlert, DollarSign, FileEdit, Settings } from "lucide-react";
import { AuditLogAction, UserRole } from "../../types/auditLog";

interface AuditStreamControlsProps {
  isStreaming: boolean;
  onToggleStreaming: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  roleFilter: string;
  setRoleFilter: (role: string) => void;
  actionFilter: string;
  setActionFilter: (act: string) => void;
}

export function AuditStreamControls({
  isStreaming,
  onToggleStreaming,
  searchQuery,
  setSearchQuery,
  roleFilter,
  setRoleFilter,
  actionFilter,
  setActionFilter,
}: AuditStreamControlsProps) {
  return (
    <div className="rounded-2xl border border-card-border bg-card p-5 space-y-4 shadow-xs">
      {/* Top Stream Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-card-border pb-4">
        <div className="flex items-center gap-2.5">
          <button
            onClick={onToggleStreaming}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-extrabold text-xs transition-colors shadow-xs ${
              isStreaming
                ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 hover:bg-emerald-500/20"
                : "bg-amber-500/10 text-amber-500 border border-amber-500/30 hover:bg-amber-500/20"
            }`}
          >
            <Radio className={`h-4 w-4 ${isStreaming ? "animate-pulse" : ""}`} />
            {isStreaming ? "WebSocket Live Stream Active" : "Stream Paused"}
          </button>

          <span className="text-[11px] text-muted-foreground hidden md:inline">
            Receiving real-time log mutations & audit packets
          </span>
        </div>

        <button
          onClick={onToggleStreaming}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-card-border bg-card hover:bg-muted text-xs font-bold text-fg-app transition-colors"
        >
          {isStreaming ? (
            <>
              <Pause className="h-3.5 w-3.5 text-amber-500" /> Pause Stream
            </>
          ) : (
            <>
              <Play className="h-3.5 w-3.5 text-emerald-500" /> Resume Stream
            </>
          )}
        </button>
      </div>

      {/* Search & Filters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search email, IP, details, or hash..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-9 pl-8 pr-3 rounded-xl bg-card border border-card-border text-xs text-fg-app"
          />
        </div>

        {/* Action Filter */}
        <div>
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="w-full h-9 px-3 rounded-xl bg-card border border-card-border text-xs text-fg-app font-semibold"
          >
            <option value="ALL">All Event Actions</option>
            <option value="PROVIDER_APPROVAL">Provider Approvals</option>
            <option value="PRESCRIPTION_MODIFIED">Prescription Modifications</option>
            <option value="REFUND_ISSUED">Refund Issuances</option>
            <option value="ADMIN_MUTATION">Admin Mutations</option>
            <option value="UNAUTHORIZED_LOGIN">Unauthorized Login Attempts</option>
          </select>
        </div>

        {/* Role Filter */}
        <div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="w-full h-9 px-3 rounded-xl bg-card border border-card-border text-xs text-fg-app font-semibold"
          >
            <option value="ALL">All User Roles</option>
            <option value="SuperAdmin">SuperAdmin</option>
            <option value="Doctor">Doctor</option>
            <option value="Pharmacist">Pharmacist</option>
            <option value="Lab Technician">Lab Technician</option>
            <option value="Patient">Patient</option>
            <option value="Anonymous">Anonymous / Unauthorized</option>
          </select>
        </div>
      </div>
    </div>
  );
}
