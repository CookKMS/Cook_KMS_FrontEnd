import React, { useEffect, useState } from "react";
import axios from "../utils/axiosInstance";
import Header from "../components/Header";
import "../styles/MyInquiriesPage.css";

const categories = ["전체", "새 기능", "수정", "버그", "문의", "장애", "긴급 지원"];

export default function MyInquiriesPage() {
  const [inquiries, setInquiries] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [showNewModal, setShowNewModal] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("전체");
  const [currentPage, setCurrentPage] = useState(1);
  const inquiriesPerPage = 5;

  const [newForm, setNewForm] = useState({
    title: "",
    category: "",
    customer: "",
    inquiryContent: "",
    file: null,
  });

  // ✅ 나의 문의 내역 불러오기
  const fetchInquiries = async () => {
    try {
      const res = await axios.get("/my/inquiries");
      setInquiries(res.data.data);
    } catch (err) {
      console.error("나의 문의 불러오기 실패:", err);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  // ✅ 문의 등록
  const submitNewInquiry = async (e) => {
    e.preventDefault();
    const { title, category, customer, inquiryContent, file } = newForm;

    if (!title || !category || !customer || !inquiryContent) {
      alert("모든 항목을 입력해주세요.");
      return;
    }

    try {
      let file_id = null;
      if (file && file.size > 0) {
        const formData = new FormData();
        formData.append("file", file);

        const uploadRes = await axios.post("/file/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        file_id = uploadRes.data.file_id;
      }

      const payload = {
        title,
        content: inquiryContent,
        category,
        file_path: file_id ? `/api/file/download/${file_id}` : null,
      };

      await axios.post("/inquiry", payload);
      alert("문의가 등록되었습니다.");
      setShowNewModal(false);
      setNewForm({ title: "", category: "", customer: "", inquiryContent: "", file: null });
      fetchInquiries(); // 목록 갱신
    } catch (error) {
      console.error("문의 등록 실패:", error);
      alert("등록 중 오류가 발생했습니다.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/my/inquiries/${id}`);
      alert("문의가 삭제되었습니다.");
      setConfirmDeleteId(null);
      fetchInquiries(); // 목록 갱신
    } catch (err) {
      console.error("삭제 실패:", err);
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  const handleNewFormChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "fileUpload") {
      setNewForm(prev => ({ ...prev, file: files[0] || null }));
    } else {
      setNewForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const filtered = inquiries.filter(item => {
    const matchCategory = filter === "전체" || item.category === filter;
    const matchKeyword =
      (item.title || "").includes(search) ||
      (item.content || "").includes(search) ||
      (item.answer || "").includes(search);
    return matchCategory && matchKeyword;
  });

  const totalPages = Math.ceil(filtered.length / inquiriesPerPage);
  const paged = filtered.slice(
    (currentPage - 1) * inquiriesPerPage,
    currentPage * inquiriesPerPage
  );

  const toggleExpand = (id) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  return (
    <>
      <Header />
      {/* 이하 동일 - 목록 표시, 모달, 삭제 확인 등 */}
      <main className="container">
        <section>
          <hgroup>
            <h2>고객사 문의</h2>
            <h3>제조사에 문의하고 답변을 확인할 수 있는 공간입니다</h3>
          </hgroup>

          {/* 검색 + 작성 */}
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

          {/* 카테고리 필터 */}
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

          {/* 문의 목록 */}
          <div className="inquiry-header">
            <h3>나의 문의 내역</h3>
            <span>총 {filtered.length}건</span>
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
                      <span className={`answer-status ${item.status === "02" ? "answered" : "pending"}`}>
                        {item.status === "02" ? "답변 완료" : "답변 대기"}
                      </span>
                    </div>
                    <h4 className="card-title">{item.title}</h4>
                  </div>
                  <div className="right-group">
                    <time>{item.created_at?.slice(0, 10).replace(/-/g, ".")}</time>
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
                      <p>{item.content}</p>
                      {item.file_path && (
                        <a href={item.file_path} target="_blank" rel="noreferrer">
                          📎 첨부파일 다운로드
                        </a>
                      )}
                      <time className="content-date">{item.created_at?.slice(0, 10).replace(/-/g, ".")}</time>
                    </div>
                    {item.comments && item.comments.length > 0 ? (
                      <div className="answer-section">
                        <strong>답변</strong>
                        <p>{item.comments[0].content}</p>
                      </div>
                    ) : (
                      <div className="pending-answer-notice">
                        답변을 기다리는 중입니다.
                      </div>
                    )}
                  </section>
                )}
              </article>
            ))}
          </div>

          {/* 페이지네이션 */}
          {totalPages > 1 && (
            <nav className="pagination">
              <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>
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
              <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>
                &gt;
              </button>
            </nav>
          )}
        </section>
      </main>

      {/* 작성 모달 */}
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
              {categories.filter(c => c !== "전체").map(cat => (
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

      {/* 삭제 확인 모달 */}
      {confirmDeleteId && (
        <div className="modal-backdrop" onClick={() => setConfirmDeleteId(null)}>
          <div className="modal confirm" onClick={(e) => e.stopPropagation()}>
            <h3>삭제 확인</h3>
            <p>정말로 삭제하시겠습니까?</p>
            <div className="modal-footer">
              <button onClick={() => setConfirmDeleteId(null)}>취소</button>
              <button onClick={() => handleDelete(confirmDeleteId)}>삭제</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
