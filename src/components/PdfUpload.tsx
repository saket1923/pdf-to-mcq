
import React, { useCallback } from 'react';
import { Upload, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface PdfUploadProps {
  onPdfUpload: (file: File) => void;
}

const PdfUpload: React.FC<PdfUploadProps> = ({ onPdfUpload }) => {
  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file && file.type === 'application/pdf') {
        onPdfUpload(file);
      } else {
        alert('Please select a valid PDF file');
      }
    },
    [onPdfUpload]
  );

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
  }, []);

  const handleDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const file = event.dataTransfer.files?.[0];
      if (file && file.type === 'application/pdf') {
        onPdfUpload(file);
      } else {
        alert('Please drop a valid PDF file');
      }
    },
    [onPdfUpload]
  );

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
        <CardContent className="p-8">
          <div
            className="border-3 border-dashed border-blue-300 rounded-xl p-12 text-center hover:border-blue-400 transition-colors duration-300 bg-gradient-to-br from-blue-50 to-indigo-50"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center space-y-6">
              <div className="p-4 bg-blue-100 rounded-full">
                <Upload className="w-12 h-12 text-blue-600" />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-2xl font-semibold text-gray-800">
                  Upload Your PDF
                </h3>
                <p className="text-gray-600">
                  Drop your PDF file here or click to browse
                </p>
              </div>

              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <FileText className="w-4 h-4" />
                <span>Supports PDF files only</span>
              </div>

              <label htmlFor="pdf-upload">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                  asChild
                >
                  <span className="cursor-pointer">
                    Select PDF File
                  </span>
                </Button>
              </label>

              <input
                id="pdf-upload"
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PdfUpload;
