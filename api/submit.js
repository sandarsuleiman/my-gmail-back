import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Only POST allowed" });
  }

  const { name, ser, us, workerEmail, emails } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    const receivers = Array.isArray(emails) ? emails.join(",") : emails;

    await transporter.sendMail({
      from: `"Form System" <${process.env.SMTP_USER}>`,
      to: receivers,
      subject: "New Form Submission",
      text: `
Name: ${name}
SER: ${ser}
US: ${us}
Worker Email: ${workerEmail}
      `,
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false });
  }
}
