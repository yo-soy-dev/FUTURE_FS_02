import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const register = async (req, res) => {
  try {
    console.log("Client register request body:", req.body);
    const { name, email, password, role } = req.body;
    
    if (!name || !email || !password) {
      console.log("Missing fields in register"); // ❌ कोई field missing है
      return res.status(400).json({ msg: "All fields required" });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    console.log("User already exists:", existingUser);
    if (existingUser) return res.status(400).json({ msg: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 8); // fixed salt
    console.log("Hashed password:", hashedPassword);

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role
    });

    console.log("User created:", user); 

    res.status(201).json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    });

  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ msg: err.message });
  }
};



export const login = async (req, res) => {
  try{
    console.log("Request body:", req.body);
  const { email, password } = req.body;

  const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
  console.log("Found user:", user);
  if (!user) return res.status(400).json({ msg: "User not found" });
  console.log("Comparing password:", password, "with hash:", user.password);

  if (!user.password) return res.status(500).json({ msg: "Password not set for this user" });

  const match = await bcrypt.compare(req.body.password, user.password);
   console.log("Password match:", match);
  if (!match) return res.status(400).json({ msg: "Invalid password" });

  const token = jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  // res.json({ token, user });
  res.json({
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

export const getClients = async (req, res) => {
  try {
    const role = req.query.role;
    if (role) {
      const users = await User.find({ role });
      return res.json(users);
    }
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};