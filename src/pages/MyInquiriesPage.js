import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import "../styles/MyInquiriesPage.css";
import { inquiryData } from '../data/inquiryData';

const categories = [
  "전체",
  "새 기능",
  "수정",
  "버그",
  "문의",
  "장애",
  "긴급 지원",
];

export default function MyInquiriesPage() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  // ✅ 초기 데이터 로딩
useEffect(() => {
  async function loadInquiries() {
    setLoading(true);
    setError(null);
    try {
      // ✅ 관리자용 데이터를 사용자 화면용 구조로 변환
      const mapped = inquiryData.map(item => ({
        id: item.id,
        title: item.subject,
        category: '문의', // 공통 데이터에 없으므로 기본값 지정
        customer: item.manufacturer,
        inquiryContent: item.message,
        answerStatus: item.status,
        answerContent: item.response,
        date: item.date,
        attachment: null, // 없는 경우 null 처리
        answerDate: item.answerDate || "", // 선택사항 처리
      }));

      setInquiries(mapped);
    } catch (e) {
      setError("데이터를 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  }
  loadInquiries();
}, []);

const filtered = inquiries.filter((item) => {
  const categoryMatch = filter === "전체" || item.category === filter;
  const searchMatch =
    (item.title || "").includes(search) ||
    (item.inquiryContent || "").includes(search) ||
    (item.answerContent || "").includes(search);
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
    try {
      setInquiries((prev) =>
        prev.filter((item) => item.id !== confirmDeleteId)
      );
      setConfirmDeleteId(null);
      if (expandedId === confirmDeleteId) setExpandedId(null);
    } catch {
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  const handleNewFormChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "fileUpload") {
      setNewForm((prev) => ({ ...prev, file: files[0] || null }));
    } else {
      setNewForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const submitNewInquiry = async (e) => {
    e.preventDefault();
    if (
      !newForm.title ||
      !newForm.category ||
      !newForm.inquiryContent ||
      !newForm.customer
    ) {
      alert("모든 필드를 입력해주세요.");
      return;
    }

    try {
      const created = {
        id: Date.now(),
        category: newForm.category,
        customer: newForm.customer,
        answerStatus: "답변 대기",
        title: newForm.title,
        inquiryContent: newForm.inquiryContent,
        attachment: newForm.file
          ? { name: newForm.file.name, url: "#" }
          : null,
        answerContent: "",
        date: new Date().toISOString().slice(0, 10).replace(/-/g, "."),
      };

      setInquiries((prev) => [created, ...prev]);
      setShowNewModal(false);
      setNewForm({
        title: "",
        category: "",
        customer: "",
        inquiryContent: "",
        file: null,
      });
      setCurrentPage(1);
    } catch {
      alert("문의 등록 중 오류가 발생했습니다.");
    }
  };

  if (loading) return <div className="container">로딩중...</div>;
  if (error) return <div className="container">{error}</div>;

  return (
    <>
      <Header />
      <main className="container">
        <section>
          <hgroup>
            <h2>고객사 문의</h2>
            <h3>제조사에 문의하고 답변을 확인할 수 있는 공간입니다</h3>
          </hgroup>

          {/* 검색 및 작성 버튼 */}
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

          {/* 카테고리 필터 */}
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

          {/* 문의 목록 헤더 */}
          <div className="inquiry-header">
            <h3>나의 문의 내역</h3>
            <span>총 {filtered.length}건의 문의</span>
          </div>

          {/* 문의 목록 */}
          <div className="inquiry-list" role="list">
            {paged.length === 0 ? (
              <p>문의 내역이 없습니다.</p>
            ) : (
              paged.map((item) => (
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

                  {/* 상세 내용 */}
                  {expandedId === item.id && (
                    <section className="card-details" onClick={(e) => e.stopPropagation()}>
                      <div className="inquiry-content-section">
                        <strong>문의 내용</strong>
                        <p>{item.inquiryContent}</p>
                        {item.attachment && (
                          <a
                            href={item.attachment.url}
                            target="_blank"
                            rel="noreferrer"
                            className="attachment-link"
                          >
                            📎 {item.attachment.name}
                          </a>
                        )}
                        <time className="content-date">{item.date}</time>
                      </div>
                      {item.answerContent ? (
                        <div className="answer-section">
                          <strong>제조사 답변</strong>
                          <time className="answer-date">
                            {item.answerDate || item.date}
                          </time>
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
              ))
            )}
          </div>

          {/* 페이지네이션 */}
          {totalPages > 1 && (
            <nav className="pagination" role="navigation" aria-label="페이지네이션">
              <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}>
                &lt;
              </button>
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  className={currentPage === i + 1 ? "active" : ""}
                  onClick={() => setCurrentPage(i + 1)}
                  aria-current={currentPage === i + 1 ? "page" : undefined}
                >
                  {i + 1}
                </button>
              ))}
              <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>
                &gt;
              </button>
            </nav>
          )}

          {/* 문의 등록 모달 */}
          {showNewModal && (
            <div className="modal-backdrop" role="dialog" aria-modal="true" onClick={() => setShowNewModal(false)}>
              <form className="modal new-inquiry-modal" onClick={(e) => e.stopPropagation()} onSubmit={submitNewInquiry}>
                <header>
                  <h2>새 문의 작성</h2>
                  <button type="button" className="close-btn" aria-label="닫기" onClick={() => setShowNewModal(false)}>×</button>
                </header>

                <label htmlFor="title">문의 제목</label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  value={newForm.title}
                  onChange={handleNewFormChange}
                  required
                />

                <label htmlFor="customer">고객사</label>
                <input
                  id="customer"
                  name="customer"
                  type="text"
                  value={newForm.customer}
                  onChange={handleNewFormChange}
                  required
                />

                <label htmlFor="category">문의 유형</label>
                <select
                  id="category"
                  name="category"
                  value={newForm.category}
                  onChange={handleNewFormChange}
                  required
                >
                  <option value="">문의 유형 선택</option>
                  {categories.filter(c => c !== "전체").map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>

                <label htmlFor="inquiryContent">문의 내용</label>
                <textarea
                  id="inquiryContent"
                  name="inquiryContent"
                  value={newForm.inquiryContent}
                  onChange={handleNewFormChange}
                  rows={5}
                  required
                />

                <label htmlFor="fileUpload">첨부 파일 (선택)</label>
                <input
                  id="fileUpload"
                  name="fileUpload"
                  type="file"
                  accept=".jpg,.jpeg,.pdf"
                  onChange={handleNewFormChange}
                />

                <footer className="modal-footer">
                  <button type="button" className="btn cancel-btn" onClick={() => setShowNewModal(false)}>취소</button>
                  <button type="submit" className="btn submit-btn">문의 제출</button>
                </footer>
              </form>
            </div>
          )}

          {/* 삭제 확인 모달 */}
          {confirmDeleteId !== null && (
            <div className="modal-backdrop" role="dialog" aria-modal="true" onClick={() => setConfirmDeleteId(null)}>
              <div className="modal confirm-delete-modal" onClick={(e) => e.stopPropagation()}>
                <header>
                  <h2>문의 삭제</h2>
                  <button type="button" className="close-btn" aria-label="닫기" onClick={() => setConfirmDeleteId(null)}>×</button>
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
