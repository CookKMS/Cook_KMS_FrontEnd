import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import "../styles/MyInquiriesPage.css";

// ✅ [현재는 개발 중 더미 데이터 사용 중, 실제 연동 시 주석 처리 가능]
import { inquiryData as dummyData } from "../data/inquiryData";

// 문의 카테고리 목록
const categories = ["전체", "새 기능", "수정", "버그", "문의", "장애", "긴급 지원"];

export default function MyInquiriesPage() {
  // 🔹 문의 목록 상태
  const [inquiries, setInquiries] = useState([]);

  // 🔹 카드 확장 상태
  const [expandedId, setExpandedId] = useState(null);

  // 🔹 작성 모달 / 삭제 모달 상태
  const [showNewModal, setShowNewModal] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  // 🔹 검색/필터/페이지
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("전체");
  const [currentPage, setCurrentPage] = useState(1);
  const inquiriesPerPage = 5;

  // 🔹 새 문의 작성 상태
  const [newForm, setNewForm] = useState({
    title: "",
    category: "",
    customer: "",
    inquiryContent: "",
    file: null,
  });

  // ✅ [Flask 연동] 문의 목록 불러오기 - GET /api/inquiries
  useEffect(() => {
    // 실제 연동 시 이 부분을 사용
    /*
    fetch("/api/inquiries")
      .then(res => res.json())
      .then(data => setInquiries(data));
    */

    // 지금은 더미 데이터 사용
    setInquiries(dummyData);
  }, []);

  // 🔍 검색 + 필터 적용된 문의 리스트
  const filtered = inquiries.filter(item => {
    const matchCategory = filter === "전체" || item.category === filter;
    const matchKeyword =
      item.title.includes(search) ||
      item.inquiryContent.includes(search) ||
      (item.answerContent || "").includes(search);
    return matchCategory && matchKeyword;
  });

  const totalPages = Math.ceil(filtered.length / inquiriesPerPage);
  const paged = filtered.slice(
    (currentPage - 1) * inquiriesPerPage,
    currentPage * inquiriesPerPage
  );

  // 📌 카드 펼치기 토글
  const toggleExpand = (id) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  // 🔧 새 문의 작성 시 입력 처리
  const handleNewFormChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "fileUpload") {
      setNewForm(prev => ({ ...prev, file: files[0] || null }));
    } else {
      setNewForm(prev => ({ ...prev, [name]: value }));
    }
  };

  // ✅ [Flask 연동] POST /api/inquiries
  const submitNewInquiry = async (e) => {
    e.preventDefault();
    const { title, category, customer, inquiryContent, file } = newForm;

    if (!title || !category || !customer || !inquiryContent) {
      alert("모든 항목을 입력해주세요.");
      return;
    }

    try {
      // 🔽 실제 Flask 서버와 연동 시 FormData로 전송
      /*
      const formData = new FormData();
      formData.append("title", title);
      formData.append("category", category);
      formData.append("customer", customer);
      formData.append("inquiryContent", inquiryContent);
      if (file) formData.append("file", file);

      await fetch("/api/inquiries", {
        method: "POST",
        body: formData
      });

      const newItemFromServer = await res.json();
      setInquiries(prev => [newItemFromServer, ...prev]);
      */

      // 🔧 지금은 더미 방식으로 추가
      const newItem = {
        id: Date.now(),
        title,
        category,
        customer,
        inquiryContent,
        answerContent: "",
        answerStatus: "답변 대기",
        date: new Date().toISOString().slice(0, 10).replace(/-/g, "."),
        attachment: file ? { name: file.name, url: "#" } : null,
      };

      setInquiries(prev => [newItem, ...prev]);
      setShowNewModal(false);
      setNewForm({ title: "", category: "", customer: "", inquiryContent: "", file: null });
      setCurrentPage(1);
    } catch (err) {
      console.error("등록 실패:", err);
      alert("문의 등록 중 오류 발생");
    }
  };

  // ✅ [Flask 연동] DELETE /api/inquiries/:id
  const handleDelete = async (id) => {
    try {
      /*
      await fetch(`/api/inquiries/${id}`, { method: "DELETE" });
      */
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

          {/* 🔍 검색 + 작성 버튼 */}
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
                      {item.attachment && (
                        <a href={item.attachment.url} target="_blank" rel="noreferrer">
                          📎 {item.attachment.name}
                        </a>
                      )}
                      <time className="content-date">{item.date}</time>
                    </div>
                    {item.answerContent ? (
                      <div className="answer-section">
                        <strong>제조사 답변</strong>
                        <p>{item.answerContent}</p>
                      </div>
                    ) : (
                      <div className="pending-answer-notice">
                        <i>ℹ️</i> 현재 문의 내용을 검토 중입니다.
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
