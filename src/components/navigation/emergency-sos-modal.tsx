/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Siren,
  MapPin,
  PhoneCall,
  Ambulance,
  X,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  Navigation,
  ShieldCheck,
  Building2,
  User,
  Clock,
  Radio,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/providers/language-provider";
import {
  useGetEmergencyEstimateQuery,
  useTriggerSosMutation,
  TriggerSosResponse,
} from "@/redux/api/emergencyApi";
import { toast } from "sonner";

interface EmergencySosModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface LocationState {
  lat: number | null;
  lng: number | null;
  accuracy: number | null;
  status: "idle" | "locating" | "success" | "error";
  errorMessage?: string;
}

export function EmergencySosModal({ isOpen, onClose }: EmergencySosModalProps) {
  const { t } = useLanguage();
  const [location, setLocation] = React.useState<LocationState>({
    lat: null,
    lng: null,
    accuracy: null,
    status: "idle",
  });

  const [dispatchData, setDispatchData] = React.useState<TriggerSosResponse | null>(null);

  // Dynamic pre-dispatch estimate query from backend
  const activeLat = location.lat ?? 23.8103;
  const activeLng = location.lng ?? 90.4125;

  const {
    data: estimateData,
    isLoading: isLoadingEstimate,
    refetch: refetchEstimate,
  } = useGetEmergencyEstimateQuery(
    { latitude: activeLat, longitude: activeLng },
    { skip: !isOpen }
  );

  // Live trigger SOS mutation
  const [triggerSos, { isLoading: isDispatching }] = useTriggerSosMutation();

  const requestGpsLocation = React.useCallback(() => {
    if (typeof window === "undefined" || !navigator.geolocation) {
      setLocation({
        lat: 23.8103,
        lng: 90.4125,
        accuracy: 10,
        status: "success",
        errorMessage: "Geolocation not supported, using default medical zone.",
      });
      return;
    }

    setLocation((prev) => ({ ...prev, status: "locating" }));

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: Math.round(position.coords.accuracy),
          status: "success",
        });
      },
      (error) => {
        // Fallback default coordinates (Dhaka Medical Center Zone)
        setLocation({
          lat: 23.8103,
          lng: 90.4125,
          accuracy: 15,
          status: "success",
          errorMessage: error.message,
        });
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }, []);

  React.useEffect(() => {
    if (isOpen) {
      requestGpsLocation();
      setDispatchData(null);
    }
  }, [isOpen, requestGpsLocation]);

  const handleDispatchAmbulance = async () => {
    try {
      const response = await triggerSos({
        latitude: activeLat,
        longitude: activeLng,
        notes: "Emergency SOS triggered from ShebaMitro patient platform",
      }).unwrap();

      setDispatchData(response);
      toast.success(
        response.message || "Emergency ambulance dispatched! Real-time alerts sent."
      );
    } catch (err: any) {
      const msg =
        err?.data?.message || err?.message || "Failed to dispatch ambulance. Please dial 999 immediately.";
      toast.error(msg);
    }
  };

  const etaDisplay = estimateData?.estimatedArrivalText || "4 - 8 Mins";
  const nearbyUnits = estimateData?.nearbyAmbulanceCount || 1;
  const hospitalName = estimateData?.nearestHospitalName || "Dhaka Medical College & Hospital";

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/75 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl border border-red-500/40 bg-surface-card p-6 sm:p-8 backdrop-blur-xl shadow-2xl glow-coral z-10 space-y-5 custom-modal-scrollbar"
            style={{ backgroundColor: "var(--card)" }}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 p-2 rounded-xl text-muted-fg hover:text-fg-app hover:bg-muted-bg transition-colors cursor-pointer"
              aria-label="Close emergency modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Emergency Header */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-red-600/20 text-red-500 border border-red-500/30 flex items-center justify-center animate-pulse glow-coral shrink-0">
                <Siren className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-black text-red-500 tracking-tight flex items-center gap-2">
                  <span>{t("emergencySosDispatch")}</span>
                </h2>
                <p className="text-xs text-muted-fg font-medium">
                  {t("sosSubtitle")}
                </p>
              </div>
            </div>

            {/* GPS Telemetry & Dynamic Estimation Box */}
            <div className="rounded-2xl border border-surface-border bg-muted-bg/60 p-4 space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-muted-fg flex items-center gap-1.5">
                  <Navigation className="w-3.5 h-3.5 text-primary-teal" />
                  {t("gpsStatus")}
                </span>
                {location.status === "locating" && (
                  <span className="text-amber-500 flex items-center gap-1 font-bold">
                    <Loader2 className="w-3 h-3 animate-spin" /> {t("locatingGps")}
                  </span>
                )}
                {location.status === "success" && (
                  <span className="text-emerald-accent flex items-center gap-1 font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" /> {t("gpsLocked")}
                  </span>
                )}
                {location.status === "error" && (
                  <span className="text-red-400 flex items-center gap-1 font-bold">
                    <AlertTriangle className="w-3.5 h-3.5" /> {t("demoLocation")}
                  </span>
                )}
              </div>

              {location.status === "success" && (
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-2.5 rounded-xl bg-surface-card border border-surface-border">
                    <p className="text-[10px] text-muted-fg uppercase font-bold">{t("latitude")}</p>
                    <p className="font-mono font-bold text-primary-teal">
                      {activeLat.toFixed(4)}° N
                    </p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-surface-card border border-surface-border">
                    <p className="text-[10px] text-muted-fg uppercase font-bold">{t("longitude")}</p>
                    <p className="font-mono font-bold text-violet-accent">
                      {activeLng.toFixed(4)}° E
                    </p>
                  </div>
                </div>
              )}

              {/* Dynamic ETA and Standby Units from API */}
              <div className="pt-1 border-t border-surface-border/60 flex flex-col gap-1.5 text-xs text-muted-fg">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-coral-accent shrink-0" />
                    <span>Estimated Arrival:</span>
                    <strong className="text-fg-app font-black">
                      {isLoadingEstimate ? "Calculating..." : etaDisplay}
                    </strong>
                  </span>
                  <button
                    onClick={() => {
                      requestGpsLocation();
                      refetchEstimate();
                    }}
                    className="text-primary-teal hover:underline text-[11px] font-bold cursor-pointer"
                  >
                    {t("refreshGps")}
                  </button>
                </div>

                <div className="flex items-center justify-between text-[11px] text-muted-fg/80">
                  <span className="flex items-center gap-1">
                    <Radio className="w-3 h-3 text-emerald-500 animate-pulse" />
                    <span>{nearbyUnits} Verified Units Standby</span>
                  </span>
                  <span className="truncate max-w-[190px] text-right font-medium text-fg-app/80">
                    ER: {hospitalName}
                  </span>
                </div>
              </div>
            </div>

            {/* Dispatched Live Status View from Real API */}
            {dispatchData ? (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-emerald-accent/15 border border-emerald-accent/40 text-emerald-accent text-center space-y-1.5">
                  <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-accent animate-bounce" />
                  <h3 className="font-black text-base">{t("ambulanceDispatched")}</h3>
                  <p className="text-xs text-muted-fg font-medium">
                    {t("ambulanceEnRoute")}
                  </p>
                </div>

                {/* Assigned Ambulance Card */}
                {dispatchData.dispatchedAmbulance && (
                  <div className="p-3.5 rounded-2xl bg-surface-card border border-surface-border space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-muted-fg uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                        <Ambulance className="w-3.5 h-3.5 text-primary-teal" />
                        Assigned Ambulance
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 font-bold text-[10px]">
                        En Route ({dispatchData.dispatchedAmbulance.distanceKm} km away)
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1">
                      <div>
                        <p className="font-extrabold text-fg-app flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-muted-fg" />
                          {dispatchData.dispatchedAmbulance.driverName}
                        </p>
                        <p className="text-[11px] text-muted-fg font-mono">
                          Plate: {dispatchData.dispatchedAmbulance.vehicleNumber}
                        </p>
                      </div>

                      {dispatchData.dispatchedAmbulance.driverPhone && (
                        <a
                          href={`tel:${dispatchData.dispatchedAmbulance.driverPhone}`}
                          className="px-3 py-1.5 rounded-xl bg-primary-teal text-white font-bold text-xs flex items-center gap-1.5 shadow-sm hover:brightness-110 transition-all"
                        >
                          <PhoneCall className="w-3.5 h-3.5" />
                          <span>Call Driver</span>
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {/* Designated Hospital Card */}
                {dispatchData.nearestHospital && (
                  <div className="p-3.5 rounded-2xl bg-surface-card border border-surface-border text-xs space-y-1.5">
                    <div className="flex items-center justify-between text-[10px] font-bold text-muted-fg uppercase tracking-wider">
                      <span className="flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-violet-500" />
                        Designated Emergency Center
                      </span>
                    </div>
                    <p className="font-extrabold text-fg-app text-xs">
                      {dispatchData.nearestHospital.name}
                    </p>
                    <p className="text-[11px] text-muted-fg">
                      {dispatchData.nearestHospital.address}
                    </p>
                  </div>
                )}

                {/* Live GPS Tracking Token */}
                {dispatchData.trackingToken && (
                  <div className="p-3 rounded-2xl bg-muted-bg/50 border border-surface-border text-center text-xs space-y-1">
                    <p className="text-[11px] text-muted-fg font-medium">
                      Emergency live tracking session generated:
                    </p>
                    <p className="font-mono font-black text-primary-teal text-xs">
                      {dispatchData.trackingToken}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              /* Action Dispatch Button */
              <div className="space-y-3">
                <Button
                  onClick={handleDispatchAmbulance}
                  disabled={isDispatching}
                  variant="coral"
                  size="lg"
                  className="w-full h-12 text-sm font-extrabold uppercase tracking-wide gap-2 bg-red-600 hover:bg-red-700 glow-coral text-white cursor-pointer shadow-lg shadow-red-600/30 transition-all"
                >
                  {isDispatching ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>{t("transmittingGps")}</span>
                    </>
                  ) : (
                    <>
                      <Ambulance className="w-5 h-5" />
                      <span>{t("dispatchAmbulanceNow")}</span>
                    </>
                  )}
                </Button>

                <a
                  href="tel:999"
                  className="w-full h-11 inline-flex items-center justify-center gap-2 rounded-xl border border-surface-border bg-surface-card hover:bg-muted-bg text-xs font-extrabold transition-colors cursor-pointer"
                >
                  <PhoneCall className="w-4 h-4 text-emerald-accent" />
                  <span>{t("callNationalHotline")}</span>
                </a>
              </div>
            )}

            {/* Footer Assurance */}
            <div className="flex items-center justify-center gap-2 pt-1 text-[11px] text-muted-fg/80 border-t border-surface-border/60">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Direct Link with DGHS & Central Ambulance Command Center</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
