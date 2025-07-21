const express = require("express");
const router = express.Router();
const Contact = require("../models/contact.model");

// POST /api/contacts - Save a contact
router.post("/", async (req, res) => {
  try {
    const { name, email, contact, subject, message } = req.body;

    if (!name || !email || !message) {
      return res
        .status(400)
        .json({ error: "Name, Email, and Message are required" });
    }

    const newContact = new Contact({
      name,
      email,
      contact,
      subject,
      message,
    });

    await newContact.save();
    res.status(201).json({ message: "Contact submitted successfully" });
  } catch (err) {
    console.error("❌ Error submitting contact:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ GET /api/contacts - Return all contacts (for testing)
router.get("/", async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.json(contacts);
  } catch (err) {
    console.error("❌ Error fetching contacts:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
