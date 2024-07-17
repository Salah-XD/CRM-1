import express, { Router } from "express";
import { verifyToken } from "../middleware/auth.js";

import {
  saveEnquiryForm,
  getAllEnquiryDetails,
  deleteFields,
  updateEnquiryById,
  getEnquiryById,
} from "../controller/enquiryController.js";

const router = express.Router();

router.post("/saveEnquiryForm", saveEnquiryForm);

router.get("/getAllEnquiryDetails", getAllEnquiryDetails);

router.get("/getEnquiryById/:id", getEnquiryById);

router.delete("/deleteFields", deleteFields);

router.put("/updateEnquiryById/:id", updateEnquiryById);






export default router;
