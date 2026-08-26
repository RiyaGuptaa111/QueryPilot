import express from "express";
import axios from "axios";

const router = express.Router();

const AI_SERVICE_URL =
    process.env.AI_SERVICE_URL || "http://localhost:8000";


// ============================================================
// RUN AI QUERY
// ============================================================

router.post("/query", async (req, res) => {

    try {

        const { query } = req.body;

        if (!query) {

            return res.status(400).json({
                success: false,
                message: "Query is required",
            });

        }


        const response = await axios.post(
            `${AI_SERVICE_URL}/query`,
            {
                query,
            }
        );


        return res.json(
            response.data
        );

    } catch (error) {

        console.error(
            "AI Service Error:",
            error.message
        );


        return res.status(500).json({

            success: false,

            message:
                "AI service unavailable.",

            error:
                error.response?.data?.detail ||
                error.message,

        });

    }

});


// ============================================================
// GET DATABASE SCHEMA
// ============================================================

router.get("/schema", async (req, res) => {

    try {

        const response = await axios.get(
            `${AI_SERVICE_URL}/schema`
        );


        return res.json(
            response.data
        );

    } catch (error) {

        console.error(
            "Schema Service Error:",
            error.message
        );


        return res.status(500).json({

            success: false,

            message:
                "Unable to fetch database schema.",

            error:
                error.response?.data?.detail ||
                error.message,

        });

    }

});


export default router;