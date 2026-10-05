"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ShoppingBag,
  MapPin,
  Zap,
  CreditCard,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Truck,
  Plus,
  Minus,
  Trash2,
  ShieldCheck,
  Building,
  Smartphone,
  Banknote,
} from "lucide-react";
import { usePharmacyCart } from "../context/PharmacyCartContext";
import { PharmacyMapPicker } from "./PharmacyMapPicker";
import { Button } from "@/components/ui/button";
import { PaymentMethod } from "../types";

export function PharmacyCheckoutDrawer() {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    clearCart,
    isDrawerOpen,
    setIsDrawerOpen,
    currentStep,
    setCurrentStep,
    address,
    setAddress,
    isExpressDelivery,
    setIsExpressDelivery,
    paymentMethod,
    setPaymentMethod,
    subtotal,
    deliveryFee,
    totalAmount,
    totalItemCount,
  } = usePharmacyCart();

  const [orderConfirmed, setOrderConfirmed] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      // Final Order Confirmation
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        setOrderConfirmed(true);
      }, 750);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleClose = () => {
    setIsDrawerOpen(false);
    if (orderConfirmed) {
      clearCart();
      setOrderConfirmed(false);
      setCurrentStep(1);
    }
  };

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
          />

          {/* Sliding Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 220 }}
            className="relative w-full max-w-md bg-card border-l border-card-border shadow-2xl flex flex-col h-full z-10 overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 z-20 bg-card/90 backdrop-blur-md border-b border-card-border p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-teal/10 text-primary-teal">
                  <ShoppingBag className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-fg-app">Medicine Cart & Checkout</h3>
                  <p className="text-xs text-muted-foreground">
                    {totalItemCount} {totalItemCount === 1 ? "Item" : "Items"} • 3-Step Checkout
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

            {/* 3-Step Progress Indicator Ribbon */}
            {!orderConfirmed && cartItems.length > 0 && (
              <div className="px-4 py-3 bg-surface-card-hover/60 border-b border-card-border flex items-center justify-between text-xs">
                {[
                  { step: 1, label: "Address", icon: MapPin },
                  { step: 2, label: "Express Delivery", icon: Zap },
                  { step: 3, label: "Payment", icon: CreditCard },
                ].map((s) => {
                  const Icon = s.icon;
                  const isActive = currentStep === s.step;
                  const isCompleted = currentStep > s.step;

                  return (
                    <div
                      key={s.step}
                      onClick={() => setCurrentStep(s.step)}
                      className={`flex items-center gap-1.5 cursor-pointer font-semibold transition-colors ${
                        isActive
                          ? "text-primary-teal"
                          : isCompleted
                          ? "text-emerald-500"
                          : "text-muted-foreground"
                      }`}
                    >
                      <div
                        className={`h-6 w-6 rounded-full flex items-center justify-center text-[11px] font-bold ${
                          isActive
                            ? "bg-primary-teal text-white shadow-xs"
                            : isCompleted
                            ? "bg-emerald-500 text-white"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {isCompleted ? <CheckCircle2 className="h-3.5 w-3.5" /> : s.step}
                      </div>
                      <span className="hidden sm:inline">{s.label}</span>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Body */}
            <div className="p-5 space-y-6 flex-1">
              {orderConfirmed ? (
                /* Order Confirmation Success View */
                <div className="py-8 text-center space-y-4">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-16 h-16 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto border-2 border-emerald-500/40"
                  >
                    <CheckCircle2 className="w-10 h-10" />
                  </motion.div>

                  <div className="space-y-1">
                    <h4 className="text-xl font-bold text-fg-app">Medicine Order Placed!</h4>
                    <p className="text-xs text-muted-foreground">
                      Order ID:{" "}
                      <span className="font-mono text-primary-teal font-bold">
                        PH-{Math.floor(100000 + Math.random() * 900000)}
                      </span>
                    </p>
                  </div>

                  <div className="bg-surface-card-hover border border-card-border rounded-xl p-4 text-left space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Delivery Speed:</span>
                      <span className="font-bold text-amber-500 flex items-center gap-1">
                        {isExpressDelivery ? (
                          <>
                            <Zap className="h-3.5 w-3.5 fill-amber-400" /> ⚡ Express 2-Hour
                          </>
                        ) : (
                          "Standard 24-Hour"
                        )}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Delivery Address:</span>
                      <span className="font-medium text-fg-app truncate max-w-[180px]">
                        {address.addressLine}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Payment Method:</span>
                      <span className="font-bold text-primary-teal uppercase">{paymentMethod}</span>
                    </div>

                    <div className="flex justify-between pt-2 border-t border-card-border font-bold">
                      <span>Total Amount Paid:</span>
                      <span className="text-emerald-600 dark:text-emerald-400 text-sm">
                        ৳{totalAmount.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground">
                    A rider has been dispatched from our temperature-controlled pharmacy hub.
                  </p>

                  <div className="pt-2">
                    <Button variant="primary" className="w-full" onClick={handleClose}>
                      Done
                    </Button>
                  </div>
                </div>
              ) : cartItems.length === 0 ? (
                /* Empty Cart */
                <div className="py-16 text-center space-y-3">
                  <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mx-auto text-muted-foreground">
                    <ShoppingBag className="h-8 w-8" />
                  </div>
                  <h4 className="font-bold text-base text-fg-app">Your Cart is Empty</h4>
                  <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                    Upload a prescription or add OTC medicines to proceed to checkout.
                  </p>
                </div>
              ) : (
                <>
                  {/* Cart Items List */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold uppercase tracking-wider text-muted-foreground">
                        Order Items ({cartItems.length})
                      </span>
                      <button
                        onClick={clearCart}
                        className="font-semibold text-rose-500 hover:underline"
                      >
                        Clear All
                      </button>
                    </div>

                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                      {cartItems.map((item) => (
                        <div
                          key={item.medicine.id}
                          className="p-3 rounded-xl border border-card-border bg-card/60 flex items-center justify-between gap-3 text-xs"
                        >
                          <div className="min-w-0 flex-1">
                            <span className="font-bold text-fg-app block truncate">
                              {item.medicine.name}
                            </span>
                            <span className="text-[11px] text-muted-foreground block truncate">
                              {item.medicine.packSize} • ৳{item.medicine.price}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              onClick={() => updateQuantity(item.medicine.id, item.quantity - 1)}
                              className="h-6 w-6 rounded-md bg-muted flex items-center justify-center hover:bg-muted/80 text-fg-app"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="font-bold text-fg-app w-4 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.medicine.id, item.quantity + 1)}
                              className="h-6 w-6 rounded-md bg-muted flex items-center justify-center hover:bg-muted/80 text-fg-app"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* STEP 1: Address Selection with Pin-on-Map */}
                  {currentStep === 1 && (
                    <div className="space-y-4 pt-2 border-t border-card-border">
                      <PharmacyMapPicker address={address} onUpdateAddress={setAddress} />
                    </div>
                  )}

                  {/* STEP 2: Express 2-Hour Delivery Toggle */}
                  {currentStep === 2 && (
                    <div className="space-y-4 pt-2 border-t border-card-border">
                      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                        <Truck className="h-4 w-4 text-primary-teal" /> Choose Delivery Speed
                      </label>

                      <div className="grid grid-cols-1 gap-3">
                        {/* Express 2-Hour Delivery */}
                        <div
                          onClick={() => setIsExpressDelivery(true)}
                          className={`p-4 rounded-xl border cursor-pointer transition-all space-y-2 relative overflow-hidden ${
                            isExpressDelivery
                              ? "bg-amber-500/10 border-amber-500 text-fg-app ring-2 ring-amber-500/30 shadow-xs"
                              : "border-card-border bg-card hover:bg-muted/40 text-muted-foreground"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-extrabold text-sm text-fg-app flex items-center gap-1.5">
                              <Zap className="h-4 w-4 text-amber-500 fill-amber-400" />
                              ⚡ Express 2-Hour Delivery
                            </span>
                            <span className="font-extrabold text-xs text-amber-600 dark:text-amber-400">
                              {subtotal >= 1000 ? "FREE" : "৳120"}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Dispatched immediately from nearest dark store. Delivered to your doorstep within 120 minutes.
                          </p>
                        </div>

                        {/* Standard Delivery */}
                        <div
                          onClick={() => setIsExpressDelivery(false)}
                          className={`p-4 rounded-xl border cursor-pointer transition-all space-y-2 relative overflow-hidden ${
                            !isExpressDelivery
                              ? "bg-primary-teal/10 border-primary-teal text-fg-app ring-2 ring-primary-teal/30 shadow-xs"
                              : "border-card-border bg-card hover:bg-muted/40 text-muted-foreground"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-extrabold text-sm text-fg-app flex items-center gap-1.5">
                              <Truck className="h-4 w-4 text-primary-teal" />
                              Standard Delivery (24 Hours)
                            </span>
                            <span className="font-extrabold text-xs text-primary-teal">
                              {subtotal >= 500 ? "FREE" : "৳60"}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Regular scheduled delivery arriving tomorrow morning.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STEP 3: Payment Options (bKash, Nagad, Cards, Cash on Delivery) */}
                  {currentStep === 3 && (
                    <div className="space-y-4 pt-2 border-t border-card-border">
                      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                        <CreditCard className="h-4 w-4 text-primary-teal" /> Select Payment Method
                      </label>

                      <div className="grid grid-cols-2 gap-2.5">
                        {/* bKash */}
                        <button
                          type="button"
                          onClick={() => setPaymentMethod("bkash")}
                          className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                            paymentMethod === "bkash"
                              ? "bg-rose-500/10 border-rose-500 ring-2 ring-rose-500/30 text-fg-app shadow-xs"
                              : "border-card-border bg-card hover:bg-muted/40 text-muted-foreground"
                          }`}
                        >
                          <span className="font-bold text-xs text-rose-500 flex items-center gap-1">
                            <Smartphone className="h-3.5 w-3.5" /> bKash
                          </span>
                          <span className="text-[10px] text-muted-foreground">Instant Mobile Pay</span>
                        </button>

                        {/* Nagad */}
                        <button
                          type="button"
                          onClick={() => setPaymentMethod("nagad")}
                          className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                            paymentMethod === "nagad"
                              ? "bg-orange-500/10 border-orange-500 ring-2 ring-orange-500/30 text-fg-app shadow-xs"
                              : "border-card-border bg-card hover:bg-muted/40 text-muted-foreground"
                          }`}
                        >
                          <span className="font-bold text-xs text-orange-500 flex items-center gap-1">
                            <Smartphone className="h-3.5 w-3.5" /> Nagad
                          </span>
                          <span className="text-[10px] text-muted-foreground">Instant Mobile Pay</span>
                        </button>

                        {/* Cards */}
                        <button
                          type="button"
                          onClick={() => setPaymentMethod("card")}
                          className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                            paymentMethod === "card"
                              ? "bg-cyan-500/10 border-cyan-500 ring-2 ring-cyan-500/30 text-fg-app shadow-xs"
                              : "border-card-border bg-card hover:bg-muted/40 text-muted-foreground"
                          }`}
                        >
                          <span className="font-bold text-xs text-cyan-500 flex items-center gap-1">
                            <CreditCard className="h-3.5 w-3.5" /> Visa / Master
                          </span>
                          <span className="text-[10px] text-muted-foreground">Credit / Debit Card</span>
                        </button>

                        {/* Cash on Delivery */}
                        <button
                          type="button"
                          onClick={() => setPaymentMethod("cod")}
                          className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                            paymentMethod === "cod"
                              ? "bg-emerald-500/10 border-emerald-500 ring-2 ring-emerald-500/30 text-fg-app shadow-xs"
                              : "border-card-border bg-card hover:bg-muted/40 text-muted-foreground"
                          }`}
                        >
                          <span className="font-bold text-xs text-emerald-500 flex items-center gap-1">
                            <Banknote className="h-3.5 w-3.5" /> Cash on Delivery
                          </span>
                          <span className="text-[10px] text-muted-foreground">Pay Rider on Arrival</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Price Summary Breakdown */}
                  <div className="rounded-xl border border-card-border bg-surface-card-hover p-3.5 space-y-2 text-xs">
                    <div className="flex justify-between text-muted-foreground">
                      <span>Medicines Subtotal</span>
                      <span className="font-semibold text-fg-app">৳{subtotal.toLocaleString()}</span>
                    </div>

                    <div className="flex justify-between text-muted-foreground">
                      <span>Delivery Fee ({isExpressDelivery ? "⚡ Express 2-Hour" : "Standard"})</span>
                      <span className="font-semibold text-emerald-500">
                        {deliveryFee === 0 ? "FREE" : `৳${deliveryFee}`}
                      </span>
                    </div>

                    <div className="flex justify-between pt-2 border-t border-card-border text-sm font-bold">
                      <span>Total Amount</span>
                      <span className="text-primary-teal text-base">
                        ৳{totalAmount.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Step Actions Footer */}
            {!orderConfirmed && cartItems.length > 0 && (
              <div className="sticky bottom-0 bg-card border-t border-card-border p-4 flex items-center justify-between gap-3">
                {currentStep > 1 && (
                  <Button variant="outline" size="sm" onClick={handlePrevStep} className="h-11">
                    <ArrowLeft className="h-4 w-4 mr-1" /> Back
                  </Button>
                )}

                <Button
                  variant="emerald"
                  disabled={isSubmitting}
                  onClick={handleNextStep}
                  className="flex-1 justify-center h-11 text-sm shadow-md"
                >
                  {isSubmitting ? (
                    "Placing Order..."
                  ) : currentStep === 3 ? (
                    <span className="flex items-center gap-1.5">
                      Confirm & Pay ৳{totalAmount.toLocaleString()} <ArrowRight className="h-4 w-4" />
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5">
                      Continue to Step {currentStep + 1} <ArrowRight className="h-4 w-4" />
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
