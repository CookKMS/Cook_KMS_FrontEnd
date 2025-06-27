// src/pages/auth/AdminLoginPage.js

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../../utils/axiosInstance'; // ✅ axiosInstance import
import '../../styles/auth/AdminLoginPage.css';

function AdminLoginPage() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, password } = formData;

    if (!username || !password) {
      alert('아이디와 비밀번호를 입력해주세요.');
      return;
    }

    try {
      // ✅ 관리자 로그인 요청 (role 없이)
      const res = await axios.post('/auth/login', { username, password });

      const { access_token } = res.data;
      localStorage.setItem('token', access_token);
      navigate('/admin');
    } catch (err) {
      if (err.response?.status === 401) {
        alert('로그인 실패: 아이디 또는 비밀번호를 확인해주세요.');
      } else {
        alert('로그인 중 오류가 발생했습니다.');
        console.error('로그인 오류:', err);
      }
    }
  };

  return (
    <div className="admin-login-container">
      {/* 🔹 탭 전환 UI */}
      <Link to="/" className="home-link">
        <h1>Home</h1>
      </Link>

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
          placeholder="비밀번호를 입력하세요"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <button type="submit" className="admin-login-button">
          관리자 로그인
        </button>
      </form>

      {/* 🔹 회원가입 링크 */}
      <div className="admin-auth-links">
        계정이 없으신가요? <Link to="/admin-register">관리자 회원가입</Link>
      </div>
    </div>
  );
}

export default AdminLoginPage;
