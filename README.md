# 🎨 Visual Inspiration to Music Creator

이미지에서 영감을 받아 음악 창작을 위한 Suno AI 프롬프트를 자동으로 생성하는 React 기반 웹 애플리케이션입니다.

## ✨ 주요 기능

- 📸 **이미지 업로드**: 드래그 앤 드롭 또는 파일 선택으로 간편하게 이미지 업로드
- 🤖 **AI 이미지 분석**: Claude Vision API를 사용하여 이미지의 분위기, 색상, 테마 분석
- 📝 **창작노트 생성**: 분석 결과를 바탕으로 구조화된 창작노트 제공
- 🎵 **Suno 프롬프트 생성**: Claude API로 Suno AI에 최적화된 음악 프롬프트 자동 생성
- 💾 **Markdown 다운로드**: 전체 창작노트와 프롬프트를 Markdown 파일로 저장
- 📋 **클립보드 복사**: 각 섹션별로 쉽게 복사 가능

## 🛠️ 기술 스택

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **AI API**: Anthropic Claude (Vision + Text Generation)
- **Package Manager**: npm

## 📋 사전 요구사항

- Node.js 18 이상
- npm 또는 yarn
- Claude API Key ([Anthropic Console](https://console.anthropic.com/)에서 발급)

## 🚀 시작하기

### 1. 저장소 클론

```bash
git clone https://github.com/yourusername/image-based-lyrics-generator.git
cd image-based-lyrics-generator
```

### 2. 의존성 설치

```bash
npm install
```

### 3. 환경 변수 설정

`.env` 파일을 생성하고 Claude API 키를 설정합니다:

```bash
cp .env.example .env
```

`.env` 파일을 열고 API 키를 입력합니다:

```
VITE_CLAUDE_API_KEY=your_api_key_here
```

### 4. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:5173`으로 접속합니다.

### 5. 프로덕션 빌드

```bash
npm run build
```

빌드된 파일은 `dist` 폴더에 생성됩니다.

## 📖 사용 방법

1. **이미지 업로드**: 메인 화면에서 이미지를 드래그 앤 드롭하거나 파일 선택 버튼을 클릭합니다.

2. **이미지 분석**: 업로드된 이미지가 자동으로 Claude Vision API를 통해 분석됩니다.

3. **창작노트 확인**: 이미지 분석 결과가 다음 항목으로 표시됩니다:
   - 내용 설명
   - 분위기 & 감정
   - 전체 분위기
   - 색상 팔레트
   - 추천 장르
   - 주제 & 테마

4. **Suno 프롬프트 생성**: "Suno 프롬프트 생성하기" 버튼을 클릭하여 음악 프롬프트를 생성합니다.

5. **결과 활용**:
   - 각 섹션의 복사 버튼으로 내용을 클립보드에 복사
   - "Markdown 다운로드" 버튼으로 전체 결과를 파일로 저장
   - "새로운 이미지로 다시 시작" 버튼으로 처음부터 다시 시작

## 🏗️ 프로젝트 구조

```
src/
├── components/
│   ├── ImageUpload.tsx      # 이미지 업로드 컴포넌트
│   ├── CreationNote.tsx     # 창작노트 표시 컴포넌트
│   ├── SunoPrompt.tsx       # Suno 프롬프트 표시 컴포넌트
│   └── ResultsExport.tsx    # 결과 다운로드 컴포넌트
├── services/
│   ├── claudeApi.ts         # Claude API 호출 서비스
│   └── fileExport.ts        # 파일 다운로드 기능
├── types/
│   └── index.ts             # TypeScript 타입 정의
├── App.tsx                  # 메인 앱 컴포넌트
├── main.tsx                 # 앱 엔트리 포인트
└── index.css                # Tailwind CSS 설정
```

## ⚠️ 주의사항

- **API 키 보안**: 현재 구현은 프론트엔드에서 직접 API를 호출합니다 (`dangerouslyAllowBrowser: true`). 프로덕션 환경에서는 백엔드 프록시를 통해 API 키를 안전하게 관리하는 것을 권장합니다.

- **파일 크기 제한**: 업로드 가능한 이미지 크기는 5MB로 제한되어 있습니다.

- **지원 형식**: JPG, PNG, GIF, WEBP 형식의 이미지를 지원합니다.

## 🔧 개발 스크립트

```bash
# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 빌드된 앱 미리보기
npm run preview

# 린팅
npm run lint
```

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

This project is licensed under the MIT License.

## 👤 제작자

Created with ❤️ by [Your Name]

## 🙏 감사의 말

- [Anthropic](https://www.anthropic.com/) - Claude AI API 제공
- [Suno AI](https://www.suno.ai/) - 음악 생성 플랫폼
- [Vite](https://vitejs.dev/) - 빠른 빌드 도구
- [Tailwind CSS](https://tailwindcss.com/) - 유틸리티 우선 CSS 프레임워크