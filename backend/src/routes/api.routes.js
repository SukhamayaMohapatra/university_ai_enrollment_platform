import express from "express";
import multer from "multer";
import {
  processAllocation,
  getAllocationDashboard,
  askAllocationAI,
  resetAllocation,
} from "../controllers/allocation.controller.js";
import {
  uploadDataset,
  queryDataset,
  getHistory,
} from "../controllers/analytics.controller.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Task 1 Routes
router.post("/allocation/process", processAllocation);
router.get("/allocation/dashboard", getAllocationDashboard);
// Route to completely reset student allocations
router.post("/reset", resetAllocation);
router.post("/allocation/ai-query", askAllocationAI);

// Task 2 Routes
router.post("/analytics/upload", upload.single("file"), uploadDataset);
router.post("/analytics/query", queryDataset);
router.get("/analytics/history", getHistory);

export default router;
