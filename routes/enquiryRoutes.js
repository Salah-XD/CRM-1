import express, { Router } from "express";
import { verifyToken } from "../middleware/auth.js";

import {
  saveEnquiryForm,
  getAllEnquiryDetails,
  deleteFields,
  updateEnquiry,
} from "../controller/enquiryController.js";

const router = express.Router();

router.post("/saveEnquiryForm", saveEnquiryForm);

router.get("/getAllEnquiryDetails", getAllEnquiryDetails);

router.delete("/deleteFields", deleteFields);

router.delete("/updateEnquiry", updateEnquiry);




export default router;
