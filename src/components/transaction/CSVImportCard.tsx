
import React, { useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileText } from 'lucide-react';
import { Transaction } from '@/types/financial';
import { useToast } from "@/hooks/use-toast";
import * as XLSX from 'xlsx';

interface CSVImportCardProps {
  onAddTransaction: (transaction: Omit<Transaction, 'id'>) => void;
}

const CSVImportCard: React.FC<CSVImportCardProps> = ({ onAddTransaction }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const parseCSV = (csv: string) => {
    const lines = csv.split('\n');
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    const data = [];
    
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',');
      if (values.length >= 3) {
        const row: any = {};
        headers.forEach((header, index) => {
          row[header] = values[index]?.trim() || '';
        });
        data.push(row);
      }
    }
    
    return { headers, data };
  };

  const parseExcel = (file: File): Promise<{ headers: string[], data: any[] }> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          
          if (jsonData.length < 2) {
            reject(new Error('Excel file must have at least 2 rows (header + data)'));
            return;
          }
          
          const headers = (jsonData[0] as string[]).map(h => h?.toString().toLowerCase().trim() || '');
          const rows = jsonData.slice(1).map(row => {
            const rowObj: any = {};
            headers.forEach((header, index) => {
              rowObj[header] = (row as any[])[index]?.toString().trim() || '';
            });
            return rowObj;
          }).filter(row => Object.values(row).some(val => val !== ''));
          
          resolve({ headers, data: rows });
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsArrayBuffer(file);
    });
  };

  const processTransactionData = (headers: string[], data: any[]) => {
    const dateIndex = headers.findIndex(h => h.includes('date'));
    const descIndex = headers.findIndex(h => h.includes('description') || h.includes('desc'));
    const amountIndex = headers.findIndex(h => h.includes('amount') || h.includes('value'));

    if (dateIndex === -1 || descIndex === -1 || amountIndex === -1) {
      throw new Error('Required columns not found. Please ensure your file has columns for date, description, and amount.');
    }

    let imported = 0;
    for (const row of data) {
      const dateValue = row[headers[dateIndex]];
      const descValue = row[headers[descIndex]];
      const amountValue = row[headers[amountIndex]];

      if (!dateValue || !descValue || !amountValue) continue;

      const amount = parseFloat(amountValue.toString().replace(/[^-\d.]/g, ''));
      if (!isNaN(amount)) {
        onAddTransaction({
          date: dateValue.toString(),
          description: descValue.toString(),
          amount: Math.abs(amount),
          type: amount < 0 ? 'expense' : 'income',
          source: 'file-import'
        });
        imported++;
      }
    }

    return imported;
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      let headers: string[];
      let data: any[];

      const fileExtension = file.name.split('.').pop()?.toLowerCase();

      if (fileExtension === 'csv') {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const csv = e.target?.result as string;
            const parsed = parseCSV(csv);
            const imported = processTransactionData(parsed.headers, parsed.data);

            toast({
              title: "Import Successful",
              description: `Imported ${imported} transactions from CSV file.`,
            });
          } catch (error) {
            toast({
              title: "Import Error",
              description: error instanceof Error ? error.message : "Failed to process CSV file.",
              variant: "destructive"
            });
          }
        };
        reader.readAsText(file);
      } else if (fileExtension === 'xlsx' || fileExtension === 'xls') {
        const parsed = await parseExcel(file);
        const imported = processTransactionData(parsed.headers, parsed.data);

        toast({
          title: "Import Successful",
          description: `Imported ${imported} transactions from Excel file.`,
        });
      } else {
        toast({
          title: "Unsupported File Type",
          description: "Please upload a CSV or Excel (.xlsx, .xls) file.",
          variant: "destructive"
        });
        return;
      }
    } catch (error) {
      toast({
        title: "Import Error",
        description: error instanceof Error ? error.message : "Failed to process file.",
        variant: "destructive"
      });
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Import Transactions
        </CardTitle>
        <CardDescription>
          Upload a CSV or Excel file with columns: date, description, amount
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.xlsx,.xls"
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
              <p>Click to upload CSV or Excel file</p>
              <p className="text-xs text-gray-500">Supports .csv, .xlsx, and .xls files</p>
            </div>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CSVImportCard;
