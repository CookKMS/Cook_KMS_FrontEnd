// src/pages/employee/EmployeeInquiriesPage.js

import React, { useEffect, useState } from "react";
import EmployeeHeader from "./EmployeeHeader";
import "../../styles/MyInquiriesPage.css";
import axios from "../../utils/axiosInstance"; // ✅ axios 인스턴스

const categories = ["전체", "새 기능", "수정", "버그", "문의", "장애", "긴급 지원"];

export default function EmployeeInquiriesPage() {
  const [inquiries, setInquiries] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("전체");
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedId, setExpandedId] = useState(null);
  const [showNewModal, setShowNewModal] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const inquiriesPerPage = 5;

  const [newForm, setNewForm] = useState({
    title: "",
    category: "",
    customer: "",
    inquiryContent: "",
    file: null,
  });

  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        const res = await axios.get("/my/inquiries");
        setInquiries(res.data.data);
      } catch (err) {
        console.error("내 문의 내역 불러오기 실패:", err);
      }
    };
    fetchInquiries();
  }, []);

  const filtered = inquiries.filter(item => {
    const categoryMatch = filter === "전체" || item.category === filter;
    const searchMatch =
      item.title.includes(search) ||
      item.content.includes(search) ||
      (item.answer || "").includes(search);
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
    const { title, category, customer, inquiryContent, file } = newForm;

    if (!title || !category || !customer || !inquiryContent) {
      alert("모든 항목을 입력해주세요.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("category", category);
      formData.append("customer", customer);
      formData.append("content", inquiryContent);
      if (file) formData.append("file", file);

      await axios.post("/inquiry", formData);
      alert("문의가 등록되었습니다.");
      setShowNewModal(false);
      window.location.reload();
    } catch (err) {
      console.error("문의 등록 실패:", err);
      alert("문의 등록 중 오류가 발생했습니다.");
    }
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`/inquiry/${confirmDeleteId}`);
      setInquiries(prev => prev.filter(i => i.id !== confirmDeleteId));
    } catch (err) {
      console.error("삭제 실패:", err);
    } finally {
      setConfirmDeleteId(null);
    }
  };

  const deletingItem = inquiries.find(i => i.id === confirmDeleteId);

  return (
    <>
      <EmployeeHeader />
      <main className="container">
        <section>
          <hgroup>
            <h2>내 문의 내역</h2>
            <h3>직원 본인이 등록한 문의를 확인할 수 있습니다.</h3>
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
            />
            <button className="btn" onClick={() => setShowNewModal(true)}>
              + 문의 작성
            </button>
          </div>

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

          <div className="inquiry-header">
            <h3>총 {filtered.length}건</h3>
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
                    <time>{item.created_at}</time>
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
                      <p>{item.content}</p>
                      <time>{item.created_at}</time>
                    </div>
                    {item.answer ? (
                      <div className="answer-section">
                        <strong>답변</strong>
                        <p>{item.answer}</p>
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

      {showNewModal && (
        <div className="modal-backdrop" onClick={() => setShowNewModal(false)}>
          <form
            className="modal new-inquiry-modal"
            onClick={(e) => e.stopPropagation()}
            onSubmit={submitNewInquiry}
          >
            <header>
              <h2>문의 작성</h2>
              <button type="button" className="close-btn" onClick={() => setShowNewModal(false)}>×</button>
            </header>

            <label>제목</label>
            <input name="title" value={newForm.title} onChange={handleNewFormChange} required />

            <label>고객사</label>
            <input name="customer" value={newForm.customer} onChange={handleNewFormChange} required />

            <label>카테고리</label>
            <select name="category" value={newForm.category} onChange={handleNewFormChange} required>
              <option value="">카테고리 선택</option>
              {categories.filter(c => c !== "전체").map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            <label>문의 내용</label>
            <textarea name="inquiryContent" rows={5} value={newForm.inquiryContent} onChange={handleNewFormChange} required />

            <label>첨부 파일</label>
            <input name="fileUpload" type="file" onChange={handleNewFormChange} accept=".pdf,.jpg,.jpeg" />

            <footer className="modal-footer">
              <button type="button" className="btn cancel-btn" onClick={() => setShowNewModal(false)}>취소</button>
              <button type="submit" className="btn submit-btn">제출</button>
            </footer>
          </form>
        </div>
      )}

      {confirmDeleteId && (
        <div className="modal-backdrop" onClick={() => setConfirmDeleteId(null)}>
          <div className="modal confirm-delete-modal" onClick={(e) => e.stopPropagation()}>
            <h3>문의 삭제</h3>
            <p>"{deletingItem?.title}" 항목을 삭제하시겠습니까?</p>
            <footer className="modal-footer">
              <button className="btn cancel-btn" onClick={() => setConfirmDeleteId(null)}>취소</button>
              <button className="btn delete-btn" onClick={confirmDelete}>삭제</button>
            </footer>
          </div>
        </div>
      )}
    </>
  );
}
