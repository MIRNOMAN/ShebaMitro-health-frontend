"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { DiagnosticPackage, PartnerLab, CartItem, CollectionAddress } from "../types";
import { PARTNER_LABS } from "../data/packages";

interface DiagnosticCartContextType {
  cartItems: CartItem[];
  addToCart: (pkg: DiagnosticPackage, lab?: PartnerLab) => void;
  removeFromCart: (packageId: string) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  selectedCollectionType: "home" | "lab";
  setSelectedCollectionType: (type: "home" | "lab") => void;
  selectedMorningSlot: string;
  setSelectedMorningSlot: (slot: string) => void;
  collectionAddress: CollectionAddress;
  setCollectionAddress: React.Dispatch<React.SetStateAction<CollectionAddress>>;
  selectedLabGlobal: PartnerLab;
  setSelectedLabGlobal: (lab: PartnerLab) => void;
  subtotal: number;
  homeCollectionFee: number;
  totalAmount: number;
  totalItemCount: number;
}

const DEFAULT_ADDRESS: CollectionAddress = {
  fullName: "Sabbir Ahmed",
  phone: "+880 1712-345678",
  area: "Dhanmondi",
  fullAddress: "House 24, Road 7/A, Dhanmondi, Dhaka",
  lat: 23.7461,
  lng: 90.3742,
};

const DiagnosticCartContext = createContext<DiagnosticCartContextType | undefined>(undefined);

export function DiagnosticCartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [selectedCollectionType, setSelectedCollectionType] = useState<"home" | "lab">("home");
  const [selectedMorningSlot, setSelectedMorningSlot] = useState<string>("08:00 AM - 09:00 AM");
  const [collectionAddress, setCollectionAddress] = useState<CollectionAddress>(DEFAULT_ADDRESS);
  const [selectedLabGlobal, setSelectedLabGlobal] = useState<PartnerLab>(
    PARTNER_LABS[0]!
  );

  const addToCart = (pkg: DiagnosticPackage, lab?: PartnerLab) => {
    const targetLab = lab || selectedLabGlobal;
    setCartItems((prev) => {
      const existing = prev.find((item) => item.packageObj.id === pkg.id);
      if (existing) {
        return prev.map((item) =>
          item.packageObj.id === pkg.id
            ? { ...item, quantity: item.quantity + 1, selectedLab: targetLab }
            : item
        );
      }
      return [...prev, { packageObj: pkg, quantity: 1, selectedLab: targetLab }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (packageId: string) => {
    setCartItems((prev) => prev.filter((item) => item.packageObj.id !== packageId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.packageObj.discountedPrice * item.quantity,
    0
  );

  const homeCollectionFee =
    selectedCollectionType === "home" ? (subtotal >= 2000 || cartItems.length === 0 ? 0 : 150) : 0;

  const totalAmount = subtotal + homeCollectionFee;

  const totalItemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <DiagnosticCartContext.Provider
      value={{
        cartItems,
        addToCart,
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
      }}
    >
      {children}
    </DiagnosticCartContext.Provider>
  );
}

export function useDiagnosticCart() {
  const context = useContext(DiagnosticCartContext);
  if (!context) {
    throw new Error("useDiagnosticCart must be used within a DiagnosticCartProvider");
  }
  return context;
}
