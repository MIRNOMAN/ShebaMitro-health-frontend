"use client";

import React from "react";
import { Pill, Plus, CheckCircle2, FileText, ShoppingBag } from "lucide-react";
import { Medicine } from "../types";
import { usePharmacyCart } from "../context/PharmacyCartContext";
import { Button } from "@/components/ui/button";

interface MedicineCardProps {
  medicine: Medicine;
}

export function MedicineCard({ medicine }: MedicineCardProps) {
  const { addToCart, cartItems } = usePharmacyCart();

  const cartEntry = cartItems.find((item) => item.medicine.id === medicine.id);
  const isInCart = Boolean(cartEntry);

  return (
    <div className="group relative rounded-2xl border border-card-border bg-card p-4 shadow-xs hover:border-luminous transition-all duration-300 hover:shadow-md flex flex-col justify-between overflow-hidden">
      <div className="space-y-3">
        {/* Type & Rx Badge */}
        <div className="flex items-center justify-between text-[11px]">
          <span className="font-bold text-primary-teal bg-primary-teal/10 px-2 py-0.5 rounded-md border border-primary-teal/20">
            {medicine.type} • {medicine.strength}
          </span>

          {medicine.requiresPrescription ? (
            <span className="font-semibold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20 flex items-center gap-1">
              <FileText className="h-3 w-3" /> Rx Required
            </span>
          ) : (
            <span className="font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
              OTC Safe
            </span>
          )}
        </div>

        {/* Medicine Name & Generic */}
        <div className="space-y-1">
          <h4 className="font-bold text-base text-fg-app group-hover:text-primary-teal transition-colors line-clamp-1">
            {medicine.name}
          </h4>
          <p className="text-xs text-muted-foreground line-clamp-1 italic">
            {medicine.genericName}
          </p>
          <p className="text-[11px] text-muted-foreground line-clamp-1 font-medium">
            {medicine.manufacturer}
          </p>
        </div>

        {/* Pack Size */}
        <div className="text-xs text-fg-app/80 font-medium bg-muted/40 p-2 rounded-lg border border-card-border/40">
          Pack Size: <span className="font-semibold text-fg-app">{medicine.packSize}</span>
        </div>
      </div>

      {/* Footer Price & Action */}
      <div className="mt-4 pt-3 border-t border-card-border flex items-center justify-between gap-2">
        <div>
          <span className="text-[10px] text-muted-foreground uppercase font-bold block">Price</span>
          <div className="flex items-center gap-1.5">
            <span className="text-base font-extrabold text-emerald-600 dark:text-emerald-400">
              ৳{medicine.price}
            </span>
            {medicine.originalPrice && (
              <span className="text-xs text-muted-foreground line-through">
                ৳{medicine.originalPrice}
              </span>
            )}
          </div>
        </div>

        <Button
          variant={isInCart ? "emerald" : "primary"}
          size="sm"
          onClick={() => addToCart(medicine, 1)}
          className="h-9 px-3 text-xs shadow-xs"
        >
          {isInCart ? (
            <span className="flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5" /> Added ({cartEntry?.quantity})
            </span>
          ) : (
            <span className="flex items-center gap-1">
              <Plus className="h-3.5 w-3.5" /> Add
            </span>
          )}
        </Button>
      </div>
    </div>
  );
}
