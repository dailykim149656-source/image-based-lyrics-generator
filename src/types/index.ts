export interface ImageAnalysisResult {
  description: string;
  mood: string[];
  atmosphere: string;
  colorPalette: string[];
  suggestedGenre: string[];
  themes: string[];
}

export interface SunoPrompt {
  songTitle: string;
  lyricConcept: string;
  musicStyle: string;
  moodAndTempo: string;
  specialInstructions?: string;
  fullPrompt: string;
}

export type AppStep = 'upload' | 'analyzing' | 'creation-note' | 'generating-prompt' | 'complete';

export interface AppState {
  step: AppStep;
  uploadedImage: string | null;
  imageFile: File | null;
  analysisResult: ImageAnalysisResult | null;
  sunoPrompt: SunoPrompt | null;
  error: string | null;
}
