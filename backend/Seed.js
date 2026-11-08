require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('./models/Admin');
const Job = require('./models/Job');

const mockJobs = [
  {
    title: "Full Stack MERN Developer",
    company: "TechNexus Solutions",
    location: "Remote (US/Canada)",
    employmentType: "Full-time",
    experienceLevel: "Mid Level",
    salaryRange: "$80,000 - $105,000",
    description: "We are seeking a proficient MERN Stack developer to manage complete delivery pipelines for client-facing software web modules.",
    requirements: [
      "2+ years working with React.js, Node.js, and Express.",
      "Solid database mapping layout understanding in MongoDB.",
      "Familiarity with building container patterns with Docker."
    ],
    benefits: ["Full health cover allowance package", "Flexible PTO policy architecture", "Learning stipend credits"],
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    status: "Active",
    isPublished: true
  },
  {
    title: "Backend Core Systems Engineer",
    company: "DataStream Infrastructure",
    location: "New York, NY",
    employmentType: "Contract",
    experienceLevel: "Senior Level",
    salaryRange: "$90 - $115 / hour",
    description: "Drive secure REST architectural framework integrations and state persistence mapping algorithms for core fintech client data flows.",
    requirements: [
      "Expert knowledge of raw JavaScript/Node.js runtime scaling.",
      "Deep understanding of indexing optimization in MongoDB database matrices.",
      "Strong background handling secure file stream upload paradigms."
    ],
    benefits: ["Remote work balance accommodation options", "Hardware workspace stipend setup allocations"],
    deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
    status: "Active",
    isPublished: true
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB cluster for seeding sequence...");

    // Clear existing mock data sets if necessary to prevent duplication spikes
    await Admin.deleteMany({});
    await Job.deleteMany({});

    // Create Root Administrator account configuration
    const adminEmail = "admin@portal.com";
    const adminPassword = "SecurePassword123!"; // You can use this to login to your dashboard later!
    
    await Admin.create({
      email: adminEmail,
      password: adminPassword
    });
    console.log(`\n======================================================`);
    console.log(`✅ Admin Account Registered Successfully!`);
    console.log(`📧 Email: ${adminEmail}`);
    console.log(`🔑 Password: ${adminPassword}`);
    console.log(`======================================================\n`);

    // Insert mock jobs payload data stream
    await Job.insertMany(mockJobs);
    console.log("✅ Mock job opening database entries populated successfully.");

    process.exit(0);
  } catch (error) {
    console.error(`❌ Seeding sequence failure encountered: ${error.message}`);
    process.exit(1);
  }
};

seedDatabase();
