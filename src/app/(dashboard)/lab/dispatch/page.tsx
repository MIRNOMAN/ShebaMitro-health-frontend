"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Truck, Smartphone, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HomePickupRequest, PickupStatus } from "@/features/lab/types";
import { PHLEBOTOMISTS } from "@/features/lab/data/mockData";
import { DispatchMapCanvas } from "@/features/lab/components/dispatch/DispatchMapCanvas";
import { PickupQueueSidebar } from "@/features/lab/components/dispatch/PickupQueueSidebar";
import { SmsPinModal } from "@/features/lab/components/dispatch/SmsPinModal";
import { TechSimulatorModal } from "@/features/lab/components/dispatch/TechSimulatorModal";
import { useGetLabOrdersQuery, useAssignLabTechnicianMutation, LabOrder } from "@/redux/api/labApi";

function mapOrderToPickup(order: LabOrder, idx: number): HomePickupRequest {
  let pickupStatus: PickupStatus = "Pending Assignment";
  if (order.status === "SAMPLE_COLLECTED") pickupStatus = "Sample Collected";
  else if (order.technicianName) pickupStatus = "Assigned";

  return {
    id: order.id,
    patientName: order.patient?.user?.name || "Patient",
    patientPhone: order.patient?.user?.phone || "+8801700000000",
    address: order.sampleCollectionAddress || "Dhaka, Bangladesh",
    areaZone: "Banani",
    testName: order.testNames?.[0] || "Diagnostic Test",
    specimenType: "Blood (Vacutainer)",
    status: pickupStatus,
    phlebotomistId: order.technicianName ? "PHL-01" : null,
    phlebotomistName: order.technicianName || undefined,
    collectionTimeSlot: order.sampleCollectionSlot
      ? new Date(order.sampleCollectionSlot).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      : "08:00 AM - 10:00 AM",
    collectionPin: "8842",
    smsSent: false,
    mapCoords: { x: 45 + (idx % 4) * 8, y: 35 + (idx % 3) * 10 },
    requestedAt: new Date(order.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  };
}

const FALLBACK_PICKUP: HomePickupRequest = {
  id: "PICK-DEFAULT",
  patientName: "Patient",
  patientPhone: "+8801700000000",
  address: "House 12, Road 4, Banani, Dhaka",
  areaZone: "Banani",
  testName: "Diagnostic Test",
  specimenType: "Blood (Vacutainer)",
  status: "Pending Assignment",
  phlebotomistId: null,
  collectionTimeSlot: "08:00 AM - 10:00 AM",
  collectionPin: "8842",
  smsSent: false,
  mapCoords: { x: 50, y: 50 },
  requestedAt: "08:30 AM",
};

export default function LabDispatchPage() {
  const { data: ordersData } = useGetLabOrdersQuery();
  const [assignTechnician] = useAssignLabTechnicianMutation();

  const [localOverrides, setLocalOverrides] = useState<Record<string, Partial<HomePickupRequest>>>({});

  const pickups = useMemo(() => {
    return (ordersData?.orders || []).map((o, idx) => {
      const base = mapOrderToPickup(o, idx);
      const override = localOverrides[o.id] || {};
      return { ...base, ...override };
    });
  }, [ordersData, localOverrides]);

  const [selectedPickupId, setSelectedPickupId] = useState<string>("");
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
    if (!pickups || pickups.length === 0) return FALLBACK_PICKUP;
    return pickups.find((p) => p.id === selectedPickupId) || pickups[0] || FALLBACK_PICKUP;
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

  const handleAssignPhlebotomist = async (pickupId: string, phleboId: string) => {
    const phlebo = PHLEBOTOMISTS.find((p) => p.id === phleboId);
    if (!phlebo) return;

    try {
      await assignTechnician({
        id: pickupId,
        technicianName: phlebo.name,
        technicianPhone: phlebo.phone,
        latitude: 23.7548,
        longitude: 90.3754,
      }).unwrap();
      setLocalOverrides((prev) => ({
        ...prev,
        [pickupId]: {
          ...prev[pickupId],
          phlebotomistId: phlebo.id,
          phlebotomistName: phlebo.name,
          status: "Assigned",
        },
      }));
      triggerToast(`Assigned ${phlebo.name} to pickup and dispatched phlebotomist.`);
    } catch (err: any) {
      setLocalOverrides((prev) => ({
        ...prev,
        [pickupId]: {
          ...prev[pickupId],
          phlebotomistId: phlebo.id,
          phlebotomistName: phlebo.name,
          status: "Assigned",
        },
      }));
      triggerToast(`Assigned ${phlebo.name} to pickup.`);
    }
  };

  const handleUpdateTimeSlot = (pickupId: string, slot: string) => {
    setLocalOverrides((prev) => ({
      ...prev,
      [pickupId]: { ...prev[pickupId], collectionTimeSlot: slot },
    }));
    triggerToast(`Collection time window updated to "${slot}".`);
  };

  const handleSendSmsPin = (pickupId: string) => {
    const target = pickups.find((p) => p.id === pickupId);
    if (!target) return;
    const pin = target.collectionPin || Math.floor(1000 + Math.random() * 9000).toString();

    setLocalOverrides((prev) => ({
      ...prev,
      [pickupId]: { ...prev[pickupId], collectionPin: pin, smsSent: true, smsSentAt: "Just now" },
    }));

    setSmsModalItem({ ...target, collectionPin: pin, smsSent: true, smsSentAt: "Just now" });
    triggerToast(`Automated SMS with PIN ${pin} dispatched to ${target.patientPhone}.`);
  };

  const handleAdvanceTechnicianStatus = (pickupId: string, nextStatus: PickupStatus) => {
    setLocalOverrides((prev) => ({
      ...prev,
      [pickupId]: { ...prev[pickupId], status: nextStatus },
    }));
    triggerToast(`Technician updated status to "${nextStatus}".`);
  };

  const handleConfirmCollection = (item: HomePickupRequest, pin: string, barcode: string) => {
    if (pin !== item.collectionPin) return false;
    const code = barcode || `LAB-BARCODE-${Math.floor(1000 + Math.random() * 9000)}`;

    setLocalOverrides((prev) => ({
      ...prev,
      [item.id]: { ...prev[item.id], status: "Sample Collected", tubeBarcode: code },
    }));
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
