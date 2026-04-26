from fastapi import FastAPI, HTTPException, Request, UploadFile, File
from fastapi.responses import JSONResponse
import torch
import torch.nn as nn
from transformers import ViTModel
from torchvision import transforms
from PIL import Image
import io

app = FastAPI()

NUM_CLASSES = 16

# Map class index → (plant, condition)
CLASS_LABELS = {
    0:  ("Pepper", "Bacterial Spot"),
    1:  ("Pepper", "Healthy"),
    2:  ("Potato", "Early Blight"),
    3:  ("Potato", "Late Blight"),
    4:  ("Potato", "Healthy"),
    5:  ("Tomato", "Bacterial Spot"),
    6:  ("Tomato", "Early Blight"),
    7:  ("Tomato", "Late Blight"),
    8:  ("Tomato", "Leaf Mold"),
    9:  ("Tomato", "Septoria Leaf Spot"),
    10: ("Tomato", "Spider Mites"),
    11: ("Tomato", "Target Spot"),
    12: ("Tomato", "Yellow Leaf Curl Virus"),
    13: ("Tomato", "Mosaic Virus"),
    14: ("Tomato", "Healthy"),
    15: ("Tomato", "Powdery Mildew"),
}


class ViTClassifier(nn.Module):
    def __init__(self, num_classes):
        super().__init__()
        self.vit_model = ViTModel.from_pretrained("google/vit-base-patch16-224-in21k")
        self.classifier = nn.Sequential(
            nn.Dropout(p=0.2),
            nn.Linear(self.vit_model.config.hidden_size, num_classes),
        )

    def forward(self, pixel_values):
        outputs = self.vit_model(pixel_values=pixel_values)
        cls_output = outputs.last_hidden_state[:, 0, :]
        return self.classifier(cls_output)


# Load model
model = ViTClassifier(NUM_CLASSES)

state_dict = torch.load("./models/best_model.pth", map_location="cpu")

clean_state_dict = {
    k: v for k, v in state_dict.items()
    if "total_ops" not in k
    and "total_params" not in k
    and "intermediate_act_fn" not in k
}

model.load_state_dict(clean_state_dict, strict=False)
model.eval()

transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
])


@app.get("/")
def root():
    return {"message": "Plant disease model API is running"}


@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        image = Image.open(io.BytesIO(contents)).convert("RGB")
        input_tensor = transform(image).unsqueeze(0)

        with torch.no_grad():
            output = model(pixel_values=input_tensor)
            probabilities = torch.softmax(output, dim=1).squeeze()

        top3 = torch.topk(probabilities, k=3)

        results = []
        for confidence, class_idx in zip(top3.values.tolist(), top3.indices.tolist()):
            plant, condition = CLASS_LABELS.get(class_idx, ("Unknown", "Unknown"))
            results.append({
                "class_index": class_idx,
                "plant": plant,
                "condition": condition,
                "confidence": round(confidence, 4),
            })

        return results

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={"error": "Internal Server Error", "detail": str(exc)},
    )