
const rateLimit = require('express-rate-limit');

const createRateLimit = (windowMs, max, message) => {
  return rateLimit({
    windowMs,
    max,
    message: {
      success: false,
      error: message,
      retryAfter: Math.ceil(windowMs / 1000)
    },
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => {
      const whitelist = ['127.0.0.1'];
      return whitelist.includes(req.ip);
    }
  });
};

const generalRateLimit = createRateLimit(
  15 * 60 * 1000, // 15 minutes
  100,
  'Too many requests from this IP, please try again later'
);

const authRateLimit = createRateLimit(
  15 * 60 * 1000, // 15 minutes  
  1111, // Only 5 auth attempts per 15 minutes
  'Too many authentication attempts, please try again later'
);

module.exports = {
  generalRateLimit,
  authRateLimit
};
