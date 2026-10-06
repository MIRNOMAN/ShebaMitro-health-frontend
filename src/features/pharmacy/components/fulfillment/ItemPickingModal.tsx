import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Pill, X, Building2, Check, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PharmacyOrder } from "./ActiveOrdersGrid";

interface ItemPickingModalProps {
  order: PharmacyOrder | null;
  generatedBarcode: string;
  setGeneratedBarcode: (code: string) => void;
  onToggleItem: (itemId: string) => void;
  onClose: () => void;
  onConfirmPicking: () => void;
}

export function ItemPickingModal({
  order,
  generatedBarcode,
  setGeneratedBarcode,
  onToggleItem,
  onClose,
  onConfirmPicking,
}: ItemPickingModalProps) {
  if (!order) return null;

  const pickedCount = order.items.filter((i) => i.picked).length;

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
          className="relative w-full max-w-xl rounded-2xl border border-card-border bg-card p-6 shadow-2xl z-10 space-y-5 max-h-[90vh] overflow-y-auto"
        >
          <div className="flex items-center justify-between border-b border-card-border pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-purple-500/15 text-purple-500">
                <Pill className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-fg-app">Pharmacist Drawer Item Picking</h3>
                <p className="text-xs text-muted-foreground">
                  Order #{order.orderNumber} • {order.patientName}
                </p>
              </div>
            </div>
            <button onClick={onClose} className="p-1 rounded-lg bg-muted text-muted-foreground hover:text-fg-app">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="p-3.5 rounded-xl bg-surface-card-hover border border-card-border space-y-2 text-xs">
            <div className="flex items-center justify-between font-bold text-fg-app">
              <span>Item Picking Checklist:</span>
              <span className="text-primary-teal">
                {pickedCount} of {order.items.length} Checked Off
              </span>
            </div>
            <div className="h-2 w-full bg-card rounded-full overflow-hidden border border-card-border">
              <div
                className="h-full bg-primary-teal transition-all duration-300"
                style={{ width: `${(pickedCount / order.items.length) * 100}%` }}
              />
            </div>
          </div>

          <div className="space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
              Verify & Check Off Prescribed Strengths & Drawer Location Codes:
            </span>

            {order.items.map((item) => (
              <div
                key={item.id}
                onClick={() => onToggleItem(item.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  item.picked ? "border-emerald-500/40 bg-emerald-500/10 shadow-xs" : "border-card-border bg-card hover:border-purple-500/40"
                }`}
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-fg-app truncate">{item.name}</span>
                    <span className="px-2 py-0.5 rounded bg-muted text-[10px] font-bold text-purple-500">
                      {item.strength}
                    </span>
                  </div>

                  <p className="text-[11px] font-mono text-purple-600 dark:text-purple-400 font-bold flex items-center gap-1">
                    <Building2 className="h-3.5 w-3.5" /> Drawer Location:{" "}
                    <span className="px-2 py-0.5 rounded bg-card border border-card-border text-fg-app">
                      {item.drawerCode}
                    </span>
                  </p>

                  <p className="text-[10px] text-muted-foreground">
                    Form: {item.form} • Prescribed Qty: <strong className="text-fg-app">{item.qtyPrescribed} units</strong>
                  </p>
                </div>

                <div className="shrink-0">
                  <div className={`h-7 w-7 rounded-xl border flex items-center justify-center transition-colors ${item.picked ? "bg-emerald-500 text-white border-emerald-500 shadow-md" : "border-card-border bg-card text-muted-foreground"}`}>
                    <Check className="h-4 w-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-xl border border-card-border bg-card space-y-2 text-xs">
            <label className="font-bold text-fg-app block">Assign Delivery Package Barcode:</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={generatedBarcode}
                onChange={(e) => setGeneratedBarcode(e.target.value)}
                placeholder="PKG-PH-8801-DHA"
                className="flex-1 h-9 px-3 rounded-xl bg-card border border-card-border text-xs font-mono font-bold text-fg-app"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => setGeneratedBarcode(`PKG-${order.id}-${Math.floor(100 + Math.random() * 900)}`)}
                className="h-9 text-xs font-semibold"
              >
                Auto-Generate
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-card-border">
            <Button variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="emerald"
              size="sm"
              onClick={onConfirmPicking}
              disabled={order.items.some((i) => !i.picked)}
              className="font-bold shadow-md"
            >
              <CheckCircle2 className="h-4 w-4 mr-1.5" /> Confirm Picking & Mark Ready for Dispatch
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
