import { Router } from "express";
import  {userAuthMiddleware}  from "../middlewares/user.js";
import mongoose from "mongoose";
import { AccountData } from "../models/user.model.js";

const router = Router();


router.get('/balance' ,userAuthMiddleware, async (req , res) =>{
    try{
    const account = await AccountData.findOne({
        userId : req.userId
    })

    res.json({
        balance : account.balance
    })

}catch(err){
    console.log(err);
    
}
} )


router.post('/transfer' , userAuthMiddleware , async (req,res)=>{
    try{

    const session = await mongoose.startSession();

     session.startTransaction();
     const {amount , to } = req.body;

     const account = await AccountData.findOne({userId : req.userId}).session(session);

     if(amount<1){
        session.abortTransaction();
        return res.status(400).json({
            msg:"Invalid transaction"
        })
     }
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
    return res.status(200).json({
        msg:"Transfer completed"
     })  
      }catch(err){
        console.log("error in transiction " ,err);
        
    }


})
export default router;