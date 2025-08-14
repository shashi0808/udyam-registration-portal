import { Request, Response, NextFunction } from 'express';

interface RateLimitStore {
  [key: string]: {
    requests: number;
    resetTime: number;
  };
}

const store: RateLimitStore = {};

export const rateLimiter = (req: Request, res: Response, next: NextFunction) => {
  const clientIP = req.ip || req.connection.remoteAddress || 'unknown';
  const windowMs = parseInt(process.env.RATE_LIMIT_WINDOW_MS || '15000'); // 15 seconds
  const maxRequests = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100');
  
  const now = Date.now();
  
  if (!store[clientIP]) {
    store[clientIP] = {
      requests: 1,
      resetTime: now + windowMs
    };
    return next();
  }
  
  const clientData = store[clientIP];
  
  // Reset if time window expired
  if (now > clientData.resetTime) {
    clientData.requests = 1;
    clientData.resetTime = now + windowMs;
    return next();
  }
  
  // Check if limit exceeded
  if (clientData.requests >= maxRequests) {
    return res.status(429).json({
      success: false,
      message: 'Too many requests. Please try again later.',
      retryAfter: Math.ceil((clientData.resetTime - now) / 1000)
    });
  }
  
  clientData.requests += 1;
  next();
};