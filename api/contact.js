// api/contact.js
import { connectToDatabase } from "../utils/db";
import { sendContactEmail }   from "../utils/mailer";

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { name, email, subject, message } = JSON.parse(req.body);

    // 1) Save to MongoDB
    const client = await connectToDatabase();
    const db = client.db(); // default DB from URI
    await db
      .collection("contacts")
      .insertOne({ name, email, subject, message, createdAt: new Date() });

    // 2) Send you an email
    await sendContactEmail({ name, email, subject, message });

    return res.status(201).json({ message: "Contact saved & email sent." });
  } catch (err) {
    console.error("Contact handler error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
