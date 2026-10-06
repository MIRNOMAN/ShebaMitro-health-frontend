import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, X, AlertTriangle, Clock, Send, CheckCircle2, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MedicineInventoryItem, WholesaleReorderItem } from "../../types";

interface ReorderPoModalProps {
  isOpen: boolean;
  onClose: () => void;
  reorderItems: WholesaleReorderItem[];
  onSubmitPo: (poNumber: string) => void;
}

export function ReorderPoModal({
  isOpen,
  onClose,
  reorderItems,
  onSubmitPo,
}: ReorderPoModalProps) {
  if (!isOpen) return null;

  const poNumber = `PO-2026-${Math.floor(1000 + Math.random() * 9000)}`;
  const totalCost = reorderItems.reduce(
    (sum, item) => sum + item.reorderUnits * item.estimatedUnitPrice,
    0
  );

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-2xl rounded-2xl border border-card-border bg-card p-6 shadow-2xl z-10 space-y-5 max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-card-border pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-primary-teal/15 text-primary-teal">
                <ShoppingCart className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-fg-app">Wholesale Reorder Purchase Order (PO)</h3>
                <p className="text-xs text-muted-foreground">
                  Auto-generated for low stock (&lt; 20 units) and expiring stock (&lt; 60 days)
                </p>
              </div>
            </div>
            <button onClick={onClose} className="p-1 rounded-lg bg-muted text-muted-foreground hover:text-fg-app">
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* PO Summary Header */}
          <div className="p-4 rounded-xl bg-surface-card-hover border border-card-border flex flex-wrap items-center justify-between gap-3 text-xs">
            <div>
              <span className="text-[10px] font-bold uppercase text-muted-foreground block">PO Reference:</span>
              <span className="font-mono font-extrabold text-sm text-fg-app">{poNumber}</span>
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase text-muted-foreground block">Items Reordered:</span>
              <span className="font-bold text-primary-teal">{reorderItems.length} Products</span>
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase text-muted-foreground block">Est. Wholesale Cost:</span>
              <span className="font-mono font-extrabold text-emerald-600 dark:text-emerald-400 text-sm">
                ৳{totalCost.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Reorder Items List */}
          <div className="space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
              1-Click Reorder Item Breakdown:
            </span>

            {reorderItems.map((item, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl border border-card-border bg-card space-y-2 text-xs"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h5 className="font-bold text-sm text-fg-app">{item.brandName}</h5>
                    <p className="text-[11px] text-muted-foreground">{item.genericName}</p>
                  </div>

                  <span
                    className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] border ${
                      item.reason.includes("Low Stock")
                        ? "bg-rose-500/10 text-rose-500 border-rose-500/30"
                        : "bg-amber-500/10 text-amber-500 border-amber-500/30"
                    }`}
                  >
                    {item.reason}
                  </span>
                </div>

                <div className="flex flex-wrap items-center justify-between pt-1 border-t border-card-border/60 text-[11px]">
                  <span className="text-muted-foreground">
                    Manufacturer: <strong className="text-fg-app">{item.manufacturer}</strong>
                  </span>
                  <span className="font-mono text-fg-app font-bold">
                    Reorder Qty: <strong className="text-primary-teal">{item.reorderUnits} Units</strong> @ ৳{item.estimatedUnitPrice}/unit
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-card-border">
            <span className="text-[11px] text-muted-foreground">
              Direct dispatch to Beximco, Square, Incepta & Sanofi wholesale hubs.
            </span>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={onClose}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => onSubmitPo(poNumber)}
                className="font-bold shadow-md glow-teal"
              >
                <Send className="h-4 w-4 mr-1.5" /> Submit Wholesale PO to Depot
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
