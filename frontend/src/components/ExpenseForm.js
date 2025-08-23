import React, { useState, useEffect } from "react";

const defaultCategories = [
  "Food", "Transport", "Groceries", "Health", "Bills", "Entertainment", "Other"
];

const ExpenseForm = ({
  onSubmit, editingExpense, onCancel
}) => {
  const [form, setForm] = useState({
    date: "",
    description: "",
    category: defaultCategories[0],
    amount: ""
  });

  useEffect(() => {
    if (editingExpense) {
      setForm({ ...editingExpense, amount: editingExpense.amount.toString() });
    } else {
      setForm({ date: "", description: "", category: defaultCategories[0], amount: "" });
    }
  }, [editingExpense]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.date || !form.description || !form.amount) return;
    onSubmit({
      ...form,
      amount: parseFloat(form.amount)
    });
    setForm({ date: "", description: "", category: defaultCategories[0], amount: "" });
  }

  return (
    <form className="expense-form" onSubmit={handleSubmit}>
      <input type="date" name="date" value={form.date} onChange={handleChange} required />
      <input type="text" name="description" value={form.description} placeholder="Description" onChange={handleChange} required />
      <select name="category" value={form.category} onChange={handleChange}>
        {defaultCategories.map(cat => <option key={cat}>{cat}</option>)}
      </select>
      <input type="number" name="amount" value={form.amount} placeholder="Amount" min="0" step="0.01" onChange={handleChange} required />
      <button type="submit">{editingExpense ? "Update" : "Add"}</button>
      {editingExpense && <button type="button" onClick={onCancel}>Cancel</button>}
    </form>
  );
};

export default ExpenseForm;