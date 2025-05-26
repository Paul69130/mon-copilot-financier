
import React from 'react';
import { Transaction, Category, BudgetItem } from '@/types/financial';
import { useFinancialCalculations } from '@/hooks/useFinancialCalculations';
import FinancialKPICards from './dashboard/FinancialKPICards';
import BudgetVsActualChart from './dashboard/BudgetVsActualChart';
import ExpenseBreakdownChart from './dashboard/ExpenseBreakdownChart';
import FinancialTrendChart from './dashboard/FinancialTrendChart';

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
  const {
    totalIncome,
    totalExpenses,
    netIncome,
    budgetVariance,
    incomeTransactionCount,
    expenseTransactionCount,
    categoryData,
    expenseData,
    trendData
  } = useFinancialCalculations(transactions, categories, budget);

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <FinancialKPICards
        totalIncome={totalIncome}
        totalExpenses={totalExpenses}
        netIncome={netIncome}
        budgetVariance={budgetVariance}
        incomeTransactionCount={incomeTransactionCount}
        expenseTransactionCount={expenseTransactionCount}
      />

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BudgetVsActualChart categoryData={categoryData} />
        <ExpenseBreakdownChart expenseData={expenseData} />
      </div>

      <FinancialTrendChart trendData={trendData} />
    </div>
  );
};

export default DashboardOverview;
