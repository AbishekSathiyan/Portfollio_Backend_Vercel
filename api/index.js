import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import contactRoutes from "../routes/contact.routes.js";
import errorHandler from "../middleware/errorHandler.js";
import { sendReplyEmail } from "../utils/sendContactReply.js";

// Load env variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGODB_URI; // Ensure this key is present in your .env file

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/contacts", contactRoutes);

console.log("Current directory:", process.cwd());

// Root route
app.get("/", (_req, res) => {
  res.send("🚀 Welcome to the Portfolio Backend API");
});

// Global Error Handler
app.use(errorHandler);

// DB Connection
mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ MongoDB connected successfully");
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
  });
