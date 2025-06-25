import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/Header.css';

function Header() {
  const location = useLocation();

  // ✅ 메뉴 항목 정의 (path, label)
  const menuItems = [
    { path: '/', label: 'Home' },
    { path: '/Knowledge', label: '지식관리' },
    { path: '/my-inquiries', label: '제조사 문의' },
    { path: '/faq', label: 'FAQ' },
    { path: '/mypage', label: 'MyPage' }, // ✅ 사용자 전용 마이페이지
  ];

  return (
    <header className="main-header">
      <div className="left-section">
        <div className="logo">지식관리</div>

        {/* ✅ 상단 메뉴 */}
        <nav className="nav-menu">
          {menuItems.map(item => (
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

      {/* ✅ 로그인 링크 (사용자 구분 없이 단일 처리) */}
      <div className="right-section">
        <Link
          to="/login"
          className={`nav-link ${location.pathname === '/login' ? 'active' : ''}`}
        >
          로그인
        </Link>
      </div>
    </header>
  );
}

export default Header;
