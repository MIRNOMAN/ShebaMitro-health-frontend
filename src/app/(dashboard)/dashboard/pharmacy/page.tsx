"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Printer,
  Search,
  User,
  Stethoscope,
  Pill,
  MapPin,
  Barcode,
  Truck,
  Check,
  X,
  Sparkles,
  Layers,
  ArrowRight,
  ShieldCheck,
  Building2,
  FileText,
  DollarSign,
  Plus,
  RefreshCw,
  Copy,
} from "lucide-react";
import { Button } from "@/components/ui/button";

// ── Types ──────────────────────────────────────────────────────────────────────
export type OrderStatus =
  | "New Order"
  | "Picking in Progress"
  | "Ready for Dispatch"
  | "Out for Delivery"
  | "Delivered";

export type DeliveryType = "Express (2-Hour)" | "Standard Delivery" | "Self-Pickup";

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
  deliveryType: DeliveryType;
  deadlineSeconds: number; // Seconds remaining for delivery promise
  status: OrderStatus;
  items: PrescribedItem[];
  packageBarcode?: string;
  createdAt: string;
  subtotal: number;
  deliveryFee: number;
}

// ── Mock Initial Active Orders ──────────────────────────────────────────────────
const INITIAL_ORDERS: PharmacyOrder[] = [
  {
    id: "PH-8801",
    orderNumber: "ORD-8801",
    patientName: "Sabbir Rahman",
    patientPhone: "+8801711223344",
    deliveryAddress: "House 24, Road 7/A, Dhanmondi, Dhaka",
    areaZone: "Dhanmondi",
    doctorName: "Prof. Dr. Mahmudul Hasan (BSMMU)",
    deliveryType: "Express (2-Hour)",
    deadlineSeconds: 5400, // 1h 30m
    status: "Picking in Progress",
    items: [
      {
        id: "item-1",
        name: "Tab. Rosuvastatin (Rosuva)",
        strength: "10mg",
        form: "Tablet",
        drawerCode: "Aisle 2 / Drawer B-04",
        qtyPrescribed: 30,
        pricePerUnit: 15,
        picked: true,
      },
      {
        id: "item-2",
        name: "Tab. Metformin (GlucoMet)",
        strength: "500mg",
        form: "Tablet",
        drawerCode: "Aisle 1 / Shelf C-12",
        qtyPrescribed: 60,
        pricePerUnit: 6,
        picked: false,
      },
      {
        id: "item-3",
        name: "Tab. Telmisartan (Telmi)",
        strength: "40mg",
        form: "Tablet",
        drawerCode: "Aisle 3 / Drawer A-08",
        qtyPrescribed: 30,
        pricePerUnit: 10,
        picked: false,
      },
    ],
    createdAt: "09:00 AM Today",
    subtotal: 1110,
    deliveryFee: 60,
  },
  {
    id: "PH-8802",
    orderNumber: "ORD-8802",
    patientName: "Nusrat Jahan",
    patientPhone: "+8801819876543",
    deliveryAddress: "Flat 4B, House 12, Road 11, Banani, Dhaka",
    areaZone: "Banani",
    doctorName: "Prof. Dr. Farhana Rahman (Popular)",
    deliveryType: "Express (2-Hour)",
    deadlineSeconds: 1500, // 25m - Urgent Pulse
    status: "New Order",
    items: [
      {
        id: "item-4",
        name: "Tab. Cefuroxime Axetil (Kilbac)",
        strength: "500mg",
        form: "Tablet",
        drawerCode: "Aisle 1 / Drawer A-02",
        qtyPrescribed: 14,
        pricePerUnit: 45,
        picked: false,
      },
      {
        id: "item-5",
        name: "Tab. Paracetamol (Napa Extra)",
        strength: "500mg + 65mg",
        form: "Tablet",
        drawerCode: "Aisle 2 / Shelf A-01",
        qtyPrescribed: 15,
        pricePerUnit: 3,
        picked: false,
      },
    ],
    createdAt: "09:20 AM Today",
    subtotal: 675,
    deliveryFee: 60,
  },
  {
    id: "PH-8803",
    orderNumber: "ORD-8803",
    patientName: "Tanvir Mahmud",
    patientPhone: "+8801555112233",
    deliveryAddress: "House 14, Road 2, Mirpur 10, Dhaka",
    areaZone: "Mirpur",
    doctorName: "Dr. Kazi Anowar Hossain (DMCH)",
    deliveryType: "Standard Delivery",
    deadlineSeconds: 14400, // 4 Hours
    status: "Picking in Progress",
    items: [
      {
        id: "item-6",
        name: "Insulin Glargine Pen (Lantus SoloStar)",
        strength: "100IU/ml",
        form: "Injection",
        drawerCode: "Cold Storage / Fridge #2",
        qtyPrescribed: 2,
        pricePerUnit: 850,
        picked: true,
      },
      {
        id: "item-7",
        name: "Insulin Syringe 100u (BD Micro-Fine)",
        strength: "31G 5mm",
        form: "Injection",
        drawerCode: "Aisle 4 / Drawer D-05",
        qtyPrescribed: 10,
        pricePerUnit: 15,
        picked: true,
      },
    ],
    createdAt: "08:15 AM Today",
    subtotal: 1850,
    deliveryFee: 40,
  },
  {
    id: "PH-8804",
    orderNumber: "ORD-8804",
    patientName: "Sharmin Akter",
    patientPhone: "+8801912345678",
    deliveryAddress: "House 85, Sector 4, Uttara, Dhaka",
    areaZone: "Uttara",
    doctorName: "Dr. Syeda Rashida Begum (Square)",
    deliveryType: "Express (2-Hour)",
    deadlineSeconds: 3800, // 1h 03m
    status: "Ready for Dispatch",
    packageBarcode: "PKG-PH-8804-DHA",
    items: [
      {
        id: "item-8",
        name: "Cap. Esomeprazole (Maxpro)",
        strength: "20mg",
        form: "Capsule",
        drawerCode: "Aisle 2 / Drawer A-08",
        qtyPrescribed: 30,
        pricePerUnit: 7,
        picked: true,
      },
      {
        id: "item-9",
        name: "Suspension Antacid (Entacyd)",
        strength: "200ml",
        form: "Syrup",
        drawerCode: "Aisle 5 / Shelf S-03",
        qtyPrescribed: 1,
        pricePerUnit: 120,
        picked: true,
      },
    ],
    createdAt: "08:45 AM Today",
    subtotal: 330,
    deliveryFee: 60,
  },
];

export default function PharmacyDashboardPage() {
  const [orders, setOrders] = useState<PharmacyOrder[]>(INITIAL_ORDERS);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  // Active Modals State
  const [pickingOrder, setPickingOrder] = useState<PharmacyOrder | null>(null);
  const [invoiceOrder, setInvoiceOrder] = useState<PharmacyOrder | null>(null);
  const [generatedBarcode, setGeneratedBarcode] = useState<string>("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Live Timer Countdown Ticker Effect
  useEffect(() => {
    const timer = setInterval(() => {
      setOrders((prevOrders) =>
        prevOrders.map((order) => ({
          ...order,
          deadlineSeconds: order.deadlineSeconds > 0 ? order.deadlineSeconds - 1 : 0,
        }))
      );
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Format Seconds to HH:MM:SS
  const formatSeconds = (totalSec: number) => {
    if (totalSec <= 0) return "EXPIRED / OVERDUE";
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // Filtered Orders List
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

  // Open Picking Modal
  const handleOpenPickingModal = (order: PharmacyOrder) => {
    setPickingOrder(JSON.parse(JSON.stringify(order))); // Deep copy
    setGeneratedBarcode(order.packageBarcode || `PKG-${order.id}-DHA`);
  };

  // Toggle item picked checkbox in modal
  const handleToggleItemPicked = (itemId: string) => {
    if (!pickingOrder) return;
    const updatedItems = pickingOrder.items.map((item) =>
      item.id === itemId ? { ...item, picked: !item.picked } : item
    );
    setPickingOrder({ ...pickingOrder, items: updatedItems });
  };

  // Confirm Picking & Update Order Status to Ready for Dispatch
  const handleConfirmPicking = () => {
    if (!pickingOrder) return;

    const barcode = generatedBarcode || `PKG-${pickingOrder.id}-DHA`;

    setOrders((prev) =>
      prev.map((ord) =>
        ord.id === pickingOrder.id
          ? {
              ...ord,
              status: "Ready for Dispatch",
              items: pickingOrder.items,
              packageBarcode: barcode,
            }
          : ord
      )
    );

    triggerToast(`Order ${pickingOrder.orderNumber} updated to "Ready for Dispatch" with barcode ${barcode}.`);
    setPickingOrder(null);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Toast Notification */}
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

      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 bg-gradient-to-r from-amber-500/15 via-primary-teal/10 to-card p-6 rounded-2xl border border-card-border shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-500 flex items-center gap-1.5">
              <Package className="h-4 w-4" /> Express Pharmacy Dispatch Hub
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-fg-app tracking-tight">
            Order Fulfillment & <span className="text-amber-500">Item Picking</span>
          </h1>
          <p className="text-xs text-muted-foreground">
            Track active prescription orders with live delivery SLA countdowns, guided drawer location item picking, package barcoding, and receipt generation.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-xl bg-card border border-card-border text-xs font-semibold text-fg-app flex items-center gap-2">
            <Clock className="h-4 w-4 text-amber-500" /> ⚡ 2-Hour Express Guaranteed
          </div>
        </div>
      </div>

      {/* Stats Summary Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl border border-card-border bg-card shadow-xs space-y-1">
          <span className="text-[11px] font-semibold text-muted-foreground">Active Orders</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-fg-app">{orders.length}</span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-primary-teal/10 text-primary-teal">
              Total Queue
            </span>
          </div>
        </div>

        <div className="p-4 rounded-2xl border border-card-border bg-card shadow-xs space-y-1">
          <span className="text-[11px] font-semibold text-muted-foreground">Express SLA Orders</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-amber-500">
              {orders.filter((o) => o.deliveryType === "Express (2-Hour)").length}
            </span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500">
              High Priority
            </span>
          </div>
        </div>

        <div className="p-4 rounded-2xl border border-card-border bg-card shadow-xs space-y-1">
          <span className="text-[11px] font-semibold text-muted-foreground">Picking in Progress</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-purple-500">
              {orders.filter((o) => o.status === "Picking in Progress").length}
            </span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-500">
              In Drawer
            </span>
          </div>
        </div>

        <div className="p-4 rounded-2xl border border-card-border bg-card shadow-xs space-y-1">
          <span className="text-[11px] font-semibold text-muted-foreground">Ready for Dispatch</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-emerald-500">
              {orders.filter((o) => o.status === "Ready for Dispatch").length}
            </span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500">
              Barcoded
            </span>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-2xl border border-card-border bg-card shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search order #, patient name, phone, or zone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-4 rounded-xl bg-card border border-card-border text-xs font-semibold text-fg-app focus:outline-none focus:border-primary-teal"
            />
          </div>

          <div className="flex items-center gap-1.5 bg-muted/60 p-1 rounded-xl text-xs font-semibold w-full sm:w-auto">
            <button
              onClick={() => setStatusFilter("ALL")}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                statusFilter === "ALL" ? "bg-card text-primary-teal font-bold shadow-xs" : "text-muted-foreground"
              }`}
            >
              All Orders ({orders.length})
            </button>
            <button
              onClick={() => setStatusFilter("NEW")}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                statusFilter === "NEW" ? "bg-card text-amber-500 font-bold shadow-xs" : "text-muted-foreground"
              }`}
            >
              New Orders
            </button>
            <button
              onClick={() => setStatusFilter("PICKING")}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                statusFilter === "PICKING" ? "bg-card text-purple-500 font-bold shadow-xs" : "text-muted-foreground"
              }`}
            >
              Picking
            </button>
            <button
              onClick={() => setStatusFilter("READY")}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                statusFilter === "READY" ? "bg-card text-emerald-500 font-bold shadow-xs" : "text-muted-foreground"
              }`}
            >
              Ready
            </button>
          </div>
        </div>
      </div>

      {/* Active Orders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredOrders.map((ord) => {
          const pickedCount = ord.items.filter((i) => i.picked).length;
          const isUrgent = ord.deadlineSeconds > 0 && ord.deadlineSeconds < 1800; // < 30 mins

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
              {/* Card Header: Order # & Live Timer Countdown */}
              <div className="flex items-center justify-between border-b border-card-border pb-3 text-xs">
                <div>
                  <span className="font-mono font-extrabold text-sm text-fg-app block">
                    {ord.orderNumber}
                  </span>
                  <span className="text-[10px] text-muted-foreground block">{ord.createdAt}</span>
                </div>

                {/* Live Delivery SLA Timer Countdown Badge */}
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

              {/* Patient & Prescribing Doctor Info */}
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

              {/* Prescribed Items Summary Box */}
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

              {/* Package Barcode (if generated) */}
              {ord.packageBarcode && (
                <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-mono text-[11px] font-bold flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Barcode className="h-3.5 w-3.5" /> {ord.packageBarcode}
                  </span>
                  <span className="text-[10px] uppercase font-sans font-bold">Barcoded</span>
                </div>
              )}

              {/* Footer Actions */}
              <div className="pt-2 border-t border-card-border flex items-center justify-between">
                <span className="font-extrabold text-sm text-fg-app">
                  ৳{ord.subtotal + ord.deliveryFee}
                </span>

                <div className="flex items-center gap-2">
                  {ord.status !== "Ready for Dispatch" ? (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleOpenPickingModal(ord)}
                      className="h-8 text-xs font-bold shadow-xs"
                    >
                      <Pill className="h-3.5 w-3.5 mr-1" /> Open Item Picking
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setInvoiceOrder(ord)}
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

      {/* ── MODAL 1: STEP-BY-STEP ITEM PICKING MODAL ────────────────────────── */}
      <AnimatePresence>
        {pickingOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setPickingOrder(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-xl rounded-2xl border border-card-border bg-card p-6 shadow-2xl z-10 space-y-5 max-h-[90vh] overflow-y-auto"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-card-border pb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-purple-500/15 text-purple-500">
                    <Pill className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-fg-app">Pharmacist Drawer Item Picking</h3>
                    <p className="text-xs text-muted-foreground">
                      Order #{pickingOrder.orderNumber} • {pickingOrder.patientName}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setPickingOrder(null)}
                  className="p-1 rounded-lg bg-muted text-muted-foreground hover:text-fg-app"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Progress Indicator */}
              <div className="p-3.5 rounded-xl bg-surface-card-hover border border-card-border space-y-2 text-xs">
                <div className="flex items-center justify-between font-bold text-fg-app">
                  <span>Item Picking Checklist:</span>
                  <span className="text-primary-teal">
                    {pickingOrder.items.filter((i) => i.picked).length} of {pickingOrder.items.length} Checked Off
                  </span>
                </div>
                <div className="h-2 w-full bg-card rounded-full overflow-hidden border border-card-border">
                  <div
                    className="h-full bg-primary-teal transition-all duration-300"
                    style={{
                      width: `${(pickingOrder.items.filter((i) => i.picked).length / pickingOrder.items.length) * 100}%`,
                    }}
                  />
                </div>
              </div>

              {/* Step-by-Step Prescribed Items Checklist */}
              <div className="space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                  Verify & Check Off Prescribed Strengths & Drawer Location Codes:
                </span>

                {pickingOrder.items.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleToggleItemPicked(item.id)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      item.picked
                        ? "border-emerald-500/40 bg-emerald-500/10 shadow-xs"
                        : "border-card-border bg-card hover:border-purple-500/40"
                    }`}
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-fg-app truncate">{item.name}</span>
                        <span className="px-2 py-0.5 rounded bg-muted text-[10px] font-bold text-purple-500">
                          {item.strength}
                        </span>
                      </div>

                      {/* Drawer Location Code Highlight Box */}
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
                      <div
                        className={`h-7 w-7 rounded-xl border flex items-center justify-center transition-colors ${
                          item.picked
                            ? "bg-emerald-500 text-white border-emerald-500 shadow-md"
                            : "border-card-border bg-card text-muted-foreground"
                        }`}
                      >
                        <Check className="h-4 w-4" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Package Barcode Assignment */}
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
                    onClick={() => setGeneratedBarcode(`PKG-${pickingOrder.id}-${Math.floor(100 + Math.random() * 900)}`)}
                    className="h-9 text-xs font-semibold"
                  >
                    Auto-Generate
                  </Button>
                </div>
              </div>

              {/* Confirm Picking Action */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-card-border">
                <Button variant="outline" size="sm" onClick={() => setPickingOrder(null)}>
                  Cancel
                </Button>
                <Button
                  variant="emerald"
                  size="sm"
                  onClick={handleConfirmPicking}
                  disabled={pickingOrder.items.some((i) => !i.picked)}
                  className="font-bold shadow-md"
                >
                  <CheckCircle2 className="h-4 w-4 mr-1.5" /> Confirm Picking & Mark Ready for Dispatch
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── MODAL 2: PHARMACY INVOICE PRINT RECEIPT ─────────────────────────── */}
      <AnimatePresence>
        {invoiceOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setInvoiceOrder(null)}
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
                <button
                  onClick={() => setInvoiceOrder(null)}
                  className="p-1 rounded-lg bg-muted text-muted-foreground hover:text-fg-app"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Thermal Invoice Paper Print Simulation */}
              <div className="p-5 rounded-xl border-2 border-dashed border-gray-400 dark:border-gray-600 bg-white text-black font-mono text-xs space-y-4 shadow-inner">
                {/* Invoice Header */}
                <div className="text-center border-b border-gray-300 pb-3 space-y-1">
                  <h4 className="font-extrabold text-sm uppercase tracking-wider text-gray-900">
                    SHEBAMITRO PHARMACY HUB
                  </h4>
                  <p className="text-[10px] text-gray-600 font-sans">
                    Popular Panthapath Central Branch • Govt Lic #PH-48902
                  </p>
                  <p className="text-[10px] text-gray-800 font-bold">
                    INVOICE #: {invoiceOrder.orderNumber} • {invoiceOrder.createdAt}
                  </p>
                </div>

                {/* Patient Info */}
                <div className="text-[11px] space-y-0.5 border-b border-gray-300 pb-2">
                  <p className="font-bold text-gray-900">PATIENT: {invoiceOrder.patientName}</p>
                  <p className="text-gray-700">PHONE: {invoiceOrder.patientPhone}</p>
                  <p className="text-gray-700 truncate">ADDRESS: {invoiceOrder.deliveryAddress}</p>
                  <p className="text-gray-700">DOCTOR: {invoiceOrder.doctorName}</p>
                </div>

                {/* Items Table */}
                <div className="space-y-2 border-b border-gray-300 pb-3">
                  <div className="flex justify-between font-bold text-[10px] uppercase border-b border-gray-200 pb-1">
                    <span>ITEM / STRENGTH</span>
                    <span>QTY x PRICE</span>
                    <span>TOTAL</span>
                  </div>

                  {invoiceOrder.items.map((item, idx) => (
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

                {/* Subtotal & Totals */}
                <div className="space-y-1 text-right text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-bold">৳{invoiceOrder.subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Express Delivery Fee:</span>
                    <span className="font-bold">৳{invoiceOrder.deliveryFee}</span>
                  </div>
                  <div className="flex justify-between text-sm font-extrabold border-t border-gray-400 pt-1 text-gray-900">
                    <span>GRAND TOTAL:</span>
                    <span>৳{invoiceOrder.subtotal + invoiceOrder.deliveryFee}</span>
                  </div>
                </div>

                {/* Barcode & Footer */}
                <div className="text-center pt-2 border-t border-gray-300 space-y-1">
                  <div className="h-10 bg-black text-white flex items-center justify-center font-mono font-bold tracking-widest text-xs">
                    *{invoiceOrder.packageBarcode || "PKG-PH-8801"}*
                  </div>
                  <p className="text-[9px] text-gray-600 font-sans">
                    Thank you for trusting ShebaMitro Health Platform!
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-2">
                <Button variant="outline" size="sm" onClick={() => setInvoiceOrder(null)}>
                  Close
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    triggerToast(`Thermal invoice printed for ${invoiceOrder.orderNumber}`);
                    setInvoiceOrder(null);
                  }}
                  className="font-bold"
                >
                  <Printer className="h-4 w-4 mr-1.5" /> Print Thermal Receipt
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
