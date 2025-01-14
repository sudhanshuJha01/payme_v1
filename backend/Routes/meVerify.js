import { Router } from "express";
import jwt from "jsonwebtoken";

import { User } from "../models/user.model.js";

const router = Router();


router.post('/',async (req , res)=>{
    try {
        const token = req.body.token;
        const jwt_secret = process.env.JWT_SECRET
        const decode = jwt.verify(token ,jwt_secret);
        const result = await User.findById(decode.userId)
        
        if(result){
          return  res.json({
                success:true,
                firstName:result.firstName,
                lastName:result.lastName,
                userName:result.userName,
            })
        }else{
           return res.json({
                success:false
            })
        }
}catch(err){
    console.log("error in meVerify" , error);
    return res.json({
        success:false
    })
}
})


export default router