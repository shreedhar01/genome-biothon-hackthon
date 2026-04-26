import React from "react";
import Webcam from "react-webcam";

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

interface Props {
  capturedImage: string | null;
  pending: boolean;
  lang: boolean;
  webcamRef: React.RefObject<Webcam | null>;
  onCapture: () => void;
  onAnalyse: () => void;
  onRetake: () => void;
}

export function CameraMode({ capturedImage, pending, lang, webcamRef, onCapture, onAnalyse, onRetake }: Props) {
  if (capturedImage) {
    return (
      <>
        <div style={{ flex: 1, minHeight: 0, overflow: "hidden" }}>
          <img src={capturedImage} alt="preview" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        </div>
        <div style={{ display: "flex", gap: 8, padding: 12, borderTop: "1px dashed #e2ddd6", flexShrink: 0 }}>
          <button onClick={onAnalyse} disabled={pending} style={{ ...primaryBtn, flex: 1, opacity: pending ? 0.6 : 1 }}>
            {pending ? (lang ? "Analysing…" : "विश्लेषण गर्दै…") : (lang ? "Analyse" : "विश्लेषण गर्नुहोस्")}
          </button>
          <button onClick={onRetake} disabled={pending} style={{ ...secondaryBtn, opacity: pending ? 0.5 : 1 }}>
            {lang ? "Retake" : "पुनः लिनुहोस्"}
          </button>
        </div>
      </>
    );
  }

  return (
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
        <button onClick={onCapture} style={{ ...primaryBtn, width: "100%" }}>
          {lang ? "Capture Photo" : "फोटो खिच्नुहोस्"}
        </button>
      </div>
    </>
  );
}
