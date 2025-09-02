import React, { useState, useEffect, useCallback } from "react";
import {
  UserButton,
  useAuth,
  useUser,
  SignedIn,
  SignedOut,
  SignInButton,
  useClerk
} from "@clerk/clerk-react";
import { Pie, Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement, Tooltip, Legend,
  CategoryScale, LinearScale, BarElement, Title, PointElement, LineElement
} from "chart.js";
import ExpenseForm from "./components/ExpenseForm";
import ExpenseList from "./components/ExpenseList";
import { FaChartPie, FaFileAlt, FaWallet, FaUser, FaChartLine, FaList } from "react-icons/fa";
import "./dashboard.css";

ChartJS.register(
  ArcElement, Tooltip, Legend,
  CategoryScale, LinearScale, BarElement, Title, PointElement, LineElement
);

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

function Dashboard() {
  const { getToken } = useAuth();
  const { user, isLoaded, isSignedIn } = useUser();
  const { signOut } = useClerk();

  // States
  const [expenses, setExpenses] = useState([]);
  const [editingExpense, setEditingExpense] = useState(null);
  const [summary, setSummary] = useState(null);
  const [categoryReport, setCategoryReport] = useState({});
  const [budgets, setBudgets] = useState([]);
  const [budgetInput, setBudgetInput] = useState("");
  // 🌟 Sidebar toggle for small screens
const [sidebarOpen, setSidebarOpen] = useState(false);
const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // --- Month & Year selection (separate) ---
  const now = new Date();
  const initYear = String(now.getFullYear());
  const initMonth = String(now.getMonth() + 1).padStart(2, "0");

  // Keep original selectedMonth state to avoid removing anything else.
  const [selectedMonth, setSelectedMonth] = useState(`${initYear}-${initMonth}`);
  const [selectedYear, setSelectedYear] = useState(initYear);
  const [selectedMonthOnly, setSelectedMonthOnly] = useState(initMonth);

  // When year or month changes, keep selectedMonth in sync (YYYY-MM)
  useEffect(() => {
    setSelectedMonth(`${selectedYear}-${selectedMonthOnly}`);
  }, [selectedYear, selectedMonthOnly]);

  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("Dashboard");
  const [trendData, setTrendData] = useState([]);
  const [monthComparison, setMonthComparison] = useState({ this_month: 0, last_month: 0, difference: 0 });

  const [currency, setCurrency] = useState("INR"); // Default currency

  // Track if we're editing an existing budget (stores original month key like "2025-08")
  const [editingBudgetMonth, setEditingBudgetMonth] = useState(null);

  // --- Currency Formatter ---
  function formatCurrency(amount, currency = "INR") {
    try {
      return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: currency
      }).format(amount);
    } catch {
      return amount;
    }
  }

  // --- API Calls ---
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
    const thisMonth = new Date().toISOString().slice(0, 7);
    const res = await fetch(`${API_URL}/summary/?month=${thisMonth}`, {
      headers: { Authorization: "Bearer " + token },
    });
    const data = await res.json();
    setSummary(data);
    setTrendData(data.daily_trend || []);
    setMonthComparison(data.month_comparison || { this_month: 0, last_month: 0, difference: 0 });
  }, [getToken]);

  const fetchCategoryReport = useCallback(async () => {
    const token = await getToken();
    const res = await fetch(`${API_URL}/report_by_category/?month=${new Date().toISOString().slice(0, 7)}`, {
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
    if (!isSignedIn) return; // don’t fetch until the user is signed in
    fetchExpenses(); fetchSummary(); fetchCategoryReport(); fetchBudgets();
  }, [isSignedIn, fetchExpenses, fetchSummary, fetchCategoryReport, fetchBudgets]);

  // --- Expense Handlers ---
  async function handleSubmit(expense) {
    const token = await getToken();
    if (editingExpense) {
      await fetch(`${API_URL}/expenses/${editingExpense.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", "Authorization": "Bearer " + token },
        body: JSON.stringify(expense),
      });
      setEditingExpense(null);
    } else {
      await fetch(`${API_URL}/expenses/`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": "Bearer " + token },
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

  // --- Budget Handlers ---
  async function handleSetBudget() {
    const token = await getToken();
    const payload = { month: `${selectedYear}-${selectedMonthOnly}`, amount: parseFloat(budgetInput) };

    if (!payload.amount || isNaN(payload.amount)) return;

    // If editing, try PUT on the original month key; else POST (create/upsert)
    if (editingBudgetMonth) {
      await fetch(`${API_URL}/budgets/${editingBudgetMonth}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", "Authorization": "Bearer " + token },
        body: JSON.stringify(payload),
      });
      setEditingBudgetMonth(null);
    } else {
      await fetch(`${API_URL}/budgets/`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": "Bearer " + token },
        body: JSON.stringify(payload),
      });
    }
    fetchBudgets();
    setBudgetInput("");
  }

  async function handleEditBudget(b) {
    // Fill the controls with the chosen budget and switch to "Update" mode
    const [yr, mon] = b.month.split("-");
    setSelectedYear(yr);
    setSelectedMonthOnly(mon.padStart(2, "0"));
    setBudgetInput(String(b.amount));
    setEditingBudgetMonth(b.month);
  }

  async function handleDeleteBudget(b) {
    const token = await getToken();
    await fetch(`${API_URL}/budgets/${b.month}`, {
      method: "DELETE",
      headers: { Authorization: "Bearer " + token },
    });
    if (editingBudgetMonth === b.month) setEditingBudgetMonth(null);
    fetchBudgets();
  }

  // --- Chart Data ---
  const PALETTE = [
    "#60a5fa", "#a78bfa", "#34d399", "#f59e0b", "#ef4444", "#06b6d4", "#f472b6", "#22c55e", "#eab308", "#f97316", "#8b5cf6", "#0ea5e9",
  ];
  const hash = (str) =>
    str.split("").reduce((acc, ch) => ((acc << 5) - acc + ch.charCodeAt(0)) >>> 0, 0);

  const colorFor = (category) => {
    const i = Math.abs(hash(category)) % PALETTE.length;
    return PALETTE[i];
  };

  const withAlpha = (hex, a = 0.7) => {
    const n = hex.replace("#", "");
    const r = parseInt(n.substring(0, 2), 16);
    const g = parseInt(n.substring(2, 4), 16);
    const b = parseInt(n.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  };

  const categories = Object.keys(categoryReport);
  const values = Object.values(categoryReport);
  const colors = categories.map(colorFor);
  const colorsAlpha = colors.map((c) => withAlpha(c, 0.7));

  const pieData = {
    labels: categories,
    datasets: [
      {
        data: values,
        backgroundColor: colors,
        borderColor: "#0f172a",
        borderWidth: 2,
      },
    ],
  };

  const barData = {
    labels: categories,
    datasets: [
      {
        label: "Spending by Category",
        data: values,
        backgroundColor: colorsAlpha,
        borderColor: colors,
        borderWidth: 1,
      },
    ],
  };

  const lineData = {
    labels: trendData.map((t) => t.date),
    datasets: [
      {
        label: "Daily Spending",
        data: trendData.map((t) => t.amount),
        fill: false,
        borderColor: "#58a6ff",
        tension: 0.3,
      },
    ],
  };

  const monthCompareData = {
    labels: ["Last Month", "This Month"],
    datasets: [
      {
        label: "Monthly Spend",
        data: [monthComparison.last_month, monthComparison.this_month],
        backgroundColor: [withAlpha("#a78bfa", 0.7), withAlpha("#60a5fa", 0.7)],
        borderColor: ["#a78bfa", "#60a5fa"],
        borderWidth: 1,
      },
    ],
  };

  // --- Nav Items ---
  const navItems = [
    { name: "Dashboard", icon: <FaChartPie /> },
    { name: "Trends", icon: <FaChartLine /> },
    { name: "Categories", icon: <FaList /> },
    { name: "Reports", icon: <FaFileAlt /> },
    { name: "Budget", icon: <FaWallet /> },
    { name: "Profile", icon: <FaUser /> },
  ];

  if (!isLoaded) return null;

  const displayName =
    user?.fullName ||
    user?.username ||
    user?.primaryEmailAddress?.emailAddress ||
    "Profile";

  // --- Utility --
  function getRemainingBudget() {
    if (!summary || summary.budget == null) return null;
    return summary.budget - summary.total;
  }

  // Build selectable year range (current year ± 10)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 21 }, (_, i) => String(currentYear - 10 + i));
  const months = Array.from({ length: 12 }, (_, i) =>
    String(i + 1).padStart(2, "0")
  );

  // --- UI start ---
  return (
    <div className="dashboard-container">
      <button
      className="hamburger-btn"
      onClick={toggleSidebar}
      aria-label="Toggle sidebar"
    >
      ☰
    </button>
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
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
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <h1 className="page-title">{view}</h1>

        {/* DASHBOARD */}
        {view === "Dashboard" && (
          <>
            <div className="greeting-card">
              <h2>
                Welcome Back {user?.firstName ? `${user.firstName} 👋` : "👋"}
              </h2>
              <p>
                {summary?.percent_used < 50
                  ? "Great job staying under budget! 🚀"
                  : summary?.percent_used < 90
                    ? "You're close to your budget, watch your expenses 💡"
                    : "⚠️ Warning: Budget limit is about to be exceeded!"}
              </p>
            </div>

            <div className="stats-grid">
              <div className="stat-card pink">
                <h3>Total Spent</h3>
                <p>{summary ? formatCurrency(summary.total, currency) : "--"}</p>
              </div>
              <div className="stat-card blue">
                <h3>Budget Used</h3>
                <p>{summary ? `${summary.percent_used}%` : "--"}</p>
              </div>
              <div className="stat-card green">
                <h3>Remaining Budget</h3>
                <p>
                  {summary && summary.budget != null
                    ? formatCurrency(getRemainingBudget(), currency)
                    : "--"}
                </p>
              </div>
              <div className="stat-card purple">
                <h3>Top Category</h3>
                <p>{summary?.top_category || "N/A"}</p>
              </div>
            </div>

            {/* Add Expense */}
            <div className="form-card">
              <h3>Add Expense</h3>
              <ExpenseForm
                onSubmit={handleSubmit}
                editingExpense={editingExpense}
                onCancel={() => setEditingExpense(null)}
              />
            </div>

            {/* Expense List */}
            <div className="list-card">
              <h3>Recent Expenses</h3>
              {loading ? (
                <p>Loading...</p>
              ) : (
                <ExpenseList
                  expenses={expenses}
                  onEdit={setEditingExpense}
                  onDelete={handleDelete}
                  currency={currency}
                />
              )}
            </div>
          </>
        )}

        {/* TRENDS */}
        {view === "Trends" && (
          <div className="trends-page">
            <h2>Spending Trends</h2>
            <div className="charts-grid">
              <div className="chart-card"><h3>Daily Spending Trend</h3><Line data={lineData} /></div>
              <div className="chart-card"><h3>This Month vs Last Month</h3><Bar data={monthCompareData} /></div>
            </div>
          </div>
        )}

        {/* CATEGORIES */}
        {view === "Categories" && (
          <div className="categories-page">
            <h2>Category Analytics</h2>
            <div className="charts-grid">
              <div className="chart-card"><h3>Expenses by Category</h3><Pie data={pieData} /></div>
              <div className="chart-card"><h3>Category Breakdown</h3><Bar data={barData} /></div>
            </div>
          </div>
        )}

        {/* REPORTS */}
        {view === "Reports" && (
          <div className="reports-page">
            <h2>All Reports</h2>
            <div className="charts-grid">
              <div className="chart-card"><h3>Expenses by Category</h3><Pie data={pieData} /></div>
              <div className="chart-card"><h3>Category Breakdown</h3><Bar data={barData} /></div>
              <div className="chart-card"><h3>Daily Spending Trend</h3><Line data={lineData} /></div>
              <div className="chart-card"><h3>This Month vs Last Month</h3><Bar data={monthCompareData} /></div>
            </div>
          </div>
        )}

        {/* BUDGET */}
        {view === "Budget" && (
          <div className="budget-page">
            <h2>Monthly Budget</h2>
            <div className="budget-box">
              {/* NEW: Year select */}
              <select
                className="budget-year-select"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                aria-label="Select Year"
              >
                {years.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>

              {/* NEW: Month select (01-12 but displayed as names) */}
              <select
                className="budget-month-select"
                value={selectedMonthOnly}
                onChange={(e) => setSelectedMonthOnly(e.target.value)}
                aria-label="Select Month"
              >
                {months.map((m) => {
                  const date = new Date(`${currentYear}-${m}-01`);
                  const label = date.toLocaleString("default", { month: "long" });
                  return (
                    <option key={m} value={m}>
                      {label}
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
              <button onClick={handleSetBudget}>
                {editingBudgetMonth ? "Update" : "Save"}
              </button>
              {editingBudgetMonth && (
                <button
                  className="cancel-btn action-btn"
                  onClick={() => {
                    setEditingBudgetMonth(null);
                    setBudgetInput("");
                    setSelectedYear(initYear);
                    setSelectedMonthOnly(initMonth);
                  }}
                >
                  Cancel
                </button>
              )}
            </div>

            <div className="budget-list">
              <h3>Budgets Set</h3>
              {budgets.length === 0 ? (
                <p>No budgets set yet.</p>
              ) : (
                <ul>
                  {budgets.map((b) => (
                    <li key={b.month} className="budget-item">
                      <span>
                        {new Date(`${b.month}-01`).toLocaleString("default", {
                          month: "long",
                          year: "numeric",
                        })}
                        : <strong>{formatCurrency(b.amount, currency)}</strong>
                      </span>

                      <div className="budget-actions">
                        <button
                          className="action-btn edit-btn"
                          onClick={() => handleEditBudget(b)}
                          aria-label={`Edit budget for ${b.month}`}
                        >
                          ✏️ Edit
                        </button>
                        <button
                          className="action-btn delete-btn"
                          onClick={() => handleDeleteBudget(b)}
                          aria-label={`Delete budget for ${b.month}`}
                        >
                          🗑 Delete
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}

        {/* PROFILE */}
        {view === "Profile" && (
          <div className="profile-page">
            <div className="profile-card">
              {/* If somehow Dashboard is rendered while signed out (defensive) */}
              <SignedOut>
                <div className="profile-header">
                  <div>
                    <h2>Sign in</h2>
                    <p>Please sign in to manage your profile 🌟</p>
                  </div>
                </div>
                <SignInButton mode="modal" afterSignInUrl="/dashboard">
                  <button className="signout-btn">Sign In</button>
                </SignInButton>
              </SignedOut>

              <SignedIn>
                <div className="profile-header">
                  <img
                    src={user?.imageUrl}
                    alt="Profile"
                    className="profile-avatar"
                  />
                  <div>
                    <h2>{displayName}</h2>
                    <p>Manage your account settings & preferences 🌟</p>
                  </div>
                </div>

                {/* Currency Selection */}
                <div className="currency-box">
                  <label htmlFor="currency">Preferred Currency</label>
                  <select
                    id="currency"
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="currency-select"
                  >
                    <option value="INR">🇮🇳 Indian Rupee (₹)</option>
                    <option value="USD">🇺🇸 US Dollar ($)</option>
                    <option value="EUR">🇪🇺 Euro (€)</option>
                    <option value="GBP">🇬🇧 British Pound (£)</option>
                    <option value="JPY">🇯🇵 Japanese Yen (¥)</option>
                  </select>
                </div>

                <div className="currency-current">
                  <p>
                    Current Currency:{" "}
                    <span className="currency-badge">{currency}</span>
                  </p>
                </div>

                {/* Actions */}
                <div className="profile-actions">
                  <button
                    className="signout-btn"
                    onClick={() => signOut({ redirectUrl: "/" })}
                  >
                    🚪 Sign Out
                  </button>
                  <div style={{ marginLeft: "10px" }}>
                    <UserButton afterSignOutUrl="/" />
                  </div>
                </div>
              </SignedIn>

            </div>
          </div>
        )}

      </main>
    </div>
  );
}

export default Dashboard;
