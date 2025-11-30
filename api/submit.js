import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Only POST allowed" });
  }

  const { name, ser, us, workerEmail, emails = [] } = req.body;

  const allEmails = [...emails];
  if (workerEmail) allEmails.push(workerEmail);

  try {
    const transporter = nodemailer.createTransporter({
      host: "smtp.gmail.com",
      port: 587,              // ← 587 yahan
      secure: false,          // ← 587 ke liye false hona chahiye
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      },
      tls: { rejectUnauthorized: false }   // ← extra safety (optional)
    });

    await transporter.sendMail({
      from: `"Form" <${process.env.SMTP_USER}>`,
      to: allEmails.join(","),
      subject: `New Form - ${name || "Someone"}`,
      html: `
        <h2>New Submission!</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Service:</strong> ${ser}</p>
        <p><strong>Use:</strong> ${us}</p>
        <p><strong>Worker:</strong> ${workerEmail}</p>
      `
    });

    return res.status(200).json({ success: true, message: "Mail sent!" });
  } catch (err) {
    console.log("Error:", err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
}
