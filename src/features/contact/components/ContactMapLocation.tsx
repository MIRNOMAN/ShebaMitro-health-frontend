"use client";

import React, { useState } from "react";
import { MapPin, Building, Clock, Phone } from "lucide-react";
import { OFFICE_LOCATIONS_DATA } from "../data/contactData";

export function ContactMapLocation() {
  const [selectedLocId, setSelectedLocId] = useState<string>(OFFICE_LOCATIONS_DATA[0]?.id || "");
  const selectedLoc = OFFICE_LOCATIONS_DATA.find((l) => l.id === selectedLocId) || OFFICE_LOCATIONS_DATA[0]!;

  return (
    <div className="rounded-3xl border border-card-border bg-card p-6 sm:p-8 space-y-6 shadow-xs">
      <div className="border-b border-card-border pb-4">
        <h3 className="text-xl font-extrabold text-fg-app flex items-center gap-2">
          <Building className="h-5 w-5 text-primary-teal" /> Our Regional Office Network
        </h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          Visit or contact our operational hubs across Dhaka, Chittagong, and Sylhet.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Office Selection List */}
        <div className="lg:col-span-5 space-y-3">
          {OFFICE_LOCATIONS_DATA.map((loc) => {
            const isSelected = loc.id === selectedLoc.id;

            return (
              <div
                key={loc.id}
                onClick={() => setSelectedLocId(loc.id)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all space-y-2 ${
                  isSelected
                    ? "border-primary-teal bg-primary-teal/10 shadow-xs"
                    : "border-card-border bg-muted/20 hover:bg-muted/40"
                }`}
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-xs text-fg-app">{loc.city}</h4>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-card text-primary-teal font-bold border border-card-border">
                    {loc.name}
                  </span>
                </div>

                <p className="text-xs text-muted-foreground flex items-start gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-primary-teal shrink-0 mt-0.5" />
                  <span>{loc.address}</span>
                </p>

                <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-2 border-t border-card-border/50">
                  <span className="flex items-center gap-1 font-mono font-bold text-fg-app">
                    <Phone className="h-3 w-3 text-muted-foreground" /> {loc.phone}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3 text-muted-foreground" /> {loc.hours}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Interactive Map Visual Frame */}
        <div className="lg:col-span-7 rounded-2xl overflow-hidden border border-card-border bg-slate-900 min-h-[300px] relative flex flex-col justify-end p-6">
          {/* Background Map Visual */}
          <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]" />

          <div className="relative z-10 p-4 rounded-2xl bg-card/90 backdrop-blur-md border border-card-border space-y-2 max-w-sm">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-rose-500 animate-bounce" />
              <h5 className="font-extrabold text-xs text-fg-app">{selectedLoc.name}</h5>
            </div>
            <p className="text-xs text-muted-foreground">{selectedLoc.address}</p>
            <span className="text-[10px] font-mono text-primary-teal font-bold block">
              GPS Coordinates: 23.7529° N, 90.3846° E (Dhanmondi Hub)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
