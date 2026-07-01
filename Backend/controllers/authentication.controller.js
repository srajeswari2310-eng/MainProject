const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');
const userModel = require('../models/users.model');

// Temporary memory store (Use Redis/DB in production)
const otpStore = {};

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
});

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

    // Step 1: Find user and populate location
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));

    const user = await userModel.findOne({ email })
      .populate({
        path: 'favoriteSlot.locationId',
        select: 'location floors'
      })
      .populate({
        path: "reservedSlot",
        model: "Reservation",
        match: {
          startDate: { $gte: startOfDay } // reservations starting today or later
        }
      });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Step 2: Verify password
    const isPwdMatch = await bcrypt.compare(password, user.password);
    if (!isPwdMatch) {
      return res.status(401).json({ success: false, message: "Invalid password" });
    }

    // Step 3: Enrich favorite slots with floor + slot details
    const enrichedFavoriteSlots = user.favoriteSlot.map(fav => {
      const location = fav.locationId;
      if (!location) return fav;

      const floor = location.floors.id(fav.floorId);
      let slot = null;
      if (floor) {
        slot = floor.slots.id(fav.slotId);
      }

      return {
        location: location.location, // location name
        locationId: location._id,    // location id
        floor: floor ? { _id: floor._id, name: floor.name } : null,
        slot: slot ? slot : null
      };
    });

    // Step 4: Generate JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Step 5: Respond with enriched data
    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        vehicles: user.vehicles,
        favoriteSlot: enrichedFavoriteSlots,
        reservedSlot: user.reservedSlot
      }
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

// Endpoint: Send OTP
exports.generateOtp = async (req, res) => {
  const { email } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore[email] = { otp, expiresAt: Date.now() + 300000 };

  await transporter.sendMail({
    from: process.env.EMAIL_USER, to: email,
    subject: 'Verification Code', text: `Your OTP: ${otp}`
  });
  res.status(200).json({ message: 'OTP sent' });
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
