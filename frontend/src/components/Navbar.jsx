import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Home, Briefcase, Users, Phone, MapPin, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';

const Navbar = () => {
  const { isAuthenticated, user, logout, updateProfileData } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = React.useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [profileError, setProfileError] = useState('');
  const [profileSuccess, setProfileSuccess] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  // Load user data into form when modal opens
  useEffect(() => {
    if (user && isProfileOpen) {
      setProfileForm({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        password: '',
        confirmPassword: ''
      });
      setProfileError('');
      setProfileSuccess('');
    }
  }, [user, isProfileOpen]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileError('');
    setProfileSuccess('');

    if (profileForm.password) {
      if (profileForm.password.length < 6) {
        setProfileError('Password must be at least 6 characters long');
        return;
      }
      if (profileForm.password !== profileForm.confirmPassword) {
        setProfileError('Passwords do not match');
        return;
      }
    }

    setIsUpdating(true);
    const updatePayload = {
      name: profileForm.name,
      email: profileForm.email,
      phone: profileForm.phone
    };
    if (profileForm.password) {
      updatePayload.password = profileForm.password;
    }

    const result = await updateProfileData(updatePayload);
    setIsUpdating(false);

    if (result.success) {
      setProfileSuccess('Profile updated successfully!');
      setTimeout(() => {
        setIsProfileOpen(false);
      }, 1500);
    } else {
      setProfileError(result.message);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/', icon: <Home size={18} /> },
    { name: 'Properties', path: '/properties', icon: <Briefcase size={18} /> },
    { name: 'Projects', path: '/projects', icon: <MapPin size={18} /> },
    { name: 'About', path: '/about', icon: <Users size={18} /> },
    { name: 'Team', path: '/team', icon: <Users size={18} /> },
    { name: 'Testimonials', path: '/testimonials', icon: <Users size={18} /> },
    { name: 'Contact', path: '/contact', icon: <Phone size={18} /> },
  ];

  // Determine text color based on page and scroll position
  const isLightText = isHomePage && !scrolled;

  return (
    <>
      <nav className={`fixed w-full z-[100] transition-all duration-300 ${scrolled ? 'glass-morphism py-2 shadow-lg' : 'bg-transparent py-4'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-4 xl:px-8">
          <div className="flex justify-between items-center h-16 relative">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/">
                <Logo imgClassName="h-14 w-auto object-contain" />
              </Link>
            </div>

            {/* Center Navigation Links (Absolutely Centered ONLY at 1020px-1024px responsive, Static Right-aligned on xl: 1280px+) */}
            <div className="hidden lg:flex lg:absolute lg:left-1/2 lg:-translate-x-1/2 lg:z-10 lg:pointer-events-none xl:static xl:translate-x-0 xl:pointer-events-auto xl:ml-auto">
              <div className="flex items-center gap-2 xl:gap-6 lg:pointer-events-auto">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`${location.pathname === link.path
                      ? 'text-gold-500 font-bold'
                      : (isLightText ? 'text-white/90' : 'text-slate-700')
                      } hover:text-gold-500 px-1.5 xl:px-3 py-2 rounded-md text-xs xl:text-sm font-semibold transition-all duration-300 relative group`}
                  >
                    {link.name}
                    {location.pathname === link.path && (
                      <motion.div
                        layoutId="nav-underline"
                        className="absolute bottom-0 left-1.5 xl:left-3 right-1.5 xl:right-3 h-0.5 bg-gold-500 rounded-full"
                      />
                    )}
                  </Link>
                ))}
              </div>
            </div>

            {/* Right Action Buttons (Right-aligned, pushed by margin-auto spacer on xl) */}
            <div className="hidden lg:flex items-center gap-2 xl:gap-6 z-20 lg:ml-auto xl:ml-0" ref={dropdownRef}>
              {isAuthenticated ? (
                <div className="flex items-center gap-2 xl:gap-6">
                  <div className="relative group">
                    <button
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className={`flex items-center gap-1.5 xl:gap-2.5 px-1.5 xl:px-2.5 py-1 xl:py-1.5 rounded-full border transition-all duration-300 ${scrolled || !isHomePage
                        ? 'border-slate-200 text-slate-900 bg-slate-50 hover:bg-slate-100'
                        : 'border-white/20 text-white bg-white/10 hover:bg-white/20'
                        }`}
                    >
                      <div className="w-8 h-8 rounded-full bg-gold-500 flex items-center justify-center text-white text-xs font-black shrink-0 shadow-lg shadow-gold-500/20">
                        {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <div className="hidden xl:block text-left whitespace-nowrap">
                        <p className="text-[9px] font-bold uppercase tracking-widest opacity-60 leading-none mb-1">Welcome</p>
                        <p className="text-xs font-black leading-none">{user?.name || 'User'}</p>
                      </div>
                    </button>

                    {/* Dropdown Menu */}
                    <div className={`absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 transition-all duration-300 translate-y-2 group-hover:translate-y-0 group-hover:opacity-100 group-hover:visible z-50 ${isDropdownOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible'}`}>
                      <div className="px-4 py-2 border-b border-slate-50 mb-1">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Account</p>
                      </div>
                      {user?.role === 'admin' && (
                        <Link
                          to="/admin"
                          className="block px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50 hover:text-gold-600 transition-colors"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          Admin Dashboard
                        </Link>
                      )}
                      <button
                        onClick={() => {
                          setIsProfileOpen(true);
                          setIsDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50 hover:text-gold-600 transition-colors"
                      >
                        Profile Settings
                      </button>
                      <button
                        onClick={() => {
                          logout();
                          setIsDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-50 transition-colors"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                  <Link to="/book-visit" className="btn-gold py-2 px-3 xl:py-2.5 xl:px-6 text-xs xl:text-sm whitespace-nowrap shadow-xl shadow-gold-500/20">
                    Book Site Visit
                  </Link>
                </div>
              ) : (
                <div className="flex items-center gap-2 xl:gap-6">
                  <Link
                    to="/login"
                    className={`text-xs xl:text-sm font-bold transition-colors ${scrolled || !isHomePage ? 'text-slate-900 hover:text-gold-600' : 'text-white hover:text-gold-400'}`}
                  >
                    Login
                  </Link>
                  <Link to="/book-visit" className="btn-gold py-2 px-3 xl:py-2.5 xl:px-6 text-xs xl:text-sm whitespace-nowrap">
                    Book Site Visit
                  </Link>
                </div>
              )}
            </div>

            <div className="lg:hidden flex items-center">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className={`${isLightText ? 'text-white' : 'text-slate-700'} hover:text-gold-500 focus:outline-none transition-colors duration-300`}
              >
                {isOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Clean & Simple Mobile Menu Drawer */}
      <div className={`lg:hidden fixed inset-0 z-[10000] ${isOpen ? 'block' : 'hidden'}`}>
        {/* Dim Backdrop */}
        <div
          className={`absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setIsOpen(false)}
        ></div>

        {/* Minimalist Drawer */}
        <div className={`absolute inset-y-0 right-0 w-[280px] bg-white shadow-2xl transition-transform duration-300 ease-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          {/* Header */}
          <div className="p-5 flex justify-between items-center border-b border-slate-50 bg-white shrink-0">
            <span className="text-lg font-black tracking-tight text-slate-900 uppercase">Menu</span>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation Area */}
          <div className="flex-1 overflow-y-auto p-4 bg-white">
            {isAuthenticated && (
              <div className="mb-6 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-gold-500 flex items-center justify-center text-white text-sm font-bold">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-[10px] font-bold text-slate-400 uppercase leading-none mb-1">Authenticated</p>
                    <p className="text-sm font-bold text-slate-900 truncate">{user?.name}</p>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  {user?.role === 'admin' && (
                    <Link
                      to="/admin"
                      onClick={() => setIsOpen(false)}
                      className="w-full text-center py-3 bg-white border border-slate-200 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-600"
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  <button
                    onClick={() => { setIsProfileOpen(true); setIsOpen(false); }}
                    className="w-full text-center py-3 bg-white border border-slate-200 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-600"
                  >
                    Profile Settings
                  </button>
                  <button
                    onClick={() => { logout(); setIsOpen(false); }}
                    className="w-full text-center py-3 bg-red-50 text-red-600 rounded-xl text-[9px] font-black uppercase tracking-widest"
                  >
                    Logout Account
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${location.pathname === link.path ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-50'}`}
                  onClick={() => setIsOpen(false)}
                >
                  <span className={location.pathname === link.path ? 'text-gold-500' : 'text-slate-400'}>
                    {React.cloneElement(link.icon, { size: 18 })}
                  </span>
                  <span className="text-sm font-bold">{link.name}</span>
                </Link>
              ))}

              {!isAuthenticated && (
                <Link
                  to="/login"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-50 mt-4 border border-dashed border-slate-200"
                  onClick={() => setIsOpen(false)}
                >
                  <Users size={18} className="text-slate-400" />
                  <span className="text-sm font-bold">Login / Sign Up</span>
                </Link>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 bg-slate-50 shrink-0">
            <Link
              to="/book-visit"
              className="w-full bg-gold-500 text-white py-3 rounded-xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2"
              onClick={() => setIsOpen(false)}
            >
              Book Site Visit <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>

      {/* Profile Settings Modal */}
      <AnimatePresence>
        {isProfileOpen && (
          <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
            {/* Dark blur backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsProfileOpen(false)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            ></motion.div>

            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-[2.5rem] p-8 max-w-md w-full shadow-2xl border border-slate-100/50 z-10"
            >
              <button
                type="button"
                onClick={() => setIsProfileOpen(false)}
                className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-900 rounded-full hover:bg-slate-50 transition-colors"
              >
                <X size={18} />
              </button>

              <div className="text-left mb-6">
                <h3 className="text-2xl font-bold font-serif text-slate-900 tracking-tight">Profile Settings</h3>
                <p className="text-slate-400 text-xs mt-1">Manage your identity, contact telephone, and account password.</p>
              </div>

              {profileError && (
                <div className="mb-4 p-4 bg-red-55 border border-red-100 rounded-2xl text-red-650 text-xs font-semibold text-left">
                  {profileError}
                </div>
              )}

              {profileSuccess && (
                <div className="mb-4 p-4 bg-green-55 border border-green-100 rounded-2xl text-green-750 text-xs font-semibold text-left">
                  {profileSuccess}
                </div>
              )}

              <form onSubmit={handleProfileSubmit} className="space-y-4">
                <div className="space-y-1 text-left">
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 ml-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-gold-500 outline-none text-slate-800 font-medium text-sm transition-all"
                  />
                </div>

                <div className="space-y-1 text-left">
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 ml-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={profileForm.email}
                    onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-gold-500 outline-none text-slate-800 font-medium text-sm transition-all"
                  />
                </div>

                <div className="space-y-1 text-left">
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 ml-1">Phone Number</label>
                  <input
                    type="text"
                    placeholder="Enter phone number..."
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-gold-500 outline-none text-slate-800 font-medium text-sm transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1 text-left">
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 ml-1">New Password</label>
                    <input
                      type="password"
                      placeholder="••••••"
                      value={profileForm.password}
                      onChange={(e) => setProfileForm({ ...profileForm, password: e.target.value })}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-gold-500 outline-none text-slate-800 font-medium text-sm transition-all"
                    />
                  </div>
                  <div className="space-y-1 text-left">
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 ml-1">Confirm Password</label>
                    <input
                      type="password"
                      placeholder="••••••"
                      value={profileForm.confirmPassword}
                      onChange={(e) => setProfileForm({ ...profileForm, confirmPassword: e.target.value })}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-gold-500 outline-none text-slate-800 font-medium text-sm transition-all"
                    />
                  </div>
                </div>

                <div className="pt-4 flex gap-3">
                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="flex-1 bg-slate-900 hover:bg-slate-800 text-gold-500 font-bold py-3.5 rounded-xl text-[10px] uppercase tracking-wider transition-all disabled:opacity-50 disabled:pointer-events-none cursor-pointer text-center"
                  >
                    {isUpdating ? 'Saving...' : 'Save Profile'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold py-3.5 rounded-xl text-[10px] uppercase tracking-wider transition-all cursor-pointer text-center"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
