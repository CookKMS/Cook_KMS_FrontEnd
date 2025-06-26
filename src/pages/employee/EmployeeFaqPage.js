// src/pages/employee/EmployeeFaqPage.js

import React, { useState, useEffect } from "react";
import EmployeeHeader from "./EmployeeHeader";
import "../../styles/FAQPage.css";

// ✅ 카테고리 목록 (FAQ 등록 시 선택하는 분류 기준)
const categories = ['전체', '설치,구성', '접근통제', '계정관리', '기타'];

export default function EmployeeFaqPage() {
  // 🔹 상태 정의
  const [faqList, setFaqList] = useState([]); // 전체 FAQ 데이터
  const [searchTerm, setSearchTerm] = useState(""); // 검색어
  const [selectedCategory, setSelectedCategory] = useState("전체"); // 선택된 카테고리
  const [expandedIndex, setExpandedIndex] = useState(null); // 확장된 항목 인덱스
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
  const itemsPerPage = 10;

  // 🔹 FAQ 목록 불러오기 (Flask 백엔드 연동)
  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const res = await fetch("http://<EC2-IP>:5000/api/faq"); // 실제 서버 주소로 교체 필요
        const data = await res.json();
        setFaqList(data);
      } catch (err) {
        console.error("FAQ 불러오기 실패:", err);
        alert("FAQ 데이터를 불러오는 데 실패했습니다.");
      }
    };

    fetchFaqs();
  }, []);

  // 🔹 검색 및 카테고리 필터 적용된 FAQ
  const filteredFaqs = faqList.filter((faq) => {
    const matchCategory = selectedCategory === "전체" || faq.category === selectedCategory;
    const matchSearch =
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (typeof faq.answer === "string" &&
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchCategory && matchSearch;
  });

  // 🔹 현재 페이지에 표시할 FAQ
  const totalPages = Math.ceil(filteredFaqs.length / itemsPerPage);
  const paginatedFaqs = filteredFaqs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // 🔹 펼치기/접기 토글
  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <>
      <EmployeeHeader />
      <main className="container faq-page">
        <h1>자주 묻는 질문 (FAQ)</h1>

        {/* 🔹 검색창 */}
        <input
          type="search"
          aria-label="검색어 입력"
          placeholder="검색어를 입력하세요"
          className="faq-search"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1); // 검색어 바뀌면 페이지 초기화
          }}
        />

        {/* 🔹 카테고리 필터 버튼 */}
        <nav className="faq-categories" role="list">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`faq-category-btn ${selectedCategory === cat ? "active" : ""}`}
              onClick={() => {
                setSelectedCategory(cat);
                setCurrentPage(1);
              }}
              role="listitem"
            >
              {cat}
            </button>
          ))}
        </nav>

        {/* 🔹 FAQ 목록 출력 */}
        <section aria-label="FAQ 목록" className="faq-list">
          {paginatedFaqs.length === 0 ? (
            <p className="no-results">조회되는 FAQ가 없습니다.</p>
          ) : (
            paginatedFaqs.map((faq, idx) => {
              const globalIndex = (currentPage - 1) * itemsPerPage + idx;
              return (
                <article
                  key={faq.id}
                  className={`faq-item ${expandedIndex === globalIndex ? "expanded" : ""}`}
                >
                  {/* 🔸 질문 */}
                  <button
                    className="faq-question"
                    onClick={() => toggleExpand(globalIndex)}
                    aria-expanded={expandedIndex === globalIndex}
                    aria-controls={`faq-answer-${globalIndex}`}
                    id={`faq-question-${globalIndex}`}
                  >
                    [{faq.category}] {faq.question}
                    <span className="faq-toggle-icon" aria-hidden="true">
                      {expandedIndex === globalIndex ? "▲" : "▼"}
                    </span>
                  </button>

                  {/* 🔸 답변 */}
                  {expandedIndex === globalIndex && (
                    <div
                      id={`faq-answer-${globalIndex}`}
                      className="faq-answer"
                      role="region"
                      aria-labelledby={`faq-question-${globalIndex}`}
                    >
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </article>
              );
            })
          )}
        </section>

        {/* 🔹 페이지네이션 */}
        {totalPages > 1 && (
          <nav className="pagination" aria-label="페이지 이동">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              aria-label="이전 페이지"
            >
              &lt;
            </button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                className={currentPage === i + 1 ? "active" : ""}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              aria-label="다음 페이지"
            >
              &gt;
            </button>
          </nav>
        )}

        {/* 🔹 결과 수 표시 */}
        <footer className="faq-footer">
          <small>
            {filteredFaqs.length === 0
              ? "0"
              : `${(currentPage - 1) * itemsPerPage + 1}-${Math.min(
                  currentPage * itemsPerPage,
                  filteredFaqs.length
                )}`} / 총 {faqList.length}건의 자주 묻는 질문
          </small>
        </footer>
      </main>
    </>
  );
}
