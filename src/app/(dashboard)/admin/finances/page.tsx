"use client";

import React, { useState } from "react";
import { DollarSign, ShieldCheck, Download } from "lucide-react";
import { SettlementRecord, FinancialSummaryMetrics } from "@/features/admin/types/finances";
import { MOCK_FINANCIAL_METRICS, MOCK_SETTLEMENT_RECORDS } from "@/features/admin/data/financesData";
import { FinancialMetricsCards } from "@/features/admin/components/finances/FinancialMetricsCards";
import { SettlementTable } from "@/features/admin/components/finances/SettlementTable";
import { DisbursementConfirmationModal } from "@/features/admin/components/finances/DisbursementConfirmationModal";

export default function AdminFinancesPage() {
  const [metrics, setMetrics] = useState<FinancialSummaryMetrics>(MOCK_FINANCIAL_METRICS);
  const [records, setRecords] = useState<SettlementRecord[]>(MOCK_SETTLEMENT_RECORDS);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Toggle selection for individual row
  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Toggle selection for all pending rows
  const handleToggleSelectAll = () => {
    const pendingIds = records.filter((r) => r.status === "Pending Settlement").map((r) => r.id);
    const allSelected = pendingIds.length > 0 && pendingIds.every((id) => selectedIds.includes(id));

    if (allSelected) {
      setSelectedIds((prev) => prev.filter((id) => !pendingIds.includes(id)));
    } else {
      setSelectedIds((prev) => Array.from(new Set([...prev, ...pendingIds])));
    }
  };

  // Confirm disbursement webhook execution
  const handleConfirmDisbursement = () => {
    const disbursedAmount = selectedRecords.reduce((acc, r) => acc + r.netPayoutAmount, 0);

    setRecords((prev) =>
      prev.map((r) => {
        if (selectedIds.includes(r.id)) {
          return {
            ...r,
            status: "Disbursed",
            disbursedAt: new Date().toISOString().replace("T", " ").substring(0, 19),
            transactionRefHash: `TXN-WEBHOOK-${Math.floor(100000 + Math.random() * 900000)}`,
          };
        }
        return r;
      })
    );

    setMetrics((prev) => ({
      ...prev,
      pendingProviderBalances: Math.max(0, prev.pendingProviderBalances - disbursedAmount),
      totalDisbursedToDate: prev.totalDisbursedToDate + disbursedAmount,
    }));

    setSelectedIds([]);
  };

  const selectedRecords = records.filter((r) => selectedIds.includes(r.id));

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-card-border pb-4">
        <div>
          <h1 className="text-xl font-extrabold text-fg-app flex items-center gap-2">
            <DollarSign className="h-6 w-6 text-primary-teal" /> Executive Financial & Settlement Hub
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Gross platform volume tracking, net commission calculations, and automated payment disbursement webhooks.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-card-border bg-card hover:bg-muted text-xs font-semibold text-fg-app transition-colors">
            <Download className="h-3.5 w-3.5 text-primary-teal" /> Export Audit CSV
          </button>
        </div>
      </div>

      {/* Executive Financial Metrics Cards */}
      <FinancialMetricsCards metrics={metrics} />

      {/* Settlement Table */}
      <SettlementTable
        records={records}
        selectedIds={selectedIds}
        onToggleSelect={handleToggleSelect}
        onToggleSelectAll={handleToggleSelectAll}
        onBatchDisburseClick={() => setIsModalOpen(true)}
      />

      {/* Disbursement Confirmation Webhook Modal */}
      <DisbursementConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedRecords={selectedRecords}
        onConfirmDisbursement={handleConfirmDisbursement}
      />
    </div>
  );
}
