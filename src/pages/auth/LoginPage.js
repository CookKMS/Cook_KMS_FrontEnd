import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../styles/auth/LoginPage.css';
import axios from '../../utils/axiosInstance'; // ✅ axiosInstance 사용

function UserLoginPage() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const navigate = useNavigate();

  // 🔹 입력 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 🔹 로그인 제출 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, password } = formData;

    if (!username || !password) {
      alert('아이디와 비밀번호를 입력해주세요.');
      return;
    }

    
    try {
      // ✅ 사용자 로그인 API 요청
      const res = await axios.post('/auth/login', { username, password });

      const { access_token } = res.data;

      // ✅ JWT 토큰 저장
      localStorage.setItem('token', access_token);

      // ✅ 로그인 성공 시 홈으로 이동
      navigate('/');
    } catch (error) {
      if (error.response?.status === 400) {
        alert('아이디 또는 비밀번호가 누락되었습니다.');
      } else if (error.response?.status === 401) {
        alert('로그인 실패: 아이디 또는 비밀번호를 확인해주세요.');
      } else {
        alert('서버 오류가 발생했습니다.');
      }
    }
  };

  
  return (
    <div className="login-container">
      <Link to="/" className="home-link">
        <h1>Home</h1>
      </Link>

      <div className="login-tabs">
        <button className="active">사용자 로그인</button>
        <Link to="/admin-login" className="tab">관리자 로그인</Link>
        <Link to="/employee-login" className="tab">사원 로그인</Link>
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
        계정이 없으신가요? <Link to="/register">사용자 회원가입</Link>
      </div>
    </div>
  );
}

export default UserLoginPage;
