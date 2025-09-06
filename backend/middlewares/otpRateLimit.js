import { RateLimiterMemory } from 'rate-limiter-flexible';

const ipLimiter = new RateLimiterMemory({
  keyPrefix: 'otp-ip',
  points: 20,           
  duration: 60,        
});

const emailLimiter = new RateLimiterMemory({
  keyPrefix: 'otp-email',
  points: 3,            
  duration: 600,
});


export const otpRateLimiter = async (
  req,
  res,
  next
) => {
  const ip = req.ip;
  const email = typeof req.body.email === 'string' ? req.body.email : undefined;

  try {
   
    await ipLimiter.consume(ip ? ip.toString() : 'unknown-ip');

    // Apply per-email rate limiting if email is present
    if (email) await emailLimiter.consume(email);


    next();
  } catch (err) {
    return res.status(429).json({
      message: 'Too many OTP requests. Please try again after some time.',
    });
  }
};