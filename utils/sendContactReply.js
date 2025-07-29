import nodemailer from "nodemailer";

export const sendReplyEmail = async (to, name, subject, message) => {
  console.log(`📧 Preparing to send reply to: ${to}`);

  const { MAIL_USER, MAIL_PASS, EMAIL_SERVICE } = process.env;

  if (!MAIL_USER || !MAIL_PASS) {
    console.error(
      "❌ Missing MAIL_USER or MAIL_PASS in environment variables."
    );
    throw new Error("Email credentials not set");
  }

  const transporter = nodemailer.createTransport({
    service: EMAIL_SERVICE, // e.g., 'gmail'
    auth: {
      user: MAIL_USER,
      pass: MAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"Abishek S" <${MAIL_USER}>`,
    to,
    subject: `RE: ${subject}`,
    text: `Hi ${name},

Thank you for reaching out!

I’ve received your message regarding: "${subject}".
Here’s a copy of what you submitted:\n

"${message}"

I appreciate your interest and will respond as soon as possible.

📞 If your inquiry is urgent, feel free to contact me directly:
Email: abishek.sathiyan.2002@gmail.com
Phone: +91 70920 85864

📂 Meanwhile, feel free to check out my portfolio:
https://abishek-portfolio-front-end.vercel.app/

Thanks again, and I look forward to connecting with you. Our Team will Contact you soon.

Best regards,  
Abishek S  
MCA
Software Developer`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email successfully sent to ${to}: ${info.response}`);
  } catch (error) {
    console.error("❌ Failed to send email:", error);
    throw new Error("Email failed to send");
  }
};
