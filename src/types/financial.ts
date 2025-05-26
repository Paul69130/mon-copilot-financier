
export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  category_id?: string;
  type: 'income' | 'expense';
  source?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  type: 'income' | 'expense';
  created_at?: string;
  updated_at?: string;
}

export interface BudgetItem {
  id?: string;
  category_id: string;
  budget_amount: number;
  period: 'monthly' | 'quarterly' | 'yearly';
  created_at?: string;
  updated_at?: string;
}

export interface FinancialSummary {
  totalIncome: number;
  totalExpenses: number;
  netIncome: number;
  budgetVariance: number;
}
