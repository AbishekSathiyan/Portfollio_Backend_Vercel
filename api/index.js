import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import contactRoutes from "../routes/contact.routes.js";
import errorHandler from "../middleware/errorHandler.js";
import { sendReplyEmail } from "../utils/sendContactReply.js";
import adminRoutes from "../routes/adminAuth.js"; // ✅ corrected path with .js

import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGODB_URI;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/admin", adminRoutes); // ✅ admin auth route
app.use("/api/contacts", contactRoutes);

// Root route
app.get("/", (_req, res) => {
  res.send("🚀 Welcome to the Portfolio Backend API");
});

app.get("/api", (req, res) => {
  res.send("✅ API is running");
});

// Global error handler
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
