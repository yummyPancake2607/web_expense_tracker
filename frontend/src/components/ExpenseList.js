import React from "react";

const ExpenseList = ({ expenses, onEdit, onDelete }) => (
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
      {expenses.map(exp => (
        <tr key={exp.id}>
          <td>{exp.date}</td>
          <td>{exp.description}</td>
          <td>{exp.category}</td>
          <td>${exp.amount.toFixed(2)}</td>
          <td>
            <button onClick={() => onEdit(exp)}>Edit</button>
            <button onClick={() => onDelete(exp.id)}>Delete</button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default ExpenseList;