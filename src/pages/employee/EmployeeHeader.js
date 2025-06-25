// src/components/EmployeeHeader.js

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../../styles/Header.css'; // 기존 스타일 재활용

function EmployeeHeader() {
  const location = useLocation();

  const menuItems = [
    { path: '/employee-Home', label: 'Home' },
    { path: '/employee-knowledge', label: '지식관리' },
    { path: '/employee-Inquiry', label: '제조사 문의' },
    { path: '/employee-faq', label: 'FAQ' },
    { path: '/employee-mypage', label: 'Mypage' },
  ];

  return (
    <header className="main-header">
      <div className="left-section">
        <div className="logo">사원 포털</div>
        <nav className="nav-menu">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="right-section">
        <Link to="/employee-login" className={`nav-link ${location.pathname === '/employee-login' ? 'active' : ''}`}>
          로그아웃
        </Link>
      </div>
    </header>
  );
}

export default EmployeeHeader;
