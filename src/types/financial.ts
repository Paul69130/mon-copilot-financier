
export interface Transaction {
  id: string;
  source?: string;
  created_at?: string;
  updated_at?: string;
  
  // French accounting fields (primary)
  journal_code?: string;
  journal_lib?: string;
  ecriture_num?: string;
  ecriture_date: string; // Primary date field
  compte_num?: string;
  compte_lib?: string;
  comp_aux_num?: string;
  comp_aux_lib?: string;
  piece_ref?: string;
  piece_date?: string;
  ecriture_lib: string; // Primary description field
  debit?: number;
  credit?: number;
  ecriture_let?: string;
  date_let?: string;
  valid_date?: string;
  montant_devise?: number;
  idevise?: string;
  num_doc?: string;
  journal_type?: string;
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
