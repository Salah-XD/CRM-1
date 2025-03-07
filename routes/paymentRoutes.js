import express, { Router } from "express";
import { verifyToken } from "../middleware/auth.js";
import {
  createPayment,
  getAllPayments,
  getPaymentById,
  getAllProposalDetails,
  saveAuditorPayment,
} from "../controller/paymentController.js";
import multer from "multer";

const router = express.Router();

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/payment-references");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// Define the route with Multer for handling file uploads
router.post(
  "/saveAuditorPayment",
  upload.single("referenceDocument"),
  saveAuditorPayment
);

router.post("/payments", createPayment);
router.get("/payments", getAllPayments);
router.get("/payments/:id", getPaymentById);

//Get all the proposal for the paymet with the given auditor id only
router.get("/getAllProposalDetails/:auditor_id", getAllProposalDetails);

export default router;
