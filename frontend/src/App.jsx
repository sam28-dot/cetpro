/**
 * App.jsx — Root component
 * Wires up providers, router, and protected/public route guards.
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

// Layout
import Navbar from './components/layout/Navbar';
import BottomNav from './components/layout/BottomNav';

// Pages
import Landing    from './pages/Landing';
import Login      from './pages/Login';
import Signup     from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword  from './pages/ResetPassword';
import Predictor  from './pages/Predictor';
import Results    from './pages/Results';
import Dashboard  from './pages/Dashboard';
import PredictionDetail from './pages/PredictionDetail';
import Compare    from './pages/Compare';
import About      from './pages/About';
import SharedResult from './pages/SharedResult';
import NotFound   from './pages/NotFound';
import HistoricalCutoffs from './pages/HistoricalCutoffs';

import './styles/globals.css';
import './styles/components.css';

// ── Route guards ──────────────────────────────────────────────────
const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <FullPageSpinner />;
  return user ? children : <Navigate to="/login" replace />;
};

const PublicOnlyRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <FullPageSpinner />;
  return user ? <Navigate to="/dashboard" replace /> : children;
};

const FullPageSpinner = () => (
  <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'var(--bg)' }}>
    <div style={{ width:36, height:36, borderRadius:'50%', border:'3px solid var(--surface2)', borderTopColor:'var(--accent)', animation:'spin 0.7s linear infinite' }} />
  </div>
);

// ── App shell ─────────────────────────────────────────────────────
const AUTH_PATHS = ['/login', '/signup', '/forgot-password', '/reset-password', '/share/'];

const AppShell = () => {
  const { user } = useAuth();
  const { pathname } = useLocation();
  const isAuthPage = AUTH_PATHS.some(p => pathname.startsWith(p));

  return (
    <>
      {!isAuthPage && <Navbar />}
      <Routes>
        {/* Public */}
        <Route path="/"          element={<Landing />} />
        <Route path="/about"     element={<About />} />
        <Route path="/historical-cutoffs" element={<HistoricalCutoffs />} />
        <Route path="/share/:token" element={<SharedResult />} />

        {/* Auth (public only when logged out) */}
        <Route path="/login"    element={<PublicOnlyRoute><Login /></PublicOnlyRoute>} />
        <Route path="/signup"   element={<PublicOnlyRoute><Signup /></PublicOnlyRoute>} />
        <Route path="/forgot-password" element={<PublicOnlyRoute><ForgotPassword /></PublicOnlyRoute>} />
        <Route path="/reset-password"  element={<ResetPassword />} />

        {/* Protected */}
        <Route path="/predictor"  element={<PrivateRoute><Predictor /></PrivateRoute>} />
        <Route path="/results/:id" element={<PrivateRoute><Results /></PrivateRoute>} />
        <Route path="/dashboard"  element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/prediction/:id" element={<PrivateRoute><PredictionDetail /></PrivateRoute>} />
        <Route path="/compare"    element={<PrivateRoute><Compare /></PrivateRoute>} />

        <Route path="*" element={<NotFound />} />
      </Routes>
      {!isAuthPage && user && <BottomNav />}
    </>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <AppShell />
          <Toaster
            position="bottom-right"
            toastOptions={{
              className: 'custom-toast',
              duration: 3500,
              style: { fontFamily: "'DM Sans', sans-serif" },
            }}
          />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
