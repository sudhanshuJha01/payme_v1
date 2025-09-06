import { Router } from 'express';
import { userAuthMiddleware } from "../middlewares/verifyJWT.js";
import { otpRateLimiter } from '../middlewares/otpRateLimit.js';
import { register, verifyOtp, login, logout, refreshAccessToken, resendOtp } from '../controllers/auth.controller.js';
import { getMyProfile, searchUsers } from '../controllers/user.controller.js';

const userRoute = Router();

userRoute.post('/register', otpRateLimiter, register);
userRoute.post('/resend-otp', otpRateLimiter, resendOtp);
userRoute.post('/verify-otp', verifyOtp);
userRoute.post('/login', login);
userRoute.post('/logout', userAuthMiddleware, logout);
userRoute.post('/refresh-token', refreshAccessToken);
userRoute.get('/me', userAuthMiddleware, getMyProfile);
userRoute.get('/search', userAuthMiddleware, searchUsers);

export default userRoute;