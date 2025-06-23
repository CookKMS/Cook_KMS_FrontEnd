// src/pages/auth/RegisterPage.js

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../styles/auth/RegisterPage.css';

function UserRegisterPage() {
  // 🔹 사용자 회원가입 입력 상태
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
  });

  const navigate = useNavigate();

  // 🔹 입력값 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 🔹 아이디 중복 확인 요청 (Flask 연동 시 사용)
  const handleCheckDuplicate = async () => {
    if (!formData.username) {
      alert('아이디를 입력해주세요.');
      return;
    }

    try {
      // ✅ Flask 중복 확인 API: POST /api/auth/check-duplicate
      const res = await fetch('http://localhost:5000/api/auth/check-duplicate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: formData.username }),
      });

      const result = await res.json();
      if (result.exists) {
        alert('이미 사용 중인 아이디입니다.');
      } else {
        alert('사용 가능한 아이디입니다.');
      }
    } catch (error) {
      console.error('중복 확인 실패:', error);
      alert('중복 확인 요청 중 오류가 발생했습니다.');
    }
  };

  // 🔹 회원가입 제출 처리 (Flask 연동 포함)
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { username, password, confirmPassword } = formData;

    if (!username || !password || !confirmPassword) {
      alert('모든 항목을 입력해주세요.');
      return;
    }

    if (password !== confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      // ✅ Flask 사용자 회원가입 API 요청
      const res = await fetch('http://localhost:5000/api/auth/user-register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) throw new Error('회원가입 실패');

      alert('회원가입이 완료되었습니다. 로그인해주세요.');
      navigate('/login');
    } catch (error) {
      console.error('회원가입 실패:', error);
      alert('회원가입 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="register-container">
      {/* 🔹 탭 전환 UI */}
      <div className="register-tabs">
        <button className="active">사용자 회원가입</button>
        <Link to="/admin-register" className="tab">관리자 회원가입</Link>
        <Link to="/employee-register" className="tab">사원 회원가입</Link>
      </div>

      <h2>사용자 회원가입</h2>

      {/* 🔹 회원가입 입력 폼 */}
      <form className="register-form" onSubmit={handleSubmit}>
        <div className="input-group">
          <input
            type="text"
            name="username"
            placeholder="아이디를 입력하세요"
            value={formData.username}
            onChange={handleChange}
            required
          />
          <button
            type="button"
            className="check-button"
            onClick={handleCheckDuplicate}
          >
            중복확인
          </button>
        </div>

        <input
          type="password"
          name="password"
          placeholder="비밀번호를 입력하세요"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="confirmPassword"
          placeholder="비밀번호를 다시 입력하세요"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />

        <button type="submit" className="register-button">회원가입</button>
      </form>

      {/* 🔹 로그인 링크 */}
      <div className="auth-links">
        이미 계정이 있으신가요? <Link to="/login">사용자 로그인</Link>
      </div>
    </div>
  );
}

export default UserRegisterPage;
