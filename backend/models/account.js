import mongoose from "mongoose";
import {User} from "./user.js"
import { Transaction } from "./transactions.js";

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
    transactionHistory:{
        type:mongoose.Schema.Types.ObjectId,
        ref:Transaction,
    }
 },{timestamps:true})
 
export const AccountData = mongoose.model("AccountData",AccountSchema);

