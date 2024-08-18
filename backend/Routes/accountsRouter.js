import { Router } from "express";
import  {userAuthMiddleware}  from "../middlewares/user.js";
import { AccountData } from "../db/index.js";
import mongoose from "mongoose";

const router = Router();


router.get('/balance' ,userAuthMiddleware, async (req , res) =>{
    const account = await AccountData.findOne({
        userId : req.userId
    })

    res.json({
        balance : account.balance
    })
} )


router.post('/transfer' , userAuthMiddleware , async (req,res)=>{
    const session = await mongoose.startSession();

     session.startTransaction();
     const {amount , to } = req.body;

     const account = await AccountData.findOne({userId : req.userId}).session(session);
     if(!account || account.balance<amount){
        session.abortTransaction();
        return  res.status(400).json({
            msg:"insufficient balance"
        })
     }

     const toAccount  = await AccountData.findOne({userId : to}).session(session);

     if(!toAccount){
        session.abortTransaction();
        return res.status(400).json({
            msg:"Invalid input"
        })
     }

     await AccountData.updateOne({userId:req.userId},{$inc:{balance:-amount}}).session(session)
     await AccountData.updateOne({userId:to},{$inc:{balance:amount}}).session(session)

     await session.commitTransaction();
     res.status(200).json({
        msg:"Transfer completed"
     })



})
export default router;