import React, { useState, useCallback } from 'react';
import ImageUploader from './ImageUploader';
import Loader from './Loader';
import { analyzeImage } from '../services/geminiService';
import { usePdfGenerator } from '../hooks/usePdfGenerator';
import type { UploadedFile } from '../types';

type Tab = 'pdf' | 'analyze';

const ImageToolsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('pdf');
  const [pdfFiles, setPdfFiles] = useState<UploadedFile[]>([]);
  const [analysisFile, setAnalysisFile] = useState<UploadedFile | null>(null);
  const [analysisResult, setAnalysisResult] = useState<string>('');
  const [prompt, setPrompt] = useState<string>('حلل هذه الصورة بالتفصيل واشرح محتواها.');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const { isGenerating, generatePdf } = usePdfGenerator();

  const handlePdfFilesUpload = (newFiles: UploadedFile[]) => {
    setPdfFiles(prevFiles => [...prevFiles, ...newFiles]);
  };

  const handleAnalysisFileUpload = (newFiles: UploadedFile[]) => {
    if (newFiles.length > 0) {
      setAnalysisFile(newFiles[0]);
      setAnalysisResult('');
    }
  };

  const handleRemovePdfFile = (id: string) => {
    setPdfFiles(prev => prev.filter(f => f.id !== id));
  };
  
  const handleAnalyze = useCallback(async () => {
    if (!analysisFile) {
      alert('الرجاء رفع صورة أولاً.');
      return;
    }
    setIsAnalyzing(true);
    setAnalysisResult('');
    
    const reader = new FileReader();
    reader.readAsDataURL(analysisFile.file);
    reader.onloadend = async () => {
      const base64String = (reader.result as string).split(',')[1];
      const result = await analyzeImage(base64String, analysisFile.file.type, prompt);
      setAnalysisResult(result);
      setIsAnalyzing(false);
    };
    reader.onerror = () => {
        setIsAnalyzing(false);
        setAnalysisResult('فشل في قراءة ملف الصورة.');
    }
  }, [analysisFile, prompt]);

  const renderPdfConverter = () => (
    <div>
      <h2 className="text-2xl font-bold mb-4">تحويل الصور إلى PDF</h2>
      <ImageUploader onFilesUpload={handlePdfFilesUpload} multiple={true} />
      {pdfFiles.length > 0 && (
        <div className="mt-6">
          <h3 className="font-semibold mb-2">الصور المرفوعة:</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {pdfFiles.map(file => (
              <div key={file.id} className="relative group">
                <img src={file.preview} alt={file.file.name} className="w-full h-32 object-cover rounded-md" />
                <button
                  onClick={() => handleRemovePdfFile(file.id)}
                  className="absolute top-1 right-1 bg-red-600/70 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label={`Remove ${file.file.name}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={() => generatePdf(pdfFiles)}
            disabled={isGenerating}
            className="mt-6 w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center disabled:bg-purple-800 disabled:cursor-not-allowed"
          >
            {isGenerating ? <Loader /> : 'إنشاء ملف PDF'}
          </button>
        </div>
      )}
    </div>
  );

  const renderImageAnalyzer = () => (
    <div>
      <h2 className="text-2xl font-bold mb-4">تحليل الصور بالذكاء الاصطناعي</h2>
      <ImageUploader onFilesUpload={handleAnalysisFileUpload} multiple={false} />
      {analysisFile && (
        <div className="mt-6">
          {isAnalyzing ? (
            <div className="text-center p-4">
              <img
                src={analysisFile.preview}
                alt="Analyzing..."
                className="max-w-md mx-auto rounded-lg shadow-lg opacity-60 animate-pulse"
              />
              <div className="flex items-center justify-center mt-6">
                <Loader />
                <p className="mr-3 text-gray-300 text-lg">...جاري تحليل الصورة</p>
              </div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-8 items-start">
              <div className={analysisResult ? '' : 'md:col-span-2'}>
                <img
                  src={analysisFile.preview}
                  alt="For analysis"
                  className={`rounded-lg shadow-2xl ${
                    analysisResult ? 'w-full' : 'max-w-md mx-auto'
                  }`}
                />
              </div>

              {analysisResult && (
                <div
                  className="bg-gray-800/50 p-6 rounded-lg border border-gray-700 h-full"
                  role="status"
                  aria-live="polite"
                >
                  <h3 className="font-bold text-lg mb-3 text-indigo-300">
                    نتائج التحليل:
                  </h3>
                  <p className="whitespace-pre-wrap text-gray-200 leading-relaxed">
                    {analysisResult}
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="mt-8 max-w-lg mx-auto">
            <textarea
              className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-purple-500 focus:outline-none disabled:opacity-50"
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="اكتب طلبك هنا (مثال: ماذا يوجد في هذه الصورة؟)"
              aria-label="Prompt for image analysis"
              disabled={isAnalyzing}
            />
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center disabled:bg-indigo-800 disabled:cursor-not-allowed transition-colors"
            >
              {isAnalyzing ? '...جاري التحليل' : 'تحليل الصورة'}
            </button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="bg-gray-800/50 p-6 sm:p-8 rounded-xl shadow-2xl border border-gray-700 max-w-4xl mx-auto">
      <div className="flex border-b border-gray-700 mb-6" role="tablist" aria-label="Image Tools">
        <button
          onClick={() => setActiveTab('pdf')}
          className={`py-3 px-6 font-semibold transition-colors ${activeTab === 'pdf' ? 'border-b-2 border-purple-500 text-purple-400' : 'text-gray-400 hover:text-white'}`}
          role="tab"
          aria-selected={activeTab === 'pdf'}
          aria-controls="pdf-panel"
        >
          تحويل إلى PDF
        </button>
        <button
          onClick={() => setActiveTab('analyze')}
          className={`py-3 px-6 font-semibold transition-colors ${activeTab === 'analyze' ? 'border-b-2 border-indigo-500 text-indigo-400' : 'text-gray-400 hover:text-white'}`}
          role="tab"
          aria-selected={activeTab === 'analyze'}
          aria-controls="analyze-panel"
        >
          تحليل الصورة
        </button>
      </div>
      <div>
        {activeTab === 'pdf' ? (
          <div id="pdf-panel" role="tabpanel" aria-labelledby="pdf-tab">
            {renderPdfConverter()}
          </div>
        ) : (
          <div id="analyze-panel" role="tabpanel" aria-labelledby="analyze-tab">
            {renderImageAnalyzer()}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageToolsPage;