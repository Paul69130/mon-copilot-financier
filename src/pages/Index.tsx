
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardOverview from '@/components/DashboardOverview';
import TransactionManager from '@/components/TransactionManager';
import BudgetAnalysis from '@/components/BudgetAnalysis';
import CategoryManager from '@/components/CategoryManager';
import { useCategories } from '@/hooks/useCategories';
import { useTransactions } from '@/hooks/useTransactions';
import { useBudget } from '@/hooks/useBudget';

const Index = () => {
  const { categories, loading: categoriesLoading, addCategory, updateCategories } = useCategories();
  const { transactions, loading: transactionsLoading, addTransaction, updateTransaction } = useTransactions();
  const { budget, loading: budgetLoading, updateBudget } = useBudget();

  const isLoading = categoriesLoading || transactionsLoading || budgetLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Loading financial data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Financial Dashboard</h1>
          <p className="text-lg text-gray-600">
            Analyze your financial performance with transaction tracking, budget comparison, and forecasting
          </p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-[600px]">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="budget">Budget Analysis</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <DashboardOverview 
              transactions={transactions}
              categories={categories}
              budget={budget}
            />
          </TabsContent>

          <TabsContent value="transactions" className="space-y-6">
            <TransactionManager
              transactions={transactions}
              categories={categories}
              onAddTransaction={addTransaction}
              onUpdateTransaction={updateTransaction}
            />
          </TabsContent>

          <TabsContent value="budget" className="space-y-6">
            <BudgetAnalysis
              transactions={transactions}
              categories={categories}
              budget={budget}
              onUpdateBudget={updateBudget}
            />
          </TabsContent>

          <TabsContent value="categories" className="space-y-6">
            <CategoryManager
              categories={categories}
              onUpdateCategories={updateCategories}
              onAddCategory={addCategory}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
