
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Transaction, Category } from '@/types/financial';
import { TrendingUp } from 'lucide-react';
import { incomeLogService } from '@/services/incomeLogService';

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
    return category;
  };

  // Helper function to calculate transaction amount from debit/credit
  const calculateTransactionAmount = (transaction: Transaction): number => {
    const credit = transaction.credit || 0;
    const debit = transaction.debit || 0;
    return Math.abs(credit - debit);
  };

  // SPECIFIC CHECK FOR TRANSACTION 10260
  const transaction10260 = transactions.find(t => t.ecriture_num === '10260');
  if (transaction10260) {
    console.log('=== TRANSACTION 10260 FOUND IN TRANSACTIONS LIST ===');
    console.log('Transaction 10260 details:', transaction10260);
    console.log('Transaction 10260 category_id:', transaction10260.category_id);
    
    const category10260 = getCategoryById(transaction10260.category_id);
    if (category10260) {
      console.log('Transaction 10260 category found:', category10260);
      console.log('Transaction 10260 category type:', category10260.type);
      console.log('Transaction 10260 - Is income category?', category10260.type === 'income');
    } else {
      console.log('Transaction 10260 - NO CATEGORY FOUND');
    }
    
    console.log('Transaction 10260 amount:', calculateTransactionAmount(transaction10260));
    console.log('=== END TRANSACTION 10260 CHECK ===');
  } else {
    console.log('Transaction 10260 NOT FOUND in current transactions list');
    console.log('Total transactions in list:', transactions.length);
    console.log('Sample ecriture_num values:', transactions.slice(0, 5).map(t => t.ecriture_num));
  }

  // Filter transactions for income only
  const incomeTransactions = transactions.filter(t => {
    const category = getCategoryById(t.category_id);
    return category?.type === 'income';
  });

  const totalIncome = incomeTransactions.reduce((sum, t) => sum + calculateTransactionAmount(t), 0);

  // Log les opérations importantes
  useEffect(() => {
    // Log du filtrage des transactions de revenus
    incomeLogService.log({
      action: 'filter_income_transactions',
      details: {
        total_transactions: transactions.length,
        income_transactions_found: incomeTransactions.length,
        total_income_amount: totalIncome,
        categories_used: categories.filter(c => c.type === 'income').map(c => ({ id: c.id, name: c.name })),
        transaction_10260_found: transaction10260 ? 'YES' : 'NO',
        transaction_10260_category: transaction10260 ? getCategoryById(transaction10260.category_id)?.type : 'N/A'
      },
      component: 'IncomeTransactionsList'
    });

    // Log des transactions individuelles pour débuggage
    incomeTransactions.forEach(transaction => {
      incomeLogService.log({
        transaction_id: transaction.id,
        action: 'transaction_processed',
        details: {
          ecriture_num: transaction.ecriture_num,
          ecriture_lib: transaction.ecriture_lib,
          amount: calculateTransactionAmount(transaction),
          category_id: transaction.category_id,
          category_name: getCategoryById(transaction.category_id)?.name
        },
        component: 'IncomeTransactionsList'
      });
    });
  }, [transactions, categories, incomeTransactions.length, totalIncome]);

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
