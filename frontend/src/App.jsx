import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import { SiteProvider, useSite } from './context/SiteContext';
import PropertiesListing from './pages/PropertiesListing';
import PropertyDetails from './pages/PropertyDetails';
import AboutUs from './pages/AboutUs';
import Team from './pages/Team';
import Projects from './pages/Projects';
import Testimonials from './pages/Testimonials';
import Contact from './pages/Contact';
import BookVisit from './pages/BookVisit';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPopup from './components/LoginPopup';
import Maintenance from './pages/Maintenance';
import { useState, useEffect } from 'react';
import { Database, Copy, Check, RefreshCw, WifiOff, ExternalLink } from 'lucide-react';

// Admin imports
import AdminLayout from './components/AdminLayout';
import AdminDashboard from './pages/AdminDashboard';
import AdminProperties from './pages/AdminProperties';
import AdminLeads from './pages/AdminLeads';
import AdminAgents from './pages/AdminAgents';
import AdminProjects from './pages/AdminProjects';
import AdminSettings from './pages/AdminSettings';

const DatabaseWarning = () => {
  const { dbError, checkConnection } = useSite();
  const [copied, setCopied] = useState(false);
  const [checking, setChecking] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  if (!dbError) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(dbError.ip);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCheck = async () => {
    setChecking(true);
    setStatusMessage('Checking connection...');
    const connected = await checkConnection();
    setChecking(false);
    if (connected) {
      setStatusMessage('Connected successfully!');
    } else {
      setStatusMessage('Still unable to connect. Please ensure the IP is whitelisted.');
      setTimeout(() => setStatusMessage(''), 4000);
    }
  };

  const isOffline = dbError.type === 'offline';

  return (
    <motion.div
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -50, opacity: 0 }}
      className="fixed top-4 left-4 right-4 md:left-1/2 md:right-auto md:-translate-x-1/2 z-[99999] md:w-[680px] bg-slate-950/90 backdrop-blur-xl border border-white/10 rounded-[2rem] shadow-2xl p-6 md:p-8 overflow-hidden text-white"
    >
      {/* Decorative gold gradient border at top */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-gold-500 to-transparent"></div>

      <div className="flex flex-col md:flex-row gap-6 items-start">
        {/* Animated Accent Icon */}
        <div className={`p-4 rounded-2xl bg-slate-900 border ${isOffline ? 'border-red-500/20 text-red-500' : 'border-gold-500/20 text-gold-500'} flex-shrink-0 animate-pulse`}>
          {isOffline ? <WifiOff size={28} /> : <Database size={28} />}
        </div>

        {/* Content */}
        <div className="flex-1 w-full text-left">
          <div className="flex items-center gap-3 mb-2">
            <span className={`text-[10px] font-black uppercase tracking-[0.2em] px-2.5 py-1 rounded-md ${isOffline ? 'bg-red-500/10 text-red-400 border border-red-500/10' : 'bg-amber-500/10 text-amber-400 border border-amber-500/10'}`}>
              {isOffline ? 'System Offline' : 'Atlas Whitelist Required'}
            </span>
            {statusMessage && (
              <span className="text-[10px] text-slate-400 animate-pulse">{statusMessage}</span>
            )}
          </div>

          <h4 className="text-lg font-serif font-bold text-white mb-2">
            {isOffline ? 'Backend Server is Not Running' : 'MongoDB Atlas Connection Failed'}
          </h4>

          <p className="text-slate-400 text-xs leading-relaxed mb-4">
            {isOffline
              ? 'The application is running in mock mode. Please start the backend API server locally to load production data.'
              : 'Your backend is active, but MongoDB is blocking connections from your current network location. You must add your public IP address to the Atlas security whitelist to restore live database connection.'
            }
          </p>

          {!isOffline && (
            <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-4 mb-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-left">
                <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Your Public IP Address</div>
                <div className="font-mono text-sm font-bold text-amber-300 tracking-wider">{dbError.ip}</div>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  onClick={handleCopy}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-slate-900 border border-white/10 hover:border-amber-500/30 hover:bg-slate-800 text-slate-200 px-4 py-2.5 rounded-xl text-xs font-bold transition-all"
                >
                  {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                  {copied ? 'Copied!' : 'Copy IP Address'}
                </button>
                <a
                  href="https://cloud.mongodb.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 text-slate-950 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-lg"
                >
                  Atlas Console <ExternalLink size={12} />
                </a>
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex items-center gap-4 flex-wrap">
            <button
              onClick={handleCheck}
              disabled={checking}
              className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-amber-400 hover:text-amber-300 transition-colors disabled:opacity-50"
            >
              <RefreshCw size={14} className={checking ? 'animate-spin' : ''} />
              Verify Connection
            </button>
            {isOffline && (
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                Run: <code className="bg-slate-900 px-2 py-1 rounded text-amber-400 font-mono">npm start</code> in backend
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const PublicLayout = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [showPopup, setShowPopup] = useState(false);
  const [prevAuth, setPrevAuth] = useState(isAuthenticated);
  const [showLogoutToast, setShowLogoutToast] = useState(false);

  useEffect(() => {
    // If they were just logged in and now they aren't (Logged Out)
    if (prevAuth && !isAuthenticated) {
      setShowLogoutToast(true);
      setTimeout(() => setShowLogoutToast(false), 5000);
      setShowPopup(true);
    }
    // If they are a new visitor (never were authenticated in this session)
    else if (!isAuthenticated && !showPopup) {
      const timer = setTimeout(() => {
        setShowPopup(true);
      }, 20000); // 20 seconds for new visitors
      return () => clearTimeout(timer);
    }
    // If they just logged in, hide the popup
    else if (isAuthenticated) {
      setShowPopup(false);
    }

    setPrevAuth(isAuthenticated);
  }, [isAuthenticated, prevAuth, showPopup]);

  return (
    <>
      <AnimatePresence>
        {showLogoutToast && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 20, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="fixed top-0 left-1/2 -translate-x-1/2 z-[10000] bg-slate-900 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border border-white/10"
          >
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-xs font-black uppercase tracking-widest">Successfully Logged Out</span>
          </motion.div>
        )}
      </AnimatePresence>

      <Navbar />
      <main className={showPopup ? 'blur-sm pointer-events-none' : ''}>
        {children}
      </main>
      <Footer />
      <LoginPopup
        isOpen={showPopup}
        onClose={() => { }} // Mandatory: cannot be closed
      />
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <SiteProvider>
        <AppContent />
      </SiteProvider>
    </AuthProvider>
  );
}

function AppContent() {
  const { siteData, loading } = useSite();
  const isMaintenance = siteData?.isMaintenanceMode;

  if (loading) {
    return (
      <div className="fixed inset-0 z-[99999] bg-slate-950 flex flex-col items-center justify-center">
        <div className="relative flex flex-col items-center gap-6">
          {/* Elegant gold pulse logo spinner */}
          <div className="relative w-24 h-24 flex items-center justify-center">
            {/* Pulsing glow ring */}
            <div className="absolute inset-0 rounded-full border-2 border-gold-500/20 animate-ping"></div>
            {/* Spinning accent border */}
            <div className="absolute inset-0 rounded-full border-2 border-t-gold-500 border-r-transparent border-b-transparent border-l-transparent animate-spin duration-1000"></div>
            {/* Inner Brand Logo */}
            <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center p-1 border border-white/5">
              <span className="text-gold-500 font-serif text-2xl font-black">B</span>
            </div>
          </div>
          <div className="text-center">
            <h2 className="text-white font-serif text-lg tracking-[0.2em] uppercase font-black">Bridl 360</h2>
            <p className="text-[9px] text-slate-500 tracking-[0.3em] uppercase mt-2 font-bold animate-pulse">Initializing Luxury Experience</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen bg-white">
        <AnimatePresence>
          <DatabaseWarning />
        </AnimatePresence>
        <Routes>
          {/* Admin Routes - Always accessible if logged in */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="properties" element={<AdminProperties />} />
            <Route path="projects" element={<AdminProjects />} />
            <Route path="leads" element={<AdminLeads />} />
            <Route path="agents" element={<AdminAgents />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="*" element={<div className="text-center p-8">Admin Section Under Construction</div>} />
          </Route>

          {/* Public Routes */}
          {isMaintenance ? (
            <>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="*" element={<Maintenance />} />
            </>
          ) : (
            <>
              <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
              <Route path="/properties" element={<PublicLayout><PropertiesListing /></PublicLayout>} />
              <Route path="/property/:id" element={<PublicLayout><PropertyDetails /></PublicLayout>} />
              <Route path="/about" element={<PublicLayout><AboutUs /></PublicLayout>} />
              <Route path="/team" element={<PublicLayout><Team /></PublicLayout>} />
              <Route path="/projects" element={<PublicLayout><Projects /></PublicLayout>} />
              <Route path="/testimonials" element={<PublicLayout><Testimonials /></PublicLayout>} />
              <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
              <Route path="/book-visit" element={<PublicLayout><BookVisit /></PublicLayout>} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="*" element={<div className="pt-32 text-center">Page Under Construction</div>} />
            </>
          )}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
