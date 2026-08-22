import express from "express";
import QueryHistory from "../models/QueryHistory.js";

const router = express.Router();

router.get("/history", async (req, res) => {
  try {
    const queries = await QueryHistory.find()
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      queries,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

export default router;