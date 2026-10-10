'use strict';

const express = require('express');
const path = require('path');

const router = express.Router();
const datasetPath = path.join(__dirname, '..', 'data', 'official-cutoffs-2025-26.json');
let dataset;

function getDataset() {
  if (!dataset) {
    // Load once and reuse; the JSON is committed alongside the backend.
    // This endpoint is for browsing/review only, not admission predictions.
    dataset = require(datasetPath);
  }
  return dataset;
}

// GET /api/official-cutoffs
// Read-only access to extracted official CAP Round IV records.
// Records remain review-only until category/seat eligibility and metrics are validated.
router.get('/', (req, res, next) => {
  try {
    const data = getDataset();
    const records = Array.isArray(data.records) ? data.records : [];
    const allowedDomains = new Set(['engineering', 'pharmacy']);
    const allowedRoutes = new Set(['MH', 'AI']);

    const domain = String(req.query.domain || '').trim().toLowerCase();
    const route = String(req.query.route || '').trim().toUpperCase();
    const category = String(req.query.category || '').trim().toUpperCase();
    const collegeCode = String(req.query.collegeCode || '').trim().toUpperCase();
    const search = String(req.query.search || '').trim().toLowerCase();

    if (domain && !allowedDomains.has(domain)) {
      return res.status(400).json({ success: false, message: 'domain must be engineering or pharmacy.' });
    }
    if (route && !allowedRoutes.has(route)) {
      return res.status(400).json({ success: false, message: 'route must be MH or AI.' });
    }

    const parsedLimit = Number.parseInt(req.query.limit, 10);
    const limit = Number.isFinite(parsedLimit) ? Math.min(Math.max(parsedLimit, 1), 100) : 25;
    const parsedOffset = Number.parseInt(req.query.offset, 10);
    const offset = Number.isFinite(parsedOffset) ? Math.max(parsedOffset, 0) : 0;

    const filtered = records.filter((record) => {
      if (domain && String(record.domain || '').toLowerCase() !== domain) return false;
      if (route && String(record.route || '').toUpperCase() !== route) return false;
      if (category && String(record.categoryCode || '').replace(/\\s+/g, '').toUpperCase() !== category.replace(/\\s+/g, '')) return false;
      if (collegeCode && String(record.collegeCode || '').toUpperCase() !== collegeCode) return false;
      if (search) {
        const haystack = [
          record.college, record.course, record.choiceCode, record.collegeCode,
          record.categoryCode, record.exam, record.seatType,
        ].filter(Boolean).join(' ').toLowerCase();
        if (!haystack.includes(search)) return false;
      }
      return true;
    });

    return res.json({
      success: true,
      status: 'review_only_not_for_predictions',
      academicYear: data.academicYear || '2025-26',
      round: data.round || 'CAP Round IV',
      officialSources: data.officialSources || [],
      count: filtered.length,
      limit,
      offset,
      records: filtered.slice(offset, offset + limit),
      warning: 'Extracted official records are exposed for review only. They are not yet enabled for admission predictions.',
    });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
