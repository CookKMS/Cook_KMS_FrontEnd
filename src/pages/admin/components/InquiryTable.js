import React, { useState, useEffect } from 'react';
import '../../../styles/Admin/InquiryTable.css';

// ✅ 초기 더미 데이터 (향후 백엔드 API 연동으로 대체 예정)
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
  // ✅ 상태 관리: 전체 문의 목록
  const [inquiries, setInquiries] = useState([]);

  // ✅ 필터 및 검색 관련 상태
  const [filterStatus, setFilterStatus] = useState('전체'); // '전체' | '답변 대기' | '답변 완료'
  const [searchTerm, setSearchTerm] = useState('');

  // ✅ 페이징 관련 상태
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // ✅ 모달 제어 상태
  const [editingItem, setEditingItem] = useState(null);           // 수정 중인 항목
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);   // 삭제 대상 ID
  const deletingItem = inquiries.find((i) => i.id === confirmDeleteId);

  // ✅ 최초 렌더링 시 더미 데이터 로딩 (추후 Flask API 연동 예정)
  useEffect(() => {
    fetchInquiries();
  }, []);

  // ✅ 전체 문의 조회 함수 (Flask 연동 시 GET /api/inquiries)
  const fetchInquiries = async () => {
    try {
      // const res = await fetch('/api/inquiries');
      // const data = await res.json();
      const data = dummyInquiries; // 임시 더미 데이터
      setInquiries(data);
    } catch (error) {
      console.error('문의 불러오기 실패:', error);
    }
  };

  // ✅ 필터 및 검색 조건에 따라 데이터 필터링
  const filtered = inquiries.filter((item) => {
    const matchStatus = filterStatus === '전체' || item.status === filterStatus;
    const matchSearch =
      item.manufacturer.includes(searchTerm) ||
      item.subject.includes(searchTerm) ||
      item.message.includes(searchTerm);
    return matchStatus && matchSearch;
  });

  // ✅ 페이지네이션 처리
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // ✅ 문의 답변 저장 (수정 또는 작성)
  // Flask 연동 시 PUT /api/inquiries/:id
  const handleSave = async (e) => {
    e.preventDefault();
    const form = e.target;
    const updated = {
      ...editingItem,
      status: form.status.value,
      response: form.response.value,
    };

    try {
      // await fetch(`/api/inquiries/${editingItem.id}`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(updated),
      // });

      // 프론트에서 즉시 반영 (임시 처리)
      setInquiries((prev) =>
        prev.map((item) => (item.id === updated.id ? updated : item))
      );
      setEditingItem(null);
    } catch (error) {
      console.error('문의 수정 실패:', error);
    }
  };

  // ✅ 문의 삭제 처리
  // Flask 연동 시 DELETE /api/inquiries/:id
  const handleDelete = async () => {
    try {
      // await fetch(`/api/inquiries/${confirmDeleteId}`, { method: 'DELETE' });

      setInquiries((prev) => prev.filter((item) => item.id !== confirmDeleteId));
      setConfirmDeleteId(null);
    } catch (error) {
      console.error('삭제 실패:', error);
    }
  };

  return (
    <div className="inquiry-table-wrapper">
      {/* ✅ 상단 제목 및 필터/검색 */}
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

      {/* ✅ 문의 목록 테이블 */}
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

      {/* ✅ 페이지네이션 */}
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

      {/* ✅ 답변 작성/수정 모달 */}
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

      {/* ✅ 삭제 확인 모달 */}
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
