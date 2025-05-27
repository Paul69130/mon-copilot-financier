
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, DollarSign, AlertTriangle } from 'lucide-react';

interface FinancialKPICardsProps {
  totalIncome: number;
  totalExpenses: number;
  netIncome: number;
  budgetVariance: number;
  incomeTransactionCount: number;
  expenseTransactionCount: number;
  unclassifiedTransactionCount?: number;
}

const FinancialKPICards: React.FC<FinancialKPICardsProps> = ({
  totalIncome,
  totalExpenses,
  netIncome,
  budgetVariance,
  incomeTransactionCount,
  expenseTransactionCount,
  unclassifiedTransactionCount = 0
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Income</CardTitle>
          <TrendingUp className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            ${totalIncome.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground">
            {incomeTransactionCount} transactions
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
          <TrendingDown className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">
            ${totalExpenses.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground">
            {expenseTransactionCount} transactions
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Net Income</CardTitle>
          <DollarSign className={`h-4 w-4 ${netIncome >= 0 ? 'text-green-600' : 'text-red-600'}`} />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${netIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            ${netIncome.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground">
            {netIncome >= 0 ? 'Profit' : 'Loss'}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {unclassifiedTransactionCount > 0 ? 'Unclassified' : 'Budget Variance'}
          </CardTitle>
          {unclassifiedTransactionCount > 0 ? (
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          ) : (
            <DollarSign className={`h-4 w-4 ${budgetVariance <= 0 ? 'text-green-600' : 'text-red-600'}`} />
          )}
        </CardHeader>
        <CardContent>
          {unclassifiedTransactionCount > 0 ? (
            <>
              <div className="text-2xl font-bold text-orange-600">
                {unclassifiedTransactionCount}
              </div>
              <p className="text-xs text-muted-foreground">
                Transactions need categorization
              </p>
            </>
          ) : (
            <>
              <div className={`text-2xl font-bold ${budgetVariance <= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${Math.abs(budgetVariance).toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                {budgetVariance <= 0 ? 'Under budget' : 'Over budget'}
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FinancialKPICards;
