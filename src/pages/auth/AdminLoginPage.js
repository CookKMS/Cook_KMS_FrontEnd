// src/pages/auth/AdminLoginPage.js

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../styles/auth/AdminLoginPage.css';

function AdminLoginPage() {
  // 🔹 관리자 로그인에 필요한 세 가지 입력값 상태 관리
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    adminKey: '',
  });

  // 🔹 로그인 성공 시 페이지 이동 처리용
  const navigate = useNavigate();

  // 🔹 입력 필드 변경 시 상태 업데이트
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 🔹 로그인 폼 제출 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { username, password, adminKey } = formData;

    // ✅ 유효성 검사: 모든 항목 입력되었는지 확인
    if (!username || !password || !adminKey) {
      alert('모든 항목을 입력해주세요.');
      return;
    }

    try {
      // 🔹 Flask 백엔드로 로그인 요청 전송 (POST)
      const res = await fetch('http://localhost:5000/api/auth/admin-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Flask에서 request.json 사용 시
        },
        body: JSON.stringify({ username, password, admin_key: adminKey }),
      });

      if (!res.ok) {
        throw new Error('로그인 실패');
      }

      const result = await res.json();

      // 🔹 JWT 토큰 등 필요한 데이터 저장 (옵션)
      // localStorage.setItem('token', result.token);

      // 🔹 로그인 성공 후 관리자 대시보드 등으로 이동
      navigate('/admin-dashboard');

    } catch (error) {
      console.error('로그인 오류:', error);
      alert('로그인에 실패했습니다. 아이디, 비밀번호, 관리자 키를 다시 확인해주세요.');
    }
  };

  return (
    <div className="admin-login-container">
      {/* 사용자/관리자 탭 전환 UI */}
      <div className="admin-login-tabs">
  <Link to="/login" className="tab">사용자 로그인</Link>
  <button className="active">관리자 로그인</button>
  <Link to="/employee-login" className="tab">사원 로그인</Link>
</div>


      <h2>관리자 로그인</h2>

      {/* 🔹 관리자 로그인 입력 폼 */}
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

        {/* 🔹 로그인 버튼 */}
        <button type="submit" className="admin-login-button">
          관리자 로그인
        </button>
      </form>

      {/* 🔹 회원가입 페이지로 이동 링크 */}
      <div className="admin-auth-links">
        계정이 없으신가요? <Link to="/admin-register">관리자 회원가입</Link>
      </div>
    </div>
  );
}

export default AdminLoginPage;
