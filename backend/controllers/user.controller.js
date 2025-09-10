import { User } from "../models/user.model.js";

/**
 * @desc Get the profile of the currently logged-in user
 */

export const getMyProfile = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select("-password -refreshToken -otp");

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        return res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        console.error("Get Profile Error:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

/**
 * @desc Search for other users in the system to pay
 */
export const searchUsers = async (req, res) => {
    try {
        const filter = req.query.filter || "";
        const currentUserId = req.userId;

        const users = await User.find({       
            $or: [
                { fullname: { $regex: filter, $options: "i" } },
                { email: { $regex: filter, $options: "i" } }
            ]
        }).select("fullname email _id");

        return res.status(200).json({
            success: true,
            users
        });

    } catch (error) {
        console.error("Search Users Error:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};
/**
 * @desc Update the logged-in user's profile information (e.g., name)
 */

export const updateProfile = async (req, res) => {
    try {
        const { fullname } = req.body;
        const userId = req.userId;

        if (!fullname) {
            return res.status(400).json({ success: false, message: "Full name is required." });
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: { fullname: fullname } },
            { new: true } // This option returns the updated document
        ).select("-password -refreshToken -otp -otp_expiry");

        if (!updatedUser) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully.",
            user: updatedUser
        });

    } catch (error) {
        console.error("Update Profile Error:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

/**
 * @desc Change the password for the logged-in user
 */
export const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = req.userId;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ success: false, message: "Current and new passwords are required." });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ success: false, message: "New password must be at least 6 characters long." });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

        const isPasswordCorrect = await user.isPasswordCorrect(currentPassword);
        if (!isPasswordCorrect) {
            return res.status(401).json({ success: false, message: "Incorrect current password." });
        }

        user.password = newPassword;
        await user.save({ validateBeforeSave: true });

        return res.status(200).json({ success: true, message: "Password changed successfully." });

    } catch (error) {
        console.error("Change Password Error:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};
