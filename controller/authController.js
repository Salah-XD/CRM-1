import { User } from "../models/usersModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

// JWT Secret Key (Ensure this is set in your environment variables for production)
const JWT_SECRET = process.env.JWT_SECRET || 'arun@321';

if (!JWT_SECRET) {
  console.error("JWT_SECRET is not set. Please set the JWT_SECRET environment variable.");
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
  console.log(req.body);
  try {
    const { userId, password, role } = req.body;

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
      userId,
      password: hashedPassword,
      role,
    });

    // Save user to the database
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error registering user:", error); // Log error to console
    res.status(500).json({ message: "Server error" });
  }
};


//Controller for login
export const loginUser = async (req, res) => {
  try {
    const { userId, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ userId });
    if (!user) {
      console.error("User not found");
      return res.status(400).json({ message: "Invalid user ID or password" });
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.error("Invalid password");
      return res.status(400).json({ message: "Invalid user ID or password" });
    }

    // Generate JWT Token
    const token = jwt.sign(
      {
        userId: user.userId,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: "1h" } // Token expiry time
    );

    res.status(200).json({ token });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

//Controller for forgot password
export const forgotPassword=async(req,res)=>{
  const {userId}=req.body;

  try{
    if (!userId) {
      throw new Error("Missing userId");
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
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

 const mailOptions = {
   from: `"Your Name" <${process.env.EMAIL_USERNAME}>`,
   to: userId,
   subject: "Password Reset OTP",
   text: `Your OTP for password reset is: ${OTP}.`,
 };

 await transporter.sendMail(mailOptions);
 console.log("OTP sent to", userId);

 res.status(200).json({ message: "OTP sent successfully. Check your email." });



  }catch(error){
    console.error("Erro occured:",error);
    res.status(500).json({error:"Failed to send OTP"});
  }
}

//Verify the otp
// export const verifyOTP=async(req,res)=>{
//   const{userId,otp}=req.body;

//   try{
//     if(!userId || !otp){
//       return res.status(400).json({message:"Missing userId or otp"
//       });
//     }

//   const user=await User.findOne({userId});

//   if(!user || user.resetPasswordOTP!==otp){
//     return res.status(400).json({message:"Invalid OTP"});
//   }

//   //Invalidate the otp
//   user.resetPasswordOTP=null;
//   await user.save();

// res.status(200).json({ message: "OTP verified successfully" });
//   }catch(error){
//     console.error("Error during OTP verification",error);
//     res.status(500).json({message:"Server error",error});
//   }
// };

//Set new password Controller
export const setNewPassword = async (req, res) => {
  const { newPassword } = req.body;

  try {
    if (!newPassword) {
      return res.status(400).json({ message: "Missing newPassword" });
    }

    const user = req.user; // Retrieved from the middleware

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