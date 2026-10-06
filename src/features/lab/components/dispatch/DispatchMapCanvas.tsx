import React from "react";
import { Navigation, Building2, MapPin, Send, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HomePickupRequest } from "../../types";

interface DispatchMapCanvasProps {
  pickups: HomePickupRequest[];
  selectedPickup: HomePickupRequest;
  selectedPickupId: string;
  onSelectPickup: (id: string) => void;
  onSendSms: (id: string) => void;
  onOpenTechSimulator: (pickup: HomePickupRequest) => void;
}

export function DispatchMapCanvas({
  pickups,
  selectedPickup,
  selectedPickupId,
  onSelectPickup,
  onSendSms,
  onOpenTechSimulator,
}: DispatchMapCanvasProps) {
  return (
    <div className="lg:col-span-7 flex flex-col rounded-2xl border border-card-border bg-card p-5 space-y-4 shadow-xs relative overflow-hidden min-h-[520px]">
      <div className="flex items-center justify-between border-b border-card-border pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-purple-500/10 text-purple-500">
            <Navigation className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-fg-app">Interactive Dhaka Dispatch Map</h3>
            <p className="text-[11px] text-muted-foreground">
              Live phlebotomist beacons & home pickup locations
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-3 text-[10px] font-semibold">
          <span className="flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500" /> Pending
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-full bg-blue-500" /> Assigned / En Route
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> Collected
          </span>
        </div>
      </div>

      {/* SVG Canvas Map */}
      <div className="relative flex-1 rounded-xl bg-slate-900 border border-slate-800 overflow-hidden min-h-[400px] flex items-center justify-center">
        <svg className="absolute inset-0 w-full h-full opacity-25 pointer-events-none">
          <defs>
            <pattern id="grid-dispatch" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#38bdf8" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-dispatch)" />
          <line x1="10%" y1="10%" x2="90%" y2="90%" stroke="#38bdf8" strokeWidth="2" strokeDasharray="4 4" />
          <line x1="10%" y1="70%" x2="80%" y2="20%" stroke="#a855f7" strokeWidth="2" />
        </svg>

        <div className="absolute top-4 left-6 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest pointer-events-none">Uttara Sector 4</div>
        <div className="absolute top-1/4 left-1/4 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest pointer-events-none">Mirpur 10</div>
        <div className="absolute top-1/3 right-8 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest pointer-events-none">Banani / Gulshan</div>
        <div className="absolute bottom-1/4 left-1/3 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest pointer-events-none">Dhanmondi Lake Zone</div>
        <div className="absolute bottom-6 right-1/4 text-[10px] font-mono font-bold text-purple-400 uppercase tracking-widest pointer-events-none flex items-center gap-1">
          <Building2 className="h-3 w-3" /> Central Lab Hub (Panthapath)
        </div>

        {/* Central Hub Pin */}
        <div className="absolute top-[52%] left-[48%] -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center">
          <div className="h-8 w-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold shadow-lg ring-4 ring-purple-500/30 animate-pulse">
            <Building2 className="h-4 w-4" />
          </div>
          <span className="text-[9px] font-extrabold bg-slate-950/90 text-purple-300 px-2 py-0.5 rounded-full border border-purple-500/40 mt-1">
            Central Lab Hub
          </span>
        </div>

        {/* Interactive Pickup Markers */}
        {pickups.map((p) => {
          const isSelected = p.id === selectedPickupId;
          const markerColor =
            p.status === "Pending Assignment"
              ? "bg-amber-500 ring-amber-500/30"
              : p.status === "Sample Collected"
              ? "bg-emerald-500 ring-emerald-500/30"
              : "bg-blue-500 ring-blue-500/30";

          return (
            <button
              key={p.id}
              onClick={() => onSelectPickup(p.id)}
              style={{ top: `${p.mapCoords.y}%`, left: `${p.mapCoords.x}%` }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 transition-transform duration-300 hover:scale-125 z-20 group ${
                isSelected ? "scale-125 z-30" : ""
              }`}
            >
              <div className="relative flex flex-col items-center">
                <div className={`h-7 w-7 rounded-full ${markerColor} flex items-center justify-center text-white shadow-lg ring-4 ${isSelected ? "ring-white" : ""}`}>
                  <MapPin className="h-4 w-4" />
                </div>
                <div className={`mt-1 whitespace-nowrap p-1.5 rounded-lg bg-slate-900/95 border border-slate-700 text-white text-[10px] shadow-2xl transition-all ${isSelected ? "opacity-100 scale-100" : "opacity-0 group-hover:opacity-100 scale-95"}`}>
                  <span className="font-bold block truncate">{p.patientName}</span>
                  <span className="text-[9px] text-slate-300 block">{p.areaZone} • {p.status}</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Location Card Overlay */}
      {selectedPickup && (
        <div className="p-4 rounded-xl bg-surface-card-hover/80 border border-card-border space-y-3 text-xs">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider block">
                Selected Location ({selectedPickup.areaZone})
              </span>
              <h4 className="font-bold text-sm text-fg-app">{selectedPickup.patientName}</h4>
            </div>

            <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] border ${selectedPickup.status === "Pending Assignment" ? "bg-amber-500/10 text-amber-500 border-amber-500/30" : selectedPickup.status === "Sample Collected" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/30" : "bg-blue-500/10 text-blue-500 border-blue-500/30"}`}>
              {selectedPickup.status}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
            <p className="text-muted-foreground">Address: <span className="font-semibold text-fg-app">{selectedPickup.address}</span></p>
            <p className="text-muted-foreground">Phone: <span className="font-mono font-bold text-primary-teal">{selectedPickup.patientPhone}</span></p>
            <p className="text-muted-foreground">Time Slot: <span className="font-bold text-fg-app">{selectedPickup.collectionTimeSlot}</span></p>
            <p className="text-muted-foreground">Collection PIN: <span className="font-mono font-extrabold text-purple-500 tracking-wider">{selectedPickup.collectionPin || "Unassigned"}</span></p>
          </div>

          <div className="flex flex-wrap items-center justify-between pt-2 border-t border-card-border/60 gap-2">
            <span className="text-[11px] text-muted-foreground">
              Assigned Phlebotomist: <span className="font-bold text-fg-app">{selectedPickup.phlebotomistName || "None Assigned"}</span>
            </span>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => onSendSms(selectedPickup.id)} className="h-7 text-[11px] font-semibold">
                <Send className="h-3 w-3 mr-1 text-primary-teal" /> Send SMS PIN
              </Button>
              <Button variant="primary" size="sm" onClick={() => onOpenTechSimulator(selectedPickup)} className="h-7 text-[11px] font-bold">
                <Smartphone className="h-3 w-3 mr-1" /> Tech Simulator
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
