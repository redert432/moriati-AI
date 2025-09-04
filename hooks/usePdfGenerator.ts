
import { useState, useCallback } from 'react';
import type { UploadedFile } from '../types';

// Assume jsPDF is loaded from a CDN and available on the window object
declare const jspdf: any;

export const usePdfGenerator = () => {
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const generatePdf = useCallback(async (files: UploadedFile[]) => {
    if (files.length === 0) {
      alert("الرجاء رفع صورة واحدة على الأقل لإنشاء ملف PDF.");
      return;
    }

    setIsGenerating(true);
    try {
      const { jsPDF } = jspdf;
      const doc = new jsPDF();
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (i > 0) {
          doc.addPage();
        }

        const img = new Image();
        img.src = file.preview;
        await new Promise(resolve => { img.onload = resolve });

        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const pageRatio = pageWidth / pageHeight;
        const imgRatio = img.width / img.height;

        let imgWidth, imgHeight, x, y;

        if (imgRatio > pageRatio) {
          // Image is wider than page
          imgWidth = pageWidth - 20; // with margin
          imgHeight = imgWidth / imgRatio;
        } else {
          // Image is taller than page
          imgHeight = pageHeight - 20; // with margin
          imgWidth = imgHeight * imgRatio;
        }

        x = (pageWidth - imgWidth) / 2;
        y = (pageHeight - imgHeight) / 2;

        doc.addImage(file.preview, file.file.type, x, y, imgWidth, imgHeight);
      }

      doc.save('Moriati-AI-Document.pdf');
    } catch (error) {
      console.error("Failed to generate PDF:", error);
      alert("حدث خطأ أثناء إنشاء ملف PDF.");
    } finally {
      setIsGenerating(false);
    }
  }, []);

  return { isGenerating, generatePdf };
};
