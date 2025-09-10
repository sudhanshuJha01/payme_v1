import crypto from 'crypto';
import { Account } from '../models/account.model.js';
import { Transaction } from '../models/transaction.model.js';
import mongoose from 'mongoose';

export const handleRazorpayWebhook = async (req, res) => {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET; // Set this in your .env
    const receivedSignature = req.headers['x-razorpay-signature'];
    
    // 1. Verify the webhook signature
    const generatedSignature = crypto
        .createHmac('sha256', secret)
        .update(JSON.stringify(req.body))
        .digest('hex');

    if (generatedSignature !== receivedSignature) {
        return res.status(400).send('Invalid signature');
    }

    // 2. Process the event if the signature is valid
    const event = req.body;
    
    // Only act on the 'payment_link.paid' event for withdrawals
    if (event.event === 'payment_link.paid' && event.payload.payment_link.entity.description === "Payme Wallet Withdrawal") {
        const paymentLink = event.payload.payment_link.entity;
        const userId = paymentLink.reference_id;
        const amount = paymentLink.amount / 100;

        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            // Deduct balance and log transaction atomically
            await Account.updateOne(
                { userId: userId },
                { $inc: { balance: -amount } },
                { session }
            );
            await Transaction.create([{
                senderId: userId,
                receiverId: userId,
                amount: amount,
                status: 'Success',
                type: 'withdrawal'
            }], { session });

            await session.commitTransaction();
        } catch (error) {
            await session.abortTransaction();
            console.error("Failed to process withdrawal webhook:", error);
        } finally {
            session.endSession();
        }
    }

    res.status(200).json({ status: 'ok' });
};