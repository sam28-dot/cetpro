'use strict';

const express = require('express');
const router = express.Router();
const dataset = require('../data/official-cutoffs-2025-26.json');

const records = Array.isArray(dataset.records) ? dataset.records : [];
const normalise = (value) => {
  const words = String(value ?? '').normalize('NFKD').toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ').trim().split(' ').filter(Boolean);
  const aliases = { govt: 'government', engg: 'engineering', kokan: 'konkan', gyanpeth: 'gyanpeeth' };
  return words.map((word) => aliases[word] || word).join(' ');
};

const CATEGORY_FAMILIES = {
  GOPENS: ['GOPENS', 'GOPENH', 'GOPENO'],
  GSCS: ['GSCS', 'GSCH', 'GSCO'],
  GSTS: ['GSTS', 'GSTH', 'GSTO'],
  GOBCS: ['GOBCS', 'GOBCH', 'GOBCO'],
  GNT1S: ['GNT1S', 'GNT1H', 'GNT1O'],
  GNT2S: ['GNT2S', 'GNT2H', 'GNT2O'],
  GNT3S: ['GNT3S', 'GNT3H', 'GNT3O'],
  GVJS: ['GVJS', 'GVJH', 'GVJO'],
  GEWS: ['GEWS', 'EWS'],
};

const matchesSearch = (record, query) => {
  const q = normalise(query);
  if (!q) return true;
  const haystack = normalise([record.college, record.course, record.choiceCode, record.collegeCode].join(' '));
  return haystack.includes(q) || q.split(' ').filter(Boolean).every((token) => haystack.includes(token));
};
const normaliseStage = (value) => {
  const stage = String(value ?? '').trim().toUpperCase().replace('STAGE ', '').replaceAll(' ', '').replaceAll('-', '');
  return stage;
};

// GET /api/cutoffs/categories
// Return only category codes that actually exist in the imported engineering MH percentile records.
router.get('/categories', (req, res) => {
  const categories = [...new Set(records
    .filter((r) => r.domain === 'engineering' && r.route === 'MH' && r.bracketMetric === 'merit_percentile' && r.parsed === true)
    .map((r) => String(r.categoryCode || '').trim().toUpperCase())
    .filter(Boolean))]
    .sort((a, b) => a.localeCompare(b));

  res.json({
    success: true,
    academicYear: dataset.academicYear,
    round: dataset.round,
    categories,
    count: categories.length,
    note: 'Exact category codes present in the currently imported official historical records; codes are not inferred.',
  });
});

// GET /api/cutoffs
// Read-only access to imported official CAP Round IV records.
// This endpoint is for browsing/validation only; it does not enable predictions.
router.get('/', (req, res) => {
  const domain = normalise(req.query.domain);
  const route = normalise(req.query.route);
  const category = normalise(req.query.category);
  const search = normalise(req.query.search);
  const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, Number.parseInt(req.query.limit, 10) || 25));

  let filtered = records;
  if (domain && domain !== 'any') filtered = filtered.filter((r) => normalise(r.domain) === domain);
  if (route && route !== 'any') filtered = filtered.filter((r) => normalise(r.route) === route);
  if (category) filtered = filtered.filter((r) => normalise(r.categoryCode) === category);
  if (search) {
    filtered = filtered.filter((r) =>
      [r.college, r.course, r.choiceCode, r.collegeCode, r.categoryCode, r.exam]
        .some((value) => normalise(value).includes(search))
    );
  }

  const start = (page - 1) * limit;
  res.json({
    success: true,
    status: dataset.status || 'review_only_not_for_predictions',
    academicYear: dataset.academicYear,
    round: dataset.round,
    mode: 'browse_only',
    predictionEnabled: false,
    filters: { domain: domain || 'any', route: route || 'any', category: category || null, search: search || null },
    total: filtered.length,
    page,
    limit,
    pages: Math.ceil(filtered.length / limit),
    records: filtered.slice(start, start + limit),
    officialSources: dataset.officialSources || [],
    note: 'Imported records are available for inspection. Prediction use remains disabled until category, seat eligibility, and score metrics are validated.',
  });
});


// GET /api/cutoffs/compare?percentile=95&categoryCode=GOPENS
// Historical comparison only. This deliberately supports engineering MH
// percentile records only; it does not estimate admission probability.
router.get('/compare', (req, res) => {
  const percentile = Number(req.query.percentile);
  const categoryCode = String(req.query.categoryCode || '').trim().toUpperCase();
  const search = normalise(req.query.search);
  const stage = String(req.query.stage || '').trim().toUpperCase();

  if (!Number.isFinite(percentile) || percentile < 0 || percentile > 100) {
    return res.status(400).json({ success: false, message: 'Provide percentile from 0 to 100.' });
  }
  if (!categoryCode || !/^[A-Z0-9 -]{2,20}$/.test(categoryCode)) {
    return res.status(400).json({ success: false, message: 'Provide the exact official categoryCode, e.g. GOPENS. No automatic category mapping is applied.' });
  }

  const baseRecords = records.filter((r) =>
    r.domain === 'engineering' && r.route === 'MH' &&
    r.bracketMetric === 'merit_percentile' && r.parsed === true
  );
  let filtered = baseRecords.filter((r) => normalise(r.categoryCode) === normalise(categoryCode));

  if (stage) filtered = filtered.filter((r) => normaliseStage(r.stage) === normaliseStage(stage));
  if (search) {
    const exactSearchResults = filtered.filter((r) => matchesSearch(r, search));
    if (exactSearchResults.length) {
      filtered = exactSearchResults;
    } else {
      const family = CATEGORY_FAMILIES[normalise(categoryCode)] || [normalise(categoryCode)];
      filtered = baseRecords.filter((r) =>
        family.some((code) => normalise(code) === normalise(r.categoryCode)) && matchesSearch(r, search) &&
        (!stage || normaliseStage(r.stage) === normaliseStage(stage))
      );
    }
  }

  const comparisons = filtered.map((r) => ({
    ...r,
    percentileDifference: Number((percentile - Number(r.bracketValue)).toFixed(4)),
    historicalComparison: percentile >= Number(r.bracketValue)
      ? 'candidate_percentile_at_or_above_historical_cutoff'
      : 'candidate_percentile_below_historical_cutoff',
  }));

  comparisons.sort((a, b) => {
    if (a.historicalComparison !== b.historicalComparison) {
      return a.historicalComparison === 'candidate_percentile_at_or_above_historical_cutoff' ? -1 : 1;
    }
    return Number(b.bracketValue) - Number(a.bracketValue);
  });

  res.json({
    success: true,
    mode: 'historical_comparison_only',
    predictionEnabled: false,
    academicYear: dataset.academicYear,
    round: dataset.round,
    metric: 'MHT-CET merit percentile',
    input: { percentile, categoryCode, search: search || null, stage: stage || null },
    total: comparisons.length,
    records: comparisons.slice(0, 100),
    note: search && comparisons.some((r) => normalise(r.categoryCode) !== normalise(categoryCode))
      ? 'No exact-category rows matched this search. Matching official home-university/other-university variants in the same category family are shown; check each returned categoryCode and eligibility. Historical comparison only, not an admission guarantee.'
      : 'This compares a percentile against extracted historical cutoffs only. It is not an admission prediction or guarantee. Category/seat eligibility, gender, home-university status, and current-year rules are not inferred.',
  });
});

module.exports = router;
