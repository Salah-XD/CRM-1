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









export default router;