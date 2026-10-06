"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Truck,
  MapPin,
  User,
  Clock,
  Send,
  Smartphone,
  ShieldCheck,
  CheckCircle2,
  Key,
  Phone,
  AlertCircle,
  Navigation,
  Search,
  Filter,
  Plus,
  RefreshCw,
  ChevronRight,
  Radio,
  FileText,
  Sparkles,
  Check,
  X,
  Building2,
  Calendar,
  Layers,
  ArrowRight,
  ShieldAlert,
  Copy,
} from "lucide-react";
import { Button } from "@/components/ui/button";

// ── Types ──────────────────────────────────────────────────────────────────────
export type PickupStatus =
  | "Pending Assignment"
  | "Assigned"
  | "En Route"
  | "Arrived at Location"
  | "Sample Collected"
  | "In Transit to Lab";

export interface Phlebotomist {
  id: string;
  name: string;
  phone: string;
  vehicle: "Motorbike" | "Scooter" | "Electric Bike";
  zone: string;
  status: "Available" | "Busy" | "En Route" | "On Break";
  pickupsToday: number;
  rating: number;
}

export interface HomePickupRequest {
  id: string;
  patientName: string;
  patientPhone: string;
  address: string;
  areaZone: "Dhanmondi" | "Banani" | "Uttara" | "Mirpur" | "Panthapath" | "Bashundhara";
  testName: string;
  specimenType: string;
  status: PickupStatus;
  phlebotomistId: string | null;
  phlebotomistName?: string;
  collectionTimeSlot: string;
  collectionPin: string;
  smsSent: boolean;
  smsSentAt?: string;
  tubeBarcode?: string;
  mapCoords: { x: number; y: number }; // percentage coords for custom interactive map canvas
  requestedAt: string;
}

// ── Mock Phlebotomist Staff ────────────────────────────────────────────────────
const PHLEBOTOMISTS: Phlebotomist[] = [
  {
    id: "PH-101",
    name: "Rafiqul Islam",
    phone: "+8801700112233",
    vehicle: "Motorbike",
    zone: "Dhanmondi & Panthapath",
    status: "En Route",
    pickupsToday: 3,
    rating: 4.9,
  },
  {
    id: "PH-102",
    name: "Kamrul Hasan",
    phone: "+8801700223344",
    vehicle: "Scooter",
    zone: "Mirpur & Uttara",
    status: "Available",
    pickupsToday: 4,
    rating: 4.8,
  },
  {
    id: "PH-103",
    name: "Anisur Rahman",
    phone: "+8801700334455",
    vehicle: "Motorbike",
    zone: "Banani & Gulshan",
    status: "En Route",
    pickupsToday: 2,
    rating: 4.95,
  },
  {
    id: "PH-104",
    name: "Mahbub Alam",
    phone: "+8801700445566",
    vehicle: "Electric Bike",
    zone: "Central Dhaka",
    status: "Available",
    pickupsToday: 5,
    rating: 4.7,
  },
  {
    id: "PH-105",
    name: "Tariqul Aziz",
    phone: "+8801700556677",
    vehicle: "Motorbike",
    zone: "Bashundhara & Baridhara",
    status: "On Break",
    pickupsToday: 1,
    rating: 4.85,
  },
];

// ── Mock Initial Home Sample Pickups ──────────────────────────────────────────
const INITIAL_PICKUPS: HomePickupRequest[] = [
  {
    id: "PICK-901",
    patientName: "Sabbir Rahman",
    patientPhone: "+8801711223344",
    address: "House 24, Road 7/A, Dhanmondi, Dhaka",
    areaZone: "Dhanmondi",
    testName: "Executive Full Body Checkup (68 Parameters)",
    specimenType: "EDTA Blood + Serum",
    status: "Pending Assignment",
    phlebotomistId: null,
    collectionTimeSlot: "08:00 AM - 09:00 AM",
    collectionPin: "4829",
    smsSent: false,
    mapCoords: { x: 38, y: 55 },
    requestedAt: "07:15 AM Today",
  },
  {
    id: "PICK-902",
    patientName: "Nazmul Huda",
    patientPhone: "+8801819876543",
    address: "Flat 4B, House 12, Road 11, Banani, Dhaka",
    areaZone: "Banani",
    testName: "Advanced Lipid & HbA1c Diabetes Profile",
    specimenType: "Serum + NaF Fluoride Tube",
    status: "Assigned",
    phlebotomistId: "PH-103",
    phlebotomistName: "Anisur Rahman",
    collectionTimeSlot: "09:30 AM - 10:30 AM",
    collectionPin: "7193",
    smsSent: true,
    smsSentAt: "08:10 AM",
    mapCoords: { x: 62, y: 35 },
    requestedAt: "07:30 AM Today",
  },
  {
    id: "PICK-903",
    patientName: "Sharmin Akter",
    patientPhone: "+8801912345678",
    address: "House 85, Sector 4, Uttara, Dhaka",
    areaZone: "Uttara",
    testName: "Thyroid Profile (FT3, FT4, TSH) & CBC",
    specimenType: "Serum + EDTA Whole Blood",
    status: "En Route",
    phlebotomistId: "PH-102",
    phlebotomistName: "Kamrul Hasan",
    collectionTimeSlot: "10:00 AM - 11:00 AM",
    collectionPin: "3920",
    smsSent: true,
    smsSentAt: "08:45 AM",
    mapCoords: { x: 55, y: 18 },
    requestedAt: "08:00 AM Today",
  },
  {
    id: "PICK-904",
    patientName: "Tanvir Mahmud",
    patientPhone: "+8801555112233",
    address: "House 14, Road 2, Mirpur 10, Dhaka",
    areaZone: "Mirpur",
    testName: "Dengue NS1 Antigen & Platelet Count (STAT)",
    specimenType: "Serum",
    status: "Arrived at Location",
    phlebotomistId: "PH-102",
    phlebotomistName: "Kamrul Hasan",
    collectionTimeSlot: "08:30 AM - 09:30 AM",
    collectionPin: "8841",
    smsSent: true,
    smsSentAt: "08:00 AM",
    mapCoords: { x: 28, y: 32 },
    requestedAt: "07:00 AM Today",
  },
  {
    id: "PICK-905",
    patientName: "Rowshan Ara",
    patientPhone: "+8801688990011",
    address: "House 5, Green Road, Panthapath, Dhaka",
    areaZone: "Panthapath",
    testName: "Renal Function & Electrolyte Panel",
    specimenType: "Heparin Plasma",
    status: "Sample Collected",
    phlebotomistId: "PH-101",
    phlebotomistName: "Rafiqul Islam",
    collectionTimeSlot: "08:30 AM - 09:30 AM",
    collectionPin: "1204",
    smsSent: true,
    smsSentAt: "08:00 AM",
    tubeBarcode: "LAB-TUBE-905",
    mapCoords: { x: 45, y: 52 },
    requestedAt: "06:45 AM Today",
  },
];

const TIME_SLOT_OPTIONS = [
  "08:00 AM - 09:00 AM",
  "09:30 AM - 10:30 AM",
  "11:00 AM - 12:00 PM",
  "01:30 PM - 02:30 PM",
  "03:00 PM - 04:00 PM",
  "05:00 PM - 06:00 PM",
];

export default function LabDispatchPage() {
  const [pickups, setPickups] = useState<HomePickupRequest[]>(INITIAL_PICKUPS);
  const [selectedPickupId, setSelectedPickupId] = useState<string>("PICK-901");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  // Modals & Mobile Tech Simulator State
  const [smsModalItem, setSmsModalItem] = useState<HomePickupRequest | null>(null);
  const [techSimulatorItem, setTechSimulatorItem] = useState<HomePickupRequest | null>(null);
  const [enteredPin, setEnteredPin] = useState<string>("");
  const [pinError, setPinError] = useState<boolean>(false);
  const [scannedBarcode, setScannedBarcode] = useState<string>("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const selectedPickup = useMemo(() => {
    return pickups.find((p) => p.id === selectedPickupId) || pickups[0]!;
  }, [pickups, selectedPickupId]);

  // Filtered Pickups list
  const filteredPickups = useMemo(() => {
    return pickups.filter((p) => {
      const q = searchQuery.toLowerCase().trim();
      const matchQuery =
        !q ||
        p.patientName.toLowerCase().includes(q) ||
        p.patientPhone.includes(q) ||
        p.address.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q) ||
        p.areaZone.toLowerCase().includes(q);

      const matchStatus =
        statusFilter === "ALL" ||
        (statusFilter === "UNASSIGNED" && p.status === "Pending Assignment") ||
        (statusFilter === "IN_PROGRESS" && p.status !== "Pending Assignment" && p.status !== "Sample Collected") ||
        (statusFilter === "COMPLETED" && p.status === "Sample Collected");

      return matchQuery && matchStatus;
    });
  }, [pickups, searchQuery, statusFilter]);

  // Handler: Assign Phlebotomist
  const handleAssignPhlebotomist = (pickupId: string, phleboId: string) => {
    const phlebo = PHLEBOTOMISTS.find((p) => p.id === phleboId);
    if (!phlebo) return;

    setPickups((prev) =>
      prev.map((item) =>
        item.id === pickupId
          ? {
              ...item,
              phlebotomistId: phlebo.id,
              phlebotomistName: phlebo.name,
              status: item.status === "Pending Assignment" ? "Assigned" : item.status,
            }
          : item
      )
    );

    triggerToast(`Assigned ${phlebo.name} to pickup ${pickupId}.`);
  };

  // Handler: Update Time Slot
  const handleUpdateTimeSlot = (pickupId: string, slot: string) => {
    setPickups((prev) =>
      prev.map((item) => (item.id === pickupId ? { ...item, collectionTimeSlot: slot } : item))
    );
    triggerToast(`Collection time window updated to "${slot}".`);
  };

  // Handler: Trigger Automated SMS PIN
  const handleSendSmsPin = (pickupId: string) => {
    const target = pickups.find((p) => p.id === pickupId);
    if (!target) return;

    // Generate pin if missing
    const pin = target.collectionPin || Math.floor(1000 + Math.random() * 9000).toString();

    setPickups((prev) =>
      prev.map((item) =>
        item.id === pickupId
          ? {
              ...item,
              collectionPin: pin,
              smsSent: true,
              smsSentAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            }
          : item
      )
    );

    setSmsModalItem({
      ...target,
      collectionPin: pin,
      smsSent: true,
      smsSentAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    });

    triggerToast(`Automated SMS with PIN ${pin} dispatched to ${target.patientPhone}.`);
  };

  // Handler: Technician Mobile Simulation Confirmation
  const handleConfirmTechnicianCollection = () => {
    if (!techSimulatorItem) return;

    if (enteredPin !== techSimulatorItem.collectionPin) {
      setPinError(true);
      return;
    }

    const barcode = scannedBarcode || `LAB-BARCODE-${Math.floor(1000 + Math.random() * 9000)}`;

    setPickups((prev) =>
      prev.map((item) =>
        item.id === techSimulatorItem.id
          ? {
              ...item,
              status: "Sample Collected",
              tubeBarcode: barcode,
            }
          : item
      )
    );

    triggerToast(
      `Sample collected & verified for ${techSimulatorItem.patientName}! Barcode: ${barcode}`
    );
    setTechSimulatorItem(null);
    setEnteredPin("");
    setPinError(false);
    setScannedBarcode("");
  };

  // Handler: Stepwise Technician Status updates
  const handleAdvanceTechnicianStatus = (pickupId: string, nextStatus: PickupStatus) => {
    setPickups((prev) =>
      prev.map((item) => (item.id === pickupId ? { ...item, status: nextStatus } : item))
    );
    triggerToast(`Technician updated status to "${nextStatus}".`);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Toast Notification Banner */}
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
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 bg-gradient-to-r from-purple-500/15 via-primary-teal/10 to-card p-6 rounded-2xl border border-card-border shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-500 flex items-center gap-1.5">
              <Truck className="h-4 w-4" /> Home Sample Dispatch Command
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-fg-app tracking-tight">
            Phlebotomist Dispatch & <span className="text-purple-500">Live GPS Tracker</span>
          </h1>
          <p className="text-xs text-muted-foreground">
            Schedule home sample pickups across Dhaka, assign field technicians, trigger automated patient PIN SMS, and track collection verification.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {techSimulatorItem ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setTechSimulatorItem(null)}
              className="text-xs font-bold"
            >
              Close Tech Mobile Simulator
            </Button>
          ) : (
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                setTechSimulatorItem(selectedPickup);
                setEnteredPin("");
                setPinError(false);
              }}
              className="font-bold text-xs shadow-md"
            >
              <Smartphone className="h-4 w-4 mr-1.5" /> Open Tech Mobile Simulator
            </Button>
          )}
        </div>
      </div>

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl border border-card-border bg-card shadow-xs space-y-1">
          <span className="text-[11px] font-semibold text-muted-foreground">Total Pickups Today</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-fg-app">{pickups.length}</span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-primary-teal/10 text-primary-teal">
              Dhaka City
            </span>
          </div>
        </div>

        <div className="p-4 rounded-2xl border border-card-border bg-card shadow-xs space-y-1">
          <span className="text-[11px] font-semibold text-muted-foreground">Unassigned Requests</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-amber-500">
              {pickups.filter((p) => p.status === "Pending Assignment").length}
            </span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500">
              Needs Rider
            </span>
          </div>
        </div>

        <div className="p-4 rounded-2xl border border-card-border bg-card shadow-xs space-y-1">
          <span className="text-[11px] font-semibold text-muted-foreground">Phlebotomists En Route</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-blue-500">
              {pickups.filter((p) => p.status === "En Route" || p.status === "Assigned").length}
            </span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500">
              Active Pickups
            </span>
          </div>
        </div>

        <div className="p-4 rounded-2xl border border-card-border bg-card shadow-xs space-y-1">
          <span className="text-[11px] font-semibold text-muted-foreground">Samples Collected</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-emerald-500">
              {pickups.filter((p) => p.status === "Sample Collected").length}
            </span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500">
              Verified PIN
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Interactive Map + Dispatch Management Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Interactive Map View (7 cols) */}
        <div className="lg:col-span-7 flex flex-col rounded-2xl border border-card-border bg-card p-5 space-y-4 shadow-xs relative overflow-hidden min-h-[520px]">
          <div className="flex items-center justify-between border-b border-card-border pb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-purple-500/10 text-purple-500">
                <Navigation className="h-4 w-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-fg-app">Interactive Dhaka Dispatch Map</h3>
                <p className="text-[11px] text-muted-foreground">
                  Live phlebotomist beacons & home pickup locations
                </p>
              </div>
            </div>

            {/* Map Legend */}
            <div className="hidden sm:flex items-center gap-3 text-[10px] font-semibold">
              <span className="flex items-center gap-1">
                <span className="h-2.5 w-2.5 rounded-full bg-amber-500" /> Pending
              </span>
              <span className="flex items-center gap-1">
                <span className="h-2.5 w-2.5 rounded-full bg-blue-500" /> Assigned / En Route
              </span>
              <span className="flex items-center gap-1">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> Collected
              </span>
            </div>
          </div>

          {/* Interactive Graphic Canvas Simulation */}
          <div className="relative flex-1 rounded-xl bg-slate-900 border border-slate-800 overflow-hidden min-h-[400px] flex items-center justify-center">
            {/* Background Map Grid & Roads Styling */}
            <svg
              className="absolute inset-0 w-full h-full opacity-25 pointer-events-none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#38bdf8" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
              {/* Simulated Arterial Highways */}
              <line x1="10%" y1="10%" x2="90%" y2="90%" stroke="#38bdf8" strokeWidth="2" strokeDasharray="4 4" />
              <line x1="10%" y1="70%" x2="80%" y2="20%" stroke="#a855f7" strokeWidth="2" />
              <circle cx="50%" cy="50%" r="30%" fill="none" stroke="#0ea5e9" strokeWidth="1" strokeDasharray="8 8" />
            </svg>

            {/* City Zone Labels */}
            <div className="absolute top-4 left-6 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest pointer-events-none">
              Uttara Sector 4
            </div>
            <div className="absolute top-1/4 left-1/4 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest pointer-events-none">
              Mirpur 10
            </div>
            <div className="absolute top-1/3 right-8 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest pointer-events-none">
              Banani / Gulshan
            </div>
            <div className="absolute bottom-1/4 left-1/3 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest pointer-events-none">
              Dhanmondi Lake Zone
            </div>
            <div className="absolute bottom-6 right-1/4 text-[10px] font-mono font-bold text-purple-400 uppercase tracking-widest pointer-events-none flex items-center gap-1">
              <Building2 className="h-3 w-3" /> Central Lab Hub (Panthapath)
            </div>

            {/* Central Lab Hub Pin */}
            <div className="absolute top-[52%] left-[48%] -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center">
              <div className="h-8 w-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold shadow-lg ring-4 ring-purple-500/30 animate-pulse">
                <Building2 className="h-4 w-4" />
              </div>
              <span className="text-[9px] font-extrabold bg-slate-950/90 text-purple-300 px-2 py-0.5 rounded-full border border-purple-500/40 mt-1">
                Central Lab Hub
              </span>
            </div>

            {/* Interactive Pickup Map Markers */}
            {pickups.map((p) => {
              const isSelected = p.id === selectedPickupId;
              const markerColor =
                p.status === "Pending Assignment"
                  ? "bg-amber-500 ring-amber-500/30 text-amber-500"
                  : p.status === "Sample Collected"
                  ? "bg-emerald-500 ring-emerald-500/30 text-emerald-500"
                  : "bg-blue-500 ring-blue-500/30 text-blue-500";

              return (
                <button
                  key={p.id}
                  onClick={() => setSelectedPickupId(p.id)}
                  style={{ top: `${p.mapCoords.y}%`, left: `${p.mapCoords.x}%` }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 transition-transform duration-300 hover:scale-125 z-20 group ${
                    isSelected ? "scale-125 z-30" : ""
                  }`}
                >
                  <div className="relative flex flex-col items-center">
                    {/* Pulsing Beacon Ring */}
                    <div
                      className={`h-7 w-7 rounded-full ${markerColor} flex items-center justify-center text-white shadow-lg ring-4 ${
                        isSelected ? "ring-white" : ""
                      }`}
                    >
                      <MapPin className="h-4 w-4" />
                    </div>

                    {/* Tooltip Card on Hover or Selected */}
                    <div
                      className={`mt-1 whitespace-nowrap p-1.5 rounded-lg bg-slate-900/95 border border-slate-700 text-white text-[10px] shadow-2xl transition-all ${
                        isSelected ? "opacity-100 scale-100" : "opacity-0 group-hover:opacity-100 scale-95"
                      }`}
                    >
                      <span className="font-bold block truncate">{p.patientName}</span>
                      <span className="text-[9px] text-slate-300 block">{p.areaZone} • {p.status}</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Selected Pickup Card Overlay Details */}
          {selectedPickup && (
            <div className="p-4 rounded-xl bg-surface-card-hover/80 border border-card-border space-y-3 text-xs">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider block">
                    Selected Location ({selectedPickup.areaZone})
                  </span>
                  <h4 className="font-bold text-sm text-fg-app">{selectedPickup.patientName}</h4>
                </div>

                <span
                  className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] border ${
                    selectedPickup.status === "Pending Assignment"
                      ? "bg-amber-500/10 text-amber-500 border-amber-500/30"
                      : selectedPickup.status === "Sample Collected"
                      ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/30"
                      : "bg-blue-500/10 text-blue-500 border-blue-500/30"
                  }`}
                >
                  {selectedPickup.status}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                <p className="text-muted-foreground">
                  Address: <span className="font-semibold text-fg-app">{selectedPickup.address}</span>
                </p>
                <p className="text-muted-foreground">
                  Phone: <span className="font-mono font-bold text-primary-teal">{selectedPickup.patientPhone}</span>
                </p>
                <p className="text-muted-foreground">
                  Time Slot: <span className="font-bold text-fg-app">{selectedPickup.collectionTimeSlot}</span>
                </p>
                <p className="text-muted-foreground">
                  Collection PIN:{" "}
                  <span className="font-mono font-extrabold text-purple-500 tracking-wider">
                    {selectedPickup.collectionPin || "Unassigned"}
                  </span>
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-between pt-2 border-t border-card-border/60 gap-2">
                <span className="text-[11px] text-muted-foreground">
                  Assigned Phlebotomist:{" "}
                  <span className="font-bold text-fg-app">
                    {selectedPickup.phlebotomistName || "None Assigned"}
                  </span>
                </span>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSendSmsPin(selectedPickup.id)}
                    className="h-7 text-[11px] font-semibold"
                  >
                    <Send className="h-3 w-3 mr-1 text-primary-teal" /> Send SMS PIN
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      setTechSimulatorItem(selectedPickup);
                      setEnteredPin("");
                    }}
                    className="h-7 text-[11px] font-bold"
                  >
                    <Smartphone className="h-3 w-3 mr-1" /> Tech Simulator
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Dispatch Controls & Phlebotomist Staff Panel (5 cols) */}
        <div className="lg:col-span-5 flex flex-col space-y-5">
          {/* Pickup Requisition Queue */}
          <div className="rounded-2xl border border-card-border bg-card p-5 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-card-border pb-3">
              <h3 className="font-bold text-sm text-fg-app flex items-center gap-2">
                <Truck className="h-4 w-4 text-purple-500" /> Home Sample Queue
              </h3>

              {/* Status Filter buttons */}
              <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-xl text-[10px] font-semibold">
                <button
                  onClick={() => setStatusFilter("ALL")}
                  className={`px-2 py-0.5 rounded-lg transition-colors ${
                    statusFilter === "ALL" ? "bg-card text-fg-app shadow-xs" : "text-muted-foreground"
                  }`}
                >
                  All ({pickups.length})
                </button>
                <button
                  onClick={() => setStatusFilter("UNASSIGNED")}
                  className={`px-2 py-0.5 rounded-lg transition-colors ${
                    statusFilter === "UNASSIGNED" ? "bg-card text-amber-500 font-bold shadow-xs" : "text-muted-foreground"
                  }`}
                >
                  Unassigned
                </button>
              </div>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search patient, phone, or area..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-8 pl-8 pr-3 rounded-lg bg-card border border-card-border text-xs text-fg-app"
              />
            </div>

            {/* Pickups List */}
            <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
              {filteredPickups.map((p) => {
                const isSelected = p.id === selectedPickupId;

                return (
                  <div
                    key={p.id}
                    onClick={() => setSelectedPickupId(p.id)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer space-y-2.5 ${
                      isSelected
                        ? "border-primary-teal/50 bg-primary-teal/10 shadow-xs"
                        : "border-card-border bg-surface-card-hover/40 hover:border-card-border/80"
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono font-bold text-fg-app">{p.id}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          p.status === "Pending Assignment"
                            ? "bg-amber-500/10 text-amber-500 border-amber-500/30"
                            : p.status === "Sample Collected"
                            ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/30"
                            : "bg-blue-500/10 text-blue-500 border-blue-500/30"
                        }`}
                      >
                        {p.status}
                      </span>
                    </div>

                    <div>
                      <h5 className="font-bold text-xs text-fg-app">{p.patientName}</h5>
                      <p className="text-[11px] text-muted-foreground line-clamp-1">{p.testName}</p>
                    </div>

                    {/* Phlebotomist Staff Selector Dropdown */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1 border-t border-card-border/50">
                      <div className="space-y-0.5">
                        <label className="text-[10px] font-bold text-muted-foreground block">
                          Assign Phlebotomist:
                        </label>
                        <select
                          value={p.phlebotomistId || ""}
                          onChange={(e) => handleAssignPhlebotomist(p.id, e.target.value)}
                          className="w-full h-7 px-2 rounded-lg bg-card border border-card-border text-[11px] font-semibold text-fg-app"
                        >
                          <option value="" disabled>
                            -- Select Staff --
                          </option>
                          {PHLEBOTOMISTS.map((phlebo) => (
                            <option key={phlebo.id} value={phlebo.id}>
                              {phlebo.name} ({phlebo.status})
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Time Slot Picker */}
                      <div className="space-y-0.5">
                        <label className="text-[10px] font-bold text-muted-foreground block">
                          Time Slot:
                        </label>
                        <select
                          value={p.collectionTimeSlot}
                          onChange={(e) => handleUpdateTimeSlot(p.id, e.target.value)}
                          className="w-full h-7 px-2 rounded-lg bg-card border border-card-border text-[11px] font-semibold text-fg-app"
                        >
                          {TIME_SLOT_OPTIONS.map((slot) => (
                            <option key={slot} value={slot}>
                              {slot}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex items-center justify-between text-[11px] pt-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSendSmsPin(p.id);
                        }}
                        className="text-primary-teal font-semibold hover:underline flex items-center gap-1"
                      >
                        <Send className="h-3 w-3" /> SMS PIN ({p.collectionPin})
                      </button>

                      {p.smsSent && (
                        <span className="text-[10px] font-bold text-emerald-500 flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" /> SMS Dispatched
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Phlebotomist Staff Fleet Panel */}
          <div className="rounded-2xl border border-card-border bg-card p-5 space-y-3 shadow-xs">
            <h3 className="font-bold text-sm text-fg-app flex items-center gap-2 border-b border-card-border pb-2">
              <User className="h-4 w-4 text-primary-teal" /> Phlebotomist Staff Fleet ({PHLEBOTOMISTS.length})
            </h3>

            <div className="space-y-2 text-xs">
              {PHLEBOTOMISTS.map((st) => (
                <div
                  key={st.id}
                  className="p-2.5 rounded-xl border border-card-border bg-surface-card-hover/40 flex items-center justify-between"
                >
                  <div className="space-y-0.5 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-fg-app truncate">{st.name}</span>
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                          st.status === "Available"
                            ? "bg-emerald-500/10 text-emerald-500"
                            : st.status === "En Route"
                            ? "bg-blue-500/10 text-blue-500"
                            : "bg-amber-500/10 text-amber-500"
                        }`}
                      >
                        {st.status}
                      </span>
                    </div>
                    <p className="text-[10px] text-muted-foreground truncate">
                      {st.vehicle} • {st.zone}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-mono font-bold text-xs text-primary-teal block">
                      ★ {st.rating}
                    </span>
                    <span className="text-[10px] text-muted-foreground block">
                      {st.pickupsToday} Pickups Today
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── MODAL 1: SMS PIN DISPATCH CONFIRMATION ────────────────────────────── */}
      <AnimatePresence>
        {smsModalItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSmsModalItem(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-md rounded-2xl border border-card-border bg-card p-6 shadow-2xl z-10 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-card-border pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-primary-teal/15 text-primary-teal">
                    <Smartphone className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-fg-app">SMS Dispatch Triggered</h3>
                    <p className="text-xs text-muted-foreground">Automated Patient Collection PIN</p>
                  </div>
                </div>
                <button
                  onClick={() => setSmsModalItem(null)}
                  className="p-1 rounded-lg bg-muted text-muted-foreground hover:text-fg-app"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Simulated SMS Message Screen */}
              <div className="p-4 rounded-xl border border-primary-teal/30 bg-primary-teal/10 space-y-2 font-mono text-xs">
                <div className="flex justify-between items-center text-[10px] text-primary-teal font-bold border-b border-primary-teal/20 pb-1">
                  <span>TO: {smsModalItem.patientPhone}</span>
                  <span>SHEBAMITRO-SMS</span>
                </div>
                <p className="text-fg-app font-sans text-xs leading-relaxed">
                  "Dear {smsModalItem.patientName}, your ShebaMitro phlebotomist{" "}
                  <strong className="text-primary-teal">
                    {smsModalItem.phlebotomistName || "Assigned Technician"}
                  </strong>{" "}
                  is scheduled for sample pickup between {smsModalItem.collectionTimeSlot}. Your secure
                  Collection PIN is:{" "}
                  <strong className="text-purple-500 text-sm font-mono tracking-widest">
                    {smsModalItem.collectionPin}
                  </strong>
                  . Please show PIN upon rider arrival."
                </p>
              </div>

              <div className="p-3 rounded-xl bg-surface-card-hover border border-card-border text-[11px] text-muted-foreground">
                ✓ Patient receives push notification and SMS immediately. Phlebotomist will request this 4-digit PIN prior to sample collection.
              </div>

              <div className="flex justify-end pt-2">
                <Button variant="primary" size="sm" onClick={() => setSmsModalItem(null)}>
                  Done
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── MODAL 2: FIELD TECHNICIAN MOBILE SIMULATOR ──────────────────────────── */}
      <AnimatePresence>
        {techSimulatorItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setTechSimulatorItem(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-sm rounded-3xl border-4 border-slate-700 bg-slate-950 p-5 text-slate-100 shadow-2xl z-10 space-y-4 font-sans"
            >
              {/* Phone Notch Simulation */}
              <div className="h-4 w-28 mx-auto bg-slate-800 rounded-b-xl flex items-center justify-center">
                <div className="h-1.5 w-10 bg-slate-600 rounded-full" />
              </div>

              {/* Mobile Header */}
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
                <button
                  onClick={() => setTechSimulatorItem(null)}
                  className="p-1 rounded-full bg-slate-800 text-slate-400 hover:text-white"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Active Pickup Order Details */}
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-bold text-purple-400">
                    {techSimulatorItem.id}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-slate-800 text-[10px] font-bold text-slate-300">
                    {techSimulatorItem.status}
                  </span>
                </div>
                <h5 className="font-bold text-sm text-white">{techSimulatorItem.patientName}</h5>
                <p className="text-[11px] text-slate-300">{techSimulatorItem.address}</p>
                <p className="text-[10px] text-emerald-400 font-mono">
                  Test: {techSimulatorItem.testName}
                </p>
              </div>

              {/* Step 1 & 2: Quick Status Advance */}
              <div className="space-y-2 text-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  1. Field Movement Controls:
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      handleAdvanceTechnicianStatus(techSimulatorItem.id, "En Route")
                    }
                    className="h-8 text-[10px] bg-slate-900 border-slate-700 text-slate-200 hover:bg-slate-800"
                  >
                    En Route
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      handleAdvanceTechnicianStatus(techSimulatorItem.id, "Arrived at Location")
                    }
                    className="h-8 text-[10px] bg-slate-900 border-slate-700 text-slate-200 hover:bg-slate-800"
                  >
                    Arrived at Home
                  </Button>
                </div>
              </div>

              {/* Step 3: PIN Verification & Sample Barcode Scanner */}
              <div className="p-3.5 rounded-xl bg-slate-900 border border-purple-500/30 space-y-3 text-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 block flex items-center gap-1">
                  <Key className="h-3.5 w-3.5" /> 2. Patient Collection PIN Verification:
                </span>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-300 block">
                    Ask Patient for 4-Digit PIN:
                  </label>
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
                      ✕ Invalid PIN. Expected PIN: {techSimulatorItem.collectionPin}
                    </span>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-300 block">
                    Scan Sample Vial Barcode:
                  </label>
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
                  onClick={handleConfirmTechnicianCollection}
                >
                  <CheckCircle2 className="h-4 w-4 mr-1.5" /> Verify PIN & Confirm Sample Collected
                </Button>
              </div>

              {/* Bottom Home Indicator */}
              <div className="h-1 w-24 mx-auto bg-slate-700 rounded-full pt-1" />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
