// src/pages/employee/EmployeeKnowledgePage.js

import React, { useEffect, useState } from 'react';
import EmployeeHeader from './EmployeeHeader';
import KnowledgeDetailModal from '../../components/KnowledgeDetailModal';
import '../../styles/Knowledge.css';

const categories = ['전체', '새 기능', '수정', '버그', '문의', '장애', '긴급 지원'];

export default function EmployeeKnowledgePage() {
  const [knowledgeList, setKnowledgeList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showNewModal, setShowNewModal] = useState(false);
  const token = localStorage.getItem('token');

  const itemsPerPage = 6;

  // 🔹 지식 목록 불러오기
  useEffect(() => {
    const fetchKnowledge = async () => {
      try {
        const res = await fetch('http://<EC2-IP>:5000/api/knowledge', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setKnowledgeList(data);
      } catch (err) {
        console.error('지식 문서 불러오기 실패:', err);
        alert('지식 문서를 불러오는 데 실패했습니다.');
      }
    };

    fetchKnowledge();
  }, []);

  // 🔹 필터링된 목록 계산
  const filtered = knowledgeList.filter(item => {
    const matchCategory = selectedCategory === '전체' || item.category === selectedCategory;
    const matchSearch =
      item.title.includes(searchTerm) || item.summary.includes(searchTerm);
    return matchCategory && matchSearch;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paged = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // 🔹 문서 등록 처리
  const handleSubmitNewDoc = async (e) => {
    e.preventDefault();
    const form = e.target;
    const title = form.title.value;
    const category = form.category.value;
    const summary = form.summary.value;
    const file = form.fileUpload.files[0];

    if (!title || !category) {
      alert('제목과 카테고리는 필수입니다.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('category', category);
      formData.append('summary', summary);
      if (file) formData.append('file', file);

      const res = await fetch('http://<EC2-IP>:5000/api/knowledge/create', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) throw new Error('등록 실패');
      alert('문서가 등록되었습니다.');
      setShowNewModal(false);
      window.location.reload();
    } catch (err) {
      console.error('문서 등록 실패:', err);
      alert('문서 등록 중 오류가 발생했습니다.');
    }
  };

  return (
    <>
      <EmployeeHeader />
      <main className="knowledge-container">
        <h2>지식 관리 시스템 (사원용)</h2>
        <p>사원들이 작성한 지식 문서를 확인하고 등록할 수 있습니다.</p>

        {/* 🔍 검색창 및 등록 버튼 */}
        <div className="knowledge-search" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <input
            type="text"
            placeholder="검색어를 입력하세요"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            onKeyDown={(e) => e.key === 'Enter' && setCurrentPage(1)}
          />
          <button
            className="btn"
            onClick={() => setShowNewModal(true)}
          >
            + 문서 추가
          </button>
        </div>

        {/* 🔹 카테고리 필터 */}
        <div className="knowledge-categories">
          {categories.map(cat => (
            <button
              key={cat}
              className={selectedCategory === cat ? 'active' : ''}
              onClick={() => {
                setSelectedCategory(cat);
                setCurrentPage(1);
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 🔹 카드 리스트 */}
        <div className="knowledge-card-list">
          {paged.map(item => (
            <div key={item.id} className="knowledge-card" onClick={() => setSelectedItem(item)}>
              <div className="card-header">
                <span className={`category-tag ${item.category}`}>{item.category}</span>
                <time className="card-date">{item.created_at || item.date}</time>
              </div>
              <h3>{item.title}</h3>
              <p>{item.summary}</p>
            </div>
          ))}
        </div>

        {/* 🔹 페이지네이션 */}
        {totalPages > 1 && (
          <div className="knowledge-pagination">
            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>
              &lt;
            </button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                className={currentPage === i + 1 ? 'active' : ''}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>
              &gt;
            </button>
          </div>
        )}

        {/* 🔹 상세 보기 모달 */}
        {selectedItem && (
          <KnowledgeDetailModal item={selectedItem} onClose={() => setSelectedItem(null)} />
        )}

        {/* 🔹 문서 등록 모달 */}
        {showNewModal && (
          <div className="modal-backdrop" onClick={() => setShowNewModal(false)}>
            <form
              className="modal new-inquiry-modal"
              onClick={(e) => e.stopPropagation()}
              onSubmit={handleSubmitNewDoc}
            >
              <header>
                <h2>지식 문서 추가</h2>
                <button type="button" className="close-btn" onClick={() => setShowNewModal(false)}>×</button>
              </header>

              <label htmlFor="title">문서 제목</label>
              <input id="title" name="title" type="text" required />

              <label htmlFor="category">카테고리</label>
              <select id="category" name="category" required>
                <option value="">카테고리를 선택하세요</option>
                {categories.filter(c => c !== '전체').map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>

              <label htmlFor="summary">요약 설명</label>
              <textarea id="summary" name="summary" rows="4" />

              <label htmlFor="fileUpload">첨부 파일 (선택)</label>
              <input id="fileUpload" name="fileUpload" type="file" accept=".pdf,.jpg,.jpeg" />

              <footer className="modal-footer">
                <button type="button" className="btn cancel-btn" onClick={() => setShowNewModal(false)}>취소</button>
                <button type="submit" className="btn submit-btn">등록</button>
              </footer>
            </form>
          </div>
        )}
      </main>
    </>
  );
}
