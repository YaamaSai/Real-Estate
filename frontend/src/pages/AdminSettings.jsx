import React, { useState, useEffect, useRef } from 'react';
import { User, Save, CheckCircle, LogOut, AlertTriangle, RotateCcw, Download, Database, Lock, Unlock } from 'lucide-react';
import { useSite } from '../context/SiteContext';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from '../components/Logo';

const AdminSettings = () => {
  const {
    siteData,
    updateSiteSection,
    toggleMaintenanceMode,
    refreshProperties,
    refreshProjects,
    refreshLeads,
    refreshAgents
  } = useSite();

  const { user: authUser, logout } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [errorToast, setErrorToast] = useState(null);
  const isMaintenance = siteData?.isMaintenanceMode;

  const heroImageInputRef = useRef(null);

  const [tempSystemData, setTempSystemData] = useState({
    hero: { title: '', subtitle: '', image: '' },
    contact: { phone: '', email: '' }
  });

  // Synchronize local edit buffer with loaded siteData
  useEffect(() => {
    if (siteData) {
      setTempSystemData({
        hero: {
          title: siteData.hero?.title || '',
          subtitle: siteData.hero?.subtitle || '',
          image: siteData.hero?.image || '',
        },
        contact: {
          phone: siteData.contact?.phone || '',
          email: siteData.contact?.email || '',
        }
      });
    }
  }, [siteData]);

  const handleHeroImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleTempUpdate('hero', 'image', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTempUpdate = (section, field, value) => {
    setTempSystemData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    setErrorToast(null);
    try {
      // Push updates all at once as whole sections to prevent race conditions
      await updateSiteSection('hero', tempSystemData.hero);
      await updateSiteSection('contact', tempSystemData.contact);

      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (err) {
      console.error("Failed to save changes", err);
      const errMsg = err.response?.data?.message || err.message || "Failed to save configuration";
      setErrorToast(errMsg);
      setTimeout(() => setErrorToast(null), 5000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleRevertChanges = () => {
    if (siteData) {
      setTempSystemData({
        hero: {
          title: siteData.hero?.title || '',
          subtitle: siteData.hero?.subtitle || '',
          image: siteData.hero?.image || '',
        },
        contact: {
          phone: siteData.contact?.phone || '',
          email: siteData.contact?.email || '',
        }
      });
      if (heroImageInputRef.current) {
        heroImageInputRef.current.value = '';
      }
    }
  };

  // Useful utility action: Exports leads as JSON backup
  const handleExportLeads = () => {
    try {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(siteData.leads || [], null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `bridl360_leads_backup_${new Date().toISOString().split('T')[0]}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (err) {
      console.error(err);
      setErrorToast("Failed to export leads data");
      setTimeout(() => setErrorToast(null), 5000);
    }
  };

  // Useful utility action: Deep refreshes database assets from backend
  const handleDeepSync = async () => {
    setIsSaving(true);
    try {
      await Promise.all([
        refreshProperties(),
        refreshProjects(),
        refreshLeads(),
        refreshAgents()
      ]);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (err) {
      console.error(err);
      setErrorToast("Database sync failed");
      setTimeout(() => setErrorToast(null), 5000);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-20 px-4 sm:px-0">
      <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start mb-10 gap-6 text-center sm:text-left">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold font-heading text-slate-900 tracking-tight">Admin settings</h1>
          <p className="text-slate-500 mt-2 text-sm md:text-base">System dashboard control panel, quick utility actions and branding variables.</p>
        </div>
        <div className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold shadow-xl transition-all text-xs uppercase tracking-widest ${isSaving ? 'bg-gold-500 text-white animate-pulse' : 'bg-slate-900 text-white'}`}>
          {isSaving ? 'Saving Changes...' : 'System Synced'}
        </div>
      </div>

      {/* Main Settings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Left Side: Admin Profile & System Controls */}
        <div className="lg:col-span-5 space-y-8">

          {/* Admin Identity Card */}
          <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm flex flex-col items-center text-center">
            <div className="w-28 h-28 bg-slate-900 border-4 border-slate-800 rounded-2xl flex items-center justify-center mb-6 shrink-0 shadow-xl overflow-hidden p-1">
              <Logo imgClassName="h-24 w-auto object-contain" />
            </div>

            <h3 className="text-xl font-bold text-slate-800 tracking-tight mb-1">
              {authUser?.name || "Developer Admin"}
            </h3>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">
              {authUser?.role || "System Administrator"}
            </p>

            <div className="w-full bg-slate-50 rounded-2xl p-4 border border-slate-100/50 space-y-2 mb-8 text-left text-xs">
              <div>
                <span className="font-bold text-slate-400 uppercase tracking-wider block text-[9px]">Email Address</span>
                <span className="font-bold text-slate-700 block truncate">{authUser?.email || "dev@bridl360.com"}</span>
              </div>
              <div className="pt-2 border-t border-slate-200/40">
                <span className="font-bold text-slate-400 uppercase tracking-wider block text-[9px]">Contact Phone</span>
                <span className="font-bold text-slate-700 block">{authUser?.phone || "+91 99999 99999"}</span>
              </div>
            </div>

            <button
              onClick={logout}
              className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl bg-red-50 hover:bg-red-100 text-red-600 font-bold transition-all border border-transparent shadow-sm active:scale-95 cursor-pointer text-sm"
            >
              <LogOut size={16} />
              Logout Session
            </button>
          </div>

          {/* Quick Utility Operations (Useful Buttons Card) */}
          <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-800 tracking-tight">System Utility Controls</h3>
              <p className="text-slate-400 text-xs mt-1">Useful operational buttons to manage the database and live platform state.</p>
            </div>

            <div className="space-y-3">
              {/* Maintenance Toggle */}
              <button
                onClick={async () => {
                  setIsSaving(true);
                  await toggleMaintenanceMode();
                  setIsSaving(false);
                }}
                disabled={isSaving}
                className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl font-bold border transition-all active:scale-95 cursor-pointer text-xs uppercase tracking-widest ${isMaintenance
                    ? 'bg-green-50 hover:bg-green-100 text-green-700 border-green-200'
                    : 'bg-red-50 hover:bg-red-100 text-red-700 border-red-200'
                  }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  {isMaintenance ? <Unlock size={16} className="shrink-0" /> : <Lock size={16} className="shrink-0" />}
                  <span className="truncate">{isMaintenance ? 'Disable Maintenance' : 'Enable Maintenance'}</span>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-[8px] font-black tracking-widest shrink-0 ${isMaintenance ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                  }`}>
                  {isMaintenance ? 'Active' : 'Offline'}
                </span>
              </button>

              {/* Leads Export Button */}
              <button
                onClick={handleExportLeads}
                className="w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-bold bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 transition-all active:scale-95 cursor-pointer text-xs uppercase tracking-widest"
              >
                <Download size={16} className="text-gold-500 shrink-0" />
                <span>Export Active Leads</span>
              </button>

              {/* Database Sync Button */}
              <button
                onClick={handleDeepSync}
                disabled={isSaving}
                className="w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-bold bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 transition-all active:scale-95 cursor-pointer text-xs uppercase tracking-widest"
              >
                <Database size={16} className="text-gold-500 shrink-0" />
                <span>Deep Database Sync</span>
              </button>
            </div>
          </div>

        </div>

        {/* Right Side: Website Configuration Section */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-[2.5rem] border border-slate-100 p-10 shadow-sm space-y-10">

            {/* System Hero Section */}
            <section className="space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="text-xl font-bold text-slate-800 tracking-tight">Hero Section Settings</h3>
                <p className="text-slate-400 text-xs mt-1">Configure landing headers that are served dynamically from the database.</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Hero Main Title</label>
                  <input
                    type="text"
                    value={tempSystemData.hero?.title || ""}
                    onChange={(e) => handleTempUpdate('hero', 'title', e.target.value)}
                    placeholder="Enter main page heading..."
                    className="w-full px-5 py-4 border border-slate-200 rounded-2xl focus:border-gold-500 outline-none text-slate-800 font-medium text-sm transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Hero Subtitle Text</label>
                  <textarea
                    value={tempSystemData.hero?.subtitle || ""}
                    onChange={(e) => handleTempUpdate('hero', 'subtitle', e.target.value)}
                    placeholder="Enter subtitle description..."
                    rows={4}
                    className="w-full px-5 py-4 border border-slate-200 rounded-2xl focus:border-gold-500 outline-none text-slate-800 font-medium text-sm transition-all resize-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Hero Background Cover Image</label>
                  <div className="flex flex-col sm:flex-row gap-5 items-center bg-slate-50 p-5 rounded-2xl border border-slate-200 shadow-inner">
                    {tempSystemData.hero?.image ? (
                      <div className="relative w-full sm:w-44 aspect-video rounded-xl overflow-hidden border border-slate-350 bg-white shadow-sm shrink-0 group">
                        <img src={tempSystemData.hero.image} alt="Hero Cover" className="w-full h-full object-cover" />
                        <button 
                          type="button"
                          onClick={() => {
                            handleTempUpdate('hero', 'image', '');
                            if (heroImageInputRef.current) heroImageInputRef.current.value = '';
                          }}
                          className="absolute inset-0 bg-red-650/90 text-white flex items-center justify-center font-bold text-[10px] opacity-0 group-hover:opacity-100 transition-opacity gap-1"
                        >
                          Remove Cover
                        </button>
                      </div>
                    ) : (
                      <div 
                        onClick={() => heroImageInputRef.current.click()}
                        className="w-full sm:w-44 aspect-video rounded-xl border-2 border-dashed border-slate-300 hover:border-gold-400 bg-white hover:bg-gold-50/20 transition-all flex flex-col items-center justify-center shrink-0 cursor-pointer gap-1"
                      >
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center px-3">Upload Banner</span>
                      </div>
                    )}
                    <div className="text-left w-full sm:w-auto">
                      <p className="text-xs font-black text-slate-800 uppercase tracking-wide">Dynamic Cover Banner</p>
                      <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                        Recommended: 1920x1080px high resolution image. Max size: 2MB. Fits light & dark overlays.
                      </p>
                      <button 
                        type="button" 
                        onClick={() => heroImageInputRef.current.click()}
                        className="mt-3 inline-flex items-center gap-1.5 bg-slate-900 text-white text-[9px] font-black uppercase tracking-widest px-4.5 py-2 rounded-xl hover:bg-gold-500 transition-colors shadow-sm"
                      >
                        Choose Background File
                      </button>
                    </div>
                    <input 
                      type="file" 
                      ref={heroImageInputRef} 
                      onChange={handleHeroImageUpload} 
                      className="hidden" 
                      accept="image/*" 
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* System Contact Section */}
            <section className="space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="text-xl font-bold text-slate-800 tracking-tight">Contact Information</h3>
                <p className="text-slate-400 text-xs mt-1">Configure live telephone and support addresses for inquiries.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Support Helpline</label>
                  <input
                    type="text"
                    value={tempSystemData.contact?.phone || ""}
                    onChange={(e) => handleTempUpdate('contact', 'phone', e.target.value)}
                    placeholder=" helpline phone..."
                    className="w-full px-5 py-4 border border-slate-200 rounded-2xl focus:border-gold-500 outline-none text-slate-800 font-medium text-sm transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Branded Support Email</label>
                  <input
                    type="email"
                    value={tempSystemData.contact?.email || ""}
                    onChange={(e) => handleTempUpdate('contact', 'email', e.target.value)}
                    placeholder="support address..."
                    className="w-full px-5 py-4 border border-slate-200 rounded-2xl focus:border-gold-500 outline-none text-slate-800 font-medium text-sm transition-all"
                  />
                </div>
              </div>
            </section>

            {/* Action Save Bar */}
            <div className="flex items-center gap-4 pt-6 border-t border-slate-100">
              <button
                onClick={handleSaveChanges}
                disabled={isSaving}
                className="flex items-center gap-2 bg-gold-500 hover:bg-gold-600 text-white font-bold px-8 py-4 rounded-2xl shadow-lg shadow-gold-500/20 transition-all hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:pointer-events-none text-sm cursor-pointer"
              >
                <Save size={18} />
                Save Brand Configuration
              </button>
              <button
                onClick={handleRevertChanges}
                disabled={isSaving}
                className="flex items-center gap-2 border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold px-8 py-4 rounded-2xl transition-all hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:pointer-events-none text-sm cursor-pointer"
              >
                <RotateCcw size={18} />
                Revert Changes
              </button>
            </div>

          </div>
        </div>

      </div>

      {/* Glassmorphic Success Toast */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-10 right-10 z-[9999] bg-slate-900/95 backdrop-blur-xl border border-white/10 text-white px-8 py-5 rounded-[2rem] shadow-2xl flex items-center gap-4 animate-in fade-in"
          >
            <div className="w-10 h-10 rounded-2xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-gold-500">
              <CheckCircle size={20} />
            </div>
            <div className="text-left">
              <div className="text-xs font-black uppercase tracking-widest text-gold-500">Success</div>
              <div className="text-xs text-slate-300 mt-0.5">Configuration processed successfully!</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Glassmorphic Error Toast */}
      <AnimatePresence>
        {errorToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-10 right-10 z-[9999] bg-red-950/95 backdrop-blur-xl border border-red-500/20 text-white px-8 py-5 rounded-[2rem] shadow-2xl flex items-center gap-4 animate-in fade-in"
          >
            <div className="w-10 h-10 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500">
              <AlertTriangle size={20} />
            </div>
            <div className="text-left">
              <div className="text-xs font-black uppercase tracking-widest text-red-500">Error</div>
              <div className="text-xs text-slate-300 mt-0.5">{errorToast}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminSettings;
