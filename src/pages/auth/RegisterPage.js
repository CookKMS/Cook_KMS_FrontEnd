// src/pages/auth/RegisterPage.js

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../styles/auth/RegisterPage.css';
import axios from 'axios';

function UserRegisterPage() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
  });

  const [isChecking, setIsChecking] = useState(false);
  const navigate = useNavigate();

  // 입력값 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 아이디 중복 확인
  const handleCheckDuplicate = async () => {
    if (!formData.username) {
      alert('아이디를 입력해주세요.');
      return;
    }

    try {
      setIsChecking(true);
      const res = await axios.post('http://<EC2-IP>:5000/api/auth/check-duplicate', {
        username: formData.username,
      });

      if (res.data.exists) {
        alert('이미 사용 중인 아이디입니다.');
      } else {
        alert('사용 가능한 아이디입니다.');
      }
    } catch (error) {
      console.error('중복 확인 실패:', error);
      alert('중복 확인 중 오류가 발생했습니다.');
    } finally {
      setIsChecking(false);
    }
  };

  // 회원가입 제출 처리
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
      const res = await axios.post('http://<EC2-IP>:5000/api/auth/register', {
        username,
        password,
        role: 'user',
      });

      if (res.status === 200) {
        alert(res.data.message || '회원가입이 완료되었습니다.');
        navigate('/login');
      }
    } catch (error) {
      console.error('회원가입 실패:', error);
      if (error.response?.status === 400) {
        alert('필수 항목 누락 또는 중복된 아이디입니다.');
      } else {
        alert('회원가입 중 서버 오류가 발생했습니다.');
      }
    }
  };

  return (
    <div className="register-container">
      <div className="register-tabs">
        <button className="active">사용자 회원가입</button>
        <Link to="/admin-register" className="tab">관리자 회원가입</Link>
        <Link to="/employee-register" className="tab">사원 회원가입</Link>
      </div>

      <h2>사용자 회원가입</h2>

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
            disabled={isChecking}
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

      <div className="auth-links">
        이미 계정이 있으신가요? <Link to="/login">사용자 로그인</Link>
      </div>
    </div>
  );
}

export default UserRegisterPage;
