# 🧠 Cook-KMS (Knowledge Management System)

**Cook-KMS**는 고객사, 사내 임직원, 관리자 간의 지식 공유와 문의 응답을 효율적으로 처리하기 위한 **지식 관리 시스템**입니다.  
역할 기반 포털로 구분되어 있으며, 각 권한에 따라 문의 작성, 지식 등록, FAQ 관리 등의 기능을 제공합니다.

---

## 📌 주요 기능

- 고객사 문의 등록 및 관리자 답변
- 사원 지식 문서 등록 및 열람
- 관리자 대시보드 및 콘텐츠 관리
- FAQ 검색 및 카테고리 필터
- 마이페이지에서 본인 작성 글 관리

---

## 🗂️ 페이지 설명

### 🌐 공통

| 파일명 | 경로 | 설명 |
|--------|------|------|
| `HomePage.js` | `/` | 방문자 및 사용자 공통 메인 페이지. 지식 검색 버튼 포함 |

---

### 👤 사용자(User) 페이지

| 파일명 | 경로 | 설명 |
|--------|------|------|
| `Knowledge.js` | `/Knowledge` | 사용자용 지식 문서 열람 페이지. 검색/카테고리 필터 제공 |
| `MyInquiriesPage.js` | `/my-inquiries` | 문의 등록 및 조회 페이지. 파일 첨부 가능 |
| `MyPage.js` | `/my-page` | 본인 작성 문의 목록 확인 및 수정/삭제 가능 |
| `FAQPage.js` | `/faq` | 사용자용 FAQ 페이지. 카테고리 및 키워드 검색 기능 |

---

### 🧑‍💼 사원(Employee) 페이지

| 파일명 | 경로 | 설명 |
|--------|------|------|
| `EmployeeHome.js` | `/employee-home` | 사원 전용 메인 화면. 지식 문서 접근 버튼 포함 |
| `EmployeeKnowledgePage.js` | `/employee-knowledge` | 지식 문서 등록 및 열람, 파일 업로드 가능 |
| `EmployeeInquiriesPage.js` | `/employee-inquiry` | 문의 등록 및 열람, 삭제 가능. 카테고리/검색 지원 |
| `EmployeeFaqPage.js` | `/employee-faq` | 사원용 FAQ 열람 페이지. |
| `MyEmployeePage.js` | `/employee-mypage` | 사원이 작성한 문의 및 지식 문서를 한 페이지에서 관리 |

---

### 🛠️ 관리자(Admin) 페이지

| 파일명 | 경로 | 설명 |
|--------|------|------|
| `AdminDashboard.js` | `/admin` | 전체 통계 카드, 지식/문의/FAQ 관리 테이블 포함 |
| `KnowledgeTable.js` | 내부 컴포넌트 | 지식 문서 등록, 수정, 삭제 및 목록 관리 |
| `InquiryTable.js` | 내부 컴포넌트 | 고객/사원 문의에 대한 답변 처리, 상태 관리 |
| `FaqTable.js` | 내부 컴포넌트 | FAQ 항목 추가, 수정, 삭제 및 카테고리 필터 |

---

## 🔐 역할별 권한 요약

| 역할     | 문의 작성 | 문의 답변 | 지식 등록 | FAQ 등록 |
|----------|-----------|------------|------------|-----------|
| 사용자   | ✅ 가능   | ❌ 불가   | ❌ 불가   | ❌ 불가  |
| 사원     | ✅ 가능   | ❌ 불가   | ✅ 가능   | ❌ 불가  |
| 관리자   | ❌ 불가   | ✅ 가능   | ✅ 가능   | ✅ 가능  |

---

## ⚙️ 기술 스택

- **Frontend**: React.js, React Router, Axios
- **Backend**: Flask (Python), MySQL, JWT
- **Infra**: AWS EC2, RDS

---

## 🛠️ 실행 방법

### ✅ 프론트엔드

```bash
cd frontend
npm install
npm start
