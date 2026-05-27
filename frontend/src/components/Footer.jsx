import React from 'react';
import { Link } from 'react-router-dom';
import { useSite } from '../context/SiteContext';
import Logo from './Logo';
import { Phone, Mail, MapPin, ArrowRight, Home, Building2, Star, Award, Shield } from 'lucide-react';

const Footer = () => {
  const { siteData } = useSite();
  const { contact } = siteData;

  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'Properties', path: '/properties' },
    { name: 'Projects', path: '/projects' },
    { name: 'About Us', path: '/about' },
    { name: 'Our Team', path: '/team' },
    { name: 'Testimonials', path: '/testimonials' },
    { name: 'Contact Us', path: '/contact' },
  ];

  const propertyTypes = [
    { name: 'Luxury Apartments', icon: <Building2 size={14} /> },
    { name: 'Independent Villas', icon: <Home size={14} /> },
    { name: 'Commercial Spaces', icon: <Building2 size={14} /> },
    { name: 'Plotted Developments', icon: <Home size={14} /> },
    { name: 'Budget Homes', icon: <Home size={14} /> },
    { name: 'Gated Communities', icon: <Building2 size={14} /> },
  ];

  const socialLinks = [
    { svg: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>, href: '#', label: 'Instagram' },
    { svg: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>, href: '#', label: 'Facebook' },
    { svg: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>, href: '#', label: 'LinkedIn' },
    { svg: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/></svg>, href: '#', label: 'YouTube' },
    { svg: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>, href: '#', label: 'Twitter' },
  ];

  return (
    <footer className="bg-slate-900 text-white mt-20">

      {/* Main Footer Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">

          {/* Brand Column */}
          <div className="md:col-span-4">
            <Logo imgClassName="h-20 w-auto object-contain" className="justify-start mb-5" />
            <p className="text-slate-400 text-sm leading-relaxed mb-6 max-w-xs">
              Hyderabad's premier real estate destination. We bridge the gap between your dream property and reality — with trust, transparency, and expertise at every step.
            </p>

            {/* Certifications / Trust Badges */}
            <div className="flex flex-wrap gap-3 mb-6">
              <span className="flex items-center gap-1.5 text-xs font-semibold text-gold-400 bg-gold-500/10 border border-gold-500/20 px-3 py-1.5 rounded-full">
                <Award size={12} /> RERA Certified
              </span>
              <span className="flex items-center gap-1.5 text-xs font-semibold text-gold-400 bg-gold-500/10 border border-gold-500/20 px-3 py-1.5 rounded-full">
                <Shield size={12} /> ISO 9001:2015
              </span>
              <span className="flex items-center gap-1.5 text-xs font-semibold text-gold-400 bg-gold-500/10 border border-gold-500/20 px-3 py-1.5 rounded-full">
                <Star size={12} /> Top Rated 2024
              </span>
            </div>

            {/* Social Icons */}
            <div className="flex gap-2">
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-gold-500 text-slate-400 hover:text-white flex items-center justify-center transition-all duration-300"
                >
                  {s.svg}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-2">
            <h3 className="text-white font-bold text-sm uppercase tracking-widest mb-6 pb-3 border-b border-slate-800">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="flex items-center gap-2 text-slate-400 hover:text-gold-400 text-sm transition-colors group"
                  >
                    <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 -ml-4 group-hover:ml-0 transition-all duration-300" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Property Types */}
          <div className="md:col-span-3">
            <h3 className="text-white font-bold text-sm uppercase tracking-widest mb-6 pb-3 border-b border-slate-800">
              Property Types
            </h3>
            <ul className="space-y-3">
              {propertyTypes.map((type) => (
                <li key={type.name}>
                  <Link
                    to="/properties"
                    className="flex items-center gap-2 text-slate-400 hover:text-gold-400 text-sm transition-colors group"
                  >
                    <span className="text-gold-500/60 group-hover:text-gold-400 transition-colors">{type.icon}</span>
                    {type.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div className="md:col-span-3">
            <h3 className="text-white font-bold text-sm uppercase tracking-widest mb-6 pb-3 border-b border-slate-800">
              Get In Touch
            </h3>
            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3 text-sm text-slate-400">
                <MapPin size={16} className="text-gold-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  {contact?.address || 'Bridl360, 303, JNTU Rd, beside Nexus Mall, Kukatpally, Hyderabad, Telangana 500085'}
                </span>
              </li>
              <li>
                <a href={`tel:${contact?.phone}`} className="flex items-center gap-3 text-sm text-slate-400 hover:text-gold-400 transition-colors">
                  <Phone size={16} className="text-gold-400 shrink-0" />
                  {contact?.phone || '+91 99999 99999'}
                </a>
              </li>
              <li>
                <a href={`mailto:${contact?.email}`} className="flex items-center gap-3 text-sm text-slate-400 hover:text-gold-400 transition-colors">
                  <Mail size={16} className="text-gold-400 shrink-0" />
                  {contact?.email || 'hello@bridl360.com'}
                </a>
              </li>
            </ul>

            {/* Newsletter */}
            <div>
              <p className="text-xs font-bold text-white uppercase tracking-widest mb-3">Newsletter</p>
              <p className="text-slate-400 text-xs mb-3">Get the latest property listings & market updates.</p>
              <div className="flex gap-2 max-w-full">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 min-w-0 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-gold-500 transition-colors"
                />
                <button className="bg-gold-500 hover:bg-gold-600 text-white rounded-xl px-4 py-2.5 text-sm font-bold transition-colors shrink-0">
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm">
            &copy; {new Date().getFullYear()} Bridl 360. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-slate-500 text-sm">
            <a href="#" className="hover:text-gold-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-gold-400 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-gold-400 transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>

    </footer>
  );
};

export default Footer;
