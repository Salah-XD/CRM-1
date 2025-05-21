import { User } from "../models/usersModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

// JWT Secret Key (Ensure this is set in your environment variables for production)
const JWT_SECRET = process.env.JWT_SECRET || "arun@321";

if (!JWT_SECRET) {
  console.error(
    "JWT_SECRET is not set. Please set the JWT_SECRET environment variable."
  );
  process.exit(1); // Exit the application if JWT_SECRET is not set
}

const generateOTP = () => {
  const digits = "0123456789";
  let OTP = "";
  for (let i = 0; i < 6; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  return OTP;
};

export const registerUser = async (req, res) => {
  // console.log(req.body);
  try {
    const { userName, userId, password, role } = req.body;

    // Check if userId already exists
    const existingUser = await User.findOne({ userId });

    if (existingUser) {
      return res.status(400).json({ message: "User ID already exists" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create New User
    const newUser = new User({
      userName,
      userId,
      password: hashedPassword,
      role,
    });

    // Save user to the database
    await newUser.save();

    res
      .status(201)
      .json({ message: "User registered successfully", success: true });
  } catch (error) {
    console.error("Error registering user:", error); // Log error to console
    res.status(500).json({ message: "Server error" });
  }
};

//Controller for login
export const loginUser = async (req, res) => {
  try {
    const { userId, password, role } = req.body;

    // Check if user exists
    const user = await User.findOne({ userId });
    if (!user) {
      console.error("User not found");
      return res.status(200).json({ message: "Invalid user ID or password" });
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.error("Invalid password");
      return res.status(200).json({ message: "Invalid user ID or password" });
    }

    // Check if role matches
    if (user.role !== role) {
      console.error("Unauthorized role");
      return res
        .status(403)
        .json({ message: "You are not authorized for this role" });
    }

    // Generate JWT Token with user ObjectId
    const token = jwt.sign(
      {
        userName: user.userName,
        userId: user.userId,
        role: user.role,
        _id: user._id, // Include the actual user ObjectId in the payload
      },
      JWT_SECRET,
      { expiresIn: "6h" } // Token expiry time
    );

    res.status(200).json({ success: true, token });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

//Controller for forgot password
export const forgotPassword = async (req, res) => {
  const { userId } = req.body;

  try {
    if (!userId) {
      throw new Error("Missing userId");
    }

    const user = await User.findOne({ userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    //Genrate OTP
    const OTP = generateOTP();

    //Save OTP to user's record in database
    await User.findOneAndUpdate(
      {
        userId,
      },
      {
        $set: { resetPasswordOTP: OTP },
      },
      { new: true }
    );

    // Send OTP via email
   const transporter = nodemailer.createTransport({
        host: "smtp-relay.brevo.com",
        port: 2525, // Port 2525 (STARTTLS)
        secure: false, // No SSL for port 2525
        auth: {
          user: process.env.BREVO_SMTP_USER,
          pass: process.env.BREVO_SMTP_PASSWORD,
        },
      });
  

    const mailOptions = {
      from: `"Your Company" <unavar>`,
      to: userId,
      subject: "Password Reset OTP",
      text: `Your OTP for password reset is: ${OTP}.`,
    };

    await transporter.sendMail(mailOptions);
    console.log("OTP sent to", userId);

    res
      .status(200)
      .json({ message: "OTP sent successfully. Check your email." });
  } catch (error) {
    console.error("Erro occured:", error);
    res.status(500).json({ error: "Failed to send OTP" });
  }
};

const OTP_SECRET = process.env.OTP_SECRET || "arun@321"; // Ensure this is stored securely

export const verifyOTP = async (req, res) => {
  const { userId, otp } = req.body;

  try {
    if (!userId || !otp) {
      return res.status(400).json({ message: "Missing userId or otp" });
    }

    const user = await User.findOne({ userId });

    if (!user || user.resetPasswordOTP !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Invalidate the OTP after verification by setting it to null or removing it
    user.resetPasswordOTP = null;
    await user.save();

    // Generate a temporary JWT
    const token = jwt.sign({ userId: user.userId }, OTP_SECRET, {
      expiresIn: "15m",
    });

    res.status(200).json({ message: "OTP verified successfully", token });
  } catch (error) {
    console.error("Error during OTP verification:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

//setnewpassw
export const setNewPassword = async (req, res) => {
  const { newPassword, userId } = req.body;

  //   // Print the authorization token for debugging
  // console.log("Authorization Token:", req.headers.authorization);

  try {
    // Print the authorization token for debugging
    console.log("Authorization Token:", req.headers.authorization);

    if (!req.userId || !newPassword) {
      return res
        .status(400)
        .json({ message: "Missing newPassword or invalid token" });
    }

    const user = await User.findOne({ userId: req.userId });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update the user's password
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Error during password reset:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

//Get all user
export const fetchAllUsers = async (req, res) => {
  try {
    const { page = 1, pageSize = 10, sort, keyword } = req.query;

    // Convert page and pageSize to integers
    const pageNumber = parseInt(page, 10);
    const sizePerPage = parseInt(pageSize, 10);

    // Validate page number and page size
    if (
      isNaN(pageNumber) ||
      pageNumber < 1 ||
      isNaN(sizePerPage) ||
      sizePerPage < 1
    ) {
      return res
        .status(400)
        .json({ message: "Invalid page or pageSize parameter" });
    }

    // Create the base query
    let query = User.find();

    // Apply search keyword if provided
    if (keyword) {
      const searchRegex = new RegExp(keyword, "i"); // Case-insensitive regex
      query = query.where("userName").regex(searchRegex);
    }

    // Determine the sort query based on the 'sort' parameter
    const sortQuery = (() => {
      switch (sort) {
        case "newlyadded":
          return { createdAt: -1 };
        case "alllist":
          return { createdAt: 1 };
      }
    })();

    // Count total number of users
    const totalUsers = await User.countDocuments(query.getQuery());

    // Retrieve users with pagination and sorting
    const users = await query
      .skip((pageNumber - 1) * sizePerPage)
      .limit(sizePerPage)
      .sort(sortQuery)
      .select("userId role userName createdAt"); // Select only the needed fields

    res.json({
      total: totalUsers,
      currentPage: pageNumber,
      data: users,
    });
  } catch (error) {
    console.error("Error fetching users:", error); // Log error to console
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteFields = async (req, res) => {
  console.log(req.body);
  try {
    const arrayOfUserIds = req.body;

    // Validate arrayOfUserIds if necessary
    if (!Array.isArray(arrayOfUserIds)) {
      return res
        .status(400)
        .json({ error: "Invalid input: Expected an array of User IDs" });
    }

    // Perform deletions
    const deletionPromises = arrayOfUserIds.map(async (userId) => {
      // Delete User document
      await User.deleteOne({ _id: userId });
    });

    // Wait for all deletion operations to complete
    await Promise.all(deletionPromises);

    res.status(200).json({ message: "Users deleted successfully" });
  } catch (err) {
    console.error("Error deleting users:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;

    // Fetch the user by ID, excluding the password field
    const user = await User.findById(userId).select("-password");

    // Check if the user exists
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return the user details
    res.status(200).json(user);
  } catch (error) {
    console.error("Error in fetching the data:", error); // Log error to console
    res.status(500).json({ message: "Server Error" });
  }
};

export const updateUser = async (req, res) => {
  try {
    console.log(req.body);

    const { userId } = req.params;
    const { userName, password, role } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ _id: userId });

    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update the user details
    existingUser.userName = userName || existingUser.userName;
    existingUser.role = role || existingUser.role;

    // If password is provided, hash it and update
    if (password) {
      const salt = await bcrypt.genSalt(10);
      existingUser.password = await bcrypt.hash(password, salt);
    }

    // Save the updated user to the database
    await existingUser.save();

    res
      .status(200)
      .json({ message: "User updated successfully", success: true });
  } catch (error) {
    console.error("Error updating user:", error); // Log error to console
    res.status(500).json({ message: "Server error" });
  }
};
