import React from "react";
import { Truck, Search, Send, CheckCircle2, User } from "lucide-react";
import { HomePickupRequest, Phlebotomist } from "../../types";

const TIME_SLOT_OPTIONS = [
  "08:00 AM - 09:00 AM",
  "09:30 AM - 10:30 AM",
  "11:00 AM - 12:00 PM",
  "01:30 PM - 02:30 PM",
  "03:00 PM - 04:00 PM",
  "05:00 PM - 06:00 PM",
];

interface PickupQueueSidebarProps {
  pickups: HomePickupRequest[];
  filteredPickups: HomePickupRequest[];
  selectedPickupId: string;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  statusFilter: string;
  setStatusFilter: (s: string) => void;
  phlebotomists: Phlebotomist[];
  onSelectPickup: (id: string) => void;
  onAssignPhlebotomist: (pickupId: string, phleboId: string) => void;
  onUpdateTimeSlot: (pickupId: string, slot: string) => void;
  onSendSms: (id: string) => void;
}

export function PickupQueueSidebar({
  pickups,
  filteredPickups,
  selectedPickupId,
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  phlebotomists,
  onSelectPickup,
  onAssignPhlebotomist,
  onUpdateTimeSlot,
  onSendSms,
}: PickupQueueSidebarProps) {
  return (
    <div className="lg:col-span-5 flex flex-col space-y-5">
      {/* Pickup Queue Box */}
      <div className="rounded-2xl border border-card-border bg-card p-5 space-y-4 shadow-xs">
        <div className="flex items-center justify-between border-b border-card-border pb-3">
          <h3 className="font-bold text-sm text-fg-app flex items-center gap-2">
            <Truck className="h-4 w-4 text-purple-500" /> Home Sample Queue
          </h3>

          <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-xl text-[10px] font-semibold">
            <button
              onClick={() => setStatusFilter("ALL")}
              className={`px-2 py-0.5 rounded-lg transition-colors ${statusFilter === "ALL" ? "bg-card text-fg-app shadow-xs" : "text-muted-foreground"}`}
            >
              All ({pickups.length})
            </button>
            <button
              onClick={() => setStatusFilter("UNASSIGNED")}
              className={`px-2 py-0.5 rounded-lg transition-colors ${statusFilter === "UNASSIGNED" ? "bg-card text-amber-500 font-bold shadow-xs" : "text-muted-foreground"}`}
            >
              Unassigned
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search patient, phone, or area..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-8 pl-8 pr-3 rounded-lg bg-card border border-card-border text-xs text-fg-app"
          />
        </div>

        {/* List */}
        <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
          {filteredPickups.map((p) => {
            const isSelected = p.id === selectedPickupId;
            return (
              <div
                key={p.id}
                onClick={() => onSelectPickup(p.id)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer space-y-2.5 ${
                  isSelected
                    ? "border-primary-teal/50 bg-primary-teal/10 shadow-xs"
                    : "border-card-border bg-surface-card-hover/40 hover:border-card-border/80"
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono font-bold text-fg-app">{p.id}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${p.status === "Pending Assignment" ? "bg-amber-500/10 text-amber-500 border-amber-500/30" : p.status === "Sample Collected" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/30" : "bg-blue-500/10 text-blue-500 border-blue-500/30"}`}>
                    {p.status}
                  </span>
                </div>

                <div>
                  <h5 className="font-bold text-xs text-fg-app">{p.patientName}</h5>
                  <p className="text-[11px] text-muted-foreground line-clamp-1">{p.testName}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1 border-t border-card-border/50">
                  <div className="space-y-0.5">
                    <label className="text-[10px] font-bold text-muted-foreground block">Assign Phlebotomist:</label>
                    <select
                      value={p.phlebotomistId || ""}
                      onChange={(e) => onAssignPhlebotomist(p.id, e.target.value)}
                      className="w-full h-7 px-2 rounded-lg bg-card border border-card-border text-[11px] font-semibold text-fg-app"
                    >
                      <option value="" disabled>-- Select Staff --</option>
                      {phlebotomists.map((phlebo) => (
                        <option key={phlebo.id} value={phlebo.id}>
                          {phlebo.name} ({phlebo.status})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-0.5">
                    <label className="text-[10px] font-bold text-muted-foreground block">Time Slot:</label>
                    <select
                      value={p.collectionTimeSlot}
                      onChange={(e) => onUpdateTimeSlot(p.id, e.target.value)}
                      className="w-full h-7 px-2 rounded-lg bg-card border border-card-border text-[11px] font-semibold text-fg-app"
                    >
                      {TIME_SLOT_OPTIONS.map((slot) => (
                        <option key={slot} value={slot}>{slot}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] pt-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSendSms(p.id);
                    }}
                    className="text-primary-teal font-semibold hover:underline flex items-center gap-1"
                  >
                    <Send className="h-3 w-3" /> SMS PIN ({p.collectionPin})
                  </button>

                  {p.smsSent && (
                    <span className="text-[10px] font-bold text-emerald-500 flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" /> SMS Dispatched
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Staff Fleet */}
      <div className="rounded-2xl border border-card-border bg-card p-5 space-y-3 shadow-xs">
        <h3 className="font-bold text-sm text-fg-app flex items-center gap-2 border-b border-card-border pb-2">
          <User className="h-4 w-4 text-primary-teal" /> Phlebotomist Staff Fleet ({phlebotomists.length})
        </h3>

        <div className="space-y-2 text-xs">
          {phlebotomists.map((st) => (
            <div key={st.id} className="p-2.5 rounded-xl border border-card-border bg-surface-card-hover/40 flex items-center justify-between">
              <div className="space-y-0.5 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-fg-app truncate">{st.name}</span>
                  <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${st.status === "Available" ? "bg-emerald-500/10 text-emerald-500" : st.status === "En Route" ? "bg-blue-500/10 text-blue-500" : "bg-amber-500/10 text-amber-500"}`}>
                    {st.status}
                  </span>
                </div>
                <p className="text-[10px] text-muted-foreground truncate">{st.vehicle} • {st.zone}</p>
              </div>

              <div className="text-right shrink-0">
                <span className="font-mono font-bold text-xs text-primary-teal block">★ {st.rating}</span>
                <span className="text-[10px] text-muted-foreground block">{st.pickupsToday} Pickups</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
