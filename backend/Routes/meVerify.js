import { Router } from "express";
import jwt from "jsonwebtoken";
import { jwt_secret } from "./userRouter.js";

import { User } from "../models/user.model.js";

const router = Router();

router.post('/',async (req , res)=>{
    try {
        const token = req.body.token;
        const decode = jwt.verify(token ,jwt_secret);
        const result = await User.findById(decode.userId)
    
          return  res.json({
                success:true,
                firstName:result.firstName,
                lastName:result.lastName,
                userName:result.userName,
            })
        
}catch(err){
    console.log("error in meVerify" , err);
    return res.json({
        success:false
    })
}
})


export default router