import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { formData, service } = req.body;

    // Create SMTP transporter
    const transporter = nodemailer.createTransport({
      host: process.env.NEXT_PUBLIC_SMTP_HOST,
      port: parseInt(process.env.NEXT_PUBLIC_SMTP_PORT, 10),
      secure: false,
      auth: {
        user: process.env.NEXT_PUBLIC_SMTP_USER,
        pass: process.env.NEXT_PUBLIC_SMTP_PASS,
      },
    });

    // Generate HTML email template
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
        <h2 style="color: #2d3748; border-bottom: 2px solid #38a169; padding-bottom: 10px;">New Contact Form Submission</h2>
        <h3 style="color: #4a5568;">Service: ${service.serviceName}</h3>
        
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
          ${Object.entries(formData).map(([key, value]) => `
            <tr>
              <td style="padding: 8px; border: 1px solid #e2e8f0; font-weight: bold; width: 30%;">${key}</td>
              <td style="padding: 8px; border: 1px solid #e2e8f0;">${value || '-'}</td>
            </tr>
          `).join('')}
        </table>
        
        <p style="margin-top: 20px; color: #718096;">
          This form was submitted on ${new Date().toLocaleString()}
        </p>
      </div>
    `;

    // Send email
    await transporter.sendMail({
      from: `"ApplyGhana Forms" <${process.env.NEXT_PUBLIC_SMTP_USER}>`,
      to: process.env.NEXT_PUBLIC_SMTP_USER,
      subject: `New Contact Form Submission - ${service.serviceName}`,
      html,
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error sending contact form:', error);
    res.status(500).json({ message: 'Error sending form submission' });
  }
}