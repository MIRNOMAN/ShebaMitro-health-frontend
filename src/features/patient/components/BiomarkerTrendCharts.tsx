"use client";

import React, { useState } from "react";
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
import { Activity, AlertTriangle, CheckCircle2, TrendingUp, Info } from "lucide-react";

const FBS_DATA = [
  { month: "May", fbs: 5.2, status: "Normal" },
  { month: "Jun", fbs: 5.4, status: "Normal" },
  { month: "Jul", fbs: 7.2, status: "High ⚠️" },
  { month: "Aug", fbs: 5.8, status: "Normal" },
  { month: "Sep", fbs: 5.5, status: "Normal" },
  { month: "Oct", fbs: 5.6, status: "Normal" },
];

const HBA1C_DATA = [
  { month: "May", hba1c: 5.4, status: "Normal" },
  { month: "Jun", hba1c: 5.5, status: "Normal" },
  { month: "Jul", hba1c: 6.8, status: "Elevated ⚠️" },
  { month: "Aug", hba1c: 5.9, status: "Normal" },
  { month: "Sep", hba1c: 5.6, status: "Normal" },
  { month: "Oct", hba1c: 5.6, status: "Normal" },
];

const BP_DATA = [
  { month: "May", systolic: 118, diastolic: 78, status: "Optimal" },
  { month: "Jun", systolic: 120, diastolic: 80, status: "Optimal" },
  { month: "Jul", systolic: 142, diastolic: 92, status: "High BP ⚠️" },
  { month: "Aug", systolic: 125, diastolic: 82, status: "Normal" },
  { month: "Sep", systolic: 122, diastolic: 80, status: "Optimal" },
  { month: "Oct", systolic: 120, diastolic: 80, status: "Optimal" },
];

export function BiomarkerTrendCharts() {
  const [activeTab, setActiveTab] = useState<"fbs" | "hba1c" | "bp">("fbs");

  return (
    <div className="rounded-2xl border border-card-border bg-card p-6 space-y-6 shadow-md relative overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-card-border">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
            <TrendingUp className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-extrabold text-lg text-fg-app">Biomarker Historical Trends</h2>
            <p className="text-xs text-muted-foreground">
              6-month longitudinal tracking with healthy reference range shading & abnormal flags
            </p>
          </div>
        </div>

        {/* Tab selector */}
        <div className="flex items-center gap-1 bg-muted/40 p-1 rounded-xl border border-card-border text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab("fbs")}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === "fbs"
                ? "bg-primary-teal text-white shadow-xs"
                : "text-muted-foreground hover:text-fg-app"
            }`}
          >
            Blood Sugar (FBS)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("hba1c")}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === "hba1c"
                ? "bg-primary-teal text-white shadow-xs"
                : "text-muted-foreground hover:text-fg-app"
            }`}
          >
            HbA1c (%)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("bp")}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === "bp"
                ? "bg-primary-teal text-white shadow-xs"
                : "text-muted-foreground hover:text-fg-app"
            }`}
          >
            Blood Pressure (BP)
          </button>
        </div>
      </div>

      {/* Abnormal Warning Flag Alert Banner */}
      <div className="p-3.5 rounded-xl border border-amber-500/30 bg-amber-500/10 flex items-center justify-between text-xs text-fg-app">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />
          <span>
            <strong className="text-amber-600 dark:text-amber-400">Abnormal Value Flagged:</strong> In July 2026, Fasting Sugar spiked to 7.2 mmol/L and BP reached 142/92. Current October values returned to healthy target zone.
          </span>
        </div>
        <span className="text-[11px] font-bold text-emerald-500 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20 shrink-0">
          Oct: Normal Zone ✓
        </span>
      </div>

      {/* Chart Canvas Area */}
      <div className="h-72 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          {activeTab === "fbs" ? (
            <LineChart data={FBS_DATA} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} />
              <YAxis domain={[3, 9]} tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--card)",
                  borderColor: "var(--card-border)",
                  borderRadius: "12px",
                  fontSize: "12px",
                }}
              />
              {/* Shaded Reference Area for Normal FBS Range (4.0 to 6.0) */}
              <ReferenceArea
                y1={4.0}
                y2={6.0}
                fill="#10b981"
                fillOpacity={0.12}
                label={{ value: "Healthy Reference Zone (4.0 - 6.0 mmol/L)", fill: "#10b981", fontSize: 11, position: "insideTopLeft" }}
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
          ) : activeTab === "hba1c" ? (
            <LineChart data={HBA1C_DATA} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} />
              <YAxis domain={[3, 8]} tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--card)",
                  borderColor: "var(--card-border)",
                  borderRadius: "12px",
                  fontSize: "12px",
                }}
              />
              {/* Shaded Reference Area for Normal HbA1c (4.0% to 5.6%) */}
              <ReferenceArea
                y1={4.0}
                y2={5.6}
                fill="#10b981"
                fillOpacity={0.12}
                label={{ value: "Normal HbA1c Target (4.0% - 5.6%)", fill: "#10b981", fontSize: 11, position: "insideTopLeft" }}
              />
              <ReferenceLine y={5.6} stroke="#f59e0b" strokeDasharray="3 3" />
              <Line
                type="monotone"
                dataKey="hba1c"
                name="HbA1c (%)"
                stroke="#8b5cf6"
                strokeWidth={3}
                dot={{ r: 5, fill: "#8b5cf6" }}
              />
            </LineChart>
          ) : (
            <LineChart data={BP_DATA} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} />
              <YAxis domain={[50, 160]} tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--card)",
                  borderColor: "var(--card-border)",
                  borderRadius: "12px",
                  fontSize: "12px",
                }}
              />
              {/* Shaded Reference Area for Normal Systolic BP (90 to 120) */}
              <ReferenceArea
                y1={90}
                y2={120}
                fill="#10b981"
                fillOpacity={0.12}
                label={{ value: "Optimal Systolic Band (90 - 120 mmHg)", fill: "#10b981", fontSize: 11, position: "insideTopLeft" }}
              />
              <Line
                type="monotone"
                dataKey="systolic"
                name="Systolic (mmHg)"
                stroke="#ef4444"
                strokeWidth={3}
                dot={{ r: 5, fill: "#ef4444" }}
              />
              <Line
                type="monotone"
                dataKey="diastolic"
                name="Diastolic (mmHg)"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ r: 5, fill: "#3b82f6" }}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
