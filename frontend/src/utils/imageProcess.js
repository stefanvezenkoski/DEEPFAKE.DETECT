export async function processImageForONNX(imageSrc) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = imageSrc;
    img.onload = () => {
      // Create offscreen canvas to resize image
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      // Target dimensions for MobileNetV2
      const targetWidth = 224;
      const targetHeight = 224;
      canvas.width = targetWidth;
      canvas.height = targetHeight;

      // Draw and scale image
      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
      const imageData = ctx.getImageData(0, 0, targetWidth, targetHeight).data;

      // Prepare Float32Array for ONNX (1 batch, 3 channels, 224 height, 224 width)
      const floatData = new Float32Array(1 * 3 * targetWidth * targetHeight);

      // ImageNet normalization values
      const mean = [0.485, 0.456, 0.406];
      const std = [0.229, 0.224, 0.225];

      // Convert HWC to CHW and normalize
      for (let i = 0; i < targetWidth * targetHeight; i++) {
        // Red channel
        floatData[i] = (imageData[i * 4] / 255.0 - mean[0]) / std[0];
        // Green channel
        floatData[i + targetWidth * targetHeight] = (imageData[i * 4 + 1] / 255.0 - mean[1]) / std[1];
        // Blue channel
        floatData[i + 2 * targetWidth * targetHeight] = (imageData[i * 4 + 2] / 255.0 - mean[2]) / std[2];
      }

      resolve(floatData);
    };
    img.onerror = (err) => reject(err);
  });
}
