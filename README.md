
# 디렉토리 구조

kms-frontend/
├── public/                 # 정적 리소스 (HTML 템플릿, favicon 등)
├── src/
│   ├── api/                # Axios 인스턴스 및 API 함수 모음
│   ├── assets/             # 이미지, 아이콘 등 정적 리소스
│   ├── components/         # 재사용 가능한 공통 UI 컴포넌트
│   ├── pages/              # Route에 대응되는 페이지 컴포넌트
│   │   ├── LoginPage.jsx
│   │   ├── FAQPage.jsx
│   │   └── AdminPage.jsx
│   ├── routes/             # React Router 설정
│   │   └── AppRouter.jsx
│   ├── styles/             # CSS 파일 모음
│   │   └── global.css
│   ├── utils/              # 유틸 함수 (토큰 저장 등)
│   ├── App.jsx             # 루트 컴포넌트
│   └── index.js            # 엔트리 포인트
├── .env                    # API 주소 등 환경변수
├── .gitignore              # 불필요 파일 무시 설정
├── package.json
└── README.md