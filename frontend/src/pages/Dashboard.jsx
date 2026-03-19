/**
 * Dashboard.jsx — User dashboard: stats, prediction history, profile editor
 */
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { predictionAPI, userAPI } from '../utils/api';

const CATEGORIES = ['OPEN','OBC','SC','ST','VJ-DT','NT-B','NT-C','NT-D','SBC','EWS'];

export default function Dashboard() {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();

  const [predictions, setPredictions]   = useState([]);
  const [stats, setStats]               = useState(null);
  const [loadingPreds, setLoadingPreds] = useState(true);
  const [activeTab, setActiveTab]       = useState('predictions');
  const [deleting, setDeleting]         = useState(null);

  // Profile edit
  const [editing, setEditing]       = useState(false);
  const [profileForm, setProfileForm] = useState({ name: '', phone: '', category: '' });
  const [savingProfile, setSavingProfile] = useState(false);

  // Change password
  const [changingPw, setChangingPw]   = useState(false);
  const [pwForm, setPwForm]           = useState({ current: '', next: '', confirm: '' });
  const [savingPw, setSavingPw]       = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [predsRes, statsRes] = await Promise.all([
          predictionAPI.getAll({ limit: 20 }),
          userAPI.getStats(),
        ]);
        setPredictions(predsRes.data.predictions);
        setStats(statsRes.data.stats);
      } catch {
        toast.error('Failed to load dashboard.');
      } finally {
        setLoadingPreds(false);
      }
    };
    load();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this prediction? This cannot be undone.')) return;
    setDeleting(id);
    try {
      await predictionAPI.delete(id);
      setPredictions(p => p.filter(x => x._id !== id));
      toast.success('Prediction deleted.');
    } catch {
      toast.error('Delete failed.');
    } finally {
      setDeleting(null); }
  };

  const startEdit = () => {
    setProfileForm({ name: user?.name || '', phone: user?.phone || '', category: user?.category || '' });
    setEditing(true);
  };

  const saveProfile = async () => {
    if (!profileForm.name?.trim()) { toast.error('Name is required'); return; }
    setSavingProfile(true);
    try {
      const { data } = await userAPI.updateProfile(profileForm);
      updateUser(data.user);
      toast.success('Profile updated!');
      setEditing(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed.');
    } finally { setSavingProfile(false); }
  };

  const savePassword = async () => {
    if (!pwForm.current) { toast.error('Enter current password'); return; }
    if (pwForm.next.length < 8) { toast.error('New password must be at least 8 characters'); return; }
    if (pwForm.next !== pwForm.confirm) { toast.error('Passwords do not match'); return; }
    setSavingPw(true);
    try {
      await userAPI.changePassword({ currentPassword: pwForm.current, newPassword: pwForm.next });
      toast.success('Password changed!');
      setChangingPw(false);
      setPwForm({ current: '', next: '', confirm: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Password change failed.');
    } finally { setSavingPw(false); }
  };

  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?';

  return (
    <div className="page-wrapper">
      <div className="container" style={{ padding: '32px 24px 80px' }}>

        {/* Header */}
        <div className="dash-header">
          <div className="dash-avatar">{initials}</div>
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(20px,3vw,30px)', fontWeight: 800, letterSpacing: '-0.5px' }}>{user?.name}</h1>
            <p style={{ color: 'var(--text2)', fontSize: 14, marginTop: 4 }}>{user?.email}</p>
            {user?.category && (
              <span style={{ display: 'inline-block', marginTop: 6, padding: '2px 10px', borderRadius: 99, fontSize: 11, fontWeight: 700, background: 'rgba(108,99,255,0.1)', border: '1px solid rgba(108,99,255,0.2)', color: 'var(--accent2)' }}>
                Category: {user.category}
              </span>
            )}
          </div>
          <div style={{ flex: 1 }} />
          <Link to="/predictor" className="btn btn-grad">🎯 New Prediction</Link>
        </div>

        {/* Stats */}
        {stats && (
          <div className="dash-stats-grid">
            {[
              { icon: '🎯', label: 'Total Predictions', val: stats.totalPredictions },
              { icon: '📅', label: 'Member Since',      val: new Date(user?.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) },
              { icon: '🕐', label: 'Last Login',        val: user?.lastLogin ? new Date(user.lastLogin).toLocaleDateString('en-IN') : 'Today' },
            ].map(st => (
              <div key={st.label} className="card dash-stat-card">
                <div style={{ fontSize: 22, marginBottom: 6 }}>{st.icon}</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 800, marginBottom: 2 }}>{st.val}</div>
                <div style={{ fontSize: 11, color: 'var(--text3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em' }}>{st.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Tabs */}
        <div className="dash-tab-bar">
          {[['predictions', '📊 Predictions'], ['profile', '👤 Profile']].map(([t, label]) => (
            <button key={t} className={`dash-tab ${activeTab === t ? 'active' : ''}`} onClick={() => setActiveTab(t)}>{label}</button>
          ))}
        </div>

        {/* ── Tab: Predictions ── */}
        {activeTab === 'predictions' && (
          <div>
            {loadingPreds ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[...Array(4)].map((_, i) => <div key={i} className="skeleton" style={{ height: 80, borderRadius: 'var(--r2)' }} />)}
              </div>
            ) : predictions.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🎯</div>
                <div className="empty-title">No predictions yet</div>
                <div className="empty-sub">Run your first prediction to see colleges tailored to your score.</div>
                <Link to="/predictor" className="btn btn-grad" style={{ display: 'inline-flex', marginTop: 8 }}>Start Predicting →</Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {predictions.map((pred, i) => (
                  <motion.div key={pred._id} className="card pred-history-row"
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                    <div style={{ textAlign: 'center', minWidth: 56 }}>
                      <div className="pred-pct">{pred.input?.percentile}</div>
                      <div style={{ fontSize: 10, color: 'var(--text3)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em' }}>Percentile</div>
                    </div>
                    <div className="divider-v" />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 3 }}>
                        {(pred.input?.preferredBranches || ['Any']).join(', ')} · {pred.input?.category}
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--text3)' }}>
                        {pred.totalMatches} colleges · {new Date(pred.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                      <Link to={`/results/${pred._id}`} className="btn btn-ghost btn-sm">View →</Link>
                      <button className="btn btn-danger btn-sm" disabled={deleting === pred._id}
                        onClick={() => handleDelete(pred._id)}>
                        {deleting === pred._id ? '...' : '🗑'}
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Tab: Profile ── */}
        {activeTab === 'profile' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
            <div className="card" style={{ padding: 28, maxWidth: 560, marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 800 }}>Profile Information</h2>
                {!editing && <button className="btn btn-ghost btn-sm" onClick={startEdit}>✏️ Edit</button>}
              </div>

              {editing ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input className="form-input" value={profileForm.name} onChange={e => setProfileForm(f => ({ ...f, name: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone (optional)</label>
                    <input className="form-input" value={profileForm.phone} onChange={e => setProfileForm(f => ({ ...f, phone: e.target.value }))} placeholder="+91 98765 43210" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Category</label>
                    <select className="form-select" value={profileForm.category} onChange={e => setProfileForm(f => ({ ...f, category: e.target.value }))}>
                      <option value="">— Select —</option>
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                    <button className="btn btn-grad" onClick={saveProfile} disabled={savingProfile}>
                      {savingProfile ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button className="btn btn-ghost" onClick={() => setEditing(false)}>Cancel</button>
                  </div>
                </div>
              ) : (
                <div>
                  {[
                    { label: 'Full Name',          val: user?.name },
                    { label: 'Email',               val: user?.email },
                    { label: 'Phone',               val: user?.phone || '—' },
                    { label: 'Category',            val: user?.category || '—' },
                    { label: 'Total Predictions',   val: user?.totalPredictions ?? 0 },
                  ].map(row => (
                    <div key={row.label} className="profile-row">
                      <span className="profile-row-label">{row.label}</span>
                      <span className="profile-row-val">{row.val}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Change password */}
            <div className="card" style={{ padding: 24, maxWidth: 560, marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: changingPw ? 20 : 0 }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 800 }}>🔒 Change Password</h3>
                {!changingPw && <button className="btn btn-ghost btn-sm" onClick={() => setChangingPw(true)}>Change</button>}
              </div>
              {changingPw && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
                  {[['current', 'Current Password'], ['next', 'New Password'], ['confirm', 'Confirm New Password']].map(([key, label]) => (
                    <div key={key} className="form-group">
                      <label className="form-label">{label}</label>
                      <input type="password" className="form-input" value={pwForm[key]} onChange={e => setPwForm(f => ({ ...f, [key]: e.target.value }))} />
                    </div>
                  ))}
                  <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                    <button className="btn btn-grad" onClick={savePassword} disabled={savingPw}>{savingPw ? 'Saving...' : 'Update Password'}</button>
                    <button className="btn btn-ghost" onClick={() => { setChangingPw(false); setPwForm({ current: '', next: '', confirm: '' }); }}>Cancel</button>
                  </div>
                </div>
              )}
            </div>

            {/* Danger zone */}
            <div className="card danger-zone-card" style={{ padding: 24, maxWidth: 560 }}>
              <div className="danger-zone-title">Danger Zone</div>
              <p style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 14 }}>Signing out will require you to log in again on this device.</p>
              <button className="btn btn-danger btn-sm" onClick={() => { logout(); navigate('/'); toast.success('Signed out.'); }}>
                🚪 Sign Out
              </button>
            </div>
          </motion.div>
        )}

      </div>
    </div>
  );
}
