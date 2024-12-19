import express from "express";
import {
  createAuditor,
  getAllAuditors,
  getAuditorById,
  updateAuditor,
  deleteAuditor,
  processProposalsWithOutlets,
  getAuditAdmins,
  saveAuditRecord,
  getAudits,
  getAuditById,
  updateAuditById,
  updateStatusHistoryByAuditId,
  saveLabel,
  addQuestionToLabel,
  fetchLabelsWithQuestions,
  saveAuditResponses,
  updateAuditResponses,
  fetchingQuestionAnswer,
  getUserNameById,
  updateStartedDate,
  deleteAuditById,updateFssaiDetails,
  auditorCount
} from "../controller/auditorController.js";
import { verifyToken } from "../middleware/auth.js";
import multer from "multer";
import path from "path";

import { generateAuditReport } from "../controller/auditReportGenerationController.js";

// Configure multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Define where to store the uploaded files
  },
  filename: (req, file, cb) => {
    // Set the file name to be saved in the destination folder
    cb(null, Date.now() + path.extname(file.originalname)); // Append timestamp to avoid file name conflicts
  },
});



const storage2 = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Specify the folder to store the uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // Specify the file name
  },
});

const upload = multer({ storage: storage });
const upload2 = multer({ storage: storage }).single("file")

const router = express.Router();

// Public routes
router.post("/createAuditor", createAuditor);

router.get("/getAllAuditors", getAllAuditors);

router.get("/auditors/:id", getAuditorById);

// Protected routes (only for authenticated users)
router.put("/auditors/:id", updateAuditor);

router.delete("/auditors/:id", deleteAuditor);

router.get("/processProposalsWithOutlets", processProposalsWithOutlets);

router.get("/getAuditAdmins", getAuditAdmins);

router.post("/saveAuditRecord", saveAuditRecord);

router.get("/getAllAudits", getAudits);

router.get("/getAuditById/:id", getAuditById);

router.put("/updateAuditById/:id", updateAuditById);

router.put(
  "/updateStatusHistoryByAuditId/:auditId",
  updateStatusHistoryByAuditId
);

// Route to save a new label
router.post("/labels", saveLabel);

// Route to add a question to a label
router.post("/labels/:labelId/questions", addQuestionToLabel);

router.get("/fetchLabelsWithQuestions", fetchLabelsWithQuestions);

router.get("/fetchingQuestionAnswer/:auditId", fetchingQuestionAnswer);

router.post("/saveAuditResponses", upload.array("files"), saveAuditResponses);

router.post(
  "/updateAuditResponses",
  upload.array("files"),
  updateAuditResponses
);

router.get("/getUserNameById/:userId", getUserNameById);

router.put("/updateStartedDate/:audit_id", updateStartedDate);

router.get("/generateAuditReport/:audit_id", generateAuditReport);

router.delete("/deleteAuditById/:id", deleteAuditById);

router.put("/updateFssaiDetails", upload2, updateFssaiDetails);

router.get("/approvedAuditCount",auditorCount)

export default router;
