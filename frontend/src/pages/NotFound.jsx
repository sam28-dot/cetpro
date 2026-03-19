import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function NotFound() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <motion.div
        initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
        style={{ textAlign: 'center' }}>
        <div className="notfound-num">404</div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 800, marginBottom: 8 }}>Page Not Found</h1>
        <p style={{ color: 'var(--text2)', marginBottom: 28, maxWidth: 360, margin: '0 auto 28px' }}>
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/" className="btn btn-grad btn-lg">← Back to Home</Link>
          <Link to="/predictor" className="btn btn-ghost btn-lg">Try Predictor</Link>
        </div>
      </motion.div>
    </div>
  );
}
