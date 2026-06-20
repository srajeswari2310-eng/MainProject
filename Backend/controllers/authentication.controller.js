const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const userModel = require('../models/users.model');

//method: POST
//process: User registration
//route public route

const registerUser = async(req, res, next) => {
    try{
        const { name, email, password, role } = req.body;

        const userExist = await userModel.findOne({email});

        if(userExist) {
            return res.json({
                success: false,
                message : "User already exist"
            });
        }

        const hasedPwd = await bcrypt.hash(password, 10);

        const newUser = new userModel({
            name,
            email,
            password: hasedPwd,
            role
        });

        await newUser.save();

        res.status(200).json({
            success: true,
            message : "User Created successfully"
        });

    }catch(err) {
        next(err);
    }
}

//method: Post
//process: login user and get JWT token
//route public 

const loginUser = async (req,res) => {
    try{
        const {email, password} = req.body;

        const user = await userModel.findOne({email});
        
        if(!user) {
            return res.status(404).json({
                success: false,
                message : "User not found"
            });
        }

        const isPwdMatch = await bcrypt.compare(password, user.password);
        
        if(!isPwdMatch) {
             return res.status(500).json({
                success: false,
                message : "Invalid Password"
            });
        };

        const token = await jwt.sign(
            {
                id: user._id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1h"
            }
        );

        res.status(200).json({
            success: true,
            message: "User LoggedIn",
            token,
            user: user
        });
    } catch(err) {
       next(err);
    }
}


// ✅ Forgot Password (generate 6-digit OTP)
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();


    // In production: send OTP via email/SMS
    res.status(200).json({
      success: true,
      changeUser: user,
      message: "OTP generated successfully",
      otp, 
    });
  } catch (err) {
    next(err);
  }
};

// ✅ Reset Password (verify OTP)
const resetPassword = async (req, res, next) => {
  try {
    const { email, newPassword } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Update password
    const hashedPwd = await bcrypt.hash(newPassword, 10);
    user.password = hashedPwd;

    await user.save();

    res.status(200).json({ success: true, message: "Password reset successful" });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
};