import User from "../models/User.js";
import bcrypt from "bcryptjs";

export const createAdmin = async () => {
  try {
    const adminEmail = "admin@gmail.com";
    const adminPassword = "12345678";

    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    const admin = await User.findOneAndUpdate(
      { email: adminEmail },
      {
        name: "Devansh Tiwari",
        email: adminEmail,
        password: hashedPassword,
        role: "admin",
      },
      { upsert: true, new: true } 
    );

    console.log(`Admin ready: ${adminEmail} / ${adminPassword}`);
  } catch (err) {
    console.error("Error creating admin:", err);
  }
};