import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Phone, Mail, CheckCircle, Clock, Trash2, Loader2, MessageSquare, AlertTriangle, X, Calendar } from 'lucide-react';
import CustomSelect from '../components/CustomSelect';
import API from '../utils/api';
import { useSite } from '../context/SiteContext';

const AdminLeads = () => {
  const { siteData, refreshLeads } = useSite();
  const leads = siteData?.leads || [];
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState('all');

  const [showToast, setShowToast] = useState(false);
  const [errorToast, setErrorToast] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedLeadId, setSelectedLeadId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const init = async () => {
      await refreshLeads();
      setLoading(false);
    };
    init();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'New': return 'bg-blue-50 text-blue-600';
      case 'Contacted': return 'bg-yellow-50 text-yellow-600';
      case 'Closed': return 'bg-green-50 text-green-600';
      default: return 'bg-slate-50 text-slate-600';
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await API.put(`/leads/${id}/status`, { status: newStatus });
      await refreshLeads(); // Sync global state
    } catch (error) {
      console.error("Error updating lead status", error);
      alert("Failed to update status. Please check your connection.");
    }
  };

  const triggerDeleteConfirm = (id) => {
    setSelectedLeadId(id);
    setShowDeleteModal(true);
  };

  const confirmDeleteLead = async () => {
    if (!selectedLeadId) return;
    setIsDeleting(true);
    setErrorToast(null);
    try {
      await API.delete(`/leads/${selectedLeadId}`);
      await refreshLeads();
      setShowDeleteModal(false);
      setSelectedLeadId(null);
      
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (error) {
      console.error("Error deleting lead", error);
      const errMsg = error.response?.data?.message || error.message || "Failed to delete lead";
      setErrorToast(errMsg);
      setTimeout(() => setErrorToast(null), 5000);
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = 
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.phone.includes(searchTerm);
    
    const matchesStatus = filterStatus === 'all' || lead.status.toLowerCase() === filterStatus.toLowerCase();
    
    return matchesSearch && matchesStatus;
  });

  const stats = {
    new: leads.filter(l => l.status === 'New').length,
    contacted: leads.filter(l => l.status === 'Contacted').length,
    closed: leads.filter(l => l.status === 'Closed').length
  };

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
          <h1 className="text-3xl md:text-4xl font-bold font-heading text-slate-900 tracking-tight">Lead Management</h1>
          <p className="text-slate-500 mt-2 text-sm md:text-base">Track and manage customer inquiries and site visit requests.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
         <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-slate-100 flex items-center gap-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
            <div className="p-5 bg-blue-50 rounded-2xl text-blue-500 group-hover:scale-110 transition-transform"><Clock size={28} /></div>
            <div>
              <p className="text-slate-500 font-bold text-xs uppercase tracking-[0.2em] mb-1">New Leads</p>
              <h3 className="text-3xl font-black text-slate-900">{stats.new}</h3>
            </div>
         </div>
         <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-slate-100 flex items-center gap-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
            <div className="p-5 bg-yellow-50 rounded-2xl text-yellow-500 group-hover:scale-110 transition-transform"><Phone size={28} /></div>
            <div>
              <p className="text-slate-500 font-bold text-xs uppercase tracking-[0.2em] mb-1">In Progress</p>
              <h3 className="text-3xl font-black text-slate-900">{stats.contacted}</h3>
            </div>
         </div>
         <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-slate-100 flex items-center gap-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
            <div className="p-5 bg-green-50 rounded-2xl text-green-500 group-hover:scale-110 transition-transform"><CheckCircle size={28} /></div>
            <div>
              <p className="text-slate-500 font-bold text-xs uppercase tracking-[0.2em] mb-1">Closed</p>
              <h3 className="text-3xl font-black text-slate-900">{stats.closed}</h3>
            </div>
         </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {/* Toolbar */}
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between gap-4">
          <div className="flex bg-slate-50 rounded-xl px-4 py-2 items-center flex-1 max-w-md border border-transparent focus-within:border-gold-500 focus-within:bg-white transition-all">
            <Search size={18} className="text-slate-400 mr-2" />
            <input 
              type="text" 
              placeholder="Search by name, email or phone..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent outline-none text-slate-700 w-full text-sm" 
            />
          </div>
          <div className="flex gap-2">
             <CustomSelect 
                name="filterStatus"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                options={[
                  { label: "All Statuses", value: "all" },
                  { label: "New", value: "New" },
                  { label: "Contacted", value: "Contacted" },
                  { label: "Closed", value: "Closed" }
                ]}
                className="px-4 py-2 bg-slate-50 text-slate-600 rounded-xl border border-transparent hover:bg-slate-100 transition-colors w-40 text-sm font-medium"
             />
          </div>
        </div>

        {/* Table View (Desktop Only) */}
        <div className="hidden md:block overflow-x-auto custom-scrollbar">
          <table className="w-full text-left whitespace-nowrap">
            <thead className="bg-slate-50/50 text-slate-500 font-bold text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Lead Detail</th>
                <th className="px-6 py-4">Contact Info</th>
                <th className="px-6 py-4">Property Interest</th>
                <th className="px-6 py-4">Client Message</th>
                <th className="px-6 py-4">Submitted At</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLeads.map((lead) => (
                <tr key={lead._id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-800">{lead.name}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] text-slate-400 uppercase font-black tracking-widest">{lead._id.substring(lead._id.length-6)}</span>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest ${
                        lead.type === 'Site Visit' ? 'bg-orange-50 text-orange-600 border border-orange-100/50' : 'bg-slate-100 text-slate-600 border border-slate-200/50'
                      }`}>
                        {lead.type}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                     <div className="flex flex-col gap-1 text-sm text-slate-600">
                        <a href={`mailto:${lead.email}`} className="flex items-center gap-2 hover:text-gold-600 transition-colors"><Mail size={14} className="text-slate-400 shrink-0"/> {lead.email}</a>
                        <a href={`tel:${lead.phone}`} className="flex items-center gap-2 hover:text-gold-600 transition-colors"><Phone size={14} className="text-slate-400 shrink-0"/> {lead.phone}</a>
                     </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-slate-800 font-semibold text-sm">
                      {typeof lead.property === 'object' ? lead.property?.title : (lead.property || 'General Inquiry')}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 max-w-[280px] whitespace-normal break-words text-xs text-slate-600 leading-relaxed shadow-sm">
                      {lead.message || <span className="text-slate-400 italic">No message provided.</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-0.5 text-xs text-slate-600 font-medium">
                      <span className="flex items-center gap-1.5 text-slate-800 font-semibold">
                        <Calendar size={13} className="text-gold-500" />
                        {new Date(lead.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </span>
                      <span className="flex items-center gap-1.5 text-slate-400 text-[11px] pl-[19px]">
                        <Clock size={11} className="text-slate-300" />
                        {new Date(lead.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${getStatusColor(lead.status)}`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <CustomSelect 
                          name={`status-${lead._id}`}
                          value={lead.status}
                          onChange={(e) => handleStatusChange(lead._id, e.target.value)}
                          options={[
                            { label: "New", value: "New" },
                            { label: "Contacted", value: "Contacted" },
                            { label: "Closed", value: "Closed" }
                          ]}
                          className="px-3 py-1.5 bg-slate-50 text-slate-700 rounded-lg border border-slate-200 text-xs w-32 ml-auto"
                      />
                      <button 
                        onClick={() => triggerDeleteConfirm(lead._id)}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-100"
                        title="Delete Lead"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredLeads.length === 0 && (
            <div className="text-center py-20 text-slate-400">
              <MessageSquare size={48} className="mx-auto mb-4 opacity-10" />
              <p className="font-medium">No leads found in this category.</p>
            </div>
          )}
        </div>

        {/* Card View (Mobile & Tablet Only) */}
        <div className="block md:hidden p-4 space-y-4">
          {filteredLeads.map((lead) => (
            <div key={lead._id} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col gap-4 relative">
              {/* Card Header */}
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-slate-800 text-base">{lead.name}</h4>
                  <span className="text-[10px] text-slate-400 uppercase font-black tracking-widest">{lead._id.substring(lead._id.length-6)}</span>
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${
                    lead.type === 'Site Visit' ? 'bg-orange-50 text-orange-600 border border-orange-100/50' : 'bg-slate-100 text-slate-600 border border-slate-200/50'
                  }`}>
                    {lead.type}
                  </span>
                  <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${getStatusColor(lead.status)}`}>
                    {lead.status}
                  </span>
                </div>
              </div>

              {/* Card Body - Content */}
              <div className="space-y-3.5 text-sm text-slate-600">
                {/* Contact info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-3 border-t border-slate-50">
                  <a href={`mailto:${lead.email}`} className="flex items-center gap-2 hover:text-gold-600 transition-colors text-xs">
                    <Mail size={14} className="text-slate-400 shrink-0" />
                    {lead.email}
                  </a>
                  <a href={`tel:${lead.phone}`} className="flex items-center gap-2 hover:text-gold-600 transition-colors text-xs">
                    <Phone size={14} className="text-slate-400 shrink-0" />
                    {lead.phone}
                  </a>
                </div>

                {/* Property interest */}
                <div className="pt-3 border-t border-slate-50 text-xs">
                  <span className="text-slate-400 block font-medium mb-1">Property Interest:</span>
                  <span className="font-semibold text-slate-800">
                    {typeof lead.property === 'object' ? lead.property?.title : (lead.property || 'General Inquiry')}
                  </span>
                </div>

                {/* Client Message block */}
                <div className="pt-3 border-t border-slate-50">
                  <span className="text-slate-400 block text-xs font-medium mb-1.5">Client Description:</span>
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-xs text-slate-600 leading-relaxed italic whitespace-pre-wrap break-words">
                    {lead.message || <span className="text-slate-300 italic">No message provided.</span>}
                  </div>
                </div>

                {/* Time & Date Footer */}
                <div className="pt-3 border-t border-slate-50 flex items-center gap-4 text-[11px] text-slate-400 font-medium">
                  <span className="flex items-center gap-1.5">
                    <Calendar size={12} className="text-gold-500" />
                    {new Date(lead.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock size={12} className="text-gold-500" />
                    {new Date(lead.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}
                  </span>
                </div>
              </div>

              {/* Card Footer - Actions */}
              <div className="flex items-center justify-between gap-3 pt-3.5 border-t border-slate-100 mt-1">
                <CustomSelect 
                    name={`status-mobile-${lead._id}`}
                    value={lead.status}
                    onChange={(e) => handleStatusChange(lead._id, e.target.value)}
                    options={[
                      { label: "New", value: "New" },
                      { label: "Contacted", value: "Contacted" },
                      { label: "Closed", value: "Closed" }
                    ]}
                    className="px-3 py-1.5 bg-slate-50 text-slate-700 rounded-lg border border-slate-200 text-xs w-32"
                />
                <button 
                  onClick={() => triggerDeleteConfirm(lead._id)}
                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                  title="Delete Lead"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
          {filteredLeads.length === 0 && (
            <div className="text-center py-20 text-slate-400 bg-white border border-slate-100 rounded-2xl">
              <MessageSquare size={48} className="mx-auto mb-4 opacity-10" />
              <p className="font-medium">No leads found in this category.</p>
            </div>
          )}
        </div>
      </div>

      {/* Custom Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={() => !isDeleting && setShowDeleteModal(false)}
            />

            {/* Modal Body */}
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-[2rem] p-8 shadow-2xl border border-slate-100 z-10"
            >
              <button 
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
                className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all disabled:opacity-50"
              >
                <X size={20} />
              </button>

              <div className="w-14 h-14 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center text-red-500 mb-6">
                <AlertTriangle size={28} />
              </div>

              <h3 className="text-xl font-bold text-slate-900 font-serif mb-2">Delete Lead Listing</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-8">
                Are you absolutely sure you want to permanently delete this lead? This action is irreversible and will remove all associated contact inquiries from the system.
              </p>

              <div className="flex gap-4">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  disabled={isDeleting}
                  className="flex-1 py-4 bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold rounded-2xl transition-all text-sm cursor-pointer disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteLead}
                  disabled={isDeleting}
                  className="flex-1 py-4 bg-red-500 hover:bg-red-600 text-white font-bold rounded-2xl transition-all text-sm cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="animate-spin" size={16} />
                      Deleting...
                    </>
                  ) : (
                    'Delete Lead'
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
              <div className="text-xs text-slate-300 mt-0.5">Lead removed successfully!</div>
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

export default AdminLeads;
