import React from "react";
import { UploadCard } from "./UploadCard";
import type { UploadItem } from "./types";

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
  uploadItems: UploadItem[];
  selectedItemId: string | null;
  anyAnalysing: boolean;
  analysedCount: number;
  unanalysed: number;
  lang: boolean;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCardClick: (item: UploadItem) => void;
  onRemoveItem: (e: React.MouseEvent, id: string) => void;
  onSingleAnalyse: (e: React.MouseEvent, id: string, file: File) => void;
  onAnalyseAll: () => void;
}

export function UploadMode({
  uploadItems, selectedItemId, anyAnalysing, analysedCount, unanalysed,
  lang, fileInputRef, onFileChange, onCardClick, onRemoveItem, onSingleAnalyse, onAnalyseAll,
}: Props) {
  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={onFileChange}
        style={{ display: "none" }}
      />

      {uploadItems.length === 0 ? (
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
        <>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 12px", borderBottom: "1px dashed #e2ddd6", flexShrink: 0 }}>
            <span style={{ fontSize: 12, color: "#7a746e" }}>
              {uploadItems.length} {lang ? (uploadItems.length === 1 ? "image" : "images") : "छविहरू"}
              {analysedCount > 0 && (
                <span style={{ color: "#3f7a4a", marginLeft: 6 }}>· {analysedCount} {lang ? "analysed" : "विश्लेषण"}</span>
              )}
            </span>
            <div style={{ display: "flex", gap: 6 }}>
              {unanalysed > 0 && (
                <button
                  onClick={onAnalyseAll}
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

          <div style={{ flex: 1, minHeight: 0, overflowY: "auto" }}>
            <div style={{ padding: 12, display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: 10 }}>
              {uploadItems.map((item) => (
                <UploadCard
                  key={item.id}
                  item={item}
                  isSelected={selectedItemId === item.id}
                  anyAnalysing={anyAnalysing}
                  lang={lang}
                  onClick={() => onCardClick(item)}
                  onRemove={(e) => onRemoveItem(e, item.id)}
                  onAnalyse={(e) => onSingleAnalyse(e, item.id, item.file)}
                />
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
}
