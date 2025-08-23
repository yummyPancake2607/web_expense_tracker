import React, { useState, useEffect, useCallback } from "react";
import { UserButton, useAuth } from "@clerk/clerk-react";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement, Tooltip, Legend,
  CategoryScale, LinearScale, BarElement, Title
} from "chart.js";
import ExpenseForm from "./components/ExpenseForm";
import ExpenseList from "./components/ExpenseList";
import { FaChartPie, FaFileAlt, FaWallet, FaUser } from "react-icons/fa";
import "./dashboard.css";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

// ✅ configurable API URL with fallback
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

function Dashboard() {
  const { getToken } = useAuth();

  const [expenses, setExpenses] = useState([]);
  const [editingExpense, setEditingExpense] = useState(null);
  const [summary, setSummary] = useState(null);
  const [categoryReport, setCategoryReport] = useState({});
  const [budgets, setBudgets] = useState([]);
  const [budgetInput, setBudgetInput] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0,7));
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("Dashboard"); // 👈 ACTIVE TAB

  // =====================================================
  // API Functions
  // =====================================================
  const fetchExpenses = useCallback(async () => {
    setLoading(true);
    const token = await getToken();
    const res = await fetch(`${API_URL}/expenses/`, {
      headers: { Authorization: "Bearer " + token },
    });
    setExpenses(await res.json());
    setLoading(false);
  }, [getToken]);

  const fetchSummary = useCallback(async () => {
    const token = await getToken();
    const res = await fetch(`${API_URL}/summary/`, {
      headers: { Authorization: "Bearer " + token },
    });
    setSummary(await res.json());
  }, [getToken]);

  const fetchCategoryReport = useCallback(async () => {
    const token = await getToken();
    const res = await fetch(`${API_URL}/report_by_category/`, {
      headers: { Authorization: "Bearer " + token },
    });
    setCategoryReport(await res.json());
  }, [getToken]);

  const fetchBudgets = useCallback(async () => {
    const token = await getToken();
    const res = await fetch(`${API_URL}/budgets_all/`, {
      headers: { Authorization: "Bearer " + token },
    });
    if (res.ok) setBudgets(await res.json());
  }, [getToken]);

  useEffect(() => {
    fetchExpenses(); fetchSummary(); fetchCategoryReport(); fetchBudgets();
  }, [fetchExpenses, fetchSummary, fetchCategoryReport, fetchBudgets]);

  // =====================================================
  // Handlers
  // =====================================================
  async function handleSubmit(expense) {
    const token = await getToken();
    if (editingExpense) {
      await fetch(`${API_URL}/expenses/${editingExpense.id}`, {
        method: "PUT",
        headers: {"Content-Type":"application/json","Authorization":"Bearer " + token},
        body: JSON.stringify(expense),
      });
      setEditingExpense(null);
    } else {
      await fetch(`${API_URL}/expenses/`, {
        method: "POST",
        headers: {"Content-Type":"application/json","Authorization":"Bearer " + token},
        body: JSON.stringify(expense),
      });
    }
    fetchExpenses(); fetchSummary(); fetchCategoryReport();
  }

  async function handleDelete(id) {
    const token = await getToken();
    await fetch(`${API_URL}/expenses/${id}`, {
      method: "DELETE",
      headers: { Authorization: "Bearer " + token },
    });
    fetchExpenses(); fetchSummary(); fetchCategoryReport();
  }

  async function handleSetBudget() {
    const token = await getToken();
    await fetch(`${API_URL}/budgets/`, {
      method: "POST",
      headers: {"Content-Type":"application/json","Authorization":"Bearer " + token},
      body: JSON.stringify({ month: selectedMonth, amount: parseFloat(budgetInput) }),
    });
    fetchBudgets();
    setBudgetInput("");
  }

  // =====================================================
  // Chart Data
  // =====================================================
  const pieData = {
    labels: Object.keys(categoryReport),
    datasets: [{ data: Object.values(categoryReport),
      backgroundColor: ["#58a6ff","#b27cff","#ffbd59","#4caf50","#e74c3c","#9b59b6","#f39c12"] }]
  };
  const barData = {
    labels: Object.keys(categoryReport),
    datasets: [{ label:"Spending by Category", data:Object.values(categoryReport), backgroundColor:"#58a6ff88" }]
  };

  // =====================================================
  // Sidebar Items
  // =====================================================
  const navItems = [
    { name: "Dashboard", icon: <FaChartPie /> },
    { name: "Reports", icon: <FaFileAlt /> },
    { name: "Budget", icon: <FaWallet /> },
    { name: "Profile", icon: <FaUser /> },
  ];

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2 className="logo">💸 Expense</h2>
        <nav>
          {navItems.map((item) => (
            <button
              key={item.name}
              className={`sidebar-link ${view === item.name ? "active" : ""}`}
              onClick={() => setView(item.name)}
            >
              {item.icon} <span>{item.name}</span>
            </button>
          ))}
        </nav>
        <div className="sidebar-footer">
          <UserButton afterSignOutUrl="/" />
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <h1 className="page-title">{view}</h1>

        {view === "Dashboard" && (
          <>
            {/* Stat Cards */}
            <div className="stats-grid">
              <div className="stat-card pink"><h3>Total Spent</h3><p>{summary?`$${summary.total.toFixed(2)}`:"--"}</p></div>
              <div className="stat-card blue"><h3>Budget This Month</h3>
                <p>{
                  (budgets.find(b => b.month === new Date().toISOString().slice(0,7))?.amount) 
                    ? `$${budgets.find(b => b.month === new Date().toISOString().slice(0,7)).amount.toFixed(2)}`
                    : "Not set"
                }</p></div>
              <div className="stat-card purple"><h3>Remaining</h3>
                <p>{summary && budgets.find(b => b.month === new Date().toISOString().slice(0,7))
                  ? `$${(budgets.find(b => b.month === new Date().toISOString().slice(0,7)).amount-summary.total).toFixed(2)}`
                  : "--"}</p></div>
            </div>

            {/* Charts */}
            <div className="charts-grid">
              <div className="chart-card"><h3>Expenses by Category</h3><Pie data={pieData} /></div>
              <div className="chart-card"><h3>Category Breakdown</h3><Bar data={barData}/></div>
            </div>

            {/* Expense Form + List */}
            <div className="form-card"><h3>Add Expense</h3>
              <ExpenseForm onSubmit={handleSubmit} editingExpense={editingExpense} onCancel={()=>setEditingExpense(null)} />
            </div>
            <div className="list-card"><h3>Recent Expenses</h3>
              {loading? <p>Loading...</p>:<ExpenseList expenses={expenses} onEdit={setEditingExpense} onDelete={handleDelete} />}
            </div>
          </>
        )}

        {view === "Reports" && (
          <div className="reports-page">
            <h2>Reports</h2>
            <p>Spending breakdown by category and month:</p>
            <div className="charts-grid">
              <div className="chart-card"><h3>Expenses by Category</h3><Pie data={pieData} /></div>
              <div className="chart-card"><h3>Category Breakdown</h3><Bar data={barData}/></div>
            </div>
          </div>
        )}

        {view === "Budget" && (
          <div className="budget-page">
            <h2>Monthly Budget</h2>
            <p>Set or update your budget for any month of this year:</p>
            <div className="budget-box">
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
              >
                {Array.from({ length: 12 }).map((_, i) => {
                  const month = (i + 1).toString().padStart(2, "0");
                  const year = new Date().getFullYear();
                  return (
                    <option key={month} value={`${year}-${month}`}>
                      {new Date(`${year}-${month}-01`).toLocaleString("default", {
                        month: "long",
                        year: "numeric",
                      })}
                    </option>
                  );
                })}
              </select>

              <input
                type="number"
                placeholder="Enter budget"
                value={budgetInput}
                onChange={(e) => setBudgetInput(e.target.value)}
              />
              <button onClick={handleSetBudget}>Save</button>
            </div>

            {/* Show which months have budgets */}
            <div className="budget-list">
              <h3>Budgets Set</h3>
              {budgets.length === 0 ? (
                <p>No budgets set yet.</p>
              ) : (
                <ul>
                  {budgets.map((b) => (
                    <li key={b.month}>
                      {new Date(`${b.month}-01`).toLocaleString("default", { month: "long", year: "numeric" })} 
                      : <strong>${b.amount}</strong>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}

        {view === "Profile" && (
          <div className="profile-page">
            <h2>Your Profile</h2>
            <p>Manage your account & log out:</p>
            <UserButton afterSignOutUrl="/" />
          </div>
        )}
      </main>
    </div>
  );
}
console.log("Fetching expenses from", `${API_URL}/expenses/`);
console.log("API_URL is:", API_URL);
export default Dashboard;