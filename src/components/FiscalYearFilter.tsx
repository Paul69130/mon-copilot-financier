
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FiscalYear } from '@/types/financial';

interface FiscalYearFilterProps {
  fiscalYears: FiscalYear[];
  selectedFiscalYear: FiscalYear | null;
  onFiscalYearChange: (fiscalYear: FiscalYear | null) => void;
}

const FiscalYearFilter: React.FC<FiscalYearFilterProps> = ({
  fiscalYears,
  selectedFiscalYear,
  onFiscalYearChange
}) => {
  const handleValueChange = (value: string) => {
    if (value === 'all') {
      onFiscalYearChange(null);
    } else {
      const selectedFY = fiscalYears.find(fy => fy.id === value);
      onFiscalYearChange(selectedFY || null);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-gray-700">Fiscal Year:</span>
      <Select 
        value={selectedFiscalYear?.id || 'all'} 
        onValueChange={handleValueChange}
      >
        <SelectTrigger className="w-48 bg-white border-blue-200">
          <SelectValue placeholder="Select fiscal year" />
        </SelectTrigger>
        <SelectContent className="bg-white border border-gray-200 shadow-lg">
          <SelectItem value="all" className="hover:bg-blue-50">
            All Fiscal Years
          </SelectItem>
          {fiscalYears.map((fiscalYear) => (
            <SelectItem 
              key={fiscalYear.id} 
              value={fiscalYear.id}
              className="hover:bg-blue-50"
            >
              {fiscalYear.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default FiscalYearFilter;
