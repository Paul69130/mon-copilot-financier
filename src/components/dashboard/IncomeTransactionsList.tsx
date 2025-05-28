
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {incomeTransactions.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              No income transactions found.
            </p>
          ) : (
            incomeTransactions
              .sort((a, b) => new Date(b.ecriture_date).getTime() - new Date(a.ecriture_date).getTime())
              .map((transaction) => {
                const category = getCategoryById(transaction.category_id);
                const amount = calculateTransactionAmount(transaction);
                
                return (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-green-50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div className="flex-1">
                          <p className="font-medium">{transaction.ecriture_lib}</p>
                          <div className="text-sm text-gray-500 space-y-1">
                            <p>{transaction.ecriture_date}</p>
                            {transaction.journal_code && (
                              <p>Journal: {transaction.journal_code} - {transaction.journal_lib}</p>
                            )}
                            {transaction.compte_num && (
                              <p>Account: {transaction.compte_num} - {transaction.compte_lib}</p>
                            )}
                            {transaction.piece_ref && (
                              <p>Reference: {transaction.piece_ref}</p>
                            )}
                            {category && (
                              <div className="flex items-center gap-2">
                                <div
                                  className="w-3 h-3 rounded"
                                  style={{ backgroundColor: category.color }}
                                />
                                <span>{category.name}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-green-600 text-lg">
                            +${amount.toLocaleString()}
                          </p>
                          {(transaction.debit || transaction.credit) && (
                            <div className="text-xs text-gray-500">
                              {transaction.debit && <p>Debit: ${transaction.debit.toLocaleString()}</p>}
                              {transaction.credit && <p>Credit: ${transaction.credit.toLocaleString()}</p>}
                            </div>
                          )}
                          <Badge className="bg-green-500 text-white text-xs mt-1">
                            Income
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default IncomeTransactionsList;
