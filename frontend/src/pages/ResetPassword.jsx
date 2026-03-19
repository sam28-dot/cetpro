/**
 * ResetPassword.jsx — Token-based password reset
 */

import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { authAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';

export default function ResetPassword() {
  const [searchParams]        = useSearchParams();
  const token                 = searchParams.get('token') || '';
  const { updateUser }        = useAuth();
  const navigate              = useNavigate();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm]   = useState('');
  const [loading, setLoading]   = useState(false);
  const [errors, setErrors]     = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (password.length < 8) errs.password = 'Min 8 characters';
    else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password))
      errs.password = 'Include uppercase, lowercase, and a number';
    if (password !== confirm) errs.confirm = 'Passwords do not match';
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setLoading(true);
    try {
      const { data } = await authAPI.resetPassword({ token, password });
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      toast.success('Password reset successfully!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Reset failed. The link may have expired.');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="auth-page">
        <div className="auth-card" style={{ textAlign:'center' }}>
          <div style={{ fontSize:48, marginBottom:16 }}>❌</div>
          <h2>Invalid Reset Link</h2>
          <p style={{ color:'var(--text2)', margin:'12px 0 24px' }}>This link is missing or malformed.</p>
          <Link to="/forgot-password" className="btn btn-primary" style={{ display:'inline-flex' }}>Request New Link</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <motion.div className="auth-card" initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} transition={{duration:0.4}}>
        <Link to="/" className="auth-logo">CET Predictor Pro</Link>
        <h1 className="auth-title">Set new password</h1>
        <p className="auth-sub">Choose a strong password for your account.</p>

        <form onSubmit={handleSubmit} noValidate>
          <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
            <div className="form-group">
              <label className="form-label">New Password</label>
              <input type="password" className={`form-input ${errors.password?'error':''}`}
                placeholder="Min. 8 characters" value={password}
                onChange={(e) => { setPassword(e.target.value); setErrors(er=>({...er,password:''})); }}
                autoFocus />
              {errors.password && <span className="form-error">{errors.password}</span>}
            </div>
            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <input type="password" className={`form-input ${errors.confirm?'error':''}`}
                placeholder="Repeat password" value={confirm}
                onChange={(e) => { setConfirm(e.target.value); setErrors(er=>({...er,confirm:''})); }} />
              {errors.confirm && <span className="form-error">{errors.confirm}</span>}
            </div>
            <button type="submit" className="btn btn-grad btn-lg" disabled={loading} style={{ width:'100%' }}>
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
