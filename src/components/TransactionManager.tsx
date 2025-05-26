
import React from 'react';
import { Transaction, Category } from '@/types/financial';
import CSVImportCard from './transaction/CSVImportCard';
import TransactionForm from './transaction/TransactionForm';
import TransactionsList from './transaction/TransactionsList';

interface TransactionManagerProps {
  transactions: Transaction[];
  categories: Category[];
  onAddTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  onUpdateTransaction: (id: string, updates: Partial<Transaction>) => void;
}

const TransactionManager: React.FC<TransactionManagerProps> = ({
  transactions,
  categories,
  onAddTransaction,
  onUpdateTransaction
}) => {
  return (
    <div className="space-y-6">
      <CSVImportCard onAddTransaction={onAddTransaction} />
      <TransactionForm categories={categories} onAddTransaction={onAddTransaction} />
      <TransactionsList 
        transactions={transactions}
        categories={categories}
        onUpdateTransaction={onUpdateTransaction}
      />
    </div>
  );
};

export default TransactionManager;
