import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../../utils/axiosInstance';
import '../../styles/auth/AdminRegisterPage.css';

function AdminRegisterPage() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    adminKey: '',
  });

  const navigate = useNavigate();

  // 🔹 입력 값 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 🔹 회원가입 제출 처리
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, password, adminKey } = formData;

    if (!username || !password || !adminKey) {
      alert('모든 항목을 입력해주세요.');
      return;
    }

    try {
      await axios.post('/auth/register', {
        username,
        password,
        admin_key: adminKey,
      });

      alert('회원가입이 완료되었습니다.');
      navigate('/admin-login');
    } catch (error) {
      console.error('회원가입 오류:', error);
      alert('회원가입 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="admin-register-container">
      <div className="admin-register-tabs">
        <Link to="/register" className="tab">사용자 회원가입</Link>
        <button className="active">관리자 회원가입</button>
        <Link to="/employee-register" className="tab">사원 회원가입</Link>
      </div>

      <h2>관리자 회원가입</h2>

      <form className="admin-register-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="아이디를 입력하세요"
          value={formData.username}
          onChange={handleChange}
          required
        />

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
          name="adminKey"
          placeholder="관리자 키를 입력하세요"
          value={formData.adminKey}
          onChange={handleChange}
          required
        />

        <button type="submit" className="admin-register-button">
          관리자 회원가입
        </button>
      </form>

      <div className="admin-auth-links">
        이미 계정이 있으신가요? <Link to="/admin-login">관리자 로그인</Link>
      </div>
    </div>
  );
}

export default AdminRegisterPage;
