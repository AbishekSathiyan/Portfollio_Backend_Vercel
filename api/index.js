import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import contactRoutes from "../routes/contact.routes.js";
import errorHandler from "../middleware/errorHandler.js";
import adminRoutes from "../routes/adminAuth.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGODB_URI;

// ✅ Allow multiple origins (dev & prod)
const allowedOrigins = [
  "https://abishek-portfolio-front-end.onrender.com", // new prod
  "http://localhost:3000", // dev
  "http://localhost:5173", //dev
];

// ✅ CORS middleware
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // allow Postman, curl, etc.
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg =
          "The CORS policy for this site does not allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

// ✅ JSON middleware
app.use(express.json());

// ✅ Routes
app.use("/api/admin", adminRoutes);
app.use("/api/contacts", contactRoutes);

// ✅ Root routes
app.get("/", (_req, res) => {
  res.send("🚀 Welcome to the Portfolio Backend API");
});

app.get("/api", (_req, res) => {
  res.send("✅ API is running");
});

// ✅ Global error handler
app.use(errorHandler);

// ✅ Connect to MongoDB and start server
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
