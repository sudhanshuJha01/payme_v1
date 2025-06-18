import mongoose from "mongoose";
import {User} from "./user.model.js"

const transactionSchema = new mongoose.Schema({
    fromId:{
          type:mongoose.Schema.Types.ObjectId,
           ref:User,
    },
    toId:{
          type:mongoose.Schema.Types.ObjectId,
           ref:User,
    },
    amount:{
        type:Number,
    },
    comment:{
        type:String,
    }
},{
    timestamps:true
})

export const Transaction = mongoose.model("Transaction",transactionSchema)