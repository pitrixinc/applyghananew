import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { formData, service, paymentReference, selectedPrice } = req.body;

    const transporter = nodemailer.createTransport({
      host: process.env.NEXT_PUBLIC_SMTP_HOST,
      port: parseInt(process.env.NEXT_PUBLIC_SMTP_PORT, 10),
      secure: false,
      auth: {
        user: process.env.NEXT_PUBLIC_SMTP_USER,
        pass: process.env.NEXT_PUBLIC_SMTP_PASS,
      },
    });

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
        <h2 style="color: #2d3748; border-bottom: 2px solid #38a169; padding-bottom: 10px;">New Application Submission</h2>
        <h3 style="color: #4a5568;">Service: ${service.serviceName}</h3>
        ${paymentReference ? `<p><strong>Payment Reference:</strong> ${paymentReference}</p>` : ''}
        ${selectedPrice ? `<p><strong>Amount Paid:</strong> GHS ${selectedPrice}</p>` : ''}
        
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
          ${Object.entries(formData).map(([key, value]) => `
            <tr>
              <td style="padding: 8px; border: 1px solid #e2e8f0; font-weight: bold; width: 30%;">${key}</td>
              <td style="padding: 8px; border: 1px solid #e2e8f0;">${value || '-'}</td>
            </tr>
          `).join('')}
        </table>
        
        <p style="margin-top: 20px; color: #718096;">
          Application submitted on ${new Date().toLocaleString()}
        </p>
      </div>
    `;

    await transporter.sendMail({
      from: `"ApplyGhana Applications" <${process.env.SMTP_FROM_EMAIL}>`,
      to: process.env.NEXT_PUBLIC_SMTP_USER,
      subject: `New Application - ${service.serviceName}`,
      html,
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error sending application:', error);
    res.status(500).json({ message: 'Error sending application' });
  }
}