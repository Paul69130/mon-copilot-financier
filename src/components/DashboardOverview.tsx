
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Transaction, Category, BudgetItem } from '@/types/financial';
import { DollarSign, TrendingUp, TrendingDown, Target } from 'lucide-react';

interface DashboardOverviewProps {
  transactions: Transaction[];
  categories: Category[];
  budget: BudgetItem[];
}

const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  transactions,
  categories,
  budget
}) => {
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

  // Helper function to determine transaction type based on category type
  const getTransactionType = (transaction: Transaction): 'income' | 'expense' | 'balance_sheet' => {
    const category = getCategoryById(transaction.category_id);
    if (!category) return 'expense'; // Default fallback
    
    switch (category.type) {
      case 'income':
        return 'income';
      case 'expense':
        return 'expense';
      case 'BS':
        return 'balance_sheet';
      default:
        return 'expense';
    }
  };

  // Filter transactions by category type
  const incomeTransactions = transactions.filter(t => {
    const category = getCategoryById(t.category_id);
    return category?.type === 'income';
  });

  const expenseTransactions = transactions.filter(t => {
    const category = getCategoryById(t.category_id);
    return category?.type === 'expense';
  });

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

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
            <TrendingUp className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalIncome.toLocaleString()}</div>
            <p className="text-xs text-green-100">
              From {incomeTransactions.length} income transactions
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <TrendingDown className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalExpenses.toLocaleString()}</div>
            <p className="text-xs text-red-100">
              From {expenseTransactions.length} expense transactions
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Income</CardTitle>
            <DollarSign className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${netIncome.toLocaleString()}</div>
            <p className="text-xs text-blue-100">
              {netIncome > 0 ? '+' : ''}{totalIncome > 0 ? ((netIncome / totalIncome) * 100).toFixed(1) : '0'}% margin
            </p>
          </CardContent>
        </Card>

        <Card className={`bg-gradient-to-r ${budgetVariance > 0 ? 'from-orange-500 to-orange-600' : 'from-green-500 to-green-600'} text-white`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Budget Variance</CardTitle>
            <Target className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {budgetVariance > 0 ? '+' : ''}${budgetVariance.toLocaleString()}
            </div>
            <p className="text-xs text-white opacity-90">
              {budgetVariance > 0 ? 'Over budget' : 'Under budget'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Budget vs Actual by Category</CardTitle>
            <CardDescription>Compare your spending against budgeted amounts</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => `$${Number(value).toLocaleString()}`} />
                <Bar dataKey="budget" fill="#e5e7eb" name="Budget" />
                <Bar dataKey="actual" fill="#3b82f6" name="Actual" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Expense Breakdown</CardTitle>
            <CardDescription>Distribution of expenses by category</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={expenseData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {expenseData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `$${Number(value).toLocaleString()}`} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Financial Trend</CardTitle>
          <CardDescription>Income vs expenses over time</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => `$${Number(value).toLocaleString()}`} />
              <Line type="monotone" dataKey="income" stroke="#10b981" strokeWidth={2} name="Income" />
              <Line type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={2} name="Expenses" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardOverview;
