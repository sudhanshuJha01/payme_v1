import Razorpay from 'razorpay';
import crypto from 'crypto';
import { Account } from '../models/account.model.js';

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
        const userId = req.userId; // From auth middleware

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return res.status(400).json({ success: false, message: "Payment details are required." });
        }

        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_SECRET)
            .update(body.toString())
            .digest('hex');
        
        if (expectedSignature === razorpay_signature) {
           
            const orderDetails = await razorpay.orders.fetch(razorpay_order_id);
            const amount = orderDetails.amount / 100;


            await Account.updateOne(
                { userId: userId },
                { $inc: { balance: amount } }
            );

            res.status(200).json({
                success: true,
                message: `Successfully added ₹${amount} to your wallet.`
            });

        } else {
            return res.status(400).json({
                success: false,
                message: "Payment verification failed. Signature mismatch."
            });
        }
    } catch (error) {
        console.error("Verify Payment Error:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};