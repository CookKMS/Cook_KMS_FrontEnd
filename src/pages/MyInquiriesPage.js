import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import "../styles/MyInquiriesPage.css";

const categories = ["전체", "새 기능", "수정", "버그", "문의", "장애", "긴급 지원"];

const dummyData = [
  {
    id: 1,
    category: "문의",
    customer: "A전자",
    answerStatus: "답변 대기",
    title: "로그인이 되지 않습니다.",
    inquiryContent: "아이디/비밀번호가 맞는데 로그인에 실패합니다.",
    answerContent: "",
    date: "2023. 8. 01.",
  },
  {
    id: 2,
    category: "새 기능",
    customer: "B테크",
    answerStatus: "답변 완료",
    title: "신규 기능 요청",
    inquiryContent: "",
    answerContent: "요청하신 기능은 다음 업데이트에 반영 예정입니다.",
    date: "2023. 8. 02.",
  },
  {
    id: 3,
    category: "문의",
    customer: "C시스템즈",
    answerStatus: "답변 완료",
    title: "이중 로그인 차단 문의",
    inquiryContent: "",
    answerContent: "설정에서 차단 기능을 활성화해주세요.",
    date: "2023. 8. 03.",
  },
];

export default function MyInquiriesPage() {
  const [inquiries, setInquiries] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("전체");
  const [expandedId, setExpandedId] = useState(null);
  const [showNewModal, setShowNewModal] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const inquiriesPerPage = 5;

  const deletingItem = inquiries.find(item => item.id === confirmDeleteId);
  const deletingTitle = deletingItem ? deletingItem.title : "";

  const [newForm, setNewForm] = useState({
    title: "",
    category: "",
    customer: "",
    inquiryContent: "",
    file: null,
  });

  useEffect(() => {
    // [TODO: Flask 연동 시 교체]
    setInquiries(dummyData);
  }, []);

  const filtered = inquiries.filter((item) => {
    const categoryMatch = filter === "전체" || item.category === filter;
    const searchMatch =
      item.title.includes(search) ||
      item.inquiryContent.includes(search) ||
      item.answerContent.includes(search);
    return categoryMatch && searchMatch;
  });

  const totalPages = Math.ceil(filtered.length / inquiriesPerPage);
  const paged = filtered.slice(
    (currentPage - 1) * inquiriesPerPage,
    currentPage * inquiriesPerPage
  );

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const confirmDelete = async () => {
    setInquiries(prev => prev.filter(item => item.id !== confirmDeleteId));
    setConfirmDeleteId(null);
    if (expandedId === confirmDeleteId) setExpandedId(null);
  };

  const handleNewFormChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "fileUpload") {
      setNewForm(prev => ({ ...prev, file: files[0] || null }));
    } else {
      setNewForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const submitNewInquiry = async (e) => {
    e.preventDefault();
    if (!newForm.title || !newForm.category || !newForm.inquiryContent || !newForm.customer) {
      alert("모든 필드를 입력해주세요.");
      return;
    }

    const created = {
      id: Date.now(),
      category: newForm.category,
      customer: newForm.customer,
      answerStatus: "답변 대기",
      title: newForm.title,
      inquiryContent: newForm.inquiryContent,
      answerContent: "",
      date: new Date().toISOString().slice(0, 10).replace(/-/g, "."),
      attachment: newForm.file ? { name: newForm.file.name, url: "#" } : null,
    };

    setInquiries(prev => [created, ...prev]);
    setShowNewModal(false);
    setNewForm({ title: "", category: "", customer: "", inquiryContent: "", file: null });
    setCurrentPage(1);
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

          <div className="search-filter-box">
            <input
              type="text"
              placeholder="키워드 검색"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              aria-label="키워드 검색"
            />
            <button
              className="btn"
              onClick={() => setShowNewModal(true)}
              aria-label="문의 작성"
            >
              + 문의 작성
            </button>
          </div>

          <div className="filter-buttons" role="list">
            {categories.map((cat) => (
              <button
                key={cat}
                className={filter === cat ? "active" : ""}
                onClick={() => {
                  setFilter(cat);
                  setCurrentPage(1);
                }}
                type="button"
                role="listitem"
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="inquiry-header">
            <h3>나의 문의 내역</h3>
            <span>총 {filtered.length}건의 문의</span>
          </div>

          <div className="inquiry-list" role="list">
            {paged.map((item) => (
              <article
                key={item.id}
                className={`inquiry-card ${expandedId === item.id ? "expanded" : ""}`}
                onClick={() => toggleExpand(item.id)}
                tabIndex={0}
                aria-expanded={expandedId === item.id}
                role="button"
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
                    <time dateTime={item.date}>{item.date}</time>
                    <div className="customer-name">{item.customer}</div> {/* 👈 고객사 표시 */}
                    <button
                      className="btn-delete"
                      aria-label="문의 삭제"
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
                        <time className="answer-date">{item.answerDate || item.date}</time>
                        <p>{item.answerContent}</p>
                      </div>
                    ) : (
                      <div className="pending-answer-notice">
                        <i>ℹ️</i>
                        현재 문의 내용을 검토 중입니다. 빠른 시일 내에 답변 드리겠습니다.
                      </div>
                    )}
                  </section>
                )}
              </article>
            ))}
          </div>

          {showNewModal && (
            <div className="modal-backdrop" role="dialog" aria-modal="true" onClick={() => setShowNewModal(false)}>
              <form className="modal new-inquiry-modal" onClick={(e) => e.stopPropagation()} onSubmit={submitNewInquiry}>
                <header>
                  <h2>새 문의 작성</h2>
                  <button type="button" className="close-btn" onClick={() => setShowNewModal(false)}>×</button>
                </header>

                <label htmlFor="title">문의 제목</label>
                <input id="title" name="title" type="text" value={newForm.title} onChange={handleNewFormChange} required />

                <label htmlFor="customer">고객사</label>
                <input id="customer" name="customer" type="text" value={newForm.customer} onChange={handleNewFormChange} required />

                <label htmlFor="category">문의 유형</label>
                <select id="category" name="category" value={newForm.category} onChange={handleNewFormChange} required>
                  <option value="">문의 유형을 선택하세요</option>
                  {categories.filter(c => c !== "전체").map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>

                <label htmlFor="inquiryContent">문의 내용</label>
                <textarea id="inquiryContent" name="inquiryContent" value={newForm.inquiryContent} onChange={handleNewFormChange} rows={5} required />

                <label htmlFor="fileUpload">첨부 파일 (선택)</label>
                <input id="fileUpload" name="fileUpload" type="file" accept=".jpg,.jpeg,.pdf" onChange={handleNewFormChange} />

                <footer className="modal-footer">
                  <button type="button" className="btn cancel-btn" onClick={() => setShowNewModal(false)}>취소</button>
                  <button type="submit" className="btn submit-btn">문의 제출</button>
                </footer>
              </form>
            </div>
          )}

          {confirmDeleteId && (
            <div className="modal-backdrop" onClick={() => setConfirmDeleteId(null)}>
              <div className="modal confirm-delete-modal" onClick={(e) => e.stopPropagation()}>
                <header>
                  <h2>문의 삭제</h2>
                  <button type="button" className="close-btn" onClick={() => setConfirmDeleteId(null)}>×</button>
                </header>
                <p>"{deletingTitle}" 정말로 삭제하시겠습니까?</p>
                <footer className="modal-footer">
                  <button className="btn cancel-btn" onClick={() => setConfirmDeleteId(null)}>취소</button>
                  <button className="btn delete-btn" onClick={confirmDelete}>삭제</button>
                </footer>
              </div>
            </div>
          )}
        </section>
      </main>
    </>
  );
}
