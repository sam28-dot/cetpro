/**
 * colleges.js — Master college database
 * 25 Maharashtra engineering colleges, 5-year CAP round cutoff data per branch per category.
 * Source: DTE Maharashtra CAP allotment lists 2019-2024 (approximate / illustrative).
 */

const CATEGORY_ADJUSTMENTS = {
  OPEN: 0, EWS: 5, OBC: 8, 'NT-B': 10, 'NT-C': 10, 'NT-D': 10,
  'VJ-DT': 12, SBC: 10, SC: 18, ST: 25,
};

const COLLEGE_DB = [
  // ── TIER 1 ─────────────────────────────────────────────────────
  {
    id: 1, name: 'Veermata Jijabai Technological Institute (VJTI)',
    shortName: 'VJTI', location: 'mumbai', tier: 1, autonomous: true,
    type: 'govt', fees: 22000, nirf: 28, estd: 1887,
    branches: {
      CSE: { cutoffs: { OPEN:[99.2,99.1,99.3,99.0,99.4], OBC:[98.5,98.2,98.8,98.3,98.7], SC:[95.0,94.5,95.2,94.8,95.5], ST:[90.0,89.5,90.5,89.8,91.0] }, placement:94, avgPkg:14.2, maxPkg:44 },
      IT:  { cutoffs: { OPEN:[98.8,98.5,99.0,98.6,99.1], OBC:[97.8,97.5,98.2,97.6,98.0], SC:[93.5,93.0,94.0,93.2,94.2], ST:[88.5,88.0,89.0,88.2,89.5] }, placement:92, avgPkg:13.5, maxPkg:42 },
      EXTC:{ cutoffs: { OPEN:[98.0,97.8,98.2,97.9,98.4], OBC:[96.5,96.0,97.0,96.2,97.2], SC:[91.0,90.5,91.5,90.8,92.0], ST:[85.0,84.5,85.5,84.8,86.0] }, placement:88, avgPkg:11.8, maxPkg:36 },
      MECH:{ cutoffs: { OPEN:[97.0,96.5,97.2,96.8,97.5], OBC:[95.0,94.5,95.5,94.8,95.8], SC:[88.0,87.5,88.5,87.8,89.0], ST:[82.0,81.5,82.5,81.8,83.0] }, placement:85, avgPkg:10.2, maxPkg:28 },
    },
  },
  {
    id: 2, name: 'College of Engineering Pune (COEP Technetu)',
    shortName: 'COEP', location: 'pune', tier: 1, autonomous: true,
    type: 'govt', fees: 35000, nirf: 35, estd: 1854,
    branches: {
      CSE: { cutoffs: { OPEN:[99.0,98.8,99.2,98.9,99.3], OBC:[98.0,97.8,98.3,97.9,98.5], SC:[94.0,93.5,94.5,93.8,95.0], ST:[88.0,87.5,88.5,87.8,89.0] }, placement:93, avgPkg:13.8, maxPkg:42 },
      IT:  { cutoffs: { OPEN:[98.2,98.0,98.5,98.1,98.8], OBC:[96.8,96.5,97.2,96.6,97.5], SC:[91.5,91.0,92.0,91.2,92.5], ST:[85.5,85.0,86.0,85.2,86.5] }, placement:90, avgPkg:12.5, maxPkg:38 },
      AIML:{ cutoffs: { OPEN:[98.5,98.3,98.8,98.4,99.0], OBC:[97.5,97.2,97.8,97.3,98.0], SC:[93.0,92.5,93.5,92.8,94.0], ST:[87.0,86.5,87.5,86.8,88.0] }, placement:91, avgPkg:13.2, maxPkg:40 },
      EXTC:{ cutoffs: { OPEN:[97.5,97.2,97.8,97.3,98.0], OBC:[95.8,95.5,96.2,95.6,96.5], SC:[90.0,89.5,90.5,89.8,91.0], ST:[83.5,83.0,84.0,83.2,84.5] }, placement:87, avgPkg:11.2, maxPkg:30 },
      MECH:{ cutoffs: { OPEN:[96.5,96.2,96.8,96.3,97.0], OBC:[94.5,94.0,95.0,94.2,95.5], SC:[87.0,86.5,87.5,86.8,88.0], ST:[80.0,79.5,80.5,79.8,81.0] }, placement:83, avgPkg:9.8, maxPkg:26 },
    },
  },
  {
    id: 3, name: 'Visvesvaraya National Institute of Technology (VNIT)',
    shortName: 'VNIT Nagpur', location: 'nagpur', tier: 1, autonomous: true,
    type: 'govt', fees: 45000, nirf: 26, estd: 1960,
    branches: {
      CSE: { cutoffs: { OPEN:[99.5,99.3,99.6,99.4,99.7], OBC:[99.0,98.8,99.2,98.9,99.3], SC:[96.5,96.0,97.0,96.2,97.2], ST:[92.0,91.5,92.5,91.8,93.0] }, placement:96, avgPkg:16.5, maxPkg:52 },
      IT:  { cutoffs: { OPEN:[99.0,98.8,99.2,98.9,99.3], OBC:[98.2,98.0,98.5,98.1,98.8], SC:[95.0,94.5,95.5,94.8,96.0], ST:[90.0,89.5,90.5,89.8,91.0] }, placement:94, avgPkg:15.2, maxPkg:48 },
      ETRX:{ cutoffs: { OPEN:[98.5,98.2,98.8,98.3,99.0], OBC:[97.5,97.2,97.8,97.3,98.0], SC:[93.0,92.5,93.5,92.8,94.0], ST:[87.5,87.0,88.0,87.2,88.5] }, placement:90, avgPkg:12.8, maxPkg:38 },
      MECH:{ cutoffs: { OPEN:[97.5,97.2,97.8,97.3,98.0], OBC:[96.0,95.5,96.5,95.8,97.0], SC:[90.5,90.0,91.0,90.2,91.5], ST:[84.5,84.0,85.0,84.2,85.5] }, placement:86, avgPkg:10.5, maxPkg:28 },
    },
  },
  {
    id: 4, name: 'Walchand College of Engineering, Sangli',
    shortName: 'WCE Sangli', location: 'kolhapur', tier: 1, autonomous: true,
    type: 'govt', fees: 28000, nirf: 42, estd: 1947,
    branches: {
      CSE: { cutoffs: { OPEN:[97.5,97.2,97.8,97.3,98.0], OBC:[96.0,95.5,96.5,95.8,97.0], SC:[90.0,89.5,90.5,89.8,91.0], ST:[83.0,82.5,83.5,82.8,84.0] }, placement:88, avgPkg:11.5, maxPkg:34 },
      MECH:{ cutoffs: { OPEN:[94.0,93.5,94.5,93.8,95.0], OBC:[91.5,91.0,92.0,91.2,92.5], SC:[84.0,83.5,84.5,83.8,85.0], ST:[77.0,76.5,77.5,76.8,78.0] }, placement:80, avgPkg:8.5, maxPkg:22 },
      EXTC:{ cutoffs: { OPEN:[93.5,93.0,94.0,93.2,94.5], OBC:[90.5,90.0,91.0,90.2,91.5], SC:[82.5,82.0,83.0,82.2,83.5], ST:[75.5,75.0,76.0,75.2,76.5] }, placement:78, avgPkg:8.0, maxPkg:20 },
    },
  },
  // ── TIER 2 ─────────────────────────────────────────────────────
  {
    id: 5, name: 'KJ Somaiya College of Engineering',
    shortName: 'KJSCE', location: 'mumbai', tier: 2, autonomous: true,
    type: 'unaided', fees: 185000, nirf: 68, estd: 1983,
    branches: {
      CSE: { cutoffs: { OPEN:[94.5,94.0,95.0,94.2,95.5], OBC:[91.0,90.5,91.5,90.8,92.0], SC:[82.0,81.5,82.5,81.8,83.0], ST:[74.0,73.5,74.5,73.8,75.0] }, placement:85, avgPkg:8.5, maxPkg:26 },
      IT:  { cutoffs: { OPEN:[93.0,92.5,93.5,92.8,94.0], OBC:[89.5,89.0,90.0,89.2,90.5], SC:[80.0,79.5,80.5,79.8,81.0], ST:[72.0,71.5,72.5,71.8,73.0] }, placement:83, avgPkg:7.8, maxPkg:24 },
      AIML:{ cutoffs: { OPEN:[95.0,94.5,95.5,94.8,96.0], OBC:[92.0,91.5,92.5,91.8,93.0], SC:[83.5,83.0,84.0,83.2,84.5], ST:[75.5,75.0,76.0,75.2,76.5] }, placement:86, avgPkg:9.2, maxPkg:28 },
      EXTC:{ cutoffs: { OPEN:[89.0,88.5,89.5,88.8,90.0], OBC:[85.0,84.5,85.5,84.8,86.0], SC:[75.0,74.5,75.5,74.8,76.0], ST:[67.0,66.5,67.5,66.8,68.0] }, placement:78, avgPkg:6.5, maxPkg:18 },
    },
  },
  {
    id: 6, name: 'Thadomal Shahani Engineering College',
    shortName: 'TSEC', location: 'mumbai', tier: 2, autonomous: true,
    type: 'aided', fees: 58000, nirf: 75, estd: 1983,
    branches: {
      CSE: { cutoffs: { OPEN:[92.0,91.5,92.5,91.8,93.0], OBC:[87.5,87.0,88.0,87.2,88.5], SC:[77.0,76.5,77.5,76.8,78.0], ST:[68.0,67.5,68.5,67.8,69.0] }, placement:82, avgPkg:7.5, maxPkg:22 },
      IT:  { cutoffs: { OPEN:[90.5,90.0,91.0,90.2,91.5], OBC:[86.0,85.5,86.5,85.8,87.0], SC:[75.5,75.0,76.0,75.2,76.5], ST:[66.5,66.0,67.0,66.2,67.5] }, placement:80, avgPkg:7.0, maxPkg:20 },
      EXTC:{ cutoffs: { OPEN:[86.0,85.5,86.5,85.8,87.0], OBC:[81.5,81.0,82.0,81.2,82.5], SC:[70.5,70.0,71.0,70.2,71.5], ST:[62.0,61.5,62.5,61.8,63.0] }, placement:74, avgPkg:5.8, maxPkg:16 },
    },
  },
  {
    id: 7, name: 'Dwarkadas J Sanghvi College of Engineering',
    shortName: 'DJSCE', location: 'mumbai', tier: 2, autonomous: true,
    type: 'unaided', fees: 168000, nirf: 82, estd: 1994,
    branches: {
      CSE: { cutoffs: { OPEN:[93.5,93.0,94.0,93.2,94.5], OBC:[89.0,88.5,89.5,88.8,90.0], SC:[79.0,78.5,79.5,78.8,80.0], ST:[70.0,69.5,70.5,69.8,71.0] }, placement:84, avgPkg:8.2, maxPkg:25 },
      IT:  { cutoffs: { OPEN:[91.5,91.0,92.0,91.2,92.5], OBC:[87.0,86.5,87.5,86.8,88.0], SC:[77.0,76.5,77.5,76.8,78.0], ST:[68.0,67.5,68.5,67.8,69.0] }, placement:82, avgPkg:7.6, maxPkg:23 },
      DS:  { cutoffs: { OPEN:[94.0,93.5,94.5,93.8,95.0], OBC:[90.0,89.5,90.5,89.8,91.0], SC:[80.5,80.0,81.0,80.2,81.5], ST:[71.5,71.0,72.0,71.2,72.5] }, placement:85, avgPkg:8.8, maxPkg:27 },
      AIML:{ cutoffs: { OPEN:[94.5,94.0,95.0,94.2,95.5], OBC:[91.0,90.5,91.5,90.8,92.0], SC:[81.5,81.0,82.0,81.2,82.5], ST:[72.5,72.0,73.0,72.2,73.5] }, placement:86, avgPkg:9.0, maxPkg:28 },
    },
  },
  {
    id: 8, name: 'Pune Institute of Computer Technology',
    shortName: 'PICT', location: 'pune', tier: 2, autonomous: true,
    type: 'unaided', fees: 155000, nirf: 88, estd: 1983,
    branches: {
      CSE: { cutoffs: { OPEN:[95.5,95.0,96.0,95.2,96.5], OBC:[92.5,92.0,93.0,92.2,93.5], SC:[84.0,83.5,84.5,83.8,85.0], ST:[76.0,75.5,76.5,75.8,77.0] }, placement:87, avgPkg:9.5, maxPkg:32 },
      IT:  { cutoffs: { OPEN:[94.0,93.5,94.5,93.8,95.0], OBC:[90.5,90.0,91.0,90.2,91.5], SC:[81.5,81.0,82.0,81.2,82.5], ST:[73.0,72.5,73.5,72.8,74.0] }, placement:85, avgPkg:8.8, maxPkg:28 },
      DS:  { cutoffs: { OPEN:[95.0,94.5,95.5,94.8,96.0], OBC:[91.5,91.0,92.0,91.2,92.5], SC:[83.0,82.5,83.5,82.8,84.0], ST:[74.5,74.0,75.0,74.2,75.5] }, placement:86, avgPkg:9.2, maxPkg:30 },
    },
  },
  {
    id: 9, name: 'Vishwakarma Institute of Technology',
    shortName: 'VIT Pune', location: 'pune', tier: 2, autonomous: true,
    type: 'unaided', fees: 162000, nirf: 91, estd: 1983,
    branches: {
      CSE: { cutoffs: { OPEN:[94.0,93.5,94.5,93.8,95.0], OBC:[90.0,89.5,90.5,89.8,91.0], SC:[80.5,80.0,81.0,80.2,81.5], ST:[72.0,71.5,72.5,71.8,73.0] }, placement:84, avgPkg:8.5, maxPkg:26 },
      IT:  { cutoffs: { OPEN:[92.5,92.0,93.0,92.2,93.5], OBC:[88.5,88.0,89.0,88.2,89.5], SC:[78.5,78.0,79.0,78.2,79.5], ST:[70.0,69.5,70.5,69.8,71.0] }, placement:82, avgPkg:7.8, maxPkg:24 },
      AIML:{ cutoffs: { OPEN:[94.5,94.0,95.0,94.2,95.5], OBC:[91.0,90.5,91.5,90.8,92.0], SC:[81.5,81.0,82.0,81.2,82.5], ST:[73.0,72.5,73.5,72.8,74.0] }, placement:85, avgPkg:9.0, maxPkg:28 },
    },
  },
  {
    id: 10, name: "Cummins College of Engineering for Women",
    shortName: 'Cummins Pune', location: 'pune', tier: 2, autonomous: true,
    type: 'unaided', fees: 142000, nirf: 88, estd: 1991,
    branches: {
      CSE: { cutoffs: { OPEN:[93.0,92.5,93.5,92.8,94.0], OBC:[88.5,88.0,89.0,88.2,89.5], SC:[78.5,78.0,79.0,78.2,79.5], ST:[70.0,69.5,70.5,69.8,71.0] }, placement:82, avgPkg:8.0, maxPkg:24 },
      IT:  { cutoffs: { OPEN:[91.5,91.0,92.0,91.2,92.5], OBC:[87.0,86.5,87.5,86.8,88.0], SC:[76.5,76.0,77.0,76.2,77.5], ST:[68.0,67.5,68.5,67.8,69.0] }, placement:80, avgPkg:7.2, maxPkg:22 },
      DS:  { cutoffs: { OPEN:[93.5,93.0,94.0,93.2,94.5], OBC:[89.0,88.5,89.5,88.8,90.0], SC:[79.5,79.0,80.0,79.2,80.5], ST:[71.0,70.5,71.5,70.8,72.0] }, placement:83, avgPkg:8.5, maxPkg:25 },
    },
  },
  {
    id: 11, name: 'Shah and Anchor Kutchhi Engineering College',
    shortName: 'SAKEC', location: 'mumbai', tier: 2, autonomous: false,
    type: 'unaided', fees: 148000, nirf: 105, estd: 1996,
    branches: {
      CSE: { cutoffs: { OPEN:[91.0,90.5,91.5,90.8,92.0], OBC:[86.5,86.0,87.0,86.2,87.5], SC:[76.0,75.5,76.5,75.8,77.0], ST:[67.0,66.5,67.5,66.8,68.0] }, placement:81, avgPkg:7.5, maxPkg:22 },
      IT:  { cutoffs: { OPEN:[89.5,89.0,90.0,89.2,90.5], OBC:[84.5,84.0,85.0,84.2,85.5], SC:[74.0,73.5,74.5,73.8,75.0], ST:[65.0,64.5,65.5,64.8,66.0] }, placement:79, avgPkg:7.0, maxPkg:20 },
      DS:  { cutoffs: { OPEN:[92.0,91.5,92.5,91.8,93.0], OBC:[87.5,87.0,88.0,87.2,88.5], SC:[77.0,76.5,77.5,76.8,78.0], ST:[68.0,67.5,68.5,67.8,69.0] }, placement:82, avgPkg:7.8, maxPkg:23 },
    },
  },
  {
    id: 12, name: 'G.H. Raisoni College of Engineering, Nagpur',
    shortName: 'GHRCE', location: 'nagpur', tier: 2, autonomous: true,
    type: 'unaided', fees: 118000, nirf: 102, estd: 1996,
    branches: {
      CSE: { cutoffs: { OPEN:[88.0,87.5,88.5,87.8,89.0], OBC:[83.0,82.5,83.5,82.8,84.0], SC:[72.0,71.5,72.5,71.8,73.0], ST:[63.0,62.5,63.5,62.8,64.0] }, placement:78, avgPkg:6.5, maxPkg:18 },
      IT:  { cutoffs: { OPEN:[86.5,86.0,87.0,86.2,87.5], OBC:[81.5,81.0,82.0,81.2,82.5], SC:[70.5,70.0,71.0,70.2,71.5], ST:[61.5,61.0,62.0,61.2,62.5] }, placement:76, avgPkg:6.0, maxPkg:16 },
      AIML:{ cutoffs: { OPEN:[89.0,88.5,89.5,88.8,90.0], OBC:[84.0,83.5,84.5,83.8,85.0], SC:[73.0,72.5,73.5,72.8,74.0], ST:[64.0,63.5,64.5,63.8,65.0] }, placement:79, avgPkg:6.8, maxPkg:19 },
    },
  },
  {
    id: 13, name: 'Fr. Conceicao Rodrigues Institute of Technology',
    shortName: 'FCRIT', location: 'thane', tier: 2, autonomous: false,
    type: 'aided', fees: 52000, nirf: 112, estd: 1985,
    branches: {
      CSE: { cutoffs: { OPEN:[90.0,89.5,90.5,89.8,91.0], OBC:[85.5,85.0,86.0,85.2,86.5], SC:[74.5,74.0,75.0,74.2,75.5], ST:[65.5,65.0,66.0,65.2,66.5] }, placement:80, avgPkg:7.0, maxPkg:20 },
      IT:  { cutoffs: { OPEN:[88.5,88.0,89.0,88.2,89.5], OBC:[84.0,83.5,84.5,83.8,85.0], SC:[73.0,72.5,73.5,72.8,74.0], ST:[64.0,63.5,64.5,63.8,65.0] }, placement:78, avgPkg:6.5, maxPkg:18 },
      EXTC:{ cutoffs: { OPEN:[84.0,83.5,84.5,83.8,85.0], OBC:[79.0,78.5,79.5,78.8,80.0], SC:[68.0,67.5,68.5,67.8,69.0], ST:[59.0,58.5,59.5,58.8,60.0] }, placement:72, avgPkg:5.5, maxPkg:14 },
    },
  },
  {
    id: 14, name: 'Terna Engineering College, Navi Mumbai',
    shortName: 'TEC Navi Mumbai', location: 'thane', tier: 2, autonomous: false,
    type: 'unaided', fees: 98000, nirf: 118, estd: 1999,
    branches: {
      CSE: { cutoffs: { OPEN:[88.0,87.5,88.5,87.8,89.0], OBC:[83.0,82.5,83.5,82.8,84.0], SC:[72.0,71.5,72.5,71.8,73.0], ST:[63.0,62.5,63.5,62.8,64.0] }, placement:76, avgPkg:6.2, maxPkg:17 },
      AIML:{ cutoffs: { OPEN:[89.0,88.5,89.5,88.8,90.0], OBC:[84.0,83.5,84.5,83.8,85.0], SC:[73.5,73.0,74.0,73.2,74.5], ST:[64.5,64.0,65.0,64.2,65.5] }, placement:77, avgPkg:6.5, maxPkg:18 },
      IT:  { cutoffs: { OPEN:[86.5,86.0,87.0,86.2,87.5], OBC:[81.5,81.0,82.0,81.2,82.5], SC:[70.5,70.0,71.0,70.2,71.5], ST:[61.5,61.0,62.0,61.2,62.5] }, placement:74, avgPkg:5.8, maxPkg:15 },
    },
  },
  {
    id: 15, name: 'Symbiosis Institute of Technology, Pune',
    shortName: 'SIT Pune', location: 'pune', tier: 2, autonomous: false,
    type: 'unaided', fees: 210000, nirf: 95, estd: 2008,
    branches: {
      CSE: { cutoffs: { OPEN:[93.0,92.5,93.5,92.8,94.0], OBC:[88.5,88.0,89.0,88.2,89.5], SC:[79.0,78.5,79.5,78.8,80.0], ST:[70.5,70.0,71.0,70.2,71.5] }, placement:83, avgPkg:8.2, maxPkg:24 },
      AIML:{ cutoffs: { OPEN:[93.5,93.0,94.0,93.2,94.5], OBC:[89.0,88.5,89.5,88.8,90.0], SC:[79.5,79.0,80.0,79.2,80.5], ST:[71.0,70.5,71.5,70.8,72.0] }, placement:84, avgPkg:8.5, maxPkg:25 },
    },
  },
  // ── TIER 3 ─────────────────────────────────────────────────────
  {
    id: 16, name: 'Pillai College of Engineering, Navi Mumbai',
    shortName: 'PCE Panvel', location: 'thane', tier: 3, autonomous: false,
    type: 'unaided', fees: 135000, nirf: 145, estd: 2001,
    branches: {
      CSE: { cutoffs: { OPEN:[82.0,81.5,82.5,81.8,83.0], OBC:[76.0,75.5,76.5,75.8,77.0], SC:[65.0,64.5,65.5,64.8,66.0], ST:[56.0,55.5,56.5,55.8,57.0] }, placement:70, avgPkg:4.8, maxPkg:12 },
      IT:  { cutoffs: { OPEN:[80.0,79.5,80.5,79.8,81.0], OBC:[74.5,74.0,75.0,74.2,75.5], SC:[63.5,63.0,64.0,63.2,64.5], ST:[54.5,54.0,55.0,54.2,55.5] }, placement:68, avgPkg:4.5, maxPkg:11 },
      AIML:{ cutoffs: { OPEN:[83.5,83.0,84.0,83.2,84.5], OBC:[77.5,77.0,78.0,77.2,78.5], SC:[66.5,66.0,67.0,66.2,67.5], ST:[57.5,57.0,58.0,57.2,58.5] }, placement:71, avgPkg:5.0, maxPkg:13 },
    },
  },
  {
    id: 17, name: 'Atharva College of Engineering, Mumbai',
    shortName: 'Atharva Mumbai', location: 'mumbai', tier: 3, autonomous: false,
    type: 'unaided', fees: 122000, nirf: 158, estd: 2004,
    branches: {
      CSE: { cutoffs: { OPEN:[80.0,79.5,80.5,79.8,81.0], OBC:[74.0,73.5,74.5,73.8,75.0], SC:[63.0,62.5,63.5,62.8,64.0], ST:[54.0,53.5,54.5,53.8,55.0] }, placement:68, avgPkg:4.5, maxPkg:11 },
      IT:  { cutoffs: { OPEN:[78.0,77.5,78.5,77.8,79.0], OBC:[72.0,71.5,72.5,71.8,73.0], SC:[61.0,60.5,61.5,60.8,62.0], ST:[52.0,51.5,52.5,51.8,53.0] }, placement:66, avgPkg:4.2, maxPkg:10 },
      EXTC:{ cutoffs: { OPEN:[73.0,72.5,73.5,72.8,74.0], OBC:[67.5,67.0,68.0,67.2,68.5], SC:[56.5,56.0,57.0,56.2,57.5], ST:[47.5,47.0,48.0,47.2,48.5] }, placement:62, avgPkg:3.8, maxPkg:9 },
    },
  },
  {
    id: 18, name: 'Yashwantrao Chavan College of Engineering, Nagpur',
    shortName: 'YCCE Nagpur', location: 'nagpur', tier: 3, autonomous: true,
    type: 'unaided', fees: 88000, nirf: 0, estd: 1984,
    branches: {
      CSE: { cutoffs: { OPEN:[84.0,83.5,84.5,83.8,85.0], OBC:[78.5,78.0,79.0,78.2,79.5], SC:[67.5,67.0,68.0,67.2,68.5], ST:[58.5,58.0,59.0,58.2,59.5] }, placement:72, avgPkg:5.2, maxPkg:13 },
      IT:  { cutoffs: { OPEN:[82.0,81.5,82.5,81.8,83.0], OBC:[76.5,76.0,77.0,76.2,77.5], SC:[65.5,65.0,66.0,65.2,66.5], ST:[56.5,56.0,57.0,56.2,57.5] }, placement:70, avgPkg:4.8, maxPkg:12 },
      AIML:{ cutoffs: { OPEN:[85.0,84.5,85.5,84.8,86.0], OBC:[79.5,79.0,80.0,79.2,80.5], SC:[68.5,68.0,69.0,68.2,69.5], ST:[59.5,59.0,60.0,59.2,60.5] }, placement:73, avgPkg:5.5, maxPkg:14 },
    },
  },
  {
    id: 19, name: 'Sinhgad College of Engineering, Pune',
    shortName: 'SCOE Pune', location: 'pune', tier: 3, autonomous: false,
    type: 'unaided', fees: 108000, nirf: 135, estd: 1996,
    branches: {
      CSE: { cutoffs: { OPEN:[85.0,84.5,85.5,84.8,86.0], OBC:[79.5,79.0,80.0,79.2,80.5], SC:[68.5,68.0,69.0,68.2,69.5], ST:[59.5,59.0,60.0,59.2,60.5] }, placement:73, avgPkg:5.8, maxPkg:15 },
      IT:  { cutoffs: { OPEN:[83.5,83.0,84.0,83.2,84.5], OBC:[78.0,77.5,78.5,77.8,79.0], SC:[67.0,66.5,67.5,66.8,68.0], ST:[58.0,57.5,58.5,57.8,59.0] }, placement:71, avgPkg:5.2, maxPkg:13 },
      MECH:{ cutoffs: { OPEN:[76.0,75.5,76.5,75.8,77.0], OBC:[70.5,70.0,71.0,70.2,71.5], SC:[59.5,59.0,60.0,59.2,60.5], ST:[50.5,50.0,51.0,50.2,51.5] }, placement:64, avgPkg:3.8, maxPkg:9 },
    },
  },
  {
    id: 20, name: 'NDMVPS College of Engineering, Nashik',
    shortName: 'NDMVPS Nashik', location: 'nashik', tier: 3, autonomous: false,
    type: 'unaided', fees: 82000, nirf: 0, estd: 1994,
    branches: {
      CSE: { cutoffs: { OPEN:[80.5,80.0,81.0,80.2,81.5], OBC:[74.5,74.0,75.0,74.2,75.5], SC:[63.5,63.0,64.0,63.2,64.5], ST:[54.5,54.0,55.0,54.2,55.5] }, placement:68, avgPkg:4.5, maxPkg:11 },
      MECH:{ cutoffs: { OPEN:[72.5,72.0,73.0,72.2,73.5], OBC:[66.5,66.0,67.0,66.2,67.5], SC:[55.5,55.0,56.0,55.2,56.5], ST:[46.5,46.0,47.0,46.2,47.5] }, placement:62, avgPkg:3.5, maxPkg:8 },
    },
  },
  {
    id: 21, name: 'Marathwada Institute of Technology, Aurangabad',
    shortName: 'MIT Aurangabad', location: 'aurangabad', tier: 3, autonomous: false,
    type: 'unaided', fees: 75000, nirf: 0, estd: 1983,
    branches: {
      CSE: { cutoffs: { OPEN:[78.0,77.5,78.5,77.8,79.0], OBC:[72.0,71.5,72.5,71.8,73.0], SC:[61.0,60.5,61.5,60.8,62.0], ST:[52.0,51.5,52.5,51.8,53.0] }, placement:66, avgPkg:4.2, maxPkg:10 },
      MECH:{ cutoffs: { OPEN:[70.0,69.5,70.5,69.8,71.0], OBC:[64.0,63.5,64.5,63.8,65.0], SC:[53.0,52.5,53.5,52.8,54.0], ST:[44.0,43.5,44.5,43.8,45.0] }, placement:60, avgPkg:3.5, maxPkg:8 },
    },
  },
  {
    id: 22, name: 'Sipna College of Engineering, Amravati',
    shortName: 'SCOE Amravati', location: 'aurangabad', tier: 3, autonomous: false,
    type: 'unaided', fees: 62000, nirf: 0, estd: 1999,
    branches: {
      CSE: { cutoffs: { OPEN:[76.0,75.5,76.5,75.8,77.0], OBC:[70.0,69.5,70.5,69.8,71.0], SC:[59.0,58.5,59.5,58.8,60.0], ST:[50.0,49.5,50.5,49.8,51.0] }, placement:64, avgPkg:4.0, maxPkg:9 },
      MECH:{ cutoffs: { OPEN:[68.0,67.5,68.5,67.8,69.0], OBC:[62.0,61.5,62.5,61.8,63.0], SC:[51.0,50.5,51.5,50.8,52.0], ST:[42.0,41.5,42.5,41.8,43.0] }, placement:58, avgPkg:3.2, maxPkg:7 },
    },
  },
  {
    id: 23, name: 'MES College of Engineering, Pune',
    shortName: 'MESCOE', location: 'pune', tier: 3, autonomous: false,
    type: 'aided', fees: 38000, nirf: 0, estd: 1999,
    branches: {
      CSE: { cutoffs: { OPEN:[83.0,82.5,83.5,82.8,84.0], OBC:[77.0,76.5,77.5,76.8,78.0], SC:[66.0,65.5,66.5,65.8,67.0], ST:[57.0,56.5,57.5,56.8,58.0] }, placement:70, avgPkg:5.0, maxPkg:12 },
      IT:  { cutoffs: { OPEN:[81.0,80.5,81.5,80.8,82.0], OBC:[75.0,74.5,75.5,74.8,76.0], SC:[64.0,63.5,64.5,63.8,65.0], ST:[55.0,54.5,55.5,54.8,56.0] }, placement:68, avgPkg:4.5, maxPkg:11 },
    },
  },
  {
    id: 24, name: 'SIES Graduate School of Technology',
    shortName: 'SIES GST', location: 'thane', tier: 3, autonomous: false,
    type: 'unaided', fees: 115000, nirf: 0, estd: 1999,
    branches: {
      CSE: { cutoffs: { OPEN:[84.5,84.0,85.0,84.2,85.5], OBC:[79.0,78.5,79.5,78.8,80.0], SC:[68.0,67.5,68.5,67.8,69.0], ST:[59.0,58.5,59.5,58.8,60.0] }, placement:72, avgPkg:5.5, maxPkg:14 },
      IT:  { cutoffs: { OPEN:[82.5,82.0,83.0,82.2,83.5], OBC:[77.0,76.5,77.5,76.8,78.0], SC:[66.0,65.5,66.5,65.8,67.0], ST:[57.0,56.5,57.5,56.8,58.0] }, placement:70, avgPkg:5.0, maxPkg:12 },
    },
  },
  {
    id: 25, name: 'Rajiv Gandhi College of Engineering & Research',
    shortName: 'RGCER Nagpur', location: 'nagpur', tier: 3, autonomous: false,
    type: 'unaided', fees: 70000, nirf: 0, estd: 2008,
    branches: {
      CSE: { cutoffs: { OPEN:[75.0,74.5,75.5,74.8,76.0], OBC:[69.0,68.5,69.5,68.8,70.0], SC:[58.0,57.5,58.5,57.8,59.0], ST:[49.0,48.5,49.5,48.8,50.0] }, placement:62, avgPkg:3.8, maxPkg:9 },
      MECH:{ cutoffs: { OPEN:[67.0,66.5,67.5,66.8,68.0], OBC:[61.0,60.5,61.5,60.8,62.0], SC:[50.0,49.5,50.5,49.8,51.0], ST:[41.0,40.5,41.5,40.8,42.0] }, placement:56, avgPkg:3.0, maxPkg:7 },
    },
  },

  // ═══════════════════════════════════════════════════════════
  // PHARMACY COLLEGES — MHT-CET PCB/PCM Group
  // Cutoffs are MHT-CET percentile (PCB group for B.Pharm / Pharm.D)
  // ═══════════════════════════════════════════════════════════

  // ── Tier 1 Pharmacy ─────────────────────────────────────────
  {
    id: 101, name: 'Bombay College of Pharmacy',
    shortName: 'BCP Mumbai', location: 'mumbai', tier: 1, autonomous: true,
    type: 'aided', fees: 28000, nirf: 12, estd: 1957, stream: 'pharmacy',
    branches: {
      BPHARM:  { cutoffs: { OPEN:[92.0,91.5,92.5,91.8,93.0], OBC:[87.0,86.5,87.5,86.8,88.0], SC:[76.0,75.5,76.5,75.8,77.0], ST:[66.0,65.5,66.5,65.8,67.0] }, placement:88, avgPkg:5.8, maxPkg:14 },
      PHARMD:  { cutoffs: { OPEN:[93.5,93.0,94.0,93.2,94.5], OBC:[88.5,88.0,89.0,88.2,89.5], SC:[78.0,77.5,78.5,77.8,79.0], ST:[68.0,67.5,68.5,67.8,69.0] }, placement:90, avgPkg:6.5, maxPkg:16 },
      MPHARM:  { cutoffs: { OPEN:[88.0,87.5,88.5,87.8,89.0], OBC:[83.0,82.5,83.5,82.8,84.0], SC:[72.0,71.5,72.5,71.8,73.0], ST:[62.0,61.5,62.5,61.8,63.0] }, placement:85, avgPkg:5.2, maxPkg:12 },
    },
  },
  {
    id: 102, name: 'Government College of Pharmacy, Aurangabad',
    shortName: 'GCP Aurangabad', location: 'aurangabad', tier: 1, autonomous: false,
    type: 'govt', fees: 18000, nirf: 0, estd: 1965, stream: 'pharmacy',
    branches: {
      BPHARM:  { cutoffs: { OPEN:[88.0,87.5,88.5,87.8,89.0], OBC:[83.0,82.5,83.5,82.8,84.0], SC:[72.0,71.5,72.5,71.8,73.0], ST:[62.0,61.5,62.5,61.8,63.0] }, placement:82, avgPkg:4.8, maxPkg:11 },
      PHARMD:  { cutoffs: { OPEN:[89.5,89.0,90.0,89.2,90.5], OBC:[84.5,84.0,85.0,84.2,85.5], SC:[73.5,73.0,74.0,73.2,74.5], ST:[63.5,63.0,64.0,63.2,64.5] }, placement:83, avgPkg:5.0, maxPkg:12 },
      MPHARM:  { cutoffs: { OPEN:[84.0,83.5,84.5,83.8,85.0], OBC:[79.0,78.5,79.5,78.8,80.0], SC:[68.0,67.5,68.5,67.8,69.0], ST:[58.0,57.5,58.5,57.8,59.0] }, placement:78, avgPkg:4.2, maxPkg:10 },
    },
  },
  {
    id: 103, name: 'Dr. D.Y. Patil Institute of Pharmaceutical Sciences & Research, Pune',
    shortName: 'DYP Pharmacy Pune', location: 'pune', tier: 1, autonomous: true,
    type: 'unaided', fees: 95000, nirf: 22, estd: 2002, stream: 'pharmacy',
    branches: {
      BPHARM:  { cutoffs: { OPEN:[90.0,89.5,90.5,89.8,91.0], OBC:[85.0,84.5,85.5,84.8,86.0], SC:[74.0,73.5,74.5,73.8,75.0], ST:[64.0,63.5,64.5,63.8,65.0] }, placement:86, avgPkg:5.5, maxPkg:13 },
      PHARMD:  { cutoffs: { OPEN:[91.5,91.0,92.0,91.2,92.5], OBC:[86.5,86.0,87.0,86.2,87.5], SC:[75.5,75.0,76.0,75.2,76.5], ST:[65.5,65.0,66.0,65.2,66.5] }, placement:88, avgPkg:6.0, maxPkg:14 },
      MPHARM:  { cutoffs: { OPEN:[86.0,85.5,86.5,85.8,87.0], OBC:[81.0,80.5,81.5,80.8,82.0], SC:[70.0,69.5,70.5,69.8,71.0], ST:[60.0,59.5,60.5,59.8,61.0] }, placement:84, avgPkg:5.0, maxPkg:12 },
    },
  },
  {
    id: 104, name: 'Poona College of Pharmacy, Bharati Vidyapeeth',
    shortName: 'PCP Pune', location: 'pune', tier: 1, autonomous: false,
    type: 'unaided', fees: 72000, nirf: 0, estd: 1984, stream: 'pharmacy',
    branches: {
      BPHARM:  { cutoffs: { OPEN:[87.5,87.0,88.0,87.2,88.5], OBC:[82.5,82.0,83.0,82.2,83.5], SC:[71.5,71.0,72.0,71.2,72.5], ST:[61.5,61.0,62.0,61.2,62.5] }, placement:82, avgPkg:5.0, maxPkg:12 },
      PHARMD:  { cutoffs: { OPEN:[89.0,88.5,89.5,88.8,90.0], OBC:[84.0,83.5,84.5,83.8,85.0], SC:[73.0,72.5,73.5,72.8,74.0], ST:[63.0,62.5,63.5,62.8,64.0] }, placement:83, avgPkg:5.2, maxPkg:13 },
      MPHARM:  { cutoffs: { OPEN:[83.0,82.5,83.5,82.8,84.0], OBC:[78.0,77.5,78.5,77.8,79.0], SC:[67.0,66.5,67.5,66.8,68.0], ST:[57.0,56.5,57.5,56.8,58.0] }, placement:79, avgPkg:4.5, maxPkg:11 },
    },
  },

  // ── Tier 2 Pharmacy ─────────────────────────────────────────
  {
    id: 105, name: "Shri Vile Parle Kelvani Mandal's Institute of Pharmacy, Mumbai",
    shortName: 'SVKM Pharmacy', location: 'mumbai', tier: 2, autonomous: false,
    type: 'unaided', fees: 88000, nirf: 0, estd: 2001, stream: 'pharmacy',
    branches: {
      BPHARM: { cutoffs: { OPEN:[84.0,83.5,84.5,83.8,85.0], OBC:[79.0,78.5,79.5,78.8,80.0], SC:[68.0,67.5,68.5,67.8,69.0], ST:[58.0,57.5,58.5,57.8,59.0] }, placement:80, avgPkg:4.8, maxPkg:12 },
      PHARMD: { cutoffs: { OPEN:[85.5,85.0,86.0,85.2,86.5], OBC:[80.5,80.0,81.0,80.2,81.5], SC:[69.5,69.0,70.0,69.2,70.5], ST:[59.5,59.0,60.0,59.2,60.5] }, placement:81, avgPkg:5.0, maxPkg:12 },
    },
  },
  {
    id: 106, name: "Marathwada Mitra Mandal's College of Pharmacy, Pune",
    shortName: 'MMCP Pune', location: 'pune', tier: 2, autonomous: false,
    type: 'unaided', fees: 62000, nirf: 0, estd: 1986, stream: 'pharmacy',
    branches: {
      BPHARM: { cutoffs: { OPEN:[82.0,81.5,82.5,81.8,83.0], OBC:[77.0,76.5,77.5,76.8,78.0], SC:[66.0,65.5,66.5,65.8,67.0], ST:[56.0,55.5,56.5,55.8,57.0] }, placement:76, avgPkg:4.2, maxPkg:10 },
      MPHARM: { cutoffs: { OPEN:[78.0,77.5,78.5,77.8,79.0], OBC:[73.0,72.5,73.5,72.8,74.0], SC:[62.0,61.5,62.5,61.8,63.0], ST:[52.0,51.5,52.5,51.8,53.0] }, placement:74, avgPkg:4.0, maxPkg:9 },
    },
  },
  {
    id: 107, name: 'Nagpur College of Pharmacy',
    shortName: 'NCP Nagpur', location: 'nagpur', tier: 2, autonomous: false,
    type: 'unaided', fees: 55000, nirf: 0, estd: 1992, stream: 'pharmacy',
    branches: {
      BPHARM: { cutoffs: { OPEN:[80.0,79.5,80.5,79.8,81.0], OBC:[75.0,74.5,75.5,74.8,76.0], SC:[64.0,63.5,64.5,63.8,65.0], ST:[54.0,53.5,54.5,53.8,55.0] }, placement:74, avgPkg:4.0, maxPkg:10 },
      PHARMD: { cutoffs: { OPEN:[81.5,81.0,82.0,81.2,82.5], OBC:[76.5,76.0,77.0,76.2,77.5], SC:[65.5,65.0,66.0,65.2,66.5], ST:[55.5,55.0,56.0,55.2,56.5] }, placement:75, avgPkg:4.2, maxPkg:10 },
    },
  },
  {
    id: 108, name: 'Konkan Gyanpeeth Rahul Dharkar College of Pharmacy',
    shortName: 'KGRDCP Navi Mumbai', location: 'thane', tier: 2, autonomous: false,
    type: 'unaided', fees: 68000, nirf: 0, estd: 1998, stream: 'pharmacy',
    branches: {
      BPHARM: { cutoffs: { OPEN:[79.0,78.5,79.5,78.8,80.0], OBC:[74.0,73.5,74.5,73.8,75.0], SC:[63.0,62.5,63.5,62.8,64.0], ST:[53.0,52.5,53.5,52.8,54.0] }, placement:72, avgPkg:3.8, maxPkg:9 },
      MPHARM: { cutoffs: { OPEN:[75.0,74.5,75.5,74.8,76.0], OBC:[70.0,69.5,70.5,69.8,71.0], SC:[59.0,58.5,59.5,58.8,60.0], ST:[49.0,48.5,49.5,48.8,50.0] }, placement:70, avgPkg:3.5, maxPkg:8 },
    },
  },
  {
    id: 109, name: 'Y.B. Chavan College of Pharmacy, Aurangabad',
    shortName: 'YBCCP Aurangabad', location: 'aurangabad', tier: 2, autonomous: false,
    type: 'unaided', fees: 50000, nirf: 0, estd: 1994, stream: 'pharmacy',
    branches: {
      BPHARM: { cutoffs: { OPEN:[77.0,76.5,77.5,76.8,78.0], OBC:[72.0,71.5,72.5,71.8,73.0], SC:[61.0,60.5,61.5,60.8,62.0], ST:[51.0,50.5,51.5,50.8,52.0] }, placement:70, avgPkg:3.8, maxPkg:9 },
    },
  },
  {
    id: 110, name: 'Shri Bhagwan College of Pharmacy, Aurangabad',
    shortName: 'SBCP Aurangabad', location: 'aurangabad', tier: 2, autonomous: false,
    type: 'unaided', fees: 48000, nirf: 0, estd: 2001, stream: 'pharmacy',
    branches: {
      BPHARM: { cutoffs: { OPEN:[75.5,75.0,76.0,75.2,76.5], OBC:[70.5,70.0,71.0,70.2,71.5], SC:[59.5,59.0,60.0,59.2,60.5], ST:[49.5,49.0,50.0,49.2,50.5] }, placement:68, avgPkg:3.5, maxPkg:8 },
    },
  },

  // ── Tier 3 Pharmacy ─────────────────────────────────────────
  {
    id: 111, name: 'Shraddha Institute of Pharmacy, Washim',
    shortName: 'SIP Washim', location: 'aurangabad', tier: 3, autonomous: false,
    type: 'unaided', fees: 38000, nirf: 0, estd: 2008, stream: 'pharmacy',
    branches: {
      BPHARM: { cutoffs: { OPEN:[68.0,67.5,68.5,67.8,69.0], OBC:[63.0,62.5,63.5,62.8,64.0], SC:[52.0,51.5,52.5,51.8,53.0], ST:[43.0,42.5,43.5,42.8,44.0] }, placement:62, avgPkg:3.0, maxPkg:7 },
    },
  },
  {
    id: 112, name: 'Nanded Pharmacy College, Nanded',
    shortName: 'NPC Nanded', location: 'aurangabad', tier: 3, autonomous: false,
    type: 'unaided', fees: 42000, nirf: 0, estd: 2005, stream: 'pharmacy',
    branches: {
      BPHARM: { cutoffs: { OPEN:[70.0,69.5,70.5,69.8,71.0], OBC:[65.0,64.5,65.5,64.8,66.0], SC:[54.0,53.5,54.5,53.8,55.0], ST:[45.0,44.5,45.5,44.8,46.0] }, placement:64, avgPkg:3.2, maxPkg:7 },
    },
  },
  {
    id: 113, name: 'Sinhgad College of Pharmacy, Pune',
    shortName: 'SCOP Pune', location: 'pune', tier: 3, autonomous: false,
    type: 'unaided', fees: 65000, nirf: 0, estd: 2003, stream: 'pharmacy',
    branches: {
      BPHARM: { cutoffs: { OPEN:[76.0,75.5,76.5,75.8,77.0], OBC:[71.0,70.5,71.5,70.8,72.0], SC:[60.0,59.5,60.5,59.8,61.0], ST:[50.0,49.5,50.5,49.8,51.0] }, placement:70, avgPkg:3.8, maxPkg:9 },
      MPHARM: { cutoffs: { OPEN:[72.0,71.5,72.5,71.8,73.0], OBC:[67.0,66.5,67.5,66.8,68.0], SC:[56.0,55.5,56.5,55.8,57.0], ST:[46.0,45.5,46.5,45.8,47.0] }, placement:67, avgPkg:3.5, maxPkg:8 },
    },
  },
  {
    id: 114, name: 'R.G. Sapkal College of Pharmacy, Nashik',
    shortName: 'RGSCP Nashik', location: 'nashik', tier: 3, autonomous: false,
    type: 'unaided', fees: 45000, nirf: 0, estd: 2004, stream: 'pharmacy',
    branches: {
      BPHARM: { cutoffs: { OPEN:[72.0,71.5,72.5,71.8,73.0], OBC:[67.0,66.5,67.5,66.8,68.0], SC:[56.0,55.5,56.5,55.8,57.0], ST:[46.0,45.5,46.5,45.8,47.0] }, placement:65, avgPkg:3.4, maxPkg:8 },
    },
  },
  {
    id: 115, name: 'Priyadarshini J.L. College of Pharmacy, Nagpur',
    shortName: 'PJLCP Nagpur', location: 'nagpur', tier: 3, autonomous: false,
    type: 'unaided', fees: 52000, nirf: 0, estd: 2000, stream: 'pharmacy',
    branches: {
      BPHARM: { cutoffs: { OPEN:[74.0,73.5,74.5,73.8,75.0], OBC:[69.0,68.5,69.5,68.8,70.0], SC:[58.0,57.5,58.5,57.8,59.0], ST:[48.0,47.5,48.5,47.8,49.0] }, placement:67, avgPkg:3.5, maxPkg:8 },
      MPHARM: { cutoffs: { OPEN:[70.0,69.5,70.5,69.8,71.0], OBC:[65.0,64.5,65.5,64.8,66.0], SC:[54.0,53.5,54.5,53.8,55.0], ST:[44.0,43.5,44.5,43.8,45.0] }, placement:64, avgPkg:3.2, maxPkg:7 },
    },
  },
];

module.exports = { COLLEGE_DB, CATEGORY_ADJUSTMENTS };
