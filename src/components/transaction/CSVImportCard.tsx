
import React, { useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileText } from 'lucide-react';
import { Transaction } from '@/types/financial';
import { useToast } from "@/hooks/use-toast";

interface CSVImportCardProps {
  onAddTransaction: (transaction: Omit<Transaction, 'id'>) => void;
}

const CSVImportCard: React.FC<CSVImportCardProps> = ({ onAddTransaction }) => {
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

  return (
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
  );
};

export default CSVImportCard;
