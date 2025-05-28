
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Transaction, Category } from '@/types/financial';
import { TrendingUp } from 'lucide-react';

interface IncomeTransactionsListProps {
  transactions: Transaction[];
  categories: Category[];
}

const IncomeTransactionsList: React.FC<IncomeTransactionsListProps> = ({
  transactions,
  categories
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

  // Filter transactions for income only (same logic as in useFinancialCalculations)
  const incomeTransactions = transactions.filter(t => {
    const category = getCategoryById(t.category_id);
    return category?.type === 'income';
  });

  const totalIncome = incomeTransactions.reduce((sum, t) => sum + calculateTransactionAmount(t), 0);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            Income Transactions
          </CardTitle>
          <Badge variant="outline" className="text-green-600 border-green-600">
            Total: ${totalIncome.toLocaleString()}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {incomeTransactions.length === 0 ? (
          <p className="text-center text-gray-500 py-8">
            No income transactions found.
          </p>
        ) : (
          <div className="max-h-96 overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Entry #</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {incomeTransactions
                  .sort((a, b) => {
                    const aNum = a.ecriture_num || 0;
                    const bNum = b.ecriture_num || 0;
                    return bNum - aNum; // Sort by ecriture_num in descending order
                  })
                  .map((transaction) => {
                    const amount = calculateTransactionAmount(transaction);
                    
                    return (
                      <TableRow key={transaction.id} className="hover:bg-green-50">
                        <TableCell className="font-medium">
                          {transaction.ecriture_num || '-'}
                        </TableCell>
                        <TableCell>
                          {transaction.ecriture_date}
                        </TableCell>
                        <TableCell>
                          {transaction.ecriture_lib}
                        </TableCell>
                        <TableCell className="text-right font-semibold text-green-600">
                          +${amount.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    );
                  })
                }
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default IncomeTransactionsList;
