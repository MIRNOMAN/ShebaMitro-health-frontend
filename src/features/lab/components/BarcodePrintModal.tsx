import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { QrCode, X, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TestRequisition } from "../types";

interface BarcodePrintModalProps {
  item: TestRequisition | null;
  onClose: () => void;
  onPrint: (item: TestRequisition) => void;
}

export function BarcodePrintModal({ item, onClose, onPrint }: BarcodePrintModalProps) {
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
          className="relative w-full max-w-md rounded-2xl border border-card-border bg-card p-6 shadow-2xl z-10 space-y-5"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-card-border pb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-primary-teal/15 text-primary-teal">
                <QrCode className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-fg-app">Sample Barcode Label</h3>
                <p className="text-xs text-muted-foreground">Thermal Vial Print Preview</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg bg-muted text-muted-foreground hover:text-fg-app"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Barcode Physical Label Sticker Simulation */}
          <div className="p-4 rounded-xl border-2 border-dashed border-gray-400 dark:border-gray-600 bg-white text-black space-y-3 font-mono shadow-inner">
            <div className="flex justify-between items-start border-b border-gray-300 pb-2 text-[10px]">
              <div>
                <span className="font-bold block uppercase tracking-wider text-xs">SHEBAMITRO LABS</span>
                <span>ISO 15189 CERTIFIED</span>
              </div>
              <div className="text-right">
                <span className="font-bold block">{item.rackLocation}</span>
                <span>{item.priority}</span>
              </div>
            </div>

            {/* Patient & Test Info */}
            <div className="text-xs space-y-0.5 font-sans">
              <p className="font-bold text-sm leading-tight text-gray-900">
                {item.patientName} ({item.patientAge}Y / {item.patientGender.charAt(0)})
              </p>
              <p className="text-[11px] text-gray-700 font-semibold">
                MRN: {item.patientId} • Req: {item.id}
              </p>
              <p className="text-[11px] text-emerald-800 font-bold">
                SPECIMEN: {item.specimenType}
              </p>
            </div>

            {/* Simulated Barcode Graphics */}
            <div className="pt-2 text-center space-y-1">
              <div className="h-14 w-full flex items-center justify-center gap-0.5 bg-white px-2 py-1 overflow-hidden">
                {[
                  3, 1, 4, 1, 2, 5, 1, 3, 2, 1, 4, 2, 1, 3, 1, 5, 2, 1, 3, 4, 1, 2, 1, 3, 2, 4, 1,
                  3, 2, 1, 4, 1, 2,
                ].map((w, idx) => (
                  <div
                    key={idx}
                    className="h-full bg-black shrink-0"
                    style={{ width: `${w * 2}px` }}
                  />
                ))}
              </div>
              <span className="font-mono text-xs font-bold text-gray-900 block tracking-widest">
                *{item.barcode}*
              </span>
            </div>
          </div>

          {/* Instructions */}
          <div className="p-3 rounded-xl bg-surface-card-hover border border-card-border text-xs text-muted-foreground space-y-1">
            <span className="font-semibold text-fg-app block">Labeling Guidelines:</span>
            <p className="text-[11px]">
              Affix barcode label vertically along the specimen collection vial tube before drawing blood sample.
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={onClose}>
              Close
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => onPrint(item)}
              className="font-bold"
            >
              <Printer className="h-4 w-4 mr-1.5" /> Print Barcode Label
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
