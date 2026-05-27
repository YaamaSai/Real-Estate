  import React, { useState, useEffect } from 'react';
import { Home, MessageSquare, Users, TrendingUp, AlertTriangle, CheckCircle, ArrowRight, Building2, UserCheck, Calendar, Plus } from 'lucide-react';
import { useSite } from '../context/SiteContext';
import API from '../utils/api';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const { siteData, refreshLeads, refreshAgents } = useSite();
  const [loading, setLoading] = useState(true);

  const properties = siteData?.properties || [];
  const projects = siteData?.projects || [];
  const leads = siteData?.leads || [];
  const agents = siteData?.agents || [];
  const isMaintenance = siteData?.isMaintenanceMode;

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([refreshLeads(), refreshAgents()]);
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();

    // Re-fetch when window is focused
    window.addEventListener('focus', fetchData);
    return () => window.removeEventListener('focus', fetchData);
  }, []);

  const stats = [
    { 
      title: 'Total Properties', 
      value: properties.length, 
      icon: <Home size={24} className="text-gold-500" />, 
      color: 'bg-gold-50',
      link: '/admin/properties'
    },
    { 
      title: 'Site Visits', 
      value: leads.filter(l => l.type === 'Site Visit').length, 
      icon: <Calendar size={24} className="text-orange-500" />, 
      color: 'bg-orange-50',
      link: '/admin/leads'
    },
    { 
      title: 'Total Leads', 
      value: leads.length, 
      icon: <MessageSquare size={24} className="text-green-500" />, 
      color: 'bg-green-50',
      link: '/admin/leads'
    },
    { 
      title: 'Active Agents', 
      value: agents.filter(a => a.status === 'Active').length, 
      icon: <Users size={24} className="text-purple-500" />, 
      color: 'bg-purple-50',
      link: '/admin/agents'
    },
    { 
      title: 'Total Projects', 
      value: projects.length, 
      icon: <Building2 size={24} className="text-blue-500" />, 
      color: 'bg-blue-50',
      link: '/admin/projects'
    },
  ];

  return (
    <div className="animate-fadeIn">
      <div className="flex flex-col md:flex-row justify-between items-center md:items-start mb-10 gap-6 text-center md:text-left">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold font-heading text-slate-900 tracking-tight">Dashboard Overview</h1>
          <p className="text-slate-500 mt-2 text-sm md:text-base">Welcome back, Admin. Here's what's happening with Bridl360 today.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <Link 
            to="/admin/projects?add=true" 
            className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-gold-600 transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-2"
          >
            <Plus size={16} /> Add Project
          </Link>
          <Link 
            to="/admin/properties?add=true"     
            className="bg-white text-slate-900 border border-slate-200 px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
          >
            <Plus size={16} /> Add Property
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6 mb-10">
        {stats.map((stat, i) => (
          <Link to={stat.link} key={i} className={`bg-white p-5 md:p-6 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group ${i === stats.length - 1 ? 'col-span-2 lg:col-span-1' : ''}`}>
            <div className="flex justify-between items-start mb-4">
              <div className={`${stat.color} p-3.5 md:p-4 rounded-2xl group-hover:scale-110 transition-transform`}>
                {React.cloneElement(stat.icon, { size: 20 })}
              </div>
              <ArrowRight size={18} className="text-slate-300 group-hover:text-gold-500 group-hover:translate-x-1 transition-all" />
            </div>
            <div>
              <p className="text-slate-500 font-bold text-[10px] uppercase tracking-widest mb-1">{stat.title}</p>
              <h3 className="text-2xl md:text-3xl font-black text-slate-900">{stat.value}</h3>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Leads */}
        <div className="lg:col-span-1 bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold font-heading text-slate-900">Recent Leads</h2>
            <Link to="/admin/leads" className="text-xs font-bold text-gold-600 hover:text-gold-700 uppercase tracking-widest">View All</Link>
          </div>
          <div className="space-y-6">
            {leads.slice(0, 4).map((lead, i) => (
              <div key={i} className="flex justify-between items-center p-4 bg-slate-50/50 rounded-2xl border border-transparent hover:border-slate-100 hover:bg-white transition-all cursor-pointer">
                <div>
                  <p className="font-bold text-slate-800">{lead.name}</p>
                  <p className="text-[11px] text-slate-500 uppercase tracking-wider mt-0.5">
                    {typeof lead.property === 'object' ? lead.property?.title : (lead.property || 'General Inquiry')}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                  lead.status === 'New' ? 'bg-blue-500 text-white shadow-lg shadow-blue-100' : 'bg-slate-200 text-slate-600'
                }`}>
                  {lead.status}
                </span>
              </div>
            ))}
            {leads.length === 0 && <p className="text-center text-slate-400 py-10">No recent leads found.</p>}
          </div>
        </div>

        {/* Latest Properties */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold font-heading text-slate-900">Latest Property Listings</h2>
            <Link to="/admin/properties" className="text-xs font-bold text-gold-600 hover:text-gold-700 uppercase tracking-widest">Manage All</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {properties.slice(0, 4).map((prop, i) => (
              <div key={i} className="flex gap-4 items-center p-4 rounded-2xl border border-slate-50 hover:border-gold-100 hover:bg-gold-50/10 transition-all cursor-pointer group">
                <div className="w-20 h-20 rounded-2xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                  <img src={prop.image || prop.images?.[0]} alt={prop.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-slate-900 truncate">{prop.title}</p>
                  <p className="text-sm text-slate-500 font-medium">₹{prop.price} • {prop.location}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">{prop.category}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {properties.length === 0 && <p className="text-center text-slate-400 py-20">No properties added yet.</p>}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
