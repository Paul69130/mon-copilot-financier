
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface CategoryData {
  name: string;
  actual: number;
  budget: number;
  color: string;
}

interface BudgetVsActualChartProps {
  categoryData: CategoryData[];
}

const BudgetVsActualChart: React.FC<BudgetVsActualChartProps> = ({ categoryData }) => {
  return (
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
  );
};

export default BudgetVsActualChart;
