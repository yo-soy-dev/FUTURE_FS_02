import express from "express";
import {
  createItem,
  getItems,
  updateItem,
  deleteItem,
} from "../controllers/inventoryController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/public", getItems);

router.use(protect, adminOnly);

router.post("/", createItem);
router.get("/", getItems);
router.put("/:id", updateItem);
router.delete("/:id", deleteItem);

export default router;
