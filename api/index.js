// api/index.js
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const contactRoutes = require("../routes/contact.routes");

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

// Middlewares
app.use(cors());
app.use(express.json());

// Test route
app.get("/api", (req, res) => {
  res.send("API is running ✅");
});

// Routes
app.use("/api/contacts", contactRoutes);

// MongoDB connection and server start
mongoose
  .connect(MONGODB_URI, {
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
