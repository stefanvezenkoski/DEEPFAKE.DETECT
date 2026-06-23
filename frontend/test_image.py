import onnxruntime as ort
import numpy as np
from PIL import Image

# Load the model
session = ort.InferenceSession("/Users/stefanvezenkoski/Desktop/dpns_project/frontend/public/model/model.onnx")

def preprocess(img_path):
    img = Image.open(img_path).convert('RGB')
    img = img.resize((224, 224))
    img_data = np.array(img).astype(np.float32)
    # HWC to CHW
    img_data = np.transpose(img_data, (2, 0, 1))
    # Normalize
    mean = np.array([0.485, 0.456, 0.406]).reshape(3, 1, 1)
    std = np.array([0.229, 0.224, 0.225]).reshape(3, 1, 1)
    img_data = (img_data / 255.0 - mean) / std
    return np.expand_dims(img_data, axis=0)

# Check if there are any sample images or just create a random image to test the function
print("Ready")
