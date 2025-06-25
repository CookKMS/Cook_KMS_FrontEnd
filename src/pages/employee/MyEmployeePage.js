import React, { useEffect, useState } from "react";
import EmployeeHeader from "./EmployeeHeader";
import "../../styles/MyEmployeePage.css";
import { inquiryData } from "../../data/inquiryData";
import { knowledgeData } from "../../data/knowledgeData";

export default function MyEmployeePage() {
  const [inquiries, setInquiries] = useState([]);
  const [knowledgeList, setKnowledgeList] = useState([]);

  const [expandedInquiryId, setExpandedInquiryId] = useState(null);
  const [expandedKnowledgeId, setExpandedKnowledgeId] = useState(null);
  const [confirmDeleteInquiryId, setConfirmDeleteInquiryId] = useState(null);
  const [confirmDeleteKnowledgeId, setConfirmDeleteKnowledgeId] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [editingKnowledge, setEditingKnowledge] = useState(null);

  const [currentInquiryPage, setCurrentInquiryPage] = useState(1);
  const [currentKnowledgePage, setCurrentKnowledgePage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const mapped = inquiryData.map(item => ({
      id: item.id,
      title: item.subject,
      customer: item.manufacturer,
      category: item.category,
      answerStatus: item.status,
      date: item.date,
      inquiryContent: item.message,
      answerContent: item.response
    }));
    setInquiries(mapped);
    setKnowledgeList(knowledgeData);
  }, []);

  const handleDeleteInquiry = () => {
    setInquiries(prev => prev.filter(q => q.id !== confirmDeleteInquiryId));
    setConfirmDeleteInquiryId(null);
  };

  const handleDeleteKnowledge = () => {
    setKnowledgeList(prev => prev.filter(k => k.id !== confirmDeleteKnowledgeId));
    setConfirmDeleteKnowledgeId(null);
  };

  const handleEditSave = (e) => {
    e.preventDefault();
    const form = e.target;
    const updated = {
      ...editingItem,
      title: form.title.value,
      category: form.category.value,
      inquiryContent: form.inquiryContent.value,
    };
    setInquiries(prev => prev.map(q => (q.id === updated.id ? updated : q)));
    setEditingItem(null);
  };

  const handleEditKnowledgeSave = (e) => {
    e.preventDefault();
    const form = e.target;
    const updated = {
      ...editingKnowledge,
      title: form.title.value,
      category: form.category.value,
      summary: form.summary.value,
    };
    setKnowledgeList(prev => prev.map(k => (k.id === updated.id ? updated : k)));
    setEditingKnowledge(null);
  };

  const pagedInquiries = inquiries.slice((currentInquiryPage - 1) * itemsPerPage, currentInquiryPage * itemsPerPage);
  const pagedKnowledge = knowledgeList.slice((currentKnowledgePage - 1) * itemsPerPage, currentKnowledgePage * itemsPerPage);
  const inquiryPages = Math.ceil(inquiries.length / itemsPerPage);
  const knowledgePages = Math.ceil(knowledgeList.length / itemsPerPage);

  return (
    <>
      <EmployeeHeader />
      <main className="container">

        {/* 🔷 문의 내역 */}
        <section>
          <hgroup>
            <h2>나의 문의 내역</h2>
            <h3>직원이 등록한 문의를 확인하고 수정/삭제할 수 있습니다.</h3>
          </hgroup>

          <div className="inquiry-list">
            {pagedInquiries.map(item => (
              <article
                key={item.id}
                className={`inquiry-card ${expandedInquiryId === item.id ? "expanded" : ""}`}
                onClick={() => setExpandedInquiryId(prev => prev === item.id ? null : item.id)}
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
                    {item.answerStatus === "답변 대기" ? (
                      <>
                        <button className="btn-delete" onClick={(e) => {
                          e.stopPropagation();
                          setConfirmDeleteInquiryId(item.id);
                        }}>🗑️</button>
                        <button className="btn-edit" onClick={(e) => {
                          e.stopPropagation();
                          setEditingItem(item);
                        }}>✏️</button>
                      </>
                    ) : (
                      <>
                        <button className="btn-disabled" disabled>🗑️</button>
                        <button className="btn-disabled" disabled>✏️</button>
                      </>
                    )}
                  </div>
                </header>
                {expandedInquiryId === item.id && (
                  <section className="card-details">
                    <strong>문의 내용</strong>
                    <p>{item.inquiryContent}</p>
                    {item.answerContent && (
                      <div className="answer-section">
                        <strong>답변</strong>
                        <p>{item.answerContent}</p>
                      </div>
                    )}
                  </section>
                )}
              </article>
            ))}
          </div>

          {inquiryPages > 1 && (
            <nav className="pagination">
              <button onClick={() => setCurrentInquiryPage(p => Math.max(1, p - 1))} disabled={currentInquiryPage === 1}>&lt;</button>
              {Array.from({ length: inquiryPages }).map((_, i) => (
                <button
                  key={i}
                  className={currentInquiryPage === i + 1 ? "active" : ""}
                  onClick={() => setCurrentInquiryPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
              <button onClick={() => setCurrentInquiryPage(p => Math.min(inquiryPages, p + 1))} disabled={currentInquiryPage === inquiryPages}>&gt;</button>
            </nav>
          )}
        </section>

        {/* 🔶 지식 문서 섹션 */}
        <section style={{ marginTop: "3rem" }}>
          <hgroup>
            <h2>나의 지식 문서</h2>
            <h3>직원이 작성한 문서를 확인하고 수정/삭제할 수 있습니다.</h3>
          </hgroup>

          <div className="inquiry-list">
            {pagedKnowledge.map(item => (
              <article
                key={item.id}
                className={`inquiry-card ${expandedKnowledgeId === item.id ? "expanded" : ""}`}
                onClick={() => setExpandedKnowledgeId(prev => prev === item.id ? null : item.id)}
              >
                <header className="card-header">
                  <div className="left-group">
                    <span className="category-tag">{item.category}</span>
                    <h4 className="card-title">{item.title}</h4>
                  </div>
                  <div className="right-group">
                    <time>{item.date}</time>
                    <button className="btn-delete" onClick={(e) => {
                      e.stopPropagation();
                      setConfirmDeleteKnowledgeId(item.id);
                    }}>🗑️</button>
                    <button className="btn-edit" onClick={(e) => {
                      e.stopPropagation();
                      setEditingKnowledge(item);
                    }}>✏️</button>
                  </div>
                </header>
                {expandedKnowledgeId === item.id && (
                  <section className="card-details">
                    <strong>요약 설명</strong>
                    <p>{item.summary}</p>
                  </section>
                )}
              </article>
            ))}
          </div>

          {knowledgePages > 1 && (
            <nav className="pagination">
              <button onClick={() => setCurrentKnowledgePage(p => Math.max(1, p - 1))} disabled={currentKnowledgePage === 1}>&lt;</button>
              {Array.from({ length: knowledgePages }).map((_, i) => (
                <button
                  key={i}
                  className={currentKnowledgePage === i + 1 ? "active" : ""}
                  onClick={() => setCurrentKnowledgePage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
              <button onClick={() => setCurrentKnowledgePage(p => Math.min(knowledgePages, p + 1))} disabled={currentKnowledgePage === knowledgePages}>&gt;</button>
            </nav>
          )}
        </section>
      </main>

      {/* ✅ 모든 모달 처리 */}
      {confirmDeleteInquiryId && (
        <div className="modal-backdrop" onClick={() => setConfirmDeleteInquiryId(null)}>
          <div className="modal confirm" onClick={(e) => e.stopPropagation()}>
            <h3>문의 삭제</h3>
            <p>정말로 삭제하시겠습니까?</p>
            <div className="modal-footer">
              <button onClick={() => setConfirmDeleteInquiryId(null)}>취소</button>
              <button onClick={handleDeleteInquiry}>삭제</button>
            </div>
          </div>
        </div>
      )}

      {confirmDeleteKnowledgeId && (
        <div className="modal-backdrop" onClick={() => setConfirmDeleteKnowledgeId(null)}>
          <div className="modal confirm" onClick={(e) => e.stopPropagation()}>
            <h3>지식 문서 삭제</h3>
            <p>정말로 삭제하시겠습니까?</p>
            <div className="modal-footer">
              <button onClick={() => setConfirmDeleteKnowledgeId(null)}>취소</button>
              <button onClick={handleDeleteKnowledge}>삭제</button>
            </div>
          </div>
        </div>
      )}

      {editingItem && (
        <div className="modal-backdrop" onClick={() => setEditingItem(null)}>
          <form className="modal confirm" onClick={(e) => e.stopPropagation()} onSubmit={handleEditSave}>
            <h3>문의 수정</h3>
            <label>제목</label>
            <input name="title" defaultValue={editingItem.title} required />
            <label>카테고리</label>
            <select name="category" defaultValue={editingItem.category} required>
              <option value="문의">문의</option>
              <option value="버그">버그</option>
              <option value="장애">장애</option>
              <option value="수정">수정</option>
              <option value="새 기능">새 기능</option>
              <option value="긴급 지원">긴급 지원</option>
            </select>
            <label>문의 내용</label>
            <textarea name="inquiryContent" rows={5} defaultValue={editingItem.inquiryContent} required />
            <div className="modal-footer">
              <button type="button" onClick={() => setEditingItem(null)}>취소</button>
              <button type="submit">저장</button>
            </div>
          </form>
        </div>
      )}

      {editingKnowledge && (
        <div className="modal-backdrop" onClick={() => setEditingKnowledge(null)}>
          <form className="modal confirm" onClick={(e) => e.stopPropagation()} onSubmit={handleEditKnowledgeSave}>
            <h3>지식 문서 수정</h3>
            <label>제목</label>
            <input name="title" defaultValue={editingKnowledge.title} required />
            <label>카테고리</label>
            <select name="category" defaultValue={editingKnowledge.category} required>
              <option value="새 기능">새 기능</option>
              <option value="수정">수정</option>
              <option value="버그">버그</option>
              <option value="문의">문의</option>
              <option value="장애">장애</option>
              <option value="긴급 지원">긴급 지원</option>
            </select>
            <label>요약 설명</label>
            <textarea name="summary" rows={4} defaultValue={editingKnowledge.summary} required />
            <div className="modal-footer">
              <button type="button" onClick={() => setEditingKnowledge(null)}>취소</button>
              <button type="submit">저장</button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
