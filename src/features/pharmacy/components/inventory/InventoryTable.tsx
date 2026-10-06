import React from "react";
import { AlertTriangle, Clock, Pill } from "lucide-react";
import { MedicineInventoryItem } from "../../types";

interface InventoryTableProps {
  items: MedicineInventoryItem[];
}

export function InventoryTable({ items }: InventoryTableProps) {
  // Helper to check if date string YYYY-MM-DD is within 60 days from today (2026-10-06)
  const isExpiringWithin60Days = (expiryDateStr: string) => {
    const today = new Date("2026-10-06").getTime();
    const expTime = new Date(expiryDateStr).getTime();
    const diffDays = Math.ceil((expTime - today) / (1000 * 60 * 60 * 24));
    return diffDays > 0 && diffDays <= 60;
  };

  const getDaysRemaining = (expiryDateStr: string) => {
    const today = new Date("2026-10-06").getTime();
    const expTime = new Date(expiryDateStr).getTime();
    return Math.ceil((expTime - today) / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="rounded-2xl border border-card-border bg-card overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-card-border bg-surface-card-hover/60 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              <th className="p-4">Brand & Generic Name</th>
              <th className="p-4">Formulation</th>
              <th className="p-4">Batch Number</th>
              <th className="p-4">Expiry Date</th>
              <th className="p-4">Available Units</th>
              <th className="p-4 text-right">Unit Price</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-card-border text-xs">
            {items.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-muted-foreground">
                  No matching medicine inventory items found.
                </td>
              </tr>
            ) : (
              items.map((item) => {
                const isLowStock = item.availableUnits < 20;
                const isExpiring = isExpiringWithin60Days(item.expiryDate);
                const daysRemaining = getDaysRemaining(item.expiryDate);

                return (
                  <tr
                    key={item.id}
                    className={`transition-colors hover:bg-surface-card-hover/40 ${
                      isLowStock || isExpiring ? "bg-rose-500/5 dark:bg-rose-500/10" : ""
                    }`}
                  >
                    {/* Brand Name & Generic Name */}
                    <td className="p-4">
                      <span className="font-bold text-sm text-fg-app block">
                        {item.brandName} ({item.strength})
                      </span>
                      <span className="text-[11px] text-muted-foreground block line-clamp-1">
                        {item.genericName} • <span className="font-medium text-fg-app">{item.manufacturer}</span>
                      </span>
                    </td>

                    {/* Formulation */}
                    <td className="p-4 whitespace-nowrap">
                      <span className="px-2.5 py-1 rounded-lg bg-muted border border-card-border font-semibold text-xs text-fg-app inline-flex items-center gap-1">
                        <Pill className="h-3 w-3 text-purple-500" />
                        {item.formulation}
                      </span>
                    </td>

                    {/* Batch Number */}
                    <td className="p-4 font-mono font-bold text-fg-app whitespace-nowrap">
                      {item.batchNo}
                    </td>

                    {/* Expiry Date */}
                    <td className="p-4 whitespace-nowrap">
                      <span className="font-mono font-bold text-fg-app block">
                        {item.expiryDate}
                      </span>
                      {isExpiring && (
                        <span className="px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-500 border border-amber-500/30 text-[10px] font-extrabold flex items-center gap-1 mt-1 animate-pulse">
                          <Clock className="h-3 w-3" /> EXPIRING IN {daysRemaining} DAYS
                        </span>
                      )}
                    </td>

                    {/* Available Units & Low Stock Badge */}
                    <td className="p-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-mono text-base font-extrabold ${
                            isLowStock ? "text-rose-500" : "text-fg-app"
                          }`}
                        >
                          {item.availableUnits} Units
                        </span>

                        {isLowStock && (
                          <span className="px-2.5 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-extrabold uppercase tracking-wider shadow-xs flex items-center gap-1">
                            <AlertTriangle className="h-3 w-3" /> LOW STOCK
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Unit Price */}
                    <td className="p-4 text-right whitespace-nowrap">
                      <span className="font-mono font-bold text-sm text-fg-app">
                        ৳{item.unitPrice.toFixed(2)}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
