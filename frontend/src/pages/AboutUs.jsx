import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Award, ShieldCheck, ArrowRight, Sparkles, Compass, History, Quote } from 'lucide-react';

const AboutUs = () => {
  const [activeTab, setActiveTab] = useState('mission');

  const fadeInUp = {
    hidden: { opacity: 0, y: 25 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.8, ease: "easeOut" } 
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12
      }
    }
  };

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.92 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      transition: { duration: 0.5, ease: "easeOut" } 
    }
  };

  const tabContents = {
    mission: {
      title: "Elevating Everyday Living",
      desc: "To bridge the gap between luxury and accessibility, providing world-class real estate services to every segment of the market in Hyderabad. We aim to revolutionize the home-buying experience by delivering absolute transparency, verified quality, and expert guidance at every single stage.",
      icon: <Target className="text-gold-500 shrink-0" size={28} />,
      points: [
        "100% verified developer portfolio listings.",
        "End-to-end transparency in transactional structures.",
        "Meticulous, client-centric advocacy and advisory services."
      ]
    },
    vision: {
      title: "Redefining Hyderabad's Skyline",
      desc: "To transform Hyderabad’s real estate landscape by setting unprecedented benchmarks of architectural elegance, premium customer service, and digital-first innovation. We envision a future where finding your dream property is completely frictionless and empowering.",
      icon: <Compass className="text-gold-500 shrink-0" size={28} />,
      points: [
        "Integrating advanced virtual-tours and AI matching tools.",
        "Expanding our luxury footprint in elite prime destinations.",
        "Fostering sustainable, eco-conscious development choices."
      ]
    },
    legacy: {
      title: "A Decade of Trust",
      desc: "Founded in 2008, Bridl 360’s legacy is built on a foundation of long-term partnerships, elite advisor expertise, and thousands of happy families who call our properties 'home'. We don't just sell spaces; we curate milestones that endure for generations.",
      icon: <History className="text-gold-500 shrink-0" size={28} />,
      points: [
        "Over 15 years of uninterrupted excellence in consulting.",
        "A premium network of elite real estate professionals.",
        "Deeply rooted commitment to local communities and trust."
      ]
    }
  };

  return (
    <div className="pt-20 bg-white">
      {/* 1. HERO SECTION: Immersive visual gates */}
      <section className="bg-slate-950 text-white py-28 md:py-36 px-6 relative overflow-hidden">
        {/* Ambient premium radial gold glow overlay */}
        <div className="absolute top-0 right-0 w-[50rem] h-[50rem] bg-gold-500/5 rounded-full blur-[140px] translate-x-1/4 -translate-y-1/4 animate-pulse duration-4000"></div>
        <div className="absolute bottom-0 left-0 w-[30rem] h-[30rem] bg-gold-600/5 rounded-full blur-[120px] -translate-x-1/4 translate-y-1/4"></div>

        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center"
          >
            <motion.div 
              variants={fadeInUp} 
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-gold-500/30 bg-gold-500/10 text-gold-400 text-[9px] font-black uppercase tracking-[0.3em] mb-6"
            >
              <Sparkles size={10} />
              Since 2008 • Elite Standard
            </motion.div>

            <motion.h1 
              variants={fadeInUp}
              className="text-3xl md:text-5xl font-serif font-bold tracking-tight leading-tight max-w-3xl mb-6 text-white"
            >
              About <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-400 via-gold-500 to-gold-600">BRIDL 360</span>
            </motion.h1>

            <motion.div 
              variants={fadeInUp}
              className="w-16 h-0.5 bg-gradient-to-r from-transparent via-gold-500 to-transparent mb-6"
            ></motion.div>

            <motion.p 
              variants={fadeInUp}
              className="text-slate-300 text-sm md:text-base max-w-2xl font-light leading-relaxed mb-8"
            >
              We are redefining the luxury real estate experience in Hyderabad through unparalleled transparency, premium verification standards, and expert-led advisory.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* 2. INTERACTIVE METRICS: Frosted glass floating metrics */}
      <section className="relative -mt-16 z-20 px-6 max-w-7xl mx-auto">
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {[
            { value: "15+", label: "Years Experience", desc: "Pioneering the elite market" },
            { value: "2.5k+", label: "Happy Clients", desc: "Smiles & lifelong trust" },
            { value: "250+", label: "Curated Projects", desc: "Premium properties chosen" },
            { value: "500+ Cr", label: "Completed Deals", desc: "Premium value delivered" }
          ].map((stat, i) => (
            <motion.div 
              key={i}
              variants={scaleIn}
              whileHover={{ y: -6, transition: { duration: 0.3 } }}
              className="bg-white/80 backdrop-blur-xl border border-slate-100 rounded-[2rem] p-6 md:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.03)] hover:shadow-[0_40px_80px_rgba(0,0,0,0.08)] hover:border-gold-500/20 transition-all duration-300 group text-center flex flex-col justify-between"
            >
              <div>
                <div className="text-2xl md:text-3xl font-heading font-bold text-slate-900 mb-1 group-hover:text-gold-600 transition-colors">
                  {stat.value}
                </div>
                <div className="text-[9px] font-black text-gold-600 uppercase tracking-widest mb-2">
                  {stat.label}
                </div>
              </div>
              <p className="text-slate-400 text-xs font-medium leading-relaxed mt-1">
                {stat.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* 3. NARRATIVE SECTION: Premium overlapping grid & CEO signature quote */}
      <section className="py-20 sm:py-24 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Story Text content */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center gap-3 text-gold-600 font-bold uppercase tracking-widest text-xs mb-2">
                <span className="w-6 h-px bg-gold-600"></span> Our Story
              </div>
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-slate-900 mb-6 leading-tight">
                Crafting Spaces That Inspire New Beginnings
              </h2>
              <p className="text-slate-500 text-sm leading-relaxed mb-6">
                Founded with a resolute vision to simplify the complex world of luxury investments, Bridl 360 has grown from a specialized consultancy to Hyderabad's premier boutique property platform. We believe finding a home isn't just an elite transaction; it is curating the next grand chapter of your life.
              </p>
              <p className="text-slate-500 text-sm leading-relaxed mb-8">
                Our advisors consist of seasoned real estate veterans, local investment specialists, and design-minded enthusiasts who deeply understand the heartbeat of the city. From Gachibowli to Jubilee Hills, we match your vision with unmatched architectural symmetry and perfect structural compliance.
              </p>

              {/* CEO Quote Block */}
              <div className="relative bg-slate-50 rounded-[2rem] p-6 md:p-8 border-l-4 border-gold-500 pl-6 md:pl-8 overflow-hidden">
                <Quote size={60} className="absolute right-4 bottom-0 text-gold-500/5 select-none pointer-events-none" />
                <p className="text-slate-600 font-serif italic text-xs md:text-sm leading-relaxed mb-4 relative z-10">
                  "Luxury is not about a high price tag. It is about a standard of detail, symmetry, and peace of mind that stands the test of time."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gold-500 flex items-center justify-center text-white text-xs font-black shadow-lg shadow-gold-500/20">
                    B
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900 leading-none mb-1">Bridl Founders</h5>
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider leading-none">Excellence & Heritage</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Overlapping grid image collage with border accent */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative flex justify-center items-center h-[450px]"
            >
              {/* Back Gold Border Accent Frame */}
              <div className="absolute top-8 left-8 w-[80%] h-[80%] border border-gold-500/30 rounded-[2.5rem] -z-10"></div>
              
              {/* Main Background Card Image */}
              <div className="absolute top-0 right-8 w-[68%] h-[75%] rounded-[2.5rem] overflow-hidden shadow-xl hover:scale-105 transition-transform duration-700">
                <img 
                  src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800" 
                  alt="Elite Villa Design" 
                  className="w-full h-full object-cover" 
                />
              </div>

              {/* Smaller Overlapping Foreground Image */}
              <div className="absolute bottom-4 left-4 w-[55%] h-[55%] rounded-[2rem] overflow-hidden shadow-xl border-4 border-white hover:scale-105 transition-transform duration-700 z-10">
                <img 
                  src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=800" 
                  alt="Curated Living Spaces" 
                  className="w-full h-full object-cover" 
                />
              </div>

              {/* Float floating badge */}
              <div className="absolute right-0 bottom-12 bg-slate-900 text-white py-3 px-5 rounded-xl shadow-lg z-20 border border-white/10 flex items-center gap-2.5">
                <div className="w-2 h-2 rounded-full bg-gold-500 animate-ping"></div>
                <span className="text-[9px] font-black uppercase tracking-widest">100% Curated Portfolios</span>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* 4. VALUES & CORE PRINCIPLES: Luxury glowing borders */}
      <section className="py-20 bg-slate-50 rounded-[3rem] px-6 mx-6 relative overflow-hidden">
        {/* Subtle geometric circles */}
        <div className="absolute top-0 left-0 w-80 h-80 border border-slate-200/50 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-[35rem] h-[35rem] border border-slate-200/30 rounded-full translate-x-1/3 translate-y-1/3"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <span className="text-sm font-bold text-gold-600 uppercase tracking-widest mb-2 block">Foundations</span>
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-slate-900 mb-4">Our Core Value Pillar System</h2>
            <div className="w-12 h-0.5 bg-gold-500 mx-auto mb-4"></div>
            <p className="text-slate-500 max-w-2xl mx-auto text-sm leading-relaxed">
              The fundamental principles that govern every property we inspect, every advisor we deploy, and every transaction we secure.
            </p>
          </div>

          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              { 
                icon: <Target className="text-gold-500" size={32} />, 
                title: "Absolute Precision", 
                desc: "Every listing on our platform undergoes a meticulous 7-tier background and developer check, ensuring premium compliance and flawless physical execution." 
              },
              { 
                icon: <ShieldCheck className="text-gold-500" size={32} />, 
                title: "Unyielding Integrity", 
                desc: "We stand for absolute transparency. No hidden markups, no double-dealing. We deliver plain facts and solid compliance to build trust that endures." 
              },
              { 
                icon: <Award className="text-gold-500" size={32} />, 
                title: "Curated Excellence", 
                desc: "We do not deal in generic structures. We curate only premium, elite-tier residential and commercial portfolios that represent true luxury and growth potential." 
              }
            ].map((val, i) => (
              <motion.div 
                key={i} 
                variants={fadeInUp}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                className="bg-white rounded-[2rem] p-8 md:p-10 border border-slate-100 shadow-[0_15px_40px_rgba(0,0,0,0.02)] hover:shadow-[0_30px_60px_rgba(0,0,0,0.06)] hover:border-gold-500/20 transition-all duration-300 group flex flex-col items-center text-center"
              >
                <div className="mb-6 w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 group-hover:border-gold-500/30 group-hover:bg-gold-50 transition-colors duration-300">
                  {val.icon}
                </div>
                <h4 className="text-lg font-bold mb-3 text-slate-900">{val.title}</h4>
                <p className="text-slate-500 text-sm leading-relaxed">{val.desc}</p>
                
                {/* Micro-interactive growing gold line on hover */}
                <div className="w-0 group-hover:w-12 h-0.5 bg-gold-500 transition-all duration-500 mt-5"></div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 5. INTERACTIVE MISSION & VISION SECTION: Tabs with animations */}
      <section className="py-20 sm:py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            
            {/* Left side: Selector Panel with dynamic active line */}
            <div className="w-full lg:w-2/5">
              <span className="text-sm font-bold text-gold-600 uppercase tracking-widest mb-2 block">Future Direction</span>
              <h3 className="text-2xl md:text-3xl font-serif font-bold text-slate-900 mb-6 leading-tight">
                Our Ultimate Vision & Purpose
              </h3>
              
              <div className="flex flex-col gap-3">
                {[
                  { id: 'mission', label: 'Our Active Mission', sub: 'What we deliver today' },
                  { id: 'vision', label: 'Our Strategic Vision', sub: 'Skyline benchmarks for tomorrow' },
                  { id: 'legacy', label: 'Our Trusted Legacy', sub: 'Decades of shared trust since 2008' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`text-left p-5 rounded-[1.5rem] transition-all duration-300 flex items-center justify-between border cursor-pointer ${
                      activeTab === tab.id
                        ? 'bg-slate-950 border-slate-900 text-white shadow-xl shadow-slate-950/10'
                        : 'bg-white border-slate-100 hover:bg-slate-50 text-slate-800'
                    }`}
                  >
                    <div>
                      <h4 className="font-bold text-sm leading-none mb-1">{tab.label}</h4>
                      <p className={`text-[11px] ${activeTab === tab.id ? 'text-gold-400' : 'text-slate-400'}`}>{tab.sub}</p>
                    </div>
                    <ArrowRight 
                      size={16} 
                      className={`transition-transform duration-300 ${
                        activeTab === tab.id ? 'text-gold-500 translate-x-1' : 'text-slate-300'
                      }`} 
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Right side: Dynamic Content Box with AnimatePresence transition */}
            <div className="w-full lg:w-3/5 min-h-[380px] bg-slate-950 text-white rounded-[2.5rem] p-8 md:p-10 border border-white/5 relative overflow-hidden flex flex-col justify-between shadow-xl">
              <div className="absolute top-0 right-0 w-72 h-72 bg-gold-500/5 rounded-full blur-[100px] pointer-events-none"></div>
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  transition={{ duration: 0.35 }}
                  className="flex-1 flex flex-col justify-between"
                >
                  <div>
                    {/* Tab Header Icon & Title */}
                    <div className="flex items-center gap-3.5 mb-6">
                      <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                        {tabContents[activeTab].icon}
                      </div>
                      <h3 className="text-lg md:text-xl font-bold font-heading text-white">
                        {tabContents[activeTab].title}
                      </h3>
                    </div>

                    {/* Description */}
                    <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-6 font-light">
                      {tabContents[activeTab].desc}
                    </p>
                  </div>

                  {/* Bullet points with gold checkmarks */}
                  <div>
                    <h5 className="text-[9px] font-black uppercase tracking-widest text-gold-500 mb-3">Core Commitments</h5>
                    <ul className="space-y-3">
                      {tabContents[activeTab].points.map((point, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <div className="w-4 h-4 rounded-full bg-gold-500/10 border border-gold-500/30 flex items-center justify-center shrink-0 mt-0.5">
                            <span className="w-1 h-1 rounded-full bg-gold-500"></span>
                          </div>
                          <span className="text-slate-400 text-xs sm:text-sm leading-relaxed">{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

          </div>
        </div>
      </section>

      {/* 6. IMMERSIVE BOTTOM CTA: Premium gold CTA matching site colors */}
      <section className="bg-gold-600 text-white py-16 px-6 text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-slate-900/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="max-w-3xl mx-auto relative z-10 flex flex-col items-center">
          <span className="text-slate-950 font-black uppercase tracking-[0.2em] text-[9px] bg-white py-1.5 px-5 rounded-full shadow-md shadow-gold-700/10 mb-5">
            Schedule Private Consultation
          </span>
          <h2 className="text-2xl md:text-3xl font-serif font-bold mb-4 leading-tight text-white">
            Ready to Discover Curated Luxury?
          </h2>
          <p className="text-white/80 text-xs sm:text-sm max-w-lg mb-6 leading-relaxed font-light">
            Connect with our elite property advisors today. Let us curate a personalized itinerary matching your investment parameters in Hyderabad's prime destinations.
          </p>
          <div className="flex flex-col sm:flex-row gap-3.5 justify-center">
            <a 
              href="https://wa.me/919999999999" 
              className="bg-slate-900 text-white font-bold text-xs uppercase tracking-widest px-8 py-3.5 rounded-full shadow-lg hover:bg-slate-800 transition-colors flex items-center justify-center gap-2.5 cursor-pointer"
            >
              Connect on WhatsApp
            </a>
            <a 
              href="/contact" 
              className="bg-transparent border-2 border-white/80 text-white font-bold text-xs uppercase tracking-widest px-8 py-3.5 rounded-full hover:bg-white/10 transition-colors flex items-center justify-center cursor-pointer"
            >
              Book Site Visit
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
