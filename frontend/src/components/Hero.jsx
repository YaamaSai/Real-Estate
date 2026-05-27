import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin } from 'lucide-react';
import { useSite } from '../context/SiteContext';
import { useNavigate } from 'react-router-dom';
import CustomSelect from './CustomSelect';

const Hero = () => {
  const { siteData } = useSite();
  const { hero } = siteData;
  const navigate = useNavigate();
  const [searchType, setSearchType] = useState("");
  const [locationQuery, setLocationQuery] = useState("");

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (locationQuery) params.append('location', locationQuery);
    if (searchType) params.append('type', searchType);
    navigate(`/properties?${params.toString()}`);
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-36 pb-20 md:pt-40 md:pb-32">
      <div
        className="absolute inset-0 bg-cover bg-center z-0 animate-fade-in"
        style={{ backgroundImage: `url(${hero?.image || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80"})` }}
      >
        <div className="absolute inset-0 bg-slate-900/40"></div>
      </div>

      <div className="relative z-10 text-center px-4 max-w-5xl">
        <motion.h1
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-7xl font-serif text-white font-bold mb-6 leading-tight"
        >
          {hero.title.split(' ').map((word, i) => {
            const isSpecial = word.toLowerCase() === 'dream' || word.toLowerCase() === 'home' || word.toLowerCase() === 'reality';
            return (
              <span key={i} className={isSpecial ? "text-gold-400" : ""}>
                {word}{' '}
              </span>
            );
          })}
        </motion.h1>

        <motion.p
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xl md:text-2xl text-slate-100 mb-10 max-w-2xl mx-auto font-light"
        >
          {hero.subtitle}
        </motion.p>

        <motion.div 
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="bg-white p-4 md:p-3 rounded-[2.5rem] md:rounded-full shadow-2xl flex flex-col md:flex-row gap-4 md:gap-2 max-w-3xl mx-auto border border-white/20"
        >
          <div className="flex-1 flex items-center px-6 py-4 md:py-0 gap-3 bg-slate-50 md:bg-transparent rounded-2xl md:rounded-none md:border-r border-slate-100">
            <MapPin className="text-gold-600 shrink-0" size={20} />
            <input 
              type="text" 
              placeholder="Search location (Gachibowli, Kokapet...)" 
              value={locationQuery}
              onChange={(e) => setLocationQuery(e.target.value)}
              className="w-full outline-none text-slate-700 bg-transparent text-sm font-medium"
            />
          </div>
          <div className="flex-1 flex items-center px-6 py-4 md:py-0 gap-3 bg-slate-50 md:bg-transparent rounded-2xl md:rounded-none">
            <Search className="text-gold-600 shrink-0" size={20} />
            <div className="flex-1 -mt-1">
              <CustomSelect 
                name="type"
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
                options={[
                  { value: 'luxury', label: 'Luxury Villa' },
                  { value: 'apartment', label: 'Apartment' },
                  { value: 'commercial', label: 'Commercial' }
                ]}
                placeholder="Property Type"
              />
            </div>
          </div>
          <button 
            onClick={handleSearch}
            className="w-full md:w-auto bg-slate-900 md:bg-gold-500 text-white px-10 py-5 md:py-4 rounded-2xl md:rounded-full font-black uppercase tracking-widest text-[10px] shadow-2xl hover:bg-gold-600 transition-all active:scale-95"
          >
            Search Now
          </button>
        </motion.div>
      </div>

      {/* Decorative element */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white to-transparent"></div>
    </div>
  );
};

export default Hero;
