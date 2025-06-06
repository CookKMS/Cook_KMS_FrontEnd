// src/pages/Knowledge.js
import React, { useState } from 'react';
import Header from '../components/Header';
import KnowledgeDetailModal from '../components/KnowledgeDetailModal';
import '../styles/Knowledge.css';

// 샘플 댓글 세트: 각 카드마다 다른 댓글 배열을 가지도록 준비
const sampleComments = [
  [
    { author: "dev_kim", time: "2025.05.01 09:20", content: "패치 이후 문제 해결됐습니다. 감사합니다." },
    { author: "support_bot", time: "2025.05.01 10:02", content: "추가로 확인해야 할 경우 다시 문의 주세요." },
  ],
  [
    { author: "user_jane", time: "2025.04.30 14:45", content: "증상이 저희 환경에서도 발생했습니다." },
  ],
  [
    { author: "tech_admin", time: "2025.04.28 08:17", content: "로그 남기기 기능이 유용했습니다." },
    { author: "qa_lee", time: "2025.04.28 11:33", content: "관련 로그 포맷도 공유해주시면 좋겠습니다." },
    { author: "tester99", time: "2025.04.29 09:01", content: "덕분에 빠르게 확인했어요!" }
  ],
  [
    { author: "kimtaehoon", time: "2025.04.25 17:45", content: "문서화가 잘 되어 있어 이해하기 쉬웠습니다." }
  ],
  [
    { author: "pm_yuna", time: "2025.04.20 10:55", content: "기능이 생각보다 유용했습니다. 감사합니다." }
  ]
];

// 카드별 더미 데이터 생성
const dummyData = Array.from({ length: 30 }, (_, i) => {
  const categories = ['새 기능', '수정', '버그', '문의', '장애', '긴급 지원'];
  const category = categories[i % categories.length];
  const commentsPool = sampleComments[i % sampleComments.length];
  return {
    id: i + 1,
    category,
    title: `지식 항목 ${i + 1} - ${category}`,
    date: `2025.04.${(i % 30 + 1).toString().padStart(2, '0')}`,
    summary: `${category} 관련 내용 요약입니다. 이 항목은 ${i + 1}번 지식입니다.`,
    content: `${category} 상세 본문입니다.\n- 증상: ...\n- 원인: ...\n- 해결 방법: ...`,
    attachment: {
      name: "로그인_오류_가이드.pdf",
      url: "#"
    },
    comments: commentsPool,
  };
});

// 필터링용 카테고리 목록
const categories = ['전체', '새 기능', '수정', '버그', '문의', '장애', '긴급 지원'];

function Knowledge() {
  const [searchTerm, setSearchTerm] = useState(''); // 검색어 입력값
  const [selectedCategory, setSelectedCategory] = useState('전체'); // 현재 선택된 카테고리
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 번호
  const [selectedItem, setSelectedItem] = useState(null); // 클릭된 카드 (모달 오픈용)

  const itemsPerPage = 6; // 페이지당 카드 수

  // 검색어 + 카테고리 필터링 처리
  const filtered = dummyData.filter(item => {
    const matchCategory = selectedCategory === '전체' || item.category === selectedCategory;
    const matchSearch = item.title.includes(searchTerm) || item.summary.includes(searchTerm);
    return matchCategory && matchSearch;
  });

  // 페이지네이션 처리
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paged = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <>
      <Header />
      <main className="knowledge-container">
        <h2>지식 관리 시스템</h2>
        <p>팀에서 공유하는 지식과 정보를 한 곳에서 관리하세요</p>

        {/* 검색 입력창 */}
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

        {/* 카테고리 필터 버튼 */}
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

        {/* 카드 리스트 */}
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

        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <div className="knowledge-pagination">
            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>
              &lt;
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
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

        {/* 지식 상세 보기 모달 */}
        {selectedItem && (
          <KnowledgeDetailModal item={selectedItem} onClose={() => setSelectedItem(null)} />
        )}
      </main>
    </>
  );
}

export default Knowledge;
