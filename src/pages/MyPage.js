import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import "../styles/MyInquiriesPage.css"; // 카드 스타일, 모달 등 그대로 재활용

export default function MyPage() {
  const [inquiries, setInquiries] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const inquiriesPerPage = 5;

  // ✅ [Flask 연동] GET /api/my-inquiries
  useEffect(() => {
    const fetchMyInquiries = async () => {
      try {
        // const res = await fetch("/api/my-inquiries");
        // const data = await res.json();
        // setInquiries(data);

        // 테스트용 더미 데이터 20개 삽입
        const dummyData = [...Array(20)].map((_, i) => ({
          id: i + 1,
          title: `테스트 문의 제목 ${i + 1}`,
          category: ["문의", "버그", "장애", "수정", "새 기능", "긴급 지원"][i % 6],
          customer: `고객사 ${String.fromCharCode(65 + (i % 5))}`,
          inquiryContent: `이것은 ${i + 1}번째 문의의 본문 내용입니다.`,
          answerStatus: i % 3 === 0 ? "답변 완료" : "답변 대기",
          answerContent: i % 3 === 0 ? "이 문의에 대한 답변입니다." : "",
          date: `2023.08.${(i % 30 + 1).toString().padStart(2, "0")}`,
        }));
        setInquiries(dummyData);
      } catch (err) {
        console.error("나의 문의 불러오기 실패:", err);
      }
    };
    fetchMyInquiries();
  }, []);

  const totalPages = Math.ceil(inquiries.length / inquiriesPerPage);
  const paged = inquiries.slice(
    (currentPage - 1) * inquiriesPerPage,
    currentPage * inquiriesPerPage
  );

  const toggleExpand = (id) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  // ✅ [Flask 연동] DELETE /api/inquiries/:id
  const handleDelete = async (id) => {
    try {
      // await fetch(`/api/inquiries/${id}`, { method: "DELETE" });
      setInquiries(prev => prev.filter(q => q.id !== id));
      setConfirmDeleteId(null);
      if (expandedId === id) setExpandedId(null);
    } catch {
      alert("삭제 실패");
    }
  };

  // ✅ [Flask 연동] PUT /api/inquiries/:id
  const handleEditSave = async (e) => {
    e.preventDefault();
    const form = e.target;
    const updated = {
      ...editingItem,
      title: form.title.value,
      category: form.category.value,
      inquiryContent: form.inquiryContent.value,
    };

    try {
      // await fetch(`/api/inquiries/${editingItem.id}`, {
      //   method: "PUT",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(updated),
      // });

      setInquiries(prev =>
        prev.map((q) => (q.id === updated.id ? updated : q))
      );
      setEditingItem(null);
    } catch {
      alert("수정 실패");
    }
  };

  return (
    <>
      <Header />
      <main className="container">
        <section>
          <hgroup>
            <h2>나의 문의 내역</h2>
            <h3>본인이 작성한 문의를 확인하고 수정/삭제할 수 있습니다.</h3>
          </hgroup>

          <div className="inquiry-list">
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
                    <time>{item.date}</time>
                    {item.answerStatus !== "답변 완료" ? (
                      <>
                        <button className="btn-delete" onClick={(e) => {
                          e.stopPropagation();
                          setConfirmDeleteId(item.id);
                        }}>🗑️</button>
                        <button className="btn-edit" onClick={(e) => {
                          e.stopPropagation();
                          setEditingItem(item);
                        }}>✏️</button>
                      </>
                    ) : (
                      <>
                        <button className="btn-disabled" disabled title="답변 완료된 문의는 삭제할 수 없습니다.">🗑️</button>
                        <button className="btn-disabled" disabled title="답변 완료된 문의는 수정할 수 없습니다.">✏️</button>
                      </>
                    )}
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
                        <strong>답변</strong>
                        <time className="answer-date">{item.date}</time>
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

          {/* ✅ 페이지네이션 */}
          {totalPages > 1 && (
            <nav className="pagination" aria-label="페이지 이동">
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

          {/* ✅ 수정 모달 */}
          {editingItem && (
            <div className="modal-backdrop" onClick={() => setEditingItem(null)}>
              <form className="modal" onClick={(e) => e.stopPropagation()} onSubmit={handleEditSave}>
                <h3>문의 수정</h3>
                <label>
                  제목
                  <input name="title" defaultValue={editingItem.title} required />
                </label>
                <label>
                  카테고리
                  <select name="category" defaultValue={editingItem.category} required>
                    <option value="문의">문의</option>
                    <option value="버그">버그</option>
                    <option value="장애">장애</option>
                    <option value="수정">수정</option>
                    <option value="새 기능">새 기능</option>
                    <option value="긴급 지원">긴급 지원</option>
                  </select>
                </label>
                <label>
                  문의 내용
                  <textarea name="inquiryContent" rows={5} defaultValue={editingItem.inquiryContent} required />
                </label>
                <div className="modal-footer">
                  <button type="button" onClick={() => setEditingItem(null)}>취소</button>
                  <button type="submit">저장</button>
                </div>
              </form>
            </div>
          )}

          {/* ✅ 삭제 확인 모달 */}
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
        </section>
      </main>
    </>
  );
}
