import React, { useState, useEffect } from 'react';
import PropertyCard from '../components/PropertyCard';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';
import { useSite } from '../context/SiteContext';
import { useLocation as useRouteLocation } from 'react-router-dom';

const PropertiesListing = () => {
  const { siteData } = useSite();
  const allProperties = siteData?.properties || [];
  const [filter, setFilter] = useState('All');
  const routeLocation = useRouteLocation();
  const [searchTerm, setSearchTerm] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    const params = new URLSearchParams(routeLocation.search);
    const type = params.get('type');
    const location = params.get('location');

    if (type) {
      const categoryMap = {
        'luxury': 'Luxury',
        'apartment': 'Budget', // Map type to category if applicable
        'commercial': 'Commercial'
      };
      if (categoryMap[type]) setFilter(categoryMap[type]);
    }

    if (location) {
      setSearchTerm(location);
    }
  }, [routeLocation.search]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filter, searchTerm]);

  const filteredProperties = allProperties.filter(p => {
    const matchesFilter = filter === 'All' || p.category === filter;
    const matchesSearch = !searchTerm ||
      p.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProperties = filteredProperties.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProperties.length / itemsPerPage);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="pt-20 min-h-screen bg-white">
      <div className="bg-slate-900 text-white py-20 sm:py-28 px-6 relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-gold-500/10 rounded-full blur-[120px] translate-x-1/3 -translate-y-1/3"></div>

        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <span className="text-gold-500 font-bold tracking-[0.3em] uppercase text-xs mb-4 block">Premium Listings</span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-6 tracking-tight leading-tight">Explore Our <span className="text-gold-500">Listings</span></h1>
          <p className="text-base sm:text-lg md:text-xl text-slate-400 max-w-2xl mx-auto font-light leading-relaxed">
            Find the perfect match for your lifestyle and investment goals across the heart of Hyderabad.
          </p>
        </div>
      </div>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          {/* Filters Bar */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-6 bg-white p-6 rounded-[2rem] shadow-2xl shadow-slate-200/60 border border-slate-100 -mt-20 relative z-10">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto scrollbar-hide">
              {['All', 'Luxury', 'Budget', 'Commercial'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-8 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all whitespace-nowrap ${filter === cat ? 'bg-gold-500 text-white shadow-lg shadow-gold-500/20' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="flex gap-4 w-full md:w-auto">
              <div className="flex-1 md:w-80 bg-slate-50 border border-slate-300 rounded-2xl flex items-center px-6 py-3 focus-within:ring-2 focus-within:ring-gold-500/20 hover:border-slate-400 transition-all">
                <Search size={18} className="text-slate-400 mr-3" />
                <input
                  type="text"
                  placeholder="Search by area or project..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-transparent outline-none text-slate-700 w-full font-bold text-sm"
                />
              </div>
            </div>
          </div>

          {/* Results Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-16">
            {currentProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-3 mt-12">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-3 rounded-2xl bg-white border border-slate-200 text-slate-400 hover:text-gold-500 hover:border-gold-500 transition-all disabled:opacity-30 disabled:hover:text-slate-400 disabled:hover:border-slate-200"
              >
                <Filter size={20} className="rotate-90" /> {/* Using Filter as a mock icon for prev/next for now or just text */}
                <span className="sr-only">Previous</span>
              </button>

              <div className="flex gap-2">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => paginate(i + 1)}
                    className={`w-12 h-12 rounded-2xl font-black text-xs transition-all ${currentPage === i + 1
                        ? 'bg-gold-500 text-white shadow-xl shadow-gold-500/20'
                        : 'bg-white border border-slate-200 text-slate-400 hover:border-gold-500 hover:text-gold-500'
                      }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-3 rounded-2xl bg-white border border-slate-200 text-slate-400 hover:text-gold-500 hover:border-gold-500 transition-all disabled:opacity-30 disabled:hover:text-slate-400 disabled:hover:border-slate-200"
              >
                <Filter size={20} className="-rotate-90" />
                <span className="sr-only">Next</span>
              </button>
            </div>
          )}

          {filteredProperties.length === 0 && (
            <div className="text-center py-32 bg-slate-50 rounded-[3rem] border border-dashed border-slate-200">
              <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <Search size={40} className="text-slate-300" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2 font-heading">No results found</h3>
              <p className="text-slate-500 max-w-xs mx-auto text-sm">We couldn't find any properties matching your current filters. Try adjusting your search criteria.</p>
            </div>
          )}
        </div>
      </section>

    </div>
  );
};

export default PropertiesListing;
