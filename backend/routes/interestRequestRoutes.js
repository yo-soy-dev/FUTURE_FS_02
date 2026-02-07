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

router.post("/request", protect, createInterestRequest);

router.post(
  "/mark",
  protect,
  markInterest
);


router.get(
  "/pending",
  protect,
  adminOnly,
  getPendingRequests
);

router.post(
  "/approve/:id",
  protect,
  adminOnly,
  approveRequestAndCreateLead
);

router.post(
  "/reject/:id",
  protect,
  adminOnly,
  rejectRequest
);

export default router;
