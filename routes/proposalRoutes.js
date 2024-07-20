import express, { Router } from "express";
import { verifyToken } from "../middleware/auth.js";

import {
  getOutletDetailsById,
createProposalAndOutlet,
  getBusinessDetailsByEnquiryId,
  generateProposalNumber
} from "../controller/proposalController.js";


const router = express.Router();

router.get("/getOutletDetailsById/:enquiryId", getOutletDetailsById);

router.post("/createProposalAndOutlet", createProposalAndOutlet);

router.get(
  "/getBusinessDetailsByEnquiryId/:enquiryId",
  getBusinessDetailsByEnquiryId
);

router.get("/genrateProposalNumber",generateProposalNumber);


export default router;