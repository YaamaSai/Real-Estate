const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Property = require('./models/Property');
const Project = require('./models/Project');
const User = require('./models/User');
const Lead = require('./models/Lead');
const bcrypt = require('bcryptjs');

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/bridl360');
    
    // Clear existing data
    await Property.deleteMany();
    await Project.deleteMany();
    await Lead.deleteMany();
    await User.deleteMany({ role: 'agent' }); // Only clear agents, keep admin

    const salt = await bcrypt.genSalt(10);
    const hashedAgentPassword = await bcrypt.hash('Bridl360@agent', salt);

    const properties = [
      { title: "Skyline Elite Residences", location: "Gachibowli", price: "4.5 Cr", category: "Luxury", type: "Villa", bedrooms: 5, bathrooms: 6, area: "4500", image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800", status: "Available", description: "Luxury villa in Gachibowli", amenities: ["Gym", "Pool"] },
      { title: "Green Valley Villas", location: "Kokapet", price: "3.2 Cr", category: "Luxury", type: "Villa", bedrooms: 4, bathrooms: 4, area: "3200", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800", status: "Available", description: "Premium villas in Kokapet", amenities: ["Garden"] },
      { title: "Urban Nest Homes", location: "Miyapur", price: "85 L", category: "Budget", type: "Apartment", bedrooms: 3, bathrooms: 3, area: "1650", image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800", status: "Available", description: "Budget homes in Miyapur", amenities: ["Security"] },
      { title: "Tech Park Business Hub", location: "HITEC City", price: "12 Cr", category: "Commercial", type: "Office", bedrooms: 0, bathrooms: 4, area: "8000", image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800", status: "Available", description: "Commercial space in HITEC City", amenities: ["Parking"] }
    ];

    const projects = [
      { title: "Aura Prime", location: "Gachibowli", status: "Ongoing", image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800", description: "A futuristic commercial hub designed for global enterprises." },
      { title: "Emerald Heights", location: "Kokapet", status: "Launching Soon", image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800", description: "Luxury residential towers with panoramic lake views." },
      { title: "Silicon Square", location: "HITEC City", status: "Completed", image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800", description: "Completed office park home to multiple Fortune 500 companies." }
    ];

    const agents = [
      {
        name: "Arjun Reddy",
        email: "arjun@bridl360.com",
        password: hashedAgentPassword,
        phone: "+91 98765 43210",
        designation: "Senior Property Consultant",
        role: "agent",
        status: "Active",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400"
      },
      {
        name: "Priya Sharma",
        email: "priya@bridl360.com",
        password: hashedAgentPassword,
        phone: "+91 87654 32109",
        designation: "Senior Property Consultant",
        role: "agent",
        status: "Active",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400"
      },
      {
        name: "Vikram Malhotra",
        email: "vikram@bridl360.com",
        password: hashedAgentPassword,
        phone: "+91 76543 21098",
        designation: "Senior Property Consultant",
        role: "agent",
        status: "Inactive",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400"
      },
      {
        name: "Sneha Kapoor",
        email: "sneha@bridl360.com",
        password: hashedAgentPassword,
        phone: "+91 65432 10987",
        designation: "Senior Property Consultant",
        role: "agent",
        status: "Active",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400"
      }
    ];

    const leads = [
      {
        name: "Rahul Khanna",
        email: "rahul@gmail.com",
        phone: "+91 99999 88888",
        message: "Interested in Skyline Elite Residences. Please share floor plans.",
        property: "Skyline Elite Residences",
        type: "Inquiry",
        status: "New"
      },
      {
        name: "Ananya Deshmukh",
        email: "ananya@yahoo.com",
        phone: "+91 88888 77777",
        message: "I would like to book a site visit for Green Valley Villas.",
        property: "Green Valley Villas",
        type: "Site Visit",
        status: "New"
      },
      {
        name: "Sameer Verma",
        email: "sameer@outlook.com",
        phone: "+91 77777 66666",
        message: "General inquiry about investment plots in Kokapet.",
        type: "Inquiry",
        status: "Contacted"
      },
      {
        name: "Kiran Rao",
        email: "kiran@gmail.com",
        phone: "+91 66666 55555",
        message: "Site visit request for Tech Park Business Hub.",
        property: "Tech Park Business Hub",
        type: "Site Visit",
        status: "New"
      }
    ];

    await Property.insertMany(properties);
    await Project.insertMany(projects);
    await User.insertMany(agents);
    await Lead.insertMany(leads);

    console.log('Data Seeded Successfully');
    process.exit();
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
