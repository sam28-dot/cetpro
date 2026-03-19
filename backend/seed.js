/**
 * seed.js — Database seed script
 * Creates a test user and a sample prediction for development.
 *
 * Usage:
 *   cd backend
 *   cp .env.example .env   # fill in MONGODB_URI
 *   node seed.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Prediction = require('./models/Prediction');
const { COLLEGE_DB, CATEGORY_ADJUSTMENTS } = require('./data/colleges');

// ── Prediction engine (same as controller) ────────────────────────
const median = (arr) => {
  const s = [...arr].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 === 0 ? (s[m - 1] + s[m]) / 2 : s[m];
};

const calcScore = (college, branchData) => {
  let score = 0;
  score += (branchData.placement / 100) * 30;
  score += Math.min((branchData.avgPkg / 20) * 20, 20);
  if (college.nirf > 0) score += Math.max(0, (200 - college.nirf) / 200) * 15;
  else score += 5;
  const arr = Object.values(branchData.cutoffs)[0];
  const mean = arr.reduce((a, b) => a + b) / arr.length;
  const std = Math.sqrt(arr.reduce((a, b) => a + (b - mean) ** 2, 0) / arr.length);
  score += Math.max(0, (2 - std) / 2) * 15;
  score += (1 - Math.min(college.fees / 250000, 1)) * 10;
  if (college.autonomous) score += 5;
  if (college.tier === 1) score += 5;
  return Math.round(Math.min(score, 100));
};

const runEngine = (input) => {
  const { percentile, category, location, collegeType, maxFees, preferredBranches } = input;
  const adj = CATEGORY_ADJUSTMENTS[category] || 0;
  const effectivePct = Math.min(parseFloat(percentile) + adj, 99.99);
  const safe = [], moderate = [], dream = [];

  for (const college of COLLEGE_DB) {
    if (location && location !== 'any' && college.location !== location) continue;
    if (college.fees > (maxFees || 300000)) continue;
    if (collegeType === 'autonomous' && !college.autonomous) continue;
    if (collegeType === 'non-autonomous' && college.autonomous) continue;

    for (const [branchKey, branchData] of Object.entries(college.branches)) {
      if (!preferredBranches.includes('any') && !preferredBranches.includes(branchKey)) continue;
      const cutoffArr = branchData.cutoffs[category] || branchData.cutoffs.OPEN;
      const medCutoff = median(cutoffArr);
      const gap = effectivePct - medCutoff;
      const score = calcScore(college, branchData);
      const entry = {
        collegeId: college.id, collegeName: college.name, shortName: college.shortName,
        branch: branchKey, location: college.location, tier: college.tier, fees: college.fees,
        cutoffPercentile: Math.round(medCutoff * 100) / 100, placementRate: branchData.placement,
        avgPackage: branchData.avgPkg, maxPackage: branchData.maxPkg,
        autonomous: college.autonomous, type: college.type, nirf: college.nirf,
        gap: Math.round(gap * 100) / 100, score,
        category: gap >= 3 ? 'safe' : gap >= -4 ? 'moderate' : 'dream',
      };
      if (gap >= 3) safe.push(entry);
      else if (gap >= -4) moderate.push(entry);
      else if (gap >= -10) dream.push(entry);
    }
  }
  const sort = (arr) => arr.sort((a, b) => b.score - a.score).slice(0, 20);
  return { safe: sort(safe), moderate: sort(moderate), dream: sort(dream) };
};

// ── Sample users ──────────────────────────────────────────────────
const SEED_USERS = [
  {
    name: 'Samyak Ahiwale',
    email: 'samyak@test.com',
    password: 'Test1234',
    category: 'SC',
    homeUniversity: 'mumbai',
    preferredBranches: ['CSE', 'IT'],
    stream: 'engineering',
  },
  {
    name: 'Test Student',
    email: 'student@test.com',
    password: 'Test1234',
    category: 'OPEN',
    homeUniversity: 'pune',
    preferredBranches: ['CSE', 'AIML'],
    stream: 'engineering',
  },
  {
    name: 'Pharmacy Student',
    email: 'pharma@test.com',
    password: 'Test1234',
    category: 'OBC',
    homeUniversity: 'mumbai',
    preferredBranches: ['BPHARM', 'PHARMD'],
    stream: 'pharmacy',
  },
];

// ── Seed function ─────────────────────────────────────────────────
async function seed() {
  console.log('🌱 Connecting to MongoDB...');
  await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 10000 });
  console.log('✅ Connected\n');

  // Optionally clear existing seed data
  const shouldClear = process.argv.includes('--clear');
  if (shouldClear) {
    await User.deleteMany({ email: { $in: SEED_USERS.map(u => u.email) } });
    console.log('🗑  Cleared existing seed users\n');
  }

  for (const userData of SEED_USERS) {
    try {
      // Check if user exists
      let user = await User.findOne({ email: userData.email });
      if (user) {
        console.log(`ℹ️  User already exists: ${userData.email}`);
      } else {
        user = await User.create({
          name: userData.name,
          email: userData.email,
          password: userData.password,
          category: userData.category,
          homeUniversity: userData.homeUniversity,
          preferredBranches: userData.preferredBranches,
        });
        console.log(`✅ Created user: ${userData.name} (${userData.email})`);
      }

      // Create a sample prediction for each user
      const input = {
        percentile: userData.category === 'SC' ? 88 : userData.stream === 'pharmacy' ? 78 : 94,
        category: userData.category,
        gender: 'any',
        homeUniversity: userData.homeUniversity,
        preferredBranches: userData.preferredBranches,
        location: 'any',
        collegeType: 'any',
        maxFees: 200000,
        stream: userData.stream || 'engineering',
      };
      const results = runEngine(input);
      const totalMatches = results.safe.length + results.moderate.length + results.dream.length;

      const crypto = require('crypto');
      const pred = await Prediction.create({
        user: user._id,
        input,
        results,
        totalMatches,
        shareToken: crypto.randomBytes(8).toString('hex'),
        isPublic: false,
      });

      await User.findByIdAndUpdate(user._id, { $inc: { totalPredictions: 1 } });
      console.log(`   📊 Created prediction: ${totalMatches} matches (${results.safe.length} safe, ${results.moderate.length} moderate, ${results.dream.length} dream)`);
      console.log(`   🔗 Prediction ID: ${pred._id}\n`);

    } catch (err) {
      console.error(`❌ Error seeding ${userData.email}:`, err.message);
    }
  }

  console.log('─────────────────────────────────────────');
  console.log('✅ Seed complete!\n');
  console.log('Test accounts:');
  SEED_USERS.forEach(u => console.log(`  Email: ${u.email}  |  Password: ${u.password}`));
  console.log('\n🚀 Run: cd backend && npm run dev');

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch(err => {
  console.error('Seed failed:', err);
  process.exit(1);
});
