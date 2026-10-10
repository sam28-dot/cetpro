/**
 * Results.jsx — Prediction results dashboard
 * Loads a prediction by ID, renders Safe/Moderate/Dream cards,
 * supports filtering, PDF download, share link, and compare.
 */

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { predictionAPI } from '../utils/api';
import CollegeCard from '../components/predictor/CollegeCard';

const SECTIONS = [
  { key:'safe',     label:'✅ Safe Colleges',     badge:'badge-safe',     desc:'Your percentile is at least 3 points above the historical cutoff.' },
  { key:'moderate', label:'🎯 Moderate Colleges', badge:'badge-moderate', desc:'Your percentile is within 4 points below to 3 points above the historical cutoff.' },
  { key:'dream',    label:'⭐ Dream Colleges',    badge:'badge-dream',    desc:'Your percentile is more than 4 points below the historical cutoff.' },
];

const LOC_OPTS = ['any','mumbai','pune','thane','nagpur','nashik','aurangabad','kolhapur'];
const TIER_OPTS = ['any','1','2','3'];

export default function Results() {
  const { id }    = useParams();
  const navigate  = useNavigate();

  const [prediction, setPrediction]   = useState(null);
  const [loading, setLoading]         = useState(true);
  const [compareList, setCompareList] = useState([]);
  const [savedList, setSavedList]     = useState(() => JSON.parse(localStorage.getItem('cetpro_saved') || '[]'));

  // Filters
  const [filterLoc,  setFilterLoc]  = useState('any');
  const [filterTier, setFilterTier] = useState('any');
  const [filterAuto, setFilterAuto] = useState('any');

  // Share modal
  const [shareModal, setShareModal] = useState(false);
  const [shareLink,  setShareLink]  = useState('');
  const [sharing,    setSharing]    = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await predictionAPI.getOne(id);
        setPrediction(data.prediction);
      } catch {
        toast.error('Prediction not found.');
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, navigate]);

  /* ── Filter logic ───────────────────────────────────────────── */
  const applyFilters = (arr) => {
    return arr.filter(r => {
      if (filterLoc  !== 'any' && r.location !== filterLoc) return false;
      if (filterTier !== 'any' && r.tier !== parseInt(filterTier)) return false;
      if (filterAuto === 'true'  && !r.autonomous) return false;
      if (filterAuto === 'false' &&  r.autonomous) return false;
      return true;
    });
  };

  /* ── Compare ────────────────────────────────────────────────── */
  const toggleCompare = (result) => {
    setCompareList(prev => {
      const key = `${result.collegeId}-${result.branch}`;
      const exists = prev.some(r => `${r.collegeId}-${r.branch}` === key);
      if (exists) { toast('Removed from compare'); return prev.filter(r => `${r.collegeId}-${r.branch}` !== key); }
      if (prev.length >= 4) { toast.error('Max 4 colleges for comparison'); return prev; }
      toast.success(`${result.shortName} added to compare`);
      return [...prev, result];
    });
  };

  const isCompared = (r) => compareList.some(c => c.collegeId === r.collegeId && c.branch === r.branch);

  /* ── Save ───────────────────────────────────────────────────── */
  const toggleSave = (result) => {
    setSavedList(prev => {
      const key = `${result.collegeId}-${result.branch}`;
      const exists = prev.some(r => `${r.collegeId}-${r.branch}` === key);
      const next = exists ? prev.filter(r => `${r.collegeId}-${r.branch}` !== key) : [...prev, result];
      localStorage.setItem('cetpro_saved', JSON.stringify(next));
      toast(exists ? 'Removed from saved' : '🔖 College saved!');
      return next;
    });
  };
  const isSaved = (r) => savedList.some(s => s.collegeId === r.collegeId && s.branch === r.branch);

  /* ── Share ──────────────────────────────────────────────────── */
  const handleShare = async () => {
    setSharing(true);
    try {
      const { data } = await predictionAPI.toggleShare(id);
      if (data.isPublic) {
        const url = `${window.location.origin}/share/${data.shareToken}`;
        setShareLink(url);
        setShareModal(true);
      } else {
        toast.success('Results made private.');
      }
    } catch { toast.error('Failed to generate share link.'); }
    finally { setSharing(false); }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(shareLink).then(() => toast.success('Link copied! 📋'));
  };

  /* ── PDF Download ───────────────────────────────────────────── */
  const downloadPDF = () => {
    if (!prediction) return;
    const doc = new jsPDF({ orientation:'landscape' });
    const { input, results } = prediction;
    const all = [...(results.safe||[]), ...(results.moderate||[]), ...(results.dream||[])];

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.setTextColor(108, 99, 255);
    doc.text('MHT-CET College Predictor Pro', 14, 20);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(100);
    const streamLabel = input.stream === 'pharmacy' ? 'Pharmacy' : 'Engineering';
    doc.text(`Stream: ${streamLabel}  |  Percentile: ${input.percentile}  |  Category: ${input.category}  |  Generated: ${new Date().toLocaleDateString('en-IN')}`, 14, 28);

    doc.autoTable({
      startY: 34,
      head: [['College','Branch','Type','Cutoff','Fees/yr','Placement','Avg Pkg','Score','Category']],
      body: all.map(r => [
        r.collegeName,
        r.branch,
        (r.tier != null ? `Tier ${r.tier}` : 'Not verified'),
        r.cutoffPercentile?.toFixed(1),
        (r.fees != null ? `₹${(r.fees/1000).toFixed(0)}K` : '—'),
        (r.placementRate != null ? `${r.placementRate}%` : '—'),
        (r.avgPackage != null ? `₹${r.avgPackage}L` : '—'),
        r.score,
        r.category?.toUpperCase(),
      ]),
      styles: { fontSize:8, cellPadding:4 },
      headStyles: { fillColor:[108,99,255], textColor:255, fontStyle:'bold' },
      alternateRowStyles: { fillColor:[245,245,255] },
    });

    doc.save(`CET_Prediction_${input.percentile}_${input.category}.pdf`);
    toast.success('PDF downloaded! 📄');
  };

  /* ── Skeletons ──────────────────────────────────────────────── */
  if (loading) {
    return (
      <div className="page-wrapper">
        <div className="container" style={{ padding:'40px 24px' }}>
          <div className="skeleton" style={{ height:40, width:300, marginBottom:20 }} />
          <div className="skeleton" style={{ height:56, marginBottom:24 }} />
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(320px,1fr))', gap:16 }}>
            {[...Array(6)].map((_,i) => <div key={i} className="skeleton" style={{ height:280 }} />)}
          </div>
        </div>
      </div>
    );
  }

  if (!prediction) return null;

  const { input, results, totalMatches } = prediction;
  const allResults = [...(results.safe||[]), ...(results.moderate||[]), ...(results.dream||[])];

  return (
    <div className="page-wrapper">
      <div className="container" style={{ padding:'32px 24px 80px' }}>
        <div className="card" style={{ padding:16, marginBottom:20, borderLeft:'4px solid var(--accent)' }}>
          <strong>Historical cutoff comparison — not an admission prediction.</strong>
          <div style={{ color:'var(--text2)', fontSize:13, lineHeight:1.6, marginTop:6 }}>
            Results use imported official 2025–26 CAP Round IV engineering percentile records. Each result retains its official category code. Home-university eligibility, gender-specific seats, fees, placements and admission probability are not inferred where verified data is unavailable.
          </div>
        </div>

        {/* Header */}
        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', flexWrap:'wrap', gap:16, marginBottom:24 }}>
          <div>
            <h1 style={{ fontFamily:'var(--font-display)', fontSize:'clamp(22px,3vw,34px)', fontWeight:800, letterSpacing:'-0.5px', marginBottom:4 }}>
              Your Predictions
            </h1>
            <p style={{ color:'var(--text2)', fontSize:14 }}>
              {totalMatches} colleges matched · {input.percentile} percentile · {input.category}
            </p>
          </div>
          <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
            <button className="btn btn-ghost btn-sm" onClick={handleShare} disabled={sharing}>
              {sharing ? '...' : '🔗 Share'}
            </button>
            <button className="btn btn-ghost btn-sm" onClick={downloadPDF}>📄 PDF</button>
            {compareList.length > 0 && (
              <button className="btn btn-primary btn-sm"
                onClick={() => { localStorage.setItem('cetpro_compare', JSON.stringify(compareList)); navigate('/compare'); }}>
                ⚖️ Compare ({compareList.length})
              </button>
            )}
            <Link to="/predictor" className="btn btn-ghost btn-sm">← New Prediction</Link>
          </div>
        </div>

        {/* User summary strip */}
        <div style={s.summaryStrip}>
          {[
            { l:'Stream',     v: input.stream === 'pharmacy' ? '💊 Pharmacy' : '⚙️ Engineering' },
            { l:'Percentile', v: input.percentile },
            { l:'Category',   v: input.category },
            { l:'Branches',   v: (input.preferredBranches||[]).join(', ') },
            { l:'Location',   v: input.location === 'any' ? 'Anywhere' : input.location },
            { l:'Max Fees',   v: `₹${(input.maxFees/1000).toFixed(0)}K` },
          ].map((item,i) => (
            <React.Fragment key={item.l}>
              {i > 0 && <div className="divider-v" />}
              <div>
                <div style={{ fontSize:10,fontWeight:700,color:'var(--text3)',textTransform:'uppercase',letterSpacing:'0.08em' }}>{item.l}</div>
                <div style={{ fontSize:15,fontWeight:700,color:'var(--accent2)',marginTop:2 }}>{item.v}</div>
              </div>
            </React.Fragment>
          ))}
        </div>

        {/* Filters */}
        <div style={s.filtersBar}>
          <span style={{ fontSize:12,fontWeight:700,color:'var(--text3)',marginRight:4 }}>Filter:</span>
          <select style={s.filterSel} value={filterLoc}  onChange={e => setFilterLoc(e.target.value)}>
            {LOC_OPTS.map(o => <option key={o} value={o}>{o === 'any' ? 'All Locations' : o.charAt(0).toUpperCase()+o.slice(1)}</option>)}
          </select>
          <select style={s.filterSel} value={filterTier} onChange={e => setFilterTier(e.target.value)}>
            {TIER_OPTS.map(o => <option key={o} value={o}>{o === 'any' ? 'All Tiers' : `Tier ${o}`}</option>)}
          </select>
          <select style={s.filterSel} value={filterAuto} onChange={e => setFilterAuto(e.target.value)}>
            <option value="any">Any Type</option>
            <option value="true">Autonomous</option>
            <option value="false">Non-Autonomous</option>
          </select>
        </div>

        {/* AI Top Picks */}
        {allResults.length > 0 && (
          <div style={s.topPicksBox}>
            <div style={{ display:'flex',alignItems:'center',gap:10,marginBottom:14 }}>
              <span style={{ fontSize:20 }}>🤖</span>
              <div>
                <div style={{ fontFamily:'var(--font-display)',fontWeight:800,fontSize:16 }}>Top Picks For You</div>
                <div style={{ fontSize:12,color:'var(--text2)' }}>AI-ranked by composite score</div>
              </div>
            </div>
            <div style={{ display:'flex',flexDirection:'column',gap:8 }}>
              {[...allResults].sort((a,b)=>b.score-a.score).slice(0,5).map((r,i) => (
                <div key={`${r.collegeId}-${r.branch}`} style={s.pickRow}>
                  <div style={{ fontFamily:'var(--font-display)',fontSize:20,fontWeight:800,color:'var(--accent2)',minWidth:32 }}>#{i+1}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontWeight:700,fontSize:14 }}>{r.shortName || r.collegeName}</div>
                    <div style={{ fontSize:11,color:'var(--text3)' }}>{r.branch} · {r.location}</div>
                  </div>
                  <div style={{ textAlign:'right' }}>
                    <div style={{ fontFamily:'var(--font-display)',fontSize:20,fontWeight:800,color:r.score>=75?'var(--green)':'var(--yellow)' }}>{r.score}</div>
                    <div style={{ fontSize:10,color:'var(--text3)',textTransform:'uppercase',letterSpacing:'0.06em' }}>Score</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sections */}
        {SECTIONS.map(sec => {
          const items = applyFilters(results[sec.key] || []);
          if (items.length === 0) return null;
          return (
            <div key={sec.key} style={{ marginBottom:40 }}>
              <div style={{ display:'flex',alignItems:'center',gap:12,marginBottom:16 }}>
                <span className={`badge ${sec.badge}`}>{sec.key.toUpperCase()}</span>
                <h2 style={{ fontFamily:'var(--font-display)',fontSize:22,fontWeight:800 }}>{sec.label}</h2>
                <span style={{ fontSize:13,color:'var(--text3)' }}>{items.length} colleges</span>
              </div>
              <p style={{ fontSize:13,color:'var(--text2)',marginBottom:16 }}>{sec.desc}</p>
              <div style={s.grid}>
                {items.map((r, i) => (
                  <CollegeCard key={`${r.collegeId}-${r.branch}`} result={r} index={i}
                    onCompare={toggleCompare} isCompared={isCompared(r)}
                    onSave={toggleSave} isSaved={isSaved(r)}
                    delay={i * 0.04} />
                ))}
              </div>
            </div>
          );
        })}

        {/* Empty state */}
        {allResults.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">😕</div>
            <div className="empty-title">No matches found</div>
            <div className="empty-sub">Try adjusting your filters or increasing the fees range.</div>
            <Link to="/predictor" className="btn btn-primary" style={{ display:'inline-flex',marginTop:8 }}>← Adjust & Retry</Link>
          </div>
        )}
      </div>

      {/* Share modal */}
      <AnimatePresence>
        {shareModal && (
          <motion.div style={s.modalOverlay} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={() => setShareModal(false)}>
            <motion.div style={s.modal} initial={{scale:0.94,y:20}} animate={{scale:1,y:0}} exit={{scale:0.94,y:20}} onClick={e=>e.stopPropagation()}>
              <h2 style={{ fontFamily:'var(--font-display)',fontSize:20,fontWeight:800,marginBottom:6 }}>🔗 Share Your Results</h2>
              <p style={{ color:'var(--text2)',fontSize:14,marginBottom:18 }}>Anyone with this link can view your prediction results.</p>
              <div style={s.linkBox}>
                <span style={{ flex:1,fontSize:13,color:'var(--text2)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap' }}>{shareLink}</span>
                <button style={{ fontSize:20,flexShrink:0 }} onClick={copyLink}>📋</button>
              </div>
              <div style={{ display:'flex',justifyContent:'flex-end',gap:8,marginTop:16 }}>
                <button className="btn btn-ghost btn-sm" onClick={() => setShareModal(false)}>Close</button>
                <button className="btn btn-primary btn-sm" onClick={copyLink}>Copy Link</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

const s = {
  summaryStrip: { background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'var(--r2)',padding:'14px 20px',display:'flex',alignItems:'center',gap:20,flexWrap:'wrap',marginBottom:20 },
  filtersBar: { background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'var(--r3)',padding:'12px 16px',display:'flex',gap:10,flexWrap:'wrap',alignItems:'center',marginBottom:24 },
  filterSel: { padding:'6px 12px',borderRadius:99,fontSize:12,fontWeight:600,background:'var(--bg2)',border:'1.5px solid var(--border)',color:'var(--text2)',cursor:'pointer',outline:'none' },
  topPicksBox: { background:'linear-gradient(135deg,rgba(108,99,255,0.07),rgba(56,189,248,0.04))',border:'1px solid rgba(108,99,255,0.18)',borderRadius:'var(--r)',padding:22,marginBottom:32 },
  pickRow: { display:'flex',alignItems:'center',gap:14,padding:'11px 14px',borderRadius:'var(--r3)',background:'rgba(0,0,0,0.15)',border:'1px solid var(--border)' },
  grid: { display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(320px,1fr))',gap:16 },
  modalOverlay: { position:'fixed',inset:0,zIndex:2000,background:'rgba(0,0,0,0.65)',backdropFilter:'blur(8px)',display:'flex',alignItems:'center',justifyContent:'center',padding:24 },
  modal: { background:'var(--surface)',border:'1px solid var(--border2)',borderRadius:'var(--r)',padding:28,maxWidth:460,width:'100%',boxShadow:'var(--shadow)' },
  linkBox: { display:'flex',alignItems:'center',gap:10,padding:'10px 14px',background:'var(--bg2)',border:'1px solid var(--border)',borderRadius:'var(--r3)' },
};
