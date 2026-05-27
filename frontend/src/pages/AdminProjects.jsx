import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  MapPin, 
  Calendar, 
  CheckCircle2, 
  MoreVertical,
  X,
  Image as ImageIcon,
  ChevronDown,
  Loader2,
  Check
} from 'lucide-react';
import { useSite } from '../context/SiteContext';
import API from '../utils/api';

const AdminProjects = () => {
  const { siteData, refreshProjects } = useSite();
  const projects = siteData?.projects || [];
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    location: "",
    status: "Ongoing",
    image: "",
    images: [],
    description: "",
    features: [],
    brochure: ""
  });
  const fileInputRef = React.useRef(null);
  const brochureInputRef = React.useRef(null);
  const [newFeature, setNewFeature] = useState("");

  useEffect(() => {
    if (searchParams.get('add') === 'true') {
      openModal();
      // Clear the param so it doesn't reopen on refresh/back
      setSearchParams({}, { replace: true });
    }
  }, [searchParams]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ 
          ...prev, 
          image: reader.result,
          images: [reader.result]
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({
      ...prev,
      image: '',
      images: []
    }));
  };

  const statusOptions = [
    { value: 'Ongoing', label: 'Ongoing', color: 'bg-orange-600' },
    { value: 'Launching Soon', label: 'Launching Soon', color: 'bg-red-600' },
    { value: 'Completed', label: 'Completed', color: 'bg-green-600' }
  ];

  const openModal = (project = null) => {
    if (project) {
      setEditingProject(project);
      setFormData({
        title: project.title || project.name || "",
        location: project.location || "",
        status: project.status || "Ongoing",
        image: project.image || "",
        images: project.images || [],
        description: project.description || project.desc || "",
        features: project.features || [],
        brochure: project.brochure || project.brochureUrl || ""
      });
    } else {
      setEditingProject(null);
      setFormData({
        title: "",
        location: "",
        status: "Ongoing",
        image: "",
        images: [],
        description: "",
        features: [],
        brochure: ""
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProject(null);
    setIsStatusDropdownOpen(false);
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...(prev.features || []), newFeature.trim()]
      }));
      setNewFeature("");
    }
  };

  const removeFeature = (index) => {
    setFormData(prev => ({
      ...prev,
      features: (prev.features || []).filter((_, i) => i !== index)
    }));
  };

  const handleBrochureUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, brochure: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (editingProject) {
        await API.put(`/projects/${editingProject._id || editingProject.id}`, formData);
      } else {
        await API.post('/projects', formData);
      }
      await refreshProjects();
      closeModal();
    } catch (error) {
      console.error("Error saving project", error);
      alert("Failed to save project");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteProject = async (id) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        await API.delete(`/projects/${id}`);
        await refreshProjects();
      } catch (error) {
        console.error("Error deleting project", error);
      }
    }
  };

  const filteredProjects = projects.filter(p => 
    (p.title || p.name || "").toLowerCase().includes(searchTerm.toLowerCase()) || 
    (p.location || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-fadeIn">
      <div className="flex flex-col md:flex-row justify-between items-center md:items-start mb-10 gap-6 text-center md:text-left">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold font-heading text-slate-900 tracking-tight">Major Projects</h1>
          <p className="text-slate-500 mt-2 text-sm md:text-base">Add, edit or remove major projects from your elite portfolio.</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="w-full md:w-auto bg-slate-900 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-gold-600 transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-2"
        >
          <Plus size={16} /> Add New Project
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between gap-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search projects..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/10 transition-all text-sm hover:border-slate-400"
            />
          </div>
          <div className="flex items-center gap-4 text-sm text-slate-500">
            <span>Total Projects: <span className="font-bold text-slate-900">{projects.length}</span></span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-slate-500 font-bold text-xs uppercase tracking-wider">
                <th className="px-6 py-4">Project</th>
                <th className="px-6 py-4">Location</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Description</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProjects.map((proj) => (
                <tr key={proj.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                        <img src={proj.image} alt={proj.name} className="w-full h-full object-cover" />
                      </div>
                      <span className="font-bold text-slate-900">{proj.title || proj.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-slate-600 text-sm">
                      <MapPin size={14} className="text-slate-400" />
                      {proj.location}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider whitespace-nowrap ${
                      proj.status === 'Completed' ? 'bg-green-600 text-white shadow-sm' : 
                      proj.status === 'Ongoing' ? 'bg-orange-600 text-white shadow-sm' : 
                      'bg-red-600 text-white shadow-sm'
                    }`}>
                      {proj.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 max-w-xs">
                    <p className="text-sm text-slate-500 line-clamp-1">{proj.description || proj.desc}</p>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => openModal(proj)}
                        className="p-2 text-slate-400 hover:text-gold-600 hover:bg-gold-50 rounded-lg transition-all"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => deleteProject(proj._id || proj.id)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredProjects.length === 0 && (
            <div className="text-center py-20 text-slate-400">
              <ImageIcon size={48} className="mx-auto mb-4 opacity-20" />
              <p>No projects found matching your search.</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md animate-fadeIn" onClick={closeModal}></div>
          
          <div className="bg-white w-full max-w-5xl rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden animate-slideUp flex flex-col max-h-[95vh]">
            <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 shrink-0">
              <h3 className="text-xl font-black text-slate-900 font-heading">
                {editingProject ? 'Edit Project' : 'Add New Project'}
              </h3>
              <button onClick={closeModal} className="p-2 hover:bg-slate-200 rounded-full transition-all text-slate-400 hover:rotate-90">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="px-8 py-8 overflow-y-auto custom-scrollbar flex-1">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                
                {/* Left Column: Details */}
                <div className="lg:col-span-7 space-y-8">
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black text-gold-600 uppercase tracking-[0.2em] flex items-center gap-3">
                      <span className="w-8 h-[1px] bg-gold-500"></span> Project Information
                    </h4>
                    
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Project Name</label>
                        <input 
                          type="text"
                          name="title"
                          value={formData.title}
                          onChange={handleInputChange}
                          required
                          placeholder="e.g. Aura Prime"
                          className="w-full px-6 py-4 bg-slate-50 border border-slate-300 rounded-2xl outline-none focus:border-gold-500 focus:bg-white focus:ring-4 focus:ring-gold-500/5 transition-all shadow-inner text-sm font-medium hover:border-slate-450"
                        />
                      </div>
 
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Location</label>
                          <input 
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleInputChange}
                            required
                            placeholder="e.g. Gachibowli"
                            className="w-full px-6 py-4 bg-slate-50 border border-slate-300 rounded-2xl outline-none focus:border-gold-500 focus:bg-white focus:ring-4 focus:ring-gold-500/5 transition-all shadow-inner text-sm font-medium hover:border-slate-450"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Current Status</label>
                          <div className="relative">
                            <button
                              type="button"
                              onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                              className="w-full px-6 py-4 bg-slate-50 border border-slate-300 rounded-2xl outline-none focus:border-gold-500 focus:bg-white focus:ring-4 focus:ring-gold-500/5 transition-all shadow-inner flex items-center justify-between group hover:border-slate-450"
                            >
                              <div className="flex items-center gap-3">
                                <div className={`w-2.5 h-2.5 rounded-full ${statusOptions.find(opt => opt.value === formData.status)?.color} shadow-sm`}></div>
                                <span className="font-bold text-slate-700 text-sm">{formData.status}</span>
                              </div>
                              <ChevronDown size={18} className={`text-slate-400 transition-transform duration-300 ${isStatusDropdownOpen ? 'rotate-180' : ''}`} />
                            </button>
 
                            {isStatusDropdownOpen && (
                              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200 py-2 z-50 animate-fadeIn">
                                {statusOptions.map((opt) => (
                                  <button
                                    key={opt.value}
                                    type="button"
                                    onClick={() => {
                                      setFormData({ ...formData, status: opt.value });
                                      setIsStatusDropdownOpen(false);
                                    }}
                                    className="w-full px-6 py-3 hover:bg-slate-50 flex items-center justify-between group transition-colors"
                                  >
                                    <div className="flex items-center gap-3">
                                      <div className={`w-2.5 h-2.5 rounded-full ${opt.color}`}></div>
                                      <span className={`font-bold text-sm ${formData.status === opt.value ? 'text-gold-600' : 'text-slate-600'}`}>{opt.label}</span>
                                    </div>
                                    {formData.status === opt.value && <Check size={16} className="text-gold-500" />}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
 
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black text-gold-600 uppercase tracking-[0.2em] flex items-center gap-3">
                      <span className="w-8 h-[1px] bg-gold-500"></span> Detailed Description
                    </h4>
                    <textarea 
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                      rows="4"
                      placeholder="Describe the project..."
                      className="w-full px-6 py-5 bg-slate-50 border border-slate-300 rounded-2xl outline-none focus:border-gold-500 focus:bg-white focus:ring-4 focus:ring-gold-500/5 transition-all shadow-inner resize-none text-sm font-medium hover:border-slate-450"
                    ></textarea>
                  </div>
 
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black text-gold-600 uppercase tracking-[0.2em] flex items-center gap-3">
                      <span className="w-8 h-[1px] bg-gold-500"></span> Key Highlights & Features
                    </h4>
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <input 
                          type="text"
                          value={newFeature}
                          onChange={(e) => setNewFeature(e.target.value)}
                          placeholder="e.g. Smart Integrated Systems"
                          className="flex-1 px-6 py-4 bg-slate-50 border border-slate-300 rounded-2xl outline-none focus:border-gold-500 focus:bg-white focus:ring-4 focus:ring-gold-500/5 transition-all text-sm hover:border-slate-450"
                        />
                        <button 
                          type="button"
                          onClick={addFeature}
                          className="px-6 bg-slate-900 text-white rounded-2xl hover:bg-gold-500 transition-all shadow-lg active:scale-95"
                        >
                          <Plus size={20} />
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {formData.features?.map((feat, idx) => (
                          <div key={idx} className="flex items-center gap-2 bg-gold-50 text-gold-700 px-4 py-2 rounded-xl border border-gold-100 text-xs font-bold uppercase tracking-wider">
                            {feat}
                            <button type="button" onClick={() => removeFeature(idx)} className="text-gold-400 hover:text-red-500 transition-colors">
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column: Project Cover Image */}
                <div className="lg:col-span-5 space-y-8">
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black text-gold-600 uppercase tracking-[0.2em] flex items-center gap-3">
                      <span className="w-8 h-[1px] bg-gold-500"></span> Project Cover Image
                    </h4>
                    
                    <div className="bg-slate-50 p-5 rounded-[2rem] border border-slate-100 shadow-inner">
                      {formData.image ? (
                        <div className="relative group rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-sm aspect-video">
                          <img src={formData.image} alt="Project Cover" className="w-full h-full object-cover" />
                          <button 
                            type="button"
                            onClick={handleRemoveImage}
                            className="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-lg hover:scale-110 flex items-center justify-center"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ) : (
                        <button 
                          type="button"
                          onClick={() => fileInputRef.current.click()}
                          className="w-full flex flex-col items-center justify-center bg-white rounded-2xl border-2 border-dashed border-slate-200 aspect-video group hover:border-gold-300 hover:bg-gold-50/30 transition-all gap-2"
                        >
                          <Plus size={28} className="text-slate-400 group-hover:text-gold-500 transition-colors" />
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Upload Project Image</span>
                        </button>
                      )}
                      <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*" />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black text-gold-600 uppercase tracking-[0.2em] flex items-center gap-3">
                      <span className="w-8 h-[1px] bg-gold-500"></span> Project Brochure (PDF)
                    </h4>
                    <div 
                      className={`p-6 rounded-[2rem] border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center gap-3 ${
                        formData.brochure ? 'bg-green-50 border-green-200' : 'bg-slate-50 border-slate-200 hover:border-gold-300 hover:bg-gold-50/20'
                      }`}
                      onClick={() => brochureInputRef.current.click()}
                    >
                      {formData.brochure ? (
                        <>
                          <div className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center shadow-lg">
                            <Check size={24} />
                          </div>
                          <span className="text-[10px] font-black text-green-600 uppercase tracking-widest">Brochure Uploaded</span>
                          <button type="button" onClick={(e) => { e.stopPropagation(); setFormData({...formData, brochure: ''}); }} className="text-[8px] text-red-500 font-bold uppercase underline">Remove</button>
                        </>
                      ) : (
                        <>
                          <div className="w-12 h-12 bg-white text-slate-300 rounded-full flex items-center justify-center shadow-sm border border-slate-100">
                            <Plus size={24} />
                          </div>
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Click to Upload PDF</span>
                        </>
                      )}
                    </div>
                    <input type="file" ref={brochureInputRef} onChange={handleBrochureUpload} className="hidden" accept=".pdf" />
                  </div>
                </div>
              </div>

              <div className="mt-10 pt-8 border-t border-slate-100 flex gap-4 shrink-0">
                <button 
                  type="button"
                  onClick={closeModal}
                  className="flex-1 bg-slate-100 text-slate-500 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-200 transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isLoading}
                  className="flex-[2] bg-slate-900 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-gold-600 transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-3 disabled:opacity-70 group"
                >
                  {isLoading ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    <>
                      {editingProject ? 'Update Portfolio' : 'Publish Project'}
                      <CheckCircle2 size={20} className="group-hover:scale-110 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProjects;
