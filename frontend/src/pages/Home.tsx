import { CameraComponent, ReportItem } from "@/components/webCam";
import { useState, useCallback, useRef, forwardRef } from "react";
import { PLANT_CLASSES } from "@/lib/plantClasses";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

type PredictionResult = {
  class_index: number;
  plant: string;
  condition: string;
  confidence: number;
};

// ─── Simple text-only PDF report (all images in one table) ───────────────────

const PdfReport = forwardRef<HTMLDivElement, { items: ReportItem[]; lang: boolean }>(
  ({ items, lang }, ref) => {
    const date = new Date().toLocaleDateString(lang ? "en-US" : "ne-NP", {
      year: "numeric", month: "long", day: "numeric",
    });

    return (
      <div
        ref={ref}
        style={{ width: 800, padding: 56, background: "#ffffff", fontFamily: "'Inter', system-ui, sans-serif" }}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 36, paddingBottom: 20, borderBottom: "2px solid #1a1714" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: "#3f7a4a", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="24" height="24" viewBox="0 0 34 34" fill="none">
                <path d="M17 4C24 4 30 10 30 18C30 25 24 30 17 30C10 30 5 25 5 18C5 10 11 4 17 4Z" fill="#fff" />
                <path d="M17 5 L17 29" stroke="#9ec7a3" strokeWidth="1.5" opacity="0.8" />
                <path d="M17 13 Q10 17 7 22" stroke="#9ec7a3" strokeWidth="1.5" fill="none" opacity="0.6" />
                <path d="M17 13 Q24 17 27 22" stroke="#9ec7a3" strokeWidth="1.5" fill="none" opacity="0.6" />
              </svg>
            </div>
            <div>
              <p style={{ fontSize: 22, fontWeight: 700, color: "#1a1714", margin: 0, fontFamily: "Georgia, serif" }}>
                {lang ? "Khet Ko Sathi" : "खेतको साथी"}
              </p>
              <p style={{ fontSize: 12, color: "#7a746e", margin: 0, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                {lang ? "Crop Diagnosis Report" : "बाली रोग निदान प्रतिवेदन"}
              </p>
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ fontSize: 11, color: "#9a9490", margin: 0, fontFamily: "ui-monospace, monospace" }}>{date}</p>
            <p style={{ fontSize: 11, color: "#9a9490", margin: "3px 0 0", fontFamily: "ui-monospace, monospace" }}>
              {items.length} {lang ? (items.length === 1 ? "image analysed" : "images analysed") : "छविहरू विश्लेषण"}
            </p>
          </div>
        </div>

        {/* Results table */}
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ background: "#1a1714" }}>
              <th style={{ padding: "10px 14px", color: "#fff", fontWeight: 600, textAlign: "left", width: 36 }}>#</th>
              <th style={{ padding: "10px 14px", color: "#fff", fontWeight: 600, textAlign: "left", width: "28%" }}>
                {lang ? "File Name" : "फाइल नाम"}
              </th>
              <th style={{ padding: "10px 14px", color: "#fff", fontWeight: 600, textAlign: "left", width: "18%" }}>
                {lang ? "Plant" : "बिरुवा"}
              </th>
              <th style={{ padding: "10px 14px", color: "#fff", fontWeight: 600, textAlign: "left" }}>
                {lang ? "Condition" : "रोग / अवस्था"}
              </th>
              <th style={{ padding: "10px 14px", color: "#fff", fontWeight: 600, textAlign: "center", width: 80 }}>
                {lang ? "Confidence" : "विश्वास"}
              </th>
              <th style={{ padding: "10px 14px", color: "#fff", fontWeight: 600, textAlign: "center", width: 90 }}>
                {lang ? "Status" : "स्थिति"}
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => {
              const top = item.result[0];
              if (!top) return null;
              const c = PLANT_CLASSES[top.class_index];
              if (!c) return null;
              const pct = Math.round(top.confidence * 100);
              const rowBg = i % 2 === 0 ? "#ffffff" : "#f7f5f2";
              return (
                <tr key={item.id} style={{ background: rowBg }}>
                  <td style={{ padding: "10px 14px", color: "#7a746e", borderBottom: "1px solid #ece8e2", fontFamily: "ui-monospace, monospace", fontSize: 12 }}>
                    {i + 1}
                  </td>
                  <td style={{ padding: "10px 14px", color: "#3d3a37", borderBottom: "1px solid #ece8e2", wordBreak: "break-all", fontSize: 12 }}>
                    {item.fileName}
                  </td>
                  <td style={{ padding: "10px 14px", color: "#1a1714", borderBottom: "1px solid #ece8e2", fontWeight: 600 }}>
                    {lang ? c.plant : c.plantNP}
                  </td>
                  <td style={{ padding: "10px 14px", color: "#3d3a37", borderBottom: "1px solid #ece8e2" }}>
                    {lang ? c.disease : c.diseaseNP}
                  </td>
                  <td style={{ padding: "10px 14px", borderBottom: "1px solid #ece8e2", textAlign: "center" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
                      <div style={{ width: 56, height: 4, borderRadius: 2, background: "#e2ddd6", overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${pct}%`, background: pct > 70 ? "#3f7a4a" : pct > 40 ? "#b58a2a" : "#c0392b", borderRadius: 2 }} />
                      </div>
                      <span style={{ fontSize: 11, fontWeight: 700, color: "#1a1714", fontFamily: "ui-monospace, monospace" }}>{pct}%</span>
                    </div>
                  </td>
                  <td style={{ padding: "10px 14px", borderBottom: "1px solid #ece8e2", textAlign: "center" }}>
                    <span style={{
                      fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 99, display: "inline-block",
                      background: c.healthy ? "#dcf0e0" : "#fde8e3",
                      color: c.healthy ? "#2d5e36" : "#7a2a1a",
                    }}>
                      {c.healthy ? (lang ? "Healthy" : "स्वस्थ") : (lang ? "Disease" : "रोग")}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Footer */}
        <div style={{ marginTop: 32, paddingTop: 14, borderTop: "1px solid #e2ddd6", display: "flex", justifyContent: "space-between" }}>
          <p style={{ fontSize: 10, color: "#a09890", margin: 0 }}>
            {lang ? "Generated by Khet Ko Sathi — AI Crop Diagnosis" : "खेतको साथी — AI बाली रोग निदान द्वारा तयार"}
          </p>
          <p style={{ fontSize: 10, color: "#a09890", margin: 0, fontFamily: "ui-monospace, monospace" }}>
            khetko.sathi
          </p>
        </div>
      </div>
    );
  }
);
PdfReport.displayName = "PdfReport";

// ─── Main page ────────────────────────────────────────────────────────────────

function LeafIcon() {
  return (
    <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
      <path d="M17 4C24 4 30 10 30 18C30 25 24 30 17 30C10 30 5 25 5 18C5 10 11 4 17 4Z" fill="#3f7a4a" stroke="#214a2c" strokeWidth="1.5" />
      <path d="M17 5 L17 29" stroke="#9ec7a3" strokeWidth="1.5" opacity="0.7" />
      <path d="M17 13 Q10 17 7 22" stroke="#9ec7a3" strokeWidth="1.5" fill="none" opacity="0.6" />
      <path d="M17 13 Q24 17 27 22" stroke="#9ec7a3" strokeWidth="1.5" fill="none" opacity="0.6" />
    </svg>
  );
}

export function HomePage() {
  const [lang, setLang] = useState(true);
  const [result, setResult] = useState<PredictionResult[] | null>(null);
  const [selectedPreview, setSelectedPreview] = useState<string | null>(null);
  const [reportItems, setReportItems] = useState<ReportItem[]>([]);
  const [pdfOpen, setPdfOpen] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [totalAnalysed, setTotalAnalysed] = useState(0);

  const pdfReportRef = useRef<HTMLDivElement | null>(null);

  const handleReportItems = useCallback((items: ReportItem[]) => setReportItems(items), []);
  const handleImageAnalysed = useCallback(() => setTotalAnalysed((n) => n + 1), []);

  const handleDownloadPdf = async () => {
    const el = pdfReportRef.current;
    if (!el || reportItems.length === 0) return;
    setGenerating(true);
    try {
      const canvas = await html2canvas(el, { scale: 2, useCORS: true, backgroundColor: "#ffffff" });
      const imgData = canvas.toDataURL("image/jpeg", 0.95);
      const pdf = new jsPDF({ unit: "mm", format: "a4" });
      const pageW = pdf.internal.pageSize.getWidth();
      const pageH = pdf.internal.pageSize.getHeight();
      const imgW = pageW - 20;
      const imgH = (canvas.height / canvas.width) * imgW;

      // If content fits on one page
      if (imgH <= pageH - 20) {
        pdf.addImage(imgData, "JPEG", 10, 10, imgW, imgH);
      } else {
        // Slice into A4 pages
        const scale = canvas.width / imgW;
        const sliceH = Math.floor((pageH - 20) * scale);
        let y = 0;
        let page = 0;
        while (y < canvas.height) {
          const sliceCanvas = document.createElement("canvas");
          sliceCanvas.width = canvas.width;
          sliceCanvas.height = Math.min(sliceH, canvas.height - y);
          const ctx = sliceCanvas.getContext("2d")!;
          ctx.drawImage(canvas, 0, y, canvas.width, sliceCanvas.height, 0, 0, canvas.width, sliceCanvas.height);
          const sliceData = sliceCanvas.toDataURL("image/jpeg", 0.95);
          const sliceImgH = (sliceCanvas.height / canvas.width) * imgW;
          if (page > 0) pdf.addPage();
          pdf.addImage(sliceData, "JPEG", 10, 10, imgW, sliceImgH);
          y += sliceH;
          page++;
        }
      }

      pdf.save(lang ? "crop-diagnosis-report.pdf" : "बाली-रोग-प्रतिवेदन.pdf");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div
      className="flex flex-col gap-3.5 p-4 max-w-[1480px] mx-auto overflow-hidden"
      style={{ height: "100dvh", fontFamily: "'Inter', system-ui, sans-serif" }}
    >
      {/* Header */}
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <LeafIcon />
          <div>
            <p className="text-base font-semibold leading-tight" style={{ color: "#1a1714" }}>
              {lang ? "Khet Ko Sathi" : "खेतको साथी"}
            </p>
            <p className="text-[11px] uppercase tracking-widest" style={{ color: "#7a746e", fontFamily: "ui-monospace, monospace" }}>
              {lang ? "Crop Diagnosis" : "बाली रोग निदान"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {totalAnalysed > 0 && (
            <div
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium tabular-nums"
              style={{ background: "#fff", border: "1px solid #e2ddd6", color: "#3f7a4a", boxShadow: "0 1px 2px rgba(0,0,0,0.06)" }}
            >
              {totalAnalysed}
              <span style={{ color: "#7a746e", fontWeight: 400 }}>{lang ? "analysed" : "विश्लेषण"}</span>
            </div>
          )}
          <div className="inline-flex p-[3px] rounded-full" style={{ background: "#fff", border: "1px solid #e2ddd6", boxShadow: "0 1px 2px rgba(0,0,0,0.06)" }}>
            <button onClick={() => setLang(true)} className="px-3 py-1.5 rounded-full text-xs font-medium transition-all" style={lang ? { background: "#1a1714", color: "#fff" } : { background: "transparent", color: "#7a746e" }}>EN</button>
            <button onClick={() => setLang(false)} className="px-3 py-1.5 rounded-full text-xs font-medium transition-all" style={!lang ? { background: "#1a1714", color: "#fff" } : { background: "transparent", color: "#7a746e" }}>NP</button>
          </div>
        </div>
      </header>

      {/* Main split */}
      <div className="grid gap-3.5 flex-1 min-h-0 grid-rows-2 md:grid-rows-1 md:[grid-template-columns:1.25fr_1fr]">
        {/* Camera panel */}
        <div className="flex flex-col rounded-xl overflow-hidden min-h-0" style={{ background: "#fff", border: "1px solid #e2ddd6", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
          <div className="flex items-center px-4 py-3" style={{ borderBottom: "1px dashed #e2ddd6" }}>
            <h2 className="text-xl leading-none" style={{ fontFamily: "'Instrument Serif', Georgia, serif", color: "#1a1714" }}>
              {lang ? "Camera" : "क्यामेरा"}
            </h2>
          </div>
          <CameraComponent
            onResult={setResult}
            onSelectImage={setSelectedPreview}
            onReportItems={handleReportItems}
            onImageAnalysed={handleImageAnalysed}
            lang={lang}
          />
        </div>

        {/* Results panel */}
        <div className="flex flex-col rounded-xl overflow-hidden min-h-0" style={{ background: "#fff", border: "1px solid #e2ddd6", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
          <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: "1px dashed #e2ddd6" }}>
            <h2 className="text-xl leading-none" style={{ fontFamily: "'Instrument Serif', Georgia, serif", color: "#1a1714" }}>
              {lang ? "Diagnosis" : "निदान"}
            </h2>
            {reportItems.length > 0 && (
              <button
                onClick={() => setPdfOpen(true)}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 5,
                  padding: "5px 12px", fontSize: 12, fontWeight: 500,
                  background: "#1a1714", color: "#fff",
                  border: "none", borderRadius: 8, cursor: "pointer", transition: "background 0.15s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "#3d3a37"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "#1a1714"; }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                </svg>
                PDF
              </button>
            )}
          </div>

          <div className="flex flex-col flex-1 p-4 min-h-0 overflow-y-auto">
            {selectedPreview && (
              <div className="rounded-lg overflow-hidden mb-4 flex-shrink-0" style={{ border: "1px solid #e2ddd6" }}>
                <img src={selectedPreview} alt="selected" style={{ width: "100%", height: 130, objectFit: "cover", display: "block" }} />
              </div>
            )}

            {result && result.length > 0 ? (
              <div className="flex flex-col gap-3">
                {result.map((pred, idx) => {
                  const cls = PLANT_CLASSES[pred.class_index];
                  if (!cls) return null;
                  const pct = Math.round(pred.confidence * 100);
                  const isTop = idx === 0;
                  return (
                    <div key={pred.class_index} style={{ padding: isTop ? "12px 14px" : "10px 14px", borderRadius: 10, border: isTop ? "1.5px solid #c8e6cc" : "1px solid #e2ddd6", background: isTop ? "#fafffe" : "#faf9f6" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                          <span style={{ fontSize: 10, fontWeight: 700, width: 20, height: 20, borderRadius: "50%", display: "inline-flex", alignItems: "center", justifyContent: "center", background: isTop ? "#3f7a4a" : "#e2ddd6", color: isTop ? "#fff" : "#7a746e", flexShrink: 0 }}>{idx + 1}</span>
                          <div>
                            <p style={{ fontSize: isTop ? 15 : 13, fontWeight: 600, color: "#1a1714", margin: 0, fontFamily: "'Instrument Serif', Georgia, serif" }}>{lang ? cls.plant : cls.plantNP}</p>
                            <p style={{ fontSize: 11, color: "#5a5550", margin: 0 }}>{lang ? cls.disease : cls.diseaseNP}</p>
                          </div>
                        </div>
                        <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 99, flexShrink: 0, background: cls.healthy ? "oklch(0.95 0.04 145)" : "oklch(0.96 0.03 30)", color: cls.healthy ? "#2d5e36" : "#7a2a1a", border: `1px solid ${cls.healthy ? "oklch(0.85 0.07 145)" : "oklch(0.88 0.06 30)"}` }}>
                          {cls.healthy ? (lang ? "Healthy" : "स्वस्थ") : (lang ? "Disease" : "रोग")}
                        </span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ flex: 1, height: 4, borderRadius: 2, background: "#e2ddd6", overflow: "hidden" }}>
                          <div style={{ height: "100%", borderRadius: 2, width: `${pct}%`, transition: "width 0.4s", background: pct > 70 ? "#3f7a4a" : pct > 40 ? "#b58a2a" : "#c0392b" }} />
                        </div>
                        <span style={{ fontSize: 11, fontWeight: 600, color: "#1a1714", fontFamily: "ui-monospace, monospace", flexShrink: 0, minWidth: 32, textAlign: "right" }}>{pct}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center flex-1 gap-3 text-center">
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none" opacity="0.25">
                  <path d="M24 6C33 6 42 14 42 24C42 33 33 42 24 42C15 42 7 33 7 24C7 14 16 6 24 6Z" fill="#3f7a4a" />
                  <path d="M24 7 L24 41" stroke="#9ec7a3" strokeWidth="2" opacity="0.7" />
                  <path d="M24 18 Q14 23 10 31" stroke="#9ec7a3" strokeWidth="2" fill="none" opacity="0.6" />
                  <path d="M24 18 Q34 23 38 31" stroke="#9ec7a3" strokeWidth="2" fill="none" opacity="0.6" />
                </svg>
                <div>
                  <p className="text-sm font-medium" style={{ color: "#7a746e" }}>{lang ? "No diagnosis yet" : "अहिलेसम्म निदान छैन"}</p>
                  <p className="text-xs mt-1" style={{ color: "#a09890" }}>{lang ? "Capture a photo or select an uploaded image" : "फोटो खिच्नुहोस् वा अपलोड गरिएको छवि छान्नुहोस्"}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* PDF Dialog */}
      <Dialog open={pdfOpen} onOpenChange={setPdfOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {lang ? "Diagnosis Report" : "निदान प्रतिवेदन"}
            </DialogTitle>
          </DialogHeader>

          {/* Scaled preview of the exact PDF content */}
          <div style={{ maxHeight: "62vh", overflowY: "auto", background: "#f0ece6", padding: 16, borderRadius: 8 }}>
            <div style={{ zoom: 0.65, boxShadow: "0 4px 24px rgba(0,0,0,0.15)", borderRadius: 2, display: "inline-block", width: "100%" }}>
              <PdfReport items={reportItems} lang={lang} />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setPdfOpen(false)}>
              {lang ? "Close" : "बन्द गर्नुहोस्"}
            </Button>
            <Button onClick={handleDownloadPdf} disabled={generating}>
              {generating ? (lang ? "Generating…" : "बनाउँदै…") : (lang ? "Download PDF" : "PDF डाउनलोड")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Off-screen full-size report for html2canvas */}
      <div style={{ position: "fixed", left: -9999, top: 0, zIndex: -1, pointerEvents: "none" }}>
        <PdfReport ref={pdfReportRef} items={reportItems} lang={lang} />
      </div>
    </div>
  );
}
