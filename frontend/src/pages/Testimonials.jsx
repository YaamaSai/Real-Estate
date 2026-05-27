import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Quote, CheckCircle2, Trophy, Heart, Award, Users } from 'lucide-react';
import { motion } from 'framer-motion';

const testimonials = [
  { name: "Suresh Kondeti", role: "Elite Investor", text: "Bridl 360 provided exceptional service. Their knowledge of the Hyderabad market is unparalleled. I found a great commercial property that exceeded my expectations.", rating: 5, location: "Hyderabad" },
  { name: "Meera Deshmukh", role: "Luxury Homeowner", text: "The team at Bridl 360 made my dream of owning a villa in Kokapet come true. The process was smooth and transparent. Highly recommended for luxury buyers!", rating: 5, location: "Kokapet" },
  { name: "Kiran Kumar", role: "Business Proprietor", text: "Finding office space in HITEC City was a breeze with their help. They understood our needs perfectly and negotiated a great deal for us.", rating: 5, location: "HITEC City" },
  { name: "Anita Reddy", role: "NRI Premium Client", text: "As an NRI, I was worried about the legalities and verification. Bridl 360 handled everything professionally and kept me updated at every stage.", rating: 5, location: "USA / India" },
  { name: "Vijay Malhotra", role: "Tech Professional", text: "Found a perfect budget apartment in Miyapur thanks to their user-friendly platform and helpful staff. Great value for money and transparent deals.", rating: 5, location: "Miyapur" }
];

const Testimonials = () => {
  return (
    <div className="bg-white">
      {/* Standardized Hero Header */}
      <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden bg-slate-900 pt-32 pb-16">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gold-900/10 via-slate-900 to-slate-900"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block text-gold-500 font-bold uppercase tracking-[0.4em] text-[10px] mb-4">
              Client Experiences
            </span>
            <h1 className="text-4xl md:text-6xl font-serif text-white font-bold mb-6 tracking-tight">
              Voice of <span className="text-gold-500">Trust</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-400 font-light max-w-2xl mx-auto italic leading-relaxed">
              "Stories of dreams fulfilled and investments secured through our dedicated service."
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Bar - More Compact */}
      <div className="max-w-6xl mx-auto px-6 -mt-10 relative z-20">
        <div className="bg-white shadow-xl rounded-[2rem] p-8 grid grid-cols-1 md:grid-cols-3 gap-6 border border-slate-100">
          <div className="text-center">
            <Trophy className="text-gold-600 mb-3 mx-auto" size={24} />
            <p className="text-2xl font-black text-slate-900">4.9/5.0</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">User Rating</p>
          </div>
          <div className="text-center pt-6 md:pt-0 border-t md:border-t-0 md:border-l border-slate-100">
            <Heart className="text-red-500 mb-3 mx-auto" size={24} />
            <p className="text-2xl font-black text-slate-900">500+</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Happy Families</p>
          </div>
          <div className="text-center pt-6 md:pt-0 border-t md:border-t-0 md:border-l border-slate-100">
            <CheckCircle2 className="text-green-600 mb-3 mx-auto" size={24} />
            <p className="text-2xl font-black text-slate-900">100%</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Verified Reviews</p>
          </div>
        </div>
      </div>

      {/* Testimonials Grid - Refined sizes */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="group relative p-8 md:p-12 rounded-[2.5rem] bg-slate-50 border border-slate-100 hover:bg-slate-900 transition-all duration-500 overflow-hidden"
              >
                <Quote className="absolute top-8 right-8 text-gold-500/10 group-hover:text-gold-500/20" size={60} />

                <div className="relative z-10">
                  <div className="flex gap-1 mb-6">
                    {[...Array(t.rating)].map((_, idx) => (
                      <Star key={idx} size={16} fill="currentColor" className="text-gold-500" />
                    ))}
                  </div>

                  <p className="text-base md:text-lg font-serif text-slate-700 group-hover:text-white/90 leading-relaxed mb-8 transition-colors italic">
                    "{t.text}"
                  </p>

                  <div className="flex items-center gap-4 pt-6 border-t border-slate-200 group-hover:border-white/10 transition-colors">
                    <div className="w-12 h-12 rounded-full bg-gold-100 flex items-center justify-center text-gold-600">
                      <Users size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg text-slate-900 group-hover:text-white transition-colors">{t.name}</h4>
                      <p className="text-gold-600 font-bold text-[10px] uppercase tracking-widest">{t.role}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Platforms - Compact Badges */}
      <section className="bg-slate-50 py-20 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <Award className="text-gold-600 mx-auto mb-4" size={32} />
          <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-10">Trusted Across Platforms</h2>

          <div className="flex flex-wrap justify-center gap-6 max-w-4xl mx-auto">
            <div className="bg-white px-8 py-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
              <span className="text-3xl font-black" style={{ background: 'linear-gradient(135deg, #4285F4 25%, #EA4335 50%, #FBBC05 75%, #34A853)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>G</span>
              <div className="text-center">
                <p className="text-xl font-black text-slate-900 leading-none">4.9</p>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Google Reviews</p>
              </div>
            </div>

            <div className="bg-white px-8 py-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
              <span className="text-3xl font-black" style={{ color: '#1877F2' }}>f</span>
              <div className="text-center">
                <p className="text-xl font-black text-slate-900 leading-none">4.8</p>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Facebook Community</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Simplified Luxury CTA */}
      <section className="py-24 px-6 bg-slate-900 relative">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-serif text-white font-bold mb-6">Ready to start your own story?</h2>
          <p className="text-lg text-slate-400 mb-10 font-light">Experience the Bridl 360 difference with our expert guidance.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact" className="bg-gold-500 text-white px-10 py-4 rounded-full font-bold uppercase tracking-widest text-[10px] shadow-lg">
              Consult an Expert
            </Link>
            <a href="https://wa.me/919999999999" className="bg-transparent border border-white/20 text-white px-10 py-4 rounded-full font-bold uppercase tracking-widest text-[10px] flex items-center justify-center gap-2">
              WhatsApp Inquiry
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Testimonials;
