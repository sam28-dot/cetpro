/**
 * ForgotPassword.jsx
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { authAPI } from '../utils/api';

export default function ForgotPassword() {
  const [email, setEmail]     = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent]       = useState(false);
  const [error, setError]     = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!/\S+@\S+\.\S+/.test(email)) { setError('Enter a valid email'); return; }
    setLoading(true);
    try {
      await authAPI.forgotPassword({ email });
      setSent(true);
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <motion.div className="auth-card" initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} transition={{duration:0.4}}>
        <Link to="/" className="auth-logo">CET Predictor Pro</Link>

        {sent ? (
          <div style={{ textAlign:'center', padding:'16px 0' }}>
            <div style={{ fontSize:48, marginBottom:16 }}>📧</div>
            <h2 style={{ fontSize:22, fontWeight:800, marginBottom:8 }}>Check your email</h2>
            <p style={{ color:'var(--text2)', marginBottom:24 }}>
              If an account exists for <strong>{email}</strong>, we've sent a reset link. Check your inbox (and spam folder).
            </p>
            <Link to="/login" className="btn btn-ghost" style={{ display:'inline-flex' }}>← Back to Login</Link>
          </div>
        ) : (
          <>
            <h1 className="auth-title">Forgot password?</h1>
            <p className="auth-sub">Enter your email and we'll send a reset link.</p>

            <form onSubmit={handleSubmit} noValidate>
              <div className="form-group" style={{ marginBottom:16 }}>
                <label className="form-label">Email address</label>
                <input type="email" className={`form-input ${error?'error':''}`}
                  placeholder="you@example.com" value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(''); }}
                  autoFocus />
                {error && <span className="form-error">{error}</span>}
              </div>

              <button type="submit" className="btn btn-grad btn-lg" disabled={loading} style={{ width:'100%' }}>
                {loading
                  ? <span className="spin" style={{ width:20,height:20,border:'2px solid rgba(255,255,255,0.3)',borderTopColor:'#fff',borderRadius:'50%',display:'inline-block' }} />
                  : 'Send Reset Link'}
              </button>
            </form>

            <p style={{ textAlign:'center', marginTop:20, fontSize:14, color:'var(--text2)' }}>
              Remember it?{' '}<Link to="/login" className="auth-link">Back to login</Link>
            </p>
          </>
        )}
      </motion.div>
    </div>
  );
}
