// src/pages/auth/AdminLoginPage.js

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../styles/auth/AdminLoginPage.css';

function AdminLoginPage() {
  // 🔹 입력값 상태 관리
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  // 🔹 페이지 이동을 위한 훅
  const navigate = useNavigate();

  // 🔹 입력 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 🔹 로그인 제출 처리
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, password } = formData;

    if (!username || !password) {
      alert('아이디와 비밀번호를 입력해주세요.');
      return;
    }

    try {
      // ✅ 관리자 로그인 요청 (role 없이)
      const res = await fetch('http://<EC2-IP>:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }), // ❗ role 제거됨
      });

      if (!res.ok) {
        if (res.status === 401) {
          alert('로그인 실패: 아이디 또는 비밀번호를 확인해주세요.');
          return;
        }
        throw new Error('서버 오류');
      }

      const { access_token } = await res.json();

      // ✅ 토큰 저장
      localStorage.setItem('token', access_token);

      // ✅ 관리자 대시보드로 이동
      navigate('/admin');
    } catch (error) {
      console.error('로그인 오류:', error);
      alert('로그인 중 오류가 발생했습니다.');
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
        {/* 아이디 입력 */}
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

        {/* 비밀번호 입력 */}
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

        {/* 로그인 버튼 */}
        <button type="submit" className="admin-login-button">
          관리자 로그인
        </button>
      </form>

      {/* 회원가입 링크 */}
      <div className="admin-auth-links">
        계정이 없으신가요? <Link to="/admin-register">관리자 회원가입</Link>
      </div>
    </div>
  );
}

export default AdminLoginPage;
