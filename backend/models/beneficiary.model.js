import mongoose from "mongoose";

const beneficiarySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: true
    },
    fundAccountId: {
        type: String, 
        required: true,
        unique: true
    },
    name: {
        type: String, 
        required: true
    },
    nickname: {
        type: String, 
        required: true
    },
    accountInfo: {
        type: String, // e.g., "HDFC Bank ending in 1234"
        required: true
    }
}, {
    timestamps: true
});

export const Beneficiary = mongoose.model("Beneficiary", beneficiarySchema);