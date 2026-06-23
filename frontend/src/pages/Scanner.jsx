import React, { useState, useRef, useEffect } from 'react';
import { UploadCloud } from 'lucide-react';
import * as ort from 'onnxruntime-web';
import { processImageForONNX } from '../utils/imageProcess';
import '../ScannerHUD.css';

// Configure ONNX Runtime WebAssembly path to load wasm files from CDN
ort.env.wasm.wasmPaths = 'https://cdn.jsdelivr.net/npm/onnxruntime-web@1.26.0/dist/';

// ─── MODEL PATHS ─────────────────────────────────────────────────────────────
// Both files must be inside your project's /public/model/ folder:
//   public/model/face_detector.onnx
//   public/model/face_detector_onnx.data   ← required external weights!
//   public/model/deepfake_detector.onnx
const FACE_DETECTOR_PATH = '/model/face_detector.onnx';
const DEEPFAKE_DETECTOR_PATH = '/model/ai_detector.onnx';

// ─── THRESHOLD ───────────────────────────────────────────────────────────────
// face_detector outputs a single raw logit; sigmoid(logit) > this = face found
const FACE_CONFIDENCE_THRESHOLD = 0.5;

export default function Scanner() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanPhase, setScanPhase] = useState('');
  const [result, setResult] = useState(null); // { isAI: boolean, confidence: number } | { noFace: true }
  const [dragActive, setDragActive] = useState(false);
  const [radarValues, setRadarValues] = useState([82, 45, 91]);
  const [graphPath, setGraphPath] = useState("M0,80 Q50,10 100,50 T200,20");
  const [complexGraph, setComplexGraph] = useState({ path1: "M0,50 L200,50", path2: "M0,50 L200,50", path3: "M0,50 L200,50" });
  const [resonanceValue, setResonanceValue] = useState("00.00");
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (isScanning) {
      const phases = [
        "DETECTING FACE...",
        "EXTRACTING FEATURES...",
        "ANALYZING NOISE PATTERNS...",
        "RUNNING MOBILENET_V2 CNN...",
        "VALIDATING AUTHENTICITY..."
      ];
      let i = 0;
      setScanPhase(phases[0]);

      const phaseInterval = setInterval(() => {
        i++;
        if (i < phases.length) setScanPhase(phases[i]);
      }, 900);

      const chaoticInterval = setInterval(() => {
        setRadarValues([
          Math.floor(Math.random() * 100),
          Math.floor(Math.random() * 100),
          Math.floor(Math.random() * 100)
        ]);

        const y1 = Math.floor(Math.random() * 100);
        const y2 = Math.floor(Math.random() * 100);
        const y3 = Math.floor(Math.random() * 100);
        const y4 = Math.floor(Math.random() * 100);
        setGraphPath(`M0,${y1} Q50,${y2} 100,${y3} T200,${y4}`);

        const cy = () => Math.floor(Math.random() * 100);
        setComplexGraph({
          path1: `M0,${cy()} Q40,${cy()} 80,${cy()} T120,${cy()} T160,${cy()} T200,${cy()}`,
          path2: `M0,${cy()} Q40,${cy()} 80,${cy()} T120,${cy()} T160,${cy()} T200,${cy()}`,
          path3: `M0,${cy()} Q40,${cy()} 80,${cy()} T120,${cy()} T160,${cy()} T200,${cy()}`,
        });

        setResonanceValue((Math.random() * 100).toFixed(2));
      }, 400);

      return () => {
        clearInterval(phaseInterval);
        clearInterval(chaoticInterval);
      };
    } else {
      setScanPhase('');
    }
  }, [isScanning]);

  const nnLogs = [
    "torch.nn.Conv2d(3, 32, kernel_size=(3,3), stride=(2,2))",
    "Forward pass: MobileNetV2(Features)",
    "BatchNorm2d(32, eps=1e-05, momentum=0.1)",
    "ReLU6(inplace=True)",
    "InvertedResidual(stride=1) => Expansion ratio: 1",
    "Depthwise Conv2d: evaluating high-frequency noise...",
    "Extracting GAN artifacts from latent space...",
    "Pooling layer (AvgPool2d) dimensionality reduction",
    "Linear(in_features=1280, out_features=2, bias=True)",
    "Softmax output generation...",
    "Computing classification probabilities...",
    "Gradient map analysis: anomaly detected",
    "Cross-referencing training dataset embeddings",
    "Checking perceptual hashes...",
    "Executing anomaly boundary detection..."
  ];

  const fakeLogs = Array.from({ length: 25 }).map((_, i) => `[CNN_L${i + 1}] ${nnLogs[i % nnLogs.length]} - [${Math.random().toFixed(4)}]`);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file) => {
    if (!file.type.match('image.*')) {
      alert('Please upload an image file (jpeg, png, etc).');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      setSelectedImage(e.target.result);
      setResult(null);
    };
    reader.readAsDataURL(file);
  };

  // ─── SIGMOID HELPER ────────────────────────────────────────────────────────
  // face_detector outputs a raw logit [1,1] — no sigmoid in the graph.
  // We must apply it manually to get a 0–1 probability.
  const sigmoid = (x) => 1 / (1 + Math.exp(-x));

  // ─── TWO-STAGE INFERENCE ───────────────────────────────────────────────────
  const runScan = async () => {
    if (!selectedImage) return;

    setIsScanning(true);
    setResult(null);

    try {
      const scanStartTime = Date.now();

      // Preprocess image once — both models use [1, 3, 224, 224] float32
      const tensorData = await processImageForONNX(selectedImage);
      const tensor = new ort.Tensor('float32', tensorData, [1, 3, 224, 224]);

      // ── STAGE 1: Face Detection ─────────────────────────────────────────────
      // face_detector.onnx: ViT architecture, output shape [1, 1], raw logit
      // Apply sigmoid → probability. > 0.5 means face detected.
      //
      // NOTE: face_detector_onnx.data must be in the same /public/model/ folder.
      // ONNX Runtime Web will fetch it automatically by looking for
      // <model_name>.data next to the .onnx file.
      const faceSession = await ort.InferenceSession.create(FACE_DETECTOR_PATH, {
        executionProviders: ['wasm'],
        externalData: [
          {
            path: 'face_detector.onnx.data',
            data: '/model/face_detector.onnx.data'
          }
        ]
      });

      const faceResult = await faceSession.run({ input: tensor });
      const faceLogit = faceResult.output.data[0];   // single raw logit
      const faceProb = sigmoid(faceLogit);            // sigmoid → probability

      console.log(`[Face Detector] logit=${faceLogit.toFixed(4)}, prob=${faceProb.toFixed(4)}`);

      let noFaceWarning = false;
      if (faceProb < FACE_CONFIDENCE_THRESHOLD) {
        console.warn("Low face confidence, but proceeding anyway to allow deepfake check.");
        noFaceWarning = true;
      }

      // STAGE 2: Deepfake Detection (EfficientNet-B3 model)
      // ai_detector.onnx: output shape [1] raw logit
      // Apply sigmoid to get probability of AI.
      const deepfakeSession = await ort.InferenceSession.create(DEEPFAKE_DETECTOR_PATH, {
        executionProviders: ['wasm'],
        externalData: [
          {
            path: 'ai_detector.onnx.data',
            data: '/model/ai_detector.onnx.data'
          }
        ]
      });

      const deepfakeResult = await deepfakeSession.run({ input: tensor });
      const outputData = deepfakeResult.output.data;

      const logitAI = outputData[0];
      const probAI = sigmoid(logitAI);

      console.log(`[Deepfake Detector] logit=${logitAI.toFixed(4)}, probAI=${probAI.toFixed(4)}`);

      const isAI = probAI >= 0.5;
      const confidence = (isAI ? probAI : 1 - probAI) * 100;

      // Ensure minimum 4.5s animation for effect
      const elapsed = Date.now() - scanStartTime;
      if (elapsed < 4500) await new Promise(r => setTimeout(r, 4500 - elapsed));

      setResult({
        isAI,
        confidence: confidence.toFixed(1),
        faceProb: (faceProb * 100).toFixed(1),
        noFaceWarning,
      });

    } catch (error) {
      console.error("Error during scanning:", error);
      alert(`Failed to scan: ${error.message}\n\nMake sure model files are in /public/model/:\n• face_detector.onnx\n• face_detector_onnx.data\n• ai_detector.onnx`);
    } finally {
      setIsScanning(false);
    }
  };

  const resetScanner = () => {
    setSelectedImage(null);
    setResult(null);
    setIsScanning(false);
  };

  return (
    <div className="hud-theme">
      <dotlottie-wc
        className="hud-background-lottie left"
        src="https://lottie.host/a71d961b-82c9-40c6-8e4e-b986a14f6708/K48qAJHyRA.lottie"
        autoplay
        loop
      ></dotlottie-wc>
      <dotlottie-wc
        className="hud-background-lottie right"
        src="https://lottie.host/a71d961b-82c9-40c6-8e4e-b986a14f6708/K48qAJHyRA.lottie"
        autoplay
        loop
      ></dotlottie-wc>

      <div className={`hud-container ${isScanning ? 'scanning-active' : ''}`}>

        {/* Left Panel */}
        <div className="hud-left hud-panel">
          <div className="hud-title">System Logs</div>
          <div className="hud-code-block" style={{ height: '220px' }}>
            <div className="hud-code-content">
              {fakeLogs.map((log, idx) => (
                <div key={idx} style={{ marginBottom: '4px' }}>{log}</div>
              ))}
            </div>
          </div>

          <div className="hud-title" style={{ marginTop: '20px' }}>Frequency Spectrum</div>
          <div className="hud-detailed-graph">
            <svg width="100%" height="100%" viewBox="0 0 200 100" preserveAspectRatio="none">
              <defs>
                <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(0, 255, 255, 0.1)" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
              <text x="2" y="10" fontSize="8" fill="rgba(0,255,255,0.5)">1.0</text>
              <text x="2" y="52" fontSize="8" fill="rgba(0,255,255,0.5)">0.5</text>
              <text x="2" y="98" fontSize="8" fill="rgba(0,255,255,0.5)">0.0</text>
              <path className="hud-complex-path path-cyan" d={complexGraph.path1} />
              <path className="hud-complex-path path-pink" d={complexGraph.path2} />
              <path className="hud-complex-path path-yellow" d={complexGraph.path3} />
            </svg>
          </div>
        </div>

        {/* Center Panel */}
        <div className="hud-center">
          {!selectedImage ? (
            <div
              className={`hud-dropzone ${dragActive ? 'active' : ''}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleChange}
                accept="image/*"
                style={{ display: 'none' }}
              />
              <dotlottie-wc
                src="https://lottie.host/40f3b932-b696-4f7b-8fd3-1e682aa6215a/vsQd9zK8yQ.lottie"
                style={{ width: '180px', height: '180px', marginBottom: '16px' }}
                autoplay
                loop
              ></dotlottie-wc>
              <p>INITIALIZE UPLOAD SEQUENCE</p>
              <span style={{ fontSize: '0.8rem', opacity: 0.6 }}>DRAG & DROP OR CLICK</span>
            </div>
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div className="hud-camera" style={{ flex: 1, minHeight: 0, width: '100%' }}>
                <img src={selectedImage} alt="To scan" className="hud-image-preview" />

                {isScanning && (
                  <>
                    <div className="hud-dual-lasers">
                      <div className="hud-laser"></div>
                      <div className="hud-laser"></div>
                    </div>
                    <div className="hud-neural-status">
                      {scanPhase}
                    </div>
                  </>
                )}

                {result && !isScanning && (
                  <div className="hud-result-overlay">
                      <div className={`hud-result-box ${result.isAI ? 'ai' : 'real'}`}>
                        <h2 style={{ fontSize: '2rem', marginBottom: '10px' }}>
                          {result.isAI ? 'SYNTHETIC CONTENT DETECTED' : 'AUTHENTIC MEDIA VERIFIED'}
                        </h2>
                        <p style={{ fontSize: '1.2rem', opacity: 0.8, marginBottom: '4px' }}>
                          CONFIDENCE SCORE: {result.confidence}%
                        </p>
                        <p style={{ fontSize: '0.85rem', opacity: 0.6, marginBottom: '20px' }}>
                          Анализирано со: ai_detector.onnx
                        </p>
                        <button className="hud-btn" onClick={resetScanner}>INITIALIZE NEW SCAN</button>
                      </div>
                  </div>
                )}
              </div>

              {!result && !isScanning && (
                <div style={{ display: 'flex', gap: '16px', marginTop: '20px' }}>
                  <button className="hud-btn" onClick={runScan}>EXECUTE ANALYSIS</button>
                  <button className="hud-btn" onClick={resetScanner} style={{ opacity: 0.7 }}>ABORT</button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Panel */}
        <div className="hud-right hud-panel">
          <div className="hud-title">Deviation Matrix</div>
          <div className="hud-radar-container">
            <div className="hud-radar">{radarValues[0]}%</div>
            <div className="hud-radar">{radarValues[1]}%</div>
            <div className="hud-radar">{radarValues[2]}%</div>
          </div>
          <div className="hud-title" style={{ marginTop: '20px', color: '#ff3366', borderColor: '#ff3366' }}>Resonance Flux</div>
          <div style={{ fontSize: '2.5rem', color: '#ff3366', fontFamily: 'monospace', textAlign: 'center', textShadow: '0 0 10px #ff3366' }}>
            {resonanceValue}<span style={{ fontSize: '1rem' }}> HZ</span>
          </div>
          <div style={{ marginTop: 'auto', fontSize: '0.7rem', color: 'var(--hud-text-dim)', textAlign: 'center' }}>
            SYSTEM OPTIMIZED FOR M-SERIES NEURAL ENGINE
          </div>
        </div>

        {/* Bottom Panel */}
        <div className="hud-bottom hud-panel">
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <span style={{ color: 'var(--hud-accent)', fontSize: '20px', cursor: 'pointer' }}>▶</span>
            <div style={{ width: '300px', height: '4px', background: 'rgba(0,255,255,0.2)', position: 'relative' }}>
              <div style={{ width: isScanning ? '100%' : '10%', height: '100%', background: 'var(--hud-accent)', transition: isScanning ? 'width 4.5s linear' : 'width 0.3s' }}></div>
            </div>
          </div>
          <div style={{ fontFamily: 'monospace', color: 'var(--hud-text-dim)', fontSize: '0.9rem' }}>
            T+ 00:00:41:48
          </div>
        </div>

      </div>
    </div>
  );
}