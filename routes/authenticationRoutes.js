import express from "express";
import {
  registerUser,
  loginUser,
  forgotPassword,
  verifyOTP,
  setNewPassword,
  fetchAllUsers,
  deleteFields,
  getUserById,
  updateUser
} from "../controller/authController.js";
import { verifyJWT } from "../middleware/verifyOTP.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();


router.post("/registerUser", registerUser);
router.post("/login", loginUser);
router.post("/forgotPassword", forgotPassword);
router.post("/verifyOtp", verifyOTP);
router.post("/setNewPassword", setNewPassword);
router.get("/getAllUsers", fetchAllUsers);
router.delete("/deleteFields", deleteFields);
router.get("/getUserById/:userId",getUserById);
router.put("/updateUser/:userId",updateUser);

router.get("/protected", verifyToken,(req, res) => {
  console.log(req.user);
  res.status(200).json({
    message: "This is a protected route",
    user: {
      userName: req.user.userName,
      userId: req.user.userId,
      role: req.user.role,
      _id:req.user._id
    },
  });
});


export default router;
