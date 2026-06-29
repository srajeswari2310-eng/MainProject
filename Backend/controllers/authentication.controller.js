const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const userModel = require('../models/users.model');

// ✅ Register User
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const userExist = await userModel.findOne({ email });
    if (userExist) {
      return res.status(409).json({ success: false, message: "User already exists" });
    }

    const hashedPwd = await bcrypt.hash(password, 10);

    const newUser = new userModel({ name, email, password: hashedPwd, role });
    await newUser.save();

    res.status(201).json({ success: true, message: "User created successfully" });
  } catch (err) {
    console.error("Register Error:", err.message);
    res.status(500).json({ success: false, message: "Server error during registration" });
  }
};

// ✅ Login User
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const isPwdMatch = await bcrypt.compare(password, user.password);
    if (!isPwdMatch) {
      return res.status(401).json({ success: false, message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: user
    });
  } catch (err) {
    console.error("Login Error:", err.message);
    res.status(500).json({ success: false, message: "Server error during login" });
  }
};

// ✅ Forgot Password (generate OTP)
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // In production: send OTP via email/SMS
    res.status(200).json({
      success: true,
      message: "OTP generated successfully",
      otp,
      userId: user._id
    });
  } catch (err) {
    console.error("Forgot Password Error:", err.message);
    res.status(500).json({ success: false, message: "Server error during OTP generation" });
  }
};

// ✅ Reset Password
const resetPassword = async (req, res, next) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({ success: false, message: "Email and new password are required" });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const hashedPwd = await bcrypt.hash(newPassword, 10);
    user.password = hashedPwd;
    await user.save();

    res.status(200).json({ success: true, message: "Password reset successful" });
  } catch (err) {
    console.error("Reset Password Error:", err.message);
    res.status(500).json({ success: false, message: "Server error during password reset" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
};
