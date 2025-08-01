import express from "express";
import {
  createContact,
  getContacts,
  deleteContact,
  markContactAsRead,
} from "../controllers/contactController.js";

const router = express.Router();

router.post("/", createContact);               // Create new contact
router.get("/", getContacts);                 // Get all contacts
router.delete("/:id", deleteContact);         // Delete contact by ID
router.patch("/:id", markContactAsRead);      // Mark as read

export default router;
