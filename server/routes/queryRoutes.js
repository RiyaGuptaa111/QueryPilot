import express from "express";

import QueryHistory from "../models/QueryHistory.js";

import authMiddleware
    from "../middleware/authMiddleware.js";


const router = express.Router();


// ============================================================
// GET USER HISTORY
// ============================================================

router.get(
    "/history",
    authMiddleware,
    async (req, res) => {

        try {

            const queries =
                await QueryHistory.find({
                    userId: req.userId,
                })
                .sort({
                    createdAt: -1,
                });


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

            await QueryHistory.deleteMany({

                userId: req.userId,

            });


            res.json({

                success: true,

                message:
                    "Query history cleared.",

            });


        } catch (error) {

            res.status(500).json({

                success: false,

                message:
                    error.message,

            });

        }

    }
);


export default router;