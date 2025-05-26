
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Transaction, Category, BudgetItem } from '@/types/financial';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle } from 'lucide-react';

interface BudgetAnalysisProps {
  transactions: Transaction[];
  categories: Category[];
  budget: BudgetItem[];
  onUpdateBudget: (budget: BudgetItem[]) => void;
}

const BudgetAnalysis: React.FC<BudgetAnalysisProps> = ({
  transactions,
  categories,
  budget,
  onUpdateBudget
}) => {
  const [editingBudget, setEditingBudget] = useState<{ [key: string]: string }>({});

  const updateBudgetAmount = (categoryId: string, amount: string) => {
    const numAmount = parseFloat(amount);
    if (!isNaN(numAmount)) {
      const updatedBudget = budget.map(b => 
        b.category_id === categoryId 
          ? { ...b, budget_amount: numAmount }
          : b
      );
      
      if (!budget.find(b => b.category_id === categoryId)) {
        updatedBudget.push({
          category_id: categoryId,
          budget_amount: numAmount,
          period: 'monthly'
        });
      }
      
      onUpdateBudget(updatedBudget);
    }
    setEditingBudget(prev => ({ ...prev, [categoryId]: '' }));
  };

  const getBudgetAnalysis = (categoryId: string) => {
    const categoryTransactions = transactions.filter(t => t.category_id === categoryId);
    const actualAmount = categoryTransactions.reduce((sum, t) => sum + t.amount, 0);
    const budgetItem = budget.find(b => b.category_id === categoryId);
    const budgetAmount = budgetItem?.budget_amount || 0;
    
    const percentage = budgetAmount > 0 ? (actualAmount / budgetAmount) * 100 : 0;
    const variance = actualAmount - budgetAmount;
    
    return {
      actual: actualAmount,
      budget: budgetAmount,
      percentage,
      variance,
      status: percentage > 100 ? 'over' : percentage > 80 ? 'warning' : 'good'
    };
  };

  const chartData = categories.map(category => {
    const analysis = getBudgetAnalysis(category.id);
    return {
      name: category.name,
      actual: analysis.actual,
      budget: analysis.budget,
      variance: analysis.variance,
      color: category.color
    };
  });

  const overBudgetCategories = categories.filter(cat => {
    const analysis = getBudgetAnalysis(cat.id);
    return analysis.status === 'over';
  });

  const totalBudget = budget.reduce((sum, b) => sum + b.budget_amount, 0);
  const totalActual = transactions.reduce((sum, t) => sum + t.amount, 0);
  const totalVariance = totalActual - totalBudget;

  return (
    <div className="space-y-6">
      {/* Budget Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalBudget.toLocaleString()}</div>
            <p className="text-xs text-gray-500">Monthly budget allocation</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Actual Spending</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalActual.toLocaleString()}</div>
            <p className="text-xs text-gray-500">Current period spending</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Variance</CardTitle>
            {totalVariance > 0 ? (
              <AlertTriangle className="h-4 w-4 text-orange-500" />
            ) : (
              <CheckCircle className="h-4 w-4 text-green-500" />
            )}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${totalVariance > 0 ? 'text-red-600' : 'text-green-600'}`}>
              {totalVariance > 0 ? '+' : ''}${totalVariance.toLocaleString()}
            </div>
            <p className="text-xs text-gray-500">
              {totalVariance > 0 ? 'Over budget' : 'Under budget'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Budget vs Actual Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Budget vs Actual Comparison</CardTitle>
          <CardDescription>Compare budgeted amounts with actual spending by category</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip 
                formatter={(value, name) => [
                  `$${Number(value).toLocaleString()}`,
                  name === 'actual' ? 'Actual' : name === 'budget' ? 'Budget' : 'Variance'
                ]}
              />
              <Bar dataKey="budget" fill="#e5e7eb" name="Budget" />
              <Bar dataKey="actual" fill="#3b82f6" name="Actual" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Category Budget Management */}
      <Card>
        <CardHeader>
          <CardTitle>Budget by Category</CardTitle>
          <CardDescription>Set and monitor budget limits for each category</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {categories.map(category => {
              const analysis = getBudgetAnalysis(category.id);
              const isEditing = editingBudget[category.id] !== undefined;
              
              return (
                <div key={category.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-4 h-4 rounded"
                        style={{ backgroundColor: category.color }}
                      />
                      <h4 className="font-medium">{category.name}</h4>
                      <Badge
                        variant={
                          analysis.status === 'over' ? 'destructive' :
                          analysis.status === 'warning' ? 'secondary' : 'default'
                        }
                      >
                        {analysis.percentage.toFixed(0)}%
                      </Badge>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">
                        ${analysis.actual.toLocaleString()} / ${analysis.budget.toLocaleString()}
                      </p>
                      {analysis.variance !== 0 && (
                        <p className={`text-xs ${analysis.variance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                          {analysis.variance > 0 ? '+' : ''}${analysis.variance.toLocaleString()} variance
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <Progress 
                    value={Math.min(analysis.percentage, 100)} 
                    className="h-2"
                  />
                  
                  <div className="flex items-center gap-2">
                    <Label htmlFor={`budget-${category.id}`} className="text-sm">
                      Monthly Budget:
                    </Label>
                    {isEditing ? (
                      <div className="flex items-center gap-2">
                        <Input
                          id={`budget-${category.id}`}
                          type="number"
                          step="0.01"
                          value={editingBudget[category.id]}
                          onChange={(e) => setEditingBudget(prev => ({
                            ...prev,
                            [category.id]: e.target.value
                          }))}
                          onBlur={() => updateBudgetAmount(category.id, editingBudget[category.id])}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              updateBudgetAmount(category.id, editingBudget[category.id]);
                            }
                          }}
                          className="w-32"
                          autoFocus
                        />
                      </div>
                    ) : (
                      <button
                        onClick={() => setEditingBudget(prev => ({
                          ...prev,
                          [category.id]: analysis.budget.toString()
                        }))}
                        className="text-blue-600 hover:text-blue-800 text-sm underline"
                      >
                        ${analysis.budget.toLocaleString()}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Alerts */}
      {overBudgetCategories.length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="text-orange-800 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Budget Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {overBudgetCategories.map(category => {
                const analysis = getBudgetAnalysis(category.id);
                return (
                  <div key={category.id} className="flex items-center justify-between p-2 bg-white rounded border">
                    <span className="font-medium">{category.name}</span>
                    <span className="text-red-600">
                      ${analysis.variance.toLocaleString()} over budget
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BudgetAnalysis;
