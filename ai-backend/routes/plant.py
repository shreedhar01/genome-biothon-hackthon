from fastapi import APIRouter, HTTPException, UploadFile, File
from torchvision import transforms
from PIL import Image
import torch
import io
from model.plant import model, CLASS_LABELS

router = APIRouter()

transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
])


@router.post("/predict")
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