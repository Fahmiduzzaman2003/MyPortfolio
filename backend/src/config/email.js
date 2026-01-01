const nodemailer = require('nodemailer');
const sgMail = require('@sendgrid/mail');

// Check if SendGrid is configured
const useSendGrid = process.env.SENDGRID_API_KEY && process.env.SENDGRID_FROM_EMAIL;

if (useSendGrid) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  console.log('✅ Using SendGrid for emails');
} else if (process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
  console.log('⚠️  Using Gmail SMTP (may timeout on cloud servers)');
} else {
  console.warn('⚠️  Email not configured');
}

// Create reusable transporter for Gmail (fallback)
const createTransporter = () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    return null;
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
};

// Send email notification when new contact message received
const sendNewMessageNotification = async (messageData) => {
  const transporter = createTransporter();
  if (!transporter) return { success: false, error: 'Email not configured' };

  const { name, email, message } = messageData;
  const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_USER;

  const mailOptions = {
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to: adminEmail,
    subject: `New Contact Message from ${name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333; border-bottom: 2px solid #4CAF50; padding-bottom: 10px;">
          New Contact Message
        </h2>
        
        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 10px 0;"><strong>From:</strong> ${name}</p>
          <p style="margin: 10px 0;"><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
        </div>
        
        <div style="background-color: #fff; padding: 20px; border-left: 4px solid #4CAF50; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #555;">Message:</h3>
          <p style="white-space: pre-wrap; line-height: 1.6; color: #333;">${message}</p>
        </div>
        
        <div style="margin-top: 30px; padding: 15px; background-color: #e3f2fd; border-radius: 8px;">
          <p style="margin: 5px 0; color: #1976d2;">
            💡 <strong>Tip:</strong> You can reply to this message directly from your Admin Panel.
          </p>
        </div>
        
        <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
        
        <p style="color: #999; font-size: 12px; text-align: center;">
          This is an automated notification from your Portfolio Contact Form
        </p>
      </div>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Notification email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Email sending failed:', error.message);
    return { success: false, error: error.message };
  }
};

// Send reply email from admin to contact message sender
const sendReplyEmail = async (replyData) => {
  const { to, subject, message, originalMessage } = replyData;
  const fromEmail = useSendGrid 
    ? process.env.SENDGRID_FROM_EMAIL 
    : (process.env.EMAIL_FROM || process.env.EMAIL_USER);

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333; border-bottom: 2px solid #2196F3; padding-bottom: 10px;">
        Reply to Your Message
      </h2>
      
      <div style="background-color: #fff; padding: 20px; border-left: 4px solid #2196F3; margin: 20px 0;">
        <p style="white-space: pre-wrap; line-height: 1.6; color: #333;">${message}</p>
      </div>
      
      ${originalMessage ? `
        <div style="margin-top: 30px; padding: 20px; background-color: #f5f5f5; border-radius: 8px;">
          <h3 style="margin-top: 0; color: #666; font-size: 14px;">Your Original Message:</h3>
          <p style="white-space: pre-wrap; line-height: 1.6; color: #666; font-size: 14px;">${originalMessage}</p>
        </div>
      ` : ''}
      
      <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
      
      <p style="color: #999; font-size: 12px; text-align: center;">
        This email was sent from ${fromEmail}
      </p>
    </div>
  `;

  // Try SendGrid first (more reliable on cloud)
  if (useSendGrid) {
    try {
      await sgMail.send({
        to: to,
        from: fromEmail,
        subject: subject || 'Re: Your message',
        html: htmlContent
      });
      console.log('✅ Reply email sent via SendGrid');
      return { success: true, provider: 'sendgrid' };
    } catch (error) {
      console.error('❌ SendGrid failed:', error.message);
      return { success: false, error: error.message };
    }
  }

  // Fallback to Gmail SMTP
  const transporter = createTransporter();
  if (!transporter) return { success: false, error: 'Email not configured' };

  const mailOptions = {
    from: fromEmail,
    to: to,
    subject: subject || 'Re: Your message',
    html: htmlContent
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Reply email sent via Gmail:', info.messageId);
    return { success: true, messageId: info.messageId, provider: 'gmail' };
  } catch (error) {
    console.error('❌ Reply email failed:', error.message);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendNewMessageNotification,
  sendReplyEmail
};
