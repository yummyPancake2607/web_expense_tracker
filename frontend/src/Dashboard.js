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
import InsightCard from "./components/InsightCard";
import AnomalyAlert from "./components/AnomalyAlert";
import SpendingProfileCard from "./components/SpendingProfileCard";
import WrappedContainer from "./components/MoneyWrapped/WrappedContainer";
import { FaChartPie, FaFileAlt, FaWallet, FaUser, FaChartLine, FaList, FaPlay, FaGift } from "react-icons/fa";
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
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("Dashboard");
  const [trendData, setTrendData] = useState([]);
  const [monthComparison, setMonthComparison] = useState({ this_month: 0, last_month: 0, difference: 0 });
  const [currency, setCurrency] = useState("INR"); // Default currency
  const [insights, setInsights] = useState([]);
  const [budgetPrediction, setBudgetPrediction] = useState(null);
  const [monthlyDiffs, setMonthlyDiffs] = useState([]);
  const [anomalies, setAnomalies] = useState([]);
  const [spendingProfile, setSpendingProfile] = useState(null);
  const [editingBudgetMonth, setEditingBudgetMonth] = useState(null);
  const [showWrapped, setShowWrapped] = useState(false);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [exportLoading, setExportLoading] = useState(false);
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [reminderTime, setReminderTime] = useState("20:00");


  // 🌟 Sidebar toggle for small screens
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // --- Month & Year selection ---
  const now = new Date();
  const initYear = String(now.getFullYear());
  const initMonth = String(now.getMonth() + 1).padStart(2, "0");

  const [selectedYear, setSelectedYear] = useState(initYear);
  const [selectedMonthOnly, setSelectedMonthOnly] = useState(initMonth);
  const [selectedMonth, setSelectedMonth] = useState(`${initYear}-${initMonth}`);

  useEffect(() => {
    setSelectedMonth(`${selectedYear}-${selectedMonthOnly}`);
  }, [selectedYear, selectedMonthOnly]);

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
    const res = await fetch(`${API_URL}/summary/?month=${selectedMonth}`, {
      headers: { Authorization: "Bearer " + token },
    });
    const data = await res.json();
    setSummary(data);
    setTrendData(data.daily_trend || []);
    setMonthComparison(data.month_comparison || { this_month: 0, last_month: 0, difference: 0 });
  }, [getToken, selectedMonth]);

  const fetchCategoryReport = useCallback(async () => {
    const token = await getToken();
    const res = await fetch(`${API_URL}/report_by_category/?month=${selectedMonth}`, {
      headers: { Authorization: "Bearer " + token },
    });
    setCategoryReport(await res.json());
  }, [getToken, selectedMonth]);

  const handleExportCSV = async () => {
  if (!fromDate || !toDate) {
    alert("Please select both From and To dates");
    return;
  }

  try {
    setExportLoading(true);
    const token = await getToken();

    const res = await fetch(
      `${API_URL}/export/expenses?from_date=${fromDate}&to_date=${toDate}`,
      {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );

    if (!res.ok) {
      throw new Error("Failed to export CSV");
    }

    const blob = await res.blob();

    // Create download
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `expenses_${fromDate}_to_${toDate}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);

  } catch (err) {
    console.error(err);
    alert("Error exporting CSV");
  } finally {
    setExportLoading(false);
  }
};



  const fetchBudgets = useCallback(async () => {
    const token = await getToken();
    const res = await fetch(`${API_URL}/budgets_all/`, {
        headers: { Authorization: "Bearer " + token },
    });
    if (res.ok) setBudgets(await res.json());
  }, [getToken]);

  const fetchInsights = useCallback(async () => {
    const token = await getToken();
    try {
      // Parallel fetch
      const [resInsights, resPred, resDiff, resAnom, resProf] = await Promise.all([
        fetch(`${API_URL}/insights`, { headers: { Authorization: "Bearer " + token } }),
        fetch(`${API_URL}/budget/risk`, { headers: { Authorization: "Bearer " + token } }),
        fetch(`${API_URL}/reports/monthly-diff`, { headers: { Authorization: "Bearer " + token } }),
        fetch(`${API_URL}/anomalies`, { headers: { Authorization: "Bearer " + token } }),
        fetch(`${API_URL}/spending-profile`, { headers: { Authorization: "Bearer " + token } })
      ]);
      
      if (resInsights.ok) setInsights(await resInsights.json());
      if (resPred.ok) setBudgetPrediction(await resPred.json());
      if (resDiff.ok) setMonthlyDiffs(await resDiff.json());
      if (resAnom.ok) setAnomalies(await resAnom.json());
      if (resProf.ok) setSpendingProfile(await resProf.json());
      
    } catch (e) {
      console.error("Failed to fetch insights", e);
    }
  }, [getToken]);

  useEffect(() => {
    if (!isSignedIn) return;
    fetchExpenses();
    fetchSummary();
    fetchCategoryReport();
    fetchBudgets();
    fetchInsights();
  }, [isSignedIn, fetchExpenses, fetchSummary, fetchCategoryReport, fetchBudgets, fetchInsights]);

  // re-fetch data when month/year changes
  useEffect(() => {
    if (!isSignedIn) return;
    fetchSummary();
    fetchCategoryReport();
  }, [isSignedIn, selectedMonth, fetchSummary, fetchCategoryReport]);

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
    fetchExpenses();
    fetchSummary();
    fetchCategoryReport();
    fetchInsights();
  }

  async function handleDelete(id) {
    const token = await getToken();
    await fetch(`${API_URL}/expenses/${id}`, {
      method: "DELETE",
      headers: { Authorization: "Bearer " + token },
    });
    fetchExpenses();
    fetchSummary();
    fetchCategoryReport();
  }

  // --- Budget Handlers ---
const handleSetBudget = async () => {
  // Format month as YYYY-MM
  const monthString = `${selectedYear}-${selectedMonthOnly.toString().padStart(2, '0')}`;

  const payload = {
    month: monthString,
    amount: Number(budgetInput)
  };

  // ✅ Get token here
  const token = await getToken();

  const res = await fetch(`${API_URL}/budgets/`, {
    method: "POST", // create/update
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(payload),
  });

  if (res.ok) {
    setEditingBudgetMonth(null);
    setBudgetInput("");
    fetchBudgets(); // refresh budget list
  } else {
    console.error("Failed to save budget", await res.text());
  }
};



const handleEditBudget = (b) => {
  setEditingBudgetMonth(b.month);      // remember which month is being edited
  setBudgetInput(b.amount);            // fill input with current amount

  const [year, month] = b.month.split("-");
  setSelectedYear(year);
  setSelectedMonthOnly(month);         // already 2-digit
};


  async function handleDeleteBudget(b) {
    const token = await getToken();
    await fetch(`${API_URL}/budgets/${b.month}`, {
      method: "DELETE",
      headers: { Authorization: "Bearer " + token },
    });
    if (editingBudgetMonth === b.month) setEditingBudgetMonth(null);
    fetchBudgets();
  }

  // --- Reminder Handler ---
  const handleSaveReminder = async () => {
      // 1. Ask for permission first
      if (reminderEnabled && Notification.permission !== "granted") {
        const permission = await Notification.requestPermission();
        if (permission !== "granted") {
            alert("We need permission to show notifications!");
            return;
        }
      }

      const token = await getToken();
      try {
          const res = await fetch(`${API_URL}/user/preferences`, {
              method: "PUT",
              headers: { 
                  "Content-Type": "application/json",
                  "Authorization": "Bearer " + token 
              },
              body: JSON.stringify({ 
                  reminder_enabled: reminderEnabled,
                  reminder_time: reminderTime
              }),
          });
          if (res.ok) {
              alert("Reminder preferences saved! 🔔");
          } else {
              alert("Failed to save preferences.");
          }
      } catch (e) {
          console.error("Error saving reminder prefs", e);
      }
  };

  // 🔔 Browser Notification Logic
  useEffect(() => {
    if (!reminderEnabled || !isSignedIn) return;

    const interval = setInterval(() => {
        const now = new Date();
        const currentHours = String(now.getHours()).padStart(2, '0');
        const currentMinutes = String(now.getMinutes()).padStart(2, '0');
        const currentTime = `${currentHours}:${currentMinutes}`;

        if (currentTime === reminderTime) {
            // Check if we already notified this minute to avoid spam (simple lock)
            const lastRun = localStorage.getItem("last_reminder_run");
            if (lastRun !== currentTime) {
                 if (Notification.permission === "granted") {
                     new Notification("📝 Time to log your expenses!", {
                         body: "Quick check-in: Did you spend anything today?",
                         icon: "/logo.svg" // optional, assumes public/logo.svg exists
                     });
                 }
                 localStorage.setItem("last_reminder_run", currentTime);
            }
        }
    }, 10000); // Check every 10 seconds

    return () => clearInterval(interval);
  }, [reminderEnabled, reminderTime, isSignedIn]);

  // --- Chart Data ---
  const PALETTE = [
    "#60a5fa", "#a78bfa", "#34d399", "#f59e0b",
    "#ef4444", "#06b6d4", "#f472b6", "#22c55e",
    "#eab308", "#f97316", "#8b5cf6", "#0ea5e9",
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
    datasets: [{ data: values, backgroundColor: colors, borderColor: "#0f172a", borderWidth: 2 }],
  };

  const barData = {
    labels: categories,
    datasets: [{ label: "Spending by Category", data: values, backgroundColor: colorsAlpha, borderColor: colors, borderWidth: 1 }],
  };

  const lineData = {
    labels: trendData.map((t) => t.date),
    datasets: [{ label: "Daily Spending", data: trendData.map((t) => t.amount), fill: false, borderColor: "#58a6ff", tension: 0.3 }],
  };

  const monthCompareData = {
    labels: ["Last Month", "This Month"],
    datasets: [{ label: "Monthly Spend", data: [monthComparison.last_month, monthComparison.this_month], backgroundColor: [withAlpha("#a78bfa", 0.7), withAlpha("#60a5fa", 0.7)], borderColor: ["#a78bfa", "#60a5fa"], borderWidth: 1 }],
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

  const displayName = user?.fullName || user?.username || user?.primaryEmailAddress?.emailAddress || "Profile";

  function getRemainingBudget() {
    if (!summary || summary.budget == null) return null;
    return summary.budget - summary.total;
  }

  // year & month list
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 21 }, (_, i) => String(currentYear - 10 + i));
  const months = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0"));

  // --- UI ---
  return (
    <div className="dashboard-container">
      <button className="hamburger-btn" onClick={toggleSidebar} aria-label="Toggle sidebar">☰</button>

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <h2 className="logo">💸 Coinzo</h2>
        <nav>
          {navItems.map((item) => (
            <button key={item.name} className={`sidebar-link ${view === item.name ? "active" : ""}`} onClick={() => setView(item.name)}>
              {item.icon} <span>{item.name}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Main */}
      <main className="main-content">
        <h1 className="page-title">{view}</h1>

        {/* DASHBOARD */}
        {view === "Dashboard" && (
          <>
            {/* Month-Year Selectors */}
            <div className="budget-box" style={{ marginBottom: "20px" }}>
              <select className="budget-year-select" value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
                {years.map((y) => <option key={y} value={y}>{y}</option>)}
              </select>
              <select className="budget-month-select" value={selectedMonthOnly} onChange={(e) => setSelectedMonthOnly(e.target.value)}>
                {months.map((m) => {
                  const date = new Date(`${currentYear}-${m}-01`);
                  return <option key={m} value={m}>{date.toLocaleString("default", { month: "long" })}</option>;
                })}
              </select>
            </div>

            <div className="greeting-card" style={{ position: 'relative' }}>
              <button 
                onClick={() => setShowWrapped(true)}
                className="play-wrapped-btn"
              >
                  <FaPlay size={12} /> Play Money Wrapped
              </button>

              {insights.length > 0 ? (
                <div>
                  <h2 style={{ color: '#d9534f' }}>⚠️ Critical Insight</h2>
                  <p style={{ fontSize: '1.2rem', fontWeight: '500' }}>{insights[0].text}</p>
                </div>
              ) : (
                <div>
                   <h2>Welcome Back {user?.firstName ? `${user.firstName}` : ""}</h2>
                   <p>No critical insights yet. Add more expenses to generate analysis.</p>
                </div>
              )}
            </div>

            
            
            {showWrapped && <WrappedContainer onClose={() => setShowWrapped(false)} />}
            
            {/* NEW: Behavior First (Profile + Insights) */}
            {spendingProfile && <SpendingProfileCard profile={spendingProfile} />}
            
            {/* Insights Section (Moved to Top) */}
             <div className="list-card" style={{ marginBottom: '20px' }}>
              <h3>💡 Spending Behavior & Insights</h3>
              {budgetPrediction && budgetPrediction.projected_overrun && (
                <div style={{ backgroundColor: '#f8d7da', color: '#721c24', padding: '10px', borderRadius: '5px', marginBottom: '10px' }}>
                  <strong>⚠️ Budget Burn Warning:</strong> At your current spending rate, your budget will be exceeded in {budgetPrediction.days_to_exhaustion} days.
                </div>
              )}
              {anomalies.map((anom) => (
                <AnomalyAlert key={anom.id} anomaly={anom} />
              ))}
              {insights.length === 0 ? <p>No major insights yet. Keep tracking!</p> : (
                  insights.map((insight, idx) => (
                    <InsightCard key={idx} insight={insight} />
                  ))
              )}
            </div>
            <section className="export-section">
  <div className="export-header">
    <h3>📤 Export Expenses</h3>
    <p>Download all your expense data for a selected date range</p>
  </div>

  <div className="export-body">
    <div className="export-field">
      <label>From</label>
      <input
        type="date"
        value={fromDate}
        onChange={(e) => setFromDate(e.target.value)}
      />
    </div>

    <div className="export-field">
      <label>To</label>
      <input
        type="date"
        value={toDate}
        onChange={(e) => setToDate(e.target.value)}
      />
    </div>

    <button
      onClick={handleExportCSV}
      disabled={exportLoading}
      className="export-btn"
    >
      {exportLoading ? "Preparing CSV..." : "Download CSV"}
    </button>
  </div>
</section>

            

            {/* Stats Grid (Moved Below) */}
            <div className="stats-grid">
              <div className="stat-card pink"><h3>Total Spent</h3><p>{summary ? formatCurrency(summary.total, currency) : "--"}</p></div>
              <div className="stat-card blue"><h3>Budget Used</h3><p>{summary ? `${summary.percent_used}%` : "--"}</p></div>
              <div className="stat-card green"><h3>Remaining Budget</h3><p>{summary && summary.budget != null ? formatCurrency(getRemainingBudget(), currency) : "--"}</p></div>
              <div className="stat-card purple"><h3>Top Category</h3><p>{summary?.top_category || "N/A"}</p></div>
            </div>

            <div className="form-card"><h3>Add Expense</h3>
              <ExpenseForm onSubmit={handleSubmit} editingExpense={editingExpense} onCancel={() => setEditingExpense(null)} />
            </div>

            <div className="list-card"><h3>Recent Expenses</h3>
              {loading ? <p>Loading...</p> : <ExpenseList expenses={expenses} onEdit={setEditingExpense} onDelete={handleDelete} currency={currency} />}
            </div>
            
            {/* Monthly Changes */}
            {monthlyDiffs.length > 0 && (
                <div className="list-card" style={{ marginTop: '20px' }}>
                  <h4>Month-over-Month Changes</h4>
                  <ul style={{ listStyle: 'none', padding: 0 }}>
                    {monthlyDiffs.slice(0, 3).map(diff => (
                      <li key={diff.category} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px solid #eee' }}>
                         <span>{diff.category}</span>
                         <span style={{ color: diff.diff > 0 ? 'red' : 'green' }}>
                           {diff.diff > 0 ? '↑' : '↓'} {formatCurrency(Math.abs(diff.diff), currency)}
                         </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
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
            <h2>Category Analytics – {new Date(`${selectedYear}-${selectedMonthOnly}-01`).toLocaleString("default", { month: "long", year: "numeric" })}</h2>
            <div className="budget-box" style={{ marginBottom: "20px" }}>
              <select className="budget-year-select" value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
                {years.map((y) => <option key={y} value={y}>{y}</option>)}
              </select>
              <select className="budget-month-select" value={selectedMonthOnly} onChange={(e) => setSelectedMonthOnly(e.target.value)}>
                {months.map((m) => {
                  const date = new Date(`${currentYear}-${m}-01`);
                  return <option key={m} value={m}>{date.toLocaleString("default", { month: "long" })}</option>;
                })}
              </select>
            </div>
            <div className="charts-grid">
              <div className="chart-card"><h3>Expenses by Category</h3><Pie data={pieData} /></div>
              <div className="chart-card"><h3>Category Breakdown</h3><Bar data={barData} /></div>
            </div>
          </div>
        )}

        {/* REPORTS */}
        {view === "Reports" && (
          <div className="reports-page">
            <h2>All Reports – {new Date(`${selectedYear}-${selectedMonthOnly}-01`).toLocaleString("default", { month: "long", year: "numeric" })}</h2>
            <div className="budget-box" style={{ marginBottom: "20px" }}>
              <select className="budget-year-select" value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
                {years.map((y) => <option key={y} value={y}>{y}</option>)}
              </select>
              <select className="budget-month-select" value={selectedMonthOnly} onChange={(e) => setSelectedMonthOnly(e.target.value)}>
                {months.map((m) => {
                  const date = new Date(`${currentYear}-${m}-01`);
                  return <option key={m} value={m}>{date.toLocaleString("default", { month: "long" })}</option>;
                })}
              </select>
            </div>
            <div className="charts-grid">
              <div className="chart-card"><h3>Expenses by Category</h3><Pie data={pieData} /></div>
              <div className="chart-card"><h3>Category Breakdown</h3><Bar data={barData} /></div>
              <div className="chart-card"><h3>Daily Spending Trend</h3><Line data={lineData} /></div>
              <div className="chart-card"><h3>This Month vs Last Month</h3><Bar data={monthCompareData} /></div>
            </div>

            <div className="list-card" style={{ marginTop: "20px" }}>
              <h3>📅 Monthly Comparison Table</h3>
              {monthlyDiffs.length === 0 ? (
                <p>No data available for comparison.</p>
              ) : (
                <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }}>
                  <thead>
                    <tr style={{ borderBottom: "2px solid #eee", textAlign: "left" }}>
                      <th style={{ padding: "10px" }}>Category</th>
                      <th style={{ padding: "10px" }}>This Month</th>
                      <th style={{ padding: "10px" }}>Last Month</th>
                      <th style={{ padding: "10px" }}>Difference</th>
                    </tr>
                  </thead>
                  <tbody>
                    {monthlyDiffs.map((row) => (
                      <tr key={row.category} style={{ borderBottom: "1px solid #f0f0f0" }}>
                        <td style={{ padding: "10px" }}>{row.category}</td>
                        <td style={{ padding: "10px" }}>{formatCurrency(row.current, currency)}</td>
                        <td style={{ padding: "10px" }}>{formatCurrency(row.previous, currency)}</td>
                        <td style={{ padding: "10px", color: row.diff > 0 ? "red" : "green", fontWeight: "bold" }}>
                          {row.diff > 0 ? "↑" : row.diff < 0 ? "↓" : "-"}{" "}
                          {formatCurrency(Math.abs(row.diff), currency)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* BUDGET */}
        {view === "Budget" && (
          <div className="budget-page">
            <h2>Monthly Budget</h2>
            <div className="budget-box">
              <select className="budget-year-select" value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
                {years.map((y) => <option key={y} value={y}>{y}</option>)}
              </select>
              <select className="budget-month-select" value={selectedMonthOnly} onChange={(e) => setSelectedMonthOnly(e.target.value)}>
                {months.map((m) => {
                  const date = new Date(`${currentYear}-${m}-01`);
                  return <option key={m} value={m}>{date.toLocaleString("default", { month: "long" })}</option>;
                })}
              </select>
              <input type="number" placeholder="Enter budget" value={budgetInput} onChange={(e) => setBudgetInput(e.target.value)} />
              <button onClick={handleSetBudget}>{editingBudgetMonth ? "Update" : "Save"}</button>
              {editingBudgetMonth && (
                <button className="cancel-btn action-btn" onClick={() => {
                  setEditingBudgetMonth(null);
                  setBudgetInput("");
                  setSelectedYear(initYear);
                  setSelectedMonthOnly(initMonth);
                }}>Cancel</button>
              )}
            </div>

            <div className="budget-list">
              <h3>Budgets Set</h3>
              {budgets.length === 0 ? <p>No budgets yet.</p> : (
                <ul>
                  {budgets.map((b) => (
                    <li key={b.month} className="budget-item">
                      <span>{new Date(`${b.month}-01`).toLocaleString("default", { month: "long", year: "numeric" })}: <strong>{formatCurrency(b.amount, currency)}</strong></span>
                      <div className="budget-actions">
                        <button className="action-btn edit-btn" onClick={() => handleEditBudget(b)}>✏️ Edit</button>
                        <button className="action-btn delete-btn" onClick={() => handleDeleteBudget(b)}>🗑 Delete</button>
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
                  <img src={user?.imageUrl} alt="Profile" className="profile-avatar" />
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
                
                {/* Daily Reminder Setting */}
                <div className="reminder-box" style={{ marginTop: '20px', padding: '15px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px' }}>
                    <h3 style={{ marginTop: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>⏰ Daily Reminder</h3>
                    <p style={{ fontSize: '0.9rem', opacity: 0.8, marginBottom: '15px' }}>Get a browser notification to log your expenses.</p>
                    
                    <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                            <input 
                                type="checkbox" 
                                checked={reminderEnabled} 
                                onChange={(e) => setReminderEnabled(e.target.checked)}
                                style={{ transform: 'scale(1.2)' }}
                            />
                            <span>Enable Reminders</span>
                        </label>
                        
                        {reminderEnabled && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span>At:</span>
                                <input 
                                    type="time" 
                                    value={reminderTime} 
                                    onChange={(e) => setReminderTime(e.target.value)}
                                    style={{ padding: '5px', borderRadius: '5px', border: '1px solid #444', background: '#222', color: '#fff' }}
                                />
                            </div>
                        )}
                        
                        <button 
                            onClick={handleSaveReminder}
                            style={{ 
                                padding: '6px 16px', borderRadius: '6px', border: 'none', 
                                background: 'var(--primary)', color: 'white', cursor: 'pointer', fontWeight: 'bold' 
                            }}
                        >
                            Save
                        </button>
                    </div>
                </div>

                {/* Actions */}
                <div className="profile-actions">
                  <button
                    className="signout-btn"
                    onClick={() => signOut({ redirectUrl: "/" })}
                  >
                     Sign Out
                  </button>
                  <div style={{ marginLeft: "10px", marginTop: "20px" }}>
                    <UserButton afterSignOutUrl="/" /> Manage Account
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
