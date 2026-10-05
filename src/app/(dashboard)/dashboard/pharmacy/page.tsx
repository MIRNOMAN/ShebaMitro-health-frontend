"use client";

import React, { useState } from "react";
import {
  Pill,
  Truck,
  Package,
  ShieldCheck,
  TrendingUp,
  AlertTriangle,
  Clock,
  CheckCircle2,
  FileText,
  Search,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const MOCK_PHARMACY_ORDERS = [
  {
    id: "po-101",
    orderNo: "PH-849201",
    customer: "Sabbir Ahmed",
    itemsCount: 3,
    totalAmount: 420,
    deliveryType: "Express 2-Hour",
    address: "House 18, Road 4, Dhanmondi, Dhaka",
    status: "Verification Pending",
    requiresRx: true,
  },
  {
    id: "po-102",
    orderNo: "PH-849202",
    customer: "Tanvir Hossain",
    itemsCount: 2,
    totalAmount: 180,
    deliveryType: "Express 2-Hour",
    address: "House 10, Road 11, Banani, Dhaka",
    status: "Packing",
    requiresRx: false,
  },
  {
    id: "po-103",
    orderNo: "PH-849203",
    customer: "Dr. Selina Begum",
    itemsCount: 5,
    totalAmount: 890,
    deliveryType: "Standard 24-Hour",
    address: "Plot 15, Block E, Bashundhara R/A",
    status: "Out for Delivery",
    requiresRx: true,
  },
];

const LOW_STOCK_ITEMS = [
  { name: "Napa Extra 500mg", stock: 12, minStock: 50, type: "Tablet" },
  { name: "Seclo 20mg", stock: 8, minStock: 40, type: "Capsule" },
  { name: "Tusca Syrup 100ml", stock: 5, minStock: 25, type: "Syrup" },
];

export default function PharmacyDashboardPage() {
  const [orders, setOrders] = useState(MOCK_PHARMACY_ORDERS);

  const handleVerifyOrder = (id: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: "Packing" } : o))
    );
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Pharmacy Header Banner */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 bg-gradient-to-r from-amber-500/10 via-background to-background p-6 rounded-2xl border border-card-border">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-500 flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4" /> DGDA Licensed Pharmacy Hub
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-fg-app tracking-tight">
            ShebaMitro <span className="text-amber-500">Central Pharmacy Hub</span>
          </h1>
          <p className="text-xs text-muted-foreground">
            Order packing queue, prescription verification, express rider dispatch, and low stock inventory alerts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="emerald" size="sm">
            <Truck className="h-4 w-4 mr-1.5" /> 8 Express Riders Active
          </Button>
        </div>
      </div>

      {/* Stats Counter Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl border border-card-border bg-card shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">Dispatch Queue</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
              <Package className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-fg-app">{orders.length}</span>
            <span className="text-xs text-muted-foreground font-semibold">Orders</span>
          </div>
          <span className="text-[11px] font-medium text-amber-500 flex items-center gap-1">
            <Clock className="h-3 w-3" /> 2 Prescriptions Pending Audit
          </span>
        </div>

        <div className="p-4 rounded-2xl border border-card-border bg-card shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">Express 2-Hour Deliveries</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
              <Truck className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-fg-app">24</span>
            <span className="text-xs text-muted-foreground font-semibold">Delivered</span>
          </div>
          <span className="text-[11px] font-medium text-emerald-500 flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" /> Avg Delivery: 42 mins
          </span>
        </div>

        <div className="p-4 rounded-2xl border border-card-border bg-card shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">Low Stock Items</span>
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-500">
              <AlertTriangle className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-fg-app">3</span>
            <span className="text-xs text-muted-foreground font-semibold">Medicines</span>
          </div>
          <span className="text-[11px] font-medium text-rose-500 flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" /> Reorder Needed Immediately
          </span>
        </div>

        <div className="p-4 rounded-2xl border border-card-border bg-card shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">Daily Medicine Sales</span>
            <div className="p-2 rounded-xl bg-primary-teal/10 text-primary-teal">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-fg-app">৳38,500</span>
          </div>
          <span className="text-[11px] font-medium text-emerald-500 flex items-center gap-1">
            <TrendingUp className="h-3 w-3" /> +15% vs yesterday
          </span>
        </div>
      </div>

      {/* Main Grid: Orders Dispatch Queue + Low Stock Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Orders Queue (8 cols) */}
        <div className="lg:col-span-8 rounded-2xl border border-card-border bg-card p-6 space-y-5 shadow-xs">
          <div className="flex items-center justify-between border-b border-card-border pb-4">
            <div>
              <h3 className="font-bold text-lg text-fg-app flex items-center gap-2">
                <Package className="h-5 w-5 text-amber-500" /> Order Dispatch & Prescription Verification
              </h3>
              <p className="text-xs text-muted-foreground font-medium">Verify Rx and assign express delivery riders</p>
            </div>

            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20">
              {orders.length} Active Orders
            </span>
          </div>

          <div className="space-y-3">
            {orders.map((ord) => (
              <div
                key={ord.id}
                className="p-4 rounded-xl border border-card-border bg-surface-card-hover/40 space-y-3 text-xs"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h4 className="font-bold text-sm text-fg-app flex items-center gap-2">
                      {ord.orderNo} — {ord.customer}
                      {ord.requiresRx && (
                        <span className="text-[10px] font-bold text-amber-500 bg-amber-500/10 px-2 py-0.2 rounded border border-amber-500/20 flex items-center gap-1">
                          <FileText className="h-3 w-3" /> Rx Verification Required
                        </span>
                      )}
                    </h4>
                    <p className="text-xs text-muted-foreground">{ord.address}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400">
                      ৳{ord.totalAmount}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-card border border-card-border">
                      {ord.status}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-card-border text-[11px]">
                  <span className="text-amber-500 font-bold flex items-center gap-1">
                    ⚡ {ord.deliveryType}
                  </span>

                  <div className="flex gap-2">
                    {ord.requiresRx && ord.status === "Verification Pending" && (
                      <Button
                        variant="emerald"
                        size="sm"
                        onClick={() => handleVerifyOrder(ord.id)}
                        className="h-8 text-xs"
                      >
                        <ShieldCheck className="h-3.5 w-3.5 mr-1" /> Approve Rx & Pack Order
                      </Button>
                    )}

                    <Button variant="outline" size="sm" className="h-8 text-xs">
                      <Truck className="h-3.5 w-3.5 mr-1" /> Assign Express Rider
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Low Stock Alerts (4 cols) */}
        <div className="lg:col-span-4 rounded-2xl border border-card-border bg-card p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-card-border pb-3">
            <h3 className="font-bold text-base text-fg-app flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-rose-500" /> Low Stock Reorder Alerts
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            {LOW_STOCK_ITEMS.map((item, i) => (
              <div
                key={i}
                className="p-3 rounded-xl border border-rose-500/30 bg-rose-500/5 space-y-1.5"
              >
                <div className="flex items-center justify-between font-bold text-fg-app">
                  <span>{item.name}</span>
                  <span className="text-rose-500 font-extrabold">{item.stock} Units Left</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>{item.type} • Minimum Threshold: {item.minStock}</span>
                  <button className="text-primary-teal font-semibold hover:underline">
                    Reorder Stock
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
