const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Admin = require("./Models/admin.model");

dotenv.config({ path: ".env" });

const admins = [
  {
    fullName: "Asha Menon",
    email: "asha.admin@agileinsure.in",
    phone: "+91 9876543210",
    password: "Super@123",
    role: "Super Admin",
  },
  {
    fullName: "Rohit Kapoor",
    email: "rohit.manager@agileinsure.in",
    phone: "+91 9876543211",
    password: "Manager@123",
    role: "Insurance Manager",
  },
  {
    fullName: "Naina Shah",
    email: "naina.claims@agileinsure.in",
    phone: "+91 9876543212",
    password: "Claims@123",
    role: "Claims Officer",
  },
  {
    fullName: "Imran Ali",
    email: "imran.support@agileinsure.in",
    phone: "+91 9876543213",
    password: "Support@123",
    role: "Support Executive",
  },
];

async function seedAdmins() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    // Clear existing admins
    await Admin.deleteMany({});
    console.log("Cleared existing admins");

    // Create new admins
    const created = await Admin.insertMany(admins);
    console.log(`✅ ${created.length} admin accounts created successfully!`);

    created.forEach((admin) => {
      console.log(`  - ${admin.fullName} (${admin.email}) - ${admin.role}`);
    });

    await mongoose.disconnect();
    console.log("\nDatabase connection closed");
  } catch (error) {
    console.error("Error seeding admins:", error.message);
    process.exit(1);
  }
}

seedAdmins();
