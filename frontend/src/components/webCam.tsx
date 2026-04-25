import React, { useRef, useState } from "react";
import Webcam from "react-webcam";
import { useSentImage } from "@/lib/api/hooks/processImage";
import toast from "react-hot-toast";
import { processImageSchema } from "@/validation/imageProcess";

type PredictionResult = {
  predicted_class: number;
  confidence: number;
  all_probabilities: number[];
};

interface Props {
  onResult?: (result: PredictionResult | null) => void;
  lang: boolean;
}

export const CameraComponent = ({ onResult, lang }: Props) => {
  type UploadItem = { id: string; file: File; preview: string };

  const [mode, setMode] = useState<"camera" | "upload">("camera");
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [uploadItems, setUploadItems] = useState<UploadItem[]>([]);

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

  const runAnalyse = async (file: File) => {
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
    if (valid.success) runAnalyse(valid.data.image);
  };

  const switchMode = (m: "camera" | "upload") => {
    setMode(m);
    setCapturedImage(null);
    setUploadItems([]);
    onResult?.(null);
  };

  const removeUploadItem = (id: string) =>
    setUploadItems((prev) => prev.filter((i) => i.id !== id));

  const pending = sentImageMutation.isPending;
  const previewSrc = capturedImage;

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
        previewSrc ? (
          /* ── Camera preview ── */
          <>
            <div style={{ flex: 1, minHeight: 0, overflow: "hidden" }}>
              <img
                src={previewSrc}
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
            <div style={{ flex: 1, minHeight: 0, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
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
                    {lang ? "Select multiple files" : "धेरै फाइलहरू छान्नुहोस्"} · JPG, PNG, WEBP · Max 5 MB
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
                </span>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  style={{ ...secondaryBtn, padding: "5px 12px", fontSize: 12 }}
                >
                  + {lang ? "Add more" : "थप्नुहोस्"}
                </button>
              </div>

              {/* Scrollable grid */}
              <div
                style={{
                  flex: 1, minHeight: 0, overflowY: "auto", padding: 12,
                  display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))",
                  gap: 10, alignContent: "start",
                }}
              >
                {uploadItems.map((item) => (
                  <div
                    key={item.id}
                    style={{ position: "relative", borderRadius: 8, overflow: "hidden", border: "1px solid #e2ddd6", background: "#f5f3ee" }}
                  >
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

                    {/* Remove button */}
                    <button
                      onClick={() => removeUploadItem(item.id)}
                      disabled={pending}
                      style={{
                        position: "absolute", top: 5, right: 5,
                        width: 22, height: 22, borderRadius: "50%",
                        background: "rgba(0,0,0,0.55)", color: "#fff",
                        border: "none", cursor: "pointer", fontSize: 14, lineHeight: 1,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        opacity: pending ? 0.4 : 1,
                      }}
                      title={lang ? "Remove" : "हटाउनुहोस्"}
                    >
                      ×
                    </button>

                    {/* Analyse overlay button */}
                    <button
                      onClick={() => runAnalyse(item.file)}
                      disabled={pending}
                      style={{
                        position: "absolute", bottom: 28, left: 0, right: 0,
                        background: "rgba(63,122,74,0.92)", color: "#fff",
                        border: "none", cursor: "pointer", fontSize: 11, fontWeight: 600,
                        padding: "5px 0", opacity: pending ? 0.5 : 1,
                        transition: "opacity 0.15s",
                      }}
                    >
                      {lang ? "Analyse" : "विश्लेषण"}
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};
