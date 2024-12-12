import express, { Router } from "express";
import { verifyToken } from "../middleware/auth.js";

import {
  getOutletDetailsById,
  createProposalAndOutlet,
  getBusinessDetailsByEnquiryId,
  generateProposalNumber,
  getAllProposalDetails,
  getOutletsByProposalId,
  deleteFields,
  updateProposalStatus,
  getProposalById,
  updateProposalAndOutlet,
} from "../controller/proposalController.js";

import { generateProposal } from "../controller/proposalGenerationController.js";

const router = express.Router();

router.get("/getOutletDetailsById/:enquiryId", getOutletDetailsById);

router.post("/createProposalAndOutlet", createProposalAndOutlet);

router.get(
  "/getBusinessDetailsByEnquiryId/:enquiryId",
  getBusinessDetailsByEnquiryId
);

router.get("/genrateProposalNumber", generateProposalNumber);

router.put("/updateProposalAndOutlet/:proposalId", updateProposalAndOutlet);

router.post("/generateProposal/:proposalId", generateProposal);

router.get("/getAllProposalDetails", getAllProposalDetails);

router.get("/getOutletsByProposalId/:proposalId", getOutletsByProposalId);

router.delete("/deleteFields", deleteFields);

router.put("/updateProposalStatus/:proposalId", updateProposalStatus);

router.get("/getProposalById/:proposalId", getProposalById);

export default router;
