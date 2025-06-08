import React from 'react';

export default function AdminHeader() {
  return (
    <header className="admin-header">
      <div className="admin-header-container">
        <h1 className="admin-header-title">KMS 관리자 대시보드</h1>
        <div className="admin-header-actions">
          <div className="admin-badge">관</div>
          <button className="admin-logout-btn">
            로그아웃
          </button>
        </div>
      </div>
    </header>
  );
}