import { connectToDatabase } from '../utils/db.js';
import { sendContactEmail } from '../utils/mailer.js';

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { name, email, subject, message } = req.body;

    const client = await connectToDatabase();
    const db = client.db();
    await db.collection("contacts").insertOne({
      name,
      email,
      subject,
      message,
      createdAt: new Date()
    });

    await sendContactEmail({ name, email, subject, message });

    res.status(201).json({ message: "Success: Saved & Sent!" });
  } catch (err) {
    console.error("Error in contact:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
