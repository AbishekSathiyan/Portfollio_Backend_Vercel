// routes/contact.routes.js
const express = require("express");
const router = express.Router();
const Contact = require("../models/contact.model"); // or wherever your model is

// POST /api/contacts
router.post("/", async (req, res) => {
  try {
    const { name, email, contact, subject, message } = req.body;

    const newContact = new Contact({ name, email, contact, subject, message });
    await newContact.save();

    res.status(201).json({ message: "Contact saved successfully" });
  } catch (error) {
    console.error("Error saving contact:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
