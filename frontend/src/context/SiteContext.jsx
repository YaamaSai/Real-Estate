import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../utils/api';

const SiteContext = createContext();

export const SiteProvider = ({ children }) => {
  const [siteData, setSiteData] = useState({
    hero: {
      title: "",
      subtitle: "",
      ctaPrimary: "Explore Properties",
      ctaSecondary: "Book Site Visit",
      image: ""
    },
    marquee: {
      text: ""
    },
    contact: {
      phone: "",
      email: "",
      address: "Bridl360, 303, JNTU Rd, beside Nexus Mall, Kukatpally Housing Board Colony, K P H B Phase 6, Kukatpally, Hyderabad, Telangana 500085"
    },
    isMaintenanceMode: false,
    properties: [
      { id: 1, title: "Skyline Elite Residences", location: "Gachibowli", price: "4.5 Cr", category: "Luxury", type: "Villa", bedrooms: 5, bathrooms: 6, area: 4500, image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800", status: "Available", description: "Luxury villa in Gachibowli", amenities: ["Gym", "Pool"] },
      { id: 2, title: "Green Valley Villas", location: "Kokapet", price: "3.2 Cr", category: "Luxury", type: "Villa", bedrooms: 4, bathrooms: 4, area: 3200, image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800", status: "Available", description: "Premium villas in Kokapet", amenities: ["Garden"] },
      { id: 3, title: "Urban Nest Homes", location: "Miyapur", price: "85 L", category: "Budget", type: "Apartment", bedrooms: 3, bathrooms: 3, area: 1650, image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800", status: "Available", description: "Budget homes in Miyapur", amenities: ["Security"] },
      { id: 4, title: "Tech Park Business Hub", location: "HITEC City", price: "12 Cr", category: "Commercial", type: "Office", bedrooms: 0, bathrooms: 4, area: 8000, image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800", status: "Available", description: "Commercial space in HITEC City", amenities: ["Parking"] }
    ],
    projects: [
      { title: "Aura Prime", location: "Gachibowli", status: "Ongoing", image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800", description: "A futuristic commercial hub designed for global enterprises." },
      { title: "Emerald Heights", location: "Kokapet", status: "Launching Soon", image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800", description: "Luxury residential towers with panoramic lake views." },
      { title: "Silicon Square", location: "HITEC City", status: "Completed", image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800", description: "Completed office park home to multiple Fortune 500 companies." }
    ],
    leads: [],
    agents: []
  });

  const [loading, setLoading] = useState(true);
  const [dbError, setDbError] = useState(null);

  const checkConnection = async () => {
    try {
      const res = await API.get('/db-status');
      if (res.data.connected) {
        setDbError(null);
        fetchData();
        return true;
      } else {
        setDbError({
          type: 'whitelist_needed',
          message: 'The server is running but could not connect to MongoDB Atlas. Whitelist required for IP.',
          ip: res.data.ip || '122.177.247.170'
        });
        return false;
      }
    } catch (err) {
      if (!err.response || err.code === 'ERR_NETWORK') {
        setDbError({
          type: 'offline',
          message: 'The backend server is not running or port 5000 is blocked.',
          ip: '122.177.247.170'
        });
      } else if (err.response?.status === 503 && err.response?.data?.error === 'Database Connection Error') {
        setDbError({
          type: 'whitelist_needed',
          message: err.response.data.message || 'MongoDB Atlas connection failed.',
          ip: err.response.data.ip || '122.177.247.170'
        });
      }
      return false;
    }
  };

  const fetchData = async () => {
    try {
      const results = await Promise.allSettled([
        API.get('/properties?t=' + Date.now()),
        API.get('/projects?t=' + Date.now()),
        API.get('/leads?t=' + Date.now()),
        API.get('/agents?t=' + Date.now()),
        API.get('/settings?t=' + Date.now())
      ]);

      // Check for backend offline / network error
      const allFailedNetwork = results.every(r => 
        r.status === 'rejected' && 
        (!r.reason?.response || r.reason?.code === 'ERR_NETWORK')
      );

      // Check for database connection failed (503 Service Unavailable)
      const dbFailure = results.find(r => 
        r.status === 'rejected' && 
        r.reason?.response?.status === 503 && 
        r.reason?.response?.data?.error === 'Database Connection Error'
      );

      if (allFailedNetwork) {
        setDbError({
          type: 'offline',
          message: 'The backend server is not running or port 5000 is blocked.',
          ip: '122.177.247.170'
        });
      } else if (dbFailure) {
        setDbError({
          type: 'whitelist_needed',
          message: dbFailure.reason.response.data.message || 'MongoDB Atlas connection failed.',
          ip: dbFailure.reason.response.data.ip || '122.177.247.170'
        });
      } else {
        setDbError(null);
      }

      const [propsRes, projectsRes, leadsRes, agentsRes, settingsRes] = results.map(r => r.status === 'fulfilled' ? r.value : { data: [] });

      setSiteData(prev => ({
        ...prev,
        properties: Array.isArray(propsRes.data) && propsRes.data.length > 0 ? propsRes.data : prev.properties,
        projects: Array.isArray(projectsRes.data) && projectsRes.data.length > 0 ? projectsRes.data : prev.projects,
        leads: Array.isArray(leadsRes.data) ? leadsRes.data : [],
        agents: Array.isArray(agentsRes.data) ? agentsRes.data : [],
        ...(settingsRes.data || {}),
        isMaintenanceMode: settingsRes.data?.isMaintenanceMode === 'true' || settingsRes.data?.isMaintenanceMode === true
      }));
    } catch (error) {
      console.error("Error fetching site data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const updateSiteData = async (section, field, value) => {
    try {
      // If it's a settings field, update it in the backend
      if (['hero', 'marquee', 'contact', 'isMaintenanceMode'].includes(section)) {
        await API.post('/settings', { key: section, value: { ...siteData[section], [field]: value } });
      }

      setSiteData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value
        }
      }));
    } catch (error) {
      console.error("Error updating site data", error);
    }
  };

  const updateSiteSection = async (section, value) => {
    try {
      if (['hero', 'marquee', 'contact', 'isMaintenanceMode'].includes(section)) {
        await API.post('/settings', { key: section, value });
      }

      setSiteData(prev => ({
        ...prev,
        [section]: value
      }));
    } catch (error) {
      console.error("Error updating site section", error);
      throw error;
    }
  };

  const toggleMaintenanceMode = async () => {
    const newVal = !siteData.isMaintenanceMode;
    try {
      await API.post('/settings', { key: 'isMaintenanceMode', value: newVal });
      setSiteData(prev => ({
        ...prev,
        isMaintenanceMode: newVal
      }));
    } catch (error) {
      console.error("Error toggling maintenance mode", error);
    }
  };

  const refreshProperties = async () => {
    try {
      const res = await API.get('/properties');
      setSiteData(prev => ({ ...prev, properties: res.data }));
    } catch (error) {
      console.error("Error refreshing properties", error);
    }
  };

  const refreshProjects = async () => {
    try {
      const res = await API.get('/projects');
      setSiteData(prev => ({ ...prev, projects: res.data }));
    } catch (error) {
      console.error("Error refreshing projects", error);
    }
  };

  const refreshLeads = async () => {
    try {
      const res = await API.get('/leads');
      setSiteData(prev => ({ ...prev, leads: res.data }));
    } catch (error) {
      console.error("Error refreshing leads", error);
    }
  };

  const refreshAgents = async () => {
    try {
      const res = await API.get('/agents?t=' + Date.now());
      const agentsData = Array.isArray(res.data) ? res.data : [];
      setSiteData(prev => ({ ...prev, agents: agentsData }));
    } catch (error) {
      console.error("Error refreshing agents", error);
    }
  };

  return (
    <SiteContext.Provider value={{
      siteData,
      updateSiteData,
      updateSiteSection,
      toggleMaintenanceMode,
      refreshProperties,
      refreshProjects,
      refreshLeads,
      refreshAgents,
      dbError,
      checkConnection,
      loading
    }}>
      {children}
    </SiteContext.Provider>
  );
};

export const useSite = () => useContext(SiteContext);
