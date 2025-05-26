
import React from 'react';
import { Button } from "@/components/ui/button";
import { FileText } from 'lucide-react';

interface FileUploadButtonProps {
  onFileSelect: (file: File) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
}

const FileUploadButton: React.FC<FileUploadButtonProps> = ({ onFileSelect, fileInputRef }) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv,.xlsx,.xls"
        onChange={handleFileChange}
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
    </>
  );
};

export default FileUploadButton;
