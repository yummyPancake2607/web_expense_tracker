from sqlalchemy.orm import Session
from . import models, schemas
from typing import List, Optional, Dict, Any

# ---- User ----
def get_or_create_user_by_clerk(db: Session, clerk_id: str, email: str) -> models.User:
    user = db.query(models.User).filter(models.User.google_id == clerk_id).first()
    if not user:
        user = models.User(email=email, google_id=clerk_id)
        db.add(user)
        db.commit()
        db.refresh(user)
    return user

# ---- Expense ----
def get_expenses(db: Session, user_id: int) -> List[models.Expense]:
    return db.query(models.Expense).filter(models.Expense.user_id == user_id).all()

def create_expense(db: Session, expense: schemas.ExpenseCreate, user_id: int) -> models.Expense:
    db_expense = models.Expense(**expense.dict(), user_id=user_id)
    db.add(db_expense)
    db.commit()
    db.refresh(db_expense)
    return db_expense

def update_expense(db: Session, expense_id: int, user_id: int, expense_update: schemas.ExpenseCreate) -> Optional[models.Expense]:
    expense = db.query(models.Expense).filter(models.Expense.id == expense_id, models.Expense.user_id == user_id).first()
    if not expense:
        return None
    for field, value in expense_update.dict().items():
        setattr(expense, field, value)
    db.commit()
    db.refresh(expense)
    return expense

def delete_expense(db: Session, expense_id: int, user_id: int) -> bool:
    expense = db.query(models.Expense).filter(models.Expense.id == expense_id, models.Expense.user_id == user_id).first()
    if expense:
        db.delete(expense)
        db.commit()
        return True
    return False

# ---- Budget ----
def set_budget(db: Session, user_id: int, budget: schemas.BudgetCreate) -> models.Budget:
    db_budget = db.query(models.Budget).filter(models.Budget.user_id == user_id, models.Budget.month == budget.month).first()
    if db_budget:
        db_budget.amount = budget.amount
    else:
        db_budget = models.Budget(user_id=user_id, month=budget.month, amount=budget.amount)
        db.add(db_budget)
    db.commit()
    db.refresh(db_budget)
    return db_budget

def get_budget(db: Session, user_id: int, month: str) -> Optional[models.Budget]:
    return db.query(models.Budget).filter(models.Budget.user_id == user_id, models.Budget.month == month).first()

# ---- Reports ----
def summary_expenses(db: Session, user_id: int, month: str = None, category: str = None) -> Dict[str, Any]:
    q = db.query(models.Expense).filter(models.Expense.user_id == user_id)
    if month:
        q = q.filter(models.Expense.date.like(f"{month}-%"))
    if category:
        q = q.filter(models.Expense.category == category)
    expenses = q.all()
    total = sum(e.amount for e in expenses)
    return {"expenses": expenses, "total": total}

def report_by_category(db: Session, user_id: int, month: str = None) -> Dict[str, float]:
    from collections import defaultdict
    q = db.query(models.Expense).filter(models.Expense.user_id == user_id)
    if month:
        q = q.filter(models.Expense.date.like(f"{month}-%"))
    cat_total = defaultdict(float)
    for expense in q.all():
        cat_total[expense.category] += expense.amount
    return dict(cat_total)
def get_all_budgets(db: Session, user_id: int):
    return db.query(models.Budget).filter(models.Budget.user_id == user_id).all()