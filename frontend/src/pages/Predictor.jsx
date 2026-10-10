/**
 * Predictor.jsx — College prediction input form
 * Supports both Engineering and Pharmacy streams.
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { predictionAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const ENGINEERING_BRANCHES = ['CSE','IT','AIML','DS','EXTC','MECH','CIVIL','ETRX','IOT','any'];
const PHARMACY_BRANCHES    = ['BPHARM','PHARMD','any'];

const BRANCH_LABELS = {
  CSE:'Computer Science (CSE)', IT:'Information Technology', AIML:'AI / ML',
  DS:'Data Science', EXTC:'Electronics & TC', MECH:'Mechanical',
  CIVIL:'Civil', ETRX:'Electronics', IOT:'Internet of Things',
  BPHARM:'B.Pharm', PHARMD:'Pharm.D',
  any:'Any Branch',
};

const CATEGORIES = ['OPEN','OBC','SC','ST','VJ-DT','NT-B','NT-C','NT-D','SBC','EWS'];
const UNIVERSITIES = [
  { value:'mumbai',     label:'Mumbai University' },
  { value:'pune',       label:'Savitribai Phule Pune University' },
  { value:'nagpur',     label:'RTM Nagpur University' },
  { value:'aurangabad', label:'Dr. Babasaheb Ambedkar Marathwada University' },
  { value:'kolhapur',   label:'Shivaji University, Kolhapur' },
  { value:'amravati',   label:'Sant Gadge Baba Amravati University' },
  { value:'other',      label:'Other' },
];

const marksToPercentile = (phy, chem, math) => {
  const total = (parseFloat(phy)||0) + (parseFloat(chem)||0) + (parseFloat(math)||0);
  if (!total) return 0;
  const norm = total / 200;
  return Math.round(Math.min(99.99, Math.max(0, Math.pow(norm, 0.65) * 100 - 1.5)) * 100) / 100;
};

const STEPS = [
  { id:'score',   label:'Your Score',   icon:'🎓' },
  { id:'profile', label:'Your Profile', icon:'👤' },
  { id:'prefs',   label:'Preferences',  icon:'⚙️' },
];

export default function Predictor() {
  const { user }   = useAuth();
  const navigate   = useNavigate();
  const [step, setStep]     = useState(0);
  const [loading, setLoading] = useState(false);

  const [scoreMode, setScoreMode] = useState('percentile');
  const [percentile, setPercentile] = useState('');
  const [marks, setMarks] = useState({ phy:'', chem:'', math:'' });
  const [estPct, setEstPct] = useState(null);

  const [stream, setStream] = useState('engineering');

  const [category, setCategory]     = useState(user?.category || 'OPEN');
  const [gender, setGender]         = useState('any');
  const [university, setUniversity] = useState(user?.homeUniversity || 'mumbai');

  const BRANCHES = stream === 'pharmacy' ? PHARMACY_BRANCHES : ENGINEERING_BRANCHES;
  const [branches, setBranches]       = useState(user?.preferredBranches?.length ? user.preferredBranches : ['CSE']);
  const [location, setLocation]       = useState('any');
  const [collegeType, setCollegeType] = useState('any');
  const [maxFees, setMaxFees]         = useState(200000);

  const [errors, setErrors] = useState({});

  const handleMarksChange = (field, val) => {
    const updated = { ...marks, [field]: val };
    setMarks(updated);
    const pct = marksToPercentile(updated.phy, updated.chem, updated.math);
    setEstPct(pct || null);
  };

  const toggleBranch = (b) => {
    if (b === 'any') { setBranches(['any']); return; }
    setBranches(prev => {
      const next = prev.filter(x => x !== 'any');
      return next.includes(b)
        ? (next.filter(x => x !== b).length ? next.filter(x => x !== b) : ['any'])
        : [...next, b];
    });
  };

  const validateStep = () => {
    const e = {};
    if (step === 0) {
      const p = scoreMode === 'percentile' ? parseFloat(percentile) : estPct;
      if (!p || isNaN(p) || p < 0 || p > 100) e.percentile = 'Enter a valid percentile between 0 and 100';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => { if (validateStep()) setStep(s => Math.min(s + 1, STEPS.length - 1)); };
  const back = () => setStep(s => Math.max(s - 1, 0));

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const finalPercentile = scoreMode === 'percentile' ? parseFloat(percentile) : estPct;
      const { data } = await predictionAPI.create({
        percentile: finalPercentile,
        category,
        gender,
        homeUniversity: university,
        preferredBranches: branches,
        location,
        collegeType,
        maxFees,
        stream,
      });
      toast.success('Prediction complete! 🎉');
      navigate(`/results/${data.prediction._id}`);
    } catch (err) {
      const msg = err.response?.data?.message || 'Prediction failed. Please try again.';
      toast.error(msg);
      if (err.response?.data?.errors) {
        setErrors({ api: err.response.data.errors.map(e => e.message).join(', ') });
      }
    } finally {
      setLoading(false);
    }
  };

  const getEffectivePercentile = () =>
    scoreMode === 'percentile' ? parseFloat(percentile) || null : estPct;

  return (
    <div className="page-wrapper">
      <div className="container-sm" style={{ padding: '40px 24px 80px' }}>

        <div style={{ textAlign:'center', marginBottom: 36 }}>
          <h1 style={{ fontFamily:'var(--font-display)', fontSize:'clamp(26px,4vw,38px)', fontWeight:800, letterSpacing:'-0.5px', marginBottom: 8 }}>
            Find Your College
          </h1>
          <p style={{ color:'var(--text2)', fontSize:16 }}>
            Fill in the details — the more accurate, the better your predictions.
          </p>
        </div>

        <div style={s.stepRow}>
          {STEPS.map((st, i) => (
            <div key={st.id} style={{ display:'flex', alignItems:'center', gap: 8 }}>
              <div style={{ ...s.stepDot, ...(i === step ? s.stepDotActive : i < step ? s.stepDotDone : {}) }}>
                {i < step ? '✓' : i + 1}
              </div>
              <span style={{ fontSize:13, fontWeight:600, color: i === step ? 'var(--text)' : 'var(--text3)' }}>
                {st.label}
              </span>
              {i < STEPS.length - 1 && <div style={s.stepLine} />}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            className="card"
            style={{ padding: 32 }}
            initial={{ opacity:0, x: 20 }}
            animate={{ opacity:1, x: 0 }}
            exit={{ opacity:0, x: -20 }}
            transition={{ duration: 0.25 }}
          >
            {step === 0 && (
              <div>
                <SectionTitle icon="🎓" title="Your MHT-CET Score" />

                <div style={{ marginBottom: 20 }}>
                  <label className="form-label" style={{ marginBottom: 10, display: 'block' }}>Select Your Stream</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    {[
                      { val: 'engineering', icon: '⚙️', label: 'Engineering', sub: 'CSE, IT, AIML, MECH, EXTC…' },
                      { val: 'pharmacy',    icon: '💊', label: 'Pharmacy',    sub: 'B.Pharm, Pharm.D, M.Pharm…' },
                    ].map(opt => (
                      <button key={opt.val} type="button"
                        onClick={() => { setStream(opt.val); setBranches([opt.val === 'pharmacy' ? 'BPHARM' : 'CSE']); }}
                        style={{
                          padding: '14px 16px', borderRadius: 'var(--r2)', textAlign: 'left', cursor: 'pointer',
                          border: `2px solid ${stream === opt.val ? 'var(--accent)' : 'var(--border)'}`,
                          background: stream === opt.val ? 'rgba(108,99,255,0.1)' : 'var(--bg2)',
                          fontFamily: 'var(--font-body)', transition: 'all 0.2s',
                        }}>
                        <div style={{ fontSize: 22, marginBottom: 6 }}>{opt.icon}</div>
                        <div style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 800, color: stream === opt.val ? 'var(--accent2)' : 'var(--text)' }}>{opt.label}</div>
                        <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 2 }}>{opt.sub}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div style={s.toggle}>
                  {['percentile','marks'].map(m => (
                    <button key={m} style={{ ...s.toggleBtn, ...(scoreMode===m ? s.toggleActive : {}) }}
                      onClick={() => setScoreMode(m)}>
                      {m === 'percentile' ? 'Percentile' : 'PCM Marks'}
                    </button>
                  ))}
                </div>

                {scoreMode === 'percentile' && (
                  <div className="form-group">
                    <label className="form-label">MHT-CET Percentile (0 – 100)</label>
                    <input type="number" className={`form-input ${errors.percentile?'error':''}`}
                      placeholder="e.g. 94.50" value={percentile} min="0" max="100" step="0.01"
                      onChange={e => { setPercentile(e.target.value); setErrors({}); }}
                      style={{ fontSize:22, fontWeight:700, letterSpacing:'-0.5px' }}
                    />
                    {errors.percentile && <span className="form-error">{errors.percentile}</span>}
                  </div>
                )}

                {scoreMode === 'marks' && (
                  <div>
                    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:12 }}>
                      <div className="form-group">
                        <label className="form-label">Physics (out of 50)</label>
                        <input type="number" className="form-input" placeholder="e.g. 42" value={marks.phy} min="0" max="50"
                          onChange={e => handleMarksChange('phy', e.target.value)} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Chemistry (out of 50)</label>
                        <input type="number" className="form-input" placeholder="e.g. 38" value={marks.chem} min="0" max="50"
                          onChange={e => handleMarksChange('chem', e.target.value)} />
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Mathematics (out of 100)</label>
                      <input type="number" className="form-input" placeholder="e.g. 78" value={marks.math} min="0" max="100"
                        onChange={e => handleMarksChange('math', e.target.value)} />
                    </div>
                    {estPct && (
                      <div style={s.estBadge}>
                        ✨ Estimated Percentile: <strong>~{estPct}</strong>
                        <span style={{ color:'var(--text3)', marginLeft:6, fontSize:12 }}>(using historical distribution model)</span>
                      </div>
                    )}
                    {errors.percentile && <span className="form-error">{errors.percentile}</span>}
                  </div>
                )}
              </div>
            )}

            {step === 1 && (
              <div>
                <SectionTitle icon="👤" title="Your Profile" />
                <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
                    <div className="form-group">
                      <label className="form-label">Category</label>
                      <select className="form-select" value={category} onChange={e => setCategory(e.target.value)}>
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Gender (optional)</label>
                      <select className="form-select" value={gender} onChange={e => setGender(e.target.value)}>
                        <option value="any">Any</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Home University (affects quota)</label>
                    <select className="form-select" value={university} onChange={e => setUniversity(e.target.value)}>
                      {UNIVERSITIES.map(u => <option key={u.value} value={u.value}>{u.label}</option>)}
                    </select>
                  </div>
                  <div style={s.infoBox}>
                    <span style={{ fontWeight:700 }}>Category:</span> Reserved category students receive a percentile adjustment. SC +18, ST +25, OBC +8, and so on.
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <SectionTitle icon="⚙️" title="Branch & Location Preferences" />
                <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
                  <div>
                    <label className="form-label" style={{ marginBottom:10, display:'block' }}>Preferred Branches (select one or more)</label>
                    <div style={s.chipGroup}>
                      {BRANCHES.map(b => (
                        <button key={b} style={{ ...s.chip, ...(branches.includes(b) ? s.chipActive : {}) }}
                          onClick={() => toggleBranch(b)}>
                          {BRANCH_LABELS[b] || b}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
                    <div className="form-group">
                      <label className="form-label">Preferred Location</label>
                      <select className="form-select" value={location} onChange={e => setLocation(e.target.value)}>
                        <option value="any">Anywhere in Maharashtra</option>
                        <option value="mumbai">Mumbai</option>
                        <option value="pune">Pune</option>
                        <option value="thane">Thane / Navi Mumbai</option>
                        <option value="nagpur">Nagpur</option>
                        <option value="nashik">Nashik</option>
                        <option value="aurangabad">Aurangabad</option>
                        <option value="kolhapur">Kolhapur</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">College Type</label>
                      <select className="form-select" value={collegeType} onChange={e => setCollegeType(e.target.value)}>
                        <option value="any">Any</option>
                        <option value="autonomous">Autonomous</option>
                        <option value="non-autonomous">Non-Autonomous</option>
                        <option value="govt">Government</option>
                        <option value="aided">Aided</option>
                        <option value="unaided">Unaided Private</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Max Annual Fees: ₹{maxFees.toLocaleString('en-IN')}</label>
                    <input type="range" min={10000} max={300000} step={5000} value={maxFees}
                      onChange={e => setMaxFees(parseInt(e.target.value))}
                      style={{ width:'100%', accentColor:'var(--accent)' }} />
                    <div style={{ display:'flex', justifyContent:'space-between', fontSize:12, color:'var(--text3)', marginTop:4 }}>
                      <span>₹10K</span><span>₹3L</span>
                    </div>
                  </div>

                  <div style={s.summaryBox}>
                    <div style={{ fontWeight:700, marginBottom:12, fontFamily:'var(--font-display)' }}>📋 Prediction Summary</div>
                    <div style={s.summaryGrid}>
                      <SumItem label="Stream"     val={stream === 'pharmacy' ? '💊 Pharmacy' : '⚙️ Engineering'} />
                      <SumItem label="Percentile" val={getEffectivePercentile() || '—'} />
                      <SumItem label="Category"   val={category} />
                      <SumItem label="Branches"   val={branches.join(', ')} />
                      <SumItem label="Location"   val={location === 'any' ? 'Anywhere' : location} />
                      <SumItem label="Max Fees"   val={`₹${(maxFees/1000).toFixed(0)}K`} />
                    </div>
                  </div>

                  {errors.api && (
                    <div style={{ color:'var(--red)', fontSize:13, padding:'8px 12px', background:'rgba(248,113,113,0.08)', borderRadius:'var(--r3)' }}>
                      {errors.api}
                    </div>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div style={{ display:'flex', justifyContent:'space-between', marginTop: 20 }}>
          {step > 0
            ? <button className="btn btn-ghost" onClick={back}>← Back</button>
            : <span />}
          {step < STEPS.length - 1
            ? <button className="btn btn-primary" onClick={next}>Continue →</button>
            : (
              <button className="btn btn-grad" style={{ minWidth:180 }} onClick={handleSubmit} disabled={loading}>
                {loading ? <><Spinner /> Analysing...</> : '✨ Predict My Colleges'}
              </button>
            )
          }
        </div>

      </div>
    </div>
  );
}

const SectionTitle = ({ icon, title }) => (
  <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:20 }}>
    <span style={{ fontSize:20 }}>{icon}</span>
    <span style={{ fontFamily:'var(--font-display)', fontSize:18, fontWeight:800 }}>{title}</span>
    <div style={{ flex:1, height:1, background:'var(--border)', marginLeft:8 }} />
  </div>
);

const SumItem = ({ label, val }) => (
  <div>
    <div style={{ fontSize:11, fontWeight:700, color:'var(--text3)', textTransform:'uppercase', letterSpacing:'0.08em' }}>{label}</div>
    <div style={{ fontSize:15, fontWeight:700, marginTop:2, color:'var(--accent2)' }}>{String(val)}</div>
  </div>
);

const Spinner = () => (
  <span className="spin" style={{ width:18,height:18,border:'2px solid rgba(255,255,255,0.3)',borderTopColor:'#fff',borderRadius:'50%',display:'inline-block',flexShrink:0 }} />
);

const s = {
  stepRow:       { display:'flex', alignItems:'center', marginBottom:28, justifyContent:'center', flexWrap:'wrap', gap:8 },
  stepDot:       { width:28, height:28, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:700, background:'var(--surface2)', color:'var(--text3)', flexShrink:0 },
  stepDotActive: { background:'var(--grad1)', color:'#fff' },
  stepDotDone:   { background:'var(--green)', color:'#fff' },
  stepLine:      { width:32, height:1, background:'var(--border)' },
  toggle:        { display:'flex', background:'var(--bg2)', border:'1.5px solid var(--border)', borderRadius:'var(--r3)', padding:4, marginBottom:20 },
  toggleBtn:     { flex:1, padding:'8px', borderRadius:6, fontSize:13, fontWeight:600, color:'var(--text2)', transition:'all var(--t)', background:'none', border:'none', cursor:'pointer', fontFamily:'var(--font-body)' },
  toggleActive:  { background:'var(--accent)', color:'#fff' },
  estBadge:      { marginTop:12, padding:'10px 14px', background:'rgba(108,99,255,0.1)', border:'1px solid rgba(108,99,255,0.2)', borderRadius:'var(--r3)', fontSize:14, color:'var(--accent2)' },
  infoBox:       { padding:'12px 16px', background:'rgba(56,189,248,0.07)', border:'1px solid rgba(56,189,248,0.18)', borderRadius:'var(--r3)', fontSize:13, color:'var(--text2)', lineHeight:1.6 },
  chipGroup:     { display:'flex', flexWrap:'wrap', gap:8 },
  chip:          { padding:'7px 14px', borderRadius:99, fontSize:13, fontWeight:600, background:'var(--bg2)', border:'1.5px solid var(--border)', color:'var(--text2)', cursor:'pointer', transition:'all var(--t)', fontFamily:'var(--font-body)' },
  chipActive:    { background:'rgba(108,99,255,0.12)', borderColor:'var(--accent)', color:'var(--accent)' },
  summaryBox:    { padding:'20px 22px', background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:'var(--r2)' },
  summaryGrid:   { display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(140px,1fr))', gap:'12px 20px' },
};
