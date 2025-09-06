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
            _id: { $ne: currentUserId }, 
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