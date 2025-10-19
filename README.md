# 미니 프로젝트 (Mini Project)

TypeScript와 Next.js로 구축된 현대적인 웹 애플리케이션입니다.

## 🚀 기술 스택

- **Next.js 15.5.6** - React 기반 풀스택 프레임워크
- **React 19.1.0** - 사용자 인터페이스 라이브러리
- **TypeScript 5** - 정적 타입 검사
- **Tailwind CSS 4** - 유틸리티 우선 CSS 프레임워크
- **ESLint** - 코드 품질 관리

## 📁 프로젝트 구조

```
mini-project/
├── src/
│   ├── app/                 # App Router 디렉토리
│   │   ├── about/          # 소개 페이지
│   │   ├── contact/        # 연락처 페이지
│   │   ├── globals.css     # 전역 스타일
│   │   ├── layout.tsx      # 루트 레이아웃
│   │   └── page.tsx        # 홈 페이지
│   └── components/         # 재사용 가능한 컴포넌트
│       └── Navigation.tsx  # 네비게이션 컴포넌트
├── public/                 # 정적 파일
├── package.json           # 프로젝트 의존성
├── tsconfig.json          # TypeScript 설정
└── tailwind.config.js     # Tailwind CSS 설정
```

## 🛠️ 시작하기

### 필수 요구사항

- Node.js 18.17 이상
- npm 또는 yarn

### 설치 및 실행

1. 의존성 설치:
```bash
npm install
```

2. 개발 서버 실행:
```bash
npm run dev
```

3. 브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

### 빌드 및 배포

```bash
# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm start

# 린트 검사
npm run lint
```

## 📄 페이지

- **홈** (`/`) - 프로젝트 소개 및 주요 기능
- **소개** (`/about`) - 프로젝트 상세 정보 및 기술 스택
- **연락처** (`/contact`) - 연락 방법 및 문의 폼

## 🎨 주요 기능

- ✅ App Router 사용
- ✅ TypeScript 타입 안정성
- ✅ Tailwind CSS 스타일링
- ✅ 반응형 디자인
- ✅ 다크 모드 지원
- ✅ 네비게이션 메뉴
- ✅ 모던한 UI/UX

## 📝 개발 가이드

### 새 페이지 추가

1. `src/app/` 디렉토리에 새 폴더 생성
2. `page.tsx` 파일 생성
3. `Navigation.tsx`에 메뉴 항목 추가

### 컴포넌트 추가

1. `src/components/` 디렉토리에 컴포넌트 파일 생성
2. TypeScript 인터페이스 정의
3. 필요한 곳에서 import하여 사용

## 🤝 기여하기

1. 이 저장소를 포크합니다
2. 새 브랜치를 생성합니다 (`git checkout -b feature/amazing-feature`)
3. 변경사항을 커밋합니다 (`git commit -m 'Add some amazing feature'`)
4. 브랜치에 푸시합니다 (`git push origin feature/amazing-feature`)
5. Pull Request를 생성합니다

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 있습니다.

---

**즐거운 코딩 되세요! 🎉**
