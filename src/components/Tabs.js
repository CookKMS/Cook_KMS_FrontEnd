import React from 'react';
import './Tabs.css';

function Tabs({ currentPage, setCurrentPage }) {
  return (
    <div className="tabs">
      <button
        className={`tab-btn ${currentPage === 'main' ? 'tab-active' : ''}`}
        onClick={() => setCurrentPage('main')}
      >
        메인
      </button>
      <button
        className={`tab-btn ${currentPage === 'inquiryList' ? 'tab-active' : ''}`}
        onClick={() => setCurrentPage('inquiryList')}
      >
        내 문의 내역
      </button>
    </div>
  );
}

export default Tabs;
