import React, { useState, useEffect, useRef } from 'react';
import { Plus, Search, Edit2, Trash2, User, Mail, Phone, Shield, MoreVertical, X, Check, Loader2, Camera, UserPlus, Clock } from 'lucide-react';
import API from '../utils/api';
import { useSite } from '../context/SiteContext';

const AdminAgents = () => {
  const { siteData, refreshAgents } = useSite();
  const agents = siteData?.agents || [];
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingAgent, setEditingAgent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    designation: '',
    email: '',
    phone: '',
    status: 'Active',
    avatar: '',
    bio: ''
  });

  useEffect(() => {
    const init = async () => {
      await refreshAgents();
      setLoading(false);
    };
    init();
  }, []);

  useEffect(() => {
    console.log("AdminAgents: current agents", agents);
  }, [agents]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, avatar: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingAgent) {
        await API.put(`/agents/${editingAgent._id}`, formData);
      } else {
        await API.post('/agents', formData);
      }
      await refreshAgents();
      closeModal();
    } catch (error) {
      console.error("Error saving agent", error);
      alert(error.response?.data?.message || "Failed to save agent");
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditModal = (agent) => {
    setEditingAgent(agent);
    setFormData({
      name: agent.name || '',
      designation: agent.designation || '',
      email: agent.email || '',
      phone: agent.phone || '',
      status: agent.status || 'Active',
      avatar: agent.avatar || '',
      bio: agent.bio || ''
    });
    setShowAddModal(true);
  };

  const closeModal = () => {
    setShowAddModal(false);
    setEditingAgent(null);
    setFormData({ name: '', designation: '', email: '', phone: '', status: 'Active', avatar: '', bio: '' });
  };

  const deleteAgent = async (id) => {
    if (window.confirm("Are you sure you want to remove this agent? This will also disable their login access.")) {
      try {
        await API.delete(`/agents/${id}`);
        await refreshAgents();
      } catch (error) {
        console.error("Error deleting agent", error);
        alert("Failed to delete agent");
      }
    }
  };

  const getInitials = (name) => {
    if (!name) return '??';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  const filteredAgents = agents.filter(a => 
    a.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    a.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <Loader2 className="animate-spin text-gold-500" size={48} />
      </div>
    );
  }

  return (
    <div className="animate-fadeIn">
      <div className="flex flex-col md:flex-row justify-between items-center md:items-start mb-10 gap-6 text-center md:text-left">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold font-heading text-slate-900 tracking-tight">Manage Team</h1>
          <p className="text-slate-500 mt-2 text-sm md:text-base">View and manage your team of professional real estate agents.</p>
        </div>
        <button 
          onClick={() => { setEditingAgent(null); setShowAddModal(true); }}
          className="w-full md:w-auto bg-slate-900 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-gold-600 transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-2 group"
        >
          <UserPlus size={16} className="group-hover:scale-110 transition-transform" /> Add New Agent
        </button>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          { label: "Total Agents", value: agents.length, icon: <User className="text-blue-500" />, bg: "bg-blue-50" },
          { label: "Active Now", value: agents.filter(a => a.status === 'Active').length, icon: <Check className="text-green-500" />, bg: "bg-green-50" },
          { label: "Pending Tasks", value: "3", icon: <Clock className="text-gold-500" />, bg: "bg-gold-50" },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className={`p-4 ${stat.bg} rounded-2xl`}>{stat.icon}</div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
              <p className="text-2xl font-black text-slate-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Agents Table */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 md:p-8 border-b border-slate-50 bg-slate-50/30">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search by name or email..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-6 py-3.5 bg-white border border-slate-200 rounded-2xl outline-none focus:border-gold-500 focus:ring-4 focus:ring-gold-500/5 transition-all text-sm font-medium"
              />
            </div>
            <div className="flex items-center gap-3 text-xs font-bold text-slate-400 uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              {filteredAgents.length} Agents Found
            </div>
          </div>
        </div>

        {/* Mobile View Card List (Visible below lg / 1024px) */}
        <div className="block lg:hidden p-4 sm:p-6 space-y-4 bg-slate-50/20">
          {filteredAgents.map((agent) => (
            <div key={agent._id} className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 overflow-hidden border border-slate-200 shadow-sm shrink-0">
                  {agent.avatar ? (
                    <img src={agent.avatar} alt={agent.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-100 flex items-center justify-center text-slate-400 font-black text-lg">
                      {getInitials(agent.name)}
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-black text-slate-900 text-base leading-tight truncate mb-1" title={agent.name}>{agent.name}</p>
                  <p className="text-[10px] font-bold text-gold-600 uppercase tracking-widest truncate">{agent.designation}</p>
                </div>
                <div className="flex gap-1.5 shrink-0">
                  <button onClick={() => openEditModal(agent)} className="p-2 text-slate-400 hover:text-gold-600 hover:bg-gold-50 border border-slate-100 rounded-xl transition-all">
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => deleteAgent(agent._id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 border border-slate-100 rounded-xl transition-all">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex flex-col gap-2.5 text-xs text-slate-600 font-medium">
                <div className="flex items-center gap-2 hover:text-gold-600 transition-colors">
                  <Mail size={14} className="text-slate-400 shrink-0" /> <span className="truncate">{agent.email}</span>
                </div>
                <div className="flex items-center gap-2 hover:text-gold-600 transition-colors">
                  <Phone size={14} className="text-slate-400 shrink-0" /> <span>{agent.phone}</span>
                </div>
                <div className="pt-2 flex justify-between items-center">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Account Status</span>
                  <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm border ${
                    agent.status === 'Active' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-slate-100 text-slate-500 border-slate-200'
                  }`}>
                    {agent.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
          {filteredAgents.length === 0 && (
            <div className="text-center py-16 text-slate-400">
              <User size={48} className="mx-auto mb-3 opacity-5" />
              <p className="font-bold uppercase tracking-[0.2em] text-xs">No team members found</p>
            </div>
          )}
        </div>

        {/* Desktop View Table (Visible only on lg / 1024px+) */}
        <div className="hidden lg:block overflow-x-auto custom-scrollbar">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Agent Details</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Contact Info</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Account Status</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredAgents.map((agent) => (
                <tr key={agent._id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 overflow-hidden border border-slate-200 shadow-sm shrink-0">
                        {agent.avatar ? (
                          <img src={agent.avatar} alt={agent.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-100 flex items-center justify-center text-slate-400 font-black text-lg">
                            {getInitials(agent.name)}
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-black text-slate-900 text-lg leading-tight mb-1">{agent.name}</p>
                        <p className="text-xs font-bold text-gold-600 uppercase tracking-widest">{agent.designation}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 text-sm text-slate-600 font-medium hover:text-gold-600 transition-colors">
                        <Mail size={14} className="text-slate-400" /> {agent.email}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600 font-medium hover:text-gold-600 transition-colors">
                        <Phone size={14} className="text-slate-400" /> {agent.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm border ${
                      agent.status === 'Active' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-slate-100 text-slate-500 border-slate-200'
                    }`}>
                      {agent.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-3 transition-all duration-300">
                      <button onClick={() => openEditModal(agent)} className="p-2 text-slate-400 hover:text-gold-600 hover:bg-gold-50 rounded-xl transition-all shadow-sm hover:shadow-gold-100 border border-transparent hover:border-gold-100">
                        <Edit2 size={18} />
                      </button>
                      <button onClick={() => deleteAgent(agent._id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all shadow-sm hover:shadow-red-100 border border-transparent hover:border-red-100">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredAgents.length === 0 && (
            <div className="text-center py-24 text-slate-400">
              <User size={64} className="mx-auto mb-4 opacity-5" />
              <p className="font-bold uppercase tracking-[0.2em] text-xs">No team members found</p>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md animate-fadeIn" onClick={closeModal}></div>
          
          <div className="bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden animate-slideUp flex flex-col max-h-[95vh]">
            <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-900 shrink-0 text-white">
              <div>
                <h3 className="text-xl font-black font-heading">
                  {editingAgent ? 'Edit Agent Profile' : 'Add New Team Member'}
                </h3>
                <p className="text-slate-400 text-[10px] uppercase font-black tracking-widest mt-1">
                  {editingAgent ? 'Update credentials for ' + editingAgent.name : 'Invite a new agent to the platform'}
                </p>
              </div>
              <button onClick={closeModal} className="p-2 hover:bg-white/10 rounded-full transition-all hover:rotate-90">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="px-8 py-8 overflow-y-auto custom-scrollbar flex-1 space-y-8">
              <div className="flex flex-col items-center gap-4">
                <div className="relative group">
                  <div className="w-32 h-32 rounded-3xl bg-slate-50 border-2 border-dashed border-slate-200 overflow-hidden flex items-center justify-center transition-all group-hover:border-gold-500 shadow-inner">
                    {formData.avatar ? (
                      <img src={formData.avatar} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <User size={48} className="text-slate-200 group-hover:text-gold-200 transition-colors" />
                    )}
                    <button 
                      type="button"
                      onClick={() => fileInputRef.current.click()}
                      className="absolute inset-0 bg-slate-900/40 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Camera size={24} />
                      <span className="text-[10px] font-black uppercase tracking-widest mt-1">Upload Photo</span>
                    </button>
                  </div>
                </div>
                <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*" />
                {!formData.avatar && <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">* System will generate initials if no photo uploaded.</p>}
              </div>

              <div className="space-y-6">
                <h4 className="text-[10px] font-black text-gold-600 uppercase tracking-[0.2em] flex items-center gap-3">
                  <span className="w-8 h-[1px] bg-gold-500"></span> Personal Identity
                </h4>
                
                <div className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                    <input 
                      type="text" 
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g. John Doe"
                      className="w-full px-6 py-4 bg-slate-50 border border-slate-300 rounded-2xl outline-none focus:border-gold-500 focus:bg-white focus:ring-4 focus:ring-gold-500/5 transition-all shadow-inner text-sm font-medium hover:border-slate-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Professional Designation</label>
                    <input 
                      type="text" 
                      name="designation"
                      required
                      value={formData.designation}
                      onChange={handleInputChange}
                      placeholder="e.g. Senior Property Consultant"
                      className="w-full px-6 py-4 bg-slate-50 border border-slate-300 rounded-2xl outline-none focus:border-gold-500 focus:bg-white focus:ring-4 focus:ring-gold-500/5 transition-all shadow-inner text-sm font-medium hover:border-slate-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Professional Bio</label>
                    <textarea 
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      placeholder="e.g. 20 years of experience in luxury real estate..."
                      rows="3"
                      className="w-full px-6 py-4 bg-slate-50 border border-slate-300 rounded-2xl outline-none focus:border-gold-500 focus:bg-white focus:ring-4 focus:ring-gold-500/5 transition-all shadow-inner text-sm font-medium resize-none hover:border-slate-400"
                    ></textarea>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h4 className="text-[10px] font-black text-gold-600 uppercase tracking-[0.2em] flex items-center gap-3">
                  <span className="w-8 h-[1px] bg-gold-500"></span> Communication
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                    <input 
                      type="email" 
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="john@bridl360.com"
                      className="w-full px-6 py-4 bg-slate-50 border border-slate-300 rounded-2xl outline-none focus:border-gold-500 focus:bg-white focus:ring-4 focus:ring-gold-500/5 transition-all shadow-inner text-sm font-medium hover:border-slate-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
                    <input 
                      type="tel" 
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+91 00000 00000"
                      className="w-full px-6 py-4 bg-slate-50 border border-slate-300 rounded-2xl outline-none focus:border-gold-500 focus:bg-white focus:ring-4 focus:ring-gold-500/5 transition-all shadow-inner text-sm font-medium hover:border-slate-400"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Account Status</label>
                <div className="flex gap-4">
                  {['Active', 'Inactive'].map(s => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, status: s }))}
                      className={`flex-1 py-3.5 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all border ${
                        formData.status === s 
                          ? 'bg-slate-900 text-white border-slate-900 shadow-xl shadow-slate-200' 
                          : 'bg-slate-50 text-slate-400 border-slate-100 hover:bg-slate-100'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 flex gap-4 shrink-0">
                <button 
                  type="button" 
                  onClick={closeModal} 
                  className="flex-1 py-4 font-black uppercase tracking-widest text-[10px] text-slate-400 hover:bg-slate-50 rounded-2xl transition-all border border-transparent hover:border-slate-100"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="flex-[2] py-4 font-black uppercase tracking-widest text-[10px] bg-gold-500 text-white rounded-2xl shadow-xl shadow-gold-100 hover:bg-gold-600 transition-all active:scale-[0.98] disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : (editingAgent ? 'Update Profile' : 'Create Account')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAgents;
