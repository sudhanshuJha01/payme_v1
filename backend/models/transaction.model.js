import mongoose from "mongoose";

const transactionSchema = new mongoose.mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['Success', 'Failed'],
        required: true
    }
}, {
    timestamps: true
});

export const Transaction = mongoose.model("Transaction", transactionSchema);