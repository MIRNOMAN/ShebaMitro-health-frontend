import React from "react";
import { Search, User, FlaskConical, Pill, ShieldCheck, Clock } from "lucide-react";
import { ProviderRegistrationRequest, ProviderType } from "../types";

interface ProviderQueueListProps {
  requests: ProviderRegistrationRequest[];
  selectedReqId: string;
  onSelectReq: (id: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  typeFilter: string;
  setTypeFilter: (t: string) => void;
}

export function ProviderQueueList({
  requests,
  selectedReqId,
  onSelectReq,
  searchQuery,
  setSearchQuery,
  typeFilter,
  setTypeFilter,
}: ProviderQueueListProps) {
  const filtered = requests.filter((req) => {
    const q = searchQuery.toLowerCase().trim();
    const matchSearch =
      !q ||
      req.entityName.toLowerCase().includes(q) ||
      req.bmdcOrLicenseNo.toLowerCase().includes(q) ||
      req.id.toLowerCase().includes(q) ||
      req.cityZone.toLowerCase().includes(q);

    const matchType = typeFilter === "ALL" || req.providerType === typeFilter;
    return matchSearch && matchType;
  });

  const getProviderIcon = (type: ProviderType) => {
    switch (type) {
      case "Doctor":
        return <User className="h-4 w-4 text-purple-500" />;
      case "Diagnostic Lab":
        return <FlaskConical className="h-4 w-4 text-blue-500" />;
      case "Pharmacy":
        return <Pill className="h-4 w-4 text-amber-500" />;
    }
  };

  return (
    <div className="rounded-2xl border border-card-border bg-card p-5 space-y-4 shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-card-border pb-3">
        <h3 className="font-bold text-sm text-fg-app flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-primary-teal" /> Verification Audit Queue
        </h3>

        <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-primary-teal/10 text-primary-teal border border-primary-teal/20">
          {requests.filter((r) => r.status === "Pending Audit").length} Pending
        </span>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-xl text-[10px] font-semibold">
        <button
          onClick={() => setTypeFilter("ALL")}
          className={`px-2.5 py-1 rounded-lg transition-colors ${
            typeFilter === "ALL" ? "bg-card text-primary-teal font-bold shadow-xs" : "text-muted-foreground"
          }`}
        >
          All ({requests.length})
        </button>
        <button
          onClick={() => setTypeFilter("Doctor")}
          className={`px-2.5 py-1 rounded-lg transition-colors ${
            typeFilter === "Doctor" ? "bg-card text-purple-500 font-bold shadow-xs" : "text-muted-foreground"
          }`}
        >
          Doctors
        </button>
        <button
          onClick={() => setTypeFilter("Diagnostic Lab")}
          className={`px-2.5 py-1 rounded-lg transition-colors ${
            typeFilter === "Diagnostic Lab" ? "bg-card text-blue-500 font-bold shadow-xs" : "text-muted-foreground"
          }`}
        >
          Labs
        </button>
        <button
          onClick={() => setTypeFilter("Pharmacy")}
          className={`px-2.5 py-1 rounded-lg transition-colors ${
            typeFilter === "Pharmacy" ? "bg-card text-amber-500 font-bold shadow-xs" : "text-muted-foreground"
          }`}
        >
          Pharmacies
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search name, BMDC, license #, or city..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full h-8 pl-8 pr-3 rounded-lg bg-card border border-card-border text-xs text-fg-app"
        />
      </div>

      {/* List */}
      <div className="space-y-2.5 max-h-[440px] overflow-y-auto pr-1">
        {filtered.length === 0 ? (
          <div className="p-6 text-center text-xs text-muted-foreground border border-dashed border-card-border rounded-xl">
            No matching provider requests found.
          </div>
        ) : (
          filtered.map((req) => {
            const isSelected = req.id === selectedReqId;

            return (
              <div
                key={req.id}
                onClick={() => onSelectReq(req.id)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer space-y-1.5 ${
                  isSelected
                    ? "border-primary-teal bg-primary-teal/10 shadow-xs"
                    : "border-card-border bg-surface-card-hover/40 hover:border-card-border/80"
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono font-bold text-fg-app flex items-center gap-1.5">
                    {getProviderIcon(req.providerType)}
                    {req.id}
                  </span>
                  <span
                    className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full border ${
                      req.status === "Pending Audit"
                        ? "bg-amber-500/10 text-amber-500 border-amber-500/30"
                        : req.status === "Approved"
                        ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/30"
                        : "bg-rose-500/10 text-rose-500 border-rose-500/30"
                    }`}
                  >
                    {req.status}
                  </span>
                </div>

                <div>
                  <h5 className="font-bold text-xs text-fg-app truncate">{req.entityName}</h5>
                  <p className="text-[10px] text-muted-foreground truncate">
                    {req.specialtyOrCategory} • {req.cityZone}
                  </p>
                </div>

                <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-1 border-t border-card-border/50">
                  <span className="font-mono text-fg-app font-semibold">
                    License: {req.bmdcOrLicenseNo}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3 text-muted-foreground" /> {req.registeredAt}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
