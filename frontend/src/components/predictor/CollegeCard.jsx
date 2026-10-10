/**
 * CollegeCard.jsx — Reusable college result card
 * Used in Results page and PredictionDetail page.
 */

import React from 'react';
import { motion } from 'framer-motion';

const BRANCH_LABELS = {
  CSE: 'Computer Science (CSE)', IT: 'Information Technology', AIML: 'AI / ML',
  DS: 'Data Science', EXTC: 'Electronics & TC', MECH: 'Mechanical',
  CIVIL: 'Civil', ETRX: 'Electronics', IOT: 'Internet of Things',
  BPHARM: 'B.Pharm', PHARMD: 'Pharm.D', MPHARM: 'M.Pharm', DPHARM: 'D.Pharm',
  any: 'Any Branch',
};
const LOC_LABELS = { mumbai: 'Mumbai', pune: 'Pune', thane: 'Thane / Navi Mumbai', nagpur: 'Nagpur', nashik: 'Nashik', aurangabad: 'Aurangabad', kolhapur: 'Kolhapur', solapur: 'Solapur' };

export default function CollegeCard({ result, index, onCompare, isCompared, onSave, isSaved, delay = 0 }) {
  const { collegeName, branch, stream, location, tier, fees, cutoffPercentile,
    placementRate, avgPackage, maxPackage, autonomous, type, nirf, gap, score, category,
    officialCategoryCode, academicYear, cutoffRound, cutoffSourceUrl } = result;

  const catColor = { safe: 'var(--green)', moderate: 'var(--yellow)', dream: 'var(--red)' }[category];
  const isPharmacy = ['BPHARM', 'PHARMD', 'MPHARM', 'DPHARM'].includes(branch);
  const streamIcon = isPharmacy ? '💊' : '⚙️';

  return (
    <motion.div
      className="card"
      style={{ ...s.card, borderTopColor: catColor }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
      whileHover={{ y: -4, boxShadow: 'var(--shadow)', borderColor: 'var(--border2)' }}
    >
      {/* Top bar */}
      <div style={s.top}>
        {tier != null && <span className={`badge badge-tier${tier}`}>Tier {tier}</span>}
        {score > 0 && <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text3)' }}>Score</span>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 800, color: 'var(--accent2)' }}>{score}</span>
        </span>}
      </div>

      {/* Name */}
      <div style={s.name}>{collegeName}</div>
      <div style={s.branch}>{streamIcon} {BRANCH_LABELS[branch] || branch}</div>
      <div style={s.loc}>
        {location ? `📍 ${LOC_LABELS[location] || location}` : 'Location not verified'}
        {autonomous && <span style={s.autoBadge}>Autonomous</span>}
        {type && <span style={s.typeBadge}>{type}</span>}
      </div>

      {/* Stats grid */}
      <div style={s.statsGrid}>
        <Stat label="Cutoff" val={cutoffPercentile?.toFixed(1)} color="var(--accent3)" />
        <Stat label="Fees/yr" val={fees != null ? `₹${(fees / 1000).toFixed(0)}K` : '—'} />
        <Stat label="Placement" val={placementRate != null ? `${placementRate}%` : '—'} color={placementRate >= 85 ? 'var(--green)' : 'var(--yellow)'} />
        <Stat label="Avg Pkg" val={avgPackage != null ? `₹${avgPackage}L` : '—'} color="var(--green)" />
        <Stat label="Max Pkg" val={maxPackage != null ? `₹${maxPackage}L` : '—'} />
        <Stat label="Your Gap" val={`${gap >= 0 ? '+' : ''}${gap?.toFixed(1)}`} color={gap >= 0 ? 'var(--green)' : 'var(--yellow)'} />
      </div>

      {placementRate != null && (
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 11, color: 'var(--text3)', marginBottom: 5, fontWeight: 500 }}>Placement Rate</div>
          <div style={s.barWrap}>
            <motion.div style={{ ...s.barFill, background: 'var(--grad2)' }} initial={{ width: 0 }}
              animate={{ width: `${placementRate}%` }} transition={{ duration: 1, delay: delay + 0.3 }} />
          </div>
        </div>
      )}
      {officialCategoryCode && <div style={{ color: 'var(--text3)', fontSize: 11, marginBottom: 12 }}>
        Official category: {officialCategoryCode} · {academicYear} {cutoffRound}
        {cutoffSourceUrl && <> · <a href={cutoffSourceUrl} target="_blank" rel="noreferrer">Source</a></>}
      </div>}

      {/* Footer actions */}
      <div style={s.footer}>
        {nirf > 0 && <span style={s.nirf}>NIRF #{nirf}</span>}
        <div style={{ flex: 1 }} />
        {onSave && (
          <button
            className={`btn btn-sm ${isSaved ? 'btn-primary' : 'btn-ghost'}`}
            style={{ padding: '6px 12px' }}
            onClick={() => onSave(result)}
            title={isSaved ? 'Saved' : 'Save'}
          >
            {isSaved ? '🔖 Saved' : '🔒 Save'}
          </button>
        )}
        {onCompare && (
          <button
            className={`btn btn-sm ${isCompared ? 'btn-primary' : 'btn-ghost'}`}
            style={{ padding: '6px 12px' }}
            onClick={() => onCompare(result)}
            title={isCompared ? 'Remove from compare' : 'Add to compare'}
          >
            {isCompared ? '✓ Comparing' : '⊕ Compare'}
          </button>
        )}
      </div>
    </motion.div>
  );
}

const Stat = ({ label, val, color }) => (
  <div>
    <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 2 }}>{label}</div>
    <div style={{ fontSize: 15, fontWeight: 700, color: color || 'var(--text)' }}>{val}</div>
  </div>
);

const s = {
  card: { padding: 22, borderTop: '3px solid transparent', transition: 'all 0.2s', cursor: 'default' },
  top: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  name: { fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 800, lineHeight: 1.3, marginBottom: 4 },
  branch: { fontSize: 13, color: 'var(--accent2)', fontWeight: 600, marginBottom: 4 },
  loc: { fontSize: 12, color: 'var(--text3)', marginBottom: 14, display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 6 },
  autoBadge: { padding: '2px 8px', borderRadius: 99, background: 'rgba(34,211,160,0.1)', color: 'var(--green)', fontSize: 11, fontWeight: 700, border: '1px solid rgba(34,211,160,0.2)' },
  typeBadge: { padding: '2px 8px', borderRadius: 99, background: 'var(--surface2)', color: 'var(--text3)', fontSize: 11, fontWeight: 600 },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 14 },
  barWrap: { height: 4, background: 'var(--surface2)', borderRadius: 99, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 99 },
  footer: { display: 'flex', alignItems: 'center', gap: 8, paddingTop: 12, borderTop: '1px solid var(--border)' },
  nirf: { fontSize: 11, fontWeight: 700, color: 'var(--text3)', padding: '3px 8px', background: 'var(--surface2)', borderRadius: 6 },
};
