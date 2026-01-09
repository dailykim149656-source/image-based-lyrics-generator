import React from 'react';
import { ImageAnalysisResult, SunoPrompt } from '../types';
import { downloadMarkdown } from '../services/fileExport';

interface ResultsExportProps {
  analysisResult: ImageAnalysisResult;
  sunoPrompt: SunoPrompt;
  onStartOver: () => void;
}

export const ResultsExport: React.FC<ResultsExportProps> = ({
  analysisResult,
  sunoPrompt,
  onStartOver,
}) => {
  const handleDownload = () => {
    const timestamp = new Date().toISOString().slice(0, 10);
    const filename = `music-creation-${timestamp}.md`;
    downloadMarkdown(analysisResult, sunoPrompt, filename);
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-8">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          🎉 생성 완료!
        </h2>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleDownload}
            className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors flex items-center justify-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Markdown 다운로드
          </button>

          <button
            onClick={onStartOver}
            className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold transition-colors flex items-center justify-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            새로운 이미지로 다시 시작
          </button>
        </div>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>창작노트와 Suno 프롬프트가 Markdown 파일로 저장됩니다.</p>
        </div>
      </div>
    </div>
  );
};
