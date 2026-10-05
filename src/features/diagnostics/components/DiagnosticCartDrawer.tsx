"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ShoppingBag,
  Trash2,
  Building2,
  Home,
  Clock,
  MapPin,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Plus,
  Minus,
  Sparkles,
} from "lucide-react";
import { useDiagnosticCart } from "../context/DiagnosticCartContext";
import { PARTNER_LABS } from "../data/packages";
import { DiagnosticGpsMapPicker } from "./DiagnosticGpsMapPicker";
import { Button } from "@/components/ui/button";

const MORNING_SLOTS = [
  "07:00 AM - 08:00 AM",
  "08:00 AM - 09:00 AM",
  "09:00 AM - 10:00 AM",
  "10:00 AM - 11:00 AM",
];

export function DiagnosticCartDrawer() {
  const {
    cartItems,
    removeFromCart,
    clearCart,
    isCartOpen,
    setIsCartOpen,
    selectedCollectionType,
    setSelectedCollectionType,
    selectedMorningSlot,
    setSelectedMorningSlot,
    collectionAddress,
    setCollectionAddress,
    selectedLabGlobal,
    setSelectedLabGlobal,
    subtotal,
    homeCollectionFee,
    totalAmount,
    totalItemCount,
  } = useDiagnosticCart();

  const [bookingConfirmed, setBookingConfirmed] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleCheckout = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setBookingConfirmed(true);
    }, 700);
  };

  const handleClose = () => {
    setIsCartOpen(false);
    if (bookingConfirmed) {
      clearCart();
      setBookingConfirmed(false);
    }
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
          />

          {/* Sliding Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 220 }}
            className="relative w-full max-w-md bg-card border-l border-card-border shadow-2xl flex flex-col h-full z-10 overflow-y-auto"
          >
            {/* Drawer Header */}
            <div className="sticky top-0 z-20 bg-card/90 backdrop-blur-md border-b border-card-border p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-teal/10 text-primary-teal">
                  <ShoppingBag className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-fg-app">Diagnostic Test Cart</h3>
                  <p className="text-xs text-muted-foreground">
                    {totalItemCount} {totalItemCount === 1 ? "Package" : "Packages"} Bundled
                  </p>
                </div>
              </div>

              <button
                onClick={handleClose}
                className="p-1.5 rounded-lg bg-muted hover:bg-muted/80 text-fg-app transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-5 space-y-6 flex-1">
              {bookingConfirmed ? (
                /* Success Confirmation View */
                <div className="py-8 text-center space-y-4">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-16 h-16 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto border-2 border-emerald-500/40"
                  >
                    <CheckCircle2 className="w-10 h-10" />
                  </motion.div>

                  <div className="space-y-1">
                    <h4 className="text-xl font-bold text-fg-app">Diagnostic Booking Confirmed!</h4>
                    <p className="text-xs text-muted-foreground">
                      Booking Ref:{" "}
                      <span className="font-mono text-primary-teal font-bold">
                        DX-{Math.floor(100000 + Math.random() * 900000)}
                      </span>
                    </p>
                  </div>

                  <div className="bg-surface-card-hover border border-card-border rounded-xl p-4 text-left space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Partner Lab:</span>
                      <span className="font-bold text-fg-app">{selectedLabGlobal.name}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Collection Type:</span>
                      <span className="font-bold text-primary-teal capitalize">
                        {selectedCollectionType === "home" ? "Home Sample Collection" : "Lab Visit"}
                      </span>
                    </div>

                    {selectedCollectionType === "home" && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Pickup Address:</span>
                        <span className="font-medium text-fg-app truncate max-w-[180px]">
                          {collectionAddress.fullAddress}
                        </span>
                      </div>
                    )}

                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Morning Time Slot:</span>
                      <span className="font-bold text-amber-500">{selectedMorningSlot}</span>
                    </div>

                    <div className="flex justify-between pt-2 border-t border-card-border font-bold">
                      <span>Total Amount:</span>
                      <span className="text-emerald-600 dark:text-emerald-400 text-sm">
                        ৳{totalAmount.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground">
                    A certified phlebotomist will arrive with a sealed sterile sample kit during your chosen morning slot.
                  </p>

                  <div className="pt-2">
                    <Button variant="primary" className="w-full" onClick={handleClose}>
                      Done
                    </Button>
                  </div>
                </div>
              ) : cartItems.length === 0 ? (
                /* Empty Cart View */
                <div className="py-16 text-center space-y-3">
                  <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mx-auto text-muted-foreground">
                    <ShoppingBag className="h-8 w-8" />
                  </div>
                  <h4 className="font-bold text-base text-fg-app">Your Test Cart is Empty</h4>
                  <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                    Add diagnostic checkup packages or individual lab tests to bundle sample pickup.
                  </p>
                </div>
              ) : (
                <>
                  {/* 1. Bundled Packages List */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Selected Packages ({cartItems.length})
                      </label>
                      <button
                        onClick={clearCart}
                        className="text-xs font-semibold text-rose-500 hover:underline"
                      >
                        Clear All
                      </button>
                    </div>

                    <div className="space-y-2">
                      {cartItems.map((item) => (
                        <div
                          key={item.packageObj.id}
                          className="p-3.5 rounded-xl border border-card-border bg-surface-card-hover/40 flex items-start justify-between gap-3"
                        >
                          <div className="space-y-1 min-w-0 flex-1">
                            <h5 className="font-bold text-xs text-fg-app truncate">
                              {item.packageObj.title}
                            </h5>
                            <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                              <span className="text-primary-teal font-semibold">
                                {item.packageObj.parameterCount} Params
                              </span>
                              <span>•</span>
                              <span>{item.packageObj.turnaroundTime}</span>
                            </div>
                            <div className="font-extrabold text-sm text-emerald-600 dark:text-emerald-400">
                              ৳{item.packageObj.discountedPrice.toLocaleString()}
                            </div>
                          </div>

                          <button
                            onClick={() => removeFromCart(item.packageObj.id)}
                            className="p-1.5 rounded-lg text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 2. Preferred Partner Lab Selector */}
                  <div className="space-y-2 pt-3 border-t border-card-border">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                      <Building2 className="h-3.5 w-3.5 text-primary-teal" /> Select Preferred Partner Lab
                    </label>

                    <div className="grid grid-cols-1 gap-2">
                      {PARTNER_LABS.map((lab) => {
                        const isSelected = selectedLabGlobal.id === lab.id;
                        return (
                          <div
                            key={lab.id}
                            onClick={() => setSelectedLabGlobal(lab)}
                            className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between text-xs ${
                              isSelected
                                ? "bg-primary-teal/10 border-primary-teal font-semibold text-fg-app shadow-xs"
                                : "border-card-border bg-card/40 hover:bg-muted/40 text-muted-foreground"
                            }`}
                          >
                            <div>
                              <span className="font-bold text-fg-app block truncate">{lab.name}</span>
                              <span className="text-[11px] text-muted-foreground block">
                                {lab.accredited} • ★ {lab.rating} ({lab.reviewCount})
                              </span>
                            </div>

                            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 shrink-0">
                              {lab.discountPercent}% OFF
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* 3. Home Sample Collection Option & GPS Map Picker */}
                  <div className="space-y-3 pt-3 border-t border-card-border">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Sample Collection Mode
                    </label>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedCollectionType("home")}
                        className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                          selectedCollectionType === "home"
                            ? "bg-primary-teal text-white border-primary-teal shadow-xs"
                            : "border-card-border bg-card hover:bg-muted/40 text-fg-app"
                        }`}
                      >
                        <Home className="h-4 w-4" />
                        <span>Home Sample</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedCollectionType("lab")}
                        className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                          selectedCollectionType === "lab"
                            ? "bg-primary-teal text-white border-primary-teal shadow-xs"
                            : "border-card-border bg-card hover:bg-muted/40 text-fg-app"
                        }`}
                      >
                        <Building2 className="h-4 w-4" />
                        <span>Direct Lab Visit</span>
                      </button>
                    </div>

                    {/* GPS Map Picker Embed if Home Sample Collection is chosen */}
                    {selectedCollectionType === "home" && (
                      <DiagnosticGpsMapPicker
                        address={collectionAddress}
                        onUpdateAddress={setCollectionAddress}
                      />
                    )}
                  </div>

                  {/* 4. Preferred Morning Time Slot Picker */}
                  <div className="space-y-2 pt-3 border-t border-card-border">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-amber-500" /> Preferred Morning Collection Slot
                    </label>

                    <div className="grid grid-cols-2 gap-2">
                      {MORNING_SLOTS.map((slot) => {
                        const isSelected = selectedMorningSlot === slot;
                        return (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => setSelectedMorningSlot(slot)}
                            className={`py-2 px-2 rounded-xl border text-xs font-semibold transition-all ${
                              isSelected
                                ? "bg-amber-500 text-slate-950 border-amber-500 shadow-xs"
                                : "border-card-border bg-card hover:bg-muted/40 text-fg-app"
                            }`}
                          >
                            {slot}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Price Summary Breakdown */}
                  <div className="rounded-xl border border-card-border bg-surface-card-hover p-4 space-y-2 text-xs">
                    <div className="flex justify-between text-muted-foreground">
                      <span>Tests & Packages Subtotal</span>
                      <span className="font-semibold text-fg-app">
                        ৳{subtotal.toLocaleString()}
                      </span>
                    </div>

                    <div className="flex justify-between text-muted-foreground">
                      <span>Home Sample Collection Fee</span>
                      <span className="font-semibold text-emerald-500">
                        {homeCollectionFee === 0 ? "FREE" : `৳${homeCollectionFee}`}
                      </span>
                    </div>

                    <div className="flex justify-between pt-2 border-t border-card-border text-sm font-bold">
                      <span>Total Amount Payable</span>
                      <span className="text-primary-teal text-base">
                        ৳{totalAmount.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Footer Checkout Action */}
            {!bookingConfirmed && cartItems.length > 0 && (
              <div className="sticky bottom-0 bg-card border-t border-card-border p-4">
                <Button
                  variant="emerald"
                  disabled={isSubmitting}
                  onClick={handleCheckout}
                  className="w-full justify-center h-12 text-sm shadow-md"
                >
                  {isSubmitting ? (
                    "Processing Booking..."
                  ) : (
                    <span className="flex items-center gap-2">
                      Proceed to Book Test <ArrowRight className="h-4 w-4" />
                    </span>
                  )}
                </Button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
