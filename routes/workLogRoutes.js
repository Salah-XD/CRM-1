import express from "express";
import { verifyToken } from "../middleware/auth.js";
import {
  createWorkLog,
  deleteWorkLogs,
  getAllWorkLogsByUser,
  isWorkLogAlreadyExist,
  getAllWorkLogs,
  getWorkLogById,
  updateWorkLog,
} from "../controller/workLogController.js";

const router = express.Router();

// Route to create a new work log (protected) 
router.post("/createWorkLog", createWorkLog);

// Route to update an existing work log by ID (protected)
router.put("/updateWorkLog/:id", updateWorkLog);

// Route to delete a work log by ID (protected)
router.delete("/deleteFields", deleteWorkLogs);

router.get("/getAllWorkLogsByUser", getAllWorkLogsByUser);

router.get("/getAllWorkLogs",getAllWorkLogs);

router.get("/isWorkLogAlreadyExist",isWorkLogAlreadyExist);

router.get("/getWorkLogById/:workLogId",getWorkLogById);

router.put("/updateWorkLogById/:id",updateWorkLog);

export default router;
