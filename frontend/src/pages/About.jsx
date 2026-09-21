/**
 * About.jsx — Founders, mission, vision, streams covered, data sources
 * Updated: "three Engineering Students", pharmacy + engineering coverage
 */
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const FOUNDERS = [
  {
    initials: 'SA',
    name: 'Samyak Ahiwale',
    role: 'Co-Founder & Lead Developer',
    avatarStyle: { background: 'linear-gradient(135deg,#6c63ff,#a78bfa)' },
    tags: ['Prediction Engine', 'Data Architecture', 'Backend'],
    quote: "I belong to the SC category, and with my score I could have landed in a better college, but I didn't have the right information. Our goal is to make sure every student gets what they deserve.",
  },
  {
    initials: 'DB',
    name: 'Dipesh Bante',
    role: 'Co-Founder & Backend Engineer',
    avatarStyle: { background: 'linear-gradient(135deg,#22d3a0,#38bdf8)' },
    tags: ['College Database', 'Cutoff Analysis', 'API Design'],
    quote: "I got a good score, but due to lack of knowledge about colleges, I didn't get what I deserved. We want our fellow students to never face this.",
  },
  {
    initials: 'YB',
    name: 'Yash Bonde',
    role: 'Co-Founder & UI/UX Designer',
    avatarStyle: { background: 'linear-gradient(135deg,#fb923c,#f87171)' },
    tags: ['Product Design', 'User Research', 'Frontend'],
    quote: "I spent lakhs on a college that didn't match my potential. I want you to understand the value of making informed choices.",
  },
  {
  initials: 'SA',
  name: 'Saad Adhal',
  role: 'Co-Founder & Product & Strategy',
  avatarStyle: { background: 'linear-gradient(135deg,#f97316,#fb923c)' },
  tags: ['Product Strategy', 'Admissions Guidance', 'User Experience'],
  quote: "I had the potential to get into a better college, but a lack of proper information about form filling and the admission process held me back. We’re building MHT CET Predictor Pro so students don’t miss opportunities simply because they didn’t know the right steps.",
},
];

const STREAMS = [
  {
    icon: '⚙️',
    title: 'Engineering',
    color: 'rgba(108,99,255,0.10)',
    border: 'rgba(108,99,255,0.22)',
    textColor: 'var(--accent2)',
    accentBg: 'rgba(108,99,255,0.15)',
    branches: ['CSE', 'IT', 'AI / ML', 'Data Science', 'EXTC', 'Mechanical', 'Civil', 'Electronics', 'IoT'],
    desc: '25+ engineering colleges across Maharashtra with 5-year branch-wise cutoff data for every category.',
    count: '25+ Colleges',
  },
  {
    icon: '💊',
    title: 'Pharmacy',
    color: 'rgba(34,211,160,0.08)',
    border: 'rgba(34,211,160,0.25)',
    textColor: 'var(--green)',
    accentBg: 'rgba(34,211,160,0.15)',
    branches: ['B.Pharm', 'Pharm.D', 'D.Pharm', 'M.Pharm (Pharmaceutics)', 'M.Pharm (Clinical Pharmacy)', 'Pharmacognosy'],
    desc: '15+ pharmacy colleges across Maharashtra with MHT-CET PCB/PCM group cutoffs for all categories.',
    count: '15+ Colleges',
  },
];

const DATA_SOURCES = [
  { source: 'DTE Maharashtra CAP Data — Engineering', years: '2019–2024', coverage: '25+ colleges, all categories & branches' },
  { source: 'DTE Maharashtra CAP Data — Pharmacy',   years: '2019–2024', coverage: '15+ colleges, B.Pharm / Pharm.D / D.Pharm' },
  { source: 'NIRF Rankings',                         years: '2022–2024', coverage: 'Top 200 institutes' },
  { source: 'College Placement Reports',             years: '2023–2024', coverage: '150+ colleges' },
  { source: 'Autonomous Status (UGC / AICTE / PCI)', years: '2024',      coverage: 'All listed colleges' },
];

const ALGO = [
  { pct: '30%', label: 'Placement Rate' },
  { pct: '20%', label: 'Average Package' },
  { pct: '15%', label: 'NIRF Rank' },
  { pct: '15%', label: 'Cutoff Stability (5-yr trend)' },
  { pct: '10%', label: 'Fees-to-Value Ratio' },
  { pct: '10%', label: 'Autonomous Status + Tier Bonus' },
];

export default function About() {
  return (
    <div className="page-wrapper" style={{ background: 'var(--bg)' }}>

      {/* ── Hero ── */}
      <section style={{ padding: '100px 24px 72px', position: 'relative', overflow: 'hidden' }}>
        <div className="hero-glow" />
        <div className="container-md" style={{ position: 'relative', zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            <div className="section-eyebrow">Our Story</div>
            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(36px,5vw,58px)',
              fontWeight: 800, letterSpacing: '-2px',
              lineHeight: 1.08, marginBottom: 20,
            }}>
              Built by students,<br />
              <span className="grad-text">for students.</span>
            </h1>
            <p style={{ fontSize: 17, color: 'var(--text2)', lineHeight: 1.8, maxWidth: 600 }}>
              We are <strong style={{ color: 'var(--text)' }}>three Engineering students</strong> from Maharashtra
              who experienced the cost of missing the right information — and decided
              to fix it for everyone who comes after us.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Mission band ── */}
      <section className="about-mission-band">
        <div className="container-md">
          <div className="about-quote-mark">"</div>
          <blockquote className="about-mission-text">
            Empowering every student who has appeared for MHT-CET and is willing to
            pursue Engineering or Pharmacy with the knowledge to choose their
            best-fit college, so hard work truly pays off.
          </blockquote>
          <div style={{ fontSize: 13, color: 'var(--text3)', fontWeight: 500, letterSpacing: '0.04em', marginTop: 16 }}>
            — Mission Statement, CET Predictor Pro
          </div>
        </div>
      </section>

      <div className="container-md" style={{ padding: '0 24px' }}>

        {/* ── Vision ── */}
        <motion.div
          className="about-vision-box"
          style={{ marginTop: 48, marginBottom: 48 }}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--accent2)', marginBottom: 10 }}>
            Our Vision
          </div>
          <p style={{ fontSize: 17, fontWeight: 500, lineHeight: 1.75 }}>
            Every student who has appeared for MHT-CET and is willing to do
            Engineering or Pharmacy deserves the college they've earned.
            No one should miss their opportunity due to a lack of information.
          </p>
        </motion.div>

        {/* ── Streams we cover ── */}
        <section style={{ marginBottom: 56 }}>
          <div style={{ marginBottom: 28 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text3)', marginBottom: 6 }}>Coverage</div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(22px,3vw,30px)', fontWeight: 800, letterSpacing: '-0.3px', marginBottom: 8 }}>
              Streams We Predict
            </h2>
            <p style={{ color: 'var(--text2)', fontSize: 15, maxWidth: 520, lineHeight: 1.65 }}>
              Our database covers both streams that MHT-CET qualifies you for.
              Select your stream in the predictor to get accurate results.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 20 }}>
            {STREAMS.map((stream, i) => (
              <motion.div
                key={stream.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.12 }}
                style={{
                  padding: 28, borderRadius: 'var(--r)',
                  background: stream.color,
                  border: `1px solid ${stream.border}`,
                  position: 'relative', overflow: 'hidden',
                }}
              >
                {/* Count badge top-right */}
                <div style={{
                  position: 'absolute', top: 16, right: 16,
                  padding: '3px 10px', borderRadius: 99, fontSize: 11, fontWeight: 700,
                  background: stream.accentBg, color: stream.textColor,
                  border: `1px solid ${stream.border}`,
                }}>
                  {stream.count}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                  <span style={{ fontSize: 32 }}>{stream.icon}</span>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 800, color: stream.textColor }}>
                    {stream.title}
                  </div>
                </div>

                <p style={{ fontSize: 14, color: 'var(--text2)', marginBottom: 18, lineHeight: 1.65 }}>
                  {stream.desc}
                </p>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {stream.branches.map(b => (
                    <span key={b} style={{
                      padding: '4px 11px', borderRadius: 99,
                      fontSize: 11, fontWeight: 700,
                      background: 'rgba(0,0,0,0.12)',
                      color: stream.textColor,
                      border: `1px solid ${stream.border}`,
                    }}>
                      {b}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── Founders ── */}
        <section style={{ marginBottom: 56 }}>
          <div style={{ marginBottom: 32 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text3)', marginBottom: 6 }}>
              The Team
            </div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(22px,3vw,30px)', fontWeight: 800, letterSpacing: '-0.3px', marginBottom: 10 }}>
              Developed By
            </h2>
            <p style={{ color: 'var(--text2)', fontSize: 15, maxWidth: 520, lineHeight: 1.65 }}>
              We are three Engineering students from Maharashtra. We built this
              so that no future student — whether Engineering or Pharmacy — has
              to go through what we did.
            </p>
          </div>

          <div className="founders-grid">
            {FOUNDERS.map((f, i) => (
              <motion.div
                key={f.name}
                className="card card-hover founder-card"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <div className="founder-card-top">
                  <div className="founder-avatar" style={f.avatarStyle}>{f.initials}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="founder-name">{f.name}</div>
                    <div className="founder-role">{f.role}</div>
                  </div>
                  <div className="founder-num">0{i + 1}</div>
                </div>

                <div style={{ height: 1, background: 'var(--border)', margin: '16px 0' }} />

                <blockquote className="founder-quote">
                  "{f.quote}"
                </blockquote>

                <div className="founder-tags">
                  {f.tags.map(t => (
                    <span key={t} className="founder-tag">{t}</span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── Data sources ── */}
        <section style={{ marginBottom: 48 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(20px,2.5vw,26px)', fontWeight: 800, letterSpacing: '-0.3px', marginBottom: 12 }}>
            📊 Data Sources
          </h2>
          <p style={{ color: 'var(--text2)', fontSize: 15, marginBottom: 20, lineHeight: 1.75 }}>
            Our cutoff database covers both <strong style={{ color: 'var(--text)' }}>Engineering</strong> and{' '}
            <strong style={{ color: 'var(--text)' }}>Pharmacy</strong> streams, sourced from
            DTE Maharashtra's official CAP round allotment lists (2019–2024).
            We use Cap Round 1, 2, and 3 closing ranks for all categories and sub-categories.
            Pharmacy data includes both PCB and PCM group cutoffs where applicable.
          </p>
          <div className="card" style={{ overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--bg2)' }}>
                  {['Source', 'Years', 'Coverage'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.08em', borderBottom: '1px solid var(--border)' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {DATA_SOURCES.map((row, i) => (
                  <tr key={i} style={{ borderBottom: i < DATA_SOURCES.length - 1 ? '1px solid var(--border)' : 'none' }}>
                    <td style={{ padding: '12px 16px', fontSize: 14, fontWeight: 500 }}>{row.source}</td>
                    <td style={{ padding: '12px 16px', fontSize: 14, color: 'var(--text2)' }}>{row.years}</td>
                    <td style={{ padding: '12px 16px', fontSize: 14, color: 'var(--text2)' }}>{row.coverage}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ── Algorithm ── */}
        <section style={{ marginBottom: 48 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(20px,2.5vw,26px)', fontWeight: 800, letterSpacing: '-0.3px', marginBottom: 16 }}>
            🔢 Ranking Algorithm
          </h2>
          <div className="card" style={{ padding: 24 }}>
            <p style={{ color: 'var(--text2)', fontSize: 15, lineHeight: 1.8, marginBottom: 18 }}>
              Each college-branch (for both Engineering and Pharmacy) is scored on a{' '}
              <strong style={{ color: 'var(--text)' }}>0–100 composite scale</strong>:
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 12 }}>
              {ALGO.map(item => (
                <div key={item.label} style={{ padding: '12px 14px', background: 'var(--bg2)', borderRadius: 'var(--r3)', border: '1px solid var(--border)' }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 800, color: 'var(--accent2)', marginBottom: 4 }}>{item.pct}</div>
                  <div style={{ fontSize: 13, color: 'var(--text2)' }}>{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Disclaimer ── */}
        <section style={{ marginBottom: 48 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(20px,2.5vw,26px)', fontWeight: 800, letterSpacing: '-0.3px', marginBottom: 14 }}>
            ⚠️ Disclaimer
          </h2>
          <div className="warning-box">
            This tool is for <strong>educational guidance only</strong>. Actual cutoffs vary year-to-year
            based on the applicant pool, seat matrix, and government policy changes. Always verify
            with the official DTE Maharashtra CAP portal and your respective college before making
            any admission decision. CET Predictor Pro is not affiliated with DTE Maharashtra,
            AICTE, PCI, or any government body.
          </div>
        </section>

        {/* ── CTA ── */}
        <div style={{ textAlign: 'center', paddingBottom: 64 }}>
          <Link to="/predictor" className="btn btn-grad btn-lg">
            🎯 Try the Predictor Free
          </Link>
        </div>

      </div>
    </div>
  );
}
