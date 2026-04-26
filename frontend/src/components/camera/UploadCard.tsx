import React from "react";
import { PLANT_CLASSES } from "@/lib/plantClasses";
import type { UploadItem, PredictionResult } from "./types";

interface CardProps {
  item: UploadItem;
  isSelected: boolean;
  anyAnalysing: boolean;
  lang: boolean;
  onClick: () => void;
  onRemove: (e: React.MouseEvent) => void;
  onAnalyse: (e: React.MouseEvent) => void;
}

function ItemResult({ result, lang }: { result: PredictionResult[]; lang: boolean }) {
  const top = result[0];
  if (!top) return null;
  const cls = PLANT_CLASSES[top.class_index];
  if (!cls) return null;
  const pct = Math.round(top.confidence * 100);
  return (
    <div
      style={{
        padding: "6px 7px 5px",
        borderTop: "1px solid #e2ddd6",
        background: cls.healthy ? "oklch(0.97 0.02 145)" : "oklch(0.97 0.02 30)",
      }}
    >
      <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", color: cls.healthy ? "#2d5e36" : "#7a2a1a" }}>
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
        <div style={{ height: "100%", borderRadius: 2, width: `${pct}%`, background: pct > 70 ? "#3f7a4a" : pct > 40 ? "#b58a2a" : "#c0392b" }} />
      </div>
      <p style={{ fontSize: 9, color: "#7a746e", margin: "2px 0 0", fontFamily: "ui-monospace, monospace" }}>{pct}%</p>
    </div>
  );
}

export function UploadCard({ item, isSelected, anyAnalysing, lang, onClick, onRemove, onAnalyse }: CardProps) {
  return (
    <div
      onClick={onClick}
      style={{
        position: "relative", borderRadius: 8, overflow: "hidden",
        border: isSelected ? "2px solid #3f7a4a" : "1px solid #e2ddd6",
        boxShadow: isSelected ? "0 0 0 3px oklch(0.52 0.13 145 / 0.18)" : "none",
        background: "#f5f3ee", display: "flex", flexDirection: "column",
        cursor: "pointer", transition: "border-color 0.15s, box-shadow 0.15s",
      }}
    >
      <button
        onClick={onRemove}
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
      >×</button>

      <div style={{ aspectRatio: "1", overflow: "hidden" }}>
        <img src={item.preview} alt={item.file.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
      </div>

      <div style={{ padding: "5px 7px 4px", borderTop: "1px solid #e2ddd6" }}>
        <p style={{ fontSize: 10, color: "#7a746e", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {item.file.name}
        </p>
      </div>

      {item.result && <ItemResult result={item.result} lang={lang} />}

      <button
        onClick={onAnalyse}
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
}
