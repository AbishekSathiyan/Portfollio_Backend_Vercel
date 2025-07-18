const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is running");
});

const contactRoutes = require("../routes/contact.routes");
app.use("/api/contact", contactRoutes);

// ❌ DON'T use app.listen() on Vercel
// ✅ Instead, export the app
module.exports = app;
