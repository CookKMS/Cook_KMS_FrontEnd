import React, { useState, useEffect } from "react";
import axios from "../utils/axiosInstance"; // ✅ axios 인스턴스
import Header from "../components/Header";
import "../styles/FAQPage.css";

// ✅ 카테고리 목록 - 공통 코드 기준
const categories = ['전체', '설치,구성', '접근통제', '계정관리', '기타'];

export default function FAQPage() {
  const [faqList, setFaqList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [expandedIndex, setExpandedIndex] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // ✅ FAQ 데이터 로드 함수
  const fetchFaqs = async () => {
    try {
      let url = "/faq";

      // 🔍 카테고리 필터링 요청
      if (selectedCategory !== "전체") {
        url = `/faq/category/${selectedCategory}`;
      }

      const response = await axios.get(url);
      setFaqList(response.data);
    } catch (error) {
      console.error("FAQ 목록 불러오기 실패:", error);
    }
  };

  // ✅ 최초 렌더링 및 카테고리 변경 시 API 호출
  useEffect(() => {
    fetchFaqs();
  }, [selectedCategory]);

  // ✅ 검색어 필터링 (프론트에서 처리)
  const filteredFaqs = faqList.filter((faq) => {
    const matchSearch =
      faq.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (faq.content && faq.content.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchSearch;
  });

  // ✅ 페이지네이션 처리
  const totalPages = Math.ceil(filteredFaqs.length / itemsPerPage);
  const paginatedFaqs = filteredFaqs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <>
      <Header />
      <main className="container faq-page">
        <h1>자주 묻는 질문 (FAQ)</h1>

        {/* 🔍 검색어 입력 */}
        <input
          type="search"
          aria-label="검색어 입력"
          placeholder="검색어를 입력하세요"
          className="faq-search"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />

        {/* 🔘 카테고리 버튼 */}
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

        {/* 📋 FAQ 목록 */}
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
                  <button
                    className="faq-question"
                    onClick={() => toggleExpand(globalIndex)}
                    aria-expanded={expandedIndex === globalIndex}
                    aria-controls={`faq-answer-${globalIndex}`}
                    id={`faq-question-${globalIndex}`}
                  >
                    [{faq.category}] {faq.title}
                    <span className="faq-toggle-icon" aria-hidden="true">
                      {expandedIndex === globalIndex ? "▲" : "▼"}
                    </span>
                  </button>

                  {expandedIndex === globalIndex && (
                    <div
                      id={`faq-answer-${globalIndex}`}
                      className="faq-answer"
                      role="region"
                      aria-labelledby={`faq-question-${globalIndex}`}
                    >
                      <p>{faq.content}</p>
                    </div>
                  )}
                </article>
              );
            })
          )}
        </section>

        {/* 📌 페이지네이션 UI */}
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

        {/* 🔢 총 개수 안내 */}
        <footer className="faq-footer">
          <small>
            {filteredFaqs.length === 0
              ? "0"
              : `${(currentPage - 1) * itemsPerPage + 1}-${Math.min(
                  currentPage * itemsPerPage,
                  filteredFaqs.length
                )}`}{" "}
            / 총 {faqList.length}건의 자주 묻는 질문
          </small>
        </footer>
      </main>
    </>
  );
}
