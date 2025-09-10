import Razorpay from 'razorpay';
import crypto from 'crypto';
import { Account } from '../models/account.model.js';
import { Transaction } from '../models/transaction.model.js';
import mongoose from "mongoose";

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_API_KEY,
    key_secret: process.env.RAZORPAY_SECRET,
});

/**
 * @desc Create a Razorpay order for adding money
 */

export const createOrder = async (req, res) => {
    try {
        const { amount } = req.body;

        if (!amount || Number(amount) <= 0) {
            return res.status(400).json({ success: false, message: "A positive amount is required." });
        }

        const options = {
            amount: Number(amount) * 100, 
            currency: "INR",
            receipt: `receipt_order_${new Date().getTime()}`,
        };

        const order = await razorpay.orders.create(options);

        if (!order) {
            return res.status(500).json({ success: false, message: "Could not create Razorpay order." });
        }

        res.status(200).json({ success: true, order });

    } catch (error) {
        console.error("Create Order Error:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};



/**
 * @desc Verify the Razorpay payment and add balance to the user's wallet
 */
export const verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
        const userId = req.userId;

        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_SECRET)
            .update(body.toString()).digest('hex');
        
        if (expectedSignature === razorpay_signature) {
            const orderDetails = await razorpay.orders.fetch(razorpay_order_id);
            const amount = orderDetails.amount / 100;

            const session = await mongoose.startSession();
            session.startTransaction();
            try {
                await Account.updateOne({ userId }, { $inc: { balance: amount } }, { session });
                await Transaction.create([{
                    senderId: userId,
                    receiverId: userId,
                    amount: amount,
                    status: 'Success',
                    type: 'deposit' // Set type to deposit
                }], { session });
                await session.commitTransaction();
            } catch (error) {
                await session.abortTransaction();
                throw error;
            } finally {
                session.endSession();
            }
            res.status(200).json({ success: true, message: `Successfully added ₹${amount} to your wallet.` });
        } else {
            return res.status(400).json({ success: false, message: "Payment verification failed." });
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};
export const createWithdrawalLink = async (req, res) => {
    try {
        const { amount } = req.body;
        const userId = req.userId;
        const parsedAmount = Number(amount);

        const userAccount = await Account.findOne({ userId });
        if (!userAccount || userAccount.balance < parsedAmount) {
            return res.status(400).json({ success: false, message: "Insufficient wallet balance." });
        }

        const linkRequest = {
            amount: parsedAmount * 100,
            currency: "INR",
            description: "Payme Wallet Withdrawal",
            reference_id: userId.toString(), // We use this to identify the user in the webhook
            expire_by: Math.floor(Date.now() / 1000) + 1200,
        };

        const paymentLink = await new Promise((resolve, reject) => {
            razorpay.paymentLink.create(linkRequest, (error, link) => {
                if (error) return reject(error);
                resolve(link);
            });
        });
        
        // --- CRITICAL FIX: Balance is NO LONGER deducted here ---

        res.status(200).json({
            success: true,
            message: "Withdrawal link created.",
            link: paymentLink.short_url
        });

    } catch (error) {
        console.error("Create Withdrawal Link Error:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};