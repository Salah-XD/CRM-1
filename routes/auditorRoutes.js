import express from "express";
import {
  createAuditor,
  getAllAuditors,
  getAuditorById,
  updateAuditor,
  deleteAuditor,
} from "../controller/auditorController.js";
import { verifyToken } from "../middleware/auth.js"; // Ensure this middleware is available for protected routes

const router = express.Router();

// Public routes
router.post("/createAuditor", createAuditor); 
router.get("/getAllAuditors", getAllAuditors); // Get all auditors
router.get("/auditors/:id", getAuditorById); // Get a specific auditor by ID

// Protected routes (only for authenticated users)
router.put("/auditors/:id", updateAuditor); // Update an auditor by ID
router.delete("/auditors/:id", deleteAuditor); // Delete an auditor by ID

export default router;
