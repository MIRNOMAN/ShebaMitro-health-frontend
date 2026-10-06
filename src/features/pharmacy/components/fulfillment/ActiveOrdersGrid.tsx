import React from "react";
import { motion } from "framer-motion";
import { Clock, MapPin, Stethoscope, Barcode, Pill, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface PrescribedItem {
  id: string;
  name: string;
  strength: string;
  form: "Tablet" | "Capsule" | "Syrup" | "Injection" | "Ointment";
  drawerCode: string;
  qtyPrescribed: number;
  pricePerUnit: number;
  picked: boolean;
}

export interface PharmacyOrder {
  id: string;
  orderNumber: string;
  patientName: string;
  patientPhone: string;
  deliveryAddress: string;
  areaZone: string;
  doctorName: string;
  deliveryType: "Express (2-Hour)" | "Standard Delivery" | "Self-Pickup";
  deadlineSeconds: number;
  status: "New Order" | "Picking in Progress" | "Ready for Dispatch" | "Out for Delivery" | "Delivered";
  items: PrescribedItem[];
  packageBarcode?: string;
  createdAt: string;
  subtotal: number;
  deliveryFee: number;
}

interface ActiveOrdersGridProps {
  orders: PharmacyOrder[];
  formatSeconds: (sec: number) => string;
  onOpenPicking: (order: PharmacyOrder) => void;
  onOpenInvoice: (order: PharmacyOrder) => void;
}

export function ActiveOrdersGrid({
  orders,
  formatSeconds,
  onOpenPicking,
  onOpenInvoice,
}: ActiveOrdersGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {orders.map((ord) => {
        const pickedCount = ord.items.filter((i) => i.picked).length;
        const isUrgent = ord.deadlineSeconds > 0 && ord.deadlineSeconds < 1800;

        return (
          <motion.div
            key={ord.id}
            layout
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`p-5 rounded-2xl border transition-all space-y-4 bg-card shadow-xs hover:shadow-md relative overflow-hidden ${
              isUrgent ? "border-amber-500/60 ring-2 ring-amber-500/20" : "border-card-border"
            }`}
          >
            <div className="flex items-center justify-between border-b border-card-border pb-3 text-xs">
              <div>
                <span className="font-mono font-extrabold text-sm text-fg-app block">
                  {ord.orderNumber}
                </span>
                <span className="text-[10px] text-muted-foreground block">{ord.createdAt}</span>
              </div>

              <div
                className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 font-mono font-extrabold text-xs shadow-xs ${
                  isUrgent
                    ? "bg-rose-500/15 text-rose-500 border-rose-500/40 animate-pulse"
                    : "bg-amber-500/10 text-amber-500 border-amber-500/30"
                }`}
              >
                <Clock className="h-3.5 w-3.5" />
                <span>{formatSeconds(ord.deadlineSeconds)}</span>
              </div>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-fg-app">{ord.patientName}</h4>
                <span
                  className={`px-2 py-0.5 rounded-full font-extrabold text-[10px] border ${
                    ord.deliveryType === "Express (2-Hour)"
                      ? "bg-amber-500/15 text-amber-500 border-amber-500/30"
                      : "bg-blue-500/15 text-blue-500 border-blue-500/30"
                  }`}
                >
                  {ord.deliveryType}
                </span>
              </div>

              <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-coral-accent shrink-0" />
                <span className="truncate">{ord.deliveryAddress}</span>
              </p>
              <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                <Stethoscope className="h-3.5 w-3.5 text-purple-500 shrink-0" />
                <span className="truncate">{ord.doctorName}</span>
              </p>
            </div>

            <div className="p-3 rounded-xl bg-surface-card-hover border border-card-border text-xs space-y-1.5">
              <div className="flex items-center justify-between font-semibold text-fg-app text-[11px]">
                <span>Prescribed Items ({ord.items.length}):</span>
                <span className="font-bold text-primary-teal">
                  {pickedCount} / {ord.items.length} Picked
                </span>
              </div>

              <div className="space-y-1">
                {ord.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between text-[11px]">
                    <span className="text-muted-foreground truncate font-medium">
                      • {item.name} ({item.strength})
                    </span>
                    <span className="font-mono text-[10px] font-bold text-purple-500 shrink-0 ml-1">
                      {item.drawerCode.split("/")[1] || item.drawerCode}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {ord.packageBarcode && (
              <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-mono text-[11px] font-bold flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <Barcode className="h-3.5 w-3.5" /> {ord.packageBarcode}
                </span>
                <span className="text-[10px] uppercase font-sans font-bold">Barcoded</span>
              </div>
            )}

            <div className="pt-2 border-t border-card-border flex items-center justify-between">
              <span className="font-extrabold text-sm text-fg-app">
                ৳{ord.subtotal + ord.deliveryFee}
              </span>

              <div className="flex items-center gap-2">
                {ord.status !== "Ready for Dispatch" ? (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => onOpenPicking(ord)}
                    className="h-8 text-xs font-bold shadow-xs"
                  >
                    <Pill className="h-3.5 w-3.5 mr-1" /> Open Item Picking
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onOpenInvoice(ord)}
                    className="h-8 text-xs font-bold border-primary-teal/40 text-primary-teal hover:bg-primary-teal/10"
                  >
                    <Printer className="h-3.5 w-3.5 mr-1" /> Print Invoice
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
