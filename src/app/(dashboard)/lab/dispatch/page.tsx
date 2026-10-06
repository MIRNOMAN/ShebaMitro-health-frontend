"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Truck, Smartphone, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HomePickupRequest, PickupStatus } from "@/features/lab/types";
import { INITIAL_DISPATCH_PICKUPS, PHLEBOTOMISTS } from "@/features/lab/data/mockData";
import { DispatchMapCanvas } from "@/features/lab/components/dispatch/DispatchMapCanvas";
import { PickupQueueSidebar } from "@/features/lab/components/dispatch/PickupQueueSidebar";
import { SmsPinModal } from "@/features/lab/components/dispatch/SmsPinModal";
import { TechSimulatorModal } from "@/features/lab/components/dispatch/TechSimulatorModal";

export default function LabDispatchPage() {
  const [pickups, setPickups] = useState<HomePickupRequest[]>(INITIAL_DISPATCH_PICKUPS);
  const [selectedPickupId, setSelectedPickupId] = useState<string>("PICK-901");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const [smsModalItem, setSmsModalItem] = useState<HomePickupRequest | null>(null);
  const [techSimulatorItem, setTechSimulatorItem] = useState<HomePickupRequest | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const selectedPickup = useMemo(() => {
    return pickups.find((p) => p.id === selectedPickupId) || pickups[0]!;
  }, [pickups, selectedPickupId]);

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

  const handleUpdateTimeSlot = (pickupId: string, slot: string) => {
    setPickups((prev) =>
      prev.map((item) => (item.id === pickupId ? { ...item, collectionTimeSlot: slot } : item))
    );
    triggerToast(`Collection time window updated to "${slot}".`);
  };

  const handleSendSmsPin = (pickupId: string) => {
    const target = pickups.find((p) => p.id === pickupId);
    if (!target) return;
    const pin = target.collectionPin || Math.floor(1000 + Math.random() * 9000).toString();

    setPickups((prev) =>
      prev.map((item) => (item.id === pickupId ? { ...item, collectionPin: pin, smsSent: true } : item))
    );

    setSmsModalItem({ ...target, collectionPin: pin, smsSent: true });
    triggerToast(`Automated SMS with PIN ${pin} dispatched to ${target.patientPhone}.`);
  };

  const handleAdvanceTechnicianStatus = (pickupId: string, nextStatus: PickupStatus) => {
    setPickups((prev) =>
      prev.map((item) => (item.id === pickupId ? { ...item, status: nextStatus } : item))
    );
    triggerToast(`Technician updated status to "${nextStatus}".`);
  };

  const handleConfirmCollection = (item: HomePickupRequest, pin: string, barcode: string) => {
    if (pin !== item.collectionPin) return false;
    const code = barcode || `LAB-BARCODE-${Math.floor(1000 + Math.random() * 9000)}`;

    setPickups((prev) =>
      prev.map((p) => (p.id === item.id ? { ...p, status: "Sample Collected", tubeBarcode: code } : p))
    );
    triggerToast(`Sample collected for ${item.patientName}! Barcode: ${code}`);
    setTechSimulatorItem(null);
    return true;
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

      {/* Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 bg-gradient-to-r from-purple-500/15 via-primary-teal/10 to-card p-6 rounded-2xl border border-card-border shadow-xs">
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-purple-500 flex items-center gap-1.5">
            <Truck className="h-4 w-4" /> Home Sample Dispatch Command
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-fg-app tracking-tight">
            Phlebotomist Dispatch & <span className="text-purple-500">Live GPS Tracker</span>
          </h1>
          <p className="text-xs text-muted-foreground">
            Schedule home sample pickups across Dhaka, assign field technicians, trigger automated patient PIN SMS, and track collection verification.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setTechSimulatorItem(selectedPickup)}
          className="font-bold text-xs shadow-md"
        >
          <Smartphone className="h-4 w-4 mr-1.5" /> Open Tech Mobile Simulator
        </Button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <DispatchMapCanvas
          pickups={pickups}
          selectedPickup={selectedPickup}
          selectedPickupId={selectedPickupId}
          onSelectPickup={setSelectedPickupId}
          onSendSms={handleSendSmsPin}
          onOpenTechSimulator={setTechSimulatorItem}
        />

        <PickupQueueSidebar
          pickups={pickups}
          filteredPickups={filteredPickups}
          selectedPickupId={selectedPickupId}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          phlebotomists={PHLEBOTOMISTS}
          onSelectPickup={setSelectedPickupId}
          onAssignPhlebotomist={handleAssignPhlebotomist}
          onUpdateTimeSlot={handleUpdateTimeSlot}
          onSendSms={handleSendSmsPin}
        />
      </div>

      <SmsPinModal item={smsModalItem} onClose={() => setSmsModalItem(null)} />

      <TechSimulatorModal
        item={techSimulatorItem}
        onClose={() => setTechSimulatorItem(null)}
        onAdvanceStatus={handleAdvanceTechnicianStatus}
        onConfirmCollection={handleConfirmCollection}
      />
    </div>
  );
}
