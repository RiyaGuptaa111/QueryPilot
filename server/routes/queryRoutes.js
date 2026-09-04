import express from "express";

import QueryHistory from "../models/QueryHistory.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();


// ============================================================
// GET USER HISTORY
// ============================================================

router.get(
    "/history",
    authMiddleware,
    async (req, res) => {

        try {

            const queries = await QueryHistory.find({
                userId: req.userId,
            })
                .sort({
                    createdAt: -1,
                })
                .limit(50);


            res.json({
                success: true,
                queries,
            });

        } catch (error) {

            console.error(
                "GET HISTORY ERROR:",
                error
            );

            res.status(500).json({
                success: false,
                message: error.message,
            });

        }

    }
);


// ============================================================
// SAVE HISTORY
// ============================================================

router.post(
    "/history",
    authMiddleware,
    async (req, res) => {

        try {

            const {
                naturalLanguageQuery,
                generatedSQL,
                status,
                error,
            } = req.body;


            if (!naturalLanguageQuery?.trim()) {

                return res.status(400).json({
                    success: false,
                    message: "Query is required.",
                });

            }


            /*
             * IMPORTANT:
             *
             * userId is NOT taken from req.body.
             *
             * It comes from the verified JWT:
             *
             * req.userId
             *
             * This prevents one user from saving history
             * under another user's account.
             */

            const history = await QueryHistory.create({

                userId: req.userId,

                naturalLanguageQuery:
                    naturalLanguageQuery.trim(),

                generatedSQL:
                    generatedSQL || "",

                status:
                    status || "success",

                error:
                    error || "",

            });


            res.status(201).json({

                success: true,

                history,

            });

        } catch (error) {

            console.error(
                "SAVE HISTORY ERROR:",
                error
            );

            res.status(500).json({

                success: false,

                message:
                    error.message,

            });

        }

    }
);


// ============================================================
// DELETE ONE HISTORY ITEM
// ============================================================

router.delete(
    "/history/:id",
    authMiddleware,
    async (req, res) => {

        try {

            const deleted =
                await QueryHistory.findOneAndDelete({

                    _id: req.params.id,

                    userId: req.userId,

                });


            if (!deleted) {

                return res.status(404).json({

                    success: false,

                    message:
                        "History item not found.",

                });

            }


            res.json({

                success: true,

                message:
                    "History item deleted.",

            });

        } catch (error) {

            console.error(
                "DELETE HISTORY ERROR:",
                error
            );

            res.status(500).json({

                success: false,

                message:
                    error.message,

            });

        }

    }
);


// ============================================================
// CLEAR USER HISTORY
// ============================================================

router.delete(
    "/history",
    authMiddleware,
    async (req, res) => {

        try {

            const result =
                await QueryHistory.deleteMany({

                    userId: req.userId,

                });


            res.json({

                success: true,

                deletedCount:
                    result.deletedCount,

                message:
                    "Query history cleared.",

            });

        } catch (error) {

            console.error(
                "CLEAR HISTORY ERROR:",
                error
            );

            res.status(500).json({

                success: false,

                message:
                    error.message,

            });

        }

    }
);


export default router;