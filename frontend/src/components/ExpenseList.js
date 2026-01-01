import React from "react";

function ExpenseList({ expenses, onEdit, onDelete, currency }) {
  function formatCurrency(amount, currency = "INR") {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: currency
    }).format(amount);
  }

  if (!expenses || expenses.length === 0) {
    return <p>No expenses found.</p>;
  }

  return (
    <table className="expense-table">
      <thead>
        <tr>
          <th>Date</th>
          <th>Description</th>
          <th>Category</th>
          <th>Amount</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {expenses.map((exp) => (
          <tr key={exp.id}>
            <td data-label="Date">{exp.date}</td>
            <td data-label="Description">{exp.description}</td>
            <td data-label="Category">{exp.category}</td>
            <td data-label="Amount">
              {formatCurrency(exp.amount, currency)}
              {exp.is_anomaly && (
                <span style={{ marginLeft: "8px", color: "orange", cursor: "help" }} title="Unusual spending detected">
                  ⚠
                </span>
              )}
            </td>
            <td data-label="Actions">
              <button
                className="action-btn edit-btn"
                onClick={() => onEdit(exp)}
                title="Edit"
              >
                {/* Edit icon */}
                <svg
                  width="16"
                  height="16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  style={{ verticalAlign: "middle", marginRight: 4 }}
                >
                  <path d="M11.13 2.87l2 2" />
                  <path d="M2 13.28V16h2.72l8.06-8.06a2 2 0 0 0 0-2.83l-2-2a2 2 0 0 0-2.83 0L2 13.28z" />
                </svg>
                Edit
              </button>
              <button
                className="action-btn delete-btn"
                onClick={() => onDelete(exp.id)}
                title="Delete"
              >
                {/* Delete icon */}
                <svg
                  width="16"
                  height="16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  style={{ verticalAlign: "middle", marginRight: 4 }}
                >
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m5 0V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"></path>
                  <line x1="10" y1="11" x2="10" y2="17"></line>
                  <line x1="14" y1="11" x2="14" y2="17"></line>
                </svg>
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default ExpenseList;