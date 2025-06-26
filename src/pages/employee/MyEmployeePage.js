// src/pages/employee/MyEmployeePage.js

import React, { useEffect, useState } from "react";
import EmployeeHeader from "./EmployeeHeader";
import "../../styles/MyEmployeePage.css";

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
  const token = localStorage.getItem("token");

  // ✅ 데이터 불러오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res1 = await fetch("http://<EC2-IP>:5000/api/my/inquiries", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const res2 = await fetch("http://<EC2-IP>:5000/api/my/knowledge", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data1 = await res1.json();
        const data2 = await res2.json();
        setInquiries(data1.data || []);
        setKnowledgeList(data2.data || []);
      } catch (err) {
        alert("데이터 불러오기 실패");
        console.error(err);
      }
    };
    fetchData();
  }, []);

  // ✅ 삭제
  const handleDeleteInquiry = async () => {
    try {
      await fetch(`http://<EC2-IP>:5000/api/inquiry/${confirmDeleteInquiryId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setInquiries(prev => prev.filter(q => q.id !== confirmDeleteInquiryId));
    } catch {
      alert("삭제 실패");
    }
    setConfirmDeleteInquiryId(null);
  };

  const handleDeleteKnowledge = async () => {
    try {
      await fetch(`http://<EC2-IP>:5000/api/knowledge/${confirmDeleteKnowledgeId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setKnowledgeList(prev => prev.filter(k => k.id !== confirmDeleteKnowledgeId));
    } catch {
      alert("삭제 실패");
    }
    setConfirmDeleteKnowledgeId(null);
  };

  // ✅ 수정
  const handleEditSave = async (e) => {
    e.preventDefault();
    const form = e.target;
    const updated = {
      title: form.title.value,
      category: form.category.value,
      content: form.inquiryContent.value,
    };

    try {
      await fetch(`http://<EC2-IP>:5000/api/inquiry/${editingItem.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updated),
      });
      setInquiries(prev =>
        prev.map(q => (q.id === editingItem.id ? { ...q, ...updated } : q))
      );
    } catch {
      alert("문의 수정 실패");
    }
    setEditingItem(null);
  };

  const handleEditKnowledgeSave = async (e) => {
    e.preventDefault();
    const form = e.target;
    const updated = {
      title: form.title.value,
      category: form.category.value,
      summary: form.summary.value,
    };

    try {
      await fetch(`http://<EC2-IP>:5000/api/knowledge/${editingKnowledge.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updated),
      });
      setKnowledgeList(prev =>
        prev.map(k => (k.id === editingKnowledge.id ? { ...k, ...updated } : k))
      );
    } catch {
      alert("지식 문서 수정 실패");
    }
    setEditingKnowledge(null);
  };

  // ✅ 페이지네이션 계산
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
                      <span className={`answer-status ${item.status === "02" ? "answered" : "pending"}`}>
                        {item.status === "02" ? "답변 완료" : "답변 대기"}
                      </span>
                    </div>
                    <h4>{item.title}</h4>
                  </div>
                  <div className="right-group">
                    <time>{item.created_at}</time>
                    <button onClick={(e) => { e.stopPropagation(); setConfirmDeleteInquiryId(item.id); }}>🗑️</button>
                    <button onClick={(e) => { e.stopPropagation(); setEditingItem(item); }}>✏️</button>
                  </div>
                </header>
                {expandedInquiryId === item.id && (
                  <section className="card-details">
                    <p>{item.content}</p>
                    {item.answer && (
                      <div className="answer-section">
                        <strong>답변</strong>
                        <p>{item.answer}</p>
                      </div>
                    )}
                  </section>
                )}
              </article>
            ))}
          </div>
          {/* 문의 페이지네이션 */}
          {inquiryPages > 1 && (
            <nav className="pagination">
              {Array.from({ length: inquiryPages }).map((_, i) => (
                <button
                  key={i}
                  className={currentInquiryPage === i + 1 ? "active" : ""}
                  onClick={() => setCurrentInquiryPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
            </nav>
          )}
        </section>

        {/* 🔶 지식 문서 내역 */}
        <section>
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
                    <h4>{item.title}</h4>
                  </div>
                  <div className="right-group">
                    <time>{item.created_at}</time>
                    <button onClick={(e) => { e.stopPropagation(); setConfirmDeleteKnowledgeId(item.id); }}>🗑️</button>
                    <button onClick={(e) => { e.stopPropagation(); setEditingKnowledge(item); }}>✏️</button>
                  </div>
                </header>
                {expandedKnowledgeId === item.id && (
                  <section className="card-details">
                    <p>{item.summary}</p>
                  </section>
                )}
              </article>
            ))}
          </div>
          {/* 지식 페이지네이션 */}
          {knowledgePages > 1 && (
            <nav className="pagination">
              {Array.from({ length: knowledgePages }).map((_, i) => (
                <button
                  key={i}
                  className={currentKnowledgePage === i + 1 ? "active" : ""}
                  onClick={() => setCurrentKnowledgePage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
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
