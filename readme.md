
# 💸 Expense Tracker

A modern **Expense Tracker Web App** built with:

- **FastAPI** (Python) for the backend REST API  
- **React** (JavaScript) for the frontend  
- **Clerk** for authentication (Google/Email Login)  
- **SQLite** database (via SQLAlchemy ORM)  
- **Framer Motion + React-Icons + Chart.js** for UI interactions, reports, and visualizations  

This app lets you log expenses, manage budgets, analyze trends, and generate category-wise or monthly reports in an elegant UI.

---

## 🚀 Features

- ✅ **User Authentication** via **Clerk** (Google / Email Sign-in)  
- ✅ **Expense Management**: Add, edit, delete daily expenses  
- ✅ **Budget Management**: Create/edit monthly budgets, track usage  
- ✅ **Reports & Analytics**: 
  - Spending summary
  - Daily trends
  - Top categories
  - Category breakdown graphs
  - Current vs Last month comparisons  
- ✅ **Beautiful Dashboard UI** (React + custom CSS)  
- ✅ **Responsive Frontend** with charts, graphs, and animations  

---

## 🛠 Tech Stack

**Backend**
- FastAPI  
- SQLAlchemy ORM  
- SQLite (default, but can be swapped with PostgreSQL/MySQL)  
- Pydantic (data validation)  
- HTTPX + python-jose for **JWT-based Clerk auth validation**  

**Frontend**
- React (CRA / React 18)  
- @clerk/clerk-react (Auth)  
- Chart.js + react-chartjs-2 (Reports)  
- Framer Motion (Animations)  
- React Icons (UI)  
- Custom dashboard-style CSS  

---

## 📂 Project Structure

```
WEB_EXPENSE_TRACKER/
│
├── backend/                  # Python FastAPI backend
│   ├── app/
│   │   ├── main.py           # FastAPI app entry
│   │   ├── db.py             # DB connection setup
│   │   ├── models.py         # SQLAlchemy models
│   │   ├── schemas.py        # Pydantic schemas
│   │   ├── crud.py           # Database helper functions
│   │   ├── auth.py           # Clerk-based JWT validation
│   └── requirements.txt      # Python dependencies
│
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── App.js
│   │   ├── Dashboard.js
│   │   ├── components/
│   │   │   ├── ExpenseForm.js
│   │   │   ├── ExpenseList.js
│   │   └── dashboard.css
│   ├── package.json
│
├── expense_tracker.db        # SQLite database file
├── README.md                 # This file 💡
```

---

## ⚡ Installation & Setup

### Backend (FastAPI)
1. Navigate to backend:
   ```bash
   cd backend
   ```
2. Create & activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate   # Mac/Linux
   venv\Scripts\activate      # Windows
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Run the backend server:
   ```bash
   uvicorn app.main:app --reload
   ```
   By default backend is available at:  
   👉 `http://localhost:8000`

---

### Frontend (React)
1. Navigate to frontend:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run frontend:
   ```bash
   npm start
   ```
   By default React app runs at:  
   👉 `http://localhost:3000`

---

## 🔑 Environment Variables

Backend uses **Clerk Authentication**. Configure in **`.env`** file (frontend):

```
# FastAPI backend URL
REACT_APP_API_URL=http://localhost:8000

# Clerk Auth
REACT_APP_CLERK_PUBLISHABLE_KEY=pk_test_xxx  # From Clerk Dashboard
```

Also update **auth.py** with your **Clerk Secret Key & Domain**.

---

## 📊 API Endpoints (FastAPI)

| Method | Endpoint                | Description                        |
|--------|--------------------------|------------------------------------|
| GET    | `/`                      | Root health check                  |
| GET    | `/expenses/`             | Get all expenses (for user)        |
| POST   | `/expenses/`             | Create a new expense               |
| PUT    | `/expenses/{id}`         | Update an expense                  |
| DELETE | `/expenses/{id}`         | Delete an expense                  |
| POST   | `/budgets/`              | Set monthly budget                 |
| GET    | `/budgets/{month}`       | Get budget by month                |
| GET    | `/budgets_all/`          | Get all budgets for user           |
| GET    | `/summary/`              | Spending summary + analytics       |
| GET    | `/report_by_category/`   | Category-wise report               |

---

## ⚡ Demo Screens (Frontend)
- 📌 Sign-in with Google or Email (via Clerk)  
- 📌 Dashboard with stats: Total spent, budgets, top category  
- 📌 Reports (Pie, Bar, Line graphs)  
- 📌 Budget Manager (by month, editable)  
- 📌 Profile with Currency switcher  

---

## ✅ To-Do / Future Improvements
- 🔹 Add multi-currency support with exchange rates  
- 🔹 Enable export of reports (CSV/PDF)  
- 🔹 Add dark/light theme toggle  
- 🔹 Deploy backend (Heroku, Railway, Fly.io) & frontend (Netlify/Vercel)  

---

## 🤝 Contributing

Pull requests are welcome!  
If you’d like to improve the app, feel free to **fork and submit a PR** ✨  

---

## 📜 License

MIT License © 2024  
