import React from 'react';
import Header from '../components/Header'; // ✅ 추가
import '../styles/FAQPage.css';

function FAQPage() {
  return (
    <>
      <Header /> {/* ✅ 헤더 연결 */}
      <div className="faq-page">
        <h2 className="faq-title">자주 묻는 질문</h2>
        <div className="faq-bottom">
        </div>
      </div>
    </>
  );
}

export default FAQPage;
