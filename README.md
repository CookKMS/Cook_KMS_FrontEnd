물론입니다. 아래는 GitHub의 `README.md`에 그대로 복사해서 붙여넣을 수 있도록 마크다운 문법으로 정리한 버전입니다. 특히 **각각의 페이지가 무엇을 하는지** 명확하게 기술해두었습니다.

---

```markdown
# 🧠 Cook-KMS (지식 관리 시스템)

Cook-KMS는 고객사와 사내 임직원, 관리자 간의 지식 공유와 문의 응답을 효율적으로 관리하는 시스템입니다. 역할 기반 포털 구조로 운영되며, 지식문서, 제조사 문의, FAQ 기능을 통합 제공합니다.

---

## 📄 주요 페이지 설명

### 🌐 HomePage.js
- 메인 홈페이지 화면
- "지식 검색 시작하기" 버튼 클릭 시 `/Knowledge`로 이동
- 로그인 여부와 관계없이 접근 가능

---

### 📁 Knowledge.js
- 전체 사용자 대상 지식 문서 목록 제공
- 검색 기능, 카테고리 필터, 문서 등록 모달 포함
- 지식 문서 등록 시 첨부파일 업로드 가능

---

### 💬 MyInquiriesPage.js
- 사용자(또는 임직원)가 문의를 작성하는 페이지
- 문의 리스트 조회 + 검색 + 카테고리 필터 가능
- 문의 등록 시 첨부파일 업로드 가능
- 본인이 작성한 문의만 표시됨

---

### 🧑‍💻 MyPage.js
- 사용자 전용 마이페이지
- 본인이 작성한 문의 내역 목록을 카드 형식으로 보여줌
- 문의 수정, 삭제 가능 (단, 답변 완료 전 상태만)
- 답변 여부에 따라 아이콘/버튼 비활성화 처리됨

---

### ❓ FAQPage.js
- 전체 사용자 조회 가능
- FAQ 카테고리 필터 및 키워드 검색 가능
- 아코디언 방식으로 FAQ 열고 닫기 기능 포함

---

### 🏢 EmployeeHome.js
- 사원 전용 메인 홈
- “지식 문서 확인하기” 버튼으로 `/employee-knowledge` 이동

---

### 🧠 EmployeeKnowledgePage.js
- 사원 전용 지식 관리 페이지
- 사원이 등록한 지식 문서 열람 및 등록 기능 제공
- 검색, 카테고리 필터, 등록 모달 포함

---

### 📨 EmployeeInquiriesPage.js
- 사원 전용 문의 페이지
- 본인이 작성한 문의 리스트 열람, 등록, 삭제 가능
- 키워드 검색, 카테고리 필터 포함

---

### 📂 EmployeeFaqPage.js
- 사원 전용 FAQ 열람 페이지
- 검색 및 카테고리 필터 가능
- 아코디언 방식의 UI로 열고 닫기

---

### 🙋‍♂️ MyEmployeePage.js
- 사원 전용 마이페이지
- 사원이 작성한 모든 문의와 지식 문서를 한 번에 열람/관리
- 수정, 삭제 모달 포함

---

### 🛠️ AdminDashboard.js
- 관리자 전용 대시보드
- 통계 카드 (지식 문서 수, 답변 대기 문의 수, FAQ 수)
- 하단에 3가지 테이블 포함:
  - `KnowledgeTable.js`: 지식 문서 목록 관리 (등록/수정/삭제)
  - `InquiryTable.js`: 제조사 문의 응답 처리, 답변 등록/수정
  - `FaqTable.js`: FAQ 항목 목록/등록/수정/삭제

---

## 🗂️ 프로젝트 구조 요약

```

Cook\_KMS\_FrontEnd/
├── src/pages/
│   ├── HomePage.js
│   ├── Knowledge.js
│   ├── MyInquiriesPage.js
│   ├── MyPage.js
│   ├── FAQPage.js
│   └── employee/
│       ├── EmployeeHome.js
│       ├── EmployeeKnowledgePage.js
│       ├── EmployeeInquiriesPage.js
│       ├── EmployeeFaqPage.js
│       └── MyEmployeePage.js
│   └── admin/
│       ├── AdminDashboard.js
│       └── components/
│           ├── KnowledgeTable.js
│           ├── InquiryTable.js
│           └── FaqTable.js

````

---

## 📌 기술 스택

- **Frontend**: React.js, React Router, Axios
- **Backend**: Flask, MySQL, JWT
- **Deployment**: AWS EC2, RDS

---

## 🔐 사용자 권한 요약

| 권한    | 문의 작성 | 문의 답변 | 지식 등록 | FAQ 등록 |
|---------|-----------|------------|------------|-----------|
| 사용자  | ✅        | ❌         | ❌         | ❌        |
| 사원    | ✅        | ❌         | ✅         | ❌        |
| 관리자  | ❌        | ✅         | ✅         | ✅        |

---

## 🛠️ 설치 및 실행

```bash
# frontend
cd frontend
npm install
npm start

# backend
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python app.py
````

```

---

필요 시 `backend/`나 API 명세 설명도 추가해드릴 수 있습니다. 원하시면 말씀해주세요.
```
