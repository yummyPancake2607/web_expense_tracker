import React, { useState, useEffect } from "react";

function ExpenseForm({ onSubmit, editingExpense, onCancel }) {
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");
  const [customCategory, setCustomCategory] = useState("");

  // Predefined categories with option for Custom
  const predefinedCategories = [
    "Food",
    "Transport",
    "Groceries",
    "Health",
    "Bills",
    "Entertainment",
    "Custom" // 👈 allows typing your own
  ];

  // Populate form if editing an expense
  useEffect(() => {
    if (editingExpense) {
      setDate(editingExpense.date);
      setDescription(editingExpense.description);
      setAmount(editingExpense.amount);

      if (predefinedCategories.includes(editingExpense.category)) {
        setCategory(editingExpense.category);
        setCustomCategory("");
      } else {
        setCategory("Custom");
        setCustomCategory(editingExpense.category);
      }
    }
  }, [editingExpense]);

  // Handle form submit
  function handleSubmit(e) {
    e.preventDefault();
    const expenseData = {
      date,
      description,
      amount: parseFloat(amount),
      category: category === "Custom" ? customCategory : category
    };
    onSubmit(expenseData);

    // Reset form after submit
    setDate("");
    setDescription("");
    setAmount("");
    setCategory("Food");
    setCustomCategory("");
  }

  return (
    <form onSubmit={handleSubmit} className="expense-form">
      {/* Date */}
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
      />

      {/* Description */}
      <input
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />

      {/* Category Dropdown */}
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        {predefinedCategories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>

      {/* If user selects Custom, show text input */}
      {category === "Custom" && (
        <input
          type="text"
          placeholder="Enter custom category"
          value={customCategory}
          onChange={(e) => setCustomCategory(e.target.value)}
          required
        />
      )}

      {/* Amount */}
      <input
        type="number"
        step="0.01"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        required
      />

      {/* Buttons */}
      <button type="submit">
        {editingExpense ? "Update" : "Add"}
      </button>
      
      {editingExpense && (
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
      )}
    </form>
  );
}

export default ExpenseForm;