import { User } from "../models/usersModel.js";

export const verifyOTPMiddleware = async (req, res, next) => {
  const { userId, otp } = req.body;

  try {
    if (!userId || !otp) {
      return res.status(400).json({ message: "Missing userId or otp" });
    }

    const user = await User.findOne({ userId });

    if (!user || user.resetPasswordOTP !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Optionally, invalidate the OTP after verification by setting it to null or removing it
    user.resetPasswordOTP = null;
    await user.save();

    // Attach user to request object
    req.user = user;

    next();
  } catch (error) {
    console.error("Error during OTP verification:", error);
    res.status(500).json({ message: "Server error", error });
  }
};
