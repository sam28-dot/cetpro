/**
 * Prediction Model
 * Stores each user's prediction session: input params + results.
 */

const mongoose = require('mongoose');

const collegeResultSchema = new mongoose.Schema(
  {
    collegeId: { type: Number, required: true },
    collegeName: { type: String, required: true },
    shortName: { type: String },
    branch: { type: String, required: true },
    stream: { type: String, enum: ['engineering', 'pharmacy'] },
    location: { type: String },
    tier: { type: Number },
    fees: { type: Number },
    cutoffPercentile: { type: Number },
    officialCategoryCode: { type: String },
    choiceCode: { type: String },
    academicYear: { type: String },
    cutoffRound: { type: String },
    cutoffSourceUrl: { type: String },
    placementRate: { type: Number },
    avgPackage: { type: Number },
    maxPackage: { type: Number },
    autonomous: { type: Boolean },
    type: { type: String },
    nirf: { type: Number },
    category: { type: String, enum: ['safe', 'moderate', 'dream'] },
    score: { type: Number },
    gap: { type: Number },
  },
  { _id: false }
);

const predictionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    // Input parameters
    input: {
      percentile: { type: Number, required: true },
      category: { type: String, required: true },
      gender: { type: String, default: 'any' },
      homeUniversity: { type: String, default: '' },
      preferredBranches: [{ type: String }],
      location: { type: String, default: 'any' },
      collegeType: { type: String, default: 'any' },
      maxFees: { type: Number, default: 300000 },
      stream: { type: String, default: 'engineering', enum: ['engineering', 'pharmacy', 'any'] },
    },
    // Results split by category
    results: {
      safe: [collegeResultSchema],
      moderate: [collegeResultSchema],
      dream: [collegeResultSchema],
    },
    totalMatches: { type: Number, default: 0 },
    // For shareable link
    shareToken: { type: String, unique: true, sparse: true },
    isPublic: { type: Boolean, default: false },
    // Soft label the user can set
    label: { type: String, default: '' },
  },
  {
    timestamps: true,
  }
);

// Index for fast user-lookup
predictionSchema.index({ user: 1, createdAt: -1 });
predictionSchema.index({ shareToken: 1 });

module.exports = mongoose.model('Prediction', predictionSchema);
