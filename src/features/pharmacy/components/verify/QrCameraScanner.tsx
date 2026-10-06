import React, { useState, useEffect, useRef } from "react";
import { Camera, CameraOff, QrCode, Search, RefreshCw, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

interface QrCameraScannerProps {
  onScanSuccess: (decodedText: string) => void;
  onQueryManual: (payload: string) => void;
  isVerifying: boolean;
}

export function QrCameraScanner({
  onScanSuccess,
  onQueryManual,
  isVerifying,
}: QrCameraScannerProps) {
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [scannerError, setScannerError] = useState<string | null>(null);
  const [manualInput, setManualInput] = useState<string>("");
  const html5QrcodeRef = useRef<any>(null);

  useEffect(() => {
    let html5QrcodeScanner: any = null;

    if (cameraActive) {
      import("html5-qrcode")
        .then(({ Html5QrcodeScanner }) => {
          html5QrcodeScanner = new Html5QrcodeScanner(
            "qr-reader",
            { fps: 10, qrbox: { width: 250, height: 250 } },
            false
          );

          html5QrcodeScanner.render(
            (decodedText: string) => {
              onScanSuccess(decodedText);
              html5QrcodeScanner.clear().catch(() => {});
              setCameraActive(false);
            },
            () => {}
          );

          html5QrcodeRef.current = html5QrcodeScanner;
        })
        .catch(() => {
          setScannerError("Camera access failed or scanner initialization error.");
        });
    }

    return () => {
      if (html5QrcodeRef.current) {
        try {
          html5QrcodeRef.current.clear().catch(() => {});
        } catch (e) {}
      }
    };
  }, [cameraActive, onScanSuccess]);

  return (
    <div className="lg:col-span-5 space-y-5">
      {/* Scanner Box */}
      <div className="p-5 rounded-2xl border border-card-border bg-card space-y-4 shadow-xs">
        <div className="flex items-center justify-between border-b border-card-border pb-3">
          <h3 className="font-bold text-sm text-fg-app flex items-center gap-2">
            <Camera className="h-4 w-4 text-primary-teal" /> Live Camera Scanner
          </h3>

          <Button
            variant={cameraActive ? "destructive" : "primary"}
            size="sm"
            onClick={() => setCameraActive(!cameraActive)}
            className="h-8 text-xs font-bold"
          >
            {cameraActive ? (
              <>
                <CameraOff className="h-3.5 w-3.5 mr-1" /> Stop Camera
              </>
            ) : (
              <>
                <Camera className="h-3.5 w-3.5 mr-1" /> Start Camera
              </>
            )}
          </Button>
        </div>

        <div className="relative min-h-[260px] rounded-xl bg-slate-950 border border-slate-800 overflow-hidden flex flex-col items-center justify-center p-4">
          {cameraActive ? (
            <div id="qr-reader" className="w-full h-full text-slate-100 text-xs" />
          ) : (
            <div className="text-center space-y-3 p-4">
              <div className="h-16 w-16 rounded-2xl bg-primary-teal/10 text-primary-teal border border-primary-teal/30 flex items-center justify-center mx-auto shadow-inner">
                <QrCode className="h-8 w-8" />
              </div>
              <div>
                <span className="font-bold text-xs text-slate-200 block">
                  Camera Ready for QR Scanning
                </span>
                <span className="text-[11px] text-slate-400 block max-w-xs mx-auto">
                  Click "Start Camera" above or paste QR code signature string below to verify.
                </span>
              </div>
            </div>
          )}

          {scannerError && (
            <p className="text-[11px] text-rose-400 font-semibold mt-2">{scannerError}</p>
          )}
        </div>
      </div>

      {/* Manual Input */}
      <div className="p-5 rounded-2xl border border-card-border bg-card space-y-3 shadow-xs">
        <h3 className="font-bold text-xs text-fg-app uppercase tracking-wider flex items-center gap-2">
          <Search className="h-4 w-4 text-purple-500" /> Manual RX Code Lookup
        </h3>

        <div className="space-y-2">
          <input
            type="text"
            placeholder="Enter Rx ID or QR Payload (e.g. RX-2026-9012)"
            value={manualInput}
            onChange={(e) => setManualInput(e.target.value)}
            className="w-full h-10 px-3 rounded-xl bg-card border border-card-border text-xs font-mono font-semibold text-fg-app focus:outline-none focus:border-primary-teal"
          />

          <Button
            variant="primary"
            onClick={() => onQueryManual(manualInput || "RX-2026-9012")}
            disabled={isVerifying}
            className="w-full h-10 text-xs font-bold justify-center"
          >
            {isVerifying ? (
              <span className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4 animate-spin" /> Verifying Signature...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4" /> Query Verification API
              </span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
