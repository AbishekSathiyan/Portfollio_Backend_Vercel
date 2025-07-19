require("dotenv").config(); // Load .env variables first

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const contactRoutes = require("../routes/contact.routes");

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

// Middleware
app.use(cors());
app.use(cors({ origin: "*" }));
app.use(express.json());

// Routes

app.get("/api", (req, res) => {
  res.send("API is running ✅");
});

app.use("/api/contacts", contactRoutes);

// MongoDB Connection & Server Start
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("✅ MongoDB connected successfully");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err);
  });
