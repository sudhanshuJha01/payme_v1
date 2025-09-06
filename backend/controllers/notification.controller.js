import { Notification } from '../models/notification.model.js';


export const getNotifications = async (req, res) => {
    try {
        const userId = req.userId;
        const notifications = await Notification.find({ userId: userId }).sort({ createdAt: -1 });

        return res.status(200).json({ success: true, notifications });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

export const markAsRead = async (req, res) => {
    try {
        const userId = req.userId;
        await Notification.updateMany(
            { userId: userId, isRead: false },
            { $set: { isRead: true } }
        );

        return res.status(200).json({ success: true, message: "Notifications marked as read." });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};