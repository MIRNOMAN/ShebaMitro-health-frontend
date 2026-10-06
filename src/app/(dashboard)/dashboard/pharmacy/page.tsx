"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Package, Clock, Search, Check } from "lucide-react";
import { ActiveOrdersGrid, PharmacyOrder } from "@/features/pharmacy/components/fulfillment/ActiveOrdersGrid";
import { ItemPickingModal } from "@/features/pharmacy/components/fulfillment/ItemPickingModal";
import { ThermalInvoiceModal } from "@/features/pharmacy/components/fulfillment/ThermalInvoiceModal";
import { INITIAL_PHARMACY_ORDERS } from "@/features/pharmacy/data/fulfillmentData";

export default function PharmacyDashboardPage() {
  const [orders, setOrders] = useState<PharmacyOrder[]>(INITIAL_PHARMACY_ORDERS);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const [pickingOrder, setPickingOrder] = useState<PharmacyOrder | null>(null);
  const [invoiceOrder, setInvoiceOrder] = useState<PharmacyOrder | null>(null);
  const [generatedBarcode, setGeneratedBarcode] = useState<string>("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setOrders((prev) =>
        prev.map((o) => ({ ...o, deadlineSeconds: o.deadlineSeconds > 0 ? o.deadlineSeconds - 1 : 0 }))
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatSeconds = (totalSec: number) => {
    if (totalSec <= 0) return "EXPIRED";
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((ord) => {
      const q = searchQuery.toLowerCase().trim();
      const matchQuery =
        !q ||
        ord.patientName.toLowerCase().includes(q) ||
        ord.patientPhone.includes(q) ||
        ord.orderNumber.toLowerCase().includes(q) ||
        ord.id.toLowerCase().includes(q) ||
        ord.areaZone.toLowerCase().includes(q);

      const matchStatus =
        statusFilter === "ALL" ||
        (statusFilter === "NEW" && ord.status === "New Order") ||
        (statusFilter === "PICKING" && ord.status === "Picking in Progress") ||
        (statusFilter === "READY" && ord.status === "Ready for Dispatch");

      return matchQuery && matchStatus;
    });
  }, [orders, searchQuery, statusFilter]);

  const handleOpenPickingModal = (order: PharmacyOrder) => {
    setPickingOrder(JSON.parse(JSON.stringify(order)));
    setGeneratedBarcode(order.packageBarcode || `PKG-${order.id}-DHA`);
  };

  const handleToggleItemPicked = (itemId: string) => {
    if (!pickingOrder) return;
    const updated = pickingOrder.items.map((i) => (i.id === itemId ? { ...i, picked: !i.picked } : i));
    setPickingOrder({ ...pickingOrder, items: updated });
  };

  const handleConfirmPicking = () => {
    if (!pickingOrder) return;
    const barcode = generatedBarcode || `PKG-${pickingOrder.id}-DHA`;

    setOrders((prev) =>
      prev.map((ord) =>
        ord.id === pickingOrder.id
          ? { ...ord, status: "Ready for Dispatch", items: pickingOrder.items, packageBarcode: barcode }
          : ord
      )
    );
    triggerToast(`Order ${pickingOrder.orderNumber} updated to "Ready for Dispatch" with barcode ${barcode}.`);
    setPickingOrder(null);
  };

  return (
    <div className="space-y-6 pb-12">
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl bg-card border border-primary-teal/40 shadow-2xl text-fg-app text-xs font-semibold glow-teal"
          >
            <div className="h-7 w-7 rounded-xl bg-primary-teal text-white flex items-center justify-center shrink-0">
              <Check className="h-4 w-4" />
            </div>
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 bg-gradient-to-r from-amber-500/15 via-primary-teal/10 to-card p-6 rounded-2xl border border-card-border shadow-xs">
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-500 flex items-center gap-1.5">
            <Package className="h-4 w-4" /> Express Pharmacy Dispatch Hub
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-fg-app tracking-tight">
            Order Fulfillment & <span className="text-amber-500">Item Picking</span>
          </h1>
          <p className="text-xs text-muted-foreground">
            Track active prescription orders with live delivery SLA countdowns, guided drawer location item picking, and barcoding.
          </p>
        </div>

        <div className="px-3.5 py-1.5 rounded-xl bg-card border border-card-border text-xs font-semibold text-fg-app flex items-center gap-2">
          <Clock className="h-4 w-4 text-amber-500" /> ⚡ 2-Hour Express Guaranteed
        </div>
      </div>

      <div className="p-4 rounded-2xl border border-card-border bg-card shadow-xs">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search order #, patient, phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-4 rounded-xl bg-card border border-card-border text-xs font-semibold text-fg-app focus:outline-none focus:border-primary-teal"
            />
          </div>

          <div className="flex items-center gap-1.5 bg-muted/60 p-1 rounded-xl text-xs font-semibold w-full sm:w-auto">
            <button onClick={() => setStatusFilter("ALL")} className={`px-3 py-1.5 rounded-lg ${statusFilter === "ALL" ? "bg-card text-primary-teal font-bold shadow-xs" : "text-muted-foreground"}`}>All ({orders.length})</button>
            <button onClick={() => setStatusFilter("NEW")} className={`px-3 py-1.5 rounded-lg ${statusFilter === "NEW" ? "bg-card text-amber-500 font-bold shadow-xs" : "text-muted-foreground"}`}>New</button>
            <button onClick={() => setStatusFilter("PICKING")} className={`px-3 py-1.5 rounded-lg ${statusFilter === "PICKING" ? "bg-card text-purple-500 font-bold shadow-xs" : "text-muted-foreground"}`}>Picking</button>
            <button onClick={() => setStatusFilter("READY")} className={`px-3 py-1.5 rounded-lg ${statusFilter === "READY" ? "bg-card text-emerald-500 font-bold shadow-xs" : "text-muted-foreground"}`}>Ready</button>
          </div>
        </div>
      </div>

      <ActiveOrdersGrid
        orders={filteredOrders}
        formatSeconds={formatSeconds}
        onOpenPicking={handleOpenPickingModal}
        onOpenInvoice={setInvoiceOrder}
      />

      <ItemPickingModal
        order={pickingOrder}
        generatedBarcode={generatedBarcode}
        setGeneratedBarcode={setGeneratedBarcode}
        onToggleItem={handleToggleItemPicked}
        onClose={() => setPickingOrder(null)}
        onConfirmPicking={handleConfirmPicking}
      />

      <ThermalInvoiceModal
        order={invoiceOrder}
        onClose={() => setInvoiceOrder(null)}
        onPrint={(ord) => {
          triggerToast(`Thermal invoice printed for ${ord.orderNumber}`);
          setInvoiceOrder(null);
        }}
      />
    </div>
  );
}
