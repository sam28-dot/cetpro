// routes/college.js
const express = require('express');
const router = express.Router();
const { COLLEGE_DB } = require('../data/colleges');

// GET /api/colleges — list all colleges with optional filters
router.get('/', (req, res) => {
  const { location, tier, type, autonomous, search, stream } = req.query;
  let results = [...COLLEGE_DB];

  if (location && location !== 'any') results = results.filter(c => c.location === location);
  if (tier) results = results.filter(c => c.tier === parseInt(tier));
  if (type && type !== 'any') results = results.filter(c => c.type === type);
  if (autonomous !== undefined && autonomous !== 'any') {
    results = results.filter(c => c.autonomous === (autonomous === 'true'));
  }
  // Stream filter: 'engineering' | 'pharmacy' | 'any' (default engineering for backward compat)
  if (stream && stream !== 'any') {
    results = results.filter(c => (c.stream || 'engineering') === stream);
  }
  if (search) {
    const q = search.toLowerCase();
    results = results.filter(c => c.name.toLowerCase().includes(q) || c.shortName.toLowerCase().includes(q));
  }

  // Strip raw cutoff arrays from list view for performance
  const slim = results.map(({ branches, ...rest }) => ({
    ...rest,
    branchCount: Object.keys(branches).length,
    branches: Object.entries(branches).map(([key, val]) => ({
      key, placement: val.placement, avgPkg: val.avgPkg, maxPkg: val.maxPkg,
    })),
  }));

  res.json({ success: true, count: slim.length, colleges: slim });
});

// GET /api/colleges/:id — single college with full data
router.get('/:id', (req, res) => {
  const college = COLLEGE_DB.find(c => c.id === parseInt(req.params.id));
  if (!college) return res.status(404).json({ success: false, message: 'College not found.' });
  res.json({ success: true, college });
});

module.exports = router;
