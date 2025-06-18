import mongoose from "mongoose";
import {User} from "./user.model.js"
import { Transaction } from "./transactions.model.js";

 const AccountSchema = new mongoose.Schema({
     userId:{
         type:mongoose.Schema.Types.ObjectId,
         ref:User,
         required:true
     },
     balance:{
         type:Number,
         required:true
     },
    accountNumber:{
        type:Number,
        required:true,
        trim:true,
        unique:true,
        index:true
    },
    transactionHistory:{
        type:mongoose.Schema.Types.ObjectId,
        ref:Transaction,
    }
 },{timestamps:true})
 
export const AccountData = mongoose.model("AccountData",AccountSchema);

