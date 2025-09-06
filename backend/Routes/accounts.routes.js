import { Router } from 'express';
import { userAuthMiddleware } from "../middlewares/verifyJWT.js";
import { transfer, getBalance, getHistory } from '../controllers/account.controller.js';

const accountRoute = Router();

accountRoute.get('/balance', userAuthMiddleware, getBalance);
accountRoute.post('/transfer', userAuthMiddleware, transfer);


accountRoute.get('/history', userAuthMiddleware, getHistory);

export default accountRoute;