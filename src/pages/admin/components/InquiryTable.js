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
    response: '펌웨어를 다시 설치해 보시기 바랍니다.'
  },
  {
    id: 2,
    manufacturer: 'B 고객사',
    subject: '보안 취약점 문의',
    status: '답변 대기',
    date: '2023. 7. 10.',
    message: '보안 취약점 패치가 언제 제공되나요?',
    response: ''
  }
];

export default function InquiryTable() {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState('전체');
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [editing, setEditing] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const itemsPerPage = 5;

  useEffect(() => {
    setData(dummyInquiries);
  }, []);

  const filtered = data.filter((item) => {
    const matchStatus = filter === '전체' || item.status === filter;
    const matchSearch =
      item.manufacturer.includes(search) ||
      item.subject.includes(search) ||
      item.message.includes(search);
    return matchStatus && matchSearch;
  });

  const paged = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  const handleSave = (e) => {
    e.preventDefault();
    const form = e.target;
    const response = form.response.value;
    const status = form.status.value;

    setData((prev) =>
      prev.map((item) =>
        item.id === editing.id ? { ...item, response, status } : item
      )
    );
    setEditing(null);
  };

  const handleDelete = () => {
    setData((prev) => prev.filter((item) => item.id !== confirmDeleteId));
    setConfirmDeleteId(null);
  };

  return (
    <div className="inquiry-table-wrapper">
      <div className="table-header">
        <h2>🛠️ 제조사 문의 관리</h2>
        <div className="table-controls">
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            {['전체', '답변 대기', '답변 완료'].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="검색..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
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
          {paged.map((item) => (
            <tr key={item.id}>
              <td>{item.manufacturer}</td>
              <td>{item.subject}</td>
              <td>
                <span className={`badge ${item.status}`}>{item.status}</span>
              </td>
              <td>{item.date}</td>
              <td>
                <button className="view" onClick={() => setEditing(item)}>
                  {item.status === '답변 완료' ? '답변 보기' : '답변 작성'}
                </button>
                <button className="delete" onClick={() => setConfirmDeleteId(item.id)}>🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            className={currentPage === i + 1 ? 'active' : ''}
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {editing && (
        <div className="modal-backdrop" onClick={() => setEditing(null)}>
          <form className="modal" onClick={(e) => e.stopPropagation()} onSubmit={handleSave}>
            <h3>문의 답변 {editing.status === '답변 완료' ? '보기' : '작성'}</h3>

            <p><strong>고객사:</strong> {editing.manufacturer}</p>
            <p><strong>제목:</strong> {editing.subject}</p>
            <p><strong>문의 내용:</strong> {editing.message}</p>

            <label>
              상태
              <select name="status" defaultValue={editing.status} disabled={editing.status === '답변 완료'}>
                <option value="답변 대기">답변 대기</option>
                <option value="답변 완료">답변 완료</option>
              </select>
            </label>

            <label>
              답변 내용
              <textarea
                name="response"
                defaultValue={editing.response}
                rows={5}
                placeholder="답변 내용을 입력하세요"
                required
                disabled={editing.status === '답변 완료'}
              />
            </label>

            <label>
              첨부 파일 (선택사항)
              <input type="file" name="file" accept=".pdf,.jpg,.jpeg" disabled={editing.status === '답변 완료'} />
            </label>
            <p className="file-hint">PDF, JPG 파일만 업로드 가능 (최대 5MB)</p>

            <div className="modal-actions">
              <button type="button" onClick={() => setEditing(null)}>취소</button>
              {editing.status === '답변 대기' && <button type="submit">답변 저장</button>}
            </div>
          </form>
        </div>
      )}

      {confirmDeleteId && (
        <div className="modal-backdrop" onClick={() => setConfirmDeleteId(null)}>
          <div className="modal confirm" onClick={(e) => e.stopPropagation()}>
            <h3>삭제 확인</h3>
            <p>정말로 삭제하시겠습니까?</p>
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