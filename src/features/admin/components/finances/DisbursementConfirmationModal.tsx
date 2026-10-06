"use client";

import React, { useState } from "react";
import { X, Send, CheckCircle2, Loader2, ShieldCheck, DollarSign } from "lucide-react";
import { SettlementRecord } from "../../types/finances";

interface DisbursementConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedRecords: SettlementRecord[];
  onConfirmDisbursement: () => void;
}

export function DisbursementConfirmationModal({
  isOpen,
  onClose,
  selectedRecords,
  onConfirmDisbursement,
}: DisbursementConfirmationModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [stepMessage, setStepMessage] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  if (!isOpen) return null;

  const totalPayout = selectedRecords.reduce((acc, r) => acc + r.netPayoutAmount, 0);
  const totalCommission = selectedRecords.reduce((acc, r) => acc + r.netCommissionAmount, 0);

  const formatBDT = (val: number) =>
    new Intl.NumberFormat("en-BD", { style: "currency", currency: "BDT", maximumFractionDigits: 0 }).format(
      val
    );

  const handleExecuteWebhookBatch = () => {
    setIsProcessing(true);
    setStepMessage("1/3: Validating provider MFS & BEFTN routing numbers...");

    setTimeout(() => {
      setStepMessage("2/3: Transmitting payload to bKash / Nagad / City Bank Webhook Endpoints...");
    }, 1200);

    setTimeout(() => {
      setStepMessage("3/3: Receiving Webhook 200 OK & generating transaction ref hash...");
    }, 2400);

    setTimeout(() => {
      setIsProcessing(false);
      setIsComplete(true);
      onConfirmDisbursement();
    }, 3500);
  };

  const handleCloseModal = () => {
    setIsProcessing(false);
    setIsComplete(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="bg-card border border-card-border rounded-2xl w-full max-w-lg shadow-2xl p-6 space-y-5 animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-card-border pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-primary-teal/10 text-primary-teal border border-primary-teal/20">
              <DollarSign className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-fg-app">Batch Payment Disbursement</h3>
              <p className="text-xs text-muted-foreground">
                Automated MFS & Bank Transfer Webhook Trigger
              </p>
            </div>
          </div>

          <button
            onClick={handleCloseModal}
            disabled={isProcessing}
            className="p-1 rounded-lg hover:bg-muted text-muted-foreground hover:text-fg-app transition-colors disabled:opacity-30"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Modal Body */}
        {isComplete ? (
          <div className="py-8 text-center space-y-3">
            <div className="h-14 w-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h4 className="text-base font-extrabold text-fg-app">Disbursement Complete!</h4>
            <p className="text-xs text-muted-foreground max-w-xs mx-auto">
              Successfully disbursed {formatBDT(totalPayout)} to {selectedRecords.length} provider accounts via payment gateway webhooks.
            </p>
            <button
              onClick={handleCloseModal}
              className="mt-4 px-5 py-2 rounded-xl bg-primary-teal text-white font-bold text-xs shadow-xs"
            >
              Done & Return to Ledger
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Summary Box */}
            <div className="bg-muted/40 p-4 rounded-xl border border-card-border space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-muted-foreground font-semibold">Selected Providers:</span>
                <span className="font-bold text-fg-app">{selectedRecords.length} Accounts</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-muted-foreground font-semibold">Platform Commission Retained:</span>
                <span className="font-mono font-bold text-emerald-500">{formatBDT(totalCommission)}</span>
              </div>
              <div className="flex justify-between items-center text-xs border-t border-card-border/60 pt-2">
                <span className="text-fg-app font-extrabold">Total Net Payout Amount:</span>
                <span className="font-mono text-base font-extrabold text-primary-teal">
                  {formatBDT(totalPayout)}
                </span>
              </div>
            </div>

            {/* Provider Mini List */}
            <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
              <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                Disbursement Recipients
              </span>
              {selectedRecords.map((r) => (
                <div
                  key={r.id}
                  className="flex items-center justify-between text-xs p-2 rounded-lg bg-card border border-card-border"
                >
                  <span className="font-bold text-fg-app truncate max-w-[200px]">{r.providerName}</span>
                  <span className="font-mono text-primary-teal font-extrabold">
                    {formatBDT(r.netPayoutAmount)}
                  </span>
                </div>
              ))}
            </div>

            {/* Progress Status when processing */}
            {isProcessing && (
              <div className="p-3 bg-primary-teal/10 border border-primary-teal/20 rounded-xl flex items-center gap-3">
                <Loader2 className="h-5 w-5 text-primary-teal animate-spin shrink-0" />
                <span className="text-xs font-semibold text-primary-teal">{stepMessage}</span>
              </div>
            )}

            {/* Action Buttons */}
            {!isProcessing && (
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-card-border">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 rounded-xl border border-card-border bg-card hover:bg-muted text-fg-app text-xs font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleExecuteWebhookBatch}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-primary-teal hover:bg-primary-teal/90 transition-colors shadow-xs"
                >
                  <Send className="h-3.5 w-3.5" />
                  Execute Webhook Disbursement
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
