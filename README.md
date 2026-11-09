# CareerTrack — Full-Stack Job Portal & Applicant Tracking System

CareerTrack is a full-stack recruitment platform built with the MERN stack. It allows job seekers to browse open roles and apply with their resume without creating an account, while providing employers with a secure dashboard to post jobs, review candidates, update hiring statuses, and export applicant data.

## 🌐 Live Links
* **Live Website (Frontend):** https://career-track-eosin.vercel.app
* **Live API Server (Backend):** https://careertrack-isqj.onrender.com
* **GitHub Repository:** https://github.com/iaditi97/CareerTrack

## 🛠️ Tech Stack
* **Frontend:** React.js (Vite), Tailwind CSS, Framer Motion, Axios, React Router, Lucide Icons
* **Backend:** Node.js, Express.js, Multer (file uploads), Express Rate Limit
* **Database:** MongoDB Atlas & Mongoose ODM
* **Security & Auth:** JSON Web Tokens (JWT), Bcrypt password hashing, CORS protection
* **Deployment:** Vercel (Frontend) & Render (Backend)

## ✨ Key Features
* **Public Job Explorer:** Real-time keyword search and employment-type filtering without requiring candidate registration.
* **Instant Resume Submission:** Validates PDF and DOCX uploads (up to 5MB) and blocks duplicate applications for the same job.
* **Protected Employer Dashboard:** JWT-authenticated workspace for managing job listings, viewing uploaded resumes, updating candidate pipeline statuses (`Submitted`, `Under Review`, `Shortlisted`, `Selected`, `Rejected`), adding internal notes, and exporting candidate records to CSV.

## 📁 Project Structure
```text
CareerTrack/
├── backend/                # Express REST API, MongoDB models, Multer upload handler
│   ├── config/             # Database connection setup
│   ├── middleware/         # JWT verification & error handling
│   ├── models/             # Admin, Job, and Application schemas
│   ├── routes/             # Auth, Jobs, and Applications API endpoints
│   └── Server.js           # Main server entry point
└── frontend/career-track/  # React + Vite frontend application
    ├── src/pages/          # LandingPage, JobDetails, Login, SignUp, EmployerDashboard
    └── vercel.json         # Client-side routing configuration
```

## 💻 Local Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/iaditi97/CareerTrack.git
cd CareerTrack
```

### 2. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file inside the `backend/` folder with your own keys:
```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
CLIENT_URL=http://localhost:5173
```
Start the backend server:
```bash
npm run dev
```

### 3. Frontend Setup
Open a second terminal window and run:
```bash
cd frontend/career-track
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.
