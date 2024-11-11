import express, { Router } from "express";
import { verifyToken } from "../middleware/auth.js";

import {
  createAgreement,
  deleteFields,
  getAllAgreementDetails,
  getAgreementById,
  updateAgreement,
  updateAgreementStatus,
  getAgreementsByProposalId
} from "../controller/agreementController.js";

import { generateagreement } from "../controller/agreementGenerationController.js";

const router = express.Router();

router.delete("/deleteFields", deleteFields);

router.post("/createAgreement", createAgreement);

router.get("/getAllAgreementDetails", getAllAgreementDetails);

router.post("/generateagreement/:agreementId", generateagreement);

router.get("/getAgreementById/:agreementId", getAgreementById);

router.put("/updateAgreement/:agreementId",updateAgreement);


router.put("/updateAgreementStatus/:agreementId",updateAgreementStatus);

router.get("/getAgreementsByProposalId/:proposalId", getAgreementsByProposalId);






export default router;
