/**
 * Prediction Controller
 * Core engine: runs the college prediction algorithm and persists results.
 */

const crypto = require('crypto');
const Prediction = require('../models/Prediction');
const User = require('../models/User');
const { COLLEGE_DB, CATEGORY_ADJUSTMENTS } = require('../data/colleges');

// ── Helper: median ────────────────────────────────────────────────
const median = (arr) => {
  const s = [...arr].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 === 0 ? (s[m - 1] + s[m]) / 2 : s[m];
};

// ── Composite ranking score (0-100) ──────────────────────────────
const calcScore = (college, branchData) => {
  let score = 0;
  score += (branchData.placement / 100) * 30;               // Placement rate 30%
  score += Math.min((branchData.avgPkg / 20) * 20, 20);     // Avg package 20%
  if (college.nirf > 0) score += Math.max(0, (200 - college.nirf) / 200) * 15; // NIRF 15%
  else score += 5;
  const arr = Object.values(branchData.cutoffs)[0];
  const mean = arr.reduce((a, b) => a + b) / arr.length;
  const std = Math.sqrt(arr.reduce((a, b) => a + (b - mean) ** 2, 0) / arr.length);
  score += Math.max(0, (2 - std) / 2) * 15;                 // Stability 15%
  score += (1 - Math.min(college.fees / 250000, 1)) * 10;   // Fees value 10%
  if (college.autonomous) score += 5;                        // Autonomous 5%
  if (college.tier === 1) score += 5;                        // Tier bonus
  return Math.round(Math.min(score, 100));
};

// ── Core prediction engine ────────────────────────────────────────
const runEngine = (input) => {
  const { percentile, category, location, collegeType, maxFees, preferredBranches, stream } = input;

  // Apply category bonus
  const adj = CATEGORY_ADJUSTMENTS[category] || 0;
  const effectivePct = Math.min(parseFloat(percentile) + adj, 99.99);

  const safe = [], moderate = [], dream = [];

  for (const college of COLLEGE_DB) {
    if (location && location !== 'any' && college.location !== location) continue;
    if (college.fees > (maxFees || 300000)) continue;
    if (collegeType === 'autonomous' && !college.autonomous) continue;
    if (collegeType === 'non-autonomous' && college.autonomous) continue;
    if (collegeType === 'govt' && college.type !== 'govt') continue;
    if (collegeType === 'aided' && college.type !== 'aided') continue;
    if (collegeType === 'unaided' && college.type !== 'unaided') continue;

    // Stream filter: 'engineering' | 'pharmacy' | 'any'
    const collegeStream = college.stream || 'engineering'; // default existing colleges to engineering
    if (stream && stream !== 'any' && collegeStream !== stream) continue;

    for (const [branchKey, branchData] of Object.entries(college.branches)) {
      if (!preferredBranches.includes('any') && !preferredBranches.includes(branchKey)) continue;

      const cutoffArr = branchData.cutoffs[category] || branchData.cutoffs.OPEN;
      const medCutoff = median(cutoffArr);
      const gap = effectivePct - medCutoff;
      const score = calcScore(college, branchData);

      const entry = {
        collegeId: college.id,
        collegeName: college.name,
        shortName: college.shortName,
        branch: branchKey,
        location: college.location,
        tier: college.tier,
        fees: college.fees,
        cutoffPercentile: Math.round(medCutoff * 100) / 100,
        placementRate: branchData.placement,
        avgPackage: branchData.avgPkg,
        maxPackage: branchData.maxPkg,
        autonomous: college.autonomous,
        type: college.type,
        nirf: college.nirf,
        gap: Math.round(gap * 100) / 100,
        score,
        category: gap >= 3 ? 'safe' : gap >= -4 ? 'moderate' : 'dream',
      };

      if (gap >= 3) safe.push(entry);
      else if (gap >= -4) moderate.push(entry);
      else if (gap >= -10) dream.push(entry);
    }
  }

  const sort = (arr) => arr.sort((a, b) => b.score - a.score).slice(0, 20);

  return {
    safe: sort(safe),
    moderate: sort(moderate),
    dream: sort(dream),
  };
};

// ── POST /api/predictions ─────────────────────────────────────────
exports.createPrediction = async (req, res, next) => {
  try {
    const {
      percentile,
      category,
      gender = 'any',
      homeUniversity = '',
      preferredBranches = ['any'],
      location = 'any',
      collegeType = 'any',
      maxFees = 300000,
      stream = 'engineering',
    } = req.body;

    const input = { percentile, category, gender, homeUniversity, preferredBranches, location, collegeType, maxFees, stream };
    const results = runEngine(input);
    const totalMatches = results.safe.length + results.moderate.length + results.dream.length;

    // Persist to DB (require auth)
    const shareToken = crypto.randomBytes(8).toString('hex');
    const prediction = await Prediction.create({
      user: req.user._id,
      input,
      results,
      totalMatches,
      shareToken,
      isPublic: false,
    });

    // Increment user prediction count
    await User.findByIdAndUpdate(req.user._id, { $inc: { totalPredictions: 1 } });

    res.status(201).json({ success: true, prediction });
  } catch (err) {
    next(err);
  }
};

// ── GET /api/predictions (user's history) ─────────────────────────
exports.getPredictions = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [predictions, total] = await Promise.all([
      Prediction.find({ user: req.user._id })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select('-results.safe -results.moderate -results.dream'), // Omit full results in list for performance
      Prediction.countDocuments({ user: req.user._id }),
    ]);

    res.json({
      success: true,
      predictions,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    next(err);
  }
};

// ── GET /api/predictions/:id ──────────────────────────────────────
exports.getPrediction = async (req, res, next) => {
  try {
    const prediction = await Prediction.findOne({ _id: req.params.id, user: req.user._id });
    if (!prediction) {
      return res.status(404).json({ success: false, message: 'Prediction not found.' });
    }
    res.json({ success: true, prediction });
  } catch (err) {
    next(err);
  }
};

// ── GET /api/predictions/share/:token (public) ────────────────────
exports.getSharedPrediction = async (req, res, next) => {
  try {
    const prediction = await Prediction.findOne({ shareToken: req.params.token, isPublic: true });
    if (!prediction) {
      return res.status(404).json({ success: false, message: 'Shared prediction not found or not made public.' });
    }
    res.json({ success: true, prediction });
  } catch (err) {
    next(err);
  }
};

// ── PATCH /api/predictions/:id/share ─────────────────────────────
exports.toggleShare = async (req, res, next) => {
  try {
    const prediction = await Prediction.findOne({ _id: req.params.id, user: req.user._id });
    if (!prediction) return res.status(404).json({ success: false, message: 'Not found.' });
    prediction.isPublic = !prediction.isPublic;
    await prediction.save();
    res.json({ success: true, isPublic: prediction.isPublic, shareToken: prediction.shareToken });
  } catch (err) {
    next(err);
  }
};

// ── DELETE /api/predictions/:id ───────────────────────────────────
exports.deletePrediction = async (req, res, next) => {
  try {
    const prediction = await Prediction.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!prediction) return res.status(404).json({ success: false, message: 'Not found.' });
    await User.findByIdAndUpdate(req.user._id, { $inc: { totalPredictions: -1 } });
    res.json({ success: true, message: 'Prediction deleted.' });
  } catch (err) {
    next(err);
  }
};
