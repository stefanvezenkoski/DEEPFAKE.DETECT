import onnxruntime as ort
import numpy as np

# Load the model
session = ort.InferenceSession("/Users/stefanvezenkoski/Desktop/dpns_project/frontend/public/model/model.onnx")

# Create a random input tensor (mimicking an image)
dummy_input_1 = np.random.randn(1, 3, 224, 224).astype(np.float32)
dummy_input_2 = np.ones((1, 3, 224, 224)).astype(np.float32)
dummy_input_3 = np.zeros((1, 3, 224, 224)).astype(np.float32)

out1 = session.run(None, {'input': dummy_input_1})[0]
out2 = session.run(None, {'input': dummy_input_2})[0]
out3 = session.run(None, {'input': dummy_input_3})[0]

print("Random input output:", out1)
print("Ones input output:", out2)
print("Zeros input output:", out3)
