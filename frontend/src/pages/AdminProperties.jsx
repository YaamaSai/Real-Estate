import React, { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Plus, Edit2, Trash2, Search, Filter, X, Eye, Upload, Image as ImageIcon, MapPin, CheckCircle } from 'lucide-react';
import CustomSelect from '../components/CustomSelect';
import { useSite } from '../context/SiteContext';
import API from '../utils/api';

const AdminProperties = () => {
  const { siteData, refreshProperties } = useSite();
  const properties = siteData?.properties || [];
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);
  const [viewingProperty, setViewingProperty] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (searchParams.get('add') === 'true') {
      handleOpenModal();
      setSearchParams({}, { replace: true });
    }
  }, [searchParams]);

  const [formData, setFormData] = useState({
    title: '', location: '', price: '', category: 'Luxury', type: 'Villa',
    bedrooms: '', bathrooms: '', area: '', image: '', status: 'Available',
    description: '', amenities: []
  });

  const availableAmenities = [
    "Swimming Pool", "Gym", "Club House", "Power Backup", "Car Parking", 
    "Security", "Garden", "Kids Play Area", "Jogging Track", "Intercom"
  ];

  const handleOpenModal = (property = null) => {
    if (property) {
      setEditingProperty(property);
      setFormData({ ...property, amenities: property.amenities || [] });
    } else {
      setEditingProperty(null);
      setFormData({
        title: '', location: '', price: '', category: 'Luxury', type: 'Villa',
        bedrooms: '', bathrooms: '', area: '', image: '', status: 'Available',
        description: '', amenities: []
      });
    }
    setIsModalOpen(true);
  };

  const handleOpenViewModal = (property) => {
    setViewingProperty(property);
    setIsViewModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProperty(null);
  };

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setViewingProperty(null);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAmenityToggle = (amenity) => {
    const current = formData.amenities || [];
    if (current.includes(amenity)) {
      setFormData({ ...formData, amenities: current.filter(a => a !== amenity) });
    } else {
      setFormData({ ...formData, amenities: [...current, amenity] });
    }
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      files.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFormData(prev => {
            const newImages = [...(prev.images || []), reader.result];
            return { 
              ...prev, 
              images: newImages,
              image: newImages[0] // Set first image as primary
            };
          });
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleRemoveImage = (index) => {
    setFormData(prev => {
      const newImages = prev.images.filter((_, i) => i !== index);
      return {
        ...prev,
        images: newImages,
        image: newImages.length > 0 ? newImages[0] : ''
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingProperty) {
        await API.put(`/properties/${editingProperty._id || editingProperty.id}`, formData);
      } else {
        await API.post('/properties', formData);
      }
      await refreshProperties();
      handleCloseModal();
    } catch (error) {
      console.error("Error saving property", error);
      alert("Failed to save property");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    console.log("Attempting to delete property with ID:", id);
    if (!id) {
      alert("Error: Property ID missing");
      return;
    }
    
    if(window.confirm("Are you sure you want to delete this property?")) {
      try {
        await API.delete(`/properties/${id}`);
        await refreshProperties();
      } catch (error) {
        console.error("Error deleting property", error);
        alert("Failed to delete property: " + (error.response?.data?.message || error.message));
      }
    }
  };

  const filteredProperties = properties.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-fadeIn">
      <div className="flex flex-col md:flex-row justify-between items-center md:items-start mb-10 gap-6 text-center md:text-left">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold font-heading text-slate-900 tracking-tight">Manage Properties</h1>
          <p className="text-slate-500 mt-2 text-sm md:text-base">Track, edit, and manage all your property listings in one place.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()} 
          className="w-full md:w-auto bg-slate-900 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-gold-600 transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-2"
        >
          <Plus size={16} /> Add New Property
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {/* Toolbar */}
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between gap-4">
          <div className="flex bg-slate-50 rounded-xl px-4 py-2 items-center flex-1 max-w-md">
            <Search size={18} className="text-slate-400 mr-2" />
            <input 
              type="text" 
              placeholder="Search properties..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent outline-none text-slate-700 w-full" 
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-600 rounded-xl hover:bg-slate-100 transition-colors">
            <Filter size={18} /> Filter
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full min-w-[900px] text-left">
            <thead className="bg-slate-50 text-slate-500 font-medium">
              <tr>
                <th className="px-6 py-4 w-1/3">Property</th>
                <th className="px-6 py-4">Tags (Cat/Type)</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Details</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProperties.map((prop) => (
                <tr key={prop._id || prop.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <img src={prop.image || "https://via.placeholder.com/150"} alt={prop.title} className="w-16 h-12 rounded-lg object-cover bg-slate-200 shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-slate-800 truncate">{prop.title}</p>
                        <p className="text-sm text-slate-500 truncate">{prop.location}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex gap-2">
                      <span className="px-2 py-1 bg-gold-100 text-gold-700 text-xs font-bold rounded">{prop.category}</span>
                      <span className="px-2 py-1 bg-slate-800 text-white text-xs font-bold rounded">{prop.type}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-800 whitespace-nowrap">{prop.price}</td>
                  <td className="px-6 py-4 text-sm text-slate-600 whitespace-nowrap">
                    {prop.bedrooms} Bed • {prop.bathrooms} Bath • {prop.area}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                      prop.status === 'Available' ? 'bg-green-50 text-green-600' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {prop.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right whitespace-nowrap">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => handleOpenViewModal(prop)} className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors" title="View Details">
                        <Eye size={18} />
                      </button>
                      <button onClick={() => handleOpenModal(prop)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors" title="Edit">
                        <Edit2 size={18} />
                      </button>
                      <button onClick={() => handleDelete(prop._id || prop.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
          <div className="fixed inset-0" onClick={handleCloseModal}></div>
          <div className="bg-white rounded-[2rem] w-full max-w-5xl shadow-2xl flex flex-col max-h-[95vh] relative z-10 animate-slideUp">
            <div className="flex justify-between items-center px-8 py-5 border-b border-slate-100 shrink-0 bg-slate-50/50">
              <h2 className="text-xl font-black font-heading text-slate-900">{editingProperty ? 'Edit Property' : 'Add New Property'}</h2>
              <button onClick={handleCloseModal} className="p-2 text-slate-400 hover:bg-slate-200 rounded-full transition-all hover:rotate-90"><X size={20} /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="px-8 py-6 overflow-y-auto flex-1 custom-scrollbar">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Left Column: Details */}
                <div className="lg:col-span-7 space-y-6">
                  <div className="space-y-4">
                    <h3 className="font-black text-sm uppercase tracking-widest text-gold-600 flex items-center gap-2">
                      <span className="w-6 h-[1px] bg-gold-500"></span> Basic Details
                    </h3>
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5 ml-1">Property Title</label>
                        <input type="text" name="title" value={formData.title} onChange={handleInputChange} required className="w-full px-5 py-3 bg-slate-50 border border-slate-300 rounded-2xl focus:border-gold-500 focus:bg-white focus:ring-4 focus:ring-gold-500/5 outline-none transition-all shadow-inner text-sm hover:border-slate-450" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5 ml-1">Price (e.g., ₹4.5 Cr)</label>
                          <input type="text" name="price" value={formData.price} onChange={handleInputChange} required className="w-full px-5 py-3 bg-slate-50 border border-slate-300 rounded-2xl focus:border-gold-500 focus:bg-white focus:ring-4 focus:ring-gold-500/5 outline-none transition-all shadow-inner text-sm hover:border-slate-450" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5 ml-1">Status</label>
                          <CustomSelect name="status" value={formData.status} onChange={handleInputChange} options={["Available", "Sold", "Under Construction"]} className="w-full" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5 ml-1">Location / Address</label>
                        <input type="text" name="location" value={formData.location} onChange={handleInputChange} required className="w-full px-5 py-3 bg-slate-50 border border-slate-300 rounded-2xl focus:border-gold-500 focus:bg-white focus:ring-4 focus:ring-gold-500/5 outline-none transition-all shadow-inner text-sm hover:border-slate-450" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-black text-sm uppercase tracking-widest text-gold-600 flex items-center gap-2">
                      <span className="w-6 h-[1px] bg-gold-500"></span> Specifications
                    </h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5 ml-1">Bedrooms</label>
                        <input type="number" name="bedrooms" value={formData.bedrooms} onChange={handleInputChange} className="w-full px-5 py-3 bg-slate-50 border border-slate-300 rounded-2xl focus:border-gold-500 focus:bg-white focus:ring-4 focus:ring-gold-500/5 outline-none transition-all shadow-inner text-sm hover:border-slate-450" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5 ml-1">Bathrooms</label>
                        <input type="number" name="bathrooms" value={formData.bathrooms} onChange={handleInputChange} className="w-full px-5 py-3 bg-slate-50 border border-slate-300 rounded-2xl focus:border-gold-500 focus:bg-white focus:ring-4 focus:ring-gold-500/5 outline-none transition-all shadow-inner text-sm hover:border-slate-450" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5 ml-1">Area</label>
                        <input type="text" name="area" value={formData.area} onChange={handleInputChange} className="w-full px-5 py-3 bg-slate-50 border border-slate-300 rounded-2xl focus:border-gold-500 focus:bg-white focus:ring-4 focus:ring-gold-500/5 outline-none transition-all shadow-inner text-sm hover:border-slate-450" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-black text-sm uppercase tracking-widest text-gold-600 flex items-center gap-2">
                      <span className="w-6 h-[1px] bg-gold-500"></span> Description
                    </h3>
                    <textarea 
                      name="description" 
                      value={formData.description} 
                      onChange={handleInputChange} 
                      rows={4} 
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-300 rounded-2xl focus:border-gold-500 focus:bg-white focus:ring-4 focus:ring-gold-500/5 outline-none transition-all shadow-inner text-sm resize-none hover:border-slate-450"
                      placeholder="Write detailed property description here..."
                    ></textarea>
                  </div>
                </div>

                {/* Right Column: Media & Amenities */}
                <div className="lg:col-span-5 space-y-6">
                  <div className="space-y-4">
                    <h3 className="font-black text-sm uppercase tracking-widest text-gold-600 flex items-center gap-2">
                      <span className="w-6 h-[1px] bg-gold-500"></span> Media Gallery
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100 shadow-inner">
                      {formData.images?.map((img, idx) => (
                        <div key={idx} className="relative group aspect-square rounded-xl overflow-hidden border border-slate-200 bg-white">
                          <img src={img} alt={`property-${idx}`} className="w-full h-full object-cover" />
                          {idx === 0 && (
                            <div className="absolute top-1.5 left-1.5 px-2 py-0.5 bg-gold-500 text-white text-[8px] font-black rounded uppercase shadow-lg">Main</div>
                          )}
                          <button 
                            type="button"
                            onClick={() => handleRemoveImage(idx)}
                            className="absolute top-1.5 right-1.5 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-lg hover:scale-110"
                          >
                            <X size={10} />
                          </button>
                        </div>
                      ))}
                      <button 
                        type="button"
                        onClick={() => fileInputRef.current.click()}
                        className="flex flex-col items-center justify-center bg-white rounded-xl border-2 border-dashed border-slate-200 aspect-square group hover:border-gold-300 hover:bg-gold-50/30 transition-all"
                      >
                        <Upload size={20} className="text-slate-300 group-hover:text-gold-500 mb-1" />
                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Add Photos</span>
                      </button>
                    </div>
                    <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*" multiple />
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest italic px-1">* First image will be used as the main card view.</p>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-black text-sm uppercase tracking-widest text-gold-600 flex items-center gap-2">
                      <span className="w-6 h-[1px] bg-gold-500"></span> Amenities
                    </h3>
                    <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100 shadow-inner max-h-48 overflow-y-auto custom-scrollbar">
                      {availableAmenities.map((amenity) => (
                        <label key={amenity} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white cursor-pointer transition-all border border-transparent has-[:checked]:border-gold-200 has-[:checked]:bg-white has-[:checked]:shadow-sm">
                          <input 
                            type="checkbox" 
                            className="w-4 h-4 rounded border-slate-300 text-gold-500 focus:ring-gold-500" 
                            checked={formData.amenities?.includes(amenity)}
                            onChange={() => handleAmenityToggle(amenity)}
                          />
                          <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wide">{amenity}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5 ml-1">Category</label>
                      <CustomSelect name="category" value={formData.category} onChange={handleInputChange} options={["Luxury", "Budget", "Commercial"]} className="w-full" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5 ml-1">Type</label>
                      <CustomSelect name="type" value={formData.type} onChange={handleInputChange} options={["Villa", "Apartment", "Plot", "Office"]} className="w-full" />
                    </div>
                  </div>
                </div>

              </div>

              <div className="mt-10 pt-6 border-t border-slate-100 flex justify-end gap-4 shrink-0">
                <button type="button" onClick={handleCloseModal} className="px-8 py-3 rounded-2xl border border-slate-200 font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 transition-all text-xs">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="bg-slate-900 text-white hover:bg-gold-600 px-10 py-3 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-slate-200 transition-all text-xs disabled:opacity-50">
                  {isSubmitting ? 'Saving...' : (editingProperty ? 'Update Property' : 'Create Property')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Details Modal */}
      {isViewModalOpen && viewingProperty && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="relative h-72 shrink-0">
              <img src={viewingProperty.image} alt={viewingProperty.title} className="w-full h-full object-cover" />
              <button onClick={handleCloseViewModal} className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-md text-white hover:bg-white/40 rounded-full transition-colors"><X size={20} /></button>
              <div className="absolute bottom-4 left-4 flex gap-2">
                <span className="px-4 py-1.5 bg-gold-500 text-white text-xs font-bold rounded-full shadow-lg uppercase tracking-wider">{viewingProperty.category}</span>
                <span className="px-4 py-1.5 bg-slate-900 text-white text-xs font-bold rounded-full shadow-lg uppercase tracking-wider">{viewingProperty.type}</span>
              </div>
            </div>
            
            <div className="p-8 overflow-y-auto custom-scrollbar">
              <div className="flex justify-between items-start mb-6">
                <div className="max-w-[70%]">
                  <h2 className="text-3xl font-bold font-heading text-slate-900 mb-2 leading-tight">{viewingProperty.title}</h2>
                  <p className="text-slate-500 flex items-center gap-2"><MapPin size={16} className="text-gold-500" /> {viewingProperty.location}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gold-600">{viewingProperty.price}</p>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{viewingProperty.status}</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-slate-50 p-4 rounded-2xl text-center border border-slate-100">
                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-1">Bedrooms</p>
                  <p className="text-xl font-bold text-slate-800">{viewingProperty.bedrooms}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl text-center border border-slate-100">
                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-1">Bathrooms</p>
                  <p className="text-xl font-bold text-slate-800">{viewingProperty.bathrooms}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl text-center border border-slate-100">
                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-1">Area</p>
                  <p className="text-xl font-bold text-slate-800">{viewingProperty.area}</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                    <span className="w-1.5 h-6 bg-gold-500 rounded-full"></span> Description
                  </h4>
                  <p className="text-slate-600 text-sm leading-relaxed">{viewingProperty.description || "No description provided."}</p>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="w-1.5 h-6 bg-gold-500 rounded-full"></span> Amenities
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {viewingProperty.amenities?.length > 0 ? (
                      viewingProperty.amenities.map(amenity => (
                        <span key={amenity} className="px-4 py-2 bg-slate-50 text-slate-700 text-xs font-medium rounded-xl border border-slate-100 flex items-center gap-2">
                          <CheckCircle size={14} className="text-gold-500" /> {amenity}
                        </span>
                      ))
                    ) : (
                      <p className="text-slate-400 text-xs italic">No amenities listed.</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-10 pt-6 border-t border-slate-100 flex justify-end gap-3">
                <button onClick={() => { handleCloseViewModal(); handleOpenModal(viewingProperty); }} className="btn-gold py-3 px-8 text-sm">Edit This Property</button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminProperties;
