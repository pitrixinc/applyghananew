import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { formData, service, paymentReference, selectedPrice, applicantEmail } = req.body;

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
        <h2 style="color: #2d3748; border-bottom: 2px solid #38a169; padding-bottom: 10px;">Application Received</h2>
        <p>Dear ${formData['First Name'] || 'Applicant'},</p>
        
        <p>Thank you for your application for <strong>${service.serviceName}</strong> with ApplyGhana.</p>
        
        ${paymentReference ? `
          <div style="background-color: #f0fff4; padding: 15px; border-radius: 6px; margin: 15px 0;">
            <h3 style="color: #276749; margin-top: 0;">Payment Details</h3>
            <p><strong>Reference:</strong> ${paymentReference}</p>
            <p><strong>Amount:</strong> GHS ${selectedPrice}</p>
          </div>
        ` : ''}
        
        <p>We've received the following information:</p>
        
        <table style="width: 100%; border-collapse: collapse; margin: 15px 0;">
          ${Object.entries(formData).map(([key, value]) => `
            <tr>
              <td style="padding: 8px; border: 1px solid #e2e8f0; font-weight: bold; width: 30%;">${key}</td>
              <td style="padding: 8px; border: 1px solid #e2e8f0;">${value || '-'}</td>
            </tr>
          `).join('')}
        </table>
        
        <p>Our team will review your application and get back to you within 2-3 business days.</p>
        
        <p style="margin-top: 30px; color: #718096; font-size: 0.9em;">
          If you have any questions, please contact us at <a href="mailto:support@applyghana.com">support@applyghana.com</a>
        </p>
      </div>
    `;

    await transporter.sendMail({
      from: `"ApplyGhana Team" <${process.env.NEXT_PUBLIC_SMTP_USER}>`,
      to: applicantEmail,
      subject: `Application Confirmation - ${service.serviceName}`,
      html,
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error sending confirmation:', error);
    res.status(500).json({ message: 'Error sending confirmation email' });
  }
}