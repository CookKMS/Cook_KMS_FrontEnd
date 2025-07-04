import React, { useState, useEffect } from 'react';
import '../../../styles/Admin/InquiryTable.css';

const STATUS_MAP = {
  '전체': null,
  '답변 대기': '01',
  '답변 완료': '02',
};

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
    // ✅ 테스트용 더미 데이터 삽입
    const dummyData = [
      {
        id: 1,
        category: '버그',
        user_id: 'clientA',
        title: 'VPN 연결 불가',
        content: '업무용 VPN이 연결되지 않습니다.',
        status: '01',
        created_at: '2024-06-30',
        comments: [],
      },
      {
        id: 2,
        category: '장애',
        user_id: 'clientB',
        title: '로그인 오류 발생',
        content: '로그인 버튼 클릭 시 아무 반응이 없습니다.',
        status: '02',
        created_at: '2024-07-01',
        comments: [{ content: '문제 해결 완료되었습니다.' }],
      },
    ];
    setInquiries(dummyData);
  }, []);

  const filtered = inquiries.filter(item => {
    const statusMatch = !STATUS_MAP[filterStatus] || item.status === STATUS_MAP[filterStatus];
    const keywordMatch = item.title.includes(searchTerm) || item.content.includes(searchTerm);
    return statusMatch && keywordMatch;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleSave = (e) => {
    e.preventDefault();
    const form = e.target;
    const updatedInquiries = inquiries.map(item => {
      if (item.id === editingItem.id) {
        return {
          ...item,
          status: form.status.value,
          comments: [{ content: form.response.value }],
        };
      }
      return item;
    });
    setInquiries(updatedInquiries);
    setEditingItem(null);
  };

  const handleDelete = () => {
    setInquiries(prev => prev.filter(i => i.id !== confirmDeleteId));
    setConfirmDeleteId(null);
  };

  return (
    <div className="inquiry-table-wrapper">
      <div className="table-header">
        <h2>🛠️ 제조사 문의 관리 (테스트용)</h2>
        <div className="table-controls">
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            {Object.keys(STATUS_MAP).map(status => (
              <option key={status}>{status}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="검색..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
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
          {paginated.map(item => (
            <tr key={item.id}>
              <td>{item.category}</td>
              <td>{item.user_id}</td>
              <td>{item.title}</td>
              <td>
                <span className={`badge ${item.status === '02' ? 'badge-done' : 'badge-pending'}`}>
                  {item.status === '02' ? '답변 완료' : '답변 대기'}
                </span>
              </td>
              <td>{item.created_at}</td>
              <td>
                <button onClick={() => setEditingItem(item)}>
                  {item.status === '02' ? '답변 보기' : '답변 작성'}
                </button>
                <button onClick={() => setConfirmDeleteId(item.id)}>🗑️</button>
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

      {editingItem && (
        <div className="modal-backdrop" onClick={() => setEditingItem(null)}>
          <form className="modal" onClick={(e) => e.stopPropagation()} onSubmit={handleSave}>
            <h3>문의 답변</h3>
            <div className="modal-row"><label>카테고리</label><div className="input-area">{editingItem.category}</div></div>
            <div className="modal-row"><label>고객사</label><div className="input-area">{editingItem.user_id}</div></div>
            <div className="modal-row"><label>제목</label><div className="input-area"><strong>{editingItem.title}</strong></div></div>
            <div className="modal-row"><label>문의 내용</label><div className="input-area">{editingItem.content}</div></div>
            <div className="modal-row">
              <label htmlFor="status">상태</label>
              <div className="input-area">
                <select name="status" defaultValue={editingItem.status}>
                  <option value="01">답변 대기</option>
                  <option value="02">답변 완료</option>
                </select>
              </div>
            </div>
            <div className="modal-row">
              <label htmlFor="response">답변 내용</label>
              <div className="input-area">
                <textarea name="response" defaultValue={editingItem.comments?.[0]?.content || ''} rows={5} required />
              </div>
            </div>
            <div className="modal-actions">
              <button type="button" onClick={() => setEditingItem(null)}>취소</button>
              <button type="submit">저장</button>
            </div>
          </form>
        </div>
      )}

      {confirmDeleteId && (
        <div className="modal-backdrop" onClick={() => setConfirmDeleteId(null)}>
          <div className="modal confirm" onClick={(e) => e.stopPropagation()}>
            <h3>삭제 확인</h3>
            <p>정말로 <strong>{deletingItem?.title}</strong> 문의를 삭제하시겠습니까?</p>
            <div className="modal-actions">
              <button className="cancel" onClick={() => setConfirmDeleteId(null)}>취소</button>
              <button className="danger" onClick={handleDelete}>삭제</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
