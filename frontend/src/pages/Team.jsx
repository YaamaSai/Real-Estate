import React from 'react';
import { Link } from 'react-router-dom';

import { useSite } from '../context/SiteContext';

const Team = () => {
  const { siteData, loading } = useSite();
  const agents = siteData?.agents || [];
  return (
    <div className="pt-20">
      <div className="bg-slate-900 text-white py-24 sm:py-32 px-4 relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 w-[40rem] h-[40rem] bg-gold-500/5 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2"></div>
        
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <span className="text-gold-500 font-bold tracking-[0.3em] uppercase text-xs mb-4 block animate-fadeIn">Expertise & Passion</span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-8 tracking-tight leading-tight">The Minds Behind <span className="text-gold-500">Bridl 360</span></h1>
          <p className="text-base sm:text-lg text-slate-400 max-w-3xl mx-auto font-light leading-relaxed">
            Meet our team of dedicated professionals committed to redefining your real estate journey in Hyderabad with expertise and integrity.
          </p>
        </div>
      </div>

      <section className="section-padding">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {agents.map((member, i) => (
              <div key={i} className="group relative">
                <div className="relative overflow-hidden rounded-3xl mb-6">
                  <img
                    src={member.avatar || member.image}
                    alt={member.name}
                    className="w-full h-96 object-cover lg:grayscale grayscale-0 lg:group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                  />
                </div>
                <h3 className="text-2xl font-bold mb-2 text-slate-900">{member.name}</h3>
                <p className="text-gold-600 font-bold mb-3 uppercase tracking-widest text-sm">{member.designation || member.role}</p>
                <p className="text-slate-500 leading-relaxed">{member.bio || 'Experienced real estate professional dedicated to finding your perfect property.'}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-24">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center gap-16">
          <div className="flex-1">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">Join Our Growing <span className="text-gold-500">Elite Team</span></h2>
            <p className="text-lg text-slate-500 mb-8 leading-relaxed">
              We are always looking for passionate individuals who want to make a difference in the real estate industry. If you have the drive, we have the platform.
            </p>
            <Link to="/contact" className="inline-block bg-slate-900 text-white py-4 px-10 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-gold-500 transition-all shadow-xl shadow-slate-200">Apply for Careers</Link>
          </div>
          <div className="flex-1 relative">
            <div className="w-full h-80 bg-gold-100 rounded-3xl flex items-center justify-center">
              <h4 className="text-6xl font-bold text-gold-300 tracking-widest uppercase">CAREERS</h4>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Team;
