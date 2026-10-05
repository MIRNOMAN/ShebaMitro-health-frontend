"use client";

import React, { useState } from "react";
import { Navigation, MapPin } from "lucide-react";
import { DeliveryAddress } from "../types";

interface PharmacyMapPickerProps {
  address: DeliveryAddress;
  onUpdateAddress: (address: DeliveryAddress) => void;
}

const DHAKA_AREAS = [
  { name: "Dhanmondi", lat: 23.7461, lng: 90.3742 },
  { name: "Gulshan 1 & 2", lat: 23.7925, lng: 90.4078 },
  { name: "Banani", lat: 23.7937, lng: 90.4047 },
  { name: "Uttara", lat: 23.8759, lng: 90.3795 },
  { name: "Mirpur", lat: 23.8069, lng: 90.3687 },
  { name: "Mohammadpur", lat: 23.7571, lng: 90.3621 },
  { name: "Bashundhara R/A", lat: 23.8191, lng: 90.4358 },
];

export function PharmacyMapPicker({ address, onUpdateAddress }: PharmacyMapPickerProps) {
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [selectedAreaName, setSelectedAreaName] = useState<string>(address.area);
  const [addressLine, setAddressLine] = useState<string>(address.addressLine);
  const [phone, setPhone] = useState<string>(address.phone);

  const handleUseCurrentLocation = () => {
    setIsLocating(true);
    setTimeout(() => {
      setIsLocating(false);
      const defaultArea = DHAKA_AREAS[0] || { name: "Dhanmondi", lat: 23.7461, lng: 90.3742 };
      setSelectedAreaName(defaultArea.name);
      const newAddr: DeliveryAddress = {
        ...address,
        area: defaultArea.name,
        lat: 23.7461 + (Math.random() - 0.5) * 0.01,
        lng: 90.3742 + (Math.random() - 0.5) * 0.01,
        addressLine: `GPS Pin Location #${Math.floor(100 + Math.random() * 900)}, ${defaultArea.name}, Dhaka`,
      };
      setAddressLine(newAddr.addressLine);
      onUpdateAddress(newAddr);
    }, 500);
  };

  const handleAreaChange = (areaObj: (typeof DHAKA_AREAS)[0]) => {
    setSelectedAreaName(areaObj.name);
    const updated: DeliveryAddress = {
      ...address,
      area: areaObj.name,
      lat: areaObj.lat,
      lng: areaObj.lng,
      addressLine: addressLine.includes(areaObj.name)
        ? addressLine
        : `House 18, Road 4, ${areaObj.name}, Dhaka`,
    };
    setAddressLine(updated.addressLine);
    onUpdateAddress(updated);
  };

  return (
    <div className="space-y-3 p-4 rounded-xl border border-primary-teal/30 bg-primary-teal/5 dark:bg-primary-teal/10">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold uppercase tracking-wider text-fg-app flex items-center gap-1.5">
          <MapPin className="h-4 w-4 text-primary-teal" /> Delivery Address Pin-on-Map
        </label>

        <button
          type="button"
          onClick={handleUseCurrentLocation}
          disabled={isLocating}
          className="text-xs font-semibold text-primary-teal hover:underline flex items-center gap-1 bg-primary-teal/10 px-2.5 py-1 rounded-lg border border-primary-teal/20"
        >
          <Navigation className={`h-3.5 w-3.5 ${isLocating ? "animate-spin" : ""}`} />
          {isLocating ? "Locating..." : "Pin GPS Location"}
        </button>
      </div>

      {/* Map Frame Pinhead Visual */}
      <div className="relative h-28 w-full rounded-xl overflow-hidden border border-card-border bg-slate-900 flex items-center justify-center">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `radial-gradient(#06b6d4 1px, transparent 1px)`,
            backgroundSize: "16px 16px",
          }}
        />

        <div className="absolute h-16 w-16 rounded-full border border-primary-teal/40 animate-ping" />

        <div className="relative z-10 flex flex-col items-center">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-teal text-white shadow-lg ring-4 ring-primary-teal/30 animate-bounce">
            <MapPin className="h-4 w-4 fill-white" />
          </div>
          <span className="mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-950/90 text-white border border-primary-teal/40 shadow-xs">
            {selectedAreaName} ({address.lat.toFixed(4)}, {address.lng.toFixed(4)})
          </span>
        </div>
      </div>

      {/* Neighborhood chips */}
      <div className="space-y-1.5">
        <span className="text-[11px] font-semibold text-muted-foreground block">Select Area:</span>
        <div className="flex flex-wrap gap-1.5">
          {DHAKA_AREAS.map((area) => {
            const isSelected = selectedAreaName === area.name;
            return (
              <button
                key={area.name}
                type="button"
                onClick={() => handleAreaChange(area)}
                className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border transition-all ${
                  isSelected
                    ? "bg-primary-teal text-white border-primary-teal shadow-xs"
                    : "border-card-border/80 bg-card hover:bg-muted/40 text-fg-app"
                }`}
              >
                {area.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Street Address & Phone Inputs */}
      <div className="space-y-2">
        <input
          type="text"
          value={addressLine}
          onChange={(e) => {
            setAddressLine(e.target.value);
            onUpdateAddress({ ...address, addressLine: e.target.value });
          }}
          placeholder="House, Flat No, Road Name, Landmarks..."
          className="w-full h-9 px-3 rounded-lg bg-card border border-card-border text-xs text-fg-app placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary-teal"
        />

        <input
          type="text"
          value={phone}
          onChange={(e) => {
            setPhone(e.target.value);
            onUpdateAddress({ ...address, phone: e.target.value });
          }}
          placeholder="Contact Phone Number for Delivery Rider"
          className="w-full h-9 px-3 rounded-lg bg-card border border-card-border text-xs text-fg-app placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary-teal"
        />
      </div>
    </div>
  );
}
