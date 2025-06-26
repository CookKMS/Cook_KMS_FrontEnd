import React, { useEffect, useState } from 'react';
import axios from '../../../utils/axiosInstance';
import '../../../styles/Admin/KnowledgeTable.css';

const categories = ['전체', '새 기능', '수정', '버그', '문의', '장애', '긴급 지원'];

export default function KnowledgeTable() {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState('전체');
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const itemsPerPage = 5;

  // ✅ 초기 데이터 로딩 (GET /api/knowledge)
  const fetchKnowledge = async () => {
    try {
      const res = await axios.get('/knowledge');
      setData(res.data);
    } catch (error) {
      console.error('문서 목록 조회 실패:', error);
    }
  };

  useEffect(() => {
    fetchKnowledge();
  }, []);

  const filtered = data.filter((item) => {
    const matchCategory = filter === '전체' || item.category === filter;
    const matchSearch = item.title.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  const paged = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  // ✅ 문서 삭제 처리 (DELETE /api/knowledge/:id)
  const handleDelete = async () => {
    try {
      await axios.delete(`/knowledge/${confirmDeleteId}`);
      setConfirmDeleteId(null);
      fetchKnowledge();
    } catch (error) {
      console.error('삭제 실패:', error);
    }
  };

  // ✅ 문서 등록 또는 수정 처리
  const handleSave = async (e) => {
    e.preventDefault();
    const form = e.target;
    const title = form.title.value;
    const category = form.category.value;
    const content = form.content.value;
    const file = form.file.files[0];

    try {
      let fileIds = [];

      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        const uploadRes = await axios.post('/file/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        fileIds = [uploadRes.data.file_id];
      }

      const payload = {
        title,
        content,
        category,
        tags: [],
        files: fileIds
      };

      if (editingItem) {
        await axios.put(`/knowledge/${editingItem.id}`, payload);
      } else {
        await axios.post('/knowledge/create', payload);
      }

      setShowModal(false);
      setEditingItem(null);
      fetchKnowledge();
    } catch (error) {
      console.error('저장 실패:', error);
    }
  };

  return (
    <div className="knowledge-table-wrapper">
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

      <table className="knowledge-table">
        <thead>
          <tr>
            <th>제목</th>
            <th>카테고리</th>
            <th>최종 수정일</th>
            <th>관리</th>
          </tr>
        </thead>
        <tbody>
          {paged.map((item) => (
            <tr key={item.id}>
              <td>{item.title}</td>
              <td>{item.category}</td>
              <td>{item.updated_at?.slice(0, 10)}</td>
              <td>
                <button className="btn-edit" onClick={() => { setEditingItem(item); setShowModal(true); }}>✏️</button>
                <button className="btn-delete" onClick={() => setConfirmDeleteId(item.id)}>🗑️</button>
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

      {/* 모달 - 등록/수정 */}
      {showModal && (
        <div className="modal-backdrop" onClick={() => { setShowModal(false); setEditingItem(null); }}>
          <form className="modal" onClick={(e) => e.stopPropagation()} onSubmit={handleSave}>
            <h3>{editingItem ? '지식 문서 수정' : '새 지식 문서 추가'}</h3>

            <div className="modal-row">
              <label htmlFor="title">제목</label>
              <div className="input-area">
                <input
                  name="title"
                  id="title"
                  defaultValue={editingItem?.title || ''}
                  required
                />
              </div>
            </div>

            <div className="modal-row">
              <label htmlFor="category">카테고리</label>
              <div className="input-area">
                <select
                  name="category"
                  id="category"
                  defaultValue={editingItem?.category || ''}
                  required
                >
                  <option value="">카테고리 선택</option>
                  {categories.filter(c => c !== '전체').map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="modal-row">
              <label htmlFor="content">내용</label>
              <div className="input-area">
                <textarea
                  name="content"
                  id="content"
                  rows={5}
                  defaultValue={editingItem?.content || ''}
                  required
                />
              </div>
            </div>

            <div className="modal-row">
              <label htmlFor="file">첨부 파일</label>
              <div className="input-area">
                <input type="file" name="file" id="file" accept=".pdf,.jpg,.jpeg" />
              </div>
            </div>

            <div className="modal-actions">
              <button type="button" className="cancel" onClick={() => { setShowModal(false); setEditingItem(null); }}>취소</button>
              <button type="submit" className="primary">저장</button>
            </div>
          </form>
        </div>
      )}

      {/* 삭제 확인 모달 */}
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
