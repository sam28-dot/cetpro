
'use strict';

const crypto = require('crypto');
const mongoose = require('mongoose');
const Prediction = require('../models/Prediction');
const { COLLEGE_DB, CUTOFF_DATASET } = require('../data/colleges');
const officialDataset = require('../data/official-cutoffs-2025-26.json');
const OFFICIAL_ENGINEERING_SOURCE = 'https://fe2025.mahacet.org/ViewPublicDocument?MenuId=9822';
const CATEGORY_TO_OFFICIAL_CODE = {
  OPEN: ['GOPENS', 'GOPENH', 'GOPENO'],
  OBC: ['GOBCS', 'GOBCH', 'GOBCO'],
  SC: ['GSCS', 'GSCH', 'GSCO'],
  ST: ['GSTS', 'GSTH', 'GSTO'],
  'NT-B': ['GNT1S', 'GNT1H', 'GNT1O'],
  'NT-C': ['GNT2S', 'GNT2H', 'GNT2O'],
  'NT-D': ['GNT3S', 'GNT3H', 'GNT3O'],
  'VJ-DT': ['GVJS', 'GVJH', 'GVJO'],
  EWS: ['EWS', 'GEWS'],
};

const VALID_CATEGORIES = new Set([
  'OPEN', 'EWS', 'OBC', 'SC', 'ST',
  'NT-B', 'NT-C', 'NT-D', 'VJ-DT', 'SBC',
]);

const VALID_STREAMS = new Set(['engineering', 'pharmacy', 'any']);

const EMPTY_RESULTS = () => ({
  safe: [],
  moderate: [],
  dream: [],
});

function normaliseCategory(value) {
  return String(value ?? '')
    .trim()
    .toUpperCase()
    .replace(/_/g, '-');
}

function parsePercentile(value) {
  if (value === '' || value === null || value === undefined) {
    return null;
  }

  const number = Number(value);

  return Number.isFinite(number) && number >= 0 && number <= 100
    ? number
    : null;
}

function median(values) {
  if (!Array.isArray(values) || values.length === 0) return null;

  const numbers = values.map(Number);
  if (!numbers.every(Number.isFinite)) return null;

  numbers.sort((a, b) => a - b);

  const mid = Math.floor(numbers.length / 2);

  return numbers.length % 2
    ? numbers[mid]
    : (numbers[mid - 1] + numbers[mid]) / 2;
}

/**
 * Accept only explicitly verified records matching the configured
 * academic year and CAP round, with an official Maharashtra CET Cell URL.
 */
function getVerifiedCutoff(branch, category) {
  const record =
    branch &&
    branch.verifiedCutoffs &&
    branch.verifiedCutoffs[category];

  if (!record || record.verified !== true) return null;
  if (record.academicYear !== CUTOFF_DATASET.academicYear) return null;
  if (record.round !== CUTOFF_DATASET.targetRound) return null;
  if (typeof record.sourceUrl !== 'string') return null;

  let source;

  try {
    source = new URL(record.sourceUrl);
  } catch {
    return null;
  }

  if (
    source.protocol !== 'https:' ||
    !/(^|\.)mahacet\.org$/i.test(source.hostname)
  ) {
    return null;
  }

  return parsePercentile(record.percentile);
}

function hasVerifiedCutoffs() {
  return Array.isArray(officialDataset.records) && officialDataset.records.some((record) =>
    record.parsed === true && record.domain === 'engineering' && record.route === 'MH' &&
    record.bracketMetric === 'merit_percentile' && Object.values(CATEGORY_TO_OFFICIAL_CODE).some((codes) => codes.includes(record.categoryCode))
  );
}

function normaliseText(value) {
  return String(value ?? '').normalize('NFKD').toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ').trim().split(' ').filter(Boolean).join(' ');
}

function matchesPreferredBranch(course, preferred) {
  if (preferred.includes('ANY')) return true;
  const text = normaliseText(course);
  const aliases = {
    CSE: ['computer science', 'computer engineering', 'cse'],
    IT: ['information technology'],
    AIML: ['artificial intelligence and machine learning', 'ai and machine learning', 'aiml'],
    DS: ['data science'],
    EXTC: ['electronics and telecommunication', 'electronics telecommunications', 'electronics and telecom', 'extc'],
    MECH: ['mechanical engineering'],
    CIVIL: ['civil engineering'],
    ETRX: ['electronics engineering', 'electrical and electronics'],
    IOT: ['internet of things', 'iot'],
  };
  return preferred.some((branch) =>
    (aliases[branch] || [normaliseText(branch)]).some((alias) => text.includes(normaliseText(alias)))
  );
}

function calcScore(college, branch) {
  const placement = Number(branch.placement) || 0;
  const averagePackage = Number(branch.avgPkg) || 0;
  const nirf = Number(college.nirf) || 0;
  const fees = Number(college.fees) || 0;
  const tier = Number(college.tier) || 3;

  const nirfScore = nirf > 0 ? Math.max(0, 100 - nirf) : 0;
  const feeScore = Math.max(0, 1 - fees / 250000) * 100;
  const tierScore = (Math.max(0, 4 - tier) / 3) * 100;

  return Math.round(
    placement * 0.4 +
    Math.min(averagePackage * 2, 100) * 0.25 +
    nirfScore * 0.15 +
    feeScore * 0.1 +
    tierScore * 0.1
  );
}

function predictColleges(input = {}) {
  const percentile = parsePercentile(input.percentile);
  const category = normaliseCategory(input.category);
  const stream = String(input.stream || 'engineering').trim().toLowerCase();
  const results = EMPTY_RESULTS();

  if (percentile === null) return { success: false, message: 'Enter a valid MHT-CET percentile from 0 to 100.', results };
  if (!VALID_CATEGORIES.has(category)) return { success: false, message: 'Select a supported admission category.', results };
  if (!VALID_STREAMS.has(stream)) return { success: false, message: 'Select engineering, pharmacy, or any stream.', results };
  if (stream !== 'engineering') {
    return { success: false, dataStatus: 'stream_not_supported_by_percentile_dataset',
      message: 'Verified percentile-based prediction currently supports Engineering only. Pharmacy records use a different merit metric and cannot safely be compared with MHT-CET percentile.', results };
  }

  let preferred = input.preferredBranches ?? ['any'];
  if (typeof preferred === 'string') preferred = preferred.split(',').map((value) => value.trim()).filter(Boolean);
  if (!Array.isArray(preferred)) preferred = ['any'];
  preferred = preferred.map((value) => String(value).trim().toUpperCase());

  const officialCategory = CATEGORY_TO_OFFICIAL_CODE[category];
  if (!officialCategory) {
    return { success: false, dataStatus: 'category_not_mapped',
      message: 'No validated official state-level cutoff mapping is available for this category.', results };
  }

  const officialRecords = (Array.isArray(officialDataset.records) ? officialDataset.records : []).filter((record) =>
    record.parsed === true && record.domain === 'engineering' && record.route === 'MH' &&
    record.bracketMetric === 'merit_percentile' && officialCategory.includes(record.categoryCode) &&
    Number.isFinite(Number(record.bracketValue))
  );
  if (!officialRecords.length) {
    return { success: false, dataStatus: 'official_records_not_loaded',
      message: 'No parsed official engineering percentile records are available for this category in the imported 2025–26 CAP Round IV dataset.', results };
  }

  const bestByChoice = new Map();
  for (const record of officialRecords) {
    if (!matchesPreferredBranch(record.course, preferred)) continue;
    const meta = COLLEGE_DB.find((college) => normaliseText(college.name) === normaliseText(record.college));
    if (input.location && String(input.location).toLowerCase() !== 'any' &&
        (!meta || normaliseText(meta.location) !== normaliseText(input.location))) continue;
    if (input.collegeType && String(input.collegeType).toLowerCase() !== 'any' &&
        (!meta || normaliseText(meta.type) !== normaliseText(input.collegeType))) continue;
    if (input.maxFees !== undefined && input.maxFees !== null && input.maxFees !== '' && meta &&
        Number.isFinite(Number(meta.fees)) && Number(meta.fees) > Number(input.maxFees)) continue;

    const key = String(record.collegeCode) + '|' + String(record.choiceCode) + '|' + normaliseText(record.course);
    const previous = bestByChoice.get(key);
    if (!previous || Number(record.bracketValue) > Number(previous.bracketValue)) bestByChoice.set(key, record);
  }

  for (const record of bestByChoice.values()) {
    const cutoff = Number(record.bracketValue);
    const gap = Number((percentile - cutoff).toFixed(2));
    const meta = COLLEGE_DB.find((college) => normaliseText(college.name) === normaliseText(record.college));
    const entry = {
      collegeId: Number(record.collegeCode) || 0,
      collegeName: record.college,
      shortName: meta?.shortName || record.college,
      location: meta?.location || '',
      stream: 'engineering',
      branch: record.course,
      category,
      officialCategoryCode: record.categoryCode,
      choiceCode: record.choiceCode,
      studentPercentile: percentile,
      cutoffPercentile: cutoff,
      percentileGap: gap,
      academicYear: officialDataset.academicYear,
      cutoffRound: officialDataset.round,
      cutoffSourceVerified: true,
      cutoffSourceUrl: OFFICIAL_ENGINEERING_SOURCE,
      score: 0,
      fees: meta?.fees ?? null,
      placement: null,
      avgPkg: null,
      maxPkg: null,
    };
    if (gap >= 3) results.safe.push(entry);
    else if (gap >= -4) results.moderate.push(entry);
    else results.dream.push(entry);
  }

  for (const group of Object.values(results)) group.sort((a, b) => b.cutoffPercentile - a.cutoffPercentile);
  return {
    success: true,
    dataStatus: 'verified_records_available',
    academicYear: officialDataset.academicYear,
    cutoffRound: officialDataset.round,
    message: 'Results compare your percentile with imported official 2025–26 CAP Round IV engineering cutoffs. These historical comparisons are not admission guarantees; repeated allotment-stage rows are collapsed to the highest cutoff per course.',
    results,
  };
}

// Convert prediction results into the schema used by Prediction.js.
function toStoredResults(results) {
  const stored = EMPTY_RESULTS();

  for (const groupName of Object.keys(stored)) {
    stored[groupName] = (results[groupName] || []).map((item) => ({
      collegeId: item.collegeId,
      collegeName: item.collegeName,
      shortName: item.shortName,
      branch: item.branch,
      location: item.location,
      tier: item.tier,
      fees: item.fees,
      cutoffPercentile: item.cutoffPercentile,
      officialCategoryCode: item.officialCategoryCode,
      choiceCode: item.choiceCode,
      academicYear: item.academicYear,
      cutoffRound: item.cutoffRound,
      cutoffSourceUrl: item.cutoffSourceUrl,
      placementRate: item.placement,
      avgPackage: item.avgPkg,
      maxPackage: item.maxPkg,
      autonomous: item.autonomous,
      type: item.type,
      nirf: item.nirf,
      category: groupName,
      score: item.score,
      gap: item.percentileGap,
    }));
  }

  return stored;
}

function getInput(req) {
  const body = req.body || {};
  const input =
    body.input && typeof body.input === 'object'
      ? body.input
      : body;

  const preferredBranches = input.preferredBranches ?? ['any'];

  return {
    percentile: input.percentile,
    category: normaliseCategory(input.category),
    gender: input.gender || 'any',
    homeUniversity: input.homeUniversity || '',
    preferredBranches: Array.isArray(preferredBranches)
      ? preferredBranches.map(String)
      : String(preferredBranches)
        .split(',')
        .map((value) => value.trim())
        .filter(Boolean),
    location: input.location || 'any',
    collegeType: input.collegeType || 'any',
    maxFees:
      input.maxFees === '' ||
        input.maxFees === undefined ||
        input.maxFees === null
        ? 300000
        : Number(input.maxFees),
    stream: String(input.stream || 'engineering').toLowerCase(),
  };
}

// POST /api/predictions
// Generate and save a prediction for the authenticated user.
async function createPrediction(req, res, next) {
  try {
    const input = getInput(req);
    const calculated = predictColleges(input);

    if (!calculated.success) {
      return res.status(400).json(calculated);
    }

    // Do not save a misleading empty prediction when official records
    // have not been imported.
    if (calculated.dataStatus !== 'verified_records_available') {
      return res.status(503).json({
        ...calculated,
        message:
          'Verified official cutoff records are not loaded yet. No prediction was saved.',
      });
    }

    const results = toStoredResults(calculated.results);

    const totalMatches =
      results.safe.length +
      results.moderate.length +
      results.dream.length;

    const prediction = await Prediction.create({
      user: req.user._id,
      input,
      results,
      totalMatches,
      label: String(req.body?.label || '').trim().slice(0, 100),
    });

    return res.status(201).json({
      success: true,
      message: 'Prediction generated and saved successfully.',
      prediction,
      dataStatus: calculated.dataStatus,
      academicYear: calculated.academicYear,
      cutoffRound: calculated.cutoffRound,
    });
  } catch (error) {
    return next(error);
  }
}

// GET /api/predictions
// List only the authenticated user's saved predictions.
async function getPredictions(req, res, next) {
  try {
    const predictions = await Prediction.find({
      user: req.user._id,
    })
      .sort({ createdAt: -1 })
      .limit(100)
      .select('-results');

    return res.status(200).json({
      success: true,
      count: predictions.length,
      predictions,
    });
  } catch (error) {
    return next(error);
  }
}

// GET /api/predictions/:id
// Retrieve one of the authenticated user's saved predictions.
async function getPrediction(req, res, next) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid prediction ID.',
      });
    }

    const prediction = await Prediction.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!prediction) {
      return res.status(404).json({
        success: false,
        message: 'Prediction not found.',
      });
    }

    return res.status(200).json({
      success: true,
      prediction,
    });
  } catch (error) {
    return next(error);
  }
}

// PATCH /api/predictions/:id/share
// Toggle public sharing for a prediction owned by the user.
async function toggleShare(req, res, next) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid prediction ID.',
      });
    }

    const prediction = await Prediction.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!prediction) {
      return res.status(404).json({
        success: false,
        message: 'Prediction not found.',
      });
    }

    if (prediction.isPublic) {
      prediction.isPublic = false;
      prediction.shareToken = undefined;
    } else {
      prediction.isPublic = true;

      // A cryptographically random token makes the share URL difficult
      // to guess. Retry in the extremely unlikely event of a collision.
      let token;
      let attempts = 0;

      do {
        token = crypto.randomBytes(24).toString('hex');
        attempts += 1;

        if (attempts > 3) {
          throw new Error('Unable to generate a unique share token.');
        }
      } while (
        await Prediction.exists({ shareToken: token })
      );

      prediction.shareToken = token;
    }

    await prediction.save();

    return res.status(200).json({
      success: true,
      isPublic: prediction.isPublic,
      shareToken: prediction.isPublic
        ? prediction.shareToken
        : null,
      message: prediction.isPublic
        ? 'Prediction sharing enabled.'
        : 'Prediction sharing disabled.',
    });
  } catch (error) {
    return next(error);
  }
}

// DELETE /api/predictions/:id
// Delete only a prediction owned by the authenticated user.
async function deletePrediction(req, res, next) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid prediction ID.',
      });
    }

    const prediction = await Prediction.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!prediction) {
      return res.status(404).json({
        success: false,
        message: 'Prediction not found.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Prediction deleted successfully.',
    });
  } catch (error) {
    return next(error);
  }
}

// GET /api/predictions/share/:token
// Publicly retrieve a prediction only when sharing is enabled.
async function getSharedPrediction(req, res, next) {
  try {
    const token = String(req.params.token || '');

    if (!/^[a-f0-9]{48}$/i.test(token)) {
      return res.status(404).json({
        success: false,
        message: 'Shared prediction not found.',
      });
    }

    const prediction = await Prediction.findOne({
      shareToken: token,
      isPublic: true,
    }).select('-user -shareToken');

    if (!prediction) {
      return res.status(404).json({
        success: false,
        message: 'Shared prediction not found or sharing is disabled.',
      });
    }

    return res.status(200).json({
      success: true,
      prediction,
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  createPrediction,
  getPredictions,
  getPrediction,
  toggleShare,
  deletePrediction,
  getSharedPrediction,

  // Retain these exports for existing code that imports the helpers.
  predictColleges,
  median,
  calcScore,
  getVerifiedCutoff,
};