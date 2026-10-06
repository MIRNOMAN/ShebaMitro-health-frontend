"use client";

import React, { useState } from "react";
import {
  Search,
  CheckCircle2,
  Clock,
  Send,
  Building2,
  Smartphone,
  Hash,
  ChevronRight,
  Filter,
} from "lucide-react";
import { SettlementRecord, SettlementStatus } from "../../types/finances";

interface SettlementTableProps {
  records: SettlementRecord[];
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
  onToggleSelectAll: () => void;
  onBatchDisburseClick: () => void;
}

export function SettlementTable({
  records,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
  onBatchDisburseClick,
}: SettlementTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const filtered = records.filter((r) => {
    const q = searchQuery.toLowerCase().trim();
    const matchSearch =
      !q ||
      r.providerName.toLowerCase().includes(q) ||
      r.providerId.toLowerCase().includes(q) ||
      r.payoutAccount.toLowerCase().includes(q) ||
      r.id.toLowerCase().includes(q);

    const matchStatus = statusFilter === "ALL" || r.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const pendingRecords = filtered.filter((r) => r.status === "Pending Settlement");
  const allPendingSelected =
    pendingRecords.length > 0 && pendingRecords.every((r) => selectedIds.includes(r.id));

  const formatBDT = (val: number) =>
    new Intl.NumberFormat("en-BD", { style: "currency", currency: "BDT", maximumFractionDigits: 0 }).format(
      val
    );

  const getChannelIcon = (channel: SettlementRecord["payoutChannel"]) => {
    if (channel.includes("bKash") || channel.includes("Nagad")) {
      return <Smartphone className="h-3.5 w-3.5 text-pink-500" />;
    }
    return <Building2 className="h-3.5 w-3.5 text-blue-500" />;
  };

  const getStatusBadge = (status: SettlementStatus) => {
    switch (status) {
      case "Pending Settlement":
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 border border-amber-500/30">
            <Clock className="h-3 w-3" /> Pending Settlement
          </span>
        );
      case "Disbursed":
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/30">
            <CheckCircle2 className="h-3 w-3" /> Disbursed
          </span>
        );
      case "Processing Webhook":
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-600 border border-blue-500/30 animate-pulse">
            <Clock className="h-3 w-3" /> Processing...
          </span>
        );
      case "Failed":
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-600 border border-rose-500/30">
            Failed
          </span>
        );
    }
  };

  return (
    <div className="rounded-2xl border border-card-border bg-card p-5 space-y-4 shadow-xs">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-card-border pb-4">
        <div>
          <h3 className="font-bold text-sm text-fg-app flex items-center gap-2">
            Provider Settlement & Disbursement Ledger
          </h3>
          <p className="text-xs text-muted-foreground">
            Earned consultation & service fees minus platform commission.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onBatchDisburseClick}
            disabled={selectedIds.length === 0}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white transition-all shadow-xs ${
              selectedIds.length > 0
                ? "bg-primary-teal hover:bg-primary-teal/90"
                : "bg-muted text-muted-foreground cursor-not-allowed opacity-60"
            }`}
          >
            <Send className="h-3.5 w-3.5" />
            Disburse Selected ({selectedIds.length})
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search provider, ID, or account..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-8 pl-8 pr-3 rounded-lg bg-card border border-card-border text-xs text-fg-app"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="h-3.5 w-3.5 text-muted-foreground" />
          <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-xl text-[10px] font-semibold">
            <button
              onClick={() => setStatusFilter("ALL")}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                statusFilter === "ALL" ? "bg-card text-primary-teal font-bold shadow-xs" : "text-muted-foreground"
              }`}
            >
              All ({records.length})
            </button>
            <button
              onClick={() => setStatusFilter("Pending Settlement")}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                statusFilter === "Pending Settlement" ? "bg-card text-amber-500 font-bold shadow-xs" : "text-muted-foreground"
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setStatusFilter("Disbursed")}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                statusFilter === "Disbursed" ? "bg-card text-emerald-500 font-bold shadow-xs" : "text-muted-foreground"
              }`}
            >
              Disbursed
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-card-border text-[10px] uppercase font-bold text-muted-foreground bg-muted/40">
              <th className="py-2.5 px-3 w-8">
                <input
                  type="checkbox"
                  checked={allPendingSelected}
                  onChange={onToggleSelectAll}
                  className="rounded border-card-border accent-primary-teal"
                />
              </th>
              <th className="py-2.5 px-3">Settlement ID</th>
              <th className="py-2.5 px-3">Provider Entity</th>
              <th className="py-2.5 px-3">Gross Earned</th>
              <th className="py-2.5 px-3">Commission</th>
              <th className="py-2.5 px-3">Net Payout</th>
              <th className="py-2.5 px-3">Payout Account</th>
              <th className="py-2.5 px-3">Status</th>
              <th className="py-2.5 px-3 text-right">Ref Hash</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-card-border/60">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-6 text-center text-muted-foreground">
                  No settlement records found matching filter.
                </td>
              </tr>
            ) : (
              filtered.map((r) => {
                const isSelected = selectedIds.includes(r.id);
                const isPending = r.status === "Pending Settlement";

                return (
                  <tr key={r.id} className="hover:bg-muted/20 transition-colors">
                    <td className="py-3 px-3">
                      <input
                        type="checkbox"
                        disabled={!isPending}
                        checked={isSelected}
                        onChange={() => onToggleSelect(r.id)}
                        className="rounded border-card-border accent-primary-teal disabled:opacity-30"
                      />
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-fg-app">{r.id}</td>
                    <td className="py-3 px-3">
                      <span className="font-bold text-fg-app block">{r.providerName}</span>
                      <span className="text-[10px] text-muted-foreground">
                        {r.providerType} • {r.completedOrdersCount} orders
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono font-semibold text-fg-app">
                      {formatBDT(r.grossEarned)}
                    </td>
                    <td className="py-3 px-3 font-mono text-muted-foreground">
                      <span className="text-emerald-500 font-bold">-{r.commissionPercentage}%</span>
                      <span className="block text-[10px]">({formatBDT(r.netCommissionAmount)})</span>
                    </td>
                    <td className="py-3 px-3 font-mono font-extrabold text-primary-teal text-sm">
                      {formatBDT(r.netPayoutAmount)}
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1.5 font-mono text-[11px] text-fg-app">
                        {getChannelIcon(r.payoutChannel)}
                        <span>{r.payoutChannel}</span>
                      </div>
                      <span className="text-[10px] text-muted-foreground font-mono block">
                        {r.payoutAccount}
                      </span>
                    </td>
                    <td className="py-3 px-3">{getStatusBadge(r.status)}</td>
                    <td className="py-3 px-3 text-right">
                      {r.transactionRefHash ? (
                        <span className="font-mono text-[10px] text-primary-teal bg-primary-teal/10 px-2 py-0.5 rounded border border-primary-teal/20 flex items-center gap-1 justify-end inline-flex">
                          <Hash className="h-3 w-3" />
                          {r.transactionRefHash}
                        </span>
                      ) : (
                        <span className="text-muted-foreground text-[10px] italic">Awaiting Webhook</span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
