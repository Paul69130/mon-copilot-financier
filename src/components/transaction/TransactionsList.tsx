
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Transaction, Category } from '@/types/financial';
import { Lock } from 'lucide-react';

interface TransactionsListProps {
  transactions: Transaction[];
  categories: Category[];
  onUpdateTransaction: (id: string, updates: Partial<Transaction>) => void;
}

const TransactionsList: React.FC<TransactionsListProps> = ({ 
  transactions, 
  categories, 
  onUpdateTransaction 
}) => {
  const calculateAmount = (transaction: Transaction): number => {
    const credit = transaction.credit || 0;
    const debit = transaction.debit || 0;
    return credit - debit;
  };

  const getTransactionType = (transaction: Transaction): 'income' | 'expense' | 'balance_sheet' => {
    const category = categories.find(c => c.id === transaction.category_id);
    if (category?.type === 'BS') return 'balance_sheet';
    
    const amount = calculateAmount(transaction);
    return amount >= 0 ? 'income' : 'expense';
  };

  const getDisplayAmount = (transaction: Transaction): number => {
    return Math.abs(calculateAmount(transaction));
  };

  const getCategoryInfo = (transaction: Transaction) => {
    return categories.find(c => c.id === transaction.category_id);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'income': return 'text-green-600';
      case 'expense': return 'text-red-600';
      case 'balance_sheet': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'income': return 'bg-green-500';
      case 'expense': return 'bg-red-500';
      case 'balance_sheet': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
        <CardDescription>
          {transactions.length} transactions total - automatically categorized by French chart of accounts
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {transactions.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              No transactions yet. Upload a CSV file or add transactions manually.
            </p>
          ) : (
            transactions
              .sort((a, b) => new Date(b.ecriture_date).getTime() - new Date(a.ecriture_date).getTime())
              .map((transaction) => {
                const transactionType = getTransactionType(transaction);
                const displayAmount = getDisplayAmount(transaction);
                const category = getCategoryInfo(transaction);
                
                return (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
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
                              <p>Compte: {transaction.compte_num} - {transaction.compte_lib}</p>
                            )}
                            {transaction.piece_ref && (
                              <p>Pièce: {transaction.piece_ref}</p>
                            )}
                            {category && (
                              <div className="flex items-center gap-2">
                                <div
                                  className="w-3 h-3 rounded"
                                  style={{ backgroundColor: category.color }}
                                />
                                <span className="flex items-center gap-1">
                                  {category.name}
                                  {category.is_system_category && <Lock className="h-3 w-3" />}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-semibold ${getTypeColor(transactionType)}`}>
                            {transactionType === 'income' ? '+' : transactionType === 'expense' ? '-' : ''}
                            ${displayAmount.toLocaleString()}
                          </p>
                          {(transaction.debit || transaction.credit) && (
                            <div className="text-xs text-gray-500">
                              {transaction.debit && <p>D: ${transaction.debit.toLocaleString()}</p>}
                              {transaction.credit && <p>C: ${transaction.credit.toLocaleString()}</p>}
                            </div>
                          )}
                          <Badge className={`text-white text-xs ${getTypeBadgeColor(transactionType)}`}>
                            {transactionType === 'income' ? 'Income' : 
                             transactionType === 'expense' ? 'Expense' : 'Balance Sheet'}
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

export default TransactionsList;
