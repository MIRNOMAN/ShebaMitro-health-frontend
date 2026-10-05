"use client";

import React, { useState } from "react";
import {
  FlaskConical,
  Truck,
  FileText,
  Upload,
  CheckCircle2,
  Clock,
  Building2,
  ShieldCheck,
  TrendingUp,
  MapPin,
  Search,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const MOCK_LAB_REQUESTS = [
  {
    id: "lr-101",
    patientName: "Sabbir Ahmed",
    packageName: "Executive Full Body Checkup (68 Params)",
    type: "Home Sample Collection",
    address: "House 24, Road 7/A, Dhanmondi, Dhaka",
    timeSlot: "08:00 AM - 09:00 AM",
    status: "Rider Assigned",
    phlebotomist: "Rider Rafiqul",
  },
  {
    id: "lr-102",
    patientName: "Kamrul Hasan",
    packageName: "Advanced Diabetes Care Profile",
    type: "Direct Lab Visit",
    address: "Popular Panthapath Branch",
    timeSlot: "09:30 AM",
    status: "Sample Received",
    phlebotomist: "Lab Tech Anis",
  },
  {
    id: "lr-103",
    patientName: "Sharmin Sultana",
    packageName: "Comprehensive Cardiac Shield Profile",
    type: "Home Sample Collection",
    address: "House 12, Sector 4, Uttara, Dhaka",
    timeSlot: "10:00 AM - 11:00 AM",
    status: "Pending Dispatch",
    phlebotomist: "Unassigned",
  },
];

export default function LabDashboardPage() {
  const [requests, setRequests] = useState(MOCK_LAB_REQUESTS);
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [uploadedReport, setUploadedReport] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedReport(e.target.files[0].name);
    }
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Lab Header Banner */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 bg-gradient-to-r from-purple-500/10 via-background to-background p-6 rounded-2xl border border-card-border">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-500 flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4" /> ISO 15189 Accredited Partner Hub
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-fg-app tracking-tight">
            Popular Diagnostic <span className="text-purple-500">Central Hub</span>
          </h1>
          <p className="text-xs text-muted-foreground">
            Home sample collection dispatching, phlebotomist GPS tracking, and PDF report uploads.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Building2 className="h-4 w-4 mr-1.5" /> 22 Branches Active
          </Button>
        </div>
      </div>

      {/* Lab Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl border border-card-border bg-card shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">Home Sample Pickups</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-500">
              <Truck className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-fg-app">18</span>
            <span className="text-xs text-muted-foreground font-semibold">Today</span>
          </div>
          <span className="text-[11px] font-medium text-emerald-500 flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" /> 14 Pickups Dispatched
          </span>
        </div>

        <div className="p-4 rounded-2xl border border-card-border bg-card shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">Pending Reports</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-fg-app">7</span>
            <span className="text-xs text-muted-foreground font-semibold">In Testing</span>
          </div>
          <span className="text-[11px] font-medium text-amber-500 flex items-center gap-1">
            <Clock className="h-3 w-3" /> Avg turnaround: 14 Hours
          </span>
        </div>

        <div className="p-4 rounded-2xl border border-card-border bg-card shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">Reports Uploaded</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-fg-app">32</span>
            <span className="text-xs text-muted-foreground font-semibold">PDF Reports</span>
          </div>
          <span className="text-[11px] font-medium text-emerald-500 flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" /> Auto-notified via SMS & App
          </span>
        </div>

        <div className="p-4 rounded-2xl border border-card-border bg-card shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">Daily Lab Revenue</span>
            <div className="p-2 rounded-xl bg-primary-teal/10 text-primary-teal">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-fg-app">৳68,400</span>
          </div>
          <span className="text-[11px] font-medium text-emerald-500 flex items-center gap-1">
            <TrendingUp className="h-3 w-3" /> +24% vs last week
          </span>
        </div>
      </div>

      {/* Main Grid: Sample Pickup Queue + Upload PDF Report Dropzone */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sample Pickups Queue (8 cols) */}
        <div className="lg:col-span-8 rounded-2xl border border-card-border bg-card p-6 space-y-5 shadow-xs">
          <div className="flex items-center justify-between border-b border-card-border pb-4">
            <div>
              <h3 className="font-bold text-lg text-fg-app flex items-center gap-2">
                <FlaskConical className="h-5 w-5 text-purple-500" /> Sample Collection & Test Requests
              </h3>
              <p className="text-xs text-muted-foreground">Phlebotomist assignments & sample tracking</p>
            </div>

            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-500 border border-purple-500/20">
              {requests.length} Requests Active
            </span>
          </div>

          <div className="space-y-3">
            {requests.map((req) => (
              <div
                key={req.id}
                className="p-4 rounded-xl border border-card-border bg-surface-card-hover/40 space-y-2 text-xs"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h4 className="font-bold text-sm text-fg-app">{req.patientName}</h4>
                    <p className="text-xs text-purple-500 font-semibold">{req.packageName}</p>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                      req.status === "Sample Received"
                        ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/30"
                        : "bg-amber-500/10 text-amber-500 border-amber-500/30"
                    }`}
                  >
                    {req.status}
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-card border border-card-border text-[11px] space-y-1">
                  <p className="text-muted-foreground flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-coral-accent shrink-0" />
                    <span>{req.address}</span>
                  </p>
                  <p className="text-muted-foreground">
                    Slot: <span className="font-bold text-fg-app">{req.timeSlot}</span> • Phlebotomist:{" "}
                    <span className="font-semibold text-primary-teal">{req.phlebotomist}</span>
                  </p>
                </div>

                <div className="flex justify-end gap-2 pt-1">
                  <Button variant="outline" size="sm" className="h-8 text-xs">
                    Assign Phlebotomist
                  </Button>
                  <Button variant="emerald" size="sm" className="h-8 text-xs">
                    Mark Sample Received
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upload Patient Report Dropzone (4 cols) */}
        <div className="lg:col-span-4 rounded-2xl border border-card-border bg-card p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-card-border pb-3">
            <h3 className="font-bold text-base text-fg-app flex items-center gap-2">
              <Upload className="h-4 w-4 text-purple-500" /> Upload Test PDF Report
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-muted-foreground">Patient Reference ID:</label>
              <input
                type="text"
                placeholder="DX-489201"
                defaultValue="DX-489201"
                className="w-full h-9 px-3 rounded-xl bg-card border border-card-border text-xs font-semibold text-fg-app"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-muted-foreground">Upload PDF Result File:</label>
              <div className="border-2 border-dashed border-card-border rounded-xl p-4 text-center space-y-2 relative bg-surface-card-hover/40 cursor-pointer">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <FileText className="h-8 w-8 text-purple-500 mx-auto" />
                <span className="font-semibold text-xs text-fg-app block">
                  {uploadedReport || "Click or Drag PDF Report Here"}
                </span>
                <span className="text-[10px] text-muted-foreground block">Max file size 15MB</span>
              </div>
            </div>

            {uploadedReport && (
              <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
                ✓ Report File Ready to Publish
              </div>
            )}

            <Button variant="emerald" className="w-full h-10 justify-center text-xs shadow-md">
              Publish & Notify Patient via App & SMS
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
