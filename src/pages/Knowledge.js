import React, { useState } from 'react';
import Header from '../components/Header';
import KnowledgeDetailModal from '../components/KnowledgeDetailModal';
import '../styles/Knowledge.css';
import { knowledgeData } from '../data/knowledgeData'; // ✅ 외부에서 데이터 import

// ✅ 필터용 카테고리 목록
const categories = ['전체', '새 기능', '수정', '버그', '문의', '장애', '긴급 지원'];

function Knowledge() {
  const [searchTerm, setSearchTerm] = useState('');           // 검색어 입력 상태
  const [selectedCategory, setSelectedCategory] = useState('전체'); // 선택된 카테고리
  const [currentPage, setCurrentPage] = useState(1);          // 현재 페이지
  const [selectedItem, setSelectedItem] = useState(null);     // 모달로 볼 항목

  const itemsPerPage = 6;

  // ✅ 검색 + 카테고리 필터링 처리
  const filtered = knowledgeData.filter(item => {
    const matchCategory = selectedCategory === '전체' || item.category === selectedCategory;
    const matchSearch =
      item.title.includes(searchTerm) ||
      item.summary.includes(searchTerm);
    return matchCategory && matchSearch;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paged = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <>
      <Header />
      <main className="knowledge-container">
        <h2>지식 관리 시스템</h2>
        <p>팀에서 공유하는 지식과 정보를 한 곳에서 관리하세요</p>

        {/* ✅ 검색창 */}
        <div className="knowledge-search">
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

        {/* ✅ 상세 모달 */}
        {selectedItem && (
          <KnowledgeDetailModal item={selectedItem} onClose={() => setSelectedItem(null)} />
        )}
      </main>
    </>
  );
}

export default Knowledge;
