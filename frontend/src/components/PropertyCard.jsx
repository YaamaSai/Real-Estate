import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Maximize2, Bed, Bath, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const PropertyCard = ({ property }) => {
  return (
    <motion.div
      whileHover={{ y: -12 }}
      className="bg-white rounded-[2rem] overflow-hidden group shadow-[0_20px_50px_rgba(0,0,0,0.05)] hover:shadow-[0_40px_80px_rgba(0,0,0,0.1)] transition-all duration-500 border border-slate-100 h-full flex flex-col"
    >
      <div className="relative h-72 overflow-hidden">
        <img
          src={property.image || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"}
          alt={property.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute top-5 left-5 flex flex-col gap-2">
          <span className="bg-gold-500 text-white px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] shadow-lg shadow-gold-500/20">
            {property.category}
          </span>
          {property.type && (
            <span className="bg-slate-900/60 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em]">
              {property.type}
            </span>
          )}
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end justify-center pb-10">
          <Link
            to={`/property/${property._id || property.id}`}
            className="bg-white text-slate-900 px-8 py-3 rounded-full font-black uppercase tracking-widest text-[10px] flex items-center gap-2 hover:bg-gold-500 hover:text-white transition-all shadow-2xl"
          >
            Explore Property <ArrowUpRight size={16} />
          </Link>
        </div>
      </div>

      <div className="p-8 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-6 gap-4">
          <div className="flex-1">
            <div className="min-h-[2.8rem] xl:min-h-[3.2rem] mb-2">
              <h3 className="text-lg xl:text-xl font-bold font-heading text-slate-900 leading-tight group-hover:text-gold-600 transition-colors line-clamp-2" title={property.title}>
                {property.title}
              </h3>
            </div>
            <div className="flex items-center gap-1.5 text-slate-400 min-h-[1rem]">
              <MapPin size={14} className="text-gold-500 shrink-0" />
              <span className="text-[11px] font-bold uppercase tracking-wider">{property.location}</span>
            </div>
          </div>
        </div>

        <div className="flex items-baseline gap-1.5 xl:gap-2 mb-8">
          <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest shrink-0">Starts @</span>
          <p className="text-xl xl:text-2xl font-black text-slate-900 whitespace-nowrap">₹{property.price}</p>
        </div>

        <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-50 mt-auto">
          <div className="flex flex-col items-center text-center">
            <Bed size={18} className="text-gold-500 mb-1" />
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{property.bedrooms} BHK</span>
          </div>
          <div className="flex flex-col items-center text-center border-x border-slate-100">
            <Bath size={18} className="text-gold-500 mb-1" />
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{property.bathrooms} Units</span>
          </div>
          <div className="flex flex-col items-center text-center">
            <Maximize2 size={18} className="text-gold-500 mb-1" />
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{property.area} Sqft</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PropertyCard;
