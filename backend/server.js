/**
 * CET Predictor Pro - Express Server
 * Production-ready entry point with security middleware, rate limiting, and DB connection.
 */

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

// Route imports
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const predictionRoutes = require('./routes/prediction');
const collegeRoutes = require('./routes/college');
const cutoffRoutes = require('./routes/cutoffs');
const instituteRoutes = require('./routes/institutes');

const app = express();

// Render terminates TLS and forwards requests through one trusted proxy hop.
// Configure this before rate limiters so Express can derive the client IP safely.
app.set('trust proxy', 1);

// ── Security headers ──────────────────────────────────────────────
app.use(helmet());

// ── CORS ──────────────────────────────────────────────────────────
// Keep the production frontend domains explicitly allow-listed.
// FRONTEND_URL may be configured to a different primary deployment URL.
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:3000',
  'https://cetpredictorpro.vercel.app',
  'https://cetpro-predictor.vercel.app',
  'https://cetpredictorpro.in',
  'https://www.cetpredictorpro.in',
];
app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
    cb(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));

// ── Body parsing ──────────────────────────────────────────────────
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// ── Request logging (dev only) ────────────────────────────────────
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ── Global rate limiter ──────────────────────────────────────────
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX) || 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests, please try again later.' },
});
app.use('/api/', limiter);

// Stricter limiter for auth routes (prevent brute-force)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, message: 'Too many login attempts, please try again in 15 minutes.' },
});
app.use('/api/auth/', authLimiter);

// ── Routes ────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/predictions', predictionRoutes);
app.use('/api/colleges', collegeRoutes);
app.use('/api/cutoffs', cutoffRoutes);
app.use('/api/institutes', instituteRoutes);

// ── Health check ─────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  const databaseState = mongoose.connection.readyState;
  const databaseConnected = databaseState === 1;
  const cutoffRecords = Array.isArray(require('./data/official-cutoffs-2025-26.json').records)
    ? require('./data/official-cutoffs-2025-26.json').records.length
    : 0;

  const health = {
    success: databaseConnected,
    status: databaseConnected ? 'healthy' : 'degraded',
    message: databaseConnected
      ? 'CET Predictor Pro API is running'
      : 'API is running but the database is not connected',
    database: databaseConnected ? 'connected' : 'disconnected',
    historicalCutoffs: {
      academicYear: '2025-26',
      round: 'CAP Round IV',
      records: cutoffRecords,
      mode: 'historical_comparison_only',
    },
    timestamp: new Date().toISOString(),
  };

  res.status(databaseConnected ? 200 : 503).json(health);
});

// ── 404 handler ───────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// ── Global error handler ──────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('[Error]', err.stack || err.message);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
  });
});

// ── MongoDB connection + server start ─────────────────────────────
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 10000,
  })
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT} [${process.env.NODE_ENV}]`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });

module.exports = app;
