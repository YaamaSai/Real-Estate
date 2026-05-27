import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, ArrowLeft, Send, CheckCircle2, ShieldQuestion, KeyRound, Lock, Eye, EyeOff, ArrowRight, AlertCircle } from 'lucide-react';

import API from '../utils/api';

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const navigate = useNavigate();

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });
    try {
      await API.post('/auth/forgot-password', { email });
      setStep(2);
      setMessage({ type: 'success', text: 'OTP sent to your email address.' });
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to send OTP.' });
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (element, index) => {
    if (isNaN(element.value)) return false;
    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);
    if (element.value !== "" && element.nextSibling) {
      element.nextSibling.focus();
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });
    const otpValue = otp.join('');
    try {
      await API.post('/auth/verify-otp', { email, otp: otpValue });
      setStep(3);
      setMessage({ type: 'success', text: 'OTP Verified successfully.' });
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Invalid or expired OTP.' });
    } finally {
      setLoading(false);
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });
    const otpValue = otp.join('');
    try {
      await API.post('/auth/reset-password', { email, otp: otpValue, newPassword });
      setStep(4); // Success screen
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Password reset failed.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Dynamic Security Background */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-transform duration-[20000ms] hover:scale-110 opacity-40"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80')" }}
      ></div>
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-slate-950 via-slate-900/90 to-amber-950/20 backdrop-blur-[3px]"></div>

      {/* Warning Glows */}
      <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-amber-500/5 rounded-full translate-x-1/2 -translate-y-1/2 blur-[120px] z-0"></div>
      <div className="absolute bottom-0 left-0 w-[30rem] h-[30rem] bg-slate-500/10 rounded-full -translate-x-1/2 translate-y-1/2 blur-[100px] z-0"></div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white/10 backdrop-blur-2xl rounded-[3rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)] p-10 border border-white/10 relative z-10"
      >
        <div className="text-center mb-8">
           <Link to="/" className="text-2xl font-bold font-serif tracking-tighter text-white mb-8 block">
            BRIDL<span className="text-amber-500">360</span>
          </Link>
        </div>

        {message.text && (
          <div className={`mb-6 p-4 rounded-2xl flex items-center gap-3 text-sm font-bold animate-fadeIn ${
            message.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
          }`}>
            {message.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            <p>{message.text}</p>
          </div>
        )}

        <AnimatePresence mode="wait">
          {/* Step 1: Email Input */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-amber-500/10">
                  <ShieldQuestion size={32} className="text-amber-500" />
                </div>
                <h1 className="text-2xl font-bold text-white mb-2">Access Recovery</h1>
                <p className="text-slate-400 font-medium text-xs leading-relaxed">System identity verification required. Please provide your registered credentials.</p>
              </div>

              <form onSubmit={handleEmailSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-amber-500/60 uppercase tracking-[0.2em] ml-4">Credential Link</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-slate-500 group-focus-within:text-amber-500 transition-colors">
                      <Mail size={18} />
                    </div>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-bold text-white placeholder:text-slate-600"
                      placeholder="Enter security email"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-amber-500 text-slate-900 py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-2xl shadow-amber-500/20 flex items-center justify-center gap-3 hover:bg-white hover:scale-[1.02] transition-all active:scale-95 disabled:opacity-50"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin"></div>
                  ) : (
                    <>Initialize OTP <Send size={16} /></>
                  )}
                </button>

                <Link to="/login" className="flex items-center justify-center gap-2 text-slate-500 hover:text-white font-bold transition-colors group text-xs">
                  <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                  <span>Return to Secure Login</span>
                </Link>
              </form>
            </motion.div>
          )}

          {/* Step 2: OTP Verification */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-blue-500/10">
                  <KeyRound size={32} className="text-blue-400" />
                </div>
                <h1 className="text-2xl font-bold text-white mb-2">Identity Check</h1>
                <p className="text-slate-400 font-medium text-xs leading-relaxed">Enter the 6-digit security code transmitted to <br/><span className="text-white font-bold">{email}</span></p>
              </div>

              <form onSubmit={handleOtpSubmit} className="space-y-8">
                <div className="flex justify-center gap-2 md:gap-3">
                  {otp.map((data, index) => (
                    <input
                      key={index}
                      type="text"
                      maxLength="1"
                      className="w-10 h-12 md:w-12 md:h-14 bg-white/5 border-2 border-white/10 rounded-xl text-center text-xl font-black text-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all"
                      value={data}
                      onChange={e => handleOtpChange(e.target, index)}
                      onFocus={e => e.target.select()}
                    />
                  ))}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-white text-slate-900 py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-2xl flex items-center justify-center gap-3 hover:bg-amber-500 transition-all active:scale-95 disabled:opacity-50"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin"></div>
                  ) : (
                    <>Verify Identity <CheckCircle2 size={16} /></>
                  )}
                </button>

                <div className="text-center">
                  <button 
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-amber-500 font-bold text-xs hover:underline uppercase tracking-widest"
                  >
                    Resend Security Code
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {/* Step 3: New Password */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-green-500/10 border border-green-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-green-500/10">
                  <Lock size={32} className="text-green-400" />
                </div>
                <h1 className="text-2xl font-bold text-white mb-2">New Protocol</h1>
                <p className="text-slate-400 font-medium text-xs leading-relaxed">Verification complete. Establish a new secure access key for your account.</p>
              </div>

              <form onSubmit={handleResetSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Access Key</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-slate-500 group-focus-within:text-amber-500 transition-colors">
                      <Lock size={18} />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-12 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-bold text-white"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-amber-500 text-slate-900 py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-2xl shadow-amber-500/20 flex items-center justify-center gap-3 hover:bg-white transition-all active:scale-95 disabled:opacity-50"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin"></div>
                  ) : (
                    <>Update Security Key <ArrowRight size={16} /></>
                  )}
                </button>
              </form>
            </motion.div>
          )}

          {/* Step 4: Success */}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-6"
            >
              <div className="w-20 h-20 bg-green-500/10 text-green-400 rounded-full flex items-center justify-center mx-auto mb-8 border border-green-500/20 shadow-2xl shadow-green-500/10">
                <CheckCircle2 size={40} className="animate-bounce" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-4">Access Restored</h1>
              <p className="text-slate-400 mb-10 leading-relaxed font-medium text-xs">
                Your credentials have been successfully reset. You can now re-authenticate into the secure environment.
              </p>
              <Link 
                to="/login" 
                className="w-full block bg-white text-slate-900 py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-2xl hover:bg-amber-500 transition-all active:scale-95"
              >
                Enter Secure Portal
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
