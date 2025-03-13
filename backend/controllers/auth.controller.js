import { User } from "../models/user.model.js";
import * as bcrypt from "bcryptjs";
import * as crypto from "crypto";
import generateTokenAndSetCookies from "../utils/generateTokenAndSetCookies.js";
import {
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendResetSuccessEmail
} from "../mailtrap/emails.js";

export const signup = async (req, res) => {
  const { email, password, name } = req.body;
  try {
    if (!email || !password || !name) {
      throw new Error("All fields are required!");
    }

    const userAlreadyExists = await User.findOne({ email });
    if (userAlreadyExists) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    const user = new User({
      email,
      password: hashedPassword,
      name,
      verificationToken,
      verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000 //24 hours
    });

    await user.save();

    await sendVerificationEmail(user.email, verificationToken);

    //jwt
    generateTokenAndSetCookies(res, user._id);
    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        ...user._doc,
        password: undefined
      }
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    console.log("Missing email or password or both.Once check again");
    return res
      .status(400)
      .json({ success: false, message: "Email and password are required." });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found!");

      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }

    // Generate token & set cookie
    const token = generateTokenAndSetCookies(res, user._id);

    // Update last login time
    user.lastLogin = new Date();
    await user.save();

    console.log("Logged in successful: ", email);
    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      token,
      user: {
        ...user._doc,
        password: undefined
      }
    });
  } catch (err) {
    console.log("Error in login ", err);
    res.status(400).json({ success: false, message: err.message });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res
      .status(400)
      .json({ success: false, message: "Email is required" });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    //generate reset token
    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; //hour

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiresAt = resetTokenExpiresAt;

    await user.save();

    const resetURL = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    console.log("Generated Reset URL:", resetURL); // Add this

    try {
      console.log(resetToken);
      await sendPasswordResetEmail(user.email, resetURL);
    } catch (error) {
      console.log("Error sending email:", error);
      return res
        .status(500)
        .json({ success: false, message: "Failed to send reset email" });
    }

    res.status(200).json({
      success: true,
      message: "Password reset link sent to your email"
    });
  } catch (err) {
    console.log("Error in forgotPassword ", err);
    res.status(400).json({ success: false, message: err.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiresAt: { $gt: Date.now() }
    });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired reset token" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiresAt = undefined;

    await user.save();

    await sendResetSuccessEmail(user.email);

    res
      .status(200)
      .json({ success: true, message: "Password reset successful" });
    //same as in auth.route file
  } catch (err) {}
};

export const logout = async (req, res) => {
  try {
    console.log("Request Object:", req);
    console.log("Response Object:", res);

    res.clearCookie("authToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "None"
    });

    res.status(200).json({ success: true, message: "Logout successful" });
  } catch (error) {
    console.error("Logout Error:", error);
    res.status(500).json({ success: false, message: "Logout failed", error });
  }
};

export const verifyEmail = async (req, res) => {
  const { code } = req.body;
  if (!code) {
    return res.status(400).json({
      success: false,
      message: "Verification code is required"
    });
  }
  try {
    const user = await User.findOne({
      verificationToken: code,
      verificationTokenExpiresAt: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification code"
      });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;

    await user.save();

    // await sendWelcomeEmail(user)
    res.status(200).json({
      success: true,
      message: "Email verified successfully",
      user: {
        ...user._doc,
        password: undefined
      }
    });
  } catch (err) {
    console.log("error in verification Email: ", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const checkAuth = async (req, res) => {
  if (!req.userId) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "user not found" });
    }

    res.status(200).json({ success: true, user });
  } catch (err) {
    console.log("error in verifyToken ", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
