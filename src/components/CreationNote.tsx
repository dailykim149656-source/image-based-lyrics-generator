import React from 'react';
import { ImageAnalysisResult } from '../types';

interface CreationNoteProps {
  analysisResult: ImageAnalysisResult;
  onGeneratePrompt: () => void;
  isGenerating?: boolean;
}

export const CreationNote: React.FC<CreationNoteProps> = ({
  analysisResult,
  onGeneratePrompt,
  isGenerating = false,
}) => {
  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
        <span className="mr-3">📝</span>
        창작노트
      </h2>

      <div className="space-y-6">
        {/* Description */}
        <section>
          <h3 className="text-xl font-semibold text-gray-700 mb-3 flex items-center">
            <span className="mr-2">📖</span>
            내용 설명
          </h3>
          <p className="text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-lg">
            {analysisResult.description}
          </p>
        </section>

        {/* Mood */}
        <section>
          <h3 className="text-xl font-semibold text-gray-700 mb-3 flex items-center">
            <span className="mr-2">🎭</span>
            분위기 & 감정
          </h3>
          <div className="flex flex-wrap gap-2">
            {analysisResult.mood.map((mood, index) => (
              <span
                key={index}
                className="px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-medium"
              >
                {mood}
              </span>
            ))}
          </div>
        </section>

        {/* Atmosphere */}
        <section>
          <h3 className="text-xl font-semibold text-gray-700 mb-3 flex items-center">
            <span className="mr-2">🌟</span>
            전체 분위기
          </h3>
          <p className="text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-lg">
            {analysisResult.atmosphere}
          </p>
        </section>

        {/* Color Palette */}
        <section>
          <h3 className="text-xl font-semibold text-gray-700 mb-3 flex items-center">
            <span className="mr-2">🎨</span>
            색상 팔레트
          </h3>
          <div className="flex flex-wrap gap-2">
            {analysisResult.colorPalette.map((color, index) => (
              <span
                key={index}
                className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
              >
                {color}
              </span>
            ))}
          </div>
        </section>

        {/* Suggested Genre */}
        <section>
          <h3 className="text-xl font-semibold text-gray-700 mb-3 flex items-center">
            <span className="mr-2">🎵</span>
            추천 장르
          </h3>
          <div className="flex flex-wrap gap-2">
            {analysisResult.suggestedGenre.map((genre, index) => (
              <span
                key={index}
                className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium"
              >
                {genre}
              </span>
            ))}
          </div>
        </section>

        {/* Themes */}
        <section>
          <h3 className="text-xl font-semibold text-gray-700 mb-3 flex items-center">
            <span className="mr-2">💡</span>
            주제 & 테마
          </h3>
          <div className="flex flex-wrap gap-2">
            {analysisResult.themes.map((theme, index) => (
              <span
                key={index}
                className="px-4 py-2 bg-amber-100 text-amber-800 rounded-full text-sm font-medium"
              >
                {theme}
              </span>
            ))}
          </div>
        </section>
      </div>

      {/* Generate Button */}
      <div className="mt-8 text-center">
        <button
          onClick={onGeneratePrompt}
          disabled={isGenerating}
          className={`
            px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold text-lg
            transition-all transform
            ${isGenerating
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:scale-105 hover:shadow-lg'
            }
          `}
        >
          {isGenerating ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Suno 프롬프트 생성 중...
            </span>
          ) : (
            '🎵 Suno 프롬프트 생성하기'
          )}
        </button>
      </div>
    </div>
  );
};
