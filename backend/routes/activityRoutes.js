import express from "express";
import { getAllActivities } from "../controllers/activityController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, adminOnly, getAllActivities);

export default router;
