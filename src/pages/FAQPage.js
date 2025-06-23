import React, { useState } from "react";
import Header from "../components/Header";
import "../styles/FAQPage.css";
import { faqData } from "../data/faqData"; // ✅ 공통 데이터 import

const categories = ['전체', '설치,구성', '접근통제', '계정관리', '기타'];

export default function FAQPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [expandedIndex, setExpandedIndex] = useState(null);

  // ✅ 카테고리 + 검색 필터 처리
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

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <>
      <Header />
      <main className="container faq-page">
        <h1>자주 묻는 질문 (FAQ)</h1>

        {/* ✅ 검색 입력 */}
        <input
          type="search"
          aria-label="검색어 입력"
          placeholder="검색어를 입력하세요"
          className="faq-search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* ✅ 카테고리 필터 */}
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

        {/* ✅ FAQ 목록 출력 */}
        <section aria-label="FAQ 목록" className="faq-list">
          {filteredFaqs.length === 0 ? (
            <p className="no-results">조회되는 FAQ가 없습니다.</p>
          ) : (
            filteredFaqs.map((faq, idx) => (
              <article
                key={faq.id}
                className={`faq-item ${expandedIndex === idx ? "expanded" : ""}`}
              >
                <button
                  className="faq-question"
                  onClick={() => toggleExpand(idx)}
                  aria-expanded={expandedIndex === idx}
                  aria-controls={`faq-answer-${idx}`}
                  id={`faq-question-${idx}`}
                >
                  {faq.question}
                  <span className="faq-toggle-icon" aria-hidden="true">
                    {expandedIndex === idx ? "▲" : "▼"}
                  </span>
                </button>

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

        {/* ✅ FAQ 개수 출력 */}
        <footer className="faq-footer">
          <small>
            1-{filteredFaqs.length} / 총 {faqData.length}건의 자주 묻는 질문
          </small>
        </footer>
      </main>
    </>
  );
}
