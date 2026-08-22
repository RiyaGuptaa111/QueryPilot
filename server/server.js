import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./config/db.js";
import queryRoutes from "./routes/queryRoutes.js";

dotenv.config();

const PORT = process.env.PORT || 4000;

connectDB();

app.use("/api/queries", queryRoutes);

app.get("/api/test", (req, res) => {
  res.json({
    success: true,
    message: "QueryPilot API is working 🚀"
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});