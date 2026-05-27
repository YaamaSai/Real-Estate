import React, { useState } from 'react';
import { Calendar, Clock, User, Phone, Mail, MapPin, CheckCircle, Loader2 } from 'lucide-react';
import API from '../utils/api';

const BookVisit = () => {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    property: '',
    date: '',
    time: '',
    message: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting Visit Request:", formData);
    setIsSubmitting(true);
    try {
      const fullMessage = `PROPERTY: ${formData.property}\nDATE: ${formData.date}\nTIME: ${formData.time}\n\nUSER MESSAGE: ${formData.message}`;

      const response = await API.post('/leads', {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: fullMessage,
        type: 'Site Visit'
      });

      console.log("API Response:", response.data);
      setSubmitted(true);
    } catch (error) {
      console.error("Error booking visit:", error.response?.data || error.message);
      alert(`Failed to book visit: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (submitted) {
    return (
      <div className="pt-32 pb-20 px-4 flex flex-col items-center justify-center min-h-[70vh] bg-slate-50/50">
        <div className="bg-white p-12 rounded-[3rem] shadow-2xl border border-slate-100 text-center max-w-lg w-full animate-fadeIn">
          <div className="w-24 h-24 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl shadow-green-200">
            <CheckCircle size={48} />
          </div>
          <h2 className="text-3xl font-black font-heading text-slate-900 mb-4">Visit Confirmed!</h2>
          <p className="text-slate-500 mb-10 leading-relaxed font-medium">
            Thank you for booking a site visit with Bridl 360. Our representative will contact you shortly on <span className="font-bold text-slate-900">{formData.phone}</span> to confirm your appointment.
          </p>
          <button
            onClick={() => window.location.href = '/'}
            className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-gold-600 transition-all shadow-xl shadow-slate-200"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 bg-slate-50/50">
      <div className="bg-slate-900 text-white py-20 sm:py-28 px-6 md:px-12 relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-gold-500/10 rounded-full blur-[120px] translate-x-1/3 -translate-y-1/3"></div>

        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <span className="text-gold-500 font-black tracking-[0.4em] uppercase text-[10px] mb-4 block">Experience Excellence</span>
          <h1 className="text-4xl md:text-5xl font-heading font-black mb-6 tracking-tight leading-tight">Book a <span className="text-gold-500">Site Visit</span></h1>
          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed">
            Schedule a personalized walkthrough of your dream property. See the craftsmanship and luxury firsthand.
          </p>
        </div>
      </div>

      <div className="py-16 px-6 md:px-12 relative z-20">
        <div className="max-w-6xl mx-auto bg-white rounded-[3rem] shadow-2xl border border-slate-100 overflow-hidden grid grid-cols-1 lg:grid-cols-5 animate-slideUp">
          {/* Info Section */}
          <div className="lg:col-span-2 bg-slate-900 p-10 lg:p-14 text-white flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

            <div className="relative z-10">
              <h3 className="text-2xl font-black font-heading mb-10">Why visit us?</h3>
              <div className="space-y-8">
                <div className="flex gap-5">
                  <div className="w-6 h-6 rounded-full bg-gold-500/20 flex items-center justify-center text-gold-500 shrink-0"><CheckCircle size={16} /></div>
                  <p className="text-slate-300 text-sm font-medium leading-relaxed">Personalized guidance from our property experts during the walkthrough.</p>
                </div>
                <div className="flex gap-5">
                  <div className="w-6 h-6 rounded-full bg-gold-500/20 flex items-center justify-center text-gold-500 shrink-0"><CheckCircle size={16} /></div>
                  <p className="text-slate-300 text-sm font-medium leading-relaxed">In-depth look at amenities, structural design, and premium build quality.</p>
                </div>
                <div className="flex gap-5">
                  <div className="w-6 h-6 rounded-full bg-gold-500/20 flex items-center justify-center text-gold-500 shrink-0"><CheckCircle size={16} /></div>
                  <p className="text-slate-300 text-sm font-medium leading-relaxed">On-the-spot clarification of legalities, documentation, and final pricing.</p>
                </div>
              </div>
            </div>

            <div className="mt-16 space-y-5 relative z-10 pt-10 border-t border-slate-800/50">
              <div className="flex items-center gap-4 text-slate-300">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gold-500"><Phone size={18} /></div>
                <span className="text-sm font-black tracking-wider">+91 999 999 9999</span>
              </div>
              <div className="flex items-center gap-4 text-slate-300">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gold-500"><Mail size={18} /></div>
                <span className="text-sm font-black tracking-wider uppercase">visit@bridl360.com</span>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <form onSubmit={handleSubmit} className="lg:col-span-3 p-10 lg:p-14 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                  <User size={14} className="text-gold-500" /> Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="e.g. John Doe"
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-300 rounded-2xl outline-none focus:border-gold-500 focus:bg-white focus:ring-4 focus:ring-gold-500/5 transition-all shadow-inner text-sm font-medium hover:border-slate-400"
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                  <Phone size={14} className="text-gold-500" /> Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  placeholder="+91 00000 00000"
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-300 rounded-2xl outline-none focus:border-gold-500 focus:bg-white focus:ring-4 focus:ring-gold-500/5 transition-all shadow-inner text-sm font-medium hover:border-slate-400"
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                <Mail size={14} className="text-gold-500" /> Email Address
              </label>
              <input
                type="email"
                name="email"
                required
                placeholder="john@example.com"
                className="w-full px-6 py-4 bg-slate-50 border border-slate-300 rounded-2xl outline-none focus:border-gold-500 focus:bg-white focus:ring-4 focus:ring-gold-500/5 transition-all shadow-inner text-sm font-medium hover:border-slate-400"
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                <MapPin size={14} className="text-gold-500" /> Interested Property
              </label>
              <div className="relative">
                <select
                  name="property"
                  required
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-300 rounded-2xl outline-none focus:border-gold-500 focus:bg-white focus:ring-4 focus:ring-gold-500/5 transition-all shadow-inner text-sm font-black uppercase tracking-widest appearance-none hover:border-slate-400"
                  onChange={handleInputChange}
                >
                  <option value="">Select a property</option>
                  <option value="Skyline Elite">Skyline Elite Residences</option>
                  <option value="Green Valley">Green Valley Villas</option>
                  <option value="Urban Nest">Urban Nest Homes</option>
                  <option value="Corporate Heights">Corporate Heights</option>
                </select>
                <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <Clock size={16} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                  <Calendar size={14} className="text-gold-500" /> Preferred Date
                </label>
                <input
                  type="date"
                  name="date"
                  required
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-300 rounded-2xl outline-none focus:border-gold-500 focus:bg-white focus:ring-4 focus:ring-gold-500/5 transition-all shadow-inner text-sm font-medium hover:border-slate-400"
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                  <Clock size={14} className="text-gold-500" /> Preferred Time
                </label>
                <select
                  name="time"
                  required
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-300 rounded-2xl outline-none focus:border-gold-500 focus:bg-white focus:ring-4 focus:ring-gold-500/5 transition-all shadow-inner text-sm font-black uppercase tracking-widest appearance-none hover:border-slate-400"
                  onChange={handleInputChange}
                >
                  <option value="">Select Time</option>
                  <option value="10:00 AM">10:00 AM</option>
                  <option value="12:00 PM">12:00 PM</option>
                  <option value="02:00 PM">02:00 PM</option>
                  <option value="04:00 PM">04:00 PM</option>
                  <option value="06:00 PM">06:00 PM</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-5 bg-gold-500 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-gold-100 hover:bg-gold-600 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3"
            >
              {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : "Confirm Site Visit"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookVisit;
