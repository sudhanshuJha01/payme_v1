import {Router} from 'express';
import  {userAuthMiddleware}  from "../middlewares/user.js";
import { transferMoney , getBalance } from '../controller/account.js';

const accountRoute = Router();

accountRoute.get('/account/balance' , userAuthMiddleware ,getBalance)
accountRoute.post('/account/transfer',userAuthMiddleware , transferMoney)

export default accountRoute;