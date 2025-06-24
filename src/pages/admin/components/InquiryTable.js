// src/pages/Admin/components/InquiryTable.js

import React, { useState, useEffect } from 'react';
import '../../../styles/Admin/InquiryTable.css';
import { inquiryData } from '../../../data/inquiryData';

export default function InquiryTable() {
  const [inquiries, setInquiries] = useState([]);
  const [filterStatus, setFilterStatus] = useState('전체');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [editingItem, setEditingItem] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const deletingItem = inquiries.find((i) => i.id === confirmDeleteId);

  useEffect(() => {
    setInquiries(inquiryData);
  }, []);

  const filtered = inquiries.filter((item) => {
    const matchStatus = filterStatus === '전체' || item.status === filterStatus;
    const matchSearch =
      item.manufacturer.includes(searchTerm) ||
      item.subject.includes(searchTerm) ||
      item.message.includes(searchTerm);
    return matchStatus && matchSearch;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSave = async (e) => {
    e.preventDefault();
    const form = e.target;
    const updated = {
      ...editingItem,
      status: form.status.value,
      response: form.response.value,
    };

    try {
      setInquiries((prev) =>
        prev.map((item) => (item.id === updated.id ? updated : item))
      );
      setEditingItem(null);
    } catch (error) {
      console.error('문의 수정 실패:', error);
    }
  };

  const handleDelete = async () => {
    try {
      setInquiries((prev) => prev.filter((item) => item.id !== confirmDeleteId));
      setConfirmDeleteId(null);
    } catch (error) {
      console.error('삭제 실패:', error);
    }
  };

  return (
    <div className="inquiry-table-wrapper">
      <div className="table-header">
        <h2>🛠️ 제조사 문의 관리</h2>
        <div className="table-controls">
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            {['전체', '답변 대기', '답변 완료'].map((status) => (
              <option key={status}>{status}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <table className="inquiry-table">
        <thead>
          <tr>
            <th>카테고리</th>
            <th>고객사</th>
            <th>제목</th>
            <th>상태</th>
            <th>등록일</th>
            <th>처리</th>
          </tr>
        </thead>
        <tbody>
          {paginated.map((item) => (
            <tr key={item.id}>
              <td>{item.category}</td>
              <td>{item.manufacturer}</td>
              <td>{item.subject}</td>
              <td>
                <span className={`badge ${item.status === '답변 완료' ? 'badge-done' : 'badge-pending'}`}>
                  {item.status}
                </span>
              </td>
              <td>{item.date}</td>
              <td>
                <button className="view" onClick={() => setEditingItem(item)}>
                  {item.status === '답변 완료' ? '답변 보기' : '답변 작성'}
                </button>
                <button className="delete" onClick={() => setConfirmDeleteId(item.id)}>🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        {Array.from({ length: totalPages }).map((_, i) => (
          <button
            key={i}
            className={currentPage === i + 1 ? 'active' : ''}
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* ✅ 수정 모달 (2열 레이아웃 적용) */}
      {editingItem && (
        <div className="modal-backdrop" onClick={() => setEditingItem(null)}>
          <form className="modal" onClick={(e) => e.stopPropagation()} onSubmit={handleSave}>
            <h3>문의 답변 수정</h3>

            <div className="modal-row"><label>카테고리</label><div className="input-area">{editingItem.category}</div></div>
            <div className="modal-row"><label>고객사</label><div className="input-area">{editingItem.manufacturer}</div></div>
            <div className="modal-row"><label>제목</label><div className="input-area"><strong>{editingItem.subject}</strong></div></div>
            <div className="modal-row"><label>문의 내용</label><div className="input-area">{editingItem.message}</div></div>

            <div className="modal-row">
              <label htmlFor="status">상태</label>
              <div className="input-area">
                <select name="status" defaultValue={editingItem.status}>
                  <option value="답변 대기">답변 대기</option>
                  <option value="답변 완료">답변 완료</option>
                </select>
              </div>
            </div>

            <div className="modal-row">
              <label htmlFor="response">답변 내용</label>
              <div className="input-area">
                <textarea
                  name="response"
                  defaultValue={editingItem.response}
                  placeholder="답변 내용을 입력하세요"
                  rows={5}
                  required
                />
              </div>
            </div>

            <div className="modal-row">
              <label htmlFor="file">첨부 파일</label>
              <div className="input-area">
                <input type="file" name="file" accept=".pdf,.jpg,.jpeg" />
                <p className="file-hint">PDF, JPG 파일만 업로드 가능 (최대 5MB)</p>
              </div>
            </div>

            <div className="modal-actions">
              <button type="button" onClick={() => setEditingItem(null)}>취소</button>
              <button type="submit">답변 저장</button>
            </div>
          </form>
        </div>
      )}

      {confirmDeleteId && (
        <div className="modal-backdrop" onClick={() => setConfirmDeleteId(null)}>
          <div className="modal confirm" onClick={(e) => e.stopPropagation()}>
            <h3>삭제 확인</h3>
            <p>정말로 <strong>"{deletingItem?.subject}"</strong> 문의를 삭제하시겠습니까?</p>
            <div className="modal-actions">
              <button onClick={() => setConfirmDeleteId(null)}>취소</button>
              <button className="danger" onClick={handleDelete}>삭제</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
