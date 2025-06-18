import {Router} from 'express';
import meVerify from './meVerify.js'
import  {userAuthMiddleware}  from "../middlewares/user.js";
import { register,userSignin,getAllUser } from '../controller/user.js';


const userRoute = Router();

userRoute.post('/user/signup' , register)
userRoute.post('/user/signin' , userSignin)
userRoute.get('/user//bulk' ,userAuthMiddleware, getAllUser)
userRoute.get('/user/me' , meVerify)

export default userRoute;