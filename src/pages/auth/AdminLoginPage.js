// src/pages/auth/AdminLoginPage.js

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../styles/auth/AdminLoginPage.css';

function AdminLoginPage() {
  // 🔹 관리자 로그인 입력값 상태 관리
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    adminKey: '', // 관리자 전용 인증 키
  });

  // 🔹 페이지 이동용 Hook (로그인 성공 시 사용)
  const navigate = useNavigate();

  // 🔹 입력값 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 🔹 로그인 요청 핸들러 (백엔드 연동 포함)
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { username, password, adminKey } = formData;

    // 🔸 클라이언트 측 유효성 검사
    if (!username || !password || !adminKey) {
      alert('모든 항목을 입력해주세요.');
      return;
    }

    try {
      // ✅ Flask 백엔드 로그인 API 호출
      const res = await fetch('http://localhost:5000/api/auth/admin-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // request.json 사용 가능하도록
        },
        body: JSON.stringify({
          username,
          password,
          admin_key: adminKey, // 백엔드에서는 admin_key 필드로 받음
        }),
      });

      if (!res.ok) {
        throw new Error('로그인 실패');
      }

      const result = await res.json();

      // ✅ JWT 토큰 등 로그인 후 처리 (옵션)
      // localStorage.setItem('token', result.token);

      // ✅ 로그인 성공 후 관리자 대시보드로 이동
      navigate('/admin-dashboard');
    } catch (error) {
      console.error('로그인 오류:', error);
      alert('로그인에 실패했습니다. 아이디, 비밀번호, 관리자 키를 다시 확인해주세요.');
    }
  };

  return (
    <div className="admin-login-container">
      {/* 🔹 로그인 탭 전환 UI */}
      <div className="admin-login-tabs">
        <Link to="/login" className="tab">사용자 로그인</Link>
        <button className="active">관리자 로그인</button>
        <Link to="/employee-login" className="tab">사원 로그인</Link>
      </div>

      <h2>관리자 로그인</h2>

      {/* 🔹 로그인 폼 */}
      <form className="admin-login-form" onSubmit={handleSubmit}>
        <label htmlFor="username">아이디</label>
        <input
          type="text"
          id="username"
          name="username"
          placeholder="관리자 아이디를 입력하세요"
          value={formData.username}
          onChange={handleChange}
          required
        />

        <label htmlFor="password">비밀번호</label>
        <input
          type="password"
          id="password"
          name="password"
          placeholder="관리자 비밀번호를 입력하세요"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <label htmlFor="adminKey">관리자 키</label>
        <input
          type="password"
          id="adminKey"
          name="adminKey"
          placeholder="관리자 키를 입력하세요"
          value={formData.adminKey}
          onChange={handleChange}
          required
        />

        <button type="submit" className="admin-login-button">
          관리자 로그인
        </button>
      </form>

      {/* 🔹 회원가입 이동 링크 */}
      <div className="admin-auth-links">
        계정이 없으신가요? <Link to="/admin-register">관리자 회원가입</Link>
      </div>
    </div>
  );
}

export default AdminLoginPage;
