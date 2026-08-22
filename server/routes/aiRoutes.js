import express from "express"
import axios from "axios"

const router = express.Router();

router.post("/query", async (req, res) => {
    try {
        const { query } = req.body;

        if (!query) {
            return res.status(400).json({
                message: "Query is required"
            });
        }

        const response = await axios.post(
                `${process.env.AI_SERVICE_URL}/query`,
                {
                    query
                }
        );

        res.json(response.data);

    } catch (error) {

    console.error(
        "AI Service Error:",
        error.response?.data || error.message
    );

    res.status(500).json({
        success: false,
        message: "AI service failed",
        error: error.response?.data || error.message
    });
}
});

export default router;