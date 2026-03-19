/**
 * User Controller
 * Profile viewing, updating, and account management.
 */

const User = require('../models/User');
const Prediction = require('../models/Prediction');

// ── GET /api/users/profile ────────────────────────────────────────
exports.getProfile = async (req, res) => {
  const user = await User.findById(req.user._id);
  res.json({ success: true, user: user.toSafeObject() });
};

// ── PATCH /api/users/profile ──────────────────────────────────────
exports.updateProfile = async (req, res, next) => {
  try {
    const allowed = ['name', 'phone', 'category', 'homeUniversity', 'preferredBranches'];
    const updates = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    res.json({ success: true, message: 'Profile updated!', user: user.toSafeObject() });
  } catch (err) {
    next(err);
  }
};

// ── PATCH /api/users/change-password ─────────────────────────────
exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Current and new password are required.' });
    }
    if (newPassword.length < 8) {
      return res.status(400).json({ success: false, message: 'New password must be at least 8 characters.' });
    }

    const user = await User.findById(req.user._id).select('+password');
    if (!(await user.comparePassword(currentPassword))) {
      return res.status(401).json({ success: false, message: 'Current password is incorrect.' });
    }

    user.password = newPassword;
    await user.save();

    res.json({ success: true, message: 'Password changed successfully.' });
  } catch (err) {
    next(err);
  }
};

// ── GET /api/users/stats ──────────────────────────────────────────
exports.getStats = async (req, res, next) => {
  try {
    const [totalPredictions, recentPredictions] = await Promise.all([
      Prediction.countDocuments({ user: req.user._id }),
      Prediction.find({ user: req.user._id })
        .sort({ createdAt: -1 })
        .limit(5)
        .select('input.percentile input.category totalMatches createdAt'),
    ]);

    res.json({ success: true, stats: { totalPredictions, recentPredictions } });
  } catch (err) {
    next(err);
  }
};
