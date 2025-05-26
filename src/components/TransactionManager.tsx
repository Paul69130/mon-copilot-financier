
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Transaction, Category } from '@/types/financial';
import { Upload, FileText, Edit3, Check, X } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface TransactionManagerProps {
  transactions: Transaction[];
  categories: Category[];
  onAddTransaction: (transaction: Transaction) => void;
  onUpdateTransaction: (id: string, updates: Partial<Transaction>) => void;
}

const TransactionManager: React.FC<TransactionManagerProps> = ({
  transactions,
  categories,
  onAddTransaction,
  onUpdateTransaction
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newTransaction, setNewTransaction] = useState({
    date: new Date().toISOString().split('T')[0],
    description: '',
    amount: '',
    type: 'expense' as 'income' | 'expense',
    categoryId: ''
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const csv = e.target?.result as string;
      const lines = csv.split('\n');
      const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
      
      let imported = 0;
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',');
        if (values.length < 3) continue;

        const dateIndex = headers.findIndex(h => h.includes('date'));
        const descIndex = headers.findIndex(h => h.includes('description') || h.includes('desc'));
        const amountIndex = headers.findIndex(h => h.includes('amount') || h.includes('value'));

        if (dateIndex >= 0 && descIndex >= 0 && amountIndex >= 0) {
          const amount = parseFloat(values[amountIndex].replace(/[^-\d.]/g, ''));
          if (!isNaN(amount)) {
            onAddTransaction({
              id: '',
              date: values[dateIndex].trim(),
              description: values[descIndex].trim(),
              amount: Math.abs(amount),
              type: amount < 0 ? 'expense' : 'income',
              source: 'csv-import'
            });
            imported++;
          }
        }
      }

      toast({
        title: "Import Successful",
        description: `Imported ${imported} transactions from CSV file.`,
      });
    };
    reader.readAsText(file);
  };

  const handleAddTransaction = () => {
    if (!newTransaction.description || !newTransaction.amount) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    onAddTransaction({
      id: '',
      date: newTransaction.date,
      description: newTransaction.description,
      amount: parseFloat(newTransaction.amount),
      type: newTransaction.type,
      categoryId: newTransaction.categoryId || undefined
    });

    setNewTransaction({
      date: new Date().toISOString().split('T')[0],
      description: '',
      amount: '',
      type: 'expense',
      categoryId: ''
    });

    toast({
      title: "Transaction Added",
      description: "Transaction has been successfully added.",
    });
  };

  const getCategoryName = (categoryId?: string) => {
    return categories.find(c => c.id === categoryId)?.name || 'Uncategorized';
  };

  const getCategoryColor = (categoryId?: string) => {
    return categories.find(c => c.id === categoryId)?.color || '#6b7280';
  };

  return (
    <div className="space-y-6">
      {/* File Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Import Transactions
          </CardTitle>
          <CardDescription>
            Upload a CSV file with columns: date, description, amount
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="hidden"
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
              className="w-full h-20 border-dashed"
            >
              <div className="text-center">
                <FileText className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p>Click to upload CSV file</p>
                <p className="text-xs text-gray-500">Supports CSV files with transaction data</p>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Manual Transaction Entry */}
      <Card>
        <CardHeader>
          <CardTitle>Add New Transaction</CardTitle>
          <CardDescription>Manually enter transaction details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={newTransaction.date}
                onChange={(e) => setNewTransaction(prev => ({ ...prev, date: e.target.value }))}
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                placeholder="Transaction description"
                value={newTransaction.description}
                onChange={(e) => setNewTransaction(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={newTransaction.amount}
                onChange={(e) => setNewTransaction(prev => ({ ...prev, amount: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Type</Label>
              <Select
                value={newTransaction.type}
                onValueChange={(value: 'income' | 'expense') => 
                  setNewTransaction(prev => ({ ...prev, type: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Category</Label>
              <Select
                value={newTransaction.categoryId}
                onValueChange={(value) => setNewTransaction(prev => ({ ...prev, categoryId: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories
                    .filter(c => c.type === newTransaction.type)
                    .map(category => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button onClick={handleAddTransaction} className="w-full">
                Add Transaction
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transactions List */}
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
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div className="flex-1">
                          <p className="font-medium">{transaction.description}</p>
                          <p className="text-sm text-gray-500">{transaction.date}</p>
                        </div>
                        <div className="text-right">
                          <p className={`font-semibold ${
                            transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toLocaleString()}
                          </p>
                          <Badge
                            style={{ backgroundColor: getCategoryColor(transaction.categoryId) }}
                            className="text-white text-xs"
                          >
                            {getCategoryName(transaction.categoryId)}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="ml-4">
                      <Select
                        value={transaction.categoryId || ''}
                        onValueChange={(categoryId) => 
                          onUpdateTransaction(transaction.id, { categoryId })
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
    </div>
  );
};

export default TransactionManager;
