import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Printer, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PharmacyOrder } from "./ActiveOrdersGrid";

interface ThermalInvoiceModalProps {
  order: PharmacyOrder | null;
  onClose: () => void;
  onPrint: (order: PharmacyOrder) => void;
}

export function ThermalInvoiceModal({
  order,
  onClose,
  onPrint,
}: ThermalInvoiceModalProps) {
  if (!order) return null;

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
          className="relative w-full max-w-md rounded-2xl border border-card-border bg-card p-6 shadow-2xl z-10 space-y-5 max-h-[90vh] overflow-y-auto"
        >
          <div className="flex items-center justify-between border-b border-card-border pb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-primary-teal/15 text-primary-teal">
                <Printer className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-fg-app">Official Pharmacy Invoice</h3>
                <p className="text-xs text-muted-foreground">Thermal Receipt Layout Preview</p>
              </div>
            </div>
            <button onClick={onClose} className="p-1 rounded-lg bg-muted text-muted-foreground hover:text-fg-app">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="p-5 rounded-xl border-2 border-dashed border-gray-400 dark:border-gray-600 bg-white text-black font-mono text-xs space-y-4 shadow-inner">
            <div className="text-center border-b border-gray-300 pb-3 space-y-1">
              <h4 className="font-extrabold text-sm uppercase tracking-wider text-gray-900">
                SHEBAMITRO PHARMACY HUB
              </h4>
              <p className="text-[10px] text-gray-600 font-sans">
                Popular Panthapath Central Branch • Govt Lic #PH-48902
              </p>
              <p className="text-[10px] text-gray-800 font-bold">
                INVOICE #: {order.orderNumber} • {order.createdAt}
              </p>
            </div>

            <div className="text-[11px] space-y-0.5 border-b border-gray-300 pb-2">
              <p className="font-bold text-gray-900">PATIENT: {order.patientName}</p>
              <p className="text-gray-700">PHONE: {order.patientPhone}</p>
              <p className="text-gray-700 truncate">ADDRESS: {order.deliveryAddress}</p>
              <p className="text-gray-700">DOCTOR: {order.doctorName}</p>
            </div>

            <div className="space-y-2 border-b border-gray-300 pb-3">
              <div className="flex justify-between font-bold text-[10px] uppercase border-b border-gray-200 pb-1">
                <span>ITEM / STRENGTH</span>
                <span>QTY x PRICE</span>
                <span>TOTAL</span>
              </div>

              {order.items.map((item, idx) => (
                <div key={idx} className="space-y-0.5 text-[11px]">
                  <div className="flex justify-between font-semibold">
                    <span className="truncate pr-2">{item.name} ({item.strength})</span>
                    <span className="shrink-0">৳{item.qtyPrescribed * item.pricePerUnit}</span>
                  </div>
                  <div className="flex justify-between text-[10px] text-gray-600">
                    <span>Drawer: {item.drawerCode.split("/")[1] || item.drawerCode}</span>
                    <span>{item.qtyPrescribed} x ৳{item.pricePerUnit}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-1 text-right text-xs">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-bold">৳{order.subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Express Delivery Fee:</span>
                <span className="font-bold">৳{order.deliveryFee}</span>
              </div>
              <div className="flex justify-between text-sm font-extrabold border-t border-gray-400 pt-1 text-gray-900">
                <span>GRAND TOTAL:</span>
                <span>৳{order.subtotal + order.deliveryFee}</span>
              </div>
            </div>

            <div className="text-center pt-2 border-t border-gray-300 space-y-1">
              <div className="h-10 bg-black text-white flex items-center justify-center font-mono font-bold tracking-widest text-xs">
                *{order.packageBarcode || "PKG-PH-8801"}*
              </div>
              <p className="text-[9px] text-gray-600 font-sans">
                Thank you for trusting ShebaMitro Health Platform!
              </p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={onClose}>
              Close
            </Button>
            <Button variant="primary" size="sm" onClick={() => onPrint(order)} className="font-bold">
              <Printer className="h-4 w-4 mr-1.5" /> Print Thermal Receipt
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
