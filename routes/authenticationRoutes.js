import express from "express";
import {
  registerUser,
  loginUser,
  forgotPassword,
  verifyOTP,
  setNewPassword,
  fetchAllUsers,
} from "../controller/authController.js";
import { verifyJWT } from "../middleware/verifyOTP.js";

const router = express.Router();


router.post("/registerUser", registerUser);
router.post("/login", loginUser);
router.post("/forgotPassword", forgotPassword);
router.post("/verifyOtp", verifyOTP);
router.post("/setNewPassword", verifyJWT, setNewPassword);
router.post("/getAllUsers", verifyJWT, fetchAllUsers);

export default router;
