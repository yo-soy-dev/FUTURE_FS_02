import User from "../models/User.js";
import bcrypt from "bcryptjs";

export const createAdmin = async () => {
  try {
    const adminEmail = "admin@gmail.com";
    const adminPassword = "12345678";

    // Hash password first
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    // Create or update admin
    const admin = await User.findOneAndUpdate(
      { email: adminEmail },
      {
        name: "Devansh Tiwari",
        email: adminEmail,
        password: hashedPassword,
        role: "admin",
      },
      { upsert: true, new: true } // create if doesn't exist
    );

    console.log(`Admin ready: ${adminEmail} / ${adminPassword}`);
  } catch (err) {
    console.error("Error creating admin:", err);
  }
};