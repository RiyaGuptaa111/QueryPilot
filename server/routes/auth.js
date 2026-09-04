import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/User.js";


const router =
    express.Router();


const generateToken = (user) => {

    return jwt.sign(
        {
            id: user._id,
            username: user.username,
        },

        process.env.JWT_SECRET,

        {
            expiresIn: "7d",
        }
    );

};


// ============================================================
// REGISTER
// ============================================================

router.post(
    "/register",
    async (req, res) => {

        try {

            const {
                username,
                password,
            } = req.body;


            if (
                !username?.trim() ||
                !password
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Username and password are required.",

                });

            }


            if (password.length < 6) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Password must contain at least 6 characters.",

                });

            }


            const existingUser =
                await User.findOne({
                    username:
                        username.trim(),
                });


            if (existingUser) {

                return res.status(409).json({

                    success: false,

                    message:
                        "Username already exists.",

                });

            }


            const hashedPassword =
                await bcrypt.hash(
                    password,
                    10
                );


            const user =
                await User.create({

                    username:
                        username.trim(),

                    password:
                        hashedPassword,

                });


            const token =
                generateToken(user);


            return res.status(201).json({

                success: true,

                token,

                user: {

                    id: user._id,

                    username:
                        user.username,

                },

            });

        } catch (error) {

            console.error(
                "REGISTER ERROR:",
                error
            );


            return res.status(500).json({

                success: false,

                message:
                    "Registration failed.",

            });

        }

    }
);


// ============================================================
// LOGIN
// ============================================================

// router.post(
//     "/login",
//     async (req, res) => {

//         try {

//             const {
//                 username,
//                 password,
//             } = req.body;


//             if (
//                 !username?.trim() ||
//                 !password
//             ) {

//                 return res.status(400).json({

//                     success: false,

//                     message:
//                         "Username and password are required.",

//                 });

//             }


//             const user =
//                 await User.findOne({
//                     username:
//                         username.trim(),
//                 });


//             if (!user) {

//                 return res.status(401).json({

//                     success: false,

//                     message:
//                         "Invalid username or password.",

//                 });

//             }


//             const passwordMatch =
//                 await bcrypt.compare(
//                     password,
//                     user.password
//                 );


//             if (!passwordMatch) {

//                 return res.status(401).json({

//                     success: false,

//                     message:
//                         "Invalid username or password.",

//                 });

//             }


//             const token =
//                 generateToken(user);


//             return res.json({

//                 success: true,

//                 token,

//                 user: {

//                     id: user._id,

//                     username:
//                         user.username,

//                 },

//             });

//         } catch (error) {

//             console.error(
//                 "LOGIN ERROR:",
//                 error
//             );


//             return res.status(500).json({

//                 success: false,

//                 message:
//                     "Login failed.",

//             });

//         }

//     }
// );
router.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({
            username: username.trim(),
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid username or password",
            });
        }

        const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordCorrect) {
            return res.status(401).json({
                success: false,
                message: "Invalid username or password",
            });
        }

        const token = jwt.sign(
            {
                id: user._id,
                username: user.username,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d",
            }
        );

        res.json({
            success: true,
            message: "Login successful",
            token,
            user: {
                id: user._id,
                username: user.username,
            },
        });

    } catch (error) {
        console.error("LOGIN ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Server error during login",
        });
    }
});


export default router;