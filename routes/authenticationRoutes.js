import express from "express";
import {
  registerUser,
  loginUser,
  forgotPassword,
  setNewPassword
} from "../controller/authController.js";

import { verifyOTPMiddleware } from "../middleware/verifyOTP.js";
const router = express.Router();


router.post("/registerUser", registerUser);
router.post("/login", loginUser);
router.post("/forgotPassword", forgotPassword);
router.post("/setNewPassword",verifyOTPMiddleware, setNewPassword);

export default router;
