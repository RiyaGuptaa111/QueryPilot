import express from "express";
import cors from "cors";
import helmet from "helmet";
import aiRoutes from "./routes/aiRoutes.js";
import authRoutes from "./routes/auth.js";
import authMiddleware from "./middleware/authMiddleware.js";
import aiRateLimiter from "./middleware/rateLimiter.js";
import queryRoutes from "./routes/queryRoutes.js";

const app = express();
app.set("trust proxy",1);
app.use(helmet());

const allowedOrigin = process.env.CLIENT_URL || "http://localhost:5173";

app.use(
    cors({
        origin: allowedOrigin,
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

app.use(
    "/api",
    authMiddleware,
    queryRoutes
);


app.get("/", (req, res) => {

    res.json({
        message: "QueryPilot API is running 🚀",
    });

});

export default app;