import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, X, ArrowRight, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LoginPopup = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-slate-900/90 backdrop-blur-xl"
        />
        
        <motion.div 
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden border border-gold-500/20"
        >
          {/* No Close Button - Mandatory Access */}

          <div className="flex flex-col md:flex-row h-full">
            {/* Visual Side */}
            <div className="hidden md:flex md:w-2/5 bg-gold-500 p-10 flex-col justify-between text-white relative overflow-hidden">
              <div className="relative z-10">
                <ShieldCheck size={48} className="mb-6 opacity-90" />
                <h3 className="text-2xl font-bold font-serif leading-tight">Unlock Premium Features</h3>
              </div>
              <p className="text-sm opacity-80 relative z-10 leading-relaxed">Join Bridl360 to access exclusive property details, site visit bookings, and direct expert consultations.</p>
              
              {/* Decorative Circle */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full translate-x-1/2 -translate-y-1/2 blur-2xl"></div>
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-black/5 rounded-full -translate-x-1/2 translate-y-1/2 blur-3xl"></div>
            </div>

            {/* Content Side */}
            <div className="flex-1 p-8 sm:p-12">
              <div className="mb-8">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gold-600 mb-2 block">Exclusive Access</span>
                <h2 className="text-3xl font-black text-slate-900 leading-tight">Sign in to Explore More</h2>
                <p className="text-slate-500 mt-2 text-sm leading-relaxed">Get personalized recommendations and save your favorite properties.</p>
              </div>

              <div className="space-y-4">
                <button 
                  onClick={() => {
                    onClose();
                    navigate('/login');
                  }}
                  className="w-full flex items-center justify-center gap-3 bg-slate-900 text-white py-4 px-6 rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-xl active:scale-95 group"
                >
                  Sign In Now <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
                
                <button 
                  onClick={() => {
                    onClose();
                    navigate('/signup');
                  }}
                  className="w-full flex items-center justify-center gap-3 bg-white text-slate-900 border border-slate-200 py-4 px-6 rounded-2xl font-bold hover:bg-slate-50 transition-all active:scale-95"
                >
                  Create Free Account
                </button>
              </div>

              <p className="mt-8 text-center text-[10px] text-slate-400 font-medium">
                By continuing, you agree to our <span className="underline cursor-pointer">Terms of Service</span> and <span className="underline cursor-pointer">Privacy Policy</span>.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default LoginPopup;
