/**
 * Mailer Utility
 * Nodemailer setup for transactional emails.
 */

const nodemailer = require('nodemailer');

const createTransport = () => {
  // In production use real SMTP, in dev use Ethereal
  if (process.env.NODE_ENV === 'production') {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: false, // TLS
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }
  // Dev: log to console
  return {
    sendMail: async (opts) => {
      console.log('\n📧 [DEV EMAIL]');
      console.log('To:', opts.to);
      console.log('Subject:', opts.subject);
      console.log('Body excerpt:', opts.text?.slice(0, 200));
      console.log('─────────────────────\n');
      return { messageId: 'dev-' + Date.now() };
    },
  };
};

exports.sendPasswordResetEmail = async (email, name, resetURL) => {
  const transporter = createTransport();
  await transporter.sendMail({
    from: `"CET Predictor Pro" <${process.env.EMAIL_FROM || 'noreply@cetpredictorpro.in'}>`,
    to: email,
    subject: 'Reset Your CET Predictor Pro Password',
    text: `Hi ${name},\n\nYou requested to reset your password.\n\nClick the link below (valid for 1 hour):\n${resetURL}\n\nIf you didn't request this, ignore this email.\n\n— CET Predictor Pro Team`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;background:#f9f9f9;padding:40px;border-radius:12px;">
        <div style="text-align:center;margin-bottom:32px;">
          <h2 style="color:#6c63ff;font-size:24px;margin:0;">CET Predictor Pro</h2>
        </div>
        <h3 style="color:#1a1a2e;font-size:20px;">Reset Your Password</h3>
        <p style="color:#555;line-height:1.6;">Hi <strong>${name}</strong>,</p>
        <p style="color:#555;line-height:1.6;">You requested a password reset. Click the button below. This link expires in <strong>1 hour</strong>.</p>
        <div style="text-align:center;margin:32px 0;">
          <a href="${resetURL}" style="background:#6c63ff;color:#fff;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:16px;">Reset Password</a>
        </div>
        <p style="color:#999;font-size:13px;">If you didn't request this, you can safely ignore this email.</p>
        <hr style="border:none;border-top:1px solid #eee;margin:32px 0;" />
        <p style="color:#bbb;font-size:12px;text-align:center;">© ${new Date().getFullYear()} CET Predictor Pro · Maharashtra, India</p>
      </div>
    `,
  });
};
