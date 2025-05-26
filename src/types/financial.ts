
export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  categoryId?: string;
  type: 'income' | 'expense';
  source?: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  type: 'income' | 'expense';
}

export interface BudgetItem {
  categoryId: string;
  budgetAmount: number;
  period: 'monthly' | 'quarterly' | 'yearly';
}

export interface FinancialSummary {
  totalIncome: number;
  totalExpenses: number;
  netIncome: number;
  budgetVariance: number;
}
