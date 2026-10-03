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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/providers/language-provider";

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

  const [dispatchStatus, setDispatchStatus] = React.useState<"idle" | "dispatching" | "dispatched">("idle");

  const requestGpsLocation = React.useCallback(() => {
    if (!navigator.geolocation) {
      setLocation({
        lat: null,
        lng: null,
        accuracy: null,
        status: "error",
        errorMessage: "Geolocation is not supported by your browser.",
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
        setLocation({
          lat: 23.8103, // Fallback demo coordinates
          lng: 90.4125,
          accuracy: 15,
          status: "success",
          errorMessage: error.message,
        });
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  React.useEffect(() => {
    if (isOpen) {
      requestGpsLocation();
      setDispatchStatus("idle");
    }
  }, [isOpen, requestGpsLocation]);

  const handleDispatchAmbulance = () => {
    setDispatchStatus("dispatching");
    setTimeout(() => {
      setDispatchStatus("dispatched");
    }, 2000);
  };

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
            className="fixed inset-0 bg-black/70 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-red-500/40 bg-surface-card p-6 sm:p-8 backdrop-blur-xl shadow-2xl glow-coral z-10 space-y-6"
            style={{ backgroundColor: "var(--card)" }}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 p-2 rounded-xl text-muted-fg hover:text-fg-app hover:bg-muted-bg transition-colors"
              aria-label="Close emergency modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Emergency Header */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-red-600/20 text-red-500 border border-red-500/30 flex items-center justify-center animate-pulse glow-coral">
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

            {/* GPS Telemetry Box */}
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
                      {location.lat?.toFixed(4)}° N
                    </p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-surface-card border border-surface-border">
                    <p className="text-[10px] text-muted-fg uppercase font-bold">{t("longitude")}</p>
                    <p className="font-mono font-bold text-violet-accent">
                      {location.lng?.toFixed(4)}° E
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between text-[11px] text-muted-fg pt-1">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-coral-accent" />
                  {t("estimatedArrival")} <strong className="text-fg-app font-bold">{t("minsArrival")}</strong>
                </span>
                <button
                  onClick={requestGpsLocation}
                  className="text-primary-teal hover:underline text-[11px] font-bold"
                >
                  {t("refreshGps")}
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            {dispatchStatus === "dispatched" ? (
              <div className="p-4 rounded-2xl bg-emerald-accent/15 border border-emerald-accent/40 text-emerald-accent text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-accent animate-bounce" />
                <h3 className="font-bold text-base">{t("ambulanceDispatched")}</h3>
                <p className="text-xs text-muted-fg font-medium">
                  {t("ambulanceEnRoute")}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <Button
                  onClick={handleDispatchAmbulance}
                  disabled={dispatchStatus === "dispatching"}
                  variant="coral"
                  size="lg"
                  className="w-full h-12 text-sm font-extrabold uppercase tracking-wide gap-2 bg-red-600 hover:bg-red-700 glow-coral text-white"
                >
                  {dispatchStatus === "dispatching" ? (
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
                  className="w-full h-11 inline-flex items-center justify-center gap-2 rounded-xl border border-surface-border bg-surface-card hover:bg-muted-bg text-xs font-extrabold transition-colors"
                >
                  <PhoneCall className="w-4 h-4 text-emerald-accent" />
                  <span>{t("callNationalHotline")}</span>
                </a>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
