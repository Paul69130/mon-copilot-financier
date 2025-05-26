
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
    // Map common field variations to our expected field names
    const fieldMappings = {
      // Date fields
      'ecriture_date': ['ecriture_date', 'ecrituredate', 'date_ecriture', 'date'],
      'piece_date': ['piece_date', 'piecedate', 'date_piece'],
      'date_let': ['date_let', 'datelet', 'date_lettrage'],
      'valid_date': ['valid_date', 'validdate', 'date_validation'],
      
      // Description fields
      'ecriture_lib': ['ecriture_lib', 'ecriturelib', 'libelle_ecriture', 'description', 'desc'],
      'journal_lib': ['journal_lib', 'journallib', 'libelle_journal'],
      'compte_lib': ['compte_lib', 'comptelib', 'libelle_compte'],
      'comp_aux_lib': ['comp_aux_lib', 'compauxlib', 'libelle_auxiliaire'],
      
      // Amount fields
      'debit': ['debit', 'débit'],
      'credit': ['credit', 'crédit'],
      'amount': ['amount', 'montant', 'value', 'valeur'],
      'montant_devise': ['montant_devise', 'montantdevise', 'montant_en_devise'],
      
      // Code fields
      'journal_code': ['journal_code', 'journalcode', 'code_journal'],
      'compte_num': ['compte_num', 'comptenum', 'numero_compte', 'compte'],
      'comp_aux_num': ['comp_aux_num', 'compauxnum', 'numero_auxiliaire'],
      'ecriture_num': ['ecriture_num', 'ecriturenum', 'numero_ecriture'],
      'piece_ref': ['piece_ref', 'pieceref', 'reference_piece'],
      'ecriture_let': ['ecriture_let', 'ecriturelet', 'lettrage'],
      'num_doc': ['num_doc', 'numdoc', 'numero_document'],
      'idevise': ['idevise', 'devise', 'currency'],
      'journal_type': ['journal_type', 'journaltype', 'type_journal']
    };

    const findField = (fieldName: string): number => {
      const variations = fieldMappings[fieldName] || [fieldName];
      return headers.findIndex(h => 
        variations.some(variation => 
          h.toLowerCase().includes(variation.toLowerCase())
        )
      );
    };

    let imported = 0;
    for (const row of data) {
      const ecritureDateIndex = findField('ecriture_date');
      const ecritureLibIndex = findField('ecriture_lib');
      const debitIndex = findField('debit');
      const creditIndex = findField('credit');
      const amountIndex = findField('amount');

      if (ecritureDateIndex === -1 || ecritureLibIndex === -1) {
        continue; // Skip rows without essential fields
      }

      const ecritureDate = row[headers[ecritureDateIndex]];
      const ecritureLib = row[headers[ecritureLibIndex]];
      
      if (!ecritureDate || !ecritureLib) continue;

      // Calculate amount from debit/credit or use direct amount
      let amount = 0;
      let type: 'income' | 'expense' = 'expense';

      if (debitIndex !== -1 && creditIndex !== -1) {
        const debit = parseFloat(row[headers[debitIndex]]?.toString().replace(/[^-\d.]/g, '') || '0');
        const credit = parseFloat(row[headers[creditIndex]]?.toString().replace(/[^-\d.]/g, '') || '0');
        
        if (debit > 0) {
          amount = debit;
          type = 'expense';
        } else if (credit > 0) {
          amount = credit;
          type = 'income';
        }
      } else if (amountIndex !== -1) {
        const amountValue = parseFloat(row[headers[amountIndex]]?.toString().replace(/[^-\d.]/g, '') || '0');
        amount = Math.abs(amountValue);
        type = amountValue < 0 ? 'expense' : 'income';
      }

      if (!isNaN(amount) && amount > 0) {
        const transaction: Omit<Transaction, 'id'> = {
          // Primary fields (for compatibility)
          date: ecritureDate.toString(),
          description: ecritureLib.toString(),
          amount: amount,
          type: type,
          source: 'file-import',
          
          // New French accounting fields
          ecriture_date: ecritureDate.toString(),
          ecriture_lib: ecritureLib.toString(),
        };

        // Add optional fields if they exist
        const optionalFields = [
          'journal_code', 'journal_lib', 'ecriture_num', 'compte_num', 'compte_lib',
          'comp_aux_num', 'comp_aux_lib', 'piece_ref', 'piece_date', 'ecriture_let',
          'date_let', 'valid_date', 'montant_devise', 'idevise', 'num_doc', 'journal_type'
        ];

        optionalFields.forEach(field => {
          const fieldIndex = findField(field);
          if (fieldIndex !== -1 && row[headers[fieldIndex]]) {
            if (field === 'debit' || field === 'credit' || field === 'montant_devise') {
              transaction[field] = parseFloat(row[headers[fieldIndex]]?.toString().replace(/[^-\d.]/g, '') || '0');
            } else {
              transaction[field] = row[headers[fieldIndex]]?.toString();
            }
          }
        });

        onAddTransaction(transaction);
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
