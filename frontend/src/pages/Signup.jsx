/**
 * Signup.jsx — Registration with real-time password strength
 */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const getPwStrength = (pw) => {
  let score = 0;
  if (pw.length >= 8)  score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score;
};

const STRENGTH_LABELS = ['', 'Weak', 'Fair', 'Good', 'Strong'];
const STRENGTH_COLORS = ['', '#f87171', '#fbbf24', '#22d3a0', '#22d3a0'];

export default function Signup() {
  const { signup } = useAuth();
  const navigate   = useNavigate();

  const [form, setForm]       = useState({ name:'', email:'', password:'' });
  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw]   = useState(false);

  const pwStrength = getPwStrength(form.password);

  const validate = () => {
    const e = {};
    if (!form.name || form.name.trim().length < 2) e.name = 'Name must be at least 2 characters';
    if (!form.email)    e.email    = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 8) e.password = 'At least 8 characters required';
    else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(form.password))
      e.password = 'Include uppercase, lowercase, and a number';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await signup(form.name.trim(), form.email, form.password);
      toast.success('Account created! Welcome 🎉');
      navigate('/predictor');
    } catch (err) {
      const msg = err.response?.data?.message || 'Signup failed. Please try again.';
      toast.error(msg);
      if (msg.toLowerCase().includes('email')) setErrors({ email: msg });
    } finally {
      setLoading(false);
    }
  };

  const change = (field) => (e) => {
    setForm(f => ({ ...f, [field]: e.target.value }));
    setErrors(er => ({ ...er, [field]: '' }));
  };

  return (
    <div className="auth-page">
      <motion.div
        className="auth-card"
        initial={{ opacity:0, y:24 }}
        animate={{ opacity:1, y:0 }}
        transition={{ duration:0.4 }}
      >
        <Link to="/" className="auth-logo">CET Predictor Pro</Link>
        <h1 className="auth-title">Create your account</h1>
        <p className="auth-sub">Free forever. No credit card needed.</p>

        <form onSubmit={handleSubmit} noValidate>
          <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
            {/* Name */}
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input type="text" className={`form-input ${errors.name?'error':''}`}
                placeholder="Rahul Sharma" value={form.name} onChange={change('name')}
                autoComplete="name" autoFocus />
              {errors.name && <span className="form-error">{errors.name}</span>}
            </div>

            {/* Email */}
            <div className="form-group">
              <label className="form-label">Email address</label>
              <input type="email" className={`form-input ${errors.email?'error':''}`}
                placeholder="you@example.com" value={form.email} onChange={change('email')}
                autoComplete="email" />
              {errors.email && <span className="form-error">{errors.email}</span>}
            </div>

            {/* Password */}
            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position:'relative' }}>
                <input type={showPw?'text':'password'}
                  className={`form-input ${errors.password?'error':''}`}
                  placeholder="Min. 8 characters" value={form.password} onChange={change('password')}
                  autoComplete="new-password" style={{ paddingRight:44 }} />
                <button type="button"
                  style={{ position:'absolute',right:12,top:'50%',transform:'translateY(-50%)',color:'var(--text3)',fontSize:18 }}
                  onClick={() => setShowPw(s=>!s)} tabIndex={-1}>
                  {showPw?'🙈':'👁'}
                </button>
              </div>
              {form.password && (
                <>
                  <div className="pw-strength-bar">
                    <div className="pw-strength-fill"
                      style={{ width:`${(pwStrength/4)*100}%`, background:STRENGTH_COLORS[pwStrength] }} />
                  </div>
                  <span style={{ fontSize:11, color:STRENGTH_COLORS[pwStrength], fontWeight:600 }}>
                    {STRENGTH_LABELS[pwStrength]}
                  </span>
                </>
              )}
              {errors.password && <span className="form-error">{errors.password}</span>}
            </div>

            <button type="submit" className="btn btn-grad btn-lg"
              disabled={loading} style={{ width:'100%', marginTop:4 }}>
              {loading
                ? <span className="spin" style={{ width:20,height:20,border:'2px solid rgba(255,255,255,0.3)',borderTopColor:'#fff',borderRadius:'50%',display:'inline-block' }} />
                : 'Create Account →'}
            </button>
          </div>
        </form>

        <p style={{ fontSize:11,color:'var(--text3)',textAlign:'center',marginTop:16,lineHeight:1.6 }}>
          By signing up, you agree to our Terms of Service and Privacy Policy.
        </p>
        <p style={{ textAlign:'center',marginTop:12,fontSize:14,color:'var(--text2)' }}>
          Already have an account?{' '}
          <Link to="/login" className="auth-link">Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
}
