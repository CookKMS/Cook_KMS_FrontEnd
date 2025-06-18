import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../styles/auth/LoginPage.css';

function UserLoginPage() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('사용자 로그인 시도:', formData);
    // TODO: 사용자 로그인 API 연동
    // 성공 시: navigate('/')
  };

  return (
    <div className="login-container">
      <div className="login-tabs">
        <button className="active">사용자 로그인</button>
        <Link to="/admin-login" className="tab">관리자 로그인</Link>
      </div>

      <h2>사용자 로그인</h2>
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

      <div className="auth-links">
        계정이 없으신가요? <Link to="/register">회원가입</Link>
      </div>
    </div>
  );
}

export default UserLoginPage;
