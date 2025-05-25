import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/RegisterPage.css';

function RegisterPage() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
    name: '',
    birth: '',
    phone: '',
    isKorean: true,
    gender: '',
    terms: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }
    if (!formData.terms) {
      alert('약관에 동의해주세요.');
      return;
    }
    console.log('✅ 회원가입 정보:', formData);
    // TODO: 회원가입 API 연동
  };

  return (
    <div className="register-container">
      <Link to="/" className="text-logo">지식관리</Link>

      <form className="register-form" onSubmit={handleSubmit}>
        <input type="text" name="username" placeholder="아이디" value={formData.username} onChange={handleChange} required />
        <input type="password" name="password" placeholder="비밀번호" value={formData.password} onChange={handleChange} required />
        <input type="password" name="confirmPassword" placeholder="비밀번호 확인" value={formData.confirmPassword} onChange={handleChange} required />
        <input type="email" name="email" placeholder="이메일 (선택)" value={formData.email} onChange={handleChange} />
        <input type="text" name="name" placeholder="이름" value={formData.name} onChange={handleChange} required />
        <input type="text" name="birth" placeholder="생년월일 8자리 (예: 19990101)" value={formData.birth} onChange={handleChange} required />

        <div className="radio-group">
          <label><input type="radio" name="gender" value="male" onChange={handleChange} /> 남자</label>
          <label><input type="radio" name="gender" value="female" onChange={handleChange} /> 여자</label>
        </div>

        <div className="radio-group">
          <label><input type="radio" name="isKorean" value="true" checked={formData.isKorean === true || formData.isKorean === 'true'} onChange={handleChange} /> 내국인</label>
          <label><input type="radio" name="isKorean" value="false" checked={formData.isKorean === false || formData.isKorean === 'false'} onChange={handleChange} /> 외국인</label>
        </div>

        <input type="text" name="phone" placeholder="휴대전화번호" value={formData.phone} onChange={handleChange} required />

        <div className="register-options">
          <label>
            <input type="checkbox" name="terms" checked={formData.terms} onChange={handleChange} /> 인증 약관 전체동의
          </label>
        </div>

        <button type="submit" className="register-button">인증요청</button>
      </form>
    </div>
  );
}

export default RegisterPage;