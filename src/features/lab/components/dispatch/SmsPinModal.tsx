import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Smartphone, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HomePickupRequest } from "../../types";

interface SmsPinModalProps {
  item: HomePickupRequest | null;
  onClose: () => void;
}

export function SmsPinModal({ item, onClose }: SmsPinModalProps) {
  if (!item) return null;

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
          className="relative w-full max-w-md rounded-2xl border border-card-border bg-card p-6 shadow-2xl z-10 space-y-4"
        >
          <div className="flex items-center justify-between border-b border-card-border pb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-primary-teal/15 text-primary-teal">
                <Smartphone className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-fg-app">SMS Dispatch Triggered</h3>
                <p className="text-xs text-muted-foreground">Automated Patient Collection PIN</p>
              </div>
            </div>
            <button onClick={onClose} className="p-1 rounded-lg bg-muted text-muted-foreground hover:text-fg-app">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="p-4 rounded-xl border border-primary-teal/30 bg-primary-teal/10 space-y-2 font-mono text-xs">
            <div className="flex justify-between items-center text-[10px] text-primary-teal font-bold border-b border-primary-teal/20 pb-1">
              <span>TO: {item.patientPhone}</span>
              <span>SHEBAMITRO-SMS</span>
            </div>
            <p className="text-fg-app font-sans text-xs leading-relaxed">
              "Dear {item.patientName}, your ShebaMitro phlebotomist{" "}
              <strong className="text-primary-teal">{item.phlebotomistName || "Assigned Technician"}</strong>{" "}
              is scheduled for sample pickup between {item.collectionTimeSlot}. Your secure Collection PIN is:{" "}
              <strong className="text-purple-500 text-sm font-mono tracking-widest">{item.collectionPin}</strong>. Please show PIN upon rider arrival."
            </p>
          </div>

          <div className="p-3 rounded-xl bg-surface-card-hover border border-card-border text-[11px] text-muted-foreground">
            ✓ Patient receives push notification and SMS immediately. Phlebotomist will request this 4-digit PIN prior to sample collection.
          </div>

          <div className="flex justify-end pt-2">
            <Button variant="primary" size="sm" onClick={onClose}>
              Done
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
