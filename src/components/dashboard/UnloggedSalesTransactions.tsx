
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { salesTransactionAnalysis, UnloggedSalesTransaction } from '@/services/salesTransactionAnalysis';

const UnloggedSalesTransactions: React.FC = () => {
  const [unloggedTransactions, setUnloggedTransactions] = useState<UnloggedSalesTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUnloggedTransactions = async () => {
    setLoading(true);
    try {
      const transactions = await salesTransactionAnalysis.findUnloggedSalesTransactions();
      setUnloggedTransactions(transactions);
    } catch (error) {
      console.error('Error fetching unlogged sales transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUnloggedTransactions();
  }, []);

  const calculateAmount = (transaction: UnloggedSalesTransaction): number => {
    return Math.abs((transaction.credit || 0) - (transaction.debit || 0));
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            Transactions de Ventes Non Loggées
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant={unloggedTransactions.length > 0 ? "destructive" : "outline"}>
              {unloggedTransactions.length} non loggées
            </Badge>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={fetchUnloggedTransactions}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Actualiser
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8">
            <p>Analyse des transactions en cours...</p>
          </div>
        ) : unloggedTransactions.length === 0 ? (
          <div className="text-center text-green-600 py-8">
            <p>✅ Toutes les transactions de ventes sont loggées.</p>
          </div>
        ) : (
          <div className="max-h-96 overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>N° Écriture</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Type Journal</TableHead>
                  <TableHead className="text-right">Montant</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {unloggedTransactions.map((transaction) => (
                  <TableRow key={transaction.id} className="hover:bg-orange-50">
                    <TableCell className="font-medium">
                      {transaction.ecriture_num || '-'}
                    </TableCell>
                    <TableCell>
                      {transaction.ecriture_date}
                    </TableCell>
                    <TableCell>
                      {transaction.ecriture_lib}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-orange-600 border-orange-600">
                        {transaction.journal_type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      {calculateAmount(transaction).toLocaleString()} €
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UnloggedSalesTransactions;
