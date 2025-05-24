import React from 'react';
import Header from '../components/Header'; // ✅ 추가
import TabMenu from '../components/TabMenu';
import FAQTable from '../components/FAQTable';
import SearchBar from '../components/SearchBar';
import '../styles/FAQPage.css';

function FAQPage() {
  return (
    <>
      <Header /> {/* ✅ 헤더 연결 */}
      <div className="faq-page">
        <h2 className="faq-title">자주 묻는 질문</h2>
        <TabMenu />
        <FAQTable />
        <div className="faq-bottom">
          <SearchBar />
          <button className="write-button">글쓰기</button>
        </div>
      </div>
    </>
  );
}

export default FAQPage;
