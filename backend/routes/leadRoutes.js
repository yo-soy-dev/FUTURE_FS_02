import express from "express";
import {
  createLead,
  getLeads,
  updateLead,
  deleteLead,
  getLeadByEmail,
  getInterestedUsersByInventory,
  getLeadsByInventory,
} from "../controllers/leadController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, adminOnly, createLead);

router.get("/", protect, adminOnly, getLeads);
router.put("/:id", protect, adminOnly, updateLead);
router.delete("/:id", protect, adminOnly, deleteLead);
router.get("/my", protect, getLeadByEmail);
router.get("/inventory/:id", protect,adminOnly, getInterestedUsersByInventory);
router.get("/inventory/:inventoryId", protect, adminOnly, getLeadsByInventory);



export default router;
