from fastapi import APIRouter, HTTPException, UploadFile, File
from torchvision import transforms
from PIL import Image
import torch
import io
from model.plant import model, CLASS_LABELS
import cv2
import numpy as np
from PIL import Image


router = APIRouter()

transform = transforms.Compose([
    transforms.RandomResizedCrop(224, scale=(0.6, 1.0)),
    transforms.RandomHorizontalFlip(),
    transforms.RandomVerticalFlip(),
    transforms.RandomRotation(25),
    transforms.ColorJitter(brightness=0.3, contrast=0.3, saturation=0.3, hue=0.05),
    transforms.RandomGrayscale(p=0.1),
    transforms.GaussianBlur(kernel_size=3, sigma=(0.1, 2.0)),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225]),
])



def remove_background_leaf(pil_img):
    """
    Removes background by keeping the largest green-ish/leaf region.
    Returns a PIL image with background set to black.
    """
    img = np.array(pil_img.convert("RGB"))
    hsv = cv2.cvtColor(img, cv2.COLOR_RGB2HSV)

    # Green-ish mask (tune if needed)
    lower = np.array([25, 30, 30])
    upper = np.array([95, 255, 255])
    mask = cv2.inRange(hsv, lower, upper)

    # Clean mask
    kernel = np.ones((7, 7), np.uint8)
    mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, kernel, iterations=2)
    mask = cv2.morphologyEx(mask, cv2.MORPH_OPEN, kernel, iterations=1)

    # Keep the largest connected component (main leaf)
    num_labels, labels, stats, _ = cv2.connectedComponentsWithStats(mask, connectivity=8)
    if num_labels > 1:
        largest = 1 + np.argmax(stats[1:, cv2.CC_STAT_AREA])
        mask = (labels == largest).astype(np.uint8) * 255

    # Apply mask: background -> black
    out = cv2.bitwise_and(img, img, mask=mask)

    return Image.fromarray(out)


@router.post("/predict")
async def predict(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        image = Image.open(io.BytesIO(contents)).convert("RGB")
        rm_image = remove_background_leaf(image)
        input_tensor = transform(rm_image).unsqueeze(0)

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