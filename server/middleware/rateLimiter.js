import rateLimit from "express-rate-limit";

const aiRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20, // 20 AI requests per 15 minutes
    standardHeaders: true,
    legacyHeaders: false,

    message: {
        success: false,
        message: "Too many AI requests. Please try again later.",
    },
});

export default aiRateLimiter;