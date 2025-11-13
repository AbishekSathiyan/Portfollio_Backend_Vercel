import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import contactRoutes from "../routes/contact.routes.js";
import adminAuthRoutes from "../routes/adminAuth.js";
import errorHandler from "../middleware/errorHandler.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGODB_URI;

// ✅ Allowed Origins
const allowedOrigins = [
  "https://abishek-portfolio-front-end.vercel.app",
  "http://localhost:3000",
  "http://localhost:5173",
];

// ✅ CORS setup
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (!allowedOrigins.includes(origin)) {
        return callback(
          new Error("❌ CORS: Origin not allowed by policy."),
          false
        );
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

// ✅ Middleware
app.use(express.json());

// ✅ Routes
app.use("/api/admin", adminAuthRoutes);
app.use("/api/contacts", contactRoutes);

// ✅ Test routes
app.get("/", (_req, res) => res.send("🚀 Portfolio Backend Running"));
app.get("/api", (_req, res) => res.send("✅ API is live!"));

// ✅ Error Handler
app.use(errorHandler);

// ✅ DB + Server Start
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () =>
      console.log(`🚀 Server running at http://localhost:${PORT}`)
    );
  })
  .catch((err) => console.error("❌ MongoDB error:", err.message));
