import Anthropic from '@anthropic-ai/sdk';
import { ImageAnalysisResult, SunoPrompt } from '../types';

// API 엔드포인트 사용 여부 결정 (Vercel 배포 시 사용)
const USE_API_ENDPOINT = import.meta.env.VITE_USE_API_ENDPOINT === 'true';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

// 클라이언트 사이드 직접 호출 (로컬 개발용)
const client = !USE_API_ENDPOINT ? new Anthropic({
  apiKey: import.meta.env.VITE_CLAUDE_API_KEY,
  dangerouslyAllowBrowser: true,
}) : null;

export const convertImageToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64String = reader.result as string;
      const base64Data = base64String.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const analyzeImage = async (base64Image: string, mediaType: string): Promise<ImageAnalysisResult> => {
  try {
    // API 엔드포인트 사용 (Vercel/Netlify 등)
    if (USE_API_ENDPOINT) {
      const response = await fetch(`${API_BASE_URL}/claude`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'analyze',
          imageBase64: base64Image,
          mediaType,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || '이미지 분석에 실패했습니다.');
      }

      const result: ImageAnalysisResult = await response.json();
      return result;
    }

    // 직접 Claude SDK 사용 (로컬 개발)
    if (!client) {
      throw new Error('Claude client not initialized');
    }

    const prompt = `당신은 시각 예술 분석 전문가입니다.
주어진 이미지를 깊이 있게 분석하고, 다음 항목들을 포함한 JSON 형식으로 반환하세요:

- description: 이미지의 주요 내용과 시각적 요소에 대한 상세한 설명 (2-3문장)
- mood: 이미지에서 느껴지는 분위기와 감정을 나타내는 키워드들 (배열, 3-5개)
- atmosphere: 전체적인 분위기와 느낌에 대한 서술 (1-2문장)
- colorPalette: 이미지의 주요 색상들 (배열, 3-5개의 색상명)
- suggestedGenre: 이 이미지의 분위기와 어울릴 만한 음악 장르들 (배열, 3-5개)
- themes: 이미지가 담고 있는 주제, 테마, 상징 등 (배열, 3-5개)

반드시 유효한 JSON 형식으로만 응답하세요. 다른 설명은 포함하지 마세요.`;

    const message = await client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: mediaType as 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp',
                data: base64Image,
              },
            },
            {
              type: 'text',
              text: prompt,
            },
          ],
        },
      ],
    });

    const responseText = message.content[0].type === 'text' ? message.content[0].text : '';
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Failed to parse JSON response from Claude');
    }

    const result: ImageAnalysisResult = JSON.parse(jsonMatch[0]);
    return result;
  } catch (error) {
    console.error('Error analyzing image:', error);
    throw new Error('이미지 분석 중 오류가 발생했습니다. API 키를 확인하세요.');
  }
};

export const generateSunoPrompt = async (analysisResult: ImageAnalysisResult): Promise<SunoPrompt> => {
  try {
    // API 엔드포인트 사용 (Vercel/Netlify 등)
    if (USE_API_ENDPOINT) {
      const response = await fetch(`${API_BASE_URL}/claude`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'generate',
          analysisResult,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Suno 프롬프트 생성에 실패했습니다.');
      }

      const result: SunoPrompt = await response.json();
      return result;
    }

    // 직접 Claude SDK 사용 (로컬 개발)
    if (!client) {
      throw new Error('Claude client not initialized');
    }

    const prompt = `당신은 음악 프롬프트 작성 전문가입니다.
다음 이미지 분석 결과를 바탕으로 Suno AI용 음악 프롬프트를 영어로 작성하세요.

<이미지 분석 결과>
- 내용: ${analysisResult.description}
- 분위기: ${analysisResult.mood.join(', ')}
- 전체 느낌: ${analysisResult.atmosphere}
- 색상: ${analysisResult.colorPalette.join(', ')}
- 추천 장르: ${analysisResult.suggestedGenre.join(', ')}
- 주제: ${analysisResult.themes.join(', ')}

다음 항목들을 포함한 JSON 형식으로 반환하세요:
- songTitle: 곡 제목 (영어, 창의적이고 이미지의 분위기를 잘 표현하는)
- lyricConcept: 가사가 표현해야 할 컨셉과 내용 (영어, 2-3문장)
- musicStyle: 음악 스타일과 장르 (영어, 구체적으로)
- moodAndTempo: 곡의 분위기와 템포 (영어)
- specialInstructions: 특별한 악기나 효과 제안 (영어, 선택사항)
- fullPrompt: 위 모든 내용을 포함한 완성된 Suno 프롬프트 (영어, 자연스러운 문장으로)

반드시 유효한 JSON 형식으로만 응답하세요.`;

    const message = await client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const responseText = message.content[0].type === 'text' ? message.content[0].text : '';
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Failed to parse JSON response from Claude');
    }

    const result: SunoPrompt = JSON.parse(jsonMatch[0]);
    return result;
  } catch (error) {
    console.error('Error generating Suno prompt:', error);
    throw new Error('Suno 프롬프트 생성 중 오류가 발생했습니다.');
  }
};
