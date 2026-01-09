import React, { useState } from 'react';
import { SunoPrompt as SunoPromptType } from '../types';
import { copyToClipboard } from '../services/fileExport';

interface SunoPromptProps {
  sunoPrompt: SunoPromptType;
}

export const SunoPrompt: React.FC<SunoPromptProps> = ({ sunoPrompt }) => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const handleCopy = async (text: string, section: string) => {
    try {
      await copyToClipboard(text);
      setCopiedSection(section);
      setTimeout(() => setCopiedSection(null), 2000);
    } catch (error) {
      alert('복사에 실패했습니다.');
    }
  };

  const CopyButton: React.FC<{ text: string; section: string }> = ({ text, section }) => (
    <button
      onClick={() => handleCopy(text, section)}
      className="px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded text-sm font-medium transition-colors"
    >
      {copiedSection === section ? '✓ 복사됨' : '📋 복사'}
    </button>
  );

  return (
    <div className="w-full max-w-4xl mx-auto bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg shadow-lg p-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
        <span className="mr-3">🎵</span>
        Suno AI 프롬프트
      </h2>

      <div className="space-y-6">
        {/* Song Title */}
        <section className="bg-white rounded-lg p-6 shadow">
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-xl font-semibold text-gray-700 flex items-center">
              <span className="mr-2">🎼</span>
              Song Title
            </h3>
            <CopyButton text={sunoPrompt.songTitle} section="title" />
          </div>
          <p className="text-2xl font-bold text-purple-700">
            {sunoPrompt.songTitle}
          </p>
        </section>

        {/* Lyric Concept */}
        <section className="bg-white rounded-lg p-6 shadow">
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-xl font-semibold text-gray-700 flex items-center">
              <span className="mr-2">✍️</span>
              Lyric Concept
            </h3>
            <CopyButton text={sunoPrompt.lyricConcept} section="concept" />
          </div>
          <p className="text-gray-600 leading-relaxed">
            {sunoPrompt.lyricConcept}
          </p>
        </section>

        {/* Music Style */}
        <section className="bg-white rounded-lg p-6 shadow">
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-xl font-semibold text-gray-700 flex items-center">
              <span className="mr-2">🎸</span>
              Music Style & Genre
            </h3>
            <CopyButton text={sunoPrompt.musicStyle} section="style" />
          </div>
          <p className="text-gray-600 leading-relaxed">
            {sunoPrompt.musicStyle}
          </p>
        </section>

        {/* Mood & Tempo */}
        <section className="bg-white rounded-lg p-6 shadow">
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-xl font-semibold text-gray-700 flex items-center">
              <span className="mr-2">⏱️</span>
              Mood & Tempo
            </h3>
            <CopyButton text={sunoPrompt.moodAndTempo} section="mood" />
          </div>
          <p className="text-gray-600 leading-relaxed">
            {sunoPrompt.moodAndTempo}
          </p>
        </section>

        {/* Special Instructions */}
        {sunoPrompt.specialInstructions && (
          <section className="bg-white rounded-lg p-6 shadow">
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-xl font-semibold text-gray-700 flex items-center">
                <span className="mr-2">⭐</span>
                Special Instructions
              </h3>
              <CopyButton text={sunoPrompt.specialInstructions} section="special" />
            </div>
            <p className="text-gray-600 leading-relaxed">
              {sunoPrompt.specialInstructions}
            </p>
          </section>
        )}

        {/* Full Prompt */}
        <section className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-6 shadow-lg">
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-xl font-semibold text-white flex items-center">
              <span className="mr-2">📝</span>
              Complete Suno Prompt
            </h3>
            <button
              onClick={() => handleCopy(sunoPrompt.fullPrompt, 'full')}
              className="px-3 py-1 bg-white hover:bg-gray-100 text-purple-700 rounded text-sm font-medium transition-colors"
            >
              {copiedSection === 'full' ? '✓ 복사됨' : '📋 전체 복사'}
            </button>
          </div>
          <pre className="text-white leading-relaxed whitespace-pre-wrap font-mono text-sm bg-black bg-opacity-20 p-4 rounded">
            {sunoPrompt.fullPrompt}
          </pre>
        </section>
      </div>
    </div>
  );
};
