"use client";

import React, { useState } from "react";
import { ShieldCheck, CheckCircle2, AlertTriangle, FileText } from "lucide-react";
import {
  ProviderRegistrationRequest,
  AuditRecord,
  DecisionAction,
} from "@/features/admin/types";
import { MOCK_PROVIDER_REQUESTS, INITIAL_AUDIT_LOGS } from "@/features/admin/data/adminData";
import { ProviderQueueList } from "@/features/admin/components/ProviderQueueList";
import { DocumentInspectionViewer } from "@/features/admin/components/DocumentInspectionViewer";
import { AuditDecisionModal } from "@/features/admin/components/AuditDecisionModal";
import { ImmutableAuditTable } from "@/features/admin/components/ImmutableAuditTable";

export default function AdminProviderVerificationPage() {
  const [requests, setRequests] = useState<ProviderRegistrationRequest[]>(MOCK_PROVIDER_REQUESTS);
  const [selectedReqId, setSelectedReqId] = useState<string>(MOCK_PROVIDER_REQUESTS[0]?.id || "");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [typeFilter, setTypeFilter] = useState<string>("ALL");

  // Modal State
  const [activeAction, setActiveAction] = useState<DecisionAction | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Audit Logs State
  const [auditLogs, setAuditLogs] = useState<AuditRecord[]>(INITIAL_AUDIT_LOGS);

  const selectedRequest = requests.find((r) => r.id === selectedReqId) || null;

  // Simple pseudo SHA-256 hash generator helper
  const generateSha256Hash = () => {
    const chars = "0123456789ABCDEF";
    let hash = "SHA256:";
    for (let i = 0; i < 16; i++) {
      hash += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return hash;
  };

  const handleActionClick = (action: DecisionAction) => {
    if (!selectedRequest) return;

    if (action === "APPROVE") {
      executeDecision("APPROVE", "Verification documents passed automated BMDC/DGDA/NID validation.");
    } else {
      setActiveAction(action);
      setIsModalOpen(true);
    }
  };

  const executeDecision = (action: DecisionAction, noteOrReason: string) => {
    if (!selectedRequest) return;

    let newStatus: ProviderRegistrationRequest["status"] = "Pending Audit";
    let decisionType: AuditRecord["decision"] = "APPROVED";

    if (action === "APPROVE") {
      newStatus = "Approved";
      decisionType = "APPROVED";
    } else if (action === "REJECT") {
      newStatus = "Rejected";
      decisionType = "REJECTED";
    } else if (action === "REQUEST_DOCS") {
      newStatus = "Additional Info Requested";
      decisionType = "INFO_REQUESTED";
    }

    // Update request status in list
    setRequests((prev) =>
      prev.map((r) => (r.id === selectedRequest.id ? { ...r, status: newStatus } : r))
    );

    // Create immutable audit entry
    const newAuditRecord: AuditRecord = {
      auditId: `AUDIT-2026-${Math.floor(8800 + Math.random() * 1000)}`,
      providerId: selectedRequest.id,
      providerName: selectedRequest.entityName,
      providerType: selectedRequest.providerType,
      decision: decisionType,
      deficiencyNote: action === "REJECT" ? noteOrReason : undefined,
      requestedDocDetails: action === "REQUEST_DOCS" ? noteOrReason : undefined,
      auditedBy: "SuperAdmin Audit Desk (Audit #4)",
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
      sha256Hash: generateSha256Hash(),
    };

    setAuditLogs((prev) => [newAuditRecord, ...prev]);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Dashboard Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-card-border pb-4">
        <div>
          <h1 className="text-xl font-extrabold text-fg-app flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-primary-teal" /> Provider Verification Audit Desk
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Credential inspection viewer and cryptographic decision ledger for Doctors, Diagnostic Labs & Pharmacies.
          </p>
        </div>

        {/* Audit Stats Banner */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs font-bold text-amber-600">
            <AlertTriangle className="h-4 w-4" />
            <span>{requests.filter((r) => r.status === "Pending Audit").length} Pending Audits</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs font-bold text-emerald-600">
            <CheckCircle2 className="h-4 w-4" />
            <span>{auditLogs.filter((a) => a.decision === "APPROVED").length} Approved Today</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Queue, Right Side-by-Side Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4">
          <ProviderQueueList
            requests={requests}
            selectedReqId={selectedReqId}
            onSelectReq={setSelectedReqId}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            typeFilter={typeFilter}
            setTypeFilter={setTypeFilter}
          />
        </div>

        <div className="lg:col-span-8">
          <DocumentInspectionViewer
            request={selectedRequest}
            onActionClick={handleActionClick}
          />
        </div>
      </div>

      {/* Immutable Audit Log Ledger */}
      <ImmutableAuditTable auditLogs={auditLogs} />

      {/* Modal for Deficiency Note or Document Requests */}
      <AuditDecisionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        action={activeAction}
        request={selectedRequest}
        onConfirmDecision={(note) => {
          if (activeAction) executeDecision(activeAction, note);
        }}
      />
    </div>
  );
}
