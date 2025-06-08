import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import "../styles/MyInquiriesPage.css";

const categories = [
  "전체",
  "새 기능",
  "수정",
  "버그",
  "문의",
  "장애",
  "긴급 지원",
];


// 현재는 더미 데이터. 실제 백엔드 API에서 받아올 예정
const dummyData = [
  {
    id: 1,
    category: "수정",
    answerStatus: "답변 완료",
    title: "제품 A의 펌웨어 업데이트 문제",
    inquiryContent:
      "제품 A를 최신 펌웨어 버전 2.1.4로 업데이트한 후에 작동이 되지 않습니다.",
    answerContent:
      "안녕하세요, 고객님. 해당 문제는 펌웨어 호환성 문제로 확인되었습니다.",
    date: "2023.07.15",
    answerDate: "2023.07.16 11:23",
    attachment: {
      url: "https://example.com/error_photo.jpg",
      name: "error_photo.jpg",
    },
  },
  {
    id: 2,
    category: "긴급 지원",
    answerStatus: "답변 대기",
    title: "제품 B 보안 취약점 문의",
    inquiryContent: "제품 B 보안 취약점 관련 문의 드립니다.",
    answerContent: "",
    date: "2023.07.10",
  },
  {
    id: 3,
    category: "문의",
    answerStatus: "답변 완료",
    title: "대량 구매 문의",
    inquiryContent: "대량 구매 시 할인 문의드립니다.",
    answerContent: "대량 구매 시 할인 혜택이 있습니다.",
    date: "2023.07.05",
  },
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

  // [TODO: Flask 연동] 전체 문의 조회 API 호출
  useEffect(() => {
    async function loadInquiries() {
      setLoading(true);
      setError(null);
      try {
        // const res = await fetch("/api/inquiries");
        // const data = await res.json();
        const data = dummyData;
        setInquiries(data);
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

  // [TODO: Flask 연동] 문의 삭제 API 호출
  const confirmDelete = async () => {
    try {
      // await fetch(`/api/inquiries/${confirmDeleteId}`, { method: "DELETE" });
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

  // [TODO: Flask 연동] 문의 등록 API 호출 (multipart/form-data로 파일 포함 가능)
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
      // const formData = new FormData();
      // formData.append("title", newForm.title);
      // formData.append("category", newForm.category);
      // formData.append("customer", newForm.customer);
      // formData.append("inquiryContent", newForm.inquiryContent);
      // if (newForm.file) formData.append("file", newForm.file);

      // const res = await fetch("/api/inquiries", {
      //   method: "POST",
      //   body: formData,
      // });
      // const created = await res.json();

      const created = {
        id: Date.now(),
        category: newForm.category,
        customer: newForm.customer,
        answerStatus: "답변 대기",
        title: newForm.title,
        inquiryContent: newForm.inquiryContent,
        attachment: newForm.file
          ? { name: newForm.file.name, url: "#" } // [TODO: 실제 업로드된 파일 URL로 교체]
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
                        <span
                          className={`answer-status ${item.answerStatus === "답변 완료"
                            ? "answered"
                            : "pending"
                            }`}
                        >
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

                  {expandedId === item.id && (
                    <section
                      className="card-details"
                      onClick={(e) => e.stopPropagation()}
                    >
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
                      ) : item.answerStatus === "답변 대기" ? (
                        <div className="pending-answer-notice">
                          <i>ℹ️</i>
                          현재 문의 내용을 검토 중입니다. 빠른 시일 내에 답변 드리겠습니다.
                        </div>
                      ) : null}
                    </section>
                  )}
                </article>
              ))
            )}
          </div>

          {totalPages > 1 && (
            <nav
              className="pagination"
              role="navigation"
              aria-label="페이지네이션"
            >
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                aria-label="이전 페이지"
              >
                &lt;
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  className={currentPage === i + 1 ? "active" : ""}
                  onClick={() => setCurrentPage(i + 1)}
                  aria-current={currentPage === i + 1 ? "page" : undefined}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                aria-label="다음 페이지"
              >
                &gt;
              </button>
            </nav>
          )}

          {showNewModal && (
            <div
              className="modal-backdrop"
              role="dialog"
              aria-modal="true"
              onClick={() => setShowNewModal(false)}
            >
              <form
                className="modal new-inquiry-modal"
                onClick={(e) => e.stopPropagation()}
                onSubmit={submitNewInquiry}
              >
                <header>
                  <h2>새 문의 작성</h2>
                  <button
                    type="button"
                    className="close-btn"
                    aria-label="닫기"
                    onClick={() => setShowNewModal(false)}
                  >
                    ×
                  </button>
                </header>

                <label htmlFor="title">문의 제목</label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  value={newForm.title}
                  onChange={handleNewFormChange}
                  placeholder="문의 제목을 입력하세요"
                  required
                />

                <label htmlFor="customer">고객사</label>
                <input
                  type="text"
                  id="customer"
                  name="customer"
                  value={newForm.customer}
                  onChange={handleNewFormChange}
                  required
                  placeholder="고객사를 입력하세요"
                />


                <label htmlFor="category">문의 유형</label>
                <select
                  id="category"
                  name="category"
                  value={newForm.category}
                  onChange={handleNewFormChange}
                  required
                >
                  <option value="">문의 유형을 선택하세요</option>
                  {categories
                    .filter((c) => c !== "전체")
                    .map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                </select>

                <label htmlFor="inquiryContent">문의 내용</label>
                <textarea
                  id="inquiryContent"
                  name="inquiryContent"
                  value={newForm.inquiryContent}
                  onChange={handleNewFormChange}
                  placeholder="문의 내용을 작성해 주세요"
                  rows={5}
                  required
                />

                <label htmlFor="fileUpload">첨부 파일 (선택 사항)</label>
                <input
                  id="fileUpload"
                  name="fileUpload"
                  type="file"
                  accept=".jpg,.jpeg,.pdf"
                  onChange={handleNewFormChange}
                />

                <footer className="modal-footer">
                  <button
                    type="button"
                    className="btn cancel-btn"
                    onClick={() => setShowNewModal(false)}
                  >
                    취소
                  </button>
                  <button type="submit" className="btn submit-btn">
                    문의 제출
                  </button>
                </footer>
              </form>
            </div>
          )}

          {confirmDeleteId !== null && (
            <div
              className="modal-backdrop"
              role="dialog"
              aria-modal="true"
              onClick={() => setConfirmDeleteId(null)}
            >
              <div
                className="modal confirm-delete-modal"
                onClick={(e) => e.stopPropagation()}
              >
                <header>
                  <h2>문의 삭제</h2>
                  <button
                    type="button"
                    className="close-btn"
                    aria-label="닫기"
                    onClick={() => setConfirmDeleteId(null)}
                  >
                    ×
                  </button>
                </header>
                <p>"{deletingTitle}" 정말로 삭제하시겠습니까?</p>
                <footer className="modal-footer">
                  <button
                    className="btn cancel-btn"
                    onClick={() => setConfirmDeleteId(null)}
                  >
                    취소
                  </button>
                  <button className="btn delete-btn" onClick={confirmDelete}>
                    삭제
                  </button>
                </footer>
              </div>
            </div>
          )}
        </section>
      </main>
    </>
  );
}
