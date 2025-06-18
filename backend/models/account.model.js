import mongoose from "mongoose";

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
    treansactionHistory:{
        type:mongoose.Schema.Types.ObjectId,
        ref:Transaction,
    }
 },{timestamps:true})
 
export const AccountData = mongoose.model("AccountData",AccountSchema);

