// src/pages/FAQPage.js

import React, { useState } from "react";
import Header from "../components/Header";
import "../styles/FAQPage.css";
import { faqData } from "../data/faqData"; // ✅ [개발 초기] 임시 데이터 사용 (실제 서비스에서는 API 연동 예정)

// ✅ FAQ 카테고리 필터 목록 (카테고리 테이블과 매핑 가능)
const categories = ['전체', '설치,구성', '접근통제', '계정관리', '기타'];

export default function FAQPage() {
  // ✅ 사용자 입력 상태 관리
  const [searchTerm, setSearchTerm] = useState(""); // 검색어
  const [selectedCategory, setSelectedCategory] = useState("전체"); // 선택된 카테고리
  const [expandedIndex, setExpandedIndex] = useState(null); // 확장된 질문 인덱스

  // ✅ [Flask 연동 예정] FAQ 목록 필터링
  // 추후 `/api/faq`와 같은 endpoint에서 전체 FAQ 데이터를 받아오도록 fetch 처리 필요
  // 현재는 faqData (프론트 임시 데이터)를 활용
  const filteredFaqs = faqData.filter((faq) => {
    const matchesCategory =
      selectedCategory === "전체" || faq.category === selectedCategory;

    const matchesSearch =
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (typeof faq.answer === "string"
        ? faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
        : false);

    return matchesCategory && matchesSearch;
  });

  // ✅ 질문 클릭 시 토글 처리
  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <>
      <Header />
      <main className="container faq-page">
        <h1>자주 묻는 질문 (FAQ)</h1>

        {/* ✅ 검색 입력창 */}
        <input
          type="search"
          aria-label="검색어 입력"
          placeholder="검색어를 입력하세요"
          className="faq-search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* ✅ 카테고리 필터 영역 */}
        {/* category 값은 코드 테이블과 매핑되어야 하며, 백엔드에서도 필터링용 파라미터로 사용 가능 */}
        <nav className="faq-categories" role="list">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`faq-category-btn ${selectedCategory === cat ? "active" : ""}`}
              onClick={() => setSelectedCategory(cat)}
              role="listitem"
            >
              {cat}
            </button>
          ))}
        </nav>

        {/* ✅ FAQ 목록 렌더링 영역 */}
        {/* 추후 백엔드에서 받은 데이터로 대체되며, map 처리 유지 */}
        <section aria-label="FAQ 목록" className="faq-list">
          {filteredFaqs.length === 0 ? (
            <p className="no-results">조회되는 FAQ가 없습니다.</p>
          ) : (
            filteredFaqs.map((faq, idx) => (
              <article
                key={faq.id} // FAQ 식별자 (DB id)
                className={`faq-item ${expandedIndex === idx ? "expanded" : ""}`}
              >
                {/* ✅ 질문 버튼: 제목 앞에 [카테고리] 표기 */}
                <button
                  className="faq-question"
                  onClick={() => toggleExpand(idx)}
                  aria-expanded={expandedIndex === idx}
                  aria-controls={`faq-answer-${idx}`}
                  id={`faq-question-${idx}`}
                >
                  {/* ✅ 서버에서 전달된 category 속성 기준으로 표기 */}
                  [{faq.category}] {faq.question}
                  <span className="faq-toggle-icon" aria-hidden="true">
                    {expandedIndex === idx ? "▲" : "▼"}
                  </span>
                </button>

                {/* ✅ 질문이 열렸을 때 답변 표시 */}
                {expandedIndex === idx && (
                  <div
                    id={`faq-answer-${idx}`}
                    className="faq-answer"
                    role="region"
                    aria-labelledby={`faq-question-${idx}`}
                  >
                    {typeof faq.answer === "string" ? (
                      <p>{faq.answer}</p>
                    ) : (
                      faq.answer
                    )}
                  </div>
                )}
              </article>
            ))
          )}
        </section>

        {/* ✅ 전체 FAQ 개수 요약 (백엔드 연동 시 필터링된 데이터 기준으로 렌더링 가능) */}
        <footer className="faq-footer">
          <small>
            1-{filteredFaqs.length} / 총 {faqData.length}건의 자주 묻는 질문
          </small>
        </footer>
      </main>
    </>
  );
}
