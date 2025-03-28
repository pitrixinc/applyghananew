import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { firstName, lastName, email, phone, service, message } = req.body;

  if (!firstName || !lastName || !email || !phone || !service || !message) {
    return res.status(400).json({ message: "All fields are required." });
  }

  const transporter = nodemailer.createTransport({
    host: process.env.NEXT_PUBLIC_SMTP_HOST,
    port: parseInt(process.env.NEXT_PUBLIC_SMTP_PORT, 10),
    secure: false,
    auth: {
      user: process.env.NEXT_PUBLIC_SMTP_USER,
      pass: process.env.NEXT_PUBLIC_SMTP_PASS,
    },
  });

  const emailTemplate = `
    <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Inquiry from ApplyGhana Contact Form</title>
</head>
<body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f9; color: #333;">

  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 6px rgba(0,0,0,0.1);">
    <tr>
      <td style="padding: 20px; background-color: #4CAF50; text-align: center; border-top-left-radius: 8px; border-top-right-radius: 8px;">
        <h2 style="color: #ffffff; font-size: 24px; margin: 0;">New Inquiry from ApplyGhana Contact Form</h2>
      </td>
    </tr>
    <tr>
      <td style="padding: 20px;">
        <table role="presentation" cellpadding="10" cellspacing="0" width="100%" style="border-collapse: collapse;">
          <tr>
            <td style="font-weight: bold; padding-bottom: 8px; color: #555;">Name:</td>
            <td style="padding-bottom: 8px; color: #333;">${firstName} ${lastName}</td>
          </tr>
          <tr>
            <td style="font-weight: bold; padding-bottom: 8px; color: #555;">Email:</td>
            <td style="padding-bottom: 8px; color: #333;">${email}</td>
          </tr>
          <tr>
            <td style="font-weight: bold; padding-bottom: 8px; color: #555;">Phone:</td>
            <td style="padding-bottom: 8px; color: #333;">${phone}</td>
          </tr>
          <tr>
            <td style="font-weight: bold; padding-bottom: 8px; color: #555;">Service Interested In:</td>
            <td style="padding-bottom: 8px; color: #333;">${service}</td>
          </tr>
          <tr>
            <td style="font-weight: bold; padding-bottom: 8px; color: #555;">Message:</td>
            <td style="padding-bottom: 8px; color: #333;">${message}</td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td style="padding: 20px; background-color: #f1f1f1; text-align: center; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px;">
        <p style="margin: 0; color: #777; font-size: 14px;">This message was sent from the ApplyGhana Contact Form.</p>
      </td>
    </tr>
  </table>

</body>
</html>

  `;

  try {
    await transporter.sendMail({
      from: `"ApplyGhana Contact" <${process.env.NEXT_PUBLIC_SMTP_USER}>`,
      to: "contact@applyghana.com",
      subject: `New Inquiry from ${firstName} ${lastName}`,
      html: emailTemplate,
      replyTo: email, // So you can reply directly
    });

    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    console.error("Nodemailer Error:", error);
    res.status(500).json({ message: "Error sending email", error: error.message });
  }
}
