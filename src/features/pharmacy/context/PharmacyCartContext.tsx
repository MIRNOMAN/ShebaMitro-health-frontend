"use client";

import React, { createContext, useContext, useState } from "react";
import { Medicine, PharmacyCartItem, DeliveryAddress, PaymentMethod } from "../types";

interface PharmacyCartContextType {
  cartItems: PharmacyCartItem[];
  addToCart: (medicine: Medicine, qty?: number) => void;
  removeFromCart: (medicineId: string) => void;
  updateQuantity: (medicineId: string, qty: number) => void;
  clearCart: () => void;
  isDrawerOpen: boolean;
  setIsDrawerOpen: (open: boolean) => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  address: DeliveryAddress;
  setAddress: React.Dispatch<React.SetStateAction<DeliveryAddress>>;
  isExpressDelivery: boolean;
  setIsExpressDelivery: (express: boolean) => void;
  paymentMethod: PaymentMethod;
  setPaymentMethod: (method: PaymentMethod) => void;
  subtotal: number;
  deliveryFee: number;
  totalAmount: number;
  totalItemCount: number;
}

const DEFAULT_ADDRESS: DeliveryAddress = {
  fullName: "Sabbir Ahmed",
  phone: "+880 1712-345678",
  area: "Dhanmondi",
  addressLine: "House 18, Road 4, Dhanmondi, Dhaka",
  lat: 23.7461,
  lng: 90.3742,
};

const PharmacyCartContext = createContext<PharmacyCartContextType | undefined>(undefined);

export function PharmacyCartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<PharmacyCartItem[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(1); // 1: Address, 2: Delivery, 3: Payment
  const [address, setAddress] = useState<DeliveryAddress>(DEFAULT_ADDRESS);
  const [isExpressDelivery, setIsExpressDelivery] = useState<boolean>(true);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("bkash");

  const addToCart = (medicine: Medicine, qty: number = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.medicine.id === medicine.id);
      if (existing) {
        return prev.map((item) =>
          item.medicine.id === medicine.id
            ? { ...item, quantity: item.quantity + qty }
            : item
        );
      }
      return [...prev, { medicine, quantity: qty }];
    });
    setIsDrawerOpen(true);
  };

  const removeFromCart = (medicineId: string) => {
    setCartItems((prev) => prev.filter((item) => item.medicine.id !== medicineId));
  };

  const updateQuantity = (medicineId: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(medicineId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.medicine.id === medicineId ? { ...item, quantity: qty } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.medicine.price * item.quantity,
    0
  );

  const deliveryFee = isExpressDelivery
    ? subtotal >= 1000 || cartItems.length === 0 ? 0 : 120
    : subtotal >= 500 || cartItems.length === 0 ? 0 : 60;

  const totalAmount = subtotal + deliveryFee;

  const totalItemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <PharmacyCartContext.Provider
      value={{
        cartItems,
        addToCart,
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
      }}
    >
      {children}
    </PharmacyCartContext.Provider>
  );
}

export function usePharmacyCart() {
  const context = useContext(PharmacyCartContext);
  if (!context) {
    throw new Error("usePharmacyCart must be used within a PharmacyCartProvider");
  }
  return context;
}
