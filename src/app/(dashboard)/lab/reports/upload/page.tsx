"use client";

import React, { useState, useMemo } from "react";
import { FileCheck, ShieldCheck, User, Layers } from "lucide-react";
import { TEST_TEMPLATES, MOCK_PATIENT_REQS } from "@/features/lab/data/mockData";
import { BiomarkerFormTable } from "@/features/lab/components/upload/BiomarkerFormTable";
import { PdfDropzone } from "@/features/lab/components/upload/PdfDropzone";
import { DigitalSealModal } from "@/features/lab/components/upload/DigitalSealModal";

export default function UploadLabReportPage() {
  const [selectedReqId, setSelectedReqId] = useState<string>("REQ-2026-8801");
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("TEST-CBC");

  const [biomarkerValues, setBiomarkerValues] = useState<Record<string, number>>(() => {
    const defaultTemplate = TEST_TEMPLATES[0]!;
    const initialValues: Record<string, number> = {};
    defaultTemplate.biomarkers.forEach((bm) => {
      initialValues[bm.id] = bm.defaultValue;
    });
    return initialValues;
  });

  const [attachedPdf, setAttachedPdf] = useState<{ name: string; size: string } | null>({
    name: "Popular_Central_Lab_Report_Signed.pdf",
    size: "2.4 MB",
  });
  const [pathologistName, setPathologistName] = useState<string>("Dr. Niaz Ahmed, M.D. (Pathology)");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submissionResult, setSubmissionResult] = useState<any>(null);

  const currentTemplate = useMemo(() => {
    return TEST_TEMPLATES.find((t) => t.id === selectedTemplateId) || TEST_TEMPLATES[0]!;
  }, [selectedTemplateId]);

  const currentPatient = useMemo(() => {
    return MOCK_PATIENT_REQS.find((p) => p.reqId === selectedReqId) || MOCK_PATIENT_REQS[0]!;
  }, [selectedReqId]);

  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplateId(templateId);
    const tmpl = TEST_TEMPLATES.find((t) => t.id === templateId);
    if (tmpl) {
      const updated: Record<string, number> = {};
      tmpl.biomarkers.forEach((bm) => {
        updated[bm.id] = bm.defaultValue;
      });
      setBiomarkerValues(updated);
    }
  };

  const handleBiomarkerChange = (bmId: string, val: string) => {
    setBiomarkerValues((prev) => ({
      ...prev,
      [bmId]: parseFloat(val) || 0,
    }));
  };

  const outOfRangeBiomarkers = useMemo(() => {
    return currentTemplate.biomarkers.filter((bm) => {
      const val = biomarkerValues[bm.id] ?? bm.defaultValue;
      return val < bm.minRef || val > bm.maxRef;
    });
  }, [currentTemplate, biomarkerValues]);

  const handleSubmitReport = () => {
    if (!attachedPdf) {
      alert("Please attach officially signed PDF lab report before submitting.");
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setSubmissionResult({
        s3Url: `https://s3.ap-south-1.amazonaws.com/shebamitro-encrypted-reports/${currentPatient.reqId}.pdf`,
        sealHash: "SHA256-ED849A01" + Math.random().toString(36).substring(2, 10).toUpperCase(),
        patientNotified: true,
        doctorNotified: true,
        outOfRangeCount: outOfRangeBiomarkers.length,
      });
      setIsSubmitting(false);
    }, 1200);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 bg-gradient-to-r from-emerald-500/15 via-primary-teal/10 to-card p-6 rounded-2xl border border-card-border shadow-xs">
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-500 flex items-center gap-1.5">
            <FileCheck className="h-4 w-4" /> Lab Report Upload & Digital Signing
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-fg-app tracking-tight">
            Structured Biomarker Entry & <span className="text-emerald-500">PDF Seal</span>
          </h1>
          <p className="text-xs text-muted-foreground">
            Enter test parameters with automatic out-of-range flagging, upload signed PDFs to encrypted S3, and trigger notifications.
          </p>
        </div>

        <div className="px-3 py-1.5 rounded-xl bg-card border border-card-border text-xs font-semibold text-fg-app flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-emerald-500" /> ISO 15189 Verified Hub
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Selectors */}
        <div className="lg:col-span-4 space-y-5">
          <div className="p-5 rounded-2xl border border-card-border bg-card space-y-4 shadow-xs">
            <h3 className="font-bold text-sm text-fg-app flex items-center gap-2 border-b border-card-border pb-2.5">
              <User className="h-4 w-4 text-primary-teal" /> 1. Select Patient Requisition
            </h3>
            <div className="space-y-2">
              {MOCK_PATIENT_REQS.map((p) => (
                <button
                  key={p.reqId}
                  type="button"
                  onClick={() => setSelectedReqId(p.reqId)}
                  className={`w-full text-left p-3 rounded-xl border transition-all space-y-1 ${
                    p.reqId === selectedReqId ? "border-primary-teal bg-primary-teal/10 shadow-xs" : "border-card-border bg-surface-card-hover/40"
                  }`}
                >
                  <div className="flex justify-between text-xs font-mono font-bold text-fg-app">
                    <span>{p.reqId}</span>
                    <span className="text-[10px] text-muted-foreground">{p.date}</span>
                  </div>
                  <span className="font-bold text-xs text-fg-app block truncate">{p.patientName}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="p-5 rounded-2xl border border-card-border bg-card space-y-4 shadow-xs">
            <h3 className="font-bold text-sm text-fg-app flex items-center gap-2 border-b border-card-border pb-2.5">
              <Layers className="h-4 w-4 text-purple-500" /> 2. Ordered Test Template
            </h3>
            <div className="space-y-2">
              {TEST_TEMPLATES.map((tmpl) => (
                <button
                  key={tmpl.id}
                  type="button"
                  onClick={() => handleTemplateChange(tmpl.id)}
                  className={`w-full text-left p-3 rounded-xl border transition-all flex justify-between items-center ${
                    tmpl.id === selectedTemplateId ? "border-purple-500 bg-purple-500/10 shadow-xs font-bold" : "border-card-border bg-surface-card-hover/40"
                  }`}
                >
                  <span className="block font-bold text-xs text-fg-app truncate">{tmpl.title}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-2xl border border-card-border bg-card space-y-2 shadow-xs text-xs">
            <span className="text-[10px] font-bold uppercase text-muted-foreground block">Signing Pathologist:</span>
            <input
              type="text"
              value={pathologistName}
              onChange={(e) => setPathologistName(e.target.value)}
              className="w-full h-9 px-3 rounded-xl bg-card border border-card-border text-xs font-semibold text-fg-app"
            />
          </div>
        </div>

        {/* Right Form & Dropzone */}
        <div className="lg:col-span-8 space-y-5">
          <BiomarkerFormTable
            currentTemplate={currentTemplate}
            biomarkerValues={biomarkerValues}
            onBiomarkerChange={handleBiomarkerChange}
            outOfRangeBiomarkers={outOfRangeBiomarkers}
          />

          <PdfDropzone
            attachedPdf={attachedPdf}
            setAttachedPdf={setAttachedPdf}
            isSubmitting={isSubmitting}
            onSubmitReport={handleSubmitReport}
          />
        </div>
      </div>

      <DigitalSealModal
        result={submissionResult}
        currentPatient={currentPatient}
        pathologistName={pathologistName}
        onClose={() => setSubmissionResult(null)}
      />
    </div>
  );
}
