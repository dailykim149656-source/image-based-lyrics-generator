import Anthropic from '@anthropic-ai/sdk';

interface RequestBody {
  type: 'analyze' | 'generate';
  imageBase64?: string;
  mediaType?: string;
  analysisResult?: any;
}

export default async function handler(req: any, res: any) {
  // CORS 설정
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { type, imageBase64, mediaType, analysisResult }: RequestBody = req.body;

    if (!process.env.CLAUDE_API_KEY) {
      return res.status(500).json({ error: 'API key not configured' });
    }

    const client = new Anthropic({
      apiKey: process.env.CLAUDE_API_KEY,
    });

    if (type === 'analyze') {
      if (!imageBase64 || !mediaType) {
        return res.status(400).json({ error: 'Missing required fields' });
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
                  data: imageBase64,
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
        return res.status(500).json({ error: 'Failed to parse response' });
      }

      const result = JSON.parse(jsonMatch[0]);
      return res.status(200).json(result);

    } else if (type === 'generate') {
      if (!analysisResult) {
        return res.status(400).json({ error: 'Missing analysis result' });
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
        return res.status(500).json({ error: 'Failed to parse response' });
      }

      const result = JSON.parse(jsonMatch[0]);
      return res.status(200).json(result);

    } else {
      return res.status(400).json({ error: 'Invalid request type' });
    }
  } catch (error: any) {
    console.error('API Error:', error);
    return res.status(500).json({
      error: error.message || 'Internal server error'
    });
  }
}
