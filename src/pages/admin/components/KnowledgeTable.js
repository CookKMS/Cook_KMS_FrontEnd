import React, { useEffect, useState } from 'react';
import '../../../styles/Admin/KnowledgeTable.css';
// ✅ 더미 데이터 (나중에 백엔드 연동 시 제거)
import { knowledgeData } from '../../../data/knowledgeData';

// ✅ 백엔드 연동 시 axios 주석 참고
// import axios from 'axios';
// useEffect(() => {
//   axios.get('/api/knowledge')
//     .then(res => setData(res.data))
//     .catch(err => console.error(err));
// }, []);

const categories = ['전체', '새 기능', '수정', '버그', '문의', '장애', '긴급 지원'];

export default function KnowledgeTable() {
  // ✅ 상태 관리
  const [data, setData] = useState([]); // 지식 목록 데이터
  const [filter, setFilter] = useState('전체'); // 카테고리 필터
  const [search, setSearch] = useState('');     // 검색어
  const [currentPage, setCurrentPage] = useState(1); // 페이지네이션
  const [showModal, setShowModal] = useState(false); // 등록/수정 모달
  const [editingItem, setEditingItem] = useState(null); // 수정 대상 항목
  const [confirmDeleteId, setConfirmDeleteId] = useState(null); // 삭제 확인 대상

  const itemsPerPage = 5;

  // ✅ 초기 데이터 로딩 (백엔드 연동 시 GET /api/knowledge)
  useEffect(() => {
    setData(knowledgeData); // TODO: 실제 API 데이터로 교체
  }, []);

  // ✅ 필터 및 검색 처리
  const filtered = data.filter((item) => {
    const matchCategory = filter === '전체' || item.category === filter;
    const matchSearch = item.title.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  // ✅ 페이징 처리
  const paged = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  // ✅ 삭제 처리 (Flask 연동 시 DELETE /api/knowledge/:id)
  const handleDelete = async () => {
    if (confirmDeleteId !== null) {
      try {
        // await axios.delete(`/api/knowledge/${confirmDeleteId}`);
        setData((prev) => prev.filter((item) => item.id !== confirmDeleteId));
        setConfirmDeleteId(null);
      } catch (error) {
        console.error('삭제 실패:', error);
      }
    }
  };

  // ✅ 저장 처리 (등록/수정)
  // 등록 시 POST /api/knowledge, 수정 시 PUT /api/knowledge/:id
  const handleSave = async (e) => {
    e.preventDefault();
    const form = e.target;
    const title = form.title.value;
    const category = form.category.value;
    const content = form.content.value;
    const file = form.file.files[0];
    const today = new Date().toLocaleDateString('ko-KR');

    try {
      if (editingItem) {
        // ✅ [PUT] 수정
        // const formData = new FormData();
        // formData.append('title', title);
        // formData.append('category', category);
        // formData.append('content', content);
        // if (file) formData.append('file', file);
        // await axios.put(`/api/knowledge/${editingItem.id}`, formData);

        // 프론트 상태 업데이트
        setData((prev) =>
          prev.map((item) =>
            item.id === editingItem.id
              ? { ...item, title, category, content, updated: today, file: file ? file.name : item.file }
              : item
          )
        );
      } else {
        // ✅ [POST] 신규 등록
        // const formData = new FormData();
        // formData.append('title', title);
        // formData.append('category', category);
        // formData.append('content', content);
        // if (file) formData.append('file', file);
        // const res = await axios.post('/api/knowledge', formData);
        // const newItem = res.data;

        const newItem = {
          id: Date.now(),
          title,
          category,
          content,
          updated: today,
          views: 0,
          file: file ? file.name : '',
        };
        setData((prev) => [newItem, ...prev]);
      }

      setShowModal(false);
      setEditingItem(null);
      form.reset();
    } catch (error) {
      console.error('저장 실패:', error);
    }
  };

  return (
    <div className="knowledge-table-wrapper">
      {/* ✅ 필터 및 검색 */}
      <div className="table-header">
        <h2>📁 지식 문서 관리</h2>
        <div className="table-controls">
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="검색..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="btn-new" onClick={() => setShowModal(true)}>+ 새 문서 추가</button>
        </div>
      </div>

      {/* ✅ 테이블 */}
      <table className="knowledge-table">
        <thead>
          <tr>
            <th>제목</th>
            <th>카테고리</th>
            <th>최종 수정일</th>
            <th>조회수</th>
            <th>관리</th>
          </tr>
        </thead>
        <tbody>
          {paged.map((item) => (
            <tr key={item.id}>
              <td>{item.title}</td>
              <td>{item.category}</td>
              <td>{item.updated}</td>
              <td>{item.views}</td>
              <td>
                <button className="btn-edit" onClick={() => { setEditingItem(item); setShowModal(true); }}>✏️</button>
                <button className="btn-delete" onClick={() => setConfirmDeleteId(item.id)}>🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ✅ 페이지네이션 */}
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

      {/* ✅ 등록/수정 모달 */}
      {showModal && (
        <div className="modal-backdrop" onClick={() => { setShowModal(false); setEditingItem(null); }}>
          <form className="modal" onClick={(e) => e.stopPropagation()} onSubmit={handleSave}>
            <h3>{editingItem ? '지식 문서 수정' : '새 지식 문서 추가'}</h3>

            <label>
              제목
              <input name="title" defaultValue={editingItem?.title || ''} required placeholder="문서 제목을 입력하세요" />
            </label>

            <label>
              카테고리
              <select name="category" defaultValue={editingItem?.category || ''} required>
                <option value="">카테고리 선택</option>
                {categories.filter(c => c !== '전체').map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </label>

            <label>
              내용
              <textarea name="content" defaultValue={editingItem?.content || ''} placeholder="문서 내용을 상세히 입력하세요" />
            </label>

            <label>
              첨부 파일
              <input type="file" name="file" accept=".pdf,.jpg,.jpeg" />
            </label>
            {editingItem?.file && (
              <div className="file-preview">
                첨부 파일: {editingItem.file}
                <button type="button" onClick={() => setEditingItem({ ...editingItem, file: '' })}>× 제거</button>
              </div>
            )}

            <div className="modal-actions">
              <button type="button" onClick={() => { setShowModal(false); setEditingItem(null); }}>취소</button>
              <button type="submit">저장</button>
            </div>
          </form>
        </div>
      )}

      {/* ✅ 삭제 확인 모달 */}
      {confirmDeleteId !== null && (
        <div className="modal-backdrop" onClick={() => setConfirmDeleteId(null)}>
          <div className="modal confirm" onClick={(e) => e.stopPropagation()}>
            <h3>삭제 확인</h3>
            <p>정말로 "{data.find(d => d.id === confirmDeleteId)?.title}" 문서를 삭제하시겠습니까?</p>
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