import mongoose from "mongoose";
import { Account } from "../models/account.model.js";
import { Transaction } from "../models/transaction.model.js";
import { Notification } from "../models/notification.model.js";
import { User } from "../models/user.model.js";

/**
 * @desc Get the balance of the logged-in user
 */

export const getBalance = async (req, res) => {
    try {
        const account = await Account.findOne({ userId: req.userId });

        if (!account) {
            return res.status(404).json({
                success: false,
                message: "User account not found.",
            });
        }

        res.status(200).json({
            success: true,
            balance: account.balance,
        });
    } catch (err) {
        console.error("Get Balance Error:", err);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error while fetching balance.",
        });
    }
};

/**
 * @desc Transfer funds from the logged-in user to another user
 */

export const transfer = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { amount, to } = req.body;
        const fromUserId = req.userId;

        if (fromUserId === to) {
            await session.abortTransaction();
            return res.status(400).json({ success: false, message: "Cannot send money to yourself." });
        }

        const transferAmount = Number(amount);
        if (isNaN(transferAmount) || transferAmount <= 0) {
            await session.abortTransaction();
            return res.status(400).json({
                success: false,
                message: "Transfer amount must be a positive number.",
            });
        }

        const fromAccount = await Account.findOne({ userId: fromUserId }).session(session);

        if (!fromAccount || fromAccount.balance < transferAmount) {
            await session.abortTransaction();
            return res.status(400).json({ success: false, message: "Insufficient balance." });
        }

        const toAccount = await Account.findOne({ userId: to }).session(session);

        if (!toAccount) {
            await session.abortTransaction();
            return res.status(404).json({ success: false, message: "Recipient account not found." });
        }

        await Account.updateOne(
            { userId: fromUserId },
            { $inc: { balance: -transferAmount } }
        ).session(session);

        await Account.updateOne(
            { userId: to },
            { $inc: { balance: transferAmount } }
        ).session(session);

        await Transaction.create(
            [{
                senderId: fromUserId,
                receiverId: to,
                amount: transferAmount,
                status: "Success",
            }],
            { session }
        );

        await session.commitTransaction();

        // Create a notification for the recipient (outside the transaction)
        try {
            const sender = await User.findById(fromUserId);
            if (sender) {
                await Notification.create({
                    userId: to,
                    message: `${sender.fullname} sent you ₹${transferAmount}.`,
                });
            }
        } catch (notificationError) {
            console.error("Failed to create notification:", notificationError);
        }

        res.status(200).json({
            success: true,
            message: "Transfer successful",
        });
    } catch (err) {
        await session.abortTransaction();
        console.error("Transfer Error:", err);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error during transfer.",
        });
    } finally {
        session.endSession();
    }
};

/**
 * @desc Get the transaction history for the logged-in user
 */
export const getHistory = async (req, res) => {
    try {
        const userId = req.userId;

        const transactions = await Transaction.find({
            $or: [{ senderId: userId }, { receiverId: userId }],
        })
        .populate("senderId", "fullname")
        .populate("receiverId", "fullname")
        .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            transactions,
        });
    } catch (error) {
        console.error("Get History Error:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};