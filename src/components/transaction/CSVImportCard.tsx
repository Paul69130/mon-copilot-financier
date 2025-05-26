
import React, { useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload } from 'lucide-react';
import { Transaction } from '@/types/financial';
import { useToast } from "@/hooks/use-toast";
import { parseCSV, parseExcel } from '@/utils/fileParser';
import { processTransactionData } from '@/utils/transactionMapper';
import FileUploadButton from './FileUploadButton';

interface CSVImportCardProps {
  onAddTransaction: (transaction: Omit<Transaction, 'id'>) => void;
}

const CSVImportCard: React.FC<CSVImportCardProps> = ({ onAddTransaction }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileUpload = async (file: File) => {
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
            const imported = processTransactionData(parsed.headers, parsed.data, onAddTransaction);

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
        const imported = processTransactionData(parsed.headers, parsed.data, onAddTransaction);

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
          <FileUploadButton
            onFileSelect={handleFileUpload}
            fileInputRef={fileInputRef}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default CSVImportCard;
