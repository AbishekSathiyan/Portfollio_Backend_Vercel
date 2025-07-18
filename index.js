const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const contactRoutes = require('./routes/contact.routes');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Basic health check
app.get("/", (req, res) => {
  res.send("API is running");
});

app.use("/api/contact", contactRoutes);

module.exports = app; // Important for Vercel
