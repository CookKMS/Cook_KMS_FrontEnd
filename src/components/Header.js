import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/Header.css';

function Header() {
  const location = useLocation();

  const menuItems = [
    { path: '/', label: 'Home' },
    { path: '/Knowledge', label: '지식관리' },
    { path: '/my-inquiries', label: '제조사 문의' },
    { path: '/faq', label: 'FAQ' },
  ];

  return (
    <header className="main-header">
      <div className="left-section">
        <div className="menu-icon">☰</div>
        <div className="logo">지식관리</div>
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

      <div className="right-section">
        <Link to="/login" className={`nav-link ${location.pathname === '/login' ? 'active' : ''}`}>로그인</Link>
      </div>
    </header>
  );
}

export default Header;
