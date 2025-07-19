// routes/contact.routes.js
const express = require("express");
const router = express.Router();
const Contact = require("../models/contact.model");

// POST - Save contact message
router.post("/", async (req, res) => {
  try {
    const { name, email, contact, subject, message } = req.body;
    const newContact = new Contact({ name, email, contact, subject, message });
    await newContact.save();
    res.status(201).json({ message: "Message saved!" });
  } catch (err) {
    console.error("Error saving message:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ GET - Fetch all contact messages
router.get("/", async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.status(200).json(contacts);
  } catch (err) {
    console.error("Error fetching contacts:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
