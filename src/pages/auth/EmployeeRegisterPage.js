// src/pages/auth/EmployeeRegisterPage.js

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../styles/auth/EmployeeRegisterPage.css';

function EmployeeRegisterPage() {
  // 🔹 사원 회원가입 입력값 상태 관리
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    employeeCode: '', // 사원 인증 코드
  });

  const [isChecking, setIsChecking] = useState(false); // 아이디 중복 확인 요청 중 여부
  const navigate = useNavigate();

  // 🔹 입력값 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 🔹 아이디 중복 확인 요청 (Flask API 사용)
  const handleCheckDuplicate = async () => {
    if (!formData.username) {
      alert('아이디를 입력해주세요.');
      return;
    }

    try {
      setIsChecking(true);

      // ✅ 중복 확인 요청: POST /api/auth/check-duplicate
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
      alert('중복 확인 중 오류가 발생했습니다.');
    } finally {
      setIsChecking(false);
    }
  };

  // 🔹 회원가입 제출 핸들러 (Flask 연동 포함)
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { username, password, confirmPassword, employeeCode } = formData;

    // 🔸 클라이언트 측 유효성 검사
    if (!username || !password || !confirmPassword || !employeeCode) {
      alert('모든 항목을 입력해주세요.');
      return;
    }

    if (password !== confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      // ✅ 사원 회원가입 요청: POST /api/auth/employee-register
      const res = await fetch('http://localhost:5000/api/auth/employee-register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          password,
          employee_code: employeeCode, // 백엔드에서 employee_code로 받음
        }),
      });

      if (!res.ok) throw new Error('회원가입 실패');

      alert('회원가입이 완료되었습니다. 로그인해주세요.');
      navigate('/employee-login');

    } catch (error) {
      console.error('회원가입 실패:', error);
      alert('회원가입 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="employee-register-container">
      {/* 🔹 탭 전환 UI */}
      <div className="employee-register-tabs">
        <Link to="/register" className="tab">사용자 회원가입</Link>
        <Link to="/admin-register" className="tab">관리자 회원가입</Link>
        <button className="active">사원 회원가입</button>
      </div>

      <h2>사원 회원가입</h2>

      {/* 🔹 사원 회원가입 입력 폼 */}
      <form className="employee-register-form" onSubmit={handleSubmit}>
        {/* 아이디 + 중복 확인 */}
        <div className="input-group">
          <input
            type="text"
            name="username"
            placeholder="사번 또는 아이디를 입력하세요"
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

        <input
          type="text"
          name="employeeCode"
          placeholder="사내 인증 코드를 입력하세요"
          value={formData.employeeCode}
          onChange={handleChange}
          required
        />

        <button type="submit" className="employee-register-button">
          사원 회원가입
        </button>
      </form>

      {/* 🔹 로그인 페이지 이동 링크 */}
      <div className="employee-auth-links">
        이미 계정이 있으신가요? <Link to="/employee-login">사원 로그인</Link>
      </div>
    </div>
  );
}

export default EmployeeRegisterPage;
