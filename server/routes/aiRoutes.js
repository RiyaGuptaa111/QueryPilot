import "dotenv/config";

import express from "express";
import axios from "axios";

const router = express.Router();

const AI_SERVICE_URL =
    process.env.AI_SERVICE_URL;


// ============================================================
// GET AI SERVICE HEADERS
// ============================================================

const getAIHeaders = () => {
    return {
        "X-Internal-Key":
            process.env.AI_SERVICE_KEY,
    };
};


// ============================================================
// RUN AI QUERY
// ============================================================

router.post("/query", async (req, res) => {

    try {

        const { query } = req.body;

        if (typeof query !== "string" || !query.trim()) {

            return res.status(400).json({
                success: false,
                message: "Query is required",
            });

        }

        const trimmedQuery = query.trim();

        // Prevent excessively large AI queries
        if (trimmedQuery.length > 10000) {

            return res.status(413).json({
                success: false,
                message: "Query is too long. Maximum length is 10,000 characters.",
            });

        }

        const response = await axios.post(
            `${AI_SERVICE_URL}/query`,
            {
                query: trimmedQuery,
            },
            {
                headers: getAIHeaders(),
            }
        );

        return res.json(response.data);

    } catch (error) {

    console.error(
        "AI Service Error:",
        error.message
    );

    return res.status(500).json({
        success: false,
        message: "AI service unavailable.",
    });

}

});

// ============================================================
// GET DATABASE SCHEMA
// ============================================================

router.get("/schema", async (req, res) => {

    try {

        const response = await axios.get(
            `${AI_SERVICE_URL}/schema`,
            {
                headers: getAIHeaders(),
            }
        );

        return res.json(response.data);

   } catch (error) {

    console.error(
        "AI Service Error:",
        error.message
    );

    return res.status(500).json({
        success: false,
        message: "AI service unavailable.",
    });

}

});


// ============================================================
// AI HEALTH
// ============================================================

router.get("/health", async (req, res) => {

    try {

        const response = await axios.get(
            `${AI_SERVICE_URL}/health`,
            {
                headers: getAIHeaders(),
            }
        );

        return res.json(response.data);

    } catch (error) {

        console.error(
            "AI Health Error:",
            error.message
        );

        return res.status(503).json({

            success: false,

            status: "unavailable",

            message:
                "AI service is unavailable.",

        });

    }

});


// ============================================================
// DATABASE HEALTH
// ============================================================

router.get(
    "/database-health",
    async (req, res) => {

        try {

            const response = await axios.get(
                `${AI_SERVICE_URL}/database-health`,
                {
                    headers: getAIHeaders(),
                }
            );

            return res.json(response.data);

        } catch (error) {

            console.error(
                "Database Health Error:",
                error.message
            );

            return res.status(503).json({

                success: false,

                status: "disconnected",

                message:
                    "Database service is unavailable.",

            });

        }

    }
);

// ============================================================
// INDEX DATABASE SCHEMA
// ============================================================

router.post("/index-schema", async (req, res) => {
    try {
        const response = await axios.post(
            `${AI_SERVICE_URL}/index-schema`,
            {},
            {
                headers: getAIHeaders(),
            }
        );

        return res.json(response.data);

    } catch (error) {
        console.error(
            "Schema Index Error:",
            error.response?.data || error.message
        );

        return res.status(500).json({
            success: false,
            message: "Unable to index database schema.",
        });
    }
});

export default router;