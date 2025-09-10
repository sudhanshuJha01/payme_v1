import { Router } from 'express';
import { handleRazorpayWebhook } from '../controllers/webhook.controller.js';

const webhookRoute = Router();

webhookRoute.post('/razorpay', handleRazorpayWebhook);

export default webhookRoute;