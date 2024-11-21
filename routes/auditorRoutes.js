import express from "express";
import {
  createAuditor,
  getAllAuditors,
  getAuditorById,
  updateAuditor,
  deleteAuditor,
  processProposalsWithOutlets
} from "../controller/auditorController.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.post("/createAuditor", createAuditor); 
router.get("/getAllAuditors", getAllAuditors); 
router.get("/auditors/:id", getAuditorById);

// Protected routes (only for authenticated users)
router.put("/auditors/:id", updateAuditor); 
router.delete("/auditors/:id", deleteAuditor);


router.get("/processProposalsWithOutlets",processProposalsWithOutlets);









export default router;
