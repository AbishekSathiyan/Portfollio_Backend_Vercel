const express = require("express");
const router = express.Router();
const Contact = require("../models/Contact.model");

// POST /api/contacts
router.post("/", async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newContact = new Contact({ name, email, message });
    await newContact.save();
    res.status(201).json({ message: "Contact submitted successfully" });
  } catch (err) {
    console.error("❌ Error submitting contact:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
