import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import "../styles/FAQPage.css";

const categories = [
  "전체",
  "새 기능",
  "수정",
  "버그",
  "문의",
  "장애",
  "긴급 지원",
];

export default function FAQpage() {
  const [faqData, setFaqData] = useState([]); // FAQ 목록 데이터 상태 관리
  const [searchTerm, setSearchTerm] = useState(""); // 검색어 상태
  const [selectedCategory, setSelectedCategory] = useState("전체"); // 선택된 카테고리 상태
  const [expandedIndex, setExpandedIndex] = useState(null); // 현재 열려있는 FAQ 항목 인덱스

  /**
   * TODO: 백엔드 Flask API 연동 부분
   * 컴포넌트 마운트 시 실행되어 서버에서 FAQ 목록을 가져옴
   * - API 엔드포인트: GET /api/faqs (예상)
   * - 응답 데이터는 FAQ 리스트 형태 (id, category, question, answer)
   * - answer는 텍스트 또는 HTML 문자열로 전달 가능
   */
  useEffect(() => {
    async function fetchFaqs() {
      try {
        // 실제 API 호출 예시:
        // const res = await fetch("/api/faqs");
        // const data = await res.json();
        // setFaqData(data);

        // 현재는 프론트 개발 및 테스트용 더미 데이터 설정
        setFaqData([
          {
            id: 1,
            category: "전체",
            question: "비밀번호를 재설정하는 방법은 무엇인가요?",
            answer: (
              <>
                <p>비밀번호 재설정을 위해서는:</p>
                <ol>
                  <li>로그인 페이지에서 '비밀번호 찾기' 링크를 클릭하세요.</li>
                  <li>가입 시 사용한 이메일 주소를 입력하세요.</li>
                  <li>이메일로 전송된 링크를 통해 새 비밀번호를 설정할 수 있습니다.</li>
                  <li>비밀번호는 최소 8자 이상, 영문 대소문자, 숫자, 특수문자를 포함해야 합니다.</li>
                </ol>
                <p>문제가 지속될 경우 고객센터로 문의해 주세요.</p>
              </>
            ),
          },
          {
            id: 2,
            category: "전체",
            question: "영업시간은 어떻게 되나요?",
            answer: "영업시간은 평일 오전 9시부터 오후 6시까지입니다.",
          },
          // 필요시 더 많은 FAQ 항목 추가
        ]);
      } catch (error) {
        console.error("FAQ 데이터 불러오기 실패:", error);
      }
    }
    fetchFaqs();
  }, []);

  /**
   * FAQ 데이터 필터링 처리
   * - 선택된 카테고리와 일치하거나 전체("전체")인 경우만 필터링
   * - 검색어가 질문 또는 답변에 포함된 경우만 필터링
   */
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

  // FAQ 질문 항목 토글 열기/닫기 처리 함수
  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <>
      <Header /> {/* 페이지 상단 헤더 */}
      <main className="container faq-page">
        <h1>자주 묻는 질문 (FAQ)</h1>

        {/* 검색 입력 필드 */}
        <input
          type="search"
          aria-label="검색어 입력"
          placeholder="검색어를 입력하세요"
          className="faq-search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* 카테고리 필터 버튼 그룹 */}
        <nav className="faq-categories" role="list">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`faq-category-btn ${
                selectedCategory === cat ? "active" : ""
              }`}
              onClick={() => setSelectedCategory(cat)}
              role="listitem"
            >
              {cat}
            </button>
          ))}
        </nav>

        {/* FAQ 리스트 영역 */}
        <section aria-label="FAQ 목록" className="faq-list">
          {filteredFaqs.length === 0 ? (
            <p className="no-results">조회되는 FAQ가 없습니다.</p>
          ) : (
            filteredFaqs.map((faq, idx) => (
              <article
                key={faq.id}
                className={`faq-item ${expandedIndex === idx ? "expanded" : ""}`}
              >
                {/* 질문 버튼 */}
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

                {/* 답변 영역: 열려있을 때만 표시 */}
                {expandedIndex === idx && (
                  <div
                    id={`faq-answer-${idx}`}
                    className="faq-answer"
                    role="region"
                    aria-labelledby={`faq-question-${idx}`}
                  >
                    {/* 답변이 문자열인지 React 노드인지에 따라 렌더링 분기 */}
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

        {/* 하단 FAQ 개수 표시 */}
        <footer className="faq-footer">
          <small>
            1-{filteredFaqs.length} / 총 {faqData.length}건의 자주 묻는 질문
          </small>
        </footer>
      </main>
    </>
  );
}
