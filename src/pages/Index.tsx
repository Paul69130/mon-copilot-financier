
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardOverview from '@/components/DashboardOverview';
import TransactionManager from '@/components/TransactionManager';
import BudgetAnalysis from '@/components/BudgetAnalysis';
import CategoryManager from '@/components/CategoryManager';
import { Transaction, Category, BudgetItem } from '@/types/financial';

const Index = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([
    { id: '1', name: 'Revenue', color: '#10b981', type: 'income' },
    { id: '2', name: 'Marketing', color: '#f59e0b', type: 'expense' },
    { id: '3', name: 'Operations', color: '#ef4444', type: 'expense' },
    { id: '4', name: 'Travel', color: '#8b5cf6', type: 'expense' },
    { id: '5', name: 'Office Supplies', color: '#06b6d4', type: 'expense' },
  ]);
  
  const [budget, setBudget] = useState<BudgetItem[]>([
    { categoryId: '1', budgetAmount: 50000, period: 'monthly' },
    { categoryId: '2', budgetAmount: 15000, period: 'monthly' },
    { categoryId: '3', budgetAmount: 25000, period: 'monthly' },
    { categoryId: '4', budgetAmount: 5000, period: 'monthly' },
    { categoryId: '5', budgetAmount: 3000, period: 'monthly' },
  ]);

  const addTransaction = (transaction: Transaction) => {
    setTransactions(prev => [...prev, { ...transaction, id: Date.now().toString() }]);
  };

  const updateTransaction = (id: string, updates: Partial<Transaction>) => {
    setTransactions(prev => 
      prev.map(t => t.id === id ? { ...t, ...updates } : t)
    );
  };

  const addCategory = (category: Omit<Category, 'id'>) => {
    const newCategory = { ...category, id: Date.now().toString() };
    setCategories(prev => [...prev, newCategory]);
    return newCategory.id;
  };

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
              onUpdateBudget={setBudget}
            />
          </TabsContent>

          <TabsContent value="categories" className="space-y-6">
            <CategoryManager
              categories={categories}
              onUpdateCategories={setCategories}
              onAddCategory={addCategory}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
