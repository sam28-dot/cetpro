'use strict';

const { COLLEGE_DB, CUTOFF_DATASET } = require('../data/colleges');

const VALID_CATEGORIES = new Set([
  'OPEN', 'EWS', 'OBC', 'SC', 'ST', 'NT-B', 'NT-C', 'NT-D', 'VJ-DT', 'SBC',
]);
const VALID_STREAMS = new Set(['engineering', 'pharmacy', 'any']);
const EMPTY_RESULTS = () => ({ safe: [], moderate: [], dream: [] });

function normaliseCategory(value) {
  return String(value ?? '').trim().toUpperCase().replace(/_/g, '-');
}

function parsePercentile(value) {
  if (value === '' || value === null || value === undefined) return null;
  const n = Number(value);
  return Number.isFinite(n) && n >= 0 && n <= 100 ? n : null;
}

function median(values) {
  if (!Array.isArray(values) || values.length === 0) return null;
  const numbers = values.map(Number);
  if (!numbers.every(Number.isFinite)) return null;
  numbers.sort((a, b) => a - b);
  const mid = Math.floor(numbers.length / 2);
  return numbers.length % 2 ? numbers[mid] : (numbers[mid - 1] + numbers[mid]) / 2;
}

/**
 * Returns a cutoff only when it is explicitly marked verified and identifies
 * the target year/round plus an official Maharashtra CET Cell source URL.
 * Expected branch schema:
 * verifiedCutoffs: {
 *   SC: { percentile: 92.31, verified: true, academicYear: '2025-26',
 *         round: 'CAP Round IV', sourceUrl: 'https://fe2025.mahacet.org/...' }
 * }
 * A real importer must also match the correct institute/course/category/seat
 * type/gender/home-university/quota row before creating this record.
 */
function getVerifiedCutoff(branch, category) {
  const record = branch && branch.verifiedCutoffs && branch.verifiedCutoffs[category];
  if (!record || record.verified !== true) return null;
  if (record.academicYear !== CUTOFF_DATASET.academicYear) return null;
  if (record.round !== CUTOFF_DATASET.targetRound) return null;
  if (typeof record.sourceUrl !== 'string') return null;
  let source;
  try { source = new URL(record.sourceUrl); } catch { return null; }
  if (source.protocol !== 'https:' || !/(^|\.)mahacet\.org$/i.test(source.hostname)) return null;
  return parsePercentile(record.percentile);
}

function hasVerifiedCutoffs() {
  return COLLEGE_DB.some(college =>
    Object.values(college.branches || {}).some(branch =>
      Object.keys(branch.verifiedCutoffs || {}).some(category =>
        getVerifiedCutoff(branch, category) !== null
      )
    )
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
  const tierScore = Math.max(0, 4 - tier) / 3 * 100;
  return Math.round(placement * 0.4 + Math.min(averagePackage * 2, 100) * 0.25 + nirfScore * 0.15 + feeScore * 0.1 + tierScore * 0.1);
}

function predictColleges(input = {}) {
  const percentile = parsePercentile(input.percentile);
  const category = normaliseCategory(input.category);
  const stream = String(input.stream || 'any').trim().toLowerCase();
  const results = EMPTY_RESULTS();

  if (percentile === null) {
    return { success: false, message: 'Enter a valid MHT-CET percentile from 0 to 100.', results };
  }
  if (!VALID_CATEGORIES.has(category)) {
    return { success: false, message: 'Select a supported admission category.', results };
  }
  if (!VALID_STREAMS.has(stream)) {
    return { success: false, message: 'Select engineering, pharmacy, or any stream.', results };
  }

  let preferred = input.preferredBranches ?? ['any'];
  if (typeof preferred === 'string') preferred = preferred.split(',').map(x => x.trim()).filter(Boolean);
  if (!Array.isArray(preferred)) preferred = ['any'];
  preferred = preferred.map(x => String(x).trim().toUpperCase());

  for (const college of COLLEGE_DB) {
    const collegeStream = String(college.stream || 'engineering').toLowerCase();
    if (stream !== 'any' && collegeStream !== stream) continue;

    if (input.location && String(input.location).toLowerCase() !== 'any' &&
        String(college.location || '').toLowerCase() !== String(input.location).trim().toLowerCase()) continue;
    if (input.collegeType && String(input.collegeType).toLowerCase() !== 'any' &&
        String(college.type || '').toLowerCase() !== String(input.collegeType).trim().toLowerCase()) continue;
    if (input.maxFees !== undefined && input.maxFees !== null && input.maxFees !== '' &&
        Number.isFinite(Number(input.maxFees)) && Number(college.fees) > Number(input.maxFees)) continue;

    for (const [branchName, branch] of Object.entries(college.branches || {})) {
      if (!preferred.includes('ANY') && !preferred.includes(branchName.toUpperCase())) continue;
      const cutoff = getVerifiedCutoff(branch, category);
      // Never fall back to the old illustrative `cutoffs` arrays.
      if (cutoff === null) continue;

      const gap = Number((percentile - cutoff).toFixed(2));
      const entry = {
        collegeId: college.id,
        collegeName: college.name,
        shortName: college.shortName,
        location: college.location,
        stream: collegeStream,
        branch: branchName,
        category,
        studentPercentile: percentile,
        cutoffPercentile: cutoff,
        percentileGap: gap,
        academicYear: CUTOFF_DATASET.academicYear,
        cutoffRound: CUTOFF_DATASET.targetRound,
        cutoffSourceVerified: true,
        cutoffSourceUrl: branch.verifiedCutoffs[category].sourceUrl,
        score: calcScore(college, branch),
        fees: college.fees,
        placement: branch.placement,
        avgPkg: branch.avgPkg,
        maxPkg: branch.maxPkg,
      };
      if (gap >= 3) results.safe.push(entry);
      else if (gap >= -4) results.moderate.push(entry);
      else if (gap >= -10) results.dream.push(entry);
    }
  }

  for (const group of Object.values(results)) group.sort((a, b) => b.score - a.score);
  const loaded = hasVerifiedCutoffs();
  return {
    success: true,
    dataStatus: loaded ? 'verified_records_available' : 'official_records_not_loaded',
    academicYear: CUTOFF_DATASET.academicYear,
    cutoffRound: CUTOFF_DATASET.targetRound,
    message: loaded
      ? 'Results use matching records marked verified from the official Maharashtra CET Cell source.'
      : 'Prediction is temporarily unavailable: verified 2025–26 CAP cutoff records have not been imported. Legacy estimates are intentionally not used.',
    results,
  };
}

function getPredictions(req, res) {
  try {
    // Merge query first and body second, so submitted body fields take precedence.
    const input = { ...(req.query || {}), ...(req.body || {}) };
    const result = predictColleges(input);
    return res.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    console.error('Prediction error:', error);
    return res.status(500).json({
      success: false,
      message: 'Unable to generate predictions.',
      results: EMPTY_RESULTS(),
    });
  }
}

module.exports = { getPredictions, predictColleges, median, calcScore, getVerifiedCutoff };
