import jwt from "jsonwebtoken";

const OTP_SECRET = process.env.OTP_SECRET || "arun@321"; // Ensure this is stored securely

export const verifyJWT = (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(401).json({ message: "Authorization token required" });
  }

  try {
    const decoded = jwt.verify(token, OTP_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    console.error("Error verifying JWT:", error);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};
