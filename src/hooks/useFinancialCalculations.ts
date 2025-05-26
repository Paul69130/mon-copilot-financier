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

  // Filter income transactions by compte_num starting with "7"
  const incomeTransactions = transactions.filter(t => {
    return t.compte_num?.startsWith('7');
  });

  // Filter expense transactions by category type (keeping existing logic for expenses)
  const expenseTransactions = transactions.filter(t => {
    const category = getCategoryById(t.category_id);
    return category?.type === 'expense';
  });

  // Calculate total income: sum of credits minus sum of debits for compte_num starting with "7"
  const totalIncome = incomeTransactions.reduce((sum, t) => {
    const credit = t.credit || 0;
    const debit = t.debit || 0;
    return sum + (credit - debit);
  }, 0);

  const totalExpenses = expenseTransactions.reduce((sum, t) => sum + calculateTransactionAmount(t), 0);
  const netIncome = totalIncome - totalExpenses;

  const totalBudget = budget.reduce((sum, b) => sum + b.budget_amount, 0);
  const budgetVariance = totalExpenses - budget
    .filter(b => {
      const category = categories.find(c => c.id === b.category_id);
      return category?.type === 'expense';
    })
    .reduce((sum, b) => sum + b.budget_amount, 0);

  // Category data for charts - using category type for proper classification
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

  // Generate trend data (mock data for demonstration)
  const trendData = Array.from({ length: 12 }, (_, i) => ({
    month: new Date(2024, i).toLocaleDateString('en-US', { month: 'short' }),
    income: Math.random() * 20000 + 30000,
    expenses: Math.random() * 15000 + 20000,
  }));

  return {
    totalIncome,
    totalExpenses,
    netIncome,
    budgetVariance,
    incomeTransactionCount: incomeTransactions.length,
    expenseTransactionCount: expenseTransactions.length,
    categoryData,
    expenseData,
    trendData
  };
};
