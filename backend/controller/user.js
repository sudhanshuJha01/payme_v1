import {User } from "../models/user.model.js";
import { AccountData } from "../models/account.model.js";
import { z } from "zod";
import jwt from "jsonwebtoken";
import bcrypt from 'bcryptjs'

const jwt_secret=process.env.JWT_SECRET

const userSingUpInput = z.object({
  email: z.string().email(),
  fullname: z.string().min(3),
  password: z.string().min(6),
});


export const register = async(req , res)=>{
     try{ 
      const email = req.body.email;
      const fullname = req.body.fullname;
      const password = req.body.password;
    
      const userData = {
        email,
        fullname,
        password,
      };
    
      const userInputValidation = userSingUpInput.safeParse(userData);
      if (!userInputValidation.success) {
        return res.status(400).json({
          success:false,
          msg: "Incorrect inputs",
        });
      }
    
      const userExist = await User.findOne({
        email
      });
    
      if (userExist) {
        return res.status(409).json({
          success:false,
          msg: "Email already taken",
        });
      }
    
      const salt = await bcrypt.genSalt(10);
     const hashedPassword = await bcrypt.hash(password, salt);
    
     userData.password=hashedPassword;
    
      const user = new User(userData)
    
      const newUser=await user.save()
    
      const userId = newUser._id;
    
      const account = await AccountData.create({
        userId,
        balance: Math.floor(1 + Math.random() * 10000)/100,
      });
    
      return res.status(200).json({
        success:true,
        msg: "User created successfully",
        newUser,
        account
        
      });
    }catch(error){
       console.log(error);
       return res.status(500).json({
        success:false,
        msg:"Internal sever error in register"
       })
    }
}

const userSingInInput = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});


export const userSignin = async(req , res)=>{
 try{
  const email = req.body.email;
  const password = req.body.password;

  const inputValidation = userSingInInput.safeParse({
    email,
    password,
  });

  if (!inputValidation.success) {
    return res.status(400).json({
      success:false,
      msg: "Input is invalid !",
    });
  }

  const user = await User.findOne({email});

  if(!user){
    return res.status(402).json({
      success:false,
      msg:"user is not registed"
    })
  }

  const hashedPassword = user.password;

  const checkPassword = await bcrypt.compare(password,hashedPassword)

  if(!checkPassword){
    return res.status(402).json({
      success:false,
      msg:"password is inccorect please check your password"
    })
  }
   
   const userId = user._id;

    const token =  jwt.sign({
      userId,
      email
    }, jwt_secret);

    return res.status(200).json({
      success:true,
      token,
      user
    });
  
  }catch(err){
    console.log(err);
    return res.status(500).json({
      success:false,
      msg:"server error in sign in"
    })
  }
}

export const getAllUser = async (req,res)=>{
     try{
  const filter = req.query.filter || "";

  const users = await User.find({
    $or: [
      {
        firstName: {
          $regex: filter,
        },
      },
      {
        lastName: {
          $regex: filter,
        },
      },
    ],
  });

 return res.json({
    user: users.map((user) => ({
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      _id: user._id,
    })),
  });
}catch(error){
  console.log(err);
}
}

export const getMe = async(req , res)=>{
      try {
        const token = req.body.token;
        const decode = jwt.verify(token ,jwt_secret);
        const user = await User.findById(decode.userId)
    
          return  res.status(202).json({
                success:true,
                fullname:user.fullname,
                email:user.email,
                msg:"user is registed"
            })
        
}catch(err){
    console.log("error in meVerify" , err);
    return res.status(502).json({
        success:false,
        msg:"server error to get self user"
    })
}
}
