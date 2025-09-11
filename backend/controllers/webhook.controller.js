import crypto from 'crypto';
import { Account } from '../models/account.model.js';
import { Transaction } from '../models/transaction.model.js';
import mongoose from 'mongoose';

export const handleRazorpayWebhook = async (req, res) => {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const receivedSignature = req.headers['x-razorpay-signature'];
   
    // 1. Verify the webhook signature
    const generatedSignature = crypto
        .createHmac('sha256', secret)
        .update(JSON.stringify(req.body))
        .digest('hex');
        
    if (generatedSignature !== receivedSignature) {
        console.log('❌ Invalid webhook signature');
        return res.status(400).send('Invalid signature');
    }

    // 2. Process the event if the signature is valid
    const event = req.body;
    
    // 🐛 DEBUG: Log all webhook events to see what we're getting
    console.log('🔔 Webhook received:', {
        event: event.event,
        payload: event.payload,
        timestamp: new Date().toISOString()
    });

    // Handle multiple event types for payment completion
    const isPaymentComplete = 
        event.event === 'payment_link.paid' || 
        event.event === 'payment.captured' ||
        event.event === 'payment_link.payment.captured';

    // Check if it's a withdrawal-related payment
    const isWithdrawal = 
        event.payload?.payment_link?.entity?.description === "Payme Wallet Withdrawal" ||
        event.payload?.payment?.entity?.description === "Payme Wallet Withdrawal";

    if (isPaymentComplete && isWithdrawal) {
        console.log('✅ Processing withdrawal payment...');
        
        // Extract data based on event type
        let userId, amount;
        
        if (event.event === 'payment_link.paid') {
            const paymentLink = event.payload.payment_link.entity;
            userId = paymentLink.reference_id.split('_')[0]; // Extract userId from reference_id
            amount = paymentLink.amount / 100;
        } else if (event.event === 'payment.captured' || event.event === 'payment_link.payment.captured') {
            // For payment.captured events, we need to get user info differently
            const payment = event.payload.payment.entity;
            // You might need to store payment_link_id in your payment creation
            // For now, let's try to get it from notes or description
            userId = payment.notes?.user_id || payment.description?.match(/user_(\w+)/)?.[1];
            amount = payment.amount / 100;
        }

        if (!userId || !amount) {
            console.log('❌ Could not extract userId or amount from webhook');
            return res.status(400).json({ error: 'Invalid webhook data' });
        }

        const session = await mongoose.startSession();
        session.startTransaction();
        
        try {
            // Check if this transaction was already processed
            const existingTransaction = await Transaction.findOne({
                senderId: userId,
                amount: amount,
                type: 'withdrawal',
                status: 'Success',
                createdAt: { $gte: new Date(Date.now() - 5 * 60 * 1000) } // Last 5 minutes
            }).session(session);

            if (existingTransaction) {
                console.log('⚠️ Transaction already processed, skipping...');
                await session.abortTransaction();
                return res.status(200).json({ status: 'already_processed' });
            }

            // Deduct balance and log transaction atomically
            const accountUpdate = await Account.updateOne(
                { userId: userId },
                { $inc: { balance: -amount } },
                { session }
            );

            if (accountUpdate.matchedCount === 0) {
                throw new Error('User account not found');
            }

            await Transaction.create([{
                senderId: userId,
                receiverId: userId,
                amount: amount,
                status: 'Success',
                type: 'withdrawal',
                metadata: {
                    razorpay_event: event.event,
                    processed_at: new Date()
                }
            }], { session });

            await session.commitTransaction();
            console.log('✅ Withdrawal processed successfully for user:', userId);
            
        } catch (error) {
            await session.abortTransaction();
            console.error("❌ Failed to process withdrawal webhook:", error);
            return res.status(500).json({ error: 'Processing failed' });
        } finally {
            session.endSession();
        }
    } else {
        console.log('ℹ️ Webhook event ignored:', {
            event: event.event,
            isPaymentComplete,
            isWithdrawal
        });
    }

    res.status(200).json({ status: 'ok' });
};

// Also update your createWithdrawalLink function to include user_id in notes
export const createWithdrawalLink = async (req, res) => {
    try {
        const { amount } = req.body;
        const userId = req.userId;
        const parsedAmount = Number(amount);
        
        const userAccount = await Account.findOne({ userId });
        if (!userAccount || userAccount.balance < parsedAmount) {
            return res.status(400).json({ 
                success: false, 
                message: "Insufficient wallet balance." 
            });
        }

        const linkRequest = {
            amount: parsedAmount * 100,
            currency: "INR",
            description: "Payme Wallet Withdrawal",
            reference_id: `${userId.toString()}_${Date.now()}`,
            expire_by: Math.floor(Date.now() / 1000) + 1200,
            // 🔧 ADD: Include user_id in notes for easier webhook processing
            notes: {
                user_id: userId.toString(),
                type: 'withdrawal'
            }
        };

        const paymentLink = await new Promise((resolve, reject) => {
            razorpay.paymentLink.create(linkRequest, (error, link) => {
                if (error) return reject(error);
                resolve(link);
            });
        });
       
        res.status(200).json({
            success: true,
            message: "Withdrawal link created.",
            link: paymentLink.short_url
        });
        
    } catch (error) {
        console.error("Create Withdrawal Link Error:", error);
        return res.status(500).json({ 
            success: false, 
            message: "Internal Server Error" 
        });
    }
};