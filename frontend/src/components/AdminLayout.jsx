import React, { useState } from 'react';
import { Outlet, Navigate, Link } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import { Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';

const AdminLayout = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (loading) return null;

  const isAdmin = user && user.role === 'admin';

  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Mobile Header (Fixed to float seamlessly at the top on touch/scroll) */}
      <div className="lg:hidden bg-slate-900 text-white p-4 flex justify-between items-center fixed top-0 left-0 right-0 z-[70] shadow-xl h-16">
        <Link to="/" className="cursor-pointer flex items-center hover:opacity-90 transition-opacity">
          <Logo imgClassName="h-8 w-auto object-contain" />
        </Link>
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 bg-white/10 rounded-xl hover:bg-white/20 transition-all"
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <AdminSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[55] lg:hidden transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Main Content Area (With mobile responsive padding-top offset for the fixed header) */}
      <div className="lg:ml-64 min-h-screen transition-all duration-300 pt-20 lg:pt-0">
        <div className="max-w-[1600px] mx-auto p-4 md:p-8 lg:p-12">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
