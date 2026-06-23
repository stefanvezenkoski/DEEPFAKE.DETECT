
# inference.py - Копирај го ова во твојата апликација
import torch
import torch.nn as nn
import timm
import numpy as np
import albumentations as A
from albumentations.pytorch import ToTensorV2
from PIL import Image


class AIDetector(nn.Module):
    def __init__(self, model_name, dropout=0.3):
        super().__init__()
        self.backbone = timm.create_model(model_name, pretrained=False, num_classes=0)
        in_features = self.backbone.num_features
        self.head = nn.Sequential(
            nn.Dropout(dropout),
            nn.Linear(in_features, 256),
            nn.ReLU(),
            nn.Dropout(dropout / 2),
            nn.Linear(256, 1)
        )

    def forward(self, x):
        return self.head(self.backbone(x)).squeeze(1)


def load_model(path, device='cpu'):
    ckpt = torch.load(path, map_location=device)
    model = AIDetector(ckpt['model_name'])
    model.load_state_dict(ckpt['model_state_dict'])
    model.to(device).eval()
    return model, ckpt


def predict(model, ckpt, image, device='cpu'):
    """
    image: патека до слика (str) или PIL Image
    Враќа: {'label': 'AI' или 'REAL', 'confidence': float, 'ai_prob': float}
    """
    transform = A.Compose([
        A.Resize(ckpt['img_size'], ckpt['img_size']),
        A.Normalize(mean=ckpt['norm_mean'], std=ckpt['norm_std']),
        ToTensorV2(),
    ])

    if isinstance(image, str):
        image = Image.open(image).convert('RGB')

    img = np.array(image)
    tensor = transform(image=img)['image'].unsqueeze(0).to(device)

    with torch.no_grad():
        prob = torch.sigmoid(model(tensor)).item()

    is_ai = prob >= ckpt['threshold']
    return {
        'label':      'AI' if is_ai else 'REAL',
        'confidence': prob if is_ai else 1 - prob,
        'ai_prob':    prob
    }


# === Употреба ===
# model, ckpt = load_model('ai_detector_production.pth')
# result = predict(model, ckpt, 'test.jpg')
# print(result)  →  {'label': 'AI', 'confidence': 0.94, 'ai_prob': 0.94}
