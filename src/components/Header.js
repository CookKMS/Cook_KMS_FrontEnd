import React from 'react';
import './Header.css';

function Header({ setCurrentPage }) {
  return (
    <header className="header">
      <div className="header-container">
        <div className="header-left">
          <i className="fas fa-book-open logo-icon"></i>
          <h1 className="header-title">Knowledge Base</h1>
        </div>
        <div className="header-right">
          <button onClick={() => setCurrentPage('inquiryForm')} className="inquiry-button">
            <i className="fas fa-question-circle"></i>
            문의하기
          </button>
          <div className="profile-menu">
            <img
              src="https://via.placeholder.com/40"
              alt="Profile"
              className="profile-image"
            />
            {/* 드롭다운은 추후 구현 */}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
