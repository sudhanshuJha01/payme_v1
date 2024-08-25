import { Router } from "express";
import { jwt_secret } from "../config.js";
import jwt from 'jsonwebtoken'
import { User } from "../db/index.js";

const router = Router();


router.post('/',async (req , res)=>{
    const token = req.body.token;
    try {
        const decode = jwt.verify(token, jwt_secret);
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
        
    } catch (error) {
        console.log("error in meVerify" , error);
        return res.json({
            success:false
        })
    }
})


export default router