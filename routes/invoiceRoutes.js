import express, { Router } from "express";
import { verifyToken } from "../middleware/auth.js";

import {
  generateInvoiceNumber,
  getProposalById,
  createInvoice,
  getAllInvoiceDetail,
  deleteFields
} from "../controller/invoiceController.js";

import {generateInvoice} from "../controller/invoicesGenerationController.js";

const router = express.Router();

router.get("/generateInvoiceNumber", generateInvoiceNumber);

router.post("/generateInvoice/:invoiceId", generateInvoice);

router.get("/getProposalById/:proposalId", getProposalById);

router.get("/getAllInvoiceDeatails", getAllInvoiceDetail);

router.delete("/deleteFields", deleteFields);

router.post("/createInvoice", createInvoice);








export default router;