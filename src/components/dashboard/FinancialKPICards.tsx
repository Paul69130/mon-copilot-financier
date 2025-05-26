
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingUp, TrendingDown, Target } from 'lucide-react';

interface FinancialKPICardsProps {
  totalIncome: number;
  totalExpenses: number;
  netIncome: number;
  budgetVariance: number;
  incomeTransactionCount: number;
  expenseTransactionCount: number;
}

const FinancialKPICards: React.FC<FinancialKPICardsProps> = ({
  totalIncome,
  totalExpenses,
  netIncome,
  budgetVariance,
  incomeTransactionCount,
  expenseTransactionCount
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Income</CardTitle>
          <TrendingUp className="h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${totalIncome.toLocaleString()}</div>
          <p className="text-xs text-green-100">
            From {incomeTransactionCount} income transactions
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
            From {expenseTransactionCount} expense transactions
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
  );
};

export default FinancialKPICards;
