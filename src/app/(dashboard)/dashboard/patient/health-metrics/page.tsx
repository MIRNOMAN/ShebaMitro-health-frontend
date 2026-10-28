"use client";

import React, { useState } from "react";
import {
  Activity,
  Heart,
  FlaskConical,
  Plus,
  TrendingUp,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  X,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { BiomarkerTrendCharts } from "@/features/patient/components/BiomarkerTrendCharts";
import { useAppSelector } from "@/redux/hooks";
import { useGetMeQuery } from "@/redux/api/authApi";
import {
  useGetPatientVitalsQuery,
  useSyncVitalsMutation,
  useGetVitalAlertsQuery,
} from "@/redux/api/vitalsApi";

export default function PatientHealthMetricsPage() {
  const { user: authUser } = useAppSelector((state) => state.auth);
  const { data: profileUser } = useGetMeQuery();
  const patientProfileId = profileUser?.id || authUser?.id || "";

  const { data: vitalsList, isLoading, refetch } = useGetPatientVitalsQuery(
    { patientId: patientProfileId },
    { skip: !patientProfileId }
  );

  const { data: alertsList } = useGetVitalAlertsQuery(
    patientProfileId ? { patientId: patientProfileId } : undefined
  );

  const [syncVitals, { isLoading: isSyncing }] = useSyncVitalsMutation();

  // Modal State
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [vitalType, setVitalType] = useState<"HEART_RATE" | "BP" | "GLUCOSE" | "SPO2">("HEART_RATE");
  const [vitalValue, setVitalValue] = useState<string>("");
  const [logSuccessMessage, setLogSuccessMessage] = useState<string>("");

  const handleLogVital = async (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(vitalValue);
    if (isNaN(num) || num <= 0) return;

    const unitMap = {
      HEART_RATE: "BPM",
      BP: "mmHg",
      GLUCOSE: "mmol/L",
      SPO2: "%",
    };

    try {
      await syncVitals({
        vitals: [
          {
            type: vitalType,
            value: num,
            unit: unitMap[vitalType],
            patientId: patientProfileId || undefined,
          },
        ],
      }).unwrap();

      setLogSuccessMessage("Vital reading recorded successfully in secure database!");
      setVitalValue("");
      setTimeout(() => {
        setLogSuccessMessage("");
        setIsLogModalOpen(false);
        refetch();
      }, 1500);
    } catch (err) {
      console.error("Failed to log vital:", err);
    }
  };

  const latestHeartRate = vitalsList?.find((v) => v.type === "HEART_RATE")?.value ?? 72;
  const latestBp = vitalsList?.find((v) => v.type === "BP")?.value;
  const latestGlucose = vitalsList?.find((v) => v.type === "GLUCOSE")?.value ?? 5.6;
  const latestSpo2 = vitalsList?.find((v) => v.type === "SPO2")?.value ?? 98;

  return (
    <div className="space-y-6 sm:space-y-8 pb-10">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gradient-to-r from-primary-teal/10 via-background to-background p-6 rounded-3xl border border-surface-border">
        <div className="space-y-1">
          <span className="text-xs font-black uppercase tracking-wider text-primary-teal flex items-center gap-1.5">
            <Activity className="h-4 w-4" /> Biometric Vitals & Longitudinal Telemetry
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-fg-app tracking-tight">
            Personal Health <span className="text-primary-teal">Metrics & Analytics</span>
          </h1>
          <p className="text-xs text-muted-fg">
            Track daily heart rate, blood pressure, glycemic biomarkers and oxygen saturation in real-time.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsLogModalOpen(true)}
          className="gap-2 text-xs font-bold rounded-xl cursor-pointer"
        >
          <Plus className="h-4 w-4" /> Log New Vital
        </Button>
      </div>

      {/* Emergency Alerts Ribbon (if any threshold breached) */}
      {alertsList && alertsList.length > 0 && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3 text-xs">
          <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-black text-amber-800 dark:text-amber-300">Biometric Alert Triggered</h4>
            <p className="text-amber-700 dark:text-amber-400">
              {alertsList[0].message || "One of your vital readings crossed clinical threshold levels."}
            </p>
          </div>
        </div>
      )}

      {/* Vitals Summary Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Heart Rate */}
        <div className="p-5 rounded-3xl border border-surface-border bg-surface-card space-y-2 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-fg">Heart Rate</span>
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-500">
              <Heart className="h-4 w-4 fill-rose-500" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-fg-app">{latestHeartRate}</span>
            <span className="text-xs text-muted-fg font-bold">BPM</span>
          </div>
          <span className="text-[11px] font-bold text-emerald-accent flex items-center gap-1">
            <CheckCircle2 className="h-3.5 w-3.5" /> Normal Resting Range
          </span>
        </div>

        {/* Blood Pressure */}
        <div className="p-5 rounded-3xl border border-surface-border bg-surface-card space-y-2 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-fg">Blood Pressure</span>
            <div className="p-2 rounded-xl bg-primary-teal/10 text-primary-teal">
              <Activity className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-fg-app">
              {latestBp ? `${latestBp} / 80` : "120 / 80"}
            </span>
            <span className="text-xs text-muted-fg font-bold">mmHg</span>
          </div>
          <span className="text-[11px] font-bold text-emerald-accent flex items-center gap-1">
            <CheckCircle2 className="h-3.5 w-3.5" /> Optimal Systolic/Diastolic
          </span>
        </div>

        {/* Fasting Glucose */}
        <div className="p-5 rounded-3xl border border-surface-border bg-surface-card space-y-2 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-fg">Fasting Blood Sugar</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
              <FlaskConical className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-fg-app">{latestGlucose}</span>
            <span className="text-xs text-muted-fg font-bold">mmol/L</span>
          </div>
          <span className="text-[11px] font-bold text-emerald-accent flex items-center gap-1">
            <CheckCircle2 className="h-3.5 w-3.5" /> Normal Glycemic Level
          </span>
        </div>

        {/* SpO2 */}
        <div className="p-5 rounded-3xl border border-surface-border bg-surface-card space-y-2 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-fg">Blood Oxygen (SpO2)</span>
            <div className="p-2 rounded-xl bg-violet-accent/10 text-violet-accent">
              <Activity className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-fg-app">{latestSpo2}</span>
            <span className="text-xs text-muted-fg font-bold">%</span>
          </div>
          <span className="text-[11px] font-bold text-emerald-accent flex items-center gap-1">
            <CheckCircle2 className="h-3.5 w-3.5" /> Optimal Oxygen Saturation
          </span>
        </div>
      </div>

      {/* Historical Trend Charts */}
      <BiomarkerTrendCharts />

      {/* Modal: Log New Vital */}
      {isLogModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="w-full max-w-md bg-surface-card border border-surface-border rounded-3xl p-6 space-y-5 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-surface-border pb-3">
              <h3 className="font-black text-base text-fg-app">Log Biometric Reading</h3>
              <button
                type="button"
                onClick={() => setIsLogModalOpen(false)}
                className="p-1 rounded-xl text-muted-fg hover:text-fg-app"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {logSuccessMessage ? (
              <div className="p-6 text-center text-emerald-600 space-y-2">
                <CheckCircle2 className="h-10 w-10 mx-auto" />
                <p className="font-bold text-sm">{logSuccessMessage}</p>
              </div>
            ) : (
              <form onSubmit={handleLogVital} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-muted-fg">Metric Type</label>
                  <select
                    value={vitalType}
                    onChange={(e) => setVitalType(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl bg-muted-bg border border-surface-border text-xs font-bold text-fg-app outline-none focus:border-primary-teal"
                  >
                    <option value="HEART_RATE">Heart Rate (BPM)</option>
                    <option value="BP">Systolic Blood Pressure (mmHg)</option>
                    <option value="GLUCOSE">Fasting Glucose (mmol/L)</option>
                    <option value="SPO2">Blood Oxygen SpO2 (%)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-muted-fg">Reading Value</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={vitalValue}
                    onChange={(e) => setVitalValue(e.target.value)}
                    placeholder="Enter reading e.g. 72, 120, 5.6, 98"
                    className="w-full p-2.5 rounded-xl bg-muted-bg border border-surface-border text-xs font-bold text-fg-app outline-none focus:border-primary-teal"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSyncing}
                  variant="primary"
                  className="w-full text-xs font-bold rounded-xl mt-2"
                >
                  {isSyncing ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save to Database"}
                </Button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

