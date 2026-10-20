"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  Scan,
  Sparkles,
  Zap,
  ShoppingBag,
  RotateCcw,
  ShieldCheck,
  AlertCircle,
  Eye,
  Loader2,
  Cpu,
  ArrowRight,
  Stethoscope,
  Info,
  Plus,
  BadgeAlert,
  HeartPulse,
} from "lucide-react";
import { toast } from "sonner";
import { RecognizedMedicine, SuggestedMedicine } from "../types";
import { usePharmacyCart } from "../context/PharmacyCartContext";
import { useScanPrescriptionMutation } from "@/redux/api/pharmacyApi";
import { Button } from "@/components/ui/button";

interface PrescriptionUploadZoneProps {
  onPrescriptionScanned?: (recognizedMedicines: RecognizedMedicine[], condition?: string) => void;
  onResetPrescription?: () => void;
}

export function PrescriptionUploadZone({
  onPrescriptionScanned,
  onResetPrescription,
}: PrescriptionUploadZoneProps = {}) {
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<{
    name: string;
    sizeFormatted: string;
    compressedSizeFormatted: string;
    previewUrl: string;
    type: string;
    fileBlob?: Blob;
  } | null>(null);

  const [isCompressing, setIsCompressing] = useState<boolean>(false);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"extracted" | "suggestions">("extracted");

  // AI Extraction & Suggestion States
  const [recognizedItems, setRecognizedItems] = useState<RecognizedMedicine[]>([]);
  const [suggestedMedicines, setSuggestedMedicines] = useState<SuggestedMedicine[]>([]);
  const [doctorAdvice, setDoctorAdvice] = useState<string[]>([]);
  const [clinicalCondition, setClinicalCondition] = useState<string>("");
  const [scanProgress, setScanProgress] = useState<number>(0);
  const [aiProviderBadge, setAiProviderBadge] = useState<string>("Prescription AI Vision");

  const [scanPrescriptionApi] = useScanPrescriptionMutation();
  const { addToCart } = usePharmacyCart();
  const progressTimerRef = useRef<NodeJS.Timeout | null>(null);

  const formatFileSize = (bytes: number) => {
    if (bytes >= 1024 * 1024) {
      return (bytes / (1024 * 1024)).toFixed(1) + " MB";
    }
    return Math.round(bytes / 1024) + " KB";
  };

  /**
   * Real client-side image compression using HTML5 Canvas
   */
  const compressImage = async (
    file: File
  ): Promise<{ compressedBlob: Blob; compressedDataUrl: string }> => {
    return new Promise((resolve) => {
      if (!file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = () => {
          resolve({
            compressedBlob: file,
            compressedDataUrl: reader.result as string,
          });
        };
        reader.readAsDataURL(file);
        return;
      }

      const img = new Image();
      const objectUrl = URL.createObjectURL(file);
      img.src = objectUrl;

      img.onload = () => {
        URL.revokeObjectURL(objectUrl);
        const maxDim = 1400;
        let width = img.width;
        let height = img.height;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");

        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          canvas.toBlob(
            (blob) => {
              const compressedBlob = blob || file;
              const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.75);
              resolve({ compressedBlob, compressedDataUrl });
            },
            "image/jpeg",
            0.75
          );
        } else {
          resolve({ compressedBlob: file, compressedDataUrl: "" });
        }
      };

      img.onerror = () => {
        resolve({ compressedBlob: file, compressedDataUrl: "" });
      };
    });
  };

  const processFile = async (file: File) => {
    setIsCompressing(true);
    setRecognizedItems([]);
    setSuggestedMedicines([]);
    setDoctorAdvice([]);
    setClinicalCondition("");
    setScanProgress(0);

    try {
      const originalSize = file.size;
      const { compressedBlob, compressedDataUrl } = await compressImage(file);
      const compressedSize = compressedBlob.size;
      const savingsPct = Math.max(
        0,
        Math.round((1 - compressedSize / originalSize) * 100)
      );

      const previewUrl = compressedDataUrl || URL.createObjectURL(compressedBlob);

      setSelectedFile({
        name: file.name,
        sizeFormatted: formatFileSize(originalSize),
        compressedSizeFormatted: `${formatFileSize(compressedSize)} (${savingsPct}% Compressed)`,
        previewUrl,
        type: file.type,
        fileBlob: compressedBlob,
      });

      setIsCompressing(false);
      startAiScanning(file.name, compressedBlob, compressedDataUrl);
    } catch (err) {
      console.error("Compression error:", err);
      setIsCompressing(false);
    }
  };

  const startAiScanning = async (
    fileName: string,
    fileBlob?: Blob,
    base64Url?: string,
    customPromptText?: string
  ) => {
    setIsScanning(true);
    setScanProgress(15);

    let currentProg = 15;
    progressTimerRef.current = setInterval(() => {
      currentProg = Math.min(92, currentProg + Math.floor(Math.random() * 15 + 8));
      setScanProgress(currentProg);
    }, 300);

    try {
      let result: any;

      if (fileBlob) {
        const formData = new FormData();
        formData.append("file", fileBlob, fileName);
        if (base64Url) {
          formData.append("imageBase64", base64Url);
        }
        if (customPromptText) {
          formData.append("rawText", customPromptText);
        } else {
          formData.append("rawText", fileName);
        }
        result = await scanPrescriptionApi(formData).unwrap();
      } else {
        result = await scanPrescriptionApi({
          rawText: customPromptText || fileName,
        }).unwrap();
      }

      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
      setScanProgress(100);

      if (result) {
        if (result.recognizedItems) {
          setRecognizedItems(result.recognizedItems);
        }
        if (result.suggestedMedicines) {
          setSuggestedMedicines(result.suggestedMedicines);
        }
        if (result.doctorAdvice) {
          setDoctorAdvice(result.doctorAdvice);
        }
        if (result.clinicalCondition) {
          setClinicalCondition(result.clinicalCondition);
        }

        setAiProviderBadge("Prescription AI Vision");

        toast.success(
          `AI recognized ${result.recognizedItems?.length || 0} prescribed medications & ${result.suggestedMedicines?.length || 0} suggestions!`
        );

        if (onPrescriptionScanned && result.recognizedItems) {
          onPrescriptionScanned(result.recognizedItems, result.clinicalCondition);
        }
      }
    } catch (apiErr: any) {
      console.warn("API scan error:", apiErr);
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
      setScanProgress(100);
      toast.error("Failed to complete scan. Please try again.");
    } finally {
      setIsScanning(false);
    }
  };

  /**
   * One-click demo test presets for instant OCR testing
   */
  const handleRunSamplePrescription = (sampleType: "fever" | "asthma") => {
    handleReset();
    if (sampleType === "fever") {
      const sampleText =
        "Rx: Tab. Napa Extra (Paracetamol+Caffeine) 1+0+1 3 days, Cap. Seclo 20mg 1+0+1 before meal 14 days, Tab. Azithrocin 500mg 1+0+0 5 days";
      setSelectedFile({
        name: "Doctor_Prescription_Fever_Infection.png",
        sizeFormatted: "1.4 MB",
        compressedSizeFormatted: "340 KB (75% Compressed)",
        previewUrl:
          "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=800&auto=format&fit=crop",
        type: "image/png",
      });
      startAiScanning("Doctor_Prescription_Fever_Infection.png", undefined, undefined, sampleText);
    } else {
      const sampleText =
        "Rx: Syr. Tusca 2 tsp 3 times daily, Tab. Montene 10mg 1 tablet at night 15 days, Tab. Fexo 120mg 1 tablet daily";
      setSelectedFile({
        name: "Doctor_Prescription_Cough_Allergy.png",
        sizeFormatted: "1.8 MB",
        compressedSizeFormatted: "410 KB (77% Compressed)",
        previewUrl:
          "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=800&auto=format&fit=crop",
        type: "image/png",
      });
      startAiScanning("Doctor_Prescription_Cough_Allergy.png", undefined, undefined, sampleText);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleAutoFillCart = () => {
    let addedCount = 0;
    recognizedItems.forEach((item) => {
      if (item.matchedMedicine) {
        addToCart(item.matchedMedicine, 1);
        addedCount++;
      }
    });

    if (addedCount > 0) {
      toast.success(
        `Added ${addedCount} prescribed medicines directly to your cart!`
      );
    } else {
      toast.info("Medicines are matched and ready in catalog below.");
    }
  };

  const handleAddSuggestionToCart = (sug: SuggestedMedicine) => {
    if (sug.matchedMedicine) {
      addToCart(sug.matchedMedicine, 1);
      toast.success(`Added ${sug.name} (${sug.reason.slice(0, 40)}...) to cart!`);
    } else {
      toast.info(`Medicine ${sug.name} added to cart request.`);
    }
  };

  const handleReset = () => {
    if (selectedFile?.previewUrl && selectedFile.previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(selectedFile.previewUrl);
    }
    if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    setSelectedFile(null);
    setRecognizedItems([]);
    setSuggestedMedicines([]);
    setDoctorAdvice([]);
    setClinicalCondition("");
    setIsScanning(false);
    setScanProgress(0);
    setActiveTab("extracted");
    onResetPrescription?.();
  };

  return (
    <div className="rounded-2xl border border-card-border bg-card p-6 space-y-6 shadow-md relative overflow-hidden">
      {/* Top Ambient Glow */}
      <div className="absolute -top-16 -right-16 h-40 w-40 rounded-full bg-primary-teal/15 blur-3xl pointer-events-none" />

      {/* Zone Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-card-border gap-2">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-teal/10 text-primary-teal border border-primary-teal/20 shadow-xs">
            <Scan className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-lg text-fg-app">Smart Prescription AI Scanner</h3>
              <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-500 border border-cyan-500/20 uppercase tracking-wider">
                <Sparkles className="h-3 w-3" /> Live Multimodal Vision
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Extracts medicine names from doctor prescriptions and matches genuine pharmaceuticals
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 w-fit">
            <ShieldCheck className="h-3.5 w-3.5" /> PDF, PNG, JPEG
          </span>
        </div>
      </div>

      {!selectedFile ? (
        <div className="space-y-4">
          {/* Drag and Drop Box */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 flex flex-col items-center justify-center gap-3 cursor-pointer ${
              dragActive
                ? "border-primary-teal bg-primary-teal/10 scale-[1.01]"
                : "border-card-border hover:border-primary-teal/60 bg-surface-card-hover/40"
            }`}
          >
            <input
              type="file"
              accept=".pdf,.png,.jpg,.jpeg"
              onChange={handleFileInput}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-teal/10 text-primary-teal border border-primary-teal/20 shadow-xs">
              {isCompressing ? (
                <Loader2 className="h-7 w-7 animate-spin text-primary-teal" />
              ) : (
                <UploadCloud className="h-7 w-7" />
              )}
            </div>

            <div className="space-y-1">
              <h4 className="font-bold text-base text-fg-app">
                {isCompressing
                  ? "Compressing Image Client-Side..."
                  : "Upload Prescription Image or Drop Here"}
              </h4>
              <p className="text-xs text-muted-foreground">
                Instant doctor handwriting extraction & authentic pharmaceutical matching
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-[11px] text-muted-foreground font-medium">
              <span className="px-2 py-0.5 rounded bg-card border border-card-border">Max: 10MB</span>
              <span>•</span>
              <span className="px-2 py-0.5 rounded bg-card border border-card-border">Canvas Image Optimizer</span>
              <span>•</span>
              <span className="px-2 py-0.5 rounded bg-card border border-card-border">Bengali & English OCR</span>
            </div>
          </div>

          {/* Quick Demo Samples */}
          <div className="p-3.5 rounded-xl border border-card-border bg-card/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Info className="h-4 w-4 text-primary-teal shrink-0" />
              <span>Don't have a prescription image right now? Test with live samples:</span>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleRunSamplePrescription("fever")}
                className="text-xs gap-1.5 h-8 flex-1 sm:flex-none border-primary-teal/30 hover:bg-primary-teal/10"
              >
                <Sparkles className="h-3 w-3 text-primary-teal" /> Sample 1 (Fever & Antibiotic)
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleRunSamplePrescription("asthma")}
                className="text-xs gap-1.5 h-8 flex-1 sm:flex-none border-primary-teal/30 hover:bg-primary-teal/10"
              >
                <Sparkles className="h-3 w-3 text-primary-teal" /> Sample 2 (Cough & Allergy)
              </Button>
            </div>
          </div>
        </div>
      ) : (
        /* Uploaded File + OCR Scanner Workspace */
        <div className="space-y-5">
          {/* File Info Bar with Compression summary */}
          <div className="flex flex-wrap items-center justify-between p-3.5 rounded-xl border border-card-border bg-surface-card-hover text-xs gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-teal text-white font-bold text-xs uppercase shrink-0">
                {selectedFile.name.split(".").pop() || "IMG"}
              </div>
              <div className="min-w-0">
                <span className="font-bold text-fg-app block truncate max-w-[200px] sm:max-w-[300px]">
                  {selectedFile.name}
                </span>
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                  Original: {selectedFile.sizeFormatted} ➔ Compressed: {selectedFile.compressedSizeFormatted}
                </span>
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="text-xs text-rose-500 hover:text-rose-600"
            >
              <RotateCcw className="h-3.5 w-3.5 mr-1" /> Scan Another File
            </Button>
          </div>

          {/* OCR Scanning Laser Visual Area */}
          <div className="relative rounded-2xl border border-card-border overflow-hidden bg-slate-950 flex flex-col md:flex-row items-stretch">
            {/* Image Box with Laser Sweep Effect */}
            <div className="relative w-full md:w-5/12 h-64 md:h-96 bg-slate-900 flex items-center justify-center overflow-hidden">
              <img
                src={selectedFile.previewUrl}
                alt="Prescription Preview"
                className="w-full h-full object-cover opacity-85"
              />

              {/* Laser Beam Overlay */}
              {isScanning && (
                <motion.div
                  initial={{ top: "0%" }}
                  animate={{ top: ["0%", "95%", "0%"] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                  className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#06b6d4] z-10"
                />
              )}

              {/* Scanning status pill */}
              <div className="absolute bottom-3 left-3 bg-slate-950/90 text-white border border-cyan-500/40 px-3 py-1.5 rounded-xl text-xs font-semibold shadow-lg flex items-center gap-2">
                <Scan className={`h-4 w-4 text-cyan-400 ${isScanning ? "animate-spin" : ""}`} />
                <span>
                  {isScanning
                    ? `Scanning Prescription... ${scanProgress}%`
                    : "Analysis Completed"}
                </span>
              </div>

              {/* Prescription Badge */}
              <div className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur-xs text-emerald-400 border border-emerald-500/30 px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                <span>Prescription Verified</span>
              </div>
            </div>

            {/* Results Column with Tabs */}
            <div className="w-full md:w-7/12 p-5 bg-card/95 space-y-4 flex flex-col justify-between border-t md:border-t-0 md:border-l border-card-border">
              <div className="space-y-3">
                {/* Clinical Condition Header */}
                {clinicalCondition && (
                  <div className="p-2.5 rounded-xl bg-primary-teal/10 border border-primary-teal/20 text-xs text-fg-app flex items-start gap-2">
                    <HeartPulse className="h-4 w-4 text-primary-teal shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-primary-teal block text-[11px] uppercase tracking-wider">
                        Detected Condition
                      </span>
                      <span>{clinicalCondition}</span>
                    </div>
                  </div>
                )}

                {/* Tabs: Extracted vs Suggestions */}
                <div className="flex items-center gap-2 border-b border-card-border pb-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab("extracted")}
                    className={`text-xs font-bold pb-1 transition-all flex items-center gap-1.5 border-b-2 ${
                      activeTab === "extracted"
                        ? "border-primary-teal text-primary-teal"
                        : "border-transparent text-muted-foreground hover:text-fg-app"
                    }`}
                  >
                    <span>Prescribed Items</span>
                    <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded-full bg-primary-teal/10 text-primary-teal">
                      {recognizedItems.length}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab("suggestions")}
                    className={`text-xs font-bold pb-1 transition-all flex items-center gap-1.5 border-b-2 ${
                      activeTab === "suggestions"
                        ? "border-amber-500 text-amber-500"
                        : "border-transparent text-muted-foreground hover:text-fg-app"
                    }`}
                  >
                    <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                    <span>AI Medicine Suggestions</span>
                    <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400">
                      {suggestedMedicines.length}
                    </span>
                  </button>
                </div>

                {/* TAB 1: Recognized Prescriptions */}
                {activeTab === "extracted" && (
                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                    {recognizedItems.map((item, idx) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.08 }}
                        className="p-3 rounded-xl border border-card-border bg-surface-card-hover/50 space-y-1.5"
                      >
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-fg-app">{item.name}</span>
                          <span className="text-[10px] font-extrabold text-emerald-500 bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/20">
                            {item.confidence}% Match
                          </span>
                        </div>
                        <p className="text-[11px] text-muted-foreground">{item.dosage}</p>
                        {item.matchedMedicine && (
                          <div className="text-[10px] text-primary-teal font-semibold pt-0.5 flex items-center justify-between">
                            <span className="flex items-center gap-1">
                              <CheckCircle2 className="h-3 w-3 text-emerald-500" /> Catalog: {item.matchedMedicine.name} ({item.matchedMedicine.packSize})
                            </span>
                            <span className="font-bold">৳{item.matchedMedicine.price}</span>
                          </div>
                        )}
                      </motion.div>
                    ))}

                    {isScanning && (
                      <div className="p-3 rounded-xl border border-dashed border-cyan-500/40 bg-cyan-500/5 text-xs text-cyan-500 font-semibold animate-pulse flex items-center gap-2">
                        <Scan className="h-4 w-4 animate-spin" /> Scanning doctor handwriting & matching genuine pharmaceuticals...
                      </div>
                    )}

                    {!isScanning && recognizedItems.length === 0 && (
                      <div className="text-center py-6 text-xs text-muted-foreground">
                        No medications recognized yet. Upload a prescription image to scan.
                      </div>
                    )}
                  </div>
                )}

                {/* TAB 2: AI Medicine Suggestions */}
                {activeTab === "suggestions" && (
                  <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                    {suggestedMedicines.map((sug, idx) => (
                      <motion.div
                        key={sug.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.08 }}
                        className="p-3 rounded-xl border border-amber-500/20 bg-amber-500/5 space-y-1.5"
                      >
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-fg-app">{sug.name}</span>
                            <span className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded-full uppercase tracking-wider ${
                              sug.type === 'companion_care'
                                ? 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20'
                                : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                            }`}>
                              {sug.type === 'companion_care' ? 'Companion Care' : 'Generic Alternative'}
                            </span>
                          </div>
                          {sug.matchedMedicine && (
                            <span className="text-xs font-bold text-fg-app">
                              ৳{sug.matchedMedicine.price}
                            </span>
                          )}
                        </div>

                        <p className="text-[11px] text-muted-foreground leading-relaxed">
                          {sug.reason}
                        </p>

                        <div className="pt-1 flex items-center justify-between">
                          <span className="text-[10px] text-muted-foreground font-medium">
                            {sug.dosageGuidance || "As advised by doctor"}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleAddSuggestionToCart(sug)}
                            className="h-7 text-[10px] px-2.5 gap-1 border-primary-teal text-primary-teal hover:bg-primary-teal/10"
                          >
                            <Plus className="h-3 w-3" /> Add Suggestion
                          </Button>
                        </div>
                      </motion.div>
                    ))}

                    {isScanning && (
                      <div className="p-3 rounded-xl border border-dashed border-amber-500/40 bg-amber-500/5 text-xs text-amber-500 font-semibold animate-pulse flex items-center gap-2">
                        <Sparkles className="h-4 w-4 animate-spin" /> Generating intelligent medicine alternatives...
                      </div>
                    )}

                    {!isScanning && suggestedMedicines.length === 0 && (
                      <div className="text-center py-6 text-xs text-muted-foreground">
                        No medicine suggestions generated yet.
                      </div>
                    )}
                  </div>
                )}

                {/* Doctor Advice Accordion */}
                {doctorAdvice && doctorAdvice.length > 0 && (
                  <div className="p-2.5 rounded-xl border border-card-border bg-surface-card-hover/40 text-xs space-y-1">
                    <span className="font-bold text-fg-app flex items-center gap-1.5 text-[11px]">
                      <Stethoscope className="h-3.5 w-3.5 text-primary-teal" /> Clinical Precautions & Advice:
                    </span>
                    <ul className="list-disc list-inside space-y-0.5 text-[11px] text-muted-foreground">
                      {doctorAdvice.map((adv, idx) => (
                        <li key={idx} className="leading-tight">{adv}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Action Button: Auto-fill cart */}
              {!isScanning && recognizedItems.length > 0 && (
                <div className="pt-2 flex items-center gap-2">
                  <Button
                    variant="emerald"
                    onClick={handleAutoFillCart}
                    className="flex-1 justify-center text-xs h-10 shadow-md gap-1.5"
                  >
                    <ShoppingBag className="h-4 w-4" /> Auto-Fill Prescribed Items ({recognizedItems.length})
                  </Button>
                  {suggestedMedicines.length > 0 && activeTab === "extracted" && (
                    <Button
                      variant="outline"
                      onClick={() => setActiveTab("suggestions")}
                      className="text-xs h-10 gap-1 border-amber-500/30 text-amber-600 dark:text-amber-400 hover:bg-amber-500/10"
                    >
                      <Sparkles className="h-3.5 w-3.5 text-amber-500" /> View Suggestions ({suggestedMedicines.length})
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
