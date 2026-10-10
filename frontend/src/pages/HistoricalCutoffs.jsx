import React, { useState } from 'react';
import api from '../utils/api';

const CATEGORIES = [
  ['GOPENS', 'Open — State level (GOPENS)'],
  ['GSCS', 'SC — State level (GSCS)'],
  ['GSTS', 'ST — State level (GSTS)'],
  ['GVJS', 'VJ/DT — State level (GVJS)'],
  ['GNT1S', 'NT-B — State level (GNT1S)'],
  ['GNT2S', 'NT-C — State level (GNT2S)'],
  ['GNT3S', 'NT-D — State level (GNT3S)'],
  ['GOBCS', 'OBC — State level (GOBCS)'],
  ['GEWS', 'EWS — State level (GEWS)'],
];

export default function HistoricalCutoffs() {
  const [percentile, setPercentile] = useState('95');
  const [categoryCode, setCategoryCode] = useState('GOPENS');
  const [stage, setStage] = useState('');
  const [search, setSearch] = useState('');
  const [records, setRecords] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const compare = async (event) => {
    event.preventDefault();
    const value = Number(percentile);
    if (!Number.isFinite(value) || value < 0 || value > 100) {
      setError('Enter a percentile between 0 and 100.');
      return;
    }
    setLoading(true);
    setError('');
    setRecords([]);
    setMeta(null);
    try {
      const { data } = await api.get('/cutoffs/compare', {
        params: { percentile: value, categoryCode, ...(stage ? { stage } : {}), ...(search.trim() ? { search: search.trim() } : {}) },
      });
      if (!data.success) throw new Error(data.message || 'Could not load historical cutoffs.');
      setRecords(data.records || []);
      setMeta(data);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Unable to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = { width: '100%', padding: '12px 14px', borderRadius: 'var(--r3)', border: '1px solid var(--border2)', background: 'var(--bg2)', color: 'var(--text)', fontSize: 15 };
  const th = { textAlign: 'left', padding: '12px 14px', fontSize: 12, color: 'var(--text2)', background: 'var(--bg2)', borderBottom: '1px solid var(--border)', whiteSpace: 'nowrap' };
  const td = { padding: '14px', borderBottom: '1px solid var(--border)', fontSize: 14, verticalAlign: 'top' };

  return (
    <div className="page-wrapper">
      <div className="container" style={{ padding: '38px 24px 80px', maxWidth: 1180 }}>
        <div style={{ marginBottom: 28 }}>
          <div style={{ color: 'var(--accent2)', fontWeight: 700, fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 8 }}>Official historical data</div>
          <h1 style={{ fontSize: 'clamp(28px,4vw,40px)', fontWeight: 800, marginBottom: 10 }}>Historical Cutoff Checker</h1>
          <p style={{ color: 'var(--text2)', maxWidth: 760, lineHeight: 1.7 }}>Compare an MHT-CET percentile with the extracted 2025–26 Maharashtra engineering CAP cutoff dataset. Filter by exact seat-category code, CAP stage, and college/course. Only engineering Maharashtra-state percentile records are compared here; pharmacy merit scores and All India records must not be compared to an MHT-CET percentile.</p>
        </div>

        <div className="card" style={{ padding: 24, marginBottom: 24 }}>
          <form onSubmit={compare} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(190px,1fr))', gap: 16, alignItems: 'end' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="hc-percentile">Your MHT-CET percentile</label>
              <input id="hc-percentile" style={inputStyle} type="number" min="0" max="100" step="0.0001" value={percentile} onChange={e => setPercentile(e.target.value)} required placeholder="e.g. 95" />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="hc-category">Seat category code</label>
              <select id="hc-category" style={inputStyle} value={categoryCode} onChange={e => setCategoryCode(e.target.value)}>
                {CATEGORIES.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="hc-stage">CAP stage</label>
              <select id="hc-stage" style={inputStyle} value={stage} onChange={e => setStage(e.target.value)}>
                <option value="">All stages in dataset</option>
                <option value="I">Stage I</option>
                <option value="II">Stage II</option>
                <option value="III">Stage III</option>
                <option value="IV">Stage IV</option>
                <option value="V">Stage V</option>
                <option value="VI">Stage VI</option>
                <option value="VII">Stage VII</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="hc-search">College or course (optional)</label>
              <input id="hc-search" style={inputStyle} value={search} onChange={e => setSearch(e.target.value)} placeholder="e.g. Amravati" />
            </div>
            <button className="btn btn-grad" type="submit" disabled={loading} style={{ minHeight: 46 }}>{loading ? 'Checking…' : 'Compare historical cutoffs →'}</button>
          </form>
          {error && <p role="alert" style={{ color: 'var(--red)', marginTop: 16 }}>{error}</p>}
        </div>

        {meta && (
          <div>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 16 }}>
              <div className="card" style={{ padding: '14px 18px', flex: '1 1 160px' }}><div style={{ color: 'var(--text2)', fontSize: 12 }}>Matching records</div><div style={{ fontSize: 25, fontWeight: 800 }}>{meta.total}</div></div>
              <div className="card" style={{ padding: '14px 18px', flex: '1 1 160px' }}><div style={{ color: 'var(--text2)', fontSize: 12 }}>Dataset</div><div style={{ fontSize: 16, fontWeight: 700 }}>{meta.academicYear} · {meta.round}</div></div>
              <div className="card" style={{ padding: '14px 18px', flex: '1 1 160px' }}><div style={{ color: 'var(--text2)', fontSize: 12 }}>Comparison metric</div><div style={{ fontSize: 16, fontWeight: 700 }}>{meta.metric}</div></div>
            </div>
            {records.length === 0 ? <div className="card" style={{ padding: 24, color: 'var(--text2)' }}>No matching records found. Try a different college name or category code.</div> : (
              <div className="card" style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 700 }}>
                  <thead><tr>{['College / course', 'Seat category', 'Historical cutoff', 'Your difference', 'Historical comparison'].map(label => <th key={label} style={th}>{label}</th>)}</tr></thead>
                  <tbody>{records.map((record, index) => {
                    const atOrAbove = Number(record.percentileDifference) >= 0;
                    return <tr key={record.choiceCode || index}>
                      <td style={td}><div style={{ fontWeight: 700 }}>{record.college}</div><div style={{ color: 'var(--text2)', marginTop: 4 }}>{record.course}</div><div style={{ color: 'var(--text3)', fontSize: 11, marginTop: 4 }}>Choice code: {record.choiceCode}</div></td>
                      <td style={td}>{record.categoryCode}</td>
                      <td style={td}><strong>{Number(record.bracketValue).toFixed(4)}</strong><div style={{ color: 'var(--text3)', fontSize: 11 }}>Percentile</div></td>
                      <td style={{ ...td, color: atOrAbove ? 'var(--green)' : 'var(--orange)', fontWeight: 800 }}>{atOrAbove ? '+' : ''}{Number(record.percentileDifference).toFixed(4)}</td>
                      <td style={td}><span style={{ color: atOrAbove ? 'var(--green)' : 'var(--orange)', fontWeight: 700 }}>{atOrAbove ? 'At or above historical cutoff' : 'Below historical cutoff'}</span></td>
                    </tr>;
                  })}</tbody>
                </table>
              </div>
            )}
            <p style={{ color: 'var(--text3)', fontSize: 12, marginTop: 14, lineHeight: 1.7 }}>Historical reference only — not an admission prediction or guarantee. Results use the exact seat-category code selected and the available 2025–26 source records; they do not infer candidate eligibility, gender-specific seats, home-university quota, or current-year rules. This page currently compares Maharashtra engineering percentile records only. Check the official CAP rules and source documents before making choices.</p>
          </div>
        )}
      </div>
    </div>
  );
}
