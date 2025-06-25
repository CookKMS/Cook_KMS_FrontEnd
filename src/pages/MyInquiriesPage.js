import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import "../styles/MyInquiriesPage.css";

// ✅ 문의 카테고리 목록 (공통코드 테이블과 매핑)
const categories = [
  "전체", "새 기능", "수정", "버그", "문의", "장애", "긴급 지원"
];

export default function MyInquiriesPage() {
  // 🔹 문의 전체 목록
  const [inquiries, setInquiries] = useState([]);

  // 🔹 UI 제어용 상태
  const [expandedId, setExpandedId] = useState(null);
  const [showNewModal, setShowNewModal] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  // 🔹 필터, 검색, 페이징
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("전체");
  const [currentPage, setCurrentPage] = useState(1);
  const inquiriesPerPage = 5;

  // 🔹 새 문의 작성용 상태
  const [newForm, setNewForm] = useState({
    title: "",
    category: "",
    customer: "",
    inquiryContent: "",
    file: null,
  });

  // ✅ [Flask 연동] 로그인된 사용자 기준 문의 조회
  // GET /api/inquiries?user_id=...
  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        // const res = await fetch('/api/inquiries');
        // const data = await res.json();
        // setInquiries(data);

        // 더미 테스트용
const dummyData = [
  {
    id: 1,
    title: "로그인 실패",
    category: "문의",
    customer: "A전자",
    inquiryContent: "로그인 시도 시 오류 발생.",
    answerContent: "",
    answerStatus: "답변 대기",
    date: "2023.08.01",
  },
  {
    id: 2,
    title: "신규 기능 요청",
    category: "새 기능",
    customer: "B테크",
    inquiryContent: "대시보드에 PDF 다운로드 기능 추가 요청.",
    answerContent: "추가 예정입니다.",
    answerStatus: "답변 완료",
    date: "2023.08.02",
  },
  {
    id: 3,
    title: "버그 리포트",
    category: "버그",
    customer: "C시스템즈",
    inquiryContent: "엑셀 업로드 시 데이터 누락됨.",
    answerContent: "",
    answerStatus: "답변 대기",
    date: "2023.08.03",
  },
  {
    id: 4,
    title: "접속 차단 오류",
    category: "장애",
    customer: "D네트웍스",
    inquiryContent: "사내망에서 시스템 접속이 차단됩니다.",
    answerContent: "방화벽 설정 확인 부탁드립니다.",
    answerStatus: "답변 완료",
    date: "2023.08.04",
  },
  {
    id: 5,
    title: "긴급 보안 패치 요청",
    category: "긴급 지원",
    customer: "E솔루션",
    inquiryContent: "XSS 취약점 발견됨. 긴급 대응 요청.",
    answerContent: "보안 패치 작업 중입니다.",
    answerStatus: "답변 완료",
    date: "2023.08.05",
  },
  {
    id: 6,
    title: "UI 위치 수정 요청",
    category: "수정",
    customer: "F랩",
    inquiryContent: "검색창 위치가 어색합니다.",
    answerContent: "",
    answerStatus: "답변 대기",
    date: "2023.08.06",
  },
  {
    id: 7,
    title: "모바일 뷰 대응 문의",
    category: "문의",
    customer: "G테크",
    inquiryContent: "모바일에서 화면이 깨집니다.",
    answerContent: "반응형 적용 예정입니다.",
    answerStatus: "답변 완료",
    date: "2023.08.07",
  },
  {
    id: 8,
    title: "다운로드 기능 실패",
    category: "버그",
    customer: "H전자",
    inquiryContent: "파일 다운로드 시 오류 발생",
    answerContent: "",
    answerStatus: "답변 대기",
    date: "2023.08.08",
  },
  {
    id: 9,
    title: "로그 이력 확인 요청",
    category: "문의",
    customer: "I네트",
    inquiryContent: "접속 기록 확인 요청",
    answerContent: "로그 관리 메뉴에서 확인 가능합니다.",
    answerStatus: "답변 완료",
    date: "2023.08.09",
  },
  {
    id: 10,
    title: "권한 설정 문제",
    category: "장애",
    customer: "J소프트",
    inquiryContent: "권한 설정 후에도 접근 불가",
    answerContent: "권한 테이블 초기화 중입니다.",
    answerStatus: "답변 완료",
    date: "2023.08.10",
  },
  {
    id: 11,
    title: "기능 요청: 카테고리별 정렬",
    category: "새 기능",
    customer: "K코퍼레이션",
    inquiryContent: "지식 문서를 카테고리별로 정렬하고 싶습니다.",
    answerContent: "",
    answerStatus: "답변 대기",
    date: "2023.08.11",
  },
  {
    id: 12,
    title: "문의 상태가 초기화됨",
    category: "버그",
    customer: "L디지털",
    inquiryContent: "문의 목록이 새로고침 시 사라집니다.",
    answerContent: "세션 문제로 확인되어 수정 중입니다.",
    answerStatus: "답변 완료",
    date: "2023.08.12",
  },
];

        setInquiries(dummyData);
      } catch (err) {
        console.error("문의 불러오기 실패:", err);
      }
    };
    fetchInquiries();
  }, []);

  // 🔍 필터 + 검색 적용된 결과
  const filtered = inquiries.filter((item) => {
    const cat = filter === "전체" || item.category === filter;
    const keyword =
      item.title.includes(search) ||
      item.inquiryContent.includes(search) ||
      (item.answerContent || "").includes(search);
    return cat && keyword;
  });

  // 📄 페이징 처리
  const totalPages = Math.ceil(filtered.length / inquiriesPerPage);
  const paged = filtered.slice(
    (currentPage - 1) * inquiriesPerPage,
    currentPage * inquiriesPerPage
  );

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleNewFormChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "fileUpload") {
      setNewForm(prev => ({ ...prev, file: files[0] || null }));
    } else {
      setNewForm(prev => ({ ...prev, [name]: value }));
    }
  };

  // ✅ [Flask 연동] 문의 등록 요청: POST /api/inquiries
  const submitNewInquiry = async (e) => {
    e.preventDefault();

    const { title, category, customer, inquiryContent, file } = newForm;
    if (!title || !category || !customer || !inquiryContent) {
      alert("모든 항목을 입력해주세요.");
      return;
    }

    try {
      // const formData = new FormData();
      // formData.append("title", title);
      // formData.append("category", category);
      // formData.append("customer", customer);
      // formData.append("inquiryContent", inquiryContent);
      // if (file) formData.append("file", file);

      // const res = await fetch('/api/inquiries', {
      //   method: "POST",
      //   body: formData
      // });

      const newItem = {
        id: Date.now(),
        title,
        category,
        customer,
        inquiryContent,
        answerContent: "",
        answerStatus: "답변 대기",
        date: new Date().toISOString().slice(0, 10).replace(/-/g, "."),
      };

      setInquiries(prev => [newItem, ...prev]);
      setShowNewModal(false);
      setNewForm({
        title: "",
        category: "",
        customer: "",
        inquiryContent: "",
        file: null,
      });
      setCurrentPage(1);
    } catch (err) {
      console.error("등록 실패:", err);
      alert("문의 등록 중 오류 발생");
    }
  };

  // ✅ [Flask 연동] 문의 삭제 요청: DELETE /api/inquiries/:id
  const handleDelete = async (id) => {
    try {
      // await fetch(`/api/inquiries/${id}`, { method: "DELETE" });
      setInquiries(prev => prev.filter(q => q.id !== id));
      setConfirmDeleteId(null);
    } catch (err) {
      console.error("삭제 실패:", err);
      alert("삭제 중 오류 발생");
    }
  };

  return (
    <>
      <Header />
      <main className="container">
        <section>
          <hgroup>
            <h2>고객사 문의</h2>
            <h3>제조사에 문의하고 답변을 확인할 수 있는 공간입니다</h3>
          </hgroup>

          {/* 🔍 검색창 + 작성 버튼 */}
          <div className="search-filter-box">
            <input
              type="text"
              placeholder="키워드 검색"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />
            <button type="button" className="btn" onClick={() => setShowNewModal(true)}>
              + 문의 작성
            </button>
          </div>

          {/* 🔘 카테고리 필터 */}
          <div className="filter-buttons">
            {categories.map((cat) => (
              <button
                key={cat}
                className={filter === cat ? "active" : ""}
                onClick={() => {
                  setFilter(cat);
                  setCurrentPage(1);
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* 📋 문의 목록 */}
          <div className="inquiry-header">
            <h3>나의 문의 내역</h3>
            <span>총 {filtered.length}건의 문의</span>
          </div>

          <div className="inquiry-list">
            {paged.map((item) => (
              <article
                key={item.id}
                className={`inquiry-card ${expandedId === item.id ? "expanded" : ""}`}
                onClick={() => toggleExpand(item.id)}
              >
                <header className="card-header">
                  <div className="left-group">
                    <div className="status-tags">
                      <span className="category-tag">{item.category}</span>
                      <span className={`answer-status ${item.answerStatus === "답변 완료" ? "answered" : "pending"}`}>
                        {item.answerStatus}
                      </span>
                    </div>
                    <h4 className="card-title">{item.title}</h4>
                  </div>
                  <div className="right-group">
                    <time>{item.date}</time>
                    <div className="customer-name">{item.customer}</div>
                    <button
                      className="btn-delete"
                      onClick={(e) => {
                        e.stopPropagation();
                        setConfirmDeleteId(item.id);
                      }}
                    >
                      🗑️
                    </button>
                  </div>
                </header>

                {expandedId === item.id && (
                  <section className="card-details" onClick={(e) => e.stopPropagation()}>
                    <div className="inquiry-content-section">
                      <strong>문의 내용</strong>
                      <p>{item.inquiryContent}</p>
                      <time className="content-date">{item.date}</time>
                    </div>
                    {item.answerContent ? (
                      <div className="answer-section">
                        <strong>제조사 답변</strong>
                        <p>{item.answerContent}</p>
                      </div>
                    ) : (
                      <div className="pending-answer-notice">
                        <i>ℹ️</i> 현재 문의 내용을 검토 중입니다. 빠른 시일 내에 답변 드리겠습니다.
                      </div>
                    )}
                  </section>
                )}
              </article>
            ))}
          </div>

          {/* 📌 페이지네이션 */}
          {totalPages > 1 && (
            <nav className="pagination" aria-label="페이지 이동">
              <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}>
                &lt;
              </button>
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  className={currentPage === i + 1 ? "active" : ""}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
              <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>
                &gt;
              </button>
            </nav>
          )}

          {/* 📝 문의 작성 모달 */}
          {showNewModal && (
            <div className="modal-backdrop" onClick={() => setShowNewModal(false)}>
              <form className="modal new-inquiry-modal" onClick={(e) => e.stopPropagation()} onSubmit={submitNewInquiry}>
                <header>
                  <h2>새 문의 작성</h2>
                  <button type="button" className="close-btn" onClick={() => setShowNewModal(false)}>×</button>
                </header>

                <label>문의 제목</label>
                <input name="title" value={newForm.title} onChange={handleNewFormChange} required />

                <label>고객사</label>
                <input name="customer" value={newForm.customer} onChange={handleNewFormChange} required />

                <label>카테고리</label>
                <select name="category" value={newForm.category} onChange={handleNewFormChange} required>
                  <option value="">카테고리 선택</option>
                  {categories.filter(c => c !== "전체").map((cat) => (
                    <option key={cat}>{cat}</option>
                  ))}
                </select>

                <label>문의 내용</label>
                <textarea name="inquiryContent" rows={4} value={newForm.inquiryContent} onChange={handleNewFormChange} required />

                <label>첨부 파일</label>
                <input name="fileUpload" type="file" accept=".pdf,.jpg,.jpeg" onChange={handleNewFormChange} />

                <footer className="modal-footer">
                  <button type="button" className="btn cancel-btn" onClick={() => setShowNewModal(false)}>취소</button>
                  <button type="submit" className="btn submit-btn">문의 제출</button>
                </footer>
              </form>
            </div>
          )}

          {/* ❌ 삭제 확인 모달 */}
          {confirmDeleteId && (
            <div className="modal-backdrop" onClick={() => setConfirmDeleteId(null)}>
              <div className="modal confirm" onClick={(e) => e.stopPropagation()}>
                <h3>삭제 확인</h3>
                <p>정말로 삭제하시겠습니까?</p>
                <div className="modal-footer">
                  <button className="btn cancel-btn" onClick={() => setConfirmDeleteId(null)}>취소</button>
                  <button className="btn delete-btn" onClick={() => handleDelete(confirmDeleteId)}>삭제</button>
                </div>
              </div>
            </div>
          )}
        </section>
      </main>
    </>
  );
}
