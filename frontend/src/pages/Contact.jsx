import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, Clock, Loader2, CheckCircle2 } from 'lucide-react';
import API from '../utils/api';
import { useSite } from '../context/SiteContext';

const Contact = () => {
  const { siteData } = useSite();
  const { contact } = siteData;

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
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
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
        type: 'Inquiry'
      });
      setSubmitted(true);
      setFormData({ firstName: '', lastName: '', email: '', phone: '', message: '' });
    } catch (error) {
      console.error("Error submitting lead", error);
      alert("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-20 overflow-hidden bg-slate-50/50">
      <div className="bg-slate-900 text-white py-20 sm:py-28 px-6 md:px-12 relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute bottom-0 left-0 w-[30rem] h-[30rem] bg-gold-500/10 rounded-full blur-[100px] -translate-x-1/3 translate-y-1/3"></div>
        
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <span className="text-gold-500 font-black tracking-[0.4em] uppercase text-[10px] mb-4 block animate-fadeIn">Contact Us</span>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-black mb-6 tracking-tight">Get In <span className="text-gold-500">Touch</span></h1>
          <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto leading-relaxed font-medium">
            We are here to answer all your questions and help you secure your perfect property in Hyderabad.
          </p>
        </div>
      </div>

      <section className="py-12 sm:py-20 px-6 md:px-12 relative z-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-slate-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
               <div className="bg-gold-500 w-12 h-12 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg">
                  <Phone size={24} />
               </div>
               <h3 className="text-lg font-black mb-3 uppercase tracking-tight text-slate-900">Phone Support</h3>
               <p className="text-xs text-slate-500 mb-6 font-medium">Call us directly for immediate assistance with any property inquiry.</p>
               <div className="space-y-1">
                 <p className="text-base font-black text-slate-900">{contact?.phone || "+91 999 999 9999"}</p>
               </div>
            </div>
            
            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
               <div className="bg-slate-900 w-12 h-12 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg">
                  <Mail size={24} />
               </div>
               <h3 className="text-lg font-black mb-3 uppercase tracking-tight text-slate-900">Email Inquiry</h3>
               <p className="text-xs text-slate-500 mb-6 font-medium">Send us an email and our representative will get back to you within 24 hours.</p>
               <div className="space-y-1">
                 <p className="text-base font-black text-slate-900">{contact?.email || "info@bridl360.com"}</p>
               </div>
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
               <div className="bg-gold-500 w-12 h-12 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg">
                  <MapPin size={24} />
               </div>
               <h3 className="text-lg font-black mb-3 uppercase tracking-tight text-slate-900">Our Head Office</h3>
               <p className="text-xs text-slate-500 mb-6 font-medium">Visit our corporate office for a one-on-one consultation with our experts.</p>
               <p className="text-base font-black text-slate-900 leading-tight">{contact?.address || "Bridl360, 303, JNTU Rd, beside Nexus Mall, Kukatpally Housing Board Colony, K P H B Phase 6, Kukatpally, Hyderabad, Telangana 500085"}</p>
            </div>
          </div>

          <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div className="bg-white p-8 sm:p-10 rounded-[3rem] shadow-2xl border border-slate-50">
               <h2 className="text-2xl font-black font-heading text-slate-900 mb-2">Send Us a Message</h2>
               <p className="text-slate-500 text-sm mb-8 font-medium">Have a specific requirement? Drop us a line and we'll help you out.</p>
               
               {submitted ? (
                 <div className="bg-green-50 p-10 rounded-[2.5rem] border border-green-100 text-center animate-fadeIn">
                   <div className="bg-green-500 w-16 h-16 rounded-full flex items-center justify-center text-white mx-auto mb-6 shadow-lg">
                     <CheckCircle2 size={32} />
                   </div>
                   <h3 className="text-xl font-bold text-slate-900 mb-2">Message Sent!</h3>
                   <p className="text-slate-600 text-sm">Thank you for reaching out. Our team will contact you shortly.</p>
                   <button onClick={() => setSubmitted(false)} className="mt-6 text-gold-600 font-black uppercase tracking-widest text-[10px] hover:text-gold-700">Send another message</button>
                 </div>
               ) : (
                 <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <input 
                        type="text" 
                        name="firstName"
                        required
                        value={formData.firstName}
                        onChange={handleInputChange}
                        placeholder="First Name" 
                        className="w-full px-6 py-4 bg-slate-50 rounded-2xl outline-none border border-slate-300 focus:border-gold-500 focus:bg-white focus:ring-4 focus:ring-gold-500/5 hover:border-slate-400 transition-all shadow-inner text-sm font-medium" 
                       />
                       <input 
                        type="text" 
                        name="lastName"
                        required
                        value={formData.lastName}
                        onChange={handleInputChange}
                        placeholder="Last Name" 
                        className="w-full px-6 py-4 bg-slate-50 rounded-2xl outline-none border border-slate-300 focus:border-gold-500 focus:bg-white focus:ring-4 focus:ring-gold-500/5 hover:border-slate-400 transition-all shadow-inner text-sm font-medium" 
                       />
                    </div>
                    <input 
                      type="email" 
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Email Address" 
                      className="w-full px-6 py-4 bg-slate-50 rounded-2xl outline-none border border-slate-300 focus:border-gold-500 focus:bg-white focus:ring-4 focus:ring-gold-500/5 hover:border-slate-400 transition-all shadow-inner text-sm font-medium" 
                    />
                    <input 
                      type="tel" 
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Phone Number" 
                      className="w-full px-6 py-4 bg-slate-50 rounded-2xl outline-none border border-slate-300 focus:border-gold-500 focus:bg-white focus:ring-4 focus:ring-gold-500/5 hover:border-slate-400 transition-all shadow-inner text-sm font-medium" 
                    />
                    <textarea 
                      rows="4" 
                      name="message"
                      required
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="How can we help you?" 
                      className="w-full px-6 py-4 bg-slate-50 rounded-2xl outline-none border border-slate-300 focus:border-gold-500 focus:bg-white focus:ring-4 focus:ring-gold-500/5 hover:border-slate-400 transition-all shadow-inner resize-none text-sm font-medium leading-relaxed"
                    ></textarea>
                    <button disabled={isSubmitting} className="btn-primary w-full py-4 text-sm font-black uppercase tracking-widest flex items-center justify-center gap-3 disabled:opacity-70 transition-all rounded-2xl shadow-xl shadow-gold-100">
                       {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <>Send Message <Send size={20} /></>}
                    </button>
                 </form>
               )}
            </div>

            <div className="space-y-10 pt-4">
               <div>
                  <h3 className="text-xl font-black mb-6 flex items-center gap-3 text-slate-900"><Clock className="text-gold-500" size={20} /> Business Hours</h3>
                  <div className="space-y-3 text-sm">
                     <div className="flex justify-between border-b border-slate-50 pb-2 text-slate-600 font-medium"><span>Monday - Friday</span> <span className="font-black text-slate-900">9:00 AM - 7:00 PM</span></div>
                     <div className="flex justify-between border-b border-slate-50 pb-2 text-slate-600 font-medium"><span>Saturday</span> <span className="font-black text-slate-900">10:00 AM - 4:00 PM</span></div>
                     <div className="flex justify-between border-b border-slate-50 pb-2 text-slate-600 font-medium"><span>Sunday</span> <span className="font-black text-gold-600 uppercase tracking-wider">Visits Only</span></div>
                  </div>
               </div>

               <div>
                  <h3 className="text-xl font-black mb-4 flex items-center gap-3 text-slate-900"><MessageSquare className="text-gold-500" size={20} /> Connect with us</h3>
                  <p className="text-slate-500 text-sm mb-6 leading-relaxed font-medium">Follow us on our social media platforms for the latest property launches.</p>
                  <div className="flex flex-wrap gap-2">
                     {['Instagram', 'LinkedIn', 'YouTube', 'Facebook'].map((social) => (
                        <button key={social} className="bg-slate-50 text-slate-600 hover:bg-gold-500 hover:text-white px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-sm border border-slate-100">
                           {social}
                        </button>
                     ))}
                  </div>
               </div>
               
               {/* Working Interactive Google Map */}
               <div className="h-56 rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-md">
                 <iframe 
                   title="Bridl360 Kukatpally Location Map"
                   width="100%" 
                   height="100%" 
                   style={{ border: 0 }}
                   loading="lazy" 
                   allowFullScreen 
                   src="https://maps.google.com/maps?q=Bridl360%2C%20303%2C%20JNTU%20Rd%2C%20beside%20Nexus%20Mall%2C%20Kukatpally%20Housing%20Board%20Colony%2C%20K%20P%20H%20B%20Phase%206%2C%20Kukatpally%2C%20Hyderabad%2C%20Telangana%20500085&t=&z=16&ie=UTF8&iwloc=&output=embed"
                 ></iframe>
               </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Contact;
