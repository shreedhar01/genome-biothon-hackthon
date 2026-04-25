import React, { useRef, useState } from "react";
import Webcam from "react-webcam";
import { useSentImage } from "@/lib/api/hooks/processImage";
import toast from "react-hot-toast";
import { processImageSchema } from "@/validation/imageProcess";
import { PLANT_CLASSES } from "@/lib/plantClasses";

type PredictionResult = {
  predicted_class: number;
  confidence: number;
  all_probabilities: number[];
};

type UploadItem = {
  id: string;
  file: File;
  preview: string;
  result?: PredictionResult | null;
  analysing?: boolean;
};

interface Props {
  onResult?: (result: PredictionResult | null) => void;
  onSelectImage?: (preview: string | null) => void;
  lang: boolean;
}

export const CameraComponent = ({ onResult, onSelectImage, lang }: Props) => {
  const [mode, setMode] = useState<"camera" | "upload">("camera");
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [uploadItems, setUploadItems] = useState<UploadItem[]>([]);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [isAnalysingAll, setIsAnalysingAll] = useState(false);

  const sentImageMutation = useSentImage();
  const webcamRef = useRef<Webcam>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const capture = () => {
    const src = webcamRef.current?.getScreenshot();
    if (src) setCapturedImage(src);
  };

  const base64ToFile = (base64: string, filename: string): File => {
    const arr = base64.split(",");
    const mime = arr[0].match(/:(.*?);/)![1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) u8arr[n] = bstr.charCodeAt(n);
    return new File([u8arr], filename, { type: mime });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    files.forEach((file) => {
      const valid = processImageSchema.safeParse({ image: file });
      if (!valid.success) {
        toast.error(`${file.name}: ${valid.error.issues[0].message}`);
        return;
      }
      const id = `${Date.now()}-${Math.random()}`;
      const reader = new FileReader();
      reader.onload = (ev) => {
        setUploadItems((prev) => [
          ...prev,
          { id, file: valid.data.image, preview: ev.target?.result as string },
        ]);
      };
      reader.readAsDataURL(file);
    });
    e.target.value = "";
  };

  // currentSelectedId passed at call-time to avoid stale closure
  const analyseItem = async (
    itemId: string,
    file: File,
    currentSelectedId: string | null
  ): Promise<PredictionResult | null> => {
    setUploadItems((prev) =>
      prev.map((i) => (i.id === itemId ? { ...i, analysing: true } : i))
    );
    const formData = new FormData();
    formData.append("image", file);
    try {
      const response = await sentImageMutation.mutateAsync(formData);
      const result: PredictionResult = response?.data?.[0] ?? null;
      setUploadItems((prev) =>
        prev.map((i) => (i.id === itemId ? { ...i, result, analysing: false } : i))
      );
      // Update the Diagnosis panel only if this item is selected (or nothing is selected)
      if (!currentSelectedId || currentSelectedId === itemId) {
        onResult?.(result);
      }
      return result;
    } catch {
      setUploadItems((prev) =>
        prev.map((i) => (i.id === itemId ? { ...i, analysing: false } : i))
      );
      return null;
    }
  };

  const handleCardClick = (item: UploadItem) => {
    setSelectedItemId(item.id);
    onResult?.(item.result ?? null);
    onSelectImage?.(item.preview);
  };

  const handleSingleItemAnalyse = (e: React.MouseEvent, itemId: string, file: File) => {
    e.stopPropagation();
    // Selecting this item so the panel shows its result
    const item = uploadItems.find((i) => i.id === itemId);
    setSelectedItemId(itemId);
    if (item) onSelectImage?.(item.preview);

    const toastId = toast.loading(lang ? "Analysing image…" : "विश्लेषण गर्दै…");
    analyseItem(itemId, file, itemId).then((result) => {
      if (result) {
        toast.success(lang ? "Diagnosis complete!" : "निदान सम्पन्न!", { id: toastId });
      } else {
        toast.dismiss(toastId);
      }
    });
  };

  const handleAnalyseAll = async () => {
    const toAnalyse = uploadItems.filter((i) => !i.result && !i.analysing);
    if (toAnalyse.length === 0 || isAnalysingAll) return;
    const snapshotSelectedId = selectedItemId;
    setIsAnalysingAll(true);
    const toastId = toast.loading(
      lang
        ? `Analysing 0 / ${toAnalyse.length}…`
        : `विश्लेषण गर्दै… 0 / ${toAnalyse.length}`
    );
    let done = 0;
    for (const item of toAnalyse) {
      await analyseItem(item.id, item.file, snapshotSelectedId);
      done++;
      toast.loading(
        lang
          ? `Analysing ${done} / ${toAnalyse.length}…`
          : `विश्लेषण गर्दै… ${done} / ${toAnalyse.length}`,
        { id: toastId }
      );
    }
    toast.success(
      lang ? "All images analysed!" : "सबै छविहरूको विश्लेषण सम्पन्न!",
      { id: toastId }
    );
    setIsAnalysingAll(false);
  };

  const runCameraAnalyse = async (file: File) => {
    const formData = new FormData();
    formData.append("image", file);
    try {
      const response = await toast.promise(
        sentImageMutation.mutateAsync(formData),
        {
          loading: lang ? "Analysing image…" : "विश्लेषण गर्दै…",
          success: lang ? "Diagnosis complete!" : "निदान सम्पन्न!",
          error: lang ? "Could not process image." : "छवि प्रशोधन गर्न सकिएन।",
        }
      );
      onResult?.(response?.data?.[0] ?? null);
    } catch {
      // handled by mutation onError
    }
  };

  const handleCameraAnalyse = () => {
    if (!capturedImage) return;
    const file = base64ToFile(capturedImage, "capture.jpg");
    const valid = processImageSchema.safeParse({ image: file });
    if (valid.success) runCameraAnalyse(valid.data.image);
  };

  const switchMode = (m: "camera" | "upload") => {
    setMode(m);
    setCapturedImage(null);
    setUploadItems([]);
    setSelectedItemId(null);
    onResult?.(null);
    onSelectImage?.(null);
  };

  const removeUploadItem = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setUploadItems((prev) => prev.filter((i) => i.id !== id));
    if (selectedItemId === id) {
      setSelectedItemId(null);
      onResult?.(null);
      onSelectImage?.(null);
    }
  };

  const anyAnalysing = isAnalysingAll || uploadItems.some((i) => i.analysing);
  const analysedCount = uploadItems.filter((i) => i.result != null).length;
  const unanalysed = uploadItems.filter((i) => !i.result).length;
  const pending = sentImageMutation.isPending;

  const primaryBtn: React.CSSProperties = {
    background: "#3f7a4a", color: "#fff", border: "none",
    borderRadius: 8, padding: "10px 20px", fontSize: 13,
    fontWeight: 500, cursor: "pointer", transition: "background 0.15s",
  };
  const secondaryBtn: React.CSSProperties = {
    background: "transparent", color: "#5a5550", border: "1px solid #e2ddd6",
    borderRadius: 8, padding: "10px 20px", fontSize: 13,
    fontWeight: 500, cursor: "pointer", transition: "background 0.15s",
  };

  const renderItemResult = (result: PredictionResult) => {
    const cls = PLANT_CLASSES[result.predicted_class];
    if (!cls) return null;
    const pct = Math.round(result.confidence * 100);
    return (
      <div
        style={{
          padding: "6px 7px 5px",
          borderTop: "1px solid #e2ddd6",
          background: cls.healthy ? "oklch(0.97 0.02 145)" : "oklch(0.97 0.02 30)",
        }}
      >
        <span
          style={{
            fontSize: 9, fontWeight: 700, letterSpacing: "0.05em",
            textTransform: "uppercase", color: cls.healthy ? "#2d5e36" : "#7a2a1a",
          }}
        >
          {cls.healthy ? (lang ? "✓ Healthy" : "✓ स्वस्थ") : (lang ? "! Disease" : "! रोग")}
        </span>
        <p style={{ fontSize: 11, fontWeight: 600, color: "#1a1714", margin: "2px 0 1px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {lang ? cls.plant : cls.plantNP}
        </p>
        {!cls.healthy && (
          <p style={{ fontSize: 9, color: "#5a5550", margin: "0 0 3px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {lang ? cls.disease : cls.diseaseNP}
          </p>
        )}
        <div style={{ height: 3, borderRadius: 2, background: "#e2ddd6", overflow: "hidden", marginTop: 3 }}>
          <div
            style={{
              height: "100%", borderRadius: 2, width: `${pct}%`,
              background: pct > 70 ? "#3f7a4a" : pct > 40 ? "#b58a2a" : "#c0392b",
            }}
          />
        </div>
        <p style={{ fontSize: 9, color: "#7a746e", margin: "2px 0 0", fontFamily: "ui-monospace, monospace" }}>{pct}%</p>
      </div>
    );
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0, overflow: "hidden" }}>

      {/* Mode tabs */}
      <div style={{ display: "flex", borderBottom: "1px dashed #e2ddd6", padding: "0 12px", flexShrink: 0 }}>
        {(["camera", "upload"] as const).map((m) => (
          <button
            key={m}
            onClick={() => switchMode(m)}
            style={{
              padding: "8px 14px", fontSize: 12, background: "transparent", border: "none",
              fontWeight: mode === m ? 600 : 400,
              color: mode === m ? "#1a1714" : "#7a746e",
              borderBottom: mode === m ? "2px solid #3f7a4a" : "2px solid transparent",
              cursor: "pointer", marginBottom: -1, transition: "all 0.15s",
            }}
          >
            {m === "camera"
              ? (lang ? "Camera" : "क्यामेरा")
              : (lang ? "Upload" : "अपलोड")}
          </button>
        ))}
      </div>

      {mode === "camera" ? (
        capturedImage ? (
          /* ── Camera preview ── */
          <>
            <div style={{ flex: 1, minHeight: 0, overflow: "hidden" }}>
              <img
                src={capturedImage}
                alt="preview"
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
            </div>
            <div style={{ display: "flex", gap: 8, padding: 12, borderTop: "1px dashed #e2ddd6", flexShrink: 0 }}>
              <button
                onClick={handleCameraAnalyse}
                disabled={pending}
                style={{ ...primaryBtn, flex: 1, opacity: pending ? 0.6 : 1 }}
              >
                {pending ? (lang ? "Analysing…" : "विश्लेषण गर्दै…") : (lang ? "Analyse" : "विश्लेषण गर्नुहोस्")}
              </button>
              <button
                onClick={() => { setCapturedImage(null); onResult?.(null); }}
                disabled={pending}
                style={{ ...secondaryBtn, opacity: pending ? 0.5 : 1 }}
              >
                {lang ? "Retake" : "पुनः लिनुहोस्"}
              </button>
            </div>
          </>
        ) : (
          /* ── Live webcam ── */
          <>
            <div style={{ flex: 1, minHeight: 0, overflow: "hidden", background: "#0a0a0a" }}>
              <Webcam
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                videoConstraints={{ facingMode: "environment" }}
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
            </div>
            <div style={{ padding: 12, borderTop: "1px dashed #e2ddd6", flexShrink: 0 }}>
              <button onClick={capture} style={{ ...primaryBtn, width: "100%" }}>
                {lang ? "Capture Photo" : "फोटो खिच्नुहोस्"}
              </button>
            </div>
          </>
        )
      ) : (
        /* ── Upload mode — multi-image grid ── */
        <>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />

          {uploadItems.length === 0 ? (
            /* Empty state — dropzone */
            <div style={{ flex: 1, minHeight: 0, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
              <div
                onClick={() => fileInputRef.current?.click()}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#3f7a4a"; e.currentTarget.style.background = "oklch(0.95 0.04 145)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#c8c2ba"; e.currentTarget.style.background = "#faf9f6"; }}
                style={{
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 12,
                  padding: "28px 32px", border: "2px dashed #c8c2ba", borderRadius: 12,
                  cursor: "pointer", background: "#faf9f6", transition: "border-color 0.15s, background 0.15s",
                  width: "100%", maxWidth: 320,
                }}
              >
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#7a746e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                <div style={{ textAlign: "center" }}>
                  <p style={{ fontSize: 13, fontWeight: 500, color: "#3d3a37", margin: 0 }}>
                    {lang ? "Click to upload images" : "छविहरू अपलोड गर्न क्लिक गर्नुहोस्"}
                  </p>
                  <p style={{ fontSize: 11, color: "#9a9490", margin: "4px 0 0" }}>
                    {lang ? "Select one or multiple files" : "एक वा धेरै फाइलहरू छान्नुहोस्"} · JPG, PNG, WEBP · Max 5 MB
                  </p>
                </div>
              </div>
            </div>
          ) : (
            /* Thumbnail grid */
            <>
              {/* Toolbar */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 12px", borderBottom: "1px dashed #e2ddd6", flexShrink: 0 }}>
                <span style={{ fontSize: 12, color: "#7a746e" }}>
                  {uploadItems.length} {lang ? (uploadItems.length === 1 ? "image" : "images") : "छविहरू"}
                  {analysedCount > 0 && (
                    <span style={{ color: "#3f7a4a", marginLeft: 6 }}>
                      · {analysedCount} {lang ? "analysed" : "विश्लेषण"}
                    </span>
                  )}
                </span>
                <div style={{ display: "flex", gap: 6 }}>
                  {unanalysed > 0 && (
                    <button
                      onClick={handleAnalyseAll}
                      disabled={anyAnalysing}
                      style={{ ...primaryBtn, padding: "5px 12px", fontSize: 12, opacity: anyAnalysing ? 0.6 : 1 }}
                    >
                      {anyAnalysing
                        ? (lang ? "Analysing…" : "विश्लेषण गर्दै…")
                        : (lang ? `Analyse All (${unanalysed})` : `सबै विश्लेषण (${unanalysed})`)}
                    </button>
                  )}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={anyAnalysing}
                    style={{ ...secondaryBtn, padding: "5px 12px", fontSize: 12, opacity: anyAnalysing ? 0.5 : 1 }}
                  >
                    + {lang ? "Add more" : "थप्नुहोस्"}
                  </button>
                </div>
              </div>

              {/* Scroll wrapper — separated from grid so overflow works reliably */}
              <div style={{ flex: 1, minHeight: 0, overflowY: "auto" }}>
                <div
                  style={{
                    padding: 12,
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))",
                    gap: 10,
                  }}
                >
                  {uploadItems.map((item) => {
                    const isSelected = selectedItemId === item.id;
                    return (
                      <div
                        key={item.id}
                        onClick={() => handleCardClick(item)}
                        style={{
                          position: "relative", borderRadius: 8, overflow: "hidden",
                          border: isSelected ? "2px solid #3f7a4a" : "1px solid #e2ddd6",
                          boxShadow: isSelected ? "0 0 0 3px oklch(0.52 0.13 145 / 0.18)" : "none",
                          background: "#f5f3ee",
                          display: "flex", flexDirection: "column",
                          cursor: "pointer",
                          transition: "border-color 0.15s, box-shadow 0.15s",
                        }}
                      >
                        {/* Remove button */}
                        <button
                          onClick={(e) => removeUploadItem(e, item.id)}
                          disabled={anyAnalysing}
                          style={{
                            position: "absolute", top: 5, right: 5, zIndex: 1,
                            width: 22, height: 22, borderRadius: "50%",
                            background: "rgba(0,0,0,0.55)", color: "#fff",
                            border: "none", cursor: "pointer", fontSize: 14, lineHeight: 1,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            opacity: anyAnalysing ? 0.4 : 1,
                          }}
                          title={lang ? "Remove" : "हटाउनुहोस्"}
                        >
                          ×
                        </button>

                        {/* Thumbnail */}
                        <div style={{ aspectRatio: "1", overflow: "hidden" }}>
                          <img
                            src={item.preview}
                            alt={item.file.name}
                            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                          />
                        </div>

                        {/* Filename */}
                        <div style={{ padding: "5px 7px 4px", borderTop: "1px solid #e2ddd6" }}>
                          <p style={{ fontSize: 10, color: "#7a746e", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {item.file.name}
                          </p>
                        </div>

                        {/* Inline result */}
                        {item.result && renderItemResult(item.result)}

                        {/* Analyse / Re-analyse button */}
                        <button
                          onClick={(e) => handleSingleItemAnalyse(e, item.id, item.file)}
                          disabled={anyAnalysing}
                          style={{
                            background: item.result ? "transparent" : "#3f7a4a",
                            color: item.result ? "#3f7a4a" : "#fff",
                            border: item.result ? "1px solid #c8e6cc" : "none",
                            cursor: anyAnalysing ? "not-allowed" : "pointer",
                            fontSize: 10, fontWeight: 600,
                            padding: item.result ? "4px 0" : "6px 0",
                            margin: item.result ? "4px 7px 6px" : "0",
                            borderRadius: item.result ? 4 : 0,
                            opacity: anyAnalysing && !item.analysing ? 0.5 : 1,
                            transition: "opacity 0.15s",
                          }}
                        >
                          {item.analysing
                            ? (lang ? "Analysing…" : "विश्लेषण गर्दै…")
                            : item.result
                              ? (lang ? "↻ Re-analyse" : "↻ पुनः विश्लेषण")
                              : (lang ? "Analyse" : "विश्लेषण")}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};
