// src/pages/employee/MyEmployeePage.js
import React, { useEffect, useState } from "react";
import EmployeeHeader from "./EmployeeHeader";
import "../../styles/MyInquiriesPage.css";
import { inquiryData } from "../../data/inquiryData"; // ✅ 통일된 데이터 import

const categories = ["전체", "새 기능", "수정", "버그", "문의", "장애", "긴급 지원"];

export default function MyEmployeePage() {
  const [inquiries, setInquiries] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("전체");
  const [currentPage, setCurrentPage] = useState(1);
  const inquiriesPerPage = 5;
  const [expandedId, setExpandedId] = useState(null);
  const [showNewModal, setShowNewModal] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const deletingItem = inquiries.find(item => item.id === confirmDeleteId);

  const [newForm, setNewForm] = useState({
    title: "",
    category: "",
    customer: "",
    inquiryContent: "",
    file: null,
  });

  // ✅ 초기 데이터 불러오기 (공통 데이터 사용)
  useEffect(() => {
    setInquiries(inquiryData);
  }, []);

  useEffect(() => {
    const dummyData = [
      {
        id: 1,
        title: "장비 점검 요청",
        category: "문의",
        customer: "내부팀",
        inquiryContent: "정기 점검 스케줄을 알고 싶습니다.",
        answerContent: "월 1회 자동 점검됩니다.",
        answerStatus: "답변 완료",
        date: "2024.01.01",
      },
      {
        id: 2,
        title: "로그인 실패",
        category: "버그",
        customer: "내부팀",
        inquiryContent: "아이디 비밀번호가 맞는데도 로그인 안 됩니다.",
        answerContent: "",
        answerStatus: "답변 대기",
        date: "2024.01.02",
      },
    ];
    setInquiries(dummyData);
  }, []);

  const filtered = inquiries.filter(item => {
    const categoryMatch = filter === "전체" || item.category === filter;
    const searchMatch =
      item.title.includes(search) ||
      item.inquiryContent.includes(search) ||
      item.answerContent.includes(search || "");
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
      alert("모든 필드를 입력해주세요.");
      return;
    }

    const created = {
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

    setInquiries(prev => [created, ...prev]);
    setShowNewModal(false);
    setNewForm({ title: "", category: "", customer: "", inquiryContent: "", file: null });
    setCurrentPage(1);
  };

  const confirmDelete = () => {
    setInquiries(prev => prev.filter(item => item.id !== confirmDeleteId));
    setConfirmDeleteId(null);
    if (expandedId === confirmDeleteId) setExpandedId(null);
  };

  return (
    <>
      <EmployeeHeader />
      <main className="container">
        <section>
          <hgroup>
            <h2>문의 내역</h2>
            <h3>사원이 등록한 문의를 확인할 수 있습니다</h3>
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

          <div className="filter-buttons" role="list">
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
            <h3>내 문의 내역</h3>
            <span>총 {filtered.length}건</span>
          </div>

          <div className="inquiry-list">
            {paged.map(item => (
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
                    <h4>{item.title}</h4>
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
                        <strong>답변</strong>
                        <p>{item.answerContent}</p>
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
          <form
            className="modal new-inquiry-modal"
            onClick={(e) => e.stopPropagation()}
            onSubmit={submitNewInquiry}
          >
            <header>
              <h2>문의 작성</h2>
              <button
                type="button"
                className="close-btn"
                onClick={() => setShowNewModal(false)}
              >
                ×
              </button>
            </header>

            <label htmlFor="title">제목</label>
            <input id="title" name="title" value={newForm.title} onChange={handleNewFormChange} required />

            <label htmlFor="customer">고객사</label>
            <input id="customer" name="customer" value={newForm.customer} onChange={handleNewFormChange} required />

            <label htmlFor="category">카테고리</label>
            <select id="category" name="category" value={newForm.category} onChange={handleNewFormChange} required>
              <option value="">카테고리 선택</option>
              {categories.filter(c => c !== "전체").map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            <label htmlFor="inquiryContent">문의 내용</label>
            <textarea id="inquiryContent" name="inquiryContent" rows={5} value={newForm.inquiryContent} onChange={handleNewFormChange} required />

            <label htmlFor="fileUpload">첨부 파일</label>
            <input id="fileUpload" name="fileUpload" type="file" onChange={handleNewFormChange} accept=".pdf,.jpg,.jpeg" />

            <footer className="modal-footer">
              <button type="button" className="btn cancel-btn" onClick={() => setShowNewModal(false)}>취소</button>
              <button type="submit" className="btn submit-btn">제출</button>
            </footer>
          </form>
        </div>
      )}

      {/* 삭제 모달 */}
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
