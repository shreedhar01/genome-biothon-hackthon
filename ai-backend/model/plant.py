import torch
import torch.nn as nn
from transformers import ViTModel
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "..", "models", "best_model.pth")

NUM_CLASSES = 16

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


def load_model() -> ViTClassifier:
    m = ViTClassifier(NUM_CLASSES)
    state_dict = torch.load(MODEL_PATH, map_location="cpu")
    clean_state_dict = {
        k: v for k, v in state_dict.items()
        if "total_ops" not in k
        and "total_params" not in k
        and "intermediate_act_fn" not in k
    }
    m.load_state_dict(clean_state_dict, strict=False)
    m.eval()
    return m


# Load once at import time
model = load_model()