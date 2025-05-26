
import { Transaction } from '@/types/financial';

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

const findField = (fieldName: string, headers: string[]): number => {
  const variations = fieldMappings[fieldName] || [fieldName];
  return headers.findIndex(h => 
    variations.some(variation => 
      h.toLowerCase().includes(variation.toLowerCase())
    )
  );
};

export const processTransactionData = (
  headers: string[], 
  data: any[], 
  onAddTransaction: (transaction: Omit<Transaction, 'id'>) => void
): number => {
  let imported = 0;
  
  for (const row of data) {
    const ecritureDateIndex = findField('ecriture_date', headers);
    const ecritureLibIndex = findField('ecriture_lib', headers);
    const debitIndex = findField('debit', headers);
    const creditIndex = findField('credit', headers);
    const amountIndex = findField('amount', headers);

    if (ecritureDateIndex === -1 || ecritureLibIndex === -1) {
      continue; // Skip rows without essential fields
    }

    const ecritureDate = row[headers[ecritureDateIndex]];
    const ecritureLib = row[headers[ecritureLibIndex]];
    
    if (!ecritureDate || !ecritureLib) continue;

    // Parse debit and credit values
    const debitValue = debitIndex !== -1 ? 
      parseFloat(row[headers[debitIndex]]?.toString().replace(/[^-\d.]/g, '') || '0') : 0;
    const creditValue = creditIndex !== -1 ? 
      parseFloat(row[headers[creditIndex]]?.toString().replace(/[^-\d.]/g, '') || '0') : 0;

    // Calculate amount as credit minus debit (but don't store it, just use for validation)
    let calculatedAmount = creditValue - debitValue;

    // If no debit/credit but there's a direct amount field, use that for calculation
    if (debitValue === 0 && creditValue === 0 && amountIndex !== -1) {
      calculatedAmount = parseFloat(row[headers[amountIndex]]?.toString().replace(/[^-\d.]/g, '') || '0');
    }

    // Only import if we have a valid amount
    if (!isNaN(calculatedAmount) && calculatedAmount !== 0) {
      const transaction: Omit<Transaction, 'id'> = {
        // Primary French accounting fields
        ecriture_date: ecritureDate.toString(),
        ecriture_lib: ecritureLib.toString(),
        debit: debitValue || undefined,
        credit: creditValue || undefined,
        source: 'file-import'
      };

      // Add optional fields if they exist
      const optionalFields = [
        'journal_code', 'journal_lib', 'ecriture_num', 'compte_num', 'compte_lib',
        'comp_aux_num', 'comp_aux_lib', 'piece_ref', 'piece_date', 'ecriture_let',
        'date_let', 'valid_date', 'montant_devise', 'idevise', 'num_doc', 'journal_type'
      ];

      optionalFields.forEach(field => {
        const fieldIndex = findField(field, headers);
        if (fieldIndex !== -1 && row[headers[fieldIndex]]) {
          if (field === 'montant_devise') {
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
