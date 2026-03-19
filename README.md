# 🎓 MHT-CET College Predictor Pro

> AI-powered Maharashtra engineering college predictor built by students, for students.
> Developed by Samyak Ahiwale, Dipesh Bante, and Yash Bonde.

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js v18+ and npm v9+
- MongoDB Atlas account (free tier works)

### 1. Clone and install

```bash
git clone https://github.com/your-username/cetpro.git
cd cetpro
npm run install:all
```

### 2. Configure Backend

```bash
cd backend
cp .env.example .env
```

Edit `.env` and fill in:

| Variable | Description |
|---|---|
| `MONGODB_URI` | Your MongoDB Atlas connection string |
| `JWT_SECRET` | Random 64+ char string (use: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`) |
| `JWT_REFRESH_SECRET` | Another random 64+ char string |
| `FRONTEND_URL` | `http://localhost:3000` for dev |
| `SMTP_*` | Your email SMTP credentials (optional for dev) |

### 3. Configure Frontend

```bash
cd frontend
cp .env.example .env
# REACT_APP_API_URL=http://localhost:5000/api  (already set)
```

### 4. Start development servers

```bash
# Terminal 1 — Backend (runs on :5000)
cd backend && npm run dev

# Terminal 2 — Frontend (runs on :3000)
cd frontend && npm start
```

Open http://localhost:3000 🎉

---

## 📁 Project Structure

```
cetpro/
├── backend/
│   ├── controllers/
│   │   ├── authController.js       # Signup, login, password reset
│   │   ├── predictionController.js # Core prediction engine + CRUD
│   │   └── userController.js       # Profile management
│   ├── data/
│   │   └── colleges.js             # 25 colleges, 5-year cutoff data
│   ├── middleware/
│   │   ├── auth.js                 # JWT protect middleware
│   │   └── validation.js           # express-validator rules
│   ├── models/
│   │   ├── User.js                 # User schema with bcrypt
│   │   └── Prediction.js           # Prediction schema
│   ├── routes/
│   │   ├── auth.js
│   │   ├── user.js
│   │   ├── prediction.js
│   │   └── college.js
│   ├── utils/
│   │   └── mailer.js               # Nodemailer email utility
│   ├── .env.example
│   ├── package.json
│   └── server.js                   # Express entry point
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── Navbar.jsx
│   │   │   │   └── BottomNav.jsx
│   │   │   └── predictor/
│   │   │       └── CollegeCard.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx     # Global auth state
│   │   │   └── ThemeContext.jsx    # Dark/light mode
│   │   ├── pages/
│   │   │   ├── Landing.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── ForgotPassword.jsx
│   │   │   ├── ResetPassword.jsx
│   │   │   ├── Predictor.jsx       # 3-step input form
│   │   │   ├── Results.jsx         # Safe/Moderate/Dream cards
│   │   │   ├── Dashboard.jsx       # User profile + history
│   │   │   ├── Compare.jsx         # Side-by-side comparison
│   │   │   ├── About.jsx           # Founders section
│   │   │   ├── SharedResult.jsx    # Public shared prediction
│   │   │   └── NotFound.jsx
│   │   ├── styles/
│   │   │   └── globals.css         # Design tokens + utilities
│   │   ├── utils/
│   │   │   └── api.js              # Axios + JWT interceptors
│   │   ├── App.jsx                 # Router + guards
│   │   └── index.js
│   ├── .env.example
│   └── package.json
│
├── package.json                    # Monorepo scripts
├── vercel.json                     # Vercel deployment config
└── README.md
```

---

## 🔌 API Reference

### Auth
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/signup` | ✗ | Create account |
| POST | `/api/auth/login` | ✗ | Login, returns JWT |
| POST | `/api/auth/refresh` | ✗ | Refresh access token |
| GET  | `/api/auth/me` | ✓ | Get current user |
| POST | `/api/auth/forgot-password` | ✗ | Send reset email |
| POST | `/api/auth/reset-password` | ✗ | Reset with token |

### Predictions
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST   | `/api/predictions` | ✓ | Run prediction, save result |
| GET    | `/api/predictions` | ✓ | Get user's prediction history |
| GET    | `/api/predictions/:id` | ✓ | Get single prediction (full) |
| PATCH  | `/api/predictions/:id/share` | ✓ | Toggle public sharing |
| DELETE | `/api/predictions/:id` | ✓ | Delete prediction |
| GET    | `/api/predictions/share/:token` | ✗ | View shared prediction |

### Users
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET   | `/api/users/profile` | ✓ | Get profile |
| PATCH | `/api/users/profile` | ✓ | Update profile |
| PATCH | `/api/users/change-password` | ✓ | Change password |
| GET   | `/api/users/stats` | ✓ | Get stats |

### Colleges
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/colleges` | ✗ | List with filters |
| GET | `/api/colleges/:id` | ✗ | Single college |

---

## ☁️ Deploying to Vercel

### Option A: Separate Deployments (Recommended)

**Deploy Backend to Render (free):**
1. Push to GitHub
2. New Web Service on [render.com](https://render.com)
3. Build Command: `cd backend && npm install`
4. Start Command: `cd backend && npm start`
5. Add all `.env` variables in Render dashboard

**Deploy Frontend to Vercel:**
1. Import repo on [vercel.com](https://vercel.com)
2. Set Root Directory: `frontend`
3. Add env var: `REACT_APP_API_URL=https://your-backend.onrender.com/api`
4. Deploy

### Option B: Full Vercel (Monorepo)
```bash
npm install -g vercel
vercel --prod
```
Set environment variables in Vercel dashboard.

---

## 🔒 Security Features
- Passwords hashed with **bcrypt (salt rounds: 12)**
- JWT access tokens (7d) + refresh tokens (30d)
- Rate limiting: 100 req/15min global, 20 req/15min on auth routes
- Helmet.js security headers
- CORS restricted to allowed origins
- Input validation via express-validator on all endpoints
- Password reset tokens hashed before DB storage
- SQL/NoSQL injection protection via Mongoose sanitization

---

## 🧪 Test the API (Postman)

```bash
# 1. Signup
POST http://localhost:5000/api/auth/signup
{ "name": "Test User", "email": "test@test.com", "password": "Test1234" }

# 2. Login
POST http://localhost:5000/api/auth/login
{ "email": "test@test.com", "password": "Test1234" }
# → Copy accessToken

# 3. Run prediction (add Authorization: Bearer <token>)
POST http://localhost:5000/api/predictions
{
  "percentile": 92.5,
  "category": "OPEN",
  "preferredBranches": ["CSE", "IT"],
  "location": "pune",
  "maxFees": 200000
}
```

---

## 👥 Team

| Name | Role |
|---|---|
| **Samyak Ahiwale** | Co-Founder, Lead Developer — Prediction Engine & Data Architecture |
| **Dipesh Bante** | Co-Founder, Backend Engineer — College Database & API Design |
| **Yash Bonde** | Co-Founder, UI/UX Designer — Product Design & User Research |

> *"Empowering every MHT-CET student with the knowledge to choose their best-fit college, so hard work truly pays off."*

---

## 📄 License
MIT — free to use, modify and deploy.
