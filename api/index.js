const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");
const contactRoutes = require("../routes/contactRoutes");
const errorHandler = require("../middlewares/errorHandler");
require("dotenv").config();
const serverlessExpress = require("@vendia/serverless-express");

const app = express();

// Middleware
app.use(express.json());
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || "https://abishek-s-2002-portfolio-57dab.web.app/",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Test route
app.get("/", (req, res) => {
  res.send("✅ Portfolio Backend is Live!");
});

// API Routes (no double /api)
app.use("/contacts", contactRoutes);
app.use(errorHandler);

// Export serverless function
exports.handler = serverlessExpress({ app });
