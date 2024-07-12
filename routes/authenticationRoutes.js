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
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();


router.post("/registerUser", registerUser);
router.post("/login", loginUser);
router.post("/forgotPassword", forgotPassword);
router.post("/verifyOtp", verifyOTP);
router.post("/setNewPassword", verifyJWT, setNewPassword);
router.post("/getAllUsers", verifyJWT, fetchAllUsers);
router.get("/protected", verifyToken, (req, res) => {
  res.status(200).json({
    message: "This is a protected route",
    user: {
      userName: req.user.userName,
      userId: req.user.userId,
      role: req.user.role,
    },
  });
});


export default router;
