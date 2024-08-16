import { Router } from "express";
import { AccountData, User } from "../db/index.js";
import { z } from "zod";
import jwt from "jsonwebtoken";
import { jwt_seceret } from "../config.js";
import { userAuthMiddleware } from "../middlewares/user.js";
const router = Router();

const userSingUpInput = z.object({
  userName: z.string().email(),
  firstName: z.string().min(3),
  lastName: z.string().min(3),
  password: z.string().min(6),
});


router.post("/signup", async (req, res) => {
  const userName = req.body.userName;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const password = req.body.password;

  const userData = {
    userName,
    firstName,
    lastName,
    password,
  };

  const userInputValidation = userSingUpInput.safeParse(userData);
  if (!userInputValidation.success) {
    return res.status(411).json({
      msg: "Email already taken / Incorrect inputs",
    });
  }

  const userExist = await User.findOne({
    userName: userName,
  });

  if (userExist) {
    return res.status(411).json({
      msg: "Email already taken/Incorrect inputs",
    });
  }
  try {
    const user = await User.create(userData);
    const userId = user._id;
    const token = jwt.sign({ userId }, jwt_seceret);
    res.status(200).json({
      msg: "User created successfully",
      token: token,
    });
  } catch (error) {
    console.log("connection with data base is failed");
  }

  AccountData.create({
    
  })
});

const userSingInInput = z.object({
  userName: z.string().email(),
  password: z.string().min(6),
});

router.post("/signin", async (req, res) => {
  const userName = req.body.userName;
  const password = req.body.password;

  const inputValidation = userSingInInput.safeParse({
    userName,
    password,
  });

  if (!inputValidation.success) {
    return res.status(411).json({
      msg: "Input is invalid !",
    });
  }

  const user = await User.findOne({
    userName,
    password,
  });

  
  if (user) {
      const userId = user._id;
    const token = jwt.sign({ userId }, jwt_seceret);
    return res.status(200).json({
      token: token,
    });
  } else {
    return res.status(411).json({
      message: "Error while logging in",
    });
  }
});


const updateDataVerification = z.object({
  password:z.string().min(6).optional(),
  firstName:z.string().min(3).optional(),
  lastName:z.string().min(3).optional()
})
router.put('/:id' , userAuthMiddleware() ,async (req , res)=>{
    let password = req.body.password;
    let firstName = req.body.firstName;
    let lastName = req.body.lastName;

    let updateData = {
      password:password,
      firstName:firstName,
      lastName:lastName
    }

    const updateInputVarification = updateDataVerification.safeParse(updateData);
    if(!updateInputVarification.success) {
      return res.status(411).json({msg:"Input is Invalid"})
    }

    try {
        const update  = await User.updateOne({_id:req.userId} , updateData) 
        if(!update) return res.status(411).json({msg:"User Not Found "})
        res.status(200).json({msg:"Updated successfully"})
    } catch (error) {
      console.log(`Error occured ${error}`);
    }
} )

// router.get('/:friendId',userAuthMiddleware, async (req , res)=>{
//     let userFriendId = req.params.name;
//     let user= await User.findOne(userFriendId);
//   if(!user){
//     res.status(411).send("User friend not exist");
//   }else{
//     userInfo = user.map(info =>{
//         return {
//           username:info.userName
//         }
//     })
//     res.status(200).send("User friend is there");
//   }

// })

router.get("/bulk", async (req, res) => {
  const filter = req.query.filter || "";

  const users = await User.find({
      $or: [{
          firstName: {
              "$regex": filter
          }
      }, {
          lastName: {
              "$regex": filter
          }
      }]
  })

  res.json({
      user: users.map(user => ({
          username: user.userName,
          firstName: user.firstName,
          lastName: user.lastName,
          _id: user._id
      }))
  })
})
export default router;
