# 💸 COINZO - Insight-First Personal Finance Assistant

An intelligent, modern expense tracker that goes beyond simple logging. It features **"Money Wrapped"** stories, predictive insights, and spending personality analysis to help users understand their financial behavior.

Built with **FastAPI** (Python) and **React** (JavaScript).

---

## 🚀 Key Features

### 🌟 Core Expense Tracking
- **Smart Dashboard**: Real-time overview of total spend, budget usage, and top categories.
- **Budget Management**: Set monthly budgets and track burn rate.
- **Expense Logging**: Add, edit, and categorize daily expenses.
- **Visual Reports**: Interactive charts for daily trends, category breakdowns, and month-over-month comparisons.

### 🧠 Intelligent Insights (New)
- **Money Wrapped**: A Spotify-style, story-driven summary of your financial month.
    - *Features*: Animated storytelling, "Money Personality" assignment (e.g., "Late Night Spender"), and risk analysis.
    - *Shareable*: Export instagram-ready story cards and PDF reports.
- **Predictive Analysis**: Alerts you if your current spending velocity will break your budget before the month ends.
- **Spending Personality**: Automatically categorizes your behavior (e.g., "The Weekend Warrior", "The Saver").

---

## 🛠 Tech Stack

### **Frontend** (Client)
- **Framework**: React 19
- **styling**: Custom CSS + Glassmorphism Design System
- **Motion**: `framer-motion` (for complex animations and Wrapped stories)
- **Charts**: `chart.js`, `react-chartjs-2`
- **Auth**: `@clerk/clerk-react`
- **Export**: `html2canvas`, `jspdf` (for generating images/PDFs)

### **Backend** (Server)
- **Framework**: FastAPI (Python 3.10+)
- **Database**: SQLite (via SQLAlchemy ORM)
- **Auth Validation**: `python-jose` (validates Clerk JWTs)
- **Data Processing**: Pydantic schemas

---

## ⚡ Getting Started

### Prerequisites
- **Node.js** (v18+)
- **Python** (v3.10+)

### 1️⃣ Backend Setup
The backend runs on port `8000`.

1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Create virtual environment:
   ```bash
   python -m venv venv
   # Windows
   venv\Scripts\activate
   # Mac/Linux
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Start the server:
   ```bash
   uvicorn app.main:app --reload
   ```
   *API Docs available at: http://localhost:8000/docs*

### 2️⃣ Frontend Setup
The frontend runs on port `3000`.

1. Navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up Environment Variables:
   Create a `.env` file in `frontend/` with your Clerk keys:
   ```env
   REACT_APP_CLERK_PUBLISHABLE_KEY=pk_test_...
   REACT_APP_API_URL=http://localhost:8000
   ```
4. Start the app:
   ```bash
   npm start
   ```
   *Open http://localhost:3000 in your browser.*

---

## 📂 Project Structure

```
WEB_EXPENSE_TRACKER/
├── backend/                  # FastAPI Server
│   ├── app/
│   │   ├── routers/          # API Endpoints (insights, expenses)
│   │   ├── models.py         # DB Models
│   │   ├── schemas.py        # Pydantic Schemas
│   │   └── main.py           # App Entry Point
│   └── requirements.txt
│
├── frontend/                 # React Client
│   ├── src/
│   │   ├── components/
│   │   │   ├── MoneyWrapped/ # Story Logic & Exports
│   │   │   └── ...
│   │   ├── Dashboard.js      # Main View
│   │   └── App.js
│   └── package.json
└── expense_tracker.db        # SQLite DB (Auto-created)
```

## 🤝 Contributing
- **Linting**: Ensure code is clean before committing.
- **New Features**: Create a feature branch and submit a PR.
- **Design**: Stick to the "Glassmorphism" design system (see `dashboard.css` and `money-wrapped.css`).

---
License: MIT
