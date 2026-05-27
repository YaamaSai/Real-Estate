import React from 'react';
import { Calendar, MapPin, CheckCircle2 } from 'lucide-react';
import { useSite } from '../context/SiteContext';

const Projects = () => {
  const { siteData } = useSite();
  const projects = siteData?.projects || [];

  const handleDownload = (proj) => {
    const brochureData = proj.brochureUrl || proj.brochure;
    if (!brochureData) {
      alert('Brochure not available for this project yet.');
      return;
    }

    // Check if it's a base64 string or a URL
    if (brochureData.startsWith('data:')) {
      const link = document.createElement('a');
      link.href = brochureData;
      link.download = `${proj.title || proj.name}_Brochure.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      window.open(brochureData, '_blank');
    }
  };

  return (
    <div className="pt-20">
      <div className="py-20 bg-slate-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <span className="text-gold-600 font-bold tracking-widest uppercase text-xs mb-3 block">Our Portfolio</span>
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6 tracking-tight text-slate-900">Major Projects</h1>
          <p className="text-base sm:text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">Discover the landmarks that are shaping the skyline of tomorrow's Hyderabad with innovation and luxury.</p>
        </div>
      </div>

      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto space-y-24 sm:space-y-32">
          {projects.map((proj, i) => (
            <div key={i} className={`flex flex-col ${i % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-10 lg:gap-16 items-center`}>
              <div className="w-full lg:flex-1 group">
                <div className="relative overflow-hidden rounded-[2.5rem] sm:rounded-[3.5rem] shadow-2xl aspect-[4/3] lg:aspect-auto lg:h-[500px]">
                  <img src={proj.image} alt={proj.title || proj.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                  <div className="absolute top-6 left-6 sm:top-8 sm:left-8 bg-white/95 backdrop-blur px-5 py-2 rounded-full font-bold shadow-lg flex items-center gap-2 text-xs sm:text-sm">
                    <span className={`w-2 h-2 rounded-full ${proj.status === 'Completed' ? 'bg-green-500' : 'bg-gold-500'} animate-pulse`}></span>
                    {proj.status}
                  </div>
                </div>
              </div>
              <div className="w-full lg:flex-1 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 text-gold-600 font-bold mb-3 text-xs sm:text-sm uppercase tracking-wider">
                  <MapPin size={16} /> {proj.location}
                </div>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-slate-900 mb-6 leading-tight">{proj.title || proj.name}</h2>
                <p className="text-base sm:text-lg text-slate-600 leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0">{proj.description || proj.desc}</p>
                <div className="space-y-4 mb-10 inline-block text-left">
                  <div className="flex items-center gap-3 text-sm sm:text-base font-medium text-slate-700">
                    <CheckCircle2 size={18} className="text-green-500 shrink-0" />
                    <span>Environmentally Sustainable Design</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm sm:text-base font-medium text-slate-700">
                    <CheckCircle2 size={18} className="text-green-500 shrink-0" />
                    <span>Smart Integrated Systems</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm sm:text-base font-medium text-slate-700">
                    <CheckCircle2 size={18} className="text-green-500 shrink-0" />
                    <span>Premium Materials & Finishes</span>
                  </div>
                </div>
                <div className="block">
                  <button
                    onClick={() => handleDownload(proj)}
                    className={`bg-gold-500 hover:bg-gold-600 text-white font-bold px-8 py-4 rounded-full text-sm sm:text-base transition-all transform hover:-translate-y-1 shadow-lg shadow-gold-500/20 active:scale-95 ${(proj.brochureUrl || proj.brochure) ? '' : 'opacity-50 cursor-not-allowed grayscale'}`}
                  >
                    {(proj.brochureUrl || proj.brochure) ? 'Download Project Brochure' : 'Brochure Coming Soon'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-slate-900 text-white py-24 px-4 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gold-500/10 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2"></div>
        <div className="max-w-4xl mx-auto relative z-10">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">Ready to invest in a landmark?</h2>
          <p className="text-base sm:text-lg text-slate-400 mb-10 max-w-xl mx-auto">Our consultants are ready to provide you with exclusive insights into our upcoming major projects.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => window.location.href = '/contact'}
              className="bg-gold-500 hover:bg-gold-600 text-white px-10 py-4 rounded-full font-bold text-sm sm:text-base transition-all shadow-lg shadow-gold-500/20"
            >
              Speak to Advisor
            </button>
            <button
              onClick={() => alert('Opening Site Plans...')}
              className="bg-white/5 border border-white/10 px-10 py-4 rounded-full font-bold text-sm sm:text-base hover:bg-white/10 transition-all backdrop-blur-sm"
            >
              View Site Plans
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Projects;
