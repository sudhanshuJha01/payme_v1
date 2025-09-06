import { Router } from 'express';
import { userAuthMiddleware } from "../middlewares/verifyJWT.js";
import { getNotifications, markAsRead } from '../controllers/notification.controller.js';

const notificationRoute = Router();

notificationRoute.get('/', userAuthMiddleware, getNotifications);
notificationRoute.patch('/read', userAuthMiddleware, markAsRead);

export default notificationRoute;