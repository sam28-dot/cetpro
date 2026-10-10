/**
 * Input Validation Middleware
 * Centralised validators for all routes.
 */

const { body, param, validationResult } = require('express-validator');

// ── Reusable error handler ────────────────────────────────────────
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
};

// ── Auth validators ───────────────────────────────────────────────
const signupValidator = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 60 }).withMessage('Name must be 2–60 characters')
    .escape(),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain uppercase, lowercase, and a number'),
  validate,
];

const loginValidator = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required'),
  validate,
];

const forgotPasswordValidator = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email')
    .normalizeEmail(),
  validate,
];

const resetPasswordValidator = [
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain uppercase, lowercase, and a number'),
  body().custom((value) => {
    const hasLegacyToken = typeof value.token === 'string' && value.token.length > 0;
    const hasOtp = typeof value.email === 'string' && typeof value.otp === 'string' && /^\d{6}$/.test(value.otp);
    if (!hasLegacyToken && !hasOtp) throw new Error('Provide the email and 6-digit verification code.');
    if (hasOtp && !/^\S+@\S+\.\S+$/.test(value.email.trim())) throw new Error('Please provide a valid email.');
    return true;
  }),
  validate,
];

// ── Prediction validators ─────────────────────────────────────────
const predictionValidator = [
  body('percentile')
    .notEmpty().withMessage('Percentile is required')
    .isFloat({ min: 0, max: 100 }).withMessage('Percentile must be between 0 and 100'),
  body('category')
    .notEmpty().withMessage('Category is required')
    .isIn(['OPEN', 'OBC', 'SC', 'ST', 'VJ-DT', 'NT-B', 'NT-C', 'NT-D', 'SBC', 'EWS'])
    .withMessage('Invalid category'),
  body('stream')
    .optional()
    .isIn(['engineering', 'pharmacy', 'any'])
    .withMessage('Stream must be engineering, pharmacy, or any'),
  body('maxFees')
    .optional()
    .isInt({ min: 0, max: 1000000 }).withMessage('Invalid fees range'),
  validate,
];

// ── Profile update validators ─────────────────────────────────────
const profileUpdateValidator = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 60 }).withMessage('Name must be 2–60 characters')
    .escape(),
  body('phone')
    .optional()
    .trim()
    .matches(/^[0-9+\-\s]{7,15}$/).withMessage('Invalid phone number'),
  body('category')
    .optional()
    .isIn(['OPEN', 'OBC', 'SC', 'ST', 'VJ-DT', 'NT-B', 'NT-C', 'NT-D', 'SBC', 'EWS', ''])
    .withMessage('Invalid category'),
  validate,
];

module.exports = {
  validate,
  signupValidator,
  loginValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
  predictionValidator,
  profileUpdateValidator,
};
