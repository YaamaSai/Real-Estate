import React from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import PropertyCard from '../components/PropertyCard';
import { motion, useSpring, useTransform } from 'framer-motion';
import { ArrowRight, Star, Shield, Zap, Globe } from 'lucide-react';
import { useSite } from '../context/SiteContext';

const TiltCard = ({ children, className }) => {
  const x = useSpring(0, { stiffness: 150, damping: 20 });
  const y = useSpring(0, { stiffness: 150, damping: 20 });

  const rotateX = useTransform(y, [-0.5, 0.5], ["7deg", "-7deg"]);
  const rotateY = useTransform(x, [-0.5, 0.5], ["-7deg", "7deg"]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        willChange: "transform"
      }}
      className={className}
    >
      <div className="w-full h-full" style={{ transform: "translateZ(50px)", transformStyle: "preserve-3d" }}>
        {children}
      </div>
    </motion.div>
  );
};

const Home = () => {
  const { siteData } = useSite();
  const properties = siteData?.properties || [];
  const featuredProperties = properties.slice(0, 4);

  return (
    <div className="perspective-1000">
      <Hero />

      {/* Luxury Metrics Section - Excellence in Numbers */}
      <section className="py-24 bg-white overflow-hidden relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-px bg-gradient-to-r from-transparent via-slate-100 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 text-center">
            {[
              { label: "Elite Projects", value: "250+" },
              { label: "Premium Acres", value: "1.2k" },
              { label: "Happy Families", value: "5000+" },
              { label: "Years of Trust", value: "15+" }
            ].map((stat, idx) => (
              <div key={idx} className="group cursor-default">
                <div className="text-4xl lg:text-6xl font-heading font-black text-slate-900 mb-2 transition-transform group-hover:scale-110 duration-500">
                  {stat.value}
                </div>
                <div className="text-[10px] font-black text-gold-600 uppercase tracking-[0.3em]">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Properties Section */}
      <section className="section-padding pt-0">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-sm font-bold text-gold-600 uppercase tracking-widest mb-2">Exclusive Selection</h2>
              <h3 className="text-2xl md:text-3xl font-serif font-bold text-slate-900">Suggested Hyderabad Properties</h3>
            </div>
            <Link
              to="/properties"
              className="hidden md:flex items-center gap-2 text-gold-600 font-bold hover:gap-4 transition-all group"
            >
              View All Properties <ArrowRight size={20} className="transition-all" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding bg-slate-50 relative overflow-hidden">
        {/* Subtle decorative element */}
        <div className="absolute top-0 right-0 p-20 opacity-5 pointer-events-none select-none">
          <Globe size={400} className="text-slate-900" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-sm font-bold text-gold-600 uppercase tracking-widest mb-2">Why Choose Us</h2>
            <h3 className="text-3xl md:text-5xl font-serif font-bold text-slate-900">Bridl 360 Core Features</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {[
              { icon: <Globe className="text-gold-500" size={40} />, title: "Wide Coverage", desc: "Properties across all prime locations in Hyderabad." },
              { icon: <Shield className="text-gold-500" size={40} />, title: "Verified Listings", desc: "Every property is verified by our expert team for peace of mind." },
              { icon: <Zap className="text-gold-500" size={40} />, title: "Fast Booking", desc: "Instant site visit bookings and WhatsApp inquiries." },
              { icon: <Star className="text-gold-500" size={40} />, title: "Premium Service", desc: "Expert guidance for luxury and commercial investments." }
            ].map((feature, idx) => (
              <div key={idx} className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-2xl hover:shadow-slate-200 transition-all duration-500 hover:-translate-y-2">
                <div className="mb-6 w-16 h-16 bg-gold-50 rounded-2xl flex items-center justify-center transition-transform group-hover:rotate-12">
                  {feature.icon}
                </div>
                <h4 className="text-xl font-bold mb-3">{feature.title}</h4>
                <p className="text-slate-500 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* New Section: Elite Neighborhoods (No Buttons) */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-2xl mb-16">
            <h2 className="text-sm font-bold text-gold-600 uppercase tracking-widest mb-2">Prime Destinations</h2>
            <h3 className="text-xl md:text-3xl font-serif font-bold text-slate-900 leading-tight">Elite Neighborhoods</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {[
              { name: "Jubilee Hills", img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800", label: "Ultra Luxury" },
              { name: "Financial District", img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800", label: "Corporate Hub" },
              { name: "Gachibowli", img: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=800", label: "Modern Living" }
            ].map((area, idx) => (
              <Link key={idx} to={`/properties?location=${encodeURIComponent(area.name)}`} className="block group">
                <TiltCard className="relative h-[500px] rounded-[3.5rem] overflow-hidden shadow-2xl shadow-slate-900/20">
                  <img src={area.img} alt={area.name} className="w-full h-full object-cover transition-transform duration-[3000ms] group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/20 to-transparent"></div>
                  <div className="absolute bottom-12 left-12" style={{ transform: "translateZ(80px)" }}>
                    <span className="text-[10px] font-black text-gold-400 uppercase tracking-widest mb-3 block opacity-80">{area.label}</span>
                    <h4 className="text-lg md:text-xl font-heading font-bold text-white tracking-tight">{area.name}</h4>
                  </div>
                </TiltCard>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* New Section: Architectural Philosophy (No Buttons) */}
      <section className="py-32 bg-slate-950 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gold-600/5 -skew-x-12 translate-x-1/4"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-20">
            <div className="lg:w-1/2">
              <h2 className="text-sm font-bold text-gold-500 uppercase tracking-[0.3em] mb-6">Our Philosophy</h2>
              <h3 className="text-2xl md:text-4xl font-serif font-bold mb-8 leading-tight">Redefining the Essence of Modern Architecture</h3>
              <p className="text-base md:text-lg text-slate-400 leading-relaxed font-light italic border-l-2 border-gold-500 pl-8 mb-10">
                "We believe that a home is not just a structure, but a canvas where life unfolds in its most exquisite form. Our curation process reflects this belief, focusing on spaces that inspire, protect, and elevate the human spirit."
              </p>
              <div className="grid grid-cols-2 gap-10">
                <div>
                  <div className="text-gold-500 font-bold mb-2">Sustainable</div>
                  <p className="text-xs text-slate-500 leading-relaxed">Integrating green technologies and eco-conscious materials into every elite listing.</p>
                </div>
                <div>
                  <div className="text-gold-500 font-bold mb-2">Timeless</div>
                  <p className="text-xs text-slate-500 leading-relaxed">Designs that transcend trends, maintaining value and beauty for generations.</p>
                </div>
              </div>
            </div>
            <div className="lg:w-1/2">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80"
                  alt="Luxury Architecture"
                  className="rounded-[4rem] shadow-2xl relative z-10"
                />
                <div className="absolute -bottom-10 -left-10 w-64 h-64 border-2 border-gold-500/30 rounded-[4rem] -z-0"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WhatsApp CTA Section */}
      <section className="section-padding bg-gold-600 text-white">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-serif font-bold mb-8">Ready to find your perfect property?</h2>
          <p className="text-xl mb-10 opacity-90">Get instant details and brochures on WhatsApp</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="https://wa.me/919999999999" className="bg-white text-gold-700 px-10 py-4 rounded-full font-bold text-lg hover:bg-slate-100 transition-colors flex items-center justify-center gap-3">
              Connect on WhatsApp
            </a>
            <Link to="/contact" className="bg-transparent border-2 border-white px-10 py-4 rounded-full font-bold text-lg hover:bg-white/10 transition-colors flex items-center justify-center">
              Book a Site Visit
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
