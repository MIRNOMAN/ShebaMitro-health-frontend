"use client";

import React, { useState, useMemo } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceArea,
  ReferenceLine,
} from "recharts";
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Plus,
  X,
  Loader2,
  Heart,
  Droplet,
  Percent,
} from "lucide-react";
import { useAppSelector } from "@/redux/hooks";
import { useGetMeQuery } from "@/redux/api/authApi";
import {
  useGetBiomarkerAnalyticsQuery,
  useGetPatientVitalsQuery,
  useSyncVitalsMutation,
} from "@/redux/api/vitalsApi";
import { toast } from "sonner";

interface FbsPoint {
  month: string;
  fbs: number;
  status: string;
  rawDate?: string;
  unit: string;
}

interface Hba1cPoint {
  month: string;
  hba1c: number;
  status: string;
  rawDate?: string;
  unit: string;
}

interface BpPoint {
  month: string;
  systolic: number;
  diastolic: number;
  status: string;
  rawDate?: string;
  unit: string;
}

export function BiomarkerTrendCharts() {
  const [activeTab, setActiveTab] = useState<"fbs" | "hba1c" | "bp">("fbs");
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [logType, setLogType] = useState<"GLUCOSE" | "BP" | "HBA1C">("GLUCOSE");
  const [logValue, setLogValue] = useState("");
  const [logBpDiastolic, setLogBpDiastolic] = useState("");

  const { user: authUser } = useAppSelector((state) => state.auth);
  const { data: profileUser } = useGetMeQuery();
  const patientProfileId = profileUser?.id || authUser?.id || "";

  // 1. Fetch Dynamic Biomarker Analytics for all 3 categories
  const { data: fbsAnalytics, isLoading: fbsLoading, refetch: refetchFbs } =
    useGetBiomarkerAnalyticsQuery(
      { patientId: patientProfileId, marker: "fbs" },
      { skip: !patientProfileId }
    );

  const { data: hba1cAnalytics, isLoading: hba1cLoading, refetch: refetchHba1c } =
    useGetBiomarkerAnalyticsQuery(
      { patientId: patientProfileId, marker: "hba1c" },
      { skip: !patientProfileId }
    );

  const { data: bpAnalytics, isLoading: bpLoading, refetch: refetchBp } =
    useGetBiomarkerAnalyticsQuery(
      { patientId: patientProfileId, marker: "bp" },
      { skip: !patientProfileId }
    );

  // 2. Fetch Biometric Vitals (for newly logged data)
  const { data: vitalsList, refetch: refetchVitals } = useGetPatientVitalsQuery(
    { patientId: patientProfileId },
    { skip: !patientProfileId }
  );

  const [syncVitals, { isLoading: isSyncing }] = useSyncVitalsMutation();

  // Helper to extract short month name (e.g. "May", "Jun")
  const formatMonth = (dateStr?: string) => {
    if (!dateStr) return "N/A";
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-US", { month: "short" });
    } catch {
      return dateStr;
    }
  };

  // 3. Process Dynamic FBS Data Points
  const dynamicFbs: FbsPoint[] = useMemo(() => {
    const apiPoints = fbsAnalytics?.chartData || [];
    if (apiPoints.length > 0) {
      return apiPoints.map((p) => ({
        month: formatMonth(p.date || p.timestamp),
        fbs: Number(p.value.toFixed(1)),
        status: p.status === "HIGH" ? "High ⚠️" : "Normal",
        rawDate: p.date,
        unit: p.unit || "mmol/L",
      }));
    }

    // Fallback to vitals sync table if available
    const glucoseVitals = (vitalsList || []).filter((v) => v.type === "GLUCOSE");
    if (glucoseVitals.length > 0) {
      return glucoseVitals
        .slice()
        .reverse()
        .map((v) => ({
          month: formatMonth(v.recordedAt || v.createdAt),
          fbs: Number(v.value.toFixed(1)),
          status: v.value > 6.0 ? "High ⚠️" : "Normal",
          rawDate: v.recordedAt,
          unit: v.unit || "mmol/L",
        }));
    }

    return [];
  }, [fbsAnalytics, vitalsList]);

  // 4. Process Dynamic HbA1c Data Points
  const dynamicHba1c: Hba1cPoint[] = useMemo(() => {
    const apiPoints = hba1cAnalytics?.chartData || [];
    if (apiPoints.length > 0) {
      return apiPoints.map((p) => ({
        month: formatMonth(p.date || p.timestamp),
        hba1c: Number(p.value.toFixed(1)),
        status: p.status === "HIGH" ? "Elevated ⚠️" : "Normal",
        rawDate: p.date,
        unit: p.unit || "%",
      }));
    }
    return [];
  }, [hba1cAnalytics]);

  // 5. Process Dynamic BP Data Points
  const dynamicBp: BpPoint[] = useMemo(() => {
    const apiPoints = bpAnalytics?.chartData || [];
    if (apiPoints.length > 0) {
      const grouped: { [key: string]: { month: string; systolic?: number; diastolic?: number; rawDate: string } } = {};
      for (const p of apiPoints) {
        const key = p.date || (p.timestamp ? p.timestamp.split("T")[0] : "recent") || "recent";
        const m = formatMonth(key);
        if (!grouped[key]) {
          grouped[key] = { month: m, rawDate: key };
        }
        const g = grouped[key]!;
        if (p.markerKey.includes("systolic") || !p.markerKey.includes("diastolic")) {
          g.systolic = p.value;
        } else {
          g.diastolic = p.value;
        }
      }

      return Object.values(grouped).map((item) => {
        const sys = item.systolic ?? 120;
        const dia = item.diastolic ?? 80;
        const isHigh = sys > 130 || dia > 85;
        return {
          month: item.month,
          systolic: sys,
          diastolic: dia,
          status: isHigh ? "High BP ⚠️" : "Optimal",
          rawDate: item.rawDate,
          unit: "mmHg",
        };
      });
    }

    // Fallback to vitals sync table if available
    const bpVitals = (vitalsList || []).filter((v) => v.type === "BP");
    if (bpVitals.length > 0) {
      return bpVitals
        .slice()
        .reverse()
        .map((v) => ({
          month: formatMonth(v.recordedAt || v.createdAt),
          systolic: v.value,
          diastolic: 80,
          status: v.value > 130 ? "High BP ⚠️" : "Optimal",
          rawDate: v.recordedAt,
          unit: "mmHg",
        }));
    }

    return [];
  }, [bpAnalytics, vitalsList]);

  // 6. Dynamic Evaluation of Abnormal Flags across the active metric
  const alertEvaluation = useMemo(() => {
    if (activeTab === "fbs") {
      if (dynamicFbs.length === 0) {
        return {
          type: "info",
          title: "Telemetry Active:",
          text: "No Fasting Blood Sugar readings logged yet. Record your morning readings to trace glycemic trends.",
          badgeText: "Awaiting Data",
          badgeColor: "text-muted-fg bg-muted-bg/50 border-surface-border",
        };
      }

      const spikes = dynamicFbs.filter((d) => d.fbs > 6.0);
      const latest = dynamicFbs[dynamicFbs.length - 1];

      if (spikes.length > 0 && latest) {
        let highest = spikes[0]!;
        for (const s of spikes) {
          if (s.fbs > highest.fbs) highest = s;
        }

        const isLatestNormal = latest.fbs <= 6.0;

        if (isLatestNormal) {
          return {
            type: "warning",
            title: "Abnormal Value Flagged:",
            text: `In ${highest.month}, Fasting Sugar spiked to ${highest.fbs} mmol/L. Current ${latest.month} values returned to healthy target zone (${latest.fbs} mmol/L).`,
            badgeText: `${latest.month}: Normal Zone ✓`,
            badgeColor: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
          };
        } else {
          return {
            type: "danger",
            title: "Elevated Reading Detected:",
            text: `Latest Fasting Sugar in ${latest.month} is ${latest.fbs} mmol/L (Above 6.0 mmol/L reference). Please monitor dietary carbohydrates and consult your doctor.`,
            badgeText: `${latest.month}: Elevated ⚠️`,
            badgeColor: "text-amber-500 bg-amber-500/10 border-amber-500/30",
          };
        }
      }

      return {
        type: "success",
        title: "Normal Glycemic Profile:",
        text: `All recorded Fasting Blood Sugar readings are safely within the healthy target zone (4.0 - 6.0 mmol/L).`,
        badgeText: `${latest?.month || "Current"}: Optimal ✓`,
        badgeColor: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
      };
    }

    if (activeTab === "hba1c") {
      if (dynamicHba1c.length === 0) {
        return {
          type: "info",
          title: "HbA1c Tracking:",
          text: "No 3-month average HbA1c records found. Upload a diagnostic lab report to populate glycated hemoglobin trends.",
          badgeText: "Awaiting Data",
          badgeColor: "text-muted-fg bg-muted-bg/50 border-surface-border",
        };
      }

      const spikes = dynamicHba1c.filter((d) => d.hba1c > 5.6);
      const latest = dynamicHba1c[dynamicHba1c.length - 1];

      if (spikes.length > 0 && latest) {
        let highest = spikes[0]!;
        for (const s of spikes) {
          if (s.hba1c > highest.hba1c) highest = s;
        }

        const isLatestNormal = latest.hba1c <= 5.6;

        if (isLatestNormal) {
          return {
            type: "warning",
            title: "Abnormal Value Flagged:",
            text: `In ${highest.month}, HbA1c peaked at ${highest.hba1c}%. Current ${latest.month} reading has returned to normal healthy target (${latest.hba1c}%).`,
            badgeText: `${latest.month}: Normal Zone ✓`,
            badgeColor: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
          };
        } else {
          return {
            type: "danger",
            title: "Elevated HbA1c Flagged:",
            text: `Latest HbA1c in ${latest.month} is ${latest.hba1c}% (Threshold is 5.6%). Follow-up endocrinology review recommended.`,
            badgeText: `${latest.month}: Elevated ⚠️`,
            badgeColor: "text-amber-500 bg-amber-500/10 border-amber-500/30",
          };
        }
      }

      return {
        type: "success",
        title: "Optimal Glycated Hemoglobin:",
        text: `All tracked HbA1c measurements are within the ideal target reference range (4.0% - 5.6%).`,
        badgeText: `${latest?.month || "Current"}: Optimal ✓`,
        badgeColor: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
      };
    }

    // BP tab
    if (dynamicBp.length === 0) {
      return {
        type: "info",
        title: "BP Telemetry:",
        text: "No Blood Pressure logs found. Log your systolic and diastolic readings to analyze cardiovascular trends.",
        badgeText: "Awaiting Data",
        badgeColor: "text-muted-fg bg-muted-bg/50 border-surface-border",
      };
    }

    const spikes = dynamicBp.filter((d) => d.systolic > 125 || d.diastolic > 85);
    const latest = dynamicBp[dynamicBp.length - 1];

    if (spikes.length > 0 && latest) {
      let highest = spikes[0]!;
      for (const s of spikes) {
        if (s.systolic > highest.systolic) highest = s;
      }

      const isLatestNormal = latest.systolic <= 125 && latest.diastolic <= 85;

      if (isLatestNormal) {
        return {
          type: "warning",
          title: "Abnormal Value Flagged:",
          text: `In ${highest.month}, BP spiked to ${highest.systolic}/${highest.diastolic} mmHg. Current ${latest.month} reading stabilized at optimal ${latest.systolic}/${latest.diastolic} mmHg.`,
          badgeText: `${latest.month}: Normal Zone ✓`,
          badgeColor: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
        };
      } else {
        return {
          type: "danger",
          title: "Elevated BP Flagged:",
          text: `Latest Blood Pressure in ${latest.month} is ${latest.systolic}/${latest.diastolic} mmHg. Keep salt intake low and recheck in 24 hours.`,
          badgeText: `${latest.month}: High BP ⚠️`,
          badgeColor: "text-amber-500 bg-amber-500/10 border-amber-500/30",
        };
      }
    }

    return {
      type: "success",
      title: "Optimal Cardiovascular Range:",
      text: `All systolic and diastolic readings over the tracked months are within healthy target boundaries.`,
      badgeText: `${latest?.month || "Current"}: Optimal ✓`,
      badgeColor: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
    };
  }, [activeTab, dynamicFbs, dynamicHba1c, dynamicBp]);

  // 7. Handle Add Reading Modal Submission
  const handleSaveVital = async (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(logValue);
    if (isNaN(val) || val <= 0) {
      toast.error("Please enter a valid numeric reading");
      return;
    }

    try {
      if (logType === "BP") {
        await syncVitals({
          vitals: [
            {
              type: "BP",
              value: val,
              unit: "mmHg",
              patientId: patientProfileId,
              recordedAt: new Date().toISOString(),
            },
          ],
        }).unwrap();
      } else {
        await syncVitals({
          vitals: [
            {
              type: logType === "GLUCOSE" ? "GLUCOSE" : "SPO2",
              value: val,
              unit: logType === "GLUCOSE" ? "mmol/L" : "%",
              patientId: patientProfileId,
              recordedAt: new Date().toISOString(),
            },
          ],
        }).unwrap();
      }

      toast.success("Health metric logged and synced successfully!");
      setIsLogModalOpen(false);
      setLogValue("");
      setLogBpDiastolic("");
      refetchFbs();
      refetchHba1c();
      refetchBp();
      refetchVitals();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to sync vital reading");
    }
  };

  const isLoading =
    (activeTab === "fbs" && fbsLoading) ||
    (activeTab === "hba1c" && hba1cLoading) ||
    (activeTab === "bp" && bpLoading);

  return (
    <div className="rounded-3xl border border-surface-border bg-surface-card p-5 sm:p-7 space-y-6 shadow-sm relative overflow-hidden">
      {/* Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 border-b border-surface-border">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shrink-0">
            <TrendingUp className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-extrabold text-lg text-fg-app tracking-tight">Biomarker Historical Trends</h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary-teal/10 text-primary-teal border border-primary-teal/20 uppercase tracking-wider">
                Live Data
              </span>
            </div>
            <p className="text-xs text-muted-fg">
              Longitudinal tracking from database biomarker telemetry & verified lab reports
            </p>
          </div>
        </div>

        {/* Tab selector & Add Vital Button */}
        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto justify-between lg:justify-end">
          <div className="flex items-center gap-1 bg-muted-bg/60 p-1 rounded-xl border border-surface-border text-xs font-bold">
            <button
              type="button"
              onClick={() => setActiveTab("fbs")}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === "fbs"
                  ? "bg-primary-teal text-white shadow-xs"
                  : "text-muted-fg hover:text-fg-app"
              }`}
            >
              Blood Sugar (FBS)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("hba1c")}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === "hba1c"
                  ? "bg-primary-teal text-white shadow-xs"
                  : "text-muted-fg hover:text-fg-app"
              }`}
            >
              HbA1c (%)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("bp")}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === "bp"
                  ? "bg-primary-teal text-white shadow-xs"
                  : "text-muted-fg hover:text-fg-app"
              }`}
            >
              Blood Pressure (BP)
            </button>
          </div>

          <button
            type="button"
            onClick={() => setIsLogModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 border border-emerald-500/30 text-xs font-bold transition-all cursor-pointer shrink-0"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Log Reading</span>
          </button>
        </div>
      </div>

      {/* Dynamic Abnormal Warning Flag Alert Banner */}
      <div
        className={`p-3.5 sm:p-4 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-fg-app transition-colors ${
          alertEvaluation.type === "danger"
            ? "border-rose-500/30 bg-rose-500/10"
            : alertEvaluation.type === "warning"
            ? "border-amber-500/30 bg-amber-500/10"
            : "border-emerald-500/30 bg-emerald-500/10"
        }`}
      >
        <div className="flex items-start sm:items-center gap-2.5">
          <AlertTriangle
            className={`h-4 w-4 shrink-0 mt-0.5 sm:mt-0 ${
              alertEvaluation.type === "danger"
                ? "text-rose-500"
                : alertEvaluation.type === "warning"
                ? "text-amber-500"
                : "text-emerald-500"
            }`}
          />
          <span className="leading-relaxed">
            <strong
              className={`font-bold mr-1 ${
                alertEvaluation.type === "danger"
                  ? "text-rose-500"
                  : alertEvaluation.type === "warning"
                  ? "text-amber-500 dark:text-amber-400"
                  : "text-emerald-500 dark:text-emerald-400"
              }`}
            >
              {alertEvaluation.title}
            </strong>
            {alertEvaluation.text}
          </span>
        </div>
        <span
          className={`text-[11px] font-bold px-3 py-1 rounded-full border shrink-0 ${alertEvaluation.badgeColor}`}
        >
          {alertEvaluation.badgeText}
        </span>
      </div>

      {/* Chart Canvas Area */}
      <div className="h-72 w-full pt-2">
        {isLoading ? (
          <div className="h-full w-full flex flex-col items-center justify-center gap-2 text-muted-fg">
            <Loader2 className="h-6 w-6 animate-spin text-primary-teal" />
            <span className="text-xs">Fetching dynamic longitudinal records...</span>
          </div>
        ) : activeTab === "fbs" ? (
          dynamicFbs.length === 0 ? (
            <div className="h-full w-full flex flex-col items-center justify-center gap-2 text-muted-fg border border-dashed border-surface-border rounded-2xl">
              <Droplet className="h-8 w-8 text-muted-fg/40" />
              <p className="text-xs font-semibold">No Fasting Blood Sugar data points available.</p>
              <button
                type="button"
                onClick={() => {
                  setLogType("GLUCOSE");
                  setIsLogModalOpen(true);
                }}
                className="text-xs text-primary-teal hover:underline font-bold"
              >
                + Log your first FBS reading
              </button>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dynamicFbs} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} />
                <YAxis domain={[3, 9]} tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--card)",
                    borderColor: "var(--card-border)",
                    borderRadius: "12px",
                    fontSize: "12px",
                    color: "var(--foreground)",
                  }}
                  formatter={(val: any) => [`${val} mmol/L`, "Fasting Sugar"]}
                />
                {/* Shaded Reference Area for Normal FBS Range (4.0 to 6.0) */}
                <ReferenceArea
                  y1={4.0}
                  y2={6.0}
                  fill="#10b981"
                  fillOpacity={0.12}
                  label={{
                    value: "Healthy Reference Zone (4.0 - 6.0 mmol/L)",
                    fill: "#10b981",
                    fontSize: 11,
                    position: "insideTopLeft",
                  }}
                />
                <ReferenceLine y={6.0} stroke="#f59e0b" strokeDasharray="3 3" />
                <Line
                  type="monotone"
                  dataKey="fbs"
                  name="FBS (mmol/L)"
                  stroke="#06b6d4"
                  strokeWidth={3}
                  dot={{ r: 5, fill: "#06b6d4" }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )
        ) : activeTab === "hba1c" ? (
          dynamicHba1c.length === 0 ? (
            <div className="h-full w-full flex flex-col items-center justify-center gap-2 text-muted-fg border border-dashed border-surface-border rounded-2xl">
              <Percent className="h-8 w-8 text-muted-fg/40" />
              <p className="text-xs font-semibold">No HbA1c data points available.</p>
              <button
                type="button"
                onClick={() => {
                  setLogType("HBA1C");
                  setIsLogModalOpen(true);
                }}
                className="text-xs text-primary-teal hover:underline font-bold"
              >
                + Log your first HbA1c reading
              </button>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dynamicHba1c} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} />
                <YAxis domain={[3, 8]} tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--card)",
                    borderColor: "var(--card-border)",
                    borderRadius: "12px",
                    fontSize: "12px",
                    color: "var(--foreground)",
                  }}
                  formatter={(val: any) => [`${val}%`, "HbA1c"]}
                />
                {/* Shaded Reference Area for Normal HbA1c (4.0% to 5.6%) */}
                <ReferenceArea
                  y1={4.0}
                  y2={5.6}
                  fill="#10b981"
                  fillOpacity={0.12}
                  label={{
                    value: "Normal HbA1c Target (4.0% - 5.6%)",
                    fill: "#10b981",
                    fontSize: 11,
                    position: "insideTopLeft",
                  }}
                />
                <ReferenceLine y={5.6} stroke="#f59e0b" strokeDasharray="3 3" />
                <Line
                  type="monotone"
                  dataKey="hba1c"
                  name="HbA1c (%)"
                  stroke="#8b5cf6"
                  strokeWidth={3}
                  dot={{ r: 5, fill: "#8b5cf6" }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )
        ) : dynamicBp.length === 0 ? (
          <div className="h-full w-full flex flex-col items-center justify-center gap-2 text-muted-fg border border-dashed border-surface-border rounded-2xl">
            <Heart className="h-8 w-8 text-muted-fg/40" />
            <p className="text-xs font-semibold">No Blood Pressure data points available.</p>
            <button
              type="button"
              onClick={() => {
                setLogType("BP");
                setIsLogModalOpen(true);
              }}
              className="text-xs text-primary-teal hover:underline font-bold"
            >
              + Log your first BP reading
            </button>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dynamicBp} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} />
              <YAxis domain={[60, 160]} tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--card)",
                  borderColor: "var(--card-border)",
                  borderRadius: "12px",
                  fontSize: "12px",
                  color: "var(--foreground)",
                }}
              />
              {/* Shaded Reference Area for Normal Systolic BP (90 to 120 mmHg) */}
              <ReferenceArea
                y1={90}
                y2={120}
                fill="#10b981"
                fillOpacity={0.12}
                label={{
                  value: "Target Systolic Range (90 - 120 mmHg)",
                  fill: "#10b981",
                  fontSize: 11,
                  position: "insideTopLeft",
                }}
              />
              <ReferenceLine y={120} stroke="#f59e0b" strokeDasharray="3 3" />
              <Line
                type="monotone"
                dataKey="systolic"
                name="Systolic BP"
                stroke="#06b6d4"
                strokeWidth={3}
                dot={{ r: 5, fill: "#06b6d4" }}
                activeDot={{ r: 7 }}
              />
              <Line
                type="monotone"
                dataKey="diastolic"
                name="Diastolic BP"
                stroke="#10b981"
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={{ r: 4, fill: "#10b981" }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Log Vital Modal */}
      {isLogModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-surface-card border border-surface-border rounded-3xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-surface-border">
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary-teal" />
                <h3 className="font-extrabold text-base text-fg-app">Log Health Reading</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsLogModalOpen(false)}
                className="p-1 rounded-lg text-muted-fg hover:text-fg-app hover:bg-muted-bg/50 transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveVital} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-fg-app mb-1.5">Measurement Type</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setLogType("GLUCOSE")}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border cursor-pointer transition-all ${
                      logType === "GLUCOSE"
                        ? "border-primary-teal bg-primary-teal/10 text-primary-teal"
                        : "border-surface-border bg-muted-bg/30 text-muted-fg hover:text-fg-app"
                    }`}
                  >
                    Blood Sugar
                  </button>
                  <button
                    type="button"
                    onClick={() => setLogType("HBA1C")}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border cursor-pointer transition-all ${
                      logType === "HBA1C"
                        ? "border-primary-teal bg-primary-teal/10 text-primary-teal"
                        : "border-surface-border bg-muted-bg/30 text-muted-fg hover:text-fg-app"
                    }`}
                  >
                    HbA1c
                  </button>
                  <button
                    type="button"
                    onClick={() => setLogType("BP")}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border cursor-pointer transition-all ${
                      logType === "BP"
                        ? "border-primary-teal bg-primary-teal/10 text-primary-teal"
                        : "border-surface-border bg-muted-bg/30 text-muted-fg hover:text-fg-app"
                    }`}
                  >
                    Blood Pressure
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-fg-app mb-1.5">
                  {logType === "GLUCOSE"
                    ? "Fasting Blood Sugar (mmol/L)"
                    : logType === "HBA1C"
                    ? "HbA1c Percentage (%)"
                    : "Systolic BP (mmHg)"}
                </label>
                <input
                  type="number"
                  step="0.1"
                  required
                  placeholder={logType === "GLUCOSE" ? "e.g. 5.6" : logType === "HBA1C" ? "e.g. 5.5" : "e.g. 120"}
                  value={logValue}
                  onChange={(e) => setLogValue(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl bg-muted-bg/30 border border-surface-border text-sm text-fg-app placeholder:text-muted-fg focus:outline-none focus:ring-2 focus:ring-primary-teal"
                />
              </div>

              {logType === "BP" && (
                <div>
                  <label className="block text-xs font-bold text-fg-app mb-1.5">Diastolic BP (mmHg)</label>
                  <input
                    type="number"
                    step="1"
                    placeholder="e.g. 80"
                    value={logBpDiastolic}
                    onChange={(e) => setLogBpDiastolic(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl bg-muted-bg/30 border border-surface-border text-sm text-fg-app placeholder:text-muted-fg focus:outline-none focus:ring-2 focus:ring-primary-teal"
                  />
                </div>
              )}

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsLogModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-surface-border text-xs font-bold text-fg-app hover:bg-muted-bg/50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSyncing}
                  className="px-5 py-2 rounded-xl bg-primary-teal text-white text-xs font-bold hover:brightness-110 shadow-xs transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isSyncing ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" /> Saving...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-3.5 w-3.5" /> Save Reading
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
