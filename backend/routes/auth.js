// routes/auth.js
const express = require('express');
const rateLimit = require('express-rate-limit');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const {
  signupValidator,
  loginValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
} = require('../middleware/validation');

// Additional limits for password recovery. The global API and auth limiters
// remain in place; these narrower limits reduce OTP enumeration/brute-force
// exposure per client IP. Use generic responses to avoid email enumeration.
const forgotPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 3,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many password reset requests. Please try again later.' },
});

const resetPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many verification attempts. Please request a new code later.' },
});

router.post('/signup', signupValidator, authController.signup);
router.post('/login', loginValidator, authController.login);
router.post('/refresh', authController.refresh);
router.get('/me', protect, authController.getMe);
router.post('/forgot-password', forgotPasswordLimiter, forgotPasswordValidator, authController.forgotPassword);
router.post('/reset-password', resetPasswordLimiter, resetPasswordValidator, authController.resetPassword);

module.exports = router;
