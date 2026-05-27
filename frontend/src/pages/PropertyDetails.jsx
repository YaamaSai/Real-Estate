import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Bed, Bath, Maximize2, CheckCircle2, Phone, Calendar, ArrowLeft, Share2, Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSite } from '../context/SiteContext';
import API from '../utils/api';

const PropertyDetails = () => {
  const { id } = useParams();
  const { siteData } = useSite();
  const properties = siteData?.properties || [];
  const property = properties.find(p => p._id === id || p.id === parseInt(id)) || properties[0];
  const [currentImage, setCurrentImage] = useState(0);
  const images = property?.images || [property?.image];

  const nextImage = () => setCurrentImage(prev => (prev + 1) % images.length);
  const prevImage = () => setCurrentImage(prev => (prev - 1 + images.length) % images.length);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await API.post('/leads', {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: `Property Inquiry: ${property.title}. ${formData.message}`,
        property: property._id,
        type: 'Inquiry'
      });
      setSubmitted(true);
    } catch (error) {
      console.error("Error submitting inquiry", error);
      alert("Failed to send inquiry.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-32 bg-slate-50/30 min-h-screen">
      <div className="max-w-6xl mx-auto px-6 md:px-12 py-8">
        <Link to="/properties" className="inline-flex items-center gap-2 text-slate-500 hover:text-gold-600 transition-colors mb-6 text-sm font-medium">
          <ArrowLeft size={16} /> Back to Listings
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left Side: Images and Description */}
          <div className="lg:col-span-2">
            {/* Main Gallery Carousel */}
            <div className="group relative rounded-3xl overflow-hidden mb-10 shadow-xl bg-slate-200 aspect-[16/9]">
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentImage}
                  src={images[currentImage]}
                  alt={property.title}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                  className="w-full h-full object-cover"
                />
              </AnimatePresence>

              {/* Navigation Arrows */}
              <button
                onClick={prevImage}
                className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-slate-900/40 hover:bg-white/95 backdrop-blur-md p-2 md:p-3 rounded-full text-white hover:text-slate-900 transition-all md:opacity-0 md:group-hover:opacity-100 flex items-center justify-center z-10 cursor-pointer"
              >
                <ChevronLeft size={16} className="md:w-6 md:h-6" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-slate-900/40 hover:bg-white/95 backdrop-blur-md p-2 md:p-3 rounded-full text-white hover:text-slate-900 transition-all md:opacity-0 md:group-hover:opacity-100 flex items-center justify-center z-10 cursor-pointer"
              >
                <ChevronRight size={16} className="md:w-6 md:h-6" />
              </button>

              {/* Image Indicators */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                {images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImage(idx)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentImage ? 'w-8 bg-gold-500' : 'w-2 bg-white/50'}`}
                  />
                ))}
              </div>

              <div className="absolute top-6 right-6 flex gap-3">
                <button className="bg-white/90 backdrop-blur p-2.5 rounded-full shadow-lg hover:text-red-500 transition-colors">
                  <Heart size={18} />
                </button>
                <button className="bg-white/90 backdrop-blur p-2.5 rounded-full shadow-lg hover:text-blue-500 transition-colors">
                  <Share2 size={18} />
                </button>
              </div>
            </div>

            <div className="flex justify-between items-start mb-8 gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-heading font-bold text-slate-900 mb-2 leading-tight">{property.title}</h1>
                <div className="flex items-center gap-2 text-slate-500">
                  <MapPin size={16} className="text-gold-600" />
                  <span className="text-base">{property.location}</span>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-[10px] font-bold text-gold-600 uppercase tracking-widest mb-1">Starting From</p>
                <p className="text-2xl font-bold text-slate-900">₹{property.price}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 border-y border-slate-100 mb-10">
              <div className="flex flex-col items-center text-center">
                <Bed size={24} className="text-gold-500 mb-1" />
                <span className="text-[11px] text-slate-400 uppercase tracking-wider">Bedrooms</span>
                <span className="font-bold text-sm">{property.bedrooms} BHK</span>
              </div>
              <div className="flex flex-col items-center text-center">
                <Bath size={24} className="text-gold-500 mb-1" />
                <span className="text-[11px] text-slate-400 uppercase tracking-wider">Bathrooms</span>
                <span className="font-bold text-sm">{property.bathrooms} Units</span>
              </div>
              <div className="flex flex-col items-center text-center">
                <Maximize2 size={24} className="text-gold-500 mb-1" />
                <span className="text-[11px] text-slate-400 uppercase tracking-wider">Area</span>
                <span className="font-bold text-sm">{property.area} Sq.Ft.</span>
              </div>
              <div className="flex flex-col items-center text-center">
                <CheckCircle2 size={24} className="text-gold-500 mb-1" />
                <span className="text-[11px] text-slate-400 uppercase tracking-wider">Status</span>
                <span className="font-bold text-sm">Ready to Move</span>
              </div>
            </div>

            <div className="mb-10">
              <h3 className="text-lg font-bold font-heading mb-4 text-slate-900">Property Overview</h3>
              <p className="text-slate-600 leading-relaxed text-base mb-6">
                {property.description}
              </p>
            </div>

            <div className="mb-10">
              <h3 className="text-lg font-bold font-heading mb-4 text-slate-900">Premium Amenities</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {(property.amenities || []).map((feature, i) => (
                  <div key={i} className="flex items-center gap-2 bg-white border border-slate-100 p-3 rounded-xl shadow-sm">
                    <CheckCircle2 size={16} className="text-gold-600" />
                    <span className="text-slate-700 text-sm font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side: Contact Form Sticky */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 bg-white p-7 rounded-3xl shadow-xl border border-slate-100">
              <h3 className="text-xl font-bold font-heading mb-6 text-center text-slate-900">Interested?</h3>
              <div className="space-y-3 mb-6">
                <Link 
                  to={`/book-visit?property=${property.title}`}
                  className="w-full bg-slate-900 text-white py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10"
                >
                  <Calendar size={18} /> Book Site Visit
                </Link>
                <a href={`https://wa.me/919999999999?text=Hi, I am interested in ${property.title}`} className="w-full bg-green-500 text-white py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-green-600 transition-all shadow-lg shadow-green-500/10">
                  <Phone size={18} /> WhatsApp Inquiry
                </a>
              </div>

              <div className="border-t border-slate-100 pt-6">
                <p className="text-sm font-bold text-slate-900 mb-4">Request a Callback</p>
                {submitted ? (
                  <div className="bg-green-50 p-6 rounded-2xl border border-green-100 text-center animate-fadeIn">
                    <CheckCircle2 size={32} className="text-green-500 mx-auto mb-2" />
                    <p className="text-xs font-bold text-slate-900">Request Sent!</p>
                    <p className="text-[10px] text-slate-500 mt-1">We will call you shortly.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-3">
                    <input 
                      type="text" 
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Full Name" 
                      className="w-full p-3.5 bg-slate-50 rounded-xl outline-none border border-slate-300 text-sm focus:border-gold-500 focus:bg-white focus:ring-4 focus:ring-gold-500/5 hover:border-slate-400 transition-all shadow-inner" 
                    />
                    <input 
                      type="email" 
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Email Address" 
                      className="w-full p-3.5 bg-slate-50 rounded-xl outline-none border border-slate-300 text-sm focus:border-gold-500 focus:bg-white focus:ring-4 focus:ring-gold-500/5 hover:border-slate-400 transition-all shadow-inner" 
                    />
                    <input 
                      type="tel" 
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Phone Number" 
                      className="w-full p-3.5 bg-slate-50 rounded-xl outline-none border border-slate-300 text-sm focus:border-gold-500 focus:bg-white focus:ring-4 focus:ring-gold-500/5 hover:border-slate-400 transition-all shadow-inner" 
                    />
                    <textarea 
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Your Message" 
                      rows="3" 
                      className="w-full p-3.5 bg-slate-50 rounded-xl outline-none border border-slate-300 text-sm focus:border-gold-500 focus:bg-white focus:ring-4 focus:ring-gold-500/5 hover:border-slate-400 transition-all shadow-inner resize-none"
                    ></textarea>
                    <button disabled={isSubmitting} className="w-full bg-gold-500 text-white py-3.5 rounded-xl font-bold text-sm hover:bg-gold-600 transition-all shadow-lg shadow-gold-500/20 disabled:opacity-50">
                      {isSubmitting ? "Sending..." : "Send Inquiry"}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;
