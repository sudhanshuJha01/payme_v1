import { User } from "../models/user.model.js";
import { Account } from "../models/account.model.js";
import { generateOTP } from "../utils/generateOTP.js";
import { sendEmailOTP } from "../config/mailOTP.js";
import jwt from 'jsonwebtoken'

export const register = async (req, res) => {
    try {
        const { fullname, email, password } = req.body;

        if (!fullname || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser && existingUser.isVerified) {
            return res.status(409).json({ message: "User with this email already exists" });
        }
        
        const user = existingUser || new User({ email, fullname });
        user.fullname = fullname;
        user.password = password;

        const otp =  generateOTP ();
        user.otp = otp;
        user.otp_expiry = new Date(Date.now() + 5 * 60 * 1000); 
        
        await user.save();

         await sendEmailOTP(user.email, otp); 

        return res.status(201).json({ 
            success: true, 
            message: `OTP sent to ${user.email}. Please verify.` 
        });

    } catch (error) {
        console.error("Register error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.otp !== otp || user.otp_expiry < new Date()) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }

        user.isVerified = true;
        user.otp = null;
        user.otp_expiry = null;
        await user.save();

        const existingAccount = await Account.findOne({ userId: user._id });
        if (!existingAccount) {
            await Account.create({ userId: user._id }); 
        }

        return res.status(200).json({ success: true, message: "Account verified successfully." });

    } catch (error) {
        console.error("Verify OTP error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user || !user.isVerified) {
            return res.status(404).json({ message: "User not found or not verified" });
        }

        const isPasswordValid = await user.isPasswordCorrect(password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production'
        };

        return res
            .status(200)
            .cookie("refreshToken", refreshToken, options)
            .json({
                success: true,
                message: "Login successful",
                accessToken,
                user: { _id: user._id, fullname: user.fullname, email: user.email }
            });

    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const logout = async (req, res) => {
    try {
  
        await User.findByIdAndUpdate(req.userId, {
            $set: { refreshToken: null }
        });

        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production'
        };

        return res
            .status(200)
            .clearCookie("refreshToken", options)
            .json({ success: true, message: "Logout successful" });

    } catch (error) {
        console.error("Logout error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const resendOtp = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ success: false, message: "Email is required" });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ success: false, message: "User with this email not found" });
        }

        if (user.isVerified) {
            return res.status(400).json({ success: false, message: "This account is already verified" });
        }

        const otp = generateOTP(); 
        user.otp = otp;
        user.otp_expiry = new Date(Date.now() + 5* 60 * 1000); 
        
        await user.save();

        await sendEmailOTP(user.email, otp); 
        return res.status(200).json({
            success: true,
            message: `New OTP sent successfully to ${user.email}`
        });

    } catch (error) {
        console.error("Resend OTP Error:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

/**
 * @desc Refresh the access token using the refresh token from the cookie
 */

export const refreshAccessToken = async (req, res) => {
    try {
        const incomingRefreshToken = req.cookies.refreshToken;

        if (!incomingRefreshToken) {
            return res.status(401).json({ success: false, message: "Unauthorized: No refresh token provided." });
        }

        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        );

        const user = await User.findById(decodedToken?._id);

        if (!user) {
            return res.status(401).json({ success: false, message: "Invalid refresh token." });
        }

        if (incomingRefreshToken !== user.refreshToken) {
            return res.status(401).json({ success: false, message: "Refresh token is expired or has been used." });
        }

        const newAccessToken = user.generateAccessToken();

        return res.status(200).json({
            success: true,
            accessToken: newAccessToken
        });

    } catch (error) {

        console.error("Refresh Token Error:", error);
        return res.status(401).json({ success: false, message: "Invalid or expired refresh token." });
    }
};