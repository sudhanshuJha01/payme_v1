import { Router } from "express";
import { User } from "../db/index.js";
import { z } from "zod";
import jwt from "jsonwebtoken";
import { jwt_seceret } from "../config.js";
const router = Router();

const userSingUpInput = z.object({
  userName: z.string().email(),
  firstName: z.string().min(3),
  lastName: z.string().min(3),
  password: z.string().min(6),
});
const userSingInInput = z.object({
  userName: z.string().email(),
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

  const userId = user._id;

  if (signInUser) {
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

export default router;
