
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Transaction, Category } from '@/types/financial';
import { useToast } from "@/hooks/use-toast";

interface TransactionFormProps {
  categories: Category[];
  onAddTransaction: (transaction: Omit<Transaction, 'id'>) => void;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ categories, onAddTransaction }) => {
  const [newTransaction, setNewTransaction] = useState({
    ecriture_date: new Date().toISOString().split('T')[0],
    ecriture_lib: '',
    amount: '',
    type: 'expense' as 'income' | 'expense',
    category_id: '',
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
    if (!newTransaction.ecriture_lib || !newTransaction.amount) {
      toast({
        title: "Error",
        description: "Please fill in at least the description and amount fields.",
        variant: "destructive"
      });
      return;
    }

    const amount = parseFloat(newTransaction.amount);
    const debit = newTransaction.debit ? parseFloat(newTransaction.debit) : undefined;
    const credit = newTransaction.credit ? parseFloat(newTransaction.credit) : undefined;

    onAddTransaction({
      // Primary fields (for compatibility)
      date: newTransaction.ecriture_date,
      description: newTransaction.ecriture_lib,
      amount: amount,
      type: newTransaction.type,
      category_id: newTransaction.category_id || undefined,
      
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
      amount: '',
      type: 'expense',
      category_id: '',
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
      description: "Transaction has been successfully added.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Transaction</CardTitle>
        <CardDescription>Manually enter transaction details with French accounting fields</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="amount">Montant</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={newTransaction.amount}
                onChange={(e) => setNewTransaction(prev => ({ ...prev, amount: e.target.value }))}
              />
            </div>
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

          {/* Type and Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
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
                  <SelectItem value="income">Recette</SelectItem>
                  <SelectItem value="expense">Dépense</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Catégorie</Label>
              <Select
                value={newTransaction.category_id}
                onValueChange={(value) => setNewTransaction(prev => ({ ...prev, category_id: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une catégorie" />
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
