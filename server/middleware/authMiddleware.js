import jwt from "jsonwebtoken";

export default function authMiddleware(req, res, next) {
    try {
        const authHeader = req.headers.authorization;

         console.log("========== JWT DEBUG ==========");
        console.log("AUTH HEADER EXISTS:", !!authHeader);
        console.log("AUTH HEADER:", authHeader ? "Bearer token received" : "MISSING");
        console.log("JWT SECRET EXISTS:", !!process.env.JWT_SECRET);
        console.log("JWT SECRET LENGTH:", process.env.JWT_SECRET?.length);
        
        if (
            !authHeader ||
            !authHeader.startsWith("Bearer ")
        ) {
            return res.status(401).json({
                success: false,
                message: "Authentication required.",
            });
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.userId = decoded.id;
        req.username = decoded.username;

        next();

    } catch (error) {
        console.error(
            "JWT AUTH ERROR:",
            error.message
        );

        return res.status(401).json({
            success: false,
            message: "Invalid or expired token",
        });
    }
}