"use client";

import React, { useState } from "react";
import { X, AlertTriangle, HelpCircle, Send } from "lucide-react";
import { DecisionAction, ProviderRegistrationRequest } from "../types";

interface AuditDecisionModalProps {
  isOpen: boolean;
  onClose: () => void;
  action: DecisionAction | null;
  request: ProviderRegistrationRequest | null;
  onConfirmDecision: (noteOrReason: string) => void;
}

export function AuditDecisionModal({
  isOpen,
  onClose,
  action,
  request,
  onConfirmDecision,
}: AuditDecisionModalProps) {
  const [inputNote, setInputNote] = useState("");

  if (!isOpen || !action || !request) return null;

  const isReject = action === "REJECT";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputNote.trim()) return;
    onConfirmDecision(inputNote);
    setInputNote("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="bg-card border border-card-border rounded-2xl w-full max-w-lg shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-card-border pb-3">
          <div className="flex items-center gap-2.5">
            <div
              className={`p-2 rounded-xl ${
                isReject
                  ? "bg-rose-500/10 text-rose-500 border border-rose-500/20"
                  : "bg-amber-500/10 text-amber-500 border border-amber-500/20"
              }`}
            >
              {isReject ? (
                <AlertTriangle className="h-5 w-5" />
              ) : (
                <HelpCircle className="h-5 w-5" />
              )}
            </div>
            <div>
              <h3 className="font-bold text-sm text-fg-app">
                {isReject ? "Reject with Deficiency Note" : "Request Additional Documentation"}
              </h3>
              <p className="text-xs text-muted-foreground">{request.entityName}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-muted text-muted-foreground hover:text-fg-app transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-fg-app mb-1.5">
              {isReject
                ? "Deficiency Notes & Reason for Rejection *"
                : "Specify Required Missing Documents or Clarifications *"}
            </label>
            <textarea
              required
              rows={4}
              value={inputNote}
              onChange={(e) => setInputNote(e.target.value)}
              placeholder={
                isReject
                  ? "e.g., BMDC license registration expired on 2025-12-31. Updated certificate required."
                  : "e.g., Trade license is blurry. Please upload a high-resolution scanned copy of the 2025-2026 renewal."
              }
              className="w-full p-3 rounded-xl bg-card border border-card-border text-xs text-fg-app focus:outline-none focus:border-primary-teal resize-none"
            />
          </div>

          <div className="p-3 bg-muted/40 rounded-xl border border-card-border text-[11px] text-muted-foreground space-y-1">
            <span className="font-bold text-fg-app block">Audit Log Notice</span>
            <p>
              This note will be permanently recorded in the immutable audit table with a SHA-256 digital signature and sent directly to {request.contactEmail}.
            </p>
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-card-border">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-card-border bg-card hover:bg-muted text-fg-app text-xs font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white transition-colors shadow-xs ${
                isReject ? "bg-rose-500 hover:bg-rose-600" : "bg-amber-500 hover:bg-amber-600"
              }`}
            >
              <Send className="h-3.5 w-3.5" />
              {isReject ? "Submit Rejection" : "Send Request"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
