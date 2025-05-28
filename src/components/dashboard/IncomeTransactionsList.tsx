
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
    const category = categories.find(cat => cat.id === categoryId);
    console.log(`Looking for category with ID: ${categoryId}, found:`, category);
    return category;
  };

  // Helper function to calculate transaction amount from debit/credit
  const calculateTransactionAmount = (transaction: Transaction): number => {
    const credit = transaction.credit || 0;
    const debit = transaction.debit || 0;
    return Math.abs(credit - debit);
  };

  console.log('=== INCOME TRANSACTIONS DEBUG ===');
  console.log('Total transactions received:', transactions.length);
  console.log('Total categories received:', categories.length);
  
  // Log the income category specifically
  const incomeCategory = categories.find(c => c.id === "c148f59b-45ac-4ce9-8f01-c6ba10cb83f3");
  console.log('Income category (c148f59b-45ac-4ce9-8f01-c6ba10cb83f3):', incomeCategory);
  
  // Log all categories for reference
  console.log('All categories:', categories.map(c => ({ id: c.id, name: c.name, type: c.type })));
  
  // Check for transaction 292 specifically (now as string)
  const transaction292 = transactions.find(t => t.ecriture_num === '292');
  console.log('Transaction "292" found in transactions array:', transaction292);
  
  // Check how many transactions have the income category_id
  const transactionsWithIncomeCategory = transactions.filter(t => t.category_id === "c148f59b-45ac-4ce9-8f01-c6ba10cb83f3");
  console.log('Transactions with income category_id:', transactionsWithIncomeCategory.length);
  console.log('Transactions with income category_id details:', transactionsWithIncomeCategory.map(t => ({
    ecriture_num: t.ecriture_num,
    ecriture_lib: t.ecriture_lib,
    category_id: t.category_id,
    credit: t.credit,
    debit: t.debit
  })));

  // Filter transactions for income only (same logic as in useFinancialCalculations)
  const incomeTransactions = transactions.filter(t => {
    console.log(`Checking transaction ${t.ecriture_num}:`, {
      ecriture_num: t.ecriture_num,
      category_id: t.category_id,
      ecriture_lib: t.ecriture_lib,
      credit: t.credit,
      debit: t.debit
    });
    
    const category = getCategoryById(t.category_id);
    const isIncome = category?.type === 'income';
    
    console.log(`Transaction ${t.ecriture_num} - Category type: ${category?.type}, Is income: ${isIncome}`);
    
    // Special logging for transaction "292"
    if (t.ecriture_num === '292') {
      console.log('*** TRANSACTION 292 DETAILS ***');
      console.log('Transaction object:', t);
      console.log('Category ID:', t.category_id);
      console.log('Found category:', category);
      console.log('Category type:', category?.type);
      console.log('Is income?:', isIncome);
      console.log('*** END TRANSACTION 292 DETAILS ***');
    }
    
    return isIncome;
  });

  console.log('Filtered income transactions count:', incomeTransactions.length);
  console.log('Income transactions ecriture_nums:', incomeTransactions.map(t => t.ecriture_num));
  console.log('=== END INCOME TRANSACTIONS DEBUG ===');

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
          <div className="text-center text-gray-500 py-8">
            <p>No income transactions found.</p>
            <p className="text-sm mt-2">
              Debug: {transactions.length} total transactions, {categories.length} categories
            </p>
            <p className="text-sm">
              Income category exists: {incomeCategory ? 'Yes' : 'No'}
            </p>
            <p className="text-sm">
              Transactions with income category: {transactionsWithIncomeCategory.length}
            </p>
          </div>
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
                    // Handle string sorting for ecriture_num
                    const aNum = a.ecriture_num || '';
                    const bNum = b.ecriture_num || '';
                    return bNum.localeCompare(aNum, undefined, { numeric: true });
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
