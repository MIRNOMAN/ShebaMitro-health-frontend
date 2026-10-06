"use client";

import React from "react";
import { TrendingUp, DollarSign, Wallet, ShieldCheck, ArrowUpRight } from "lucide-react";
import { FinancialSummaryMetrics } from "../../types/finances";

interface FinancialMetricsCardsProps {
  metrics: FinancialSummaryMetrics;
}

export function FinancialMetricsCards({ metrics }: FinancialMetricsCardsProps) {
  const formatBDT = (amount: number) => {
    return new Intl.NumberFormat("en-BD", {
      style: "currency",
      currency: "BDT",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Metric 1: Gross Platform Volume */}
      <div className="rounded-2xl border border-card-border bg-card p-5 space-y-3 shadow-xs hover:border-primary-teal/40 transition-colors">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            Gross Platform Volume
          </span>
          <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500 border border-blue-500/20">
            <DollarSign className="h-4 w-4" />
          </div>
        </div>
        <div>
          <h3 className="text-2xl font-extrabold text-fg-app font-mono">
            {formatBDT(metrics.grossPlatformVolume)}
          </h3>
          <div className="flex items-center gap-1 mt-1 text-[11px] font-semibold text-emerald-500">
            <ArrowUpRight className="h-3.5 w-3.5" />
            <span>+{metrics.monthlyGrowthPercentage}% vs last month</span>
          </div>
        </div>
      </div>

      {/* Metric 2: Net Platform Commission */}
      <div className="rounded-2xl border border-card-border bg-card p-5 space-y-3 shadow-xs hover:border-primary-teal/40 transition-colors">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            Net Platform Revenue
          </span>
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
            <TrendingUp className="h-4 w-4" />
          </div>
        </div>
        <div>
          <h3 className="text-2xl font-extrabold text-primary-teal font-mono">
            {formatBDT(metrics.netPlatformCommission)}
          </h3>
          <p className="text-[11px] text-muted-foreground mt-1">
            Calculated via dynamic commission rates
          </p>
        </div>
      </div>

      {/* Metric 3: Pending Provider Balances */}
      <div className="rounded-2xl border border-card-border bg-card p-5 space-y-3 shadow-xs hover:border-primary-teal/40 transition-colors">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            Pending Balances
          </span>
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
            <Wallet className="h-4 w-4" />
          </div>
        </div>
        <div>
          <h3 className="text-2xl font-extrabold text-amber-500 font-mono">
            {formatBDT(metrics.pendingProviderBalances)}
          </h3>
          <p className="text-[11px] text-muted-foreground mt-1 font-medium">
            Ready for batch settlement disbursement
          </p>
        </div>
      </div>

      {/* Metric 4: Total Disbursed */}
      <div className="rounded-2xl border border-card-border bg-card p-5 space-y-3 shadow-xs hover:border-primary-teal/40 transition-colors">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            Disbursed To Date
          </span>
          <div className="p-2 rounded-xl bg-purple-500/10 text-purple-500 border border-purple-500/20">
            <ShieldCheck className="h-4 w-4" />
          </div>
        </div>
        <div>
          <h3 className="text-2xl font-extrabold text-fg-app font-mono">
            {formatBDT(metrics.totalDisbursedToDate)}
          </h3>
          <p className="text-[11px] text-muted-foreground mt-1">
            {metrics.activeProviderPayoutCount} active accounts settled
          </p>
        </div>
      </div>
    </div>
  );
}
