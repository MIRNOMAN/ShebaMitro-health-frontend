"use client";

import React, { useState, useMemo } from "react";
import {
  Activity,
  Heart,
  FlaskConical,
  Plus,
  AlertTriangle,
  CheckCircle2,
  X,
  Loader2,
  Gauge,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { BiomarkerTrendCharts } from "@/features/patient/components/BiomarkerTrendCharts";
import { useAppSelector } from "@/redux/hooks";
import { useGetMeQuery } from "@/redux/api/authApi";
import {
  useGetPatientVitalsQuery,
  useGetBiomarkerAnalyticsQuery,
  useSyncVitalsMutation,
  useGetVitalAlertsQuery,
} from "@/redux/api/vitalsApi";
import { toast } from "sonner";

export default function PatientHealthMetricsPage() {
  const { user: authUser } = useAppSelector((state) => state.auth);
  const { data: profileUser } = useGetMeQuery();
  const patientProfileId = profileUser?.id || authUser?.id || "";

  // 1. Fetch real biometric vitals list from database
  const {
    data: vitalsList,
    isLoading: vitalsLoading,
    refetch: refetchVitals,
  } = useGetPatientVitalsQuery(
    { patientId: patientProfileId },
    { skip: !patientProfileId }
  );

  // 2. Fetch biomarker analytics for FBS and BP to sync latest lab readings
  const { data: fbsAnalytics, refetch: refetchFbs } =
    useGetBiomarkerAnalyticsQuery(
      { patientId: patientProfileId, marker: "fbs" },
      { skip: !patientProfileId }
    );

  const { data: bpAnalytics, refetch: refetchBp } =
    useGetBiomarkerAnalyticsQuery(
      { patientId: patientProfileId, marker: "bp" },
      { skip: !patientProfileId }
    );

  // 3. Emergency threshold alerts from DB
  const { data: alertsList } = useGetVitalAlertsQuery(
    patientProfileId ? { patientId: patientProfileId } : undefined
  );

  const [syncVitals, { isLoading: isSyncing }] = useSyncVitalsMutation();

  // Modal State
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [vitalType, setVitalType] = useState<
    "HEART_RATE" | "BP" | "GLUCOSE" | "SPO2"
  >("HEART_RATE");
  const [vitalValue, setVitalValue] = useState<string>("");
  const [bpDiastolicValue, setBpDiastolicValue] = useState<string>("");

  // ===================== DYNAMIC VITALS CALCULATION =====================

  // Heart Rate
  const latestHeartRateVital = vitalsList?.find((v) => v.type === "HEART_RATE");
  const heartRateValue = latestHeartRateVital ? latestHeartRateVital.value : null;

  const heartRateStatus = useMemo(() => {
    if (heartRateValue === null) {
      return {
        label: "No reading recorded",
        color: "text-muted-fg",
        icon: Activity,
      };
    }
    if (heartRateValue < 60) {
      return {
        label: "Bradycardia (Low)",
        color: "text-amber-500",
        icon: AlertTriangle,
      };
    }
    if (heartRateValue <= 100) {
      return {
        label: "Normal Resting Range",
        color: "text-emerald-accent",
        icon: CheckCircle2,
      };
    }
    return {
      label: "Elevated Heart Rate ⚠️",
      color: "text-rose-500",
      icon: AlertTriangle,
    };
  }, [heartRateValue]);

  // Blood Pressure
  const latestBpVital = vitalsList?.find((v) => v.type === "BP");
  const bpChartPoints = bpAnalytics?.chartData || [];

  const bpSystolic = useMemo(() => {
    if (latestBpVital) return latestBpVital.value;
    const sysPoint = bpChartPoints
      .slice()
      .reverse()
      .find(
        (p) =>
          p.markerKey.includes("systolic") || !p.markerKey.includes("diastolic")
      );
    return sysPoint ? sysPoint.value : null;
  }, [latestBpVital, bpChartPoints]);

  const bpDiastolic = useMemo(() => {
    const diaPoint = bpChartPoints
      .slice()
      .reverse()
      .find((p) => p.markerKey.includes("diastolic"));
    if (diaPoint) return diaPoint.value;
    if (latestBpVital) return 80; // Standard nominal diastolic when single value logged
    return null;
  }, [latestBpVital, bpChartPoints]);

  const bpStatus = useMemo(() => {
    if (bpSystolic === null) {
      return {
        label: "No reading recorded",
        color: "text-muted-fg",
        icon: Activity,
      };
    }
    const dia = bpDiastolic ?? 80;
    if (bpSystolic < 120 && dia < 80) {
      return {
        label: "Optimal Systolic/Diastolic",
        color: "text-emerald-accent",
        icon: CheckCircle2,
      };
    }
    if (bpSystolic <= 129 && dia < 80) {
      return {
        label: "Elevated Blood Pressure",
        color: "text-amber-500",
        icon: AlertTriangle,
      };
    }
    if (bpSystolic >= 140 || dia >= 90) {
      return {
        label: "Stage 2 Hypertension ⚠️",
        color: "text-rose-500",
        icon: AlertTriangle,
      };
    }
    return {
      label: "Stage 1 Hypertension ⚠️",
      color: "text-amber-500",
      icon: AlertTriangle,
    };
  }, [bpSystolic, bpDiastolic]);

  // Fasting Blood Sugar
  const latestGlucoseVital = vitalsList?.find((v) => v.type === "GLUCOSE");
  const fbsChartPoints = fbsAnalytics?.chartData || [];

  const glucoseValue = useMemo(() => {
    if (latestGlucoseVital) return latestGlucoseVital.value;
    const latestFbs = fbsChartPoints[fbsChartPoints.length - 1];
    return latestFbs ? latestFbs.value : null;
  }, [latestGlucoseVital, fbsChartPoints]);

  const glucoseStatus = useMemo(() => {
    if (glucoseValue === null) {
      return {
        label: "No reading recorded",
        color: "text-muted-fg",
        icon: Activity,
      };
    }
    if (glucoseValue < 4.0) {
      return {
        label: "Hypoglycemia (Low) ⚠️",
        color: "text-amber-500",
        icon: AlertTriangle,
      };
    }
    if (glucoseValue <= 6.0) {
      return {
        label: "Normal Glycemic Level",
        color: "text-emerald-accent",
        icon: CheckCircle2,
      };
    }
    if (glucoseValue <= 7.0) {
      return {
        label: "Impaired Fasting Glucose ⚠️",
        color: "text-amber-500",
        icon: AlertTriangle,
      };
    }
    return {
      label: "Elevated Glucose ⚠️",
      color: "text-rose-500",
      icon: AlertTriangle,
    };
  }, [glucoseValue]);

  // Blood Oxygen (SpO2)
  const latestSpo2Vital = vitalsList?.find((v) => v.type === "SPO2");
  const spo2Value = latestSpo2Vital ? latestSpo2Vital.value : null;

  const spo2Status = useMemo(() => {
    if (spo2Value === null) {
      return {
        label: "No reading recorded",
        color: "text-muted-fg",
        icon: Activity,
      };
    }
    if (spo2Value >= 95) {
      return {
        label: "Optimal Oxygen Saturation",
        color: "text-emerald-accent",
        icon: CheckCircle2,
      };
    }
    if (spo2Value >= 90) {
      return {
        label: "Low Saturation ⚠️",
        color: "text-amber-500",
        icon: AlertTriangle,
      };
    }
    return {
      label: "Critical Hypoxia 🚨",
      color: "text-rose-500",
      icon: AlertTriangle,
    };
  }, [spo2Value]);

  // ===================== LOG VITAL HANDLER =====================
  const handleLogVital = async (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(vitalValue);
    if (isNaN(num) || num <= 0) {
      toast.error("Please enter a valid numeric reading");
      return;
    }

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

      toast.success(
        `${vitalType.replace("_", " ")} reading saved to secure database!`
      );
      setVitalValue("");
      setBpDiastolicValue("");
      setIsLogModalOpen(false);
      refetchVitals();
      refetchBp();
      refetchFbs();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to log vital reading");
    }
  };

  const HeartRateIcon = heartRateStatus.icon;
  const BpIcon = bpStatus.icon;
  const GlucoseIcon = glucoseStatus.icon;
  const Spo2Icon = spo2Status.icon;

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
          className="gap-2 text-xs font-bold rounded-xl cursor-pointer shadow-md hover:shadow-lg transition-all"
        >
          <Plus className="h-4 w-4" /> Log New Vital
        </Button>
      </div>

      {/* Emergency Alerts Ribbon (if any threshold breached) */}
      {alertsList && alertsList.length > 0 && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3 text-xs shadow-xs animate-in fade-in duration-300">
          <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-black text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
              <span>Biometric Alert Triggered</span>
              <span className="text-[10px] uppercase px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-300 font-bold">
                Clinical Threshold
              </span>
            </h4>
            <p className="text-amber-700 dark:text-amber-400 font-medium leading-relaxed">
              {alertsList[0].message ||
                "One of your vital readings crossed clinical threshold levels."}
            </p>
          </div>
        </div>
      )}

      {/* Vitals Summary Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Heart Rate */}
        <div className="p-5 rounded-3xl border border-surface-border bg-surface-card space-y-2 shadow-xs hover:border-surface-border/80 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-fg">Heart Rate</span>
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-500">
              <Heart className="h-4 w-4 fill-rose-500" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-fg-app">
              {heartRateValue !== null ? heartRateValue : "--"}
            </span>
            <span className="text-xs text-muted-fg font-bold">BPM</span>
          </div>
          <span
            className={`text-[11px] font-bold ${heartRateStatus.color} flex items-center gap-1`}
          >
            <HeartRateIcon className="h-3.5 w-3.5" /> {heartRateStatus.label}
          </span>
        </div>

        {/* Blood Pressure */}
        <div className="p-5 rounded-3xl border border-surface-border bg-surface-card space-y-2 shadow-xs hover:border-surface-border/80 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-fg">Blood Pressure</span>
            <div className="p-2 rounded-xl bg-primary-teal/10 text-primary-teal">
              <Activity className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-fg-app">
              {bpSystolic !== null
                ? bpDiastolic !== null
                  ? `${bpSystolic} / ${bpDiastolic}`
                  : `${bpSystolic} / 80`
                : "-- / --"}
            </span>
            <span className="text-xs text-muted-fg font-bold">mmHg</span>
          </div>
          <span
            className={`text-[11px] font-bold ${bpStatus.color} flex items-center gap-1`}
          >
            <BpIcon className="h-3.5 w-3.5" /> {bpStatus.label}
          </span>
        </div>

        {/* Fasting Glucose */}
        <div className="p-5 rounded-3xl border border-surface-border bg-surface-card space-y-2 shadow-xs hover:border-surface-border/80 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-fg">
              Fasting Blood Sugar
            </span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
              <FlaskConical className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-fg-app">
              {glucoseValue !== null ? glucoseValue : "--"}
            </span>
            <span className="text-xs text-muted-fg font-bold">mmol/L</span>
          </div>
          <span
            className={`text-[11px] font-bold ${glucoseStatus.color} flex items-center gap-1`}
          >
            <GlucoseIcon className="h-3.5 w-3.5" /> {glucoseStatus.label}
          </span>
        </div>

        {/* SpO2 */}
        <div className="p-5 rounded-3xl border border-surface-border bg-surface-card space-y-2 shadow-xs hover:border-surface-border/80 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-fg">
              Blood Oxygen (SpO2)
            </span>
            <div className="p-2 rounded-xl bg-violet-accent/10 text-violet-accent">
              <Gauge className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-fg-app">
              {spo2Value !== null ? spo2Value : "--"}
            </span>
            <span className="text-xs text-muted-fg font-bold">%</span>
          </div>
          <span
            className={`text-[11px] font-bold ${spo2Status.color} flex items-center gap-1`}
          >
            <Spo2Icon className="h-3.5 w-3.5" /> {spo2Status.label}
          </span>
        </div>
      </div>

      {/* Historical Trend Charts */}
      <BiomarkerTrendCharts />

      {/* Modal: Log New Vital */}
      {isLogModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className="w-full max-w-md bg-surface-card border border-surface-border rounded-3xl p-6 space-y-5 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-surface-border pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-primary-teal/10 text-primary-teal">
                  <Activity className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-black text-base text-fg-app">
                    Log Biometric Reading
                  </h3>
                  <p className="text-[11px] text-muted-fg">
                    Direct database telemetry & clinical monitoring
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsLogModalOpen(false)}
                className="p-1.5 rounded-xl text-muted-fg hover:text-fg-app hover:bg-muted-bg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleLogVital} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-fg">
                  Metric Type
                </label>
                <select
                  value={vitalType}
                  onChange={(e) => setVitalType(e.target.value as any)}
                  className="w-full p-3 rounded-xl bg-muted-bg border border-surface-border text-xs font-bold text-fg-app outline-none focus:border-primary-teal"
                >
                  <option value="HEART_RATE">Heart Rate (BPM)</option>
                  <option value="BP">Blood Pressure (Systolic mmHg)</option>
                  <option value="GLUCOSE">Fasting Glucose (mmol/L)</option>
                  <option value="SPO2">Blood Oxygen SpO2 (%)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-fg">
                  {vitalType === "BP"
                    ? "Systolic Value (mmHg)"
                    : vitalType === "HEART_RATE"
                    ? "Heart Rate (BPM)"
                    : vitalType === "GLUCOSE"
                    ? "Fasting Blood Sugar (mmol/L)"
                    : "Blood Oxygen SpO2 (%)"}
                </label>
                <input
                  type="number"
                  step={vitalType === "GLUCOSE" ? "0.1" : "1"}
                  required
                  value={vitalValue}
                  onChange={(e) => setVitalValue(e.target.value)}
                  placeholder={
                    vitalType === "BP"
                      ? "e.g. 120"
                      : vitalType === "HEART_RATE"
                      ? "e.g. 72"
                      : vitalType === "GLUCOSE"
                      ? "e.g. 5.6"
                      : "e.g. 98"
                  }
                  className="w-full p-3 rounded-xl bg-muted-bg border border-surface-border text-xs font-bold text-fg-app outline-none focus:border-primary-teal placeholder:text-muted-fg/50"
                />
              </div>

              {vitalType === "BP" && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-muted-fg">
                    Diastolic Value (mmHg)
                  </label>
                  <input
                    type="number"
                    step="1"
                    value={bpDiastolicValue}
                    onChange={(e) => setBpDiastolicValue(e.target.value)}
                    placeholder="e.g. 80 (standard optimal diastolic)"
                    className="w-full p-3 rounded-xl bg-muted-bg border border-surface-border text-xs font-bold text-fg-app outline-none focus:border-primary-teal placeholder:text-muted-fg/50"
                  />
                  <p className="text-[10px] text-muted-fg">
                    Diastolic pressure is recorded alongside systolic telemetry.
                  </p>
                </div>
              )}

              <div className="pt-2 flex items-center justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsLogModalOpen(false)}
                  className="text-xs font-bold rounded-xl"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSyncing}
                  variant="primary"
                  className="text-xs font-bold rounded-xl gap-2 cursor-pointer"
                >
                  {isSyncing ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Saving...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" /> Save to Database
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
