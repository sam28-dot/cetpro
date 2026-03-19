/**
 * Login.jsx — Secure login page with validation and error handling
 */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login }  = useAuth();
  const navigate   = useNavigate();

  const [form, setForm]       = useState({ email: '', password: '' });
  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw]   = useState(false);

  const validate = () => {
    const e = {};
    if (!form.email)    e.email    = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.password) e.password = 'Password is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Welcome back! 🎉');
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please try again.';
      toast.error(msg);
      if (msg.toLowerCase().includes('password')) setErrors({ password: msg });
      else setErrors({ email: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <motion.div
        className="auth-card"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Link to="/" className="auth-logo">CET Predictor Pro</Link>
        <h1 className="auth-title">Welcome back</h1>
        <p className="auth-sub">Log in to your account to continue</p>

        <form onSubmit={handleSubmit} noValidate>
          <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
            {/* Email */}
            <div className="form-group">
              <label className="form-label">Email address</label>
              <input
                type="email"
                className={`form-input ${errors.email ? 'error' : ''}`}
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => { setForm(f=>({...f,email:e.target.value})); setErrors(er=>({...er,email:''})); }}
                autoComplete="email"
                autoFocus
              />
              {errors.email && <span className="form-error">{errors.email}</span>}
            </div>

            {/* Password */}
            <div className="form-group">
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <label className="form-label">Password</label>
                <Link to="/forgot-password" style={{ fontSize:12, color:'var(--accent2)', fontWeight:600 }}>
                  Forgot password?
                </Link>
              </div>
              <div style={{ position:'relative' }}>
                <input
                  type={showPw ? 'text' : 'password'}
                  className={`form-input ${errors.password ? 'error' : ''}`}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => { setForm(f=>({...f,password:e.target.value})); setErrors(er=>({...er,password:''})); }}
                  autoComplete="current-password"
                  style={{ paddingRight:44 }}
                />
                <button
                  type="button"
                  style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', color:'var(--text3)', fontSize:18 }}
                  onClick={() => setShowPw(s=>!s)}
                  tabIndex={-1}
                >{showPw ? '🙈' : '👁'}</button>
              </div>
              {errors.password && <span className="form-error">{errors.password}</span>}
            </div>

            <button
              type="submit"
              className="btn btn-grad btn-lg"
              disabled={loading}
              style={{ width:'100%', marginTop:4 }}
            >
              {loading
                ? <span className="spin" style={{ width:20,height:20,border:'2px solid rgba(255,255,255,0.3)',borderTopColor:'#fff',borderRadius:'50%',display:'inline-block' }} />
                : 'Sign In →'}
            </button>
          </div>
        </form>

        <p style={{ textAlign:'center', marginTop:24, fontSize:14, color:'var(--text2)' }}>
          Don't have an account?{' '}
          <Link to="/signup" className="auth-link">Create one free</Link>
        </p>
      </motion.div>
    </div>
  );
}
