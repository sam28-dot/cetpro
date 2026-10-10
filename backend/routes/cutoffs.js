'use strict';

const express = require('express');
const router = express.Router();
const dataset = require('../data/official-cutoffs-2025-26.json');

const records = Array.isArray(dataset.records) ? dataset.records : [];
const normalise = (value) => String(value ?? '').trim().toLowerCase();

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

module.exports = router;
