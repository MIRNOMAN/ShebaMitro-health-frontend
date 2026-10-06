"use client";

import React, { useState } from "react";
import { Hash, Printer, Code, CheckCircle, ExternalLink } from "lucide-react";
import { PublicRxVerificationProof } from "../../types/publicVerification";

interface CryptographicProofPanelProps {
  proof: PublicRxVerificationProof;
}

export function CryptographicProofPanel({ proof }: CryptographicProofPanelProps) {
  const [showRawJson, setShowRawJson] = useState(false);

  return (
    <div className="rounded-2xl border border-card-border bg-card p-5 space-y-4 shadow-xs">
      <div className="flex items-center justify-between border-b border-card-border pb-3">
        <h3 className="font-bold text-sm text-fg-app flex items-center gap-2">
          <Hash className="h-4 w-4 text-primary-teal" /> Public Cryptographic Proof Ledger
        </h3>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowRawJson((prev) => !prev)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-xl border border-card-border bg-card hover:bg-muted text-[11px] font-bold text-fg-app transition-colors"
          >
            <Code className="h-3.5 w-3.5 text-primary-teal" /> {showRawJson ? "Hide JSON Payload" : "View JSON Payload"}
          </button>

          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-primary-teal hover:bg-primary-teal/90 text-white font-bold text-[11px] transition-colors shadow-xs"
          >
            <Printer className="h-3.5 w-3.5" /> Print Verification Certificate
          </button>
        </div>
      </div>

      {/* Cryptographic Hashes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
        <div className="p-3 bg-muted/40 rounded-xl border border-card-border space-y-1">
          <span className="text-[10px] text-muted-foreground uppercase font-bold">SHA-256 Digital Signature Hash</span>
          <p className="font-mono text-xs font-bold text-primary-teal break-all">{proof.verificationHash}</p>
        </div>

        <div className="p-3 bg-muted/40 rounded-xl border border-card-border space-y-1">
          <span className="text-[10px] text-muted-foreground uppercase font-bold">Merkle Root & Ledger Block</span>
          <div className="flex items-center justify-between font-mono text-xs font-semibold text-fg-app">
            <span className="break-all">{proof.merkleRootHash}</span>
            <span className="px-2 py-0.5 rounded bg-muted text-[10px] font-bold border border-card-border shrink-0">
              Block #{proof.blockchainLedgerBlock}
            </span>
          </div>
        </div>
      </div>

      {/* Raw JSON Drawer */}
      {showRawJson && (
        <div className="p-4 bg-slate-900 text-slate-100 rounded-xl font-mono text-[11px] overflow-x-auto border border-card-border space-y-2 animate-in fade-in duration-200">
          <div className="flex justify-between items-center text-slate-400 text-[10px] border-b border-slate-800 pb-1">
            <span>GET /api/v1/public/verify-rx/{proof.rxId}</span>
            <span className="text-emerald-400">200 OK</span>
          </div>
          <pre>{JSON.stringify(proof, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
