import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "arun@321";

export const verifyToken = (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader) {
    return res
      .status(401)
      .json({ message: "Access Denied. No token provided." });
  }

  const token = authHeader.replace("Bearer ", "");

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access Denied. Invalid token format." });
  }

  try {
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = {
      userName: verified.userName,
      userId: verified.userId,
      role: verified.role,
    };
    next();
  } catch (error) {
    console.error("Invalid Token:", error);
    res.status(400).json({ message: "Invalid Token" });
  }
};
