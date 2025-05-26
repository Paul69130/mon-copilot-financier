
import * as XLSX from 'xlsx';

export const parseCSV = (csv: string) => {
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

export const parseExcel = (file: File): Promise<{ headers: string[], data: any[] }> => {
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
