"use client";

import React, { useState } from "react";
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
} from "lucide-react";
import { MOCK_OCR_PRESETS } from "../data/medicines";
import { RecognizedMedicine } from "../types";
import { usePharmacyCart } from "../context/PharmacyCartContext";
import { Button } from "@/components/ui/button";

export function PrescriptionUploadZone() {
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<{
    name: string;
    sizeFormatted: string;
    compressedSizeFormatted: string;
    previewUrl: string;
    type: string;
  } | null>(null);

  const [isCompressing, setIsCompressing] = useState<boolean>(false);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [recognizedItems, setRecognizedItems] = useState<RecognizedMedicine[]>([]);
  const [scanProgress, setScanProgress] = useState<number>(0);

  const { addToCart } = usePharmacyCart();

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processFile = (fileName: string, fileType: string) => {
    setIsCompressing(true);
    setRecognizedItems([]);
    setScanProgress(0);

    // Simulate client-side image compression
    setTimeout(() => {
      setIsCompressing(false);
      setSelectedFile({
        name: fileName,
        sizeFormatted: "4.8 MB",
        compressedSizeFormatted: "720 KB (85% Compressed)",
        previewUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=800&auto=format&fit=crop",
        type: fileType,
      });

      // Start OCR Laser Scanning Animation
      startOcrScanning();
    }, 600);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      processFile(file.name, file.type);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      processFile(file.name, file.type);
    }
  };

  const startOcrScanning = () => {
    setIsScanning(true);
    setScanProgress(0);

    let progress = 0;
    const interval = setInterval(() => {
      progress += 25;
      setScanProgress(progress);

      if (progress === 25) {
        setRecognizedItems([MOCK_OCR_PRESETS[0]!]);
      } else if (progress === 50) {
        setRecognizedItems([MOCK_OCR_PRESETS[0]!, MOCK_OCR_PRESETS[1]!]);
      } else if (progress === 75) {
        setRecognizedItems([MOCK_OCR_PRESETS[0]!, MOCK_OCR_PRESETS[1]!, MOCK_OCR_PRESETS[2]!]);
      } else if (progress >= 100) {
        setRecognizedItems(MOCK_OCR_PRESETS);
        setIsScanning(false);
        clearInterval(interval);
      }
    }, 500);
  };

  const handleAutoFillCart = () => {
    recognizedItems.forEach((item) => {
      if (item.matchedMedicine) {
        addToCart(item.matchedMedicine, 1);
      }
    });
  };

  const handleReset = () => {
    setSelectedFile(null);
    setRecognizedItems([]);
    setIsScanning(false);
    setScanProgress(0);
  };

  return (
    <div className="rounded-2xl border border-card-border bg-card p-6 space-y-6 shadow-md relative overflow-hidden">
      {/* Top Ambient Glow */}
      <div className="absolute -top-16 -right-16 h-40 w-40 rounded-full bg-primary-teal/15 blur-3xl pointer-events-none" />

      {/* Zone Header */}
      <div className="flex items-center justify-between pb-4 border-b border-card-border">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-teal/10 text-primary-teal">
            <Scan className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-fg-app">Prescription AI Scanner</h3>
            <p className="text-xs text-muted-foreground">
              Upload prescription for instant medicine auto-recognition & compression
            </p>
          </div>
        </div>

        <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
          <ShieldCheck className="h-3.5 w-3.5" /> PDF, PNG, JPEG Supported
        </span>
      </div>

      {!selectedFile ? (
        /* Drag and Drop Box */
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
            <UploadCloud className="h-7 w-7" />
          </div>

          <div className="space-y-1">
            <h4 className="font-bold text-base text-fg-app">
              Drag & Drop Prescription File Here
            </h4>
            <p className="text-xs text-muted-foreground">
              or click to browse from device (Supports doctor prescriptions in PDF, PNG, JPEG)
            </p>
          </div>

          <div className="flex items-center gap-2 pt-2 text-[11px] text-muted-foreground font-medium">
            <span className="px-2 py-0.5 rounded bg-card border border-card-border">Max file size: 10MB</span>
            <span>•</span>
            <span className="px-2 py-0.5 rounded bg-card border border-card-border">Instant Client-side Compression</span>
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

            <Button variant="ghost" size="sm" onClick={handleReset} className="text-xs text-rose-500 hover:text-rose-600">
              <RotateCcw className="h-3.5 w-3.5 mr-1" /> Change File
            </Button>
          </div>

          {/* OCR Scanning Laser Visual Area */}
          <div className="relative rounded-2xl border border-card-border overflow-hidden bg-slate-950 flex flex-col md:flex-row items-stretch">
            {/* Image Box with Laser Sweep Effect */}
            <div className="relative w-full md:w-1/2 h-64 md:h-80 bg-slate-900 flex items-center justify-center overflow-hidden">
              <img
                src={selectedFile.previewUrl}
                alt="Prescription Preview"
                className="w-full h-full object-cover opacity-80"
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
                  {isScanning ? `OCR Scanning... ${scanProgress}%` : "OCR Scan Completed"}
                </span>
              </div>
            </div>

            {/* Real-time Recognized Medicine Lines List */}
            <div className="w-full md:w-1/2 p-5 bg-card/90 space-y-4 flex flex-col justify-between border-t md:border-t-0 md:border-l border-card-border">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4 text-primary-teal" /> Recognized Medicines
                  </h4>
                  <span className="text-[11px] font-bold text-primary-teal bg-primary-teal/10 px-2 py-0.5 rounded-full">
                    {recognizedItems.length} Detected
                  </span>
                </div>

                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {recognizedItems.map((item, idx) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="p-3 rounded-xl border border-card-border bg-surface-card-hover/50 space-y-1"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-fg-app">{item.name}</span>
                        <span className="text-[10px] font-extrabold text-emerald-500 bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/20">
                          {item.confidence}% Match
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground">{item.dosage}</p>
                    </motion.div>
                  ))}

                  {isScanning && (
                    <div className="p-3 rounded-xl border border-dashed border-cyan-500/40 bg-cyan-500/5 text-xs text-cyan-500 font-semibold animate-pulse flex items-center gap-2">
                      <Scan className="h-4 w-4 animate-spin" /> Scanning prescription text...
                    </div>
                  )}
                </div>
              </div>

              {/* Action Button: Auto-fill cart */}
              {!isScanning && recognizedItems.length > 0 && (
                <Button
                  variant="emerald"
                  onClick={handleAutoFillCart}
                  className="w-full justify-center text-xs h-11 shadow-md"
                >
                  <ShoppingBag className="h-4 w-4 mr-1.5" /> Auto-Fill Medicine Cart ({recognizedItems.length} Items)
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
