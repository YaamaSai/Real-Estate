import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Home, Users, MessageSquare, Settings, LogOut, Bell } from 'lucide-react';
import API from '../utils/api';
import Logo from './Logo';

const AdminSidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  const [newLeadsCount, setNewLeadsCount] = useState(0);

  useEffect(() => {
    const fetchNewLeadsCount = async () => {
      try {
        const res = await API.get('/leads');
        const count = res.data.filter(l => l.status === 'New').length;
        setNewLeadsCount(count);
      } catch (error) {
        console.error("Error fetching lead count", error);
      }
    };

    fetchNewLeadsCount();
    const interval = setInterval(fetchNewLeadsCount, 30000);
    return () => clearInterval(interval);
  }, []);

  const menuItems = [
    { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={20} /> },
    { name: 'Properties', path: '/admin/properties', icon: <Home size={20} /> },
    { name: 'Projects', path: '/admin/projects', icon: <LayoutDashboard size={20} /> },
    { name: 'Leads', path: '/admin/leads', icon: <MessageSquare size={20} />, badge: newLeadsCount },
    { name: 'Agents', path: '/admin/agents', icon: <Users size={20} /> },
    { name: 'Settings', path: '/admin/settings', icon: <Settings size={20} /> },
  ];

  return (
    <div className={`fixed inset-y-0 left-0 w-64 bg-slate-900 text-white flex flex-col shadow-2xl z-[60] transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="h-20 flex items-center justify-center border-b border-slate-800/50 mb-2 px-6">
        <Link to="/">
          <Logo isLight={true} />
        </Link>
      </div>
      <div className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            onClick={() => setIsOpen(false)}
            className={`flex items-center justify-between px-4 py-2.5 rounded-xl transition-all duration-300 group ${location.pathname === item.path
                ? 'bg-gold-500 text-white shadow-lg shadow-gold-500/20'
                : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
          >
            <div className="flex items-center gap-3">
              <span className={`${location.pathname === item.path ? 'text-white' : 'text-slate-500 group-hover:text-gold-500'} transition-colors`}>
                {item.icon}
              </span>
              <span className="text-[11px] lg:text-[13px] font-black uppercase tracking-widest">{item.name}</span>
            </div>
            {item.badge > 0 && (
              <span className={`flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-[10px] font-black animate-pulse ${location.pathname === item.path ? 'bg-white text-gold-600' : 'bg-red-500 text-white shadow-lg shadow-red-500/30'
                }`}>
                {item.badge}
              </span>
            )}
          </Link>
        ))}
      </div>
      <div className="p-4 border-t border-slate-800/50 mt-auto">
        <button
          onClick={() => {
            localStorage.removeItem('bridl360_token');
            localStorage.removeItem('bridl360_user');
            window.location.href = '/login';
          }}
          className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-red-400 hover:bg-red-500/5 rounded-xl w-full transition-all group font-black uppercase tracking-widest text-[10px]"
        >
          <LogOut size={18} className="group-hover:rotate-180 transition-transform duration-500" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
