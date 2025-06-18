import React, { useState, useEffect } from 'react';
import '../../../styles/Admin/InquiryTable.css';

const dummyInquiries = [
  {
    id: 1,
    manufacturer: 'A 고객사',
    subject: '제품 A 펌웨어 문제',
    status: '답변 완료',
    date: '2023. 7. 15.',
    message: '제품 A의 최신 펌웨어를 설치했는데 작동이 안됩니다.',
    response: '펌웨어를 다시 설치해 보시기 바랍니다.',
  },
  {
    id: 2,
    manufacturer: 'B 고객사',
    subject: '보안 취약점 문의',
    status: '답변 대기',
    date: '2023. 7. 10.',
    message: '보안 취약점 패치가 언제 제공되나요?',
    response: '',
  },
];

export default function InquiryTable() {
  const [inquiries, setInquiries] = useState([]);
  const [filterStatus, setFilterStatus] = useState('전체');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [editingItem, setEditingItem] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const itemsPerPage = 5;

  useEffect(() => {
    setInquiries(dummyInquiries);
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
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const deletingItem = inquiries.find((i) => i.id === confirmDeleteId);

  const handleSave = (e) => {
    e.preventDefault();
    const form = e.target;
    const updated = {
      ...editingItem,
      status: form.status.value,
      response: form.response.value,
    };
    setInquiries((prev) =>
      prev.map((item) => (item.id === updated.id ? updated : item))
    );
    setEditingItem(null);
  };

  const handleDelete = () => {
    setInquiries((prev) => prev.filter((item) => item.id !== confirmDeleteId));
    setConfirmDeleteId(null);
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
                <button className="delete" onClick={() => setConfirmDeleteId(item.id)}>
                  🗑️
                </button>
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

      {/* 답변 모달 */}
      {editingItem && (
        <div className="modal-backdrop" onClick={() => setEditingItem(null)}>
          <form className="modal" onClick={(e) => e.stopPropagation()} onSubmit={handleSave}>
            <h3>문의 답변 수정</h3>
            <p>고객사: <strong>{editingItem.manufacturer}</strong></p>
            <p>제목: <strong>{editingItem.subject}</strong></p>
            <p>문의 내용: {editingItem.message}</p>

            <label>
              상태
              <select name="status" defaultValue={editingItem.status}>
                <option value="답변 대기">답변 대기</option>
                <option value="답변 완료">답변 완료</option>
              </select>
            </label>

            <label>
              답변 내용
              <textarea
                name="response"
                defaultValue={editingItem.response}
                rows={5}
                placeholder="답변 내용을 입력하세요"
                required
              />
            </label>

            <label>
              첨부 파일 (선택사항)
              <input type="file" name="file" accept=".pdf,.jpg,.jpeg" />
            </label>
            <p className="file-hint">PDF, JPG 파일만 업로드 가능 (최대 5MB)</p>

            <div className="modal-actions">
              <button type="button" onClick={() => setEditingItem(null)}>취소</button>
              <button type="submit">답변 저장</button>
            </div>
          </form>
        </div>
      )}

      {/* 삭제 모달 */}
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
