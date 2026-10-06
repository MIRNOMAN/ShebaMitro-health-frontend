import React, { useState } from "react";
import { Upload, FileText, FileCheck, X, Lock, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PdfDropzoneProps {
  attachedPdf: { name: string; size: string } | null;
  setAttachedPdf: (pdf: { name: string; size: string } | null) => void;
  isSubmitting: boolean;
  onSubmitReport: () => void;
}

export function PdfDropzone({
  attachedPdf,
  setAttachedPdf,
  isSubmitting,
  onSubmitReport,
}: PdfDropzoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setAttachedPdf({
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
      });
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAttachedPdf({
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
      });
    }
  };

  return (
    <div className="p-6 rounded-2xl border border-card-border bg-card space-y-4 shadow-xs">
      <h3 className="font-bold text-base text-fg-app flex items-center gap-2 border-b border-card-border pb-3">
        <Upload className="h-5 w-5 text-purple-500" /> Officially Signed PDF Attachment
      </h3>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleFileDrop}
        className={`border-2 border-dashed rounded-2xl p-6 text-center space-y-3 transition-all relative cursor-pointer ${
          isDragOver
            ? "border-primary-teal bg-primary-teal/10 scale-[1.01]"
            : "border-card-border bg-surface-card-hover/40 hover:border-primary-teal/50"
        }`}
      >
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileInputChange}
          className="absolute inset-0 opacity-0 cursor-pointer z-10"
        />

        <div className="h-12 w-12 rounded-2xl bg-purple-500/10 text-purple-500 flex items-center justify-center mx-auto shadow-xs">
          <FileText className="h-6 w-6" />
        </div>

        <div>
          <span className="font-bold text-xs text-fg-app block">
            Click to Browse or Drag & Drop Signed Lab Report PDF
          </span>
          <span className="text-[10px] text-muted-foreground block">
            Encrypted S3 Upload • Maximum file size 25MB • PDF Only
          </span>
        </div>
      </div>

      {attachedPdf && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2.5 min-w-0">
            <FileCheck className="h-5 w-5 text-emerald-500 shrink-0" />
            <div className="min-w-0">
              <span className="font-bold text-fg-app block truncate">{attachedPdf.name}</span>
              <span className="text-[10px] text-emerald-500 font-semibold block">
                Ready for S3 Upload ({attachedPdf.size})
              </span>
            </div>
          </div>

          <button
            onClick={() => setAttachedPdf(null)}
            className="p-1 rounded-lg bg-card text-muted-foreground hover:text-rose-500"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <Button
        variant="primary"
        onClick={onSubmitReport}
        disabled={isSubmitting}
        className="w-full h-12 text-sm font-extrabold shadow-lg glow-teal justify-center"
      >
        {isSubmitting ? (
          <span className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4 animate-spin" /> Uploading to Encrypted S3 & Signing...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <Lock className="h-4 w-4" /> Upload to Encrypted S3, Seal & Notify Patient & Doctor
          </span>
        )}
      </Button>
    </div>
  );
}
