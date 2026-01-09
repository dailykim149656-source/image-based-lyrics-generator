# 🚀 배포 가이드

이 애플리케이션을 안전하게 배포하는 방법을 설명합니다.

## ⚠️ 중요: API 키 보안

GitHub Pages는 **정적 호스팅만 지원**하므로, API 키가 클라이언트 코드에 노출됩니다.
따라서 **Vercel 또는 Netlify 배포를 강력히 권장**합니다.

---

## ✅ 옵션 1: Vercel 배포 (권장)

Vercel은 서버리스 함수를 지원하여 API 키를 안전하게 보호할 수 있습니다.

### 1. Vercel CLI 설치

```bash
npm install -g vercel
```

### 2. Vercel 로그인

```bash
vercel login
```

### 3. 프로젝트 배포

```bash
vercel
```

첫 배포 시 다음과 같이 설정하세요:
- Set up and deploy: `Y`
- Which scope: (본인 계정 선택)
- Link to existing project: `N`
- Project name: `image-based-lyrics-generator` (원하는 이름)
- Directory: `./`
- Override settings: `N`

### 4. 환경 변수 설정

Vercel 대시보드에서 환경 변수를 설정합니다:

1. [Vercel Dashboard](https://vercel.com/dashboard) 접속
2. 프로젝트 선택
3. Settings → Environment Variables
4. 다음 변수들을 추가:

```
CLAUDE_API_KEY = sk-ant-api03-... (본인의 Claude API 키)
VITE_USE_API_ENDPOINT = true
```

### 5. 재배포

환경 변수 설정 후 재배포:

```bash
vercel --prod
```

배포 완료! 🎉 Vercel이 제공하는 URL로 접속하면 됩니다.

---

## ✅ 옵션 2: Netlify 배포

Netlify도 서버리스 함수를 지원합니다.

### 1. Netlify Functions 설정

`netlify.toml` 파일 생성:

```toml
[build]
  command = "npm run build"
  publish = "dist"
  functions = "netlify/functions"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200
```

### 2. Netlify Functions 디렉토리 생성

```bash
mkdir -p netlify/functions
cp api/claude.ts netlify/functions/claude.ts
```

### 3. Netlify CLI 설치 및 배포

```bash
npm install -g netlify-cli
netlify login
netlify init
netlify deploy --prod
```

### 4. 환경 변수 설정

Netlify 대시보드에서:
- Site settings → Environment variables
- 다음 추가:
  - `CLAUDE_API_KEY` = (본인의 API 키)
  - `VITE_USE_API_ENDPOINT` = `true`

---

## ⚠️ 옵션 3: GitHub Pages (권장하지 않음)

GitHub Pages는 정적 호스팅만 지원하므로 API 키가 노출됩니다.
**개인 사용 또는 데모 목적으로만 사용하세요.**

### 배포 방법

1. `package.json`에 배포 스크립트 추가:

```json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

2. `gh-pages` 패키지 설치:

```bash
npm install --save-dev gh-pages
```

3. `vite.config.ts` 수정:

```typescript
export default defineConfig({
  plugins: [react()],
  base: '/image-based-lyrics-generator/', // 저장소 이름
})
```

4. `.env` 파일 생성 (로컬에만 두고 git에 커밋하지 마세요!):

```env
VITE_CLAUDE_API_KEY=your_api_key_here
```

5. 배포:

```bash
npm run deploy
```

**주의**: 빌드된 JavaScript 파일을 다운로드하면 API 키를 볼 수 있습니다!

---

## 🔒 보안 권장사항

### Vercel/Netlify 사용 시:
✅ API 키가 서버 측에 안전하게 저장됨
✅ 클라이언트 코드에 노출되지 않음
✅ Vercel/Netlify의 환경 변수 관리 기능 활용

### GitHub Pages 사용 시:
⚠️ API 키가 빌드된 JS 파일에 포함됨
⚠️ 개발자 도구로 누구나 확인 가능
⚠️ API 키 남용 위험

### Claude API 키 보호:
- Anthropic 콘솔에서 API 키 사용량 모니터링
- 월별 사용 한도 설정
- 필요시 API 키 즉시 재발급

---

## 🧪 테스트

배포 후 다음을 확인하세요:

1. ✅ 이미지 업로드가 정상 작동하는지
2. ✅ 이미지 분석이 잘 되는지
3. ✅ Suno 프롬프트 생성이 정상인지
4. ✅ 개발자 도구 네트워크 탭에서 API 키가 노출되지 않는지

---

## 🆘 문제 해결

### API 호출 실패
- Vercel/Netlify 환경 변수가 올바르게 설정되었는지 확인
- `VITE_USE_API_ENDPOINT=true` 설정 확인
- API 키가 유효한지 확인

### CORS 오류
- `api/claude.ts`의 CORS 헤더 확인
- 배포 플랫폼의 함수 설정 확인

### 빌드 실패
```bash
npm install
npm run build
```
로컬에서 먼저 테스트

---

## 📚 더 알아보기

- [Vercel Documentation](https://vercel.com/docs)
- [Netlify Functions](https://docs.netlify.com/functions/overview/)
- [Claude API Documentation](https://docs.anthropic.com/)
