import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    contact: { type: String },
    subject: { type: String },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    deviceTime: { type: Date }, // (Optional) if client sends user device date
  },
  {
    timestamps: true, // ✅ adds `createdAt` and `updatedAt`
  }
);

// ✅ Register the model and export it
const Contact = mongoose.model("Contact", contactSchema);
export default Contact;
