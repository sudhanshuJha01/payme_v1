import mongoose from "mongoose";
import { AccountData } from "../models/account.js";
import { Transaction } from "../models/transactions.js";

export const getBalance=async (req , res)=>{
    try{
      const account = await AccountData.findOne({
        userId : req.userId
    })

        if(!account){
            return res.status(403).json({
                success:false,
                msg:"account balance not able to fetch"
            })
        }
        
    res.status(200).json({
        success:true,
        balance : account.balance
    })

}catch(err){
    console.log(err);
    return res.status(500).json({
        success:false,
        msg:"balanced account fetched unsuccessfull"
    })
}
}


export const transferMoney = async (req , res)=>{
        try{

    const session = await mongoose.startSession();

     session.startTransaction();
     const {amount , to ,comment} = req.body;

     const account = await AccountData.findOne({userId : req.userId}).session(session);

     if(amount<0){
        session.abortTransaction();
        return res.status(400).json({
            success:false,
            msg:"Invalid transaction"
        })
     }

     if(!account || account?.balance<amount){
        session.abortTransaction();
        return  res.status(400).json({
            success:false,
            msg:"insufficient balance"
        })
     }

     const toAccount  = await AccountData.findOne({userId : to}).session(session);

     if(!toAccount){
        session.abortTransaction();
        return res.status(400).json({
            success:false,
            msg:"transfer user not found"
        })
     }

     await AccountData.updateOne({userId:req.userId},{$inc:{balance:-amount}}).session(session)
     await AccountData.updateOne({userId:to},{$inc:{balance:amount}}).session(session)

     const transaction = new Transaction({
        fromId:req.userId,
        toId:to,
        comment:comment || " uncommented tranfer"
     })
    const commitedTransaction = await transaction.save()

     await session.commitTransaction();
    return res.status(200).json({
        success:true,
        msg:"Transfer completed",
        commitedTransaction
     })  
      }catch(err){
        console.log("error in transiction " ,err);
        return res.status(500).json({
            success:false,
            msg:"tranfer server error",
        })
    }
}


