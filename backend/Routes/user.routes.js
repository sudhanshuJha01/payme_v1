import {Router} from 'express';
import  {userAuthMiddleware}  from "../middlewares/user.js";
import { register,userSignin,getAllUser,getMe,getAllTransaction } from '../controller/user.js';


const userRoute = Router();

userRoute.post('/user/signup' , register)
userRoute.post('/user/signin' , userSignin)
userRoute.get('/user/bulk' ,userAuthMiddleware, getAllUser)
userRoute.get('/user/get-transactions' , userAuthMiddleware,getAllTransaction)
userRoute.get('/user/me' , getMe)

export default userRoute;