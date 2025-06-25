// src/pages/employee/EmployeeKnowledgePage.js

import React, { useState } from 'react';
import EmployeeHeader from './EmployeeHeader';
import KnowledgeDetailModal from '../../components/KnowledgeDetailModal';
import '../../styles/Knowledge.css';
import { knowledgeData } from '../../data/knowledgeData'; // ✅ 공통 지식 데이터

const categories = ['전체', '새 기능', '수정', '버그', '문의', '장애', '긴급 지원'];

export default function EmployeeKnowledgePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showNewModal, setShowNewModal] = useState(false);

  const itemsPerPage = 6;

  const filtered = knowledgeData.filter(item => {
    const matchCategory = selectedCategory === '전체' || item.category === selectedCategory;
    const matchSearch =
      item.title.includes(searchTerm) || item.summary.includes(searchTerm);
    return matchCategory && matchSearch;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paged = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <>
      <EmployeeHeader />
      <main className="knowledge-container">
        <h2>지식 관리 시스템 (사원용)</h2>
        <p>사원들이 작성한 지식 문서를 확인하고 등록할 수 있습니다.</p>

        {/* 🔍 검색 + 추가 버튼 */}
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
            style={{
              backgroundColor: '#007acc',
              color: '#fff',
              padding: '0.6rem 1rem',
              border: 'none',
              borderRadius: '6px',
              fontWeight: '600',
              cursor: 'pointer',
            }}
            onClick={() => setShowNewModal(true)}
          >
            + 문서 추가
          </button>
        </div>

        {/* ✅ 카테고리 필터 */}
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

        {/* ✅ 카드 리스트 */}
        <div className="knowledge-card-list">
          {paged.map(item => (
            <div key={item.id} className="knowledge-card" onClick={() => setSelectedItem(item)}>
              <div className="card-header">
                <span className={`category-tag ${item.category}`}>{item.category}</span>
                <time className="card-date">{item.date}</time>
              </div>
              <h3>{item.title}</h3>
              <p>{item.summary}</p>
            </div>
          ))}
        </div>

        {/* ✅ 페이지네이션 */}
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

        {/* ✅ 상세 보기 모달 */}
        {selectedItem && (
          <KnowledgeDetailModal item={selectedItem} onClose={() => setSelectedItem(null)} />
        )}

        {/* ✅ 문서 등록 모달 */}
        {showNewModal && (
          <div
            className="modal-backdrop"
            role="dialog"
            aria-modal="true"
            onClick={() => setShowNewModal(false)}
          >
            <form
              className="modal new-inquiry-modal"
              onClick={(e) => e.stopPropagation()}
              onSubmit={(e) => {
                e.preventDefault();
                alert('📡 [TODO] Flask API 연동 필요: POST /api/employee/knowledge');
                setShowNewModal(false);
              }}
            >
              <header>
                <h2>지식 문서 추가</h2>
                <button
                  type="button"
                  className="close-btn"
                  aria-label="닫기"
                  onClick={() => setShowNewModal(false)}
                >
                  ×
                </button>
              </header>

              <label htmlFor="title">문서 제목</label>
              <input
                id="title"
                name="title"
                type="text"
                placeholder="문서 제목을 입력하세요"
                required
              />

              <label htmlFor="category">카테고리</label>
              <select id="category" name="category" required>
                <option value="">카테고리를 선택하세요</option>
                {categories.filter(c => c !== '전체').map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>

              <label htmlFor="summary">요약 설명</label>
              <textarea
                id="summary"
                name="summary"
                rows="4"
                placeholder="문서 내용을 간략히 요약해주세요"
              />

              <label htmlFor="fileUpload">첨부 파일 (선택)</label>
              <input
                id="fileUpload"
                name="fileUpload"
                type="file"
                accept=".pdf,.jpg,.jpeg"
              />

              <footer className="modal-footer">
                <button
                  type="button"
                  className="btn cancel-btn"
                  onClick={() => setShowNewModal(false)}
                >
                  취소
                </button>
                <button type="submit" className="btn submit-btn">
                  등록
                </button>
              </footer>
            </form>
          </div>
        )}
      </main>
    </>
  );
}
