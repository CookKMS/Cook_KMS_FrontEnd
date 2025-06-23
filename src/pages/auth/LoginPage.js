// src/pages/auth/LoginPage.js

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../styles/auth/LoginPage.css';

function UserLoginPage() {
  // 🔹 로그인 입력 상태 관리
  const [formData, setFormData] = useState({ username: '', password: '' });
  const navigate = useNavigate();

  // 🔹 입력 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 🔹 로그인 제출 핸들러 (Flask 연동 예정)
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { username, password } = formData;

    if (!username || !password) {
      alert('아이디와 비밀번호를 입력해주세요.');
      return;
    }

    try {
      // ✅ Flask 사용자 로그인 API 요청
      const res = await fetch('http://localhost:5000/api/auth/user-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) throw new Error('로그인 실패');

      const result = await res.json();

      // ✅ JWT 저장 등 인증 처리
      // localStorage.setItem('user_token', result.token);

      // ✅ 로그인 성공 시 메인 페이지로 이동
      navigate('/');
    } catch (error) {
      console.error('로그인 실패:', error);
      alert('로그인에 실패했습니다. 아이디 또는 비밀번호를 확인해주세요.');
    }
  };

  return (
    <div className="login-container">
      {/* 🔹 로그인 유형 탭 */}
      <div className="login-tabs">
        <button className="active">사용자 로그인</button>
        <Link to="/admin-login" className="tab">관리자 로그인</Link>
        <Link to="/employee-login" className="tab">사원 로그인</Link>
      </div>

      <h2>사용자 로그인</h2>

      {/* 🔹 로그인 입력 폼 */}
      <form className="auth-form" onSubmit={handleSubmit}>
        <label htmlFor="username">아이디</label>
        <input
          type="text"
          id="username"
          name="username"
          placeholder="아이디를 입력하세요"
          value={formData.username}
          onChange={handleChange}
          required
        />

        <label htmlFor="password">비밀번호</label>
        <input
          type="password"
          id="password"
          name="password"
          placeholder="비밀번호를 입력하세요"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <button type="submit" className="login-button">로그인</button>
      </form>

      {/* 🔹 회원가입 링크 */}
      <div className="auth-links">
        계정이 없으신가요? <Link to="/register">사용자 회원가입</Link>
      </div>
    </div>
  );
}

export default UserLoginPage;
