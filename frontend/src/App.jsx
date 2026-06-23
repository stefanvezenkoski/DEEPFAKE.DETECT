import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Target } from 'lucide-react';
import './App.css';
import Home from './pages/Home';
import Scanner from './pages/Scanner';

function Navigation() {
  const location = useLocation();

  return (
    <nav className="navbar" style={{ 
      padding: '15px 0', 
      borderBottom: '1px solid rgba(0, 240, 255, 0.15)', 
      backgroundColor: 'rgba(5, 10, 21, 0.85)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1200px', margin: '0 auto', padding: '0 30px' }}>

        {/* LOGO */}
        <Link to="/" className="logo" style={{ display: 'flex', alignItems: 'center', gap: '15px', textDecoration: 'none' }}>
          <img
            src="/logo.png"
            alt="Deepfake Detect Logo"
            style={{ height: '60px', width: 'auto', filter: 'drop-shadow(0 0 8px rgba(0, 240, 255, 0.3))' }}
          />
          <span style={{ fontFamily: "'Oswald', sans-serif", fontSize: '1.8rem', color: '#fff', fontWeight: '600', letterSpacing: '0.5px' }}>
            DEEPFAKE.<span style={{ color: '#00f0ff', textShadow: '0 0 10px rgba(0, 240, 255, 0.5)' }}>DETECT</span>
          </span>
        </Link>

        {/* LINKS */}
        <div className="nav-links" style={{ display: 'flex', gap: '35px', alignItems: 'center' }}>
          <Link to="/" className="nav-link" style={{ textDecoration: 'none', color: location.pathname === '/' ? '#00f0ff' : '#a0aabf', fontWeight: '500', fontSize: '1.1rem', transition: 'color 0.3s', textShadow: location.pathname === '/' ? '0 0 8px rgba(0, 240, 255, 0.4)' : 'none' }}>Platform</Link>

          <Link to="/scanner" style={{ textDecoration: 'none', padding: '12px 28px', borderRadius: '50px', backgroundColor: '#00f0ff', color: '#050a15', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.95rem', boxShadow: '0 0 15px rgba(0, 240, 255, 0.4)', transition: 'all 0.2s ease', border: 'none' }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 0 25px rgba(0, 240, 255, 0.7)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 0 15px rgba(0, 240, 255, 0.4)';
            }}
          >
            Launch Scanner
          </Link>
        </div>
      </div>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <div className="app" style={{ backgroundColor: '#050a15', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navigation />
        <main className="main-content" style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/scanner" element={<Scanner />} />
          </Routes>
        </main>
        <footer className="footer" style={{
          backgroundColor: '#020611',
          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
          padding: '20px 0',
          color: '#808f9f',
          fontSize: '0.95rem'
        }}>
          <div className="container" style={{ display: 'flex', justifyContent: 'space-between', maxWidth: '1200px', margin: '0 auto', padding: '0 30px' }}>
            <p>&copy; {new Date().getFullYear()} Deepfake Detect. Project for Digital Image Processing course - FINKI.</p>
            <p>Developed by <span style={{ color: '#00f0ff', fontWeight: '500' }}>Stefan Vezenkoski</span></p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
