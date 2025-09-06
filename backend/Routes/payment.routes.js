import { Router } from 'express';
import { userAuthMiddleware } from "../middlewares/verifyJWT.js";
import { createOrder, verifyPayment } from '../controllers/payment.controller.js';

const paymentRoute = Router();

paymentRoute.post('/add-money/create-order', userAuthMiddleware, createOrder);

paymentRoute.post('/add-money/verify', userAuthMiddleware, verifyPayment);

export default paymentRoute;