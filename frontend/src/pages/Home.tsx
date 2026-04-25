import { CameraComponent } from "@/components/webCam";
import { useState } from "react";
import { PLANT_CLASSES } from "@/lib/plantClasses";

type PredictionResult = {
  predicted_class: number;
  confidence: number;
  all_probabilities: number[];
};

function LeafIcon() {
  return (
    <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
      <path
        d="M17 4C24 4 30 10 30 18C30 25 24 30 17 30C10 30 5 25 5 18C5 10 11 4 17 4Z"
        fill="#3f7a4a"
        stroke="#214a2c"
        strokeWidth="1.5"
      />
      <path d="M17 5 L17 29" stroke="#9ec7a3" strokeWidth="1.5" opacity="0.7" />
      <path d="M17 13 Q10 17 7 22" stroke="#9ec7a3" strokeWidth="1.5" fill="none" opacity="0.6" />
      <path d="M17 13 Q24 17 27 22" stroke="#9ec7a3" strokeWidth="1.5" fill="none" opacity="0.6" />
    </svg>
  );
}

export function HomePage() {
  const [lang, setLang] = useState(true);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [selectedPreview, setSelectedPreview] = useState<string | null>(null);

  const cls = result !== null ? PLANT_CLASSES[result.predicted_class] : null;
  const confidencePct = result ? Math.round(result.confidence * 100) : 0;

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
          {/* Live chip */}
          <div
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs"
            style={{ background: "#fff", border: "1px solid #e2ddd6", color: "#7a746e", boxShadow: "0 1px 2px rgba(0,0,0,0.06)" }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{
                background: "#3f7a4a",
                boxShadow: "0 0 0 4px oklch(0.52 0.13 145 / 0.18)",
                animation: "pulse-dot 1.6s ease-in-out infinite",
              }}
            />
            {lang ? "Live" : "लाइभ"}
          </div>

          {/* Language toggle */}
          <div
            className="inline-flex p-[3px] rounded-full"
            style={{ background: "#fff", border: "1px solid #e2ddd6", boxShadow: "0 1px 2px rgba(0,0,0,0.06)" }}
          >
            <button
              onClick={() => setLang(true)}
              className="px-3 py-1.5 rounded-full text-xs font-medium transition-all"
              style={lang ? { background: "#1a1714", color: "#fff" } : { background: "transparent", color: "#7a746e" }}
            >
              EN
            </button>
            <button
              onClick={() => setLang(false)}
              className="px-3 py-1.5 rounded-full text-xs font-medium transition-all"
              style={!lang ? { background: "#1a1714", color: "#fff" } : { background: "transparent", color: "#7a746e" }}
            >
              NP
            </button>
          </div>
        </div>
      </header>

      {/* Main split — stacks vertically on mobile, side-by-side on md+ */}
      <div className="grid gap-3.5 flex-1 min-h-0 grid-rows-2 md:grid-rows-1 md:[grid-template-columns:1.25fr_1fr]">
        {/* Camera panel */}
        <div
          className="flex flex-col rounded-xl overflow-hidden min-h-0"
          style={{ background: "#fff", border: "1px solid #e2ddd6", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}
        >
          <div
            className="flex items-center justify-between px-4 py-3"
            style={{ borderBottom: "1px dashed #e2ddd6" }}
          >
            <h2
              className="text-xl leading-none"
              style={{ fontFamily: "'Instrument Serif', Georgia, serif", color: "#1a1714" }}
            >
              {lang ? "Camera" : "क्यामेरा"}
            </h2>
          </div>
          <CameraComponent onResult={setResult} onSelectImage={setSelectedPreview} lang={lang} />
        </div>

        {/* Results panel */}
        <div
          className="flex flex-col rounded-xl overflow-hidden min-h-0"
          style={{ background: "#fff", border: "1px solid #e2ddd6", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}
        >
          <div
            className="flex items-center justify-between px-4 py-3"
            style={{ borderBottom: "1px dashed #e2ddd6" }}
          >
            <h2
              className="text-xl leading-none"
              style={{ fontFamily: "'Instrument Serif', Georgia, serif", color: "#1a1714" }}
            >
              {lang ? "Diagnosis" : "निदान"}
            </h2>
          </div>

          <div className="flex flex-col flex-1 p-4 min-h-0 overflow-y-auto">
            {/* Selected upload image preview */}
            {selectedPreview && (
              <div
                className="rounded-lg overflow-hidden mb-4 flex-shrink-0"
                style={{ border: "1px solid #e2ddd6" }}
              >
                <img
                  src={selectedPreview}
                  alt="selected"
                  style={{ width: "100%", height: 130, objectFit: "cover", display: "block" }}
                />
              </div>
            )}

            {cls ? (
              <div className="flex flex-col gap-4">
                {/* Status badge */}
                <div
                  className="inline-flex self-start items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
                  style={
                    cls.healthy
                      ? { background: "oklch(0.95 0.04 145)", color: "#2d5e36", border: "1px solid oklch(0.85 0.07 145)" }
                      : { background: "oklch(0.96 0.03 30)", color: "#7a2a1a", border: "1px solid oklch(0.88 0.06 30)" }
                  }
                >
                  <span>{cls.healthy ? "✓" : "!"}</span>
                  {lang ? (cls.healthy ? "Healthy" : "Disease Detected") : (cls.healthy ? "स्वस्थ" : "रोग पत्ता लाग्यो")}
                </div>

                {/* Plant name */}
                <div>
                  <p className="text-[11px] uppercase tracking-widest mb-1" style={{ color: "#7a746e", fontFamily: "ui-monospace, monospace" }}>
                    {lang ? "Plant" : "बिरुवा"}
                  </p>
                  <p className="text-2xl font-semibold" style={{ color: "#1a1714", fontFamily: "'Instrument Serif', Georgia, serif" }}>
                    {lang ? cls.plant : cls.plantNP}
                  </p>
                </div>

                {/* Disease name */}
                {!cls.healthy && (
                  <div>
                    <p className="text-[11px] uppercase tracking-widest mb-1" style={{ color: "#7a746e", fontFamily: "ui-monospace, monospace" }}>
                      {lang ? "Condition" : "रोग"}
                    </p>
                    <p className="text-base font-medium" style={{ color: "#3d3a37" }}>
                      {lang ? cls.disease : cls.diseaseNP}
                    </p>
                  </div>
                )}

                {/* Confidence */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="text-[11px] uppercase tracking-widest" style={{ color: "#7a746e", fontFamily: "ui-monospace, monospace" }}>
                      {lang ? "Confidence" : "विश्वास"}
                    </p>
                    <span className="text-sm font-semibold" style={{ color: "#1a1714", fontFamily: "ui-monospace, monospace" }}>
                      {confidencePct}%
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "#e2ddd6" }}>
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${confidencePct}%`,
                        background: confidencePct > 70 ? "#3f7a4a" : confidencePct > 40 ? "#b58a2a" : "#c0392b",
                      }}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center flex-1 gap-3 text-center">
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none" opacity="0.25">
                  <path
                    d="M24 6C33 6 42 14 42 24C42 33 33 42 24 42C15 42 7 33 7 24C7 14 16 6 24 6Z"
                    fill="#3f7a4a"
                  />
                  <path d="M24 7 L24 41" stroke="#9ec7a3" strokeWidth="2" opacity="0.7" />
                  <path d="M24 18 Q14 23 10 31" stroke="#9ec7a3" strokeWidth="2" fill="none" opacity="0.6" />
                  <path d="M24 18 Q34 23 38 31" stroke="#9ec7a3" strokeWidth="2" fill="none" opacity="0.6" />
                </svg>
                <div>
                  <p className="text-sm font-medium" style={{ color: "#7a746e" }}>
                    {lang ? "No diagnosis yet" : "अहिलेसम्म निदान छैन"}
                  </p>
                  <p className="text-xs mt-1" style={{ color: "#a09890" }}>
                    {lang
                      ? "Capture a photo or select an uploaded image"
                      : "फोटो खिच्नुहोस् वा अपलोड गरिएको छवि छान्नुहोस्"}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
