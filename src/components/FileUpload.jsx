import React, { useState, useEffect } from 'react';
import mammoth from 'mammoth'; // For DOCX files
import { pdfjs } from 'react-pdf'; // For PDF files
import './FileUpload.css'

const FileUpload = ({ onFileContentExtracted }) => {
  const [file, setFile] = useState(null);
  const [fileType, setFileType] = useState('');

  // Set the worker URL explicitly to fix the issue in react-pdf
  useEffect(() => {
    pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`
  }, []);

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    setFile(uploadedFile);
    setFileType(uploadedFile?.type);
  };

  const readPDF = async (file) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
      //pdf.js processes raw PDF data, not the File object itself. By converting the file to an ArrayBuffer, you provide the raw binary data that pdf.js can work with.
      const numPages = pdf.numPages;
      let extractedText = '';

      for (let pageNum = 1; pageNum <= numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const content = await page.getTextContent();
        const pageText = content.items.map(item => item.str).join(' ');
        extractedText += pageText + '\n';
      }

      onFileContentExtracted(extractedText); // Send the extracted text to the parent component
    } catch (err) {
      console.error('Error reading PDF file:', err);
    }
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
      } else if (fileType.includes('plain') || fileType === 'text/plain') {
        readTextFile(file);
      } else {
        console.error('Unsupported file type');
      }
    }
  }, [file, fileType]);

  return (
    <div className='file-upload-containe'>
      <input className='file-upload-input'
        type="file"
        accept=".pdf,.docx,.txt"
        onChange={handleFileChange}
      />
    </div>
  );
};

export default FileUpload;