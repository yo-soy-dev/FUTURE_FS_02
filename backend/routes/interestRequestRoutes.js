import express from "express";
import {
  markInterest,
  getPendingRequests,
  approveRequestAndCreateLead,
  rejectRequest,
  createInterestRequest
} from "../controllers/interestRequestController.js";

import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * =========================
 * CLIENT ROUTES
 * =========================
 */
router.post("/request", protect, createInterestRequest);

// Client → inventory me interest mark kare
router.post(
  "/mark",
  protect,
  markInterest
);

/**
 * =========================
 * ADMIN ROUTES
 * =========================
 */

// Admin → get all pending interest requests
router.get(
  "/pending",
  protect,
  adminOnly,
  getPendingRequests
);

// Admin → approve request & create/update lead
router.post(
  "/approve/:id",
  protect,
  adminOnly,
  approveRequestAndCreateLead
);

// Admin → reject interest request
router.post(
  "/reject/:id",
  protect,
  adminOnly,
  rejectRequest
);

export default router;
