import { User } from '../models/user.model.js';
import { generateOTP } from '../utils/generateOTP.js';
import { sendEmailOTP } from '../config/mailOTP.js'; 

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email, isVerified: true });

        if (!user) {
            return res.status(404).json({ success: false, message: "Verified user with this email does not exist." });
        }

        const otp = generateOTP();
        user.otp = otp;
        user.otp_expiry = new Date(Date.now() + 5 * 60 * 1000);
        await user.save();

        await sendEmailOTP(user.email, otp);

        return res.status(200).json({ success: true, message: `Password reset OTP sent to ${user.email}.` });

    } catch (error) {
        console.error("Forgot Password Error:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

export const verifyResetOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await User.findOne({ email });

        if (!user || user.otp !== otp || user.otp_expiry < new Date()) {
            return res.status(400).json({ success: false, message: "Invalid or expired OTP." });
        }

        return res.status(200).json({ success: true, message: "OTP verified successfully. You can now reset your password." });

    } catch (error) {
        console.error("Verify Reset OTP Error:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

// --- Step 3: Set New Password ---
export const resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;

        if (!newPassword || newPassword.length < 6) {
            return res.status(400).json({ success: false, message: "Password must be at least 6 characters long." });
        }

        const user = await User.findOne({ email });

        if (!user || user.otp !== otp || user.otp_expiry < new Date()) {
            return res.status(400).json({ success: false, message: "Invalid or expired OTP. Please start over." });
        }

        user.password = newPassword; // The pre-save hook will hash it
        user.otp = null;
        user.otp_expiry = null;
        await user.save();

        return res.status(200).json({ success: true, message: "Password has been reset successfully. Please log in." });

    } catch (error) {
        console.error("Reset Password Error:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};