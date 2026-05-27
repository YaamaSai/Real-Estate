import React from 'react';
import { Settings, Mail, Phone, MapPin, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const Maintenance = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-0 right-0 w-[50rem] h-[50rem] bg-gold-500/10 rounded-full blur-[150px] translate-x-1/3 -translate-y-1/3"></div>
      <div className="absolute bottom-0 left-0 w-[40rem] h-[40rem] bg-gold-500/5 rounded-full blur-[120px] -translate-x-1/3 translate-y-1/3"></div>
      
      <div className="max-w-3xl w-full text-center relative z-10 animate-fadeIn">
        {/* Animated Icon Container */}
        <div className="mb-12 relative inline-block">
          <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gold-500/20 rounded-[2.5rem] flex items-center justify-center animate-pulse shadow-2xl shadow-gold-500/20">
            <Settings className="text-gold-500 w-12 h-12 sm:w-16 sm:h-16 animate-spin-slow" />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-gold-500 rounded-full flex items-center justify-center shadow-lg border-4 border-slate-900">
            <span className="w-2 h-2 bg-white rounded-full animate-ping"></span>
          </div>
        </div>

        <Link to="/" className="block mb-8">
          <span className="text-4xl sm:text-5xl font-bold font-serif tracking-tighter text-white">
            BRIDL<span className="text-gold-500">360</span>
          </span>
        </Link>

        <h1 className="text-4xl sm:text-6xl font-heading font-bold mb-6 tracking-tight leading-tight">
          Enhancing Your <span className="text-gold-500 underline decoration-gold-500/30 underline-offset-8">Experience</span>
        </h1>
        
        <p className="text-lg sm:text-xl text-slate-400 mb-12 max-w-2xl mx-auto font-light leading-relaxed">
          Our platform is currently undergoing scheduled maintenance to bring you new features and a more premium experience. We'll be back online shortly.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16">
          <div className="bg-white/5 backdrop-blur-md p-6 rounded-3xl border border-white/10 group hover:bg-white/10 transition-all duration-500">
            <Mail className="text-gold-500 mx-auto mb-4 group-hover:scale-110 transition-transform" size={24} />
            <p className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-2">Email Us</p>
            <p className="text-slate-300 font-medium truncate text-xs">info@bridl360.com</p>
          </div>
          <div className="bg-white/5 backdrop-blur-md p-6 rounded-3xl border border-white/10 group hover:bg-white/10 transition-all duration-500">
            <Phone className="text-gold-500 mx-auto mb-4 group-hover:scale-110 transition-transform" size={24} />
            <p className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-2">Call Support</p>
            <p className="text-slate-300 font-medium text-xs">+91 999 999 9999</p>
          </div>
          <div className="bg-white/5 backdrop-blur-md p-6 rounded-3xl border border-white/10 group hover:bg-white/10 transition-all duration-500">
            <Clock className="text-gold-500 mx-auto mb-4 group-hover:scale-110 transition-transform" size={24} />
            <p className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-2">Estimated Back</p>
            <p className="text-slate-300 font-medium text-xs">Within 2 Hours</p>
          </div>
        </div>

        <div className="flex flex-col items-center gap-4">
          <p className="text-slate-500 text-sm font-medium tracking-wider">Are you an administrator?</p>
          <Link 
            to="/login" 
            className="text-gold-500 font-bold hover:text-gold-400 transition-colors flex items-center gap-2 group"
          >
            Admin Portal Login <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-slate-600 text-[10px] font-bold uppercase tracking-[0.5em] whitespace-nowrap">
        © 2024 BRIDL360 Premium Real Estate
      </div>
    </div>
  );
};

export default Maintenance;
