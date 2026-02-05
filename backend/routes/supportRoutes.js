import express from "express";
import { createSupportTicket, getAllTickets, getMyTickets, resolveTicket } from "../controllers/supportController.js";
import { adminOnly, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createSupportTicket);
router.get("/", protect, adminOnly, getAllTickets);
router.patch("/:id/resolve", protect, adminOnly, resolveTicket);
router.get("/my", protect, getMyTickets);

export default router;
