import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../styles/auth/RegisterPage.css';

function UserRegisterPage() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckDuplicate = () => {
    // TODO: 서버에 아이디 중복 체크 요청
    alert(`아이디 "${formData.username}" 중복 확인 요청`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }
    console.log('사용자 회원가입 정보:', formData);
    // TODO: 회원가입 API 연동
    // 성공 시: navigate('/login')
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
          <button type="button" className="check-button" onClick={handleCheckDuplicate}>중복확인</button>
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