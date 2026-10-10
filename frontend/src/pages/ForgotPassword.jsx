/**
 * ForgotPassword.jsx — email OTP verification and password reset.
 */
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { authAPI } from '../utils/api';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const requestCode = async (e) => {
    if (e) e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) { setError('Enter a valid email address'); return; }
    setLoading(true);
    try {
      await authAPI.forgotPassword({ email: email.trim().toLowerCase() });
      setSent(true);
      setError('');
      toast.success('If the account exists, a verification code has been sent.');
    } catch (err) {
      setError(err.response?.data?.message || 'We could not send the code. Please try again.');
    } finally { setLoading(false); }
  };

  const resetPassword = async (e) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(otp)) { setError('Enter the 6-digit code from your email'); return; }
    if (password.length < 8 || !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      setError('Use at least 8 characters with uppercase, lowercase, and a number'); return;
    }
    if (password !== confirm) { setError('Passwords do not match'); return; }
    setLoading(true);
    try {
      const { data } = await authAPI.resetPassword({ email: email.trim().toLowerCase(), otp, password });
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      toast.success('Password reset successfully. Welcome back!');
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not reset password. Request a new code if it expired.');
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <motion.div className="auth-card" initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} transition={{duration:0.4}}>
        <Link to="/" className="auth-logo">CET Predictor Pro</Link>
        {sent ? (
          <>
            <div style={{textAlign:'center',fontSize:38,marginTop:12}}>📩</div>
            <h1 className="auth-title">Check your inbox</h1>
            <p className="auth-sub">If an account exists for <strong>{email}</strong>, a 6-digit code has been sent. It expires in 10 minutes. Check your spam folder too.</p>
            <form onSubmit={resetPassword} noValidate>
              <div style={{display:'flex',flexDirection:'column',gap:14}}>
                <div className="form-group">
                  <label className="form-label">6-digit email code</label>
                  <input className={"form-input " + (error ? "error" : "")} inputMode="numeric" autoComplete="one-time-code" maxLength={6} placeholder="123456" value={otp} onChange={e=>{setOtp(e.target.value.replace(/\D/g,'').slice(0,6));setError('');}} autoFocus />
                </div>
                <div className="form-group">
                  <label className="form-label">New password</label>
                  <input type="password" className="form-input" autoComplete="new-password" placeholder="At least 8 characters" value={password} onChange={e=>{setPassword(e.target.value);setError('');}} />
                </div>
                <div className="form-group">
                  <label className="form-label">Confirm new password</label>
                  <input type="password" className="form-input" autoComplete="new-password" placeholder="Enter it again" value={confirm} onChange={e=>{setConfirm(e.target.value);setError('');}} />
                </div>
                {error && <span className="form-error" role="alert">{error}</span>}
                <button type="submit" className="btn btn-grad btn-lg" disabled={loading} style={{width:'100%'}}>{loading?'Verifying…':'Verify Code & Reset Password'}</button>
                <button type="button" className="btn btn-ghost" disabled={loading} onClick={()=>{setSent(false);setOtp('');setPassword('');setConfirm('');setError('');}}>Use a different email</button>
                <button type="button" className="btn btn-ghost" disabled={loading} onClick={requestCode}>Send a new code</button>
              </div>
            </form>
          </>
        ) : (
          <>
            <h1 className="auth-title">Forgot password?</h1>
            <p className="auth-sub">Enter your registered email. We’ll send you a secure one-time code to reset your password.</p>
            <form onSubmit={requestCode} noValidate>
              <div className="form-group" style={{marginBottom:16}}>
                <label className="form-label">Registered email address</label>
                <input type="email" className={"form-input " + (error ? "error" : "")} placeholder="you@example.com" value={email} onChange={e=>{setEmail(e.target.value);setError('');}} autoComplete="email" autoFocus />
                {error && <span className="form-error" role="alert">{error}</span>}
              </div>
              <button type="submit" className="btn btn-grad btn-lg" disabled={loading} style={{width:'100%'}}>{loading?'Sending code…':'Send Verification Code'}</button>
            </form>
          </>
        )}
        <p style={{textAlign:'center',marginTop:22,fontSize:14,color:'var(--text2)'}}>Remember your password? <Link to="/login" className="auth-link">Back to login</Link></p>
      </motion.div>
    </div>
  );
}
