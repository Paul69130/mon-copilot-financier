
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Transaction, Category } from '@/types/financial';

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

  const getTransactionType = (transaction: Transaction): 'income' | 'expense' => {
    const amount = calculateAmount(transaction);
    return amount >= 0 ? 'income' : 'expense';
  };

  const getDisplayAmount = (transaction: Transaction): number => {
    return Math.abs(calculateAmount(transaction));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
        <CardDescription>
          {transactions.length} transactions total
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
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-semibold ${
                            transactionType === 'income' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {transactionType === 'income' ? '+' : '-'}${displayAmount.toLocaleString()}
                          </p>
                          {(transaction.debit || transaction.credit) && (
                            <div className="text-xs text-gray-500">
                              {transaction.debit && <p>D: ${transaction.debit.toLocaleString()}</p>}
                              {transaction.credit && <p>C: ${transaction.credit.toLocaleString()}</p>}
                            </div>
                          )}
                          <Badge className="text-white text-xs bg-gray-500">
                            {transactionType === 'income' ? 'Income' : 'Expense'}
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
