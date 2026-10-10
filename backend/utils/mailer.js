/**
 * Mailer Utility
 * Branded transactional OTP email for CET Predictor Pro.
 */
const nodemailer = require('nodemailer');

const createTransport = () => {
  if (process.env.NODE_ENV === 'production') {
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
      throw new Error('SMTP is not configured. Set SMTP_HOST, SMTP_USER and SMTP_PASS on the backend host.');
    }
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT, 10) || 587,
      secure: String(process.env.SMTP_SECURE || 'false') === 'true',
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
  }
  return {
    sendMail: async (opts) => {
      console.log('\n📧 [DEV EMAIL]');
      console.log('To:', opts.to);
      console.log('Subject:', opts.subject);
      console.log('Body excerpt:', opts.text?.slice(0, 300));
      console.log('─────────────────────\n');
      return { messageId: 'dev-' + Date.now() };
    },
  };
};

exports.sendPasswordResetEmail = async (email, name, otp) => {
  const safeName = String(name || 'Student').replace(/[<>]/g, '');
  const founders = 'Samyak Ahiwale, Dipesh Bante, Saad Adhal, and Yash Bonde';
  const message = {
    from: process.env.EMAIL_FROM || process.env.SMTP_USER || 'CET Predictor Pro Team',
    to: email,
    subject: 'Your CET Predictor Pro password reset code',
    text: `Hello ${safeName},

Welcome back to CET Predictor Pro!

We received a request to reset your password. Your one-time verification code is: ${otp}

This code expires in 10 minutes and can be used only once. If you did not request this, you can safely ignore this email and keep your password unchanged.

Thank you for being part of the CET Predictor Pro community. We built this platform to help Maharashtra students explore their college options with more clarity, and we're glad to have you with us.

Warm regards,
CET Predictor Pro Team
Founders: ${founders}

Security note: Our team will never ask you to share this code.`,
    html: `<!doctype html><html><body style="margin:0;background:#f4f6fb;font-family:Arial,sans-serif;color:#172033">
<div style="max-width:600px;margin:28px auto;padding:0 14px"><div style="background:#fff;border:1px solid #e7eaf2;border-radius:18px;overflow:hidden">
<div style="padding:28px 30px;background:#171b36;color:#fff"><div style="font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#c9ccff">Maharashtra • Built for students</div><h1 style="margin:10px 0 0;font-size:26px">CET Predictor Pro</h1></div>
<div style="padding:30px"><p style="font-size:16px">Hello <strong>${safeName}</strong>,</p>
<p style="line-height:1.7;color:#475169">Welcome back! We received a request to reset your CET Predictor Pro account password. Use the verification code below to continue.</p>
<div style="margin:26px 0;padding:20px;text-align:center;border-radius:12px;background:#f0f1ff;border:1px dashed #8886f7"><div style="font-size:12px;color:#555b83;text-transform:uppercase;letter-spacing:2px">Your one-time code</div><div style="font-size:34px;letter-spacing:9px;font-weight:800;color:#3935a8;margin-top:10px">${otp}</div><div style="font-size:12px;color:#646b83;margin-top:10px">Expires in 10 minutes • One use only</div></div>
<p style="line-height:1.7;color:#475169">If you did not request this change, safely ignore this email. Your password will remain unchanged. Never share this code with anyone.</p>
<p style="line-height:1.7;color:#475169">Thank you for being part of our community. We hope CET Predictor Pro helps you plan your next academic step with greater confidence.</p>
<p style="margin-bottom:4px">Warm regards,</p><p style="margin-top:0;font-weight:700;color:#25265f">CET Predictor Pro Team</p>
<div style="padding-top:18px;border-top:1px solid #eceef5;color:#747b90;font-size:12px;line-height:1.7">Founded by ${founders}.<br/>Maharashtra, India</div></div></div>
<p style="text-align:center;color:#8a90a3;font-size:11px;margin:16px 0">Automated account-security email. Please do not reply with your verification code.</p></div></body></html>`,
  };

  const transporter = createTransport();
  await transporter.sendMail(message);
};
