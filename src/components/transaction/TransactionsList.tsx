
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  const getCategoryName = (category_id?: string) => {
    return categories.find(c => c.id === category_id)?.name || 'Uncategorized';
  };

  const getCategoryColor = (category_id?: string) => {
    return categories.find(c => c.id === category_id)?.color || '#6b7280';
  };

  const getDisplayDate = (transaction: Transaction) => {
    return transaction.ecriture_date || transaction.date;
  };

  const getDisplayDescription = (transaction: Transaction) => {
    return transaction.ecriture_lib || transaction.description;
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
              .sort((a, b) => new Date(getDisplayDate(b)).getTime() - new Date(getDisplayDate(a)).getTime())
              .map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <p className="font-medium">{getDisplayDescription(transaction)}</p>
                        <div className="text-sm text-gray-500 space-y-1">
                          <p>{getDisplayDate(transaction)}</p>
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
                          transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toLocaleString()}
                        </p>
                        {(transaction.debit || transaction.credit) && (
                          <div className="text-xs text-gray-500">
                            {transaction.debit && <p>D: ${transaction.debit.toLocaleString()}</p>}
                            {transaction.credit && <p>C: ${transaction.credit.toLocaleString()}</p>}
                          </div>
                        )}
                        <Badge
                          style={{ backgroundColor: getCategoryColor(transaction.category_id) }}
                          className="text-white text-xs"
                        >
                          {getCategoryName(transaction.category_id)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="ml-4">
                    <Select
                      value={transaction.category_id || ''}
                      onValueChange={(category_id) => 
                        onUpdateTransaction(transaction.id, { category_id })
                      }
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories
                          .filter(c => c.type === transaction.type)
                          .map(category => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TransactionsList;
