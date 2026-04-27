# Krishi Netra — कृषि नेत्र

> AI-powered crop disease diagnosis for Nepali farmers. Upload or capture a photo of a plant leaf and get instant disease detection, treatment guidance, Nepali audio instructions, and a downloadable PDF report.

---

## Overview

**Krishi Netra** is a full-stack web application that helps farmers identify plant diseases from leaf images. It combines a fine-tuned Vision Transformer (ViT) model with a bilingual (English / Nepali) interface, Nepali text-to-speech audio guidance, and email/PDF report generation.

Built as a hackathon project targeting accessibility for Nepali-speaking farmers.

---

## Features

- **Real-time disease detection** — webcam capture or file upload
- **Top-3 confidence predictions** per image with visual confidence bars
- **11 disease/health classes**  Tomato crops
- **Bilingual UI** — switch between English and Nepali (नेपाली) instantly
- **Nepali audio guide** — TTS synthesis of treatment advice in Nepali
- **Treatment guide** — immediate actions, long-term prevention, and recommended chemicals per disease
- **PDF report** — downloadable A4 diagnosis report (paginated, bilingual)
- **Email report** — send the diagnosis summary directly to email
- **Background leaf isolation** — OpenCV-based preprocessing removes background for better accuracy

---

## Architecture

```
hackthon/
├── frontend/        # React 19 + Vite + TypeScript + TailwindCSS
├── backend/         # Node.js + Express + TypeScript
└── ai-backend/      # Python + FastAPI + PyTorch (ViT model + TTS)
```

The three services communicate as follows:

```
Browser (frontend :5173)
    └─► Node/Express backend (:8000)
            └─► FastAPI AI backend (:8001)
                    ├── POST /plant/predict   — disease classification
                    └── POST /tts/synthesize  — Nepali audio guide
```

---

## Supported Plant Classes (16 total)

| # | Plant   | Condition              |
|---|---------|------------------------|
|             |
| 1| Tomato  | Bacterial Spot         |
| 2 | Tomato  | Early Blight           |
| 3| Tomato  | Late Blight            |
| 4| Tomato  | Leaf Mold              |
| 5| Tomato  | Septoria Leaf Spot     |
|6| Tomato  | Spider Mites           |
|7 | Tomato  | Target Spot            |
|8 | Tomato  | Yellow Leaf Curl Virus |
|9| Tomato  | Mosaic Virus           |
|10| Tomato  | Healthy                |
|11 | Tomato  | Powdery Mildew         |

---

## Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| React | 19 | UI framework |
| Vite | 7 | Build tool |
| TypeScript | 5.9 | Type safety |
| TailwindCSS | 4 | Styling |
| TanStack Query | 5 | Server state / data fetching |
| React Webcam | 7 | Camera capture |
| jsPDF + html2canvas | latest | PDF report generation |
| Radix UI / shadcn | latest | Accessible UI components |
| React Router | 7 | Client-side routing |
| Zod | 4 | Form validation |

### Backend (Node.js)
| Technology | Version | Purpose |
|---|---|---|
| Express | 4 | HTTP server |
| TypeScript | 5.4 | Type safety |
| Nodemailer | 8 | Email dispatch |
| Multer | 2 | File upload handling |
| JWT + bcrypt | — | Auth utilities |
| Zod | 3 | Request validation |
| Helmet + CORS | — | Security middleware |

### AI Backend (Python)
| Technology | Purpose |
|---|---|
| FastAPI + Uvicorn | HTTP server |
| PyTorch + torchvision | Model inference |
| HuggingFace Transformers (`google/vit-base-patch16-224-in21k`) | ViT base model |
| OpenCV (`cv2`) | Background leaf isolation |
| Pillow | Image I/O |
| omnivoice | Nepali TTS synthesis |
| soundfile | Audio file handling |

---

## AI Model Details

### Architecture
A **Vision Transformer (ViT)** classifier fine-tuned for plant disease recognition:

```
ViTModel (google/vit-base-patch16-224-in21k)
  └── [CLS] token output (hidden_size=768)
        └── Dropout(p=0.2)
              └── Linear(768 → 11)  ← 11 disease classes
```

### Image Preprocessing Pipeline
Before classification, each image goes through:
1. **Background removal** — HSV masking isolates the largest green/leaf region using OpenCV morphological operations and connected-component analysis. Background is set to black.
2. **Augmentation transforms** — `RandomResizedCrop(224)`, random flips, rotation (±25°), color jitter, random grayscale, Gaussian blur.
3. **Normalization** — ImageNet mean/std `([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])`.

### Inference
Returns top-3 predictions with softmax confidence scores:
```json
[
  { "class_index": 6, "plant": "Tomato", "condition": "Early Blight", "confidence": 0.8712 },
  { "class_index": 7, "plant": "Tomato", "condition": "Late Blight",  "confidence": 0.0934 },
  { "class_index": 5, "plant": "Tomato", "condition": "Bacterial Spot","confidence": 0.0214 }
]
```

---

## API Reference

### Node.js Backend (`/api/v1`)

| Method | Path | Description |
|---|---|---|
| `GET` | `/health` | Health check |
| `POST` | `/process-img` | Upload image → forwards to AI backend for prediction |
| `POST` | `/audio` | Forward text to AI TTS endpoint, return audio |
| `POST` | `/email` | Send diagnosis report via email (Nodemailer) |
| `GET` | `/test` | Smoke test endpoint |

### Python AI Backend

| Method | Path | Description |
|---|---|---|
| `GET` | `/` | Root health check |
| `POST` | `/plant/predict` | Accept `multipart/form-data` image, return top-3 predictions |
| `POST` | `/tts/synthesize` | Accept `{ "text": "..." }`, return `audio/wav` |

---

## Getting Started

### Prerequisites
- Node.js ≥ 20
- pnpm
- Python ≥ 3.10
- CUDA-capable GPU (optional, CPU inference supported)

---

### 1. AI Backend

```bash
cd ai-backend
python -m venv venv
source venv/bin/activate       # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8001
```

The AI service will be available at `http://localhost:8001`.

> **Note:** The pre-trained model weights (`models/best_model.pth`) must be present. The ViT base weights are downloaded automatically from HuggingFace on first run.

---

### 2. Node.js Backend

```bash
cd backend
cp .env.example .env
# Edit .env — set email credentials and any other config
pnpm install
pnpm run dev       # Starts on http://localhost:8000
```

**Environment variables (`.env`):**

```env
PORT=8000
NODE_ENV=development
```

---

### 3. Frontend

```bash
cd frontend
pnpm install
pnpm run dev       # Starts on http://localhost:5173
```

Open `http://localhost:5173` in your browser.

---

## Usage

1. Open the app in your browser.
2. Switch language using the **EN / NP** toggle in the top-right corner.
3. **Camera panel (left):**
   - Click **Camera** to use your webcam and capture a leaf photo.
   - Click **Upload** to select one or more images from disk.
4. **Diagnosis panel (right):**
   - Predictions appear with plant name, disease label, and confidence bar.
   - In Nepali mode, an audio guide is automatically synthesized and plays in the panel.
5. Once images are analysed, click **PDF** to open the full report preview.
   - **Download PDF** — saves an A4 report with treatment cards and chemical table.
   - **Send Email** — dispatches the report to the configured email address.

---

## Project Structure

```
hackthon/
│
├── ai-backend/
│   ├── main.py               # FastAPI app entry point
│   ├── routes/
│   │   ├── plant.py          # /plant/predict endpoint + background removal
│   │   └── tts.py            # /tts/synthesize endpoint
│   ├── model/
│   │   ├── plant.py          # ViTClassifier definition + class labels + model loader
│   │   └── tts.py            # TTS synthesis wrapper (omnivoice)
│   ├── models/
│   │   └── best_model.pth    # Fine-tuned ViT weights (not tracked in git)
│   └── requirements.txt
│
├── backend/
│   ├── src/
│   │   ├── index.ts          # Express app setup
│   │   ├── api_v1/
│   │   │   ├── controllers/  # processImage, health
│   │   │   ├── middleware/   # error, validate
│   │   │   └── routes/       # health, processImage, processAudio, sentEmail
│   │   │   ├── config/           # env config, multer, axios client
│   │   ├── services/         # business logic
│   │   ├── utils/            # apiError, apiResponse, asyncHandler, bcrypt, jwt, logger
│   │   └── validators/       # Zod schemas
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── pages/Home.tsx    # Main page: camera + diagnosis + PDF report
│   │   ├── components/
│   │   │   ├── camera/       # CameraMode, UploadMode, UploadCard, types
│   │   │   ├── webCam.tsx    # CameraComponent wrapper
│   │   │   ├── mapDieses.tsx # Disease treatment guide data (EN + NP)
│   │   │   └── ui/           # shadcn button, dialog
│   │   ├── lib/
│   │   │   ├── api/          # TanStack Query hooks (processImage, sentEmail, audio)
│   │   │   ├── plantClasses.ts # Frontend class label map (EN + NP + healthy flag)
│   │   │   └── query-client.ts
│   │   ├── routes/index.tsx
│   │   └── app/providers.tsx
│   └── package.json
```

---

## Disease Treatment Guide

The frontend contains a built-in treatment guide (`mapDieses.tsx`) for each detectable disease, covering:

- **Immediate actions** — steps to take right away (EN + नेपाली)
- **Long-term prevention** — cultural and agronomic measures (EN + नेपाली)
- **Recommended chemicals** — chemical name + dose per ropani (रोपनी)

Diseases covered: Bacterial Spot, Early Blight, Late Blight, Yellow Leaf Curl Virus, Bacterial Wilt, Downy Mildew, Powdery Mildew, Fruit Borer, Whitefly, Leaf Miner.

---

## Development Scripts

### Backend
```bash
pnpm run dev        # Run with tsx watch (hot-reload)
pnpm run build      # Compile TypeScript
```

### Frontend
```bash
pnpm run dev        # Vite dev server
pnpm run build      # Production build
pnpm run preview    # Preview production build
pnpm run lint       # ESLint
```

### AI Backend
```bash
uvicorn main:app --reload --port 8001   # Dev server
python debug_tts.py                      # Debug TTS output
```

---

## License

Hackathon project — no license specified.
