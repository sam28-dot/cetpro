'use strict';

const express = require('express');
const router = express.Router();
const cutoffDataset = require('../data/official-cutoffs-2025-26.json');

const SOURCE_URL = 'https://fe2025.mahacet.org/StaticPages/frmInstituteList';
const CACHE_MS = 12 * 60 * 60 * 1000;
let cache = { at: 0, institutes: null };

function decodeHtml(value) {
  return String(value || '')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;|&#160;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/\s+/g, ' ')
    .trim();
}

function cutoffCollegeCodes() {
  return new Set((cutoffDataset.records || []).map((record) => String(record.collegeCode || '').trim()).filter(Boolean));
}

function parseInstituteRows(html) {
  const rows = [];
  const rowRegex = /<tr\b[^>]*>([\s\S]*?)<\/tr>/gi;
  let rowMatch;
  const codesWithCutoffs = cutoffCollegeCodes();

  while ((rowMatch = rowRegex.exec(html)) !== null) {
    const cells = [];
    const cellRegex = /<t[dh]\b[^>]*>([\s\S]*?)<\/t[dh]>/gi;
    let cellMatch;
    while ((cellMatch = cellRegex.exec(rowMatch[1])) !== null) cells.push(decodeHtml(cellMatch[1]));
    if (cells.length < 4) continue;

    const codeIndex = cells.findIndex((cell) => /^\d{5}$/.test(cell));
    if (codeIndex < 0 || !cells[codeIndex + 1]) continue;
    const code = cells[codeIndex];
    const name = cells[codeIndex + 1];
    const status = cells[codeIndex + 2] || 'Not specified';
    const intakeText = cells[codeIndex + 3] || '';
    const intakeMatch = intakeText.replace(/,/g, '').match(/\d+/);
    if (!name || /^institute name$/i.test(name)) continue;

    rows.push({
      instituteCode: code,
      name,
      status,
      totalIntake: intakeMatch ? Number(intakeMatch[0]) : null,
      hasHistoricalCutoff: codesWithCutoffs.has(code),
      source: SOURCE_URL,
    });
  }

  const unique = new Map();
  rows.forEach((row) => unique.set(row.instituteCode, row));
  return [...unique.values()].sort((a, b) => a.name.localeCompare(b.name));
}

router.get('/', async (req, res) => {
  if (cache.institutes && Date.now() - cache.at < CACHE_MS) {
    return res.json({ success: true, source: SOURCE_URL, academicYear: '2025-26', cached: true, total: cache.institutes.length, institutes: cache.institutes });
  }

  try {
    const response = await fetch(SOURCE_URL, {
      headers: { 'User-Agent': 'MHT-CET-Predictor-Pro/1.0 (official institute directory)' },
      signal: AbortSignal.timeout(12000),
    });
    if (!response.ok) throw new Error('Official CET Cell directory returned HTTP ' + response.status);
    const html = await response.text();
    const institutes = parseInstituteRows(html);
    if (!institutes.length) throw new Error('Could not parse the official institute directory');
    cache = { at: Date.now(), institutes };
    return res.json({ success: true, source: SOURCE_URL, academicYear: '2025-26', cached: false, total: institutes.length, institutes });
  } catch (error) {
    console.error('[Institutes] Official directory fetch failed:', error.message);
    const fallbackMap = new Map();
    (cutoffDataset.records || []).forEach((record) => {
      const instituteCode = String(record.collegeCode || '').trim();
      const name = String(record.college || '').trim();
      if (!instituteCode || !name) return;
      if (!fallbackMap.has(instituteCode)) {
        fallbackMap.set(instituteCode, {
          instituteCode,
          name,
          status: 'Status unavailable — fallback from imported cutoff records',
          totalIntake: null,
          hasHistoricalCutoff: true,
          source: SOURCE_URL,
        });
      }
    });
    const fallbackInstitutes = [...fallbackMap.values()].sort((a, b) => a.name.localeCompare(b.name));
    if (fallbackInstitutes.length) {
      cache = { at: Date.now(), institutes: fallbackInstitutes };
      return res.json({
        success: true,
        source: SOURCE_URL,
        sourceMode: 'cutoff-record-fallback',
        warning: 'The official institute list could not be reached. This fallback includes only institutes found in imported cutoff records, not every Maharashtra institute.',
        academicYear: '2025-26',
        cached: false,
        total: fallbackInstitutes.length,
        institutes: fallbackInstitutes,
      });
    }
    return res.status(502).json({
      success: false,
      message: 'The official Maharashtra CET Cell institute directory could not be loaded and no fallback records are available. Please retry or open the official source.',
      source: SOURCE_URL,
    });
  }
});

module.exports = router;
