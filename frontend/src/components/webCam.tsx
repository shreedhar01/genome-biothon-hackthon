import React, { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import { useSentImage } from "@/lib/api/hooks/processImage";
import toast from "react-hot-toast";
import { processImageSchema } from "@/validation/imageProcess";
import { CameraMode } from "./camera/CameraMode";
import { UploadMode } from "./camera/UploadMode";
import type { PredictionResult, UploadItem } from "./camera/types";

export type { ReportItem } from "./camera/types";

interface Props {
  onResult?: (result: PredictionResult[] | null) => void;
  onSelectImage?: (preview: string | null) => void;
  onReportItems?: (items: import("./camera/types").ReportItem[]) => void;
  onImageAnalysed?: () => void;
  lang: boolean;
}

export const CameraComponent = ({ onResult, onSelectImage, onReportItems, onImageAnalysed, lang }: Props) => {
  const [mode, setMode] = useState<"camera" | "upload">("camera");
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [uploadItems, setUploadItems] = useState<UploadItem[]>([]);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [isAnalysingAll, setIsAnalysingAll] = useState(false);

  const sentImageMutation = useSentImage();
  const webcamRef = useRef<Webcam>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (mode !== "upload") return;
    const items = uploadItems
      .filter((i) => i.result != null)
      .map((i) => ({ id: i.id, fileName: i.file.name, preview: i.preview, result: i.result! }));
    onReportItems?.(items);
  }, [uploadItems, mode]); // eslint-disable-line react-hooks/exhaustive-deps

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

  const analyseItem = async (
    itemId: string,
    file: File,
    currentSelectedId: string | null
  ): Promise<PredictionResult[] | null> => {
    setUploadItems((prev) =>
      prev.map((i) => (i.id === itemId ? { ...i, analysing: true } : i))
    );
    const formData = new FormData();
    formData.append("image", file);
    try {
      const response = await sentImageMutation.mutateAsync(formData);
      const results: PredictionResult[] = response?.data?.[0] ?? null;
      setUploadItems((prev) =>
        prev.map((i) => (i.id === itemId ? { ...i, result: results, analysing: false } : i))
      );
      if (!currentSelectedId || currentSelectedId === itemId) {
        onResult?.(results);
      }
      onImageAnalysed?.();
      return results;
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
    const item = uploadItems.find((i) => i.id === itemId);
    setSelectedItemId(itemId);
    if (item) onSelectImage?.(item.preview);
    const toastId = toast.loading(lang ? "Analysing image…" : "विश्लेषण गर्दै…");
    analyseItem(itemId, file, itemId).then((results) => {
      if (results) {
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
      lang ? `Analysing 0 / ${toAnalyse.length}…` : `विश्लेषण गर्दै… 0 / ${toAnalyse.length}`
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
    toast.success(lang ? "All images analysed!" : "सबै छविहरूको विश्लेषण सम्पन्न!", { id: toastId });
    setIsAnalysingAll(false);
  };

  const runCameraAnalyse = async (file: File, preview: string) => {
    const formData = new FormData();
    formData.append("image", file);
    try {
      const response = await toast.promise(sentImageMutation.mutateAsync(formData), {
        loading: lang ? "Analysing image…" : "विश्लेषण गर्दै…",
        success: lang ? "Diagnosis complete!" : "निदान सम्पन्न!",
        error: lang ? "Could not process image." : "छवि प्रशोधन गर्न सकिएन।",
      });
      const results: PredictionResult[] = response?.data?.[0] ?? null;
      onResult?.(results);
      onImageAnalysed?.();
      if (results) {
        onReportItems?.([{
          id: "camera-capture",
          fileName: lang ? "Camera Capture" : "क्यामेरा फोटो",
          preview,
          result: results,
        }]);
      }
    } catch {
      // handled by mutation onError
    }
  };

  const handleCameraAnalyse = () => {
    if (!capturedImage) return;
    const file = base64ToFile(capturedImage, "capture.jpg");
    const valid = processImageSchema.safeParse({ image: file });
    if (valid.success) runCameraAnalyse(valid.data.image, capturedImage);
  };

  const switchMode = (m: "camera" | "upload") => {
    setMode(m);
    setCapturedImage(null);
    setUploadItems([]);
    setSelectedItemId(null);
    onResult?.(null);
    onSelectImage?.(null);
    onReportItems?.([]);
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

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0, overflow: "hidden" }}>
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
            {m === "camera" ? (lang ? "Camera" : "क्यामेरा") : (lang ? "Upload" : "अपलोड")}
          </button>
        ))}
      </div>

      {mode === "camera" ? (
        <CameraMode
          capturedImage={capturedImage}
          pending={sentImageMutation.isPending}
          lang={lang}
          webcamRef={webcamRef}
          onCapture={capture}
          onAnalyse={handleCameraAnalyse}
          onRetake={() => { setCapturedImage(null); onResult?.(null); onReportItems?.([]); }}
        />
      ) : (
        <UploadMode
          uploadItems={uploadItems}
          selectedItemId={selectedItemId}
          anyAnalysing={anyAnalysing}
          analysedCount={analysedCount}
          unanalysed={unanalysed}
          lang={lang}
          fileInputRef={fileInputRef}
          onFileChange={handleFileChange}
          onCardClick={handleCardClick}
          onRemoveItem={removeUploadItem}
          onSingleAnalyse={handleSingleItemAnalyse}
          onAnalyseAll={handleAnalyseAll}
        />
      )}
    </div>
  );
};
