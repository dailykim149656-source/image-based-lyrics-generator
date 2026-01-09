import { useState } from 'react';
import { ImageUpload } from './components/ImageUpload';
import { CreationNote } from './components/CreationNote';
import { SunoPrompt } from './components/SunoPrompt';
import { ResultsExport } from './components/ResultsExport';
import { analyzeImage, convertImageToBase64, generateSunoPrompt } from './services/claudeApi';
import { AppState } from './types';

function App() {
  const [state, setState] = useState<AppState>({
    step: 'upload',
    uploadedImage: null,
    imageFile: null,
    analysisResult: null,
    sunoPrompt: null,
    error: null,
  });

  const handleImageSelect = async (file: File, preview: string) => {
    setState({
      ...state,
      step: 'analyzing',
      uploadedImage: preview,
      imageFile: file,
      error: null,
    });

    try {
      const base64Image = await convertImageToBase64(file);
      const mediaType = file.type;
      const analysisResult = await analyzeImage(base64Image, mediaType);

      setState(prev => ({
        ...prev,
        step: 'creation-note',
        analysisResult,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        step: 'upload',
        error: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.',
      }));
    }
  };

  const handleGeneratePrompt = async () => {
    if (!state.analysisResult) return;

    setState(prev => ({ ...prev, step: 'generating-prompt' }));

    try {
      const sunoPrompt = await generateSunoPrompt(state.analysisResult);

      setState(prev => ({
        ...prev,
        step: 'complete',
        sunoPrompt,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        step: 'creation-note',
        error: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.',
      }));
    }
  };

  const handleStartOver = () => {
    setState({
      step: 'upload',
      uploadedImage: null,
      imageFile: null,
      analysisResult: null,
      sunoPrompt: null,
      error: null,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            🎨 Visual Inspiration to Music Creator
          </h1>
          <p className="text-lg text-gray-600">
            이미지에서 영감을 받아 음악 창작을 위한 Suno 프롬프트를 생성합니다
          </p>
        </header>

        {/* Error Display */}
        {state.error && (
          <div className="max-w-2xl mx-auto mb-8 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            <strong className="font-bold">오류: </strong>
            <span className="block sm:inline">{state.error}</span>
            <button
              onClick={() => setState(prev => ({ ...prev, error: null }))}
              className="absolute top-0 bottom-0 right-0 px-4 py-3"
            >
              <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <title>Close</title>
                <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/>
              </svg>
            </button>
          </div>
        )}

        {/* Image Preview */}
        {state.uploadedImage && (
          <div className="max-w-2xl mx-auto mb-8">
            <div className="bg-white rounded-lg shadow-lg p-4">
              <img
                src={state.uploadedImage}
                alt="Uploaded preview"
                className="w-full h-auto rounded-lg"
              />
            </div>
          </div>
        )}

        {/* Step 1: Upload */}
        {state.step === 'upload' && (
          <ImageUpload onImageSelect={handleImageSelect} />
        )}

        {/* Step 2: Analyzing */}
        {state.step === 'analyzing' && (
          <div className="text-center">
            <div className="inline-block">
              <svg className="animate-spin h-16 w-16 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <p className="text-xl text-gray-700 mt-4 font-medium">
              이미지 분석 중...
            </p>
            <p className="text-gray-500 mt-2">
              Claude AI가 이미지를 분석하고 있습니다
            </p>
          </div>
        )}

        {/* Step 3: Creation Note */}
        {state.step === 'creation-note' && state.analysisResult && (
          <CreationNote
            analysisResult={state.analysisResult}
            onGeneratePrompt={handleGeneratePrompt}
          />
        )}

        {/* Step 4: Generating Prompt */}
        {state.step === 'generating-prompt' && (
          <div className="text-center">
            <div className="inline-block">
              <svg className="animate-spin h-16 w-16 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <p className="text-xl text-gray-700 mt-4 font-medium">
              Suno 프롬프트 생성 중...
            </p>
            <p className="text-gray-500 mt-2">
              창작노트를 바탕으로 음악 프롬프트를 작성하고 있습니다
            </p>
          </div>
        )}

        {/* Step 5: Complete */}
        {state.step === 'complete' && state.analysisResult && state.sunoPrompt && (
          <div className="space-y-8">
            <CreationNote
              analysisResult={state.analysisResult}
              onGeneratePrompt={handleGeneratePrompt}
              isGenerating={false}
            />
            <SunoPrompt sunoPrompt={state.sunoPrompt} />
            <ResultsExport
              analysisResult={state.analysisResult}
              sunoPrompt={state.sunoPrompt}
              onStartOver={handleStartOver}
            />
          </div>
        )}

        {/* Footer */}
        <footer className="mt-16 text-center text-gray-500 text-sm">
          <p>Powered by Claude AI</p>
          <p className="mt-2">
            이 도구는 Claude Vision API와 Claude Text API를 사용합니다
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
