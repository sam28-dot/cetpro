## 🎓 MHT-CET College Predictor Pro

**AI-powered Maharashtra engineering and pharmacy college predictor — built by students, for students.**

MHT-CET College Predictor Pro helps students explore potential college and branch options based on their percentile, admission category, preferred branches, location, and budget.

**Developed by:** Samyak Ahiwale, Dipesh Bante, Saad Adhal, and Yash Bonde.

---

## 🚀 Features

* **College prediction:** Explore potential college options based on examination percentile and preferences.
* **Engineering and pharmacy:** Support for both admission streams, subject to the available database.
* **Category-based filtering:** Explore options using the admission categories supported by the application.
* **Location and fee filters:** Narrow down options according to preferences supported by the application.
* **College comparison:** Compare available college and branch information.
* **User accounts:** Registration, login, and profile management.
* **Prediction history:** Access previously saved predictions.
* **Shareable results:** Share predictions where the feature is enabled.
* **Responsive interface:** Access the application on supported desktop and mobile browsers.

> **Important:** The availability of each feature depends on the current implementation and configuration of the application.

## 📊 Cutoff Data and Accuracy

The predictor's usefulness depends on the quality and completeness of its college and cutoff data.

Official reference portals:

* **Engineering admissions:** https://fe2025.mahacet.org/StaticPages/HomePage
* **Pharmacy admissions:** https://ph2025.mahacet.org/StaticPages/HomePage

Cutoff records should be checked against official Maharashtra State CET Cell publications before being labelled verified.

The application must distinguish between:

* **Verified official data:** Records checked against the relevant official CAP allotment document.
* **Unverified or illustrative data:** Records that have not been independently verified.
* **Unavailable data:** Cutoffs that are not present or cannot be reliably matched.

The predictor should not invent cutoff values or present unverified values as official admission cutoffs.

**Disclaimer:** Predictions are estimates, not guarantees of admission. Actual allotments depend on the admission year, CAP round, category, seat type, branch, eligibility, preferences, and applicable admission rules.

---

## 🛠️ Technology Stack

The project uses a JavaScript-based web application architecture.

| Component           | Technology                                            |
| ------------------- | ----------------------------------------------------- |
| Frontend            | React                                                 |
| Backend             | Node.js and Express                                   |
| Database            | MongoDB with Mongoose                                 |
| Authentication      | JWT                                                   |
| Password security   | bcrypt                                                |
| API requests        | Axios                                                 |
| Email functionality | Nodemailer, if configured                             |
| Deployment          | Vercel for the frontend and a compatible backend host |

Confirm the technologies and versions against the actual `package.json` files before publishing the final documentation.

---

## 📋 Prerequisites

Install the following before running the project locally:

* Node.js 18 or a compatible version supported by the dependencies.
* npm.
* MongoDB Atlas account or another compatible MongoDB instance.
* Git.
* A code editor such as Visual Studio Code.

Check your installed versions:

```bash
node --version
npm --version
git --version
```

---

## 🚀 Quick Start — Local Development

### 1. Clone the repository

Replace the example repository URL with your actual GitHub repository URL.

```bash
git clone https://github.com/YOUR_USERNAME/cetpro.git
cd cetpro
```

### 2. Install dependencies

If the root `package.json` defines an `install:all` script:

```bash
npm run install:all
```

Otherwise, install the dependencies separately:

```bash
cd backend
npm install

cd ../frontend
npm install

cd ..
```

### 3. Configure the backend

Navigate to the backend directory:

```bash
cd backend
```

Create a local environment file by copying `.env.example`.

**Windows Command Prompt:**

```cmd
copy .env.example .env
```

**macOS or Linux:**

```bash
cp .env.example .env
```

Configure the variables required by the actual backend:

| Variable             | Purpose                                                        |
| -------------------- | -------------------------------------------------------------- |
| `MONGODB_URI`        | MongoDB connection string                                      |
| `JWT_SECRET`         | Secret used for signing access tokens                          |
| `JWT_REFRESH_SECRET` | Secret used for refresh tokens, if implemented                 |
| `FRONTEND_URL`       | Allowed frontend origin for CORS                               |
| `SMTP_*`             | Email service configuration, if email functionality is enabled |

Generate a cryptographically random secret using Node.js:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Generate separate secrets for different purposes.

**Security:** Never commit `.env` files, database credentials, JWT secrets, SMTP passwords, or other private credentials to GitHub.

### 4. Configure the frontend

Navigate to the frontend directory:

```bash
cd ../frontend
```

Create the frontend environment file using the provided example.

**Windows Command Prompt:**

```cmd
copy .env.example .env
```

**macOS or Linux:**

```bash
cp .env.example .env
```

Configure the API URL using the environment-variable name supported by your frontend build system.

For a Create React App project, this may be:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

For a Vite project, frontend environment variables normally use the `VITE_` prefix instead. Follow the existing source code and build configuration rather than mixing the two conventions.

### 5. Start the backend

Open a terminal:

```bash
cd backend
npm run dev
```

This command requires a corresponding `dev` script in `backend/package.json`.

### 6. Start the frontend

Open a second terminal:

```bash
cd frontend
npm start
```

If the project uses Vite, the command may instead be:

```bash
npm run dev
```

### 7. Open the application

For a Create React App setup, the default development URL is commonly:

http://localhost:3000

For Vite, the default is commonly:

http://localhost:5173

Use the URL printed by the frontend development server.

---

## 📁 Project Structure

The following is the intended high-level organization. Update it if your actual repository differs.

```text
cetpro/
├── backend/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── predictionController.js
│   │   └── userController.js
│   ├── data/
│   │   └── colleges.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── validation.js
│   ├── models/
│   │   ├── User.js
│   │   └── Prediction.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── user.js
│   │   ├── prediction.js
│   │   └── college.js
│   ├── utils/
│   │   └── mailer.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── styles/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── index.js
│   ├── .env.example
│   └── package.json
├── package.json
├── vercel.json
└── README.md
```

### Important files

* `backend/data/colleges.js` — College and branch information and any associated cutoff records.
* `backend/controllers/predictionController.js` — Prediction request handling and prediction logic.
* `backend/routes/prediction.js` — Prediction API routes.
* `backend/models/Prediction.js` — Schema for stored predictions, if implemented.
* `frontend/src/pages/Predictor.jsx` — Prediction form, if present.
* `frontend/src/pages/Results.jsx` — Prediction results page, if present.
* `frontend/src/utils/api.js` — Frontend API configuration, if present.

---

## 🔌 API Reference

The following endpoints reflect the intended API design. Confirm them against the actual Express route definitions before relying on this table.

### Authentication

| Method | Endpoint                    | Authentication | Purpose                               |
| ------ | --------------------------- | -------------- | ------------------------------------- |
| `POST` | `/api/auth/signup`          | No             | Create an account                     |
| `POST` | `/api/auth/login`           | No             | Log in                                |
| `POST` | `/api/auth/refresh`         | No             | Refresh an access token, if supported |
| `GET`  | `/api/auth/me`              | Yes            | Retrieve the current user             |
| `POST` | `/api/auth/forgot-password` | No             | Request a password reset              |
| `POST` | `/api/auth/reset-password`  | No             | Reset a password                      |

### Predictions

| Method   | Endpoint                        | Authentication | Purpose                                   |
| -------- | ------------------------------- | -------------- | ----------------------------------------- |
| `POST`   | `/api/predictions`              | Yes            | Generate and optionally save a prediction |
| `GET`    | `/api/predictions`              | Yes            | Retrieve prediction history               |
| `GET`    | `/api/predictions/:id`          | Yes            | Retrieve a saved prediction               |
| `PATCH`  | `/api/predictions/:id/share`    | Yes            | Change sharing settings, if supported     |
| `DELETE` | `/api/predictions/:id`          | Yes            | Delete a saved prediction                 |
| `GET`    | `/api/predictions/share/:token` | No             | View a public shared result, if supported |

### Users

| Method  | Endpoint                     | Authentication | Purpose                      |
| ------- | ---------------------------- | -------------- | ---------------------------- |
| `GET`   | `/api/users/profile`         | Yes            | Retrieve profile information |
| `PATCH` | `/api/users/profile`         | Yes            | Update profile information   |
| `PATCH` | `/api/users/change-password` | Yes            | Change the password          |
| `GET`   | `/api/users/stats`           | Yes            | Retrieve user statistics     |

### Colleges

| Method | Endpoint            | Authentication           | Purpose                             |
| ------ | ------------------- | ------------------------ | ----------------------------------- |
| `GET`  | `/api/colleges`     | Depends on configuration | List colleges and supported filters |
| `GET`  | `/api/colleges/:id` | Depends on configuration | Retrieve college details            |

**API note:** Request fields, response schemas, status codes, and authentication requirements must match the actual route handlers and middleware. This README does not establish that every listed endpoint is implemented.

---

## 🧪 Testing the Prediction API

Use Postman, Insomnia, or another API client.

### Example request

```http
POST http://localhost:5000/api/predictions
Content-Type: application/json
Authorization: Bearer YOUR_ACCESS_TOKEN
```

Example request body:

```json
{
  "percentile": 92.5,
  "category": "OPEN",
  "preferredBranches": ["CSE", "IT"],
  "location": "pune",
  "maxFees": 200000
}
```

This is an illustrative request only. Use the exact field names, accepted category values, and authentication requirements implemented by the backend.

### Testing checklist

* [ ] The backend starts without errors.
* [ ] MongoDB connects successfully.
* [ ] The frontend loads.
* [ ] Registration and login work, if enabled.
* [ ] The prediction endpoint accepts valid inputs.
* [ ] Invalid inputs return appropriate errors.
* [ ] Engineering predictions use the intended engineering records.
* [ ] Pharmacy predictions use the intended pharmacy records.
* [ ] Missing or unverified cutoff data is not presented as official.
* [ ] Results match the response format expected by the frontend.
* [ ] Saved predictions can be retrieved, if persistence is implemented.
* [ ] CORS permits the deployed frontend and rejects unauthorized origins as configured.

---

## ☁️ Deployment

### Option A — Separate frontend and backend deployments

This approach is suitable when the frontend and backend are deployed as separate services.

#### Deploy the backend

1. Push the project to GitHub.
2. Create a backend web service on a compatible hosting provider, such as Render.
3. Configure the repository and backend service root directory.
4. Set the build command appropriate to your repository layout.
5. Set the start command to the actual production script defined in `backend/package.json`.
6. Configure production environment variables.
7. Confirm that the deployed backend can connect to MongoDB.
8. Test the production API.

Example commands, **only if compatible with the repository configuration**:

```bash
npm install
npm start
```

If the host builds from the repository root, the commands may need to reference the backend directory explicitly.

#### Deploy the frontend

1. Import the repository into Vercel.
2. Configure the frontend root directory.
3. Set the required production API URL.
4. Confirm the correct environment-variable prefix for the frontend build system.
5. Deploy and test the production website.

Example for a Create React App frontend:

```env
REACT_APP_API_URL=https://YOUR_BACKEND_HOST/api
```

Use the actual deployed backend URL. Do not include placeholder values in production settings.

### Option B — Full Vercel deployment

A monorepo containing an Express backend and React frontend may require separate Vercel project configurations or suitable serverless routing.

Before using this option:

* Check the existing `vercel.json`.
* Verify that backend routes are compatible with the deployment model.
* Confirm that the frontend build output and routing are configured correctly.
* Set environment variables in the hosting dashboard.
* Test API endpoints after deployment.

Installing the Vercel CLI and running `vercel --prod` does not automatically guarantee that a monorepo will deploy correctly.

---

## 🔒 Security

Production deployments should follow these practices:

* Hash passwords using the configured password-hashing library.
* Use strong, unique secrets for authentication.
* Configure token expiry and refresh-token handling correctly.
* Validate request bodies and query parameters.
* Apply appropriate rate limits, especially to authentication routes.
* Configure secure CORS policies.
* Use security headers.
* Protect database credentials and environment variables.
* Avoid returning sensitive user information in API responses.
* Protect password-reset workflows against token reuse and unauthorized access.
* Keep dependencies updated and review security advisories.
* Use HTTPS in production.
* Ensure public sharing exposes only the information intended to be public.

Do not claim a particular security control is enabled unless it is implemented and configured in the application.

---

## 🗺️ Official Admission Resources

Students should refer to official CET Cell publications for current admission rules and allotment information.

* Engineering: https://fe2025.mahacet.org/StaticPages/HomePage
* Pharmacy: https://ph2025.mahacet.org/StaticPages/HomePage

These links refer to the 2025 admission portals. Replace or supplement them with the applicable admission-year portals when newer official resources become available.

---

## 👥 Team

| Name               | Role                                                               |
| ------------------ | ------------------------------------------------------------------ |
| **Samyak Ahiwale** | Co-Founder, Lead Developer — Prediction Engine & Data Architecture |
| **Dipesh Bante**   | Co-Founder, Backend Engineer — College Database & API Design       |
| **Saad Adhal**     | Co-Founder, Engineering & Product Development                      |
| **Yash Bonde**     | Co-Founder, UI/UX Designer — Product Design & User Research        |

> *Empowering every MHT-CET student with the knowledge to choose their best-fit college, so hard work truly pays off.*

---

## 📄 License

This project is intended to use the MIT License.

Ensure that an actual `LICENSE` file containing the MIT License is included in the repository before describing the project as MIT-licensed.

---

## ⚠️ Disclaimer

MHT-CET College Predictor Pro is an informational project intended to help students explore possible college options. It is not affiliated with or endorsed by the Maharashtra State CET Cell unless explicitly authorized.

The application does not guarantee admission, allotment, eligibility, placement, or any particular academic outcome. Students should verify all important information through official publications and the relevant institutions before making admission decisions.
