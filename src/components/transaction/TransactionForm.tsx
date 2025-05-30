
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Transaction, Category } from '@/types/financial';
import { useToast } from "@/hooks/use-toast";
import { Info } from 'lucide-react';

interface TransactionFormProps {
  categories: Category[];
  onAddTransaction: (transaction: Omit<Transaction, 'id'>) => void;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ categories, onAddTransaction }) => {
  const [newTransaction, setNewTransaction] = useState({
    ecriture_date: new Date().toISOString().split('T')[0],
    ecriture_lib: '',
    journal_code: '',
    journal_lib: '',
    compte_num: '',
    compte_lib: '',
    piece_ref: '',
    debit: '',
    credit: ''
  });
  const { toast } = useToast();

  const handleAddTransaction = () => {
    if (!newTransaction.ecriture_lib) {
      toast({
        title: "Error",
        description: "Please fill in at least the description field.",
        variant: "destructive"
      });
      return;
    }

    const debit = newTransaction.debit ? parseFloat(newTransaction.debit) : undefined;
    const credit = newTransaction.credit ? parseFloat(newTransaction.credit) : undefined;

    onAddTransaction({
      // French accounting fields
      ecriture_date: newTransaction.ecriture_date,
      ecriture_lib: newTransaction.ecriture_lib,
      journal_code: newTransaction.journal_code || undefined,
      journal_lib: newTransaction.journal_lib || undefined,
      compte_num: newTransaction.compte_num || undefined,
      compte_lib: newTransaction.compte_lib || undefined,
      piece_ref: newTransaction.piece_ref || undefined,
      debit: debit,
      credit: credit
    });

    setNewTransaction({
      ecriture_date: new Date().toISOString().split('T')[0],
      ecriture_lib: '',
      journal_code: '',
      journal_lib: '',
      compte_num: '',
      compte_lib: '',
      piece_ref: '',
      debit: '',
      credit: ''
    });

    toast({
      title: "Transaction Added",
      description: "Transaction has been successfully added and automatically categorized.",
    });
  };

  // Helper function to show which category will be assigned based on compte_num
  const getPreviewCategory = () => {
    if (!newTransaction.compte_num) return null;
    const firstDigit = newTransaction.compte_num.charAt(0);
    return categories.find(c => c.account_prefix === firstDigit && c.is_system_category);
  };

  const previewCategory = getPreviewCategory();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Transaction</CardTitle>
        <CardDescription>Manually enter transaction details with French accounting fields</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Info about automatic categorization */}
          <div className="bg-blue-50 p-3 rounded-lg flex items-start gap-2">
            <Info className="h-4 w-4 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-medium">Automatic categorization</p>
              <p>Categories are automatically assigned based on the first digit of the account number (compte_num) according to the French chart of accounts.</p>
            </div>
          </div>

          {/* Primary fields */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="ecriture_date">Date d'écriture</Label>
              <Input
                id="ecriture_date"
                type="date"
                value={newTransaction.ecriture_date}
                onChange={(e) => setNewTransaction(prev => ({ ...prev, ecriture_date: e.target.value }))}
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="ecriture_lib">Libellé d'écriture</Label>
              <Input
                id="ecriture_lib"
                placeholder="Description de l'écriture"
                value={newTransaction.ecriture_lib}
                onChange={(e) => setNewTransaction(prev => ({ ...prev, ecriture_lib: e.target.value }))}
              />
            </div>
          </div>

          {/* Journal and Account fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="journal_code">Code Journal</Label>
                <Input
                  id="journal_code"
                  placeholder="VTE"
                  value={newTransaction.journal_code}
                  onChange={(e) => setNewTransaction(prev => ({ ...prev, journal_code: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="journal_lib">Libellé Journal</Label>
                <Input
                  id="journal_lib"
                  placeholder="Ventes"
                  value={newTransaction.journal_lib}
                  onChange={(e) => setNewTransaction(prev => ({ ...prev, journal_lib: e.target.value }))}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="compte_num">Numéro Compte</Label>
                <Input
                  id="compte_num"
                  placeholder="411000"
                  value={newTransaction.compte_num}
                  onChange={(e) => setNewTransaction(prev => ({ ...prev, compte_num: e.target.value }))}
                />
                {previewCategory && (
                  <div className="mt-1 text-xs text-green-600 flex items-center gap-1">
                    <div
                      className="w-2 h-2 rounded"
                      style={{ backgroundColor: previewCategory.color }}
                    />
                    Will be categorized as: {previewCategory.name}
                  </div>
                )}
              </div>
              <div>
                <Label htmlFor="compte_lib">Libellé Compte</Label>
                <Input
                  id="compte_lib"
                  placeholder="Clients"
                  value={newTransaction.compte_lib}
                  onChange={(e) => setNewTransaction(prev => ({ ...prev, compte_lib: e.target.value }))}
                />
              </div>
            </div>
          </div>

          {/* Amount fields */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="debit">Débit</Label>
              <Input
                id="debit"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={newTransaction.debit}
                onChange={(e) => setNewTransaction(prev => ({ ...prev, debit: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="credit">Crédit</Label>
              <Input
                id="credit"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={newTransaction.credit}
                onChange={(e) => setNewTransaction(prev => ({ ...prev, credit: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="piece_ref">Référence Pièce</Label>
              <Input
                id="piece_ref"
                placeholder="FAC-001"
                value={newTransaction.piece_ref}
                onChange={(e) => setNewTransaction(prev => ({ ...prev, piece_ref: e.target.value }))}
              />
            </div>
          </div>

          <Button onClick={handleAddTransaction} className="w-full">
            Ajouter la Transaction
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TransactionForm;
