import express from "express";
import cors from "cors";
import helmet from "helmet";
import aiRoutes from "./routes/aiRoutes.js";
import authRoutes from "./routes/auth.js";
import authMiddleware from "./middleware/authMiddleware.js";
import aiRateLimiter from "./middleware/rateLimiter.js";

const app = express();
app.use(helmet());
app.use(
    cors({
        origin: true,
        credentials: true,
    })
);

app.use(express.json());


// ============================================================
// PUBLIC ROUTES
// ============================================================

app.use(
    "/api/auth",
    authRoutes
);


// ============================================================
// PROTECTED AI ROUTES
// ============================================================

app.use(
    "/api/ai",
    authMiddleware,
    aiRateLimiter,
    aiRoutes
);


app.get("/", (req, res) => {

    res.json({
        message: "QueryPilot API is running 🚀",
    });

});

export default app;