import React from 'react';
import '../styles/Header.css';

function Header() {
  return (
    <header className="main-header">
      <div className="left-section">
        <div className="menu-icon">☰</div>
        <div className="logo">Plipop</div>
        <nav className="nav-menu">
          <a href="#">SHOP</a>
          <a href="#">REVIEW</a>
          <a href="#" className="active">COMMUNITY</a>
          <a href="#">ABOUT</a>
        </nav>
      </div>

      <div className="right-section">
        <a href="#">MYPAGE</a>
        <span>|</span>
        <div className="profile">
          <span className="user">PLIPOP</span>
          <span className="badge">42</span>
        </div>
      </div>
    </header>
  );
}

export default Header;
