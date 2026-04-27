import { CameraComponent, ReportItem } from "@/components/webCam";
import { useState, useCallback, useRef, forwardRef, useMemo, useEffect } from "react";
import { useSentTextForAudio, useSentEmail } from "@/lib/api/hooks/processImage";
import toast from "react-hot-toast";
import { PLANT_CLASSES } from "@/lib/plantClasses";
import { diseaseGuide } from "@/components/mapDieses";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const toNepaliNum = (n: number) =>
  String(n).replace(/\d/g, (d) => "०१२३४५६७८९"[+d]);

const diseaseKeyMap: Record<string, keyof typeof diseaseGuide> = {
  "Bacterial Spot": "bacterial_spot",
  "Early Blight": "early_blight",
  "Late Blight": "late_blight",
  "Yellow Leaf Curl Virus": "leaf_curl_virus",
  "Bacterial Wilt": "bacterial_wilt",
  "Downy Mildew": "downy_mildew",
  "Powdery Mildew": "powdery_mildew",
  "Fruit Borer": "fruit_borer",
  "Whitefly": "whitefly",
  "Leaf Miner": "leaf_miner",
};

type PredictionResult = {
  class_index: number;
  plant: string;
  condition: string;
  confidence: number;
};

function buildNepaliGuideText(items: ReportItem[]): string | null {
  const seen = new Set<string>();
  const parts: string[] = [];

  for (const item of items) {
    const top = item.result[0];
    if (!top) continue;
    const cls = PLANT_CLASSES[top.class_index];
    if (!cls || cls.healthy) continue;
    const key = diseaseKeyMap[cls.disease];
    if (!key || seen.has(key)) continue;
    seen.add(key);
    const guide = diseaseGuide[key];
    if (!guide) continue;

    parts.push(`${cls.plantNP} मा ${cls.diseaseNP} रोग देखिएको छ।`);
    if (guide.immediateNP?.length) {
      parts.push("तत्काल गर्नुपर्ने कामहरू:");
      guide.immediateNP.forEach((a) => parts.push(a));
    }
    if (guide.longTermNP?.length) {
      parts.push("दीर्घकालीन उपायहरू:");
      guide.longTermNP.forEach((a) => parts.push(a));
    }
  }

  if (parts.length === 0) return null;
  return parts.join(" ");
}

// ─── Simple text-only PDF report (all images in one table) ───────────────────

const PdfReport = forwardRef<HTMLDivElement, { items: ReportItem[]; lang: boolean }>(
  ({ items, lang }, ref) => {
    const date = new Date().toLocaleDateString(lang ? "en-US" : "ne-NP", {
      year: "numeric", month: "long", day: "numeric",
    });

    // One guide entry per image (not deduplicated — each image gets its own card)
    const perImageGuides = items.flatMap((item, i) => {
      const top = item.result[0];
      if (!top) return [];
      const c = PLANT_CLASSES[top.class_index];
      if (!c || c.healthy) return [];
      const key = diseaseKeyMap[c.disease];
      if (!key) return [];
      return [{ index: i + 1, fileName: item.fileName, plant: c.plant, plantNP: c.plantNP, disease: c.disease, diseaseNP: c.diseaseNP, guide: diseaseGuide[key] }];
    });

    return (
      <div
        ref={ref}
        style={{ width: 794, padding: "48px 56px", background: "#ffffff", fontFamily: "'Inter', system-ui, sans-serif" }}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 32, paddingBottom: 20, borderBottom: "2px solid #1a1714" }}>
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
                {lang ? "Krishi Netra" : "कृषि नेत्र"}
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

        {/* Detailed treatment guide per image — shown FIRST */}
        {perImageGuides.length > 0 && (
          <div style={{ marginBottom: 36 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: "#7a746e", letterSpacing: "0.08em", textTransform: "uppercase", margin: "0 0 16px" }}>
              {lang ? "Treatment Guide" : "उपचार मार्गदर्शन"}
            </p>

            {perImageGuides.map((d, idx) => (
              <div key={idx} style={{ marginBottom: 28, border: "1px solid #e2ddd6", borderRadius: 10, overflow: "hidden" }}>
                {/* Disease card header */}
                <div style={{ background: "#1a1714", padding: "12px 18px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div>
                    <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#fff", fontFamily: "Georgia, serif" }}>
                      {lang ? d.disease : d.diseaseNP}
                    </p>
                    <p style={{ margin: "2px 0 0", fontSize: 11, color: "#9ec7a3", letterSpacing: "0.04em" }}>
                      {lang ? d.plant : d.plantNP}
                      {" · "}
                      <span style={{ opacity: 0.75 }}>#{d.index} {d.fileName}</span>
                    </p>
                  </div>
                  <span style={{ fontSize: 10, fontWeight: 600, padding: "3px 10px", borderRadius: 99, background: "#fde8e3", color: "#7a2a1a" }}>
                    {lang ? "Disease Detected" : "रोग पहिचान"}
                  </span>
                </div>

                <div style={{ padding: "16px 18px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  {/* Immediate actions */}
                  {d.guide.immediate && d.guide.immediate.length > 0 && (
                    <div>
                      <p style={{ margin: "0 0 8px", fontSize: 11, fontWeight: 700, color: "#b55a1a", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                        {lang ? "Immediate Actions" : "तत्काल कदमहरू"}
                      </p>
                      <ol style={{ margin: 0, paddingLeft: 16 }}>
                        {(lang ? d.guide.immediate : (d.guide.immediateNP ?? d.guide.immediate)).map((action, ai) => (
                          <li key={ai} style={{ fontSize: 12, color: "#3d3a37", marginBottom: 5, lineHeight: 1.5 }}>
                            {action}
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}

                  {/* Long-term actions */}
                  {d.guide.longTerm && d.guide.longTerm.length > 0 && (
                    <div>
                      <p style={{ margin: "0 0 8px", fontSize: 11, fontWeight: 700, color: "#3f7a4a", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                        {lang ? "Long-term Prevention" : "दीर्घकालीन रोकथाम"}
                      </p>
                      <ol style={{ margin: 0, paddingLeft: 16 }}>
                        {(lang ? d.guide.longTerm : (d.guide.longTermNP ?? d.guide.longTerm)).map((action, ai) => (

                          <li key={ai} style={{ fontSize: 12, color: "#3d3a37", marginBottom: 5, lineHeight: 1.5 }}>
                            {action}
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}
                </div>

                {/* Chemical treatments */}
                {d.guide.chemicals && d.guide.chemicals.length > 0 && (
                  <div style={{ borderTop: "1px solid #e2ddd6", padding: "12px 18px", background: "#f7f5f2" }}>
                    <p style={{ margin: "0 0 8px", fontSize: 11, fontWeight: 700, color: "#1a1714", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                      {lang ? "Recommended Chemicals" : "सिफारिस रसायनहरू"}
                    </p>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                      <thead>
                        <tr>
                          <th style={{ padding: "6px 12px", textAlign: "left", background: "#e2ddd6", fontWeight: 600, color: "#1a1714", borderRadius: "4px 0 0 4px" }}>
                            {lang ? "Chemical Name" : "रसायनको नाम"}
                          </th>
                          <th style={{ padding: "6px 12px", textAlign: "left", background: "#e2ddd6", fontWeight: 600, color: "#1a1714", borderRadius: "0 4px 4px 0" }}>
                            {lang ? "Dose (per ropani)" : "मात्रा (प्रति रोपनी)"}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {d.guide.chemicals.map((chem, ci) => (
                          <tr key={ci} style={{ background: ci % 2 === 0 ? "#ffffff" : "#f0ece6" }}>
                            <td style={{ padding: "7px 12px", color: "#1a1714", fontWeight: 500, borderBottom: "1px solid #ece8e2" }}>{chem.name}</td>
                            <td style={{ padding: "7px 12px", color: "#5a5550", fontFamily: "ui-monospace, monospace", borderBottom: "1px solid #ece8e2" }}>{chem.dose}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Analysis summary table — shown LAST */}
        <p style={{ fontSize: 11, fontWeight: 700, color: "#7a746e", letterSpacing: "0.08em", textTransform: "uppercase", margin: "0 0 10px" }}>
          {lang ? "Analysis Summary" : "विश्लेषण सारांश"}
        </p>

        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ background: "#1a1714" }}>
              <th style={{ padding: "10px 14px", color: "#fff", fontWeight: 600, textAlign: "left", width: 36 }}>#</th>
              <th style={{ padding: "10px 14px", color: "#fff", fontWeight: 600, textAlign: "left", width: "26%" }}>
                {lang ? "File Name" : "फाइल नाम"}
              </th>
              <th style={{ padding: "10px 14px", color: "#fff", fontWeight: 600, textAlign: "left", width: "16%" }}>
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
            {lang ? "Generated by Krishi Netra — AI Crop Diagnosis" : "कृषि नेत्र — AI बाली रोग निदान द्वारा तयार"}
          </p>
          <p style={{ fontSize: 10, color: "#a09890", margin: 0, fontFamily: "ui-monospace, monospace" }}>
            krishi.netra
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
  const audioUrlRef = useRef<string | null>(null);
  const lastGeneratedTextRef = useRef<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const { mutate: generateAudio, data: audioData, isPending: audioLoading } = useSentTextForAudio();
  const { mutate: sendEmail, isPending: emailSending } = useSentEmail();

  const audioGuideText = useMemo(() => {
    if (lang) return null;
    return buildNepaliGuideText(reportItems);
  }, [lang, reportItems]);

  useEffect(() => {
    if (audioGuideText && audioGuideText !== lastGeneratedTextRef.current) {
      lastGeneratedTextRef.current = audioGuideText;
      setAudioUrl(null);
      generateAudio({ text: audioGuideText });
    }
  }, [audioGuideText]);

  useEffect(() => {
    if (!audioData) return;
    if (audioUrlRef.current) URL.revokeObjectURL(audioUrlRef.current);
    const blob = new Blob([audioData as ArrayBuffer], { type: "audio/mpeg" });
    const url = URL.createObjectURL(blob);
    audioUrlRef.current = url;
    setAudioUrl(url);
  }, [audioData]);

  const handleReportItems = useCallback((items: ReportItem[]) => setReportItems(items), []);
  const handleImageAnalysed = useCallback(() => setTotalAnalysed((n) => n + 1), []);

  const handleSendEmail = () => {
    if (reportItems.length === 0) return;
    sendEmail(
      { items: reportItems.map(({ fileName, result }) => ({ fileName, result })) },
      { onSuccess: () => toast.success(lang ? "Report sent to email!" : "इमेलमा पठाइयो!") }
    );
  };

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
              {lang ? "Krishi Netra" : "कृषि नेत्र"}
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
              {lang ? totalAnalysed : toNepaliNum(totalAnalysed)}
              <span style={{ color: "#7a746e", fontWeight: 400 }}>{lang ? "FarmCoin" : "कृषिसिक्का"}</span>
            </div>
          )}
          <div className="inline-flex p-[3px] rounded-full" style={{ background: "#fff", border: "1px solid #e2ddd6", boxShadow: "0 1px 2px rgba(0,0,0,0.06)" }}>
            <button onClick={() => setLang(true)} className="px-3 py-1.5 rounded-full text-xs font-medium transition-all" style={lang ? { background: "#1a1714", color: "#fff" } : { background: "transparent", color: "#7a746e" }}>EN</button>
            <button onClick={() => setLang(false)} className="px-3 py-1.5 rounded-full text-xs font-medium transition-all" style={!lang ? { background: "#1a1714", color: "#fff" } : { background: "transparent", color: "#7a746e" }}>नेप</button>
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

            {!lang && audioGuideText && (
              <div style={{ marginBottom: 12, padding: "10px 14px", borderRadius: 10, border: "1px solid #e2ddd6", background: "#f7f5f2", flexShrink: 0 }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: "#7a746e", letterSpacing: "0.06em", textTransform: "uppercase", margin: "0 0 8px" }}>
                  उपचार मार्गदर्शन अडियो
                </p>
                {audioLoading ? (
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <svg className="animate-spin" style={{ flexShrink: 0 }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7a746e" strokeWidth="2.5" strokeLinecap="round">
                      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                    </svg>
                    <p style={{ fontSize: 12, color: "#7a746e", margin: 0 }}>अडियो तयार गर्दैछ…</p>
                  </div>
                ) : audioUrl ? (
                  <audio controls src={audioUrl} style={{ width: "100%", height: 32, display: "block" }} />
                ) : null}
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
                        <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 99, flexShrink: 0, background: cls.healthy ? "#dcfce7" : "#fff7ed", color: cls.healthy ? "#2d5e36" : "#7a2a1a", border: `1px solid ${cls.healthy ? "#bbf7d0" : "#fed7aa"}` }}>
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

      {/* PDF Dialog — full A4-proportioned, scrollable */}
      <Dialog open={pdfOpen} onOpenChange={setPdfOpen}>
        <DialogContent
          className="flex flex-col gap-0 p-0 overflow-hidden"
          style={{
            width: "min(900px, 96vw)",
            maxWidth: "none",
            height: "92vh",
            maxHeight: "92vh",
          }}
        >
          {/* Dialog header — fixed */}
          <DialogHeader className="px-5 py-3.5 flex-shrink-0" style={{ borderBottom: "1px solid #e2ddd6" }}>
            <DialogTitle>
              {lang ? "Diagnosis Report" : "निदान प्रतिवेदन"}
            </DialogTitle>
          </DialogHeader>

          {/* Scrollable A4 preview — this is the element captured for PDF */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              overflowX: "auto",
              background: "#e8e4de",
              padding: "20px 24px",
            }}
          >
            <div
              style={{
                width: 794,
                margin: "0 auto",
                boxShadow: "0 4px 32px rgba(0,0,0,0.18)",
                borderRadius: 3,
              }}
            >
              <PdfReport ref={pdfReportRef} items={reportItems} lang={lang} />
            </div>
          </div>

          {/* Dialog footer — fixed */}
          <div
            style={{
              flexShrink: 0,
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
              borderTop: "1px solid #e2ddd6",
              padding: "16px 24px",
              background: "#faf9f6",
            }}
          >
            <Button variant="outline" onClick={() => setPdfOpen(false)}>
              {lang ? "Close" : "बन्द गर्नुहोस्"}
            </Button>
            <Button variant="outline" onClick={handleSendEmail} disabled={emailSending || reportItems.length === 0 || reportItems.some(item => item.result.length === 1 && item.result[0]?.class_index === 15)}>
              {emailSending ? (lang ? "Sending…" : "पठाउँदै…") : (lang ? "Send Email" : "इमेल पठाउनुहोस्")}
            </Button>
            <Button onClick={handleDownloadPdf} disabled={generating}>
              {generating ? (lang ? "Generating…" : "बनाउँदै…") : (lang ? "Download PDF" : "PDF डाउनलोड")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
}
