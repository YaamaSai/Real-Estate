import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Globe, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const [showPopup, setShowPopup] = useState(false);
  const [popupType, setPopupType] = useState('success'); 

  // Pre-fill email on mount if Remember Me is active
  React.useEffect(() => {
    const savedEmail = localStorage.getItem('bridl360_remember_email');
    if (savedEmail) {
      setFormData(prev => ({ ...prev, email: savedEmail }));
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setShowPopup(true);
    setPopupType('loading');
    
    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      // Save or remove email based on Remember Me checkbox
      if (rememberMe) {
        localStorage.setItem('bridl360_remember_email', formData.email);
      } else {
        localStorage.removeItem('bridl360_remember_email');
      }

      setPopupType('success');
      setTimeout(() => {
        // Fetch saved user to check role
        const savedUser = JSON.parse(localStorage.getItem('bridl360_user'));
        if (savedUser?.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      }, 2000);
    } else {
      setShowPopup(false);
      setError(result.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-transform duration-[20000ms] hover:scale-110"
        style={{ backgroundImage: "url('/auth-bg.png')" }}
      ></div>
      <div className="absolute inset-0 z-0 bg-slate-900/60 backdrop-blur-[2px]"></div>

      {/* Decorative background elements - subtle glow */}
      <div className="absolute top-0 left-0 w-[30rem] h-[30rem] bg-gold-500/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-[100px] z-0"></div>
      <div className="absolute bottom-0 right-0 w-[30rem] h-[30rem] bg-slate-500/10 rounded-full translate-x-1/2 translate-y-1/2 blur-[100px] z-0"></div>

      <div className={`max-w-md w-full space-y-8 relative z-10 transition-all duration-500 px-4 sm:px-0 ${showPopup ? 'blur-md scale-95 pointer-events-none' : ''}`}>
        <div className="text-center">
          <Link to="/" className="text-3xl sm:text-4xl font-bold font-serif tracking-tighter text-white drop-shadow-lg">
            BRIDL<span className="text-gold-500">360</span>
          </Link>
          <h2 className="mt-4 text-2xl sm:text-3xl font-extrabold text-white font-heading drop-shadow-md">Welcome Back</h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-300">
            Don't have an account?{' '}
            <Link to="/signup" className="font-bold text-gold-400 hover:text-gold-300 transition-colors">
              Create a free account
            </Link>
          </p>
        </div>

        <div className="bg-white/90 p-6 sm:p-8 rounded-[2rem] shadow-2xl border border-white/20 backdrop-blur-xl">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 text-sm animate-shake">
              <AlertCircle size={18} />
              <p className="font-medium">{error}</p>
            </div>
          )}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 ml-1 uppercase tracking-wider">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-gold-600 transition-colors">
                  <Mail size={16} />
                </div>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="block w-full pl-11 pr-4 py-3 bg-white/50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all placeholder:text-slate-400"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 ml-1 uppercase tracking-wider">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-gold-600 transition-colors">
                  <Lock size={16} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="block w-full pl-11 pr-12 py-3 bg-white/50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all placeholder:text-slate-400"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs px-1">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input 
                  type="checkbox" 
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-gold-600 focus:ring-gold-500 cursor-pointer" 
                />
                <span className="text-slate-600 group-hover:text-slate-900 transition-colors font-medium">Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-gold-600 hover:text-gold-500 transition-colors font-bold">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 border border-transparent rounded-xl text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 transition-all shadow-lg group"
            >
              Sign In <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-8">
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-3 bg-white/50 text-slate-500 font-bold uppercase tracking-widest backdrop-blur-sm">Or continue with</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-4">
              <button 
                type="button"
                onClick={() => window.location.href = 'https://accounts.google.com'}
                className="flex flex-col items-center justify-center gap-2 py-3 px-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all font-bold text-slate-700 text-xs"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-3.3 3.28-8.09 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                Google
              </button>
              <button 
                type="button"
                onClick={() => window.location.href = 'https://appleid.apple.com'}
                className="flex flex-col items-center justify-center gap-2 py-3 px-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all font-bold text-slate-700 text-xs"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.05 20.28c-.96.95-2.06 1.72-3.14 1.72-1.13 0-1.5-.64-2.86-.64-1.35 0-1.78.62-2.86.62-1.07 0-2.25-.85-3.23-1.85-2.02-2.03-3.08-5.83-1.07-8.99 1-1.57 2.65-2.58 4.45-2.58.98 0 1.93.38 2.68.38.73 0 1.83-.44 3-.44 1.18 0 2.64.44 3.63 1.63-2.92 1.63-2.45 5.56.45 7.15-.55 1.54-1.1 3-2.05 4zM12.03 7.25c-.02-2.23 1.84-4.14 4.07-4.25.22 2.25-1.88 4.27-4.07 4.25z"/>
                </svg>
                Apple
              </button>
              <button 
                type="button"
                onClick={() => window.location.href = 'https://www.facebook.com'}
                className="flex flex-col items-center justify-center gap-2 py-3 px-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all font-bold text-slate-700 text-xs"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#1877F2">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Facebook
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Popup Modal */}
      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"></div>
          <div className="relative bg-white rounded-[2.5rem] p-10 max-w-sm w-full shadow-2xl border border-white transform transition-all animate-in fade-in zoom-in duration-300">
            <div className="flex flex-col items-center text-center">
              {popupType === 'loading' ? (
                <>
                  <div className="w-16 h-16 border-4 border-gold-200 border-t-gold-500 rounded-full animate-spin mb-6"></div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Authenticating</h3>
                  <p className="text-slate-500">Verifying your credentials...</p>
                </>
              ) : (
                <>
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 animate-bounce">
                    <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <h3 className="text-3xl font-bold text-slate-900 mb-2">Welcome Back!</h3>
                  <p className="text-slate-500 mb-8">You have successfully signed in to Bridl360.</p>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gold-500 animate-progress-bar"></div>
                  </div>
                  <p className="text-xs text-slate-400 mt-4 uppercase tracking-widest font-bold">Redirecting you...</p>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
