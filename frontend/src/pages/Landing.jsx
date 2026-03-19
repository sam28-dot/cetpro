/**
 * Landing.jsx — Public home page
 */
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: [0.4, 0, 0.2, 1] },
});

const FEATURES = [
  { icon: '🧠', title: 'Smart Prediction Engine',    desc: 'Cross-references your percentile against 5 years of DTE Maharashtra CAP round data for 25+ colleges and 10 branches with category quota adjustments.' },
  { icon: '🏆', title: 'Composite Ranking Score',    desc: 'Custom algorithm weighing placement rate (30%), avg package (20%), NIRF rank (15%), cutoff stability, fees-to-value, and autonomous status.' },
  { icon: '⚖️',  title: 'Side-by-Side Compare',      desc: 'Add up to 4 colleges to a comparison table across 12 parameters — fees, placements, packages, tier, NIRF rank, and more.' },
  { icon: '📍', title: 'Location Intelligence',      desc: 'Filter by Mumbai, Pune, Nagpur, Nashik, Aurangabad. Home university quota is factored into every prediction.' },
  { icon: '📄', title: 'PDF Report Download',        desc: 'Generate a full personalised report with your shortlist, stats, and scores. Share with parents or your counsellor.' },
  { icon: '🔗', title: 'Shareable Result Links',     desc: 'Make your prediction public with one click and share a direct link — perfect for guidance sessions and group decisions.' },
];

const HOW_IT_WORKS = [
  { n: '01', title: 'Enter Your Score',         desc: 'Input your MHT-CET percentile or raw PCM marks. Select your category (General, OBC, SC, ST…), home university, and preferred branches. Our converter handles marks → percentile automatically.' },
  { n: '02', title: 'AI Analyses Your Profile', desc: 'The engine applies category quota adjustments and cross-references your effective percentile against 5-year cutoff medians for every college-branch pair in our database.' },
  { n: '03', title: 'Get Your Personalised List', desc: 'Receive a ranked shortlist of Safe, Moderate, and Dream colleges. Filter, compare, save, and download your results — all stored in your account.' },
];

const STATS = [
  { num: '40+',   label: 'Colleges Listed',      color: 'var(--accent2)' },
  { num: '2',     label: 'Streams Covered',       color: 'var(--green)'   },
  { num: '5 Yrs', label: 'Cutoff Data',           color: 'var(--yellow)'  },
  { num: 'Free',  label: 'Always',                color: 'var(--accent3)' },
];

export default function Landing() {
  const { user } = useAuth();

  return (
    <div className="page-wrapper" style={{ background: 'var(--bg)' }}>

      {/* ── Hero ── */}
      <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', padding: '80px 0 60px', position: 'relative', overflow: 'hidden' }}>
        <div className="hero-glow" />
        <div className="hero-grid" />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: 780, margin: '0 auto', textAlign: 'center' }}>

            <motion.div {...fadeUp(0)} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', borderRadius: 99, background: 'rgba(108,99,255,0.1)', border: '1px solid rgba(108,99,255,0.22)', fontSize: 13, fontWeight: 500, color: 'var(--accent2)', marginBottom: 28 }}>
              <span className="pulse" style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--accent2)', display: 'inline-block', flexShrink: 0 }} />
              AI-Powered · Engineering &amp; Pharmacy · MHT-CET 2024 Data
            </motion.div>

            <motion.h1 {...fadeUp(0.08)} style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(38px,6.5vw,76px)', fontWeight: 800, lineHeight: 1.06, letterSpacing: '-2.5px', marginBottom: 20 }}>
              Predict Your<br />
              <span className="grad-text">Dream College</span><br />
              with Precision
            </motion.h1>

            <motion.p {...fadeUp(0.16)} style={{ fontSize: 'clamp(16px,2vw,20px)', color: 'var(--text2)', maxWidth: 560, margin: '0 auto 36px', lineHeight: 1.7 }}>
              Maharashtra's most advanced MHT-CET college predictor for students
              willing to pursue <strong style={{ color: 'var(--text)' }}>Engineering</strong> or{' '}
              <strong style={{ color: 'var(--text)' }}>Pharmacy</strong>. Get your
              personalised shortlist in seconds — for free.
            </motion.p>

            <motion.div {...fadeUp(0.22)} style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 60 }}>
              <Link to={user ? '/predictor' : '/signup'} className="btn btn-grad btn-lg">
                🎯 {user ? 'New Prediction' : 'Start Predicting Free'}
              </Link>
              <Link to="/about" className="btn btn-ghost btn-lg">Learn More →</Link>
            </motion.div>

            <motion.div {...fadeUp(0.28)} style={{ display: 'flex', gap: 48, justifyContent: 'center', flexWrap: 'wrap', paddingTop: 40, borderTop: '1px solid var(--border)' }}>
              {STATS.map(st => (
                <div key={st.label} style={{ textAlign: 'center' }}>
                  <div className="stat-num" style={{ color: st.color }}>{st.num}</div>
                  <div className="stat-label">{st.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section style={{ padding: '80px 0', background: 'var(--bg)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(26px,3.5vw,40px)', fontWeight: 800, letterSpacing: '-0.5px', marginBottom: 12 }}>Everything You Need to Decide</h2>
            <p style={{ color: 'var(--text2)', fontSize: 16, maxWidth: 460, margin: '0 auto' }}>From raw percentile to ranked college list — we handle the complexity.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 18 }}>
            {FEATURES.map((f, i) => (
              <motion.div key={f.title} className="card card-hover feature-card"
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.06 }}>
                <div style={{ fontSize: 28, marginBottom: 14 }}>{f.icon}</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 700, marginBottom: 8 }}>{f.title}</div>
                <div style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.7 }}>{f.desc}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section style={{ padding: '80px 0', background: 'var(--bg2)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="container-md">
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(26px,3.5vw,40px)', fontWeight: 800, letterSpacing: '-0.5px', marginBottom: 12 }}>How It Works</h2>
            <p style={{ color: 'var(--text2)', fontSize: 16 }}>Three simple steps to your perfect college match.</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {HOW_IT_WORKS.map((step, i) => (
              <motion.div key={step.n}
                style={{ display: 'flex', gap: 28, alignItems: 'flex-start', padding: '32px 0', borderBottom: i < HOW_IT_WORKS.length - 1 ? '1px solid var(--border)' : 'none' }}
                initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.45, delay: i * 0.1 }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: 'var(--grad1)', color: '#fff', fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{step.n}</div>
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, marginBottom: 8 }}>{step.title}</div>
                  <div style={{ fontSize: 15, color: 'var(--text2)', lineHeight: 1.75 }}>{step.desc}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: '80px 24px', textAlign: 'center' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }} whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }} transition={{ duration: 0.45 }}
          style={{ maxWidth: 720, margin: '0 auto', borderRadius: 24, background: 'var(--grad1)', padding: '64px 40px', textAlign: 'center' }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>🎓</div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(22px,4vw,36px)', fontWeight: 800, letterSpacing: '-0.5px', marginBottom: 12, color: '#fff' }}>
            Your best-fit college is one prediction away.
          </h2>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.75)', maxWidth: 460, margin: '0 auto 32px', lineHeight: 1.7 }}>
            Join students who made informed decisions instead of guessing.
          </p>
          <Link to={user ? '/predictor' : '/signup'} className="btn btn-lg"
            style={{ background: '#fff', color: 'var(--accent)', fontWeight: 800, display: 'inline-flex' }}>
            {user ? 'Start Predicting →' : 'Create Free Account →'}
          </Link>
        </motion.div>
      </section>

    </div>
  );
}
