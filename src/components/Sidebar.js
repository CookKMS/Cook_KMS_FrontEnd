import React from 'react';
import './Sidebar.css';

function Sidebar() {
  const categories = [
    '전체보기',
    '계정 관리',
    '결제/환불',
    '시스템 사용법',
    '오류 해결',
    '기타 문의',
  ];

  return (
    <div className="sidebar">
      <h2 className="sidebar-title">
        <i className="fas fa-list-alt icon-blue"></i> 카테고리
      </h2>
      <ul className="sidebar-list">
        {categories.map((cat, index) => (
          <li key={index}>
            <a href="#" className="sidebar-link">
              <span className="sidebar-icon">
                <i className="fas fa-chevron-right"></i>
              </span>
              {cat}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Sidebar;
