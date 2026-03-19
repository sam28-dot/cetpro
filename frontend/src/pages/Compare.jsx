/**
 * Compare.jsx — Side-by-side college comparison table
 * Reads compare list from localStorage (set by Results page).
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const METRICS = [
  { label:'Branch',        fn: r => r.branch },
  { label:'Location',      fn: r => r.location?.charAt(0).toUpperCase() + r.location?.slice(1) },
  { label:'Tier',          fn: r => `Tier ${r.tier}` },
  { label:'Autonomous',    fn: r => r.autonomous ? '✅ Yes' : '❌ No' },
  { label:'Type',          fn: r => r.type?.charAt(0).toUpperCase() + r.type?.slice(1) },
  { label:'Annual Fees',   fn: r => `₹${(r.fees/1000).toFixed(0)}K`, numFn: r => r.fees, compare:'min' },
  { label:'Cutoff',        fn: r => r.cutoffPercentile?.toFixed(1), numFn: r => r.cutoffPercentile, compare:'min' },
  { label:'Placement %',   fn: r => `${r.placementRate}%`, numFn: r => r.placementRate, compare:'max' },
  { label:'Avg Package',   fn: r => `₹${r.avgPackage}L`, numFn: r => r.avgPackage, compare:'max' },
  { label:'Max Package',   fn: r => `₹${r.maxPackage}L`, numFn: r => r.maxPackage, compare:'max' },
  { label:'NIRF Rank',     fn: r => r.nirf > 0 ? `#${r.nirf}` : 'Unranked', numFn: r => r.nirf > 0 ? r.nirf : 9999, compare:'min' },
  { label:'Score',         fn: r => `${r.score}/100`, numFn: r => r.score, compare:'max' },
];

export default function Compare() {
  const [colleges, setColleges] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('cetpro_compare');
    if (saved) {
      try { setColleges(JSON.parse(saved)); } catch {}
    }
  }, []);

  const removeCollege = (idx) => {
    const updated = colleges.filter((_, i) => i !== idx);
    setColleges(updated);
    localStorage.setItem('cetpro_compare', JSON.stringify(updated));
  };

  if (colleges.length === 0) {
    return (
      <div className="page-wrapper">
        <div className="container" style={{ padding:'60px 24px' }}>
          <div className="empty-state">
            <div className="empty-icon">⚖️</div>
            <div className="empty-title">No colleges selected</div>
            <div className="empty-sub">
              Go to your results page and click <strong>⊕ Compare</strong> on any college card to add it here.
            </div>
            <Link to="/predictor" className="btn btn-grad" style={{ display:'inline-flex',marginTop:12 }}>
              Start a Prediction →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="container" style={{ padding:'32px 24px 80px' }}>
        <div style={{ marginBottom:28 }}>
          <h1 style={{ fontFamily:'var(--font-display)',fontSize:'clamp(22px,3vw,34px)',fontWeight:800,letterSpacing:'-0.5px',marginBottom:6 }}>
            Compare Colleges
          </h1>
          <p style={{ color:'var(--text2)',fontSize:15 }}>
            Comparing {colleges.length} college{colleges.length>1?'s':''} · Green = best value for each metric
          </p>
        </div>

        <div style={{ overflowX:'auto' }}>
          <motion.table
            style={s.table}
            initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{duration:0.35}}
          >
            {/* Header */}
            <thead>
              <tr>
                <th style={s.thLabel}>Metric</th>
                {colleges.map((c, i) => (
                  <th key={i} style={s.thCol}>
                    <div style={{ fontFamily:'var(--font-display)',fontWeight:800,fontSize:14,lineHeight:1.3,marginBottom:4 }}>
                      {c.shortName || c.collegeName}
                    </div>
                    <div style={{ fontSize:11,color:'var(--text3)',fontWeight:500 }}>{c.branch}</div>
                    <button style={s.removeBtn} onClick={() => removeCollege(i)} title="Remove">✕</button>
                  </th>
                ))}
              </tr>
            </thead>

            {/* Category row */}
            <tbody>
              <tr>
                <td style={s.tdLabel}>Admission Chance</td>
                {colleges.map((c, i) => (
                  <td key={i} style={s.td}>
                    <span className={`badge badge-${c.category}`}>{c.category?.toUpperCase()}</span>
                  </td>
                ))}
              </tr>

              {METRICS.map(metric => {
                // Find best value index
                let bestIdx = -1;
                if (metric.numFn) {
                  const nums = colleges.map(metric.numFn);
                  bestIdx = metric.compare === 'max'
                    ? nums.indexOf(Math.max(...nums))
                    : nums.indexOf(Math.min(...nums.filter(n => n > 0 && n < 9999)));
                }

                return (
                  <tr key={metric.label}>
                    <td style={s.tdLabel}>{metric.label}</td>
                    {colleges.map((c, i) => (
                      <td key={i} style={{ ...s.td, ...(i === bestIdx ? s.tdBest : {}) }}>
                        {metric.fn(c)}
                        {i === bestIdx && <span style={s.bestIcon}>↑</span>}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </motion.table>
        </div>

        <p style={{ fontSize:12,color:'var(--text3)',marginTop:16 }}>
          🟢 Green highlighted values indicate the best performing college for that metric.
          Score is a composite of placement, package, NIRF rank, fees-to-value and stability.
        </p>
      </div>
    </div>
  );
}

const s = {
  table: { width:'100%', borderCollapse:'separate', borderSpacing:0, background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'var(--r)', overflow:'hidden', minWidth:600 },
  thLabel: { padding:'16px 20px', textAlign:'left', fontSize:12, fontWeight:700, color:'var(--text3)', textTransform:'uppercase', letterSpacing:'0.08em', background:'var(--bg2)', minWidth:140, borderBottom:'1px solid var(--border)' },
  thCol: { padding:'16px 20px', textAlign:'center', fontSize:14, background:'var(--surface)', borderBottom:'1px solid var(--border)', borderLeft:'1px solid var(--border)', minWidth:180, position:'relative', verticalAlign:'top' },
  tdLabel: { padding:'13px 20px', fontSize:13, fontWeight:600, color:'var(--text3)', background:'var(--bg2)', borderBottom:'1px solid var(--border)' },
  td: { padding:'13px 20px', fontSize:14, textAlign:'center', borderBottom:'1px solid var(--border)', borderLeft:'1px solid var(--border)' },
  tdBest: { background:'rgba(34,211,160,0.08)', color:'var(--green)', fontWeight:700 },
  bestIcon: { marginLeft:4, fontSize:10, fontWeight:800 },
  removeBtn: { position:'absolute', top:8, right:8, fontSize:12, color:'var(--text3)', background:'none', border:'none', cursor:'pointer', padding:'2px 6px', borderRadius:4, fontFamily:'var(--font-body)' },
};
