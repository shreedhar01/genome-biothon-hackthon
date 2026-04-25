from fastapi import FastAPI, HTTPException, Request, UploadFile, File
from fastapi.responses import JSONResponse
import torch
import torch.nn as nn
import torchvision.models as models
from torchvision import transforms
from PIL import Image
import io

app = FastAPI()

NUM_CLASSES = 38

# Build model with matching classifier structure
base_model = models.mobilenet_v2(weights=None)
base_model.classifier = nn.Sequential(
    nn.Dropout(p=0.2),
    nn.Sequential(
        nn.Dropout(p=0.2),
        nn.Linear(base_model.last_channel, NUM_CLASSES),
    )
)

state_dict = torch.load("./models/mobilenetv2_plant.pth", map_location="cpu")
base_model.load_state_dict(state_dict)
base_model.eval()
model = base_model

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
        input_tensor = transform(image).unsqueeze(0)  # (1, 3, 224, 224)

        with torch.no_grad():
            output = model(input_tensor)
            probabilities = torch.softmax(output, dim=1)
            confidence, predicted_class = torch.max(probabilities, dim=1)

        return {
            "predicted_class": predicted_class.item(),
            "confidence": round(confidence.item(), 4),
            "all_probabilities": probabilities.squeeze().tolist()
        }

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={"error": "Internal Server Error", "detail": str(exc)},
    )