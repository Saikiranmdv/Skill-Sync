import React, { useState } from 'react';
import { useEffect } from 'react';
import mammoth from 'mammoth'; // For DOCX files
import { pdfjs } from 'react-pdf'; // For PDF files

const FileUpload = ({ onFileContentExtracted }) => {
  const [file, setFile] = useState(null);
  const [fileType, setFileType] = useState('');

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    setFile(uploadedFile);
    setFileType(uploadedFile?.type);
  };

  const readPDF = async (file) => {
    const pdf = await pdfjs.getDocument(file).promise;
    const numPages = pdf.numPages;
    let extractedText = '';
    
    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const content = await page.getTextContent();
      const pageText = content.items.map(item => item.str).join(' ');
      extractedText += pageText + '\n';
    }

    onFileContentExtracted(extractedText); // Send the extracted text to the parent component
  };

  const readWord = (file) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const arrayBuffer = e.target.result;
      try {
        const result = await mammoth.extractRawText({ arrayBuffer });
        onFileContentExtracted(result.value); // Send the extracted text to the parent component
      } catch (err) {
        console.error('Error reading Word file:', err);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const readTextFile = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      onFileContentExtracted(e.target.result); // Send the extracted text to the parent component
    };
    reader.readAsText(file);
  };

  useEffect(() => {
    if (file) {
      if (fileType.includes('pdf')) {
        readPDF(file);
      } else if (fileType.includes('word')) {
        readWord(file);
      } else if (fileType.includes('plain')) {
        readTextFile(file);
      } else {
        console.log('Unsupported file type');
      }
    }
  }, [file]);

  return (
    <div>
      <input
        type="file"
        accept=".pdf,.docx,.txt"
        onChange={handleFileChange}
      />
    </div>
  );
};

export default FileUpload;
