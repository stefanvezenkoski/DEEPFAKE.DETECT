import React, { useState, useEffect, useRef } from 'react';
import { Shield, Cpu, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

// Custom hook for typewriter effect
function useTypewriter(text, speed = 20, delay = 0) {
  const [displayedText, setDisplayedText] = useState('');
  const [started, setStarted] = useState(false);

  useEffect(() => {
    let timeout;
    if (delay > 0 && !started) {
      timeout = setTimeout(() => setStarted(true), delay);
      return () => clearTimeout(timeout);
    }
    setStarted(true);
  }, [delay, started]);

  useEffect(() => {
    if (!started) return;
    if (displayedText.length < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(text.slice(0, displayedText.length + 1));
      }, speed);
      return () => clearTimeout(timeout);
    }
  }, [displayedText, text, speed, started]);

  return displayedText;
}

export default function Home() {
  const timelineRef = useRef(null);
  const [timelineVisible, setTimelineVisible] = useState(false);

  // Inject Lottie Web Component Script
  useEffect(() => {
    if (!document.getElementById('lottie-script')) {
      const script = document.createElement('script');
      script.id = 'lottie-script';
      script.src = "https://unpkg.com/@lottiefiles/dotlottie-wc@0.9.14/dist/dotlottie-wc.js";
      script.type = "module";
      document.body.appendChild(script);
    }
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setTimelineVisible(true);
      },
      { threshold: 0.2 }
    );
    if (timelineRef.current) observer.observe(timelineRef.current);
    return () => observer.disconnect();
  }, []);

  const titleText = "DEEPFAKE.DETECT";
  const typedTitle = useTypewriter(titleText, 40, 300);

  const text1 = "As Artificial Intelligence rapidly advances, it's becoming increasingly difficult to distinguish between authentic imagery and AI-generated fabrications. Our algorithm protects reality.";
  const delay1 = 300 + (titleText.length * 40) + 400;
  const typedText1 = useTypewriter(text1, 15, delay1);

  const text2 = "We are entering an era where seeing is no longer believing. Deepfakes pose significant risks to truth and digital identity. Our mission is to restore trust in digital media.";
  const delay2 = delay1 + (text1.length * 15) + 600;
  const typedText2 = useTypewriter(text2, 15, delay2);

  return (
    <div className="animate-fade-in" style={{ backgroundColor: '#050a15', color: '#e2e8f0' }}>
      <section
        style={{
          position: 'relative',
          minHeight: '90vh',
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden',
          padding: '80px 0'
        }}
      >
        {/* Background Video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: -2
          }}
        >
          <source src="/indexhtml.mp4" type="video/mp4" />
        </video>

        {/* Dark Sci-Fi Overlay with Blur */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(2, 6, 19, 0.75)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            zIndex: -1
          }}
        ></div>

        <div className="container" style={{ position: 'relative', zIndex: 1, maxWidth: '1000px', margin: '0 auto', textAlign: 'center', paddingTop: '20px' }}>
          <h1 style={{ fontFamily: "'Oswald', sans-serif", fontSize: '5rem', marginBottom: '30px', color: '#fff', lineHeight: '1.1', textTransform: 'uppercase', letterSpacing: '-1px' }}>
            Welcome to <br />
            <span className="cyber-title-box" style={{
              color: '#ffffff',
              padding: '0px 32px',
              display: 'inline-block',
              marginTop: '15px',
              borderRadius: '12px',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 0 35px rgba(0, 240, 255, 0.3)'
            }}>
              {typedTitle}
            </span>
            {typedTitle.length < titleText.length && <span className="cursor-blink">|</span>}
          </h1>

          <div style={{ fontSize: '1.4rem', color: '#cbd5e1', minHeight: '80px', fontWeight: '300', lineHeight: '1.7', maxWidth: '800px', margin: '0 auto 40px auto' }}>
            {typedText1}
            {typedTitle.length === titleText.length && typedText1.length < text1.length && <span className="cursor-blink">|</span>}
          </div>

          <div style={{ opacity: typedText1.length === text1.length ? 1 : 0, transition: 'opacity 0.8s ease-in-out' }}>
            <h2 style={{ fontFamily: "'Oswald', sans-serif", fontSize: '3rem', color: '#00f0ff', marginTop: '20px', marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '-0.5px', textShadow: '0 0 10px rgba(0,240,255,0.3)' }}>
              Why it matters?
            </h2>
            <div style={{ fontSize: '1.4rem', color: '#cbd5e1', minHeight: '80px', fontWeight: '300', lineHeight: '1.7', maxWidth: '800px', margin: '0 auto' }}>
              {typedText2}
              {typedText1.length === text1.length && typedText2.length < text2.length && <span className="cursor-blink">|</span>}
            </div>

            <div style={{ marginTop: '50px' }}>
              <Link to="/scanner" style={{ 
                padding: '18px 50px', 
                fontSize: '1.3rem', 
                borderRadius: '50px', 
                textTransform: 'uppercase', 
                letterSpacing: '1.5px', 
                fontWeight: '700', 
                boxShadow: '0 0 20px rgba(0, 240, 255, 0.4)', 
                backgroundColor: '#00f0ff',
                color: '#050a15',
                transition: 'all 0.3s ease',
                textDecoration: 'none',
                display: 'inline-block'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 0 35px rgba(0, 240, 255, 0.8)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 240, 255, 0.4)';
              }}
              >
                Initialize Scanner
              </Link>
            </div>
          </div>
        </div>
      </section>
 
      {/* Samples Section */}
      <section style={{ backgroundColor: '#030712', padding: '60px 20px', borderTop: '1px solid rgba(0, 240, 255, 0.1)', borderBottom: '1px solid rgba(0, 240, 255, 0.1)' }}>
        <div className="container" style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{
            position: 'relative',
            borderRadius: '24px',
            overflow: 'hidden',
            border: '2px solid rgba(0, 240, 255, 0.2)',
            boxShadow: '0 0 45px rgba(0, 240, 255, 0.15)',
            background: 'rgba(5, 10, 21, 0.5)',
            padding: '12px',
            transition: 'border-color 0.3s ease, box-shadow 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'rgba(0, 240, 255, 0.5)';
            e.currentTarget.style.boxShadow = '0 0 55px rgba(0, 240, 255, 0.25)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'rgba(0, 240, 255, 0.2)';
            e.currentTarget.style.boxShadow = '0 0 45px rgba(0, 240, 255, 0.15)';
          }}
          >
            <img 
              src="/samples.jpg" 
              alt="Deepfake Detection Samples" 
              style={{
                width: '100%',
                borderRadius: '16px',
                display: 'block',
                filter: 'brightness(0.95) contrast(1.05)',
                transition: 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.01)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1.0)'}
            />
          </div>
        </div>
      </section>

      <section style={{ backgroundColor: '#050a15', color: '#cbd5e1', padding: '120px 20px', position: 'relative', overflow: 'hidden', borderTop: '1px solid rgba(0, 240, 255, 0.1)' }}>

        {/* Floating Lottie Left */}
        <div style={{ position: 'absolute', left: '-100px', top: '10%', opacity: 0.1, zIndex: 0, pointerEvents: 'none' }}>
          <dotlottie-wc
            src="https://lottie.host/a71d961b-82c9-40c6-8e4e-b986a14f6708/K48qAJHyRA.lottie"
            style={{ width: '500px', height: '500px' }}
            autoplay
            loop
          ></dotlottie-wc>
        </div>

        {/* Floating Lottie Right */}
        <div style={{ position: 'absolute', right: '-100px', bottom: '10%', opacity: 0.1, zIndex: 0, transform: 'scaleX(-1)', pointerEvents: 'none' }}>
          <dotlottie-wc
            src="https://lottie.host/a71d961b-82c9-40c6-8e4e-b986a14f6708/K48qAJHyRA.lottie"
            style={{ width: '500px', height: '500px' }}
            autoplay
            loop
          ></dotlottie-wc>
        </div>

        <div className="container" style={{ maxWidth: '850px', margin: '0 auto', position: 'relative', zIndex: 1 }} ref={timelineRef}>
          <div style={{ position: 'relative', paddingLeft: '60px' }}>

            {/* The Animated Line */}
            <div style={{
              position: 'absolute',
              left: '0',
              top: '0',
              width: '4px',
              backgroundColor: '#00f0ff',
              height: timelineVisible ? '100%' : '0%',
              transition: 'height 1.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
              boxShadow: '0 0 10px rgba(0, 240, 255, 0.5)'
            }}></div>

            {/* Item 1 */}
            <div style={{
              marginBottom: '100px',
              position: 'relative',
              opacity: timelineVisible ? 1 : 0,
              transform: timelineVisible ? 'translateX(0)' : 'translateX(50px)',
              transition: 'all 0.8s ease-out 0.4s'
            }}>
              <div className="timeline-pulse" style={{
                position: 'absolute', left: '-83px', top: '0',
                backgroundColor: '#050a15', padding: '14px', borderRadius: '50%',
                border: '4px solid #00f0ff', color: '#00f0ff',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <Cpu size={34} />
              </div>
              <h3 style={{ fontFamily: "'Oswald', sans-serif", fontSize: '2.8rem', marginBottom: '15px', color: '#fff', letterSpacing: '1px', textTransform: 'uppercase' }}>
                AI Evolution
              </h3>
              <p style={{ fontSize: '1.4rem', lineHeight: '1.8', color: '#94a3b8', fontWeight: '300' }}>
                Generative AI models like Midjourney and Stable Diffusion have crossed the uncanny valley,
                creating photorealistic images that deceive the human eye.
              </p>
            </div>

            {/* Item 2 */}
            <div style={{
              marginBottom: '100px',
              position: 'relative',
              opacity: timelineVisible ? 1 : 0,
              transform: timelineVisible ? 'translateX(0)' : 'translateX(50px)',
              transition: 'all 0.8s ease-out 0.7s'
            }}>
              <div className="timeline-pulse-pink" style={{
                position: 'absolute', left: '-83px', top: '0',
                backgroundColor: '#050a15', padding: '14px', borderRadius: '50%',
                border: '4px solid #ff3366', color: '#ff3366',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <Shield size={34} />
              </div>
              <h3 style={{ fontFamily: "'Oswald', sans-serif", fontSize: '2.8rem', marginBottom: '15px', color: '#fff', letterSpacing: '1px', textTransform: 'uppercase' }}>
                The Solution
              </h3>
              <p style={{ fontSize: '1.4rem', lineHeight: '1.8', color: '#94a3b8', fontWeight: '300' }}>
                By training neural networks on thousands of artifacts left by AI generation,
                our model can analyze pixels and noise patterns invisible to humans.
              </p>
            </div>

            {/* Item 3 */}
            <div style={{
              position: 'relative',
              opacity: timelineVisible ? 1 : 0,
              transform: timelineVisible ? 'translateX(0)' : 'translateX(50px)',
              transition: 'all 0.8s ease-out 1.0s'
            }}>
              <div className="timeline-pulse-green" style={{
                position: 'absolute', left: '-83px', top: '0',
                backgroundColor: '#050a15', padding: '14px', borderRadius: '50%',
                border: '4px solid #00ffcc', color: '#00ffcc',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <Eye size={34} />
              </div>
              <h3 style={{ fontFamily: "'Oswald', sans-serif", fontSize: '2.8rem', marginBottom: '15px', color: '#fff', letterSpacing: '1px', textTransform: 'uppercase' }}>
                Instant Verification
              </h3>
              <p style={{ fontSize: '1.4rem', lineHeight: '1.8', color: '#94a3b8', fontWeight: '300' }}>
                Upload any image directly from your device and our real-time scanning algorithm
                will evaluate its authenticity within seconds.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Architecture Section */}
      <section style={{ backgroundColor: '#020611', padding: '100px 20px', borderTop: '1px solid rgba(0, 240, 255, 0.1)' }}>
        <div className="container" style={{ maxWidth: '1100px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontFamily: "'Oswald', sans-serif", fontSize: '3.5rem', color: '#fff', marginBottom: '60px', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Under The Hood: <span style={{ color: '#00f0ff', textShadow: '0 0 10px rgba(0,240,255,0.2)' }}>Neural Architecture</span>
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', textAlign: 'left' }}>
            
            {/* Box 1 */}
            <div style={{
              background: 'rgba(5, 10, 21, 0.6)',
              border: '1px solid rgba(0, 240, 255, 0.2)',
              borderRadius: '20px',
              padding: '40px 30px',
              position: 'relative',
              overflow: 'hidden',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              transition: 'all 0.3s ease',
              cursor: 'default'
            }} onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-10px)';
              e.currentTarget.style.boxShadow = '0 10px 25px rgba(0, 240, 255, 0.15)';
              e.currentTarget.style.borderColor = 'rgba(0, 240, 255, 0.4)';
            }} onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.borderColor = 'rgba(0, 240, 255, 0.2)';
            }}>
              <div style={{ position: 'absolute', top: '-20px', right: '-20px', color: 'rgba(0, 240, 255, 0.03)' }}>
                <Shield size={150} />
              </div>
              <h3 style={{ color: '#00f0ff', fontSize: '1.6rem', marginBottom: '15px', fontWeight: '600', fontFamily: "'Oswald', sans-serif", textTransform: 'uppercase', textShadow: '0 0 8px rgba(0,240,255,0.3)' }}>1. Preprocessing</h3>
              <p style={{ color: '#94a3b8', fontSize: '1.1rem', lineHeight: '1.7', fontWeight: '300' }}>
                Uploaded images are securely intercepted locally in the browser and mathematically converted into 224x224 RGB tensors, standardizing the latent space for analysis.
              </p>
            </div>

            {/* Box 2 */}
            <div style={{
              background: 'rgba(5, 10, 21, 0.6)',
              border: '1px solid rgba(255, 51, 102, 0.2)',
              borderRadius: '20px',
              padding: '40px 30px',
              position: 'relative',
              overflow: 'hidden',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              transition: 'all 0.3s ease',
              cursor: 'default'
            }} onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-10px)';
              e.currentTarget.style.boxShadow = '0 10px 25px rgba(255, 51, 102, 0.15)';
              e.currentTarget.style.borderColor = 'rgba(255, 51, 102, 0.4)';
            }} onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.borderColor = 'rgba(255, 51, 102, 0.2)';
            }}>
              <div style={{ position: 'absolute', top: '-20px', right: '-20px', color: 'rgba(255, 51, 102, 0.03)' }}>
                <Cpu size={150} />
              </div>
              <h3 style={{ color: '#ff3366', fontSize: '1.6rem', marginBottom: '15px', fontWeight: '600', fontFamily: "'Oswald', sans-serif", textTransform: 'uppercase', textShadow: '0 0 8px rgba(255,51,102,0.3)' }}>2. MobileNetV2 CNN</h3>
              <p style={{ color: '#94a3b8', fontSize: '1.1rem', lineHeight: '1.7', fontWeight: '300' }}>
                Our custom-trained convolutional neural network extracts deep features, analyzing high-frequency noise and pixel anomalies left by generative AI engines.
              </p>
            </div>

            {/* Box 3 */}
            <div style={{
              background: 'rgba(5, 10, 21, 0.6)',
              border: '1px solid rgba(0, 255, 204, 0.2)',
              borderRadius: '20px',
              padding: '40px 30px',
              position: 'relative',
              overflow: 'hidden',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              transition: 'all 0.3s ease',
              cursor: 'default'
            }} onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-10px)';
              e.currentTarget.style.boxShadow = '0 10px 25px rgba(0, 255, 204, 0.15)';
              e.currentTarget.style.borderColor = 'rgba(0, 255, 204, 0.4)';
            }} onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.borderColor = 'rgba(0, 255, 204, 0.2)';
            }}>
              <div style={{ position: 'absolute', top: '-20px', right: '-20px', color: 'rgba(0, 255, 204, 0.03)' }}>
                <Eye size={150} />
              </div>
              <h3 style={{ color: '#00ffcc', fontSize: '1.6rem', marginBottom: '15px', fontWeight: '600', fontFamily: "'Oswald', sans-serif", textTransform: 'uppercase', textShadow: '0 0 8px rgba(0,255,204,0.3)' }}>3. ONNX Runtime</h3>
              <p style={{ color: '#94a3b8', fontSize: '1.1rem', lineHeight: '1.7', fontWeight: '300' }}>
                Inference runs entirely via WebAssembly (WASM). Your photos never leave your device, ensuring 100% privacy, zero latency, and military-grade isolation.
              </p>
            </div>

          </div>
        </div>
      </section>

      <style>{`
        .cursor-blink {
          animation: blink 1s step-end infinite;
          margin-left: 4px;
          color: #00f0ff;
          font-weight: bold;
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }

        .cyber-title-box {
          background: linear-gradient(135deg, #0056b3 0%, #00f0ff 100%);
          text-shadow: 0 0 10px rgba(0, 240, 255, 0.5);
          border: 2px solid rgba(0, 240, 255, 0.3);
          animation: slideDownBox 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) both;
        }

        @keyframes slideDownBox {
          0% { transform: translateY(-30px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }

        .timeline-pulse {
          animation: neonPulse 2s infinite alternate;
        }
        @keyframes neonPulse {
          0% { box-shadow: 0 0 5px rgba(0, 240, 255, 0.4); }
          100% { box-shadow: 0 0 20px rgba(0, 240, 255, 0.8), 0 0 40px rgba(0, 240, 255, 0.4); }
        }

        .timeline-pulse-pink {
          animation: neonPulsePink 2s infinite alternate;
        }
        @keyframes neonPulsePink {
          0% { box-shadow: 0 0 5px rgba(255, 51, 102, 0.4); }
          100% { box-shadow: 0 0 20px rgba(255, 51, 102, 0.8), 0 0 40px rgba(255, 51, 102, 0.4); }
        }

        .timeline-pulse-green {
          animation: neonPulseGreen 2s infinite alternate;
        }
        @keyframes neonPulseGreen {
          0% { box-shadow: 0 0 5px rgba(0, 255, 204, 0.4); }
          100% { box-shadow: 0 0 20px rgba(0, 255, 204, 0.8), 0 0 40px rgba(0, 255, 204, 0.4); }
        }
      `}</style>
    </div>
  );
}
