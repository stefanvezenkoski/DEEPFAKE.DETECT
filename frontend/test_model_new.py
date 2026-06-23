import onnxruntime as ort
import numpy as np

# Load the model
session = ort.InferenceSession("/Users/stefanvezenkoski/Desktop/dpns_project/frontend/public/model/model.onnx")

# Create a random input tensor
dummy_input_1 = np.random.randn(1, 3, 224, 224).astype(np.float32)
out1 = session.run(None, {'input': dummy_input_1})[0]

print("Random input output:", out1)
