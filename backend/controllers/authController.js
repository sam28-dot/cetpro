/**
 * Auth Controller
 * Handles registration, login, token refresh, and password reset.
 */

const crypto = require('crypto');
const User = require('../models/User');
const { sendPasswordResetEmail } = require('../utils/mailer');

// ── Signup ────────────────────────────────────────────────────────
exports.signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ success: false, message: 'An account with this email already exists.' });
    }

    const user = await User.create({ name, email, password });

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    res.status(201).json({
      success: true,
      message: 'Account created successfully!',
      accessToken,
      refreshToken,
      user: user.toSafeObject(),
    });
  } catch (err) {
    next(err);
  }
};

// ── Login ─────────────────────────────────────────────────────────
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Fetch user including password field
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    if (!user.isActive) {
      return res.status(401).json({ success: false, message: 'Account has been deactivated. Contact support.' });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    res.json({
      success: true,
      message: 'Login successful!',
      accessToken,
      refreshToken,
      user: user.toSafeObject(),
    });
  } catch (err) {
    next(err);
  }
};

// ── Refresh token ─────────────────────────────────────────────────
exports.refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ success: false, message: 'Refresh token required.' });
    }
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);
    if (!user || !user.isActive) {
      return res.status(401).json({ success: false, message: 'Invalid refresh token.' });
    }
    const newAccessToken = user.generateAccessToken();
    res.json({ success: true, accessToken: newAccessToken });
  } catch (err) {
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Invalid or expired refresh token.' });
    }
    next(err);
  }
};

// ── Get current user ──────────────────────────────────────────────
exports.getMe = async (req, res) => {
  res.json({ success: true, user: req.user.toSafeObject() });
};

// ── Forgot password: email a short-lived OTP ──────────────────────
exports.forgotPassword = async (req, res, next) => {
  try {
    const email = String(req.body.email || '').trim().toLowerCase();
    const user = await User.findOne({ email });
    const successMsg = 'If an account with that email exists, a verification code has been sent.';
    if (!user) return res.json({ success: true, message: successMsg });
    const otp = String(crypto.randomInt(0, 1000000)).padStart(6, '0');
    user.passwordResetToken = crypto.createHash('sha256').update(otp).digest('hex');
    user.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save({ validateBeforeSave: false });
    try {
      await sendPasswordResetEmail(user.email, user.name, otp);
    } catch (emailErr) {
      // Keep provider details in backend logs for diagnosis; never expose them to the client.
      console.error('[Password reset email] Delivery failed:', emailErr.message);
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });
      return res.status(503).json({ success: false, message: 'We could not send the email right now. Please try again later.' });
    }
    return res.json({ success: true, message: successMsg });
  } catch (err) { next(err); }
};

// ── Reset password ────────────────────────────────────────────────
exports.resetPassword = async (req, res, next) => {
  try {
    const { token, email, otp, password } = req.body;
    const lookupToken = email && otp ? String(otp).trim() : token;
    if (!lookupToken) return res.status(400).json({ success: false, message: 'A valid verification code is required.' });
    const criteria = {
      passwordResetToken: crypto.createHash('sha256').update(lookupToken).digest('hex'),
      passwordResetExpires: { $gt: new Date() },
    };
    if (email && otp) criteria.email = String(email).trim().toLowerCase();
    const user = await User.findOne(criteria);
    if (!user) return res.status(400).json({ success: false, message: 'The verification code is invalid or expired. Request a new code and try again.' });
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    res.json({ success: true, message: 'Password reset successful!', accessToken, refreshToken, user: user.toSafeObject() });
  } catch (err) { next(err); }
};
