import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import leadRoutes from "./routes/leadRoutes.js";
import { createAdmin } from "./utils/createAdmin.js";
import inventoryRoutes from "./routes/inventoryRoutes.js";
import supportRoutes from "./routes/supportRoutes.js";
import interestRequestRoutes from "./routes/interestRequestRoutes.js";


dotenv.config();
connectDB();

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173", 
    credentials: true,             
  })
);

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/leads", leadRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/support", supportRoutes);
app.use("/api/interest", interestRequestRoutes);




createAdmin();


app.get("/", (req, res) => {
  res.send("FUTURE_FS_01 API running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
