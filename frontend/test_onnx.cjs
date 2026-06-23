const ort = require('onnxruntime-node');
const fs = require('fs');
const { createCanvas, loadImage } = require('canvas');

async function main() {
    const session = await ort.InferenceSession.create('/Users/stefanvezenkoski/Desktop/dpns_project/frontend/public/model/deepfake_detector1.onnx');
    
    const img = await loadImage('/Users/stefanvezenkoski/Desktop/dpns_project/frontend/public/samples.jpg');
    const canvas = createCanvas(224, 224);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, 224, 224);
    const imageData = ctx.getImageData(0, 0, 224, 224).data;
    
    const floatData = new Float32Array(1 * 3 * 224 * 224);
    const mean = [0.485, 0.456, 0.406];
    const std = [0.229, 0.224, 0.225];
    
    for (let i = 0; i < 224 * 224; i++) {
        floatData[i] = (imageData[i * 4] / 255.0 - mean[0]) / std[0];
        floatData[i + 224 * 224] = (imageData[i * 4 + 1] / 255.0 - mean[1]) / std[1];
        floatData[i + 2 * 224 * 224] = (imageData[i * 4 + 2] / 255.0 - mean[2]) / std[2];
    }
    
    const tensor = new ort.Tensor('float32', floatData, [1, 3, 224, 224]);
    const feeds = {};
    feeds[session.inputNames[0]] = tensor;
    
    const result = await session.run(feeds);
    console.log("samples.jpg:", result[session.outputNames[0]].data);
}
main();
