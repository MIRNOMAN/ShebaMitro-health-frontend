import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Truck, X, Key, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HomePickupRequest, PickupStatus } from "../../types";

interface TechSimulatorModalProps {
  item: HomePickupRequest | null;
  onClose: () => void;
  onAdvanceStatus: (pickupId: string, nextStatus: PickupStatus) => void;
  onConfirmCollection: (item: HomePickupRequest, pin: string, barcode: string) => boolean;
}

export function TechSimulatorModal({
  item,
  onClose,
  onAdvanceStatus,
  onConfirmCollection,
}: TechSimulatorModalProps) {
  const [enteredPin, setEnteredPin] = useState("");
  const [pinError, setPinError] = useState(false);
  const [scannedBarcode, setScannedBarcode] = useState("");

  if (!item) return null;

  const handleConfirm = () => {
    const success = onConfirmCollection(item, enteredPin, scannedBarcode);
    if (!success) {
      setPinError(true);
    } else {
      setEnteredPin("");
      setPinError(false);
      setScannedBarcode("");
    }
  };

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
          className="relative w-full max-w-sm rounded-3xl border-4 border-slate-700 bg-slate-950 p-5 text-slate-100 shadow-2xl z-10 space-y-4 font-sans"
        >
          {/* Phone Notch */}
          <div className="h-4 w-28 mx-auto bg-slate-800 rounded-b-xl flex items-center justify-center">
            <div className="h-1.5 w-10 bg-slate-600 rounded-full" />
          </div>

          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-purple-600 text-white flex items-center justify-center font-bold text-xs">
                <Truck className="h-4 w-4" />
              </div>
              <div>
                <h4 className="font-bold text-xs text-white">Technician Field App</h4>
                <span className="text-[10px] text-slate-400">Rider Mode</span>
              </div>
            </div>
            <button onClick={onClose} className="p-1 rounded-full bg-slate-800 text-slate-400 hover:text-white">
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] font-bold text-purple-400">{item.id}</span>
              <span className="px-2 py-0.5 rounded-full bg-slate-800 text-[10px] font-bold text-slate-300">
                {item.status}
              </span>
            </div>
            <h5 className="font-bold text-sm text-white">{item.patientName}</h5>
            <p className="text-[11px] text-slate-300">{item.address}</p>
            <p className="text-[10px] text-emerald-400 font-mono">Test: {item.testName}</p>
          </div>

          <div className="space-y-2 text-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              1. Field Movement Controls:
            </span>
            <div className="grid grid-cols-2 gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => onAdvanceStatus(item.id, "En Route")}
                className="h-8 text-[10px] bg-slate-900 border-slate-700 text-slate-200 hover:bg-slate-800"
              >
                En Route
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onAdvanceStatus(item.id, "Arrived at Location")}
                className="h-8 text-[10px] bg-slate-900 border-slate-700 text-slate-200 hover:bg-slate-800"
              >
                Arrived at Home
              </Button>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900 border border-purple-500/30 space-y-3 text-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 block flex items-center gap-1">
              <Key className="h-3.5 w-3.5" /> 2. Patient Collection PIN Verification:
            </span>

            <div className="space-y-1">
              <label className="text-[10px] text-slate-300 block">Ask Patient for 4-Digit PIN:</label>
              <input
                type="text"
                maxLength={4}
                placeholder="Enter PIN (e.g. 4829)"
                value={enteredPin}
                onChange={(e) => {
                  setEnteredPin(e.target.value);
                  setPinError(false);
                }}
                className={`w-full h-10 px-3 rounded-lg bg-slate-950 border text-center text-sm font-mono font-extrabold tracking-widest text-white focus:outline-none ${
                  pinError ? "border-rose-500 bg-rose-500/10" : "border-slate-700 focus:border-purple-500"
                }`}
              />
              {pinError && (
                <span className="text-[10px] font-bold text-rose-400 block">
                  ✕ Invalid PIN. Expected PIN: {item.collectionPin}
                </span>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-slate-300 block">Scan Sample Vial Barcode:</label>
              <input
                type="text"
                placeholder="LAB-BARCODE-901"
                value={scannedBarcode}
                onChange={(e) => setScannedBarcode(e.target.value)}
                className="w-full h-9 px-3 rounded-lg bg-slate-950 border border-slate-700 text-xs font-mono text-slate-200"
              />
            </div>

            <Button
              variant="emerald"
              className="w-full h-10 text-xs font-bold shadow-lg"
              onClick={handleConfirm}
            >
              <CheckCircle2 className="h-4 w-4 mr-1.5" /> Verify PIN & Confirm Sample Collected
            </Button>
          </div>

          <div className="h-1 w-24 mx-auto bg-slate-700 rounded-full pt-1" />
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
