import { useState, useCallback, useRef } from "react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { XRExportMode, XRSnapshot } from "../types/xr";

type UseXRExportOptions = {
  mode: XRExportMode;
  title: string;
};

export function useXRExport({ mode, title }: UseXRExportOptions) {
  const [snapshot, setSnapshot] = useState<XRSnapshot | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const captureXRView = useCallback(
    async (element?: HTMLElement | null) => {
      const target = element || containerRef.current;
      if (!target) return null;

      setIsCapturing(true);

      try {
        const canvas = await html2canvas(target, {
          useCORS: true,
          allowTaint: true,
          backgroundColor: "#ffffff",
          scale: 2, // Higher quality
        });

        const imageDataUrl = canvas.toDataURL("image/png");

        const newSnapshot: XRSnapshot = {
          imageDataUrl,
          mode,
          timestamp: new Date(),
          title,
        };

        setSnapshot(newSnapshot);
        setIsCapturing(false);
        return newSnapshot;
      } catch (error) {
        console.error("Capture failed:", error);
        setIsCapturing(false);
        return null;
      }
    },
    [mode, title]
  );

  const downloadPNG = useCallback(() => {
    if (!snapshot) return;

    const link = document.createElement("a");
    link.download = `chenu-xr-${mode}-${formatDateForFile(snapshot.timestamp)}.png`;
    link.href = snapshot.imageDataUrl;
    link.click();
  }, [snapshot, mode]);

  const downloadPDF = useCallback(() => {
    if (!snapshot) return;

    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 15;

    // Header
    pdf.setFontSize(18);
    pdf.setFont("helvetica", "bold");
    pdf.text("CHE·NU — XR Snapshot", margin, margin + 5);

    // Metadata
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");
    pdf.text(`Date: ${formatDateFull(snapshot.timestamp)}`, margin, margin + 15);
    pdf.text(`Mode XR: ${getModeLabel(snapshot.mode)}`, margin, margin + 21);
    pdf.text(`Titre: ${snapshot.title}`, margin, margin + 27);

    // Separator line
    pdf.setDrawColor(200, 200, 200);
    pdf.line(margin, margin + 32, pageWidth - margin, margin + 32);

    // Image
    const imgWidth = pageWidth - margin * 2;
    const imgHeight = pageHeight - margin * 2 - 40;

    try {
      pdf.addImage(
        snapshot.imageDataUrl,
        "PNG",
        margin,
        margin + 38,
        imgWidth,
        imgHeight,
        undefined,
        "FAST"
      );
    } catch (e) {
      // If image fails, add placeholder text
      pdf.setFontSize(12);
      pdf.text("Image non disponible", pageWidth / 2, pageHeight / 2, { align: "center" });
    }

    // Footer
    pdf.setFontSize(8);
    pdf.setTextColor(150, 150, 150);
    pdf.text(
      "Généré par CHE·NU — Lecture seule, aucune interprétation",
      pageWidth / 2,
      pageHeight - 5,
      { align: "center" }
    );

    pdf.save(`chenu-xr-${mode}-${formatDateForFile(snapshot.timestamp)}.pdf`);
  }, [snapshot, mode]);

  const clearSnapshot = useCallback(() => {
    setSnapshot(null);
  }, []);

  return {
    containerRef,
    snapshot,
    isCapturing,
    captureXRView,
    downloadPNG,
    downloadPDF,
    clearSnapshot,
  };
}

// Helpers
function formatDateForFile(date: Date): string {
  return date.toISOString().slice(0, 19).replace(/[T:]/g, "-");
}

function formatDateFull(date: Date): string {
  return date.toLocaleDateString("fr-CA", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getModeLabel(mode: XRExportMode): string {
  switch (mode) {
    case "timeline":
      return "Timeline";
    case "comparison":
      return "Comparaison";
    case "narrative":
      return "Narrative (Constellation)";
    default:
      return mode;
  }
}
