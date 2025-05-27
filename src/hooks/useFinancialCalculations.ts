
import { Transaction, Category, BudgetItem } from '@/types/financial';

export const useFinancialCalculations = (
  transactions: Transaction[],
  categories: Category[],
  budget: BudgetItem[]
) => {
  // Helper function to get category by id
  const getCategoryById = (categoryId: string | undefined) => {
    return categories.find(cat => cat.id === categoryId);
  };

  // Helper function to calculate transaction amount from debit/credit
  const calculateTransactionAmount = (transaction: Transaction): number => {
    const credit = transaction.credit || 0;
    const debit = transaction.debit || 0;
    return Math.abs(credit - debit);
  };

  // Filter transactions by category type (transactions are already filtered by fiscal year in the parent component)
  // Only include transactions that have categories assigned
  const incomeTransactions = transactions.filter(t => {
    const category = getCategoryById(t.category_id);
    return category?.type === 'income';
  });

  const expenseTransactions = transactions.filter(t => {
    const category = getCategoryById(t.category_id);
    return category?.type === 'expense';
  });

  // Count unclassified transactions (those without categories)
  const unclassifiedTransactions = transactions.filter(t => !t.category_id);

  const totalIncome = incomeTransactions.reduce((sum, t) => sum + calculateTransactionAmount(t), 0);
  const totalExpenses = expenseTransactions.reduce((sum, t) => sum + calculateTransactionAmount(t), 0);
  const netIncome = totalIncome - totalExpenses;

  const totalBudget = budget.reduce((sum, b) => sum + b.budget_amount, 0);
  const budgetVariance = totalExpenses - budget
    .filter(b => {
      const category = categories.find(c => c.id === b.category_id);
      return category?.type === 'expense';
    })
    .reduce((sum, b) => sum + b.budget_amount, 0);

  // Category data for charts - using filtered transactions
  const categoryData = categories.map(category => {
    const budgetItem = budget.find(b => b.category_id === category.id);
    const categoryTransactions = transactions.filter(t => t.category_id === category.id);
    const actualAmount = categoryTransactions.reduce((sum, t) => sum + calculateTransactionAmount(t), 0);
    
    return {
      name: category.name,
      actual: actualAmount,
      budget: budgetItem?.budget_amount || 0,
      color: category.color
    };
  });

  const expenseData = categories
    .filter(c => c.type === 'expense')
    .map(category => {
      const categoryTransactions = transactions.filter(t => t.category_id === category.id);
      const value = categoryTransactions.reduce((sum, t) => sum + calculateTransactionAmount(t), 0);
      
      return {
        name: category.name,
        value,
        color: category.color
      };
    })
    .filter(d => d.value > 0);

  // Generate trend data based on filtered transactions (group by month)
  const trendData = Array.from({ length: 12 }, (_, i) => {
    const monthStart = new Date(2024, i, 1);
    const monthEnd = new Date(2024, i + 1, 0);
    
    const monthTransactions = transactions.filter(t => {
      const transactionDate = new Date(t.ecriture_date);
      return transactionDate >= monthStart && transactionDate <= monthEnd;
    });
    
    const monthIncome = monthTransactions
      .filter(t => {
        const category = getCategoryById(t.category_id);
        return category?.type === 'income';
      })
      .reduce((sum, t) => sum + calculateTransactionAmount(t), 0);
      
    const monthExpenses = monthTransactions
      .filter(t => {
        const category = getCategoryById(t.category_id);
        return category?.type === 'expense';
      })
      .reduce((sum, t) => sum + calculateTransactionAmount(t), 0);
    
    return {
      month: monthStart.toLocaleDateString('en-US', { month: 'short' }),
      income: monthIncome,
      expenses: monthExpenses,
    };
  });

  return {
    totalIncome,
    totalExpenses,
    netIncome,
    budgetVariance,
    incomeTransactionCount: incomeTransactions.length,
    expenseTransactionCount: expenseTransactions.length,
    unclassifiedTransactionCount: unclassifiedTransactions.length,
    categoryData,
    expenseData,
    trendData
  };
};
