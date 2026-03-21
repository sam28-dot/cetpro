/**
 * SharedResult.jsx — Public view of a shared prediction (no auth required)
 */

import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { predictionAPI } from '../utils/api';
import CollegeCard from '../components/predictor/CollegeCard';

const SECTIONS = [
  { key: 'safe', label: '✅ Safe Colleges' },
  { key: 'moderate', label: '🎯 Moderate Colleges' },
  { key: 'dream', label: '⭐ Dream Colleges' },
];

export default function SharedResult() {
  const { token } = useParams();
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    predictionAPI.getShared(token)
      .then(({ data }) => setPrediction(data.prediction))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg)', padding: '80px 24px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div className="skeleton" style={{ height: 40, width: 300, marginBottom: 20 }} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 16 }}>
            {[...Array(4)].map((_, i) => <div key={i} className="skeleton" style={{ height: 260 }} />)}
          </div>
        </div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>🔒</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 800, marginBottom: 8 }}>Results Not Found</h1>
          <p style={{ color: 'var(--text2)', marginBottom: 24 }}>This link is invalid, expired, or the owner made it private.</p>
          <Link to="/" className="btn btn-grad">Go to Home</Link>
        </div>
      </div>
    );
  }

  const { input, results, totalMatches } = prediction;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', paddingTop: 24 }}>
      {/* Shared banner */}
      <div style={{ background: 'var(--grad1)', padding: '12px 24px', textAlign: 'center' }}>
        <span style={{ color: '#fff', fontSize: 14, fontWeight: 600 }}>
          🔗 Shared Prediction Results — Try <a href="/signup" style={{ color: 'rgba(255,255,255,0.85)', fontWeight: 800, textDecoration: 'underline' }}>CET Predictor Pro free →</a>
        </span>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px 60px' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(22px,3vw,34px)', fontWeight: 800, letterSpacing: '-0.5px', marginBottom: 8 }}>
            Shared College Predictions
          </h1>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 24, fontSize: 14, color: 'var(--text2)' }}>
            <span>Percentile: <strong style={{ color: 'var(--accent2)' }}>{input.percentile}</strong></span>
            <span>Category: <strong>{input.category}</strong></span>
            <span>Total Matches: <strong style={{ color: 'var(--accent2)' }}>{totalMatches}</strong></span>
          </div>

          {SECTIONS.map(sec => {
            const items = results[sec.key] || [];
            if (!items.length) return null;
            return (
              <div key={sec.key} style={{ marginBottom: 36 }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 800, marginBottom: 14 }}>{sec.label}</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 14 }}>
                  {items.map((r, i) => <CollegeCard key={`${r.collegeId}-${r.branch}`} result={r} index={i} delay={i * 0.03} />)}
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}
