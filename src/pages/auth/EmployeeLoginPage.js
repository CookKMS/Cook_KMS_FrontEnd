// src/pages/auth/EmployeeLoginPage.js

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../styles/auth/EmployeeLoginPage.css';

function EmployeeLoginPage() {
  // 🔹 로그인 입력값 상태 관리
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  // 🔹 로그인 성공 시 페이지 이동 처리
  const navigate = useNavigate();

  // 🔹 입력 필드 변경 시 상태 업데이트
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 🔹 로그인 폼 제출 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { username, password } = formData;

    // 🔸 클라이언트 유효성 검사
    if (!username || !password) {
      alert('아이디와 비밀번호를 모두 입력해주세요.');
      return;
    }

    try {
      // ✅ Flask 백엔드 로그인 API 요청
      const res = await fetch('http://localhost:5000/api/auth/employee-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }, // Flask request.json 사용 가능
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) throw new Error('로그인 실패');

      const result = await res.json();

      // ✅ JWT 토큰 저장 등 추가 처리 가능
      // localStorage.setItem('employee_token', result.token);

      // ✅ 로그인 성공 시 사내 포털 또는 대시보드로 이동
      navigate('/employee-dashboard');

    } catch (error) {
      console.error('로그인 실패:', error);
      alert('로그인에 실패했습니다. 아이디 또는 비밀번호를 확인해주세요.');
    }
  };

  return (
    <div className="employee-login-container">
      {/* 🔹 로그인 유형 탭 */}
      <div className="employee-login-tabs">
        <Link to="/login" className="tab">사용자 로그인</Link>
        <Link to="/admin-login" className="tab">관리자 로그인</Link>
        <button className="active">사원 로그인</button>
      </div>

      <h2>사원 로그인</h2>

      {/* 🔹 로그인 입력 폼 */}
      <form className="employee-login-form" onSubmit={handleSubmit}>
        <label htmlFor="username">아이디</label>
        <input
          type="text"
          id="username"
          name="username"
          placeholder="사번 또는 아이디를 입력하세요"
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

        <button type="submit" className="employee-login-button">
          로그인
        </button>
      </form>

      {/* 🔹 회원가입 링크 */}
      <div className="employee-auth-links">
        계정이 없으신가요? <Link to="/employee-register">사원 회원가입</Link>
      </div>
    </div>
  );
}

export default EmployeeLoginPage;
